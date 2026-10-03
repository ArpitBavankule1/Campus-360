"use client";

import React, { useState } from "react";
import {
  IncubationVenture,
  VentureFundingTranche,
  MakerSpaceEquipment,
  PitchSession,
} from "@/types";
import {
  MOCK_VENTURES,
  MOCK_FUNDING_TRANCHES,
  MOCK_MAKER_EQUIPMENT,
  MOCK_PITCHES,
  calculateIncubationOverview,
} from "@/lib/incubation/incubation-engine";
import { VenturePortfolioCard } from "@/components/incubation/venture-portfolio-card";
import { MakerEquipmentCard } from "@/components/incubation/maker-equipment-card";
import { FounderApplicationModal } from "@/components/incubation/founder-application-modal";
import { PitchBookingModal } from "@/components/incubation/pitch-booking-modal";
import {
  Rocket,
  Cpu,
  DollarSign,
  Award,
  Search,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Mic2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function IncubationPortalPage() {
  const [activeTab, setActiveTab] = useState<
    "ventures" | "funding" | "makerspace" | "pitches"
  >("ventures");

  const [ventures, setVentures] = useState<IncubationVenture[]>(MOCK_VENTURES);
  const [tranches] = useState<VentureFundingTranche[]>(MOCK_FUNDING_TRANCHES);
  const [equipment] = useState<MakerSpaceEquipment[]>(MOCK_MAKER_EQUIPMENT);
  const [pitches, setPitches] = useState<PitchSession[]>(MOCK_PITCHES);

  const [selectedVentureForPitch, setSelectedVentureForPitch] =
    useState<IncubationVenture | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedStage, setSelectedStage] = useState("all");

  const overview = calculateIncubationOverview(ventures, tranches, equipment, pitches);

  const filteredVentures = ventures.filter((v) => {
    const matchesSector = selectedSector === "all" || v.sector === selectedSector;
    const matchesStage = selectedStage === "all" || v.stage === selectedStage;
    const matchesSearch =
      !searchQuery.trim() ||
      v.venture_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.founder_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.sector.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesStage && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-950/40 via-card to-background p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-400">
              <Sparkles className="h-3.5 w-3.5" /> Phase 33: Campus Incubation & Startup Accelerator
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Apex Deep-Tech Venture Foundry & Maker Accelerator
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Incubating student and faculty-led high-impact ventures with seed capital grants,
              rapid 3D fabrication labs, institutional angel syndicates, and IPR filing.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setIsApplyModalOpen(true)}
              className="bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20"
            >
              <Rocket className="mr-2 h-4 w-4" /> Apply for Incubation
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Overview Telemetry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Ventures Incubated</span>
            <Rocket className="h-4 w-4 text-violet-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">{overview.totalIncubatedVentures}</div>
          <p className="text-[11px] text-violet-500 mt-1">Student & Faculty Co-Founders</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Seed Grants Disbursed</span>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            ₹{(overview.totalGrantDisbursedInr / 100000).toFixed(1)} Lakhs
          </div>
          <p className="text-[11px] text-emerald-500 mt-1">Milestone verified release</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Maker Workbenches</span>
            <Cpu className="h-4 w-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {overview.activePrototypingJobs}
          </div>
          <p className="text-[11px] text-cyan-500 mt-1">Industrial 3D & CNC operational</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Patents & IPR Filed</span>
            <Award className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {overview.patentsFiledCount}
          </div>
          <p className="text-[11px] text-amber-500 mt-1">Institutional patent backing</p>
        </div>
      </div>

      {/* Tabs & Navigation */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("ventures")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "ventures"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Ventures Portfolio
        </button>
        <button
          onClick={() => setActiveTab("funding")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "funding"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Seed Funding Tranches
        </button>
        <button
          onClick={() => setActiveTab("makerspace")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "makerspace"
              ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/20"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Rapid Prototyping Maker Space
        </button>
        <button
          onClick={() => setActiveTab("pitches")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "pitches"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Angel Demo Day Sessions
        </button>
      </div>

      {/* Tab: Ventures */}
      {activeTab === "ventures" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search venture title, founder, or sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-card/60 pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="rounded-xl border border-border bg-card/60 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All Sectors</option>
              <option value="DeepTech & AI">DeepTech & AI</option>
              <option value="Climate & CleanTech">Climate & CleanTech</option>
              <option value="BioTech & HealthCare">BioTech & HealthCare</option>
              <option value="Robotics & Hardware">Robotics & Hardware</option>
            </select>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="rounded-xl border border-border bg-card/60 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">All Stages</option>
              <option value="Ideation">Ideation</option>
              <option value="Prototyping">Prototyping</option>
              <option value="Seed Funded">Seed Funded</option>
              <option value="Accelerated">Accelerated</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVentures.map((venture) => (
              <VenturePortfolioCard
                key={venture.id}
                venture={venture}
                onBookPitch={(v) => {
                  setSelectedVentureForPitch(v);
                  setIsPitchModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab: Funding */}
      {activeTab === "funding" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-500/20 bg-card/60 p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold text-foreground">Seed Grant Outlay & Tranche Ledger</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Escrow-backed capital disbursements released upon technical milestone verification by the Incubation Review Board.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tranches.map((tranche) => (
              <div
                key={tranche.id}
                className="rounded-2xl border border-border/60 bg-card p-5 shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">
                        {tranche.tranche_name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        {tranche.investor_type}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                    {tranche.disbursement_status}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground space-y-1 py-2 border-y border-border/40 font-mono">
                  <div>Grant Amount: <strong className="text-foreground">₹{tranche.amount_inr.toLocaleString()}</strong></div>
                  <div>Disbursement Date: <strong className="text-foreground">{tranche.disbursement_date}</strong></div>
                  <div>Milestone Audited: <strong className="text-emerald-500">Yes (Peer Reviewed)</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Maker Space */}
      {activeTab === "makerspace" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment.map((item) => (
              <MakerEquipmentCard
                key={item.id}
                equipment={item}
                onReserveWorkbench={(eq) => {
                  alert(`Workbench session reserved on ${eq.equipment_name}. Check in with Maker Lab technician in ${eq.location_lab}.`);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab: Pitches */}
      {activeTab === "pitches" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-purple-500/20 bg-card/60 p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold text-foreground">Angel & VC Demo Day Docket</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Quarterly demo days presenting apex venture candidates before global institutional venture funds and alumni angel syndicates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pitches.map((session) => (
              <div
                key={session.id}
                className="rounded-2xl border border-border/60 bg-card p-5 shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                      <Mic2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">
                        Session: {session.session_code}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        {new Date(session.pitch_date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30">
                    {session.verdict}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground space-y-1 py-2 border-y border-border/40 font-mono">
                  <div>Venue: <strong className="text-foreground">{session.venue}</strong></div>
                  <div>Investor Panel: <strong className="text-foreground">{session.angel_investor_panel.join(", ")}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <FounderApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={(newVenture) => {
          setVentures((prev) => [newVenture, ...prev]);
        }}
      />

      <PitchBookingModal
        venture={selectedVentureForPitch}
        isOpen={isPitchModalOpen}
        onClose={() => setIsPitchModalOpen(false)}
        onSuccess={(newPitch) => {
          setPitches((prev) => [newPitch, ...prev]);
        }}
      />
    </div>
  );
}
