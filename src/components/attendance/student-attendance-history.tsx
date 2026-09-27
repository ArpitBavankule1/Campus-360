"use client";

/**
 * CampusLens AI — Phase 17
 * StudentAttendanceHistory: displays a student's per-subject attendance
 * summary with progress bars and color-coded risk indicators.
 * Uses mock data in demo mode; connects to Supabase in production.
 */

import { useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "cn";

interface SubjectAttendance {
  courseCode: string;
  courseName: string;
  totalClasses: number;
  attended: number;
  lastClass: string;
}

const DEMO_RECORDS: SubjectAttendance[] = [
  {
    courseCode: "CS-501",
    courseName: "Distributed Systems",
    totalClasses: 32,
    attended: 30,
    lastClass: "Mon, Sep 22",
  },
  {
    courseCode: "CS-508",
    courseName: "Cloud Architecture Lab",
    totalClasses: 20,
    attended: 18,
    lastClass: "Wed, Sep 24",
  },
  {
    courseCode: "CS-503",
    courseName: "Machine Learning",
    totalClasses: 28,
    attended: 20,
    lastClass: "Thu, Sep 18",
  },
  {
    courseCode: "CS-510",
    courseName: "Blockchain & Web3",
    totalClasses: 18,
    attended: 12,
    lastClass: "Fri, Sep 12",
  },
  {
    courseCode: "CS-505",
    courseName: "Compiler Design",
    totalClasses: 30,
    attended: 29,
    lastClass: "Tue, Sep 23",
  },
  {
    courseCode: "HS-101",
    courseName: "Technical Communication",
    totalClasses: 15,
    attended: 15,
    lastClass: "Mon, Sep 22",
  },
];

interface StudentAttendanceHistoryProps {
  records?: SubjectAttendance[];
}

export function StudentAttendanceHistory({
  records = DEMO_RECORDS,
}: StudentAttendanceHistoryProps) {
  const stats = useMemo(() => {
    const total = records.reduce((s, r) => s + r.totalClasses, 0);
    const attended = records.reduce((s, r) => s + r.attended, 0);
    const overall = total > 0 ? Math.round((attended / total) * 100) : 0;
    const atRisk = records.filter(
      (r) => (r.attended / r.totalClasses) * 100 < 75
    ).length;
    return { total, attended, overall, atRisk };
  }, [records]);

  return (
    <div className="space-y-4">
      {/* Aggregate Stats Strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-center">
          <p className="text-[10px] text-muted-foreground font-medium">Overall</p>
          <p
            className={cn(
              "text-lg font-extrabold",
              stats.overall >= 75 ? "text-emerald-600" : "text-rose-500"
            )}
          >
            {stats.overall}%
          </p>
        </div>
        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center">
          <p className="text-[10px] text-muted-foreground font-medium">Attended</p>
          <p className="text-lg font-extrabold text-emerald-600">
            {stats.attended}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 text-center">
          <p className="text-[10px] text-muted-foreground font-medium">At Risk</p>
          <p className="text-lg font-extrabold text-rose-500">{stats.atRisk}</p>
        </div>
      </div>

      {/* Per-Subject List */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {records.map((r) => {
          const pct = Math.round((r.attended / r.totalClasses) * 100);
          const isAtRisk = pct < 75;
          const isWarning = pct >= 75 && pct < 85;

          return (
            <div
              key={r.courseCode}
              className={cn(
                "p-3 rounded-xl border transition-all",
                isAtRisk
                  ? "border-rose-500/30 bg-rose-500/5"
                  : isWarning
                  ? "border-amber-500/30 bg-amber-500/5"
                  : "border-border bg-card hover:border-primary/30"
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <p className="font-bold text-xs text-foreground truncate">
                    {r.courseName}
                  </p>
                  <p className="text-[10px] font-mono text-muted-foreground">
                    {r.courseCode}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isAtRisk ? (
                    <Badge
                      variant="outline"
                      className="text-[9px] bg-rose-500/10 text-rose-600 border-rose-500/30 px-1.5 py-0"
                    >
                      <AlertTriangle className="w-2.5 h-2.5 mr-0.5" />
                      At Risk
                    </Badge>
                  ) : isWarning ? (
                    <Badge
                      variant="outline"
                      className="text-[9px] bg-amber-500/10 text-amber-600 border-amber-500/30 px-1.5 py-0"
                    >
                      <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
                      Low
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-[9px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30 px-1.5 py-0"
                    >
                      <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                      Good
                    </Badge>
                  )}
                  <span
                    className={cn(
                      "text-xs font-extrabold",
                      isAtRisk
                        ? "text-rose-500"
                        : isWarning
                        ? "text-amber-500"
                        : "text-emerald-600"
                    )}
                  >
                    {pct}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden mb-1.5">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    isAtRisk
                      ? "bg-rose-500"
                      : isWarning
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>
                  {r.attended} / {r.totalClasses} classes
                </span>
                <span>Last: {r.lastClass}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 text-[10px] text-muted-foreground pt-1 border-t">
        <BarChart3 className="w-3 h-3 shrink-0" />
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
          Below 75% = At Risk
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
          75–85% = Low
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          Above 85% = Good
        </div>
      </div>
    </div>
  );
}
