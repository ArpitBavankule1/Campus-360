"use client";

import React from "react";
import { IicCouncilMember } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Briefcase,
  Mail,
  GraduationCap,
  Sparkles,
  Building,
  UserCheck,
} from "lucide-react";

interface CouncilMemberCardProps {
  member: IicCouncilMember;
}

export function CouncilMemberCard({ member }: CouncilMemberCardProps) {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "president":
        return {
          label: "Council President",
          color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
        };
      case "convener":
        return {
          label: "Council Convener",
          color: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
        };
      case "ipr_coordinator":
        return {
          label: "IPR Activity Coordinator",
          color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
        };
      case "startup_coordinator":
        return {
          label: "Startup Activity Coordinator",
          color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        };
      case "nirf_ariia_coordinator":
        return {
          label: "ARIIA / NIRF Coordinator",
          color: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
        };
      case "external_expert":
        return {
          label: "External Angel Investor / Industry",
          color: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
        };
      case "student_lead":
        return {
          label: "Student Innovation Lead",
          color: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
        };
      default:
        return {
          label: "Executive Member",
          color: "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30",
        };
    }
  };

  const roleMeta = getRoleBadge(member.role);

  return (
    <Card className="overflow-hidden border border-border/60 hover:border-primary/40 hover:shadow-md transition-all duration-200 bg-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <Badge
              variant="outline"
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${roleMeta.color}`}
            >
              {roleMeta.label}
            </Badge>
            <h3 className="text-base font-bold text-foreground mt-2 tracking-tight">
              {member.name}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Briefcase className="w-3.5 h-3.5 text-primary" />
              {member.designation}
            </p>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] uppercase font-mono tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
          >
            Active
          </Badge>
        </div>

        <div className="space-y-2 mt-4 pt-3 border-t border-border/40 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
            <span className="font-medium text-foreground">{member.department}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
            <a
              href={`mailto:${member.email}`}
              className="text-primary hover:underline truncate"
            >
              {member.email}
            </a>
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1 font-mono">
              <Sparkles className="w-3 h-3 text-amber-500" />
              {member.tenure_year}
            </span>
            <span className="capitalize font-medium text-foreground/80">
              {member.member_type.replace("_", " ")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
