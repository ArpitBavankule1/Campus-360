"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, CheckCircle2, X } from "lucide-react";
import { IncubationVenture, VentureSector } from "@/types";

interface FounderApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newVenture: IncubationVenture) => void;
}

export function FounderApplicationModal({
  isOpen,
  onClose,
  onSuccess,
}: FounderApplicationModalProps) {
  const [ventureName, setVentureName] = useState("");
  const [sector, setSector] = useState<VentureSector>("DeepTech & AI");
  const [founderName, setFounderName] = useState("Aditya Joshi");
  const [founderId, setFounderId] = useState("std-2026-CS-3391");
  const [pitchDeckUrl, setPitchDeckUrl] = useState("https://campuslens.ai/decks/aditya-pitch.pdf");
  const [loading, setLoading] = useState(false);
  const [resultVenture, setResultVenture] = useState<IncubationVenture | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/incubation/ventures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ventureName,
          sector,
          founderName,
          founderId,
          pitchDeckUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit venture incubation application.");
      }

      setResultVenture(data.venture);
      if (onSuccess) onSuccess(data.venture);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error submitting application");
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

        {!resultVenture ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 border border-violet-500/20">
                <Rocket className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Apply for Campus Incubation
                </h2>
                <p className="text-xs text-muted-foreground">Apex Startup Accelerator & Seed Grant Program</p>
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
                  Venture / Startup Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AeroSynth Drones"
                  value={ventureName}
                  onChange={(e) => setVentureName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Industry Sector
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value as VentureSector)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="DeepTech & AI">DeepTech & AI</option>
                    <option value="Climate & CleanTech">Climate & CleanTech</option>
                    <option value="BioTech & HealthCare">BioTech & HealthCare</option>
                    <option value="FinTech & Web3">FinTech & Web3</option>
                    <option value="Robotics & Hardware">Robotics & Hardware</option>
                    <option value="EdTech & Consumer">EdTech & Consumer</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Founder Roll / ID
                  </label>
                  <input
                    type="text"
                    required
                    value={founderId}
                    onChange={(e) => setFounderId(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Lead Founder Name
                </label>
                <input
                  type="text"
                  required
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Pitch Deck URL (Google Drive / DocSend / PDF)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={pitchDeckUrl}
                  onChange={(e) => setPitchDeckUrl(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
                <p>• Accepted teams receive ₹2,50,000 to ₹10,00,000 equity-free prototype grant.</p>
                <p>• 24x7 Maker Space access + legal patent filing assistance included.</p>
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
                  {loading ? "Submitting..." : "Submit Application"}
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
                Application Logged
              </Badge>
              <h3 className="text-lg font-bold text-foreground">
                {resultVenture.venture_name}
              </h3>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                Sector: {resultVenture.sector} • Stage: {resultVenture.stage}
              </p>
            </div>

            <div className="rounded-xl bg-muted/30 p-3 text-xs text-left text-muted-foreground space-y-1 font-mono">
              <div>Lead Founder: <strong className="text-foreground">{resultVenture.founder_name}</strong></div>
              <div>Initial Valuation: <strong className="text-foreground">₹{(resultVenture.valuation_inr / 10000000).toFixed(1)} Cr</strong></div>
              <div>Provisional Seed Grant: <strong className="text-foreground">₹{resultVenture.seed_grant_inr.toLocaleString()}</strong></div>
              <div>Status: <strong className="text-emerald-500">{resultVenture.status}</strong></div>
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
