import { createHash } from 'node:crypto'
import { appendFileSync, createReadStream, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { createInterface } from 'node:readline'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'

const HERE = dirname(fileURLToPath(import.meta.url))
export const DATA_ROOT = `${HERE}/../data`
export const VBPL_DIR = `${DATA_ROOT}/vbpl`

export const VBPL_PATHS = {
  list: `${VBPL_DIR}/list.ndjson`,
  listState: `${VBPL_DIR}/list-state.json`,
  listLog: `${VBPL_DIR}/list.log`,
  details: `${VBPL_DIR}/details.ndjson`,
  detailsDone: `${VBPL_DIR}/details-done.txt`,
  detailsDead: `${VBPL_DIR}/details-dead-letter.ndjson`,
  detailsLog: `${VBPL_DIR}/details.log`,
  detailsState: `${VBPL_DIR}/details-state.json`,
  markdownDir: `${VBPL_DIR}/markdown`,
  markdownDone: `${VBPL_DIR}/markdown-done.txt`,
  markdownLog: `${VBPL_DIR}/markdown.log`,
} as const

export const VBPL_ENDPOINT = 'https://vbpl-bientap-gateway.moj.gov.vn/api/qtdc/public'
export const DEFAULT_USER_AGENT = process.env.CRAWLER_USER_AGENT ?? 'openclaw-edu-vn-crawler/0.1 (research; contact: nguyenhuunguyeny.ny@gmail.com)'

const docTypeRefSchema = z.object({
  id: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  code: z.string().nullable().optional(),
}).passthrough()

const documentMajorSchema = z.object({
  id: z.string().nullable().optional(),
  majorType: z.object({
    code: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    nameEn: z.string().nullable().optional(),
    shortName: z.string().nullable().optional(),
  }).passthrough().nullable().optional(),
  fieldType: z.unknown().optional(),
}).passthrough()

const documentRelatedSchema = z.object({
  id: z.string().nullable().optional(),
  fileName: z.string().nullable().optional(),
  relatedType: z.string().nullable().optional(),
  fileTitle: z.string().nullable().optional(),
  fileOrder: z.number().nullable().optional(),
}).passthrough()

export const listingItemSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
  docAbs: z.string().nullable().optional(),
  docNum: z.string().nullable(),
  docType: docTypeRefSchema.nullable(),
  issueDate: z.string().nullable(),
  effFrom: z.string().nullable(),
  effTo: z.string().nullable(),
  publicDate: z.string().nullable(),
  updatedDate: z.string().nullable(),
  effStatus: docTypeRefSchema.nullable(),
  documentMajors: z.array(documentMajorSchema).nullable().optional(),
  documentRelatedList: z.array(documentRelatedSchema).nullable().optional(),
  isLw: z.boolean().nullable().optional(),
  isNew: z.boolean().nullable().optional(),
  sourceDocumentId: z.string().nullable().optional(),
}).passthrough()

export type ListingItem = z.infer<typeof listingItemSchema>

export const listingResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number(),
  data: z.object({
    current: z.number(),
    total: z.number(),
    pageNumber: z.number(),
    pageSize: z.number(),
    items: z.array(listingItemSchema),
  }),
}).passthrough()

const documentContentSchema = z.object({
  id: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
}).passthrough()

export const detailItemSchema = listingItemSchema.extend({
  agencyName: z.unknown().optional(),
  organization: z.unknown().optional(),
  documentContent: documentContentSchema.nullable().optional(),
  documentContentEn: documentContentSchema.nullable().optional(),
  hasContent: z.boolean().nullable().optional(),
  hasOriginalPdf: z.boolean().nullable().optional(),
  hasAIProcessed: z.boolean().nullable().optional(),
  hasClauseRelation: z.boolean().nullable().optional(),
  references: z.array(z.unknown()).nullable().optional(),
  provisionTree: z.array(z.unknown()).nullable().optional(),
  documentIssues: z.array(z.unknown()).nullable().optional(),
  documentFields: z.array(z.unknown()).nullable().optional(),
  viewCount: z.number().nullable().optional(),
}).passthrough()

export type DetailItem = z.infer<typeof detailItemSchema>

export const detailResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number(),
  data: detailItemSchema,
}).passthrough()

const detailNdjsonRecordSchema = z.object({
  id: z.string(),
  fetchedAt: z.string(),
  data: detailItemSchema,
}).passthrough()

export type DetailRecord = z.infer<typeof detailNdjsonRecordSchema>

const idOnlySchema = z.object({ id: z.string() }).passthrough()

export function ensureDir(path: string): void {
  mkdirSync(path, { recursive: true })
}

