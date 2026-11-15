import { color } from '@fvc/engine';
import type { CSSProperties } from 'react';
import s from './home.module.css';

type Look = 'ink' | 'outline' | 'spot';
const WIDE: CSSProperties = { fontFamily: 'var(--fvc-font-display)', fontWeight: 900, fontStretch: '125%', fontSize: 46, letterSpacing: '-0.03em', lineHeight: 1.1, textTransform: 'uppercase' };
const GOTH: CSSProperties = { fontFamily: 'var(--fvc-font-goth)', fontWeight: 800, fontSize: 54, lineHeight: 1 };
const SERIF: CSSProperties = { fontFamily: 'var(--fvc-font-serif)', fontStyle: 'italic', fontSize: 56, lineHeight: 1 };
const COND: CSSProperties = { fontFamily: 'var(--fvc-font-display)', fontWeight: 900, fontStretch: '62%', fontSize: 54, lineHeight: 1.05, textTransform: 'uppercase' };

/** Row looks and type per entry, in the canvas order. */
const ROWS: { key: string; from: string; look: Look; type: CSSProperties }[] = [
  { key: 'release', from: 'Release', look: 'ink', type: WIDE },
  { key: 'listener', from: 'Listener', look: 'outline', type: GOTH },
  { key: 'demo', from: 'Demo', look: 'ink', type: WIDE },
  { key: 'releaseParty', from: 'Release party', look: 'outline', type: SERIF },
  { key: 'merch', from: 'Merch', look: 'spot', type: COND },
  { key: 'newsletter', from: 'Newsletter', look: 'ink', type: WIDE },
  { key: 'trackLength', from: 'Track length', look: 'outline', type: GOTH },
  { key: 'genre', from: 'Genre', look: 'ink', type: WIDE },
  { key: 'catchiness', from: 'Catchiness', look: 'outline', type: SERIF },
];

/** Section 9 — Carrier's dictionary: alternating ink bars / outlined rows from site.vocabulary. */
export function Dictionary({ vocabulary, spot = color.spot, limit = 8 }: { vocabulary: Record<string, string>; spot?: string; limit?: number }) {
  const rows = ROWS.filter((r) => vocabulary[r.key]).slice(0, limit);
  return (
    <section className={s.dict} aria-labelledby="dict-h">
      <div className="fvc-section-label" style={{ padding: '0 18px 12px' }}>
        <h2 id="dict-h" style={{ font: 'inherit', margin: 0 }}>
          Carrier’s dictionary
        </h2>
        <span>{rows.length} entries</span>
      </div>
      <dl className={s.dictList}>
        {rows.map((r) => {
          // "Sample (Sample Submission)" → show the long form.
          const word = vocabulary[r.key].replace(/^.*\((.+)\)$/, '$1');
          const look: CSSProperties = r.look === 'ink' ? { background: color.ink, color: color.white } : r.look === 'spot' ? { background: spot } : { border: `2px solid ${color.ink}` };
          return (
            <div key={r.key} className={`${s.dictRow} fvc-inv`} style={look}>
              <dt className="fvc-note">{r.from}</dt>
              <dd style={r.type}>{word}</dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
