"use client";

import React, { useState } from "react";
import {
  StudentClub,
  ClubMembership,
  ClubEventTicket,
  StudentMeritActivity,
  ClubCategory,
} from "@/types";
import {
  MOCK_CLUBS,
  MOCK_MEMBERSHIPS,
  MOCK_CLUB_TICKETS,
  MOCK_MERIT_ACTIVITIES,
  calculateClubOverview,
} from "@/lib/clubs/clubs-engine";
import { ClubDirectoryCard } from "@/components/clubs/club-directory-card";
import { ClubEventTicketModal } from "@/components/clubs/club-event-ticket-modal";
import { ActivityMeritBadge } from "@/components/clubs/activity-merit-badge";
import {
  Sparkles,
  Users,
  Ticket,
  Trophy,
  Search,
  CheckCircle2,
  Calendar,
  MapPin,
  QrCode,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClubsPortalPage() {
  const [activeTab, setActiveTab] = useState<
    "directory" | "my_clubs" | "tickets" | "merit"
  >("directory");

  // State
  const [clubs] = useState<StudentClub[]>(MOCK_CLUBS);
  const [memberships, setMemberships] = useState<ClubMembership[]>(MOCK_MEMBERSHIPS);
  const [tickets] = useState<ClubEventTicket[]>(MOCK_CLUB_TICKETS);
  const [activities] = useState<StudentMeritActivity[]>(MOCK_MERIT_ACTIVITIES);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<ClubEventTicket | null>(null);

  const overview = calculateClubOverview(
    "00000000-0000-0000-0000-000000000001",
    memberships,
    tickets,
    activities
  );

  const handleJoinClub = async (club: StudentClub) => {
    try {
      const res = await fetch("/api/clubs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubId: club.id, role: "member" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMemberships([...memberships, data.data]);
        alert(`Congratulations! You are now a member of ${club.name}.`);
      }
    } catch (err) {
      console.error("Join club error:", err);
    }
  };

  const filteredClubs = clubs.filter((c) => {
    const matchesCategory =
      selectedCategory === "all" || c.category === selectedCategory;
    const matchesQuery =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lead_student_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl space-y-6">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-border/70 bg-gradient-to-r from-card via-card/90 to-primary/5 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              Phase 25 Milestone
            </span>
            <span className="text-xs text-muted-foreground">
              Apex Student Affairs & Societies Council
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-2">
            Student Clubs & Technical Societies
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
            Explore 20+ specialized clubs, attend national hackathons, obtain digital entry passes, and earn verified activity merit credits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setActiveTab("tickets")}
            className="rounded-2xl text-xs font-bold gap-1.5 h-10 shadow-sm"
          >
            <Ticket className="w-4 h-4" />
            My Event Passes ({overview.myEventTickets.length})
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveTab("merit")}
            className="rounded-2xl text-xs font-semibold gap-1.5 h-10 border-border/80 text-amber-600 dark:text-amber-400"
          >
            <Trophy className="w-4 h-4" />
            {overview.totalMeritPoints} Merit Pts
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border/60">
        <button
          onClick={() => setActiveTab("directory")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "directory"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Users className="w-4 h-4" />
          Clubs Directory
        </button>

        <button
          onClick={() => setActiveTab("my_clubs")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "my_clubs"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          My Memberships ({overview.joinedClubs.length})
        </button>

        <button
          onClick={() => setActiveTab("tickets")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "tickets"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Ticket className="w-4 h-4" />
          Event Passes ({overview.myEventTickets.length})
        </button>

        <button
          onClick={() => setActiveTab("merit")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "merit"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Trophy className="w-4 h-4" />
          Activity Merit Ledger ({overview.totalMeritPoints} Pts)
        </button>
      </div>

      {/* Tab 1: Directory */}
      {activeTab === "directory" && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { key: "all", label: "All Societies" },
                { key: "technical", label: "Technical" },
                { key: "cultural", label: "Cultural" },
                { key: "sports", label: "Sports" },
                { key: "literary", label: "Literary" },
                { key: "social", label: "Social Outreach" },
              ].map((c) => (
                <button
                  key={c.key}
                  onClick={() => setSelectedCategory(c.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === c.key
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card border border-border/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search societies or leaders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-2xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClubs.map((club) => {
              const isMember = memberships.some((m) => m.club_id === club.id);
              return (
                <ClubDirectoryCard
                  key={club.id}
                  club={club}
                  isMember={isMember}
                  onJoin={handleJoinClub}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: My Memberships */}
      {activeTab === "my_clubs" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              My Active Society Affiliations
            </h3>
            <p className="text-xs text-muted-foreground">
              Your registered executive positions, committee roles, and society credentials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {overview.joinedClubs.map((m) => (
              <div
                key={m.id}
                className="rounded-3xl border border-border/60 bg-card p-5 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-foreground">
                      {m.club?.name}
                    </h4>
                    <span className="text-xs text-primary font-semibold capitalize">
                      {m.club?.category} Society
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    {m.role.replace("_", " ")}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">
                  {m.club?.description}
                </p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-border/40 text-muted-foreground">
                  <span>Joined: {new Date(m.joined_at).toLocaleDateString()}</span>
                  <span>Venue: {m.club?.meeting_venue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Tickets */}
      {activeTab === "tickets" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              Campus Event Passes & Entry Tokens
            </h3>
            <p className="text-xs text-muted-foreground">
              Digital QR vouchers for university symposia, concerts, and hackathon admittance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {overview.myEventTickets.map((tkt) => (
              <div
                key={tkt.id}
                className="rounded-3xl border border-border/60 bg-card p-5 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-primary">
                      {tkt.ticket_code}
                    </span>
                    <h4 className="text-base font-bold text-foreground mt-0.5">
                      {tkt.event_title}
                    </h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    {tkt.seat_tier}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-muted/40 border border-border/40 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {tkt.venue}
                  </span>
                  <span className="font-bold text-foreground">
                    {tkt.price === 0 ? "Complimentary Pass" : `₹${tkt.price}`}
                  </span>
                </div>

                <Button
                  onClick={() => setSelectedTicket(tkt)}
                  className="w-full rounded-2xl text-xs gap-1.5 h-9"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  View Verification QR Pass
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Merit */}
      {activeTab === "merit" && (
        <ActivityMeritBadge
          activities={overview.meritLedger}
          totalPoints={overview.totalMeritPoints}
        />
      )}

      {/* Ticket Modal */}
      {selectedTicket && (
        <ClubEventTicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}
