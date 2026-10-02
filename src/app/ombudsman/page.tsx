"use client";

import React, { useState } from "react";
import {
  GrievanceCase,
  OmbudsmanCommitteeMember,
  GrievanceHearing,
  GrievanceResolutionOrder,
} from "@/types";
import {
  MOCK_GRIEVANCE_CASES,
  MOCK_COMMITTEE_MEMBERS,
  MOCK_HEARINGS,
  MOCK_ORDERS,
  calculateOmbudsmanOverview,
} from "@/lib/ombudsman/ombudsman-engine";
import { GrievanceCaseCard } from "@/components/ombudsman/grievance-case-card";
import { AntiRaggingEmergencyBanner } from "@/components/ombudsman/anti-ragging-emergency-banner";
import { AnonymousFilingModal } from "@/components/ombudsman/anonymous-filing-modal";
import { ResolutionOrderModal } from "@/components/ombudsman/resolution-order-modal";
import {
  Scale,
  ShieldCheck,
  FileCheck2,
  Clock,
  Search,
  Sparkles,
  Users,
  EyeOff,
  Gavel,
  CheckCircle2,
  Lock,
  Calendar,
  AlertTriangle,
  Building2,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OmbudsmanPortalPage() {
  const [activeTab, setActiveTab] = useState<
    "cases" | "track" | "committee" | "hearings" | "orders"
  >("cases");

  // State
  const [cases, setCases] = useState<GrievanceCase[]>(MOCK_GRIEVANCE_CASES);
  const [committee] = useState<OmbudsmanCommitteeMember[]>(MOCK_COMMITTEE_MEMBERS);
  const [hearings] = useState<GrievanceHearing[]>(MOCK_HEARINGS);
  const [orders] = useState<GrievanceResolutionOrder[]>(MOCK_ORDERS);

  // Modals & Filters
  const [isFilingModalOpen, setIsFilingModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<GrievanceResolutionOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Zero-Knowledge Tracking Search
  const [trackQuery, setTrackQuery] = useState("");
  const [trackedCase, setTrackedCase] = useState<GrievanceCase | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);

  const overview = calculateOmbudsmanOverview(cases, committee, hearings, orders);

  const categories = Array.from(new Set(cases.map((c) => c.category)));

  const filteredCases = cases.filter((c) => {
    const matchesCategory =
      selectedCategory === "all" || c.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tracking_hash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCaseCreated = (newCase: GrievanceCase) => {
    setCases((prev) => [newCase, ...prev]);
    setActiveTab("cases");
  };

  const handleLookupTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError(null);
    const found = cases.find(
      (c) => c.tracking_hash.toUpperCase() === trackQuery.trim().toUpperCase()
    );
    if (found) {
      setTrackedCase(found);
    } else {
      setTrackedCase(null);
      setTrackError("No active case found matching this Zero-Knowledge Tracking Hash.");
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Emergency Anti-Ragging Banner */}
      <AntiRaggingEmergencyBanner />

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/90 to-purple-500/10 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Phase 31 • Campus Grievance Redressal & Student Ombudsman</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Statutory Ombudsman, Anti-Ragging & ICC Tribunal
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Statutorily independent grievance redressal tribunal operating under Retired District Judge oversight. Submit zero-knowledge encrypted whistleblower reports with guaranteed 72-hour institutional SLA resolution.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button
              size="sm"
              onClick={() => setIsFilingModalOpen(true)}
              className="rounded-2xl gap-2 text-xs shadow-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold"
            >
              <EyeOff className="w-4 h-4" />
              Lodge Confidential Grievance
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActiveTab("track")}
              className="rounded-2xl gap-2 text-xs border-border/80 hover:bg-muted"
            >
              <Lock className="w-4 h-4 text-primary" />
              ZKP Code Lookup
            </Button>
          </div>
        </div>
      </div>

      {/* Telemetry Overview KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
            <Scale className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground tracking-tight font-mono">
              {overview.totalCasesReported}
            </div>
            <div className="text-xs text-muted-foreground font-medium">Cases Registered</div>
            <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3" /> Statutory Docket
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
            <Gavel className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground tracking-tight font-mono">
              {overview.activeUnderHearing}
            </div>
            <div className="text-xs text-muted-foreground font-medium">In Tribunal Hearing</div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" /> Active Proceedings
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground tracking-tight font-mono">
              {overview.averageResolutionHours}h
            </div>
            <div className="text-xs text-muted-foreground font-medium">Average Turnaround</div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" /> Strict 72h SLA
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground tracking-tight font-mono">
              {overview.complianceRatePercent}%
            </div>
            <div className="text-xs text-muted-foreground font-medium">Compliance Rate</div>
            <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" /> Orders Enforced
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/70 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab("cases")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "cases"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            Grievance Cases ({cases.length})
          </button>
          <button
            onClick={() => setActiveTab("track")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "track"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            ZKP Status Lookup
          </button>
          <button
            onClick={() => setActiveTab("hearings")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "hearings"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Gavel className="w-3.5 h-3.5" />
            Tribunal Hearings ({hearings.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "orders"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            Resolution Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("committee")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "committee"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Ombudsman Bench ({committee.length})
          </button>
        </div>

        {/* Global Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cases, dockets, or codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Tab: Grievance Cases */}
      {activeTab === "cases" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/30 p-3 rounded-2xl border border-border/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs rounded-xl bg-card border border-border px-2.5 py-1 text-foreground focus:outline-hidden"
              >
                <option value="all">All Statutory Domains</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-muted-foreground">
              Showing <strong className="text-foreground">{filteredCases.length}</strong> active cases
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCases.map((c) => (
              <GrievanceCaseCard
                key={c.id}
                caseItem={c}
                onView={(item) => {
                  setTrackQuery(item.tracking_hash);
                  setTrackedCase(item);
                  setActiveTab("track");
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab: Zero-Knowledge Code Lookup */}
      {activeTab === "track" && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Zero-Knowledge Tracking Code Inspector
                </h2>
                <p className="text-xs text-muted-foreground">
                  Enter your unique alphanumeric hash to securely view case proceedings and hearing notes.
                </p>
              </div>
            </div>

            <form onSubmit={handleLookupTrack} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="e.g. ZKP-CASE-2026-RAG1"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                className="flex-1 px-3 py-2 text-xs font-mono rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground uppercase"
              />
              <Button type="submit" size="sm" className="rounded-xl text-xs px-4 bg-primary text-primary-foreground font-semibold">
                Inspect Case
              </Button>
            </form>

            {trackError && (
              <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{trackError}</span>
              </div>
            )}
          </div>

          {trackedCase && (
            <div className="rounded-3xl border border-primary/40 bg-card p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  {trackedCase.tracking_hash}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {trackedCase.status}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-foreground">{trackedCase.title}</h3>
                <div className="text-xs text-muted-foreground mt-1">
                  Category: <strong className="text-foreground">{trackedCase.category}</strong> • Tier:{" "}
                  <strong className="text-foreground">{trackedCase.escalation_tier}</strong>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/40 text-xs text-muted-foreground leading-relaxed">
                {trackedCase.description}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-muted/30 border border-border/40">
                  <div className="text-[10px] text-muted-foreground">Complainant ID (Masked)</div>
                  <div className="font-mono font-bold text-foreground mt-0.5">
                    {trackedCase.complainant_masked_id}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-muted/30 border border-border/40">
                  <div className="text-[10px] text-muted-foreground">Statutory SLA Window</div>
                  <div className="font-mono font-bold text-destructive mt-0.5">
                    {new Date(trackedCase.sla_deadline).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Tribunal Hearings */}
      {activeTab === "hearings" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hearings.map((h) => (
              <div
                key={h.id}
                className="rounded-3xl border border-border/70 bg-card p-5 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-mono font-bold text-primary">
                        {h.docket_number}
                      </div>
                      <h3 className="font-bold text-base text-foreground leading-snug">
                        {h.tribunal_venue}
                      </h3>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase font-mono">
                      {h.status}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 bg-muted/40 p-3 rounded-2xl border border-border/40">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Presiding Officer:</span>
                      <strong className="text-foreground">{h.presiding_officer}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hearing Date & Time:</span>
                      <strong className="text-foreground font-mono">
                        {new Date(h.hearing_date).toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  {h.hearing_notes && (
                    <p className="text-xs text-muted-foreground italic">
                      "{h.hearing_notes}"
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" /> In-Camera Confidentiality
                  </span>
                  <span className="text-[10px] font-mono">
                    Quorum: {h.quorum_present.length} Members Present
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Resolution Orders */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orders.map((o) => (
              <div
                key={o.id}
                className="rounded-3xl border border-border/70 bg-card p-5 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-mono font-bold text-primary">
                        {o.order_serial_code}
                      </div>
                      <h3 className="font-bold text-base text-foreground leading-snug">
                        {o.presiding_authority}
                      </h3>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase font-mono">
                      Legally Binding
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {o.findings_summary}
                  </p>

                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                    <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 mb-0.5">
                      Promulgated Directive
                    </div>
                    <div className="text-foreground font-medium line-clamp-2">
                      {o.mandatory_directives}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-mono">
                    Deadline: {o.compliance_deadline}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedOrder(o)}
                    className="rounded-xl text-xs h-8 gap-1.5"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-primary" />
                    Read Full Order
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Committee Bench */}
      {activeTab === "committee" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {committee.map((m) => (
              <div
                key={m.id}
                className="rounded-3xl border border-border/70 bg-card p-5 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary w-fit">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{m.member_name}</h3>
                    <div className="text-xs text-primary font-semibold mt-0.5">
                      {m.committee_role}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {m.designation}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40 text-xs space-y-1 text-muted-foreground">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 shrink-0 text-primary" />
                    <span className="truncate">{m.contact_email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{m.office_location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <AnonymousFilingModal
        isOpen={isFilingModalOpen}
        onClose={() => setIsFilingModalOpen(false)}
        onSuccess={handleCaseCreated}
      />

      <ResolutionOrderModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
