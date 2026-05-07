# Cao đẳng OpenClaw — Implementation Plan (v3, dual-domain CDN)

Mapping the spec (`requirement.md` v1.0) onto a concrete build sequence. Updated 2026-05-07 after two product decisions:

1. **Agents-first**: every URL except `/` returns raw `text/markdown`. Drop per-page styling.
2. **Dual-domain CDN**: serve all markdown content from `cdn-openclaw-edu.opencloud.com.vn` (an R2 bucket + custom domain). The `openclaw.edu.vn` host serves only the human-facing landing page. Every markdown citation an agent makes embeds the **OpenCloud** brand alongside **OpenClaw** — co-marketing through the citation graph.

---

## 0. Architecture (current)

Two domains, two roles:

| Domain | Role | Surface |
|---|---|---|
| `openclaw.edu.vn` | Human marketing | One styled landing page (Cloudflare Pages, openclaw.ai-aesthetic) |
| `cdn-openclaw-edu.opencloud.com.vn` | Agent corpus | All `.md` content — Khoa, Ngành, Môn, Trợ lý, học bạ, văn bằng, văn bản gốc, knowledge, llms.txt, manifest.json, sitemap.xml. R2 bucket bound to a Cloudflare custom domain. |

**Why two domains:** every URL an agent cites embeds `opencloud.com.vn` in conversations, RAG indices, browser history, server logs — co-marketing the OpenCloud / TheCodeOrigin brand through the citation graph. The `.edu.vn` domain stays the canonical "school" name; the `.opencloud.com.vn` domain becomes the de-facto distribution surface.

**This collapses the whole frontend to:**
1. `pages/index.vue` — the marketing home
2. Three pipeline scripts that publish content to R2
3. **Zero** Pages Functions for content (R2 custom domain serves the `.md` directly with native Cloudflare CDN caching)

If we later want function-level features (404 fallback markdown, on-the-fly disclaimer injection, analytics tagging), wrap the R2 bucket in a Worker on the same custom domain. Defer that until needed — for now, raw R2 is enough.

---

## 1. Status snapshot

| Track | State | Notes |
|---|---|---|
| Static site shell (Nuxt 4 + Cloudflare Pages) | ✅ done | Build/lint/typecheck green |
| Crawler — phase 0 (POC, 10 docs) | ✅ done | |
| **Dual-domain POC end-to-end (10 docs)** | ✅ done | See §1.1. `dev.openclaw.edu.vn` + `cdn-openclaw-edu.opencloud.com.vn` both active. |
| Crawler — phase 1 listing | ✅ done | 167,675 entries |
| Crawler — phase 1 detail | 🟡 in progress | ~10k of 167k done, ETA ~21h |
| Crawler — phase 1 markdown convert | 🟡 90s loop | Gap to `details-done` <250 |
| Phase 0 legal review of republication | ⚠️ unresolved | Spec §20.2 — must close before publishing |
| Brand identity (home only, openclaw.ai-style) | ❌ not started | Tokens captured below. POC ships a placeholder list of 10 doc links — replaced in §5.5. |
| **Storage architecture for 170k+ .md files** | 🟡 pattern proven | POC bucket `openclaw-edu-vn-md-poc` validates the dual-domain CDN. Production bucket `openclaw-edu-vn-md` still TODO via §5.2. |
| ~~**Markdown-serving Pages Function**~~ | n/a | Dropped from scope. R2 custom domain serves `.md` directly with native CDN caching (§0); confirmed by POC. |
| Khoa Luật MVP content | ❌ blocked on partner | Open question §20.1 |

---

## 1.1. POC delivered (2026-05-07)

Phase-0 POC for the dual-domain CDN is live. The POC uses temporary names so production names stay free for Phase 1 cutover.

