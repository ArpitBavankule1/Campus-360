"use client";

import Link from "next/link";
import { Sparkles, LogOut, User, Building2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/layout/auth-provider";
import { APP_NAME } from "@/lib/constants";

export default function HodDashboardPage() {
  const { user, profile, role, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span>{APP_NAME}</span>
        </Link>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="capitalize flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            {role || "HOD"}
          </Badge>

          <Button variant="outline" size="sm" onClick={signOut} className="flex items-center gap-1.5">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="rounded-2xl bg-gradient-to-r from-indigo-500/10 via-indigo-500/5 to-transparent border border-indigo-500/20 p-6 md:p-8 mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 bg-indigo-500/10 px-2.5 py-1 rounded-full mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            Head of Department Portal Active
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            HOD Portal — {profile?.full_name || user?.email || "Department Head"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Verified authenticated HOD session via Supabase Auth.
          </p>
        </div>

        <Card className="shadow-xs border-border/60">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              HOD Profile Details
            </CardTitle>
            <CardDescription>Department management access credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-muted/40">
                <span className="text-xs text-muted-foreground block">Full Name</span>
                <span className="font-medium text-foreground">{profile?.full_name || user?.user_metadata?.full_name || "—"}</span>
              </div>
              <div className="p-3 rounded-lg bg-muted/40">
                <span className="text-xs text-muted-foreground block">Email</span>
                <span className="font-medium text-foreground">{profile?.email || user?.email || "—"}</span>
              </div>
              <div className="p-3 rounded-lg bg-muted/40">
                <span className="text-xs text-muted-foreground block">Role</span>
                <span className="font-medium text-foreground capitalize">{role || "hod"}</span>
              </div>
              <div className="p-3 rounded-lg bg-muted/40">
                <span className="text-xs text-muted-foreground block">Status</span>
                <span className="font-medium text-emerald-600">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
