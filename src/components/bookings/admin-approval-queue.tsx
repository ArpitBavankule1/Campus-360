"use client";

import React, { useState } from "react";
import {
  Check,
  X,
  Clock,
  Building2,
  Users,
  Calendar,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { FacilityBooking } from "@/types";
import { CAMPUS_SPACES } from "@/lib/bookings/booking-engine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AdminApprovalQueueProps {
  bookings: FacilityBooking[];
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason?: string) => Promise<void>;
}

export const AdminApprovalQueue: React.FC<AdminApprovalQueueProps> = ({
  bookings,
  onApprove,
  onReject,
}) => {
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const pendingBookings = bookings.filter((b) => b.status === "pending");

  const handleApprove = async (id: string) => {
    setLoadingId(id);
    try {
      await onApprove(id);
    } finally {
      setLoadingId(null);
    }
  };

  const handleConfirmReject = async (id: string) => {
    setLoadingId(id);
    try {
      await onReject(id, rejectReason || "Schedule conflict or unauthorized usage");
      setRejectingId(null);
      setRejectReason("");
    } finally {
      setLoadingId(null);
    }
  };

  if (pendingBookings.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl border border-dashed border-border/80 bg-card/40 space-y-3">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm">All Clear!</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            There are currently no facility reservation requests awaiting review.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pendingBookings.map((b) => {
        const space = CAMPUS_SPACES.find((s) => s.id === b.facility_id);
        const isLoading = loadingId === b.id;

        return (
          <div
            key={b.id}
            className="p-4 rounded-2xl border border-border/80 bg-card/70 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-border transition-colors"
          >
            {/* Left: Booking info */}
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/30">
                  <Clock className="w-2.5 h-2.5 mr-1" /> Pending Approval
                </Badge>
                <span className="font-mono text-xs font-semibold text-primary">
                  {b.booking_pass_code}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs font-medium text-foreground">
                  Applicant: {b.user_name || "Student"}
                </span>
              </div>

              <h4 className="font-bold text-foreground text-sm">
                {space?.name || "Campus Space"}
              </h4>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-primary/70" />
                  {space?.building}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-primary/70" />
                  {b.booking_date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary/70" />
                  {b.start_time} - {b.end_time}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-primary/70" />
                  {b.attendees_count} people
                </span>
              </div>

              <p className="text-xs text-foreground/80 bg-muted/40 p-2 rounded-lg border border-border/40">
                <strong className="text-muted-foreground">Purpose:</strong> {b.purpose}
              </p>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              {rejectingId === b.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Reason (optional)"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-border bg-background w-44"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={isLoading}
                    onClick={() => handleConfirmReject(b.id)}
                    className="text-xs h-8 px-2.5"
                  >
                    Confirm Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setRejectingId(null)}
                    className="text-xs h-8 px-2"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => setRejectingId(b.id)}
                    className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 h-8 gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </Button>
                  <Button
                    size="sm"
                    disabled={isLoading}
                    onClick={() => handleApprove(b.id)}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white h-8 gap-1 font-medium"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve Pass
                  </Button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
