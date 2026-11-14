# 03 — Site Spec (pages, sections, behaviour)

Read with `docs/00_기획서.md` §5. Every section below has a pixel reference in `design/canvas/Main.dc.html` (search the HTML comment named in brackets).

Global
- Width: fluid, content max 1440px; prototype measured at 1440.
- Breakpoint: ≤760px → 2-col grids become 1 col; hide decorative overlay text marked `fvc-hide-sm` in the prototype.
- Background `paper`; sections separated by 2px ink rules.
- Language: English only. `lang="en"`.
- Clock: Seoul time, `MM.DD.YY HH:MM:SS` (24h) in footer, `HH:MM` in hero/footer header.

## Home `/`

| # | Section [prototype comment] | Content | Behaviour | Data |
|---|---|---|---|---|
| 1 | Hero [`HERO (Golova / Into the Noise)`] | grey ground 940px tall; two-colour HeroGerm (seed 7, N 140, `eyes:'none'` + live eyes) right, rotated −9°, ~74vw; LiveWordmark bottom-left (each letter ≤300px); corners: `11/13 Strain·007` / `HH:MM`; small dish logo; (A)/(B) info blocks; vertical `Fat Virus Carrier … Records` right; tiny vertical address left; `Now Spreading` bottom-right; secondary mono germ (seed 150); Connwax mini stack; crosshairs; grain 0.2 | pupils follow pointer (header-relative, centre ≈ 62% x / 32% y, clamp unit circle, ×9 / ×6 px); idle wander when no pointer | latest strain |
| 2 | Connwax stack [`CONNWAX STACK`] | label bar, bitnoise oval, `strain·007`, oval `CATCH IT`, `+`, artist bar, title, spot `OUT [DATE]`; ink ticker below | ticker loop | latest strain |
| 3 | Strains 1–2 [`STRAINS 1-2`] | StrainCard ×2 (golova, creatura covers) | link to detail | strains[0..1] |
| 4 | Manifesto [`MANIFESTO (mixed type)`] | mixed-type paragraph (site.about) + outlined `LISTEN ONCE. CARRY FOREVER.` with spot word | — | site.json |
| 5 | FVC Lab mini [`FVC LAB (mini tools)`] | Germinator (seed display, `↻ Grow a new carrier`) + Mutator (name input ≤14 chars, `↻ Mutate`, link `All 4 tools →`) | random seed; letters mutate every tick | — |
| 6 | Spread meter [`1-BIT VU METER`] | ink band, `How catchy is it?`, level name, buttons 1–5, 24-bar meter | click sets level | strain.spreadLevel default |
| 7 | Strains 3–4 [`STRAINS 3-4`] | StrainCard ×2 (glitch, connwax covers) | — | strains[2..3] |
| 8 | Banners [`INFECTED TYPE BANNERS`] | banners b1, b2, b6 + Shuffle | 1s mutate | — |
| 9 | Dictionary [`DICTIONARY (inverted bars)`] | 8 rows from site.vocabulary | hover inverts | site.json |
| 10 | Footer [`FOOTER`] | DishFooter, NavTable, © line | — | site.json |

## Strain index `/strains`
- Grid of StrainCards (2 col desktop), filter pills by `strainType` and `formats`.
- Sort: newest `isolated` first; `draft` hidden in production.

## Strain detail `/strains/[id]`
- Hero: cover template by `coverStyle` at large size (full width, 4:3 or 4:5), catalog number in wide 900, strainType pill.
- SpecimenLabel with live data; tracklist table (Side A/B, mono incubation).
- If `vinyl`: Pressing Plant render (`vinyl(vinyl.seed)` + label germ `germ(seed+3,{N:64,two:false,dust:0,eyes:'cyclops'})`).
- Links: Listen / Buy (hide when null).
- OG image via `next/og`: grey ground + germ + catalog number.
- `generateStaticParams` from strains.json.

## Lab `/lab` and `/lab/[tool]`
Reference: `design/canvas/Lab.dc.html`. Each tool = ToolCard.

| Tool | Controls | State in URL |
|---|---|---|
| Germinator | ↻ New germ, −/+ seed, eyes 2/1/3/0, grid Coarse 44 / Mid 80 / Fine 140, Inks 1/2, 4 spot swatches | `?seed=&eyes=&n=&inks=&spot=` |
| Pressing Plant | ↻ Press again, base Smoke `#2A2A2A` / Clear `#CFCFC8` / Black / White, palette Outbreak / Photocopy / Riso | `?seed=&base=&pal=` |
| Colony | ↻ Regrow, palette Robotron / One ink / Night | `?seed=&pal=` |
| Mutator | text input ≤20 (uppercase), ↻ Mutate, Freeze/Go live | `?t=&seed=` |

Phase 2: "Download SVG" (serialize the output `<svg>`) and "Download PNG" (draw to canvas at 2×).

## Outbreaks `/outbreaks`, `/outbreaks/[id]`
- List rows: date (wide), title, venue, lineup bars.
- Detail: poster by `posterStyle` (`golova` | `creatura` | `noise`) — reference `design/canvas/Poster.dc.html`, 760×1075 ratio; lineup, doors, ticket link.

## Goods `/goods`
- Phase 1: cards linking to an external store (URL per item). Graphics from Kit (colony pattern tote, splatter slipmat, sticker sheet).

## About `/about`
- site.about, the name breakdown table (FAT / VIRUS / CARRIER), Dictionary, specimen sheet (6 germs).

## Submit `/submit`
- Form: name, email, link (SoundCloud/Drive), message, consent checkbox. Copy: "Sample Submission".
- Phase 1 delivery: Route Handler → email (provider TBD) or a hosted form. Validate, rate-limit, honeypot.

## Spread Report `/spread-report`
- Email field + submit → newsletter provider (TBD). Success state copy: "You’re a carrier now."

## Not in scope (phase 1)
- On-site checkout, accounts, CMS, Korean localisation.
