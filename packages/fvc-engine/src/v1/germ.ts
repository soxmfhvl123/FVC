/**
 * Ttung-gyun — the FVC germ, engine v1. FROZEN (2026-11-16): do not edit.
 * Every released strain (`"engine": 1` in content/strains.json) and the picture hidden in
 * FVC-002 #0002 SPECIMEN (seed 2) are drawn by this file. test/v1-snapshot.test.ts compares
 * its output with stored hashes; any change fails the build. New work goes to src/v2/.
 *
 * One seed → one body. Output is two SVG paths in a 300×300 box: `ink` (black) and `spot` (the spot colour).
 */
import { circlePath, fbm, hash, noise, rng, runs } from '../core.ts';

export type EyeSet = 'two' | 'cyclops' | 'three' | 'none';

export interface GermOptions {
  /** Grid resolution across the 300px box. 40 = chunky, 110 = default, 150 = fine. */
  N?: number;
  /** Number of big bumps around the body (3–7). Default picked from seed. */
  lumps?: number;
  /** Number of hairs (cilia). Default 54. */
  hair?: number;
  /** Two inks (ink + spot) or one ink. Default true. */
  two?: boolean;
  /** Random dust pixels outside the body (0–0.02). Default 0.006. */
  dust?: number;
  eyes?: EyeSet;
}

export interface GermPaths {
  ink: string;
  spot: string;
}

/** Eye = [eyeX, eyeY, eyeRadius, pupilX, pupilY, pupilRadius] in body units (body radius ≈ 1). */
export const EYES: Record<EyeSet, number[][]> = {
  two: [
    [-0.3, -0.14, 0.22, -0.2, -0.12, 0.1],
    [0.28, -0.24, 0.16, 0.36, -0.22, 0.075],
  ],
  cyclops: [[0, -0.08, 0.34, 0.1, 0.02, 0.15]],
  three: [
    [-0.36, -0.12, 0.15, -0.36, -0.04, 0.07],
    [0, -0.32, 0.13, 0.02, -0.25, 0.06],
    [0.34, -0.1, 0.17, 0.34, -0.01, 0.08],
  ],
  none: [],
};

/** The body outline radius as a function of angle. Shared by germ() and colony(). */
export function germRadius(seed: number, lumps?: number): (theta: number) => number {
  const r = rng(seed);
  const k1 = lumps || 4 + Math.floor(r() * 3);
  const k2 = k1 + 2;
  const p1 = r() * 6.283;
  const p2 = r() * 6.283;
  const a1 = 0.07 + r() * 0.04;
  const a2 = 0.03 + r() * 0.03;
  return (th) => 1 + a1 * Math.sin(k1 * th + p1) + a2 * Math.sin(k2 * th + p2);
}

export function germ(seed: number, o: GermOptions = {}): GermPaths {
  const N = o.N ?? 110;
  const cell = 300 / N;
  const span = 1.45;
  const R0 = germRadius(seed, o.lumps);
  const H = o.hair ?? 54;
  const two = o.two !== false;
  const dust = o.dust ?? 0.006;
  const eyes = EYES[o.eyes ?? 'two'];
  const g = new Uint8Array(N * N);

  for (let j = 0; j < N; j++)
    for (let i = 0; i < N; i++) {
      const x = ((i + 0.5) / N * 2 - 1) * span;
      const y = ((j + 0.5) / N * 2 - 1) * span;
      const dist = Math.sqrt(x * x + y * y);
      const th = Math.atan2(y, x);
      const R = R0(th) + (noise(x * 6, y * 6, seed + 3) - 0.5) * 0.08;
      let v = 0;
      if (dist < R) {
        const t = fbm(x * 2.2 + 5, y * 2.2 + 5, seed);
        const fine = hash(i, j, seed + 11);
        if (dist > R - 0.07) v = fine > 0.12 ? 1 : 0; // outline band
        else if (two && t > 0.57) v = 2; // spot blotch
        else if (t < 0.42) v = fine > 0.04 ? 1 : 0; // solid ink
        else if (t < 0.49) v = fine > 0.5 ? 1 : 0; // 50% dither
        else v = fine > 0.9 ? 1 : 0; // light dither
        for (const E of eyes) {
          const de = Math.hypot(x - E[0], y - E[1]);
          const dp = Math.hypot(x - E[3], y - E[4]);
          if (dp < E[5]) v = 1;
          else if (de < E[2]) v = 0;
          else if (de < E[2] + 0.055) v = 1;
        }
      } else if (dist < R + 0.45) {
        // curly hairs: check the 5 nearest hair rays
        const out = dist - R;
        const k0 = Math.round((th / 6.2832) * H);
        for (let kk = k0 - 2; kk <= k0 + 2; kk++) {
          const Lk = 0.1 + hash(kk, 0, seed + 5) * 0.3;
          if (out > Lk) continue;
          const wob = (hash(kk, 1, seed + 5) - 0.5) * 3.2;
          const ang = (kk / H) * 6.2832 + wob * out * out * 2.2;
          const dth = Math.abs(Math.atan2(Math.sin(th - ang), Math.cos(th - ang))) * dist;
          if (dth < 0.026 * (1 - (0.55 * out) / Lk)) {
            v = 1;
            break;
          }
        }
      }
      if (v === 0 && dist >= R) {
        const hd = hash(i, j, seed + 29);
        if (hd < dust) v = 1;
        else if (two && hd > 1 - dust * 0.7) v = 2;
      }
      g[j * N + i] = v;
    }
  return { ink: runs(g, N, N, cell, 1), spot: runs(g, N, N, cell, 2) };
}

/**
 * Pixel-circle ring or disc centred on 0,0 (for live eyes laid over a germ made with eyes:'none').
 * W = 0 → filled disc of radius R; W > 0 → ring from R to R+W.
 */
export function pixelRing(R: number, W: number, cell: number): string {
  const n = Math.ceil(((R + W) * 2) / cell) + 2;
  const o = (n * cell) / 2;
  const g = new Uint8Array(n * n);
  for (let j = 0; j < n; j++)
    for (let i = 0; i < n; i++) {
      const x = (i + 0.5) * cell - o;
      const y = (j + 0.5) * cell - o;
      const d = Math.sqrt(x * x + y * y);
      g[j * n + i] = (W > 0 ? d >= R && d < R + W : d < R) ? 1 : 0;
    }
  return runs(g, n, n, cell, 1).replace(/M([-\d.]+) ([-\d.]+)/g, (_m, a, b) =>
    `M${Math.round((parseFloat(a) - o) * 100) / 100} ${Math.round((parseFloat(b) - o) * 100) / 100}`,
  );
}

/** Hero eye layout (matches germ seed 7 at N 140, drawn in a 300 box). */
export const HERO_EYES = {
  left: { cx: 119, cy: 135.5, white: 23, ring: [22, 5], pupil: 10.5, travel: 9 },
  right: { cx: 179, cy: 125.2, white: 17, ring: [16, 4.5], pupil: 8, travel: 6 },
};

export { circlePath };
