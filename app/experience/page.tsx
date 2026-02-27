import { Badge } from '@/components/ui/badge';
import { companyExperience } from '@/lib/company-experience';

export default function ExperiencePage() {
  return (
    <section className="py-16">
      <h1 className="font-display text-4xl font-semibold text-slate-950 dark:text-white">
        Experience
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
        Timeline overview with expandable details for enterprise and regulated
        product delivery.
      </p>
      <div className="mt-10 space-y-5">
        {companyExperience.map((item) => (
          <details
            key={item.company}
            className="group rounded-2xl border border-black/10 bg-white/70 p-5 shadow-sm dark:border-white/15 dark:bg-white/5"
          >
            <summary className="cursor-pointer list-none">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
                    {item.company}
                  </h2>
                  <p className="text-sm font-semibold text-[var(--brand)]">
                    {item.roleTitle}
                  </p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {item.timeframe}
                </p>
              </div>
            </summary>
            <div className="mt-4 space-y-4 border-t border-black/10 pt-4 dark:border-white/10">
              <ul className="space-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                {item.impacts.map((impact) => (
                  <li key={impact} className="flex gap-2">
                    <span
                      aria-hidden="true"
                      className="pt-1 text-[var(--brand)]"
                    >
                      •
                    </span>
                    <span>{impact}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {item.stack.map((tech) => (
                  <Badge key={`${item.company}-${tech}`}>{tech}</Badge>
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
