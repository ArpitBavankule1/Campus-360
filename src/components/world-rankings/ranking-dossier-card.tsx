"use client";

import React from "react";
import { WorldRankingDossier } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  BookOpen,
  Users,
  Briefcase,
  UserCheck,
} from "lucide-react";

interface RankingDossierCardProps {
  dossier: WorldRankingDossier;
}

export function RankingDossierCard({ dossier }: RankingDossierCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return {
          label: "Published & Audited",
          color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
          icon: CheckCircle2,
        };
      case "submitted_to_agency":
        return {
          label: "Submitted to Agency",
          color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
          icon: ShieldCheck,
        };
      case "vice_chancellor_approved":
        return {
          label: "VC Approved",
          color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
          icon: UserCheck,
        };
      default:
        return {
          label: "Under Internal Audit",
          color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
          icon: Clock,
        };
    }
  };

  const statusInfo = getStatusBadge(dossier.status);
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="border-border/80 bg-card/60 backdrop-blur-sm hover:shadow-md transition-all">
      <CardHeader className="pb-3 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold leading-tight">{dossier.cycle_name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs font-mono">
                  {dossier.dossier_code}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Due: {dossier.data_submission_deadline}
                </span>
              </div>
            </div>
          </div>

          <Badge className={`text-xs px-2.5 py-0.5 border flex items-center gap-1 ${statusInfo.color}`}>
            <StatusIcon className="h-3 w-3" />
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3.5 pt-1 text-xs">
        {/* Telemetry Stats Grid */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-muted/30 border border-border/50 text-center">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center justify-center gap-1 font-semibold">
              <BookOpen className="h-3 w-3 text-blue-500" />
              Scopus Papers
            </div>
            <div className="text-sm font-bold text-foreground mt-1">
              {dossier.verified_publications_count.toLocaleString()}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center justify-center gap-1 font-semibold">
              <Users className="h-3 w-3 text-purple-500" />
              Academic Peers
            </div>
            <div className="text-sm font-bold text-foreground mt-1">
              {dossier.international_academic_peers_nominated} Nominated
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center justify-center gap-1 font-semibold">
              <Briefcase className="h-3 w-3 text-amber-500" />
              Employers
            </div>
            <div className="text-sm font-bold text-foreground mt-1">
              {dossier.international_employers_nominated} Nominated
            </div>
          </div>
        </div>

        {/* Lead Compiler & Integrity Hash */}
        <div className="space-y-1.5 text-muted-foreground">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <UserCheck className="h-3.5 w-3.5 text-primary" />
              Lead Compiler: <strong className="text-foreground">{dossier.lead_compiler_name}</strong>
            </span>
            {dossier.vc_approval_date && (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                VC Approved: {dossier.vc_approval_date}
              </span>
            )}
          </div>

          {dossier.notes && (
            <p className="text-[11px] leading-relaxed italic bg-muted/20 p-2 rounded border border-border/40">
              {dossier.notes}
            </p>
          )}

          <div className="pt-2 border-t border-border/40 flex items-center justify-between font-mono text-[10px]">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="h-3 w-3" />
              SHA-256 SEAL
            </span>
            <span className="truncate max-w-[280px] text-muted-foreground">{dossier.integrity_hash}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
