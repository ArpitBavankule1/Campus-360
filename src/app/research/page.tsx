"use client";

import React, { useState } from "react";
import {
  ResearchPublication,
  ResearchGrant,
  PatentApplication,
  InnovationStartup,
} from "@/types";
import {
  MOCK_PUBLICATIONS,
  MOCK_GRANTS,
  MOCK_PATENTS,
  MOCK_STARTUPS,
  calculateResearchOverview,
} from "@/lib/research/research-engine";
import { PublicationCard } from "@/components/research/publication-card";
import { GrantProgressCard } from "@/components/research/grant-progress-card";
import { PatentFilingModal } from "@/components/research/patent-filing-modal";
import { StartupShowcaseCard } from "@/components/research/startup-showcase-card";
import {
  BookOpen,
  Award,
  FileCheck2,
  Rocket,
  Search,
  Sparkles,
  Quote,
  ShieldCheck,
  TrendingUp,
  PlusCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResearchPortalPage() {
  const [activeTab, setActiveTab] = useState<
    "publications" | "grants" | "patents" | "startups"
  >("publications");

  // State
  const [publications, setPublications] = useState<ResearchPublication[]>(MOCK_PUBLICATIONS);
  const [grants] = useState<ResearchGrant[]>(MOCK_GRANTS);
  const [patents, setPatents] = useState<PatentApplication[]>(MOCK_PATENTS);
  const [startups] = useState<InnovationStartup[]>(MOCK_STARTUPS);

  // Modals & Filters
  const [isFilingModalOpen, setIsFilingModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndexing, setSelectedIndexing] = useState("all");

  const overview = calculateResearchOverview(
    publications,
    grants,
    patents,
    startups
  );

  const filteredPublications = publications.filter((p) => {
    const matchesIndexing =
      selectedIndexing === "all" || p.indexing === selectedIndexing;
    const matchesSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.journal_or_conference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authors.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesIndexing && matchesSearch;
  });

  const handlePatentFiled = (newPatent: PatentApplication) => {
    setPatents((prev) => [newPatent, ...prev]);
    setActiveTab("patents");
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/90 to-blue-500/10 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Phase 28 • Research Publications, Grants & IPR Incubator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Institutional Research Repository & Innovation Hub
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Explore peer-reviewed publications across Scopus, IEEE & Nature, track multi-crore DST/ISRO sponsored research grants, file institutional patents, and showcase incubated deep-tech ventures.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button
              size="sm"
              onClick={() => setIsFilingModalOpen(true)}
              className="rounded-2xl gap-2 text-xs shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            >
              <FileCheck2 className="w-4 h-4" />
              File Patent / IPR
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("grants")}
              className="rounded-2xl gap-2 text-xs border-border"
            >
              <Award className="w-4 h-4" />
              Sponsored Grants
            </Button>
          </div>
        </div>

        {/* Telemetry Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-border/60">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              Indexed Papers
            </p>
            <p className="text-xl sm:text-2xl font-black text-foreground">
              {overview.totalPublications} Publications
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Quote className="w-3.5 h-3.5 text-amber-500" />
              Total Citations
            </p>
            <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
              {overview.totalCitations} Citations
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-500" />
              Grant Funding
            </p>
            <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
              ₹{(overview.totalGrantFunding / 10000000).toFixed(2)} Crores
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Rocket className="w-3.5 h-3.5 text-rose-500" />
              Startups & Patents
            </p>
            <p className="text-xl sm:text-2xl font-black text-foreground">
              {overview.totalPatentsFiled} Patents • {overview.incubatedStartupsCount} Ventures
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border/80 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("publications")}
          className={`px-4 py-2.5 text-xs font-semibold rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "publications"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Publications ({filteredPublications.length})
        </button>

        <button
          onClick={() => setActiveTab("grants")}
          className={`px-4 py-2.5 text-xs font-semibold rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "grants"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          Sponsored Grants ({grants.length})
        </button>

        <button
          onClick={() => setActiveTab("patents")}
          className={`px-4 py-2.5 text-xs font-semibold rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "patents"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          Patents & IPR ({patents.length})
        </button>

        <button
          onClick={() => setActiveTab("startups")}
          className={`px-4 py-2.5 text-xs font-semibold rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "startups"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <Rocket className="w-3.5 h-3.5" />
          Incubation Startups ({startups.length})
        </button>
      </div>

      {/* Tab 1: Publications */}
      {activeTab === "publications" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search publications by title, author, or DOI..."
                className="w-full text-xs rounded-2xl border border-input bg-card pl-9 pr-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>

            <select
              value={selectedIndexing}
              onChange={(e) => setSelectedIndexing(e.target.value)}
              className="text-xs rounded-2xl border border-input bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            >
              <option value="all">All Indexing Databases</option>
              <option value="IEEE Xplore">IEEE Xplore</option>
              <option value="Springer">Springer / Nature</option>
              <option value="ACM">ACM Digital Library</option>
              <option value="Scopus">Scopus</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPublications.map((pub) => (
              <PublicationCard key={pub.id} publication={pub} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Grants */}
      {activeTab === "grants" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Sponsored Research Grants & Funding Outlays
            </h3>
            <p className="text-xs text-muted-foreground">
              Government and industry sponsored research programs with milestone deliverables
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {grants.map((grant) => (
              <GrantProgressCard key={grant.id} grant={grant} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Patents */}
      {activeTab === "patents" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Institutional Patent & IPR Portfolio
              </h3>
              <p className="text-xs text-muted-foreground">
                Inventions filed under Indian Patent Office (IPO) and PCT international treaties
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsFilingModalOpen(true)}
              className="rounded-2xl text-xs gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              File New Patent
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {patents.map((pat) => (
              <div
                key={pat.id}
                className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {pat.ipr_type}
                    </span>
                    <h4 className="text-base font-bold text-foreground mt-1">
                      {pat.title}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary capitalize">
                    {pat.status}
                  </span>
                </div>

                <p className="text-xs text-primary font-medium">
                  Inventors: {pat.inventors.join(", ")}
                </p>

                <p className="text-xs text-muted-foreground/90 line-clamp-3 leading-relaxed">
                  {pat.abstract}
                </p>

                <div className="p-3 rounded-2xl bg-muted/40 border border-border/40 text-xs flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-foreground">
                    {pat.application_number}
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    Filed: {pat.filing_date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Startups */}
      {activeTab === "startups" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Campus Incubated Startups & Innovation Ventures
            </h3>
            <p className="text-xs text-muted-foreground">
              High-growth technology startups incubated at University Maker Pods & AI Labs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {startups.map((st) => (
              <StartupShowcaseCard key={st.id} startup={st} />
            ))}
          </div>
        </div>
      )}

      {/* Patent Filing Modal */}
      <PatentFilingModal
        isOpen={isFilingModalOpen}
        onClose={() => setIsFilingModalOpen(false)}
        onSuccess={handlePatentFiled}
      />
    </div>
  );
}
