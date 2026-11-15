import { color } from '@fvc/engine';
import { site } from '@/lib/content';
import { Clock } from './Clock';
import { germPaths } from './Germ';
import { NavTable } from './NavTable';

/** DishFooter: bit-noise ellipse + ink bar with wide FVC + germ on the rim, then NavTable and © line. */
export function Footer({ seed = 131, spot = color.spot }: { seed?: number; spot?: string }) {
  const g = germPaths(seed, { N: 90, lumps: 7 });
  return (
    <footer className="fvc-footer">
      <div className="fvc-footer-dish">
        <svg viewBox="0 0 1440 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <clipPath id="foot-oval">
              <ellipse cx="720" cy="330" rx="640" ry="250" />
            </clipPath>
          </defs>
          <rect x="80" y="80" width="1280" height="500" filter="url(#fvc-bitnoise)" clipPath="url(#foot-oval)" />
          <ellipse cx="720" cy="330" rx="640" ry="250" fill="none" stroke={color.ink} strokeWidth="6" />
          <rect x="300" y="236" width="840" height="190" fill={color.ink} />
          <text x="720" y="400" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="900" fontStretch="125%" fontSize="196" letterSpacing="-10" fill={color.grey}>
            FVC
          </text>
          <g transform="translate(1030 40) rotate(14 150 150)">
            <svg viewBox="0 0 300 300" width="300" height="300">
              <path d={g.spot} fill={spot} />
              <path d={g.ink} fill={color.ink} />
            </svg>
          </g>
          <path d="M60 60 V110 M35 85 H85 M1380 560 V610 M1355 585 H1405" stroke={color.ink} strokeWidth="2" />
        </svg>
        <div className="fvc-footer-corner" style={{ left: 24 }}>
          {site.name}
        </div>
        <div className="fvc-footer-corner" style={{ right: 24 }}>
          <Clock format="short" />
        </div>
      </div>
      <NavTable />
      <div className="fvc-footer-legal">
        <span>©2026 {site.name}</span>
        <span>
          {site.domain}, {site.city}
        </span>
      </div>
    </footer>
  );
}
