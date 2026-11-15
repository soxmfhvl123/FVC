import { color } from '@fvc/engine';
import { barcodePath } from '@fvc/engine';
import { germPaths } from './Germ';
import { vinylPaths } from './Vinyl';

const INFO = 'Instrument Sans, sans-serif';

/** Kit tile 04: colony repeat pattern (tote / sleeve). */
export function PatternArt() {
  const a = germPaths(5, { N: 40, two: false, dust: 0 });
  const b = germPaths(9, { N: 40, dust: 0 });
  return (
    <svg viewBox="0 0 500 500" role="img" aria-label="Repeat pattern of bitmap germs on acid green" style={{ display: 'block', width: '100%', height: 'auto' }}>
      <defs>
        <pattern id="kp" width="120" height="120" patternUnits="userSpaceOnUse" patternTransform="rotate(-10)">
          <svg x="2" y="2" width="70" height="70" viewBox="0 0 300 300">
            <path d={a.ink} fill={color.ink} />
          </svg>
          <svg x="62" y="58" width="58" height="58" viewBox="0 0 300 300">
            <path d={b.spot} fill={color.magenta} />
            <path d={b.ink} fill={color.ink} />
          </svg>
        </pattern>
      </defs>
      <rect width="500" height="500" fill={color.acid} />
      <rect width="500" height="500" fill="url(#kp)" />
      <rect x="24" y="440" width="282" height="36" fill={color.ink} />
      <text x="36" y="464" fontFamily={INFO} fontWeight="800" fontSize="13" letterSpacing="3" fill={color.acid}>
        COLONY REPEAT ▮ TOTE / SLEEVE
      </text>
    </svg>
  );
}

/** Kit tile 12: splatter slipmat with a germ label and a text ring. */
export function SlipmatArt({ seed = 12, spot = color.spot }: { seed?: number; spot?: string }) {
  const vy = vinylPaths(seed);
  const sm = germPaths(23, { N: 80, dust: 0 });
  return (
    <svg viewBox="0 0 500 500" role="img" aria-label="Slipmat with a splatter pattern, a bitmap germ at the centre and a text ring" style={{ display: 'block', width: '100%', height: 'auto' }}>
      <defs>
        <path id="k-ring2" d="M250 250 m-150 0 a150 150 0 1 1 300 0 a150 150 0 1 1 -300 0" />
      </defs>
      <rect width="500" height="500" fill={color.red} />
      <circle cx="250" cy="250" r="214" fill="#2A2A2A" />
      <svg x="36" y="36" width="428" height="428" viewBox="0 0 300 300">
        <path d={vy.groove} fill="#000000" opacity="0.3" />
        <path d={vy.c1} fill={color.ink} />
        <path d={vy.c2} fill={spot} />
        <path d={vy.c3} fill={color.acid} />
        <path d={vy.c4} fill={color.white} />
      </svg>
      <text fontFamily={INFO} fontWeight="800" fontSize="17" letterSpacing="5" fill={color.white}>
        <textPath href="#k-ring2">FAT VIRUS CARRIER RECORDS ▮ 33⅓ RPM ▮ PLAY LOUD ▮ </textPath>
      </text>
      <circle cx="250" cy="250" r="118" fill={color.white} />
      <svg x="150" y="150" width="200" height="200" viewBox="0 0 300 300">
        <path d={sm.spot} fill={spot} />
        <path d={sm.ink} fill={color.ink} />
      </svg>
      <circle cx="250" cy="250" r="6" fill={color.red} stroke={color.ink} strokeWidth="2" />
    </svg>
  );
}

/** Kit tile 07: sticker sheet. */
export function StickersArt({ spot = color.spot }: { spot?: string }) {
  const st = germPaths(150, { N: 56, two: false, dust: 0 });
  return (
    <svg viewBox="0 0 500 520" role="img" aria-label="Sticker sheet: grain oval, contagious seal, glitch label, catch it pill and barcode" style={{ display: 'block', width: '100%', height: 'auto' }}>
      <defs>
        <clipPath id="k-ov1">
          <ellipse cx="0" cy="0" rx="110" ry="58" />
        </clipPath>
        <path id="k-ring" d="M0 0 m-62 0 a62 62 0 1 1 124 0 a62 62 0 1 1 -124 0" />
      </defs>
      <rect width="500" height="520" fill={color.magenta} />
      <g transform="translate(170 120) rotate(-8)">
        <ellipse rx="118" ry="66" fill={color.white} />
        <g clipPath="url(#k-ov1)">
          <rect x="-110" y="-58" width="220" height="116" filter="url(#fvc-bitnoise)" />
        </g>
        <ellipse rx="110" ry="58" fill="none" stroke={color.ink} strokeWidth="3" />
        <rect x="-78" y="-22" width="156" height="44" fill={color.ink} />
        <text y="15" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="900" fontStretch="125%" fontSize="38" fill={color.white}>
          FVC
        </text>
      </g>
      <g transform="translate(370 160) rotate(12)">
        <circle r="96" fill={color.white} />
        <circle r="88" fill={color.ink} />
        <text fontFamily={INFO} fontWeight="800" fontSize="13" letterSpacing="3" fill={color.white}>
          <textPath href="#k-ring">HIGHLY CONTAGIOUS ▮ NO KNOWN CURE ▮</textPath>
        </text>
        <svg x="-50" y="-50" width="100" height="100" viewBox="0 0 300 300">
          <path d={st.ink} fill={color.white} />
        </svg>
      </g>
      <g transform="translate(250 340) rotate(-4)">
        <rect x="-212" y="-58" width="424" height="116" fill={color.white} />
        <rect x="-204" y="-50" width="408" height="100" fill={color.ink} />
        <text x="-190" y="18" fontFamily="Grenze Gotisch, serif" fontWeight="900" fontSize="64" fill={color.acid}>
          Fat
        </text>
        <text x="-84" y="22" fontFamily="Archivo, sans-serif" fontWeight="900" fontStretch="62%" fontSize="72" fill="none" stroke={color.acid} strokeWidth="2">
          SOUND
        </text>
        <text x="76" y="18" fontFamily="Instrument Serif, serif" fontStyle="italic" fontSize="64" fill={color.acid}>
          inside
        </text>
      </g>
      <g transform="translate(120 460) rotate(6)">
        <rect x="-92" y="-30" width="184" height="60" rx="30" fill={color.white} />
        <rect x="-86" y="-24" width="172" height="48" rx="24" fill={spot} stroke={color.ink} strokeWidth="3" />
        <text y="8" textAnchor="middle" fontFamily={INFO} fontWeight="800" fontSize="20" fill={color.ink}>
          CATCH IT ↗
        </text>
      </g>
      <g transform="translate(360 460) rotate(-10)">
        <rect x="-70" y="-34" width="140" height="68" fill={color.white} />
        <path d={barcodePath(13, 120, 34)} transform="translate(-60 -24)" fill={color.ink} />
        <text x="0" y="28" textAnchor="middle" fontFamily="DM Mono, monospace" fontSize="10" fill={color.ink}>
          FVC-007 ▮ 0001
        </text>
      </g>
    </svg>
  );
}
