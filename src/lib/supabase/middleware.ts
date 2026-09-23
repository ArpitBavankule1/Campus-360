import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database.types";
import { getRoleDashboardPath } from "@/lib/auth/paths";

const PROTECTED_PREFIXES = ["/dashboard", "/faculty", "/hod", "/admin"];
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // 1. Unauthenticated users trying to access protected routes -> redirect to /login
  if (!user && isProtectedRoute) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Authenticated users trying to access login/register/forgot-password -> redirect to their role dashboard
  if (user && isAuthRoute) {
    // Try to get role from user metadata or profile
    const role = (user.user_metadata?.role as string) || "student";
    const destination = getRoleDashboardPath(role);
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 3. Role-based route enforcement
  if (user && isProtectedRoute) {
    const userRole = (user.user_metadata?.role as string) || "student";

    if (pathname.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL(getRoleDashboardPath(userRole), request.url));
    }

    if (pathname.startsWith("/hod") && userRole !== "hod" && userRole !== "admin") {
      return NextResponse.redirect(new URL(getRoleDashboardPath(userRole), request.url));
    }

    if (
      pathname.startsWith("/faculty") &&
      userRole !== "faculty" &&
      userRole !== "hod" &&
      userRole !== "admin"
    ) {
      return NextResponse.redirect(new URL(getRoleDashboardPath(userRole), request.url));
    }
  }

  return supabaseResponse;
}
