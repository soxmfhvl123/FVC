import { color } from '@fvc/engine';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/fvc/Footer';
import { Poster } from '@/components/fvc/Poster';
import { TopBar } from '@/components/fvc/TopBar';
import { getOutbreak, getOutbreaks, getStrain } from '@/lib/content';
import { isolatedLabel, ph } from '@/lib/format';
import s from '../outbreaks.module.css';

export function generateStaticParams() {
  const ids = getOutbreaks().map((o) => ({ id: o.id }));
  // Static export needs at least one path; with nothing scheduled it renders the 404 page.
  return ids.length ? ids : [{ id: 'none' }];
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const o = getOutbreak((await params).id);
  return o ? { title: `${o.title} ${o.id}`, description: `${o.title} — ${o.city}, doors ${o.doors}. Entry by word of mouth.` } : {};
}

export default async function OutbreakPage({ params }: { params: Promise<{ id: string }> }) {
  const o = getOutbreak((await params).id);
  if (!o) notFound();
  const strain = getStrain(o.strain);
  const spot = strain && strain.spot !== color.ink ? strain.spot : color.spot;
  return (
    <>
      <TopBar current="/outbreaks" />
      <main id="main">
        <section className={s.poster}>
          <div className={s.posterArt}>
            <Poster outbreak={o} strain={strain} spot={spot} />
          </div>
          <div className={s.posterInfo}>
            <div className="fvc-section-label">
              <span>{o.id}</span>
              <span>{strain ? `Strain ${strain.id}` : ''}</span>
            </div>
            <h1 style={{ margin: 0, fontSize: 'clamp(54px, 6vw, 96px)', fontWeight: 500, letterSpacing: '-0.05em', lineHeight: 0.9 }}>
              {o.title}
            </h1>
            <table className="fvc-table">
              <tbody>
                <tr>
                  <th scope="row">Date</th>
                  <td>{o.date ? isolatedLabel(o.date) : '[Date]'}</td>
                </tr>
                <tr>
                  <th scope="row">Doors</th>
                  <td>{o.doors}</td>
                </tr>
                <tr>
                  <th scope="row">Venue</th>
                  <td>
                    {ph(o.venue, 'Venue')}, {o.city}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Lineup</th>
                  <td>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {o.lineup.map((a, i) => (
                        <li key={i}>
                          <span className="fvc-bar-ui" style={{ background: color.ink, color: color.white, fontSize: 18 }}>
                            {ph(a, 'Artist').toUpperCase()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
            {o.ticketUrl ? (
              <a href={o.ticketUrl} className="fvc-submit" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
                Get tickets
              </a>
            ) : (
              <p className="fvc-note" style={{ margin: 0 }}>
                Tickets: by word of mouth.
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer spot={spot} />
    </>
  );
}
