"use client";

import Link from "next/link";
import { Clock, MapPin, User, ArrowRight, BookOpen, FlaskConical, Presentation } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { TimetableRow } from "@/lib/supabase/queries";
import { cn } from "cn";

interface TodayScheduleProps {
  classes: TimetableRow[];
  currentDay: string;
}

export function TodaySchedule({ classes, currentDay }: TodayScheduleProps) {
  return (
    <div className="rounded-3xl bg-card border border-border/70 p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Today's Schedule
            </h2>
            <Badge variant="outline" className="text-xs font-medium">
              {currentDay}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your registered class routine and lab sessions
          </p>
        </div>

        <Link
          href="/timetable"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-xs font-semibold text-primary hover:text-primary flex items-center gap-1"
          )}
        >
          <span>Full Routine</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {classes.length === 0 ? (
        <div className="py-12 text-center rounded-2xl bg-muted/20 border border-dashed border-border/80">
          <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm font-semibold text-foreground">No classes scheduled for today!</p>
          <p className="text-xs text-muted-foreground mt-1">Enjoy your study break or prepare for upcoming assessments.</p>
          <Link
            href="/timetable"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "mt-4 text-xs inline-flex"
            )}
          >
            Browse Weekly Timetable
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {classes.map((item, index) => {
            const isLab = item.type === "lab";
            const isFirst = index === 0;

            return (
              <div
                key={item.id}
                className={cn(
                  "relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all duration-150 hover:bg-muted/40",
                  isFirst
                    ? "bg-primary/5 border-primary/30 shadow-2xs"
                    : "bg-muted/15 border-border/60"
                )}
              >
                {/* Time & Indicator */}
                <div className="flex items-start sm:items-center gap-3.5 mb-2 sm:mb-0">
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-background border shadow-2xs min-w-[85px] text-center">
                    <span className="text-xs font-bold text-foreground font-mono">
                      {item.start_time}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      to {item.end_time}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">
                        {item.subject_name}
                      </span>
                      <Badge
                        variant={isLab ? "secondary" : "outline"}
                        className={cn(
                          "text-[10px] h-4.5 px-1.5 capitalize font-medium",
                          isLab && "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-300/40"
                        )}
                      >
                        {isLab ? (
                          <FlaskConical className="h-3 w-3 mr-1" />
                        ) : (
                          <Presentation className="h-3 w-3 mr-1" />
                        )}
                        {item.type}
                      </Badge>

                      {isFirst && (
                        <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                          Up Next
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium text-foreground/80">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {item.room_number}
                      </span>
                      {item.faculty_name && (
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          {item.faculty_name}
                        </span>
                      )}
                      <span className="font-mono text-[11px] text-muted-foreground/80">
                        ({item.subject_code})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Link
                    href={`/explore?q=${encodeURIComponent(item.room_number)}`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "h-8 text-xs text-primary font-medium hover:bg-primary/10"
                    )}
                  >
                    Find Room
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
