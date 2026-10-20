"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AisheInstitutionProfile } from "@/types";
import {
  Award,
  Download,
  ShieldCheck,
  Landmark,
  CheckCircle2,
  QrCode,
  FileCheck2,
} from "lucide-react";

interface ViewCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AisheInstitutionProfile;
}

export function ViewCertificateModal({
  isOpen,
  onClose,
  profile,
}: ViewCertificateModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-border/80 bg-background/95 backdrop-blur-md">
        <DialogHeader className="sr-only">
          <DialogTitle>MoE AISHE Certificate of Survey Completion</DialogTitle>
          <DialogDescription>
            Official Statutory Survey Certificate issued by Ministry of Education, Government of India.
          </DialogDescription>
        </DialogHeader>

        {/* Certificate Parchment Container */}
        <div className="p-8 border-4 border-double border-amber-600/30 rounded-2xl bg-gradient-to-b from-amber-500/5 via-card to-background text-center space-y-6 shadow-inner relative overflow-hidden">
          {/* Watermark seal */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Landmark className="w-96 h-96 text-foreground" />
          </div>

          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Landmark className="h-8 w-8 text-amber-500" />
            </div>
            <div className="text-xs uppercase tracking-widest font-bold text-muted-foreground">
              Government of India • Ministry of Education
            </div>
            <div className="text-sm font-semibold tracking-wide text-foreground">
              Department of Higher Education
            </div>
            <h2 className="text-2xl font-serif font-bold text-foreground tracking-wide mt-2">
              CERTIFICATE OF SURVEY COMPLETION
            </h2>
            <div className="text-xs text-muted-foreground font-medium">
              All India Survey on Higher Education (AISHE)
            </div>
          </div>

          {/* Certificate Body */}
          <div className="space-y-4 text-xs leading-relaxed max-w-lg mx-auto text-muted-foreground">
            <p>
              This is to statutorily certify that the institution named below has successfully completed and uploaded the comprehensive Data Capture Format (DCF) for the academic survey cycle:
            </p>

            <div className="p-4 bg-card/80 border border-border/80 rounded-xl space-y-1.5 shadow-sm">
              <div className="text-base font-bold text-foreground">
                {profile.institution_name}
              </div>
              <div className="text-xs text-muted-foreground">
                Affiliated to: {profile.affiliating_university}
              </div>
              <div className="flex items-center justify-center gap-2 pt-2">
                <Badge className="bg-blue-600/15 text-blue-500 border-blue-500/30 font-mono text-xs">
                  AISHE Code: {profile.aishe_code}
                </Badge>
                <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-xs">
                  Survey Year: {profile.survey_year}
                </Badge>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground/90">
              The survey data stands officially validated for institutional inclusion in the national higher education statistics, NIRF ranking evaluations, NAAC accreditation benchmarks, and central funding eligibility under the UGC Act, 1956.
            </p>
          </div>

          {/* Signatures & Security Token */}
          <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
            <div className="text-center sm:text-left space-y-1">
              <div className="font-semibold text-foreground">{profile.nodal_officer_name}</div>
              <div className="text-[11px] text-muted-foreground">AISHE Institutional Nodal Officer</div>
              <div className="text-[10px] text-emerald-500 flex items-center justify-center sm:justify-start gap-1">
                <CheckCircle2 className="h-3 w-3" /> Digitally Signed (e-Sign)
              </div>
            </div>

            <div className="flex items-center gap-3 bg-muted/40 p-2.5 rounded-lg border border-border/50 text-left font-mono text-[10px]">
              <QrCode className="h-10 w-10 text-foreground shrink-0" />
              <div className="space-y-0.5 truncate">
                <div className="font-semibold text-foreground">TOKEN: {profile.certificate_token}</div>
                <div className="text-muted-foreground truncate max-w-[180px]">HASH: {profile.verification_hash}</div>
                <div className="text-muted-foreground">DATE: {profile.moe_approval_date}</div>
              </div>
            </div>

            <div className="text-center sm:text-right space-y-1">
              <div className="font-semibold text-foreground">Director General (Higher Ed)</div>
              <div className="text-[11px] text-muted-foreground">Ministry of Education, GoI</div>
              <div className="text-[10px] text-blue-500 flex items-center justify-center sm:justify-end gap-1">
                <ShieldCheck className="h-3 w-3" /> Official MoE Verification Seal
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center sm:justify-between w-full">
          <Button variant="ghost" onClick={onClose} className="text-xs h-9">
            Close
          </Button>
          <Button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-9 gap-1.5 font-medium"
          >
            <Download className="h-3.5 w-3.5" />
            Download Official Certificate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
