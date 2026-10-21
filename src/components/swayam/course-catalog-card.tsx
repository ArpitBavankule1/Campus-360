"use client";

import React from "react";
import { SwayamCourse } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  Sparkles,
  GraduationCap,
} from "lucide-react";

interface CourseCatalogCardProps {
  course: SwayamCourse;
  onEnroll?: (course: SwayamCourse) => void;
}

export function CourseCatalogCard({ course, onEnroll }: CourseCatalogCardProps) {
  const durationLabel = {
    "4_weeks": "4 Weeks (10-15 hrs)",
    "8_weeks": "8 Weeks (20-30 hrs)",
    "12_weeks": "12 Weeks (30-45 hrs)",
  }[course.duration_weeks];

  return (
    <Card className="flex flex-col justify-between border-border/60 hover:border-blue-500/40 transition-all hover:shadow-md bg-card/60 backdrop-blur-sm">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <Badge className="bg-blue-600/10 text-blue-500 border-blue-500/20 text-xs font-semibold px-2 py-0.5">
            {course.offering_institute}
          </Badge>
          <div className="flex items-center gap-1.5">
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs font-medium">
              {course.credit_equivalency} Credits
            </Badge>
            {course.aicte_approved_fdp && (
              <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs font-medium">
                AICTE FDP
              </Badge>
            )}
          </div>
        </div>

        <CardTitle className="text-base font-semibold leading-snug mt-2 text-foreground">
          {course.course_title}
        </CardTitle>
        <p className="text-xs font-mono text-muted-foreground mt-0.5">
          Code: {course.course_code}
        </p>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-3.5">
        <div className="text-xs text-muted-foreground space-y-1.5 border-t border-border/40 pt-2.5">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span className="truncate">Instructor: <strong className="text-foreground">{course.instructor_name}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span>Duration: {durationLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span>Proctored Exam: <strong className="text-foreground">{course.exam_date}</strong></span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed bg-muted/30 p-2 rounded-md">
          {course.syllabus_outline}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-mono text-muted-foreground">
            {course.course_token}
          </span>
          {onEnroll && (
            <Button
              size="sm"
              onClick={() => onEnroll(course)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-3 shadow-sm h-8"
            >
              Enroll Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
