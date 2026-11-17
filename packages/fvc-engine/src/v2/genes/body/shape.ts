/**
 * Body = a signed-distance-like field in body units (plane ±1.45 = the 300 box):
 * negative inside, 0 on the outline, positive outside. Rasterised it is the black-and-white
 * mask every other layer is drawn on, so any silhouette (letters, drawings) can slot in later.
 */
export interface BodyShape {
  sd: (x: number, y: number) => number;
  /** Where the face sits (eyes gather here). */
  face: [number, number];
  /** Use the v1 eye table (Coccus only, so the default germ keeps its old face). */
  classicEyes?: boolean;
}

/** `r` draws from the body's own stream; `fat` 0–1 (0.5 default). */
export type BodyMaker = (r: () => number, fat: number) => BodyShape;

export const circle = (x: number, y: number, cx: number, cy: number, rad: number) => Math.hypot(x - cx, y - cy) - rad;

/** Smooth union (polynomial smooth-min), k = blend width. */
export function smin(a: number, b: number, k: number): number {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - (h * h * k) / 4;
}

/** Distance to segment AB. */
export function segDist(x: number, y: number, ax: number, ay: number, bx: number, by: number): { d: number; t: number } {
  const px = x - ax;
  const py = y - ay;
  const vx = bx - ax;
  const vy = by - ay;
  const t = Math.max(0, Math.min(1, (px * vx + py * vy) / (vx * vx + vy * vy || 1)));
  return { d: Math.hypot(px - vx * t, py - vy * t), t };
}

/**
 * Tube along a polyline with radius varying from r0 (first point) to r1 (last).
 * Good for spirals, commas and chains.
 */
export function tube(pts: [number, number][], r0: number, r1: number) {
  const n = pts.length - 1;
  return (x: number, y: number) => {
    let best = Infinity;
    for (let i = 0; i < n; i++) {
      const { d, t } = segDist(x, y, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
      const u = (i + t) / n;
      const v = d - (r0 + (r1 - r0) * u);
      if (v < best) best = v;
    }
    return best;
  };
}

/** Lumpy radius, the same recipe as the v1 germ outline. */
export function lumpy(r: () => number, amp = 1) {
  const k1 = 4 + Math.floor(r() * 3);
  const k2 = k1 + 2;
  const p1 = r() * 6.283;
  const p2 = r() * 6.283;
  const a1 = (0.07 + r() * 0.04) * amp;
  const a2 = (0.03 + r() * 0.03) * amp;
  return (th: number) => 1 + a1 * Math.sin(k1 * th + p1) + a2 * Math.sin(k2 * th + p2);
}

/** Lumpy blob centred at (cx, cy). */
export function blob(r: () => number, cx: number, cy: number, rad: number, amp = 1) {
  const R = lumpy(r, amp);
  return (x: number, y: number) => {
    const dx = x - cx;
    const dy = y - cy;
    return Math.hypot(dx, dy) - rad * R(Math.atan2(dy, dx));
  };
}

export const rot = (x: number, y: number, a: number): [number, number] => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];

/** fat 0–1 → radius multiplier (0.5 → 1). */
export const fatK = (fat: number) => 0.78 + fat * 0.44;
