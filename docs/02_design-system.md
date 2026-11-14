# 02 — Design System

Source of truth for values: `design/tokens/tokens.json` (+ `tokens.css`, `packages/fvc-engine/src/tokens.ts`).
Visual source of truth: the canvas boards in `design/canvas/` (open the live canvas link in the README to see them rendered).

## 1. Colour

| Token | Hex | Role |
|---|---|---|
| `paper` | `#E8E7E3` | Page ground |
| `grey` | `#D4D3CF` | Hero, posters, lens ("Golova grey") |
| `greyDark` | `#CFCECA` | Cover grounds, stripe banner |
| `white` | `#F7F7F5` | Photocopy pieces, labels, inputs |
| `ink` | `#0B0B0B` | Bitmaps, bars, type, rules |
| `spot` | `#FF5B47` | **FVC Coral** — house spot ink |
| `acid` | `#A6FF00` | Outbreak colour |
| `magenta` | `#FF2DB4` | Outbreak colour |
| `red` | `#FF2A1A` | Outbreak colour (banner 1) |
| `cobalt` | `#2B44FF` | Outbreak colour / alternate spot |
| `yellow` | `#FFE800` | Melt letters, riso palette |
| `orange` | `#FF6C2F` | Meter peak, riso palette |

Rules
- Base = 3 greys + ink. **One spot ink per piece** (a cover, a poster, a card).
- Outbreak colours only for banners, stickers, Lab sidebars and special strains.
- Never gradients. Never soft drop shadows. Hard offset shadows (`4px 4px 0 ink`) are allowed on stickers/CTAs only.

## 2. Type

| Role | Family | Settings | Example use |
|---|---|---|---|
| Info | Inter Tight | 500 for big corner text (26–46px, −0.02em), 400/600 body 15px | "11/13 Strain·007", nav, body |
| Condensed display | Archivo | 900, `font-stretch: 62%`, line-height 0.8–0.9 | "FAT VIRUS CARRIER", headlines |
| Wide display | Archivo | 900, `font-stretch: 125%`, −0.03em | black bars, catalog numbers, `FVC` in the dish |
| Blackletter | Grenze Gotisch | 800–900 | **one flavour word per line** max |
| Serif | Instrument Serif | italic only | asides ("impossible to shake") |
| Data | DM Mono | 400, 11–13px, uppercase, +0.06–0.08em | `INCUBATION [0:00] ▮ SPREAD ■■■■□` |

Mix rule: max **3 families in one line**. Small type lives in **corners and along edges**; big things in the middle.

Fonts URL: see `GOOGLE_FONTS_URL` in `tokens.ts` (Archivo needs the `wdth` axis 62–125).

## 3. Rules, shapes, texture

- Rules: 1px (inside tables), **2px default**, 3px heavy (section breaks on brutal boards).
- Black bar: ink background, white text, `padding: 2px 10px`; letter-spaced uppercase for labels (`letter-spacing: .3–.4em`).
- Pill: `border-radius: 999px`, 2px ink border, colour fill.
- Petri dish: ellipse, ratio **2.55 : 1**, outer stroke ≈ 2% of width, inner ring inset 4.5%.
- Grain overlay: `feTurbulence fractalNoise baseFrequency .85 numOctaves 3` → desaturate → `mix-blend-mode: multiply`, opacity **0.12–0.22**.
- Bit-noise fill (Connwax ovals): same turbulence `baseFrequency .55` → `feComponentTransfer discrete 0 1` per channel, clipped to an ellipse.
- Crosshair mark: circle r≈8 + full cross, 1.5px ink.
- Germs are always **bitmaps** (generated) — never hand-drawn vector cartoons.

## 4. Components (from the canvas)

| Component | Anatomy | Notes |
|---|---|---|
| `TopInfoRow` | 2–4 corner texts, Inter Tight 500 big | Golova style |
| `Germ` | `<svg 300×300>` spot path + ink path | seed, N, eyes, two, spot |
| `HeroGerm` | Germ with `eyes:'none'` + `pixelRing` eyes overlaid, pupils translate toward pointer (max 9px / 6px) | pointer → rAF → state |
| `InfectedLetter` | `<svg 200×260>`: d2 (fill) + d (ink, evenodd) + text fallback | see engine README |
| `LiveWordmark` | 3 InfectedLetters, `wordmarkModes(tick)` every 900ms | |
| `StrainCard` | title row (`FVC-001` 44px Inter 500 + mono meta) → cover → blurb → rule → meta + `Catch it ↗` | 2-col grid, 2px rules |
| `Cover/*` | `golova`, `creatura`, `glitch`, `connwax` — 400×300 SVG templates | copy from Main.dc.html covers c1–c4 |
| `SpecimenLabel` | black header bar, big wide catalog no., field rows w/ rules, accent "CERTIFIED CARRIER" bar, barcode, code text | Kit tile 01 |
| `Barcode` | `barcodePath(seed, w, h)` | |
| `SpreadMeter` | 24 bars of stacked blocks (`repeating-linear-gradient`), lit = level×24/5, top bars spot | buttons 1–5, `aria-pressed` |
| `Ticker` | ink bar, duplicated content, translateX −50% loop 34s | pause on reduced motion |
| `ConnwaxStack` | white band: spaced black bar label + bitnoise oval + wide word + oval-outlined word + bars | |
| `Banner` | `aspect-ratio: 1400/420`, background SVG + absolutely positioned letters (percent) | engine `banners()` |
| `DictionaryRow` | alternating ink bar / 2px outlined row, mono label left, big word right in mixed families | |
| `DishFooter` | bitnoise ellipse + ink bar with wide `FVC` + germ on the rim + crosshairs | |
| `NavTable` | 2-col rule table of links, last cell = Seoul clock | |
| `ToolCard` | 240px spec sidebar (icon, zigzag, badge, name/“Web Tool”, ×3 detail crop, description, zigzag, specimen code) + output + ink control bar | Lab board |

## 5. Motion

| Thing | Timing | Reduced motion |
|---|---|---|
| Wordmark mutate | 900ms tick | static (first state) |
| Banner mutate | 1000ms tick, one letter per word | static |
| Ticker | 34s loop | static |
| Hero eyes | follow pointer, `transition .18s ease-out`; idle wander on touch | centred |
| Germ float/jitter | 2.6–5s ease-in-out | none |

Pause all timers when the section is off-screen (IntersectionObserver).

## 6. Accessibility

- Text contrast ≥ 4.5:1 (ink on all grounds passes; white on cobalt passes; **never white on acid/yellow**).
- Every decorative SVG `aria-hidden`; meaningful ones `role="img"` + `aria-label` (e.g. "FVC, letters mutating").
- Real `<button>` / `<a>` / `<input>` + `<label>`; focus visible.
- Mutating text keeps an accessible static label (`aria-label="FVC"`).
