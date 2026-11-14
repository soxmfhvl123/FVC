# 05 — Build Plan (task checklist for Claude Code)

Work top to bottom. Each milestone ends with its **Done when** checks passing. Commit per task.

## M0 — Setup
- [ ] Create Next.js app (App Router, TypeScript, ESLint) at repo root in `apps/web` (or root if single app); keep `packages/fvc-engine` as a workspace package.
- [ ] `next.config`: `transpilePackages: ['@fvc/engine']`.
- [ ] Import `design/tokens/tokens.css` in the root layout; load fonts with `next/font/google` (Archivo with `axes: ['wdth']`, Inter Tight, DM Mono, Grenze Gotisch, Instrument Serif italic).
- [ ] Copy `content/*.json` into the app's data layer with typed loaders (`lib/content.ts`).
- **Done when:** `/` renders a `<Germ seed={7}/>` server-side; `npm test` in the engine passes; `next build` succeeds.

## M1 — Base components (`components/fvc/*`)
- [ ] `Germ`, `HeroGerm` (pointer eyes, reduced-motion aware)
- [ ] `InfectedLetter`, `LiveWordmark`, `useGlyphCache()` hook (fonts ready → ensure chars → state)
- [ ] `Grain` (SVG filter overlay), `BitNoiseOval`, `Crosshair`, `Barcode`, `SpecimenCode`
- [ ] `Bar`, `Pill`, `CtaButton`, `NavTable`, `Clock` (Asia/Seoul)
- [ ] `SpecimenLabel`, `StrainCard`, `Cover` (golova | creatura | glitch | connwax)
- [ ] A `/dev/components` page showing all of them (excluded from production nav)
- **Done when:** every component matches its canvas counterpart side by side; no console errors; works with JS disabled for static parts.

## M2 — Home
- [ ] Sections 1–10 per `03_site-spec.md`
- [ ] Interval timers paused off-screen (IntersectionObserver) and disabled with `prefers-reduced-motion`
- [ ] Mobile ≤760px layout
- **Done when:** visual match with `design/canvas/Main.dc.html` at 1440 and sensible at 390; Lighthouse a11y ≥ 90.

## M3 — Strains
- [ ] `/strains` index with filters
- [ ] `/strains/[id]` detail (cover, label, tracklist, vinyl render, links), `generateStaticParams`
- [ ] OG image route per strain
- **Done when:** adding a new object to `strains.json` creates a working page and OG image with no code change.

## M4 — Lab
- [ ] `/lab` hub with 4 ToolCards; `/lab/germinator`, `/lab/pressing-plant`, `/lab/colony`, `/lab/mutator`
- [ ] URL state sync (`useSearchParams`) so any result is shareable
- [ ] Home mini-lab uses the same components
- **Done when:** every control in `design/canvas/Lab.dc.html` works; reload with the URL reproduces the same output.

## M5 — Banners & posters
- [ ] `Banner` component + six background SVGs ported from `_templates/inc/b1..b6.html`
- [ ] `/outbreaks`, `/outbreaks/[id]` with `Poster` (golova | creatura | noise)
- **Done when:** banners mutate 1/s, Shuffle changes layout, Freeze stops; posters fill from `outbreaks.json`.

## M6 — Forms
- [ ] `/submit` (Route Handler, validation with zod, honeypot, rate limit) — provider per open question Q4
- [ ] `/spread-report` newsletter signup — provider per Q5
- **Done when:** a real submission arrives; errors are announced to screen readers.

## M7 — Quality
- [ ] Contrast audit (no white on acid/yellow), focus states, alt/aria labels
- [ ] Performance: precompute germ/vinyl SVG on the server where possible; lazy-load Lab; LCP < 2.5s on 4G
- [ ] `prefers-reduced-motion` fully respected
- **Done when:** Lighthouse Performance/Accessibility/Best Practices/SEO ≥ 90 on Home and a Strain page.

## M8 — Launch
- [ ] Favicon (pixel `C` on spot square) + app icon (germ on ink, see Logo board E)
- [ ] Vercel project, domain `fvc.ai.kr`, analytics (privacy-friendly)
- **Done when:** production URL live, OG previews correct on social.

## Phase 2 (later)
- Lab "Download SVG / PNG"; CMS (Sanity) with the same schema; on-site goods checkout; Korean locale (only if the brand decides to bring it back).
