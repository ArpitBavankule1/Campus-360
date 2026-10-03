"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic2, CheckCircle2, X } from "lucide-react";
import { IncubationVenture, PitchSession } from "@/types";

interface PitchBookingModalProps {
  venture: IncubationVenture | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newPitch: PitchSession) => void;
}

export function PitchBookingModal({
  venture,
  isOpen,
  onClose,
  onSuccess,
}: PitchBookingModalProps) {
  const [pitchDate, setPitchDate] = useState("2026-10-24T15:00");
  const [angelPanel, setAngelPanel] = useState("Apex Angel Network Syndicate, Sequoia Surge Partner");
  const [loading, setLoading] = useState(false);
  const [resultPitch, setResultPitch] = useState<PitchSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !venture) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const panelList = angelPanel.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await fetch("/api/incubation/pitches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ventureId: venture?.id,
          pitchDate: new Date(pitchDate).toISOString(),
          angelPanel: panelList,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to schedule pitch session.");
      }

      setResultPitch(data.pitch);
      if (onSuccess) onSuccess(data.pitch);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error booking pitch docket");
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

        {!resultPitch ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 border border-violet-500/20">
                <Mic2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Schedule Demo Day Pitch
                </h2>
                <p className="text-xs text-muted-foreground">{venture.venture_name}</p>
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
                  Venture Founder
                </label>
                <input
                  type="text"
                  disabled
                  value={`${venture.founder_name} (${venture.sector})`}
                  className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Pitch Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={pitchDate}
                  onChange={(e) => setPitchDate(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Invited Angel / VC Panelists (Comma Separated)
                </label>
                <input
                  type="text"
                  required
                  value={angelPanel}
                  onChange={(e) => setAngelPanel(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
                <p>• 15-minute pitch + 10-minute Q&A in the Boardroom suite.</p>
                <p>• High-definition webcast feed with term sheet deliberation docket.</p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-violet-600 hover:bg-violet-500 text-white"
                >
                  {loading ? "Scheduling..." : "Confirm Pitch Session"}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-2 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/10 text-violet-500 border border-violet-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <Badge className="bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30 mb-2">
                Pitch Docket Scheduled
              </Badge>
              <h3 className="text-lg font-bold text-foreground">
                Session: {resultPitch.session_code}
              </h3>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                {new Date(resultPitch.pitch_date).toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl bg-muted/30 p-3 text-xs text-left text-muted-foreground space-y-1 font-mono">
              <div>Venue: <strong className="text-foreground">{resultPitch.venue}</strong></div>
              <div>Verdict State: <strong className="text-amber-500">{resultPitch.verdict}</strong></div>
              <div>Panel: <strong className="text-foreground">{resultPitch.angel_investor_panel.join(", ")}</strong></div>
            </div>

            <Button onClick={onClose} className="w-full bg-violet-600 hover:bg-violet-500 text-white">
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
