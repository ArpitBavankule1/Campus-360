"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PortalLayout } from "@/components/layout/portal-layout";
import {
  CAMPUS_SPACES,
  CampusSpace,
  getInitialSeedBookings,
} from "@/lib/bookings/booking-engine";
import { FacilityBooking } from "@/types";
import { FacilityCard } from "@/components/bookings/facility-card";
import { BookingModal } from "@/components/bookings/booking-modal";
import { BookingPassCard } from "@/components/bookings/booking-pass-card";
import { AdminApprovalQueue } from "@/components/bookings/admin-approval-queue";
import {
  DoorClosed,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  Clock,
  Layers,
  Ticket,
  ClipboardList,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BookingsPage() {
  const [spaces] = useState<CampusSpace[]>(CAMPUS_SPACES);
  const [bookings, setBookings] = useState<FacilityBooking[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"browse" | "my-passes" | "approvals">("browse");

  // Modal State
  const [selectedSpaceForBooking, setSelectedSpaceForBooking] = useState<CampusSpace | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load initial bookings
  useEffect(() => {
    // Attempt to load from API or fallback to seed
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings");
        const json = await res.json();
        if (json.success && json.data) {
          setBookings(json.data);
          return;
        }
      } catch {
        // fallback
      }
      setBookings(getInitialSeedBookings());
    };

    fetchBookings();
  }, []);

  // Filtered Spaces
  const filteredSpaces = useMemo(() => {
    return spaces.filter((space) => {
      const matchesCategory =
        selectedCategory === "all" || space.category === selectedCategory;
      const matchesSearch =
        space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        space.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
        space.amenities.some((a) =>
          a.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [spaces, selectedCategory, searchQuery]);

  // User passes (Aarav Sharma / usr-demo-01)
  const myPasses = useMemo(() => {
    return bookings.filter(
      (b) => b.user_id === "usr-demo-01" || b.user_name === "Aarav Sharma"
    );
  }, [bookings]);

  const pendingApprovalsCount = useMemo(() => {
    return bookings.filter((b) => b.status === "pending").length;
  }, [bookings]);

  // Handlers
  const handleOpenBooking = (space: CampusSpace) => {
    setSelectedSpaceForBooking(space);
    setIsModalOpen(true);
  };

  const handleBookingCreated = (newBooking: FacilityBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
    } catch {
      // optimistic update
    }
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b))
    );
  };

  const handleApprove = async (id: string) => {
    try {
      await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });
    } catch {
      // optimistic update
    }
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "approved" } : b))
    );
  };

  const handleReject = async (id: string, reason?: string) => {
    try {
      await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", rejection_reason: reason }),
      });
    } catch {
      // optimistic update
    }
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: "rejected", rejection_reason: reason }
          : b
      )
    );
  };

  return (
    <PortalLayout>
      <div className="space-y-6 pb-12">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card/80 to-primary/5 p-6 md:p-8 shadow-sm">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-xs px-2.5 py-0.5 border-primary/30 text-primary bg-primary/10 font-semibold"
                >
                  <Sparkles className="w-3 h-3 mr-1" /> Phase 18
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs px-2.5 py-0.5 border-emerald-500/30 text-emerald-500 bg-emerald-500/10 font-medium"
                >
                  <ShieldCheck className="w-3 h-3 mr-1" /> Turnstile QR Verification
                </Badge>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                Smart Spaces & Facility Reservations
              </h1>

              <p className="text-sm text-muted-foreground max-w-xl">
                Reserve soundproof study pods, AI GPU clusters, central auditoriums, and
                sports arenas with real-time slot conflict check and instant digital entry passes.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5 shrink-0">
              <div className="p-3 rounded-2xl bg-background/80 border border-border/60 text-center">
                <span className="text-lg md:text-xl font-bold text-foreground block">
                  {spaces.length}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  Total Spaces
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-background/80 border border-border/60 text-center">
                <span className="text-lg md:text-xl font-bold text-primary block">
                  {myPasses.length}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  My Passes
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-background/80 border border-border/60 text-center">
                <span className="text-lg md:text-xl font-bold text-amber-500 block">
                  {pendingApprovalsCount}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  In Review
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-3">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/50 border border-border/40 w-fit">
            <button
              onClick={() => setActiveTab("browse")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "browse"
                  ? "bg-card text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Browse Spaces ({filteredSpaces.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("my-passes")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "my-passes"
                  ? "bg-card text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>My Passes ({myPasses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("approvals")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "approvals"
                  ? "bg-card text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Approval Desk</span>
              {pendingApprovalsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>
          </div>

          {/* Search bar when browsing */}
          {activeTab === "browse" && (
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search rooms, amenities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-border/60 bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Browse Spaces */}
        {activeTab === "browse" && (
          <div className="space-y-4">
            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "all", label: "All Spaces" },
                { id: "study_pod", label: "Study Pods" },
                { id: "lab", label: "Specialized Labs" },
                { id: "auditorium", label: "Auditoriums" },
                { id: "sports", label: "Sports & Courts" },
                { id: "conference", label: "Conference & Ideation" },
              ].map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs h-7 rounded-lg font-medium transition-all ${
                    selectedCategory === cat.id
                      ? "shadow-sm"
                      : "border-border/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </Button>
              ))}
            </div>

            {/* Spaces Grid */}
            {filteredSpaces.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/30">
                <DoorClosed className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                <h3 className="font-semibold text-foreground text-sm">No campus spaces matched</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Try clearing your search query or selecting a different category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSpaces.map((space) => (
                  <FacilityCard
                    key={space.id}
                    space={space}
                    onBook={handleOpenBooking}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Active Passes */}
        {activeTab === "my-passes" && (
          <div className="space-y-4">
            {myPasses.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/30 space-y-3">
                <Ticket className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
                <div>
                  <h3 className="font-semibold text-foreground text-sm">No Active Booking Passes</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    You haven&apos;t reserved any campus spaces yet. Browse spaces and reserve a slot to get your digital pass.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setActiveTab("browse")}
                  className="text-xs font-semibold"
                >
                  Browse Available Spaces
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {myPasses.map((booking) => (
                  <BookingPassCard
                    key={booking.id}
                    booking={booking}
                    onCancel={handleCancelBooking}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Approval Desk */}
        {activeTab === "approvals" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Faculty & Administrator Review Desk
                </h3>
                <p className="text-xs text-muted-foreground">
                  High-capacity spaces (Auditoriums, Research Labs) require administrative clearance before pass issuance.
                </p>
              </div>
            </div>

            <AdminApprovalQueue
              bookings={bookings}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </div>
        )}

        {/* Booking Modal */}
        <BookingModal
          space={selectedSpaceForBooking}
          existingBookings={bookings}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSpaceForBooking(null);
          }}
          onSuccess={handleBookingCreated}
        />
      </div>
    </PortalLayout>
  );
}
