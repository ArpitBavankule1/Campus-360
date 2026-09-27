"use client";

import React from "react";
import {
  Calendar,
  Clock,
  Building2,
  FileText,
  AlertCircle,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { ExamSchedule } from "@/types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ExamScheduleTimelineProps {
  schedules: ExamSchedule[];
}

export const ExamScheduleTimeline: React.FC<ExamScheduleTimelineProps> = ({
  schedules,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-foreground text-base">
            Official Examination Schedule & Datesheet
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Synchronized with University Controller of Examinations calendar.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schedules.map((exam, index) => {
          const isMorning = exam.start_time.includes("AM");

          return (
            <div
              key={exam.id}
              className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-sm hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className="font-mono text-xs font-bold text-primary border-primary/30 bg-primary/10"
                    >
                      {exam.subject_code}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        isMorning
                          ? "border-amber-500/30 text-amber-500 bg-amber-500/10"
                          : "border-blue-500/30 text-blue-500 bg-blue-500/10"
                      }`}
                    >
                      {isMorning ? "Morning Session" : "Afternoon Session"}
                    </Badge>
                  </div>

                  <span className="text-[11px] font-mono text-muted-foreground">
                    Paper #{index + 1}
                  </span>
                </div>

                <h4 className="font-bold text-foreground text-sm leading-snug">
                  {exam.subject_name}
                </h4>

                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-muted/40 border border-border/40 text-xs mt-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span className="font-semibold text-foreground">
                      {exam.exam_date}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>
                      {exam.start_time} - {exam.end_time}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-primary/70" />
                  <span>
                    {exam.room_number} • {exam.building_name}
                  </span>
                </div>

                <span className="font-mono font-medium text-foreground/80">
                  {exam.total_marks} Marks
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
