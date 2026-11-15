'use client';

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { QueueTrack } from '@/lib/content';

/* ---------- live audio levels (read outside React, once per frame) ---------- */

export interface Levels {
  /** Low-end energy 0–1 (≈20–150 Hz). */
  bass: number;
  /** Overall loudness 0–1 (RMS of the waveform). */
  loud: number;
}

const levels: Levels = { bass: 0, loud: 0 };
const levelSubs = new Set<(l: Levels) => void>();

/** Subscribe to per-frame levels. The callback gets zeros when playback stops. */
export function subscribeLevels(cb: (l: Levels) => void) {
  levelSubs.add(cb);
  return () => {
    levelSubs.delete(cb);
  };
}

/* ---------- spectrogram analyser (unsmoothed, wide dB range so faint images show) ---------- */

let specAnalyser: AnalyserNode | null = null;
/** The analyser behind the Spectrogram view; null until the first play. */
export function getSpectrumAnalyser() {
  return specAnalyser;
}

/* ---------- player state ---------- */

interface PlayerApi {
  queue: QueueTrack[];
  index: number;
  track: QueueTrack | undefined;
  playing: boolean;
  /** Hidden tracks (#????) show their number once they have been played. */
  revealed: ReadonlySet<string>;
  time: number;
  duration: number;
  /** Load a queue and start the given track (always from a user gesture). */
  playQueue: (queue: QueueTrack[], index: number) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (t: number) => void;
}

const Ctx = createContext<PlayerApi | null>(null);

export function usePlayer() {
  const v = useContext(Ctx);
  if (!v) throw new Error('usePlayer must be used inside <PlayerProvider>');
  return v;
}

/**
 * Global player living in the root layout, so navigation never interrupts playback.
 * Nothing plays until the visitor presses play (no autoplay). The Web Audio graph
 * (MediaElementSource → Analyser → speakers) is created on the first play.
 */
export function PlayerProvider({ initialQueue, initialIndex = 0, children }: { initialQueue: QueueTrack[]; initialIndex?: number; children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const graph = useRef<{ ctx: AudioContext; analyser: AnalyserNode; freq: Uint8Array<ArrayBuffer>; wave: Uint8Array<ArrayBuffer> } | null>(null);
  const raf = useRef(0);
  const [queue, setQueue] = useState(initialQueue);
  const [index, setIndex] = useState(initialIndex);
  const [playing, setPlaying] = useState(false);
  const [revealed, setRevealed] = useState<ReadonlySet<string>>(() => new Set());
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const track = queue[index];

  const ensureGraph = useCallback(() => {
    const el = audioRef.current;
    if (!el || graph.current || typeof AudioContext === 'undefined') return;
    const ctx = new AudioContext();
    const src = ctx.createMediaElementSource(el);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.6;
    src.connect(analyser);
    analyser.connect(ctx.destination);
    const spec = ctx.createAnalyser();
    spec.fftSize = 2048;
    spec.smoothingTimeConstant = 0;
    spec.minDecibels = -100;
    spec.maxDecibels = -40;
    src.connect(spec);
    specAnalyser = spec;
    graph.current = { ctx, analyser, freq: new Uint8Array(analyser.frequencyBinCount), wave: new Uint8Array(analyser.fftSize) };
  }, []);

  // Analyse while playing; publish levels to subscribers.
  useEffect(() => {
    if (!playing) {
      levels.bass = 0;
      levels.loud = 0;
      levelSubs.forEach((cb) => cb(levels));
      return;
    }
    let bassAvg = 0.5;
    const loop = () => {
      const g = graph.current;
      if (g) {
        g.analyser.getByteFrequencyData(g.freq);
        g.analyser.getByteTimeDomainData(g.wave);
        const binHz = g.ctx.sampleRate / g.analyser.fftSize;
        const lo = Math.max(1, Math.floor(20 / binHz));
        const hi = Math.max(lo + 1, Math.ceil(150 / binHz));
        let sum = 0;
        for (let i = lo; i < hi; i++) sum += g.freq[i];
        const bassRaw = sum / (hi - lo) / 255;
        let sq = 0;
        for (let i = 0; i < g.wave.length; i++) {
          const v = (g.wave[i] - 128) / 128;
          sq += v * v;
        }
        const rms = Math.sqrt(sq / g.wave.length);
        // Bass: how far the low end jumps above its own recent average, so every track
        // breathes on its kicks whether it is bass-heavy or quiet.
        bassAvg += (bassRaw - bassAvg) * 0.03;
        const bass = Math.min(1, Math.max(0, (bassRaw - bassAvg * 0.92) / 0.22));
        // Loudness on a VU-like dB scale: −36 dB → 0, −6 dB → 1.
        const db = 20 * Math.log10(Math.max(rms, 1e-5));
        const loud = Math.min(1, Math.max(0, (db + 36) / 30));
        levels.bass += (bass - levels.bass) * 0.35;
        levels.loud += (loud - levels.loud) * 0.5;
        levelSubs.forEach((cb) => cb(levels));
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [playing]);

  const start = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    ensureGraph();
    graph.current?.ctx.resume();
    el.play().catch(() => setPlaying(false));
  }, [ensureGraph]);

  const playQueue = useCallback(
    (q: QueueTrack[], i: number) => {
      const el = audioRef.current;
      if (!el || !q[i]) return;
      // "Same track" means it is actually loaded in the element, not just first in the queue.
      const same = el.getAttribute('src') === q[i].src;
      setQueue(q);
      setIndex(i);
      if (same) {
        if (el.paused) start();
        else el.pause();
        return;
      }
      el.src = q[i].src;
      setTime(0);
      start();
    },
    [start],
  );

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el || !track) return;
    if (!el.getAttribute('src')) el.src = track.src;
    if (el.paused) start();
    else el.pause();
  }, [track, start]);

  const go = useCallback(
    (i: number) => {
      const el = audioRef.current;
      if (!el || !queue[i]) return;
      setIndex(i);
      el.src = queue[i].src;
      setTime(0);
      start();
    },
    [queue, start],
  );

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => {
    const el = audioRef.current;
    // Like most players: restart the track unless we are at its very beginning.
    if (el && el.currentTime > 3) el.currentTime = 0;
    else go(Math.max(0, index - 1));
  }, [go, index]);

  const seek = useCallback((t: number) => {
    const el = audioRef.current;
    if (el && Number.isFinite(t)) el.currentTime = t;
    setTime(t);
  }, []);

  const api = useMemo<PlayerApi>(
    () => ({ queue, index, track, playing, revealed, time, duration, playQueue, toggle, next, prev, seek }),
    [queue, index, track, playing, revealed, time, duration, playQueue, toggle, next, prev, seek],
  );

  return (
    <Ctx.Provider value={api}>
      {children}
      <audio
        ref={audioRef}
        preload="none"
        onPlay={() => {
          setPlaying(true);
          if (track?.hidden && !revealed.has(track.src)) setRevealed((r) => new Set(r).add(track.src));
        }}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => (index + 1 < queue.length ? go(index + 1) : setPlaying(false))}
      />
    </Ctx.Provider>
  );
}
