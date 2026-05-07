import type { DetailItem } from './_lib.ts'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  appendLine,
  ensureDir,
  iterDetailRecords,
  makeLogger,
  readEnvNumber,
  sha256Hex,
  VBPL_PATHS,
} from './_lib.ts'
import { vanBanGocFrontmatterSchema } from './lib/frontmatter.ts'

const HERE = dirname(fileURLToPath(import.meta.url))
const STAGING_ROOT = join(HERE, '..', '..', 'build', 'r2-staging', 'van-ban-goc')
const STATE_FILE = join(HERE, '..', '..', 'build', 'r2-staging', '.pipeline-4-state.json')
const DEAD_LETTER_FILE = join(HERE, '..', '..', 'build', 'r2-staging', '.pipeline-4-dead-letter.ndjson')
const CDN_BASE = 'https://cdn-openclaw-edu.opencloud.com.vn'

const HARD_LIMIT = process.env.CRAWLER_LIMIT === undefined ? Infinity : Number(process.env.CRAWLER_LIMIT)
const PROGRESS_EVERY = readEnvNumber('PIPELINE4_PROGRESS_EVERY', 500)

if (Number.isNaN(HARD_LIMIT))
  throw new Error('CRAWLER_LIMIT must be a number')

const LOG_FILE = join(HERE, '..', '..', 'build', 'r2-staging', '.pipeline-4.log')
const log = makeLogger(LOG_FILE)

// ---------------------------------------------------------------------------
// State management — map doc ID → sha256 of the source record JSON
// ---------------------------------------------------------------------------

type StateMap = Record<string, string>

function loadState(): StateMap {
  if (!existsSync(STATE_FILE))
    return {}
  try {
    const raw = readFileSync(STATE_FILE, 'utf8')
    const parsed: unknown = JSON.parse(raw)
    if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed))
      return parsed as StateMap
  }
  catch {
    // corrupted state file — start fresh
  }
  return {}
}

function saveState(state: StateMap): void {
  ensureDir(dirname(STATE_FILE))
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8')
}

// ---------------------------------------------------------------------------
// Security: frontmatter injection prevention (sec-pre C-1)
// ---------------------------------------------------------------------------

function sanitizeFrontmatterString(value: string): string {
  return value
    .replace(/\r\n?/g, ' ')
    .replace(/\n/g, ' ')
    // strip control characters including tab U+0009, null U+0000, and full C0/C1 range except space
    .replace(/[\x00-\x1F\x7F]/g, '')
    // replace YAML document boundary sequences that could break out of the frontmatter block
    .replace(/---/g, '- - -')
    .trim()
}

function yamlScalarSafe(value: string): string {
  const sanitized = sanitizeFrontmatterString(value)
  const escaped = sanitized
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
  return `"${escaped}"`
}

// ---------------------------------------------------------------------------
// Body sanitization: prevent standalone `---` lines in body (sec-pre C-1)
// ---------------------------------------------------------------------------

function sanitizeBodyLine(line: string): string {
  // replace a line that is exactly `---` (YAML boundary) with a visually similar safe string
  if (/^---+$/.test(line.trim()))
    return line.replace(/---/g, '- - -')
  return line
}

function sanitizeBody(body: string): string {
  return body
    .split('\n')
    .map(sanitizeBodyLine)
    .join('\n')
}

// ---------------------------------------------------------------------------
// Slug generation — Vietnamese diacritics stripped, URL-safe
// ---------------------------------------------------------------------------

const VIET_DIACRITICS: ReadonlyArray<[RegExp, string]> = [
  [/[àáâãäåāăąạảấầẩẫậắằẳẵặ]/gu, 'a'],
  [/[èéêëēĕęěẹẻẽếềểễệ]/gu, 'e'],
  [/[ìíîïīĭįịỉĩ]/gu, 'i'],
  [/[òóôõöøōŏọỏốồổỗộớờởỡợ]/gu, 'o'],
  [/[ùúûüūŭůụủũứừửữự]/gu, 'u'],
  [/[ỳýÿỵỷỹ]/gu, 'y'],
  [/đ/gu, 'd'],
  [/[ÀÁÂÃÄÅĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶ]/gu, 'A'],
  [/[ÈÉÊËĒĔĘĚẸẺẼẾỀỂỄỆ]/gu, 'E'],
  [/[ÌÍÎÏĪĬĮỊỈĨ]/gu, 'I'],
  [/[ÒÓÔÕÖØŌŎỌỎỐỒỔỖỘỚỜỞỠỢ]/gu, 'O'],
  [/[ÙÚÛÜŪŬŮỤỦŨỨỪỬỮỰ]/gu, 'U'],
  [/[ỲÝŸỴỶỸ]/gu, 'Y'],
  [/Đ/gu, 'D'],
]

