"use client";

import React, { useState } from "react";
import {
  WorldRankingFramework,
  WorldRankingMetric,
  WorldRankingSdgImpact,
  WorldRankingDossier,
  WorldRankingBenchmark,
} from "@/types";
import {
  MOCK_WORLD_RANKING_FRAMEWORKS,
  MOCK_WORLD_RANKING_METRICS,
  MOCK_WORLD_RANKING_SDGS,
  MOCK_WORLD_RANKING_BENCHMARKS,
  MOCK_WORLD_RANKING_DOSSIERS,
  getWorldRankingOverviewStats,
} from "@/lib/world-rankings/world-rankings-engine";
import {
  RankingFrameworkCard,
  MetricBreakdownCard,
  SdgImpactCard,
  PeerBenchmarkTable,
  RankingDossierCard,
  DossierSubmissionModal,
  RankingCredentialModal,
} from "@/components/world-rankings";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Globe,
  Trophy,
  ShieldCheck,
  Search,
  PlusCircle,
  BarChart3,
  Award,
  Calendar,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Leaf,
  FileText,
} from "lucide-react";

export default function WorldRankingsPortalPage() {
  const [frameworks] = useState<WorldRankingFramework[]>(MOCK_WORLD_RANKING_FRAMEWORKS);
  const [metrics] = useState<WorldRankingMetric[]>(MOCK_WORLD_RANKING_METRICS);
  const [sdgs] = useState<WorldRankingSdgImpact[]>(MOCK_WORLD_RANKING_SDGS);
  const [benchmarks] = useState<WorldRankingBenchmark[]>(MOCK_WORLD_RANKING_BENCHMARKS);
  const [dossiers, setDossiers] = useState<WorldRankingDossier[]>(MOCK_WORLD_RANKING_DOSSIERS);

  const [activeTab, setActiveTab] = useState<"frameworks" | "metrics" | "sdg" | "benchmarks" | "dossiers">("frameworks");
  const [searchQuery, setSearchQuery] = useState("");
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  const stats = getWorldRankingOverviewStats();

  const filteredFrameworks = frameworks.filter(
    (f) =>
      f.framework_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.framework_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.overall_rank_display.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMetrics = metrics.filter(
    (m) =>
      m.metric_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.audit_source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSdgs = sdgs.filter(
    (s) =>
      s.sdg_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.key_initiative.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.lead_department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDossiers = dossiers.filter(
    (d) =>
      d.cycle_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.dossier_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.lead_compiler_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-primary/10 via-background to-background pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/15 text-primary border-primary/30 text-xs px-2.5 py-0.5 font-medium flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  Phase 50: Global Rankings Intelligence
                </Badge>
                <Badge variant="outline" className="text-xs font-mono">
                  Academic Year 2026–27
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                QS World University Rankings & THE Impact Gateway
              </h1>
              <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
                Global institutional benchmarking intelligence, Quacquarelli Symonds (QS WUR) telemetry,
                Times Higher Education (THE) World University Rankings, and United Nations Sustainable
                Development Goals (SDGs 1–17) Impact portfolio.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVerifyModalOpen(true)}
                className="gap-1.5 text-xs h-9 border-border"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Verify Credential Pass
              </Button>
              <Button
                size="sm"
                onClick={() => setSubmissionModalOpen(true)}
                className="gap-1.5 text-xs h-9 shadow-sm"
              >
                <PlusCircle className="h-4 w-4" />
                Submit Ranking Dossier
              </Button>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-2">
            <Card className="border-border/80 bg-card/60 backdrop-blur-sm">
              <CardContent className="p-4 space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                  <span>QS WORLD RANK</span>
                  <Globe className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-2xl font-black text-foreground">{stats.qsWorldRank}</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +45 positions (Up from #287)
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/60 backdrop-blur-sm">
              <CardContent className="p-4 space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                  <span>THE WORLD RANK</span>
                  <Trophy className="h-4 w-4 text-amber-500" />
                </div>
                <div className="text-2xl font-black text-foreground">{stats.theWorldRank}</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  National Top 5 Tier
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/60 backdrop-blur-sm">
              <CardContent className="p-4 space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                  <span>THE IMPACT (SDG 7)</span>
                  <Leaf className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-black text-foreground">{stats.theImpactRank}</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  Rank #1 in India for Clean Energy
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-card/60 backdrop-blur-sm">
              <CardContent className="p-4 space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                  <span>CITATIONS / FACULTY</span>
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                </div>
                <div className="text-2xl font-black text-foreground">
                  {stats.citationsPerFaculty}
                  <span className="text-xs font-normal text-muted-foreground"> / 100</span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-primary" />
                  1.68 FWCI Scopus Normalized
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Navigation Tabs and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <Button
              variant={activeTab === "frameworks" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("frameworks")}
              className="text-xs gap-1.5 h-8 flex-shrink-0"
            >
              <Globe className="h-3.5 w-3.5" />
              Ranking Frameworks ({frameworks.length})
            </Button>

            <Button
              variant={activeTab === "metrics" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("metrics")}
              className="text-xs gap-1.5 h-8 flex-shrink-0"
            >
              <BarChart3 className="h-3.5 w-3.5" />
              QS & THE Metrics ({metrics.length})
            </Button>

            <Button
              variant={activeTab === "sdg" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("sdg")}
              className="text-xs gap-1.5 h-8 flex-shrink-0"
            >
              <Leaf className="h-3.5 w-3.5" />
              UN SDG Impact ({sdgs.length})
            </Button>

            <Button
              variant={activeTab === "benchmarks" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("benchmarks")}
              className="text-xs gap-1.5 h-8 flex-shrink-0"
            >
              <Trophy className="h-3.5 w-3.5" />
              Peer Benchmarks ({benchmarks.length})
            </Button>

            <Button
              variant={activeTab === "dossiers" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("dossiers")}
              className="text-xs gap-1.5 h-8 flex-shrink-0"
            >
              <FileText className="h-3.5 w-3.5" />
              Audited Dossiers ({dossiers.length})
            </Button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search frameworks, metrics, SDGs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs h-8"
            />
          </div>
        </div>

        {/* Tab 1: Ranking Frameworks */}
        {activeTab === "frameworks" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFrameworks.map((fw) => (
                <RankingFrameworkCard key={fw.id} framework={fw} />
              ))}
            </div>

            {filteredFrameworks.length === 0 && (
              <div className="p-8 text-center border border-dashed border-border rounded-xl text-xs text-muted-foreground">
                No ranking frameworks match your search criteria.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Metrics Breakdown */}
        {activeTab === "metrics" && (
          <div className="space-y-4">
            <MetricBreakdownCard metrics={filteredMetrics} />
          </div>
        )}

        {/* Tab 3: UN SDG Impact */}
        {activeTab === "sdg" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSdgs.map((sdg) => (
                <SdgImpactCard key={sdg.id} sdg={sdg} />
              ))}
            </div>

            {filteredSdgs.length === 0 && (
              <div className="p-8 text-center border border-dashed border-border rounded-xl text-xs text-muted-foreground">
                No UN SDG impact indicators match your search query.
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Global Peer Benchmarking */}
        {activeTab === "benchmarks" && (
          <div className="space-y-4">
            <PeerBenchmarkTable benchmarks={benchmarks} />
          </div>
        )}

        {/* Tab 5: Audited Dossiers */}
        {activeTab === "dossiers" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDossiers.map((dossier) => (
                <RankingDossierCard key={dossier.id} dossier={dossier} />
              ))}
            </div>

            {filteredDossiers.length === 0 && (
              <div className="p-8 text-center border border-dashed border-border rounded-xl text-xs text-muted-foreground">
                No ranking dossiers match your search criteria.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <DossierSubmissionModal
        open={submissionModalOpen}
        onOpenChange={setSubmissionModalOpen}
        onDossierCreated={(newDossier) => setDossiers([newDossier, ...dossiers])}
      />

      <RankingCredentialModal
        open={verifyModalOpen}
        onOpenChange={setVerifyModalOpen}
      />
    </div>
  );
}
