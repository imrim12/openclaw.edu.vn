// SECURITY GATE (M-4): refuses to upload to production unless OPENCLAW_LEGAL_CLEARED=1.
// Republication of vbpl.vn content requires legal sign-off per spec §20.2 (unresolved).
// SECURITY GATE (H-2): token must NOT have "All zones" scope — blocks unless OPENCLAW_ALLOW_ALL_ZONES=1.
import { createHmac } from 'node:crypto'
import { appendFileSync, existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ensureDir, isRecord, makeLogger, requireEnv, sha256Hex, writeJson, writeUtf8 } from './_lib.ts'

const HERE = dirname(fileURLToPath(import.meta.url))
const BUILD_ROOT = join(HERE, '..', '..', 'build')
const STAGING_DIR = join(BUILD_ROOT, 'r2-staging')
const STATE_FILE = join(BUILD_ROOT, 'upload-state.json')
const DEAD_LETTER_FILE = join(BUILD_ROOT, 'upload-dead-letter.ndjson')
const LOG_FILE = join(BUILD_ROOT, 'upload-r2.log')

const PRODUCTION_BUCKET = 'openclaw-edu-vn-md'
const CDN_ORIGIN_HEADER = 'cdn-openclaw-edu.opencloud.com.vn'

// Pipeline-internal artefacts that live in staging but must never be uploaded to R2.
const PIPELINE_ARTEFACT_PREFIX = '.pipeline-'

const CREDENTIAL_PATTERNS: ReadonlyArray<RegExp> = [
  /Bearer\s+\S+/gi,
  /api[_-]?key[=:]\s*\S+/gi,
  /token[=:]\s*\S+/gi,
  /eyJ[A-Za-z0-9_-]{20,}/g,
]

function redactCredentials(text: string): string {
  let out = text
  for (const re of CREDENTIAL_PATTERNS) {
    out = out.replace(re, '[REDACTED]')
  }
  return out
}

// ---- Arg parsing -------------------------------------------------------

interface CliArgs {
  dryRun: boolean
  requireLegalClearance: boolean
}

function parseArgs(argv: ReadonlyArray<string>): CliArgs {
  const args = argv.slice(2)
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(`
Usage: tsx pipeline/6.upload-r2.ts [options]

Options:
  --dry-run                     Print what would upload; make no R2 requests.
  --no-require-legal-clearance  Skip the OPENCLAW_LEGAL_CLEARED gate.
                                Only for personal test buckets (not production).
  -h, --help                    Show this help.

Security:
  By default (--require-legal-clearance ON), the script refuses to upload to the
  production bucket unless OPENCLAW_LEGAL_CLEARED=1 is set. This gate implements
  the M-4 legal review requirement from the pre-impl security review.

  The token preflight verifies zone scope and BLOCKS execution if the token has
  "All zones" DNS scope, unless OPENCLAW_ALLOW_ALL_ZONES=1 is set (H-2 gate).

Env vars:
  CLOUDFLARE_ACCOUNT_ID       (required) Cloudflare account ID
  CLOUDFLARE_API_TOKEN        (required) API token — never logged
  R2_ACCESS_KEY_ID            (required) R2 S3-compat access key
  R2_SECRET_ACCESS_KEY        (required) R2 S3-compat secret — never logged
  OPENCLAW_LEGAL_CLEARED=1    Allow production bucket upload (M-4 gate)
  OPENCLAW_ALLOW_ALL_ZONES=1  Allow token with All-zones scope (H-2 override)
  R2_BUCKET_NAME              Override target bucket name
  R2_BUCKET_TEST              Personal test bucket name (bypasses prod gate)
  CRAWLER_LIMIT               Max files to upload
  UPLOAD_CONCURRENCY          Parallel uploads (default: 8)
  UPLOAD_MAX_RETRIES          Per-file retry limit (default: 3)
`)
    process.exit(0)
  }

  return {
    dryRun: args.includes('--dry-run'),
    requireLegalClearance: !args.includes('--no-require-legal-clearance'),
  }
}

// ---- Environment / auth ------------------------------------------------

interface Credentials {
  accountId: string
  apiToken: string
  accessKeyId: string
  secretAccessKey: string
}

function loadCredentials(): Credentials {
  return {
    accountId: requireEnv('CLOUDFLARE_ACCOUNT_ID'),
    apiToken: requireEnv('CLOUDFLARE_API_TOKEN'),
    accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
    secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
  }
}

