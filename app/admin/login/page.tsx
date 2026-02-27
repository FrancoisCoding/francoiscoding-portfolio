import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { AdminLoginForm } from '@/components/admin/admin-login-form';
import { isAdminAllowlisted } from '@/lib/auth/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server-client';

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Secure admin sign in for private job-ops workflows.',
};

export default async function AdminLoginPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && isAdminAllowlisted(user.email)) {
    redirect('/admin');
  }

  return <AdminLoginForm />;
}
