'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { companyExperience } from '@/lib/company-experience';

const companyAccents = [
  'from-[#0f172a] to-[#334155]',
  'from-[#0f766e] to-[#0ea5e9]',
  'from-[#1e293b] to-[#0891b2]',
];

export function CompaniesSection() {
  const shouldReduceMotion = useReducedMotion();
  const startValues = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 0, y: 18 };
  const endValues = { opacity: 1, y: 0 };

  return (
    <section
      id="companies"
      aria-labelledby="companies-heading"
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2
          id="companies-heading"
          className="font-display text-3xl font-semibold text-slate-950 dark:text-white"
        >
          Companies
        </h2>
        <p className="max-w-2xl text-slate-600 dark:text-slate-300">
          Cross-sector delivery experience spanning media, defense, and
          immersive technology.
        </p>
      </div>
      <div className="grid gap-4">
        {companyExperience.map((item, index) => (
          <motion.div
            key={item.company}
            initial={startValues}
            whileInView={endValues}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              delay: shouldReduceMotion ? 0 : index * 0.08,
              duration: 0.4,
            }}
          >
            <Card className="overflow-hidden">
              <div
                className={`h-1.5 bg-gradient-to-r ${companyAccents[index % companyAccents.length]}`}
              />
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl">{item.company}</CardTitle>
                <p className="text-sm font-semibold text-[var(--brand)]">
                  {item.roleTitle}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {item.timeframe}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
