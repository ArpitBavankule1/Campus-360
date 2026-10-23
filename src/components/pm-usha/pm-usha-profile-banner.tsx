"use client";

import React from "react";
import { PmUshaInstitutionalProfile } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Landmark,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet,
  PlusCircle,
  Building2,
  CheckCircle2,
  Wallet,
  Phone,
  Mail,
  User,
} from "lucide-react";

interface PmUshaProfileBannerProps {
  profile: PmUshaInstitutionalProfile;
  onOpenProposalModal?: () => void;
  onOpenUcModal?: () => void;
}

export function PmUshaProfileBanner({
  profile,
  onOpenProposalModal,
  onOpenUcModal,
}: PmUshaProfileBannerProps) {
  const utilizationRate =
    profile.total_disbursed_grant_cr > 0
      ? Math.round(
          (profile.total_utilized_grant_cr / profile.total_disbursed_grant_cr) * 100
        )
      : 0;

  return (
    <Card className="border-border/60 bg-gradient-to-r from-emerald-950/20 via-background to-teal-950/20 shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Institutional Metadata & Header Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge className="bg-emerald-600/15 text-emerald-400 border-emerald-500/30 text-xs px-2.5 py-0.5 font-semibold">
                Ministry of Education • PM-USHA
              </Badge>
              <Badge className="bg-teal-500/15 text-teal-400 border-teal-500/30 text-xs px-2.5 py-0.5 font-semibold flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Inst Code: {profile.institutional_code}
              </Badge>
              <Badge className="bg-cyan-500/15 text-cyan-400 border-cyan-500/30 text-xs px-2.5 py-0.5 font-semibold flex items-center gap-1">
                <Landmark className="h-3 w-3" />
                PFMS: {profile.pfms_agency_code}
              </Badge>
              <Badge className="bg-purple-500/15 text-purple-400 border-purple-500/30 text-xs px-2.5 py-0.5 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {profile.current_cycle}
              </Badge>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Building2 className="h-6 w-6 text-emerald-400" />
                Pradhan Mantri Uchchatar Shiksha Abhiyan (PM-USHA) Gateway
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>{profile.shec_state}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-emerald-400" />
                  Nodal: {profile.nodal_officer_name}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  {profile.nodal_officer_email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  {profile.nodal_officer_phone}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Action Triggers */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            {onOpenProposalModal && (
              <Button
                onClick={onOpenProposalModal}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-3.5 shadow-sm flex items-center gap-1.5"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Submit DPR Proposal
              </Button>
            )}
            {onOpenUcModal && (
              <Button
                onClick={onOpenUcModal}
                variant="outline"
                size="sm"
                className="border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400 font-medium text-xs px-3.5 shadow-sm flex items-center gap-1.5"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                File GFR 12-A UC
              </Button>
            )}
          </div>
        </div>

        {/* Grant Telemetry Micro-Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-5 pt-4 border-t border-border/50">
          <div className="p-3 rounded-lg bg-card/60 border border-border/40">
            <span className="text-[11px] font-medium text-muted-foreground block flex items-center gap-1">
              <Landmark className="h-3 w-3 text-emerald-400" /> Total Approved Grant
            </span>
            <span className="text-lg font-bold text-emerald-400 mt-1 block">
              ₹{profile.total_approved_grant_cr.toFixed(2)} Cr
            </span>
            <span className="text-[10px] text-muted-foreground">Sanctioned MoE Ceiling</span>
          </div>

          <div className="p-3 rounded-lg bg-card/60 border border-border/40">
            <span className="text-[11px] font-medium text-muted-foreground block flex items-center gap-1">
              <Wallet className="h-3 w-3 text-teal-400" /> Disbursed via PFMS
            </span>
            <span className="text-lg font-bold text-teal-400 mt-1 block">
              ₹{profile.total_disbursed_grant_cr.toFixed(2)} Cr
            </span>
            <span className="text-[10px] text-muted-foreground">Central (60%) + State (40%)</span>
          </div>

          <div className="p-3 rounded-lg bg-card/60 border border-border/40">
            <span className="text-[11px] font-medium text-muted-foreground block flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-cyan-400" /> Total Utilized
            </span>
            <span className="text-lg font-bold text-cyan-400 mt-1 block">
              ₹{profile.total_utilized_grant_cr.toFixed(2)} Cr
            </span>
            <span className="text-[10px] text-muted-foreground">Verified by Statutory CA</span>
          </div>

          <div className="p-3 rounded-lg bg-card/60 border border-border/40">
            <span className="text-[11px] font-medium text-muted-foreground block flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-indigo-400" /> Utilization Rate
            </span>
            <span className="text-lg font-bold text-indigo-400 mt-1 block">
              {utilizationRate}%
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">Eligible for Next Tranche</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
