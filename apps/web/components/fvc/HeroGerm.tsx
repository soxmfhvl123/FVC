import type { EyeSet } from '@fvc/engine';
import type { CSSProperties } from 'react';
import { BassPulse } from '@/components/player/BassPulse';
import { Germ } from './Germ';
import { HeroEyes } from './HeroEyes';

/** The eye layout in HERO_EYES is drawn for seed 7; other seeds keep their own generated eyes. */
const LIVE_EYE_SEED = 7;

/**
 * Big two-colour hero germ. Body is rendered on the server; the eyes and the bass pulse are client islands.
 */
export function HeroGerm({ seed, spot, eyes = 'two', className, style }: { seed: number; spot: string; eyes?: EyeSet; className?: string; style?: CSSProperties }) {
  const live = seed === LIVE_EYE_SEED;
  return (
    <div className={className} style={{ position: 'relative', aspectRatio: '1', ...style }} aria-hidden="true">
      <BassPulse>
        <Germ seed={seed} spot={spot} N={140} lumps={5} hair={60} eyes={live ? 'none' : eyes} offset={[1.2, 0.8]} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        {live && <HeroEyes />}
      </BassPulse>
    </div>
  );
}
