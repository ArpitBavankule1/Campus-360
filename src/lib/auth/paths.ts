import type { UserRole } from "@/types";

/**
 * Returns the destination dashboard path for a given user role.
 * Safe for use in client components, middleware, and server components.
 */
export function getRoleDashboardPath(role: UserRole | string | null | undefined): string {
  switch (role) {
    case "faculty":
      return "/faculty";
    case "hod":
      return "/hod";
    case "admin":
      return "/admin";
    case "student":
    default:
      return "/dashboard";
  }
}
