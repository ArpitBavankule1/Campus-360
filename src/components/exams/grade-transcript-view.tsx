"use client";

import React, { useState } from "react";
import {
  Award,
  BookOpen,
  CheckCircle2,
  FileCheck,
  TrendingUp,
  RefreshCw,
  HelpCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import { SemesterTranscriptSummary, StudentGradeRecord } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface GradeTranscriptViewProps {
  transcript: SemesterTranscriptSummary;
  onRequestRevaluation?: (subjectCode: string) => Promise<void>;
}

export const GradeTranscriptView: React.FC<GradeTranscriptViewProps> = ({
  transcript,
  onRequestRevaluation,
}) => {
  const [revaluationSubject, setRevaluationSubject] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const getGradeBadge = (grade: StudentGradeRecord["grade"]) => {
    switch (grade) {
      case "O":
        return (
          <Badge className="bg-emerald-600 text-white font-mono font-bold text-[11px] px-2">
            O (Outstanding)
          </Badge>
        );
      case "A+":
        return (
          <Badge className="bg-teal-600 text-white font-mono font-bold text-[11px] px-2">
            A+ (Excellent)
          </Badge>
        );
      case "A":
        return (
          <Badge className="bg-blue-600 text-white font-mono font-bold text-[11px] px-2">
            A (Very Good)
          </Badge>
        );
      case "B+":
        return (
          <Badge className="bg-amber-600 text-white font-mono font-bold text-[11px] px-2">
            B+ (Good)
          </Badge>
        );
      case "B":
        return (
          <Badge className="bg-orange-600 text-white font-mono font-bold text-[11px] px-2">
            B (Above Average)
          </Badge>
        );
      default:
        return <Badge variant="outline">{grade}</Badge>;
    }
  };

  const handleApplyRevaluation = async (subjectCode: string) => {
    if (!onRequestRevaluation) return;
    setIsSubmitting(true);
    setSuccessMsg(null);
    try {
      await onRequestRevaluation(subjectCode);
      setSuccessMsg(`Revaluation request submitted for ${subjectCode}. Official token generated.`);
      setRevaluationSubject(null);
    } catch {
      // fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl border border-border/80 bg-card flex flex-col justify-between space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Semester SGPA</span>
            <Award className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-foreground tracking-tight">
              {transcript.sgpa}
            </span>
            <span className="text-xs text-muted-foreground font-mono">/ 10.0</span>
          </div>
          <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Top 5% in Department
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 bg-card flex flex-col justify-between space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Cumulative CGPA</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-primary tracking-tight">
              {transcript.cgpa}
            </span>
            <span className="text-xs text-muted-foreground font-mono">/ 10.0</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">
            Across 5 Semesters
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 bg-card flex flex-col justify-between space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Credits Earned</span>
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-foreground tracking-tight">
              {transcript.creditsEarned}
            </span>
            <span className="text-xs text-muted-foreground font-mono">/ {transcript.totalCredits}</span>
          </div>
          <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 100% Clearance Rate
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-border/80 bg-card flex flex-col justify-between space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Marks Total</span>
            <FileCheck className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-foreground tracking-tight">
              {transcript.totalMarksScored}
            </span>
            <span className="text-xs text-muted-foreground font-mono">/ {transcript.maxMarks}</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">
            Aggregate: {transcript.percentage}%
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grade Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border/60 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground text-sm">
              Official Academic Course Breakdown — {transcript.semester}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Grade points and credit weighting validated by University Examination Committee.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/60 text-muted-foreground border-b border-border/60 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3.5">Course Code</th>
                <th className="p-3.5">Course Title</th>
                <th className="p-3.5 text-center">Credits</th>
                <th className="p-3.5 text-center">Internal (30)</th>
                <th className="p-3.5 text-center">End-Sem (70)</th>
                <th className="p-3.5 text-center">Total (100)</th>
                <th className="p-3.5 text-center">Grade</th>
                <th className="p-3.5 text-center">Grade Point</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {transcript.records.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-primary">
                    {r.subject_code}
                  </td>
                  <td className="p-3.5 font-semibold text-foreground">
                    {r.subject_name}
                  </td>
                  <td className="p-3.5 text-center font-mono font-semibold">
                    {r.credits}
                  </td>
                  <td className="p-3.5 text-center font-mono text-muted-foreground">
                    {r.internal_marks}
                  </td>
                  <td className="p-3.5 text-center font-mono text-muted-foreground">
                    {r.endsem_marks}
                  </td>
                  <td className="p-3.5 text-center font-mono font-bold text-foreground">
                    {r.total_marks}
                  </td>
                  <td className="p-3.5 text-center">
                    {getGradeBadge(r.grade)}
                  </td>
                  <td className="p-3.5 text-center font-mono font-bold text-foreground">
                    {r.grade_point.toFixed(1)}
                  </td>
                  <td className="p-3.5 text-right">
                    {r.status === "under_revaluation" ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] text-amber-500 border-amber-500/30"
                      >
                        In Revaluation
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleApplyRevaluation(r.subject_code)}
                        className="text-[11px] h-7 px-2 text-muted-foreground hover:text-foreground"
                      >
                        <span>Recheck</span>
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
