"use client";

import Link from "next/link";
import { Sparkles, LogOut, User, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/layout/auth-provider";
import { APP_NAME } from "@/lib/constants";

export default function AdminDashboardPage() {
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
          <Badge variant="destructive" className="capitalize flex items-center gap-1">
            <ShieldAlert className="h-3 w-3" />
            {role || "admin"}
          </Badge>

          <Button variant="outline" size="sm" onClick={signOut} className="flex items-center gap-1.5">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="rounded-2xl bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent border border-rose-500/20 p-6 md:p-8 mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-700 bg-rose-500/10 px-2.5 py-1 rounded-full mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            Superadmin Management Portal Active
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Campus Administrator Portal — {profile?.full_name || user?.email || "Admin"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Verified authenticated superadmin session via Supabase Auth with full institutional access.
          </p>
        </div>

        <Card className="shadow-xs border-border/60">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Administrator Credentials
            </CardTitle>
            <CardDescription>Verified administrative profile</CardDescription>
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
                <span className="text-xs text-muted-foreground block">Role Level</span>
                <span className="font-medium text-foreground capitalize">{role || "admin"}</span>
              </div>
              <div className="p-3 rounded-lg bg-muted/40">
                <span className="text-xs text-muted-foreground block">Privileges</span>
                <span className="font-medium text-rose-600">Full System Administration</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
