"use client";

import React from "react";
import { AisheDcfSurvey } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ShieldCheck,
  Building,
  GraduationCap,
  Users,
  Globe2,
  DollarSign,
  Award,
  Layers,
} from "lucide-react";

interface DcfSurveyCardProps {
  survey: AisheDcfSurvey;
  onUpdateBlock?: (surveyId: string, blockKey: string, currentVal: boolean) => void;
}

export function DcfSurveyCard({ survey, onUpdateBlock }: DcfSurveyCardProps) {
  const blocks = [
    { key: "block_a_basic_info", name: "Block A: Basic Institutional Info", status: survey.block_a_basic_info, icon: Building },
    { key: "block_b_programmes", name: "Block B: Programmes & Disciplines", status: survey.block_b_programmes, icon: Layers },
    { key: "block_c_student_enrollment", name: "Block C: Student Enrollment", status: survey.block_c_student_enrollment, icon: GraduationCap },
    { key: "block_d_foreign_students", name: "Block D: Foreign & Interstate Scholars", status: survey.block_d_foreign_students, icon: Globe2 },
    { key: "block_e_staff_information", name: "Block E: Faculty Cadres & Staff", status: survey.block_e_staff_information, icon: Users },
    { key: "block_f_financial_info", name: "Block F: Financial Statements & Grants", status: survey.block_f_financial_info, icon: DollarSign },
    { key: "block_g_infrastructure", name: "Block G: Campus Infrastructure & Labs", status: survey.block_g_infrastructure, icon: ShieldCheck },
    { key: "block_h_scholarships", name: "Block H: Scholarships & Financial Aid", status: survey.block_h_scholarships, icon: Award },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved_certified":
        return {
          label: "Approved & Certified",
          className: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
        };
      case "under_verification":
        return {
          label: "Under Verification",
          className: "bg-amber-500/15 text-amber-500 border-amber-500/30",
        };
      case "submitted":
        return {
          label: "Survey Submitted",
          className: "bg-blue-500/15 text-blue-500 border-blue-500/30",
        };
      default:
        return {
          label: "Draft Preparation",
          className: "bg-slate-500/15 text-slate-400 border-slate-500/30",
        };
    }
  };

  const statusInfo = getStatusBadge(survey.status);

  return (
    <Card className="border-border/60 hover:border-border transition-all shadow-sm">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-semibold text-xs border-primary/30 text-primary">
                {survey.dcf_type}
              </Badge>
              <CardTitle className="text-lg font-bold">
                AISHE Survey Academic Cycle {survey.survey_year}
              </CardTitle>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-blue-400" />
                Deadline: {survey.submission_deadline}
              </span>
              <span>•</span>
              <span className="font-mono text-[11px] text-muted-foreground/90">
                Filing: {survey.filing_token}
              </span>
            </div>
          </div>
          <Badge className={`text-xs px-2.5 py-1 font-semibold ${statusInfo.className}`}>
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Progress Tracker */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">Data Capture Format (DCF) Completion</span>
            <span className="font-bold text-foreground">{survey.completion_percentage}%</span>
          </div>
          <Progress value={survey.completion_percentage} className="h-2" />
        </div>

        {/* DCF Blocks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {blocks.map((block) => {
            const Icon = block.icon;
            return (
              <div
                key={block.key}
                className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                  block.status
                    ? "bg-emerald-950/10 border-emerald-500/20 text-foreground"
                    : "bg-muted/40 border-border/60 text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${block.status ? "text-emerald-500" : "text-muted-foreground"}`} />
                  <span className="truncate font-medium">{block.name}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {block.status ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  )}
                  {onUpdateBlock && (
                    <button
                      onClick={() => onUpdateBlock(survey.id, block.key, block.status)}
                      className="text-[10px] underline text-blue-400 hover:text-blue-300 ml-1"
                    >
                      {block.status ? "Toggle" : "Fill"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Nodal Officer Sign-off */}
        <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
            Certified by: <span className="font-medium text-foreground">{survey.certified_by}</span>
          </span>
          <span className="text-[11px] text-muted-foreground/80">
            Form: Standard AISHE DCF-II
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
