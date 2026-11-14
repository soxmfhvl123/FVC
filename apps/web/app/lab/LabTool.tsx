'use client';

import { Colony, Germinator, Mutator, PressingPlant, type ToolId } from '@/components/lab/Tools';

const MAP = { germinator: Germinator, 'pressing-plant': PressingPlant, colony: Colony, mutator: Mutator };

/** Client switch so server pages can pick a tool by id. */
export function LabTool({ id, sync, href, headingLevel }: { id: ToolId; sync?: boolean; href?: string; headingLevel?: 1 | 2 }) {
  const Tool = MAP[id];
  return <Tool sync={sync} href={href} headingLevel={headingLevel} />;
}
