"use client";

import React, { useState } from "react";
import {
  IndustryMoU,
  SponsoredGrant,
  IndustryLab,
  TechnologyLicense,
  MoUTier,
} from "@/types";
import {
  MOCK_INDUSTRY_MOUS,
  MOCK_SPONSORED_GRANTS,
  MOCK_INDUSTRY_LABS,
  MOCK_TECHNOLOGY_LICENSES,
  getIndustryMoUs,
  submitGrantProposal,
  requestTechLicense,
} from "@/lib/partnerships/partnerships-engine";
import { PartnerMoUCard } from "@/components/partnerships/partner-mou-card";
import { SponsoredGrantCard } from "@/components/partnerships/sponsored-grant-card";
import { IndustryLabCard } from "@/components/partnerships/industry-lab-card";
import { GrantProposalModal } from "@/components/partnerships/grant-proposal-modal";
import { TechLicenseModal } from "@/components/partnerships/tech-license-modal";
import { MoUCredentialModal } from "@/components/partnerships/mou-credential-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  FileText,
  Cpu,
  ShieldCheck,
  Search,
  PlusCircle,
  IndianRupee,
  Layers,
  Sparkles,
  Award,
  Zap,
} from "lucide-react";

export default function PartnershipsPortalPage() {
  const [mous] = useState<IndustryMoU[]>(MOCK_INDUSTRY_MOUS);
  const [grants, setGrants] = useState<SponsoredGrant[]>(MOCK_SPONSORED_GRANTS);
  const [labs] = useState<IndustryLab[]>(MOCK_INDUSTRY_LABS);
  const [licenses, setLicenses] = useState<TechnologyLicense[]>(MOCK_TECHNOLOGY_LICENSES);

  const [activeTab, setActiveTab] = useState<"mous" | "grants" | "labs" | "ip_transfer">("mous");
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [selectedMoUForModal, setSelectedMoUForModal] = useState<IndustryMoU | null>(null);
  const [isMoUCredentialOpen, setIsMoUCredentialOpen] = useState(false);

  const handleOpenMoUModal = (mou: IndustryMoU) => {
    setSelectedMoUForModal(mou);
    setIsMoUCredentialOpen(true);
  };

  const handleCreateGrant = (data: any) => {
    const created = submitGrantProposal(data);
    setGrants([created, ...grants]);
  };

  const handleCreateLicense = (data: any) => {
    const created = requestTechLicense(data);
    setLicenses([created, ...licenses]);
  };

  // Filtered MoUs
  const filteredMoUs = mous.filter((m) => {
    const matchQuery =
      m.partner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.scope.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.mou_token.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSector = selectedSector === "all" || m.industry_sector.toLowerCase().includes(selectedSector.toLowerCase());
    return matchQuery && matchSector;
  });

  const totalCommittedInrCr = (mous.reduce((acc, m) => acc + (m.financial_commitment_inr || 0), 0) / 10000000).toFixed(1);
  const totalGrantOutlayInrLakhs = (grants.reduce((acc, g) => acc + g.grant_amount_inr, 0) / 100000).toFixed(0);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-background border border-border/60 p-6 md:p-8 shadow-sm">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="border-primary/40 text-primary bg-primary/10 font-bold px-3 py-1 text-xs">
              Phase 45 Gateway
            </Badge>
            <Badge variant="secondary" className="text-xs bg-muted/60 text-muted-foreground">
              Corporate Alliances & Research Grants
            </Badge>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <Building2 className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            Industry MoUs, Corporate CSR & Research Hub
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm max-w-3xl leading-relaxed">
            Centralized institutional ledger for Fortune 500 corporate MoUs, co-sponsored corporate CSR research grants,
            joint enterprise innovation laboratories, and technology transfer dockets.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="bg-card/70 backdrop-blur-md p-3 rounded-xl border border-border/50">
              <span className="text-[11px] text-muted-foreground block">Active Corporate MoUs</span>
              <span className="text-xl md:text-2xl font-bold text-foreground">{mous.length} Alliances</span>
            </div>
            <div className="bg-card/70 backdrop-blur-md p-3 rounded-xl border border-border/50">
              <span className="text-[11px] text-muted-foreground block">Total Committed Capital</span>
              <span className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">₹{totalCommittedInrCr} Cr</span>
            </div>
            <div className="bg-card/70 backdrop-blur-md p-3 rounded-xl border border-border/50">
              <span className="text-[11px] text-muted-foreground block">Active Sponsored Grants</span>
              <span className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">₹{totalGrantOutlayInrLakhs}L Outlay</span>
            </div>
            <div className="bg-card/70 backdrop-blur-md p-3 rounded-xl border border-border/50">
              <span className="text-[11px] text-muted-foreground block">Co-Branded Industry Labs</span>
              <span className="text-xl md:text-2xl font-bold text-purple-600 dark:text-purple-400">{labs.length} Facilities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Action Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/60 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Button
            variant={activeTab === "mous" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("mous")}
            className="text-xs gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5" />
            Active MoUs ({mous.length})
          </Button>
          <Button
            variant={activeTab === "grants" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("grants")}
            className="text-xs gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            Sponsored Grants ({grants.length})
          </Button>
          <Button
            variant={activeTab === "labs" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("labs")}
            className="text-xs gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5" />
            Industry Labs ({labs.length})
          </Button>
          <Button
            variant={activeTab === "ip_transfer" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("ip_transfer")}
            className="text-xs gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            IP & Licensing ({licenses.length})
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button
            size="sm"
            onClick={() => setIsGrantModalOpen(true)}
            className="text-xs gap-1.5 flex-1 md:flex-initial"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Submit Grant Proposal
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsLicenseModalOpen(true)}
            className="text-xs gap-1.5 flex-1 md:flex-initial"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            Inquire Tech License
          </Button>
        </div>
      </div>

      {/* Tab 1: Industry MoUs */}
      {activeTab === "mous" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search MoUs by enterprise name, scope, or token..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-card/60 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg border border-border bg-card/60 focus:outline-none focus:ring-1 focus:ring-primary sm:w-56"
            >
              <option value="all">All Industry Sectors</option>
              <option value="artificial intelligence">AI & Semiconductors</option>
              <option value="automotive">Automotive & EV</option>
              <option value="biotechnology">Biotech & Pharma</option>
              <option value="telecommunications">Telecom & 6G</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {filteredMoUs.map((mou) => (
              <PartnerMoUCard
                key={mou.id}
                mou={mou}
                onViewCredentials={handleOpenMoUModal}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Sponsored Grants */}
      {activeTab === "grants" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {grants.map((grant) => (
            <SponsoredGrantCard key={grant.id} grant={grant} />
          ))}
        </div>
      )}

      {/* Tab 3: Industry Labs */}
      {activeTab === "labs" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {labs.map((lab) => (
            <IndustryLabCard key={lab.id} lab={lab} />
          ))}
        </div>
      )}

      {/* Tab 4: Technology Licensing */}
      {activeTab === "ip_transfer" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {licenses.map((lic) => (
              <Card key={lic.id} className="border border-border/60 bg-card/60 backdrop-blur-md p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
                      {lic.licensing_token}
                    </span>
                    <h3 className="text-base font-bold text-foreground mt-1.5">{lic.patent_title}</h3>
                    <p className="text-xs text-muted-foreground">{lic.patent_number}</p>
                  </div>
                  <Badge variant="outline" className="text-xs text-emerald-600 bg-emerald-500/10 font-bold uppercase">
                    {lic.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs bg-muted/20 p-2.5 rounded-lg">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Licensee Enterprise</span>
                    <span className="font-semibold text-foreground">{lic.licensee_org}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Technology Readiness</span>
                    <span className="font-semibold text-primary">TRL Level {lic.trl_level}</span>
                  </div>
                </div>
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-muted-foreground block text-[11px]">Commercial Royalty Terms</span>
                  <p className="text-xs text-foreground bg-muted/10 p-2 rounded border border-border/30">{lic.royalty_terms}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <GrantProposalModal
        isOpen={isGrantModalOpen}
        onClose={() => setIsGrantModalOpen(false)}
        onSubmit={handleCreateGrant}
      />

      <TechLicenseModal
        isOpen={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
        onSubmit={handleCreateLicense}
      />

      <MoUCredentialModal
        isOpen={isMoUCredentialOpen}
        onClose={() => setIsMoUCredentialOpen(false)}
        mou={selectedMoUForModal}
      />
    </div>
  );
}
