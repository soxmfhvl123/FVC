import { barcodePath, specimenCodePath, zigzagPath } from '@fvc/engine';
import type { CSSProperties } from 'react';

/** Grain overlay: absolutely fills its (position: relative) parent. */
export function Grain({ opacity = 0.2 }: { opacity?: number }) {
  return (
    <svg aria-hidden="true" className="fvc-grain" style={{ opacity }}>
      <rect width="100%" height="100%" filter="url(#fvc-grain)" />
    </svg>
  );
}

/** Ellipse filled with 1-bit photocopy noise. */
export function BitNoiseOval({ w, h, stroke = 2, id, style, className }: { w: number; h: number; stroke?: number; id: string; style?: CSSProperties; className?: string }) {
  const rx = w / 2 - stroke;
  const ry = h / 2 - stroke;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true" style={style} className={className}>
      <defs>
        <clipPath id={id}>
          <ellipse cx={w / 2} cy={h / 2} rx={rx} ry={ry} />
        </clipPath>
      </defs>
      <rect width={w} height={h} filter="url(#fvc-bitnoise)" clipPath={`url(#${id})`} />
      <ellipse cx={w / 2} cy={h / 2} rx={rx} ry={ry} fill="none" stroke="var(--fvc-ink)" strokeWidth={stroke} />
    </svg>
  );
}

export function Crosshair({ size = 30, style, className }: { size?: number; style?: CSSProperties; className?: string }) {
  const c = size / 2;
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={style} className={className}>
      <circle cx={c} cy={c} r={size * 0.27} fill="none" stroke="var(--fvc-ink)" strokeWidth={1.5} />
      <path d={`M${c} 0 V${size} M0 ${c} H${size}`} stroke="var(--fvc-ink)" strokeWidth={1.5} />
    </svg>
  );
}

export function Barcode({ seed, w = 250, h = 50, fill = 'var(--fvc-ink)', label }: { seed: number; w?: number; h?: number; fill?: string; label?: string }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}>
      <path d={barcodePath(seed, w, h)} fill={fill} />
    </svg>
  );
}

/** Decorative 2D "specimen code" (encodes nothing). */
export function SpecimenCode({ seed, size = 74, bg, fill = 'var(--fvc-ink)' }: { seed: number; size?: number; bg?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 126 126" width={size} height={size} aria-hidden="true">
      {bg && <rect width="126" height="126" fill={bg} />}
      <path d={specimenCodePath(seed)} fill={fill} />
    </svg>
  );
}

export function Zigzag({ w = 212, stroke = 'var(--fvc-ink)' }: { w?: number; stroke?: string }) {
  return (
    <svg viewBox={`0 0 ${w} 8`} width={w} height={8} aria-hidden="true" style={{ maxWidth: '100%' }}>
      <path d={zigzagPath(w, 7, 7)} fill="none" stroke={stroke} strokeWidth={1.5} />
    </svg>
  );
}

/** Small petri-dish "FVC" logo (hero corner). */
export function DishLogo({ w = 92, h = 56, size = 20, border = 3 }: { w?: number; h?: number; size?: number; border?: number }) {
  return (
    <span className="fvc-dish" style={{ width: w, height: h, fontSize: size, borderWidth: border }}>
      FVC
    </span>
  );
}

/** The global SVG filters (grain + bit-noise). Rendered once in the root layout. */
export function FvcDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
      <defs>
        <filter id="fvc-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <filter id="fvc-bitnoise" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves={2} seed={4} />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="discrete" tableValues="0 1" />
            <feFuncG type="discrete" tableValues="0 1" />
            <feFuncB type="discrete" tableValues="0 1" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}
