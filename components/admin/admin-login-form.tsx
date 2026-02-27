'use client';

import { AlertCircle, LockKeyhole, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const initialError = searchParams.get('error');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setIsLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setFormError(signInError.message);
        return;
      }

      router.push('/admin');
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-12 w-full max-w-md rounded-2xl border border-black/10 bg-white/80 p-6 shadow-xl shadow-black/5 dark:border-white/10 dark:bg-slate-950/80"
    >
      <div className="space-y-2">
        <p className="text-sm font-semibold tracking-[0.14em] text-[var(--brand)] uppercase">
          Private Admin
        </p>
        <h1 className="font-display text-3xl font-semibold text-slate-950 dark:text-white">
          Sign in
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Access is restricted to allowlisted admin accounts.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="admin-email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="admin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            placeholder="admin@company.com"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="admin-password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            placeholder="••••••••"
          />
        </div>

        {formError || initialError ? (
          <p className="inline-flex items-center gap-2 text-sm text-rose-600 dark:text-rose-300">
            <AlertCircle className="size-4" />
            {formError || 'You are not authorized to access admin routes.'}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <LockKeyhole className="size-4" />
              Sign in
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
