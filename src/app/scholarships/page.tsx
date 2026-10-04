"use client";

import React, { useState } from "react";
import {
  ScholarshipScheme,
  ScholarshipApplication,
  DisbursementTranche,
  ScholarshipCertificate,
} from "@/types";
import {
  MOCK_SCHOLARSHIP_SCHEMES,
  MOCK_SCHOLARSHIP_APPLICATIONS,
  MOCK_DISBURSEMENTS,
  MOCK_SCHOLARSHIP_CERTIFICATES,
  calculateScholarshipOverview,
} from "@/lib/scholarships/scholarship-engine";
import { ScholarshipSchemeCard } from "@/components/scholarships/scholarship-scheme-card";
import { AwardDisbursementCard } from "@/components/scholarships/award-disbursement-card";
import { ApplyScholarshipModal } from "@/components/scholarships/apply-scholarship-modal";
import { VerifyAwardModal } from "@/components/scholarships/verify-award-modal";
import {
  GraduationCap,
  Award,
  Landmark,
  FileText,
  Search,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ScholarshipsPortalPage() {
  const [activeTab, setActiveTab] = useState<
    "schemes" | "applications" | "disbursements" | "certificates"
  >("schemes");

  const [schemes] = useState<ScholarshipScheme[]>(MOCK_SCHOLARSHIP_SCHEMES);
  const [applications, setApplications] = useState<ScholarshipApplication[]>(
    MOCK_SCHOLARSHIP_APPLICATIONS
  );
  const [disbursements] = useState<DisbursementTranche[]>(MOCK_DISBURSEMENTS);
  const [certificates] = useState<ScholarshipCertificate[]>(
    MOCK_SCHOLARSHIP_CERTIFICATES
  );

  const [selectedScheme, setSelectedScheme] = useState<ScholarshipScheme | null>(null);
  const [selectedCert, setSelectedCert] = useState<ScholarshipCertificate | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("all");

  const overview = calculateScholarshipOverview(schemes, applications, disbursements, certificates);

  const filteredSchemes = schemes.filter((s) => {
    const matchesProvider =
      selectedProvider === "all" || s.provider_type === selectedProvider;
    const matchesSearch =
      !searchQuery.trim() ||
      s.scheme_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.provider_type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProvider && matchesSearch;
  });

  const handleApplyScheme = (scheme: ScholarshipScheme) => {
    setSelectedScheme(scheme);
    setIsApplyModalOpen(true);
  };

  const handleApplicationSuccess = (newApp: ScholarshipApplication) => {
    setApplications([newApp, ...applications]);
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-950/40 via-card to-background p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Phase 37 — Campus Merit & Financial Aid Nexus</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Scholarships & Financial Aid
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Explore corporate CSR grants, institutional merit waivers, and alumni endowments.
              Track Direct Benefit Transfer tranches and verify cryptographic scholarship honors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => {
                setSelectedScheme(schemes[0]);
                setIsApplyModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 font-semibold"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Apply for Scholarship
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCert(certificates[0]);
                setIsVerifyModalOpen(true);
              }}
              className="border-blue-500/30 hover:bg-blue-500/10 text-foreground"
            >
              <Award className="h-4 w-4 mr-2 text-blue-400" />
              Verify Certificate
            </Button>
          </div>
        </div>

        {/* Telemetry Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/50">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Total Aid Budget</span>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold text-foreground">
                ₹{(overview.totalScholarshipFundingInr / 10000000).toFixed(1)} Cr
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Disbursed DBT Tranches</span>
            <div className="flex items-center gap-2">
              <Landmark className="h-4 w-4 text-emerald-500" />
              <span className="text-2xl font-bold text-foreground">
                ₹{(overview.totalDisbursedInr / 10000000).toFixed(1)} Cr
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Open Schemes</span>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-purple-500" />
              <span className="text-2xl font-bold text-foreground">{overview.activeSchemesCount} Active</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Scholars Supported</span>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              <span className="text-2xl font-bold text-foreground">{overview.scholarsBenefitedCount}+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          {[
            { id: "schemes", label: "Scholarship Schemes", icon: GraduationCap },
            { id: "applications", label: "My Applications", icon: FileText, count: applications.length },
            { id: "disbursements", label: "DBT Tranches Ledger", icon: Landmark, count: disbursements.length },
            { id: "certificates", label: "Award Honors", icon: Award, count: certificates.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {tab.count}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* Search */}
        {activeTab === "schemes" && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scholarship grants..."
                className="w-full text-xs rounded-xl border border-input bg-card/60 pl-8 pr-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Tab 1: Schemes */}
      {activeTab === "schemes" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-muted-foreground whitespace-nowrap">Provider:</span>
            {[
              "all",
              "Institutional Merit",
              "Corporate CSR",
              "Alumni Endowment",
              "Government DBT",
            ].map((prov) => (
              <button
                key={prov}
                onClick={() => setSelectedProvider(prov)}
                className={`px-3 py-1 rounded-lg border transition-colors whitespace-nowrap ${
                  selectedProvider === prov
                    ? "bg-blue-500/20 text-blue-400 border-blue-500/40 font-medium"
                    : "border-border/60 text-muted-foreground hover:border-border"
                }`}
              >
                {prov === "all" ? "All Providers" : prov}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredSchemes.map((scheme) => (
              <ScholarshipSchemeCard
                key={scheme.id}
                scheme={scheme}
                onApply={handleApplyScheme}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Applications */}
      {activeTab === "applications" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-border/60 bg-card/60 p-5 space-y-3 backdrop-blur-md hover:border-blue-500/40 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-foreground text-sm leading-snug line-clamp-1">
                      {app.scheme_name}
                    </h4>
                    <span className="text-xs text-muted-foreground font-mono">
                      {app.application_code}
                    </span>
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[10px]">
                    {app.status}
                  </Badge>
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground border-y border-border/40 py-2.5">
                  <div className="flex justify-between">
                    <span>Scholar:</span>
                    <span className="font-medium text-foreground">{app.scholar_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Department:</span>
                    <span className="font-medium text-foreground truncate max-w-[180px]">{app.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Declared CGPA:</span>
                    <span className="font-bold text-blue-400">{app.current_cgpa.toFixed(2)}</span>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground line-clamp-2">
                  {app.statement_of_purpose || "No statement provided."}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Disbursements */}
      {activeTab === "disbursements" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {disbursements.map((d) => (
            <AwardDisbursementCard key={d.id} disbursement={d} />
          ))}
        </div>
      )}

      {/* Tab 4: Certificates */}
      {activeTab === "certificates" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="rounded-2xl border border-blue-500/30 bg-card/60 p-5 space-y-3 backdrop-blur-md"
            >
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                <h4 className="font-semibold text-foreground text-sm">{cert.award_title}</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Conferred upon: <strong className="text-foreground">{cert.scholar_name}</strong>
              </p>
              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                <span className="font-mono text-muted-foreground">{cert.certificate_code}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedCert(cert);
                    setIsVerifyModalOpen(true);
                  }}
                  className="text-xs h-7 border-blue-500/30"
                >
                  View Certificate
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <ApplyScholarshipModal
        scheme={selectedScheme}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={handleApplicationSuccess}
      />

      <VerifyAwardModal
        certificate={selectedCert}
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
      />
    </div>
  );
}
