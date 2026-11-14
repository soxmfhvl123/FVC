/**
 * FVC engine — core math.
 * Everything here is pure and deterministic: same input → same output, on server or browser.
 */

/** Seeded random number generator (Park–Miller). Returns a function giving floats in [0, 1). */
export function rng(seed: number): () => number {
  let s = Math.floor(seed) % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Integer hash of a grid cell → float in [0, 1). */
export function hash(ix: number, iy: number, s: number): number {
  let h = (ix * 374761393 + iy * 668265263 + s * 982451653) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h = h ^ (h >>> 16);
  return (h >>> 0) / 4294967296;
}

/** Smooth value noise in [0, 1). */
export function noise(x: number, y: number, s: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  let fx = x - x0;
  let fy = y - y0;
  fx = fx * fx * (3 - 2 * fx);
  fy = fy * fy * (3 - 2 * fy);
  const a = hash(x0, y0, s);
  const b = hash(x0 + 1, y0, s);
  const c = hash(x0, y0 + 1, s);
  const d = hash(x0 + 1, y0 + 1, s);
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}

/** Three-octave fractal noise in [0, 1). */
export function fbm(x: number, y: number, s: number): number {
  return noise(x, y, s) * 0.55 + noise(x * 2.1, y * 2.1, s + 7) * 0.3 + noise(x * 4.3, y * 4.3, s + 13) * 0.15;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Turns a grid of cell values into one SVG path made of horizontal runs.
 * Only cells equal to `val` are drawn. This is how every bitmap in FVC becomes vector.
 */
export function runs(g: ArrayLike<number>, cols: number, rows: number, cell: number, val: number): string {
  let d = '';
  for (let j = 0; j < rows; j++) {
    let i = 0;
    while (i < cols) {
      if (g[j * cols + i] === val) {
        const start = i;
        while (i < cols && g[j * cols + i] === val) i++;
        const w = (i - start) * cell;
        d += `M${r2(start * cell)} ${r2(j * cell)}h${r2(w)}v${r2(cell)}h${r2(-w)}z`;
      } else i++;
    }
  }
  return d;
}

/** SVG path for a full circle. */
export function circlePath(cx: number, cy: number, R: number): string {
  return `M${r2(cx - R)} ${r2(cy)}a${r2(R)} ${r2(R)} 0 1 0 ${r2(2 * R)} 0a${r2(R)} ${r2(R)} 0 1 0 ${r2(-2 * R)} 0`;
}

/** Star / starburst polygon centred on 0,0. */
export function starPath(points: number, outer: number, inner: number): string {
  let d = '';
  for (let i = 0; i < points * 2; i++) {
    const rr = i % 2 ? inner : outer;
    const t = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    d += `${i ? 'L' : 'M'}${Math.round(rr * Math.cos(t) * 10) / 10} ${Math.round(rr * Math.sin(t) * 10) / 10} `;
  }
  return d + 'Z';
}

/** A row of small stars between x0 and x1 (banner border). */
export function starRow(x0: number, x1: number, y: number, step: number, ro: number, ri: number): string {
  let d = '';
  for (let x = x0; x <= x1; x += step) {
    for (let i = 0; i < 16; i++) {
      const rr = i % 2 ? ri : ro;
      const t = (i / 16) * Math.PI * 2;
      d += `${i ? 'L' : 'M'}${Math.round((x + rr * Math.cos(t)) * 10) / 10} ${Math.round((y + rr * Math.sin(t)) * 10) / 10}`;
    }
    d += 'Z';
  }
  return d;
}

/** Fake barcode: vertical bars of random width. */
export function barcodePath(seed: number, w: number, h: number): string {
  const r = rng(seed);
  let x = 0;
  let d = '';
  while (x < w) {
    const bw = 1 + Math.floor(r() * 4);
    if (x + bw > w) break;
    d += `M${x} 0h${bw}v${h}h-${bw}Z`;
    x += bw + 1 + Math.floor(r() * 3);
  }
  return d;
}

/** Decorative "specimen code" — looks like a 2D code but encodes nothing. Grid n×n, 6 units per module. */
export function specimenCodePath(seed: number, n = 21): string {
  const g = new Uint8Array(n * n);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) g[j * n + i] = hash(i, j, seed) > 0.52 ? 1 : 0;
  const finder = (ox: number, oy: number) => {
    for (let b = 0; b < 7; b++)
      for (let a = 0; a < 7; a++) {
        const on = a === 0 || b === 0 || a === 6 || b === 6 || (a >= 2 && a <= 4 && b >= 2 && b <= 4);
        g[(oy + b) * n + ox + a] = on ? 1 : 2;
      }
  };
  finder(0, 0);
  finder(n - 7, 0);
  finder(0, n - 7);
  return runs(g, n, n, 6, 1);
}

/** Zig-zag divider line. */
export function zigzagPath(w: number, amp: number, step: number): string {
  let d = `M0 ${amp}`;
  let x = 0;
  let up = true;
  while (x < w) {
    x += step;
    d += `L${x} ${up ? 0 : amp}`;
    up = !up;
  }
  return d;
}

/** Hand-ish scribble stroke. */
export function scribblePath(x: number, y: number, w: number, h: number, n: number, seed: number): string {
  const r = rng(seed);
  let d = `M${x} ${y + h / 2}`;
  for (let i = 0; i < n; i++) d += ` L${Math.round(x + ((i + 1) / n) * w)} ${Math.round(y + r() * h)}`;
  return d;
}