| Surface | URL | Notes |
|---|---|---|
| Project home (placeholder) | `https://dev.openclaw.edu.vn` | Pages custom domain — SSL active. Renders a static list of the 10 sample doc links. Replaced by §5.5 openclaw.ai-style home; final production target is the `openclaw.edu.vn` apex (§9 step 8). |
| Markdown CDN | `https://cdn-openclaw-edu.opencloud.com.vn/van-ban-goc/poc/<slug>.md` | R2 custom domain — SSL active. Returns `Content-Type: text/markdown; charset=utf-8`, ETag, byte-for-byte source match, Vietnamese diacritics intact. |
| R2 bucket (POC) | `openclaw-edu-vn-md-poc` | Holds 10 hand-picked docs spanning Quyết định / Thông tư / Nghị quyết / Nghị định / VBHN / TTLT / Luật / Pháp lệnh / NQLT. Distinct from the production bucket `openclaw-edu-vn-md`. |
| Pages project | `openclaw-edu-vn` | Reused for production — only the bound custom domain swaps from `dev.` to apex when ready. |

**What the POC validated**
- Dual-domain split works end-to-end (R2 custom domain + Pages custom domain + correct `Content-Type` + Vietnamese UTF-8 clean).
- The POC ships the markdown that crawler step 3 already produced (with `vbpl.vn` frontmatter); spec §11.5 frontmatter rewrite is deferred to `pipeline/4`.
- `pages/index.vue` had to be switched off `@nuxt/content` and `routeRules: { '/': { prerender: true } }` added — the cloudflare-pages preset does not auto-prerender `/` for this project until a route hint is set. Carry this fix forward to the production home.
- All 6 acceptance criteria from `docs/poc-plan.md` §4 PASS (51/51 P0/P1 cases green; full results in `.claude/workspace/test-cases/poc-r2-cdn-001.results.csv`).
- Reviews: `.claude/workspace/reviews/{security,principle}-poc-r2-cdn.md` (clean after one round of fixes).

**Cloudflare token scopes confirmed needed** (the original token was account-only; zone scopes had to be added)
- `Account → Cloudflare Pages → Edit`
- `Account → Workers R2 Storage → Edit`
- `Zone → Zone → Read`
- `Zone → DNS → Edit`
- `Zone → SSL and Certificates → Edit`
- `User → User Details → Read` (only needed for `wrangler whoami`; not required for any operation)

**Deferred from POC, picked up by Phase 1 backlog**
- Production bucket `openclaw-edu-vn-md` (§5.2 — pipeline 4–6 outputs).
- Re-bind custom domain `cdn-openclaw-edu.opencloud.com.vn` from the POC bucket to the production bucket once §5.2 lands. The DNS record is auto-managed by R2 and does not need manual rotation.
- Bind `openclaw.edu.vn` (apex) to the Pages project. Currently only `dev.` is bound; the apex was unbound during POC cleanup.
- Full corpus crawl + ~500k legal-doc target.
- openclaw.ai-style home (§3, §5.5) replacing the placeholder.
- Phase-0 legal review of republication (still unresolved — spec §20.2).

**Code in repo from this POC** (uncommitted on `main`)
- `app/pages/index.vue` — static placeholder home (10 doc list, switches `cdnBase` between `r2.dev` direct and `cdn-openclaw-edu.opencloud.com.vn`).
- `nuxt.config.ts` — `routeRules: { '/': { prerender: true } }`.
- `.gitignore` — added `build`.
- `build/poc-r2/` (gitignored) — staging dir, 10 markdown copies, `manifest.json`, `cdn-host.txt`, `home-url.txt`, helper scripts `deploy-pages.mjs` / `upload-pages.mjs`.

---

## 2. Cloudflare Pages limits — confirmed problem, decided solution

### 2.1. The problem

Cloudflare Pages hard limits:
- **20,000 files per deployment**
- 25 MiB per individual file
- 26 MiB per HTTP response

Phase-1 vbpl crawl alone produces **167,675 .md files** = 8.4× over limit. Spec §11.5 sets a target of **~500,000**. Pages-only deployment is impossible.

### 2.2. The solution: dual domain, R2 + custom domain

