/**
 * Engine v2 — the germ genome (docs/fvc-lab-v2.md). Lab-only for now; released strains keep
 * engine v1 (`germ()`), which is frozen.
 */
export * from './genome.ts';
export * from './germ2.ts';
export * from './name.ts';
export { audit, CROWN_GUARD, FORBIDDEN_MOODS, inkCount } from './rules.ts';
export type { Eye } from './genes/eyes.ts';
