/**
 * The nine body shapes. Each maker takes the body's own random stream and FAT (0–1) and
 * returns a mask field (see shape.ts). Add a body = add a maker here + register it in BODY_MAKERS.
 */
import { blob, type BodyMaker, type BodyShape, fatK, rot, segDist, smin, tube } from './shape.ts';

const union = (parts: ((x: number, y: number) => number)[], k: number) => (x: number, y: number) => {
  let m = Infinity;
  for (const f of parts) m = smin(m, f(x, y), k);
  return m;
};

/** B0 Coccus — the round lump (the v1 germ). */
export const coccus: BodyMaker = (r, fat) => ({ sd: blob(r, 0, 0, fatK(fat)), face: [0, -0.15], classicEyes: true });

/** B1 Diplo — two lumps stuck together like a peanut. */
export const diplo: BodyMaker = (r, fat) => {
  const k = fatK(fat);
  const tilt = (r() - 0.5) * 0.9;
  const [ax, ay] = rot(-0.5, 0, tilt);
  const [bx, by] = rot(0.52, 0, tilt);
  const A = blob(r, ax, ay, 0.62 * k * (0.95 + r() * 0.12), 0.6);
  const B = blob(r, bx, by, 0.58 * k * (0.9 + r() * 0.14), 0.6);
  return { sd: union([A, B], 0.28), face: [(ax + bx) / 2, Math.min(ay, by) - 0.2] };
};

/** B2 Bacillus — a capsule / pill: flat, standing or diagonal. */
export const bacillus: BodyMaker = (r, fat) => {
  const angle = [0, Math.PI / 2, Math.PI / 4, -Math.PI / 4][Math.floor(r() * 4)] + (r() - 0.5) * 0.2;
  const half = 0.62 + r() * 0.2;
  const rad = 0.5 * fatK(fat);
  const [ax, ay] = rot(-half, 0, angle);
  const [bx, by] = rot(half, 0, angle);
  const bulge = r() * 0.06;
  return {
    sd: (x, y) => {
      const { d, t } = segDist(x, y, ax, ay, bx, by);
      return d - rad * (1 + bulge * Math.sin(t * Math.PI));
    },
    face: [(ax + bx) / 2, (ay + by) / 2 - rad * 0.25],
  };
};

/** B3 Strepto — 3–5 beads in a gently curving chain; the face sits on the end bead. */
export const strepto: BodyMaker = (r, fat) => {
  const n = 3 + Math.floor(r() * 3);
  const rad = (n === 3 ? 0.44 : n === 4 ? 0.37 : 0.31) * fatK(fat);
  const step = rad * 1.6;
  const bend = (r() - 0.5) * 1.2;
  const flip = r() < 0.5 ? -1 : 1;
  const beads: [number, number, number][] = [];
  for (let i = 0; i < n; i++) {
    const u = i - (n - 1) / 2;
    beads.push([flip * u * step, bend * u * u * 0.12 - u * 0.04, rad * (i === n - 1 ? 1.12 : 0.92 + r() * 0.1)]);
  }
  const head = beads[n - 1];
  return { sd: union(beads.map(([cx, cy, rr]) => blob(r, cx, cy, rr, 0.5)), 0.12), face: [head[0], head[1] - head[2] * 0.15] };
};

/** B4 Staphylo — a bunch of grapes. */
export const staphylo: BodyMaker = (r, fat) => {
  const k = fatK(fat);
  const n = 5 + Math.floor(r() * 4);
  const balls: [number, number, number][] = [[0, -0.1, 0.44 * k]];
  for (let i = 1; i < n; i++) {
    const a = (i / (n - 1)) * Math.PI * 2 + (r() - 0.5) * 0.6;
    const d = 0.62 + r() * 0.16;
    balls.push([Math.cos(a) * d, Math.sin(a) * d * 0.92 + 0.05, (0.26 + r() * 0.1) * k]);
  }
  return { sd: union(balls.map(([cx, cy, rr]) => blob(r, cx, cy, rr, 0.35)), 0.05), face: [0, -0.15] };
};

/** B5 Spirillum — a wiggly corkscrew; thick head, thinner tail. */
export const spirillum: BodyMaker = (r, fat) => {
  const k = fatK(fat);
  const periods = 1.6 + r() * 0.9;
  const amp = 0.36 + r() * 0.16;
  const phase = r() * 6.283;
  const angle = (r() - 0.5) * 1.2;
  const pts: [number, number][] = [];
  for (let i = 0; i <= 36; i++) {
    const u = i / 36;
    // the wave fades out under the head so the face sits on a round end
    pts.push(rot(-1.05 + u * 2.1, amp * Math.sin(u * periods * 6.283 + phase) * (1 - u * 0.35), angle));
  }
  const head = pts[36];
  return { sd: tube(pts, 0.13 * k, 0.34 * k), face: [head[0], head[1] - 0.05] };
};

/** B6 Vibrio — a comma / kidney bean. */
export const vibrio: BodyMaker = (r, fat) => {
  const k = fatK(fat);
  const R = 0.62 + r() * 0.16;
  const a0 = -2.4 + (r() - 0.5) * 0.8;
  const sweep = 2.1 + r() * 0.8;
  const flip = r() < 0.5 ? -1 : 1;
  const pts: [number, number][] = [];
  for (let i = 0; i <= 18; i++) {
    const a = a0 + (sweep * i) / 18;
    pts.push([flip * Math.cos(a) * R, Math.sin(a) * R + R * 0.45]);
  }
  const head = pts[0];
  return { sd: tube(pts, 0.5 * k, 0.24 * k), face: [head[0], head[1] + 0.05] };
};

/** B7 Amoeba — a soft blob with 2–6 pseudopods. */
export const amoeba: BodyMaker = (r, fat) => {
  const k = fatK(fat);
  const core = blob(r, 0, 0, 0.66 * k, 1.4);
  const n = 2 + Math.floor(r() * 5);
  const arms = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * 6.283 + (r() - 0.5) * 1.1;
    const len = 0.85 + r() * 0.3;
    const w = (0.15 + r() * 0.1) * k;
    const ex = Math.cos(a) * len;
    const ey = Math.sin(a) * len;
    return (x: number, y: number) => segDist(x, y, 0, 0, ex, ey).d - w;
  });
  return { sd: union([core, ...arms], 0.3), face: [0, -0.12] };
};

/** B8 Budding — a big germ with a baby germ growing off it. */
export const budding: BodyMaker = (r, fat) => {
  const k = fatK(fat);
  const big = blob(r, -0.16, 0.1, 0.78 * k, 0.8);
  const a = -0.9 + (r() - 0.5) * 1.2;
  const d = 0.78 * k + 0.12;
  const bud = blob(r, -0.16 + Math.cos(a) * d, 0.1 + Math.sin(a) * d, 0.3 * k, 0.6);
  const parts = [big, bud];
  if (r() < 0.4) {
    const a2 = a + 1.6 + r();
    parts.push(blob(r, -0.16 + Math.cos(a2) * (d - 0.06), 0.1 + Math.sin(a2) * (d - 0.06), 0.17 * k, 0.4));
  }
  return { sd: union(parts, 0.08), face: [-0.16, -0.05] };
};

export const BODY_MAKERS: BodyMaker[] = [coccus, diplo, bacillus, strepto, staphylo, spirillum, vibrio, amoeba, budding];
export type { BodyShape };
