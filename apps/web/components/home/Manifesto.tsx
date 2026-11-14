import { color } from '@fvc/engine';
import { Germ } from '@/components/fvc/Germ';
import s from './home.module.css';

/**
 * Section 4 — mixed-type manifesto. The words come from site.about; the type mix is the
 * canvas composition, so it is set by hand here rather than parsed.
 */
export function Manifesto({ spot = color.spot }: { spot?: string }) {
  return (
    <section className={s.manifesto} aria-labelledby="mf-h">
      <div className="fvc-section-label" style={{ marginBottom: 20 }}>
        <h2 id="mf-h" style={{ font: 'inherit', margin: 0 }}>
          (i) What is FVC
        </h2>
        <span>F.V.C. = Fat Virus Carrier</span>
      </div>
      <p className={s.manifestoP}>
        We carry <span className="fvc-goth">fat sound</span> — thick, warm, <span className="fvc-serif">impossible to shake.</span> Every record we press is a{' '}
        <span className={s.mfBar}>CARRIER</span>
        <Germ seed={5} N={40} dust={0.0001} spot={spot} width="1em" height="1em" style={{ verticalAlign: '-0.12em', margin: '0 0.06em' }} />. Play it once and it lives in you.{' '}
        <span className={s.mfOval}>Pass it on</span> and you’re one of us.
      </p>
      <p className={s.manifestoOut}>
        LISTEN ONCE. <span style={{ color: spot, WebkitTextStroke: 0 }}>CARRY</span> FOREVER.
      </p>
    </section>
  );
}
