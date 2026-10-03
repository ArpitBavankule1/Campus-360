"use client";

import React, { useState } from "react";
import {
  SportsArena,
  AthleticLeague,
  GymMembership,
  EquipmentLoan,
} from "@/types";
import {
  MOCK_SPORTS_ARENAS,
  MOCK_ATHLETIC_LEAGUES,
  MOCK_GYM_MEMBERS,
  MOCK_EQUIPMENT_LOANS,
  calculateSportsOverview,
} from "@/lib/sports/sports-engine";
import { ArenaBookingCard } from "@/components/sports/arena-booking-card";
import { AthleticMatchCard } from "@/components/sports/athletic-match-card";
import { CourtReservationModal } from "@/components/sports/court-reservation-modal";
import { GymPassModal } from "@/components/sports/gym-pass-modal";
import {
  Trophy,
  Dumbbell,
  Shield,
  Package,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
  MapPin,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SportsPortalPage() {
  const [activeTab, setActiveTab] = useState<
    "arenas" | "leagues" | "gym" | "equipment"
  >("arenas");

  const [arenas] = useState<SportsArena[]>(MOCK_SPORTS_ARENAS);
  const [leagues] = useState<AthleticLeague[]>(MOCK_ATHLETIC_LEAGUES);
  const [gymMembers, setGymMembers] = useState<GymMembership[]>(MOCK_GYM_MEMBERS);
  const [equipment] = useState<EquipmentLoan[]>(MOCK_EQUIPMENT_LOANS);

  const [selectedArena, setSelectedArena] = useState<SportsArena | null>(null);
  const [isCourtModalOpen, setIsCourtModalOpen] = useState(false);
  const [isGymModalOpen, setIsGymModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState("all");

  const overview = calculateSportsOverview(arenas, leagues, gymMembers, equipment);

  const filteredArenas = arenas.filter((a) => {
    const matchesSport = selectedSport === "all" || a.sport_type === selectedSport;
    const matchesSearch =
      !searchQuery.trim() ||
      a.arena_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location_venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.sport_type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSport && matchesSearch;
  });

  const filteredLeagues = leagues.filter((l) => {
    const matchesSport = selectedSport === "all" || l.sport_type === selectedSport;
    const matchesSearch =
      !searchQuery.trim() ||
      l.tournament_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.sport_type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSport && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 via-card to-background p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" /> Phase 32: Smart Campus Sports Arena & Athletics
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Apex Athletic Complex & High-Performance Arena
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Olympic-standard floodlit synthetic courts, inter-department varsity tournaments,
              biometric turnstile gym passes, and gear checkouts.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setIsGymModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20"
            >
              <Dumbbell className="mr-2 h-4 w-4" /> Issue Gym Pass
            </Button>
            <Button
              onClick={() => {
                setSelectedArena(arenas[0]);
                setIsCourtModalOpen(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
            >
              <Trophy className="mr-2 h-4 w-4" /> Book Court
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Overview Telemetry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Olympic Arenas</span>
            <Trophy className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">{overview.totalArenas}</div>
          <p className="text-[11px] text-emerald-500 mt-1">Synthetic & Hardwood</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Varsity Tournaments</span>
            <Shield className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {overview.activeAthleticTournaments}
          </div>
          <p className="text-[11px] text-blue-500 mt-1">Inter-Department Leagues</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Gym Passes Issued</span>
            <Dumbbell className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {overview.enrolledGymMembers}
          </div>
          <p className="text-[11px] text-purple-500 mt-1">Biometric RFID active</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Gear on Loan</span>
            <Package className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {overview.activeEquipmentLoans}
          </div>
          <p className="text-[11px] text-amber-500 mt-1">Deposit refund guarantee</p>
        </div>
      </div>

      {/* Tabs & Navigation */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("arenas")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "arenas"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Sports Courts & Arenas
        </button>
        <button
          onClick={() => setActiveTab("leagues")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "leagues"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Varsity Leagues & Cups
        </button>
        <button
          onClick={() => setActiveTab("gym")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "gym"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Campus Fitness & Gym Pass
        </button>
        <button
          onClick={() => setActiveTab("equipment")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "equipment"
              ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Equipment Loan Desk
        </button>
      </div>

      {/* Tab: Arenas */}
      {activeTab === "arenas" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courts, venues, or sport..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-card/60 pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="rounded-xl border border-border bg-card/60 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Sports</option>
              <option value="Badminton">Badminton</option>
              <option value="Basketball">Basketball</option>
              <option value="Football / Turf">Football / Turf</option>
              <option value="Tennis">Tennis</option>
              <option value="Swimming Pool">Swimming Pool</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArenas.map((arena) => (
              <ArenaBookingCard
                key={arena.id}
                arena={arena}
                onReserve={(a) => {
                  setSelectedArena(a);
                  setIsCourtModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab: Leagues */}
      {activeTab === "leagues" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLeagues.map((league) => (
              <AthleticMatchCard
                key={league.id}
                league={league}
                onRegisterTeam={(l) => {
                  alert(`Registering squad for ${l.tournament_title}. Contact Physical Education Office for jersey clearance.`);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab: Gym */}
      {activeTab === "gym" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-purple-500/20 bg-card/60 p-6 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">High-Performance Fitness Center</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Equipped with Olympic bumper plates, Hammer Strength rigs, and certified NSNIS strength coaches.
              </p>
            </div>
            <Button
              onClick={() => setIsGymModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white font-medium"
            >
              <Dumbbell className="mr-2 h-4 w-4" /> Issue Biometric Pass
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gymMembers.map((member) => (
              <div
                key={member.id}
                className="rounded-2xl border border-border/60 bg-card p-5 shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                      <Dumbbell className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">
                        {member.scholar_name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        {member.scholar_id}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30">
                    {member.tier}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground space-y-1 py-2 border-y border-border/40 font-mono">
                  <div>Pass Code: <strong className="text-foreground">{member.pass_code}</strong></div>
                  <div>Slot: <strong className="text-foreground">{member.fitness_slot}</strong></div>
                  <div>Trainer: <strong className="text-foreground">{member.trainer_assigned}</strong></div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 text-emerald-500 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Biometrics Enrolled
                  </span>
                  <span>Valid until {member.valid_until}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Equipment */}
      {activeTab === "equipment" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-500/20 bg-card/60 p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold text-foreground">Sports Equipment Checkout Desk</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Borrow BWF-certified rackets, FIFA balls, cricket kits, and squash gear. Deposit is automatically refunded on timely return.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {equipment.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-border/60 bg-card p-5 shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">
                        {item.item_name}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        {item.sport_type} • Code: {item.equipment_code}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                    {item.status}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground space-y-1 py-2 border-y border-border/40 font-mono">
                  <div>Borrower: <strong className="text-foreground">{item.borrower_name}</strong></div>
                  <div>Condition: <strong className="text-foreground">{item.item_condition}</strong></div>
                  <div>Deposit: <strong className="text-foreground">₹{item.deposit_inr}</strong></div>
                  <div>Return Due: <strong className="text-foreground">{new Date(item.due_time).toLocaleTimeString()}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <CourtReservationModal
        arena={selectedArena}
        isOpen={isCourtModalOpen}
        onClose={() => setIsCourtModalOpen(false)}
      />

      <GymPassModal
        isOpen={isGymModalOpen}
        onClose={() => setIsGymModalOpen(false)}
        onSuccess={() => {
          // refresh mock
        }}
      />
    </div>
  );
}
