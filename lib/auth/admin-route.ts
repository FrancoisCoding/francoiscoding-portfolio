import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

import { isAdminAllowlisted } from '@/lib/auth/admin';
import { getSupabasePublicKeys } from '@/lib/supabase/keys';

export interface IAdminRouteSession {
  userEmail: string;
}

export async function requireAdminApiSession(request: NextRequest): Promise<{
  session: IAdminRouteSession | null;
  response: NextResponse | null;
}> {
  const authorizationHeader = request.headers.get('authorization');
  const token = authorizationHeader?.startsWith('Bearer ')
    ? authorizationHeader.slice(7)
    : '';

  if (!token) {
    return {
      session: null,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  const { supabaseUrl, supabaseAnonKey } = getSupabasePublicKeys();
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return {
      session: null,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  if (!isAdminAllowlisted(user.email)) {
    return {
      session: null,
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  return {
    session: { userEmail: user.email ?? 'unknown' },
    response: null,
  };
}
