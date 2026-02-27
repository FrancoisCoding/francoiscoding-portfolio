'use client';

import { Check, Copy, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/site-config';

export function ContactMethods() {
  const [copiedField, setCopiedField] = useState<'email' | 'phone' | null>(
    null,
  );

  const copyValue = async (label: 'email' | 'phone', value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(label);
      window.setTimeout(() => setCopiedField(null), 1800);
    } catch {
      setCopiedField(null);
    }
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-white/70 p-6 backdrop-blur-sm dark:border-white/15 dark:bg-white/5">
      <h2 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
        Direct Contact
      </h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Reach Isaiah directly by email or phone.
      </p>

      <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-black/10 bg-white/70 p-4 dark:border-white/15 dark:bg-white/5">
          <p className="text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase dark:text-slate-400">
            Email
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)]"
            >
              <Mail className="size-4" />
              {siteConfig.email}
            </a>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => copyValue('email', siteConfig.email)}
            >
              {copiedField === 'email' ? (
                <>
                  <Check className="size-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-white/70 p-4 dark:border-white/15 dark:bg-white/5">
          <p className="text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase dark:text-slate-400">
            Phone
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <a
              href={`tel:${siteConfig.phone.replace(/[^\d+]/g, '')}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)]"
            >
              <Phone className="size-4" />
              {siteConfig.phone}
            </a>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => copyValue('phone', siteConfig.phone)}
            >
              {copiedField === 'phone' ? (
                <>
                  <Check className="size-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
