import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Cover } from '@/components/fvc/Cover';
import { Footer } from '@/components/fvc/Footer';
import { ShareButton } from '@/components/fvc/ShareButton';
import { SpecimenLabel } from '@/components/fvc/SpecimenLabel';
import { StrainCard } from '@/components/fvc/StrainCard';
import { TopBar } from '@/components/fvc/TopBar';
import { VinylRecord } from '@/components/fvc/Vinyl';
import { PlayStrainButton } from '@/components/player/PlayStrainButton';
import { TrackButton } from '@/components/player/TrackButton';
import { getStrain, getStrains, type QueueTrack, strainQueue, type Track } from '@/lib/content';
import { catalogNo, formatLabel, isolatedLabel, isPlaceholder, ph, spreadBlocks, totalIncubation, trackTime } from '@/lib/format';
import s from './strain.module.css';

export function generateStaticParams() {
  return getStrains().map((x) => ({ id: x.id }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const strain = getStrain((await params).id);
  if (!strain) return {};
  const who = isPlaceholder(strain.carrier) ? '' : ` by ${strain.carrier}`;
  const what = isPlaceholder(strain.title) ? strain.id : `${strain.title}${who}`;
  return {
    title: strain.id,
    description: `${what}. Strain type: ${ph(strain.strainType, 'Genre')}. Highly contagious.`,
    openGraph: { images: [{ url: `/og/${strain.id}.png`, width: 1200, height: 630, alt: `${strain.id}: a bitmap germ on grey` }] },
  };
}

function Side({ name, label, tracks, queue, rated }: { name: 'A' | 'B'; label?: string; tracks: Track[]; queue: QueueTrack[]; rated: boolean }) {
  if (!tracks.length) return null;
  return (
    <tbody>
      <tr>
        <th colSpan={rated ? 4 : 3} scope="rowgroup" className={s.side}>
          Side {name}
          {label && ` — ${label}`}
        </th>
      </tr>
      {tracks.map((t) => (
        <tr key={`${name}${t.no}`}>
          <td className="fvc-mono" style={{ width: 60 }}>
            {name}
            {t.no}
          </td>
          <td>
            {t.audio ? <TrackButton queue={queue} index={queue.findIndex((q) => q.side === name && q.no === t.no)} /> : ph(t.title, 'Track Title')}
            {t.mutationOf && (
              <span className={`fvc-mono ${s.source}`} aria-label={`mutation of ${t.mutationOf}`}>
                ← {t.mutationOf}
              </span>
            )}
          </td>
          {rated && (
            <td className="fvc-mono" aria-label={t.spread ? `Spread ${t.spread} of 5` : 'Spread not rated'}>
              {spreadBlocks(t.spread ?? null)}
            </td>
          )}
          <td className="fvc-mono" style={{ textAlign: 'right' }}>
            {trackTime(t)}
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default async function StrainPage({ params }: { params: Promise<{ id: string }> }) {
  const strain = getStrain((await params).id);
  if (!strain) notFound();
  const queue = strainQueue(strain);
  const rated = [...strain.sideA, ...strain.sideB].some((t) => t.spread != null);
  const all = getStrains().filter((x) => x.id !== strain.id);
  const related = [...all.filter((x) => x.coverStyle === strain.coverStyle), ...all.filter((x) => x.coverStyle !== strain.coverStyle)].slice(0, 2);
  const links = [
    ['Listen', strain.links.listen],
    ['Buy', strain.links.buy],
    ['Bandcamp', strain.links.bandcamp],
  ].filter((l): l is [string, string] => !!l[1]);

  return (
    <>
      <TopBar current="/strains" />
      <main id="main">
        <section className={s.top}>
          <div className={s.coverWrap}>
            <Cover strain={strain} />
          </div>
          <div className={s.meta}>
            <div className="fvc-section-label">
              <span>Strain {catalogNo(strain.id)}</span>
              <span>{strain.isolated ? `Isolated ${isolatedLabel(strain.isolated)} ` : ''}Seoul</span>
            </div>
            <h1 className={s.catalog}>{strain.id}</h1>
            <p className={s.title}>
              {ph(strain.carrier, 'Artist')}
              {!isPlaceholder(strain.title) && (
                <>
                  {' '}— <span className="fvc-serif">{strain.title}</span>
                </>
              )}
            </p>
            <div className={s.pills}>
              <span className="fvc-pill" style={{ background: 'var(--fvc-white)' }}>
                {ph(strain.strainType, 'Genre')}
              </span>
              {strain.formats.map((f) => (
                <span key={f} className="fvc-pill">
                  {formatLabel(f)}
                </span>
              ))}
            </div>
            {!isPlaceholder(strain.blurb) && <p className="fvc-prose">{strain.blurb}</p>}
            <dl className={s.stats}>
              <div>
                <dt>Incubation</dt>
                <dd>{totalIncubation(strain)}</dd>
              </div>
              <div>
                <dt>Spread</dt>
                <dd aria-label={strain.spreadLevel ? `${strain.spreadLevel} of 5` : 'not rated'}>{spreadBlocks(strain.spreadLevel)}</dd>
              </div>
              <div>
                <dt>Seed</dt>
                <dd>{strain.seed}</dd>
              </div>
            </dl>
            <div className={s.actions}>
              {links.map(([label, href]) => (
                <a key={label} href={href} className="fvc-cta" target="_blank" rel="noopener noreferrer">
                  {label}
                </a>
              ))}
              {queue.length > 0 && <PlayStrainButton queue={queue} label={strain.id} />}
              <ShareButton title={`${strain.id}, FVC RECORDS`} className="fvc-cta" />
            </div>
          </div>
        </section>

        <section className={`fvc-grid2 fvc-rule-b`} aria-label="Specimen details">
          <div className={`fvc-col-l ${s.cell}`} style={{ borderRight: 'var(--fvc-rule)' }}>
            <h2 className={s.h2}>Specimen label</h2>
            <SpecimenLabel strain={strain} />
          </div>
          <div className={s.cell}>
            <h2 className={s.h2}>Tracklist</h2>
            <table className="fvc-table">
              <caption className="sr-only">Tracklist of {strain.id}</caption>
              <thead>
                <tr>
                  <th scope="col">No.</th>
                  <th scope="col">Title</th>
                  {rated && <th scope="col">Spread</th>}
                  <th scope="col" style={{ textAlign: 'right' }}>
                    Incubation
                  </th>
                </tr>
              </thead>
              <Side name="A" label={strain.sides?.A} tracks={strain.sideA} queue={queue} rated={rated} />
              <Side name="B" label={strain.sides?.B} tracks={strain.sideB} queue={queue} rated={rated} />
            </table>
          </div>
        </section>

        {strain.vinyl && strain.formats.some((f) => f.endsWith('vinyl')) && (
          <section className={s.vinyl} aria-labelledby="pp-h">
            <div className="fvc-section-label">
              <h2 id="pp-h" style={{ font: 'inherit', margin: 0 }}>
                Pressing Plant, pressing Nº {strain.vinyl.seed}
              </h2>
              <span>
                {strain.vinyl.base} base, {strain.vinyl.palette} splat
              </span>
            </div>
            <VinylRecord seed={strain.vinyl.seed} base={strain.vinyl.base} pal={strain.vinyl.palette} labelSeed={strain.seed + 3} catalog={strain.id} size={560} />
          </section>
        )}

        {related.length > 0 && (
          <section aria-labelledby="rel-h">
            <h2 id="rel-h" className={s.relH}>
              Also spreading
            </h2>
            <div className="fvc-grid2 fvc-rule-b">
              {related.map((x, i) => (
                <StrainCard key={x.id} strain={x} className={i === 0 ? 'fvc-col-l' : undefined} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer spot={strain.spot === '#0B0B0B' ? undefined : strain.spot} />
    </>
  );
}
