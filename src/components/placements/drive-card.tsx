"use client";

import React, { useState } from "react";
import {
  PlacementDrive,
} from "@/types";
import {
  checkDriveEligibility,
  calculateSkillMatchScore,
  StudentPlacementProfile,
} from "@/lib/placements/placement-engine";
import {
  Building2,
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
} from "lucide-react";

interface DriveCardProps {
  drive: PlacementDrive;
  student: StudentPlacementProfile;
  isApplied: boolean;
  onApply: (drive: PlacementDrive) => void;
}

export function DriveCard({ drive, student, isApplied, onApply }: DriveCardProps) {
  const [expanded, setExpanded] = useState(false);

  const eligibility = checkDriveEligibility(drive, {
    cgpa: student.cgpa,
    department: student.department,
    activeBacklogs: student.activeBacklogs,
  });

  const skillMatch = calculateSkillMatchScore(drive.skills_required, student.skills);

  const deadlineDate = new Date(drive.application_deadline);
  // eslint-disable-next-line react-hooks/purity -- render-time comparison against current epoch to evaluate expired application window
  const isExpired = deadlineDate.getTime() < Date.now();
  const formattedDeadline = deadlineDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const driveTypeLabels: Record<string, { label: string; color: string }> = {
    full_time: { label: "Full Time (FTE)", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
    internship: { label: "Internship", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
    intern_to_fte: { label: "Intern to FTE", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
  };

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-300 p-6 bg-card/60 backdrop-blur-md hover:shadow-xl ${
        eligibility.isEligible
          ? "border-border/60 hover:border-primary/50"
          : "border-border/30 opacity-80"
      }`}
    >
      {/* Top Banner Row */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 flex items-center justify-center font-bold text-xl text-primary shadow-sm overflow-hidden">
            {drive.company_logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={drive.company_logo_url}
                alt={drive.company_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 className="w-7 h-7 text-primary" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {drive.company_name}
              </h3>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${
                  driveTypeLabels[drive.drive_type]?.color || "bg-muted text-muted-foreground"
                }`}
              >
                {driveTypeLabels[drive.drive_type]?.label || drive.drive_type}
              </span>
            </div>
            <p className="text-sm font-medium text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-primary/70" />
              {drive.role_title}
            </p>
          </div>
        </div>

        {/* CTC Highlight Box */}
        <div className="text-right bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 px-4 py-2.5 rounded-xl">
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center justify-end gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Compensation
          </div>
          <div className="text-2xl font-black text-foreground">
            ₹{drive.ctc_lpa} <span className="text-xs font-bold text-muted-foreground">LPA</span>
          </div>
          {drive.stipend_monthly ? (
            <div className="text-[11px] text-muted-foreground font-medium">
              Stipend: ₹{drive.stipend_monthly.toLocaleString()}/mo
            </div>
          ) : null}
        </div>
      </div>

      {/* Core Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4 py-3 px-3.5 rounded-xl bg-muted/40 border border-border/40 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4 text-primary shrink-0" />
          <span className="truncate">{drive.location}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Award className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Min CGPA: <strong className="text-foreground">{drive.eligibility_min_cgpa.toFixed(1)}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4 text-blue-500 shrink-0" />
          <span>Deadline: <strong className="text-foreground">{formattedDeadline}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4 text-purple-500 shrink-0" />
          <span>Drive: <strong className="text-foreground">{drive.drive_date}</strong></span>
        </div>
      </div>

      {/* Description Snippet */}
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
        {drive.job_description}
      </p>

      {/* Skills & Match Score */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-medium mb-2">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Skill Alignment Match
          </span>
          <span
            className={`font-semibold ${
              skillMatch.matchPercentage >= 70
                ? "text-emerald-500"
                : skillMatch.matchPercentage >= 40
                ? "text-amber-500"
                : "text-muted-foreground"
            }`}
          >
            {skillMatch.matchPercentage}% Matched ({skillMatch.matchedSkills.length}/{drive.skills_required.length})
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {drive.skills_required.map((skill) => {
            const isMatched = skillMatch.matchedSkills.includes(skill);
            return (
              <span
                key={skill}
                className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-colors ${
                  isMatched
                    ? "bg-primary/10 border-primary/25 text-primary dark:text-primary-foreground/90 font-semibold"
                    : "bg-muted/30 border-border/40 text-muted-foreground"
                }`}
              >
                {skill}
                {isMatched ? " ✓" : ""}
              </span>
            );
          })}
        </div>
      </div>

      {/* Expanded Details Section */}
      {expanded ? (
        <div className="mt-4 pt-4 border-t border-border/50 text-xs space-y-2 animate-in fade-in duration-200">
          <div>
            <span className="font-semibold text-foreground">Eligible Branches: </span>
            <span className="text-muted-foreground">
              {drive.allowed_departments.join(", ")}
            </span>
          </div>
          <div>
            <span className="font-semibold text-foreground">Backlogs Allowed: </span>
            <span className="text-muted-foreground">
              Maximum {drive.max_active_backlogs} active backlogs
            </span>
          </div>
          <div>
            <span className="font-semibold text-foreground">Applicants Registered: </span>
            <span className="text-muted-foreground">
              {drive.total_applicants ?? 0} campus students
            </span>
          </div>
        </div>
      ) : null}

      {/* Footer Eligibility & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border/60">
        <div className="flex items-center gap-2">
          {eligibility.isEligible ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Eligible to Apply
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20"
              title={eligibility.reasons.join(", ")}
            >
              <XCircle className="w-3.5 h-3.5" />
              Not Eligible
            </span>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 ml-1"
          >
            {expanded ? "Show Less" : "Details"}
          </button>
        </div>

        <div>
          {isApplied ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
              <CheckCircle2 className="w-4 h-4" />
              Application Submitted
            </span>
          ) : isExpired ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted px-4 py-2 rounded-xl">
              <AlertCircle className="w-4 h-4" />
              Deadline Passed
            </span>
          ) : (
            <button
              onClick={() => onApply(drive)}
              disabled={!eligibility.isEligible}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                eligibility.isEligible
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
              }`}
            >
              One-Click Apply
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
