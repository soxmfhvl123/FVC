'use client';

import type { QueueTrack } from '@/lib/content';
import { usePlayer } from './PlayerProvider';

/** "Play" for a whole strain (first track), "Pause" while that strain is playing. */
export function PlayStrainButton({ queue, label }: { queue: QueueTrack[]; label: string }) {
  const p = usePlayer();
  const active = p.playing && queue.some((t) => t.src === p.track?.src);
  return (
    <button type="button" className="fvc-cta" aria-label={`${active ? 'Pause' : 'Play'} ${label}`} onClick={() => (active ? p.toggle() : p.playQueue(queue, 0))}>
      {active ? 'Pause' : 'Play'}
    </button>
  );
}
