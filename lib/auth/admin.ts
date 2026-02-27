import { redirect } from 'next/navigation';

import { createSupabaseServerClient } from '@/lib/supabase/server-client';

function getAllowedAdminEmails() {
  return (process.env.ADMIN_ALLOWLIST_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminAllowlisted(email: string | undefined) {
  if (!email) {
    return false;
  }
  const allowedAdminEmails = getAllowedAdminEmails();
  return allowedAdminEmails.includes(email.toLowerCase());
}

export async function requireAdminUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  if (!isAdminAllowlisted(user.email)) {
    redirect('/admin/login?error=allowlist');
  }

  return user;
}
