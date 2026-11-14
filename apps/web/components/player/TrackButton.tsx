'use client';

import type { QueueTrack } from '@/lib/content';
import { usePlayer } from './PlayerProvider';
import s from './player.module.css';

/** Track title in a tracklist that plays (or pauses) that track in the global player. */
export function TrackButton({ queue, index }: { queue: QueueTrack[]; index: number }) {
  const p = usePlayer();
  const t = queue[index];
  const current = p.track?.src === t.src;
  const playing = current && p.playing;
  return (
    <button type="button" className={`${s.track} ${current ? s.trackOn : ''}`} onClick={() => p.playQueue(queue, index)} aria-label={`${playing ? 'Pause' : 'Play'} ${t.title}`} aria-pressed={playing}>
      <span className={s.trackIcon} aria-hidden="true">
        {playing ? '▮▮' : '▶'}
      </span>
      {t.title}
    </button>
  );
}