```
   GET https://openclaw.edu.vn/
        ─────────────────────────────►  Cloudflare Pages
                                        • pages/index.vue (the marketing home)
                                        • static assets only — well under 20k file limit


   GET https://cdn-openclaw-edu.opencloud.com.vn/khoa/luat/khoa.md
   GET https://cdn-openclaw-edu.opencloud.com.vn/van-ban-goc/2020/luat-dn-2020.md
   GET https://cdn-openclaw-edu.opencloud.com.vn/llms-full.txt
        ─────────────────────────────►  R2 bucket  openclaw-edu-vn-md
                                        bound to custom domain
                                        cdn-openclaw-edu.opencloud.com.vn
                                        • Native Cloudflare CDN caching
                                        • Each object stored with
                                          Content-Type: text/markdown; charset=utf-8
                                        • ETag automatic
```

**R2 bucket layout** mirrors the URL path one-to-one:

```
openclaw-edu-vn-md/
├── khoa/luat/khoa.md
├── khoa/luat/nganh/luat-kinh-te/mon/hop-dong-dich-vu.md
├── tro-ly/luat-kinh-te/ho-so.md
├── van-ban-goc/2020/luat-doanh-nghiep-2020.md
├── knowledge/khoa/luat/chung/bo-luat-dan-su-2015.md
├── llms.txt
├── llms-full.txt
├── sitemap.xml
└── api/manifest.json
```

**Cost** at 5 GB stored, 1M requests/month: ≈ **$0.10/month** on R2; CDN delivery via Cloudflare is free for cached responses.

### 2.3. Custom domain setup (one-off, ~15 min)

1. In Cloudflare dashboard → R2 → bucket → Settings → "Custom Domains" → add `cdn-openclaw-edu.opencloud.com.vn`.
2. Cloudflare auto-creates the CNAME under the `opencloud.com.vn` zone (assumed already on Cloudflare).
3. Cloudflare provisions the SSL cert.
4. Default `Cache-Control` policy: cache for 12 hours at edge, respect upload-time `Cache-Control` headers if set.

No Worker needed for Phase 1. If we later want injection logic (custom 404, disclaimer footer, A/B tags), drop in a Worker bound to the same domain.

### 2.4. Indexing strategy for agents

Agents discover the corpus via index files at the CDN root (all generated at upload time):

| File | Purpose |
|---|---|
| `https://cdn-openclaw-edu.opencloud.com.vn/llms.txt` | High-level navigation. Lists the Khoa, the Trợ lý, the văn-bản-gốc top-level groupings. |
| `…/llms-full.txt` | Every public path, one per line. Agents enumerate the corpus from here. |
| `…/sitemap.xml` | Standard sitemap for search engines. |
| `…/<any-folder>/index.md` | Per-folder index listing children + frontmatter highlights. |
| `…/api/manifest.json` | Machine-readable map: `{ paths, khoa, tro-ly, stats }` at deploy time. |

The `openclaw.edu.vn` landing page links to `…/llms.txt` so a curious human or agent visiting the human surface gets a one-click jump to the full corpus index.

### 2.5. Build & deploy pipeline

```
crawler/data/vbpl/markdown/<id>.md            (the crawl output, ~167k files)
                  │
                  ▼
crawler/pipeline/4.to-vanban-goc-vbpl.ts      (NEW)
   • re-key from <id>.md to year-sharded structure
   • rewrite frontmatter to match spec §11.5
   • inject `canonical_url: https://cdn-openclaw-edu.opencloud.com.vn/...`
   • output: ./build/r2-staging/van-ban-goc/<year>/<slug>.md
                  │
                  ▼
crawler/pipeline/5.build-indexes.ts            (NEW)
   • walks ./build/r2-staging/, generates llms.txt, llms-full.txt,
     index.md per folder, manifest.json, sitemap.xml
   • all internal links use the cdn-openclaw-edu.opencloud.com.vn host
                  │
                  ▼
crawler/pipeline/6.upload-r2.ts                (NEW)
   • uploads ./build/r2-staging/ to R2 bucket openclaw-edu-vn-md
   • sets Content-Type: text/markdown; charset=utf-8 on every .md
   • sets Cache-Control: public, max-age=43200, stale-while-revalidate=86400
   • only uploads files whose sha256 changed (incremental)
                  │
                  ▼
