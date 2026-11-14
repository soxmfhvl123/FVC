/** Design tokens — keep in sync with design/tokens/tokens.json and tokens.css. */
export const color = {
  paper: '#E8E7E3',
  grey: '#D4D3CF',
  greyDark: '#CFCECA',
  white: '#F7F7F5',
  ink: '#0B0B0B',
  spot: '#FF5B47', // FVC Coral — the house spot ink
  acid: '#A6FF00',
  magenta: '#FF2DB4',
  red: '#FF2A1A',
  cobalt: '#2B44FF',
  yellow: '#FFE800',
  orange: '#FF6C2F',
} as const;

/** Spot inks a strain may use (one per piece). */
export const SPOT_INKS = [color.spot, color.cobalt, color.acid, color.magenta] as const;

export const font = {
  info: "'Inter Tight', system-ui, sans-serif",
  display: "Archivo, sans-serif", // use font-stretch 62% (condensed) or 125% (wide), weight 900
  goth: "'Grenze Gotisch', serif",
  serif: "'Instrument Serif', serif", // italic only
  mono: "'DM Mono', monospace",
} as const;

export const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Inter+Tight:wght@400;500;600;800&family=DM+Mono:wght@400;500&family=Grenze+Gotisch:wght@400..900&family=Instrument+Serif:ital@0;1&display=swap';
