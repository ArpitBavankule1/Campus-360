"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Send, Loader2 } from "lucide-react";
import { WorldRankingDossier } from "@/types";

interface DossierSubmissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDossierCreated?: (dossier: WorldRankingDossier) => void;
}

export function DossierSubmissionModal({
  open,
  onOpenChange,
  onDossierCreated,
}: DossierSubmissionModalProps) {
  const [loading, setLoading] = useState(false);
  const [frameworkCode, setFrameworkCode] = useState("QS_WUR");
  const [cycleName, setCycleName] = useState("");
  const [deadline, setDeadline] = useState("2026-11-30");
  const [leadCompiler, setLeadCompiler] = useState("");
  const [publicationsCount, setPublicationsCount] = useState("2500");
  const [academicPeers, setAcademicPeers] = useState("200");
  const [employers, setEmployers] = useState("120");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!cycleName.trim() || !leadCompiler.trim() || !deadline) {
      setError("Please fill in all mandatory fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/world-rankings/dossiers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          framework_code: frameworkCode,
          cycle_name: cycleName,
          data_submission_deadline: deadline,
          lead_compiler_name: leadCompiler,
          verified_publications_count: Number(publicationsCount) || 1200,
          international_academic_peers_nominated: Number(academicPeers) || 150,
          international_employers_nominated: Number(employers) || 80,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit ranking dossier");
      }

      onDossierCreated?.(data.data);
      onOpenChange(false);
      setCycleName("");
      setLeadCompiler("");
      setNotes("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">
                Submit International Ranking Dossier
              </DialogTitle>
              <DialogDescription className="text-xs">
                Queue institutional submission for Vice-Chancellor approval and agency portal transfer.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 py-1 text-xs">
          {error && (
            <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <Label className="text-xs font-semibold">Ranking Agency Framework</Label>
            <select
              value={frameworkCode}
              onChange={(e) => setFrameworkCode(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="QS_WUR">QS World University Rankings</option>
              <option value="THE_WUR">Times Higher Education (THE) WUR</option>
              <option value="THE_IMPACT_SDG">THE University Impact Rankings (UN SDGs)</option>
              <option value="QS_ASIA">QS Asia University Rankings</option>
              <option value="ARWU_SHANGHAI">ARWU Shanghai Academic Ranking</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold">Cycle / Dossier Title *</Label>
            <Input
              placeholder="e.g., QS WUR 2027 Institutional Return & Bibliometrics"
              value={cycleName}
              onChange={(e) => setCycleName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Lead Compiler Name *</Label>
              <Input
                placeholder="Prof. Rajeshwari Venkatraman"
                value={leadCompiler}
                onChange={(e) => setLeadCompiler(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Submission Deadline *</Label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold">Scopus Papers</Label>
              <Input
                type="number"
                value={publicationsCount}
                onChange={(e) => setPublicationsCount(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold">Academic Peers</Label>
              <Input
                type="number"
                value={academicPeers}
                onChange={(e) => setAcademicPeers(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-semibold">Employers</Label>
              <Input
                type="number"
                value={employers}
                onChange={(e) => setEmployers(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold">Notes & Special Disclosures</Label>
            <textarea
              rows={2}
              placeholder="Provide context regarding joint international publications or faculty exchange..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={loading} className="gap-1.5">
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Submit Dossier
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
