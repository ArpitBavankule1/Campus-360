"use client";

import React from "react";
import {
  QrCode,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Clock3,
  XCircle,
  Building2,
  Trash2,
} from "lucide-react";
import { FacilityBooking } from "@/types";
import { CAMPUS_SPACES } from "@/lib/bookings/booking-engine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BookingPassCardProps {
  booking: FacilityBooking;
  onCancel?: (bookingId: string) => void;
}

export const BookingPassCard: React.FC<BookingPassCardProps> = ({
  booking,
  onCancel,
}) => {
  const space = CAMPUS_SPACES.find((s) => s.id === booking.facility_id);

  const getStatusBadge = (status: FacilityBooking["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge
            variant="outline"
            className="text-[10px] gap-1 border-emerald-500/30 text-emerald-500 bg-emerald-500/10 font-semibold"
          >
            <CheckCircle2 className="w-3 h-3" /> Confirmed Pass
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-[10px] gap-1 border-amber-500/30 text-amber-500 bg-amber-500/10 font-semibold"
          >
            <Clock3 className="w-3 h-3" /> Under Review
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="text-[10px] gap-1 border-destructive/30 text-destructive bg-destructive/10 font-semibold"
          >
            <XCircle className="w-3 h-3" /> Declined
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="text-[10px] gap-1 border-muted text-muted-foreground bg-muted font-semibold"
          >
            <XCircle className="w-3 h-3" /> Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px]">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/90 to-primary/5 p-5 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-border/60">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground block mb-0.5">
            Campus Pass ID
          </span>
          <span className="font-mono font-bold text-base text-primary tracking-wider">
            {booking.booking_pass_code}
          </span>
        </div>

        {getStatusBadge(booking.status)}
      </div>

      {/* Facility & Location Details */}
      <div className="py-3 space-y-1">
        <h4 className="font-bold text-foreground text-base tracking-tight">
          {space?.name || "Campus Space"}
        </h4>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Building2 className="w-3.5 h-3.5 text-primary/70" />
          <span>{space?.building || "Main Campus"}</span>
          <span>•</span>
          <MapPin className="w-3.5 h-3.5 text-muted-foreground/70" />
          <span>
            {space?.floor || "Floor"}, {space?.roomNumber || "Room"}
          </span>
        </div>
      </div>

      {/* Date & Time Window */}
      <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-muted/40 border border-border/40 text-xs my-2">
        <div className="space-y-0.5">
          <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
            <Calendar className="w-3 h-3 text-primary" /> Date
          </span>
          <span className="font-semibold text-foreground">{booking.booking_date}</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
            <Clock className="w-3 h-3 text-primary" /> Time Block
          </span>
          <span className="font-semibold text-foreground">
            {booking.start_time} - {booking.end_time}
          </span>
        </div>
      </div>

      {/* Purpose & Attendees */}
      <div className="space-y-1.5 text-xs text-muted-foreground py-1">
        <div className="line-clamp-1">
          <strong className="text-foreground">Purpose:</strong> {booking.purpose}
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-primary/70" />
          <span>{booking.attendees_count} expected {booking.attendees_count === 1 ? "attendee" : "attendees"}</span>
        </div>
      </div>

      {/* QR & Security Footer */}
      <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-background border border-border/80 text-foreground">
            <QrCode className="w-5 h-5 text-primary" />
          </div>
          <span className="text-[10px] text-muted-foreground leading-tight">
            Scan at terminal
            <br />
            for turnstile check-in
          </span>
        </div>

        {booking.status === "approved" || booking.status === "pending" ? (
          onCancel && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onCancel(booking.id)}
              className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 h-8 px-2.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </Button>
          )
        ) : null}
      </div>
    </div>
  );
};
