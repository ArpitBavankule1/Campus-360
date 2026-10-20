"use client";

import React from "react";
import { AisheFinancialStatement } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  FileCheck,
  Calendar,
  Building2,
  ShieldCheck,
  PieChart,
} from "lucide-react";

interface FinancialStatementCardProps {
  statements: AisheFinancialStatement[];
}

export function FinancialStatementCard({ statements }: FinancialStatementCardProps) {
  const latest = statements[0];
  if (!latest) return null;

  const formatCrores = (amount: number) => {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  };

  const surplus = latest.total_income_inr - latest.total_expenditure_inr;

  return (
    <div className="space-y-6">
      {/* Top Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium">Total Institutional Income</span>
              <div className="text-2xl font-bold text-emerald-500">{formatCrores(latest.total_income_inr)}</div>
              <span className="text-[11px] text-muted-foreground">FY {latest.financial_year} Audited Revenue</span>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium">Total Operational Outlay</span>
              <div className="text-2xl font-bold text-blue-500">{formatCrores(latest.total_expenditure_inr)}</div>
              <span className="text-[11px] text-muted-foreground">Salary, Capex & Infrastructure</span>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium">Faculty & Staff Salaries</span>
              <div className="text-2xl font-bold text-indigo-500">
                {formatCrores(latest.faculty_salary_expenditure_inr + latest.non_teaching_salary_expenditure_inr)}
              </div>
              <span className="text-[11px] text-muted-foreground">
                {(( (latest.faculty_salary_expenditure_inr + latest.non_teaching_salary_expenditure_inr) / latest.total_expenditure_inr ) * 100).toFixed(1)}% of Total Expenditure
              </span>
            </div>
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
              <Building2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium">Annual Fiscal Reserve / Surplus</span>
              <div className="text-2xl font-bold text-amber-500">{formatCrores(surplus)}</div>
              <span className="text-[11px] text-muted-foreground">Audited Balance Reinvested</span>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
              <PieChart className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Income & Expenditure Block Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Breakdown */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Block F: Sources of Institutional Income
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center text-xs py-1.5 border-b border-border/30">
              <span className="text-muted-foreground">Government Recurring Grants</span>
              <span className="font-mono font-semibold text-foreground">{formatCrores(latest.recurring_grants_gov_inr)}</span>
            </div>
            <div className="flex justify-between items-center text-xs py-1.5 border-b border-border/30">
              <span className="text-muted-foreground">Government Non-Recurring / Research Grants</span>
              <span className="font-mono font-semibold text-foreground">{formatCrores(latest.non_recurring_grants_inr)}</span>
            </div>
            <div className="flex justify-between items-center text-xs py-1.5 border-b border-border/30">
              <span className="text-muted-foreground">Tuition & Academic Fees</span>
              <span className="font-mono font-semibold text-foreground">{formatCrores(latest.tuition_fee_income_inr)}</span>
            </div>
            <div className="flex justify-between items-center text-xs py-1.5 border-b border-border/30">
              <span className="text-muted-foreground">Endowment, Consultancy & CSR Grants</span>
              <span className="font-mono font-semibold text-foreground">{formatCrores(latest.other_income_inr)}</span>
            </div>
            <div className="flex justify-between items-center text-xs pt-2 font-bold text-foreground">
              <span>Total Revenue Receipts</span>
              <span className="font-mono text-emerald-500 text-sm">{formatCrores(latest.total_income_inr)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Expenditure Breakdown */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              Block F: Operational & Capital Expenditure
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center text-xs py-1.5 border-b border-border/30">
              <span className="text-muted-foreground">Teaching Faculty Salary Disbursements</span>
              <span className="font-mono font-semibold text-foreground">{formatCrores(latest.faculty_salary_expenditure_inr)}</span>
            </div>
            <div className="flex justify-between items-center text-xs py-1.5 border-b border-border/30">
              <span className="text-muted-foreground">Administrative & Technical Staff Salaries</span>
              <span className="font-mono font-semibold text-foreground">{formatCrores(latest.non_teaching_salary_expenditure_inr)}</span>
            </div>
            <div className="flex justify-between items-center text-xs py-1.5 border-b border-border/30">
              <span className="text-muted-foreground">Laboratory Equipment Capex</span>
              <span className="font-mono font-semibold text-foreground">{formatCrores(latest.laboratory_capex_inr)}</span>
            </div>
            <div className="flex justify-between items-center text-xs py-1.5 border-b border-border/30">
              <span className="text-muted-foreground">Library & Digital E-Resource Capex</span>
              <span className="font-mono font-semibold text-foreground">{formatCrores(latest.library_capex_inr)}</span>
            </div>
            <div className="flex justify-between items-center text-xs py-1.5 border-b border-border/30">
              <span className="text-muted-foreground">Institutional Merit Scholarships Awarded</span>
              <span className="font-mono font-semibold text-foreground">{formatCrores(latest.scholarships_distributed_inr)}</span>
            </div>
            <div className="flex justify-between items-center text-xs pt-2 font-bold text-foreground">
              <span>Total Expenditure Incurred</span>
              <span className="font-mono text-blue-400 text-sm">{formatCrores(latest.total_expenditure_inr)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statutory Auditor Sign-off Docket */}
      <Card className="border-border/60 bg-muted/20">
        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Statutory Chartered Accountant Audit Certification
            </div>
            <div className="text-muted-foreground">
              Auditor: <span className="font-medium text-foreground">{latest.ca_auditor_name}</span>
            </div>
          </div>
          <div className="flex flex-col sm:items-end gap-1 font-mono text-[11px]">
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 font-bold">
              {latest.audited_udin_token}
            </Badge>
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Audit Date: {latest.audit_date}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
