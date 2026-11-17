/**
 * Germ genome (engine v2). One seed decides six genes; each gene has its own random stream
 * (seed + gene name), so overriding or locking one gene never moves the others.
 *
 *   BODY · SURFACE · EYES (count + mood) · PATTERN · RENDER · INK (handled by the caller)
 *
 * Code: "B5-S2-E3·Dz-P5-R0" (labels) / "B5-S2-E3Dz-P5-R0" (URLs). Both parse.
 */
import { hash, rng } from '../core.ts';

export const BODIES = ['Coccus', 'Diplo', 'Bacillus', 'Strepto', 'Staphylo', 'Spirillum', 'Vibrio', 'Amoeba', 'Budding'] as const;
export const SURFACES = ['Fur', 'Cilia', 'Flagella', 'Pili', 'Bald', 'Double Wall', 'Halo'] as const;
export const EYE_COUNTS = [0, 1, 2, 3, 5, 'many'] as const;
export const EYE_CODES = ['0', '1', '2', '3', '5', 'M'] as const;
export const MOODS = ['Curious', 'Sleepy', 'Startled', 'Dizzy', 'Side-eye', 'Odd'] as const;
export const MOOD_CODES = ['Cu', 'Sl', 'St', 'Dz', 'Se', 'Od'] as const;
export const PATTERNS = ['Blotch', 'Spots', 'Bands', 'Nucleus', 'Gradient', 'Carrier', 'Plain'] as const;
export const RENDERS = ['Bitmap', 'Halftone', 'Riso', 'Photocopy', 'Cross-stitch', 'Line'] as const;
/** Renders implemented so far (L1: bitmap only). */
export const RENDERS_READY = [0] as const;

export type GeneName = 'body' | 'surface' | 'eyes' | 'mood' | 'pattern' | 'render';

export interface Genome {
  body: number;
  surface: number;
  /** index into EYE_COUNTS */
  eyes: number;
  mood: number;
  pattern: number;
  render: number;
}

/** Continuous traits, 0–100 (50 = default). */
export interface Traits {
  fat: number;
  hair: number;
  eyeSize: number;
  chaos: number;
}

export const DEFAULT_GENOME: Genome = { body: 0, surface: 0, eyes: 2, mood: 0, pattern: 0, render: 0 };
export const DEFAULT_TRAITS: Traits = { fat: 50, hair: 50, eyeSize: 50, chaos: 50 };

const SIZES: Record<GeneName, number> = { body: BODIES.length, surface: SURFACES.length, eyes: EYE_COUNTS.length, mood: MOODS.length, pattern: PATTERNS.length, render: RENDERS_READY.length };

/** A seed for one gene's own random stream. */
export function geneSeed(seed: number, gene: string): number {
  let h = 17;
  for (let i = 0; i < gene.length; i++) h = (h * 31 + gene.charCodeAt(i)) | 0;
  return 1 + Math.floor(hash(seed | 0, h, 7919) * 2147480000);
}

/** Independent random stream for `gene` of `seed`. */
export const stream = (seed: number, gene: string) => rng(geneSeed(seed, gene));

/** Roll one gene from a seed. */
export function rollGene(seed: number, gene: GeneName): number {
  const v = Math.floor(stream(seed, `gene:${gene}`)() * SIZES[gene]);
  return gene === 'render' ? RENDERS_READY[v] : v;
}

/** Seed → full genome; `override` wins gene by gene. */
export function rollGenome(seed: number, override: Partial<Genome> = {}): Genome {
  const g = {} as Genome;
  for (const k of Object.keys(SIZES) as GeneName[]) g[k] = override[k] ?? rollGene(seed, k);
  return g;
}

export function genomeCode(g: Genome, sep = '·'): string {
  return `B${g.body}-S${g.surface}-E${EYE_CODES[g.eyes]}${sep}${MOOD_CODES[g.mood]}-P${g.pattern}-R${g.render}`;
}

/** Parse "B5-S2-E3·Dz-P5-R0" or "B5-S2-E3Dz-P5-R0". Returns null when malformed or out of range. */
export function parseGenome(code: string | null | undefined): Genome | null {
  const m = /^B(\d)-S(\d)-E([0-9M])[·.]?([A-Z][a-z])-P(\d)-R(\d)$/.exec((code ?? '').trim());
  if (!m) return null;
  const g: Genome = {
    body: +m[1],
    surface: +m[2],
    eyes: (EYE_CODES as readonly string[]).indexOf(m[3]),
    mood: (MOOD_CODES as readonly string[]).indexOf(m[4]),
    pattern: +m[5],
    render: +m[6],
  };
  if (g.body >= BODIES.length || g.surface >= SURFACES.length || g.eyes < 0 || g.mood < 0 || g.pattern >= PATTERNS.length || g.render >= RENDERS.length) return null;
  return g;
}
