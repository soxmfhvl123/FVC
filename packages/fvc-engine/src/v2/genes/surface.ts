/**
 * SURFACE gene: what grows on and around the outline.
 * Hairs are drawn as strokes from roots on the outline along the outward normal, so they work
 * on any body. Guardrail: never an even ring of straight spikes (reads as a virus "crown") —
 * every stroke surface jitters length and bends (see rules.ts CROWN_GUARD).
 */
import { hash } from '../../core.ts';
import { CROWN_GUARD } from '../rules.ts';

export interface Grid {
  N: number;
  span: number;
  /** body-unit size of one cell */
  unit: number;
  sd: Float32Array;
  g: Uint8Array;
  field: (x: number, y: number) => number;
}

export const toX = (G: Grid, i: number) => ((i + 0.5) / G.N * 2 - 1) * G.span;

/** Ink a disc of radius `rad` at (x, y), only outside the body. */
export function stamp(G: Grid, x: number, y: number, rad: number, val = 1) {
  const R = Math.max(rad, G.unit * 0.45);
  const fi = ((x / G.span + 1) / 2) * G.N - 0.5;
  const fj = ((y / G.span + 1) / 2) * G.N - 0.5;
  const ri = R / G.unit + 1;
  for (let j = Math.max(0, Math.floor(fj - ri)); j <= Math.min(G.N - 1, Math.ceil(fj + ri)); j++)
    for (let i = Math.max(0, Math.floor(fi - ri)); i <= Math.min(G.N - 1, Math.ceil(fi + ri)); i++) {
      const k = j * G.N + i;
      if (G.sd[k] < -G.unit * 0.5) continue;
      if (Math.hypot(toX(G, i) - x, toX(G, j) - y) < R) G.g[k] = val;
    }
}

/** Outward normal of the field at (x, y). */
function normal(G: Grid, x: number, y: number): number {
  const e = 0.01;
  return Math.atan2(G.field(x, y + e) - G.field(x, y - e), G.field(x + e, y) - G.field(x - e, y));
}

/** Outline cells (just inside the edge), in scan order. */
function roots(G: Grid): [number, number][] {
  const out: [number, number][] = [];
  for (let j = 0; j < G.N; j++)
    for (let i = 0; i < G.N; i++) {
      const s = G.sd[j * G.N + i];
      if (s <= 0 && s > -G.unit) out.push([i, j]);
    }
  return out;
}

/** Walk a stroke: heading(s) gives the direction at arc length s, width(s) the half-width. */
function stroke(G: Grid, x: number, y: number, L: number, heading: (s: number) => number, width: (s: number) => number) {
  const step = Math.min(G.unit * 0.5, 0.012);
  for (let s = 0; s <= L; s += step) {
    const a = heading(s);
    x += Math.cos(a) * step;
    y += Math.sin(a) * step;
    if (Math.abs(x) > G.span || Math.abs(y) > G.span) return;
    stamp(G, x, y, width(s));
  }
}

/**
 * Draw the surface. `hair` 0–1 (length/density), `chaos` 0–1 (wobble), `face` = where the
 * eyes are (flagella grow away from it).
 */
export function drawSurface(id: number, G: Grid, ss: number, hair: number, chaos: number, face: [number, number]) {
  if (id === 4 || id === 5 || id === 6) return; // Bald, Double Wall, Halo: handled per cell in germ2
  const R = roots(G);
  if (!R.length) return;
  const perim = R.length * G.unit;
  const wobK = 0.5 + chaos;
  const lenK = 0.55 + hair * 0.9;
  const pick = (want: number, salt: number) => R.filter(([i, j]) => hash(i, j, ss + salt) < want / R.length);

  if (id === 0) {
    // Fur: curly v1-style hairs
    // outline cells overcount the perimeter on diagonals, hence 40 rather than v1's 54
    const want = 40 * (0.4 + hair * 1.2) * (perim / 6.283);
    for (const [i, j] of pick(want, 1)) {
      const x = toX(G, i);
      const y = toX(G, j);
      const n0 = normal(G, x, y);
      const L = (0.1 + hash(i, j, ss + 5) * 0.3) * lenK;
      const wob = (hash(i, j, ss + 6) - 0.5) * 3.2 * wobK;
      stroke(G, x, y, L, (s) => n0 + Math.atan(4.4 * wob * s), (s) => 0.026 * (1 - (0.55 * s) / L));
    }
  } else if (id === 1) {
    // Cilia: short, dense, brushed one way, never even
    const want = 80 * (0.4 + hair * 1.2) * (perim / 6.283);
    const brush = (hash(1, 2, ss) - 0.5) * 2;
    for (const [i, j] of pick(want, 2)) {
      const x = toX(G, i);
      const y = toX(G, j);
      const n0 = normal(G, x, y);
      const L = (0.06 + hash(i, j, ss + 7) * 0.06 * (1 + CROWN_GUARD.minLengthJitter)) * lenK;
      const bend = (brush * 5 + (hash(i, j, ss + 8) - 0.5) * 6) * wobK;
      const bendMin = Math.sign(bend || 1) * Math.max(Math.abs(bend), CROWN_GUARD.minBend);
      stroke(G, x, y, L, (s) => n0 + bendMin * s, () => 0.017);
    }
  } else if (id === 2) {
    // Flagella: 1–3 long wavy tails, away from the face
    const n = 1 + Math.floor(hash(3, 4, ss) * 3);
    const cand = R.map(([i, j]) => {
      const x = toX(G, i);
      const y = toX(G, j);
      return { x, y, score: Math.hypot(x - face[0], y - face[1]) + hash(i, j, ss + 9) * 0.5 };
    }).sort((a, b) => b.score - a.score);
    const chosen: { x: number; y: number }[] = [];
    for (const c of cand) {
      if (chosen.length >= n) break;
      if (chosen.every((o) => Math.hypot(c.x - o.x, c.y - o.y) > 0.45)) chosen.push(c);
    }
    chosen.forEach((c, k) => {
      const n0 = normal(G, c.x, c.y);
      const L = (0.65 + hash(k, 5, ss) * 0.4) * lenK;
      const ph = hash(k, 6, ss) * 6.283;
      const amp = 0.45 + 0.35 * chaos;
      stroke(G, c.x, c.y, L, (s) => n0 + amp * Math.sin(s * 11 + ph), (s) => 0.034 - 0.018 * (s / L));
    });
    // a little fuzz so the body is not bald
    for (const [i, j] of pick(14 * (perim / 6.283), 10)) {
      const x = toX(G, i);
      const y = toX(G, j);
      const n0 = normal(G, x, y);
      stroke(G, x, y, 0.05 + hash(i, j, ss + 11) * 0.05, (s) => n0 + s * 4, () => 0.016);
    }
  } else if (id === 3) {
    // Pili: sparse dots and stubs, at uneven distances
    const want = 34 * (0.4 + hair * 1.2) * (perim / 6.283);
    for (const [i, j] of pick(want, 3)) {
      const x = toX(G, i);
      const y = toX(G, j);
      const n0 = normal(G, x, y) + (hash(i, j, ss + 12) - 0.5) * 0.7 * wobK;
      const d = (0.05 + hash(i, j, ss + 13) * 0.1 * (1 + CROWN_GUARD.minLengthJitter)) * lenK;
      const rad = 0.02 + hash(i, j, ss + 14) * 0.014;
      stamp(G, x + Math.cos(n0) * d, y + Math.sin(n0) * d, rad);
      if (hash(i, j, ss + 15) < 0.4) stroke(G, x, y, d * 0.55, () => n0, () => 0.012);
    }
  }
}
