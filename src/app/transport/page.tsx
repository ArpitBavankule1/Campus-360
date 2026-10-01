"use client";

import React, { useState } from "react";
import {
  TransportRoute,
  TransportSchedule,
  TransportPass,
  ParkingZone,
  CarpoolListing,
} from "@/types";
import {
  MOCK_ROUTES,
  MOCK_SCHEDULES,
  MOCK_TRANSPORT_PASSES,
  MOCK_PARKING_ZONES,
  MOCK_CARPOOL_LISTINGS,
  calculateTransportOverview,
} from "@/lib/transport/transport-engine";
import { ShuttleRouteTracker } from "@/components/transport/shuttle-route-tracker";
import { TransportPassModal } from "@/components/transport/transport-pass-modal";
import { ParkingZoneGrid } from "@/components/transport/parking-zone-grid";
import { CarpoolListingCard } from "@/components/transport/carpool-listing-card";
import {
  Bus,
  Zap,
  Car,
  Users,
  Clock,
  Sparkles,
  QrCode,
  ShieldCheck,
  Search,
  Navigation,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TransportPortalPage() {
  const [activeTab, setActiveTab] = useState<
    "routes" | "passes" | "parking" | "carpool"
  >("routes");

  // State
  const [routes] = useState<TransportRoute[]>(MOCK_ROUTES);
  const [schedules] = useState<TransportSchedule[]>(MOCK_SCHEDULES);
  const [passes, setPasses] = useState<TransportPass[]>(MOCK_TRANSPORT_PASSES);
  const [parkingZones, setParkingZones] = useState<ParkingZone[]>(MOCK_PARKING_ZONES);
  const [carpools, setCarpools] = useState<CarpoolListing[]>(MOCK_CARPOOL_LISTINGS);

  // Modals & Selection
  const [selectedPass, setSelectedPass] = useState<TransportPass | null>(null);

  // Filters
  const [selectedShuttleType, setSelectedShuttleType] = useState<string>("all");

  const overview = calculateTransportOverview(
    routes,
    schedules,
    passes,
    parkingZones,
    carpools
  );

  const handleIssuePass = async (route: TransportRoute) => {
    try {
      const res = await fetch("/api/transport/passes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scholar_id: "usr-student-001",
          scholar_name: "Arpit Bavankule",
          pass_type: "semester_unlimited",
          route_id: route.id,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setPasses((prev) => [data.data, ...prev]);
        setSelectedPass(data.data);
      }
    } catch (err) {
      console.error("Pass error:", err);
    }
  };

  const filteredRoutes = routes.filter((r) => {
    if (selectedShuttleType === "all") return true;
    return r.shuttle_type === selectedShuttleType;
  });

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/90 to-emerald-500/10 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Phase 27 • Smart Campus Transport & EV Shuttle Fleet</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Zero-Emission Campus Transit & Intelligent Parking
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Real-time GPS tracking for autonomous & electric shuttle loops, verifiable digital QR boarding passes, live parking bay sensor matrices, and verified campus carpooling.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button
              size="sm"
              onClick={() => setSelectedPass(passes[0])}
              className="rounded-2xl gap-2 text-xs shadow-md bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
            >
              <QrCode className="w-4 h-4" />
              My Bus Pass
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("parking")}
              className="rounded-2xl gap-2 text-xs border-border"
            >
              <Car className="w-4 h-4" />
              Find Parking Bay
            </Button>
          </div>
        </div>

        {/* Telemetry Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-border/60">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Bus className="w-3.5 h-3.5 text-emerald-500" />
              Active EV Shuttles
            </p>
            <p className="text-xl sm:text-2xl font-black text-foreground">
              {overview.activeShuttles} Vehicles
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              Average Wait Time
            </p>
            <p className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
              ~{overview.averageWaitTimeMins} mins
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-purple-500" />
              Parking Vacancy
            </p>
            <p className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400">
              {overview.parkingAvailableBays} Bays Free
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-500" />
              Active Carpools
            </p>
            <p className="text-xl sm:text-2xl font-black text-foreground">
              {overview.activeCarpools} Daily Rides
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border/80 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("routes")}
          className={`px-4 py-2.5 text-xs font-semibold rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "routes"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <Bus className="w-3.5 h-3.5" />
          EV Shuttle Radar ({routes.length})
        </button>

        <button
          onClick={() => setActiveTab("passes")}
          className={`px-4 py-2.5 text-xs font-semibold rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "passes"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          Campus Boarding Passes ({passes.length})
        </button>

        <button
          onClick={() => setActiveTab("parking")}
          className={`px-4 py-2.5 text-xs font-semibold rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "parking"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <Car className="w-3.5 h-3.5" />
          Smart Parking & EV Bays ({parkingZones.length})
        </button>

        <button
          onClick={() => setActiveTab("carpool")}
          className={`px-4 py-2.5 text-xs font-semibold rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === "carpool"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Carpool & Ride Shares ({carpools.length})
        </button>
      </div>

      {/* Tab 1: Routes */}
      {activeTab === "routes" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Live Campus Transit Routes & ETA Radar
              </h3>
              <p className="text-xs text-muted-foreground">
                High-frequency zero-emission circular shuttles connecting Metro, Quads & Residential Halls
              </p>
            </div>

            <select
              value={selectedShuttleType}
              onChange={(e) => setSelectedShuttleType(e.target.value)}
              className="text-xs rounded-2xl border border-input bg-card px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            >
              <option value="all">All Transit Modes</option>
              <option value="electric_bus">⚡ Electric Bus</option>
              <option value="night_transit">🌙 Late Night Safe Transit</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRoutes.map((route) => {
              const sched = schedules.find((s) => s.route_id === route.id);
              return (
                <ShuttleRouteTracker
                  key={route.id}
                  route={route}
                  schedule={sched}
                  onBookPass={handleIssuePass}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Passes */}
      {activeTab === "passes" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Your Digital Transit Boarding Passes
              </h3>
              <p className="text-xs text-muted-foreground">
                Cryptographically signed contactless passes for shuttle turnstiles
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => handleIssuePass(routes[0])}
              className="rounded-2xl text-xs gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Generate New Semester Pass
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {passes.map((pass) => (
              <div
                key={pass.id}
                className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm space-y-4 transition-all hover:border-primary/40 hover:shadow-md flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {pass.pass_type.replace("_", " ")}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary">
                      ACTIVE
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-foreground">
                      {pass.route?.route_name || "Campus Transit Pass"}
                    </h4>
                    <p className="text-xs font-mono text-muted-foreground mt-0.5">
                      Code: {pass.pass_code}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-muted/40 border border-border/40 text-xs space-y-1">
                    <p className="text-muted-foreground">
                      Holder: <span className="font-semibold text-foreground">{pass.scholar_name}</span>
                    </p>
                    <p className="text-muted-foreground">
                      Valid Through: <span className="font-semibold text-foreground">{pass.valid_to}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    size="sm"
                    className="w-full rounded-xl text-xs gap-1.5"
                    onClick={() => setSelectedPass(pass)}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    Display High-Res QR Ticket
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Parking */}
      {activeTab === "parking" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Smart Campus Parking Zones & EV Charging Bays
            </h3>
            <p className="text-xs text-muted-foreground">
              Live sensor telemetry for Faculty, Scholars, Guests, and High-Speed EV Charging bays
            </p>
          </div>

          <ParkingZoneGrid
            zones={parkingZones}
            onReserveSuccess={() => {
              // Refresh occupancy
              setParkingZones((prev) => [...prev]);
            }}
          />
        </div>
      )}

      {/* Tab 4: Carpooling */}
      {activeTab === "carpool" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Campus Carpooling & Ride-Share Community
            </h3>
            <p className="text-xs text-muted-foreground">
              Verified peer rides between city metro stations, residential hubs, and university gates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {carpools.map((listing) => (
              <CarpoolListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      )}

      {/* Pass Modal */}
      {selectedPass && (
        <TransportPassModal
          pass={selectedPass}
          onClose={() => setSelectedPass(null)}
        />
      )}
    </div>
  );
}
