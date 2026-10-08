"use client";

import React, { useState } from "react";
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
import { PTMConsultationMode } from "@/types";
import { Calendar, Clock, Video, Building2, CheckCircle2, UserCheck } from "lucide-react";

interface BookPTMModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookSuccess: (slotData: any) => void;
  assignedProctorName: string;
}

export function BookPTMModal({
  isOpen,
  onClose,
  onBookSuccess,
  assignedProctorName,
}: BookPTMModalProps) {
  const [facultyName, setFacultyName] = useState(assignedProctorName);
  const [designation, setDesignation] = useState("Chief Academic Proctor & Associate Professor");
  const [mode, setMode] = useState<PTMConsultationMode>("Virtual Google Meet");
  const [scheduledDate, setScheduledDate] = useState("2026-10-22");
  const [timeSlot, setTimeSlot] = useState("04:00 PM - 04:30 PM IST");
  const [agenda, setAgenda] = useState("Mid-semester academic progress & attendance review");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedToken, setBookedToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/parents/ptm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facultyName,
          designation,
          mode,
          scheduledDate,
          timeSlot,
          agenda,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBookedToken(data.data.booking_token);
        onBookSuccess(data.data);
      }
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setBookedToken(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleReset}>
      <DialogContent className="max-w-lg bg-card/95 backdrop-blur-xl border-border/80">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            Schedule Proctor & PTM Consultation
          </DialogTitle>
          <DialogDescription className="text-xs">
            Reserve a 1-on-1 progress review appointment with your ward&apos;s designated academic proctor.
          </DialogDescription>
        </DialogHeader>

        {bookedToken ? (
          <div className="py-6 text-center space-y-4">
            <div className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-inner">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Appointment Confirmed!</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Your consultation request has been synchronized with the Proctor&apos;s calendar.
              </p>
            </div>

            <div className="p-3 bg-muted/40 rounded-xl border border-border/60 font-mono text-sm text-primary font-bold">
              Booking Voucher: {bookedToken}
            </div>

            <p className="text-xs text-muted-foreground">
              A calendar invite and meeting details have been sent to your registered guardian email.
            </p>

            <Button onClick={handleReset} className="w-full">
              Done & Return to Portal
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Faculty Proctor / Mentor</Label>
              <Input
                value={facultyName}
                onChange={(e) => setFacultyName(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Consultation Mode</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMode("Virtual Google Meet")}
                  className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                    mode === "Virtual Google Meet"
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                      : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <Video className="h-4 w-4" />
                  Virtual Google Meet
                </button>

                <button
                  type="button"
                  onClick={() => setMode("In-Person Proctor Cabin")}
                  className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                    mode === "In-Person Proctor Cabin"
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                      : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  In-Person Cabin
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Date
                </Label>
                <Input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Time Slot
                </Label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-border/60 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="10:00 AM - 10:30 AM IST">10:00 AM - 10:30 AM IST</option>
                  <option value="11:30 AM - 12:00 PM IST">11:30 AM - 12:00 PM IST</option>
                  <option value="02:30 PM - 03:00 PM IST">02:30 PM - 03:00 PM IST</option>
                  <option value="04:00 PM - 04:30 PM IST">04:00 PM - 04:30 PM IST</option>
                  <option value="05:00 PM - 05:30 PM IST">05:00 PM - 05:30 PM IST</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Primary Agenda / Inquiry</Label>
              <Input
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                placeholder="e.g., Mid-term results, project workload, hostel adjustment..."
                required
                className="text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
              <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting} className="text-xs">
                {isSubmitting ? "Booking Appointment..." : "Confirm Consultation"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
