import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * Creates a Supabase Admin Client using the SERVICE_ROLE_KEY.
 *
 * CRITICAL SECURITY NOTICE:
 * This client bypasses Row Level Security (RLS) and has full database superadmin access.
 * It MUST NEVER be used or imported in client-side components.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error(
      "[SECURITY VIOLATION] createAdminClient() must only be called on the server."
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "[Supabase Admin] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables."
    );
  }

  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