nuxt generate → .output/public                 (existing)
   • landing page only
                  │
                  ▼
wrangler pages deploy .output/public           (existing)
```

The crawler scripts (1, 2, 3) stay as-is. The new scripts 4–6 are pure transformations and uploads.

---

## 3. Brand for the landing page (openclaw.ai-aligned)

Captured from `https://openclaw.ai` via Chrome DevTools — full screenshot at `docs/openclaw-ai-reference.png`.

### 3.1. Color tokens (use as CSS vars)

| Token | Value | Use |
|---|---|---|
| `--bg-deep` | `#050810` | page bg |
| `--bg-surface` | `#0a0f1a` | section bg |
| `--bg-elevated` | `#111827` | card bg |
| `--coral-bright` | `#ff4d4d` | primary accent (logo, CTAs) |
| `--coral-mid` | `#e63946` | hover states |
| `--coral-dark` | `#991b1b` | logo gradient end, depth |
| `--cyan-bright` | `#00e5cc` | secondary accent (hero gradient end) |
| `--cyan-mid` | `#14b8a6` | secondary hover |
| `--text-primary` | `#f0f4ff` | body text |
| `--text-secondary` | `#8892b0` | meta text |
| `--text-muted` | `#5a6480` | de-emphasized |
| `--border-subtle` | `rgba(136,146,176,.15)` | card outline |
| `--border-accent` | `rgba(255,77,77,.3)` | featured card outline |
| `--surface-card` | `rgba(10,15,26,.65)` | card frosting |

### 3.2. Typography

| Role | Font | Source |
|---|---|---|
| Display (h1, h2) | **Clash Display** weight 700 | Fontshare (free) |
| Body | **Satoshi** | Fontshare (free) |
| Mono (code blocks) | SF Mono / Fira Code / JetBrains Mono | system / self-host |

H1 baseline: 72 px, weight 700, gradient `#f0f4ff → #00e5cc`.

Both faces are free under Fontshare's license — load via `@nuxt/fonts` (already a dep).

### 3.3. Logo

Red coral-gradient claw mark, gradient `#ff4d4d → #991b1b`. Spec §19 wants a "huy hiệu trường tròn" with "CAO ĐẲNG OPENCLAW" framing — for the .edu.vn site I'd reconcile by:
- Same coral-gradient claw
- Round seal frame around it with "CAO ĐẲNG OPENCLAW · EST. 2026" arcing top + bottom
- Honors both the openclaw.ai aesthetic and the spec's academic-seal guideline

### 3.4. Landing-page sections

Mirror openclaw.ai's structure, adapted to the school context:

1. **Hero**: huy hiệu + "Cao đẳng OpenClaw" wordmark + tagline ("Trường nghề đào tạo Trợ lý chuyên ngành cho doanh nghiệp Việt Nam") + dual CTA ("Khám phá Trợ lý" / "Khám phá giáo trình")
2. **What it is** (one paragraph, the §3 "Tuyên ngôn")
3. **Three Khoa cards** (Luật, Tài chính-Kế toán, Quản trị Vận hành) with tile colors
4. **Quick Start for agents** — code block showing how to install a Trợ lý: `fetch('https://openclaw.edu.vn/tro-ly/luat-kinh-te/cai-dat.md')` example
5. **What's included** — raw-markdown URLs, llms.txt, knowledge subsystem
6. **Văn bằng đã cấp counter** + recent diplomas list with mã định danh
7. **Footer**: liên hệ Hội đồng học thuật, sitemap link, .edu.vn legal mention

No mascots, no whimsy — academic-restraint subset of the openclaw.ai aesthetic. Spec §19 still applies in spirit; we just lean dark + accents instead of navy/burgundy.

---

## 4. Phase mapping (revised)

