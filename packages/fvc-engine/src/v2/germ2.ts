/**
 * Engine v2 germ: genome → layers stacked in order → bitmap.
 *   body mask → outline (surface) → pattern → eyes → hairs (surface) → dust
 * Output paths in a 300×300 box: `ink`, `spot`, and `white` (eye whites, for inverse prints).
 */
import { hash, noise, runs } from '../core.ts';
import { BODY_MAKERS } from './genes/body/bodies.ts';
import type { BodyShape } from './genes/body/shape.ts';
import { type Eye, eyeCell, placeEyes } from './genes/eyes.ts';
import { makePattern } from './genes/pattern.ts';
import { drawSurface, type Grid } from './genes/surface.ts';
import { DEFAULT_TRAITS, type Genome, genomeCode, geneSeed, rollGenome, stream, type Traits } from './genome.ts';
import { speciesName } from './name.ts';
import { inkCount } from './rules.ts';

export interface Germ2Options {
  /** Grid cells across the box: 44 Coarse · 80 Mid · 110 · 140 Fine · 200 Micro. */
  N?: number;
  /** Two inks (ink + spot) or one. */
  two?: boolean;
  traits?: Partial<Traits>;
  /** Stray pixels outside the body (0–0.02). */
  dust?: number;
}

export interface Germ2 {
  ink: string;
  spot: string;
  white: string;
  genome: Genome;
  code: string;
  name: string;
  inks: number;
  /** eyes in body units */
  eyes: Eye[];
  /** body field in body units (negative inside), after fitting */
  field: (x: number, y: number) => number;
}

const SPAN = 1.45;
/** Bodies are scaled down to fit inside this half-extent (room for hair). */
const FIT = 1.12;

/** Centre the body and shrink it if it would leave the box. */
function fit(shape: BodyShape): BodyShape {
  let x0 = Infinity;
  let x1 = -Infinity;
  let y0 = Infinity;
  let y1 = -Infinity;
  for (let y = -SPAN; y <= SPAN; y += 0.04)
    for (let x = -SPAN; x <= SPAN; x += 0.04)
      if (shape.sd(x, y) < 0) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  if (x0 === Infinity) return shape;
  let cx = (x0 + x1) / 2;
  let cy = (y0 + y1) / 2;
  if (Math.hypot(cx, cy) < 0.04) cx = cy = 0;
  const ext = Math.max(x1 - cx, cx - x0, y1 - cy, cy - y0);
  const s = ext > FIT ? FIT / ext : 1;
  if (s === 1 && cx === 0 && cy === 0) return shape;
  return {
    ...shape,
    sd: (x, y) => s * shape.sd(x / s + cx, y / s + cy),
    face: [(shape.face[0] - cx) * s, (shape.face[1] - cy) * s],
  };
}

/** Grow a germ from a seed and a genome (default: the genome the seed rolls). */
export function germ2(seed: number, genome: Genome = rollGenome(seed), o: Germ2Options = {}): Germ2 {
  const N = o.N ?? 110;
  const t = { ...DEFAULT_TRAITS, ...o.traits };
  const fat = t.fat / 100;
  const hair = t.hair / 100;
  const chaos = t.chaos / 100;
  const inks = inkCount(genome.pattern, o.two !== false);
  const two = inks === 2;
  const dust = o.dust ?? 0.006;

  const shape = fit(BODY_MAKERS[genome.body](stream(seed, 'body'), fat));
  const field = shape.sd;
  const eyes = placeEyes(field, shape.face, genome.eyes, genome.mood, t.eyeSize / 100, !!shape.classicEyes, stream(seed, 'eyes'));
  const ps = geneSeed(seed, 'pattern') % 1000003;
  const ss = geneSeed(seed, 'surface') % 1000003;
  const ns = geneSeed(seed, 'edge') % 1000003;
  const pattern = makePattern(genome.pattern, ps, two, stream(seed, 'pattern'), field, eyes).fn;

  const unit = (2 * SPAN) / N;
  const G: Grid = { N, span: SPAN, unit, sd: new Float32Array(N * N), g: new Uint8Array(N * N), field };
  const sf = genome.surface;
  const band = sf === 4 ? 0.1 : 0.07;
  const bandP = sf === 4 ? 0.03 : 0.12;
  const edge = 0.08 * (0.5 + chaos);

  for (let j = 0; j < N; j++) {
    const y = ((j + 0.5) / N * 2 - 1) * SPAN;
    for (let i = 0; i < N; i++) {
      const x = ((i + 0.5) / N * 2 - 1) * SPAN;
      const k = j * N + i;
      const s = field(x, y) + (noise(x * 6, y * 6, ns) - 0.5) * edge;
      G.sd[k] = s;
      let v = 0;
      if (s < 0) {
        const fine = hash(i, j, ps + 11);
        v = -s < band ? (fine > bandP ? 1 : 0) : pattern(x, y, i, j, -s);
        const ev = eyeCell(eyes, x, y);
        if (ev >= 0) v = ev;
      } else if (sf === 5 && s > 0.045 && s < 0.095) {
        v = hash(i, j, ss + 21) > 0.08 ? 1 : 0; // Double Wall: second skin
      } else if (sf === 6 && s < 0.45) {
        const p = 0.2 * (1 - s / 0.45) ** 2; // Halo: scattered pixels
        const h = hash(i, j, ss + 20);
        if (h < p) v = 1;
        else if (two && h > 1 - p * 0.3) v = 2;
      }
      G.g[k] = v;
    }
  }

  drawSurface(sf, G, ss, hair, chaos, shape.face);

  for (let k = 0; k < N * N; k++) {
    if (G.g[k] !== 0 || G.sd[k] < 0) continue;
    const hd = hash(k % N, Math.floor(k / N), ss + 29);
    if (hd < dust) G.g[k] = 1;
    else if (two && hd > 1 - dust * 0.7) G.g[k] = 2;
  }

  const cell = 300 / N;
  return {
    ink: runs(G.g, N, N, cell, 1),
    spot: runs(G.g, N, N, cell, 2),
    white: runs(G.g, N, N, cell, 3),
    genome,
    code: genomeCode(genome),
    name: speciesName(genome),
    inks,
    eyes,
    field,
  };
}

/** Body units → 300 box. */
export const toBox = (u: number) => ((u + SPAN) / (2 * SPAN)) * 300;
