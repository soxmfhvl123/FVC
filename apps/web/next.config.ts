import path from 'node:path';
import type { NextConfig } from 'next';

const root = path.join(import.meta.dirname, '../..');

const nextConfig: NextConfig = {
  // Static export: fvc.ai.kr is served by GitHub Pages (see .github/workflows/pages.yml).
  output: 'export',
  // Pages as folder/index.html: GitHub Pages prefers a folder over a same-named .html file.
  trailingSlash: true,
  transpilePackages: ['@fvc/engine'],
  // content/*.json and packages/ live at the repo root, outside this app.
  outputFileTracingRoot: root,
  turbopack: { root },
};

export default nextConfig;
