import type { Metadata } from 'next';
import { Footer } from '@/components/fvc/Footer';
import { TopBar } from '@/components/fvc/TopBar';
import { getStrainsNewest } from '@/lib/content';
import { StrainIndex } from './StrainIndexServer';

export const metadata: Metadata = {
  title: 'Strains',
  description: 'Every FVC release is a strain: one seed, one germ, one catalog number.',
};

export default function StrainsPage() {
  const strains = getStrainsNewest();
  return (
    <>
      <TopBar current="/strains" />
      <main id="main">
        <div className="fvc-pagehead">
          <div className="fvc-section-label">
            <span>Strain index</span>
            <span>{strains.length} isolated</span>
          </div>
          <h1>
            Strain<span className="fvc-goth" style={{ letterSpacing: 0 }}>s</span> <span className="fvc-serif">on file</span>
          </h1>
        </div>
        <StrainIndex strains={strains} />
      </main>
      <Footer />
    </>
  );
}
