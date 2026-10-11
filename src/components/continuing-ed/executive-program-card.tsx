"use client";

import React from "react";
import { ExecutiveProgram } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Calendar,
  Clock,
  IndianRupee,
  Users,
  Award,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Building,
  Radio,
} from "lucide-react";

interface ExecutiveProgramCardProps {
  program: ExecutiveProgram;
  onNominate: (program: ExecutiveProgram) => void;
  onViewSyllabus: (program: ExecutiveProgram) => void;
}

export function ExecutiveProgramCard({
  program,
  onNominate,
  onViewSyllabus,
}: ExecutiveProgramCardProps) {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "executive_mdp":
        return { label: "Executive MDP", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30" };
      case "faculty_fdp":
        return { label: "AICTE / ATAL FDP", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" };
      case "industry_masterclass":
        return { label: "Industry Masterclass", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30" };
      case "certificate_bootcamp":
        return { label: "Certificate Bootcamp", color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30" };
      default:
        return { label: type, color: "bg-muted text-muted-foreground" };
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "hybrid":
        return <Laptop className="w-3.5 h-3.5 text-blue-500" />;
      case "in_person_residential":
        return <Building className="w-3.5 h-3.5 text-emerald-500" />;
      case "live_virtual":
        return <Radio className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <Laptop className="w-3.5 h-3.5" />;
    }
  };

  const typeBadge = getTypeBadge(program.program_type);
  const enrolledPct = Math.round((program.enrolled_count / program.intake_capacity) * 100);

  return (
    <Card className="border border-border/60 bg-card/60 backdrop-blur-md shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/40 bg-muted/15">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-xs font-semibold ${typeBadge.color}`}>
                {typeBadge.label}
              </Badge>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold">
                {program.program_code}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/40 capitalize">
              {getModeIcon(program.pedagogy_mode)}
              <span>{program.pedagogy_mode.replace("_", " ")}</span>
            </div>
          </div>
          <CardTitle className="text-lg font-bold tracking-tight text-foreground flex items-start gap-2 mt-1">
            <GraduationCap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <span>{program.title}</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">{program.department}</p>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4 flex-1">
        {/* Faculty Lead & Target Audience */}
        <div className="text-xs space-y-1.5 bg-muted/20 p-2.5 rounded-md border border-border/40">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Director:</span> {program.lead_faculty_director}
          </p>
          <p className="text-muted-foreground line-clamp-1">
            <span className="font-medium text-foreground">Target:</span> {program.target_audience}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 py-1">
          <div className="bg-muted/30 p-2 rounded-lg text-center border border-border/30">
            <Clock className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
            <span className="text-[10px] text-muted-foreground block">Duration</span>
            <span className="text-xs font-bold">{program.duration_weeks} Weeks</span>
          </div>
          <div className="bg-muted/30 p-2 rounded-lg text-center border border-border/30">
            <Award className="w-3.5 h-3.5 text-amber-500 mx-auto mb-1" />
            <span className="text-[10px] text-muted-foreground block">CEU Credits</span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{program.credit_units} CEUs</span>
          </div>
          <div className="bg-muted/30 p-2 rounded-lg text-center border border-border/30">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-500 mx-auto mb-1" />
            <span className="text-[10px] text-muted-foreground block">Tuition</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {program.fee_inr === 0 ? "AICTE Grant" : `₹${program.fee_inr.toLocaleString("en-IN")}`}
            </span>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Enrolled Capacity
            </span>
            <span className="font-medium text-foreground">
              {program.enrolled_count} / {program.intake_capacity} ({enrolledPct}%)
            </span>
          </div>
          <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                enrolledPct >= 90 ? "bg-amber-500" : "bg-primary"
              }`}
              style={{ width: `${Math.min(enrolledPct, 100)}%` }}
            />
          </div>
        </div>

        {/* Syllabus Modules Preview */}
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Core Modules
          </span>
          <div className="space-y-1">
            {program.syllabus_modules.slice(0, 2).map((mod, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs text-foreground/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">{mod}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-4 border-t border-border/40 bg-muted/10 flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-8"
          onClick={() => onViewSyllabus(program)}
        >
          Syllabus & Info
        </Button>
        <Button
          size="sm"
          className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-1.5"
          onClick={() => onNominate(program)}
          disabled={program.enrolled_count >= program.intake_capacity}
        >
          <span>Nominate / Enroll</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
