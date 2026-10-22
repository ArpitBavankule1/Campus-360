"use client";

import React, { useState } from "react";
import { SamarthCasApplication } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  FileCheck2,
  PlusCircle,
  Search,
  SlidersHorizontal,
} from "lucide-react";

interface CasPromotionLedgerCardProps {
  applications: SamarthCasApplication[];
  onSubmitCas?: () => void;
  onUpdateStatus?: (casToken: string, status: any) => void;
}

export function CasPromotionLedgerCard({
  applications,
  onSubmitCas,
  onUpdateStatus,
}: CasPromotionLedgerCardProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const statusBadges: Record<string, string> = {
    DRAFT: "bg-slate-500/15 text-slate-400 border-slate-500/30",
    SUBMITTED: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    UNDER_SCRUTINY: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    COMMITTEE_APPROVED: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    GAZETTED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    REJECTED: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  };

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.faculty_name.toLowerCase().includes(search.toLowerCase()) ||
      app.department.toLowerCase().includes(search.toLowerCase()) ||
      app.cas_token.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-500" />
              Faculty Career Advancement Scheme (CAS) & API Ledger
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              UGC 7th CPC Career Advancement Scheme promotion e-dossiers, Academic Performance Indicator (API) scores & gazette orders
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={onSubmitCas}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8"
            >
              <PlusCircle className="h-3.5 w-3.5 mr-1" />
              Apply for CAS Promotion
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {["ALL", "SUBMITTED", "UNDER_SCRUTINY", "COMMITTEE_APPROVED", "GAZETTED"].map((st) => (
            <Button
              key={st}
              variant={statusFilter === st ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(st)}
              className={`text-xs h-7 px-2.5 ${
                statusFilter === st
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "border-border/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {st.replace("_", " ")}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="p-4 rounded-lg border border-border/60 bg-card/60 hover:border-indigo-500/30 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-sm text-foreground">{app.faculty_name}</h3>
                  <p className="text-xs text-muted-foreground">{app.department}</p>
                </div>
                <Badge className={`text-[10px] uppercase font-semibold px-2 py-0.5 ${statusBadges[app.status]}`}>
                  {app.status.replace("_", " ")}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded border border-border/40">
                <span className="font-semibold text-foreground/90">{app.current_stage}</span>
                <span className="text-indigo-400 font-bold">➔</span>
                <span className="font-semibold text-indigo-400">{app.target_stage}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                <div className="p-2 rounded bg-muted/20 border border-border/30">
                  <p className="text-[10px] text-muted-foreground">API Claimed</p>
                  <p className="text-sm font-bold text-foreground mt-0.5">{app.api_score_claimed}</p>
                </div>
                <div className="p-2 rounded bg-muted/20 border border-border/30">
                  <p className="text-[10px] text-muted-foreground">API Verified</p>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5">{app.api_score_verified}</p>
                </div>
                <div className="p-2 rounded bg-muted/20 border border-border/30">
                  <p className="text-[10px] text-muted-foreground">Publications</p>
                  <p className="text-sm font-bold text-indigo-400 mt-0.5">{app.publications_count}</p>
                </div>
              </div>

              {app.scrutiny_notes && (
                <p className="text-xs text-muted-foreground/90 bg-muted/20 p-2 rounded border border-border/30 line-clamp-2 italic">
                  &ldquo;{app.scrutiny_notes}&rdquo;
                </p>
              )}

              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono pt-1 border-t border-border/40">
                <span>{app.cas_token}</span>
                {app.gazette_notification_number ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <FileCheck2 className="h-3 w-3" /> {app.gazette_notification_number}
                  </span>
                ) : (
                  <span>Submitted: {app.submission_date}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
