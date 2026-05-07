// nuxt-llms is a Nuxt module; its llms.txt handler requires the Nuxt server runtime and cannot run standalone.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, posix, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { writeUtf8 } from './_lib.ts'

const HERE = dirname(fileURLToPath(import.meta.url))
const STAGING_DIR = join(HERE, '..', '..', 'build', 'r2-staging')
const CDN_HOST = 'https://cdn-openclaw-edu.opencloud.com.vn'

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function toCdnUrl(stagingRelativePath: string): string {
  // Normalise Windows separators to forward slashes for the URL
  const urlPath = stagingRelativePath.split(sep).join('/')
  return `${CDN_HOST}/${urlPath}`
}

// ---------------------------------------------------------------------------
// frontmatter parsing — lightweight; avoid a full YAML dep
// ---------------------------------------------------------------------------

interface ParsedMd {
  /** raw frontmatter key-value map, all values as strings */
  raw: Record<string, string>
  /** path relative to STAGING_DIR, forward-slash separated */
  relativePath: string
  /** absolute path on disk */
  absPath: string
}

function parseFrontmatter(text: string): Record<string, string> {
  const result: Record<string, string> = {}
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)
  if (!match)
    return result
  const block = match[1] ?? ''
  for (const line of block.split(/\r?\n/)) {
    const colon = line.indexOf(':')
    if (colon < 1)
      continue
    const key = line.slice(0, colon).trim()
    const value = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '')
    if (key)
      result[key] = value
  }
  return result
}

// ---------------------------------------------------------------------------
// walk staging dir, collect all .md files (excluding index.md outputs)
// ---------------------------------------------------------------------------

function* walkMdFiles(dir: string, base: string): Generator<ParsedMd> {
  const entries = readdirSync(dir, { withFileTypes: true })
  // Sort for deterministic output (idempotency — TC-019)
  entries.sort((a, b) => a.name.localeCompare(b.name, 'vi'))
  for (const entry of entries) {
    const absPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walkMdFiles(absPath, base)
    }
    else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md') {
      const relativePath = relative(base, absPath).split(sep).join('/')
      const text = readFileSync(absPath, 'utf8')
      yield { raw: parseFrontmatter(text), relativePath, absPath }
    }
  }
}

// ---------------------------------------------------------------------------
// group files by their immediate parent folder (relative to staging root)
// ---------------------------------------------------------------------------

function groupByFolder(docs: ParsedMd[]): Map<string, ParsedMd[]> {
  const map = new Map<string, ParsedMd[]>()
  for (const doc of docs) {
    const folder = posix.dirname(doc.relativePath)
    const existing = map.get(folder)
    if (existing)
      existing.push(doc)
    else
      map.set(folder, [doc])
  }
  return map
}

// ---------------------------------------------------------------------------
// llms.txt — high-level navigation (top-level groupings)
// ---------------------------------------------------------------------------

