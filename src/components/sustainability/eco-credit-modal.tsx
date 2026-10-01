"use client";

import React, { useState } from "react";
import { EcoCredit, CommuteMode } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Leaf,
  Award,
  AlertCircle,
  QrCode,
  Copy,
  Check,
  Bike,
  Footprints,
  Bus,
  Car,
} from "lucide-react";

interface EcoCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (credit: EcoCredit) => void;
}

export function EcoCreditModal({
  isOpen,
  onClose,
  onSuccess,
}: EcoCreditModalProps) {
  const [studentName, setStudentName] = useState("Arpit Bavankule");
  const [studentId, setStudentId] = useState("std-11111111-1111-4111-8111-111111111111");
  const [commuteMode, setCommuteMode] = useState<CommuteMode>("Bicycle");
  const [distanceKm, setDistanceKm] = useState("12.5");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [issuedCredit, setIssuedCredit] = useState<EcoCredit | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/sustainability/eco-credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          student_name: studentName,
          commute_mode: commuteMode,
          distance_km: Number(distanceKm),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to log green commute.");
      }

      setIssuedCredit(data.data);
      onSuccess(data.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (issuedCredit) {
      navigator.clipboard.writeText(issuedCredit.certificate_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-card border border-border/80 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                {issuedCredit ? "Eco-Warrior Certificate Issued" : "Log Campus Green Commute"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {issuedCredit
                  ? "Your carbon offset has been credited to your academic merit profile."
                  : "Track bicycle, pedestrian or EV commute to earn verified sustainability credits."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {issuedCredit ? (
          <div className="space-y-4 pt-2">
            <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-card border border-emerald-500/30 text-center space-y-3">
              <div className="flex justify-center">
                <div className="p-3 rounded-2xl bg-card border border-border shadow-xs text-emerald-600 dark:text-emerald-400">
                  <Award className="w-16 h-16" />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Verified Eco-Credit Certificate
                </span>
                <div className="font-mono font-extrabold text-lg text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-2 mt-0.5">
                  <span>{issuedCredit.certificate_code}</span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="text-xs space-y-1 text-muted-foreground pt-2 border-t border-border/40">
                <div className="flex justify-between">
                  <span>Commuter:</span>
                  <strong className="text-foreground">{issuedCredit.student_name}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Commute Mode:</span>
                  <strong className="text-foreground">{issuedCredit.commute_mode}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Distance Logged:</span>
                  <strong className="text-foreground">{issuedCredit.distance_km} km</strong>
                </div>
                <div className="flex justify-between">
                  <span>CO₂ Offset:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                    {issuedCredit.co2_saved_kg} kg CO₂e
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Eco-Warrior Points:</span>
                  <strong className="text-primary font-bold font-mono">
                    +{issuedCredit.eco_points_earned} PTS
                  </strong>
                </div>
              </div>
            </div>

            <Button
              className="w-full rounded-2xl text-xs h-9 bg-primary text-primary-foreground font-semibold"
              onClick={onClose}
            >
              Done & Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground/80 block mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground/80 block mb-1">
                  Distance (km)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="100"
                  required
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground/80 block mb-1.5">
                Commute Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { mode: "Bicycle", icon: Bike, desc: "Zero Emissions" },
                    { mode: "Walking", icon: Footprints, desc: "Active Walk" },
                    { mode: "Campus EV Shuttle", icon: Bus, desc: "Electric Transit" },
                    { mode: "Carpooling", icon: Car, desc: "Shared Commute" },
                  ] as const
                ).map((item) => {
                  const Icon = item.icon;
                  const isSelected = commuteMode === item.mode;
                  return (
                    <button
                      key={item.mode}
                      type="button"
                      onClick={() => setCommuteMode(item.mode)}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200"
                          : "border-border/60 bg-muted/40 hover:bg-muted"
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded-xl ${
                          isSelected ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-none">{item.mode}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="rounded-xl text-xs h-9 px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={loading}
                className="rounded-xl text-xs h-9 px-4 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                <Leaf className="w-3.5 h-3.5" />
                {loading ? "Recording..." : "Log Commute & Earn Credits"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
