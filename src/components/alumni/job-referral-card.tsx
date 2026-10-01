"use client";

import React, { useState } from "react";
import { AlumniJobReferral } from "@/types";
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Tag,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobReferralCardProps {
  referral: AlumniJobReferral;
  onApplyReferral?: (referral: AlumniJobReferral) => void;
}

export function JobReferralCard({
  referral,
  onApplyReferral,
}: JobReferralCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referral.referral_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getJobTypeBadge = () => {
    switch (referral.job_type) {
      case "full_time":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "internship":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "remote":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      default:
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    }
  };

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm space-y-4 transition-all hover:border-primary/40 hover:shadow-md flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getJobTypeBadge()}`}
            >
              {referral.job_type.replace("_", " ")}
            </span>
            <h4 className="text-base font-bold text-foreground truncate mt-1">
              {referral.role_title}
            </h4>
            <p className="text-xs font-semibold text-primary flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              {referral.company}
            </p>
          </div>
        </div>

        {/* Compensation & Location */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground pt-1 border-t border-border/40">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="truncate">{referral.location}</span>
          </div>
          {referral.salary_range && (
            <div className="flex items-center gap-1.5 truncate text-emerald-600 dark:text-emerald-400 font-medium">
              <DollarSign className="w-3.5 h-3.5" />
              <span className="truncate">{referral.salary_range}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground/90 line-clamp-3 leading-relaxed">
          {referral.description}
        </p>

        {/* Referral Code Box */}
        <div className="p-2.5 rounded-2xl bg-muted/50 border border-border/60 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground">Alumni Referral Code</p>
            <p className="text-xs font-mono font-bold text-foreground tracking-wide">
              {referral.referral_code}
            </p>
          </div>
          <button
            onClick={handleCopyCode}
            className="p-1.5 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground transition-all"
            title="Copy referral code"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground">
          Referred by {referral.alumni_name}
        </span>
        {referral.apply_url ? (
          <a
            href={referral.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all"
          >
            Apply Now
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <Button
            size="sm"
            className="rounded-xl text-xs"
            onClick={() => onApplyReferral?.(referral)}
          >
            Request Referral
          </Button>
        )}
      </div>
    </div>
  );
}