function redactedTokenStatus(name: string): string {
  const val = process.env[name]
  return val ? `${name}: set` : `${name}: NOT SET`
}

// ---- Legal clearance gate (M-4) ----------------------------------------

function enforceLegalGate(targetBucket: string, requireLegalClearance: boolean, dryRun: boolean, log: (line: string) => void): void {
  const isProductionBucket = targetBucket === PRODUCTION_BUCKET
  const cleared = process.env.OPENCLAW_LEGAL_CLEARED === '1' || process.env.OPENCLAW_LEGAL_CLEARED === 'true'

  if (!requireLegalClearance) {
    log('WARNING: --no-require-legal-clearance active. Ensure this is a personal test bucket, NOT production.')
    return
  }

  if (dryRun) {
    // Dry-run lists what would upload without actually doing so — allow without clearance.
    // This is consistent with TC-033: dry-run is permitted without OPENCLAW_LEGAL_CLEARED.
    log('DRY-RUN: legal clearance gate bypassed (no actual upload will occur)')
    return
  }

  if (isProductionBucket && !cleared) {
    process.stderr.write(
      '[pipeline-6] LEGAL GATE (M-4): Upload to production bucket refused.\n'
      + `  Target bucket: ${targetBucket}\n`
      + '  Republication of vbpl.vn content requires legal review (spec §20.2).\n'
      + '  Set OPENCLAW_LEGAL_CLEARED=1 once legal review is complete.\n'
      + '  To test against a personal bucket, set R2_BUCKET_TEST=<your-bucket>\n'
      + '  and pass --no-require-legal-clearance.\n',
    )
    process.exit(1)
  }

  if (!isProductionBucket && !cleared) {
    log('NOTE: uploading to non-production bucket without OPENCLAW_LEGAL_CLEARED (allowed for test buckets)')
  }
}

// ---- Wrangler token preflight (H-2) ------------------------------------

interface TokenVerifyResult {
  hasAllZones: boolean
  zoneNames: ReadonlyArray<string>
}

async function verifyTokenScope(apiToken: string, log: (line: string) => void): Promise<TokenVerifyResult> {
  log('PREFLIGHT: verifying Cloudflare API token zone scope (H-2)...')

  let response: Response
  try {
    response = await fetch('https://api.cloudflare.com/client/v4/user/tokens/verify', {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    })
  }
  catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    log(`PREFLIGHT: token verify network error — ${redactCredentials(msg)}`)
    return { hasAllZones: false, zoneNames: [] }
  }

  if (response.status === 401) {
    process.stderr.write('[pipeline-6] PREFLIGHT: Token verification returned 401 — invalid token.\n')
    process.exit(1)
  }

  let body: unknown
  try {
    body = await response.json()
  }
  catch {
    log('PREFLIGHT: could not parse token verify response as JSON')
    return { hasAllZones: false, zoneNames: [] }
  }

  const hasAllZones = detectAllZonesScope(body)
  const zoneNames = extractZoneNames(body)

  log(`PREFLIGHT: token scope — zones: [${zoneNames.join(', ') || 'none detected'}]`)
  log(`PREFLIGHT: all-zones scope detected: ${hasAllZones}`)

  if (hasAllZones) {
    log('WARNING (H-2): Token appears to have "All zones" DNS/SSL Edit scope.')
    log('WARNING (H-2): Regenerate the token scoped to specific zone IDs only.')
  }
  else {
    log('PREFLIGHT: token scope appears zone-restricted (H-2 OK)')
  }

  return { hasAllZones, zoneNames }
}

function detectAllZonesScope(body: unknown): boolean {
  if (!isRecord(body))
    return false
  const result = body.result
  if (!isRecord(result))
    return false
  const policies = result.policies
  if (!Array.isArray(policies))
    return false

  for (const policy of policies) {
    if (!isRecord(policy))
      continue
    const resources = policy.resources
    if (!isRecord(resources))
      continue
    for (const key of Object.keys(resources)) {
      if (key.endsWith('zone.*'))
        return true
    }
  }
  return false
}

function extractZoneNames(body: unknown): ReadonlyArray<string> {
  if (!isRecord(body))
    return []
  const result = body.result
  if (!isRecord(result))
    return []
  const policies = result.policies
  if (!Array.isArray(policies))
    return []

  const zones: Array<string> = []
  for (const policy of policies) {
    if (!isRecord(policy))
      continue
    const resources = policy.resources
    if (!isRecord(resources))
      continue
    for (const key of Object.keys(resources)) {
      const match = /zone:([0-9a-f]{32})/.exec(key)
      if (match?.[1])
        zones.push(match[1])
    }
  }
  return zones
}

