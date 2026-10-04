"use client";

import React, { useState } from "react";
import {
  AuditoriumHall,
  AuditoriumReservation,
  EventTicket,
  StageEquipmentRider,
} from "@/types";
import {
  MOCK_AUDITORIUM_HALLS,
  MOCK_AUDITORIUM_RESERVATIONS,
  MOCK_EVENT_TICKETS,
  MOCK_STAGE_EQUIPMENT_RIDERS,
  calculateAuditoriumOverview,
} from "@/lib/auditorium/auditorium-engine";
import { AuditoriumVenueCard } from "@/components/auditorium/auditorium-venue-card";
import { EventTicketCard } from "@/components/auditorium/event-ticket-card";
import { BookHallModal } from "@/components/auditorium/book-hall-modal";
import { StageEquipmentModal } from "@/components/auditorium/stage-equipment-modal";
import {
  Theater,
  Ticket,
  Calendar,
  Volume2,
  Users,
  Search,
  Sparkles,
  Clock,
  MapPin,
  CheckCircle2,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AuditoriumPortalPage() {
  const [activeTab, setActiveTab] = useState<
    "halls" | "reservations" | "tickets" | "equipment"
  >("halls");

  const [halls] = useState<AuditoriumHall[]>(MOCK_AUDITORIUM_HALLS);
  const [reservations, setReservations] = useState<AuditoriumReservation[]>(
    MOCK_AUDITORIUM_RESERVATIONS
  );
  const [tickets, setTickets] = useState<EventTicket[]>(MOCK_EVENT_TICKETS);
  const [riders, setRiders] = useState<StageEquipmentRider[]>(
    MOCK_STAGE_EQUIPMENT_RIDERS
  );

  const [selectedHall, setSelectedHall] = useState<AuditoriumHall | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const overview = calculateAuditoriumOverview(halls, reservations, tickets, riders);

  const filteredHalls = halls.filter((h) => {
    const matchesStatus =
      selectedStatus === "all" || h.current_status === selectedStatus;
    const matchesSearch =
      !searchQuery.trim() ||
      h.hall_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.venue_building.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleBookHall = (hall: AuditoriumHall) => {
    setSelectedHall(hall);
    setIsBookModalOpen(true);
  };

  const handleReservationSuccess = (newRes: AuditoriumReservation) => {
    setReservations([newRes, ...reservations]);
  };

  const handleRiderSuccess = (newRider: StageEquipmentRider) => {
    setRiders([newRider, ...riders]);
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-card to-background p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Phase 36 — Campus Convention & Auditorium Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Smart Auditorium & Event Ticketing
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Reserve acoustic amphitheaters, book grand proscenium stages, issue
              verifiable digital admittance passes, and coordinate professional AV equipment riders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => {
                setSelectedHall(halls[0]);
                setIsBookModalOpen(true);
              }}
              className="bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20 font-semibold"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Reserve Hall
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsRiderModalOpen(true)}
              className="border-purple-500/30 hover:bg-purple-500/10 text-foreground"
            >
              <Volume2 className="h-4 w-4 mr-2 text-purple-400" />
              AV Equipment Rider
            </Button>
          </div>
        </div>

        {/* Telemetry Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/50">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Convention Halls</span>
            <div className="flex items-center gap-2">
              <Theater className="h-4 w-4 text-purple-500" />
              <span className="text-2xl font-bold text-foreground">{overview.totalAuditoriums}</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Total Seating Capacity</span>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-500" />
              <span className="text-2xl font-bold text-foreground">{overview.totalSeatingCapacity.toLocaleString()}</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Active Events Scheduled</span>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold text-foreground">{overview.activeEventsToday}</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Tickets Issued</span>
            <div className="flex items-center gap-2">
              <Ticket className="h-4 w-4 text-amber-500" />
              <span className="text-2xl font-bold text-foreground">{overview.totalTicketsIssued}+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          {[
            { id: "halls", label: "Auditorium Venues", icon: Theater },
            { id: "reservations", label: "Event Reservations", icon: Calendar, count: reservations.length },
            { id: "tickets", label: "Admittance Passes", icon: Ticket, count: tickets.length },
            { id: "equipment", label: "AV Equipment Riders", icon: Volume2, count: riders.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-purple-500/15 text-purple-400 border border-purple-500/30 shadow-sm"
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
        {activeTab === "halls" && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search auditoriums & halls..."
                className="w-full text-xs rounded-xl border border-input bg-card/60 pl-8 pr-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Tab 1: Halls */}
      {activeTab === "halls" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredHalls.map((hall) => (
            <AuditoriumVenueCard
              key={hall.id}
              hall={hall}
              onBook={handleBookHall}
            />
          ))}
        </div>
      )}

      {/* Tab 2: Reservations */}
      {activeTab === "reservations" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reservations.map((res) => (
              <div
                key={res.id}
                className="rounded-2xl border border-border/60 bg-card/60 p-5 space-y-3 backdrop-blur-md hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-foreground text-sm leading-snug line-clamp-1">
                      {res.event_title}
                    </h4>
                    <span className="text-xs text-muted-foreground font-mono">
                      {res.booking_code}
                    </span>
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[10px]">
                    {res.booking_status}
                  </Badge>
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground border-y border-border/40 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                    <span className="truncate">{res.hall_name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <span>{res.event_date} • {res.start_time.substring(0, 5)} - {res.end_time.substring(0, 5)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span>Organizer: <strong className="text-foreground">{res.organizer_name}</strong></span>
                    <Badge variant="secondary" className="text-[10px]">{res.organizer_role}</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <span>Capacity: {res.expected_attendees} Expected</span>
                  <span className="text-emerald-500 font-semibold">Stage Locked</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Admittance Tickets */}
      {activeTab === "tickets" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tickets.map((ticket) => (
            <EventTicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}

      {/* Tab 4: Stage Equipment Riders */}
      {activeTab === "equipment" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {riders.map((rider) => (
              <div
                key={rider.id}
                className="rounded-2xl border border-border/60 bg-card/60 p-4 space-y-2 backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30 text-[10px]">
                    {rider.quantity} Units
                  </Badge>
                  <span className="text-[11px] text-emerald-500 font-medium">{rider.status}</span>
                </div>
                <h4 className="font-semibold text-foreground text-sm">
                  {rider.equipment_type}
                </h4>
                <p className="text-xs text-muted-foreground">
                  Assigned: {rider.technician_assigned}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <BookHallModal
        hall={selectedHall}
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onSuccess={handleReservationSuccess}
      />

      <StageEquipmentModal
        isOpen={isRiderModalOpen}
        onClose={() => setIsRiderModalOpen(false)}
        onSuccess={handleRiderSuccess}
      />
    </div>
  );
}
