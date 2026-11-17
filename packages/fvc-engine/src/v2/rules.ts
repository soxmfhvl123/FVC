/**
 * Brand guardrails for engine v2. The engine enforces these itself; users cannot break them.
 *  1. At most two inks (black + one spot). Plain pattern = one ink.
 *  2. No mouth, blush or tears — feeling lives only in the eyes (there is no mouth layer at all).
 *  3. No crown of spikes, no X eyes, no bloodshot eyes (no such moods exist; see CROWN_GUARD).
 *  4. Eyes always sit inside the body mask.
 *  5. Always on the grid (every layer is rasterised to cells).
 */

/** Stroke surfaces must vary length and bend, so hairs never read as an even ring of spikes. */
export const CROWN_GUARD = { minLengthJitter: 0.35, minBend: 1.5 } as const;

/** Moods that will never be added. */
export const FORBIDDEN_MOODS = ['X eyes', 'Tears', 'Bloodshot'] as const;

/** Effective ink count for a pattern + ink choice. */
export const inkCount = (pattern: number, two: boolean) => (pattern === 6 ? 1 : two ? 2 : 1);

export interface Audited {
  ink: string;
  spot: string;
  eyes: { cx: number; cy: number; r: number }[];
  /** body field in body units (negative inside) */
  field: (x: number, y: number) => number;
  inks: number;
}

/** List rule breaks in a generated germ (empty = clean). Used by tests. */
export function audit(g: Audited): string[] {
  const out: string[] = [];
  if (g.inks < 2 && g.spot) out.push('spot ink used on a one-ink germ');
  for (const e of g.eyes) if (g.field(e.cx, e.cy) > -(e.r + 0.05)) out.push(`eye at ${e.cx.toFixed(2)},${e.cy.toFixed(2)} leaves the body`);
  return out;
}
