"use client";

import Link from "next/link";
import { PortalLayout } from "@/components/layout/portal-layout";
import { ProfileForm } from "@/components/profile/profile-form";
import { ArrowLeft, UserCheck, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  return (
    <PortalLayout>
      <div className="space-y-6 pb-12">
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/dashboard"
                className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <span>Student Profile & Identity</span>
              <Badge variant="secondary" className="text-xs font-medium">
                Verified
              </Badge>
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-full border border-border/60 self-start sm:self-center">
            <Shield className="h-3.5 w-3.5 text-emerald-600" />
            <span>Institutionally Synchronized</span>
          </div>
        </div>

        {/* Profile Card & Edit Form */}
        <ProfileForm />
      </div>
    </PortalLayout>
  );
}
