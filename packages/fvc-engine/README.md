# @fvc/engine

The generative core of Fat Virus Carrier Records. Pure TypeScript, no dependencies, deterministic.

**Golden rule:** store the *seed*, never the generated SVG. Same seed → same output on server and browser.

## What's inside

| Module | Function | Output |
|---|---|---|
| `core.ts` | `rng`, `hash`, `noise`, `fbm`, `runs`, `circlePath`, `starPath`, `starRow`, `barcodePath`, `specimenCodePath`, `zigzagPath`, `scribblePath` | math + small SVG helpers |
| `germ.ts` | `germ(seed, opts)` | `{ ink, spot }` paths in a 300×300 box |
| | `germRadius(seed)` | the outline function (shared with colony) |
| | `pixelRing(R, W, cell)` + `HERO_EYES` | pixel eyes for the mouse-following hero germ |
| `glyph.ts` | `GlyphCache`, `letter`, `layoutWord`, `wordmarkModes`, `mutateModes` | mutating “infected” letters |
| `press.ts` | `vinyl(seed)` | splatter record paths |
| | `colony(seed)` | packed circles in a germ outline |
| `banners.ts` | `banners(seed, tick, cache)` + `BANNER_CHARS` | the six banner letter layouts |
| `tokens.ts` | `color`, `font`, `SPOT_INKS`, `GOOGLE_FONTS_URL` | design tokens |

## Commands

```bash
npm test            # 7 tests — the port is checked byte-for-byte against the canvas prototype
npm run typecheck   # tsc --noEmit
npm run playground  # writes playground/index.html (germ / vinyl / colony gallery)
```

Node 22+ runs the `.ts` files directly (type stripping). In Next.js, import from `@fvc/engine` (set `transpilePackages: ['@fvc/engine']`).

## Germ

```tsx
import { germ, color } from '@fvc/engine';

export function Germ({ seed, spot = color.spot, N = 110, eyes = 'two' as const }) {
  const g = germ(seed, { N, eyes });            // cheap: ~5–20 ms. Safe in a Server Component.
  return (
    <svg viewBox="0 0 300 300" role="img" aria-label={`FVC germ, seed ${seed}`}>
      <path d={g.spot} fill={spot} />
      <path d={g.ink} fill={color.ink} />
    </svg>
  );
}
```

Options: `N` grid (40 chunky / 110 default / 150 fine), `lumps` 3–7, `hair` (default 54), `two` (2 inks or 1), `dust` (0–0.02), `eyes` `'two' | 'cyclops' | 'three' | 'none'`.

## Letters (browser only)

Raster strains (`pixel`, `dots`, `outline`, `noise`, `warp`, `melt`, `block`) need the glyph rasterised once on a canvas **after fonts load**. Until then `letter()` falls back to a text strain, so nothing is ever blank.

```tsx
'use client';
import { useEffect, useMemo, useState } from 'react';
import { GlyphCache, letter, wordmarkModes } from '@fvc/engine';

const cache = typeof window !== 'undefined' ? new GlyphCache(() => document.createElement('canvas')) : undefined;

export function LiveWordmark() {
  const [tick, setTick] = useState(0);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    GlyphCache.fontsReady().then(() => { cache!.ensure('FVC'); setReady(true); });
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const t = setInterval(() => setTick((n) => n + 1), 900);
    return () => clearInterval(t);
  }, []);
  const modes = wordmarkModes(tick);
  return (
    <div role="img" aria-label="FVC">
      {'FVC'.split('').map((ch, i) => {
        const L = letter(ch, modes[i], ready ? cache : undefined);
        return (
          <svg key={i} viewBox="0 0 200 260" aria-hidden>
            {L.d2 && <path d={L.d2} fill={L.c2} />}
            <path d={L.d} fill={L.c1} fillRule="evenodd" />
            <text x={100} y={244} textAnchor="middle" fontFamily={L.font} fontStyle={L.fstyle} fontWeight={L.weight}
              fontStretch={L.stretch} fontSize={L.size} fill={L.tfill} stroke={L.tstroke} strokeWidth={L.tsw}
              paintOrder="stroke" strokeLinejoin="round">{L.d ? '' : ch}</text>
          </svg>
        );
      })}
    </div>
  );
}
```

Note: when `L.d` is set (raster strain) do **not** also print the text — the prototype hides it with `fill="none"`; in React just render an empty string as above.

## Banners

`banners(seed, tick, cache)` returns `PlacedLetter[]` per banner with `lx / ly / lw` in **percent** of a 1400×420 frame, plus `rot`. Render each letter as an absolutely positioned `<svg viewBox="0 0 200 260">` inside a `position: relative; aspect-ratio: 1400/420` box. Background artwork per banner lives in `design/canvas/Banners.dc.html` (search for `INC:b1`… blocks) — port it as static SVG.

## Performance notes

- `germ` at N=140 ≈ 20k cells; fine on the server, fine on click in the browser. Memoise by `[seed, N, eyes, two]`.
- Pre-render every strain cover at build time (seed lives in `content/strains.json`).
- `GlyphCache.ensure` costs ~2 ms per character; call it only for new characters.
