import type { MetadataRoute } from 'next';
import { getOutbreaks, getStrains, site } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${site.domain}`;
  const pages = ['', '/strains', '/lab', '/lab/germinator', '/lab/pressing-plant', '/lab/colony', '/lab/mutator', '/outbreaks', '/goods', '/about', '/submit', '/spread-report'];
  return [...pages.map((p) => ({ url: `${base}${p}` })), ...getStrains().map((s) => ({ url: `${base}/strains/${s.id}` })), ...getOutbreaks().map((o) => ({ url: `${base}/outbreaks/${o.id}` }))];
}
