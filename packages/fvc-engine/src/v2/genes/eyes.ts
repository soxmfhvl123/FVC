/**
 * EYES gene: count (0, 1, 2, 3, 5, many) + mood. Eyes are the brand's only way to show feeling
 * (no mouths, no blush, no tears). Placement keeps every eye fully inside the body mask.
 */
import { EYES as V1_EYES } from '../../v1/germ.ts';
import { EYE_COUNTS } from '../genome.ts';

export interface Eye {
  cx: number;
  cy: number;
  r: number;
  /** pupil centre offset + radius (body units) */
  px: number;
  py: number;
  pr: number;
  /** eyelid: cells above y = lid(dx) are ink */
  lid?: { top: number; curve: number };
  spiral?: boolean;
}

/** Ring thickness, as in v1. */
export const EYE_RING = 0.055;
/** Gap kept between an eye ring and the outline. */
export const EYE_MARGIN = 0.075;

const BASE: Record<string, number[]> = { '1': [0.32], '2': [0.22, 0.16], '3': [0.15, 0.13, 0.17], '5': [0.12, 0.11, 0.115, 0.1, 0.11] };

/**
 * Place eyes inside `sd` (negative = inside). `r` is the eyes gene's own stream.
 * `classic`: Coccus keeps the v1 eye table for 1/2/3 eyes, so the default germ keeps its face.
 */
export function placeEyes(sd: (x: number, y: number) => number, face: [number, number], countIdx: number, mood: number, eyeSize: number, classic: boolean, r: () => number): Eye[] {
  const count = EYE_COUNTS[countIdx];
  if (count === 0) return [];
  const k = 0.6 + eyeSize * 0.8;
  const look = r() * 6.283;
  const sideDir = r() < 0.5 ? -1 : 1;

  let spots: { cx: number; cy: number; r: number; v1?: number[] }[] = [];
  const v1Key = count === 1 ? 'cyclops' : count === 2 ? 'two' : count === 3 ? 'three' : null;
  if (classic && v1Key) {
    spots = V1_EYES[v1Key].map((E) => ({ cx: E[0], cy: E[1], r: E[2] * k, v1: E }));
    if (!spots.every((e) => -sd(e.cx, e.cy) >= e.r + EYE_MARGIN)) spots = [];
  }
  if (!spots.length) {
    const n = count === 'many' ? 8 + Math.floor(r() * 13) : count;
    const radii = Array.from({ length: n }, (_, i) => (count === 'many' ? 0.055 + r() * 0.035 : BASE[String(count)][i]) * k * (mood === 5 ? 0.6 + r() * 0.8 : 1));
    // candidate points on a grid, scored toward the face (or spread out for many eyes)
    const cand: { x: number; y: number; depth: number; score: number }[] = [];
    for (let y = -1.4; y <= 1.4; y += 0.05)
      for (let x = -1.4; x <= 1.4; x += 0.05) {
        const depth = -sd(x, y);
        if (depth <= 0.1) continue;
        const jit = r();
        const score = count === 'many' ? depth * 0.25 + jit : -Math.hypot(x - face[0], y - face[1]) + depth * 0.35 + jit * 0.12;
        cand.push({ x, y, depth, score });
      }
    cand.sort((a, b) => b.score - a.score);
    for (const r0 of radii) {
      for (let attempt = 0; attempt < 6; attempt++) {
        const er = r0 * 0.85 ** attempt;
        if (er < 0.035) break;
        const hit = cand.find((c) => c.depth >= er + EYE_MARGIN && spots.every((o) => Math.hypot(c.x - o.cx, c.y - o.cy) >= er + o.r + EYE_RING * 2 + 0.02));
        if (hit) {
          spots.push({ cx: hit.x, cy: hit.y, r: er });
          break;
        }
      }
    }
  }

  return spots.map((s) => {
    const e: Eye = { cx: s.cx, cy: s.cy, r: s.r, px: 0, py: 0, pr: s.r * 0.45 };
    const a = mood === 5 ? r() * 6.283 : look + (r() - 0.5) * 0.3;
    const lx = Math.cos(a);
    const ly = Math.sin(a);
    switch (mood) {
      case 0: // Curious
        if (s.v1 && k === 1) Object.assign(e, { px: s.v1[3] - s.v1[0], py: s.v1[4] - s.v1[1], pr: s.v1[5] });
        else Object.assign(e, { px: lx * s.r * 0.4, py: ly * s.r * 0.4 });
        break;
      case 1: // Sleepy: heavy lid, pupil low
        Object.assign(e, { px: lx * s.r * 0.25, py: s.r * 0.38, pr: s.r * 0.4, lid: { top: -s.r * 0.05, curve: 0.3 } });
        break;
      case 2: // Startled: big white, tiny pupil
        Object.assign(e, { px: lx * s.r * 0.08, py: ly * s.r * 0.08, pr: Math.max(s.r * 0.17, 0.02) });
        break;
      case 3: // Dizzy: spiral pupil
        Object.assign(e, { pr: s.r * 0.78, spiral: true });
        break;
      case 4: // Side-eye: everyone looks the same way, lid a little low
        Object.assign(e, { px: sideDir * s.r * 0.5, py: s.r * 0.08, pr: s.r * 0.42, lid: { top: -s.r * 0.5, curve: 0.15 } });
        break;
      default: // Odd: own size, own direction
        Object.assign(e, { px: lx * s.r * 0.45, py: ly * s.r * 0.45, pr: s.r * (0.25 + r() * 0.3) });
    }
    return e;
  });
}

/** Cell value for a point inside an eye (0 white is returned as 3), or -1 when outside every eye. */
export function eyeCell(eyes: Eye[], x: number, y: number): number {
  let v = -1;
  for (const e of eyes) {
    const dx = x - e.cx;
    const dy = y - e.cy;
    const de = Math.hypot(dx, dy);
    if (de < e.r) {
      v = 3;
      const qx = dx - e.px;
      const qy = dy - e.py;
      if (e.spiral) {
        const d = Math.hypot(dx, dy);
        if (d < e.pr) {
          const t = Math.atan2(dy, dx) / 6.2832 + d / (e.r * 0.32);
          if (t - Math.floor(t) < 0.5) v = 1;
        }
      } else if (Math.hypot(qx, qy) < e.pr) v = 1;
      if (e.lid && dy < e.lid.top + (e.lid.curve * dx * dx) / e.r) v = 1;
    } else if (de < e.r + EYE_RING) v = 1;
  }
  return v;
}
