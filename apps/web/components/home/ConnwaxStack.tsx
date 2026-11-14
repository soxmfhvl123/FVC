import type { Strain } from '@/lib/content';
import { catalogNo, isolatedLabel, isPlaceholder, ph } from '@/lib/format';
import { SUBMIT_ENDPOINT } from '@/lib/forms';
import { BitNoiseOval } from '@/components/fvc/Marks';
import { Ticker } from '@/components/fvc/Ticker';
import s from './home.module.css';

/** Section 2 — Connwax stack + ink ticker for the latest strain. */
export function ConnwaxStack({ strain }: { strain: Strain }) {
  const artist = ph(strain.carrier, 'Artist').toUpperCase();
  const title = ph(strain.title, 'Release Title').toUpperCase();
  const out = strain.isolated ? isolatedLabel(strain.isolated) : '';
  // Only say what is true right now (no placeholders, no closed forms).
  const tape = [strain.id, artist, isPlaceholder(strain.title) ? null : title, 'HIGHLY CONTAGIOUS', 'NO KNOWN CURE', SUBMIT_ENDPOINT ? 'SAMPLE SUBMISSION OPEN' : null]
    .filter(Boolean)
    .map((x) => `${x} ▮ `)
    .join('');
  return (
    <section id="now-spreading" aria-labelledby="ns-h" className={s.connwax}>
      <h2 id="ns-h" className="sr-only">
        Now spreading: {strain.id}, {artist}{isPlaceholder(strain.title) ? '' : `, ${title}`}{out ? `, out ${out}` : ''}
      </h2>
      <div className={s.connwaxRow} aria-hidden="true">
        <span className={s.cwLabel}>FAT VIRUS CARRIER RECORDS</span>
        <BitNoiseOval id="ov1" w={120} h={40} />
        <span className={s.cwWide}>strain·{catalogNo(strain.id)}</span>
        <span className={s.cwOval}>CATCH IT</span>
        <span className="fvc-mono" style={{ fontSize: 22 }}>
          +
        </span>
        <span className={s.cwBar}>{artist}</span>
        {!isPlaceholder(strain.title) && <span className={s.cwWord}>{title}</span>}
        <span className={s.cwWord} style={{ background: strain.spot, padding: '0 10px' }}>
          {strain.isolated ? `OUT ${out}` : 'OUT NOW'}
        </span>
      </div>
      <Ticker label="Latest news" text={tape} />
    </section>
  );
}
