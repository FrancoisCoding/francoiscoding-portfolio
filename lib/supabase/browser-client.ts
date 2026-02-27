'use client';

import { createBrowserClient } from '@supabase/ssr';

import { getSupabasePublicKeys } from '@/lib/supabase/keys';

export function createSupabaseBrowserClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabasePublicKeys();
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
