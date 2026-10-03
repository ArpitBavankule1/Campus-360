"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, ShieldCheck, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface GymPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function GymPassModal({ isOpen, onClose, onSuccess }: GymPassModalProps) {
  const [scholarName, setScholarName] = useState("Aarav Sharma");
  const [scholarId, setScholarId] = useState("std-2026-CS-4821");
  const [fitnessSlot, setFitnessSlot] = useState("Evening Surge (17:00 - 19:30)");
  const [tier, setTier] = useState("Student All-Access");
  const [loading, setLoading] = useState(false);
  const [membershipResult, setMembershipResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/sports/gym", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scholarName,
          scholarId,
          fitnessSlot,
          tier,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate gym membership pass.");
      }

      setMembershipResult(data.membership);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error issuing gym pass");
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

        {!membershipResult ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                <Dumbbell className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Campus Fitness Gym Pass
                </h2>
                <p className="text-xs text-muted-foreground">Biometric RFID & QR Turnstile Clearance</p>
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
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Student ID Roll
                  </label>
                  <input
                    type="text"
                    required
                    value={scholarId}
                    onChange={(e) => setScholarId(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Membership Tier
                  </label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Student All-Access">Student All-Access</option>
                    <option value="Athlete High-Performance">Athlete High-Performance</option>
                    <option value="Faculty Executive">Faculty Executive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Preferred Daily Fitness Slot
                </label>
                <select
                  value={fitnessSlot}
                  onChange={(e) => setFitnessSlot(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Early Bird (06:00 - 08:00)">Early Bird (06:00 - 08:00)</option>
                  <option value="Morning Peak (08:00 - 10:00)">Morning Peak (08:00 - 10:00)</option>
                  <option value="Evening Surge (17:00 - 19:30)">Evening Surge (17:00 - 19:30)</option>
                  <option value="Night Owl (19:30 - 22:00)">Night Owl (19:30 - 22:00)</option>
                </select>
              </div>

              <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
                <p>• Lockers and shower cubicles included in all tiers.</p>
                <p>• Mandatory towel & indoor athletic footwear policy.</p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-500 text-white"
                >
                  {loading ? "Generating Pass..." : "Issue Biometric Pass"}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-2 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/30">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30 mb-2">
                Biometric Pass Active
              </Badge>
              <h3 className="text-lg font-bold text-foreground">
                {membershipResult.scholar_name}
              </h3>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                {membershipResult.pass_code}
              </p>
            </div>

            <div className="flex justify-center p-3 bg-white rounded-xl shadow-inner w-fit mx-auto border border-border/40">
              <QRCodeSVG value={membershipResult.pass_code} size={130} />
            </div>

            <div className="rounded-xl bg-muted/30 p-3 text-xs text-left text-muted-foreground space-y-1 font-mono">
              <div>Tier: <strong className="text-foreground">{membershipResult.tier}</strong></div>
              <div>Slot: <strong className="text-foreground">{membershipResult.fitness_slot}</strong></div>
              <div>Trainer: <strong className="text-foreground">{membershipResult.trainer_assigned}</strong></div>
              <div>Valid Until: <strong className="text-foreground">{membershipResult.valid_until}</strong></div>
            </div>

            <Button onClick={onClose} className="w-full bg-purple-600 hover:bg-purple-500 text-white">
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
