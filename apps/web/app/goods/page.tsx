import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Footer } from '@/components/fvc/Footer';
import { PatternArt, SlipmatArt, StickersArt } from '@/components/fvc/GoodsArt';
import { TopBar } from '@/components/fvc/TopBar';
import { getGoods } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Quarantine Goods',
  description: 'FVC goods: colony totes, splatter slipmats, sticker sheets.',
};

/** graphic key in goods.json → Kit artwork. */
const ART: Record<string, ReactNode> = {
  'pattern/colony-repeat': <PatternArt />,
  'press/vinyl seed 12': <SlipmatArt seed={12} />,
  'kit/07-stickers': <StickersArt />,
};

export default function GoodsPage() {
  const goods = getGoods();
  return (
    <>
      <TopBar current="/goods" />
      <main id="main">
        <div className="fvc-pagehead">
          <div className="fvc-section-label">
            <span>{goods.length} items ▮ sold through an external store</span>
            <span>Handle with care</span>
          </div>
          <h1>
            Quarantine <span className="fvc-goth" style={{ letterSpacing: 0 }}>goods</span>
          </h1>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {goods.map((g) => (
            <article key={g.id} className="fvc-card" style={{ borderRight: 'var(--fvc-rule)', borderBottom: 'var(--fvc-rule)' }}>
              <div className="fvc-card-head">
                <h2 className="fvc-card-title" style={{ fontSize: 34 }}>
                  {g.name}
                </h2>
                <span className="fvc-mono" style={{ fontSize: 12 }}>
                  {g.id}
                </span>
              </div>
              {ART[g.graphic] ?? null}
              <div className="fvc-card-foot">
                <span className="fvc-mono" style={{ fontSize: 12 }}>
                  {g.price ?? '[Price]'}
                </span>
                {g.url ? (
                  <a href={g.url} className="fvc-cta fvc-inv" target="_blank" rel="noopener noreferrer">
                    Buy at store ↗
                  </a>
                ) : (
                  <span className="fvc-cta" aria-disabled="true" style={{ opacity: 0.75 }}>
                    Store link soon
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
