# crawler

Per-source pipelines for legal-document acquisition. Outputs are namespaced under `data/<source>/` so each source is isolated.

```
crawler/
├── pipeline/
│   ├── _lib.ts                              shared schemas, paths, helpers
│   ├── 1.get-latest-vbpl.ts                 listing crawler with catch-up
│   ├── 2.get-detail-vbpl.ts                 detail crawler with throttle + resume
│   ├── 3.to-markdown-vbpl.ts                NDJSON → markdown converter
│   ├── 4.get-latest-thuvienphapluat.ts      (planned)
│   ├── 5.get-detail-thuvienphapluat.ts      (planned)
│   └── 6.to-markdown-thuvienphapluat.ts     (planned)
├── data/
│   └── vbpl/
│       ├── list.ndjson                      one listing item per line (~280 MB at 167k docs)
│       ├── list-state.json                  last run summary
│       ├── list.log
│       ├── details.ndjson                   one detail record per line
│       ├── details-done.txt                 ids of successfully-fetched details (resume marker)
│       ├── details-dead-letter.ndjson       ids that exhausted retries or hit permanent 4xx
│       ├── details-state.json
│       ├── details.log
│       ├── markdown/<id>.md                 frontmatter + Vietnamese body
│       ├── markdown-done.txt                resume marker for step 3
│       └── markdown.log
└── README.md
```

Run with `tsx` (already in the root `package.json` devDependencies):

```bash
# Step 1 — fetch new listing entries (skips known ids; ~24 min on first full run, seconds on incremental)
npx tsx crawler/pipeline/1.get-latest-vbpl.ts

# Step 2 — fetch details (resumable, throttled)
npx tsx crawler/pipeline/2.get-detail-vbpl.ts

# Step 3 — convert details to markdown
npx tsx crawler/pipeline/3.to-markdown-vbpl.ts

# Sample run for any step:
CRAWLER_LIMIT=20 npx tsx crawler/pipeline/2.get-detail-vbpl.ts
```

## Continue mechanisms

Each step is independently resumable and side-effect-safe to re-run.

| Step | Resume signal | Stop signal |
|---|---|---|
| 1 listing | `data/<src>/list.ndjson` ids loaded into Set | `CRAWLER_LIST_STOP_AFTER_KNOWN` consecutive already-known ids (default 1000 = full page) |
| 2 detail | `details-done.txt` ∪ `details-dead-letter.ndjson` ids → skip set | iterates listing, only processes pending ids |
| 3 markdown | `markdown-done.txt` ids → skip set | iterates `details.ndjson`, only writes new |

Hard-stop: set `CRAWLER_LIMIT=N` on any step.

## Step 2 — environment knobs

| Var | Default | Meaning |
|---|---|---|
| `CRAWLER_MIN_DELAY_MS` | `1000` | minimum random delay between requests |
| `CRAWLER_MAX_DELAY_MS` | `10000` | maximum random delay between requests |
| `CRAWLER_DETAIL_TIMEOUT_MS` | `45000` | per-request timeout |
| `CRAWLER_DETAIL_MAX_RETRIES` | `4` | retry count on transient errors (5xx, network, timeout, 408/425/429) |
| `CRAWLER_LIMIT` | unlimited | stop after N processed (success + dead-letter) |
| `CRAWLER_USER_AGENT` | `openclaw-edu-vn-crawler/0.1 …` | sent on every request |

Permanent 4xx (anything other than 408/425/429) is dead-lettered immediately — no retry. Observed: a small fraction of doc UUIDs return `400 invalid.document.entity.not.found` (entity removed server-side); these go straight to dead-letter and don't waste backoff time.

## Step 1 — environment knobs

| Var | Default | Meaning |
|---|---|---|
| `CRAWLER_LIST_PAGE_SIZE` | `1000` | items per request |
| `CRAWLER_LIST_DELAY_MS` | `300` | delay between pages |
| `CRAWLER_LIST_STOP_AFTER_KNOWN` | `=PAGE_SIZE` | stop when this many *consecutive* ids are already known |
| `CRAWLER_LIST_TIMEOUT_MS` | `60000` | per-request timeout |
| `CRAWLER_LIST_MAX_RETRIES` | `5` | retry count on errors |

## Wall-clock projections (167,660 docs, single IP)

Step 1 (listing only): **~24 minutes** full bootstrap, **seconds** for incremental refresh.

Step 2 (details), single connection by `[MIN..MAX]` delay:

| `MIN..MAX` | avg per doc (incl. ~200 ms request) | total |
|---|---|---|
| 500..2000 | ~1.45 s | ~2.8 days |
| 1000..3000 | ~2.2 s | ~4.3 days |
| 1000..5000 | ~3.2 s | ~6.2 days |
| 1000..10000 (default) | ~5.7 s | ~11 days |

Step 3 (markdown): pure CPU/disk, ~1000 docs/sec → ~3 minutes for 167k.

## Detail response shape (data after parsing)

```text
{
  id              : uuid string
  docType         : { id, name, code }            e.g. name="Quyết định", code="QĐ"
  docNum          : string | null                 e.g. "23/2026/TT-BCT"
  title           : string | null
  issueDate       : ISO date | null
  effFrom         : ISO date | null
  effTo           : ISO date | null
  effStatus       : { code, name } | null         e.g. code="CCHL", name="Chưa có hiệu lực"
  documentContent : { id, title, content }        content is the full HTML body
  documentContentEn: { content } | null           English version when present
  agencyName      : string | null
  organization    : object (nested agency tree)
  provisionTree   : unknown[]                     structured provision tree
  references      : unknown[]                     cross-references to other docs
  documentRelatedList: array of { relatedType, fileName }
                                                  relatedType "1"=pdf, "5"=html
  hasContent, hasOriginalPdf, hasAIProcessed: boolean
}
```

Average detail size: **~30 KB JSON**. Estimated total: 167,660 × 30 KB ≈ **5 GB raw NDJSON**. Gzip ~1–2 GB.

## Corpus scope notes (vbpl.vn)

`vbpl.vn` is the **National Database of Legal Normative Documents** (CSDLQG VBQPPL) operated by the Ministry of Justice. Contains *văn bản quy phạm pháp luật* — documents with regulatory force. From 1945 (founding sắc lệnh) through today.

- Robots: `Allow: /` for all UAs; the data API host (`vbpl-bientap-gateway.moj.gov.vn`) has no robots restrictions. Public-domain government data.
- Top categories: Quyết định 89,540 · Nghị quyết 27,267 · Thông tư 16,900 · Bản dịch văn bản 10,953 · Chỉ thị 8,504 · Nghị định 5,176 · Thông tư liên tịch 3,496 · Văn bản hợp nhất 2,008 · Sắc lệnh 981 · Công văn 732 · Luật 593 · Pháp lệnh 247 · Bộ luật 17.
- Excluded by design (not in this 167k):
  - Bản án / quyết định Tòa án (court rulings) — separate database `congbobanan.toaan.gov.vn`, ~1.5–2 M items.
  - Most công văn (official letters from ministries) — 732 here vs. likely 100k+ on commercial aggregators.
  - Non-normative administrative decisions, internal guidance.

See `docs/alt-sources.md` for the plan to backfill the gap from individual ministry portals.
