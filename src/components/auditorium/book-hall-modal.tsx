"use client";

import React, { useState } from "react";
import { AuditoriumHall, AuditoriumReservation } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Theater, CheckCircle2, Calendar, Clock, Users } from "lucide-react";

interface BookHallModalProps {
  hall: AuditoriumHall | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (reservation: AuditoriumReservation) => void;
}

export function BookHallModal({
  hall,
  isOpen,
  onClose,
  onSuccess,
}: BookHallModalProps) {
  const [eventTitle, setEventTitle] = useState("");
  const [organizerName, setOrganizerName] = useState("Arpit Bavankule");
  const [organizerRole, setOrganizerRole] = useState<any>("Student Club Lead");
  const [eventDate, setEventDate] = useState("2026-10-28");
  const [startTime, setStartTime] = useState("10:00:00");
  const [endTime, setEndTime] = useState("14:00:00");
  const [expectedAttendees, setExpectedAttendees] = useState("450");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<AuditoriumReservation | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hall || !eventTitle) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auditorium/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hallName: hall.hall_name,
          eventTitle,
          organizerName,
          organizerRole,
          eventDate,
          startTime,
          endTime,
          expectedAttendees: Number(expectedAttendees),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setConfirmedReservation(data.data);
        onSuccess(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmedReservation(null);
    setEventTitle("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleReset}>
      <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-border/80">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Theater className="h-5 w-5 text-purple-500" />
            {confirmedReservation ? "Hall Reserved Successfully" : `Book ${hall?.hall_name}`}
          </DialogTitle>
          <DialogDescription>
            {confirmedReservation
              ? "Cryptographic reservation code has been issued."
              : `Capacity: ${hall?.seating_capacity} Seats • ${hall?.stage_dimensions}`}
          </DialogDescription>
        </DialogHeader>

        {confirmedReservation ? (
          <div className="space-y-4 py-3">
            <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 text-center">
              <CheckCircle2 className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                Auditorium Slot Confirmed
              </p>
              <h4 className="text-xl font-mono font-bold text-foreground mt-1">
                {confirmedReservation.booking_code}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {confirmedReservation.event_title}
              </p>
            </div>

            <div className="rounded-lg bg-muted/60 p-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hall:</span>
                <span className="font-medium text-foreground truncate max-w-[200px]">{confirmedReservation.hall_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium text-foreground">{confirmedReservation.event_date} ({confirmedReservation.start_time.substring(0, 5)} - {confirmedReservation.end_time.substring(0, 5)})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Organizer:</span>
                <span className="font-bold text-foreground">{confirmedReservation.organizer_name}</span>
              </div>
            </div>

            <Button onClick={handleReset} className="w-full bg-purple-600 hover:bg-purple-500 text-white">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Event / Symposium Title</Label>
              <Input
                required
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="e.g. AI Odyssey 2026 Keynote"
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Event Date</Label>
                <Input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Expected Attendees</Label>
                <Input
                  type="number"
                  max={hall?.seating_capacity || 1000}
                  value={expectedAttendees}
                  onChange={(e) => setExpectedAttendees(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Start Time</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">End Time</Label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Organizer Role</Label>
              <select
                value={organizerRole}
                onChange={(e) => setOrganizerRole(e.target.value as any)}
                className="w-full text-xs rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="Student Club Lead">Student Club Lead</option>
                <option value="Faculty Coordinator">Faculty Coordinator</option>
                <option value="Dean Office">Dean Office</option>
                <option value="External Guest Speaker">External Guest Speaker</option>
              </select>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !eventTitle}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white mt-2"
            >
              {isSubmitting ? "Generating Docket..." : "Confirm Hall Reservation"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
