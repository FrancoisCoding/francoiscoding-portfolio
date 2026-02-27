import Link from 'next/link';

import { AdminSignOutButton } from '@/components/admin/admin-signout-button';
import { cn } from '@/lib/utils';

interface IAdminShellProps {
  children: React.ReactNode;
  userEmail: string;
}

const adminNavItems = [
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/templates', label: 'Templates' },
  { href: '/admin/drafts', label: 'Drafts' },
  { href: '/admin/settings', label: 'Settings' },
];

export function AdminShell({ children, userEmail }: IAdminShellProps) {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-black/10 bg-white/80 shadow-xl shadow-black/5 dark:border-white/10 dark:bg-slate-950/80">
      <div className="grid min-h-[72vh] lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-black/10 p-5 lg:border-r lg:border-b-0 dark:border-white/10">
          <div className="space-y-1 pb-6">
            <p className="font-display text-lg font-semibold text-slate-950 dark:text-white">
              Job Ops CRM
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {userEmail}
            </p>
          </div>
          <nav aria-label="Admin navigation" className="space-y-2">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-black/5 dark:text-slate-200 dark:hover:bg-white/10',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex flex-col">
          <div className="flex min-h-16 items-center justify-end border-b border-black/10 px-5 dark:border-white/10">
            <AdminSignOutButton />
          </div>
          <div className="flex-1 p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
