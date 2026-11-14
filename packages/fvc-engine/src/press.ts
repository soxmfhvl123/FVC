/**
 * Pressing Plant (splatter vinyl) and Colony (packed circles in a germ silhouette).
 * Both output SVG paths for a 300×300 box.
 */
import { circlePath, hash, noise, rng, runs } from './core.ts';
import { germRadius } from './germ.ts';

export interface VinylPaths {
  /** Four splatter colours, drawn in order c1..c4 over the base disc. */
  c1: string;
  c2: string;
  c3: string;
  c4: string;
  /** Groove rings — draw in black at ~30% opacity. */
  groove: string;
}

/**
 * Splatter vinyl. Draw: base circle (cx150 cy150 r148) → groove → c1..c4 → centre label (r54) → spindle (r3.5).
 */
export function vinyl(seed: number, o: { N?: number; splats?: number } = {}): VinylPaths {
  const N = o.N ?? 150;
  const cell = 300 / N;
  const r = rng(seed * 7 + 1);
  const nS = o.splats ?? 40;
  const splats = Array.from({ length: nS }, () => ({ rc: 0.42 + r() * 0.56, tc: r() * 6.2832, sz: 0.018 + r() * 0.07, col: 1 + Math.floor(r() * 4), el: 3 + r() * 4 }));
  const g = new Uint8Array(N * N);
  for (let j = 0; j < N; j++)
    for (let i = 0; i < N; i++) {
      const x = ((i + 0.5) / N) * 2 - 1;
      const y = ((j + 0.5) / N) * 2 - 1;
      const rr = Math.sqrt(x * x + y * y);
      const th = Math.atan2(y, x);
      if (rr > 0.985 || rr < 0.36) continue;
      let v = 0;
      splats.forEach((S, s) => {
        const dt = Math.atan2(Math.sin(th - S.tc), Math.cos(th - S.tc)) * rr;
        const dr = rr - S.rc;
        const f = (dt / S.sz) ** 2 + (dr / (S.sz * S.el)) ** 2;
        if (f < 1 + (noise(x * 9, y * 9, seed + s) - 0.5) * 1.4) v = S.col;
      });
      if (!v && hash(i, j, seed + 41) < 0.012) v = 1 + Math.floor(hash(j, i, seed) * 4);
      if (!v && (rr * 52) % 1 < 0.12) v = 5;
      g[j * N + i] = v;
    }
  return { c1: runs(g, N, N, cell, 1), c2: runs(g, N, N, cell, 2), c3: runs(g, N, N, cell, 3), c4: runs(g, N, N, cell, 4), groove: runs(g, N, N, cell, 5) };
}

export interface ColonyPaths {
  /** four colour groups of circles */
  a: string;
  b: string;
  c: string;
  d: string;
  /** small ink circles + pupils */
  ink: string;
  /** eye whites — draw with fill white + black stroke 3 */
  white: string;
}

/** Packs circles (6 sizes, biggest first) inside the germ outline of the same seed. */
export function colony(seed: number, o: { lumps?: number } = {}): ColonyPaths {
  const R = germRadius(seed, o.lumps);
  const G = 60;
  const cell = 300 / G;
  const occ = new Uint8Array(G * G);
  const out: ColonyPaths = { a: '', b: '', c: '', d: '', ink: '', white: '' };
  const keys: (keyof ColonyPaths)[] = ['a', 'b', 'c', 'd', 'ink'];
  const inside = (cx: number, cy: number, rad: number) => {
    const x = (cx / 300 * 2 - 1) * 1.45;
    const y = (cy / 300 * 2 - 1) * 1.45;
    return Math.sqrt(x * x + y * y) + (rad / 300) * 2 * 1.45 < R(Math.atan2(y, x));
  };
  const place = (gi: number, gj: number, k: number) => {
    for (let b = gj; b < gj + k; b++) for (let a = gi; a < gi + k; a++) if (a >= G || b >= G || occ[b * G + a]) return false;
    for (let b = gj; b < gj + k; b++) for (let a = gi; a < gi + k; a++) occ[b * G + a] = 1;
    return true;
  };
  for (const [ex, ey, er] of [[110, 128, 20], [178, 118, 15]]) {
    const k = Math.ceil((er * 2) / cell) + 1;
    const gi = Math.floor((ex - er) / cell);
    const gj = Math.floor((ey - er) / cell);
    for (let b = gj; b < gj + k; b++) for (let a = gi; a < gi + k; a++) if (a >= 0 && b >= 0 && a < G && b < G) occ[b * G + a] = 1;
    out.white += circlePath(ex, ey, er);
    out.ink += circlePath(ex + er * 0.35, ey + er * 0.15, er * 0.48);
  }
  for (const k of [7, 5, 4, 3, 2, 1]) {
    for (let gj = 0; gj < G; gj++)
      for (let gi = 0; gi < G; gi++) {
        const cx = (gi + k / 2) * cell;
        const cy = (gj + k / 2) * cell;
        const rad = (k * cell) / 2;
        if (!inside(cx, cy, rad * 0.6)) continue;
        const pr = k >= 5 ? 0.06 : k >= 3 ? 0.2 : 1;
        if (hash(gi, gj, seed + k * 13) > pr) continue;
        if (!place(gi, gj, k)) continue;
        const ci = Math.floor(hash(gi, gj, seed + 99) * (k === 1 ? 5 : 4));
        out[keys[ci]] += circlePath(cx, cy, rad * 0.9);
      }
  }
  return out;
}
