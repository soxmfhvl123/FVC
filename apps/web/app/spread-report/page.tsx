import type { Metadata } from 'next';
import { Footer } from '@/components/fvc/Footer';
import { SpreadForm } from '@/components/fvc/Forms';
import { TopBar } from '@/components/fvc/TopBar';

export const metadata: Metadata = {
  title: 'Spread Report',
  description: 'The FVC newsletter: new strains, Outbreak Nights and goods, before anyone else catches them.',
};

export default function SpreadReportPage() {
  return (
    <>
      <TopBar />
      <main id="main" className="fvc-pagehead" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <div className="fvc-section-label">
          <span>Newsletter</span>
          <span>No known cure</span>
        </div>
        <h1>
          Spread <span className="fvc-serif">Report</span>
        </h1>
        <p className="fvc-prose">New strains, Outbreak Nights and Quarantine Goods — in your inbox before anyone else catches them.</p>
        <SpreadForm />
      </main>
      <Footer />
    </>
  );
}
