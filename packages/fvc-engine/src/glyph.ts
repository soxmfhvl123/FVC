/**
 * Infected type — letters that catch different "strains".
 * A letter is rasterised once (browser canvas) into a 40×52 mask, then turned into textures.
 */
import { circlePath, fbm, hash, noise, rng, runs } from './core.ts';

export const RASTER_MODES = ['pixel', 'dots', 'outline', 'noise', 'warp', 'melt'] as const;
export const TEXT_MODES = ['goth', 'gothc', 'serif', 'serifc', 'wide', 'contour', 'outlined', 'solid'] as const;
export type RasterMode = (typeof RASTER_MODES)[number];
export type LetterMode = RasterMode | (typeof TEXT_MODES)[number] | 'block';

/** The seven strains used by the live wordmark, in order. */
export const WORDMARK_MODES: LetterMode[] = ['pixel', 'dots', 'outline', 'noise', 'goth', 'serif', 'wide'];

export const GLYPH_BOX = { w: 200, h: 260, cell: 5, cols: 40, rows: 52, baseline: 248, fontPx: 300 };

export interface GlyphTextures {
  pixel: string;
  dots: string;
  outline: string;
  noise: string;
  warp: string;
  melt: { fill: string; edge: string };
}

export type Mask = Uint8Array;

/** Texture for one raster mode. `dots` returns ring-beads (use fill-rule="evenodd"). */
export function glyphTexture(m: Mask, C: number, Rr: number, cell: number, mode: Exclude<RasterMode, 'melt'>, seed: number): string {
  const at = (i: number, j: number) => (i >= 0 && j >= 0 && i < C && j < Rr ? m[j * C + i] : 0);
  if (mode === 'dots') {
    let d = '';
    for (let j = 0; j < Rr; j += 2)
      for (let i = 0; i < C; i += 2)
        if (at(i, j) || at(i + 1, j + 1)) d += circlePath((i + 1) * cell, (j + 1) * cell, cell * 1.18) + circlePath((i + 1) * cell, (j + 1) * cell, cell * 0.5);
    return d;
  }
  const g = new Uint8Array(C * Rr);
  const er = (a: number, b: number) => at(a, b) && at(a - 3, b) && at(a + 3, b) && at(a, b - 3) && at(a, b + 3);
  for (let j = 0; j < Rr; j++)
    for (let i = 0; i < C; i++) {
      let v = 0;
      if (mode === 'pixel') v = at(i, j) && hash(i, j, seed) > 0.05 ? 1 : 0;
      else if (mode === 'outline') {
        const edge = at(i, j) && (!at(i - 1, j) || !at(i + 1, j) || !at(i, j - 1) || !at(i, j + 1));
        const edge2 = er(i, j) && (!er(i - 1, j) || !er(i + 1, j) || !er(i, j - 1) || !er(i, j + 1));
        v = edge || edge2 ? 1 : 0;
      } else if (mode === 'warp') {
        const shift = Math.round(Math.sin(j * 0.31 + seed) * 3.4 + Math.sin(j * 0.09 + seed * 2) * 2);
        v = at(i + shift, j) && hash(i, j, seed) > 0.03 ? 1 : 0;
      } else if (mode === 'noise') {
        const sh = hash(0, j, seed) < 0.16 ? Math.round((hash(1, j, seed) - 0.5) * 10) : 0;
        if (at(i - sh, j)) v = fbm(i * 0.2, j * 0.2, seed) > 0.4 ? 1 : 0;
        else if ((at(i + 2, j) || at(i - 2, j) || at(i, j + 2) || at(i, j - 2)) && hash(i, j, seed + 3) < 0.16) v = 1;
      }
      g[j * C + i] = v;
    }
  return runs(g, C, Rr, cell, 1);
}

/** Melted letter: swollen fill + drips, outlined with dots. */
export function meltTexture(m: Mask, C: number, Rr: number, cell: number, seed: number) {
  const at = (i: number, j: number) => (i >= 0 && j >= 0 && i < C && j < Rr ? m[j * C + i] : 0);
  const g = new Uint8Array(C * Rr);
  const drip: number[] = [];
  for (let i = 0; i < C; i++) drip.push(hash(i, 0, seed) < 0.18 ? 2 + Math.floor(hash(i, 1, seed) * 6) : 0);
  for (let j = 0; j < Rr; j++)
    for (let i = 0; i < C; i++) {
      let on = at(i, j);
      const rad = 1 + Math.round(noise(i * 0.25, j * 0.25, seed) * 2);
      for (let b = -rad; b <= rad && !on; b++) for (let a = -rad; a <= rad && !on; a++) if (a * a + b * b <= rad * rad && at(i + a, j + b)) on = 1;
      if (!on && drip[i]) for (let b = 1; b <= drip[i]; b++) if (at(i, j - b) && !at(i, j - b + 1)) on = 1;
      g[j * C + i] = on ? 1 : 0;
    }
  let edge = '';
  for (let j = 0; j < Rr; j++)
    for (let i = 0; i < C; i++) {
      if (!g[j * C + i]) continue;
      const e = i === 0 || !g[j * C + i - 1] || i === C - 1 || !g[j * C + i + 1] || j === 0 || !g[(j - 1) * C + i] || j === Rr - 1 || !g[(j + 1) * C + i];
      if (e) edge += circlePath((i + 0.5) * cell, (j + 0.5) * cell, cell * 0.62);
    }
  return { fill: runs(g, C, Rr, cell, 1), edge };
}

