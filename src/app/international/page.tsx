"use client";

import React, { useState } from "react";
import {
  PartnerUniversity,
  InternationalScholarship,
  CreditTransferRequest,
  TravelClearancePass,
} from "@/types";
import {
  MOCK_PARTNER_UNIVERSITIES,
  MOCK_INTERNATIONAL_SCHOLARSHIPS,
  MOCK_CREDIT_TRANSFERS,
  MOCK_TRAVEL_PASSES,
  calculateGlobalMobilityOverview,
} from "@/lib/international/international-engine";
import { PartnerUniversityCard } from "@/components/international/partner-university-card";
import { GlobalScholarshipCard } from "@/components/international/global-scholarship-card";
import { CreditTransferModal } from "@/components/international/credit-transfer-modal";
import { TravelClearanceModal } from "@/components/international/travel-clearance-modal";
import {
  Globe,
  Award,
  GraduationCap,
  Plane,
  Search,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  DollarSign,
  QrCode,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InternationalPortalPage() {
  const [activeTab, setActiveTab] = useState<
    "partners" | "scholarships" | "credits" | "travel"
  >("partners");

  // State
  const [partners] = useState<PartnerUniversity[]>(MOCK_PARTNER_UNIVERSITIES);
  const [scholarships] = useState<InternationalScholarship[]>(MOCK_INTERNATIONAL_SCHOLARSHIPS);
  const [credits, setCredits] = useState<CreditTransferRequest[]>(MOCK_CREDIT_TRANSFERS);
  const [travelPasses, setTravelPasses] = useState<TravelClearancePass[]>(MOCK_TRAVEL_PASSES);

  // Modals & Filters
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isTravelModalOpen, setIsTravelModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedTerm, setSelectedTerm] = useState("all");

  const overview = calculateGlobalMobilityOverview(
    partners,
    scholarships,
    credits,
    travelPasses
  );

  const countries = Array.from(new Set(partners.map((p) => p.country)));

  const filteredPartners = partners.filter((p) => {
    const matchesCountry = selectedCountry === "all" || p.country === selectedCountry;
    const matchesTerm = selectedTerm === "all" || p.semester_term === selectedTerm;
    const matchesSearch =
      !searchQuery.trim() ||
      p.university_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.programs_offered.some((prog) => prog.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCountry && matchesTerm && matchesSearch;
  });

  const filteredScholarships = scholarships.filter((s) => {
    return (
      !searchQuery.trim() ||
      s.fellowship_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sponsoring_body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.target_countries.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleCreditSubmitted = (newRequest: CreditTransferRequest) => {
    setCredits((prev) => [newRequest, ...prev]);
    setActiveTab("credits");
  };

  const handlePassIssued = (newPass: TravelClearancePass) => {
    setTravelPasses((prev) => [newPass, ...prev]);
    setActiveTab("travel");
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/90 to-primary/10 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Phase 29 • International Scholars & Global Mobility Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Global Exchange Programs & International Affairs
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover bilateral study abroad opportunities across ETH Zürich, NUS & TUM, apply for international fellowships, lodge foreign course credit transfers, and verify authorized digital travel passes.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button
              size="sm"
              onClick={() => setIsCreditModalOpen(true)}
              className="rounded-2xl gap-2 text-xs shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            >
              <FileCheck className="w-4 h-4" />
              Credit Transfer
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsTravelModalOpen(true)}
              className="rounded-2xl gap-2 text-xs border-border/80 hover:bg-muted"
            >
              <Plane className="w-4 h-4 text-primary" />
              Travel Clearance Pass
            </Button>
          </div>
        </div>
      </div>

      {/* Telemetry Overview KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
            <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground tracking-tight font-mono">
              {overview.totalPartners}
            </div>
            <div className="text-xs text-muted-foreground font-medium">Partner Universities</div>
            <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" /> Top 30 QS Ranked
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground tracking-tight font-mono">
              {overview.totalExchangeSlots}
            </div>
            <div className="text-xs text-muted-foreground font-medium">Exchange Slots Open</div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" /> Tuition Reciprocity
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground tracking-tight font-mono">
              ${(overview.totalScholarshipsValue / 1000).toFixed(1)}k
            </div>
            <div className="text-xs text-muted-foreground font-medium">Global Fellowships</div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 mt-0.5">
              <Award className="w-3 h-3" /> External Fellowships
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-4 sm:p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
            <Plane className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground tracking-tight font-mono">
              {overview.activeScholarsAbroad}
            </div>
            <div className="text-xs text-muted-foreground font-medium">Scholars Abroad</div>
            <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3" /> Active Visas
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/70 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab("partners")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "partners"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Partner Universities ({partners.length})
          </button>
          <button
            onClick={() => setActiveTab("scholarships")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "scholarships"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Global Scholarships ({scholarships.length})
          </button>
          <button
            onClick={() => setActiveTab("credits")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "credits"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Credit Transfer ({credits.length})
          </button>
          <button
            onClick={() => setActiveTab("travel")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "travel"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            Travel Clearance ({travelPasses.length})
          </button>
        </div>

        {/* Global Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search universities, courses, or countries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Tab: Partner Universities */}
      {activeTab === "partners" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/30 p-3 rounded-2xl border border-border/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Filter Country:</span>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="text-xs rounded-xl bg-card border border-border px-2.5 py-1 text-foreground focus:outline-hidden"
              >
                <option value="all">All Countries</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <span className="text-xs font-semibold text-muted-foreground ml-2">Term:</span>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="text-xs rounded-xl bg-card border border-border px-2.5 py-1 text-foreground focus:outline-hidden"
              >
                <option value="all">All Semesters</option>
                <option value="Fall 2026">Fall 2026</option>
                <option value="Spring 2027">Spring 2027</option>
                <option value="Summer Research 2027">Summer Research 2027</option>
                <option value="Full Academic Year 2026-27">Full Academic Year 2026-27</option>
              </select>
            </div>

            <div className="text-xs text-muted-foreground">
              Showing <strong className="text-foreground">{filteredPartners.length}</strong> bilateral partners
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPartners.map((partner) => (
              <PartnerUniversityCard
                key={partner.id}
                partner={partner}
                onApply={() => setIsTravelModalOpen(true)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab: Global Scholarships */}
      {activeTab === "scholarships" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredScholarships.map((sch) => (
              <GlobalScholarshipCard
                key={sch.id}
                scholarship={sch}
                onApply={() => setIsCreditModalOpen(true)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab: Credit Transfer Requests */}
      {activeTab === "credits" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">
              Academic Credit Transfer & Course Equivalency Ledger
            </h2>
            <Button
              size="sm"
              onClick={() => setIsCreditModalOpen(true)}
              className="rounded-xl text-xs gap-1.5 h-8 bg-primary text-primary-foreground"
            >
              <FileCheck className="w-3.5 h-3.5" />
              Lodge New Course
            </Button>
          </div>

          <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] font-bold border-b border-border/60">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Host University</th>
                    <th className="px-4 py-3">Foreign Course</th>
                    <th className="px-4 py-3">Domestic Equivalent</th>
                    <th className="px-4 py-3 text-center">Credits (Host / Apex)</th>
                    <th className="px-4 py-3">Grade</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {credits.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-semibold text-foreground">
                        {c.student_name}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{c.host_university}</td>
                      <td className="px-4 py-3 font-mono font-medium text-foreground">
                        <div>{c.foreign_course_title}</div>
                        <div className="text-[10px] text-muted-foreground">{c.foreign_course_code}</div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground font-medium">
                        {c.equivalent_domestic_course}
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-semibold">
                        {c.credits_earned} / {c.equivalent_credits}
                      </td>
                      <td className="px-4 py-3 font-mono font-medium text-primary">
                        {c.grade_earned}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            c.status === "approved"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : c.status === "under_review"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Travel Clearance & Passes */}
      {activeTab === "travel" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">
              Dean of International Affairs — Authorized Departure Passes
            </h2>
            <Button
              size="sm"
              onClick={() => setIsTravelModalOpen(true)}
              className="rounded-xl text-xs gap-1.5 h-8 bg-primary text-primary-foreground"
            >
              <Plane className="w-3.5 h-3.5" />
              Request Travel Clearance
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {travelPasses.map((pass) => (
              <div
                key={pass.id}
                className="rounded-3xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary shrink-0">
                      <QrCode className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-primary">
                        {pass.pass_code}
                      </div>
                      <h3 className="font-bold text-sm text-foreground">{pass.student_name}</h3>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary shrink-0" />
                        <span>
                          {pass.host_institution} ({pass.destination_country})
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                    {pass.dean_approval_status}
                  </span>
                </div>

                <div className="text-xs space-y-1 bg-muted/40 p-3 rounded-2xl border border-border/40">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Passport (Encrypted):</span>
                    <strong className="font-mono text-foreground">{pass.passport_number_masked}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Visa Classification:</span>
                    <strong className="text-foreground">{pass.visa_type}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valid Term Window:</span>
                    <strong className="text-foreground font-mono">
                      {pass.valid_from} ➔ {pass.valid_until}
                    </strong>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> Dean Verified
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Token: {pass.digital_qr_token.substring(0, 16)}...
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <CreditTransferModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
        onSuccess={handleCreditSubmitted}
      />

      <TravelClearanceModal
        isOpen={isTravelModalOpen}
        onClose={() => setIsTravelModalOpen(false)}
        onSuccess={handlePassIssued}
      />
    </div>
  );
}
