"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/portal-layout";
import { getTimetableList, type TimetableRow, MOCK_TIMETABLE } from "@/lib/supabase/queries";
import { useAuth } from "@/components/layout/auth-provider";
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  FlaskConical,
  Presentation,
  Printer,
  ArrowLeft,
  Calendar,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function TimetableContent() {
  const { profile } = useAuth();

  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedYear, setSelectedYear] = useState<number>(profile?.year ? Number(profile.year) : 2);
  const [selectedDivision, setSelectedDivision] = useState(profile?.division || "A");
  const [timetable, setTimetable] = useState<TimetableRow[]>(MOCK_TIMETABLE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getTimetableList({
          day: selectedDay,
          year: selectedYear,
          division: selectedDivision,
        });
        setTimetable(data);
      } catch (err) {
        console.error("Failed to load timetable:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [selectedDay, selectedYear, selectedDivision]);

  const lectureCount = timetable.filter((t) => t.type === "lecture").length;
  const labCount = timetable.filter((t) => t.type === "lab").length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
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
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <CalendarDays className="h-7 w-7 text-primary" />
            <span>Class Timetable & Routines</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Weekly academic schedule for Computer Science & Engineering
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => window.print()}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
            )}
          >
            <Printer className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Print Routine</span>
          </button>
        </div>
      </div>

      {/* Filter Header & Day Selector */}
      <div className="rounded-3xl bg-card border border-border/70 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[11px] mr-1">
              Select Cohort:
            </span>
            {[1, 2, 3, 4].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={cn(
                  "px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer text-xs",
                  selectedYear === yr
                    ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted/70 border border-border/50"
                )}
              >
                Year {yr}
              </button>
            ))}

            <div className="h-4 w-px bg-border/80 mx-1" />

            {["A", "B"].map((div) => (
              <button
                key={div}
                onClick={() => setSelectedDivision(div)}
                className={cn(
                  "px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer text-xs",
                  selectedDivision === div
                    ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted/70 border border-border/50"
                )}
              >
                Div {div}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Presentation className="h-3.5 w-3.5 text-primary" />
              <strong>{lectureCount}</strong> Lectures
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <FlaskConical className="h-3.5 w-3.5 text-purple-600" />
              <strong>{labCount}</strong> Practical Labs
            </span>
          </div>
        </div>

        {/* Days of Week Tab Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-border/50 pt-3">
          {DAYS.map((day) => {
            const isSelected = selectedDay === day;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "px-4 py-2 rounded-2xl text-xs font-semibold transition-all shrink-0 cursor-pointer",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Routine Content */}
      <div className="space-y-3">
        {timetable.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-card border border-dashed border-border/80 space-y-3">
            <Calendar className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
            <h3 className="text-base font-bold text-foreground">No classes scheduled on {selectedDay}</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              There are no lecture or lab periods listed for Year {selectedYear}, Division {selectedDivision} on this day.
            </p>
          </div>
        ) : (
          timetable.map((period, idx) => {
            const isLab = period.type === "lab";

            return (
              <div
                key={period.id}
                className={cn(
                  "flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-3xl border transition-all duration-150 hover:bg-muted/40 shadow-xs",
                  isLab
                    ? "bg-purple-500/5 border-purple-500/20"
                    : "bg-card border-border/70"
                )}
              >
                {/* Time Strip & Subject Details */}
                <div className="flex items-start sm:items-center gap-4 mb-3 sm:mb-0">
                  <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-background border shadow-2xs min-w-[100px] text-center shrink-0">
                    <span className="text-xs font-extrabold text-foreground font-mono">
                      {period.start_time}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">
                      to {period.end_time}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-foreground">
                        {period.subject_name}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5",
                          isLab
                            ? "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-300/40"
                            : "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-300/40"
                        )}
                      >
                        {isLab ? <FlaskConical className="h-3 w-3 mr-1" /> : <Presentation className="h-3 w-3 mr-1" />}
                        {period.type}
                      </Badge>
                      <span className="text-xs font-mono font-medium text-muted-foreground">
                        ({period.subject_code})
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {period.room_number}
                      </span>
                      {period.faculty_name && (
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          {period.faculty_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <Link
                    href={`/explore?q=${encodeURIComponent(period.room_number)}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "text-xs font-semibold flex items-center gap-1 h-8 rounded-xl shadow-2xs"
                    )}
                  >
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>Navigate Room</span>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function TimetablePage() {
  return (
    <PortalLayout>
      <Suspense fallback={<div className="p-12 text-center text-xs text-muted-foreground">Loading Class Routine...</div>}>
        <TimetableContent />
      </Suspense>
    </PortalLayout>
  );
}
