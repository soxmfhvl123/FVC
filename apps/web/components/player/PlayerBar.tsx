'use client';

import { useEffect } from 'react';
import { isPlaceholder } from '@/lib/format';
import { usePlayer } from './PlayerProvider';
import s from './player.module.css';

/** 202.8 → "03:22" */
export function mmss(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) sec = 0;
  const t = Math.floor(sec);
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
}

/** "3:22" → 202 */
const parseIncubation = (v: string) => {
  const [m, x] = v.split(':').map(Number);
  return (m || 0) * 60 + (x || 0);
};

/** Keys that already mean something on these elements — leave them alone. */
function ownsSpace(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  return el.isContentEditable || !!el.closest('input, textarea, select, button, a, [role="slider"], [role="button"], summary');
}

/** Fixed ink bar at the bottom: play/pause, prev/next, progress, "Incubation 01:24 / 03:12". */
export function PlayerBar() {
  const p = usePlayer();
  const t = p.track;

  // Space toggles play/pause anywhere except where Space already acts (buttons, fields, links).
  useEffect(() => {
    if (!t) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.key !== ' ') return;
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || ownsSpace(e.target)) return;
      e.preventDefault();
      p.toggle();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [t, p]);

  if (!t) return null;
  const total = p.duration || parseIncubation(t.incubation);
  const carrier = isPlaceholder(t.carrier) ? '[Artist]' : t.carrier;
  const label = `${t.title}, ${t.strainId}`;

  return (
    <>
    {/* Keeps the footer clear of the fixed bar. */}
    <div className={s.spacer} aria-hidden="true" />
    <div className={s.bar} role="region" aria-label="Player">
      <div className={s.controls}>
        <button type="button" className={s.btn} onClick={p.prev} aria-label="Previous track" disabled={p.index === 0 && p.time < 3}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 2h2v12H3zM14 2v12L6 8z" />
          </svg>
        </button>
        <button type="button" className={`${s.btn} ${s.play}`} onClick={p.toggle} aria-label={p.playing ? `Pause ${label}` : `Play ${label}`} aria-pressed={p.playing}>
          {p.playing ? (
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 2h4v12H3zM9 2h4v12H9z" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 1.5v13L14 8z" />
            </svg>
          )}
        </button>
        <button type="button" className={s.btn} onClick={p.next} aria-label="Next track" disabled={p.index >= p.queue.length - 1}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M11 2h2v12h-2zM2 2v12l8-6z" />
          </svg>
        </button>
      </div>

      <div className={s.now} aria-live="polite">
        <span className={s.strain}>{t.strainId}</span>
        <span className={s.title}>
          {t.side}
          {t.no} {t.title}
        </span>
        <span className={s.carrier}>{carrier}</span>
      </div>

      <input
        className={s.seek}
        type="range"
        min={0}
        max={Math.max(1, total)}
        step={0.1}
        value={Math.min(p.time, total)}
        onChange={(e) => p.seek(Number(e.target.value))}
        aria-label={`Seek in ${t.title}`}
        aria-valuetext={`${mmss(p.time)} of ${mmss(total)}`}
        style={{ ['--pct' as string]: `${(Math.min(p.time, total) / Math.max(1, total)) * 100}%` }}
      />

      <span className={s.time}>
        <span className={s.timeLabel}>Incubation</span> {mmss(p.time)} / {mmss(total)}
      </span>
    </div>
    </>
  );
}
