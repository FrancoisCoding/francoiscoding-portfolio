import type { MetadataRoute } from 'next';

import { siteConfig } from '@/lib/site-config';

const routes = [
  '',
  '/about',
  '/contact',
  '/experience',
  '/projects',
  '/projects/financeflow',
  '/resume',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteConfig.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));
}
