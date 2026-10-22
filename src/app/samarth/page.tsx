"use client";

import React, { useState, useEffect } from "react";
import {
  SamarthSummaryStats,
  SamarthModule,
  SamarthSyncLog,
  SamarthCasApplication,
  SamarthStudentOnboarding,
} from "@/types";
import {
  SamarthInstanceBanner,
  ModuleCatalogCard,
  SyncTelemetryCard,
  CasPromotionLedgerCard,
  StudentOnboardingCard,
  TriggerSyncModal,
  SubmitCasModal,
} from "@/components/samarth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Server,
  Layers,
  Activity,
  Award,
  Users,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Database,
  ArrowRight,
  TrendingUp,
  Cpu,
} from "lucide-react";
import { getSamarthSummaryStats } from "@/lib/samarth/samarth-engine";

export default function SamarthPortalPage() {
  const [stats, setStats] = useState<SamarthSummaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "modules" | "sync" | "cas" | "onboardings"
  >("overview");

  // Modals
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [casModalOpen, setCasModalOpen] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/samarth/stats");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setStats(json.data);
          return;
        }
      }
      setStats(getSamarthSummaryStats());
    } catch {
      setStats(getSamarthSummaryStats());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleTriggerSync = async (payload: {
    module_key: string;
    direction: "INBOUND" | "OUTBOUND" | "BIDIRECTIONAL";
    records_processed: number;
  }) => {
    try {
      const res = await fetch("/api/samarth/sync-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        fetchStats();
      }
    } catch (e) {
      console.error("Sync error:", e);
    }
  };

  const handleToggleModule = async (moduleKey: string) => {
    try {
      const res = await fetch("/api/samarth/modules", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module_key: moduleKey }),
      });
      if (res.ok) {
        fetchStats();
      }
    } catch (e) {
      console.error("Toggle module error:", e);
    }
  };

  const handleSubmitCas = async (payload: any) => {
    try {
      const res = await fetch("/api/samarth/cas-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        fetchStats();
      }
    } catch (e) {
      console.error("CAS submission error:", e);
    }
  };

  const handleVerifyOnboarding = async (token: string) => {
    try {
      const res = await fetch("/api/samarth/onboardings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          onboarding_token: token,
          verification_status: "VERIFIED",
        }),
      });
      if (res.ok) {
        fetchStats();
      }
    } catch (e) {
      console.error("Verify onboarding error:", e);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-sm text-muted-foreground">
          Loading MoE SAMARTH eGov Suite & Enterprise ERP Integration Gateway...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-600/15 text-indigo-400 border-indigo-500/30 text-xs px-2.5 py-0.5 font-bold">
              Phase 57: Ministry of Education SAMARTH eGov Suite
            </Badge>
            <Badge variant="outline" className="text-xs px-2 py-0.5 text-muted-foreground">
              Open Standard ERP v4.2
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
            SAMARTH eGov Suite & Enterprise ERP Integration Gateway
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            National Mission on Education through ICT (NMEICT) microservices orchestration, Career Advancement Scheme (CAS) dossiers & student lifecycle synchronization
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStats}
            className="border-border/60 text-xs h-8"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Refresh Data
          </Button>
          <Button
            size="sm"
            onClick={() => setSyncModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Trigger Sync
          </Button>
        </div>
      </div>

      {/* Main Instance Banner */}
      <SamarthInstanceBanner
        instance={stats.instance}
        onTriggerSync={() => setSyncModalOpen(true)}
      />

      {/* Quick KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-border/60 bg-card/60 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Microservices Active</span>
              <Layers className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">{stats.activeModulesCount}</span>
              <span className="text-xs text-muted-foreground font-medium">/ {stats.totalModulesCount} total</span>
            </div>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="h-3 w-3" /> 100% operational
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Sync Success Rate</span>
              <Activity className="h-4 w-4 text-blue-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">{stats.syncSuccessRatePct}%</span>
              <span className="text-xs text-muted-foreground font-medium">{stats.totalSyncEventsToday} events</span>
            </div>
            <p className="text-[11px] text-blue-400 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp className="h-3 w-3" /> avg latency 180ms
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">CAS Applications</span>
              <Award className="h-4 w-4 text-purple-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">{stats.casTotalApplications}</span>
              <span className="text-xs text-muted-foreground font-medium">{stats.casApprovedRatePct}% approved</span>
            </div>
            <p className="text-[11px] text-purple-400 mt-1 flex items-center gap-1 font-medium">
              <ShieldCheck className="h-3 w-3" /> UGC 7th CPC Dossiers
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Student Onboarding</span>
              <Users className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">{stats.studentVerifiedRatePct}%</span>
              <span className="text-xs text-muted-foreground font-medium">{stats.studentOnboardingsTotal} scholars</span>
            </div>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="h-3 w-3" /> APAAR & DigiLocker linked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/40 pb-2">
        {[
          { key: "overview", label: "Executive Overview", icon: Server },
          { key: "modules", label: "Microservices Directory", icon: Layers },
          { key: "sync", label: "Sync Telemetry & Logs", icon: Activity },
          { key: "cas", label: "Faculty CAS Promotions", icon: Award },
          { key: "onboardings", label: "Student Life Cycle & SSO", icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <Button
              key={tab.key}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.key as any)}
              className={`text-xs h-8 px-3 gap-1.5 font-medium transition-all ${
                isActive
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <ModuleCatalogCard
            modules={stats.modules}
            onToggleModule={handleToggleModule}
            onSyncModule={(modKey) => {
              handleTriggerSync({
                module_key: modKey,
                direction: "BIDIRECTIONAL",
                records_processed: 120,
              });
            }}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SyncTelemetryCard
              logs={stats.syncLogs}
              onTriggerSync={() => setSyncModalOpen(true)}
            />
            <CasPromotionLedgerCard
              applications={stats.casApplications}
              onSubmitCas={() => setCasModalOpen(true)}
            />
          </div>
          <StudentOnboardingCard
            onboardings={stats.studentOnboardings}
            onVerifyOnboarding={handleVerifyOnboarding}
          />
        </div>
      )}

      {activeTab === "modules" && (
        <ModuleCatalogCard
          modules={stats.modules}
          onToggleModule={handleToggleModule}
          onSyncModule={(modKey) => {
            handleTriggerSync({
              module_key: modKey,
              direction: "BIDIRECTIONAL",
              records_processed: 120,
            });
          }}
        />
      )}

      {activeTab === "sync" && (
        <SyncTelemetryCard
          logs={stats.syncLogs}
          onTriggerSync={() => setSyncModalOpen(true)}
        />
      )}

      {activeTab === "cas" && (
        <CasPromotionLedgerCard
          applications={stats.casApplications}
          onSubmitCas={() => setCasModalOpen(true)}
        />
      )}

      {activeTab === "onboardings" && (
        <StudentOnboardingCard
          onboardings={stats.studentOnboardings}
          onVerifyOnboarding={handleVerifyOnboarding}
        />
      )}

      {/* Modals */}
      <TriggerSyncModal
        isOpen={syncModalOpen}
        onClose={() => setSyncModalOpen(false)}
        modules={stats.modules}
        onTrigger={handleTriggerSync}
      />

      <SubmitCasModal
        isOpen={casModalOpen}
        onClose={() => setCasModalOpen(false)}
        onSubmit={handleSubmitCas}
      />
    </div>
  );
}
