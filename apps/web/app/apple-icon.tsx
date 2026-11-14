import { color } from '@fvc/engine';
import { ImageResponse } from 'next/og';
import { germDataUri } from '@/lib/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Logo board E: app icon — germ on ink. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: color.ink }}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={germDataUri(41, color.spot, { N: 70, eyes: 'cyclops', dust: 0.002 }, color.paper)} width={180} height={180} />
      </div>
    ),
    size,
  );
}
