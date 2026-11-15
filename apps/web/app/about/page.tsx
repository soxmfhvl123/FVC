import { color } from '@fvc/engine';
import type { Metadata } from 'next';
import { Footer } from '@/components/fvc/Footer';
import { Germ } from '@/components/fvc/Germ';
import { TopBar } from '@/components/fvc/TopBar';
import { Dictionary } from '@/components/home/Dictionary';
import { site } from '@/lib/content';
import s from './about.module.css';

export const metadata: Metadata = {
  title: 'About FVC',
  description: site.about,
};

const NAME = [
  { word: 'FAT', plain: 'Big, thick', music: 'Fat beat, fat sound — thick, warm low end', brand: 'Thick sound, chubby germs' },
  { word: 'VIRUS', plain: 'A germ', music: 'Viral; an earworm you cannot shake', brand: 'Good music spreads from person to person' },
  { word: 'CARRIER', plain: 'Someone who carries a germ', music: 'A sound carrier — the record itself', brand: 'The record, the label and every listener carry it' },
];

/** Mascot board specimen sheet: six germs. */
const SPECIMENS = [
  { seed: 23, o: { N: 90, lumps: 6 }, spot: color.spot, bg: color.greyDark, note: 'Seed 23', name: 'Curious', cls: '' },
  { seed: 41, o: { N: 96, two: false, eyes: 'cyclops' as const, hair: 70 }, spot: color.spot, bg: color.white, note: 'Seed 41 · one ink', name: 'Staring', cls: 'fvc-goth' },
  { seed: 88, o: { N: 80, lumps: 4 }, spot: color.acid, ink: color.paper, bg: color.ink, fg: color.paper, note: 'Seed 88 · inverted', name: 'FERAL', cls: 'fvc-wide' },
  { seed: 112, o: { N: 90, eyes: 'three' as const, lumps: 3 }, spot: color.magenta, bg: color.paper, note: 'Seed 112 · three eyes', name: 'Mutant', cls: 'fvc-serif' },
  { seed: 131, o: { N: 40, two: false, eyes: 'none' as const, lumps: 7, dust: 0.01 }, spot: color.spot, bg: color.white, note: 'Seed 131 · coarse', name: 'Dormant', cls: '' },
  { seed: 150, o: { N: 90, lumps: 5 }, spot: color.cobalt, bg: color.grey, note: 'Seed 150 · blue strain', name: 'SHY', cls: 'fvc-condensed' },
];

export default function AboutPage() {
  return (
    <>
      <TopBar current="/about" />
      <main id="main">
        <section className={s.intro}>
          <div className={s.introText}>
            <div className="fvc-section-label">
              <span>(i) What is FVC</span>
              <span>F.V.C. = Fat Virus Carrier</span>
            </div>
            <h1 className={s.h1}>
              <span className="fvc-goth">Fat</span> <span className="fvc-serif">Virus</span> <span className={s.bar}>CARRIER</span>
            </h1>
            <p className={s.lede}>{site.about}</p>
            <p className={s.tag}>{site.tagline.main}</p>
          </div>
          <div className={s.introArt}>
            <Germ seed={7} N={150} lumps={5} hair={64} label="Ttung-gyun, the FVC germ, as a two-colour bitmap" style={{ width: '100%', height: 'auto', transform: 'rotate(-6deg)' }} />
            <div className={s.figNote}>
              Fig. 1<br />
              Fat sound virus ×400
            </div>
          </div>
        </section>

        <section className={s.name} aria-labelledby="name-h">
          <h2 id="name-h" className={s.h2}>
            The name, three ways
          </h2>
          <table className="fvc-table">
            <thead>
              <tr>
                <th scope="col">Word</th>
                <th scope="col">Plain meaning</th>
                <th scope="col">In music</th>
                <th scope="col">At FVC</th>
              </tr>
            </thead>
            <tbody>
              {NAME.map((n) => (
                <tr key={n.word}>
                  <th scope="row" className={s.word}>
                    {n.word}
                  </th>
                  <td>{n.plain}</td>
                  <td>{n.music}</td>
                  <td>{n.brand}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <Dictionary vocabulary={site.vocabulary} limit={9} />

        <section aria-labelledby="sheet-h">
          <div className="fvc-section-label" style={{ padding: '18px 18px 12px', borderBottom: 'var(--fvc-rule)' }}>
            <h2 id="sheet-h" style={{ font: 'inherit', margin: 0 }}>
              Specimen sheet: Ttung-gyun
            </h2>
            <span>Habitat: headphones, car speakers, your ears</span>
          </div>
          <div className={s.sheet}>
            {SPECIMENS.map((x) => (
              <figure key={x.seed} className={s.specimen} style={{ background: x.bg, color: x.fg ?? color.ink }}>
                <Germ seed={x.seed} spot={x.spot} ink={x.ink} label={`Specimen ${x.seed}`} {...x.o} style={{ width: '70%', height: 'auto' }} />
                <figcaption>
                  <span style={{ fontSize: 12 }}>{x.note}</span>
                  <span className={x.cls} style={{ fontSize: 24, fontWeight: x.cls ? undefined : 600 }}>
                    {x.name}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
