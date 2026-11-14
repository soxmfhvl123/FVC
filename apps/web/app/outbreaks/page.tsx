import type { Metadata } from 'next';
import Link from 'next/link';
import { BannerSeries } from '@/components/fvc/Banners';
import { Footer } from '@/components/fvc/Footer';
import { TopBar } from '@/components/fvc/TopBar';
import { getOutbreaks } from '@/lib/content';
import { isolatedLabel, ph } from '@/lib/format';
import s from './outbreaks.module.css';

export const metadata: Metadata = {
  title: 'Outbreak Nights',
  description: 'FVC release parties in Seoul. Entry by word of mouth.',
};

export default function OutbreaksPage() {
  const outbreaks = getOutbreaks();
  return (
    <>
      <TopBar current="/outbreaks" />
      <main id="main">
        <div className="fvc-pagehead">
          <div className="fvc-section-label">
            <span>Release parties ▮ {outbreaks.length} on file</span>
            <span>Entry by word of mouth</span>
          </div>
          <h1>
            Outbreak <span className="fvc-serif">Nights</span>
          </h1>
        </div>
        {outbreaks.length ? (
          <ul className={s.list}>
            {outbreaks.map((o) => (
              <li key={o.id}>
                <Link href={`/outbreaks/${o.id}`} className={`${s.row} fvc-inv`}>
                  <span className={s.date}>{o.date ? isolatedLabel(o.date) : '[Date]'}</span>
                  <span className={s.title}>
                    {o.title}
                    <span className="fvc-mono" style={{ fontSize: 12, display: 'block', marginTop: 6 }}>
                      {o.id} ▮ {ph(o.venue, 'Venue')}, {o.city} ▮ Doors {o.doors}
                    </span>
                  </span>
                  <span className={s.lineup}>
                    {o.lineup.map((a, i) => (
                      <span key={i} className="fvc-bar-ui">
                        {ph(a, 'Artist').toUpperCase()}
                      </span>
                    ))}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="fvc-prose" style={{ padding: 24 }}>
            No outbreaks scheduled. Subscribe to the Spread Report to hear first.
          </p>
        )}
        <BannerSeries ids={['b3', 'b4', 'b5']} title="Outbreak banners ▮ shuffle to remix" freeze />
      </main>
      <Footer />
    </>
  );
}
