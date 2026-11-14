# CLAUDE.md — FVC RECORDS (Fat Virus Carrier Records)

You are building the website for **FVC RECORDS** at **fvc.ai.kr**: a Seoul record label whose whole identity is generated in code — bitmap germs from seeds, letters that mutate, splatter vinyl, packed-circle colonies.

## Read first (in this order)
1. `docs/00_기획서.md` — the plan (Korean). Goals, concept, IA, roadmap. **Source of truth for scope.**
2. `docs/03_site-spec.md` — pages, sections, behaviour (English).
3. `docs/02_design-system.md` + `design/tokens/` — colours, type, components, motion.
4. `packages/fvc-engine/README.md` + `docs/04_engine-spec.md` — the generator API.
5. `docs/05_build-plan.md` — milestones and **Done when** checks. Work through it in order.
6. `docs/06_open-questions.md` — unresolved decisions; use the listed defaults, never invent content.

## Visual reference
- Live design canvas (rendered): https://claude.ai/artifact/VSeNBTjWV9ZWdP49LsNvUs
- Source copies: `design/canvas/*.dc.html` — **reference prototypes only**. They need the Claude Design runtime (`support.js`), so they will not run standalone. Read them for exact sizes, colours, copy and composition; reimplement as React components. Section names are in HTML comments (e.g. `<!-- ============ HERO … -->`).
- References: `design/references/` + notes in `docs/01_reference-notes.md`.

## Non-negotiables
- **Seeds are the source of truth.** Never store generated SVG; regenerate from `seed` with `@fvc/engine`.
- **Do not change engine output** unless asked. `cd packages/fvc-engine && npm test` must stay green (byte-for-byte parity with the canvas).
- **English only** on the site. No Korean strings in UI.
- One spot ink per piece. No gradients, no soft shadows. Germs are always generated bitmaps.
- Tone: playful, never childish, never medical-scary. No masks/hazmat imagery; avoid “confirmed case”, “mass infection”, death.
- Placeholders stay as `[Artist]`, `[Release Title]`, `[0:00]` until real content arrives — do not make up artists, dates or prices.
- Every animation respects `prefers-reduced-motion` and pauses off-screen.
- Accessibility: real buttons/links/labels, `aria-label` on mutating text, contrast ≥ 4.5:1 (never white on acid/yellow).

## Stack
Next.js (App Router) + TypeScript · CSS Modules + `design/tokens/tokens.css` · `next/font/google` (Archivo needs the `wdth` axis) · `@fvc/engine` workspace package (`transpilePackages`) · Vercel.

## Commands
```bash
cd packages/fvc-engine && npm test          # engine parity tests (Node 22+)
cd packages/fvc-engine && npm run typecheck
cd packages/fvc-engine && npm run playground  # writes playground/index.html
```
App (`apps/web`, run from the repo root):
```bash
npm run dev         # http://localhost:3000
npm run build       # next build (static pages + OG images)
npm run lint        # eslint
npm run typecheck   # app + engine
```
Env (all optional, see `apps/web/.env.example`): `FVC_HIDE_DRAFTS`, `RESEND_API_KEY` + `SUBMISSIONS_TO`, `NEWSLETTER_WEBHOOK_URL`, `FVC_DEV_PAGES`.

## Repo map
```
CLAUDE.md                 ← you are here
README.md                 human overview
docs/                     plan + specs (00 is the master plan)
design/canvas/            prototype boards (*.dc.html) + _templates/ (how they were built)
design/references/        moodboard images + video
design/tokens/            tokens.json, tokens.css
content/                  strains.json, outbreaks.json, goods.json, site.json
packages/fvc-engine/      generator library (TS, tested)
apps/web/                 Next.js site (app/, components/fvc, components/home, components/lab, lib/)
legacy/chrome-hero/       the earlier chrome 3D logo hero (kept for reference, not part of the site)
```

## How to work
- Start each milestone by listing the components/pages you will touch; build; then run the **Done when** checks from `docs/05_build-plan.md` and report them.
- When the spec and the canvas disagree, the **canvas wins on visuals**, the **spec wins on behaviour**; note the conflict in your summary.
- Fonts load from `GOOGLE_FONTS_URL` (not next/font): the engine needs the real family names (`Archivo`, `Grenze Gotisch`…). See `docs/07_build-notes.md`.
- Ask before adding dependencies beyond Next.js, React, zod and a form/newsletter provider SDK.