| Spec phase | Engineering deliverables under new architecture | Status |
|---|---|---|
| **Phase 0** | Manual POC done; legal review still open | Engineering ✅ · Legal ❌ |
| **Phase 1** | (a) Full vbpl crawl (b) `pipeline/4.to-vanban-goc-vbpl.ts` (c) `pipeline/5.build-indexes.ts` (d) `pipeline/6.upload-r2.ts` (e) Pages Function `[[path]].ts` (f) Home page | (a) running; (b)–(f) below |
| **Phase 2** | Khoa Luật + Luật Kinh tế MVP — author 5 môn .md files, 1 đồ án, 1 Trợ lý's 6 .md files, the văn bằng. Upload to R2 alongside the corpus. No new code. | Blocked on partner |
| **Phase 3+** | Same — pure content authoring, no engineering | After Phase 2 |

The architectural shift collapses Phase 2's engineering scope to **zero**. Phase 2 is purely an authoring + partner-relationship phase.

---

## 5. Phase-1 backlog (concrete sprint, doable while crawler runs)

### 5.1. Crawler — finish what's running

- [ ] Detail crawl reaches 167k (~21 h, autonomous).
- [ ] Step 3 markdown loop continues on 90 s cadence.

### 5.2. Pipeline 4–6 (NEW — main engineering work this sprint)

- [ ] `pipeline/4.to-vanban-goc-vbpl.ts`
  - reads `data/vbpl/details.ndjson`
  - outputs `build/r2-staging/van-ban-goc/<year>/<so-hieu-slug>.md` with spec §11.5 frontmatter
  - skip records where the converted file already exists with matching checksum (resumable)
  - shard by year of `ngay_ban_hanh`; ~85 buckets, ~2k files each
- [ ] `pipeline/5.build-indexes.ts`
  - walks `build/r2-staging/`
  - emits `llms.txt`, `llms-full.txt`, per-folder `index.md`, `sitemap.xml`, `api/manifest.json`
- [ ] `pipeline/6.upload-r2.ts`
  - uses `wrangler r2 object put` (or the JS API) to upload changed files only
  - tracks an upload-state.json with content hashes so re-runs are incremental

Smoke target: with 10k crawled, the three steps run end-to-end producing a small R2 bucket we can `curl` against to validate the function.

### 5.3. R2 custom-domain provisioning (no Worker for Phase 1)

- [x] ~~Create R2 bucket `openclaw-edu-vn-md`.~~ — POC bucket `openclaw-edu-vn-md-poc` exists; production bucket TODO (will be created by `pipeline/6` first run).
- [x] Confirm `opencloud.com.vn` zone is on Cloudflare and we can edit its DNS. — both `opencloud.com.vn` and `openclaw.edu.vn` confirmed on the same Cloudflare account.
- [x] In R2 → bucket → Settings → Custom Domains → add `cdn-openclaw-edu.opencloud.com.vn`. — done via API; SSL + ownership active. Currently bound to the POC bucket; rebind to production bucket as part of §5.2 cutover.
- [x] Wait for cert provisioning (~2–5 min). — completed.
- [x] Smoke test: `curl https://cdn-openclaw-edu.opencloud.com.vn/...` returns markdown. — verified against POC content (10 docs, all 200, correct headers, body matches).
- [ ] Re-bind `cdn-openclaw-edu.opencloud.com.vn` from `openclaw-edu-vn-md-poc` → `openclaw-edu-vn-md` once §5.2 lands. R2 auto-manages the CNAME; no manual DNS edit.
- [ ] Bind `openclaw.edu.vn` apex to the Pages project (currently `dev.openclaw.edu.vn` is the only bound host). Add CNAME `openclaw.edu.vn → openclaw-edu-vn.pages.dev` (proxied) in the `openclaw.edu.vn` zone after the production home page replaces the placeholder.

`wrangler.jsonc` doesn't need an R2 binding for Phase 1 (the Pages site doesn't read from R2 at runtime). The R2 bucket is just a destination for `pipeline/6.upload-r2.ts`. We use a separate `wrangler.toml` or env var pointing at the bucket for the upload step.

