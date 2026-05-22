import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

/**
 * Returns a singleton Supabase admin client (service role).
 *
 * Call once at service startup:
 *   import { getSupabaseClient } from '@chitchat/db';
 *   const supabase = getSupabaseClient();
 *
 * The service role key bypasses Row Level Security — never expose it to the
 * frontend. All access control must be enforced at the API layer.
 */
export function getSupabaseClient(): SupabaseClient {
  if (_client) return _client;

  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_SERVICE_ROLE_KEY'];

  if (!url || !key) {
    throw new Error(
      '[db/supabase] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars',
    );
  }

  _client = createClient(url, key, {
    auth: {
      // Service role client — no user sessions
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  return _client;
}

/** Alias for convenience — same singleton */
export const supabase = {
  get client(): SupabaseClient {
    return getSupabaseClient();
  },
};
