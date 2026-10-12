"use client";

import React, { useState } from "react";
import {
  IqacCriterionMetric,
  IqacAqarReport,
  IqacAcademicAudit,
  IqacBestPractice,
  NaacCriterionCode,
  AuditType,
} from "@/types";
import {
  MOCK_IQAC_CRITERIA,
  MOCK_AQAR_REPORTS,
  MOCK_ACADEMIC_AUDITS,
  MOCK_BEST_PRACTICES,
  getIqacOverviewStats,
  calculateProjectedCgpa,
} from "@/lib/iqac/iqac-engine";
import {
  CriterionMetricCard,
  AqarReportCard,
  AcademicAuditCard,
  BestPracticeCard,
  AqarSubmissionModal,
  AuditScheduleModal,
  IqacVerifyModal,
} from "@/components/iqac";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Award,
  Building2,
  CheckCircle2,
  FileText,
  Search,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Users,
  PlusCircle,
  Clock,
  BarChart3,
  Calendar,
  Globe2,
} from "lucide-react";

export default function IqacAccreditationPortalPage() {
  const [criteria, setCriteria] = useState<IqacCriterionMetric[]>(MOCK_IQAC_CRITERIA);
  const [aqarReports, setAqarReports] = useState<IqacAqarReport[]>(MOCK_AQAR_REPORTS);
  const [audits, setAudits] = useState<IqacAcademicAudit[]>(MOCK_ACADEMIC_AUDITS);
  const [bestPractices] = useState<IqacBestPractice[]>(MOCK_BEST_PRACTICES);

  const [activeTab, setActiveTab] = useState<
    "overview" | "criteria" | "aqar" | "audits" | "best_practices"
  >("overview");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCriterionFilter, setSelectedCriterionFilter] = useState<string>("all");
  const [selectedAuditTypeFilter, setSelectedAuditTypeFilter] = useState<string>("all");

  // Modals state
  const [isAqarModalOpen, setIsAqarModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [tokenToVerify, setTokenToVerify] = useState("");

  const { projectedCgpa, grade } = calculateProjectedCgpa(criteria);

  const avgReadiness =
    Math.round(
      (criteria.reduce((acc, c) => acc + c.ssr_readiness_percentage, 0) /
        criteria.length) *
        10
    ) / 10;

  const handleVerify = (token: string) => {
    setTokenToVerify(token);
    setIsVerifyModalOpen(true);
  };

  const handleAqarSubmitted = (newReport: IqacAqarReport) => {
    setAqarReports([newReport, ...aqarReports]);
  };

  const handleAuditScheduled = (newAudit: IqacAcademicAudit) => {
    setAudits([newAudit, ...audits]);
  };

  // Filter criteria
  const filteredCriteria = criteria.filter((c) => {
    const matchesSearch =
      c.criterion_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lead_evaluator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.criterion_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedCriterionFilter === "all" || c.criterion_code === selectedCriterionFilter;
    return matchesSearch && matchesFilter;
  });

  // Filter audits
  const filteredAudits = audits.filter((a) => {
    const matchesSearch =
      a.audit_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.target_department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.lead_external_auditor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.audit_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedAuditTypeFilter === "all" || a.audit_type === selectedAuditTypeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 md:p-10 shadow-xl border border-indigo-500/20">
        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-400/30 text-xs px-3 py-1 font-mono">
              Phase 47: Institutional Quality Gateway
            </Badge>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs px-3 py-1 font-mono">
              NAAC Cycle-4 & NIRF Top 25
            </Badge>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Internal Quality Assurance Cell (IQAC)
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl">
            Centralized institutional accreditation registry governing NAAC 7 Criteria benchmarks,
            Annual Quality Assurance Reports (AQAR), external Academic & Administrative Audits (AAA),
            and verifiable institutional compliance credentials.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              size="sm"
              onClick={() => {
                setTokenToVerify("CL-IQAC-COMP-2026-9042");
                setIsVerifyModalOpen(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              Verify Institutional Compliance
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAqarModalOpen(true)}
              className="border-slate-500 text-slate-200 hover:bg-slate-800 text-xs flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              File AQAR Docket
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAuditModalOpen(true)}
              className="border-slate-500 text-slate-200 hover:bg-slate-800 text-xs flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              Schedule AAA Audit
            </Button>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/80 bg-card/60 backdrop-blur">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Projected NAAC CGPA</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-foreground">
                  {projectedCgpa.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground">/ 4.00</span>
              </div>
              <Badge className="mt-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs">
                Grade {grade} Accreditation
              </Badge>
            </div>
            <div className="w-11 h-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/60 backdrop-blur">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">SSR Overall Readiness</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-foreground">
                  {avgReadiness}%
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                DVV Documents Verified
              </p>
            </div>
            <div className="w-11 h-11 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/60 backdrop-blur">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">AQAR Annual Dockets</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-foreground">
                  {aqarReports.length}
                </span>
                <span className="text-xs text-muted-foreground">filed cycles</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">
                {aqarReports.filter((a) => a.aqar_status === "submitted_naac").length} Submitted to NAAC
              </p>
            </div>
            <div className="w-11 h-11 bg-indigo-500/10 text-indigo-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/60 backdrop-blur">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Academic Audits (AAA)</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-foreground">
                  {audits.length}
                </span>
                <span className="text-xs text-muted-foreground">inspections</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">
                IIT & BEE Peer Reviewed
              </p>
            </div>
            <div className="w-11 h-11 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-border/60 pb-3">
        <Button
          variant={activeTab === "overview" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("overview")}
          className="text-xs flex items-center gap-1.5"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Accreditation Overview
        </Button>
        <Button
          variant={activeTab === "criteria" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("criteria")}
          className="text-xs flex items-center gap-1.5"
        >
          <Award className="w-3.5 h-3.5" />
          NAAC 7 Criteria ({criteria.length})
        </Button>
        <Button
          variant={activeTab === "aqar" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("aqar")}
          className="text-xs flex items-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          AQAR Reports ({aqarReports.length})
        </Button>
        <Button
          variant={activeTab === "audits" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("audits")}
          className="text-xs flex items-center gap-1.5"
        >
          <Building2 className="w-3.5 h-3.5" />
          AAA Audits ({audits.length})
        </Button>
        <Button
          variant={activeTab === "best_practices" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("best_practices")}
          className="text-xs flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Best Practices ({bestPractices.length})
        </Button>
      </div>

      {/* Tab: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Accreditation Standing Card */}
            <Card className="lg:col-span-2 border-border/80">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    NAAC Cycle-4 Institutional Standing & Criteria Realization
                  </CardTitle>
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs">
                    Target: CGPA 3.90
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {criteria.map((c) => {
                    const pct = Math.round((c.current_score / c.max_weightage) * 100);
                    return (
                      <div
                        key={c.id}
                        className="p-3 rounded-lg bg-muted/30 border border-border/60 space-y-1.5"
                      >
                        <div className="flex items-center justify-between font-medium">
                          <span className="truncate text-foreground">{c.criterion_title}</span>
                          <span className="font-mono text-muted-foreground">{pct}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                          <span>Weight: {c.max_weightage}</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {c.current_score} pts
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* NIRF Benchmarking Card */}
            <Card className="border-border/80">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-500" />
                  NIRF Benchmark Matrix
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-muted/40 border border-border/60 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Teaching, Learning & Resources (TLR)</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">84.2 / 100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Research & Professional Practice (RPC)</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">78.6 / 100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Graduation Outcomes (GO)</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">89.4 / 100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Outreach and Inclusivity (OI)</span>
                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400">81.2 / 100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Peer Perception (PR)</span>
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400">85.0 / 100</span>
                  </div>
                </div>

                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-900 dark:text-indigo-300">
                  <div className="flex items-center justify-between font-bold">
                    <span>Overall NIRF Score:</span>
                    <span className="font-mono text-sm">83.68</span>
                  </div>
                  <p className="text-[11px] mt-1 text-muted-foreground">
                    Projected All-India Ranking Band: 18 - 24 (Engineering / Overall).
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab: Criteria */}
      {activeTab === "criteria" && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search criterion or evaluator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-input bg-background"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedCriterionFilter}
                onChange={(e) => setSelectedCriterionFilter(e.target.value)}
                className="h-8 text-xs rounded-md border border-input bg-background px-2"
              >
                <option value="all">All 7 Criteria</option>
                <option value="CRITERION_1">Criterion 1: Curricular Aspects</option>
                <option value="CRITERION_2">Criterion 2: Teaching-Learning</option>
                <option value="CRITERION_3">Criterion 3: Research & Extension</option>
                <option value="CRITERION_4">Criterion 4: Infrastructure</option>
                <option value="CRITERION_5">Criterion 5: Student Support</option>
                <option value="CRITERION_6">Criterion 6: Governance</option>
                <option value="CRITERION_7">Criterion 7: Institutional Values</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCriteria.map((c) => (
              <CriterionMetricCard
                key={c.id}
                criterion={c}
                onUpdateScore={(crit) => {
                  alert(`Calibrating ${crit.criterion_title}. Updating SSR dossier.`);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab: AQAR */}
      {activeTab === "aqar" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-foreground">Annual Quality Assurance Reports</h2>
              <p className="text-xs text-muted-foreground">
                Statutory mandatory annual returns submitted to the NAAC portal.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsAqarModalOpen(true)}
              className="text-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" /> File New AQAR Docket
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aqarReports.map((r) => (
              <AqarReportCard key={r.id} report={r} onVerify={handleVerify} />
            ))}
          </div>
        </div>
      )}

      {/* Tab: AAA Audits */}
      {activeTab === "audits" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Academic & Administrative Audits (AAA)
              </h2>
              <p className="text-xs text-muted-foreground">
                External peer inspections conducted by emeritus IIT/BEE council auditors.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedAuditTypeFilter}
                onChange={(e) => setSelectedAuditTypeFilter(e.target.value)}
                className="h-8 text-xs rounded-md border border-input bg-background px-2"
              >
                <option value="all">All Audit Categories</option>
                <option value="academic">Academic Audit</option>
                <option value="administrative">Administrative Audit</option>
                <option value="green_energy">Green Energy Audit</option>
              </select>
              <Button
                size="sm"
                onClick={() => setIsAuditModalOpen(true)}
                className="text-xs flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Schedule Audit
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAudits.map((a) => (
              <AcademicAuditCard key={a.id} audit={a} onVerify={handleVerify} />
            ))}
          </div>
        </div>
      )}

      {/* Tab: Best Practices */}
      {activeTab === "best_practices" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Institutional Best Practices & Distinctiveness
            </h2>
            <p className="text-xs text-muted-foreground">
              Core institutional distinctiveness dockets under NAAC Criterion VII and UN SDGs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bestPractices.map((bp) => (
              <BestPracticeCard key={bp.id} practice={bp} onVerify={handleVerify} />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <AqarSubmissionModal
        isOpen={isAqarModalOpen}
        onClose={() => setIsAqarModalOpen(false)}
        onSubmit={handleAqarSubmitted}
      />

      <AuditScheduleModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        onSubmit={handleAuditScheduled}
      />

      <IqacVerifyModal
        isOpen={isVerifyModalOpen}
        onClose={() => {
          setIsVerifyModalOpen(false);
          setTokenToVerify("");
        }}
        initialToken={tokenToVerify}
      />
    </div>
  );
}