function toSlug(input: string): string {
  let s = input
  for (const [re, replacement] of VIET_DIACRITICS)
    s = s.replace(re, replacement)
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)
}

// ---------------------------------------------------------------------------
// ISO date helpers
// ---------------------------------------------------------------------------

const ISO_DATE_PREFIX_RE = /^\d{4}-\d{2}-\d{2}/

function isoDateOrNull(value: string | null | undefined): string | null {
  if (typeof value !== 'string' || value === '')
    return null
  const trimmed = value.length >= 10 ? value.slice(0, 10) : value
  return ISO_DATE_PREFIX_RE.test(trimmed) ? trimmed : null
}

function yearFromIsoDate(iso: string | null): string | null {
  if (iso === null)
    return null
  return iso.slice(0, 4)
}

// ---------------------------------------------------------------------------
// Frontmatter emission
// ---------------------------------------------------------------------------

const NAMED_ENTITIES: Readonly<Record<string, string>> = {
  nbsp: ' ',
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: '\'',
  ldquo: '“',
  rdquo: '”',
  lsquo: '‘',
  rsquo: '’',
  hellip: '…',
  ndash: '–',
  mdash: '—',
}

function decodeEntities(input: string): string {
  return input
    .replace(/&#(\d+);/g, (_m, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_m, code: string) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&([a-z][a-z0-9]+);/gi, (match, name: string) => NAMED_ENTITIES[name.toLowerCase()] ?? match)
}

function stripAllTags(input: string): string {
  return input.replace(/<\/?[a-z][^>]*>/gi, '')
}

function htmlToMarkdown(html: string): string {
  let s = html
  s = s.replace(/<script\b[\s\S]*?<\/script>/gi, '')
  s = s.replace(/<style\b[\s\S]*?<\/style>/gi, '')
  // standard HTML comments
  s = s.replace(/<!--[\s\S]*?-->/g, '')
  // malformed comments: <!- ... -> (sec-pre C-1)
  s = s.replace(/<!\-[\s\S]*?\->/g, '')

  for (let i = 1; i <= 6; i++) {
    const re = new RegExp(`<h${i}\\b[^>]*>([\\s\\S]*?)<\\/h${i}>`, 'gi')
    s = s.replace(re, (_match, inner: string) => `\n\n${'#'.repeat(i)} ${decodeEntities(stripAllTags(inner)).trim()}\n\n`)
  }

  s = s.replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_m, _tag: string, inner: string) => {
    const text = decodeEntities(stripAllTags(inner)).trim()
    return text === '' ? '' : `**${text}**`
  })

  s = s.replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_m, _tag: string, inner: string) => {
    const text = decodeEntities(stripAllTags(inner)).trim()
    return text === '' ? '' : `*${text}*`
  })

  s = s.replace(/<a [^>]*?href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_m, href: string, inner: string) => {
    const text = decodeEntities(stripAllTags(inner)).trim()
    return text === '' ? '' : `[${text}](${href})`
  })

  s = s.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_m, inner: string) => `\n- ${decodeEntities(stripAllTags(inner)).trim()}`)
  s = s.replace(/<\/?ul\b[^>]*>/gi, '\n')
  s = s.replace(/<\/?ol\b[^>]*>/gi, '\n')
  s = s.replace(/<br\s*\/?>/gi, '\n')
  s = s.replace(/<\/?p\b[^>]*>/gi, '\n\n')
  s = s.replace(/<\/?div\b[^>]*>/gi, '\n')
  s = s.replace(/<\/?span\b[^>]*>/gi, '')
  s = s.replace(/<\/?(td|th|tr|tbody|thead|tfoot|caption|colgroup|col|table)\b[^>]*>/gi, '\n\n')

  s = stripAllTags(s)
  s = decodeEntities(s)

  s = s.replace(/\r\n/g, '\n')
  s = s.replace(/\xA0/g, ' ')
  s = s.replace(/[ \t]+\n/g, '\n')
  s = s.replace(/\n{3,}/g, '\n\n')
  s = s.trim()
  return s
}

// ---------------------------------------------------------------------------
// loai_van_ban normalization
// ---------------------------------------------------------------------------

