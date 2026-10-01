"use client";

import React, { useState } from "react";
import { CarpoolListing } from "@/types";
import {
  Users,
  MapPin,
  Clock,
  Car,
  Phone,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarpoolListingCardProps {
  listing: CarpoolListing;
  onJoinSuccess?: (updatedListing: CarpoolListing) => void;
}

export function CarpoolListingCard({
  listing,
  onJoinSuccess,
}: CarpoolListingCardProps) {
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/transport/carpool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "join",
          carpool_id: listing.id,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setJoined(true);
        onJoinSuccess?.(data.data);
      }
    } catch (err) {
      console.error("Join ride error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm space-y-4 transition-all hover:border-primary/40 hover:shadow-md flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 capitalize">
              {listing.driver_role} Commuter
            </span>
            <h4 className="text-base font-bold text-foreground mt-1.5">
              {listing.driver_name}
            </h4>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-foreground">
              {listing.price_per_seat > 0 ? `₹${listing.price_per_seat}` : "Free"}
            </span>
            <p className="text-[10px] text-muted-foreground">per seat</p>
          </div>
        </div>

        {/* Route Details */}
        <div className="p-3 rounded-2xl bg-muted/40 border border-border/40 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span className="truncate">From: {listing.departure_location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="truncate">To: {listing.destination_campus}</span>
          </div>
          <div className="flex items-center gap-1.5 text-foreground font-semibold pt-1 border-t border-border/40">
            <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span>Time: {listing.departure_time}</span>
          </div>
        </div>

        {/* Vehicle & Seats info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1">
            <Car className="w-3.5 h-3.5" /> {listing.vehicle_model}
          </span>
          <span className="font-semibold text-primary">
            {listing.seats_available} seats left
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-border/50">
        {joined ? (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Ride Confirmed!
            </span>
            <span className="text-[11px] font-mono">{listing.contact_phone}</span>
          </div>
        ) : (
          <Button
            size="sm"
            disabled={listing.seats_available <= 0 || loading}
            onClick={handleJoin}
            className="w-full rounded-xl text-xs gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            {loading ? "Joining..." : "Join Carpool Ride"}
          </Button>
        )}
      </div>
    </div>
  );
}
