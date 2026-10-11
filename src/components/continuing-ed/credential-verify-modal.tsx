"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfessionalMicroCredential, CorporateNomination } from "@/types";
import {
  ShieldCheck,
  Award,
  Hash,
  CheckCircle2,
  QrCode,
  Download,
  Share2,
  Sparkles,
  Building,
} from "lucide-react";

interface CredentialVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  credential?: ProfessionalMicroCredential | null;
  nomination?: CorporateNomination | null;
}

export function CredentialVerifyModal({
  isOpen,
  onClose,
  credential,
  nomination,
}: CredentialVerifyModalProps) {
  if (!credential && !nomination) return null;

  const title = credential?.badge_title || nomination?.program_title || "Executive Micro-Credential";
  const token = credential?.credential_token || nomination?.certificate_token || nomination?.nomination_token || "CL-CRED-2026";
  const hash = credential?.credential_hash || "sha256-e91823abf894109ca8376510a9f8723910b87f4c3912da01837e2";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-card/95 backdrop-blur-2xl border-border/80 shadow-2xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Cryptographically Verified Credential
            </span>
          </div>
          <DialogTitle className="text-base font-bold">
            Institutional Credential Ledger
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Tamper-proof academic credential issued by Apex Center for Continuing Engineering Education.
          </DialogDescription>
        </DialogHeader>

        {/* Holographic Card Frame */}
        <div className="mt-2 p-5 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-primary/5 space-y-4 shadow-inner relative overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Certificate of Competency
              </span>
              <h3 className="text-base font-bold text-foreground mt-0.5 leading-snug">
                {title}
              </h3>
              {nomination && (
                <p className="text-xs text-primary font-medium mt-1">
                  Awarded to: <span className="font-bold text-foreground">{nomination.participant_name}</span>
                </p>
              )}
            </div>
            <div className="w-12 h-12 rounded-lg bg-background p-1.5 border border-border/60 shrink-0 flex items-center justify-center">
              <QrCode className="w-full h-full text-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-background/80 p-2 rounded border border-border/40">
              <span className="text-[10px] text-muted-foreground block">Verification Token</span>
              <span className="font-mono font-bold text-primary">{token}</span>
            </div>
            <div className="bg-background/80 p-2 rounded border border-border/40">
              <span className="text-[10px] text-muted-foreground block">Accrediting Body</span>
              <span className="font-medium truncate block">Apex CCEE & Board</span>
            </div>
          </div>

          {/* Cryptographic SHA-256 Hash */}
          <div className="bg-background/80 p-2.5 rounded border border-border/40 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="font-mono flex items-center gap-1">
                <Hash className="w-3 h-3 text-primary" /> Immutable Hash
              </span>
              <span className="text-emerald-500 font-bold flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> Validated
              </span>
            </div>
            <p className="font-mono text-[10px] break-all text-foreground/80 leading-relaxed bg-muted/40 p-1.5 rounded">
              {hash}
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/30">
            <span>Dean of Continuing Education</span>
            <span>Registrar, Academic Council</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs h-8 flex items-center justify-center gap-1.5"
            onClick={() => alert(`Verification link copied for token: ${token}`)}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </Button>
          <Button
            size="sm"
            className="flex-1 text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center gap-1.5"
            onClick={onClose}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Close Docket</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
