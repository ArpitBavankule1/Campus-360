"use client";

import React from "react";
import { StudentHealthProfile } from "@/types";
import {
  HeartPulse,
  Droplet,
  AlertTriangle,
  Phone,
  Shield,
  User,
  Activity,
  FileCheck,
} from "lucide-react";

interface HealthProfileSummaryProps {
  profile: StudentHealthProfile;
}

export function HealthProfileSummary({ profile }: HealthProfileSummaryProps) {
  return (
    <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card/90 to-rose-500/5 p-6 shadow-sm transition-all hover:border-rose-500/30">
      <div className="flex items-center justify-between border-b border-border/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              Electronic Health Record (EHR)
            </h3>
            <p className="text-xs text-muted-foreground">
              Verified clinical bio-metrics & emergency health profile
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
          <FileCheck className="w-3.5 h-3.5" />
          Medically Cleared
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-5">
        <div className="p-3 rounded-2xl bg-muted/40 border border-border/40">
          <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Droplet className="w-3.5 h-3.5 text-rose-500" />
            Blood Group
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {profile.blood_group}
          </div>
          <div className="text-[11px] text-muted-foreground">Universal recipient/donor</div>
        </div>

        <div className="p-3 rounded-2xl bg-muted/40 border border-border/40">
          <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            Clinical Allergies
          </div>
          <div className="text-base font-bold text-foreground mt-1 truncate">
            {profile.allergies.length > 0 ? profile.allergies.join(", ") : "None Recorded"}
          </div>
          <div className="text-[11px] text-amber-600 font-medium">Critical Triage Alert</div>
        </div>

        <div className="p-3 rounded-2xl bg-muted/40 border border-border/40">
          <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-blue-500" />
            Chronic Record
          </div>
          <div className="text-base font-bold text-foreground mt-1 truncate">
            {profile.chronic_conditions.length > 0 ? profile.chronic_conditions[0] : "None"}
          </div>
          <div className="text-[11px] text-muted-foreground">Monitored bi-annually</div>
        </div>

        <div className="p-3 rounded-2xl bg-muted/40 border border-border/40">
          <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            Student Insurance
          </div>
          <div className="text-sm font-bold text-foreground mt-1 font-mono">
            {profile.insurance_policy_no || "APEX-2025-MED"}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Cashless ₹2,00,000 Cover
          </div>
        </div>
      </div>

      {/* Emergency Contact Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/40 text-xs">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Emergency Contact:</span>
          <span className="font-semibold text-foreground">{profile.emergency_contact_name}</span>
          <span className="text-muted-foreground">({profile.emergency_contact_relation})</span>
        </div>

        <a
          href={`tel:${profile.emergency_contact_phone.replace(/\s+/g, "")}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background border border-border/60 hover:border-primary/40 text-primary font-semibold transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>{profile.emergency_contact_phone}</span>
        </a>
      </div>
    </div>
  );
}
