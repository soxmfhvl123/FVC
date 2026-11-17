import { color, vinyl } from '@fvc/engine';
import { germPaths } from './Germ';

/* Splatter vinyl (Pressing Plant). Server-safe: no hooks, so strain pages render it at build time. */

const memo = new Map<number, ReturnType<typeof vinyl>>();
export function vinylPaths(seed: number) {
  let v = memo.get(seed);
  if (!v) {
    v = vinyl(seed);
    if (memo.size > 200) memo.clear();
    memo.set(seed, v);
  }
  return v;
}

export const VINYL_BASES = { smoke: '#2A2A2A', clear: '#CFCFC8', black: color.ink, white: color.white, silver: '#A8AAAD' } as const;
export const VINYL_PALETTES = {
  outbreak: { n: 'Outbreak', c: [color.ink, color.spot, color.acid, color.white], l: color.spot },
  photocopy: { n: 'Photocopy', c: [color.ink, '#6A6A6A', '#B5B5B0', color.white], l: color.white },
  riso: { n: 'Riso', c: [color.cobalt, color.magenta, color.yellow, color.spot], l: color.yellow },
  acid: { n: 'Acid', c: [color.acid, '#5E6064', color.acid, '#E4E5E7'], l: color.paper },
} as const;
export type BaseName = keyof typeof VINYL_BASES;
export type PalName = keyof typeof VINYL_PALETTES;

/** Palette swap on a black base so the first splat colour stays visible (as in the Lab board). */
export function vinylColours(base: BaseName, pal: PalName) {
  const p = VINYL_PALETTES[pal];
  const c: string[] = [...p.c];
  if (base === 'black') return { c: [c[3], c[1], c[2], c[0] === color.ink ? '#6A6A6A' : c[0]], l: p.l, n: p.n };
  return { c, l: p.l, n: p.n };
}

export interface TextLabel {
  /** e.g. "THIS SIDE A" */
  side: string;
  /** e.g. "CHICAGO" */
  name: string;
  tracks: { no: string; title: string; time: string }[];
}

/**
 * The splatter record with its centre label (shared by the Lab tool and strain pages).
 * `text`: type-only label on paper in coral, laid out like an old 12" club label.
 */
export function VinylRecord({ seed, base, pal, labelSeed, catalog, size = 520, text, side = 'A' }: { seed: number; base: BaseName; pal: PalName; labelSeed?: number; catalog?: string; size?: number | string; text?: TextLabel; side?: 'A' | 'B' }) {
  const V = vinylPaths(seed);
  const L = germPaths(labelSeed ?? seed + 3, { N: 64, two: false, dust: 0, eyes: 'cyclops' });
  const { c, l } = vinylColours(base, pal);
  return (
    <svg viewBox="0 0 300 300" role="img" aria-label={text ? `Splatter vinyl record, pressing ${seed}, ${text.side.toLowerCase()} label: ${text.name}, ${text.tracks.map((t) => t.title).join(', ')}` : `Splatter vinyl record, pressing ${seed}`} className="lab-art" style={{ width: size, maxWidth: '100%', height: 'auto' }}>
      <circle cx="152" cy="154" r="148" fill={color.ink} opacity="0.18" />
      <circle cx="150" cy="150" r="148" fill={VINYL_BASES[base]} />
      <path d={V.groove} fill="#000000" opacity="0.3" />
      <path d={V.c1} fill={c[0]} />
      <path d={V.c2} fill={c[1]} />
      <path d={V.c3} fill={c[2]} />
      <path d={V.c4} fill={c[3]} />
      {text ? (
        <g fill={color.spot} fontFamily="Instrument Sans, sans-serif" textAnchor="middle">
          <circle cx="150" cy="150" r="54" fill={color.paper} />
          <circle cx="150" cy="150" r="51" fill="none" stroke={color.spot} strokeWidth="0.6" />
          <text x="150" y="113" fontFamily="Archivo, sans-serif" fontWeight="900" fontStretch="125%" fontSize="8">
            {catalog}
          </text>
          <text x="150" y="122" fontSize="4.6" fontWeight="600" letterSpacing="0.6">
            {text.side}
          </text>
          <text x="150" y="134" fontFamily="Archivo, sans-serif" fontWeight="900" fontStretch="125%" fontSize="10">
            {text.name}
          </text>
          {text.tracks.map((t, i) => (
            <g key={t.no} fontSize="4.1">
              <text x="111" y={166 + i * 6.4} textAnchor="start">
                {t.no} {t.title}
              </text>
              <text x="189" y={166 + i * 6.4} textAnchor="end" fontFamily="DM Mono, monospace">
                {t.time}
              </text>
            </g>
          ))}
          <text x="150" y="196" fontSize="3.8">
            33⅓ RPM · FVC RECORDS · SEOUL
          </text>
        </g>
      ) : (
        <>
          <circle cx="150" cy="150" r="54" fill={l} />
          <svg x="112" y="104" width="76" height="76" viewBox="0 0 300 300">
            <path d={L.ink} fill={color.ink} />
          </svg>
          <text x="150" y="190" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="900" fontStretch="125%" fontSize="9" fill={color.ink}>
            {catalog ?? `FVC-${seed}`}
          </text>
          <text x="150" y="199" textAnchor="middle" fontFamily="Instrument Sans, sans-serif" fontSize="5.5" fill={color.ink}>
            SIDE {side} · 33⅓
          </text>
        </>
      )}
      <circle cx="150" cy="150" r="3.5" fill={color.paper} />
    </svg>
  );
}

