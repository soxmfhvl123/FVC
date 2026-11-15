import { color } from '@fvc/engine';
import { ConnwaxStack } from '@/components/home/ConnwaxStack';
import { Dictionary } from '@/components/home/Dictionary';
import { Hero } from '@/components/home/Hero';
import { Manifesto } from '@/components/home/Manifesto';
import { MiniLab } from '@/components/home/MiniLab';
import { BannerSeries } from '@/components/fvc/Banners';
import { Footer } from '@/components/fvc/Footer';
import { SpreadMeter } from '@/components/fvc/SpreadMeter';
import { SpecimenLabel } from '@/components/fvc/SpecimenLabel';
import { StrainCard } from '@/components/fvc/StrainCard';
import { getLatestStrain, getOutbreaks, getStrains, site } from '@/lib/content';

export default function Home() {
  const latest = getLatestStrain();
  const strains = getStrains();
  const outbreak = getOutbreaks().find((o) => o.strain === latest.id);
  const pair = (a: number) => strains.slice(a, a + 2);
  // One spot ink per piece: the page takes the latest strain's spot (coral by default).
  // An ink-only strain would turn every spot plate black; fall back to the house coral.
  const spot = latest.spot === color.ink ? color.spot : latest.spot;

  return (
    <>
      <Hero strain={latest} outbreak={outbreak} spot={spot} />
      <main id="main">
        <ConnwaxStack strain={latest} />

        {pair(0).length > 0 && (
          <section className="fvc-grid2 fvc-rule-b" aria-label="Strains">
            {pair(0).map((s, i) => (
              <StrainCard key={s.id} strain={s} className={i === 0 ? 'fvc-col-l' : undefined} />
            ))}
            {/* Only one strain so far: fill the second column with its specimen label. */}
            {pair(0).length === 1 && (
              <div style={{ padding: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: 560 }}>
                  <SpecimenLabel strain={pair(0)[0]} />
                </div>
              </div>
            )}
          </section>
        )}

        <Manifesto spot={spot} />
        <MiniLab spot={spot} />
        <SpreadMeter strainId={latest.id} initial={latest.spreadLevel ?? 4} spot={spot} />

        {pair(2).length > 0 && (
          <section className="fvc-grid2 fvc-rule-b" aria-label="More strains">
            {pair(2).map((s, i) => (
              <StrainCard key={s.id} strain={s} className={i === 0 ? 'fvc-col-l' : undefined} />
            ))}
          </section>
        )}

        <BannerSeries ids={['b1', 'b2', 'b6']} />
        <Dictionary vocabulary={site.vocabulary} spot={spot} />
      </main>
      <Footer spot={spot} />
    </>
  );
}
