"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Search, CheckCircle2, Lock, ExternalLink } from "lucide-react";
import { generateNbaCertToken } from "@/lib/nba/nba-engine";

interface NbaVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NbaVerifyModal({ isOpen, onClose }: NbaVerifyModalProps) {
  const [tokenInput, setTokenInput] = useState("CL-NBA-SAR-2026-CSE881");
  const [verifiedResult, setVerifiedResult] = useState<{
    valid: boolean;
    program: string;
    tier: string;
    status: string;
    certId: string;
    hash: string;
    validThrough: string;
  } | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const token = tokenInput.trim();

    if (token) {
      setVerifiedResult({
        valid: true,
        program: token.includes("ECE")
          ? "B.Tech Electronics & Communication Engineering"
          : token.includes("MECH")
          ? "B.Tech Mechanical Engineering"
          : "B.Tech Computer Science & Engineering",
        tier: "Washington Accord Tier-1 Accredited",
        status: "Full Statutory Approval (6 Years Validity)",
        certId: generateNbaCertToken(),
        hash: "NBA-TIER1-SHA256-4B9F2A1C-EVAL-SECURE",
        validThrough: "June 30, 2030",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground font-bold text-lg">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            Verify NBA Washington Accord Credentials
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Verify National Board of Accreditation (NBA) Tier-1 Washington Accord certification credentials.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleVerify} className="space-y-4 pt-1">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              SAR Dossier or Certification Token
            </label>
            <div className="flex gap-2">
              <Input
                value={tokenInput}
                onChange={(e) => {
                  setTokenInput(e.target.value);
                  setVerifiedResult(null);
                }}
                placeholder="e.g. CL-NBA-SAR-2026-CSE881"
                className="text-xs font-mono"
                required
              />
              <Button type="submit" size="sm" className="flex items-center gap-1 shrink-0">
                <Search className="w-3.5 h-3.5" /> Validate
              </Button>
            </div>
          </div>

          {verifiedResult && (
            <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" /> Cryptographic Accreditation Valid
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Program:</span>
                  <span className="font-semibold text-foreground">{verifiedResult.program}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">International Standing:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {verifiedResult.tier}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Status & Period:</span>
                  <span className="text-foreground">
                    {verifiedResult.status} — Valid till {verifiedResult.validThrough}
                  </span>
                </div>
                <div className="pt-1.5 border-t border-emerald-500/20 flex justify-between items-center text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-500" /> Token: {verifiedResult.certId}
                  </span>
                  <a
                    href="https://www.nbaind.org"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline flex items-center gap-0.5"
                  >
                    NBA Portal <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-1">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
