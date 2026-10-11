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
import { ExecutiveProgram, SponsorshipStatus } from "@/types";
import {
  Building2,
  User,
  Mail,
  Briefcase,
  Calendar,
  Send,
  CheckCircle2,
  Sparkles,
  Award,
} from "lucide-react";

interface CorporateNominationModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: ExecutiveProgram | null;
  onSubmit: (data: {
    program_id: string;
    corporate_sponsor: string;
    participant_name: string;
    participant_email: string;
    designation: string;
    years_of_experience: number;
    sponsorship_status: SponsorshipStatus;
  }) => void;
}

export function CorporateNominationModal({
  isOpen,
  onClose,
  program,
  onSubmit,
}: CorporateNominationModalProps) {
  const [corporateSponsor, setCorporateSponsor] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [participantEmail, setParticipantEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [yearsExperience, setYearsExperience] = useState(5);
  const [sponsorshipStatus, setSponsorshipStatus] = useState<SponsorshipStatus>("sponsored_approved");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!program) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({
        program_id: program.id,
        corporate_sponsor: corporateSponsor.trim() || "Apex Enterprise Sponsor",
        participant_name: participantName.trim(),
        participant_email: participantEmail.trim(),
        designation: designation.trim(),
        years_of_experience: Number(yearsExperience),
        sponsorship_status: sponsorshipStatus,
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setCorporateSponsor("");
    setParticipantName("");
    setParticipantEmail("");
    setDesignation("");
    setYearsExperience(5);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleReset()}>
      <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-border/80 shadow-2xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-md bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Continuing Education Admissions
            </span>
          </div>
          <DialogTitle className="text-lg font-bold">
            Executive Program Enrollment
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Register or nominate an executive candidate for{" "}
            <span className="font-semibold text-foreground">{program.title}</span> ({program.program_code})
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-foreground">
              Candidate Nomination Confirmed!
            </h4>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Enrollment token generated and registration pass dispatched to{" "}
              <span className="font-mono text-foreground font-semibold">{participantEmail}</span>.
            </p>
            <div className="p-3 bg-muted/30 rounded-lg text-xs space-y-1 text-left font-mono">
              <p>Program: {program.program_code}</p>
              <p>Candidate: {participantName}</p>
              <p>Credits: {program.credit_units} CEUs</p>
            </div>
            <Button onClick={handleReset} className="w-full text-xs h-9 font-semibold">
              Done & Return
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
            <div>
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5 mb-1">
                <Building2 className="w-3.5 h-3.5 text-primary" /> Corporate Sponsoring Org / Company
              </label>
              <input
                type="text"
                required
                placeholder="e.g. NVIDIA Technologies, Tata Motors, or Self-Sponsored"
                value={corporateSponsor}
                onChange={(e) => setCorporateSponsor(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-background border border-border/80 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5 text-primary" /> Candidate Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sumanth Narayanan"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-background border border-border/80 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5 mb-1">
                  <Mail className="w-3.5 h-3.5 text-primary" /> Official Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={participantEmail}
                  onChange={(e) => setParticipantEmail(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-md bg-background border border-border/80 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5 mb-1">
                  <Briefcase className="w-3.5 h-3.5 text-primary" /> Designation
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Staff Architect"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-md bg-background border border-border/80 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs rounded-md bg-background border border-border/80 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">
                  Funding Sponsorship
                </label>
                <select
                  value={sponsorshipStatus}
                  onChange={(e) => setSponsorshipStatus(e.target.value as SponsorshipStatus)}
                  className="w-full px-3 py-1.5 text-xs rounded-md bg-background border border-border/80 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="sponsored_approved">Corporate Sponsored</option>
                  <option value="self_funded">Self Sponsored</option>
                  <option value="scholarship_waived">Institutional Grant</option>
                </select>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20 text-[11px] text-muted-foreground space-y-1">
              <div className="flex justify-between text-foreground font-medium">
                <span>Tuition Settlement</span>
                <span className="font-bold text-primary">
                  {program.fee_inr === 0 ? "Waived (Grant)" : `₹${program.fee_inr.toLocaleString("en-IN")}`}
                </span>
              </div>
              <p>Earns {program.credit_units} Continuing Education Units upon capstone completion.</p>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs h-8">
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Processing..." : "Confirm Nomination"}</span>
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
