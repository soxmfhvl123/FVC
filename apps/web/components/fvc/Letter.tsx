import type { LetterSpec } from '@fvc/engine';
import type { CSSProperties } from 'react';

/**
 * One infected letter (200×260 box). Raster strains draw paths; text strains draw <text>.
 * When a raster path exists the text is left empty (the prototype hides it).
 */
export function Letter({ L, style, className }: { L: LetterSpec; style?: CSSProperties; className?: string }) {
  return (
    <svg viewBox="0 0 200 260" aria-hidden="true" className={className} style={style}>
      {L.d2 && <path d={L.d2} fill={L.c2} />}
      {L.d && <path d={L.d} fill={L.c1} fillRule="evenodd" />}
      {!L.d && (
        <text
          x={100}
          y={244}
          textAnchor="middle"
          fontFamily={L.font}
          fontStyle={L.fstyle}
          fontWeight={L.weight}
          fontStretch={L.stretch}
          fontSize={L.size}
          fill={L.tfill}
          stroke={L.tstroke}
          strokeWidth={L.tsw}
          paintOrder="stroke"
          strokeLinejoin="round"
        >
          {L.ch}
        </text>
      )}
    </svg>
  );
}
