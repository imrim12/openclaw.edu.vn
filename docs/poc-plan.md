# Cao đẳng OpenClaw — Cloudflare POC Plan

A minimal end-to-end deployment that proves the **dual-domain architecture** before we commit to the full pipeline. Run this *before* the v3 implementation plan's main sprint.

**Goal**: Live in production —
- `https://openclaw.edu.vn/` shows a placeholder home page listing 10 sample legal docs.
- Each link resolves to **raw markdown** served from Cloudflare R2.
- Agents that fetch the markdown URL get `text/markdown; charset=utf-8`, UTF-8-clean Vietnamese, with **no styling, no HTML wrapper**.
- Citations of the markdown URL embed the **OpenCloud** brand (intermediate hostname during POC; custom domain in step 8 if DNS ready).

**Non-goals (for POC)**:
- Full 167k corpus — only 10 sample files
- Spec §11.5 frontmatter rewrite — POC ships the markdown that step 3 already produced (with `vbpl.vn` frontmatter)
- Indexing infrastructure (`llms.txt`, `manifest.json`, per-folder index) — defer to main sprint
- Brand-perfect home page — placeholder text + a list, no openclaw.ai styling yet

**Time budget**: 60–90 minutes, single agent.

---

## 1. Pre-flight

```bash
# verify tokens & tools
[ -n "$CLOUDFLARE_TOKEN" ] || echo "MISSING CLOUDFLARE_TOKEN"
[ -n "$GITHUB_TOKEN" ]    || echo "MISSING GITHUB_TOKEN"
export CLOUDFLARE_API_TOKEN="$CLOUDFLARE_TOKEN"   # wrangler's canonical name

# verify wrangler can authenticate
npx wrangler whoami
# expect: shows email + account list

# verify gh
gh auth status
```

If `wrangler whoami` fails, the token lacks the right scopes. The token must have at minimum:
- **Account.Cloudflare Pages** — Edit
- **Account.Workers R2 Storage** — Edit
- **Account.Workers Scripts** — Read (for whoami)
- **Zone.DNS** — Edit (only if step 8 is done)

If `whoami` succeeds, capture the account id:
```bash
export CLOUDFLARE_ACCOUNT_ID=$(npx wrangler whoami 2>&1 | grep -oE '[a-f0-9]{32}' | head -1)
echo "account: $CLOUDFLARE_ACCOUNT_ID"
```

---

## 2. Sample selection (10 docs)

Pick 10 files from `crawler/data/vbpl/markdown/` that span doc types and dates. A spread is more interesting than 10 random files of the same type. Suggested:

| # | Selector | Why |
|---|---|---|
| 1 | `Hiến pháp 2013` consolidated (`52/VBHN-VPQH`) | foundational doc, demonstrates multi-tier docs |
| 2 | a recent Luật (e.g. `Luật Doanh nghiệp 2020`) | classic high-cite normative law |
| 3 | a Bộ luật (e.g. `Bộ luật Dân sự 2015`) | very large file; tests R2 size handling |
| 4 | a Nghị định (Government decree) | exec-branch normative |
| 5 | a Thông tư (Ministry circular) | sub-statutory instrument |
| 6 | a Quyết định from UBND tỉnh | provincial-level docs are most of the corpus |
| 7 | a Pháp lệnh (Standing Committee ordinance) | rarer, demonstrates breadth |
| 8 | a Sắc lệnh from 1945–1959 | historical depth |
| 9 | a Bản dịch văn bản (English translation) | demonstrates EN content |
| 10 | a recently-issued doc (issueDate within last 30 days) | demonstrates currency |

**How to find them programmatically** — once the script is written, it picks via `details.ndjson` filter (e.g. `docType.code === 'BL'` for Bộ luật, sort desc for recent). For POC manual selection, grep through the markdown dir headers.

---

## 3. Steps

### 3.1. Prepare a staging directory

Copy the 10 chosen files into a flat staging directory mirroring the public URL path. POC uses a flat layout — full year-sharding comes later.

```bash
cd D:/projects/openclaw.edu.vn
mkdir -p build/poc-r2/van-ban-goc/poc
# copy 10 chosen files (the script below picks them)
node -e "
const fs = require('node:fs');
const path = require('node:path');
const SRC = 'crawler/data/vbpl/markdown';
const DST = 'build/poc-r2/van-ban-goc/poc';
const lines = fs.readFileSync('crawler/data/vbpl/details.ndjson', 'utf8').split(String.fromCharCode(10)).filter(Boolean);
const wanted = [];
const seenTypes = new Set();
for (const l of lines) {
  const o = JSON.parse(l);
  const t = o.data.docType?.code ?? '?';
  if (seenTypes.has(t)) continue;
  if (!o.data.documentContent?.content) continue;  // skip empty stubs
  seenTypes.add(t);
  wanted.push({ id: o.id, docNum: o.data.docNum, docType: t });
  if (wanted.length >= 10) break;
}
for (const w of wanted) {
  const slug = (w.docNum || w.id).replace(/[^a-zA-Z0-9-]+/g, '-').toLowerCase().slice(0, 80);
  fs.copyFileSync(path.join(SRC, w.id + '.md'), path.join(DST, slug + '.md'));
  console.log(w.id + ' -> ' + slug + '.md  [' + w.docType + ']');
}
"
ls build/poc-r2/van-ban-goc/poc/
```

