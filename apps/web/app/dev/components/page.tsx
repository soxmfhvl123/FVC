import { color } from '@fvc/engine';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { BannerSeries } from '@/components/fvc/Banners';
import { Clock } from '@/components/fvc/Clock';
import { Cover } from '@/components/fvc/Cover';
import { Germ } from '@/components/fvc/Germ';
import { HeroGerm } from '@/components/fvc/HeroGerm';
import { LiveWordmark } from '@/components/fvc/LiveWordmark';
import { Barcode, BitNoiseOval, Crosshair, DishLogo, Grain, SpecimenCode, Zigzag } from '@/components/fvc/Marks';
import { NavTable } from '@/components/fvc/NavTable';
import { Poster } from '@/components/fvc/Poster';
import { SpecimenLabel } from '@/components/fvc/SpecimenLabel';
import { SpreadMeter } from '@/components/fvc/SpreadMeter';
import { StrainCard } from '@/components/fvc/StrainCard';
import { Ticker } from '@/components/fvc/Ticker';
import { Bar, CtaButton, Pill } from '@/components/fvc/Ui';
import { getLatestStrain, getOutbreaks, getStrains } from '@/lib/content';

export const metadata: Metadata = { title: 'Components', robots: { index: false, follow: false } };

function Box({ title, children, bg }: { title: string; children: ReactNode; bg?: string }) {
  return (
    <section style={{ borderBottom: 'var(--fvc-rule)', padding: 18, background: bg }}>
      <h2 className="fvc-mono fvc-upper" style={{ fontSize: 12, fontWeight: 400, margin: '0 0 12px' }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Component sheet for side-by-side checks against the canvas. Not linked anywhere; 404 in production. */
export default function DevComponents() {
  if (process.env.NODE_ENV === 'production' && process.env.FVC_DEV_PAGES !== 'true') notFound();
  const latest = getLatestStrain();
  const strains = getStrains();
  const outbreak = getOutbreaks()[0];
  return (
    <main id="main">
      <Box title="Germ ▮ seeds 7 / 23 / 41 (one ink) / 88 (inverted)">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Germ seed={7} width={200} height={200} />
          <Germ seed={23} N={90} width={200} height={200} />
          <Germ seed={41} two={false} eyes="cyclops" width={200} height={200} />
          <div style={{ background: color.ink }}>
            <Germ seed={88} spot={color.acid} ink={color.paper} width={200} height={200} />
          </div>
        </div>
      </Box>
      <Box title="HeroGerm ▮ pointer eyes" bg={color.grey}>
        <header style={{ position: 'relative', height: 420 }}>
          <HeroGerm seed={7} spot={color.spot} style={{ width: 400, position: 'absolute', left: 0, top: 0 }} />
        </header>
      </Box>
      <Box title="LiveWordmark ▮ 900 ms">
        <LiveWordmark letterStyle={{ width: 160, height: 'auto' }} />
      </Box>
      <Box title="Marks">
        <div style={{ position: 'relative', display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap', padding: 12 }}>
          <BitNoiseOval id="dev-ov" w={160} h={60} />
          <Crosshair />
          <Barcode seed={9} />
          <SpecimenCode seed={7} />
          <Zigzag />
          <DishLogo />
          <Clock /> <Clock format="full" />
          <Grain opacity={0.2} />
        </div>
      </Box>
      <Box title="Bar ▮ Pill ▮ CtaButton">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <Bar spaced>FAT VIRUS CARRIER RECORDS</Bar>
          <Pill fill={color.white}>Low-End</Pill>
          <CtaButton href="/strains">Catch it ↗</CtaButton>
        </div>
      </Box>
      <Box title="Cover ▮ golova / creatura / glitch / connwax">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          {strains.slice(0, 4).map((s) => (
            <Cover key={s.id} strain={s} />
          ))}
        </div>
      </Box>
      <Box title="StrainCard ▮ SpecimenLabel">
        <div className="fvc-grid2">
          <StrainCard strain={latest} />
          <div style={{ maxWidth: 480 }}>
            <SpecimenLabel strain={latest} />
          </div>
        </div>
      </Box>
      {outbreak && (
        <Box title="Poster ▮ golova / creatura / noise" bg="#1A1A1A">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 18 }}>
            {(['golova', 'creatura', 'noise'] as const).map((p) => (
              <Poster key={p} outbreak={{ ...outbreak, posterStyle: p }} strain={latest} />
            ))}
          </div>
        </Box>
      )}
      <Ticker label="Ticker" text="FVC-007 ▮ [ARTIST] ▮ HIGHLY CONTAGIOUS ▮" />
      <SpreadMeter strainId={latest.id} />
      <BannerSeries ids={['b1', 'b2', 'b3', 'b4', 'b5', 'b6']} freeze title="Banner series ▮ all six" />
      <NavTable />
    </main>
  );
}
