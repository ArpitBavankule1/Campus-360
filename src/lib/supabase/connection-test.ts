import { createClient } from "./client";

export interface SupabaseConnectionStatus {
  configured: boolean;
  isPlaceholder: boolean;
  connected: boolean;
  url: string | null;
  message: string;
  error?: string;
}

/**
 * Tests whether Supabase credentials are configured and reachable.
 */
export async function testSupabaseConnection(): Promise<SupabaseConnectionStatus> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || null;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null;

  if (!url || !anonKey) {
    return {
      configured: false,
      isPlaceholder: false,
      connected: false,
      url,
      message:
        "Supabase credentials missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
    };
  }

  const isPlaceholder =
    url.includes("placeholder") ||
    anonKey.includes("placeholder") ||
    url.includes("your-project-id");

  if (isPlaceholder) {
    return {
      configured: false,
      isPlaceholder: true,
      connected: false,
      url,
      message:
        "Placeholder credentials detected in .env.local. Update with your real Supabase project URL and anon key.",
    };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("colleges")
      .select("id", { count: "exact", head: true });

    if (error) {
      return {
        configured: true,
        isPlaceholder: false,
        connected: false,
        url,
        message: `Supabase responded with an error: ${error.message}`,
        error: error.message,
      };
    }

    return {
      configured: true,
      isPlaceholder: false,
      connected: true,
      url,
      message: "Successfully connected to Supabase PostgreSQL database!",
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return {
      configured: true,
      isPlaceholder: false,
      connected: false,
      url,
      message: `Failed to connect to Supabase: ${errorMessage}`,
      error: errorMessage,
    };
  }
}
