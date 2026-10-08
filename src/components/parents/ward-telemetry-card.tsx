"use client";

import React from "react";
import { WardTelemetry } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  CalendarCheck,
  AlertTriangle,
  Building,
  UserCheck,
  CreditCard,
  Mail,
  CheckCircle2,
} from "lucide-react";

interface WardTelemetryCardProps {
  ward: WardTelemetry;
  onSchedulePTM?: () => void;
  onSendMessage?: () => void;
}

export function WardTelemetryCard({
  ward,
  onSchedulePTM,
  onSendMessage,
}: WardTelemetryCardProps) {
  const isOverallCritical = ward.overall_attendance_pct < 75;
  const criticalCourses = ward.courseBreakdown.filter((c) => c.isBelowMandate);

  return (
    <Card className="border border-border/60 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20 shadow-inner">
              {ward.student_name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl font-bold tracking-tight">
                  {ward.student_name}
                </CardTitle>
                <Badge variant="outline" className="text-xs font-mono bg-background/50">
                  {ward.roll_number}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {ward.department} • Year {ward.academic_year}, Semester {ward.semester}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 px-2.5 py-1 text-xs font-semibold"
            >
              <GraduationCap className="h-3.5 w-3.5 mr-1" />
              CGPA: {ward.cumulative_cgpa.toFixed(2)}
            </Badge>

            <Badge
              variant="outline"
              className={
                ward.fee_status === "cleared"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs"
              }
            >
              <CreditCard className="h-3.5 w-3.5 mr-1" />
              Fee: {ward.fee_status === "cleared" ? "Cleared (₹0 Dues)" : `₹${ward.fee_dues_inr} Due`}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-6">
        {/* Attendance Telemetry Gauges */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">Overall Attendance Telemetry</span>
            </div>
            <span
              className={`text-sm font-bold font-mono px-2 py-0.5 rounded ${
                isOverallCritical
                  ? "bg-red-500/20 text-red-600 dark:text-red-400"
                  : ward.overall_attendance_pct < 80
                  ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                  : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {ward.overall_attendance_pct.toFixed(1)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isOverallCritical
                  ? "bg-red-500"
                  : ward.overall_attendance_pct < 80
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${Math.min(100, ward.overall_attendance_pct)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
            <span>Theory: <strong>{ward.theory_attendance_pct.toFixed(1)}%</strong></span>
            <span>Practical Labs: <strong>{ward.practical_attendance_pct.toFixed(1)}%</strong></span>
            <span>Statutory Threshold: <strong className="text-foreground">75.0%</strong></span>
          </div>
        </div>

        {/* Warning Callout if below mandate */}
        {criticalCourses.length > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">
                Mandatory Attendance Advisory: {criticalCourses.length} Subject(s) Below 75%
              </p>
              <p className="text-muted-foreground mt-0.5">
                UGC and Academic Council guidelines require a minimum of 75% attendance for final examination hall ticket admittance.
                Please review with the faculty mentor.
              </p>
            </div>
          </div>
        )}

        {/* Course-wise Breakdown */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Enrolled Courses & Lecture Tracking
          </h4>
          <div className="divide-y divide-border/40 rounded-xl border border-border/50 bg-background/40 overflow-hidden">
            {ward.courseBreakdown.map((course) => (
              <div
                key={course.courseCode}
                className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-muted/30 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">
                      {course.courseCode}
                    </span>
                    <span className="text-sm font-medium">{course.courseTitle}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Faculty: {course.facultyName} • Attended: {course.totalAttended}/{course.totalConducted} classes
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span
                    className={`font-mono text-xs font-bold ${
                      course.isBelowMandate
                        ? "text-red-500 dark:text-red-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {course.attendancePercentage.toFixed(1)}%
                  </span>
                  {course.isBelowMandate ? (
                    <Badge variant="destructive" className="text-[10px] py-0 px-2">
                      &lt;75% Alert
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-[10px] py-0 px-2 bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                    >
                      Satisfactory
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mentor & Hostel Information Footer */}
        <div className="pt-3 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <UserCheck className="h-3.5 w-3.5 text-primary" />
            <span>
              Academic Proctor: <strong className="text-foreground">{ward.assigned_proctor_name}</strong> ({ward.assigned_proctor_email})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Building className="h-3.5 w-3.5 text-primary" />
            <span>
              Residence: <strong className="text-foreground">{ward.hostel_room}</strong>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