const DOC_TYPE_CODE_MAP: Readonly<Record<string, string>> = {
  'QĐ': 'quyet-dinh',
  'TT': 'thong-tu',
  'NQ': 'nghi-quyet',
  'NĐ': 'nghi-dinh',
  'VBHN': 'van-ban-hop-nhat',
  'TTLT': 'thong-tu-lien-tich',
  'TTLT_TW': 'thong-tu-lien-tich',
  'Lu': 'luat',
  'LU': 'luat',
  'PL': 'phap-lenh',
  'NQLT': 'nghi-quyet-lien-tich',
  'CT': 'chi-thi',
  'HD': 'huong-dan',
  'CV': 'cong-van',
  'TB': 'thong-bao',
}

function normalizeLoaiVanBan(code: string | null | undefined, name: string | null | undefined): string {
  if (typeof code === 'string' && code !== '') {
    const mapped = DOC_TYPE_CODE_MAP[code.trim()]
    if (mapped !== undefined)
      return mapped
  }
  if (typeof name === 'string' && name !== '')
    return toSlug(name)
  return 'van-ban-khac'
}

// ---------------------------------------------------------------------------
// trang_thai_hieu_luc normalization
// ---------------------------------------------------------------------------

function normalizeTrangThaiHieuLuc(code: string | null | undefined, name: string | null | undefined): string {
  if (code === 'CHL')
    return 'con-hieu-luc'
  if (code === 'HHL')
    return 'het-hieu-luc'
  if (code === 'CCHL')
    return 'chua-co-hieu-luc'
  if (typeof name === 'string' && name !== '')
    return toSlug(name)
  return 'khong-xac-dinh'
}

// ---------------------------------------------------------------------------
// Main conversion
// ---------------------------------------------------------------------------

interface ConvertResult {
  filePath: string
  relPath: string
  content: string
  year: string
}

interface ConvertFailure {
  reason: string
}

type ConvertOutcome = { ok: true, result: ConvertResult } | { ok: false, failure: ConvertFailure }

