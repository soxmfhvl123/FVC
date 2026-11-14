import { color } from '@fvc/engine';
import { ImageResponse } from 'next/og';
import { archivoWide, germDataUri } from '@/lib/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'FVC RECORDS — Fat Virus Carrier. Highly Contagious.';

/** Site card: grey ground, the house germ, the dish bar with wide FVC. */
export default async function Image() {
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
