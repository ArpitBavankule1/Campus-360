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
  FileCheck,
  Send,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import { LicenseType } from "@/types";

interface TechLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    patent_title: string;
    licensee_org: string;
    trl_level: number;
    license_type: LicenseType;
    proposed_terms: string;
  }) => void;
}

export function TechLicenseModal({
  isOpen,
  onClose,
  onSubmit,
}: TechLicenseModalProps) {
  const [patentTitle, setPatentTitle] = useState("Non-Intrusive Deep Neural Spectral Sensing for Smart Grid Fault Detection");
  const [licenseeOrg, setLicenseeOrg] = useState("");
  const [trlLevel, setTrlLevel] = useState("7");
  const [licenseType, setLicenseType] = useState<LicenseType>("non_exclusive");
  const [proposedTerms, setProposedTerms] = useState("4% Net Sales Royalty + ₹20L Commercial Milestone Fee");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({
        patent_title: patentTitle,
        licensee_org: licenseeOrg,
        trl_level: parseInt(trlLevel, 10),
        license_type: licenseType,
        proposed_terms: proposedTerms,
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setLicenseeOrg("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleReset}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Inquire Technology Transfer & IP Licensing</DialogTitle>
              <DialogDescription className="text-xs">
                Apex Intellectual Property & Commercialization Desk
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
              <h3 className="text-lg font-bold text-foreground">Licensing Docket Initiated</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Your technology commercialization inquiry has been filed with the Deanery IP Licensing Office.
              </p>
            </div>
            <Button onClick={handleReset} className="w-full">
              Close & Return to Hub
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Target Patent / IP Technology</label>
              <input
                type="text"
                required
                value={patentTitle}
                onChange={(e) => setPatentTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Licensee Organization / Corporate Enterprise</label>
              <input
                type="text"
                required
                placeholder="e.g. Bosch Global Mobility Ltd."
                value={licenseeOrg}
                onChange={(e) => setLicenseeOrg(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Technology Readiness Level (TRL)</label>
                <select
                  value={trlLevel}
                  onChange={(e) => setTrlLevel(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="4">TRL 4 - Lab Component Validation</option>
                  <option value="5">TRL 5 - Relevant Environment Test</option>
                  <option value="6">TRL 6 - Prototype Demonstration</option>
                  <option value="7">TRL 7 - Operational Demonstration</option>
                  <option value="8">TRL 8 - Flight / Commercial Qualified</option>
                  <option value="9">TRL 9 - Full Commercial Deployment</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Licensing Agreement Model</label>
                <select
                  value={licenseType}
                  onChange={(e) => setLicenseType(e.target.value as LicenseType)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="non_exclusive">Non-Exclusive Commercial</option>
                  <option value="exclusive">Exclusive Field-of-Use</option>
                  <option value="evaluation_only">Pilot Evaluation Option</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Proposed Commercial Terms</label>
              <textarea
                rows={2}
                value={proposedTerms}
                onChange={(e) => setProposedTerms(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-border/40">
              <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting || !licenseeOrg} className="gap-1.5">
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? "Submitting..." : "Initiate IP Docket"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
