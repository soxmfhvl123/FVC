'use client';

import { letter, wordmarkModes } from '@fvc/engine';
import { type CSSProperties, useRef } from 'react';
import { useGlyphs, useTick } from '@/lib/hooks';
import { Letter } from './Letter';

/** F·V·C, each letter catching a new strain every 900 ms. Static first state with reduced motion. */
export function LiveWordmark({ word = 'FVC', letterStyle, className, style, label = 'FVC, letters mutating' }: { word?: string; letterStyle?: CSSProperties; className?: string; style?: CSSProperties; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const tick = useTick(900, ref);
  const cache = useGlyphs(word);
  const modes = wordmarkModes(tick, word.length);
  return (
    <div ref={ref} role="img" aria-label={label} className={className} style={{ display: 'flex', ...style }}>
      {word.split('').map((ch, i) => (
        <Letter key={i} L={letter(ch, modes[i], cache)} style={{ display: 'block', ...letterStyle }} />
      ))}
    </div>
  );
}
