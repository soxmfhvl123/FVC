import { GOOGLE_FONTS_URL } from '@fvc/engine';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '../../../design/tokens/tokens.css';
import './globals.css';
import { FvcDefs } from '@/components/fvc/Marks';
import { PlayerBar } from '@/components/player/PlayerBar';
import { PlayerProvider } from '@/components/player/PlayerProvider';
import { defaultQueue, site } from '@/lib/content';

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: { default: `FVC RECORDS — ${site.tagline.main}`, template: '%s — FVC RECORDS' },
  description: `${site.name}, ${site.city}. ${site.tagline.main} Fat sound spreads. Listen once. Carry forever.`,
  openGraph: { siteName: 'FVC RECORDS', locale: 'en', type: 'website', images: [{ url: '/og/site.png', width: 1200, height: 630 }] },
  icons: { apple: '/icons/apple-touch-icon.png' },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = { themeColor: '#D4D3CF' };

/*
 * Fonts load from the Google Fonts stylesheet (not next/font) on purpose: the engine rasterises
 * letters with `900 300px Archivo` and draws <text font-family="Grenze Gotisch">, so the real
 * family names must exist. next/font renames families, which would break the mutating letters.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={GOOGLE_FONTS_URL} />
      </head>
      <body>
        <a href="#main" className="fvc-skip">
          Skip to content
        </a>
        <FvcDefs />
        {/* The player lives here so page navigation never stops the music. */}
        <PlayerProvider initialQueue={defaultQueue()}>
          {children}
          <PlayerBar />
        </PlayerProvider>
      </body>
    </html>
  );
}
