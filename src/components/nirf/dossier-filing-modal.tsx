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
import { NirfCategory, NirfDossier } from "@/types";
import { FileText, Loader2, Sparkles } from "lucide-react";

interface DossierFilingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (dossier: NirfDossier) => void;
}

export function DossierFilingModal({
  open,
  onOpenChange,
  onSuccess,
}: DossierFilingModalProps) {
  const [category, setCategory] = useState<NirfCategory>("Engineering");
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [submittedBy, setSubmittedBy] = useState("Dr. Ananya Mukherjee (Director QA & CoE)");
  const [approvingAuthority, setApprovingAuthority] = useState("Prof. K. R. Sreenivasan (Vice Chancellor)");
  const [projectedRank, setProjectedRank] = useState("Rank #12 – #16");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/nirf/dossiers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          academic_year: academicYear,
          submitted_by: submittedBy,
          approving_authority: approvingAuthority,
          projected_rank_range: projectedRank,
          composite_score: 83.25,
          previous_year_rank: 18,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to create dossier");
      }

      onSuccess(json.data);
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            File NIRF Annual Ranking Dossier
          </DialogTitle>
          <DialogDescription>
            Submit an audited institutional ranking dossier with cryptographic SHA-256 verification to the Ministry of Education.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 text-xs text-destructive bg-destructive/10 rounded-md border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="category" className="text-xs">Ranking Category</Label>
            <select
              id="category"
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              value={category}
              onChange={(e) => setCategory(e.target.value as NirfCategory)}
            >
              <option value="Engineering">Engineering</option>
              <option value="Overall">Overall Institution</option>
              <option value="Research">Research Institutions</option>
              <option value="Management">Management</option>
              <option value="Innovation">Innovation (ARIIA)</option>
              <option value="State_Public_University">State Public University</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="academicYear" className="text-xs">Academic Year</Label>
              <Input
                id="academicYear"
                className="h-9 text-xs"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="projectedRank" className="text-xs">Projected Rank</Label>
              <Input
                id="projectedRank"
                className="h-9 text-xs"
                value={projectedRank}
                onChange={(e) => setProjectedRank(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="submittedBy" className="text-xs">Lead QA Coordinator / Submitter</Label>
            <Input
              id="submittedBy"
              className="h-9 text-xs"
              value={submittedBy}
              onChange={(e) => setSubmittedBy(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="approvingAuthority" className="text-xs">Approving Authority (Vice Chancellor)</Label>
            <Input
              id="approvingAuthority"
              className="h-9 text-xs"
              value={approvingAuthority}
              onChange={(e) => setApprovingAuthority(e.target.value)}
              required
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
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> Submit Dossier
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
