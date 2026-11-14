import { barcodePath, color } from '@fvc/engine';
import type { Strain } from '@/lib/content';
import { catalogNo, isolatedLabel, ph, spreadBlocks, totalIncubation } from '@/lib/format';
import { germPaths } from './Germ';

const INFO = 'Inter Tight, sans-serif';

/** Kit tile 01: black header, big wide catalog no., field rows, CERTIFIED CARRIER bar, barcode. */
export function SpecimenLabel({ strain: s }: { strain: Strain }) {
  const no = catalogNo(s.id);
  const g = germPaths(s.seed, { N: 80, two: false, eyes: 'cyclops', dust: 0.002 });
  // White text on ink/cobalt spot, ink text on light spots (never white on acid/yellow).
  const darkSpot = [color.ink, color.cobalt].includes(s.spot as never);
  const rows: [string, string][] = [
    ['STRAIN TYPE', ph(s.strainType, 'Genre').toUpperCase()],
    ['CARRIER', ph(s.carrier, 'Artist').toUpperCase()],
    ['INCUBATION', totalIncubation(s)],
    ['SPREAD', spreadBlocks(s.spreadLevel)],
    ['ISOLATED', s.isolated ? `${isolatedLabel(s.isolated)} SEOUL` : 'SEOUL'],
  ];
  return (
    <figure className="fvc-specimen" style={{ margin: 0 }}>
      <svg viewBox="0 0 500 560" role="img" aria-labelledby={`sl-${s.id}`} style={{ display: 'block', width: '100%', height: 'auto' }}>
        <title id={`sl-${s.id}`}>{`Specimen label for strain ${s.id}: ${rows.map((r) => `${r[0].toLowerCase()} ${r[1]}`).join(', ')}`}</title>
        <rect width="500" height="560" fill={color.white} />
        <rect x="30" y="34" width="440" height="20" fill={color.ink} />
        <text x="250" y="49" textAnchor="middle" fontFamily={INFO} fontWeight="800" fontSize="12" letterSpacing="9" fill={color.white}>
          SPECIMEN LABEL ▮ FVC
        </text>
        <text x="26" y="170" fontFamily="Archivo, sans-serif" fontWeight="900" fontStretch="125%" fontSize="132" letterSpacing="-8" fill={color.ink}>
          {no}
        </text>
        <svg x="292" y="164" width="190" height="190" viewBox="0 0 300 300">
          <path d={g.ink} fill={color.ink} />
        </svg>
        <g fontFamily={INFO} fontSize="13" fill={color.ink}>
          {rows.map(([k, v], i) => (
            <g key={k}>
              <text x="30" y={210 + i * 30}>
                {k}
              </text>
              <text x="150" y={210 + i * 30} fontWeight="600">
                {v}
              </text>
              <line x1="30" y1={218 + i * 30} x2="280" y2={218 + i * 30} stroke={color.ink} strokeWidth="1.5" />
            </g>
          ))}
        </g>
        <rect x="30" y="374" width="250" height="34" fill={s.spot} />
        <text x="40" y="397" fontFamily="Archivo, sans-serif" fontWeight="900" fontStretch="100%" fontSize="20" fill={darkSpot ? color.white : color.ink}>
          CERTIFIED CARRIER
        </text>
        <path d={barcodePath(s.seed + 2, 250, 50)} transform="translate(30 430)" fill={color.ink} />
        <text x="30" y="504" fontFamily="DM Mono, monospace" fontSize="11" fill={color.ink}>
          {`FVC${no}-SEOUL-${String(s.seed).padStart(4, '0')}`}
        </text>
        <path d="M440 444 V504 M410 474 H470" stroke={color.ink} strokeWidth="1.5" />
        <circle cx="440" cy="474" r="12" fill="none" stroke={color.ink} strokeWidth="1.5" />
        <rect width="500" height="560" filter="url(#fvc-grain)" opacity="0.18" style={{ mixBlendMode: 'multiply' }} />
      </svg>
    </figure>
  );
}
