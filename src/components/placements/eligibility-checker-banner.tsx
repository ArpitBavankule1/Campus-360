"use client";

import React from "react";
import { StudentPlacementProfile } from "@/lib/placements/placement-engine";
import {
  UserCheck,
  GraduationCap,
  Sparkles,
  Filter,
  CheckCircle,
  Briefcase,
  Layers,
} from "lucide-react";

interface EligibilityCheckerBannerProps {
  student: StudentPlacementProfile;
  filterOnlyEligible: boolean;
  onToggleOnlyEligible: (val: boolean) => void;
  selectedDepartment: string;
  onSelectDepartment: (dept: string) => void;
  selectedType: string;
  onSelectType: (type: string) => void;
  totalDrivesCount: number;
  eligibleDrivesCount: number;
}

export function EligibilityCheckerBanner({
  student,
  filterOnlyEligible,
  onToggleOnlyEligible,
  selectedDepartment,
  onSelectDepartment,
  selectedType,
  onSelectType,
  totalDrivesCount,
  eligibleDrivesCount,
}: EligibilityCheckerBannerProps) {
  const departments = ["ALL", "CSE", "IT", "ECE", "EEE", "MECH"];
  const driveTypes = [
    { id: "ALL", label: "All Formats" },
    { id: "full_time", label: "Full Time (FTE)" },
    { id: "internship", label: "Internships" },
    { id: "intern_to_fte", label: "Intern-to-FTE" },
  ];

  return (
    <div className="rounded-2xl border border-border/70 bg-gradient-to-r from-card via-card/80 to-primary/5 p-6 backdrop-blur-md shadow-sm space-y-5">
      {/* Top Profile Summary Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">{student.fullName}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/15 text-primary font-semibold">
                {student.rollNumber}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1 font-medium">
                <GraduationCap className="w-3.5 h-3.5 text-primary" />
                Department: <strong className="text-foreground">{student.department}</strong>
              </span>
              <span>•</span>
              <span>
                CGPA: <strong className="text-emerald-500 font-bold">{student.cgpa.toFixed(2)}</strong>
              </span>
              <span>•</span>
              <span>
                Backlogs: <strong className="text-foreground">{student.activeBacklogs}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Eligibility Counter */}
        <div className="flex items-center gap-3 bg-background/80 border border-border/60 px-4 py-2 rounded-xl text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>
              Eligible for <strong className="text-foreground font-bold">{eligibleDrivesCount}</strong> of{" "}
              {totalDrivesCount} drives
            </span>
          </div>
          <button
            onClick={() => onToggleOnlyEligible(!filterOnlyEligible)}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
              filterOnlyEligible
                ? "bg-emerald-500 text-white shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {filterOnlyEligible ? "Showing Eligible Only ✓" : "Filter Eligible Only"}
          </button>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/50 text-xs">
        {/* Drive Type Selectors */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-muted-foreground mr-1 flex items-center gap-1 font-medium">
            <Briefcase className="w-3.5 h-3.5" /> Type:
          </span>
          {driveTypes.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectType(t.id)}
              className={`px-3 py-1 rounded-lg border font-medium transition-colors ${
                selectedType === t.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/40 border-border/40 text-muted-foreground hover:bg-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Department Selectors */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-muted-foreground mr-1 flex items-center gap-1 font-medium">
            <Layers className="w-3.5 h-3.5" /> Branch:
          </span>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => onSelectDepartment(dept)}
              className={`px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                selectedDepartment === dept
                  ? "bg-primary text-primary-foreground border-primary font-bold"
                  : "bg-muted/40 border-border/40 text-muted-foreground hover:bg-muted"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
