'use client';

import { type ReactNode, useState } from 'react';
import type { Format, Strain } from '@/lib/content';
import { formatLabel } from '@/lib/format';
import s from './strains.module.css';

/**
 * Filter pills by Strain Type and Format. Cards are rendered on the server and passed in,
 * so filtering only hides/shows them.
 */
export function StrainFilters({ strains, cards }: { strains: Strain[]; cards: Record<string, ReactNode> }) {
  const types = [...new Set(strains.map((x) => x.strainType))];
  const formats = [...new Set(strains.flatMap((x) => x.formats))] as Format[];
  const [type, setType] = useState<string | null>(null);
  const [format, setFormat] = useState<Format | null>(null);
  const shown = strains.filter((x) => (!type || x.strainType === type) && (!format || x.formats.includes(format)));

  const pills = <T extends string>(label: string, all: T[], cur: T | null, set: (v: T | null) => void, name: (v: T) => string) => (
    <div role="group" aria-label={label} className={s.pills}>
      <span className="fvc-note" style={{ minWidth: 92 }}>
        {label}
      </span>
      <button type="button" aria-pressed={cur == null} className={s.pill} onClick={() => set(null)}>
        All
      </button>
      {all.map((v) => (
        <button key={v} type="button" aria-pressed={cur === v} className={s.pill} onClick={() => set(cur === v ? null : v)}>
          {name(v)}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <div className={s.filters}>
        {pills('Strain type', types, type, setType, (v) => v)}
        {pills('Format', formats, format, setFormat, (v) => formatLabel(v))}
        <p className="sr-only" aria-live="polite">
          {shown.length} strains shown
        </p>
      </div>
      {shown.length ? (
        <div className={`fvc-grid2 ${s.grid}`}>{shown.map((x) => <div key={x.id}>{cards[x.id]}</div>)}</div>
      ) : (
        <p className={s.empty}>No strain matches. Try fewer filters.</p>
      )}
    </>
  );
}