export function allTextures(m: Mask, seed: number): GlyphTextures {
  const { cols: C, rows: R, cell } = GLYPH_BOX;
  return {
    pixel: glyphTexture(m, C, R, cell, 'pixel', seed),
    dots: glyphTexture(m, C, R, cell, 'dots', seed + 1),
    outline: glyphTexture(m, C, R, cell, 'outline', seed + 2),
    noise: glyphTexture(m, C, R, cell, 'noise', seed + 3),
    warp: glyphTexture(m, C, R, cell, 'warp', seed + 4),
    melt: meltTexture(m, C, R, cell, seed + 5),
  };
}

/** Anything that can draw text and hand back RGBA pixels: a browser canvas, OffscreenCanvas or node-canvas. */
export interface CanvasLike {
  width: number;
  height: number;
  getContext(type: '2d'): any;
}

/**
 * Browser-side cache. Call `await GlyphCache.fontsReady()` first so masks use Archivo,
 * then `cache.ensure(chars)` whenever new characters appear.
 */
export class GlyphCache {
  private map = new Map<string, GlyphTextures>();
  private makeCanvas: () => CanvasLike;
  constructor(makeCanvas: () => CanvasLike) {
    this.makeCanvas = makeCanvas;
  }

  static async fontsReady(): Promise<void> {
    if (typeof document === 'undefined' || !document.fonts?.load) return;
    await Promise.all([
      document.fonts.load('900 300px Archivo'),
      document.fonts.load('800 200px "Grenze Gotisch"'),
      document.fonts.load('italic 200px "Instrument Serif"'),
    ]).catch(() => undefined);
  }

  get(ch: string): GlyphTextures | undefined {
    return this.map.get(ch);
  }

