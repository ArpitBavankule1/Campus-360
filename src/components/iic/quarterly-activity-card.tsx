"use client";

import React from "react";
import { IicQuarterlyActivity } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  Award,
  FileCheck2,
  ExternalLink,
  DollarSign,
  UserCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface QuarterlyActivityCardProps {
  activity: IicQuarterlyActivity;
}

export function QuarterlyActivityCard({ activity }: QuarterlyActivityCardProps) {
  const getCategoryMeta = (cat: string) => {
    switch (cat) {
      case "mic_driven":
        return {
          label: "MoE / MIC Driven Mandatory",
          color: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
        };
      case "calendar_activity":
        return {
          label: "IIC Calendar Activity",
          color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
        };
      case "celebration_activity":
        return {
          label: "Celebration Activity",
          color: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
        };
      case "self_driven":
        return {
          label: "Self-Driven Initiative",
          color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        };
      default:
        return {
          label: "General Activity",
          color: "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30",
        };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified_approved":
        return {
          label: "MIC Verified & Scored",
          icon: CheckCircle2,
          color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        };
      case "report_submitted":
        return {
          label: "Report Submitted",
          icon: Clock,
          color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
        };
      case "scheduled":
        return {
          label: "Scheduled",
          icon: Calendar,
          color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        };
      default:
        return {
          label: "Draft",
          icon: Clock,
          color: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
        };
    }
  };

  const catMeta = getCategoryMeta(activity.category);
  const statusMeta = getStatusBadge(activity.status);
  const StatusIcon = statusMeta.icon;

  return (
    <Card className="overflow-hidden border border-border/60 hover:border-primary/40 hover:shadow-md transition-all duration-200 bg-card">
      <CardContent className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border-primary/20"
            >
              {activity.quarter}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${catMeta.color}`}
            >
              {catMeta.label}
            </Badge>
          </div>
          <Badge
            variant="outline"
            className={`text-[11px] font-medium flex items-center gap-1 px-2 py-0.5 rounded-full ${statusMeta.color}`}
          >
            <StatusIcon className="w-3 h-3" />
            {statusMeta.label}
          </Badge>
        </div>

        <h3 className="text-base font-bold text-foreground leading-snug tracking-tight mb-2">
          {activity.title}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3 p-2.5 rounded-lg bg-muted/40 text-xs">
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-mono">
              Dates
            </span>
            <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3 text-primary" />
              {activity.start_date === activity.end_date
                ? activity.start_date
                : `${activity.start_date} - ${activity.end_date}`}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-mono">
              Participants
            </span>
            <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
              <Users className="w-3 h-3 text-indigo-500" />
              {activity.participant_count} (
              <span className="text-muted-foreground">{activity.faculty_participant_count} Fac</span>)
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-mono">
              MIC Points
            </span>
            <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
              <Award className="w-3 h-3 text-amber-500" />
              +{activity.mic_reward_points} Pts
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-mono">
              Expenditure
            </span>
            <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
              <DollarSign className="w-3 h-3 text-emerald-500" />
              ₹{(activity.expenditure_inr / 1000).toFixed(0)}k
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border/40 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <FileCheck2 className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-foreground/80 font-medium">Token:</span>
            <span className="text-primary font-bold">{activity.mic_verification_token}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground">
              Coord: <strong className="text-foreground font-medium">{activity.coordinator_name}</strong>
            </span>
            {activity.report_url && (
              <a
                href={activity.report_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline ml-1"
              >
                MIC Report
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
