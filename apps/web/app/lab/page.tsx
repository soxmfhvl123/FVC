import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Footer } from '@/components/fvc/Footer';
import { TopBar } from '@/components/fvc/TopBar';
import { LabTool } from './LabTool';
import { TOOLS } from './tools';

export const metadata: Metadata = {
  title: 'FVC Lab',
  description: 'Four tools. FVC rules locked in, everything else random. Grow germs, press splatter vinyl, culture colonies, mutate your name.',
};

export default function LabPage() {
  return (
    <>
      <TopBar current="/lab" />
      <main id="main">
        <div className="fvc-pagehead">
          <div className="fvc-section-label">
            <span>06 FVC Lab</span>
            <span>Four tools. FVC rules locked in, everything else random. Press the buttons.</span>
          </div>
          <h1>
            Make your own <span className="fvc-goth" style={{ letterSpacing: 0 }}>strains</span>
          </h1>
        </div>
        <Suspense>
          <div className="lab-grid">
            {TOOLS.map((t) => (
              <div key={t.id}>
                <LabTool id={t.id} href={`/lab/${t.id}`} />
              </div>
            ))}
          </div>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
