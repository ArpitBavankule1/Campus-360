"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { AicteEoaDossier } from "@/types";

interface SubmitEoaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (newDossier: AicteEoaDossier) => void;
}

export function SubmitEoaModal({
  open,
  onOpenChange,
  onSuccess,
}: SubmitEoaModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    academic_year: "2026-27",
    application_number: "AICTE-EOA-2026-99410",
    deficiency_index: 0.0,
    evc_inspection_status: "recommended",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/aicte/dossiers", {
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
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <ShieldCheck className="h-4 w-4" />
            <span>AICTE Approval Process Handbook (APH)</span>
          </div>
          <DialogTitle className="text-xl">File Annual Extension of Approval (EoA) Return</DialogTitle>
          <DialogDescription>
            Submit audited institutional compliance docket, space audit, and zero-deficiency affidavit.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">EoA Return Filed Successfully</h3>
            <p className="text-sm text-muted-foreground">
              Official application token and digital signature hash generated.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="academic_year" className="text-xs">Approval Cycle Academic Year</Label>
                <Input
                  id="academic_year"
                  value={formData.academic_year}
                  onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                  required
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="app_no" className="text-xs">Application Permanent ID</Label>
                <Input
                  id="app_no"
                  value={formData.application_number}
                  onChange={(e) => setFormData({ ...formData, application_number: e.target.value })}
                  required
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="deficiency" className="text-xs">Deficiency Index (%)</Label>
                <Input
                  id="deficiency"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.deficiency_index}
                  onChange={(e) => setFormData({ ...formData, deficiency_index: Number(e.target.value) })}
                  required
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-xs">EVC Scrutiny Recommendation</Label>
                <select
                  id="status"
                  value={formData.evc_inspection_status}
                  onChange={(e) => setFormData({ ...formData, evc_inspection_status: e.target.value })}
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs"
                >
                  <option value="recommended">Recommended (EVC Inspection Cleared)</option>
                  <option value="scrutiny_cleared">Scrutiny Cleared (Zero Deficiency)</option>
                  <option value="under_scrutiny">Under Scrutiny</option>
                  <option value="clarification_sought">Clarification Sought</option>
                </select>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/40 border border-border/50 text-xs text-muted-foreground space-y-1">
              <span className="font-semibold text-foreground">Statutory Affirmation:</span>
              <p>
                By clicking submit, the Principal/Director affirms that all FSR (1:15), cadre ratios (1:2:6),
                instructional carpet areas, and statutory committees comply strictly with AICTE APH norms.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/40">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={loading}
                className="gap-1.5 bg-primary text-primary-foreground"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {loading ? "Submitting..." : "Sign & File EoA Return"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
