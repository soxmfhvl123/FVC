import type { ToolId } from '@/components/lab/Tools';

export const TOOLS: { id: ToolId; name: string; blurb: string }[] = [
  { id: 'germinator', name: 'Germinator', blurb: 'Grow a new Ttung-gyun from a single number.' },
  { id: 'pressing-plant', name: 'Pressing Plant', blurb: 'Press a splatter vinyl for any strain.' },
  { id: 'colony', name: 'Colony', blurb: 'Fill a germ silhouette with packed circles.' },
  { id: 'mutator', name: 'Mutator', blurb: 'Type anything; every letter catches a strain.' },
];