// ---- R2 bucket management ----------------------------------------------

async function ensureBucketExists(accountId: string, apiToken: string, bucketName: string, log: (line: string) => void): Promise<void> {
  log(`PREFLIGHT: checking R2 bucket "${bucketName}"...`)

  const listUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets`
  let listResponse: Response
  try {
    listResponse = await fetch(listUrl, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    })
  }
  catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    process.stderr.write(`[pipeline-6] R2 bucket list network error: ${redactCredentials(msg)}\n`)
    process.exit(1)
  }

  if (!listResponse.ok) {
    process.stderr.write(`[pipeline-6] R2 bucket list failed: HTTP ${listResponse.status}\n`)
    process.exit(1)
  }

  let listBody: unknown
  try {
    listBody = await listResponse.json()
  }
  catch {
    process.stderr.write('[pipeline-6] R2 bucket list response not valid JSON\n')
    process.exit(1)
  }

  const buckets = extractBucketNames(listBody)
  if (buckets.includes(bucketName)) {
    log(`PREFLIGHT: bucket "${bucketName}" exists`)
    return
  }

  log(`PREFLIGHT: bucket "${bucketName}" not found — creating...`)
  let createResponse: Response
  try {
    createResponse = await fetch(listUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: bucketName }),
    })
  }
  catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    process.stderr.write(`[pipeline-6] R2 bucket create network error: ${redactCredentials(msg)}\n`)
    process.exit(1)
  }

  if (!createResponse.ok) {
    const errorBody = await createResponse.text().catch(() => '(unreadable)')
    process.stderr.write(`[pipeline-6] R2 bucket create failed: HTTP ${createResponse.status} — ${redactCredentials(errorBody)}\n`)
    process.exit(1)
  }
  log(`PREFLIGHT: bucket "${bucketName}" created`)
}

function extractBucketNames(listBody: unknown): ReadonlyArray<string> {
  if (!isRecord(listBody))
    return []
  const result = listBody.result
  if (!Array.isArray(result))
    return []
  return result.flatMap((item: unknown) => {
    if (isRecord(item) && typeof item.name === 'string')
      return [item.name]
    return []
  })
}

// ---- State tracking (sha256) -------------------------------------------

interface UploadStateEntry {
  sha256: string
  uploadedAt: string
}

type UploadState = Record<string, UploadStateEntry>

function loadUploadState(): UploadState {
  if (!existsSync(STATE_FILE))
    return {}
  try {
    const raw = readFileSync(STATE_FILE, 'utf8')
    const parsed: unknown = JSON.parse(raw)
    if (isRecord(parsed))
      return parsed as UploadState
    return {}
  }
  catch {
    return {}
  }
}

// ---- File discovery ----------------------------------------------------

interface StagedFile {
  absolutePath: string
  r2Key: string
  contentType: string
  cacheControl: string
  size: number
}

const INDEX_KEYS: ReadonlySet<string> = new Set([
  'llms.txt',
  'llms-full.txt',
  'api/manifest.json',
])

function isIndexFile(r2Key: string): boolean {
  return INDEX_KEYS.has(r2Key)
}

function isPipelineArtefact(r2Key: string): boolean {
  const basename = r2Key.split('/').at(-1) ?? ''
  return basename.startsWith(PIPELINE_ARTEFACT_PREFIX)
}

function contentTypeFor(r2Key: string): string {
  const ext = extname(r2Key).toLowerCase()
  if (ext === '.md')
    return 'text/markdown; charset=utf-8'
  if (r2Key === 'llms.txt' || r2Key === 'llms-full.txt')
    return 'text/plain; charset=utf-8'
  if (ext === '.json')
    return 'application/json; charset=utf-8'
  if (ext === '.txt')
    return 'text/plain; charset=utf-8'
  if (ext === '.xml')
    return 'application/xml'
  return 'application/octet-stream'
}

function cacheControlFor(r2Key: string, cutoverMode: boolean): string {
  if (cutoverMode && (r2Key === 'api/manifest.json' || r2Key === 'llms.txt' || r2Key === 'llms-full.txt'))
    return 'no-store'
  if (isIndexFile(r2Key))
    return 'public, max-age=1800, stale-while-revalidate=3600'
  return 'public, max-age=43200, stale-while-revalidate=86400'
}

function discoverFiles(stagingDir: string, cutoverMode: boolean): { contentFiles: ReadonlyArray<StagedFile>, indexFiles: ReadonlyArray<StagedFile> } {
  const contentFiles: Array<StagedFile> = []
  const indexFiles: Array<StagedFile> = []

  function walk(dir: string): void {
    if (!existsSync(dir))
      return
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const abs = join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(abs)
      }
      else if (entry.isFile()) {
        const r2Key = relative(stagingDir, abs).replace(/\\/g, '/')
        if (isPipelineArtefact(r2Key))
          continue
        const stat = statSync(abs)
        const file: StagedFile = {
          absolutePath: abs,
          r2Key,
          contentType: contentTypeFor(r2Key),
          cacheControl: cacheControlFor(r2Key, cutoverMode),
          size: stat.size,
        }
        if (isIndexFile(r2Key)) {
          indexFiles.push(file)
        }
        else {
          contentFiles.push(file)
        }
      }
    }
  }

  walk(stagingDir)
  return { contentFiles, indexFiles }
}

// ---- R2 upload (S3-compat API) ----------------------------------------

function buildAuthorizationHeader(
  method: string,
  r2Key: string,
  contentType: string,
  contentHash: string,
  accountId: string,
  accessKeyId: string,
  secretAccessKey: string,
  bucketName: string,
): Record<string, string> {
  const now = new Date()
  const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, '')
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '')
  const host = `${bucketName}.${accountId}.r2.cloudflarestorage.com`
  const region = 'auto'
  const service = 's3'

  const canonicalUri = `/${r2Key}`
  const canonicalQueryString = ''
  const canonicalHeaders = [
    `content-type:${contentType}`,
    `host:${host}`,
    `x-amz-content-sha256:${contentHash}`,
    `x-amz-date:${amzDate}`,
  ].join('\n') + '\n'
  const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date'

  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    contentHash,
  ].join('\n')

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join('\n')

  function hmac(key: Buffer | string, data: string): Buffer {
    return createHmac('sha256', key).update(data).digest()
  }

  const signingKey = hmac(
    hmac(
      hmac(
        hmac(Buffer.from(`AWS4${secretAccessKey}`, 'utf8'), dateStamp),
        region,
      ),
      service,
    ),
    'aws4_request',
  )

  const signature = createHmac('sha256', signingKey).update(stringToSign).digest('hex')
  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  return {
    'Authorization': authorization,
    'Content-Type': contentType,
    'Host': host,
    'x-amz-date': amzDate,
    'x-amz-content-sha256': contentHash,
  }
}

interface UploadResult {
  r2Key: string
  success: boolean
  statusCode?: number
  errorMessage?: string
  retries: number
}

async function uploadFile(
  file: StagedFile,
  content: Buffer,
  contentHash: string,
  credentials: Credentials,
  bucketName: string,
  maxRetries: number,
): Promise<UploadResult> {
  const { accountId, accessKeyId, secretAccessKey } = credentials
  const url = `https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${file.r2Key}`

  let attempt = 0
  let lastStatus = 0
  let lastError = ''

  while (attempt <= maxRetries) {
    if (attempt > 0) {
      const backoffMs = Math.min(1000 * 2 ** (attempt - 1), 30000)
      await new Promise(resolve => setTimeout(resolve, backoffMs))
    }

    try {
      const headers = buildAuthorizationHeader(
        'PUT',
        file.r2Key,
        file.contentType,
        contentHash,
        accountId,
        accessKeyId,
        secretAccessKey,
        bucketName,
      )

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          ...headers,
          'Cache-Control': file.cacheControl,
          'X-OpenClaw-Origin': CDN_ORIGIN_HEADER,
        },
        body: content,
      })

      if (response.ok) {
        return { r2Key: file.r2Key, success: true, statusCode: response.status, retries: attempt }
      }

      lastStatus = response.status

      if (response.status === 401) {
        return {
          r2Key: file.r2Key,
          success: false,
          statusCode: 401,
          errorMessage: 'Authentication failure — check R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY.',
          retries: attempt,
        }
      }

      if (response.status === 429 || response.status >= 500) {
        attempt += 1
        continue
      }

      const body = await response.text().catch(() => '')
      return {
        r2Key: file.r2Key,
        success: false,
        statusCode: response.status,
        errorMessage: `HTTP ${response.status}: ${redactCredentials(body).slice(0, 200)}`,
        retries: attempt,
      }
    }
    catch (err: unknown) {
      lastError = err instanceof Error ? err.message : String(err)
      attempt += 1
    }
  }

  return {
    r2Key: file.r2Key,
    success: false,
    statusCode: lastStatus,
    errorMessage: lastError ? redactCredentials(lastError) : `HTTP ${lastStatus} after ${maxRetries} retries`,
    retries: attempt,
  }
}

// ---- Post-upload sanity check ------------------------------------------

async function postUploadVerify(bucketName: string, accountId: string, apiToken: string, log: (line: string) => void): Promise<void> {
  log('POST-UPLOAD: verifying at least one object exists in bucket...')
  const listUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucketName}/objects?per_page=1`
  try {
    const response = await fetch(listUrl, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      log(`POST-UPLOAD: verification request failed HTTP ${response.status}`)
      return
    }
    const body = await response.json()
    const objects = isRecord(body) ? body.result : null
    const count = Array.isArray(objects) ? objects.length : 0
    if (count > 0) {
      log('POST-UPLOAD: bucket contains objects — upload confirmed')
    }
    else {
      log('POST-UPLOAD: WARNING — bucket appears empty after upload; check for errors above')
    }
  }
  catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    log(`POST-UPLOAD: verification error — ${redactCredentials(msg)}`)
  }
}

