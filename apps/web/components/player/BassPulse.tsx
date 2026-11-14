'use client';

import { type CSSProperties, type ReactNode, useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/hooks';
import { subscribeLevels } from './PlayerProvider';

/** Scales its children 1.00–1.08 with the low end of whatever is playing. Off with reduced motion. */
export function BassPulse({ children, style, max = 0.08 }: { children: ReactNode; style?: CSSProperties; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    let last = -1;
    const off = subscribeLevels(({ bass }) => {
      const sc = Math.round((1 + bass * max) * 1000) / 1000;
      if (sc !== last) {
        el.style.transform = `scale(${sc})`;
        last = sc;
      }
    });
    return () => {
      off();
      el.style.transform = '';
    };
  }, [reduce, max]);
  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0, transformOrigin: '50% 55%', willChange: 'transform', ...style }}>
      {children}
    </div>
  );
}
