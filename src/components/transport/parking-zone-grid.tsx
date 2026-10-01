"use client";

import React, { useState } from "react";
import { ParkingZone, VehicleType } from "@/types";
import {
  Car,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ParkingZoneGridProps {
  zones: ParkingZone[];
  onReserveSuccess?: (resData: any) => void;
}

export function ParkingZoneGrid({
  zones,
  onReserveSuccess,
}: ParkingZoneGridProps) {
  const [selectedZone, setSelectedZone] = useState<ParkingZone | null>(null);
  const [vehiclePlate, setVehiclePlate] = useState("MH 12 AB 9988");
  const [vehicleType, setVehicleType] = useState<VehicleType>("ev");
  const [durationHours, setDurationHours] = useState("4");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "ev_charging":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "faculty":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "scholar":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      default:
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    }
  };

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedZone) return;
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/transport/parking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "usr-student-001",
          user_name: "Arpit Bavankule",
          zone_id: selectedZone.id,
          vehicle_plate: vehiclePlate,
          vehicle_type: vehicleType,
          duration_hours: Number(durationHours),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Reservation failed");
      }

      setMessage(`🎉 Successfully reserved bay! Pass: ${data.data.pass_code}`);
      onReserveSuccess?.(data.data);
      setTimeout(() => {
        setSelectedZone(null);
        setMessage(null);
      }, 2500);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {zones.map((zone) => {
          const available = Math.max(0, zone.total_bays - zone.occupied_bays);
          const percent = Math.round((zone.occupied_bays / zone.total_bays) * 100);
          const isFull = available === 0;

          return (
            <div
              key={zone.id}
              className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm space-y-4 transition-all hover:border-primary/40 hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getCategoryColor(
                      zone.category
                    )}`}
                  >
                    {zone.category.replace("_", " ")}
                  </span>
                  {zone.category === "ev_charging" && (
                    <span className="p-1 rounded-full bg-emerald-500/10 text-emerald-500">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-base font-bold text-foreground">
                    {zone.zone_name}
                  </h4>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">
                    Zone Code: {zone.zone_code}
                  </p>
                </div>

                {/* Occupancy Indicator */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-muted/40 border border-border/40">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Available Bays</span>
                    <span
                      className={`font-black ${
                        isFull
                          ? "text-destructive"
                          : available < 5
                          ? "text-amber-500"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {available} / {zone.total_bays}
                    </span>
                  </div>

                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        percent > 90
                          ? "bg-destructive"
                          : percent > 60
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <p className="text-[10px] text-muted-foreground pt-0.5">
                    {zone.hourly_rate > 0
                      ? `₹${zone.hourly_rate}/hr parking fee`
                      : "Complimentary Scholar Access"}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  size="sm"
                  disabled={isFull}
                  className="w-full rounded-xl text-xs gap-1.5"
                  onClick={() => setSelectedZone(zone)}
                >
                  <Car className="w-3.5 h-3.5" />
                  {isFull ? "Zone Full" : "Reserve Slot"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reservation Dialog */}
      {selectedZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-border/80 bg-card p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-foreground">
              Reserve Smart Parking Bay
            </h3>
            <p className="text-xs text-muted-foreground">
              Zone: <span className="font-semibold text-foreground">{selectedZone.zone_name}</span> ({selectedZone.zone_code})
            </p>

            {message && (
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                {message}
              </div>
            )}

            <form onSubmit={handleReserve} className="space-y-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Vehicle License Plate
                </label>
                <input
                  type="text"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  placeholder="e.g. MH 12 AB 1234"
                  className="w-full text-xs rounded-xl border border-input bg-background p-2.5 font-mono uppercase text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Vehicle Type
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                    className="w-full text-xs rounded-xl border border-input bg-background p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="ev">⚡ Electric Vehicle</option>
                    <option value="car">🚗 Four Wheeler</option>
                    <option value="two_wheeler">🛵 Two Wheeler</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Duration
                  </label>
                  <select
                    value={durationHours}
                    onChange={(e) => setDurationHours(e.target.value)}
                    className="w-full text-xs rounded-xl border border-input bg-background p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="2">2 Hours</option>
                    <option value="4">4 Hours</option>
                    <option value="8">Full Day (8 Hours)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedZone(null)}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={loading}
                  className="rounded-xl text-xs"
                >
                  {loading ? "Allocating..." : "Confirm Bay Allocation"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
