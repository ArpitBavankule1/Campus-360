"use client";

import React from "react";
import { SwayamEnrollment } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User,
  GraduationCap,
  Calendar,
  MapPin,
  Ticket,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

interface EnrollmentTrackerCardProps {
  enrollment: SwayamEnrollment;
}

export function EnrollmentTrackerCard({ enrollment }: EnrollmentTrackerCardProps) {
  const statusConfig = {
    enrolled: { label: "Enrolled", color: "bg-blue-500/15 text-blue-500 border-blue-500/30" },
    assignment_submitted: { label: "Assignments Active", color: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
    exam_registered: { label: "Exam Registered", color: "bg-amber-500/15 text-amber-500 border-amber-500/30" },
    certified: { label: "Certified", color: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30" },
    transferred: { label: "Credits Transferred", color: "bg-teal-500/15 text-teal-400 border-teal-500/30" },
  }[enrollment.enrollment_status];

  return (
    <Card className="border-border/60 hover:border-border transition-all bg-card/60 backdrop-blur-sm">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">{enrollment.user_name}</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono">
                {enrollment.roll_number}
              </Badge>
              <Badge className="bg-muted text-muted-foreground text-[10px] uppercase font-semibold">
                {enrollment.role}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {enrollment.department} • {enrollment.academic_year}
            </p>
          </div>
          <Badge className={`text-xs font-semibold ${statusConfig.color}`}>
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 space-y-3">
        <div className="bg-muted/30 p-2.5 rounded-lg border border-border/40">
          <div className="text-xs font-medium text-foreground">{enrollment.course_title}</div>
          <div className="text-[11px] font-mono text-muted-foreground mt-0.5">
            Course Code: {enrollment.course_code}
          </div>
        </div>

        {/* Assignment Average Progress */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-500" />
              Continuous Assessment Score
            </span>
            <span className="font-semibold text-foreground">
              {enrollment.assignment_avg_score}%
            </span>
          </div>
          <Progress value={enrollment.assignment_avg_score} className="h-1.5" />
        </div>

        {/* Hall Ticket & Venue */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/40">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Ticket className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span className="truncate font-mono">{enrollment.hall_ticket_no || "Admit card pending"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">{enrollment.exam_city}</span>
          </div>
        </div>

        <div className="text-[10px] font-mono text-muted-foreground/80 flex items-center justify-between pt-1">
          <span>Token: {enrollment.enrollment_token}</span>
        </div>
      </CardContent>
    </Card>
  );
}
