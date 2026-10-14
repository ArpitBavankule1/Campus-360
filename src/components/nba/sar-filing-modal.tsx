"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NbaProgram, NbaSarDossier } from "@/types";
import { FileText, Loader2, Sparkles } from "lucide-react";

interface SarFilingModalProps {
  isOpen: boolean;
  onClose: () => void;
  programs: NbaProgram[];
  onSuccess: (newSar: NbaSarDossier) => void;
}

export function SarFilingModal({
  isOpen,
  onClose,
  programs,
  onSuccess,
}: SarFilingModalProps) {
  const [selectedProgramId, setSelectedProgramId] = useState(programs[0]?.id || "");
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [coordinatorName, setCoordinatorName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const program = programs.find((p) => p.id === selectedProgramId) || programs[0];
    if (!program) {
      setError("Please select a valid degree program");
      return;
    }

    if (!coordinatorName.trim()) {
      setError("Please provide the Program NBA Coordinator name");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/nba/sar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          program_id: program.id,
          program_name: program.program_name,
          program_code: program.program_code,
          academic_year: academicYear,
          coordinator_name: coordinatorName.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to create SAR dossier");
      }

      onSuccess(json.data);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error creating SAR dossier");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground font-bold text-lg">
            <FileText className="w-5 h-5 text-primary" />
            Initiate NBA Self-Assessment Report (SAR)
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Generate an official Tier-1 Washington Accord SAR dossier across 10 statutory evaluation criteria.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="p-2.5 rounded bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Select Degree Program
            </label>
            <select
              value={selectedProgramId}
              onChange={(e) => setSelectedProgramId(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            >
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.program_code} — {p.program_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Accreditation Cycle / Academic Year
            </label>
            <Input
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="e.g. 2026-2027"
              className="text-xs"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Program NBA Coordinator
            </label>
            <Input
              value={coordinatorName}
              onChange={(e) => setCoordinatorName(e.target.value)}
              placeholder="e.g. Prof. R. Deshmukh"
              className="text-xs"
              required
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting} className="flex items-center gap-1.5">
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating SAR...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> Generate SAR Dossier
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
