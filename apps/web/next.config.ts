import path from 'node:path';
import type { NextConfig } from 'next';

const root = path.join(import.meta.dirname, '../..');

const nextConfig: NextConfig = {
  transpilePackages: ['@fvc/engine'],
  // content/*.json and packages/ live at the repo root, outside this app.
  outputFileTracingRoot: root,
  turbopack: { root },
};

export default nextConfig;
