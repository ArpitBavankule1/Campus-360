import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRoleDashboardPath } from "@/lib/auth/paths";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      if (next) {
        return NextResponse.redirect(new URL(next, requestUrl.origin));
      }

      // Check role to redirect to appropriate dashboard
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      const dashboardPath = getRoleDashboardPath(profile?.role);
      return NextResponse.redirect(new URL(dashboardPath, requestUrl.origin));
    }
  }

  // Return user to login with error if verification fails
  return NextResponse.redirect(
    new URL("/login?error=Could%20not%20authenticate%20user", requestUrl.origin)
  );
}
