import { color } from '@fvc/engine';
import { ImageResponse } from 'next/og';
import { getStrain, getStrains } from '@/lib/content';
import { archivoWide, germDataUri } from '@/lib/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'FVC strain: a bitmap germ on grey with its catalog number';

export function generateStaticParams() {
  return getStrains().map((x) => ({ id: x.id }));
}

/** Grey ground + the strain's germ + catalog number. Regenerated from the seed on every build. */
export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const strain = getStrain((await params).id)!;
  const spot = strain.spot === color.ink ? color.spot : strain.spot;
  const two = strain.spot !== color.ink;
  const label = 'FAT VIRUS CARRIER RECORDS';
  const font = await archivoWide(`${strain.id}${label}HIGHLY CONTAGIOUS.fvc.ai.kr`);
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: color.grey, color: color.ink, fontFamily: font ? 'Archivo' : undefined }}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={germDataUri(strain.seed, spot, { N: 120, eyes: strain.eyes, two })} width={720} height={720} style={{ position: 'absolute', right: -60, top: -50, transform: 'rotate(-9deg)' }} />
        <div style={{ position: 'absolute', left: 48, top: 40, display: 'flex', background: color.ink, color: color.grey, fontSize: 22, letterSpacing: 8, padding: '4px 14px' }}>{label}</div>
        <div style={{ position: 'absolute', left: 40, bottom: 120, display: 'flex', fontSize: 150, letterSpacing: -8, lineHeight: 1 }}>{strain.id}</div>
        <div style={{ position: 'absolute', left: 48, bottom: 52, display: 'flex', fontSize: 30 }}>HIGHLY CONTAGIOUS.</div>
        <div style={{ position: 'absolute', right: 48, bottom: 52, display: 'flex', fontSize: 24 }}>fvc.ai.kr</div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: 'Archivo', data: font, weight: 900, style: 'normal' }] : undefined },
  );
}
