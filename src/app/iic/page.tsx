"use client";

import React, { useState, useEffect } from "react";
import {
  IicCouncilMember,
  IicQuarterlyActivity,
  IicNispPolicy,
  IicYuktiInnovation,
  IicAriiaRanking,
  IicPerformanceRating,
  IicComplianceSummaryStats,
  IicQuarter,
} from "@/types";
import {
  CouncilMemberCard,
  QuarterlyActivityCard,
  NispPolicyCard,
  YuktiInnovationCard,
  AriiaPerformanceCard,
  SubmitActivityModal,
  SubmitYuktiInnovationModal,
} from "@/components/iic";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Star,
  Trophy,
  Lightbulb,
  FileText,
  Calendar,
  Users,
  Building,
  Award,
  DollarSign,
  PlusCircle,
  Filter,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export default function IicGatewayPage() {
  const [stats, setStats] = useState<IicComplianceSummaryStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    "council" | "activities" | "nisp" | "yukti" | "ariia"
  >("activities");

  // Activity Filter
  const [selectedQuarter, setSelectedQuarter] = useState<string>("ALL");

  // Modals
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [yuktiModalOpen, setYuktiModalOpen] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/iic/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Failed to load IIC stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleActivityAdded = (newAct: IicQuarterlyActivity) => {
    if (!stats) return;
    setStats({
      ...stats,
      activities: [newAct, ...stats.activities],
      totalActivitiesConducted: stats.totalActivitiesConducted + 1,
      totalParticipants: stats.totalParticipants + newAct.participant_count,
    });
  };

  const handleYuktiAdded = (newYukti: IicYuktiInnovation) => {
    if (!stats) return;
    setStats({
      ...stats,
      innovations: [newYukti, ...stats.innovations],
      totalYuktiInnovations: stats.totalYuktiInnovations + 1,
    });
  };

  const filteredActivities =
    stats?.activities.filter((act) => {
      if (selectedQuarter === "ALL") return true;
      return act.quarter === selectedQuarter;
    }) || [];

  return (
    <div className="min-h-screen bg-background text-foreground space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card/90 to-primary/5 p-6 md:p-8 border border-border/80 shadow-sm">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20 text-xs"
              >
                Phase 54: MoE Innovation Cell (MIC) & IIC 7.0
              </Badge>
              <Badge
                variant="outline"
                className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs font-semibold flex items-center gap-1"
              >
                <Star className="w-3 h-3 fill-amber-500" />
                5-Star Annual Rating (98.4 / 100)
              </Badge>
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs"
              >
                ARIIA Band 1: Top 10-50 / Excellent
              </Badge>
              <Badge
                variant="outline"
                className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-xs font-mono"
              >
                1.25% NISP Earmarked Budget
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Institution&apos;s Innovation Council (IIC), NISP & YUKTI Gateway
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Apex institutional innovation command center recognized by Ministry of Education (MoE)
              Innovation Cell (MIC). Real-time telemetry for quarterly MIC activities (Q1-Q4),
              National Innovation & Startup Policy (NISP 2026), YUKTI National Repository submissions,
              and ARIIA national rankings.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActivityModalOpen(true)}
              className="gap-1.5 border-border/80"
            >
              <PlusCircle className="h-4 w-4 text-primary" />
              Log MoE Activity
            </Button>
            <Button
              size="sm"
              onClick={() => setYuktiModalOpen(true)}
              className="gap-1.5 shadow-sm"
            >
              <Lightbulb className="h-4 w-4" />
              Submit to YUKTI
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <Star className="h-5 w-5 fill-amber-500" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider font-mono">
                MIC Star Rating
              </p>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                5 Stars
                <span className="text-xs font-normal text-muted-foreground ml-1.5">
                  ({stats?.cumulativePoints || 98.4} Pts)
                </span>
              </h3>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2 */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider font-mono">
                NISP Budget
              </p>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                ₹45.0 L
                <span className="text-xs font-normal text-muted-foreground ml-1.5">
                  (1.25% Fund)
                </span>
              </h3>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3 */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider font-mono">
                Annual Activities
              </p>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {stats?.totalActivitiesConducted || 10} Conducted
                <span className="text-xs font-normal text-muted-foreground ml-1.5">
                  ({stats?.totalParticipants || 4452} pax)
                </span>
              </h3>
            </div>
          </CardContent>
        </Card>

        {/* KPI 4 */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider font-mono">
                YUKTI Repository
              </p>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {stats?.totalYuktiInnovations || 6} Innovations
                <span className="text-xs font-normal text-muted-foreground ml-1.5">
                  ({stats?.commercializedInnovations || 2} Mktd)
                </span>
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-border/80 overflow-x-auto space-x-1 pb-1 scrollbar-none text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab("activities")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium transition-all ${
            activeTab === "activities"
              ? "bg-card text-primary border-t-2 border-primary border-x border-border/80 shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Annual Activities (Q1-Q4)
          <Badge variant="secondary" className="text-[10px] ml-1 px-1.5 py-0">
            {stats?.activities.length || 0}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab("council")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium transition-all ${
            activeTab === "council"
              ? "bg-card text-primary border-t-2 border-primary border-x border-border/80 shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
          }`}
        >
          <Users className="w-4 h-4" />
          Council & Leadership
          <Badge variant="secondary" className="text-[10px] ml-1 px-1.5 py-0">
            {stats?.members.length || 0}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab("nisp")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium transition-all ${
            activeTab === "nisp"
              ? "bg-card text-primary border-t-2 border-primary border-x border-border/80 shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
          }`}
        >
          <FileText className="w-4 h-4" />
          NISP 2026 Implementation
          <Badge variant="secondary" className="text-[10px] ml-1 px-1.5 py-0">
            {stats?.nispPolicies.length || 0}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab("yukti")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium transition-all ${
            activeTab === "yukti"
              ? "bg-card text-primary border-t-2 border-primary border-x border-border/80 shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          YUKTI Repository
          <Badge variant="secondary" className="text-[10px] ml-1 px-1.5 py-0">
            {stats?.innovations.length || 0}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab("ariia")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium transition-all ${
            activeTab === "ariia"
              ? "bg-card text-primary border-t-2 border-primary border-x border-border/80 shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
          }`}
        >
          <Trophy className="w-4 h-4" />
          ARIIA & Benchmarking
        </button>
      </div>

      {/* Tab 1: Activities */}
      {activeTab === "activities" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-foreground tracking-tight">
                MoE & IIC Quarterly Calendar Activities
              </h2>
              <p className="text-xs text-muted-foreground">
                Mandatory and self-driven innovation activities required for 5-Star annual accreditation.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-lg border border-border/60 text-xs">
              <span className="text-muted-foreground font-medium px-2 text-[11px] flex items-center gap-1">
                <Filter className="w-3 h-3" />
                Quarter:
              </span>
              {["ALL", "Q1", "Q2", "Q3", "Q4"].map((q) => (
                <button
                  key={q}
                  onClick={() => setSelectedQuarter(q)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                    selectedQuarter === q
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredActivities.map((act) => (
              <QuarterlyActivityCard key={act.id} activity={act} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Council */}
      {activeTab === "council" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              Institution&apos;s Innovation Council (IIC 7.0) Office-Bearers
            </h2>
            <p className="text-xs text-muted-foreground">
              Statutory leadership roster encompassing Deans, IPR coordinators, angel investors, and student leads.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats?.members.map((mem) => (
              <CouncilMemberCard key={mem.id} member={mem} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: NISP 2026 */}
      {activeTab === "nisp" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              National Innovation and Startup Policy (NISP 2019/2026) Framework
            </h2>
            <p className="text-xs text-muted-foreground">
              Institutional policy clauses enacted under MoE guidelines including 1.25% budget reservation,
              attendance relief, academic credits, and faculty sabbaticals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats?.nispPolicies.map((pol) => (
              <NispPolicyCard key={pol.id} policy={pol} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: YUKTI Repository */}
      {activeTab === "yukti" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-foreground tracking-tight">
                YUKTI National Innovation Repository Dockets
              </h2>
              <p className="text-xs text-muted-foreground">
                Technology Readiness Level (TRL 1-9) vetted student and faculty projects endorsed by MoE Innovation Cell.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setYuktiModalOpen(true)}
              className="gap-1.5"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              Enroll Project
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats?.innovations.map((inn) => (
              <YuktiInnovationCard key={inn.id} innovation={inn} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: ARIIA */}
      {activeTab === "ariia" && stats?.ariiaRanking && stats?.performanceRating && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              ARIIA & MoE Innovation Cell National Standing
            </h2>
            <p className="text-xs text-muted-foreground">
              National benchmarking scores across mindset development, incubation infrastructure, and patent outlays.
            </p>
          </div>

          <AriiaPerformanceCard
            ariia={stats.ariiaRanking}
            performance={stats.performanceRating}
          />
        </div>
      )}

      {/* Modals */}
      <SubmitActivityModal
        open={activityModalOpen}
        onOpenChange={setActivityModalOpen}
        onSuccess={handleActivityAdded}
      />

      <SubmitYuktiInnovationModal
        open={yuktiModalOpen}
        onOpenChange={setYuktiModalOpen}
        onSuccess={handleYuktiAdded}
      />
    </div>
  );
}
