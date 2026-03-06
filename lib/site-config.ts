const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const vercelHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
  process.env.VERCEL_URL?.trim();
const inferredSiteUrl = vercelHost
  ? `https://${vercelHost.replace(/^https?:\/\//, '')}`
  : 'http://localhost:3000';

export const siteConfig = {
  name: 'Isaiah Francois',
  title: 'Senior Full Stack Engineer',
  siteUrl: configuredSiteUrl || inferredSiteUrl,
  email: 'francoiscoding@yahoo.com',
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '',
  linkedinUrl: 'https://www.linkedin.com/in/francoiscoding/',
  twitterUrl: 'https://x.com/FrancoisCoding',
  calendlyUrl: 'https://calendly.com/francoiscoding',
  financeFlowUrl: 'https://www.financeflow.dev',
  githubUrl: 'https://github.com/FrancoisCoding',
};
