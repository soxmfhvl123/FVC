import { color } from '@fvc/engine';
import { ImageResponse } from 'next/og';
import { getStrain, getStrains } from '@/lib/content';
import { archivoWide, germDataUri } from '@/lib/og';

/*
 * Social cards as real .png files (/og/site.png, /og/FVC-007.png). Static export writes
 * metadata image routes without an extension, which GitHub Pages serves with the wrong type.
 */
export const dynamic = 'force-static';
export const dynamicParams = false;

const size = { width: 1200, height: 630 };

export function generateStaticParams() {
  return [{ file: 'site.png' }, ...getStrains().map((s) => ({ file: `${s.id}.png` }))];
}

async function siteCard() {
  const font = await archivoWide('FVCFAT VIRUS CARRIER RECORDSHIGHLY CONTAGIOUS.fvc.ai.kr');
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: color.grey, color: color.ink, fontFamily: font ? 'Archivo' : undefined }}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={germDataUri(7, color.spot, { N: 120, lumps: 5, hair: 60 })} width={700} height={700} style={{ position: 'absolute', right: -40, top: -40 }} />
        <div style={{ position: 'absolute', left: 48, top: 40, display: 'flex', background: color.ink, color: color.grey, fontSize: 22, letterSpacing: 8, padding: '4px 14px' }}>FAT VIRUS CARRIER RECORDS</div>
        <div style={{ position: 'absolute', left: 48, bottom: 150, display: 'flex', background: color.ink, color: color.grey, fontSize: 190, letterSpacing: -10, lineHeight: 1, padding: '0 24px' }}>FVC</div>
        <div style={{ position: 'absolute', left: 48, bottom: 56, display: 'flex', fontSize: 40 }}>HIGHLY CONTAGIOUS.</div>
        <div style={{ position: 'absolute', right: 48, bottom: 56, display: 'flex', fontSize: 24 }}>fvc.ai.kr</div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: 'Archivo', data: font, weight: 900, style: 'normal' }] : undefined },
  );
}

/** Grey ground + the strain's germ + catalog number. */
async function strainCard(id: string) {
  const strain = getStrain(id)!;
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

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const id = (await params).file.replace(/\.png$/, '');
  return id === 'site' ? siteCard() : strainCard(id);
}
