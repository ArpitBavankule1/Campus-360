"use client";

import React from "react";
import { AisheInstitutionProfile } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Landmark,
  ShieldCheck,
  Award,
  Phone,
  Mail,
  UserCheck,
  Calendar,
  Building2,
  FileCheck2,
  QrCode,
} from "lucide-react";

interface AisheProfileBannerProps {
  profile: AisheInstitutionProfile;
  onViewCertificate?: () => void;
}

export function AisheProfileBanner({
  profile,
  onViewCertificate,
}: AisheProfileBannerProps) {
  return (
    <Card className="border-border/60 bg-gradient-to-r from-blue-950/20 via-background to-indigo-950/20 shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Institution Info & Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge className="bg-blue-600/15 text-blue-500 border-blue-500/30 text-xs px-2.5 py-0.5 font-semibold">
                MoE AISHE Portal
              </Badge>
              <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-xs px-2.5 py-0.5 font-semibold flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                AISHE Code: {profile.aishe_code}
              </Badge>
              <Badge className="bg-purple-500/15 text-purple-400 border-purple-500/30 text-xs px-2.5 py-0.5 font-semibold">
                Survey Year: {profile.survey_year}
              </Badge>
              <Badge className="bg-amber-500/15 text-amber-500 border-amber-500/30 text-xs px-2.5 py-0.5 font-semibold">
                Estd. {profile.year_of_establishment}
              </Badge>
            </div>

            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                <Landmark className="h-7 w-7 text-blue-500 shrink-0" />
                {profile.institution_name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-muted-foreground/70" />
                Affiliated to <span className="font-medium text-foreground">{profile.affiliating_university}</span>
                {" • "}
                <span className="capitalize">{profile.institution_type.replace(/_/g, " ")}</span>
              </p>
            </div>

            {/* Cryptographic & Verification Dockets */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1">
                <FileCheck2 className="h-3.5 w-3.5 text-emerald-500" />
                Cert Token: <span className="font-mono text-foreground font-semibold">{profile.certificate_token}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-blue-400" />
                MoE Certified: {profile.moe_approval_date}
              </span>
              <span className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground/80 truncate max-w-[280px]">
                Hash: {profile.verification_hash}
              </span>
            </div>
          </div>

          {/* Nodal Officer Contact & Action */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 p-4 rounded-xl bg-card/60 border border-border/60 shrink-0">
            <div className="space-y-1 text-left lg:text-right">
              <div className="text-xs text-muted-foreground flex items-center lg:justify-end gap-1 font-medium">
                <UserCheck className="h-3.5 w-3.5 text-indigo-400" />
                AISHE Institutional Nodal Officer
              </div>
              <div className="font-semibold text-sm text-foreground">{profile.nodal_officer_name}</div>
              <div className="flex flex-col text-xs text-muted-foreground space-y-0.5">
                <a
                  href={`mailto:${profile.nodal_officer_email}`}
                  className="flex items-center lg:justify-end gap-1 hover:text-blue-400 transition-colors"
                >
                  <Mail className="h-3 w-3" />
                  {profile.nodal_officer_email}
                </a>
                <span className="flex items-center lg:justify-end gap-1">
                  <Phone className="h-3 w-3" />
                  {profile.nodal_officer_phone}
                </span>
              </div>
            </div>

            <Button
              onClick={onViewCertificate}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-sm transition-all text-xs h-9 px-4 gap-1.5 w-full sm:w-auto"
            >
              <Award className="h-3.5 w-3.5" />
              View MoE Certificate
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
