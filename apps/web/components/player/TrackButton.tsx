'use client';

import { color } from '@fvc/engine';
import { Germ } from '@/components/fvc/Germ';
import type { QueueTrack } from '@/lib/content';
import { trackName } from '@/lib/format';
import { usePlayer } from './PlayerProvider';
import s from './player.module.css';

const PHASE_DOT = { FEVER: color.spot, DORMANT: '#8F8E8A' } as const;

/**
 * A track in a tracklist; plays (or pauses) it in the global queue.
 * Tracks with a seed show their germ and #number instead of a title (FVC-002);
 * hidden tracks read #???? until they have been played.
 */
export function TrackButton({ queue, index }: { queue: QueueTrack[]; index: number }) {
  const p = usePlayer();
  const t = queue[index];
  const current = p.track?.src === t.src;
  const playing = current && p.playing;
  const revealed = p.revealed.has(t.src) || playing;
  const name = trackName(t, revealed);

  return (
    <button type="button" className={`${s.track} ${current ? s.trackOn : ''}`} onClick={() => p.playQueue(queue, index)} aria-label={`${playing ? 'Pause' : 'Play'} ${name}${t.phase ? `, ${t.phase.toLowerCase()}` : ''}`} aria-pressed={playing}>
      <span className={s.trackIcon} aria-hidden="true">
        {playing ? '▮▮' : '▶'}
      </span>
      {t.seed == null ? (
        name
      ) : (
        <span className={s.seedTitle} aria-hidden="true">
          {t.hidden && !revealed ? <span className={s.seedUnknown}>?</span> : <Germ seed={t.seed} N={44} dust={0} spot={color.spot} width={32} height={32} />}
          <span className="fvc-mono">{name}</span>
        </span>
      )}
      {t.phase && <span className={s.phaseDot} style={{ background: PHASE_DOT[t.phase] }} aria-hidden="true" title={t.phase} />}
    </button>
  );
}
