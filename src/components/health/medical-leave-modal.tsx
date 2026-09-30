"use client";

import React, { useState } from "react";
import { MedicalLeaveRequest } from "@/types";
import {
  X,
  FileCheck,
  Calendar,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Percent,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MedicalLeaveModalProps {
  onClose: () => void;
  onSuccess: (newLeave: MedicalLeaveRequest) => void;
}

export function MedicalLeaveModal({
  onClose,
  onSuccess,
}: MedicalLeaveModalProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdLeave, setCreatedLeave] = useState<MedicalLeaveRequest | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/health/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate,
          endDate,
          reason,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit medical leave.");
      }

      setCreatedLeave(data.data);
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

        {!createdLeave ? (
          <>
            <div>
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-primary" />
                Apply for Medical Sick Leave & Attendance Waiver
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Automatically adjusts official academic attendance ledger upon verification
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Absence Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Absence End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Clinical Diagnosis & Reason
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Detail the ailment, bed rest advised, or hospitalization notes..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Certificate Upload Simulation */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Medical Certificate / Doctor's Prescription
                </label>
                <div
                  onClick={() => setFileUploaded(!fileUploaded)}
                  className={`p-4 rounded-2xl border-2 border-dashed cursor-pointer text-center transition-all ${
                    fileUploaded
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "border-border hover:border-primary/50 bg-muted/30"
                  }`}
                >
                  <UploadCloud className="w-6 h-6 mx-auto mb-1 text-primary" />
                  <div className="text-xs font-semibold">
                    {fileUploaded
                      ? "✓ prescription-signed.pdf (Ready for validation)"
                      : "Click to upload doctor certificate / discharge summary (PDF/JPEG)"}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Percent className="w-4 h-4 text-primary" />
                  Academic Attendance Waiver:
                </span>
                <span className="font-bold text-foreground">
                  Excuses up to 4 hrs / day from attendance denominator
                </span>
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
                  {loading ? "Submitting..." : "Submit for CMO Clearance"}
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
                Medical Leave Approved!
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Leave Code: <span className="font-mono font-bold">{createdLeave.leave_code}</span>
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                Attendance waiver automatically transmitted to Department Dean & ERP ledger.
              </p>
            </div>
            <Button
              onClick={onClose}
              className="w-full rounded-2xl text-xs font-bold h-10"
            >
              Done & Return to Clinic
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