export function makeLogger(logPath: string): (line: string) => void {
  ensureDir(dirname(logPath))
  return (line: string) => {
    const stamp = new Date().toISOString()
    const out = `[${stamp}] ${line}\n`
    process.stdout.write(out)
    appendFileSync(logPath, out)
  }
}

export class HttpError extends Error {
  readonly status: number
  readonly body: string
  constructor(status: number, body: string, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.body = body
  }
}

const TRANSIENT_STATUSES: ReadonlySet<number> = new Set([408, 425, 429, 500, 502, 503, 504])

export function isTransientHttp(status: number): boolean {
  return status >= 500 || TRANSIENT_STATUSES.has(status)
}

const PERMANENT_BODY_PATTERNS: ReadonlyArray<RegExp> = [
  /entity\.not\.found/i,
  /liên hệ quản trị viên/i,
  /không tìm thấy/i,
]

export function isPermanentBody(body: string): boolean {
  return PERMANENT_BODY_PATTERNS.some(re => re.test(body))
}

function tryParseJson(line: string): unknown {
  try {
    return JSON.parse(line)
  }
  catch {
    return undefined
  }
}

export async function loadDoneIds(path: string): Promise<Set<string>> {
  const ids = new Set<string>()
  if (!existsSync(path))
    return ids
  const stream = createReadStream(path, 'utf8')
  const rl = createInterface({ input: stream, crlfDelay: Infinity })
  for await (const line of rl) {
    const trimmed = line.trim()
    if (trimmed)
      ids.add(trimmed)
  }
  return ids
}

export async function loadIdsFromNdjson(path: string): Promise<Set<string>> {
  const ids = new Set<string>()
  if (!existsSync(path))
    return ids
  const stream = createReadStream(path, 'utf8')
  const rl = createInterface({ input: stream, crlfDelay: Infinity })
  for await (const line of rl) {
    if (!line.trim())
      continue
    const parsed = tryParseJson(line)
    if (parsed === undefined)
      continue
    const result = idOnlySchema.safeParse(parsed)
    if (result.success)
      ids.add(result.data.id)
  }
  return ids
}

export async function loadListingIds(listPath: string): Promise<Set<string>> {
  const ids = new Set<string>()
  if (!existsSync(listPath))
    return ids
  const stream = createReadStream(listPath, 'utf8')
  const rl = createInterface({ input: stream, crlfDelay: Infinity })
  for await (const line of rl) {
    if (!line.trim())
      continue
    const parsed = tryParseJson(line)
    if (parsed === undefined)
      continue
    const result = idOnlySchema.safeParse(parsed)
    if (result.success)
      ids.add(result.data.id)
  }
  return ids
}

export async function* iterListingItems(listPath: string): AsyncIterable<ListingItem> {
  if (!existsSync(listPath))
    return
  const stream = createReadStream(listPath, 'utf8')
  const rl = createInterface({ input: stream, crlfDelay: Infinity })
  for await (const line of rl) {
    if (!line.trim())
      continue
    const parsed = tryParseJson(line)
    if (parsed === undefined)
      continue
    const result = listingItemSchema.safeParse(parsed)
    if (result.success)
      yield result.data
  }
}

export async function* iterDetailRecords(detailsPath: string): AsyncIterable<DetailRecord> {
  if (!existsSync(detailsPath))
    return
  const stream = createReadStream(detailsPath, 'utf8')
  const rl = createInterface({ input: stream, crlfDelay: Infinity })
  for await (const line of rl) {
    if (!line.trim())
      continue
    const parsed = tryParseJson(line)
    if (parsed === undefined)
      continue
    const result = detailNdjsonRecordSchema.safeParse(parsed)
    if (result.success)
      yield result.data
  }
}

export function appendLine(path: string, line: string): void {
  ensureDir(dirname(path))
  appendFileSync(path, `${line}\n`)
}

export function writeJson(path: string, value: unknown): void {
  ensureDir(dirname(path))
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
}

export function randomDelayMs(min: number, max: number): number {
  if (min < 0 || max < min)
    throw new Error(`bad delay range: [${min}, ${max}]`)
  return min + Math.floor(Math.random() * (max - min + 1))
}

export function readEnvNumber(name: string, fallback: number): number {
  const raw = process.env[name]
  if (raw === undefined)
    return fallback
  const n = Number(raw)
  if (!Number.isFinite(n))
    throw new Error(`env ${name}=${raw} is not a number`)
  return n
}

export function requireEnv(name: string): string {
  const val = process.env[name]
  if (!val) {
    process.stderr.write(`[pipeline] Missing required env var: ${name}\n`)
    process.exit(1)
  }
  return val
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function sha256Hex(input: string | Buffer): string {
  return createHash('sha256').update(input).digest('hex')
}

export function writeUtf8(filePath: string, content: string): void {
  ensureDir(dirname(filePath))
  writeFileSync(filePath, content, 'utf8')
}
