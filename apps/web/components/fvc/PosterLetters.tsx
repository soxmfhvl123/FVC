'use client';

import { letter, WORDMARK_MODES } from '@fvc/engine';
import { useRef } from 'react';
import { useGlyphs, useTick } from '@/lib/hooks';
import { Letter } from './Letter';

/** Into the Noise poster: big F / V / C, each mutating every 800 ms on its own offset. */
export function PosterLetters({ boxes }: { boxes: { left: string; top: string; width: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const tick = useTick(800, ref);
  const cache = useGlyphs('FVC');
  const offsets = [0, 3, 5];
  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0 }}>
      {['F', 'V', 'C'].map((ch, i) => (
        <Letter key={ch} L={letter(ch, WORDMARK_MODES[(tick + offsets[i]) % 7], cache)} style={{ position: 'absolute', ...boxes[i], height: 'auto', aspectRatio: '200 / 260' }} />
      ))}
    </div>
  );
}
