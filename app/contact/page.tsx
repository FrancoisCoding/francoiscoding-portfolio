import { siteConfig } from '@/lib/site-config';

export default function ContactPage() {
  return (
    <section className="py-16">
      <h1 className="font-display text-4xl font-semibold text-slate-950 dark:text-white">
        Contact
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
        Reach out by email or phone while the full contact workflow is being
        completed.
      </p>
      <div className="mt-6 space-y-2 text-slate-700 dark:text-slate-200">
        <p>
          Email:{' '}
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-[var(--brand)] underline"
          >
            {siteConfig.email}
          </a>
        </p>
        <p>
          Phone:{' '}
          <a
            href={`tel:${siteConfig.phone.replace(/[^\d+]/g, '')}`}
            className="text-[var(--brand)] underline"
          >
            {siteConfig.phone}
          </a>
        </p>
      </div>
    </section>
  );
}
