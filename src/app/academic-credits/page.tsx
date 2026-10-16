"use client";

import React, { useState, useEffect } from "react";
import {
  ApaarStudentRegistry,
  AcademicCreditLedger,
  CreditTransferApplication,
  NepExitQualification,
  DigiLockerNadSyncLog,
  CreditCategory,
} from "@/types";
import { academicCreditsStore } from "@/lib/academic-credits/academic-credits-engine";
import {
  ApaarRegistryCard,
  CreditLedgerCard,
  CreditTransferCard,
  NepExitCard,
  ApplyTransferModal,
  VerifyDigilockerModal,
} from "@/components/academic-credits";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  ShieldCheck,
  BookOpen,
  ArrowRightLeft,
  GraduationCap,
  Search,
  PlusCircle,
  RefreshCw,
  Hash,
  Award,
  Sparkles,
  Building2,
  Calendar,
} from "lucide-react";

export default function AcademicCreditsPortalPage() {
  const [registries, setRegistries] = useState<ApaarStudentRegistry[]>([]);
  const [ledgers, setLedgers] = useState<AcademicCreditLedger[]>([]);
  const [transfers, setTransfers] = useState<CreditTransferApplication[]>([]);
  const [exitQualifications, setExitQualifications] = useState<NepExitQualification[]>([]);
  const [syncLogs, setSyncLogs] = useState<DigiLockerNadSyncLog[]>([]);

  const [activeTab, setActiveTab] = useState<
    "registries" | "ledgers" | "transfers" | "exits" | "sync"
  >("registries");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedRegistry, setSelectedRegistry] = useState<ApaarStudentRegistry | null>(null);
  const [syncing, setSyncing] = useState(false);

  // Load initial data from engine
  const refreshData = () => {
    const stats = academicCreditsStore.getSummaryStats();
    setRegistries([...stats.registries]);
    setLedgers([...stats.ledgers]);
    setTransfers([...stats.transfers]);
    setExitQualifications([...stats.exitQualifications]);
    setSyncLogs([...stats.syncLogs]);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleTriggerSync = () => {
    setSyncing(true);
    setTimeout(() => {
      academicCreditsStore.triggerNadSync("Dr. K. Swaminathan (Controller of Examinations)");
      refreshData();
      setSyncing(false);
    }, 800);
  };

  const handleApproveTransfer = (transfer: CreditTransferApplication) => {
    academicCreditsStore.updateTransferStatus(
      transfer.id,
      "approved_by_dean",
      transfer.equivalence_score,
      "Equivalence ratified by Board of Studies; credits deposited into Academic Bank of Credits."
    );
    refreshData();
  };

  const handleRejectTransfer = (transfer: CreditTransferApplication) => {
    academicCreditsStore.updateTransferStatus(
      transfer.id,
      "rejected",
      transfer.equivalence_score,
      "Course syllabus overlap insufficient (<75%) for credit transfer."
    );
    refreshData();
  };

  const stats = academicCreditsStore.getSummaryStats();

  // Filtered lists
  const filteredRegistries = registries.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.full_name.toLowerCase().includes(q) ||
      r.apaar_id.toLowerCase().includes(q) ||
      r.enrollment_number.toLowerCase().includes(q) ||
      r.department.toLowerCase().includes(q)
    );
  });

  const filteredLedgers = ledgers.filter((l) => {
    const matchesCategory = selectedCategory === "all" || l.course_category === selectedCategory;
    if (!matchesCategory) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.course_title.toLowerCase().includes(q) ||
      l.course_code.toLowerCase().includes(q) ||
      l.apaar_id.toLowerCase().includes(q) ||
      l.awarding_institution.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background text-foreground space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card/90 to-primary/5 p-6 md:p-8 border border-border/80 shadow-sm">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                Phase 51: National Education Policy (NEP 2020)
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs">
                DigiLocker NAD Live Gateway
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Academic Bank of Credits (ABC) & APAAR ID
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Automated Permanent Academic Account Registry (12-digit One Nation One Student ID),
              tamper-proof credit ledgers, inter-university SWAYAM transfer mobility, and NEP 2020 multiple exit pathways.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTriggerSync}
              disabled={syncing}
              className="gap-2 text-xs border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Sync DigiLocker NAD"}
            </Button>
            <Button
              size="sm"
              onClick={() => setTransferModalOpen(true)}
              className="gap-2 text-xs bg-primary text-primary-foreground shadow-sm"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Apply Credit Transfer
            </Button>
          </div>
        </div>

        {/* Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-6 mt-6 border-t border-border/50">
          <Card className="bg-background/60 border-border/50 backdrop-blur-sm">
            <CardContent className="p-3.5 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>Total Accumulated</span>
                <BookOpen className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-foreground">
                {stats.totalCreditsAccumulated}
              </div>
              <div className="text-[11px] text-muted-foreground">Credits Deposited in ABC</div>
            </CardContent>
          </Card>

          <Card className="bg-background/60 border-border/50 backdrop-blur-sm">
            <CardContent className="p-3.5 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>Active APAAR IDs</span>
                <CreditCard className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-foreground">
                {stats.totalApaarRegistered}
              </div>
              <div className="text-[11px] text-muted-foreground">100% Aadhaar Registered</div>
            </CardContent>
          </Card>

          <Card className="bg-background/60 border-border/50 backdrop-blur-sm">
            <CardContent className="p-3.5 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>DigiLocker NAD Rate</span>
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {stats.digilockerVerifiedPct}%
              </div>
              <div className="text-[11px] text-muted-foreground">Cryptographic Verification</div>
            </CardContent>
          </Card>

          <Card className="bg-background/60 border-border/50 backdrop-blur-sm">
            <CardContent className="p-3.5 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>Transfers Approved</span>
                <ArrowRightLeft className="h-4 w-4 text-purple-500" />
              </div>
              <div className="text-2xl font-black text-foreground">
                {stats.totalTransfersApproved}
              </div>
              <div className="text-[11px] text-muted-foreground">SWAYAM & Partner IITs</div>
            </CardContent>
          </Card>

          <Card className="bg-background/60 border-border/50 backdrop-blur-sm col-span-2 sm:col-span-1">
            <CardContent className="p-3.5 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>NEP Exit Dockets</span>
                <GraduationCap className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-foreground">
                {stats.totalNepExitDocketsAwarded}
              </div>
              <div className="text-[11px] text-muted-foreground">Certificates / Diplomas / Degrees</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60">
            <Button
              variant={activeTab === "registries" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("registries")}
              className="text-xs h-8 px-3 gap-1.5"
            >
              <CreditCard className="h-3.5 w-3.5" />
              APAAR Registries ({registries.length})
            </Button>

            <Button
              variant={activeTab === "ledgers" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("ledgers")}
              className="text-xs h-8 px-3 gap-1.5"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Credit Ledgers ({ledgers.length})
            </Button>

            <Button
              variant={activeTab === "transfers" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("transfers")}
              className="text-xs h-8 px-3 gap-1.5"
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              Credit Transfers ({transfers.length})
            </Button>

            <Button
              variant={activeTab === "exits" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("exits")}
              className="text-xs h-8 px-3 gap-1.5"
            >
              <GraduationCap className="h-3.5 w-3.5" />
              NEP Exit Dockets ({exitQualifications.length})
            </Button>

            <Button
              variant={activeTab === "sync" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("sync")}
              className="text-xs h-8 px-3 gap-1.5"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              DigiLocker NAD Sync ({syncLogs.length})
            </Button>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search APAAR, course, student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-card/60"
            />
          </div>
        </div>

        {/* Category filters for Credit Ledgers tab */}
        {activeTab === "ledgers" && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground pt-1">
            <span>Filter Category:</span>
            {[
              { id: "all", label: "All Categories" },
              { id: "major", label: "Major" },
              { id: "minor", label: "Minor" },
              { id: "multidisciplinary", label: "Multidisciplinary" },
              { id: "aec", label: "AEC" },
              { id: "sec", label: "SEC" },
              { id: "vac", label: "Value Added (VAC)" },
              { id: "internship_project", label: "Internship" },
            ].map((cat) => (
              <Badge
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.id)}
                className="cursor-pointer text-[11px] py-1 px-2.5 font-medium transition-colors"
              >
                {cat.label}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Tab Panels */}
      {activeTab === "registries" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRegistries.map((reg) => (
            <ApaarRegistryCard
              key={reg.id}
              registry={reg}
              onViewLedger={(r) => {
                setSearchQuery(r.apaar_id);
                setActiveTab("ledgers");
              }}
              onVerifyDigilocker={(r) => {
                setSelectedRegistry(r);
                setVerifyModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {activeTab === "ledgers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLedgers.map((item) => (
            <CreditLedgerCard key={item.id} ledger={item} />
          ))}
        </div>
      )}

      {activeTab === "transfers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transfers.map((item) => (
            <CreditTransferCard
              key={item.id}
              transfer={item}
              onApprove={handleApproveTransfer}
              onReject={handleRejectTransfer}
            />
          ))}
        </div>
      )}

      {activeTab === "exits" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exitQualifications.map((item) => (
            <NepExitCard key={item.id} exitDocket={item} />
          ))}
        </div>
      )}

      {activeTab === "sync" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <ShieldCheck className="h-4 w-4" />
              <span>National Academic Depository (NAD) & DigiLocker Merkle Sync Ledger</span>
            </div>
            <p className="text-xs text-muted-foreground">
              All academic degrees, provisional certificates, marksheets, and credit ledgers are hashed
              using SHA-256 and pushed to DigiLocker NAD nodes for instantaneous public and employer verification.
            </p>
          </div>

          <div className="space-y-3">
            {syncLogs.map((log) => (
              <Card key={log.id} className="border-border/80 bg-card/60">
                <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-foreground text-sm">{log.batch_token}</span>
                      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                        {log.sync_status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground">
                      Synced {log.synced_records_count} records • Authorized by {log.operator_officer}
                    </div>
                    <div className="font-mono text-[11px] text-primary">
                      Merkle Root: {log.sha256_merkle_root}
                    </div>
                  </div>

                  <div className="text-right shrink-0 text-muted-foreground font-mono text-[11px]">
                    <div className="flex items-center gap-1 justify-end">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(log.sync_timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Modals */}
      <ApplyTransferModal
        open={transferModalOpen}
        onOpenChange={setTransferModalOpen}
        onSuccess={() => refreshData()}
      />

      <VerifyDigilockerModal
        registry={selectedRegistry}
        open={verifyModalOpen}
        onOpenChange={setVerifyModalOpen}
      />
    </div>
  );
}