// ---- Concurrency pool --------------------------------------------------

async function runConcurrent<TInput, TOutput>(
  items: ReadonlyArray<TInput>,
  concurrency: number,
  fn: (item: TInput) => Promise<TOutput>,
): Promise<void> {
  const queue = [...items]
  const workers = Array.from({ length: Math.min(concurrency, Math.max(queue.length, 1)) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift()
      if (item === undefined)
        break
      await fn(item)
    }
  })
  await Promise.all(workers)
}

// ---- Main --------------------------------------------------------------

async function main(): Promise<void> {
  const args = parseArgs(process.argv)
  ensureDir(BUILD_ROOT)
  const log = makeLogger(LOG_FILE)

  log('=== pipeline 6: upload-r2 ===')
  log(`mode: ${args.dryRun ? 'DRY-RUN' : 'LIVE'}`)

  const credentials = loadCredentials()

  // Log credential presence but NEVER log values (H-2)
  log(redactedTokenStatus('CLOUDFLARE_API_TOKEN'))
  log(redactedTokenStatus('R2_ACCESS_KEY_ID'))
  log(redactedTokenStatus('R2_SECRET_ACCESS_KEY'))
  log(`CLOUDFLARE_ACCOUNT_ID: ${credentials.accountId}`)

  const testBucket = process.env.R2_BUCKET_TEST
  const bucketName = testBucket ?? process.env.R2_BUCKET_NAME ?? PRODUCTION_BUCKET
  log(`target bucket: ${bucketName}`)

  // M-4 legal clearance gate
  enforceLegalGate(bucketName, args.requireLegalClearance, args.dryRun, log)

  // H-2 token scope preflight — blocks if all-zones scope detected
  if (!args.dryRun) {
    const tokenCheck = await verifyTokenScope(credentials.apiToken, log)
    if (tokenCheck.hasAllZones) {
      const override = process.env.OPENCLAW_ALLOW_ALL_ZONES === '1'
      if (!override) {
        process.stderr.write(
          '[pipeline-6] BLOCKED (H-2): Token has All-zones DNS scope.\n'
          + '  A leaked all-zones token enables domain takeover across all account zones.\n'
          + '  Regenerate the token scoped to specific zone IDs only.\n'
          + '  Set OPENCLAW_ALLOW_ALL_ZONES=1 to override (not recommended).\n',
        )
        process.exit(1)
      }
      log('WARNING (H-2): OPENCLAW_ALLOW_ALL_ZONES=1 set — proceeding with all-zones token (not recommended)')
    }
  }

  // Discover staging files
  const cutoverMode = process.argv.includes('--cutover')
  const { contentFiles, indexFiles } = discoverFiles(STAGING_DIR, cutoverMode)
  const allFiles = [...contentFiles, ...indexFiles]

  if (allFiles.length === 0) {
    log('0 files to upload — staging directory is empty or does not exist')
    log('done — uploaded=0 skipped=0 failed=0')
    return
  }

  log(`discovered: ${contentFiles.length} content files + ${indexFiles.length} index files`)
  log(`staging dir: ${STAGING_DIR}`)

  const hardLimit = process.env.CRAWLER_LIMIT !== undefined ? Number(process.env.CRAWLER_LIMIT) : Infinity
  const concurrency = Number(process.env.UPLOAD_CONCURRENCY ?? '8')
  const maxRetries = Number(process.env.UPLOAD_MAX_RETRIES ?? '3')
  const state = loadUploadState()

  // Ensure bucket exists (create on first run)
  if (!args.dryRun) {
    await ensureBucketExists(credentials.accountId, credentials.apiToken, bucketName, log)
    log(`PREFLIGHT: bucket confirmed: ${bucketName}`)
  }

  // Filter files to upload — load content lazily to avoid pre-allocating all file bytes
  const toUpload: Array<{ file: StagedFile, sha256: string }> = []
  let skipped = 0
  let deadLettered = 0
  let fileCount = 0

  for (const file of [...contentFiles, ...indexFiles]) {
    if (fileCount >= hardLimit)
      break
    fileCount++

    if (file.size === 0) {
      const entry = { r2Key: file.r2Key, reason: 'zero-byte file', skippedAt: new Date().toISOString() }
      ensureDir(dirname(DEAD_LETTER_FILE))
      appendFileSync(DEAD_LETTER_FILE, `${JSON.stringify(entry)}\n`)
      deadLettered++
      log(`DEAD-LETTER: ${file.r2Key} (zero bytes)`)
      continue
    }

    const content = readFileSync(file.absolutePath)
    const fileSha256 = sha256Hex(content)
    const existing = state[file.r2Key]

    if (existing?.sha256 === fileSha256) {
      skipped++
      continue
    }

    toUpload.push({ file, sha256: fileSha256 })
  }

  log(`to upload: ${toUpload.length}, skipped (sha256 match): ${skipped}, dead-lettered: ${deadLettered}`)

  if (args.dryRun) {
    log('DRY-RUN: files that would be uploaded:')
    for (const { file, sha256 } of toUpload) {
      log(`  WOULD-UPLOAD  ${file.r2Key}  sha256=${sha256}  ${file.contentType}  ${file.size}B`)
    }
    log(`DRY-RUN complete — ${toUpload.length} would upload, ${skipped} would skip, ${deadLettered} dead-lettered`)
    return
  }

  if (toUpload.length === 0) {
    log('nothing to upload — all files up-to-date')
    log('done — uploaded=0 skipped=0 failed=0')
    return
  }

  // Upload content files first, then index files (TC-020)
  let uploaded = 0
  let failed = 0
  let criticalIndexFailed = false
  const startedAt = Date.now()

  await runConcurrent(toUpload, concurrency, async ({ file, sha256 }) => {
    const content = readFileSync(file.absolutePath)
    const result = await uploadFile(file, content, sha256, credentials, bucketName, maxRetries)

    if (result.success) {
      state[file.r2Key] = { sha256, uploadedAt: new Date().toISOString() }
      writeJson(STATE_FILE, state)
      uploaded++
      log(`UPLOAD OK  ${file.r2Key}  retries=${result.retries}`)
    }
    else {
      failed++
      const entry = {
        r2Key: file.r2Key,
        reason: result.errorMessage ?? `HTTP ${result.statusCode}`,
        failedAt: new Date().toISOString(),
        retries: result.retries,
      }
      ensureDir(dirname(DEAD_LETTER_FILE))
      appendFileSync(DEAD_LETTER_FILE, `${JSON.stringify(entry)}\n`)
      log(`UPLOAD FAIL  ${file.r2Key}  status=${result.statusCode ?? 'network'}  err=${result.errorMessage ?? ''}`)

      if (result.statusCode === 401) {
        process.stderr.write('[pipeline-6] Authentication failure (401). Aborting.\n')
        process.exit(1)
      }

      if (isIndexFile(file.r2Key)) {
        criticalIndexFailed = true
      }
    }
  })

  writeJson(STATE_FILE, state)

  const elapsedSec = Math.round((Date.now() - startedAt) / 1000)
  log(`done — uploaded=${uploaded} skipped=${skipped} failed=${failed} dead-lettered=${deadLettered} elapsed=${elapsedSec}s`)

  if (uploaded > 0) {
    await postUploadVerify(bucketName, credentials.accountId, credentials.apiToken, log)
  }

  if (criticalIndexFailed || (failed > 0 && uploaded === 0)) {
    process.exitCode = 1
  }
}

main().catch((err: unknown) => {
  const raw = err instanceof Error ? err.stack ?? err.message : String(err)
  process.stderr.write(`[pipeline-6] FATAL: ${redactCredentials(raw)}\n`)
  process.exitCode = 1
})
