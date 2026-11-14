import type { Strain } from '@/lib/content';
import { catalogNo, isolatedLabel, ph } from '@/lib/format';
import { BitNoiseOval } from '@/components/fvc/Marks';
import { Ticker } from '@/components/fvc/Ticker';
import s from './home.module.css';

/** Section 2 — Connwax stack + ink ticker for the latest strain. */
export function ConnwaxStack({ strain }: { strain: Strain }) {
  const artist = ph(strain.carrier, 'Artist').toUpperCase();
  const title = ph(strain.title, 'Release Title').toUpperCase();
  const out = strain.isolated ? isolatedLabel(strain.isolated) : '[DATE]';
  return (
    <section id="now-spreading" aria-labelledby="ns-h" className={s.connwax}>
      <h2 id="ns-h" className="sr-only">
        Now spreading: {strain.id}, {artist}, {title}, out {out}
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
        <span className={s.cwWord}>{title}</span>
        <span className={s.cwWord} style={{ background: strain.spot, padding: '0 10px' }}>
          OUT {out}
        </span>
      </div>
      <Ticker label="Latest news" text={`${strain.id} ▮ ${artist} ▮ ${ph(strain.title, 'Title').toUpperCase()} ▮ HIGHLY CONTAGIOUS ▮ NO KNOWN CURE ▮ SAMPLE SUBMISSION OPEN ▮`} />
    </section>
  );
}