### 5.4. (Reserved for future Worker)

Add only if/when we need:
- Custom 404 markdown ("here are similar paths…")
- Disclaimer footer injection
- Per-request analytics tagging
- Authn for private knowledge

Skip for now.

### 5.5. Home page (NEW)

- [ ] `pages/index.vue` — single component, full marketing page, no SSR runtime needed (still nuxt generate)
- [ ] Self-host Clash Display + Satoshi via `@nuxt/fonts`
- [ ] CSS vars from §3.1 above
- [ ] Sections from §3.4
- [ ] No interactive runtime requirements — pure CSS animations are fine
- [ ] Visual diff against `docs/openclaw-ai-reference.png` until parity

### 5.6. Validation pipeline

- [ ] `pnpm test:frontmatter` — Zod-validate every `.md` in `build/r2-staging/` matches the right collection schema
- [ ] `pnpm test:llms` — assert `llms-full.txt` paths resolve as R2 objects after upload
- [ ] CI workflow that runs (4) → (5) → frontmatter check → upload to R2 → deploy Pages on every push

### 5.7. Re-crawl scheduling

- [ ] GitHub Actions weekly cron: `1.get-latest-vbpl.ts` (incremental), then `2.get-detail-vbpl.ts`, then `3.to-markdown-vbpl.ts`, then `4` `5` `6`
- [ ] Cron writes a status badge to `data/vbpl/last-sync.json` published to R2

---

## 6. Open decisions (unchanged from v1)

| # | Question | Recommendation |
|---|---|---|
| 1 | Trưởng khoa Luật — start outreach now? | Yes — longest fuse |
| 2 | Legal review of republication | Engage now — gates everything visible |
| 3 | Diploma lookup public/gated | Public; rate-limit at CDN |
| 4 | Engine targets | Claude Code + OpenClaw first |
| 5 | Diploma revocation policy | Document it before first issue |
| 6 | `.edu.vn` domain criteria | Verify VNNIC requirements |

Decisions resolved by the dual-domain shift:

| # | Question | Resolution |
|---|---|---|
| 7 | R2 + Function or D1? | ✅ **R2 + custom domain, no Function** for Phase 1. Add a Worker only when injection logic is actually needed. |
| 8 | Disclaimer injection point | ✅ **In-source markdown** for now (Phase 1) — the boundary/disclaimer line is small, agents see it as part of the document. If we later want centralised editing, drop in a Worker that appends a footer. |

New decisions opened by the dual-domain shift:

| # | Question | Recommendation |
|---|---|---|
| 9 | Cross-link policy: should markdown files reference each other via the CDN host, the .edu.vn host, or relative paths? | **Relative paths** in cross-references between `.md` files (so the corpus is portable; an agent that downloads it locally can resolve internally). **Absolute CDN URLs** in the canonical_url frontmatter and llms-full.txt. |
| 10 | Should `openclaw.edu.vn` ALSO mirror `/khoa/...` etc. (via a Pages Function backed by the same R2)? | **No** — keep brand-embedding clean. One canonical content host = `cdn-openclaw-edu.opencloud.com.vn`. The .edu.vn site is the trust anchor and marketing surface only. |
| 11 | Authn or rate-limit on the CDN? | **No authn**, but enable Cloudflare's bot-fight + a generous rate limit (1000 req/min/IP) to prevent abusive crawls without blocking legit agents. |

---

## 7. Critical path (revised)

```
[Legal review] ────────────────┐
                               ├─→ [pipeline 4–6] ──→ [R2 populated] ──→ [function serves] ──→ [agents can crawl]
[Crawl 167k] ──────────────────┘
                                                          ▲
                                                          │
[Home page openclaw.ai-style] ────────────────────────────┘
                                                          
[Trưởng khoa Luật] ──→ [Author 5 môn + đồ án + Trợ lý] ──→ [Phase 2 launch]
```

The engineering branch (above the dotted line) becomes deployable as soon as legal clears republication, regardless of partner status. Phase 2 launch is gated on the partner.

---

