import { color, germ, type GermOptions } from '@fvc/engine';

/** A germ as an <img>-ready SVG data URI (Satori renders <img> SVGs reliably). */
export function germDataUri(seed: number, spot: string, o: GermOptions = {}, ink: string = color.ink) {
  const g = germ(seed, o);
  const two = o.two ?? true;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">${two ? `<path d="${g.spot}" fill="${spot}"/>` : ''}<path d="${g.ink}" fill="${ink}"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Archivo 900 wide as a TTF subset for Satori (which cannot read woff2 or variable axes).
 * Returns undefined when offline so the image still renders with the default font.
 */
export async function archivoWide(text: string): Promise<ArrayBuffer | undefined> {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@125,900&text=${encodeURIComponent(text)}`).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    if (!url) return undefined;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return undefined;
  }
}
