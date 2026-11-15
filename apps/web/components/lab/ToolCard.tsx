import Link from 'next/link';
import './lab.css';
import type { CSSProperties, ReactNode } from 'react';
import { SpecimenCode, Zigzag } from '@/components/fvc/Marks';

/**
 * 1st Ave–style tool card: 240px spec sidebar (icon, zigzags, badge, name, ×3 detail,
 * description, specimen code) + output area + ink control bar.
 */
export function ToolCard({
  name,
  sidebarBg,
  sidebarFg = 'var(--fvc-ink)',
  iconBg,
  labFg,
  bg,
  fg = 'var(--fvc-ink)',
  icon,
  detail,
  detailBg,
  description,
  codeSeed,
  codeBg,
  codeLines,
  headLeft,
  headRight,
  output,
  controls,
  href,
  headingLevel = 2,
}: {
  name: string;
  sidebarBg: string;
  sidebarFg?: string;
  iconBg: string;
  labFg: string;
  bg: string;
  fg?: string;
  icon: ReactNode;
  detail: ReactNode;
  detailBg: string;
  description: string;
  codeSeed: number;
  codeBg?: string;
  codeLines: string[];
  headLeft: ReactNode;
  headRight: ReactNode;
  output: ReactNode;
  controls: ReactNode;
  /** When set (Lab hub), the tool name links to its own page. */
  href?: string;
  headingLevel?: 1 | 2;
}) {
  const H = headingLevel === 1 ? 'h1' : 'h2';
  const sideStyle: CSSProperties = { background: sidebarBg, color: sidebarFg };
  return (
    <div className="lab-card" style={{ background: bg }}>
      <aside className="lab-side" style={sideStyle} aria-label={`${name} spec`}>
        <div className="lab-icon" style={{ background: iconBg }}>
          {icon}
        </div>
        <Zigzag stroke={sidebarFg} />
        <div className="lab-badge">
          <span className="lab-badge-fvc" style={{ borderColor: sidebarFg }}>
            FVC
          </span>
          <span className="lab-badge-lab" style={{ background: sidebarFg, color: labFg }}>
            LAB
          </span>
          <span style={{ fontSize: 9, lineHeight: 1.2 }}>
            Fat Virus Carrier
            <br />
            Records — tools 2026
          </span>
        </div>
        <Zigzag stroke={sidebarFg} />
        <div>
          <H className="lab-name">{href ? <Link href={href}>{name}</Link> : name}</H>
          <div style={{ fontSize: 22, lineHeight: 1.1 }}>Web Tool</div>
        </div>
        <div className="lab-detail" style={{ background: detailBg, borderColor: sidebarFg }}>
          {detail}
          <span className="lab-detail-tag">×3 detail</span>
        </div>
        <p className="lab-desc">{description}</p>
        <Zigzag stroke={sidebarFg} />
        <div className="lab-code">
          <SpecimenCode seed={codeSeed} bg={codeBg} />
          <div style={{ fontSize: 9.5, lineHeight: 1.3 }}>
            {codeLines.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>
        </div>
      </aside>
      <section className="lab-main" aria-label={`${name} output and controls`}>
        <div className="lab-head" style={{ color: fg }}>
          <span>{headLeft}</span>
          <span>{headRight}</span>
        </div>
        <div className="lab-output">{output}</div>
        <div className="lab-controls">{controls}</div>
        {href && (
          <Link href={href} className="lab-open">
            Open {name}
          </Link>
        )}
      </section>
    </div>
  );
}

/** Segmented option buttons (dark when off, white when on). */
export function Options<V extends string | number>({ label, value, options, onPick }: { label: string; value: V; options: { v: V; label: string }[]; onPick: (v: V) => void }) {
  return (
    <div role="group" aria-label={label} className="lab-opts">
      <span className="lab-opt-label">{label}</span>
      {options.map((o) => (
        <button key={String(o.v)} type="button" className={`fvc-b ${o.v === value ? 'on' : ''}`} aria-pressed={o.v === value} onClick={() => onPick(o.v)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