## 8. Risks (revised)

| Risk | Mitigation |
|---|---|
| Cloudflare Pages 20k file limit | **Solved** — R2 + Function (this plan) |
| R2 region for Vietnam users — latency | R2 is multi-region replicated. Acceptable. |
| Wrangler upload time for 170k objects | `pipeline/6` does incremental upload by content hash; first sync ~30 min, subsequent <1 min |
| Disclaimer not respected by agent runtimes | Embed at function-level (option 8) makes it impossible to bypass |
| Legal blocks republication | Architecture supports private R2 → only metadata/summary public; spec already accommodates |
| Pages Function exceeds CPU time on big docs | R2 streaming has ~10 ms TTFB; even a 100 KB doc streams in <100 ms. Function is `O(1)` per request |
| `.edu.vn` revoked | File educational-entity evidence with VNNIC quarterly |

---

## 9. Concrete next sprint (during the ~21 h crawl window)

In ROI / unblocking order:

1. ~~**Provision R2 bucket** `openclaw-edu-vn-md` + bind custom domain `cdn-openclaw-edu.opencloud.com.vn`. Test cert with `curl https://cdn-openclaw-edu.opencloud.com.vn/` → expect default 404 from R2. ~15 min.~~ ✅ done as POC (bucket `openclaw-edu-vn-md-poc`, custom domain active end-to-end). The production bucket gets created on first `pipeline/6` run; the custom domain rebinds to it then. See §1.1.
2. **Write `pipeline/4.to-vanban-goc-vbpl.ts`** — reads details.ndjson, writes year-sharded spec-format .md to `build/r2-staging/van-ban-goc/`. Frontmatter includes `canonical_url: https://cdn-openclaw-edu.opencloud.com.vn/...`. ~2 h.
3. **Write `pipeline/5.build-indexes.ts`** — generates llms.txt, llms-full.txt, per-folder index.md, manifest.json, sitemap.xml. All internal references use the CDN host. ~2 h.
4. **Write `pipeline/6.upload-r2.ts`** — incremental upload via wrangler / R2 S3-compatible API; sets `Content-Type: text/markdown; charset=utf-8` and Cache-Control. Creates the production bucket `openclaw-edu-vn-md` on first run. ~1 h.
5. **Cutover** — rebind `cdn-openclaw-edu.opencloud.com.vn` from `openclaw-edu-vn-md-poc` to `openclaw-edu-vn-md`. Smoke test: `curl https://cdn-openclaw-edu.opencloud.com.vn/van-ban-goc/2025/...md` returns content from the production corpus. After verification, optionally delete the POC bucket. ~30 min.
6. **Build the home page** — `pages/index.vue` styled like openclaw.ai, replacing the POC placeholder. Keep `routeRules: { '/': { prerender: true } }` from the POC. ~4 h to parity. Hero CTA "Khám phá Trợ lý" links to `https://cdn-openclaw-edu.opencloud.com.vn/llms.txt`.
7. **Frontmatter Zod validator** — `pnpm test:frontmatter`. ~1 h.
8. **Bind `openclaw.edu.vn` apex** to the Pages project + add CNAME `openclaw.edu.vn → openclaw-edu-vn.pages.dev` (proxied). `dev.openclaw.edu.vn` stays as the staging surface. Deploy via existing wrangler pages deploy script.

End-of-sprint deliverable: live in two places —
- `https://openclaw.edu.vn/` — openclaw.ai-style marketing page (apex; `dev.` retained for staging)
- `https://cdn-openclaw-edu.opencloud.com.vn/van-ban-goc/2025/luat-doanh-nghiep-2020.md` — raw markdown of an actual law
- `https://cdn-openclaw-edu.opencloud.com.vn/llms.txt` — corpus map
- Any agent can `fetch()` either URL and immediately consume the content. Citations of `cdn-openclaw-edu.opencloud.com.vn` paths embed the OpenCloud brand wherever the agent's output goes.

Want me to spawn the developer agent on items 2–6 in parallel, while I keep watching the crawl?
