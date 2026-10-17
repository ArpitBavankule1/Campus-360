"use client";

import React, { useState, useEffect } from "react";
import {
  AicteApprovedProgram,
  AicteInfrastructureNorm,
  AicteCadreFsrMetric,
  AicteStatutoryCommittee,
  AicteEoaDossier,
} from "@/types";
import { aicteComplianceStore } from "@/lib/aicte/aicte-engine";
import {
  ProgramIntakeCard,
  InfrastructureNormCard,
  CadreFsrTable,
  StatutoryCommitteeCard,
  EoaDossierCard,
  SubmitEoaModal,
  MandatoryDisclosureModal,
} from "@/components/aicte";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  Building,
  Users,
  Award,
  FileCheck,
  Search,
  PlusCircle,
  GraduationCap,
  Scale,
  Sparkles,
  Building2,
  Calendar,
} from "lucide-react";

export default function AicteCompliancePortalPage() {
  const [programs, setPrograms] = useState<AicteApprovedProgram[]>([]);
  const [norms, setNorms] = useState<AicteInfrastructureNorm[]>([]);
  const [cadreMetrics, setCadreMetrics] = useState<AicteCadreFsrMetric[]>([]);
  const [committees, setCommittees] = useState<AicteStatutoryCommittee[]>([]);
  const [dossiers, setDossiers] = useState<AicteEoaDossier[]>([]);

  const [activeTab, setActiveTab] = useState<
    "programs" | "infra" | "cadre" | "committees" | "dossiers"
  >("programs");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [eoaModalOpen, setEoaModalOpen] = useState(false);
  const [disclosureModalOpen, setDisclosureModalOpen] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState<AicteEoaDossier | null>(null);

  const refreshData = () => {
    const stats = aicteComplianceStore.getSummaryStats();
    setPrograms([...stats.programs]);
    setNorms([...stats.infrastructureNorms]);
    setCadreMetrics([...stats.cadreMetrics]);
    setCommittees([...stats.committees]);
    setDossiers([...stats.dossiers]);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const stats = aicteComplianceStore.getSummaryStats();

  const filteredPrograms = programs.filter((p) => {
    const matchesLevel = selectedLevel === "all" || p.program_level === selectedLevel;
    if (!matchesLevel) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.program_name.toLowerCase().includes(q) ||
      p.department.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background text-foreground space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card/90 to-primary/5 p-6 md:p-8 border border-border/80 shadow-sm">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                Phase 52: AICTE Approval Process Handbook (APH 2026-27)
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs">
                Statutory Zero-Deficiency Return
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              AICTE Regulatory Compliance & EoA Gateway
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Statutory annual Extension of Approval (EoA) returns, Faculty-Student Ratio (FSR 1:15),
              faculty cadre distribution (1:2:6), space and instructional norms audit, and mandatory public disclosures.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (dossiers[0]) {
                  setSelectedDossier(dossiers[0]);
                  setDisclosureModalOpen(true);
                }
              }}
              className="gap-2 text-xs border-primary/40 text-primary hover:bg-primary/10"
            >
              <FileCheck className="h-3.5 w-3.5" />
              Mandatory Disclosure
            </Button>
            <Button
              size="sm"
              onClick={() => setEoaModalOpen(true)}
              className="gap-2 text-xs bg-primary text-primary-foreground shadow-sm"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              File EoA Return
            </Button>
          </div>
        </div>

        {/* Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-6 mt-6 border-t border-border/50">
          <Card className="bg-background/60 border-border/50 backdrop-blur-sm">
            <CardContent className="p-3.5 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>Approved Intake</span>
                <GraduationCap className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-black text-foreground">
                {stats.totalApprovedIntake.toLocaleString()}
              </div>
              <div className="text-[11px] text-muted-foreground">Across UG/PG/Doctoral</div>
            </CardContent>
          </Card>

          <Card className="bg-background/60 border-border/50 backdrop-blur-sm">
            <CardContent className="p-3.5 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>Deficiency Index</span>
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {stats.deficiencyIndex.toFixed(1)}%
              </div>
              <div className="text-[11px] text-muted-foreground">Zero Deficiency (100% Pass)</div>
            </CardContent>
          </Card>

          <Card className="bg-background/60 border-border/50 backdrop-blur-sm">
            <CardContent className="p-3.5 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>Overall FSR</span>
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-foreground">
                {stats.overallFsrRatio}
              </div>
              <div className="text-[11px] text-muted-foreground">AICTE Norm 1:15 Surpassed</div>
            </CardContent>
          </Card>

          <Card className="bg-background/60 border-border/50 backdrop-blur-sm">
            <CardContent className="p-3.5 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>Statutory Cells</span>
                <Scale className="h-4 w-4 text-purple-500" />
              </div>
              <div className="text-2xl font-black text-foreground">
                {stats.activeCommitteesCount} / 5
              </div>
              <div className="text-[11px] text-muted-foreground">Anti-Ragging, ICC, SC/ST, SGRC</div>
            </CardContent>
          </Card>

          <Card className="bg-background/60 border-border/50 backdrop-blur-sm col-span-2 sm:col-span-1">
            <CardContent className="p-3.5 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>Instructional Space</span>
                <Building className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-foreground">
                {stats.totalInstructionalAreaSqm.toLocaleString()}
              </div>
              <div className="text-[11px] text-muted-foreground">sq.m Carpet Area Audited</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60">
            <Button
              variant={activeTab === "programs" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("programs")}
              className="text-xs h-8 px-3 gap-1.5"
            >
              <GraduationCap className="h-3.5 w-3.5" />
              Approved Programs ({programs.length})
            </Button>

            <Button
              variant={activeTab === "infra" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("infra")}
              className="text-xs h-8 px-3 gap-1.5"
            >
              <Building className="h-3.5 w-3.5" />
              Infrastructure Norms ({norms.length})
            </Button>

            <Button
              variant={activeTab === "cadre" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("cadre")}
              className="text-xs h-8 px-3 gap-1.5"
            >
              <Users className="h-3.5 w-3.5" />
              Cadre & FSR Matrix ({cadreMetrics.length})
            </Button>

            <Button
              variant={activeTab === "committees" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("committees")}
              className="text-xs h-8 px-3 gap-1.5"
            >
              <Scale className="h-3.5 w-3.5" />
              Statutory Committees ({committees.length})
            </Button>

            <Button
              variant={activeTab === "dossiers" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("dossiers")}
              className="text-xs h-8 px-3 gap-1.5"
            >
              <FileCheck className="h-3.5 w-3.5" />
              AICTE EoA Returns ({dossiers.length})
            </Button>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search program, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-card/60"
            />
          </div>
        </div>

        {/* Level filter for programs tab */}
        {activeTab === "programs" && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground pt-1">
            <span>Filter Level:</span>
            {[
              { id: "all", label: "All Levels" },
              { id: "undergraduate", label: "Undergraduate (B.Tech)" },
              { id: "postgraduate", label: "Postgraduate (M.Tech / MBA / MCA)" },
              { id: "doctoral", label: "Doctoral (Ph.D.)" },
            ].map((lvl) => (
              <Badge
                key={lvl.id}
                variant={selectedLevel === lvl.id ? "default" : "outline"}
                onClick={() => setSelectedLevel(lvl.id)}
                className="cursor-pointer text-[11px] py-1 px-2.5 font-medium transition-colors"
              >
                {lvl.label}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Tab Panels */}
      {activeTab === "programs" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrograms.map((prog) => (
            <ProgramIntakeCard key={prog.id} program={prog} />
          ))}
        </div>
      )}

      {activeTab === "infra" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {norms.map((norm) => (
            <InfrastructureNormCard key={norm.id} norm={norm} />
          ))}
        </div>
      )}

      {activeTab === "cadre" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <Users className="h-4 w-4" />
              <span>AICTE Cadre Distribution & Faculty-Student Ratio (FSR) Norms</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Technical degree institutions require an FSR of 1:15 or 1:20 and a cadre distribution of
              1 Professor : 2 Associate Professors : 6 Assistant Professors with at least 50% Ph.D. qualified faculty.
            </p>
          </div>

          <CadreFsrTable metrics={cadreMetrics} />
        </div>
      )}

      {activeTab === "committees" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {committees.map((comm) => (
            <StatutoryCommitteeCard key={comm.id} committee={comm} />
          ))}
        </div>
      )}

      {activeTab === "dossiers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dossiers.map((dossier) => (
            <EoaDossierCard
              key={dossier.id}
              dossier={dossier}
              onViewDisclosure={(d) => {
                setSelectedDossier(d);
                setDisclosureModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Interactive Modals */}
      <SubmitEoaModal
        open={eoaModalOpen}
        onOpenChange={setEoaModalOpen}
        onSuccess={() => refreshData()}
      />

      <MandatoryDisclosureModal
        dossier={selectedDossier}
        open={disclosureModalOpen}
        onOpenChange={setDisclosureModalOpen}
      />
    </div>
  );
}
