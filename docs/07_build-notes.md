# 07 — Build Notes (what was built, what differs, what is left)

Site: `apps/web` (Next.js 16 App Router + TypeScript, CSS Modules + `design/tokens/tokens.css`, `@fvc/engine` workspace package).
Run from the repo root: `npm run dev` / `npm run build` / `npm run lint` / `npm run typecheck`.

## Milestones (docs/05) — status

| | Status | Checked |
|---|---|---|
| M0 Setup | done | engine `npm test` 7/7 · `next build` clean (37 static pages, no warnings) · germs render server-side |
| M1 Components | done | all in `components/fvc/*`; side-by-side sheet at `/dev/components` (404 in production unless `FVC_DEV_PAGES=true`) · no console errors |
| M2 Home | done | sections 1–10 · timers pause off-screen (IntersectionObserver) and stop with reduced motion · 390px: no horizontal scroll |
| M3 Strains | done | `/strains` (type + format filters, newest first) · `/strains/[id]` (cover, specimen label, tracklist, vinyl, links, share, related) · OG image per strain · `generateStaticParams` — a new object in `content/strains.json` adds a page + OG image with no code change |
| M4 Lab | done | `/lab` hub + 4 tool pages · every control from the Lab board · state in the URL (`?seed=&eyes=&n=&inks=&spot=`, `?seed=&base=&pal=`, `?seed=&pal=`, `?t=&seed=`); reloading the URL reproduces the output (a Mutator link with `seed` opens frozen) |
| M5 Banners & posters | done | all six banners (1 s mutate, Shuffle, Freeze) · `/outbreaks`, `/outbreaks/[id]` with `Poster` (golova / creatura / noise) filled from `outbreaks.json` |
| M6 Forms | built, **not connected** | `/submit` + `/api/submit` (zod, honeypot, rate limit, errors announced via `role=alert` + per-field `aria-describedby`) · `/spread-report` + `/api/spread`. Delivery waits on providers (Q4, Q5) — see Env |
| M7 Quality | partly verified | real buttons/labels, focus styles, `aria-label` on mutating text, no white on acid/yellow, reduced motion respected, art pre-rendered on the server. **Lighthouse not run yet** (see below) |
| M8 Launch | pending | favicon (pixel C on coral) + app icon (germ on ink) + OG done. Vercel project, domain, analytics need your accounts |

## Decisions and deviations

- **Fonts are loaded from the Google Fonts stylesheet, not `next/font`.** The engine rasterises letters with `900 300px Archivo` and draws `<text font-family="Grenze Gotisch">`; `next/font` renames families, which would silently break every mutating letter. (`docs/05` M0 asked for `next/font`.)
- **Drafts are hidden** (`status: "draft"`). Only real releases (FVC-001, `live`) appear; preview drafts with `FVC_SHOW_DRAFTS=true`.
- **Hero germ = latest strain's seed** (Q8 default). The live pointer eyes (`HERO_EYES`) are drawn for seed 7 only; any other seed keeps its own generated eyes.
- **Cover templates are data-driven.** The canvas covers c1–c4 hard-code seeds; here each template takes the strain's seed / spot / eyes, keeping the canvas germ settings per template (`COVER_GERM` in `components/fvc/Cover.tsx`).
- **Footer NavTable** adds `FVC Lab` and `Spread Report`; `Instagram` is hidden until `site.social.instagram` is set (Q6).
- **Inner pages get a compact TopBar** (the canvas only shows the home page, which keeps its hero corners and no bar).
- **Forms never pretend to send.** Without provider env vars they log in development and answer "not open yet" (503) in production.
- **Mutator text** is limited to `A–Z 0–9 space . ! ? & -` so every character has a glyph.

## Env (all optional) — `apps/web/.env.example`

`FVC_SHOW_DRAFTS` · `NEXT_PUBLIC_SUBMIT_ENDPOINT` · `NEXT_PUBLIC_SPREAD_ENDPOINT`

## Left to do

1. **Lighthouse** (M7 “Done when”): run against a production build, e.g.
   `npm run build && npm run start` then `npx lighthouse http://localhost:3000 --view` and the same for `/strains/FVC-007`.
2. **M8**: create the Vercel project (root `apps/web`, install from the repo root), add `fvc.ai.kr` (A `76.76.21.21` / CNAME `cname.vercel-dns.com` — use the values Vercel shows), enable Vercel Analytics (Q9).
3. Decide Q4 (submission email provider) and Q5 (newsletter provider), then set the env vars.
4. Replace placeholders in `content/*.json` (Q1) — no code changes needed.

## Update — GitHub Pages (static export)

fvc.ai.kr stays on GitHub Pages (decided 2026-11-15), so the site is built with `output: 'export'` + `trailingSlash: true` and deployed by `.github/workflows/pages.yml`.
- Route Handlers are gone: forms validate in the browser and POST to `NEXT_PUBLIC_SUBMIT_ENDPOINT` / `NEXT_PUBLIC_SPREAD_ENDPOINT` (repo Variables). Unset → "opens soon".
- OG cards are real files: `/og/site.png`, `/og/FVC-###.png`; app icon `/icons/apple-touch-icon.png`.
- `/dev/components` exports as a 404 page.
- One-time setup: Settings → Pages → Source = **GitHub Actions**.

## Update — type and tone (2026-11-15)

- Info typeface is now **Instrument Sans** (pairs with Instrument Serif); `tokens.css` / `tokens.json` updated. DM Mono stays for numbers only.
- Removed template tells: tracked mono caps labels, `→` / `↗` arrows, `▮` separators in running UI, outlined caps buttons. CTAs are underlined words; cards play the strain directly.
- Hero: the big germ floats (13 s loop), the small one wanders the top band (38 s); both stop with reduced motion.
