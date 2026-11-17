import { colony, color, type ColonyPaths } from '@fvc/engine';

/** Palettes of the Colony tool in FVC Lab (shared by the tool, covers and the hero). */
export const COLONY_PALETTES = {
  robotron: { n: 'Robotron', bg: color.white, fg: color.ink, p: { a: color.spot, b: color.cobalt, c: color.acid, d: color.magenta, ink: color.ink } },
  'one-ink': { n: 'One ink', bg: color.grey, fg: color.ink, p: { a: color.ink, b: color.ink, c: color.spot, d: color.ink, ink: color.ink } },
  night: { n: 'Night', bg: color.ink, fg: color.white, p: { a: color.white, b: color.acid, c: color.white, d: color.magenta, ink: color.white } },
} as const;
export type ColonyPal = keyof typeof COLONY_PALETTES;
export const COLONY_PAL_NAMES = Object.keys(COLONY_PALETTES) as ColonyPal[];

/** The colony's two eyes, as placed by the engine: [cx, cy, r] in the 300 box. */
export const COLONY_EYES: [number, number, number][] = [
  [110, 128, 20],
  [178, 118, 15],
];

const memo = new Map<number, ColonyPaths>();
export function colonyPaths(seed: number): ColonyPaths {
  let c = memo.get(seed);
  if (!c) {
    c = colony(seed);
    if (memo.size > 200) memo.clear();
    memo.set(seed, c);
  }
  return c;
}

/**
 * Colony cells for a 300×300 box. `eyes`: draw whites + pupils; `whites`: whites only
 * (live pupils are laid on top); false: cells only.
 */
export function ColonyG({ seed, pal = 'robotron', eyes = true }: { seed: number; pal?: ColonyPal; eyes?: boolean | 'whites' }) {
  const C = colonyPaths(seed);
  const P = COLONY_PALETTES[pal].p;
  return (
    <>
      <path d={C.a} fill={P.a} />
      <path d={C.b} fill={P.b} />
      <path d={C.c} fill={P.c} />
      <path d={C.d} fill={P.d} />
      {eyes && <path d={C.white} fill="#FFFFFF" stroke={color.ink} strokeWidth="3" />}
      <path d={eyes === true ? C.ink : withoutPupils(C.ink)} fill={P.ink} />
    </>
  );
}

/** The engine writes the two pupils first into `ink`, one `M…` subpath per circle; drop them. */
function withoutPupils(ink: string): string {
  return ink.split('M').slice(3).map((d) => `M${d}`).join('');
}

/** Colony as an SVG data URI (for OG cards rendered by Satori). */
export function colonyDataUri(seed: number, pal: ColonyPal = 'robotron') {
  const C = colonyPaths(seed);
  const P = COLONY_PALETTES[pal].p;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><path d="${C.a}" fill="${P.a}"/><path d="${C.b}" fill="${P.b}"/><path d="${C.c}" fill="${P.c}"/><path d="${C.d}" fill="${P.d}"/><path d="${C.white}" fill="#FFFFFF" stroke="${color.ink}" stroke-width="3"/><path d="${C.ink}" fill="${P.ink}"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}
