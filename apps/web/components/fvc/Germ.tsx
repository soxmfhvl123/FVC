import { color, germ, type GermOptions } from '@fvc/engine';
import type { CSSProperties } from 'react';

export interface GermProps extends GermOptions {
  seed: number;
  /** Spot ink. Ignored when `two` is false. */
  spot?: string;
  /** Colour of the ink layer (white for inverted germs). */
  ink?: string;
  /** Misregister the spot plate like the hero (px in the 300 box). */
  offset?: [number, number];
  label?: string;
  className?: string;
  style?: CSSProperties;
  width?: number | string;
  height?: number | string;
}

const memo = new Map<string, ReturnType<typeof germ>>();

/** Memoised germ paths (cheap on the server, fine on click in the browser). */
export function germPaths(seed: number, o: GermOptions = {}) {
  const key = JSON.stringify([seed, o.N, o.lumps, o.hair, o.two, o.dust, o.eyes]);
  let g = memo.get(key);
  if (!g) {
    g = germ(seed, o);
    if (memo.size > 400) memo.clear();
    memo.set(key, g);
  }
  return g;
}

/** Two-colour bitmap germ in a 300×300 viewBox. Decorative unless `label` is given. */
export function Germ({ seed, spot = color.spot, ink = color.ink, offset, label, className, style, width, height, ...opts }: GermProps) {
  const g = germPaths(seed, opts);
  const two = opts.two ?? true;
  return (
    <svg
      viewBox="0 0 300 300"
      className={className}
      style={style}
      width={width}
      height={height}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      {two && <path d={g.spot} fill={spot} transform={offset ? `translate(${offset[0]} ${offset[1]})` : undefined} />}
      <path d={g.ink} fill={ink} />
    </svg>
  );
}

/** Germ nested inside another SVG (covers, posters). */
export function GermG({ seed, spot = color.spot, ink = color.ink, x = 0, y = 0, size, ...opts }: GermOptions & { seed: number; spot?: string; ink?: string; x?: number; y?: number; size: number }) {
  const g = germPaths(seed, opts);
  return (
    <svg x={x} y={y} width={size} height={size} viewBox="0 0 300 300">
      {(opts.two ?? true) && <path d={g.spot} fill={spot} />}
      <path d={g.ink} fill={ink} />
    </svg>
  );
}