function buildLlmsTxt(docs: ParsedMd[]): string {
  const lines: string[] = [
    `# ${CDN_HOST}`,
    '',
    '> Cao đẳng OpenClaw — kho tài nguyên đào tạo Trợ lý AI chuyên ngành cho doanh nghiệp Việt Nam.',
    '> Mọi tài nguyên ở định dạng Markdown, phục vụ agent runtime và con người.',
    '',
    '## Nhóm tài nguyên chính',
    '',
    `- [Khoa](${CDN_HOST}/khoa/index.md): Khoa và ngành đào tạo`,
    `- [Trợ lý](${CDN_HOST}/tro-ly/index.md): Trợ lý chuyên ngành đã tốt nghiệp`,
    `- [Văn bản gốc](${CDN_HOST}/van-ban-goc/index.md): Kho văn bản pháp luật chuẩn hoá`,
    `- [Knowledge](${CDN_HOST}/knowledge/index.md): Kho tri thức chuyên ngành`,
    '',
    '## Danh mục đầy đủ',
    '',
    `- [llms-full.txt](${CDN_HOST}/llms-full.txt): Toàn bộ đường dẫn tài nguyên`,
    `- [sitemap.xml](${CDN_HOST}/sitemap.xml): Sơ đồ trang web`,
    `- [api/manifest.json](${CDN_HOST}/api/manifest.json): Manifest máy đọc`,
    '',
  ]

  // Emit one URL per document
  for (const doc of docs) {
    lines.push(`- ${toCdnUrl(doc.relativePath)}`)
  }

  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// llms-full.txt — every public path, one CDN URL per line (TC-003)
// ---------------------------------------------------------------------------

function buildLlmsFullTxt(docs: ParsedMd[]): string {
  return docs.map(d => toCdnUrl(d.relativePath)).join('\n')
}

// ---------------------------------------------------------------------------
// per-folder index.md (TC-006, TC-007, TC-032)
// ---------------------------------------------------------------------------

function buildFolderIndex(folder: string, docs: ParsedMd[]): string {
  const folderName = folder === '.' ? '(gốc)' : folder
  const lines: string[] = [
    `# Danh mục: ${folderName}`,
    '',
    `> Thư mục: \`${folder}\`  `,
    `> Số tài liệu: ${docs.length}`,
    '',
    '## Danh sách tài liệu',
    '',
  ]

  for (const doc of docs) {
    const tenVanBan = doc.raw['ten_van_ban'] ?? doc.raw['title'] ?? ''
    const soHieu = doc.raw['so_hieu'] ?? ''
    const trangThai = doc.raw['trang_thai'] ?? ''
    const ngayBanHanh = doc.raw['ngay_ban_hanh'] ?? ''
    const cdnUrl = toCdnUrl(doc.relativePath)
    const fileName = posix.basename(doc.relativePath)

    const meta: string[] = []
    if (soHieu)
      meta.push(soHieu)
    if (ngayBanHanh)
      meta.push(ngayBanHanh)
    if (trangThai)
      meta.push(trangThai)

    const metaStr = meta.length > 0 ? ` — ${meta.join(' · ')}` : ''
    const label = tenVanBan || fileName
    // Use CDN absolute URL (TC-007 requires CDN URLs in index.md)
    lines.push(`- [${label}](${cdnUrl})${metaStr}`)
  }

  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// sitemap.xml — XSD-compliant (TC-009, TC-010, TC-011, TC-023)
// ---------------------------------------------------------------------------

function buildSitemapXml(docs: ParsedMd[]): string {
  const urlElements = docs.map((doc) => {
    const loc = toCdnUrl(doc.relativePath)
    // Prefer ngay_cap_nhat, then ngay_ban_hanh; fall back to today
    const rawDate = doc.raw['ngay_cap_nhat'] ?? doc.raw['ngay_ban_hanh'] ?? ''
    const lastmod = isValidIsoDate(rawDate) ? rawDate.slice(0, 10) : new Date().toISOString().slice(0, 10)
    return [
      '  <url>',
      `    <loc>${escapeXml(loc)}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      '  </url>',
    ].join('\n')
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urlElements,
    '</urlset>',
  ].join('\n')
}

function isValidIsoDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}/.test(s)
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// ---------------------------------------------------------------------------
// api/manifest.json (TC-012, TC-013, TC-014, TC-025)
// ---------------------------------------------------------------------------

interface Manifest {
  version: string
  generated_at: string
  document_count: number
  base_url: string
  paths: string[]
  khoa: string[]
  'tro-ly': string[]
  stats: {
    van_ban_goc: number
    khoa: number
    tro_ly: number
    other: number
  }
}

function buildManifest(docs: ParsedMd[]): Manifest {
  const paths = docs.map(d => toCdnUrl(d.relativePath))

  const khoaPaths = paths.filter(p => p.includes('/khoa/'))
  const troLyPaths = paths.filter(p => p.includes('/tro-ly/'))
  const vanBanGocCount = paths.filter(p => p.includes('/van-ban-goc/')).length

  return {
    version: '1',
    generated_at: new Date().toISOString(),
    document_count: docs.length,
    base_url: CDN_HOST,
    paths,
    khoa: khoaPaths,
    'tro-ly': troLyPaths,
    stats: {
      van_ban_goc: vanBanGocCount,
      khoa: khoaPaths.length,
      tro_ly: troLyPaths.length,
      other: paths.length - vanBanGocCount - khoaPaths.length - troLyPaths.length,
    },
  }
}

// ---------------------------------------------------------------------------
// dedup guard — ensure no duplicate CDN URLs (TC-026, TC-027, TC-028)
// ---------------------------------------------------------------------------

function assertNoDuplicates(urls: string[], label: string): void {
  const seen = new Set<string>()
  for (const u of urls) {
    if (seen.has(u))
      throw new Error(`Duplicate URL in ${label}: ${u}`)
    seen.add(u)
  }
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  if (!existsSync(STAGING_DIR)) {
    console.log(`Staging dir not found: ${STAGING_DIR}`)
    console.log('llms.txt and llms-full.txt will be empty (TC-020: empty-input case).')
    // Emit empty/minimal outputs so downstream steps don't crash
    writeUtf8(join(STAGING_DIR, 'llms.txt'), '')
    writeUtf8(join(STAGING_DIR, 'llms-full.txt'), '')
    writeUtf8(join(STAGING_DIR, 'sitemap.xml'), [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      '</urlset>',
    ].join('\n'))
    const emptyManifest: Manifest = {
      version: '1',
      generated_at: new Date().toISOString(),
      document_count: 0,
      base_url: CDN_HOST,
      paths: [],
      khoa: [],
      'tro-ly': [],
      stats: { van_ban_goc: 0, khoa: 0, tro_ly: 0, other: 0 },
    }
    writeUtf8(join(STAGING_DIR, 'api', 'manifest.json'), JSON.stringify(emptyManifest, null, 2))
    return
  }

  console.log(`Walking ${STAGING_DIR} …`)
  const docs = Array.from(walkMdFiles(STAGING_DIR, STAGING_DIR))

  if (docs.length === 0) {
    console.log('No .md files found. Emitting empty index files.')
  }
  else {
    console.log(`Found ${docs.length} .md files.`)
  }

  const cdnUrls = docs.map(d => toCdnUrl(d.relativePath))
  assertNoDuplicates(cdnUrls, 'CDN paths')

  // --- llms.txt ---
  const llmsTxt = buildLlmsTxt(docs)
  writeUtf8(join(STAGING_DIR, 'llms.txt'), llmsTxt)
  console.log(`  llms.txt: ${docs.length} entries`)

  // --- llms-full.txt ---
  const llmsFullTxt = buildLlmsFullTxt(docs)
  writeUtf8(join(STAGING_DIR, 'llms-full.txt'), llmsFullTxt)
  console.log(`  llms-full.txt: ${docs.length} entries`)

  // --- per-folder index.md ---
  const byFolder = groupByFolder(docs)
  let folderCount = 0
  for (const [folder, folderDocs] of byFolder) {
    const absFolder = join(STAGING_DIR, ...folder.split('/'))
    const indexPath = join(absFolder, 'index.md')
    const indexContent = buildFolderIndex(folder, folderDocs)
    writeUtf8(indexPath, indexContent)
    folderCount++
  }
  console.log(`  index.md: ${folderCount} folders`)

  // --- sitemap.xml ---
  const sitemapXml = buildSitemapXml(docs)
  writeUtf8(join(STAGING_DIR, 'sitemap.xml'), sitemapXml)
  console.log(`  sitemap.xml: ${docs.length} <url> entries`)

  // --- api/manifest.json ---
  const manifest = buildManifest(docs)
  writeUtf8(join(STAGING_DIR, 'api', 'manifest.json'), JSON.stringify(manifest, null, 2))
  console.log(`  api/manifest.json: ${docs.length} paths`)

  console.log('Done.')
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
