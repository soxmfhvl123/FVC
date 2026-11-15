'use client';

import { color } from '@fvc/engine';
import { useEffect, useRef, useState } from 'react';
import { getSpectrumAnalyser } from './PlayerProvider';
import s from './player.module.css';

const MAX_HZ = 18000;
const HEIGHT = 240;
/**
 * Scroll speed tied to the panel height so images keep their shape: the germ in #0002 spans
 * ~10 s and ~14 kHz, and at HEIGHT/12 px per second it lands roughly square.
 */
const PX_PER_S = HEIGHT / 12;

/** 256-step colour ramp: Paper (quiet) → Coral → Ink (loud). */
function ramp(): Uint8ClampedArray {
  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [p, c, k] = [hex(color.paper), hex(color.spot), hex(color.ink)];
  const out = new Uint8ClampedArray(256 * 3);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    const [a, b, u] = t < 0.5 ? [p, c, t / 0.5] : [c, k, (t - 0.5) / 0.5];
    for (let j = 0; j < 3; j++) out[i * 3 + j] = a[j] + (b[j] - a[j]) * u;
  }
  return out;
}

/**
 * Live spectrogram: newest sound enters on the right and flows left.
 * Linear frequency axis 0–18 kHz (top = 18 kHz), so pictures drawn into the spectrum
 * — like the germ hidden in #0002 SPECIMEN — appear undistorted.
 */
export function Spectrogram({ playing }: { playing: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [windowS, setWindowS] = useState(60);

  // Size once (and on resize); pausing keeps what has been drawn.
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const fit = () => {
      cv.width = Math.max(320, Math.round(cv.clientWidth));
      cv.height = HEIGHT;
      setWindowS(Math.round(cv.width / PX_PER_S));
      const ctx = cv.getContext('2d')!;
      ctx.fillStyle = color.paper;
      ctx.fillRect(0, 0, cv.width, cv.height);
    };
    fit();
    addEventListener('resize', fit);
    return () => removeEventListener('resize', fit);
  }, []);

  useEffect(() => {
    const cv = ref.current;
    if (!cv || !playing) return;
    const ctx = cv.getContext('2d')!;
    const lut = ramp();
    let raf = 0;
    let last = performance.now();
    let carry = 0;
    const draw = (now: number) => {
      const a = getSpectrumAnalyser();
      if (a) {
        carry += ((now - last) / 1000) * PX_PER_S;
        const dx = Math.floor(carry);
        if (dx > 0) {
          carry -= dx;
          const bins = new Uint8Array(a.frequencyBinCount);
          a.getByteFrequencyData(bins);
          const hzPerBin = a.context.sampleRate / a.fftSize;
          const top = Math.min(bins.length - 1, Math.floor(MAX_HZ / hzPerBin));
          // shift left, then paint the new columns on the right
          ctx.drawImage(cv, -dx, 0);
          const col = ctx.createImageData(dx, HEIGHT);
          for (let y = 0; y < HEIGHT; y++) {
            const lo = Math.floor(((HEIGHT - 1 - y) / HEIGHT) * top);
            const hi = Math.max(lo + 1, Math.floor(((HEIGHT - y) / HEIGHT) * top));
            let v = 0;
            for (let b = lo; b < hi; b++) if (bins[b] > v) v = bins[b];
            for (let x = 0; x < dx; x++) {
              const o = (y * dx + x) * 4;
              col.data[o] = lut[v * 3];
              col.data[o + 1] = lut[v * 3 + 1];
              col.data[o + 2] = lut[v * 3 + 2];
              col.data[o + 3] = 255;
            }
          }
          ctx.putImageData(col, cv.width - dx, 0);
        }
      }
      last = now;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  return (
    <div className={s.spectro} role="img" aria-label="Live spectrogram of the track playing now, 0 to 18 kilohertz">
      <canvas ref={ref} className={s.spectroCanvas} />
      <span className={`${s.spectroAxis} fvc-mono`} aria-hidden="true">
        <span>18k</span>
        <span>9k</span>
        <span>0 Hz</span>
      </span>
      <span className={`${s.spectroNote} fvc-note`} aria-hidden="true">
        Spectrogram, last {windowS}s
      </span>
    </div>
  );
}
