"use client";

import React, { useState } from "react";
import { ScholarshipProgram, ScholarshipApplication } from "@/types";
import { checkScholarshipEligibility } from "@/lib/fees/fee-engine";
import {
  Award,
  Calendar,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  Clock,
} from "lucide-react";

interface ScholarshipCardProps {
  scholarships: ScholarshipProgram[];
  myApplications: ScholarshipApplication[];
  studentCgpa: number;
  studentIncome: number;
  onApplyScholarship: (scholarshipId: string) => Promise<void>;
}

export function ScholarshipCard({
  scholarships,
  myApplications,
  studentCgpa,
  studentIncome,
  onApplyScholarship,
}: ScholarshipCardProps) {
  const [applyingId, setApplyingId] = useState<string | null>(null);

  async function handleApply(scholarshipId: string) {
    setApplyingId(scholarshipId);
    try {
      await onApplyScholarship(scholarshipId);
    } finally {
      setApplyingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Institutional Grants & Financial Aid Schemes ({scholarships.length})
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Merit fellowships, governmental tuition waivers, and corporate research stipends.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {scholarships.map((sch) => {
          const application = myApplications.find((a) => a.scholarship_id === sch.id);
          const eligibility = checkScholarshipEligibility(sch, {
            cgpa: studentCgpa,
            familyIncome: studentIncome,
          });

          return (
            <div
              key={sch.id}
              className="rounded-3xl border border-border/70 bg-card/70 backdrop-blur-md p-6 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                      {sch.provider}
                    </span>
                    <h4 className="text-base font-bold text-foreground mt-0.5">{sch.title}</h4>
                  </div>
                  <div className="text-right px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <div className="text-xs font-semibold">Grant Value</div>
                    <div className="text-lg font-black">₹{sch.grant_amount.toLocaleString()}</div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {sch.description}
                </p>

                {/* Criteria Pills */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-foreground flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Eligibility Benchmarks:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-muted/60 border border-border/40 text-muted-foreground">
                      Min CGPA: <strong className="text-foreground">{sch.min_cgpa.toFixed(1)}</strong>
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-muted/60 border border-border/40 text-muted-foreground">
                      Max Income: <strong className="text-foreground">₹{(sch.max_family_income / 100000).toFixed(1)}L</strong>
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-muted/60 border border-border/40 text-muted-foreground">
                      Deadline: <strong className="text-foreground">{sch.deadline}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                <div>
                  {eligibility.isEligible ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Eligible
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1 text-xs font-medium text-rose-500"
                      title={eligibility.reasons.join(". ")}
                    >
                      <XCircle className="w-4 h-4" /> Ineligible
                    </span>
                  )}
                </div>

                <div>
                  {application ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary capitalize">
                      <Clock className="w-3.5 h-3.5" />
                      Status: {application.status.replace("_", " ")}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(sch.id)}
                      disabled={!eligibility.isEligible || applyingId === sch.id}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all shadow-sm disabled:opacity-40"
                    >
                      <span>Apply for Grant</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
