/** Fake binomial name from the genome ("Pingui-" = fat, in Latin). */
import type { Genome } from './genome.ts';

const GENUS = ['Pinguicoccus', 'Pinguidiplococcus', 'Pinguibacillus', 'Pinguistreptococcus', 'Pinguistaphylococcus', 'Pinguispira', 'Pinguivibrio', 'Pinguamoeba', 'Pinguigemmula'];
const SPECIES = ['caecus', 'cyclops', 'binoculus', 'triops', 'pentops', 'argus'];
/** Pattern → variety. Blotch is the type form (no variety). */
const VARIETY = [null, 'maculatus', 'striatus', 'nucleatus', 'umbratus', 'gravidus', 'pallidus'];

export function speciesName(g: Genome): string {
  const v = VARIETY[g.pattern];
  return `${GENUS[g.body]} ${SPECIES[g.eyes]}${v ? ` var. ${v}` : ''}`;
}
