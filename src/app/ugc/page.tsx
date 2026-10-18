"use client";

import React, { useState, useEffect } from "react";
import {
  UgcStatutoryCouncil,
  UgcCurriculumRevision,
  UgcAutonomyReview,
  UgcGrantUtilization,
  UgcComplianceDossier,
  UgcComplianceSummaryStats,
} from "@/types";
import { ugcAutonomousStore } from "@/lib/ugc/ugc-engine";
import {
  StatutoryBodyCard,
  CurriculumRevisionCard,
  AutonomyReviewCard,
  GrantUtilizationCard,
  UgcComplianceDossierCard,
  ScheduleCouncilMeetingModal,
  SubmitCurriculumProposalModal,
} from "@/components/ugc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Landmark,
  Award,
  BookOpen,
  Banknote,
  FileCheck,
  Search,
  PlusCircle,
  Shield,
  Sparkles,
  Calendar,
  Layers,
  GraduationCap,
} from "lucide-react";

export default function UgcAutonomousGovernancePage() {
  const [councils, setCouncils] = useState<UgcStatutoryCouncil[]>([]);
  const [curriculumRevisions, setCurriculumRevisions] = useState<UgcCurriculumRevision[]>([]);
  const [autonomyReviews, setAutonomyReviews] = useState<UgcAutonomyReview[]>([]);
  const [grants, setGrants] = useState<UgcGrantUtilization[]>([]);
  const [dossiers, setDossiers] = useState<UgcComplianceDossier[]>([]);

  const [activeTab, setActiveTab] = useState<
    "councils" | "curriculum" | "reviews" | "grants" | "dossiers"
  >("councils");
  const [searchQuery, setSearchQuery] = useState("");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [selectedCouncil, setSelectedCouncil] = useState<UgcStatutoryCouncil | null>(null);

  const refreshData = () => {
    const stats = ugcAutonomousStore.getComplianceSummaryStats();
    setCouncils([...stats.councils]);
    setCurriculumRevisions([...stats.curriculumRevisions]);
    setAutonomyReviews([...stats.autonomyReviews]);
    setGrants([...stats.grants]);
    setDossiers([...stats.dossiers]);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const stats = ugcAutonomousStore.getComplianceSummaryStats();

  const filteredCouncils = councils.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.council_name.toLowerCase().includes(q) ||
      c.chairperson.toLowerCase().includes(q) ||
      c.university_nominee.toLowerCase().includes(q)
    );
  });

  const filteredCurriculum = curriculumRevisions.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.program_name.toLowerCase().includes(q) ||
      r.program_code.toLowerCase().includes(q) ||
      r.department.toLowerCase().includes(q)
    );
  });

  const handleOpenSchedule = (council: UgcStatutoryCouncil) => {
    setSelectedCouncil(council);
    setScheduleModalOpen(true);
  };

  const formatInrLakhs = (amount: number) => {
    const lakhs = (amount / 100000).toFixed(1);
    return `₹${lakhs} L`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card/90 to-primary/5 p-6 md:p-8 border border-border/80 shadow-sm">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                Phase 53: UGC Autonomous College Regulations & Statutes
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs">
                10-Year Autonomous Extension (2022-2032)
              </Badge>
              <Badge variant="outline" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-xs">
                UGC Section 2(f) & 12(B) Recognized
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              UGC Autonomous College Governance & 2(f)/12(B) Gateway
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Unified compliance hub for UGC autonomous colleges: statutory councils (Governing Body, Academic Council, BoS), autonomous curriculum formulation, 10-year autonomy reviews, development grants & chartered accountant audited Utilisation Certificates (UC).
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedCouncil(councils[0] || null);
                setScheduleModalOpen(true);
              }}
              className="gap-1.5 border-border/80"
            >
              <Calendar className="h-4 w-4 text-primary" />
              Convene Council
            </Button>
            <Button
              size="sm"
              onClick={() => setProposalModalOpen(true)}
              className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <PlusCircle className="h-4 w-4" />
              New Curriculum Proposal
            </Button>
          </div>
        </div>

        {/* Executive KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-6 mt-6 border-t border-border/50 text-xs">
          <div className="space-y-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <Landmark className="h-3.5 w-3.5 text-indigo-500" />
              Statutory Bodies
            </span>
            <div className="text-base font-bold text-foreground">
              {stats.compliantCouncils} / {stats.totalCouncils} Compliant
            </div>
            <p className="text-[10px] text-muted-foreground">Governing Body & AC</p>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-purple-500" />
              Autonomous Syllabi
            </span>
            <div className="text-base font-bold text-purple-600 dark:text-purple-400">
              {stats.ratifiedRevisions} Programs Ratified
            </div>
            <p className="text-[10px] text-muted-foreground">R-2026 CBCS Regulations</p>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-emerald-500" />
              UGC Recognition
            </span>
            <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
              2(f) & 12(B) Permanent
            </div>
            <p className="text-[10px] text-muted-foreground">Central Assistance Eligible</p>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <Banknote className="h-3.5 w-3.5 text-blue-500" />
              Autonomy Grants
            </span>
            <div className="text-base font-bold text-foreground">
              {formatInrLakhs(stats.totalSanctionedGrantsInr)} Sanctioned
            </div>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              {stats.grantsUtilizationPct}% Audited UC Filed
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-muted-foreground flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-amber-500" />
              Autonomy Validity
            </span>
            <div className="text-base font-bold text-foreground">
              10-Year Extension
            </div>
            <p className="text-[10px] text-muted-foreground">Valid through 2032</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-border/80 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={activeTab === "councils" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("councils")}
            className="gap-2 text-xs"
          >
            <Landmark className="h-3.5 w-3.5" />
            Statutory Councils ({councils.length})
          </Button>
          <Button
            variant={activeTab === "curriculum" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("curriculum")}
            className="gap-2 text-xs"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Autonomous Syllabi ({curriculumRevisions.length})
          </Button>
          <Button
            variant={activeTab === "reviews" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("reviews")}
            className="gap-2 text-xs"
          >
            <Shield className="h-3.5 w-3.5" />
            Autonomy Reviews ({autonomyReviews.length})
          </Button>
          <Button
            variant={activeTab === "grants" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("grants")}
            className="gap-2 text-xs"
          >
            <Banknote className="h-3.5 w-3.5" />
            Grants & Audited UC ({grants.length})
          </Button>
          <Button
            variant={activeTab === "dossiers" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("dossiers")}
            className="gap-2 text-xs"
          >
            <FileCheck className="h-3.5 w-3.5" />
            Statutory Dossiers ({dossiers.length})
          </Button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search councils or syllabi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      {/* Tab 1: Statutory Bodies & Councils */}
      {activeTab === "councils" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Landmark className="h-4 w-4 text-primary" />
              UGC Autonomous Statutory Bodies & Nominees
            </h3>
            <span className="text-xs text-muted-foreground">
              Constitution conforms to UGC Autonomous College Regulations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCouncils.map((council) => (
              <StatutoryBodyCard
                key={council.id}
                council={council}
                onConveneMeeting={handleOpenSchedule}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Autonomous Curriculum & BoS Syllabi */}
      {activeTab === "curriculum" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-purple-600" />
              Autonomous Course Regulations, Schemes & BoS Approvals
            </h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setProposalModalOpen(true)}
              className="text-xs h-7 gap-1 border-primary/30 text-primary"
            >
              <PlusCircle className="h-3 w-3" />
              Submit Revision
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCurriculum.map((revision) => (
              <CurriculumRevisionCard key={revision.id} revision={revision} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Autonomy Reviews & 2(f)/12(B) Recognition */}
      {activeTab === "reviews" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-emerald-600" />
              UGC Expert Peer Team Reviews & Section 2(f)/12(B) Standing
            </h3>
            <span className="text-xs text-muted-foreground">
              Direct conferment under UGC Act, 1956
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {autonomyReviews.map((review) => (
              <AutonomyReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Grants Utilization & Audited UC */}
      {activeTab === "grants" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Banknote className="h-4 w-4 text-blue-600" />
              UGC Autonomous Development Grants & CA Audited Utilisation Certificates
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              UDIN Verified Financial Accounts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grants.map((grant) => (
              <GrantUtilizationCard key={grant.id} grant={grant} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Statutory Dossiers */}
      {activeTab === "dossiers" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <FileCheck className="h-4 w-4 text-indigo-600" />
              Statutory Dossiers, Annual Returns & Official Gazettes
            </h3>
            <span className="text-xs text-muted-foreground">
              Cryptographically signed compliance records
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dossiers.map((dossier) => (
              <UgcComplianceDossierCard key={dossier.id} dossier={dossier} />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <ScheduleCouncilMeetingModal
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
        selectedCouncil={selectedCouncil}
        onSuccess={() => refreshData()}
      />

      <SubmitCurriculumProposalModal
        open={proposalModalOpen}
        onOpenChange={setProposalModalOpen}
        onSuccess={() => refreshData()}
      />
    </div>
  );
}
