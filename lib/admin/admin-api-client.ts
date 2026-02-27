import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';

async function getAuthHeaders() {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error('Missing admin session token. Please sign in again.');
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
  };
}

export async function adminFetchJson<TResponse>(
  input: RequestInfo | URL,
  init: RequestInit = {},
) {
  const authHeaders = await getAuthHeaders();
  const response = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
      ...authHeaders,
    },
  });

  const payload = (await response.json()) as TResponse & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? 'Admin API request failed.');
  }

  return payload;
}

export async function adminFetchText(
  input: RequestInfo | URL,
  init: RequestInit = {},
) {
  const authHeaders = await getAuthHeaders();
  const response = await fetch(input, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      ...authHeaders,
    },
  });

  if (!response.ok) {
    throw new Error('Admin file request failed.');
  }

  return response.text();
}
