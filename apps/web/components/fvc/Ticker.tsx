'use client';

import { useRef } from 'react';
import { useInView } from '@/lib/hooks';

/** Ink tape that loops every 34s. Paused off-screen; static with reduced motion (CSS). */
export function Ticker({ text, label }: { text: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  return (
    <div ref={ref} className="fvc-ticker" role="marquee" aria-label={label}>
      <div className="fvc-ticker-tape fvc-anim" style={{ animationPlayState: inView ? 'running' : 'paused' }} aria-hidden="true">
        {Array.from({ length: 8 }, (_, k) => (
          <span key={k}>{text}</span>
        ))}
      </div>
    </div>
  );
}
