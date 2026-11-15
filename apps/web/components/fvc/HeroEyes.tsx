'use client';

import { color, HERO_EYES, pixelRing } from '@fvc/engine';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion, useTick } from '@/lib/hooks';

const CELL = 300 / 140;
const E = HERO_EYES;
const PATHS = {
  w1: pixelRing(E.left.white, 0, CELL),
  r1: pixelRing(E.left.ring[0], E.left.ring[1], CELL),
  p1: pixelRing(E.left.pupil, 0, CELL),
  w2: pixelRing(E.right.white, 0, CELL),
  r2: pixelRing(E.right.ring[0], E.right.ring[1], CELL),
  p2: pixelRing(E.right.pupil, 0, CELL),
};
const WHITE = '#F2F1ED';

/**
 * Live pixel eyes laid over a two-eyed hero germ drawn with eyes 'none' (N 140).
 * Pupils follow the pointer relative to the enclosing <header> (centre ≈ 62% / 32%),
 * wander slowly when there is no pointer, and stay centred with reduced motion.
 */
export function HeroEyes() {
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
      <g transform={`translate(${E.left.cx} ${E.left.cy})`}>
        <path d={PATHS.w1} fill={WHITE} />
        <path d={PATHS.r1} fill={color.ink} />
        <g style={pupil(E.left.travel)}>
          <path d={PATHS.p1} fill={color.ink} />
        </g>
      </g>
      <g transform={`translate(${E.right.cx} ${E.right.cy})`}>
        <path d={PATHS.w2} fill={WHITE} />
        <path d={PATHS.r2} fill={color.ink} />
        <g style={pupil(E.right.travel)}>
          <path d={PATHS.p2} fill={color.ink} />
        </g>
      </g>
    </svg>
  );
}
