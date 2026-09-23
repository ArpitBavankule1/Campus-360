"use client";

import Link from "next/link";
import { Sparkles, LogOut, User, GraduationCap, School, BookOpen, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/layout/auth-provider";
import { APP_NAME } from "@/lib/constants";

export default function StudentDashboardPage() {
  const { user, profile, role, signOut, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Top Navbar */}
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span>{APP_NAME}</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground mr-2">
            <span>Signed in as</span>
            <span className="font-semibold text-foreground">
              {profile?.full_name || user?.user_metadata?.full_name || user?.email || "Student"}
            </span>
          </div>

          <Badge variant="secondary" className="capitalize flex items-center gap-1">
            <GraduationCap className="h-3 w-3" />
            {role || "student"}
          </Badge>

          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="flex items-center gap-1.5"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Welcome Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-3">
                <ShieldCheck className="h-3.5 w-3.5" />
                Phase 3 Authenticated Session Active
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Welcome, {profile?.full_name || user?.user_metadata?.full_name || "Student"}! 🎓
              </h1>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                Your student session has been securely verified via Supabase Authentication.
              </p>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2 shadow-xs border-border/60">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Student Profile Information
              </CardTitle>
              <CardDescription>
                Details registered in your institutional profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-muted/40">
                  <span className="text-xs text-muted-foreground block">Full Name</span>
                  <span className="font-medium text-foreground">
                    {profile?.full_name || user?.user_metadata?.full_name || "—"}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-muted/40">
                  <span className="text-xs text-muted-foreground block">Email Address</span>
                  <span className="font-medium text-foreground">
                    {profile?.email || user?.email || "—"}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-muted/40">
                  <span className="text-xs text-muted-foreground block">Student ID / Roll No.</span>
                  <span className="font-medium text-foreground">
                    {profile?.student_id || user?.user_metadata?.student_id || "—"}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-muted/40">
                  <span className="text-xs text-muted-foreground block">Role</span>
                  <span className="font-medium text-foreground capitalize">
                    {role || "student"}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-muted/40">
                  <span className="text-xs text-muted-foreground block">Academic Year</span>
                  <span className="font-medium text-foreground">
                    {profile?.year ? `Year ${profile.year}` : user?.user_metadata?.year ? `Year ${user.user_metadata.year}` : "—"}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-muted/40">
                  <span className="text-xs text-muted-foreground block">Division</span>
                  <span className="font-medium text-foreground">
                    {profile?.division || user?.user_metadata?.division || "—"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Status */}
          <Card className="shadow-xs border-border/60">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <School className="h-5 w-5 text-primary" />
                Campus Status
              </CardTitle>
              <CardDescription>System connectivity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Auth Provider:</span>
                <Badge variant="outline" className="font-mono text-xs">Supabase Auth</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Session Status:</span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Authenticated
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Next Phase:</span>
                <span className="text-xs font-medium">Student Dashboard Modules</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
