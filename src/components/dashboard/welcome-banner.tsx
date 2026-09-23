"use client";

import { useMemo } from "react";
import { Sparkles, Calendar, BookOpen, Clock, ShieldCheck, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/layout/auth-provider";

export function WelcomeBanner() {
  const { user, profile, role } = useAuth();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const todayFormatted = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date());
  }, []);

  const studentName = profile?.full_name || user?.user_metadata?.full_name || "Student";
  const studentId = profile?.student_id || user?.user_metadata?.student_id;
  const yearText = profile?.year ? `Year ${profile.year}` : user?.user_metadata?.year ? `Year ${user.user_metadata.year}` : null;
  const divisionText = profile?.division || user?.user_metadata?.division ? `Div ${profile?.division || user?.user_metadata?.division}` : null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-card border border-primary/20 p-6 md:p-8 shadow-xs">
      {/* Decorative background glow */}
      <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Verified Student Portal Active
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {todayFormatted}
            </span>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <span>{greeting}, {studentName}!</span>
              <span className="text-2xl">🎓</span>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base mt-1 max-w-2xl leading-relaxed">
              Welcome back to your smart campus companion. Stay on top of your daily classes, urgent notices, and campus happenings.
            </p>
          </div>

          {/* Academic profile pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <Badge variant="secondary" className="px-2.5 py-1 flex items-center gap-1 font-medium bg-background/80 backdrop-blur-xs border shadow-2xs">
              <GraduationCap className="h-3.5 w-3.5 text-primary" />
              <span>Computer Science & Engineering</span>
            </Badge>

            {yearText && (
              <Badge variant="outline" className="px-2.5 py-1 bg-background/60">
                {yearText}
              </Badge>
            )}

            {divisionText && (
              <Badge variant="outline" className="px-2.5 py-1 bg-background/60">
                {divisionText}
              </Badge>
            )}

            {studentId && (
              <Badge variant="outline" className="px-2.5 py-1 font-mono text-[11px] bg-background/60">
                ID: {studentId}
              </Badge>
            )}
          </div>
        </div>

        {/* Quick Institutional Card */}
        <div className="lg:w-72 shrink-0 rounded-2xl bg-card/80 backdrop-blur-md border border-border/80 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 pb-2 border-b border-border/60">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Campus System
            </span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live & Synced
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Institute:</span>
              <span className="font-medium text-foreground text-right">Apex Tech (AIT)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Academic Term:</span>
              <span className="font-medium text-foreground">Autumn 2026</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Daily Attendance:</span>
              <span className="font-semibold text-emerald-600">88.5% (Good)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
