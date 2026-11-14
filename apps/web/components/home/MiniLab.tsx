'use client';

import { color } from '@fvc/engine';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { germPaths } from '@/components/fvc/Germ';
import { MutatedWord } from '@/components/lab/Tools';
import { useTick } from '@/lib/hooks';
import { randomSeed } from '@/lib/useUrlState';
import s from './home.module.css';

/** Section 5 — the two mini tools. Same engine + MutatedWord as the full Lab. */
export function MiniLab({ spot = color.spot }: { spot?: string }) {
  const [seed, setSeed] = useState(23);
  const G = useMemo(() => germPaths(seed, { N: 110 }), [seed]);
  const [text, setText] = useState('CARRIER');
  const [m, setM] = useState(3);
  const ref = useRef<HTMLDivElement>(null);
  const tick = useTick(900, ref);
  return (
    <section className="fvc-grid2 fvc-rule-b" aria-label="FVC Lab, mini tools">
      <div className={`fvc-col-l ${s.mini}`} style={{ background: color.grey, borderRight: 'var(--fvc-rule)' }}>
        <div className={s.miniHead}>
          <h2 style={{ font: 'inherit', margin: 0 }}>FVC Lab ▮ Germinator</h2>
          <span aria-live="polite">Seed {seed}</span>
        </div>
        <div className={s.miniOut}>
          <svg viewBox="0 0 300 300" role="img" aria-label={`Your generated germ, seed ${seed}`} style={{ width: 'min(460px, 80%)', height: 'auto' }}>
            <path d={G.spot} fill={spot} />
            <path d={G.ink} fill={color.ink} />
          </svg>
        </div>
        <div className={s.miniBar}>
          <button type="button" className={s.miniBtn} style={{ background: spot }} onClick={() => setSeed(randomSeed())}>
            ↻ Grow a new carrier
          </button>
          <span style={{ color: color.paper, fontSize: 13 }}>Every release gets its own seed — and its own germ.</span>
        </div>
      </div>
      <div ref={ref} className={s.mini} style={{ background: color.white }}>
        <div className={s.miniHead}>
          <h2 style={{ font: 'inherit', margin: 0 }}>FVC Lab ▮ Mutator</h2>
          <span className="fvc-serif">catch your name</span>
        </div>
        <div className={s.miniOut}>
          <MutatedWord text={text} seed={m + tick} width={560} maxLetter={120} />
        </div>
        <div className={s.miniBar}>
          <label htmlFor="fvc-lab-name" style={{ color: color.paper, fontSize: 13 }}>
            Your name
          </label>
          <input
            id="fvc-lab-name"
            className={s.miniIn}
            type="text"
            maxLength={14}
            value={text}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setText(e.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, '').slice(0, 14))}
          />
          <button type="button" className={s.miniBtn} style={{ background: color.magenta }} onClick={() => setM(randomSeed())}>
            ↻ Mutate
          </button>
          <Link href="/lab" style={{ color: color.paper, fontSize: 13 }}>
            All 4 tools →
          </Link>
        </div>
      </div>
    </section>
  );
}
