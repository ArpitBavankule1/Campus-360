"use client";

import React, { useState } from "react";
import { SportsArena } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Trophy, CheckCircle2, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface CourtReservationModalProps {
  arena: SportsArena | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CourtReservationModal({
  arena,
  isOpen,
  onClose,
  onSuccess,
}: CourtReservationModalProps) {
  const [scholarName, setScholarName] = useState("Aarav Sharma");
  const [reservationDate, setReservationDate] = useState("2026-10-04");
  const [timeSlot, setTimeSlot] = useState("17:00 - 18:30");
  const [courtNumber, setCourtNumber] = useState("1");
  const [loading, setLoading] = useState(false);
  const [reservationResult, setReservationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !arena) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/sports/arenas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          arenaId: arena?.id,
          scholarName,
          date: reservationDate,
          timeSlot: `${timeSlot} (Court #${courtNumber})`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to confirm court reservation.");
      }

      setReservationResult(data.reservation);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error completing booking");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-border/80 bg-card p-6 shadow-2xl animate-in fade-in-50 zoom-in-95">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {!reservationResult ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Reserve Sports Court
                </h2>
                <p className="text-xs text-muted-foreground">{arena.arena_name}</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-destructive/15 p-3 text-xs text-destructive border border-destructive/20">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Scholar Full Name
                </label>
                <input
                  type="text"
                  required
                  value={scholarName}
                  onChange={(e) => setScholarName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Play Date
                  </label>
                  <input
                    type="date"
                    required
                    value={reservationDate}
                    onChange={(e) => setReservationDate(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Court Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="06:30 - 08:00">06:30 - 08:00 (Early)</option>
                    <option value="16:00 - 17:30">16:00 - 17:30 (Afternoon)</option>
                    <option value="17:30 - 19:00">17:30 - 19:00 (Evening)</option>
                    <option value="19:00 - 20:30">19:00 - 20:30 (Night Lights)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Court Preference (1 to {arena.total_courts})
                </label>
                <select
                  value={courtNumber}
                  onChange={(e) => setCourtNumber(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {Array.from({ length: arena.total_courts }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Court #{i + 1} ({arena.court_surface})
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
                <p>• Mandatory non-marking indoor shoes for synthetic courts.</p>
                <p>• 15-minute grace period before slot reallocation.</p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  {loading ? "Confirming..." : "Confirm Reservation"}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-2 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 mb-2">
                Court Confirmed
              </Badge>
              <h3 className="text-lg font-bold text-foreground">
                {reservationResult.arenaName}
              </h3>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                Pass: {reservationResult.reservationToken}
              </p>
            </div>

            <div className="flex justify-center p-3 bg-white rounded-xl shadow-inner w-fit mx-auto border border-border/40">
              <QRCodeSVG value={reservationResult.reservationToken} size={130} />
            </div>

            <div className="rounded-xl bg-muted/30 p-3 text-xs text-left text-muted-foreground space-y-1 font-mono">
              <div>Reserved For: <strong className="text-foreground">{reservationResult.reservedBy}</strong></div>
              <div>Date & Slot: <strong className="text-foreground">{reservationResult.date} | {reservationResult.timeSlot}</strong></div>
              <div>Venue: <strong className="text-foreground">{reservationResult.venue}</strong></div>
            </div>

            <Button onClick={onClose} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white">
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
