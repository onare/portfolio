# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager: **pnpm** (lockfile present). Do not use npm/yarn.

```sh
pnpm install        # install deps
pnpm dev            # next dev (localhost:3000). next.config.mjs runs velite in watch mode
pnpm build          # next build (velite build runs first inside next.config)
pnpm start          # serve production build
pnpm fmt            # biome check --write .
```

No test runner. Lint/format = **Biome** (config: `biome.json`). Previous Rome config replaced.

## Architecture

Personal portfolio (`onadev.net`) — Next.js 16 (App Router, Turbopack) forked from chronark.com.

### Portfolio
- **App Router** (`app/`) for pages: `/`, `/projects`, `/projects/[slug]`, `/skills`, `/contact`.
- **Velite** turns `content/projects/*.mdx` into a typed `projects` array exported from `@/.velite`. Schema lives in `velite.config.ts` (`Project` + `Page` collections). MDX gets `remark-gfm`, `rehype-pretty-code` (github-dark, shiki 1.x), `rehype-slug`, `rehype-autolink-headings`. The generator runs from `next.config.mjs` so `pnpm dev` and `pnpm build` always have fresh content. (Previous setup used Contentlayer + `@next/mdx` — both removed.)
- **MDX rendering** lives in `app/components/mdx.tsx`. Velite's `s.mdx()` produces a function-body string; the component compiles it against `react/jsx-runtime` and renders the resulting component with a custom `sharedComponents` map.
- **Pageview counter**: `pages/api/incr.ts` (nodejs runtime — Edge Runtime is deprecated in Next 16) uses the classic Pages-Router handler API (`NextApiRequest` + `NextApiResponse`) to increment Upstash Redis key `pageviews:projects:<slug>`. Dedupes by SHA-256-hashed IP from `x-forwarded-for` / `x-real-ip` / `req.socket.remoteAddress` for 24h. `app/projects/page.tsx` reads counts via `redis.mget`, with a `safeMget` wrapper that returns zeros if Redis env is missing or unreachable.

### Hybrid router
Both `app/` (App Router) and `pages/api/` (Pages Router API routes) coexist. New API routes go in `pages/api/` to match existing pattern. `next.config.mjs` only includes JS/TS in `pageExtensions` (MDX is handled by velite, not by Next directly).

### Async dynamic params
Next 15+ made `params` a `Promise`. Any `app/.../[slug]/page.tsx` must `await params` before reading fields (`const { slug } = await params`). `generateStaticParams` still returns the raw shape.

### Path aliases
- `@/*` → repo root
- `@/.velite` → velite build artifact (typed via `.velite/index.d.ts`)

## Environment

`.env.example` lists the Upstash vars (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`). Without env vars the Redis wrappers fall back to zeros — pages still render, view counts read as 0.

## Conventions

- Server Components by default. Client components opt in with `"use client"` (see `particles.tsx`, `skills/page.tsx`, `contact/page.tsx`).
- Styling: **Tailwind v4**, CSS-first config. There is no `tailwind.config.js` — everything lives in `global.css` under `@theme { ... }` (font tokens, animation tokens, keyframes). `@import "tailwindcss"` + `@plugin "@tailwindcss/typography"`. PostCSS uses `@tailwindcss/postcss` only — no `autoprefixer`, no nesting plugin.
- Any CSS file that uses `@apply` from outside `global.css` must start with `@reference "../../../global.css";` so Tailwind v4 can resolve utility classes (see `app/projects/[slug]/mdx.css`).
- Font tokens: `--font-inter`, `--font-calsans` (loaded in `app/layout.tsx` via `next/font/google` + `next/font/local`).
- Redis client: always wrap behind `safeMget` / `safeViews` — never call `Redis.fromEnv().get(...)` directly at request time without a try/catch.
- Brand icons (GitHub, Linkedin, etc): use `@iconify/react` with `lucide:github` / `lucide:linkedin`. `lucide-react` 1.x dropped brand glyphs. Do **not** use `@iconify-icon/react` — it ships a web component and breaks Next App Router SSR hydration.
- Framer Motion 12: `ease` arrays must be typed as tuples (`as [number, number, number, number]`), and `viewport` should use `amount` (e.g. `{ once: true, amount: 0.1 }`) rather than `margin` for predictable in-view triggers.
- Commit messages follow `feat:` / `fix:` prefix (see `git log`).

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
