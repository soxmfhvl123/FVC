import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Footer } from '@/components/fvc/Footer';
import { TopBar } from '@/components/fvc/TopBar';
import { LabTool } from '../LabTool';
import { TOOLS } from '../tools';

export function generateStaticParams() {
  return TOOLS.map((t) => ({ tool: t.id }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }): Promise<Metadata> {
  const { tool } = await params;
  const t = TOOLS.find((x) => x.id === tool);
  return t ? { title: `${t.name} — FVC Lab`, description: `${t.blurb} Every result has its own shareable link.` } : {};
}

export default async function ToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const t = TOOLS.find((x) => x.id === tool);
  if (!t) notFound();
  const others = TOOLS.filter((x) => x.id !== t.id);
  return (
    <>
      <TopBar current="/lab" />
      <main id="main">
        <div className="fvc-section-label" style={{ padding: '12px 18px', borderBottom: 'var(--fvc-rule)' }}>
          <Link href="/lab">← FVC Lab</Link>
          <span>The link in your address bar reproduces this exact result.</span>
        </div>
        <Suspense>
          <div style={{ borderBottom: 'var(--fvc-rule)' }}>
            <LabTool id={t.id} sync headingLevel={1} />
          </div>
        </Suspense>
        <nav aria-label="Other tools" className="fvc-grid2" style={{ borderBottom: 'var(--fvc-rule)' }}>
          {others.map((o, i) => (
            <Link key={o.id} href={`/lab/${o.id}`} className="fvc-navcell fvc-inv" style={{ borderRight: i % 2 === 0 ? 'var(--fvc-rule)' : undefined, fontSize: 22, fontWeight: 500 }}>
              {o.name} — <span className="fvc-serif">{o.blurb}</span>
            </Link>
          ))}
        </nav>
      </main>
      <Footer />
    </>
  );
}