Outcome: 10 `.md` files at `build/poc-r2/van-ban-goc/poc/<slug>.md`.

### 3.2. Create the R2 bucket

```bash
export CLOUDFLARE_API_TOKEN="$CLOUDFLARE_TOKEN"
npx wrangler r2 bucket create openclaw-edu-vn-md-poc
# expect: "Successfully created bucket: openclaw-edu-vn-md-poc"
```

### 3.3. Upload the 10 files

R2 needs proper `Content-Type` so browsers and agents see raw markdown. Wrangler doesn't accept content-type per-object via CLI, so use the S3-compatible API or set per upload:

```bash
# Option A: wrangler r2 object put (one-by-one, supports --content-type)
for f in build/poc-r2/van-ban-goc/poc/*.md; do
  base=$(basename "$f")
  npx wrangler r2 object put "openclaw-edu-vn-md-poc/van-ban-goc/poc/$base" \
    --file="$f" \
    --content-type="text/markdown; charset=utf-8" \
    --remote
done
```

Verify:
```bash
npx wrangler r2 object list openclaw-edu-vn-md-poc --remote --prefix=van-ban-goc/poc/
# expect: 10 entries
```

### 3.4. Get a public URL for the bucket

R2 has two public URL options:

**Option A — `r2.dev` subdomain (zero DNS work, instant)**:
```bash
# In Cloudflare dashboard → R2 → bucket → Settings → "Public access" → enable r2.dev subdomain
# Or via API:
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/r2/buckets/openclaw-edu-vn-md-poc/domains/managed" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"enabled":true}'
# Response includes the public r2.dev URL like: pub-<hash>.r2.dev
```

POC uses Option A. Custom domain (`cdn-openclaw-edu.opencloud.com.vn`) requires DNS work and is step 8 below.

### 3.5. Curl-test a sample doc

```bash
# Replace <hash> with the actual r2.dev hostname returned above
curl -i "https://pub-<hash>.r2.dev/van-ban-goc/poc/<some-slug>.md"
# expect:
#   HTTP/2 200
#   content-type: text/markdown; charset=utf-8
#   etag: "..."
#   <followed by Vietnamese markdown>

# UTF-8 sanity:
curl -s "https://pub-<hash>.r2.dev/van-ban-goc/poc/<some-slug>.md" | head -20
# expect readable Vietnamese diacritics, no mojibake
```

### 3.6. Update the home page

Replace the current `pages/index.vue` with a placeholder that lists the 10 POC docs. Keep it tiny — no styling work for POC.

```vue
<script setup lang="ts">
const cdnBase = 'https://pub-<hash>.r2.dev'   // replace with actual r2.dev hostname
const docs = [
  { slug: '...', title: '...' },
  // ... 10 entries, populated from the prepare step
]
</script>

<template>
  <main>
    <h1>Cao đẳng OpenClaw — POC</h1>
    <p>Demo of the markdown-via-CDN architecture. 10 sample documents from vbpl.vn.</p>
    <ul>
      <li v-for="d in docs" :key="d.slug">
        <a :href="`${cdnBase}/van-ban-goc/poc/${d.slug}.md`">{{ d.title }}</a>
      </li>
    </ul>
    <p>
      Index: <a :href="`${cdnBase}/van-ban-goc/poc/`">/van-ban-goc/poc/</a> ·
      All paths return <code>Content-Type: text/markdown; charset=utf-8</code>
    </p>
  </main>
</template>
```

### 3.7. Deploy the home page to Cloudflare Pages

```bash
pnpm build       # nuxt generate
pnpm deploy      # wrangler pages deploy .output/public --project-name=openclaw-edu-vn
```

Capture the deploy URL (e.g. `https://openclaw-edu-vn.pages.dev` or the custom-domain host once bound).

### 3.8. (Optional) Bind the custom domain `cdn-openclaw-edu.opencloud.com.vn`

Only if the `opencloud.com.vn` zone is already on Cloudflare and we have permission to touch DNS:

```bash
# In Cloudflare dashboard → R2 → bucket → Settings → "Custom Domains" → Connect Domain →
#   "cdn-openclaw-edu.opencloud.com.vn"
# Cloudflare auto-provisions the cert. ~2 min.
# Re-run 3.5 against the new hostname.
```

