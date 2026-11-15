import Link from 'next/link';
import { Footer } from '@/components/fvc/Footer';
import { Germ } from '@/components/fvc/Germ';
import { TopBar } from '@/components/fvc/TopBar';

export default function NotFound() {
  return (
    <>
      <TopBar />
      <main id="main" className="fvc-pagehead" style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', minHeight: '50vh' }}>
        <Germ seed={131} N={40} two={false} eyes="none" lumps={7} dust={0.01} style={{ width: 220, height: 220 }} />
        <div>
          <div className="fvc-section-label">
            <span>404, a dormant strain</span>
          </div>
          <h1>
            Nothing <span className="fvc-serif">here</span>
          </h1>
          <p className="fvc-prose">This strain never spread. Try the index instead.</p>
          <Link href="/strains" className="fvc-cta">
            Strain index
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
