"use client";

import React, { useState } from "react";
import {
  NbaProgram,
  NbaProgramOutcome,
  NbaCourseOutcome,
  NbaSarDossier,
  NbaEvaluationVisit,
} from "@/types";
import {
  MOCK_NBA_PROGRAMS,
  MOCK_PROGRAM_OUTCOMES,
  MOCK_COURSE_OUTCOMES,
  MOCK_NBA_SAR_DOSSIERS,
  MOCK_NBA_VISITS,
  getNbaStats,
} from "@/lib/nba/nba-engine";
import {
  NbaProgramCard,
  CoPoMatrixCard,
  SarDossierCard,
  SarFilingModal,
  CoAttainmentModal,
  NbaVerifyModal,
} from "@/components/nba";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  ShieldCheck,
  Target,
  FileText,
  Search,
  PlusCircle,
  BarChart3,
  Layers,
  Award,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Calculator,
  UserCheck,
} from "lucide-react";

export default function NbaAccreditationPortalPage() {
  const [programs, setPrograms] = useState<NbaProgram[]>(MOCK_NBA_PROGRAMS);
  const [programOutcomes] = useState<NbaProgramOutcome[]>(MOCK_PROGRAM_OUTCOMES);
  const [courseOutcomes, setCourseOutcomes] = useState<NbaCourseOutcome[]>(MOCK_COURSE_OUTCOMES);
  const [sarDossiers, setSarDossiers] = useState<NbaSarDossier[]>(MOCK_NBA_SAR_DOSSIERS);
  const [visits] = useState<NbaEvaluationVisit[]>(MOCK_NBA_VISITS);

  const [activeTab, setActiveTab] = useState<
    "overview" | "programs" | "copo" | "sar" | "visits"
  >("overview");

  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isSarModalOpen, setIsSarModalOpen] = useState(false);
  const [isAttainmentModalOpen, setIsAttainmentModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const stats = getNbaStats();

  const handleSarCreated = (newSar: NbaSarDossier) => {
    setSarDossiers([newSar, ...sarDossiers]);
  };

  const handleAttainmentRecorded = (newCo: NbaCourseOutcome) => {
    setCourseOutcomes([newCo, ...courseOutcomes]);
  };

  // Filtered lists
  const filteredPrograms = programs.filter(
    (p) =>
      p.program_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.program_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCourseOutcomes = courseOutcomes.filter(
    (co) =>
      co.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      co.course_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      co.statement.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 text-white p-8 md:p-10 shadow-xl border border-blue-500/20">
        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs px-3 py-1 font-mono">
              Phase 49: Outcome-Based Education (OBE) & Washington Accord
            </Badge>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs px-3 py-1 font-mono">
              National Board of Accreditation (NBA) Tier-1
            </Badge>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            National Board of Accreditation (NBA) & OBE Gateway
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl">
            Statutory institutional gateway for Outcome-Based Education (OBE), 12 Washington Accord
            Graduate Attributes (PO1–PO12), Bloom&apos;s Taxonomy Course Outcome (CO) attainment matrix, and
            Self-Assessment Report (SAR) Tier-1 peer reviews.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              size="sm"
              onClick={() => setIsVerifyModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              Verify NBA Credentials
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsSarModalOpen(true)}
              className="border-slate-500 text-slate-200 hover:bg-slate-800 text-xs flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              Initiate SAR Dossier
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAttainmentModalOpen(true)}
              className="border-slate-500 text-slate-200 hover:bg-slate-800 text-xs flex items-center gap-1.5"
            >
              <Calculator className="w-4 h-4" />
              Compute CO Attainment
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Overview Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/80 bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Washington Accord Tier-1</span>
              <GraduationCap className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <div className="text-3xl font-black text-foreground">
                {stats.tier1AccreditedCount}
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[11px] flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> Accredited
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground">
            B.Tech UG Programs with Tier-1 International Standing
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Average Criteria Score</span>
              <Award className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <div className="text-3xl font-black text-primary">
                {stats.averageCriteriaScore.toFixed(1)}
              </div>
              <span className="text-xs text-muted-foreground font-medium">/ 1000 pts</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground">
            Across 10 NBA Washington Accord Evaluation Criteria
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">PO Attainment Rate</span>
              <Target className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {stats.overallAttainmentRate}%
              </div>
              <Badge variant="outline" className="text-[10px]">
                Target &ge; 2.40/3.0
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground">
            12 Graduate Attributes PO1-PO12 + PSOs fully attained
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Active SAR Dossiers</span>
              <FileText className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <div className="text-3xl font-black text-foreground">
                {stats.activeSarDossiers}
              </div>
              <span className="text-xs text-muted-foreground font-medium">Under Cycle</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground">
            Cryptographically sealed Self-Assessment Reports
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-3">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("overview")}
            className="text-xs gap-1.5"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Overview & Graduate Attributes
          </Button>

          <Button
            variant={activeTab === "programs" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("programs")}
            className="text-xs gap-1.5"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Accredited Programs ({programs.length})
          </Button>

          <Button
            variant={activeTab === "copo" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("copo")}
            className="text-xs gap-1.5"
          >
            <Target className="w-3.5 h-3.5" />
            CO-PO Attainment Matrix ({courseOutcomes.length})
          </Button>

          <Button
            variant={activeTab === "sar" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("sar")}
            className="text-xs gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            SAR Dossiers ({sarDossiers.length})
          </Button>

          <Button
            variant={activeTab === "visits" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("visits")}
            className="text-xs gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            Evaluation Team Visits ({visits.length})
          </Button>
        </div>

        {/* Search Input */}
        {(activeTab === "programs" || activeTab === "copo") && (
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search programs or outcomes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        )}
      </div>

      {/* TAB CONTENT */}

      {/* 1. Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left 2 Cols: 12 Graduate Attributes Attainment Radar */}
            <div className="md:col-span-2 space-y-4">
              <Card className="border-border/80">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      NBA Washington Accord Graduate Attributes (PO1 - PO12 & PSOs)
                    </span>
                    <Badge variant="secondary" className="font-mono text-xs">
                      Target Scale: 3.00
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {programOutcomes.map((po) => {
                      const pct = Math.min(100, Math.round((po.actual_attainment / 3.0) * 100));
                      const isTargetMet = po.actual_attainment >= po.target_attainment;
                      return (
                        <div
                          key={po.id}
                          className="p-3 rounded-lg border border-border/60 bg-muted/30 space-y-2 text-xs"
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-foreground">
                              [{po.code}] {po.title}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${
                                isTargetMet
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                                  : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                              }`}
                            >
                              {po.actual_attainment.toFixed(2)} / 3.00
                            </Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-2">
                            {po.description}
                          </p>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Latest SAR Dossiers */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-primary" />
                    Tier-1 Self-Assessment Reports
                  </h3>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-xs p-0 text-primary"
                    onClick={() => setActiveTab("sar")}
                  >
                    View All SARs →
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sarDossiers.slice(0, 2).map((dossier) => (
                    <SarDossierCard key={dossier.id} dossier={dossier} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Washington Accord Recognition Callouts */}
            <div className="space-y-4">
              <Card className="border-border/80">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Washington Accord Tier-1 Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    India is a permanent signatory to the <strong>Washington Accord</strong> through the National Board of Accreditation (NBA).
                    Degrees awarded by Tier-1 accredited engineering programs are globally recognized across the United States, United Kingdom, Canada, Australia, Japan, and Singapore.
                  </p>

                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> Substantial Global Degree Equivalency
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Total Evaluated Criteria:</span>
                      <strong className="text-foreground">10 NBA Criteria (1000 Pts)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Minimum Qualifying Score:</span>
                      <strong className="text-foreground">675 / 1000 (Tier-1)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Apex Institute Average:</span>
                      <strong className="text-primary font-bold">{stats.averageCriteriaScore.toFixed(1)} / 1000</strong>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs mt-2"
                    onClick={() => setIsVerifyModalOpen(true)}
                  >
                    Validate Accreditation Seal →
                  </Button>
                </CardContent>
              </Card>

              {/* Evaluation Team Visits Preview */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-2 text-xs">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" />
                  Upcoming Peer Evaluation Visits
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Expert peer teams comprising Emeritus IIT professors, IISc scholars, and industrial fellows inspect laboratories, evaluate student projects, and audit attainment records.
                </p>
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-full text-xs"
                  onClick={() => setActiveTab("visits")}
                >
                  View Evaluation Schedule
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Accredited Programs Tab */}
      {activeTab === "programs" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Tier-1 Washington Accord Accredited Programs
              </h2>
              <p className="text-xs text-muted-foreground">
                Official accreditation validity, criteria scores, and department coordinators.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrograms.map((program) => (
              <NbaProgramCard key={program.id} program={program} />
            ))}
          </div>
        </div>
      )}

      {/* 3. CO-PO Attainment Matrix Tab */}
      {activeTab === "copo" && (
        <div className="space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Course Outcome (CO) Attainment Ledger
              </h2>
              <p className="text-xs text-muted-foreground">
                Direct continuous internal evaluations (30%), semester end exams (70%), and indirect exit surveys (20%).
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsAttainmentModalOpen(true)}
              className="gap-1.5 text-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Compute CO Attainment
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourseOutcomes.map((co) => (
              <CoPoMatrixCard key={co.id} outcome={co} />
            ))}
          </div>
        </div>
      )}

      {/* 4. SAR Dossiers Tab */}
      {activeTab === "sar" && (
        <div className="space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                NBA Self-Assessment Reports (SAR)
              </h2>
              <p className="text-xs text-muted-foreground">
                Institutional compliance dossiers compiled according to Washington Accord Tier-1 manuals.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsSarModalOpen(true)}
              className="gap-1.5 text-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Initiate SAR Dossier
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sarDossiers.map((dossier) => (
              <SarDossierCard key={dossier.id} dossier={dossier} />
            ))}
          </div>
        </div>
      )}

      {/* 5. Evaluation Team Visits Tab */}
      {activeTab === "visits" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              NBA Expert Evaluation Team Visits & Exit Debriefs
            </h2>
            <p className="text-xs text-muted-foreground">
              Official peer evaluation reports submitted by National Board of Accreditation committees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visits.map((visit) => (
              <Card key={visit.id} className="border-border/80 bg-card hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="font-mono text-xs bg-primary/10 text-primary border-primary/30">
                      {visit.visit_code}
                    </Badge>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs">
                      {visit.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-foreground mt-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary shrink-0" />
                    Program: {visit.program_code}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">Dates: {visit.visit_dates}</p>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Chairperson:</span>
                    <strong className="text-foreground">{visit.team_chairperson}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px] mb-1">Peer Evaluators:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-foreground pl-1">
                      {visit.member_evaluators.map((ev, i) => (
                        <li key={i}>{ev}</li>
                      ))}
                    </ul>
                  </div>
                  {visit.exit_meeting_summary && (
                    <div className="p-2.5 rounded bg-muted/40 border border-border/50 text-[11px] text-muted-foreground italic">
                      &ldquo;{visit.exit_meeting_summary}&rdquo;
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <SarFilingModal
        isOpen={isSarModalOpen}
        onClose={() => setIsSarModalOpen(false)}
        programs={programs}
        onSuccess={handleSarCreated}
      />

      <CoAttainmentModal
        isOpen={isAttainmentModalOpen}
        onClose={() => setIsAttainmentModalOpen(false)}
        programs={programs}
        onSuccess={handleAttainmentRecorded}
      />

      <NbaVerifyModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
      />
    </div>
  );
}
