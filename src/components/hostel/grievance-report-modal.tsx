"use client";

import React, { useState } from "react";
import { GrievanceCategory, GrievancePriority, HostelGrievance } from "@/types";
import {
  X,
  Wrench,
  AlertCircle,
  Send,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface GrievanceReportModalProps {
  onClose: () => void;
  onSuccess: (newGrievance: HostelGrievance) => void;
}

const CATEGORIES: { key: GrievanceCategory; label: string }[] = [
  { key: "wifi", label: "LAN / Wi-Fi Network" },
  { key: "electrical", label: "Electrical / Lighting" },
  { key: "plumbing", label: "Plumbing / Washroom" },
  { key: "carpentry", label: "Carpentry / Furniture" },
  { key: "cleanliness", label: "Housekeeping / Waste" },
  { key: "other", label: "General Maintenance" },
];

const PRIORITIES: { key: GrievancePriority; label: string }[] = [
  { key: "low", label: "Low (Within 72 hrs)" },
  { key: "medium", label: "Medium (Within 24 hrs)" },
  { key: "high", label: "High (Within 6 hrs)" },
  { key: "urgent", label: "Urgent (Immediate Safety)" },
];

export function GrievanceReportModal({
  onClose,
  onSuccess,
}: GrievanceReportModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<GrievanceCategory>("wifi");
  const [priority, setPriority] = useState<GrievancePriority>("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/hostel/grievances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          priority,
          roomId: "hr-101",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit grievance.");
      }

      setSubmitted(true);
      onSuccess(data.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-border/80 bg-card p-6 shadow-2xl space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            <div>
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Wrench className="w-5 h-5 text-primary" />
                Report Hostel Maintenance Grievance
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Automatically routed to resident facility engineers with SLA turnaround tracking
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Issue Summary / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ethernet port dropping packets periodically"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Maintenance Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GrievanceCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Urgency Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as GrievancePriority)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.key} value={p.key}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Detailed Description & Location in Room
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Please specify exact location (e.g., Bed A, bathroom faucet, window latch) and symptoms..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="rounded-2xl text-xs h-10 px-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="rounded-2xl text-xs h-10 px-5 gap-1.5 font-bold"
                >
                  <Send className="w-3.5 h-3.5" />
                  {loading ? "Dispatching..." : "Log Grievance"}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-foreground">
                Grievance Dispatched!
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                A maintenance technician has been assigned to your room. You will receive an SMS status alert once inspection begins.
              </p>
            </div>
            <Button
              onClick={onClose}
              className="w-full rounded-2xl text-xs font-bold h-10"
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