function convertRecord(detail: DetailItem, fetchedAt: string, sourceJson: string): ConvertOutcome {
  const title = detail.title
  if (typeof title !== 'string' || title.trim() === '') {
    return { ok: false, failure: { reason: 'missing ten_van_ban (title)' } }
  }

  const html = detail.documentContent?.content
  if (html === null || html === undefined) {
    return { ok: false, failure: { reason: 'null documentContent.content' } }
  }

  const ngayBanHanh = isoDateOrNull(detail.issueDate)
  const year = yearFromIsoDate(ngayBanHanh)
  if (year === null) {
    return { ok: false, failure: { reason: `invalid ngay_ban_hanh: ${detail.issueDate ?? 'undefined'}` } }
  }

  const docNum = detail.docNum ?? ''
  const loaiVanBan = normalizeLoaiVanBan(detail.docType?.code, detail.docType?.name)
  const coQuan = typeof detail.agencyName === 'string' ? detail.agencyName : ''
  const ngayHieuLuc = isoDateOrNull(detail.effFrom)
  const ngayHetHieuLuc = isoDateOrNull(detail.effTo)
  const trangThaiHieuLuc = normalizeTrangThaiHieuLuc(detail.effStatus?.code, detail.effStatus?.name)
  const ngayCrawl = isoDateOrNull(fetchedAt) ?? new Date().toISOString().slice(0, 10)
  const nguonCrawl = `https://vbpl.vn/tw/Pages/vbpq-toanvan.aspx?ItemID=${encodeURIComponent(detail.id)}`
  const checksum = sha256Hex(sourceJson)

  const slugBase = docNum !== '' ? docNum : title.slice(0, 80)
  const slug = toSlug(slugBase) || toSlug(detail.id)
  const relPath = `van-ban-goc/${year}/${slug}.md`
  const canonicalUrl = `${CDN_BASE}/${relPath}`

  const fm: Record<string, string | string[] | null> = {
    loai: 'van-ban-goc',
    loai_van_ban: loaiVanBan,
    so_hieu: docNum,
    ten_van_ban: title,
    co_quan_ban_hanh: coQuan,
    ngay_ban_hanh: ngayBanHanh,
    ngay_hieu_luc: ngayHieuLuc,
    ngay_het_hieu_luc: ngayHetHieuLuc,
    trang_thai_hieu_luc: trangThaiHieuLuc,
    trich_yeu: detail.docAbs ?? '',
    nguon_crawl: nguonCrawl,
    ngay_crawl: ngayCrawl,
    checksum,
    canonical_url: canonicalUrl,
  }

  // Validate against the Zod schema — dead-letter if it fails
  const parseResult = vanBanGocFrontmatterSchema.safeParse({
    ...fm,
    van_ban_thay_the: null,
    van_ban_huong_dan: [],
  })
  if (!parseResult.success) {
    const issues = parseResult.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')
    return { ok: false, failure: { reason: `Zod validation failed: ${issues}` } }
  }

  const fmLines: string[] = [
    '---',
    `loai: van-ban-goc`,
    `loai_van_ban: ${yamlScalarSafe(loaiVanBan)}`,
    `so_hieu: ${yamlScalarSafe(docNum)}`,
    `ten_van_ban: ${yamlScalarSafe(title)}`,
    `co_quan_ban_hanh: ${yamlScalarSafe(coQuan)}`,
    `ngay_ban_hanh: ${ngayBanHanh === null ? 'null' : yamlScalarSafe(ngayBanHanh)}`,
    `ngay_hieu_luc: ${ngayHieuLuc === null ? 'null' : yamlScalarSafe(ngayHieuLuc)}`,
    `ngay_het_hieu_luc: ${ngayHetHieuLuc === null ? 'null' : yamlScalarSafe(ngayHetHieuLuc)}`,
    `trang_thai_hieu_luc: ${yamlScalarSafe(trangThaiHieuLuc)}`,
    `trich_yeu: ${yamlScalarSafe(detail.docAbs ?? '')}`,
    `van_ban_thay_the: null`,
    `van_ban_huong_dan: []`,
    `nguon_crawl: ${yamlScalarSafe(nguonCrawl)}`,
    `ngay_crawl: ${yamlScalarSafe(ngayCrawl)}`,
    `checksum: "${checksum}"`,
    `canonical_url: ${yamlScalarSafe(canonicalUrl)}`,
    '---',
    '',
  ]

  const bodyMd = html === '' ? '_Nội dung văn bản không có sẵn._\n' : `${sanitizeBody(htmlToMarkdown(html))}\n`
  const content = `${fmLines.join('\n')}\n${bodyMd}`
  const filePath = join(STAGING_ROOT, year, `${slug}.md`)

  return {
    ok: true,
    result: { filePath, relPath, content, year },
  }
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  ensureDir(STAGING_ROOT)
  ensureDir(dirname(STATE_FILE))
  log(`pipeline-4 — output dir ${STAGING_ROOT}`)

  const state = loadState()
  log(`state: ${Object.keys(state).length} previously processed IDs`)

  const startedAt = Date.now()
  let processed = 0
  let written = 0
  let skipped = 0
  let deadLettered = 0

  for await (const record of iterDetailRecords(VBPL_PATHS.details)) {
    if (processed >= HARD_LIMIT) {
      log(`hit CRAWLER_LIMIT=${HARD_LIMIT}, stopping`)
      break
    }
    processed += 1

    const sourceJson = JSON.stringify(record.data)
    const sourceHash = sha256Hex(sourceJson)

    if (state[record.id] === sourceHash) {
      skipped += 1
      continue
    }

    const outcome = convertRecord(record.data, record.fetchedAt, sourceJson)
    if (!outcome.ok) {
      deadLettered += 1
      appendLine(DEAD_LETTER_FILE, JSON.stringify({ id: record.id, reason: outcome.failure.reason, fetchedAt: record.fetchedAt }))
      continue
    }

    const { filePath, year, content } = outcome.result

    ensureDir(join(STAGING_ROOT, year))
    writeFileSync(filePath, content, { encoding: 'utf8', flag: 'w' })
    state[record.id] = sourceHash
    written += 1

    if (written % PROGRESS_EVERY === 0) {
      saveState(state)
      const elapsed = (Date.now() - startedAt) / 1000
      const rate = written / Math.max(elapsed, 1)
      log(`progress: ${written} written (${rate.toFixed(1)}/s; dead=${deadLettered})`)
    }
  }

  saveState(state)

  const elapsedSec = Math.round((Date.now() - startedAt) / 1000)
  log(`finished — written=${written}, skipped=${skipped}, deadLettered=${deadLettered}, elapsed=${elapsedSec}s`)
  if (processed === 0)
    log('0 records processed')
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.stack ?? err.message : String(err)
  log(`FATAL: ${message}`)
  process.exitCode = 1
})
