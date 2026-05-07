import type { DetailItem } from './_lib.ts'
import { writeFileSync } from 'node:fs'
import {
  appendLine,
  ensureDir,
  iterDetailRecords,
  loadDoneIds,
  makeLogger,
  readEnvNumber,
  VBPL_PATHS,
} from './_lib.ts'

const HARD_LIMIT = process.env.CRAWLER_LIMIT === undefined ? Infinity : Number(process.env.CRAWLER_LIMIT)
const PROGRESS_EVERY = readEnvNumber('MARKDOWN_PROGRESS_EVERY', 500)
if (Number.isNaN(HARD_LIMIT))
  throw new Error('CRAWLER_LIMIT must be a number')

const log = makeLogger(VBPL_PATHS.markdownLog)

const NAMED_ENTITIES: Readonly<Record<string, string>> = {
  nbsp: ' ',
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
    .replace(/&#(\d+);/g, (_match, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_match, code: string) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&([a-z][a-z0-9]+);/gi, (match, name: string) => NAMED_ENTITIES[name.toLowerCase()] ?? match)
}

function stripAllTags(input: string): string {
  return input.replace(/<\/?[a-z][^>]*>/gi, '')
}

function htmlToMarkdown(html: string): string {
  let s = html
  s = s.replace(/<script\b[\s\S]*?<\/script>/gi, '')
  s = s.replace(/<style\b[\s\S]*?<\/style>/gi, '')
  s = s.replace(/<!--[\s\S]*?-->/g, '')

  for (let i = 1; i <= 6; i++) {
    const re = new RegExp(`<h${i}\\b[^>]*>([\\s\\S]*?)<\\/h${i}>`, 'gi')
    s = s.replace(re, (_match, inner: string) => `\n\n${'#'.repeat(i)} ${decodeEntities(stripAllTags(inner)).trim()}\n\n`)
  }

  s = s.replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_match, _tag: string, inner: string) => {
    const text = decodeEntities(stripAllTags(inner)).trim()
    return text === '' ? '' : `**${text}**`
  })

  s = s.replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_match, _tag: string, inner: string) => {
    const text = decodeEntities(stripAllTags(inner)).trim()
    return text === '' ? '' : `*${text}*`
  })

  s = s.replace(/<a [^>]*?href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_match, href: string, inner: string) => {
    const text = decodeEntities(stripAllTags(inner)).trim()
    return text === '' ? '' : `[${text}](${href})`
  })

  s = s.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_match, inner: string) => `\n- ${decodeEntities(stripAllTags(inner)).trim()}`)
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

function yamlScalar(value: string): string {
  const escaped = value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r/g, '')
    .replace(/\n/g, ' ')
    .trim()
  return `"${escaped}"`
}

const ISO_DATE_PREFIX = /^\d{4}-\d{2}-\d{2}/

function isoDateOrNull(value: string | null | undefined): string | null {
  if (typeof value !== 'string' || value === '')
    return null
  const trimmed = value.length >= 10 ? value.slice(0, 10) : value
  return ISO_DATE_PREFIX.test(trimmed) ? trimmed : null
}

interface MarkdownOutput {
  filePath: string
  body: string
}

function buildMarkdown(detail: DetailItem): MarkdownOutput {
  const id = detail.id
  const docNum = detail.docNum ?? ''
  const title = detail.title ?? ''
  const docTypeName = detail.docType?.name ?? ''
  const docTypeCode = detail.docType?.code ?? ''
  const effStatusName = detail.effStatus?.name ?? ''
  const effStatusCode = detail.effStatus?.code ?? ''
  const agencyName = typeof detail.agencyName === 'string' ? detail.agencyName : ''
  const organization = typeof detail.organization === 'string' ? detail.organization : ''
  const issueDate = isoDateOrNull(detail.issueDate)
  const effFrom = isoDateOrNull(detail.effFrom)
  const effTo = isoDateOrNull(detail.effTo)
  const updatedDate = isoDateOrNull(detail.updatedDate)
  const isLw = detail.isLw === true
  const hasContent = detail.hasContent === true
  const hasOriginalPdf = detail.hasOriginalPdf === true
  const sourceUrl = `https://vbpl.vn/tw/Pages/vbpq-toanvan.aspx?ItemID=${encodeURIComponent(id)}`

  const fmLines: ReadonlyArray<string> = [
    '---',
    `id: ${yamlScalar(id)}`,
    `docNum: ${yamlScalar(docNum)}`,
    `title: ${yamlScalar(title)}`,
    `docType: ${yamlScalar(docTypeName)}`,
    `docTypeCode: ${yamlScalar(docTypeCode)}`,
    `effStatus: ${yamlScalar(effStatusName)}`,
    `effStatusCode: ${yamlScalar(effStatusCode)}`,
    `agency: ${yamlScalar(agencyName)}`,
    `organization: ${yamlScalar(organization)}`,
    `issueDate: ${issueDate === null ? 'null' : yamlScalar(issueDate)}`,
    `effFrom: ${effFrom === null ? 'null' : yamlScalar(effFrom)}`,
    `effTo: ${effTo === null ? 'null' : yamlScalar(effTo)}`,
    `updatedDate: ${updatedDate === null ? 'null' : yamlScalar(updatedDate)}`,
    `isLw: ${isLw ? 'true' : 'false'}`,
    `hasContent: ${hasContent ? 'true' : 'false'}`,
    `hasOriginalPdf: ${hasOriginalPdf ? 'true' : 'false'}`,
    `sourceUrl: ${yamlScalar(sourceUrl)}`,
    `source: "vbpl.vn"`,
    '---',
    '',
  ]

  const html = detail.documentContent?.content ?? ''
  const body = html === '' ? '_Document body unavailable._\n' : `${htmlToMarkdown(html)}\n`

  return {
    filePath: `${VBPL_PATHS.markdownDir}/${id}.md`,
    body: `${fmLines.join('\n')}\n${body}`,
  }
}

async function main(): Promise<void> {
  ensureDir(VBPL_PATHS.markdownDir)
  log(`to-markdown-vbpl — output dir ${VBPL_PATHS.markdownDir}`)

  const done = await loadDoneIds(VBPL_PATHS.markdownDone)
  log(`already converted: ${done.size}`)

  const startedAt = Date.now()
  let processed = 0
  let written = 0
  let skipped = 0
  let empty = 0

  for await (const record of iterDetailRecords(VBPL_PATHS.details)) {
    if (processed >= HARD_LIMIT) {
      log(`hit CRAWLER_LIMIT=${HARD_LIMIT}, stopping`)
      break
    }
    processed += 1
    if (done.has(record.id)) {
      skipped += 1
      continue
    }

    const out = buildMarkdown(record.data)
    if (record.data.documentContent?.content === '' || record.data.documentContent?.content === null || record.data.documentContent?.content === undefined) {
      empty += 1
    }
    writeFileSync(out.filePath, out.body)
    appendLine(VBPL_PATHS.markdownDone, record.id)
    done.add(record.id)
    written += 1

    if (written % PROGRESS_EVERY === 0) {
      const elapsed = (Date.now() - startedAt) / 1000
      const rate = written / Math.max(elapsed, 1)
      log(`progress: ${written} written (${rate.toFixed(1)}/s; empty bodies=${empty})`)
    }
  }

  const elapsedSec = Math.round((Date.now() - startedAt) / 1000)
  log(`finished — written=${written}, skipped=${skipped}, emptyBodies=${empty}, elapsed=${elapsedSec}s`)
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.stack ?? err.message : String(err)
  log(`FATAL: ${message}`)
  process.exitCode = 1
})