If DNS isn't ready, leave the POC on the `r2.dev` host. The architecture is identical; only the cosmetic hostname changes.

### 3.9. Optional: bind `openclaw.edu.vn` to the Pages project

Requires the `.edu.vn` zone setup. If not ready, the POC ships on `openclaw-edu-vn.pages.dev`. Add a redirect from `pages.dev` → custom domain later.

---

## 4. Acceptance criteria

A POC passes when **all of these are true**:

| # | Check | Command |
|---|---|---|
| 1 | Home page returns 200 and shows 10 links | `curl -i https://<pages-host>/ \| head -5` |
| 2 | Each of the 10 markdown URLs returns 200 | loop `curl -o /dev/null -w "%{http_code} %{url_effective}\n" <each-url>` |
| 3 | Content-Type is `text/markdown; charset=utf-8` | `curl -I <one-url> \| grep -i content-type` |
| 4 | Vietnamese diacritics render correctly (no mojibake) | `curl -s <one-url> \| grep -E 'Quyết\|định\|Hiến' \| head` |
| 5 | The CDN host appears in the URL of every link clicked from the home page | inspect `pages/index.vue` source or DOM |
| 6 | An agent fetching the URL gets the body bytes-for-bytes | `diff <(curl -s <url>) <local-source-file>` |

---

## 5. Failure modes & fallbacks

| Failure | Likely cause | Fix |
|---|---|---|
| `wrangler whoami` 401 | Token lacks Account.* scopes | Regenerate token with the four scopes listed in §1 |
| `r2 bucket create` 403 | Account doesn't have R2 enabled | Enable R2 in dashboard (free tier, no card needed for first 10 GB) |
| `r2 object put` slow / fails over 25 MiB | One file too big (rare for POC; Bộ luật can be ~1 MB so still fine) | Skip that doc; pick another |
| `r2.dev` URL returns 404 with public access enabled | Cache propagation delay (≤5 min) | Wait or invalidate via dashboard |
| `Content-Type` returns `application/octet-stream` | Forgot `--content-type` on upload | Re-upload with `--content-type="text/markdown; charset=utf-8"` |
| Vietnamese mojibake in browser | UTF-8 BOM stripped or wrong charset | Re-check with `file <file>` and `head -c 4 \| xxd` |
| `pnpm deploy` fails | `wrangler.jsonc` has wrong project name or output dir | We already verified `wrangler.jsonc` works (initial Cloudflare Pages deploy passed) |
| Home links go to `pub-<hash>.r2.dev` not the OpenCloud domain | Custom domain not bound (step 3.8 skipped) | Acceptable for POC — note as follow-up |

---

## 6. After-POC follow-ups (not in POC scope)

These open immediately after the POC passes:

1. Bind `cdn-openclaw-edu.opencloud.com.vn` once DNS is ready, replace `pub-<hash>.r2.dev` everywhere.
2. Run `pipeline/4.to-vanban-goc-vbpl.ts` against full corpus → `build/r2-staging/`.
3. Run `pipeline/5.build-indexes.ts` to generate `llms.txt` etc.
4. Run `pipeline/6.upload-r2.ts` to push the full corpus to a production bucket `openclaw-edu-vn-md`.
5. Promote the home page to the openclaw.ai-style design.
6. Wire CI: GitHub Action that runs the pipeline on push to main, deploys home + uploads R2.
7. Decide bucket separation: keep POC bucket for reference, or delete after main rollout.

---

## 7. Rollback

If anything in production goes sideways:

```bash
# Delete POC bucket entirely (does NOT affect production)
npx wrangler r2 bucket delete openclaw-edu-vn-md-poc --force

# Roll back home page to previous deploy
npx wrangler pages deployment list --project-name=openclaw-edu-vn
npx wrangler pages deployment rollback <previous-deployment-id> --project-name=openclaw-edu-vn
```

---

## 8. Concrete next call

When you green-light, the developer agent runs:

1. Step 1 — pre-flight checks
2. Step 3.1 — sample-selection script + verify 10 files
3. Step 3.2 — create POC bucket
4. Step 3.3 — upload 10 files
5. Step 3.4 — enable r2.dev public access
6. Step 3.5 — curl test, capture transcripts
7. Step 3.6 — update `pages/index.vue` with the 10 links + actual r2.dev hostname
8. Step 3.7 — `pnpm build && pnpm deploy`
9. Run §4 acceptance checks, paste outputs

Reports back with: live home URL, 10 raw markdown URLs, all 6 acceptance checks ✅.

If §4 #5 fails (custom domain not bound), reports as "POC pass with cosmetic deferral — DNS step 3.8 still TODO".
