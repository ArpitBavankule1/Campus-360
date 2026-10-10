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
import {
  FileText,
  IndianRupee,
  Send,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface GrantProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    project_title: string;
    sponsor_name: string;
    principal_investigator: string;
    department: string;
    grant_amount_inr: number;
    deliverables: string[];
  }) => void;
}

export function GrantProposalModal({
  isOpen,
  onClose,
  onSubmit,
}: GrantProposalModalProps) {
  const [projectTitle, setProjectTitle] = useState("");
  const [sponsorName, setSponsorName] = useState("NVIDIA AI Research Labs");
  const [piName, setPiName] = useState("Prof. K. Ramanathan");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [amountInLakhs, setAmountInLakhs] = useState("50");
  const [deliverables, setDeliverables] = useState("High-throughput CUDA algorithm, 2 IEEE papers, open-source library");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({
        project_title: projectTitle,
        sponsor_name: sponsorName,
        principal_investigator: piName,
        department,
        grant_amount_inr: parseFloat(amountInLakhs) * 100000,
        deliverables: deliverables.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setProjectTitle("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleReset}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Submit Sponsored Research Grant Proposal</DialogTitle>
              <DialogDescription className="text-xs">
                Apex Corporate CSR & Industry Collaboration Docket
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">Grant Proposal Registered</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Your research proposal has been successfully logged with Deanery Industry Alliances. A tracking token has been generated.
              </p>
            </div>
            <Button onClick={handleReset} className="w-full">
              Close & Return to Dashboard
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Research Project Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Scalable Photonic Quantum Circuit Synthesis"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Corporate / Industry Sponsor</label>
                <input
                  type="text"
                  required
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Grant Outlay (₹ in Lakhs)</label>
                <div className="relative">
                  <IndianRupee className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-2.5" />
                  <input
                    type="number"
                    required
                    value={amountInLakhs}
                    onChange={(e) => setAmountInLakhs(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Principal Investigator (PI)</label>
                <input
                  type="text"
                  required
                  value={piName}
                  onChange={(e) => setPiName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Department</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Key Technical Deliverables (comma-separated)</label>
              <textarea
                rows={2}
                value={deliverables}
                onChange={(e) => setDeliverables(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-border/40">
              <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting || !projectTitle} className="gap-1.5">
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? "Submitting..." : "Submit Research Proposal"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
