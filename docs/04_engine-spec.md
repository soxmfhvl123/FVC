# 04 — Engine Spec (`packages/fvc-engine`)

API + usage: `packages/fvc-engine/README.md`. This file explains *how* each generator works so it can be tuned safely.

## Invariants
1. Deterministic: output depends only on arguments. Never use `Math.random()` inside the engine (UI may use it to pick a new seed).
2. Port parity: `npm test` compares every generator byte-for-byte with the canvas prototype (`test/fixtures/legacy-engine.methods.js`). If you intentionally change an algorithm, update the fixture in the same commit and note it in the changelog.
3. Output is plain SVG path strings in fixed boxes (germ/vinyl/colony 300×300, letter 200×260, banner frame 1400×420).

## Germ — `germ(seed, opts)`
- Grid N×N over a 300 box, sampling the plane in [−1.45, 1.45].
- Outline radius `R(θ) = 1 + a1·sin(k1θ+p1) + a2·sin(k2θ+p2)` (+ small edge noise). `k1 = lumps` (3–7).
- Inside body, `fbm` value `t` decides: edge band (ink, 88%) → spot blotch (`t > .57`, only when `two`) → solid ink (`t < .42`) → 50% dither (`< .49`) → light dither.
- Eyes punch holes (white), ring (ink) and pupil (ink). Presets: two / cyclops / three / none.
- Hairs: rays every `2π/H`, length 0.1–0.4, curl `wob·out²·2.2`, tapering width.
- Dust: sparse random pixels outside (ink + spot).
- Cost ~N² cells (N 140 ≈ 20k).

## Letters — `GlyphCache` + `letter()`
- Rasterise char in Archivo 900 extra-condensed 300px into a 200×260 canvas; sample a 40×52 mask (cell 5).
- Textures: `pixel` (5% dropout), `dots` (ring beads every 2 cells, evenodd), `outline` (outer edge + 3-cell inset edge), `noise` (row shifts + fbm dropout + edge speckle), `warp` (sine row displacement), `melt` (noisy dilation + drips; fill + dotted edge).
- Text strains: `goth`, `gothc` (colour + ink stroke), `serif`, `serifc`, `wide` (125%), `contour` (colour + 16px ink stroke, `paint-order: stroke`), `outlined`, `solid`.
- Fallback: if a raster strain is requested before the glyph exists → `wide` (or `contour` for melt).

## Word layout — `layoutWord()`
- Advances by `w × factor` (0.62 default; wide 0.88, serif 0.5, goth 0.6, block 0.86; narrow chars ×0.62; m/w ×1.3).
- Seeded jitter: vertical `y`, rotation `r`, scale `s`.
- Returns percent positions so layouts scale with their container.

## Vinyl — `vinyl(seed)`
- 40 elliptical splats placed in polar space (radius 0.42–0.98), stretched radially (`el` 3–7), noisy edges; 4 colour groups; specks; groove rings every 1/52 of radius; label hole r < 0.36.

## Colony — `colony(seed)`
- 60×60 occupancy grid; eyes reserved first; circles of 7,5,4,3,2,1 cells placed biggest-first with decreasing rarity; colour by hash into 4 groups (+ ink for size 1).

## Banners — `banners(seed, tick, cache)`
- Six fixed compositions; `seed` → jitter; `tick` → in each word one letter (rotating index) swaps to an alternate strain.
- Background art is static SVG in the prototype includes (`design/canvas/_templates/inc/b1..b6.html`).

## Tuning knobs worth exposing later
`germ`: dither thresholds, hair density · `vinyl`: splat count/size · `colony`: rarity per size · `letter`: dropout %.
