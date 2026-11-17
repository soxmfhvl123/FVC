'use client';

import { useEffect, useRef } from 'react';
import type { Poster } from '@/lib/content';
import { useInView, useReducedMotion } from '@/lib/hooks';

/**
 * A side poster: a short looping clip, muted, that plays only while on screen.
 * With reduced motion it never plays, so the still frame (the `poster` image) stays.
 * The <video> is always mounted so the on-screen observer has an element to watch.
 */
export function SidePoster({ poster, caption }: { poster: Poster; caption: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (inView && !reduce) v.play().catch(() => {});
    else v.pause();
  }, [inView, reduce]);

  return (
    <figure className="fvc-poster">
      <video ref={ref} src={poster.video} poster={poster.still} muted loop playsInline preload="metadata" aria-label={poster.alt} width={640} height={640} />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
