"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Sparkles, CheckCircle2 } from "lucide-react";
import { UgcCurriculumRevision, UgcCurriculumRevisionType } from "@/types";

interface SubmitCurriculumProposalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (newRevision: UgcCurriculumRevision) => void;
}

export function SubmitCurriculumProposalModal({
  open,
  onOpenChange,
  onSuccess,
}: SubmitCurriculumProposalModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    programCode: "BTECH-CS-CYBER",
    programName: "B.Tech Computer Science & Engineering (Cybersecurity)",
    department: "Computer Science & Engineering",
    revisionType: "full_curriculum_revision" as UgcCurriculumRevisionType,
    totalCredits: 160,
    industryComponentPct: 35.0,
    regulationYear: "R-2026 CBCS Autonomous Regulations",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/ugc/curriculum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        onSuccess?.(data.data);
        setTimeout(() => {
          setSubmitted(false);
          onOpenChange(false);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-border/80 bg-card/95 backdrop-blur-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <BookOpen className="h-5 w-5" />
            <DialogTitle className="text-lg">Submit Autonomous Curriculum Revision</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Formulate program scheme and syllabi under UGC autonomous curriculum design mandate.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-3 text-center">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="font-semibold text-foreground">Curriculum Scheme Ratified</h4>
            <p className="text-xs text-muted-foreground max-w-xs">
              Board of Studies resolution cleared and autonomous docket generated.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="programCode" className="text-xs">Program Code</Label>
                <Input
                  id="programCode"
                  value={formData.programCode}
                  onChange={(e) => setFormData({ ...formData, programCode: e.target.value })}
                  required
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="department" className="text-xs">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="programName" className="text-xs">Full Degree / Program Title</Label>
              <Input
                id="programName"
                value={formData.programName}
                onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                required
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="revisionType" className="text-xs">Revision Category</Label>
                <select
                  id="revisionType"
                  value={formData.revisionType}
                  onChange={(e) =>
                    setFormData({ ...formData, revisionType: e.target.value as UgcCurriculumRevisionType })
                  }
                  className="w-full text-xs rounded-md border border-input bg-background px-3 py-2 text-foreground"
                >
                  <option value="full_curriculum_revision">Full CBCS Autonomous Revision</option>
                  <option value="nep_multidisciplinary_minor">NEP 2020 Multidisciplinary Minor</option>
                  <option value="industry_internship_embed">Industry Practice Embedded Track</option>
                  <option value="elective_basket_update">Elective Basket Restructuring</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="regulationYear" className="text-xs">Regulation Framework</Label>
                <Input
                  id="regulationYear"
                  value={formData.regulationYear}
                  onChange={(e) => setFormData({ ...formData, regulationYear: e.target.value })}
                  required
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="totalCredits" className="text-xs">Total Degree Credits</Label>
                <Input
                  id="totalCredits"
                  type="number"
                  value={formData.totalCredits}
                  onChange={(e) => setFormData({ ...formData, totalCredits: parseInt(e.target.value) || 160 })}
                  required
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="industryPct" className="text-xs">Industry Component %</Label>
                <Input
                  id="industryPct"
                  type="number"
                  step="0.5"
                  value={formData.industryComponentPct}
                  onChange={(e) => setFormData({ ...formData, industryComponentPct: parseFloat(e.target.value) || 25 })}
                  required
                  className="text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
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
                {loading ? "Ratifying..." : "Ratify Curriculum Proposal"}
                <Sparkles className="h-3.5 w-3.5" />
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
