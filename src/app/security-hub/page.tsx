"use client";

import React, { useState } from "react";
import {
  VisitorPass,
  TurnstileLog,
  LostAndFoundItem,
  PatrolCheckpoint,
} from "@/types";
import {
  MOCK_VISITOR_PASSES,
  MOCK_TURNSTILE_LOGS,
  MOCK_LOST_ITEMS,
  MOCK_PATROLS,
  calculateSecurityOverview,
} from "@/lib/security-hub/security-engine";
import { VisitorPassCard } from "@/components/security-hub/visitor-pass-card";
import { LostFoundItemCard } from "@/components/security-hub/lost-found-item-card";
import { VisitorRequestModal } from "@/components/security-hub/visitor-request-modal";
import { ReportLostItemModal } from "@/components/security-hub/report-lost-item-modal";
import {
  ShieldCheck,
  Users,
  Radio,
  HelpCircle,
  Search,
  Sparkles,
  AlertTriangle,
  QrCode,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SecurityHubPortalPage() {
  const [activeTab, setActiveTab] = useState<
    "visitors" | "turnstiles" | "lostfound" | "patrols"
  >("visitors");

  const [visitors, setVisitors] = useState<VisitorPass[]>(MOCK_VISITOR_PASSES);
  const [logs] = useState<TurnstileLog[]>(MOCK_TURNSTILE_LOGS);
  const [lostItems, setLostItems] = useState<LostAndFoundItem[]>(MOCK_LOST_ITEMS);
  const [patrols] = useState<PatrolCheckpoint[]>(MOCK_PATROLS);

  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVisitorStatus, setSelectedVisitorStatus] = useState("all");
  const [selectedItemCategory, setSelectedItemCategory] = useState("all");

  const overview = calculateSecurityOverview(visitors, logs, lostItems, patrols);

  const filteredVisitors = visitors.filter((v) => {
    const matchesStatus =
      selectedVisitorStatus === "all" || v.status === selectedVisitorStatus;
    const matchesSearch =
      !searchQuery.trim() ||
      v.visitor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.host_person.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.pass_code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredLostItems = lostItems.filter((i) => {
    const matchesCategory =
      selectedItemCategory === "all" || i.category === selectedItemCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.found_location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-950/40 via-card to-background p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
              <Sparkles className="h-3.5 w-3.5" /> Phase 34: Smart Campus Security & Command Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Apex Campus Security Operations & Visitor Command Hub
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Cryptographic QR visitor gate passes, smart RFID speedlane turnstile telemetry,
              tailgating anti-passback monitoring, AI lost & found matching, and 24x7 guard patrols.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setIsReportModalOpen(true)}
              className="bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/20"
            >
              <HelpCircle className="mr-2 h-4 w-4" /> Report Found Item
            </Button>
            <Button
              onClick={() => setIsVisitorModalOpen(true)}
              className="bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20"
            >
              <ShieldCheck className="mr-2 h-4 w-4" /> Issue Visitor Pass
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Overview Telemetry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Active Visitors</span>
            <Users className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">{overview.activeVisitorsOnCampus}</div>
          <p className="text-[11px] text-amber-500 mt-1">Checked in at gates</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Daily Turnstile Taps</span>
            <Radio className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {overview.dailyTurnstileTaps.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-500 mt-1">RFID smart lane events</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Unclaimed Lost Items</span>
            <HelpCircle className="h-4 w-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {overview.unclaimedLostItems}
          </div>
          <p className="text-[11px] text-sky-500 mt-1">Secured in central vault</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Patrol Completion</span>
            <ShieldCheck className="h-4 w-4 text-violet-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {overview.patrolRouteCompletionRate}%
          </div>
          <p className="text-[11px] text-violet-500 mt-1">NFC checkpoint adherence</p>
        </div>
      </div>

      {/* Tabs & Navigation */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("visitors")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "visitors"
              ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Visitor Passes & Gates
        </button>
        <button
          onClick={() => setActiveTab("turnstiles")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "turnstiles"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Smart Turnstile Telemetry
        </button>
        <button
          onClick={() => setActiveTab("lostfound")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "lostfound"
              ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          AI Lost & Found Repository
        </button>
        <button
          onClick={() => setActiveTab("patrols")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "patrols"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          24x7 Guard Patrol Telemetry
        </button>
      </div>

      {/* Tab: Visitors */}
      {activeTab === "visitors" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search visitor name, host, or pass code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-card/60 pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <select
              value={selectedVisitorStatus}
              onChange={(e) => setSelectedVisitorStatus(e.target.value)}
              className="rounded-xl border border-border bg-card/60 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Statuses</option>
              <option value="Checked In">Checked In</option>
              <option value="Pre-Registered">Pre-Registered</option>
              <option value="Departed">Departed</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVisitors.map((pass) => (
              <VisitorPassCard
                key={pass.id}
                pass={pass}
                onViewBadge={(p) => {
                  alert(`Visitor Gate QR Pass for ${p.visitor_name}: ${p.pass_code}`);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab: Turnstiles */}
      {activeTab === "turnstiles" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-500/20 bg-card/60 p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold text-foreground">RFID Speedlane Turnstile Event Stream</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time biometric & smart card barrier tap events with automated anti-passback and tailgating anomaly flags.
            </p>
          </div>

          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-card/80 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    log.anomaly_flag
                      ? "bg-destructive/10 text-destructive border border-destructive/20"
                      : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  }`}>
                    {log.anomaly_flag ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : (
                      <Radio className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">
                      {log.checkpoint_name}
                    </h4>
                    <span className="text-xs text-muted-foreground font-mono">
                      Card: {log.card_hash} • Role: {log.user_role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <Badge
                      variant="outline"
                      className={
                        log.anomaly_flag
                          ? "bg-destructive/15 text-destructive border-destructive/30"
                          : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                      }
                    >
                      {log.access_result}
                    </Badge>
                    <p className="text-[11px] text-muted-foreground font-mono mt-1">
                      {new Date(log.tap_time).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Lost & Found */}
      {activeTab === "lostfound" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search lost property by title, description, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-card/60 pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <select
              value={selectedItemCategory}
              onChange={(e) => setSelectedItemCategory(e.target.value)}
              className="rounded-xl border border-border bg-card/60 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Categories</option>
              <option value="Electronics & Laptops">Electronics & Laptops</option>
              <option value="Wallets & ID Cards">Wallets & ID Cards</option>
              <option value="Keys & Smart Badges">Keys & Smart Badges</option>
              <option value="Bags & Backpacks">Bags & Backpacks</option>
              <option value="Watches & Jewellery">Watches & Jewellery</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLostItems.map((item) => (
              <LostFoundItemCard
                key={item.id}
                item={item}
                onClaim={(it) => {
                  alert(`Claim initiated for ${it.title} (${it.item_code}). Present your student ID roll at the Campus Security Control Desk.`);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab: Patrols */}
      {activeTab === "patrols" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-violet-500/20 bg-card/60 p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold text-foreground">24x7 Campus Security Patrol Route Telemetry</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Continuous electronic guard tour tracking with NFC beacon verification covering hostel quads, laboratory corridors, and campus boundary perimeters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patrols.map((patrol) => (
              <div
                key={patrol.id}
                className="rounded-2xl border border-border/60 bg-card p-5 shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 border border-violet-500/20">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">
                        {patrol.route_name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        {patrol.checkpoint_marker}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                    {patrol.status}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground space-y-1 py-2 border-y border-border/40 font-mono">
                  <div>Assigned Officer: <strong className="text-foreground">{patrol.guard_name}</strong></div>
                  <div>Last Tag Scan: <strong className="text-foreground">{new Date(patrol.last_patrolled_at).toLocaleTimeString()}</strong></div>
                  <div>Telemetry Signal: <strong className="text-emerald-500">Live Encrypted NFC</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <VisitorRequestModal
        isOpen={isVisitorModalOpen}
        onClose={() => setIsVisitorModalOpen(false)}
        onSuccess={(newPass) => {
          setVisitors((prev) => [newPass, ...prev]);
        }}
      />

      <ReportLostItemModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSuccess={(newItem) => {
          setLostItems((prev) => [newItem, ...prev]);
        }}
      />
    </div>
  );
}
