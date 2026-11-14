'use client';

import { GlyphCache } from '@fvc/engine';
import { type RefObject, useEffect, useState, useSyncExternalStore } from 'react';

/* ---------- reduced motion ---------- */

const RM_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReduced(cb: () => void) {
  const mq = matchMedia(RM_QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

/** true when the visitor asked for reduced motion. Server render assumes motion is off (static first frame). */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => matchMedia(RM_QUERY).matches,
    () => true,
  );
}

/* ---------- on-screen ---------- */

/** true while `ref` is (at least partly) in the viewport. */
export function useInView(ref: RefObject<Element | null>): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '80px' });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

/**
 * A counter that increments every `ms` while the element is on screen, motion is allowed
 * and `enabled` is true. Reduced motion → stays at 0 (the static first state).
 */
export function useTick(ms: number, ref: RefObject<Element | null>, enabled = true): number {
  const [tick, setTick] = useState(0);
  const reduce = useReducedMotion();
  const inView = useInView(ref);
  const running = enabled && inView && !reduce;
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTick((n) => n + 1), ms);
    return () => clearInterval(t);
  }, [ms, running]);
  return reduce ? 0 : tick;
}

/* ---------- glyph cache (mutating letters) ---------- */

let cache: GlyphCache | undefined;
let fontsReady = false;
let fontsPromise: Promise<void> | undefined;
let version = 0;
const listeners = new Set<() => void>();

function getCache() {
  if (!cache) cache = new GlyphCache(() => document.createElement('canvas'));
  return cache;
}

function bump() {
  version++;
  listeners.forEach((l) => l());
}

function subscribeGlyphs(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/**
 * Rasterises `chars` once fonts are loaded and returns the shared cache (undefined until then,
 * so letters render with their text fallback on the server and on first paint).
 */
export function useGlyphs(chars: string): GlyphCache | undefined {
  const v = useSyncExternalStore(
    subscribeGlyphs,
    () => version,
    () => 0,
  );
  useEffect(() => {
    if (!chars) return;
    if (fontsReady) {
      const c = getCache();
      const before = chars.split('').some((ch) => ch.trim() && !c.get(ch));
      c.ensure(chars);
      if (before) bump();
      return;
    }
    fontsPromise ??= GlyphCache.fontsReady().then(() => {
      fontsReady = true;
    });
    fontsPromise.then(() => {
      getCache().ensure(chars);
      bump();
    });
  }, [chars]);
  return v > 0 ? cache : undefined;
}
