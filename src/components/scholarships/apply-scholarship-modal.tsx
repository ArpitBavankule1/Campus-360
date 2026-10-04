"use client";

import React, { useState } from "react";
import { ScholarshipScheme, ScholarshipApplication } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GraduationCap, CheckCircle2, ShieldCheck } from "lucide-react";

interface ApplyScholarshipModalProps {
  scheme: ScholarshipScheme | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (application: ScholarshipApplication) => void;
}

export function ApplyScholarshipModal({
  scheme,
  isOpen,
  onClose,
  onSuccess,
}: ApplyScholarshipModalProps) {
  const [scholarName, setScholarName] = useState("Arpit Bavankule");
  const [scholarId, setScholarId] = useState("SCH-2026-8819");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [currentCgpa, setCurrentCgpa] = useState("9.42");
  const [annualFamilyIncomeInr, setAnnualFamilyIncomeInr] = useState("540000");
  const [statementOfPurpose, setStatementOfPurpose] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<ScholarshipApplication | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheme) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/scholarships/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schemeName: scheme.scheme_name,
          scholarId,
          scholarName,
          department,
          currentCgpa: Number(currentCgpa),
          annualFamilyIncomeInr: Number(annualFamilyIncomeInr),
          statementOfPurpose,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedApp(data.data);
        onSuccess(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedApp(null);
    setStatementOfPurpose("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleReset}>
      <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-border/80">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="h-5 w-5 text-blue-500" />
            {submittedApp ? "Application Submitted" : `Apply for ${scheme?.scheme_name}`}
          </DialogTitle>
          <DialogDescription>
            {submittedApp
              ? "Your docket is queued for Dean Financial Scrutiny."
              : `Grant: ₹${scheme?.amount_per_scholar_inr.toLocaleString("en-IN")} • Min CGPA: ${scheme?.min_cgpa}`}
          </DialogDescription>
        </DialogHeader>

        {submittedApp ? (
          <div className="space-y-4 py-3">
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-center">
              <CheckCircle2 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Docket Registered with DBT Registry
              </p>
              <h4 className="text-xl font-mono font-bold text-foreground mt-1">
                {submittedApp.application_code}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Status: {submittedApp.status}
              </p>
            </div>

            <div className="rounded-lg bg-muted/60 p-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Scheme:</span>
                <span className="font-medium text-foreground truncate max-w-[200px]">{submittedApp.scheme_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Applicant:</span>
                <span className="font-medium text-foreground">{submittedApp.scholar_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Declared CGPA:</span>
                <span className="font-bold text-blue-400">{submittedApp.current_cgpa.toFixed(2)}</span>
              </div>
            </div>

            <Button onClick={handleReset} className="w-full bg-blue-600 hover:bg-blue-500 text-white">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Scholar Name</Label>
                <Input
                  required
                  value={scholarName}
                  onChange={(e) => setScholarName(e.target.value)}
                  className="text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Scholar Roll/ID</Label>
                <Input
                  required
                  value={scholarId}
                  onChange={(e) => setScholarId(e.target.value)}
                  className="text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Academic Department</Label>
              <Input
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Current Cumulative CGPA</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={currentCgpa}
                  onChange={(e) => setCurrentCgpa(e.target.value)}
                  className="text-xs font-semibold"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Family Income (₹/Year)</Label>
                <Input
                  type="number"
                  value={annualFamilyIncomeInr}
                  onChange={(e) => setAnnualFamilyIncomeInr(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Statement of Need / Academic Goals</Label>
              <Textarea
                rows={2}
                value={statementOfPurpose}
                onChange={(e) => setStatementOfPurpose(e.target.value)}
                placeholder="Briefly state academic achievements or financial need..."
                className="text-xs"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white mt-2"
            >
              {isSubmitting ? "Submitting..." : "Submit Scholarship Application"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
