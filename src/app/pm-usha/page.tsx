"use client";

import React, { useState, useEffect } from "react";
import {
  PmUshaSummaryStats,
  PmUshaComponentType,
} from "@/types";
import {
  PmUshaProfileBanner,
  ProjectProposalCard,
  FundAllocationLedgerCard,
  PhysicalMilestoneTrackerCard,
  UtilizationCertificateCard,
  SubmitProposalModal,
  SubmitUcModal,
} from "@/components/pm-usha";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Landmark,
  FileText,
  Wallet,
  Compass,
  FileCheck2,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Building2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { getPmUshaSummaryStats } from "@/lib/pm-usha/pm-usha-engine";

export default function PmUshaPortalPage() {
  const [stats, setStats] = useState<PmUshaSummaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "proposals" | "allocations" | "milestones" | "certificates"
  >("overview");

  // Modals
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [ucModalOpen, setUcModalOpen] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/pm-usha/stats");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setStats(json.data);
          return;
        }
      }
      setStats(getPmUshaSummaryStats());
    } catch {
      setStats(getPmUshaSummaryStats());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCreateProposal = async (payload: {
    title: string;
    component_type: PmUshaComponentType;
    estimated_budget_lakhs: number;
    approved_budget_lakhs: number;
    central_share_percentage: number;
    state_share_percentage: number;
    target_completion_date: string;
    review_remarks?: string;
  }) => {
    try {
      const res = await fetch("/api/pm-usha/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await fetchStats();
      }
    } catch {
      // Fallback
      await fetchStats();
    }
  };

  const handleFileUc = async (payload: {
    financial_year: string;
    gfr_format: string;
    grant_in_aid_sanctioned_lakhs: number;
    interest_earned_lakhs: number;
    expenditure_incurred_lakhs: number;
    unspent_balance_lakhs: number;
    statutory_auditor_name: string;
    ca_membership_no: string;
    signed_date: string;
  }) => {
    try {
      const res = await fetch("/api/pm-usha/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await fetchStats();
      }
    } catch {
      // Fallback
      await fetchStats();
    }
  };

  const currentStats = stats || getPmUshaSummaryStats();

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-600/15 text-emerald-400 border-emerald-500/30 text-xs px-2.5 py-0.5 font-bold">
              Phase 58: Ministry of Education PM-USHA
            </Badge>
            <span className="text-xs text-muted-foreground">National Development Mission</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1.5 flex items-center gap-2.5">
            <Landmark className="h-7 w-7 text-emerald-400" />
            PM-USHA Grants, Infrastructure & Institutional Development Gateway
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-4xl">
            National higher education funding portal under Pradhan Mantri Uchchatar Shiksha Abhiyan.
            Tracks MERU upgrades, institutional infrastructure grants, PFMS fund allocations (60:40 Central:State split),
            geo-tagged physical milestones, and statutory GFR 12-A utilization certificates.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStats}
            disabled={loading}
            className="text-xs border-border/70 hover:bg-muted flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* Main Profile & Grant Telemetry Banner */}
      <PmUshaProfileBanner
        profile={currentStats.profile}
        onOpenProposalModal={() => setProposalModalOpen(true)}
        onOpenUcModal={() => setUcModalOpen(true)}
      />

      {/* High-Level KPI Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/60 bg-card/60 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">
                Total Outlay Ceiling
              </span>
              <span className="text-2xl font-black text-foreground mt-0.5 block">
                ₹{currentStats.totalApprovedGrantCr.toFixed(2)} Cr
              </span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="h-3 w-3" /> Approved by MoE PAB
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Landmark className="h-5 w-5 text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">
                PFMS Disbursed
              </span>
              <span className="text-2xl font-black text-teal-400 mt-0.5 block">
                ₹{currentStats.totalDisbursedGrantCr.toFixed(2)} Cr
              </span>
              <span className="text-[11px] text-muted-foreground mt-0.5 block">
                Tranches 1 & 2 Released
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20">
              <Wallet className="h-5 w-5 text-teal-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">
                Physical Progress Avg
              </span>
              <span className="text-2xl font-black text-cyan-400 mt-0.5 block">
                {currentStats.milestoneCompletionRatePct}%
              </span>
              <span className="text-[11px] text-cyan-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="h-3 w-3" /> {currentStats.milestonesCertifiedCount} of {currentStats.milestonesTotalCount} Certified
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <Compass className="h-5 w-5 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">
                PFMS Compliance Score
              </span>
              <span className="text-2xl font-black text-indigo-400 mt-0.5 block">
                {currentStats.pfmsComplianceScorePct}%
              </span>
              <span className="text-[11px] text-indigo-400 flex items-center gap-1 mt-0.5">
                <TrendingUp className="h-3 w-3" /> GFR 12-A Compliant
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <FileCheck2 className="h-5 w-5 text-indigo-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-2 overflow-x-auto">
        <Button
          size="sm"
          variant={activeTab === "overview" ? "default" : "ghost"}
          onClick={() => setActiveTab("overview")}
          className={`text-xs font-medium h-8 px-3.5 ${
            activeTab === "overview"
              ? "bg-emerald-600 text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building2 className="h-3.5 w-3.5 mr-1.5" />
          Gateway Overview
        </Button>

        <Button
          size="sm"
          variant={activeTab === "proposals" ? "default" : "ghost"}
          onClick={() => setActiveTab("proposals")}
          className={`text-xs font-medium h-8 px-3.5 ${
            activeTab === "proposals"
              ? "bg-emerald-600 text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="h-3.5 w-3.5 mr-1.5" />
          DPR Proposals ({currentStats.proposals.length})
        </Button>

        <Button
          size="sm"
          variant={activeTab === "allocations" ? "default" : "ghost"}
          onClick={() => setActiveTab("allocations")}
          className={`text-xs font-medium h-8 px-3.5 ${
            activeTab === "allocations"
              ? "bg-emerald-600 text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Wallet className="h-3.5 w-3.5 mr-1.5" />
          PFMS Allocations ({currentStats.allocations.length})
        </Button>

        <Button
          size="sm"
          variant={activeTab === "milestones" ? "default" : "ghost"}
          onClick={() => setActiveTab("milestones")}
          className={`text-xs font-medium h-8 px-3.5 ${
            activeTab === "milestones"
              ? "bg-emerald-600 text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Compass className="h-3.5 w-3.5 mr-1.5" />
          Physical Milestones ({currentStats.milestones.length})
        </Button>

        <Button
          size="sm"
          variant={activeTab === "certificates" ? "default" : "ghost"}
          onClick={() => setActiveTab("certificates")}
          className={`text-xs font-medium h-8 px-3.5 ${
            activeTab === "certificates"
              ? "bg-emerald-600 text-white"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileCheck2 className="h-3.5 w-3.5 mr-1.5" />
          GFR 12-A Certificates ({currentStats.certificates.length})
        </Button>
      </div>

      {/* Tab Panels */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <ProjectProposalCard
            proposals={currentStats.proposals}
            onNewProposal={() => setProposalModalOpen(true)}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FundAllocationLedgerCard allocations={currentStats.allocations} />
            <PhysicalMilestoneTrackerCard milestones={currentStats.milestones} />
          </div>
          <UtilizationCertificateCard
            certificates={currentStats.certificates}
            onFileUc={() => setUcModalOpen(true)}
          />
        </div>
      )}

      {activeTab === "proposals" && (
        <ProjectProposalCard
          proposals={currentStats.proposals}
          onNewProposal={() => setProposalModalOpen(true)}
        />
      )}

      {activeTab === "allocations" && (
        <FundAllocationLedgerCard allocations={currentStats.allocations} />
      )}

      {activeTab === "milestones" && (
        <PhysicalMilestoneTrackerCard milestones={currentStats.milestones} />
      )}

      {activeTab === "certificates" && (
        <UtilizationCertificateCard
          certificates={currentStats.certificates}
          onFileUc={() => setUcModalOpen(true)}
        />
      )}

      {/* Modals */}
      <SubmitProposalModal
        isOpen={proposalModalOpen}
        onClose={() => setProposalModalOpen(false)}
        onSubmit={handleCreateProposal}
      />

      <SubmitUcModal
        isOpen={ucModalOpen}
        onClose={() => setUcModalOpen(false)}
        onSubmit={handleFileUc}
      />
    </div>
  );
}
