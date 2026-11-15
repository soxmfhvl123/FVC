import type { Metadata } from 'next';
import { Footer } from '@/components/fvc/Footer';
import { SubmissionForm } from '@/components/fvc/Forms';
import { Germ } from '@/components/fvc/Germ';
import { TopBar } from '@/components/fvc/TopBar';

export const metadata: Metadata = {
  title: 'Sample Submission',
  description: 'Send FVC a sample. If it catches, we’ll write back.',
};

export default function SubmitPage() {
  return (
    <>
      <TopBar />
      <main id="main" className="fvc-grid2 fvc-rule-b">
        <div className="fvc-col-l fvc-pagehead" style={{ borderRight: 'var(--fvc-rule)', borderBottom: 'none', background: 'var(--fvc-grey)' }}>
          <div className="fvc-section-label">
            <span>Demos</span>
            <span>Open</span>
          </div>
          <h1>
            Sample <span className="fvc-goth" style={{ letterSpacing: 0 }}>submission</span>
          </h1>
          <p className="fvc-prose" style={{ marginTop: 22 }}>
            Got something fat? Send us a link. We listen to everything that comes in, and we reply when a sample catches.
          </p>
          <Germ seed={41} N={96} two={false} eyes="cyclops" hair={70} style={{ width: 'min(360px, 70%)', height: 'auto', marginTop: 20 }} />
        </div>
        <div style={{ padding: '30px 24px 40px' }}>
          <SubmissionForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
