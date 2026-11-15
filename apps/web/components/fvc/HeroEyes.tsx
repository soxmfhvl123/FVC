'use client';

import { color, type EyeSet, HERO_EYES, pixelRing } from '@fvc/engine';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion, useTick } from '@/lib/hooks';

const CELL = 300 / 140;

interface Eye {
  cx: number;
  cy: number;
  white: number;
  ring: [number, number];
  pupil: number;
  travel: number;
}

/** Same layout as the engine's EYES table (body units, plane ±1.45 → 300 box). */
const UNITS: Record<'cyclops' | 'three', number[][]> = {
  cyclops: [[0, -0.08, 0.34, 0.15]],
  three: [
    [-0.36, -0.12, 0.15, 0.07],
    [0, -0.32, 0.13, 0.06],
    [0.34, -0.1, 0.17, 0.08],
  ],
};
const px = (u: number) => ((u + 1.45) / 2.9) * 300;
const len = (u: number) => (u / 2.9) * 300;

function layout(set: EyeSet): Eye[] {
  if (set === 'two') return [HERO_EYES.left, HERO_EYES.right].map((e) => ({ ...e, ring: e.ring as [number, number] }));
  if (set === 'none') return [];
  return UNITS[set].map(([x, y, r, pr]) => {
    const white = Math.round(len(r) * 2) / 2;
    return { cx: px(x), cy: px(y), white, ring: [white - 1, Math.max(3, white * 0.22)], pupil: Math.round(len(pr) * 2) / 2, travel: Math.round(white * 0.37) };
  });
}

const WHITE = '#F2F1ED';

/**
 * Live pixel eyes laid over a hero germ drawn with eyes 'none' (N 140), for any eye set.
 * Pupils follow the pointer relative to the enclosing <header> (centre ≈ 62% / 32%),
 * wander slowly when there is no pointer, and stay centred with reduced motion.
 */
export function HeroEyes({ set = 'two' }: { set?: EyeSet }) {
  const eyes = useMemo(() => layout(set).map((e) => ({ ...e, w: pixelRing(e.white, 0, CELL), r: pixelRing(e.ring[0], e.ring[1], CELL), p: pixelRing(e.pupil, 0, CELL) })), [set]);
  const ref = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion();
  const [pointer, setPointer] = useState<{ mx: number; my: number } | null>(null);
  const tick = useTick(900, ref, pointer == null);

  useEffect(() => {
    const area = ref.current?.closest('header');
    if (!area || reduce) return;
    let raf = 0;
    let next: { mx: number; my: number } | null = null;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const r = area.getBoundingClientRect();
      let mx = ((e.clientX - r.left) / r.width - 0.62) * 2.2;
      let my = ((e.clientY - r.top) / r.height - 0.32) * 2.2;
      const m = Math.hypot(mx, my);
      if (m > 1) {
        mx /= m;
        my /= m;
      }
      next = { mx, my };
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          setPointer(next);
        });
    };
    const onLeave = () => setPointer(null);
    area.addEventListener('pointermove', onMove);
    area.addEventListener('pointerleave', onLeave);
    return () => {
      area.removeEventListener('pointermove', onMove);
      area.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  let mx = 0;
  let my = 0;
  if (!reduce) {
    if (pointer) ({ mx, my } = pointer);
    else {
      mx = Math.sin(tick * 0.7) * 0.8;
      my = Math.cos(tick * 0.45) * 0.5;
    }
  }
  const pupil = (travel: number) => ({
    transform: `translate(${Math.round(mx * travel * 10) / 10}px, ${Math.round(my * travel * 10) / 10}px)`,
    transition: 'transform 0.18s ease-out',
  });

  return (
    <svg ref={ref} viewBox="0 0 300 300" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      {eyes.map((e, i) => (
        <g key={i} transform={`translate(${e.cx} ${e.cy})`}>
          <path d={e.w} fill={WHITE} />
          <path d={e.r} fill={color.ink} />
          <g style={pupil(e.travel)}>
            <path d={e.p} fill={color.ink} />
          </g>
        </g>
      ))}
    </svg>
  );
}
