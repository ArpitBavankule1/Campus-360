import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";

export { getRoleDashboardPath } from "./paths";

/**
 * Server-side helper to fetch the currently authenticated user.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Server-side helper to fetch the profile of the currently authenticated user.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return null;
  }

  return profile as unknown as Profile;
}
