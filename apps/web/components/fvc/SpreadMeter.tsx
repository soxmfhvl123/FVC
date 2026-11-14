'use client';

import { color } from '@fvc/engine';
import { useState } from 'react';
import { SPREAD_NAMES } from '@/lib/format';

/** 1-bit VU meter: buttons 1–5 set the level; 24 bars light up (top bars in the spot ink). */
export function SpreadMeter({ strainId, initial = 4, spot = color.spot }: { strainId: string; initial?: number; spot?: string }) {
  const [level, setLevel] = useState(initial);
  const lit = Math.round((level * 24) / 5);
  const name = SPREAD_NAMES[level - 1];
  return (
    <section className="fvc-grid2 fvc-meter" aria-labelledby="meter-h">
      <div className="fvc-col-l fvc-meter-l">
        <div>
          <div className="fvc-mono fvc-upper" style={{ fontSize: 12 }}>
            Spread Meter ▮ {strainId}
          </div>
          <h2 id="meter-h" className="fvc-meter-h">
            How <span className="fvc-goth">catchy</span>
            <br />
            <span className="fvc-serif">is it?</span>
          </h2>
        </div>
        <div>
          <div className="fvc-wide fvc-upper" style={{ fontSize: 24, marginBottom: 14 }} aria-live="polite">
            {name}
          </div>
          <div role="group" aria-label="Choose a spread level" className="fvc-meter-btns">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" aria-pressed={n === level} onClick={() => setLevel(n)} className={n === level ? 'on' : undefined}>
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="fvc-meter-r">
        <div role="img" aria-label={name} className="fvc-meter-bars">
          {Array.from({ length: 24 }, (_, i) => (
            <div
              key={i}
              style={{
                height: 60 + i * 9,
                background: `repeating-linear-gradient(to top, ${i < lit ? (i > 18 ? spot : color.paper) : '#2A2A2A'} 0 9px, transparent 9px 13px)`,
              }}
            />
          ))}
        </div>
        <div className="fvc-mono fvc-meter-scale" aria-hidden="true">
          <span>-20</span>
          <span>-10</span>
          <span>-5</span>
          <span>0</span>
          <span>+3 FAT</span>
        </div>
      </div>
    </section>
  );
}