  ensure(chars: string | string[]): void {
    const list = Array.from(new Set(Array.isArray(chars) ? chars : chars.split(''))).filter((c) => c.trim() && !this.map.has(c));
    if (!list.length) return;
    const { w: W, h: H, cell, cols: C, rows: R, baseline, fontPx } = GLYPH_BOX;
    const cv = this.makeCanvas();
    cv.width = W;
    cv.height = H;
    const ctx = cv.getContext('2d');
    for (const ch of list) {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#000';
      try {
        ctx.fontStretch = 'extra-condensed';
      } catch {
        /* older canvases ignore width */
      }
      ctx.font = `900 ${fontPx}px Archivo, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(ch, W / 2, baseline);
      const data: Uint8ClampedArray = ctx.getImageData(0, 0, W, H).data;
      const m = new Uint8Array(C * R);
      for (let j = 0; j < R; j++)
        for (let i = 0; i < C; i++) {
          const px = Math.floor((i + 0.5) * cell);
          const py = Math.floor((j + 0.5) * cell);
          m[j * C + i] = data[(py * W + px) * 4 + 3] > 120 ? 1 : 0;
        }
      this.map.set(ch, allTextures(m, ch.charCodeAt(0)));
    }
  }
}

/** Everything needed to draw one letter inside a 200×260 viewBox. */
export interface LetterSpec {
  ch: string;
  mode: LetterMode;
  /** Path drawn in c1 (ink). */
  d: string;
  c1: string;
  /** Path drawn behind, in c2 (melt fill / block background). */
  d2: string;
  c2: string;
  /** Text fallback / text modes: draw <text x=100 y=244 text-anchor=middle> with these. */
  tfill: string;
  tstroke: string;
  tsw: number;
  font: string;
  fstyle: 'normal' | 'italic';
  weight: number;
  stretch: string;
  size: number;
}

export interface LetterOptions {
  ink?: string;
  /** Fill for contour / melt / block / *c modes. */
  color?: string;
  /** Recolour raster ink (e.g. magenta pixel letters). */
  rasterColor?: string;
  textColor?: string;
  blockInk?: string;
}

const RASTER = new Set(['pixel', 'dots', 'outline', 'noise', 'warp', 'melt', 'block']);

/** Build a letter. If the glyph is not rasterised yet, falls back to a text mode so nothing is ever blank. */
export function letter(ch: string, mode: LetterMode, cache?: { get(ch: string): GlyphTextures | undefined }, o: LetterOptions = {}): LetterSpec {
  const ink = o.ink ?? '#0B0B0B';
  const col = o.color ?? '#A6FF00';
  const tex = cache?.get(ch);
  if (RASTER.has(mode) && !tex) mode = mode === 'melt' ? 'contour' : 'wide';
  const L: LetterSpec = { ch, mode, d: '', c1: ink, d2: '', c2: 'none', tfill: 'none', tstroke: 'none', tsw: 0, font: 'Archivo, sans-serif', fstyle: 'normal', weight: 900, stretch: '62%', size: 300 };
  switch (mode) {
    case 'melt':
      L.d2 = tex!.melt.fill;
      L.c2 = col;
      L.d = tex!.melt.edge;
      break;
    case 'block':
      L.d2 = 'M14 26h172v228h-172z';
      L.c2 = col;
      L.d = tex!.pixel;
      L.c1 = o.blockInk ?? '#F7F7F5';
      break;
    case 'pixel':
    case 'dots':
    case 'outline':
    case 'noise':
    case 'warp':
      L.d = tex![mode];
      if (o.rasterColor) L.c1 = o.rasterColor;
      break;
    case 'contour':
      Object.assign(L, { tfill: col, tstroke: ink, tsw: 16 });
      break;
    case 'outlined':
      Object.assign(L, { tstroke: ink, tsw: 5 });
      break;
    case 'goth':
      Object.assign(L, { tfill: o.textColor ?? ink, font: 'Grenze Gotisch, serif', weight: 800, stretch: 'normal', size: 290 });
      break;
    case 'gothc':
      Object.assign(L, { tfill: col, tstroke: ink, tsw: 12, font: 'Grenze Gotisch, serif', weight: 900, stretch: 'normal', size: 290 });
      break;
    case 'serif':
      Object.assign(L, { tfill: o.textColor ?? ink, font: 'Instrument Serif, serif', fstyle: 'italic', weight: 400, stretch: 'normal', size: 330 });
      break;
    case 'serifc':
      Object.assign(L, { tfill: col, tstroke: ink, tsw: 10, font: 'Instrument Serif, serif', fstyle: 'italic', weight: 400, stretch: 'normal', size: 330 });
      break;
    case 'solid':
      L.tfill = ink;
      break;
    default: // wide
      Object.assign(L, { tfill: o.textColor ?? ink, stretch: '125%', size: 220 });
  }
  return L;
}

/** A letter placed inside a frame. Positions are % of the frame so layouts scale with the container. */
export interface PlacedLetter extends LetterSpec {
  /** left, top, width — percent of frame width/height/width. */
  lx: number;
  ly: number;
  lw: number;
  /** rotation in degrees */
  rot: number;
}

export interface Jitter {
  /** vertical jitter in frame px */
  y?: number;
  /** rotation jitter in degrees */
  r?: number;
  /** scale jitter (0.2 = ±10%) */
  s?: number;
}

const ADVANCE: Partial<Record<LetterMode, number>> = { wide: 0.88, serif: 0.5, serifc: 0.52, goth: 0.6, gothc: 0.62, block: 0.86 };

/**
 * Lay out a word letter by letter in a frame (default 1400×420 banner).
 * `modes` is a list (cycled) or a function (index, char) → mode.
 */
export function layoutWord(
  str: string,
  x: number,
  y: number,
  w: number,
  modes: LetterMode[] | ((i: number, ch: string) => LetterMode),
  cache?: { get(ch: string): GlyphTextures | undefined },
  o: LetterOptions = {},
  seed = 1,
  jit: Jitter = {},
  frame = { w: 1400, h: 420 },
): PlacedLetter[] {
  const r = rng(seed);
  const out: PlacedLetter[] = [];
  let cx = x;
  str.split('').forEach((ch, i) => {
    const j1 = r();
    const j2 = r();
    const j3 = r();
    if (ch === ' ') {
      cx += w * 0.32;
      return;
    }
    const mode = typeof modes === 'function' ? modes(i, ch) : modes[i % modes.length];
    const L = letter(ch, mode, cache, o);
    const lw = w * (1 + (j3 - 0.5) * (jit.s ?? 0));
    const dy = (j1 - 0.5) * (jit.y ?? 0);
    const rot = (j2 - 0.5) * (jit.r ?? 0);
    let f = ADVANCE[mode] ?? 0.62;
    if ('iljI1!.,:;t'.includes(ch)) f *= 0.62;
    if ('mwMW'.includes(ch)) f *= 1.3;
    out.push({
      ...L,
      lx: Math.round((cx / frame.w) * 10000) / 100,
      ly: Math.round(((y + dy) / frame.h) * 10000) / 100,
      lw: Math.round((lw / frame.w) * 10000) / 100,
      rot: Math.round(rot * 10) / 10,
    });
    cx += lw * f;
  });
  return out;
}

/** Live wordmark: which strain each letter of "FVC" shows at a given tick. */
export function wordmarkModes(tick: number, letters = 3): LetterMode[] {
  return Array.from({ length: letters }, (_, i) => WORDMARK_MODES[(tick + i * 2) % WORDMARK_MODES.length]);
}

/** Mutator rule: random strain per letter, never the same as the neighbour. */
export function mutateModes(text: string, seed: number): LetterMode[] {
  let prev = -1;
  return text.split('').map((_, i) => {
    let mi = Math.floor(hash(i, seed, 77) * 7);
    if (mi === prev) mi = (mi + 1) % 7;
    prev = mi;
    return WORDMARK_MODES[mi];
  });
}
