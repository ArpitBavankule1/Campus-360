"use client";

import React from "react";
import { FellowshipPosition } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Clock,
  IndianRupee,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface FellowshipPositionCardProps {
  position: FellowshipPosition;
  onApply: (position: FellowshipPosition) => void;
}

export function FellowshipPositionCard({
  position,
  onApply,
}: FellowshipPositionCardProps) {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "teaching_assistant":
        return { label: "Teaching Assistant", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30" };
      case "research_assistant":
        return { label: "Research Assistant", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30" };
      case "lab_demonstrator":
        return { label: "Lab Demonstrator", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" };
      case "work_study":
        return { label: "Work-Study Scholar", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30" };
      case "maker_proctor":
        return { label: "Maker Proctor", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30" };
      default:
        return { label: type, color: "bg-muted text-muted-foreground" };
    }
  };

  const badgeInfo = getTypeBadge(position.position_type);
  const remainingSlots = Math.max(0, position.open_slots - position.filled_slots);

  return (
    <Card className="border border-border/60 bg-card/60 backdrop-blur-md shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/40 bg-muted/15">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={`text-xs font-semibold ${badgeInfo.color}`}>
                {badgeInfo.label}
              </Badge>
              {position.course_code && (
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold">
                  {position.course_code}
                </span>
              )}
            </div>
            <CardTitle className="text-base font-bold leading-tight mt-1 text-foreground">
              {position.title}
            </CardTitle>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-extrabold text-base">
              <IndianRupee className="w-4 h-4 mr-0.5" />
              {position.monthly_stipend_inr.toLocaleString("en-IN")}
            </div>
            <span className="text-[10px] text-muted-foreground block font-medium">/ month stipend</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3 text-sm">
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {position.description}
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs py-2 px-3 rounded-lg bg-muted/30 border border-border/40">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{position.required_hours_per_week} hrs / week</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{remainingSlots} slots remaining</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <GraduationCap className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Min CGPA: {position.min_cgpa_requirement.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Grade: {position.prerequisite_course_grade || "A"}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Core Responsibilities
          </span>
          <div className="space-y-1">
            {position.responsibilities.slice(0, 2).map((resp, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs text-foreground/90">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{resp}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-1 flex items-center justify-between text-xs text-muted-foreground border-t border-border/30">
          <span className="truncate">Supervisor: <strong className="text-foreground">{position.faculty_supervisor_name}</strong></span>
          <span className="flex items-center gap-1 text-[11px]">
            <Calendar className="w-3 h-3" />
            {position.academic_term}
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-3 border-t border-border/40 bg-muted/10">
        <Button
          onClick={() => onApply(position)}
          disabled={remainingSlots === 0}
          className="w-full text-xs font-semibold flex items-center justify-center gap-1.5 h-9"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {remainingSlots > 0 ? "Apply for Fellowship" : "Position Filled"}
        </Button>
      </CardFooter>
    </Card>
  );
}
