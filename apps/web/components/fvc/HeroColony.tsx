import type { CSSProperties } from 'react';
import { BassPulse } from '@/components/player/BassPulse';
import { COLONY_EYES, COLONY_PALETTES, ColonyG, type ColonyPal } from './Colony';
import { ColonyEyes } from './HeroEyes';

/**
 * Hero for a strain grown with the Colony tool: the packed-circle colony floats and pulses
 * like the hero germ, and its pupils follow the pointer.
 * The hero sits on paper, so the Night palette (white cells) falls back to Robotron.
 */
export function HeroColony({ seed, pal = 'robotron', className, style }: { seed: number; pal?: ColonyPal; className?: string; style?: CSSProperties }) {
  const p = pal === 'night' ? 'robotron' : pal;
  return (
    <div className={className} style={{ position: 'relative', aspectRatio: '1', ...style }} aria-hidden="true">
      <div className="fvc-float" style={{ position: 'absolute', inset: 0 }}>
        <BassPulse>
          <svg viewBox="0 0 300 300" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <ColonyG seed={seed} pal={p} eyes="whites" />
          </svg>
          <ColonyEyes eyes={COLONY_EYES} ink={COLONY_PALETTES[p].p.ink} />
        </BassPulse>
      </div>
    </div>
  );
}
