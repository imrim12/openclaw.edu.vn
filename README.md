# openclaw.edu.vn

Static markdown site built with Nuxt 4 + @nuxt/content, deployed to Cloudflare Pages.

See [`CLAUDE.md`](./CLAUDE.md) for conventions.

## Local development

```bash
pnpm install
pnpm dev               # nuxt dev --port 3002
```

## Build & deploy

```bash
pnpm build             # nuxt generate -> .output/public/
pnpm preview           # wrangler pages dev .output/public
pnpm deploy            # wrangler pages deploy .output/public --project-name=openclaw-edu-vn
```

CI (`.github/workflows/ci.yml`) runs lint, typecheck, and build on every PR.
The deploy workflow (`.github/workflows/deploy.yml`) ships `main` to Cloudflare Pages on push.

## Useful scripts

| Script | What it does |
|---|---|
| `pnpm dev` | Nuxt dev server with HMR on port 3002 |
| `pnpm build` | `nuxt generate` -> `.output/public/` |
| `pnpm preview` | Local Cloudflare Pages preview |
| `pnpm deploy` | Deploy to Cloudflare Pages |
| `pnpm typecheck` | `nuxt typecheck` (vue-tsc) |
| `pnpm lint` | ESLint over the whole repo |
| `pnpm test` | Vitest (unit + nuxt projects) |
| `pnpm test:e2e` | Playwright headless |
