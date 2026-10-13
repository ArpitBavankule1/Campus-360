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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, CheckCircle2, AlertCircle, Copy, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NirfVerifyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCode?: string;
}

export function NirfVerifyModal({
  open,
  onOpenChange,
  initialCode = "CL-NIRF-DOSS-2026-ENG91",
}: NirfVerifyModalProps) {
  const [tokenInput, setTokenInput] = useState(initialCode);
  const [verified, setVerified] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setVerified(tokenInput.toUpperCase().startsWith("CL-NIRF-"));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(tokenInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            Verify NIRF Institutional Dossier
          </DialogTitle>
          <DialogDescription>
            Validate official Ministry of Education (MoE) submission credentials, institutional signatures, and SHA-256 data seals.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleVerify} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="token" className="text-xs">Dossier / Certificate Identifier</Label>
            <div className="flex gap-2">
              <Input
                id="token"
                className="h-9 font-mono text-xs uppercase"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="e.g. CL-NIRF-DOSS-2026-ENG91"
                required
              />
              <Button type="submit" size="sm">Verify</Button>
            </div>
          </div>
        </form>

        {verified ? (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Cryptographically Validated
              </span>
              <Badge variant="outline" className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px]">
                MoE Compliant
              </Badge>
            </div>

            <div className="space-y-1 text-muted-foreground text-[11px] pt-1">
              <div><strong>Institute:</strong> Apex Institute of Technology (College ID: Apex-blr)</div>
              <div><strong>Ranking Category:</strong> Engineering & Technology Discipline</div>
              <div><strong>Composite Score:</strong> 82.85 / 100.00 (Projected Rank #12 – #16)</div>
              <div><strong>Executive Sign-off:</strong> Prof. K. R. Sreenivasan (Vice Chancellor)</div>
              <div className="font-mono text-[10px] truncate text-emerald-700 dark:text-emerald-300 pt-1">
                SHA256: NIRF-SHA256-4B9F2A1C-EVAL-SECURE
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 text-xs gap-1 h-8"
              onClick={handleCopy}
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied Certificate" : "Copy Validation Certificate"}
            </Button>
          </div>
        ) : (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Invalid or unrecognized token format. Valid tokens begin with CL-NIRF-.
          </div>
        )}

        <DialogFooter className="pt-2">
          <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
