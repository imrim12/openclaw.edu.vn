# Project conventions for AI agents

This file is loaded automatically by Claude Code. Read it before doing any work.

## Stack

- **Nuxt 4** — static generation only (`nuxt generate`); no Nitro server runtime ships.
- **Vue 3** with Composition API and `<script setup lang="ts">`.
- **@nuxt/content** — markdown lives in `content/`, schema in `content.config.ts`.
- **nuxt-llms** — generates `llms.txt` for AI crawlers at build.
- **Pinia** for any client state.
- **pnpm** with the catalog in `pnpm-workspace.yaml`. Add deps with `pnpm add -D` and ensure they land in catalog (eslint enforces `pnpm/json-enforce-catalog`).
- **antfu** ESLint config (no Prettier).
- **Vitest** (unit + nuxt projects) and **Playwright** for tests.
- **Deploy**: Cloudflare Pages via `wrangler pages deploy .output/public`. GitHub Actions ships `main` (see `.github/workflows/deploy.yml`).

## Hard rules

1. **Strict TypeScript.** No `any`. No `as` casts (only `as const` for literal narrowing). No `!` non-null assertions. No `@ts-ignore` / `@ts-expect-error` without a comment explaining the upstream limitation. Narrow with type guards or early returns.
2. **Framework-first.** Before writing custom code, check whether Nuxt, @nuxt/content, or VueUse already covers it. Don't patch `node_modules`; use module config or augmentation.
3. **No comments unless WHY is non-obvious.** Don't narrate WHAT.
4. **No auto-imports for user components.** `nuxt.config.ts` sets `components: false`. Import them explicitly in `<script setup>`.
5. **Static only.** Don't add `server/` routes — the deploy target is Cloudflare Pages static. Anything dynamic needs a redesign first.
6. **Pages stay thin.** Push logic into composables (`app/composables/`) and stores (Pinia).

## Project layout

```
app/
  app.vue              Root shell (NuxtLoadingIndicator, NuxtLayout, NuxtPage)
  layouts/             Layout components
  pages/               File-based routes
  utils/               Cross-cutting utilities (auto-imported)
content/               Markdown content for @nuxt/content
content.config.ts      @nuxt/content collection schema
shared/utils/          Shared pure utilities (id, number, string, uuid)
public/                Static assets
wrangler.jsonc         Cloudflare Pages config
.github/workflows/
  ci.yml               Lint + typecheck + build on PR/main
  deploy.yml           Cloudflare Pages deploy on push to main
```

## Workflow before "done"

`pnpm prepare && pnpm lint && pnpm typecheck && pnpm build` must all pass. The pre-commit hook runs `lint-staged` and `pnpm typecheck`; don't bypass it with `--no-verify`.
