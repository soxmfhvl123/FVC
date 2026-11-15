import type { EyeSet } from '@fvc/engine';
import type { CSSProperties } from 'react';
import { BassPulse } from '@/components/player/BassPulse';
import { Germ } from './Germ';
import { HeroEyes } from './HeroEyes';


/**
 * Big two-colour hero germ. Body is rendered on the server; the eyes and the bass pulse are client islands.
 */
export function HeroGerm({ seed, spot, eyes = 'two', className, style }: { seed: number; spot: string; eyes?: EyeSet; className?: string; style?: CSSProperties }) {
  // Eye positions depend only on the eye set, never on the seed, so live eyes fit every germ.
  const live = eyes !== 'none';
  return (
    <div className={className} style={{ position: 'relative', aspectRatio: '1', ...style }} aria-hidden="true">
      <div className="fvc-float" style={{ position: 'absolute', inset: 0 }}>
      <BassPulse>
        <Germ seed={seed} spot={spot} N={140} lumps={5} hair={60} eyes={live ? 'none' : eyes} offset={[1.2, 0.8]} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        {live && <HeroEyes set={eyes} />}
      </BassPulse>
      </div>
    </div>
  );
}
