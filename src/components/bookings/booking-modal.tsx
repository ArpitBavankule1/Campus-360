"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Sparkles,
  Building2,
  Users,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ArrowRight,
  Loader2,
} from "lucide-react";
import {
  CampusSpace,
  getFacilityAvailability,
} from "@/lib/bookings/booking-engine";
import { FacilityBooking, FacilityBookingSlot } from "@/types";
import { SlotPicker } from "./slot-picker";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BookingModalProps {
  space: CampusSpace | null;
  existingBookings: FacilityBooking[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (booking: FacilityBooking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  space,
  existingBookings,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<{
    startTime: string;
    endTime: string;
  } | null>(null);
  const [purpose, setPurpose] = useState("");
  const [attendeesCount, setAttendeesCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<FacilityBooking | null>(
    null
  );

  // Compute available slots
  const [slots, setSlots] = useState<FacilityBookingSlot[]>([]);

  useEffect(() => {
    if (space && selectedDate) {
      const calculatedSlots = getFacilityAvailability(
        existingBookings,
        space.id,
        selectedDate
      );
      setSlots(calculatedSlots);
      // Reset selected slot if it became unavailable
      setSelectedSlot(null);
      setErrorMessage(null);
    }
  }, [space, selectedDate, existingBookings]);

  if (!isOpen || !space) return null;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setErrorMessage("Please select a time slot to proceed.");
      return;
    }
    if (!purpose.trim()) {
      setErrorMessage("Please state the purpose of your reservation.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facility_id: space.id,
          booking_date: selectedDate,
          start_time: selectedSlot.startTime,
          end_time: selectedSlot.endTime,
          purpose: purpose.trim(),
          attendees_count: attendeesCount,
          user_id: "usr-demo-01",
          user_name: "Aarav Sharma",
          user_email: "aarav.sharma@campuslens.edu",
          user_role: "student",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to reserve facility.");
      }

      setCreatedBooking(data.data);
      onSuccess(data.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCreatedBooking(null);
    setSelectedSlot(null);
    setPurpose("");
    setErrorMessage(null);
    onClose();
  };

  // Get min date (today) and max date (+14 days)
  const todayStr = new Date().toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 14 * 24 * 3600 * 1000)
    .toISOString()
    .split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border/80 bg-card p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                {space.categoryLabel}
              </Badge>
              {space.requiresApproval ? (
                <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/30">
                  Approval Required
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/30">
                  Instant Confirmation
                </Badge>
              )}
            </div>
            <h2 className="text-xl font-bold text-foreground">{space.name}</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-primary/70" />
              {space.building} • {space.floor}, {space.roomNumber}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation Success View */}
        {createdBooking ? (
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground">
                {createdBooking.status === "approved"
                  ? "Reservation Confirmed!"
                  : "Reservation Request Submitted!"}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                {createdBooking.status === "approved"
                  ? "Your digital entry pass is now active. Present your pass code or QR upon entry."
                  : "Your request has been routed to the facility administrator. You will be notified once reviewed."}
              </p>
            </div>

            {/* Pass Summary Card */}
            <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 text-left space-y-2 max-w-sm mx-auto">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-primary/10">
                <span className="text-muted-foreground">Digital Pass Code</span>
                <span className="font-mono font-bold text-primary text-sm tracking-wider">
                  {createdBooking.booking_pass_code}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Date</span>
                  <strong className="text-foreground">{createdBooking.booking_date}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Time Slot</span>
                  <strong className="text-foreground">
                    {createdBooking.start_time} - {createdBooking.end_time}
                  </strong>
                </div>
              </div>
            </div>

            <Button onClick={handleClose} className="w-full max-w-sm mx-auto font-semibold">
              Done & View Passes
            </Button>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Date Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                min={todayStr}
                max={maxDate}
                onChange={handleDateChange}
                className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Slot Picker Component */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Available Time Slots</label>
              <SlotPicker
                slots={slots}
                selectedSlot={selectedSlot}
                onSelectSlot={setSelectedSlot}
              />
            </div>

            {/* Purpose */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Purpose / Project Description
              </label>
              <input
                type="text"
                placeholder="e.g., Final Year Capstone Project Simulation"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                maxLength={100}
                required
                className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Attendees Count */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  Expected Attendees
                </label>
                <input
                  type="number"
                  min={1}
                  max={space.capacity}
                  value={attendeesCount}
                  onChange={(e) => setAttendeesCount(Math.min(space.capacity, Math.max(1, Number(e.target.value))))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <span className="text-[10px] text-muted-foreground">Max limit: {space.capacity}</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Selected Window</label>
                <div className="px-3 py-2 rounded-xl border border-border bg-muted/30 text-xs font-medium text-foreground flex items-center h-[38px]">
                  {selectedSlot ? (
                    <span className="text-primary font-semibold">
                      {selectedSlot.startTime} - {selectedSlot.endTime}
                    </span>
                  ) : (
                    <span className="text-muted-foreground italic">No slot chosen</span>
                  )}
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="text-xs font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!selectedSlot || !purpose.trim() || isSubmitting}
                className="text-xs font-semibold gap-1.5 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Confirming...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Reservation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
