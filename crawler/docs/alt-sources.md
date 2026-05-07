# Alternative official sources for the gap

`vbpl.vn` (the National Database of Legal Normative Documents at the Ministry of Justice) is the canonical source for **văn bản quy phạm pháp luật** — documents with regulatory force. It contains 167,660 documents (probed 2026-05-07).

The aggregator `thuvienphapluat.vn` reports 391,882 documents — a gap of ~224k items. That gap is **not "missing law"**: it is a different category of artefact, mostly non-normative or non-central. This document maps the gap to **official government sources** so we never need a commercial aggregator (whose `Content-Signal: ai-train=no` ToS blocks the project's primary use case anyway).

## What's missing, where it actually lives

| Gap category | Approx volume | Authoritative source | Access method |
|---|---:|---|---|
| Original-signed PDFs of every normative doc | 167k (cross-ref of vbpl) | **`congbao.chinhphu.vn`** — Official Gazette | HTML scrape + signed-PDF download |
| Court judgments and rulings | ~1.5–2 M | **`congbobanan.toaan.gov.vn`** — Court Rulings DB | search-portal scrape (needs SSL CA fix) |
| Bộ Tài chính công văn (tax / fiscal guidance) | 50k+ | **`mof.gov.vn`**, **`gdt.gov.vn`** (Tax), **`customs.gov.vn`** | per-portal scrape |
| Bộ Y tế công văn | 10k+ | **`moh.gov.vn`** | per-portal scrape |
| Bộ Lao động công văn | 5k+ | **`molisa.gov.vn`** | per-portal scrape |
| Other ministry công văn (~20 ministries) | 30–50k | each ministry's portal | per-portal scrape |
| Provincial-level non-normative | very large tail | 63 province portals (`vbpl.<city>.gov.vn` pattern) | per-portal scrape |
| Drafts of laws + legislative process metadata | a few thousand active | **`duthaoonline.quochoi.vn`**, **`quochoi.vn`** | HTML scrape (cookie challenge) |
| Pre-1945 / colonial-era documents | very small | National Archives (`luutruquocgia.gov.vn`) | not online for most; physical archive |

## Tier 1 — high value, manageable

### A. `congbao.chinhphu.vn` — Official Gazette of the Government

Why: every normative document gazetted in Vietnam goes through here. Three things `vbpl.vn` does not have:

1. The original **signed PDF** with Government seal — useful as a citation primary source.
2. The **gazette issue & page numbers**, which legal references cite.
3. A handful of older or specialised docs that vbpl never indexed.

Probe results:
- `robots.txt`: `User-agent: * / Allow: /`
- Stack: ASP.NET MVC (Kestrel header)
- No public JSON API surfaces; all routes 302 to home unless an aspx form is followed
- Documents are at URLs like `https://congbao.chinhphu.vn/_layouts/cbdt/View.aspx?ItemID={GUID}` (SharePoint-WCM pattern) — the `ItemID` is a GUID per gazette item

Plan:
1. Walk the year/issue index pages: `/?_t=cong-bao-by-year&year=2025`, `/?_t=cong-bao-issue&id=...`
2. Each issue page lists items; scrape per-item ItemIDs
3. Fetch each item page; parse metadata + the signed-PDF URL (`/api/download/stream?id=...`)
4. Cross-reference by `docNum` against the vbpl manifest — most will overlap; the goal is to attach the gazette PDF URL + issue/page citation to the existing record

Expected volume: ~150k items (matches vbpl ± a few thousand). New-to-corpus: ~5k unique + signed PDFs for all.

Suggested files:
```
pipeline/
  7.get-issues-congbao.ts        — walk year × issue index → write issues.ndjson
  8.get-items-congbao.ts         — for each issue, list items → items.ndjson
  9.attach-pdf-congbao.ts        — for each item, fetch detail + record the signed-PDF URL
```

### B. `congbobanan.toaan.gov.vn` — Court Rulings

Why: case law is what answers "given law X, what would a court actually do?" The single biggest enrichment for an AI/RAG over Vietnamese law. Out of strict "law" scope but **enormously useful for downstream applications**.

Probe issues: SSL chain incomplete from cli `curl` (`unable to get local issuer certificate`). Browser handshakes work; can fix in code with `tls.connect({ rejectUnauthorized: ... })` or by adding the gov-vn intermediate to the trust store (preferred) or ignore SSL verification (not recommended).

Plan: build a parallel pipeline (`court-*` prefix) with the same shape — list, detail, markdown.

Expected volume: ~1.5–2 M judgments. Throttle aggressively, run for weeks.

Suggested files:
```
pipeline/
  10.get-latest-court.ts
  11.get-detail-court.ts
  12.to-markdown-court.ts
```

## Tier 2 — per-ministry portals

For each ministry, the structure is broadly the same: a Vue/.NET portal with a "tra cứu văn bản" search and document detail pages. Build **one configurable scraper** that takes a per-ministry config:

```ts
interface MinistryPortalConfig {
  readonly slug: string // e.g. 'mof', 'moh'
  readonly name: string // 'Bộ Tài chính'
  readonly listingUrl: string // search-results URL with {pageNumber} placeholder
  readonly listingItemSelector: string // CSS selector for one row in the result list
  readonly detailUrlAttr: string // CSS selector → href for detail page
  readonly detailContentSelector: string // CSS selector for the doc body in the detail page
  readonly nextPageStrategy: 'querystring' | 'form-post'
}
```

Then a single `pipeline/N.scrape-ministry.ts` runs against any config. Use **Cheerio** (`pnpm add -D cheerio`) for HTML parsing — strict TS, no `any`, fast.

Priority list (by likely volume of meaningful content):

| Tier | Ministry | Portal | Notes |
|---|---|---|---|
| 1 | Tổng cục Thuế (Tax) | `gdt.gov.vn` | Massive tax-guidance corpus, heavily cited in practice |
| 1 | Bộ Tài chính | `mof.gov.vn` | Vue SPA — needs `chromium` headless OR find their internal API |
| 1 | Tổng cục Hải quan (Customs) | `customs.gov.vn` | Customs procedural guidance |
| 2 | Bộ Y tế | `moh.gov.vn` | Health, large COVID-era backlog |
| 2 | Bộ LĐ-TB&XH | `molisa.gov.vn` | Labor & social affairs |
| 2 | Bộ TT&TT | `mic.gov.vn` | Information & comms |
| 2 | Bộ GD&ĐT | `moet.gov.vn` | Education |
| 2 | Bộ Công an | `mps.gov.vn` | Public security (some may be access-restricted) |
| 3 | Bộ TN&MT | `monre.gov.vn` | Environment & natural resources |
| 3 | Bộ Xây dựng | `xaydung.gov.vn` | Construction |
| 3 | Bộ Giao thông | `mt.gov.vn` | Transport |
| 3 | Bộ Quốc phòng | `mod.gov.vn` | Defense |

Each ministry needs a one-time discovery: probe the search page, find the listing/detail HTML structure, fill the config. About 1–2 hours of probing per ministry.

## Tier 3 — provincial portals — **not needed**

Probed (2026-05-07): `vbpl.<province>.gov.vn` does not resolve for any of the 10 large provinces I tested (hanoi, hochiminhcity, danang, haiphong, cantho, thanhhoa, nghean, binhduong, dongnai, khanhhoa). All return DNS/connection failure.

Provincial-level normative documents are already published to the central `vbpl.vn` database. Our smoke-test samples confirm this: `23/2026/QĐ-UBND` (Thái Nguyên), `33/2026/QĐ-UBND` (Quảng Ngãi), `1364/QĐ-UBND` etc. — all province-issued, all in our manifest. **No provincial-tier crawl is required for normative law.**

If the project later needs *non-normative* provincial documents (notices, internal circulars), each province has its own portal at `<province>.gov.vn` — but those are not standardized and would each need a one-off scraper.

## Tier 4 — specialised gov sources

| Source | URL | What |
|---|---|---|
| National Assembly drafts | `duthaoonline.quochoi.vn` | Drafts + comments + voting outcome — legislative process metadata |
| National Assembly documents | `quochoi.vn/vanbanphapluat` | Luật, Nghị quyết, Pháp lệnh — overlap w/ vbpl, plus the *bill record* (stenographic notes etc.) |
| Cổng Dịch vụ công | `dichvucong.gov.vn` | Administrative procedures (TTHC) — what citizens actually file. Each procedure references the laws it implements. Useful for cross-linking. |
| Cổng thông tin Chính phủ | `chinhphu.vn` | Press releases + decree announcements. Not normative; useful as supporting context. |
| Bộ Tư pháp portal | `moj.gov.vn` | Parent of vbpl. Has its own announcements + studies, not in vbpl. |

## Recommended sequencing

Given the project's apparent goal (AI/RAG grounding for Vietnamese law), do:

1. **Finish Phase 1–3 for vbpl** — running now, ~11 days at default throttle. **No further work needed for normative law.**
2. **Phase 4–6 (Official Gazette `congbao.chinhphu.vn`)** — adds signed-PDF citations, gazette issue numbers, and a small number of missing items. ~3 weeks part-time work.
3. **Phase 7–9 (Court rulings `congbobanan`)** — separate corpus, ~2M items, ~6 weeks at 1 RPS. Treat as a parallel project.
4. **Phase 10+ (ministry / per-source one-offs for công văn)** — long tail. Build the configurable ministry scraper, add ministries one at a time as needs arise. Tax (`gdt.gov.vn`) first if you have any tax/fiscal use case.

(Provincial tier removed — vbpl.vn already includes provincial-level normative law.)

Skip `thuvienphapluat.vn` and other commercial aggregators: their content signals (`ai-train=no`) make them legally unusable for an AI/RAG grounding project, and everything they have that's authoritative is reachable from one of the sources above.

## Concrete next probes to run

When ready to start Phase 4, probe:

```bash
# Confirm congbao item-detail URL pattern
curl -s 'https://congbao.chinhphu.vn/_layouts/cbdt/View.aspx?ItemID=<a-known-guid>' -A 'Mozilla/5.0' | grep -oE 'href="/api/download/stream[^"]*"' | head

# Confirm provincial portals share the API
for P in hanoi hochiminhcity danang haiphong cantho; do
  curl -s -X POST "https://vbpl.${P}.gov.vn/api/qtdc/public/doc/all" \
    -H 'Content-Type: application/json' \
    -d '{"sortDirection":"desc","sortBy":"issueDate","pageSize":1,"pageNumber":1}' \
    -o /dev/null -w "  ${P} → %{http_code}\n" --max-time 15
done

# Confirm court-rulings TLS chain + landing
curl -sk 'https://congbobanan.toaan.gov.vn/' -A 'Mozilla/5.0' --max-time 15 | grep -oE '<title>[^<]+|/api/[a-z/_-]+' | head
```

Run those and feed the results into the next iteration of this document.
