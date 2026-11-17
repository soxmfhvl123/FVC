/**
 * PATTERN gene: what fills the body inside the outline band.
 * Returns a per-cell function → 0 paper · 1 ink · 2 spot. With one ink, spot falls back to light dither.
 */
import { fbm, hash, noise } from '../../core.ts';
import type { Eye } from './eyes.ts';

export type PatternFn = (x: number, y: number, i: number, j: number, depth: number) => number;

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

/** Mini germ inside the body (Carrier). */
interface Mini {
  cx: number;
  cy: number;
  r: number;
}

export function makePattern(
  id: number,
  ps: number,
  two: boolean,
  r: () => number,
  sd: (x: number, y: number) => number,
  eyes: Eye[],
): { fn: PatternFn; minis?: Mini[] } {
  const light = (fine: number) => (fine > 0.9 ? 1 : 0);
  const shade = (x: number, y: number, fine: number) => {
    const t = fbm(x * 2.2 + 5, y * 2.2 + 5, ps);
    if (t < 0.42) return fine > 0.04 ? 1 : 0;
    if (t < 0.49) return fine > 0.5 ? 1 : 0;
    return light(fine);
  };
  const spot = (fine: number) => (two ? 2 : light(fine));

  switch (id) {
    case 1: {
      // Spots: leopard dots on a jittered grid
      const c = 0.3 + r() * 0.14;
      const sz = 0.22 + r() * 0.14;
      return {
        fn: (x, y, i, j) => {
          const fine = hash(i, j, ps + 11);
          const gx = Math.floor(x / c);
          const gy = Math.floor(y / c);
          for (let b = gy - 1; b <= gy + 1; b++)
            for (let a = gx - 1; a <= gx + 1; a++) {
              const h = hash(a, b, ps);
              if (h < 0.2) continue;
              const px = (a + 0.2 + hash(a, b, ps + 1) * 0.6) * c;
              const py = (b + 0.2 + hash(a, b, ps + 2) * 0.6) * c;
              const rad = c * sz * (0.6 + h * 0.6);
              const d = Math.hypot(x - px, y - py);
              if (d < rad) return spot(fine);
              if (d < rad + 0.035) return fine > 0.15 ? 1 : 0;
            }
          return light(fine);
        },
      };
    }
    case 2: {
      // Bands: tilted stripes
      const period = 0.26 + r() * 0.14;
      const tilt = (r() - 0.5) * 0.7;
      const cs = Math.cos(tilt);
      const sn = Math.sin(tilt);
      return {
        fn: (x, y, i, j) => {
          const fine = hash(i, j, ps + 11);
          const u = (y * cs - x * sn + (noise(x * 3, y * 3, ps) - 0.5) * 0.12) / period;
          const f = u - Math.floor(u);
          if (f < 0.4) return spot(fine);
          if (f < 0.48) return fine > 0.1 ? 1 : 0;
          return light(fine);
        },
      };
    }
    case 3: {
      // Nucleus: one big off-centre core
      let best = { x: 0, y: 0, d: 0 };
      const bias = r() * 6.283;
      for (let y = -1.3; y <= 1.3; y += 0.05)
        for (let x = -1.3; x <= 1.3; x += 0.05) {
          const d = -sd(x, y);
          if (d <= 0) continue;
          const clear = eyes.every((e) => Math.hypot(x - e.cx, y - e.cy) > e.r + 0.1);
          const s = d + (x * Math.cos(bias) + y * Math.sin(bias)) * 0.12 + (clear ? 0.2 : -1);
          if (s > best.d) best = { x, y, d: s };
        }
      const rad = Math.max(0.12, Math.min(0.38, -sd(best.x, best.y) * 0.55));
      const ox = (r() - 0.5) * rad * 0.6;
      const oy = (r() - 0.5) * rad * 0.6;
      return {
        fn: (x, y, i, j) => {
          const fine = hash(i, j, ps + 11);
          const d = Math.hypot(x - best.x, y - best.y);
          if (d < rad) {
            if (Math.hypot(x - best.x - ox, y - best.y - oy) < rad * 0.3) return fine > 0.05 ? 1 : 0;
            return d > rad - 0.045 ? (fine > 0.08 ? 1 : 0) : spot(fine);
          }
          const t = fbm(x * 2.2 + 5, y * 2.2 + 5, ps);
          return t < 0.45 ? (fine > 0.5 ? 1 : 0) : light(fine);
        },
      };
    }
    case 4: {
      // Gradient: ordered-dither halftone along a direction
      const a = r() * 6.283;
      const cs = Math.cos(a);
      const sn = Math.sin(a);
      return {
        fn: (x, y, i, j) => {
          const fine = hash(i, j, ps + 11);
          const g = Math.min(1, Math.max(0, (x * cs + y * sn) * 0.42 + 0.5 + (fbm(x * 2, y * 2, ps) - 0.5) * 0.3));
          const th = BAYER[(j & 3) * 4 + (i & 3)];
          if (g > 0.08 && th < g * 0.95) return 1;
          if (two && g < 0.3 && th < (0.3 - g) * 2.4) return 2;
          return light(fine) && fine > 0.97 ? 1 : 0;
        },
      };
    }
    case 5: {
      // Carrier: little germs riding inside
      const n = 1 + Math.floor(r() * 3);
      const minis: Mini[] = [];
      for (let y = -1.25; y <= 1.25 && minis.length < n; y += 0.07)
        for (let x = -1.25; x <= 1.25 && minis.length < n; x += 0.07) {
          if (r() > 0.18) continue;
          const rad = 0.13 + r() * 0.1;
          if (-sd(x, y) < rad + 0.1) continue;
          if (!eyes.every((e) => Math.hypot(x - e.cx, y - e.cy) > e.r + rad + 0.08)) continue;
          if (!minis.every((m) => Math.hypot(x - m.cx, y - m.cy) > m.r + rad + 0.06)) continue;
          minis.push({ cx: x, cy: y, r: rad });
        }
      return {
        minis,
        fn: (x, y, i, j) => {
          const fine = hash(i, j, ps + 11);
          for (const m of minis) {
            const d = Math.hypot(x - m.cx, y - m.cy);
            const R = m.r * (1 + 0.08 * Math.sin(5 * Math.atan2(y - m.cy, x - m.cx) + m.cx * 9));
            if (d < R) {
              if (Math.hypot(x - m.cx + m.r * 0.3, y - m.cy + m.r * 0.15) < m.r * 0.17) return 1; // eye
              if (Math.hypot(x - m.cx - m.r * 0.25, y - m.cy + m.r * 0.22) < m.r * 0.13) return 1; // eye
              return d > R - 0.035 ? (fine > 0.08 ? 1 : 0) : spot(fine);
            }
            if (d < R + 0.06 && hash(i, j, ps + 41) < 0.25) return 1; // tiny hairs
          }
          return fine > 0.86 ? 1 : 0;
        },
      };
    }
    case 6:
      // Plain: one ink, light dither only
      return { fn: (_x, _y, i, j) => (hash(i, j, ps + 11) > 0.88 ? 1 : 0) };
    default:
      // Blotch (v1 recipe)
      return {
        fn: (x, y, i, j) => {
          const fine = hash(i, j, ps + 11);
          const t = fbm(x * 2.2 + 5, y * 2.2 + 5, ps);
          if (two && t > 0.57) return 2;
          return shade(x, y, fine);
        },
      };
  }
}
