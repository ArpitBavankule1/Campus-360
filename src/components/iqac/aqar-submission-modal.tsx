"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Send, CheckCircle2, ShieldCheck } from "lucide-react";
import { IqacAqarReport } from "@/types";

interface AqarSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (report: IqacAqarReport) => void;
}

export function AqarSubmissionModal({
  isOpen,
  onClose,
  onSubmit,
}: AqarSubmissionModalProps) {
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [director, setDirector] = useState("Dr. P. K. Nambiar (IQAC Director)");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<IqacAqarReport | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/iqac/aqar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          academic_year: academicYear,
          iqac_director: director,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSuccess(json.data);
        onSubmit(json.data);
      } else {
        alert(json.error || "Failed to submit AQAR draft");
      }
    } catch {
      alert("Error submitting AQAR docket");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleReset}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-primary" />
            File Annual Quality Assurance Report (AQAR)
          </DialogTitle>
          <DialogDescription className="text-xs">
            Initiate a new statutory NAAC Annual Quality Assurance Report docket for executive and peer review.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-6 space-y-4 text-center">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">AQAR Docket Created!</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Your report for AY {success.academic_year} has been filed for peer review.
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg font-mono text-xs text-center border">
              <span className="text-muted-foreground block text-[11px]">Submission Token</span>
              <span className="font-bold text-primary text-sm">{success.submission_token}</span>
            </div>
            <Button onClick={handleReset} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="academicYear">Academic Year</Label>
              <Input
                id="academicYear"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="e.g. 2026-2027"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="director">IQAC Director / Convenor</Label>
              <Input
                id="director"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                required
              />
            </div>

            <div className="p-3 bg-muted/50 rounded-lg border text-muted-foreground space-y-1">
              <span className="font-semibold text-foreground block">Submission Workflow:</span>
              <p>1. In-memory collation of 7 NAAC criteria metrics</p>
              <p>2. Generation of cryptographically verifiable docket token</p>
              <p>3. Routing to Vice Chancellor for executive sign-off</p>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                {loading ? "Filing Docket..." : "File AQAR Draft"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
