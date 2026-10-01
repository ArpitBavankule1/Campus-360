"use client";

import React, { useState } from "react";
import {
  SolarTelemetry,
  WaterMetric,
  WasteAudit,
  EcoCredit,
} from "@/types";
import {
  MOCK_SOLAR_TELEMETRY,
  MOCK_WATER_METRICS,
  MOCK_WASTE_AUDITS,
  MOCK_ECO_CREDITS,
  calculateSustainabilityOverview,
} from "@/lib/sustainability/sustainability-engine";
import { SolarTelemetryGauge } from "@/components/sustainability/solar-telemetry-gauge";
import { WaterResourceCard } from "@/components/sustainability/water-resource-card";
import { WasteAuditTracker } from "@/components/sustainability/waste-audit-tracker";
import { EcoCreditModal } from "@/components/sustainability/eco-credit-modal";
import {
  Leaf,
  Sun,
  Droplets,
  Recycle,
  Award,
  Search,
  Sparkles,
  Zap,
  BatteryCharging,
  TrendingUp,
  ShieldCheck,
  Bike,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SustainabilityPortalPage() {
  const [activeTab, setActiveTab] = useState<
    "solar" | "water" | "waste" | "credits"
  >("solar");

  // State
  const [solar] = useState<SolarTelemetry[]>(MOCK_SOLAR_TELEMETRY);
  const [water] = useState<WaterMetric[]>(MOCK_WATER_METRICS);
  const [waste] = useState<WasteAudit[]>(MOCK_WASTE_AUDITS);
  const [credits, setCredits] = useState<EcoCredit[]>(MOCK_ECO_CREDITS);

  // Modals & Filters
  const [isEcoModalOpen, setIsEcoModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState("all");

  const overview = calculateSustainabilityOverview(solar, water, waste, credits);

  const zones = Array.from(new Set(solar.map((s) => s.array_zone)));

  const filteredSolar = solar.filter((s) => {
    const matchesZone = selectedZone === "all" || s.array_zone === selectedZone;
    const matchesSearch =
      !searchQuery.trim() ||
      s.array_zone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesZone && matchesSearch;
  });

  const filteredCredits = credits.filter((c) => {
    return (
      !searchQuery.trim() ||
      c.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.commute_mode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.certificate_code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCreditLogged = (newCredit: EcoCredit) => {
    setCredits((prev) => [newCredit, ...prev]);
    setActiveTab("credits");
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/90 to-emerald-500/10 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Phase 30 • Smart Campus Sustainability & Green Energy Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Campus Carbon Neutrality & Microgrid Telemetry
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Track real-time rooftop solar PV generation across academic blocks, smart rainwater harvesting & greywater reclamation, zero-waste cafeteria composting, and earn verified student eco-credits.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button
              size="sm"
              onClick={() => setIsEcoModalOpen(true)}
              className="rounded-2xl gap-2 text-xs shadow-md bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold"
            >
              <Leaf className="w-4 h-4" />
              Log Green Commute
            </Button>
          </div>
        </div>
      </div>

      {/* Telemetry Overview KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
            <Sun className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground tracking-tight font-mono">
              {overview.totalInstantGenerationKw} <span className="text-xs text-amber-500 font-semibold">kW</span>
            </div>
            <div className="text-xs text-muted-foreground font-medium">Instant Solar Output</div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 mt-0.5">
              <Zap className="w-3 h-3" /> {overview.totalDailyGenerationKwh} kWh Today
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <Leaf className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground tracking-tight font-mono">
              {overview.totalCarbonOffsetKg} <span className="text-xs text-emerald-500 font-semibold">kg</span>
            </div>
            <div className="text-xs text-muted-foreground font-medium">Daily CO₂ Offset</div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <BatteryCharging className="w-3 h-3" /> {overview.averageBatteryStoragePercent}% Battery Storage
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
            <Droplets className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground tracking-tight font-mono">
              {overview.totalWaterReservesKl} <span className="text-xs text-blue-500 font-semibold">kL</span>
            </div>
            <div className="text-xs text-muted-foreground font-medium">Water Reserves</div>
            <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" /> Rainwater Harvesting
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
            <Recycle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground tracking-tight font-mono">
              {overview.campusDiversionRatePercent}%
            </div>
            <div className="text-xs text-muted-foreground font-medium">Landfill Diversion</div>
            <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3" /> Zero Waste Campus
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/70 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab("solar")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "solar"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            Solar PV Microgrid ({solar.length})
          </button>
          <button
            onClick={() => setActiveTab("water")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "water"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            Water Reserves ({water.length})
          </button>
          <button
            onClick={() => setActiveTab("waste")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "waste"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Recycle className="w-3.5 h-3.5" />
            Zero-Waste Audits ({waste.length})
          </button>
          <button
            onClick={() => setActiveTab("credits")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "credits"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Eco-Credit Leaderboard ({credits.length})
          </button>
        </div>

        {/* Global Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search zones, sensors, or students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Tab: Solar PV Microgrid */}
      {activeTab === "solar" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/30 p-3 rounded-2xl border border-border/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Array Zone:</span>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="text-xs rounded-xl bg-card border border-border px-2.5 py-1 text-foreground focus:outline-hidden"
              >
                <option value="all">All Rooftop Arrays</option>
                {zones.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-muted-foreground">
              Microgrid Power Inverters: <strong className="text-emerald-500 font-semibold">100% Operational</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSolar.map((s) => (
              <SolarTelemetryGauge key={s.id} telemetry={s} />
            ))}
          </div>
        </div>
      )}

      {/* Tab: Water Reserves */}
      {activeTab === "water" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {water.map((m) => (
              <WaterResourceCard key={m.id} metric={m} />
            ))}
          </div>
        </div>
      )}

      {/* Tab: Waste & Composting Audits */}
      {activeTab === "waste" && (
        <div className="space-y-4">
          <WasteAuditTracker audits={waste} />
        </div>
      )}

      {/* Tab: Student Eco-Credits Leaderboard */}
      {activeTab === "credits" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">
              Student Eco-Warrior Green Commute Ledger
            </h2>
            <Button
              size="sm"
              onClick={() => setIsEcoModalOpen(true)}
              className="rounded-xl text-xs gap-1.5 h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Bike className="w-3.5 h-3.5" />
              Log My Commute
            </Button>
          </div>

          <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] font-bold border-b border-border/60">
                  <tr>
                    <th className="px-4 py-3">Student Commuter</th>
                    <th className="px-4 py-3">Mode</th>
                    <th className="px-4 py-3">Distance</th>
                    <th className="px-4 py-3">CO₂ Offset</th>
                    <th className="px-4 py-3">Eco-Points</th>
                    <th className="px-4 py-3">Certificate Code</th>
                    <th className="px-4 py-3">Logged Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredCredits.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-semibold text-foreground">
                        {c.student_name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {c.commute_mode}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-medium text-foreground">
                        {c.distance_km} km
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {c.co2_saved_kg} kg CO₂
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-primary">
                        +{c.eco_points_earned} PTS
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                        {c.certificate_code}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(c.logged_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <EcoCreditModal
        isOpen={isEcoModalOpen}
        onClose={() => setIsEcoModalOpen(false)}
        onSuccess={handleCreditLogged}
      />
    </div>
  );
}
