import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only admin client. Uses the service role key to bypass RLS.
 * NEVER import this in client components or expose SUPABASE_SERVICE_ROLE_KEY.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
