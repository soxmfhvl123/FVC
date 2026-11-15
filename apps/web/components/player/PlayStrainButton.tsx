'use client';

import type { QueueTrack } from '@/lib/content';
import { usePlayer } from './PlayerProvider';

/** "Play" a strain from its first track in the shared queue; "Pause" while one of its tracks plays. */
export function PlayStrainButton({ queue, strainId }: { queue: QueueTrack[]; strainId: string }) {
  const p = usePlayer();
  const start = queue.findIndex((t) => t.strainId === strainId);
  const active = p.playing && p.track?.strainId === strainId;
  if (start < 0) return null;
  return (
    <button type="button" className="fvc-cta" aria-label={`${active ? 'Pause' : 'Play'} ${strainId}`} onClick={() => (active ? p.toggle() : p.playQueue(queue, start))}>
      {active ? 'Pause' : 'Play'}
    </button>
  );
}
