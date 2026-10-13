"use client";

import React, { useState } from "react";
import {
  NirfParameterMetric,
  NirfDossier,
  NirfBenchmarkPeer,
  NirfDataMetric,
  NirfParameterCode,
} from "@/types";
import {
  MOCK_NIRF_PARAMETERS,
  MOCK_NIRF_DOSSIERS,
  MOCK_NIRF_BENCHMARKS,
  MOCK_NIRF_DATA_METRICS,
  getNirfStats,
} from "@/lib/nirf/nirf-engine";
import {
  ParameterScoreCard,
  DossierCard,
  PeerBenchmarkCard,
  DossierFilingModal,
  MetricEntryModal,
  NirfVerifyModal,
} from "@/components/nirf";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Award,
  Building2,
  CheckCircle2,
  FileText,
  Search,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Layers,
  PlusCircle,
  BarChart3,
  Calendar,
  Compass,
  ArrowUpRight,
  Database,
} from "lucide-react";

export default function NirfRankingPortalPage() {
  const [parameters, setParameters] = useState<NirfParameterMetric[]>(MOCK_NIRF_PARAMETERS);
  const [dossiers, setDossiers] = useState<NirfDossier[]>(MOCK_NIRF_DOSSIERS);
  const [benchmarks] = useState<NirfBenchmarkPeer[]>(MOCK_NIRF_BENCHMARKS);
  const [metrics, setMetrics] = useState<NirfDataMetric[]>(MOCK_NIRF_DATA_METRICS);

  const [activeTab, setActiveTab] = useState<
    "overview" | "parameters" | "benchmarks" | "dossiers" | "metrics"
  >("overview");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedParamFilter, setSelectedParamFilter] = useState<string>("all");

  // Modals state
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);
  const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [tokenToVerify, setTokenToVerify] = useState("CL-NIRF-DOSS-2026-ENG91");

  const stats = getNirfStats();

  const handleVerify = (token: string) => {
    setTokenToVerify(token);
    setIsVerifyModalOpen(true);
  };

  const handleDossierCreated = (newDossier: NirfDossier) => {
    setDossiers([newDossier, ...dossiers]);
  };

  const handleMetricAdded = (newMetric: NirfDataMetric) => {
    setMetrics([newMetric, ...metrics]);
  };

  // Filtered parameters
  const filteredParameters = parameters.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.lead_coordinator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedParamFilter === "all" || p.code === selectedParamFilter;
    return matchesSearch && matchesFilter;
  });

  // Filtered metrics
  const filteredMetrics = metrics.filter((m) => {
    return (
      m.metric_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.metric_code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white p-8 md:p-10 shadow-xl border border-amber-500/20">
        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30 text-xs px-3 py-1 font-mono">
              Phase 48: Institutional Ranking Intelligence
            </Badge>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs px-3 py-1 font-mono">
              NIRF 2026 & QS Asia Benchmarking
            </Badge>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            National Institutional Ranking Framework (NIRF)
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl">
            Institutional ranking intelligence and benchmarking gateway monitoring Ministry of
            Education parameters: Teaching Resources (TLR), Research Output (RPC), Graduation Outcomes (GO),
            Outreach (OI), and National Perception (PR).
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              size="sm"
              onClick={() => handleVerify("CL-NIRF-DOSS-2026-ENG91")}
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              Verify NIRF Dossier
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsDossierModalOpen(true)}
              className="border-slate-500 text-slate-200 hover:bg-slate-800 text-xs flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              File Ranking Dossier
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsMetricModalOpen(true)}
              className="border-slate-500 text-slate-200 hover:bg-slate-800 text-xs flex items-center gap-1.5"
            >
              <Database className="w-4 h-4" />
              Log Department Metric
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Overview Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/80 bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Projected Engineering Rank</span>
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <div className="text-3xl font-black text-foreground">
                #{stats.projectedEngineeringRank}
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[11px] flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +4 Ranks
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground">
            Previous Year: Rank #{stats.previousEngineeringRank} nationwide
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Composite NIRF Score</span>
              <Award className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <div className="text-3xl font-black text-primary">
                {stats.compositeScore.toFixed(2)}
              </div>
              <span className="text-xs text-muted-foreground font-medium">/ 100.00</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground">
            Targeting Top 15 Tier-1 Engineering threshold
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Data Audit Readiness</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {stats.dataReadinessPercentage}%
              </div>
              <Badge variant="outline" className="text-[10px]">
                {stats.totalVerifiedMetrics} Audited Metrics
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground">
            100% evidentiary documentation uploaded
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Overall & Research Ranks</span>
              <Compass className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <div className="text-2xl font-bold text-foreground">
                #{stats.projectedOverallRank} / #{stats.projectedResearchRank}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 text-xs text-muted-foreground">
            Overall University & Research Institution categories
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
            Overview & Telemetry
          </Button>

          <Button
            variant={activeTab === "parameters" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("parameters")}
            className="text-xs gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            5 Core Parameters ({parameters.length})
          </Button>

          <Button
            variant={activeTab === "benchmarks" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("benchmarks")}
            className="text-xs gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5" />
            Peer Benchmarking ({benchmarks.length})
          </Button>

          <Button
            variant={activeTab === "dossiers" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("dossiers")}
            className="text-xs gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            Ranking Dossiers ({dossiers.length})
          </Button>

          <Button
            variant={activeTab === "metrics" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("metrics")}
            className="text-xs gap-1.5"
          >
            <Database className="w-3.5 h-3.5" />
            Department Metrics ({metrics.length})
          </Button>
        </div>

        {/* Search Bar */}
        {(activeTab === "parameters" || activeTab === "metrics") && (
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search parameters or metrics..."
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
            {/* Left 2 Cols: Composite Parameter Breakdown */}
            <div className="md:col-span-2 space-y-4">
              <Card className="border-border/80">
                <CardHeader>
                  <CardTitle className="text-base font-bold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Parameter-wise Weightage & Current Score Breakdown
                    </span>
                    <Badge variant="secondary" className="font-mono text-xs">
                      Max: 100.0
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {parameters.map((param) => {
                    const pct = Math.round((param.current_score / param.max_weightage) * 100);
                    return (
                      <div key={param.id} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-foreground">
                            [{param.code}] {param.name}
                          </span>
                          <span className="font-semibold text-primary">
                            {param.current_score.toFixed(1)} / {param.max_weightage} pts ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Recent Dossiers Preview */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-primary" />
                    Latest Active Submissions
                  </h3>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-xs p-0 text-primary"
                    onClick={() => setActiveTab("dossiers")}
                  >
                    View All Dossiers →
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dossiers.slice(0, 2).map((dossier) => (
                    <DossierCard
                      key={dossier.id}
                      dossier={dossier}
                      onVerify={(d) => handleVerify(d.dossier_code)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Top Peer Benchmarking Widget */}
            <div className="space-y-4">
              <Card className="border-border/80">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    Top Peer Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  {benchmarks.slice(0, 4).map((peer) => (
                    <div
                      key={peer.id}
                      className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                        peer.institute_type === "Apex_Institute"
                          ? "bg-primary/10 border-primary/40 font-semibold"
                          : "bg-muted/40 border-border/60"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="truncate max-w-[180px] text-foreground">
                          {peer.institute_name}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          Rank #{peer.current_rank}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-muted-foreground text-[11px]">
                        <span>Composite Score:</span>
                        <span className="font-bold text-foreground">{peer.composite_score.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs mt-2"
                    onClick={() => setActiveTab("benchmarks")}
                  >
                    Open Full Benchmarking Matrix →
                  </Button>
                </CardContent>
              </Card>

              {/* Data Verification Callout */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-2 text-xs">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Ministry Compliance Validation
                </div>
                <p className="text-muted-foreground text-[11px]">
                  All institutional claims undergo tripartite verification by Department HODs, Dean R&D,
                  and Controller of Examinations prior to MoE upload.
                </p>
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-full text-xs"
                  onClick={() => handleVerify("CL-NIRF-DOSS-2026-ENG91")}
                >
                  Verify Compliance Credentials
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. 5 Parameters Tab */}
      {activeTab === "parameters" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredParameters.map((param) => (
              <ParameterScoreCard
                key={param.id}
                parameter={param}
              />
            ))}
          </div>
        </div>
      )}

      {/* 3. Peer Benchmarks Tab */}
      {activeTab === "benchmarks" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Institutional Benchmarking vs Top Tier Institutes
              </h2>
              <p className="text-xs text-muted-foreground">
                Comparing Apex Institute metrics with IITs, NITs, and premier private universities.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benchmarks.map((peer) => (
              <PeerBenchmarkCard
                key={peer.id}
                peer={peer}
                isCurrentCampus={peer.institute_type === "Apex_Institute"}
              />
            ))}
          </div>
        </div>
      )}

      {/* 4. Dossiers Tab */}
      {activeTab === "dossiers" && (
        <div className="space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Official NIRF Ranking Dossiers
              </h2>
              <p className="text-xs text-muted-foreground">
                Audited institutional filings with cryptographic SHA-256 seals.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsDossierModalOpen(true)}
              className="gap-1.5 text-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" /> File New Dossier
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dossiers.map((dossier) => (
              <DossierCard
                key={dossier.id}
                dossier={dossier}
                onVerify={(d) => handleVerify(d.dossier_code)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 5. Metrics Tab */}
      {activeTab === "metrics" && (
        <div className="space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Audited Department Data Contributions
              </h2>
              <p className="text-xs text-muted-foreground">
                Granular academic, research, and placement inputs verified by department heads.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsMetricModalOpen(true)}
              className="gap-1.5 text-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Log Department Metric
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredMetrics.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-lg border border-border/80 bg-card hover:shadow-sm transition-shadow space-y-2 text-xs"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <Badge variant="outline" className="font-mono text-[10px] mb-1">
                      {m.parameter_code} • {m.metric_code}
                    </Badge>
                    <h4 className="font-bold text-foreground text-sm">{m.metric_title}</h4>
                    <span className="text-muted-foreground text-xs">{m.department}</span>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]">
                    Verified
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-muted/40 p-2 rounded border border-border/50 text-[11px]">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Reported:</span>
                    <span className="font-semibold text-foreground">{m.reported_value}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Benchmark:</span>
                    <span className="font-semibold text-foreground">{m.benchmark_value}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-muted-foreground text-[11px] pt-1 border-t border-border/40">
                  <span>Auditor: <strong className="text-foreground">{m.verified_by}</strong></span>
                  <span className="font-bold text-primary">
                    Score: {m.score_achieved} / {m.weightage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <DossierFilingModal
        open={isDossierModalOpen}
        onOpenChange={setIsDossierModalOpen}
        onSuccess={handleDossierCreated}
      />

      <MetricEntryModal
        open={isMetricModalOpen}
        onOpenChange={setIsMetricModalOpen}
        onSuccess={handleMetricAdded}
      />

      <NirfVerifyModal
        open={isVerifyModalOpen}
        onOpenChange={setIsVerifyModalOpen}
        initialCode={tokenToVerify}
      />
    </div>
  );
}
