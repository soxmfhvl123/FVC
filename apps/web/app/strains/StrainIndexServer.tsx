import { StrainCard } from '@/components/fvc/StrainCard';
import type { Strain } from '@/lib/content';
import { StrainFilters } from './StrainFilters';

export function StrainIndex({ strains }: { strains: Strain[] }) {
  const cards = Object.fromEntries(strains.map((x) => [x.id, <StrainCard key={x.id} strain={x} headingLevel={2} />]));
  return <StrainFilters strains={strains} cards={cards} />;
}
