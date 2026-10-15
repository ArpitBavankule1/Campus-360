"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Building,
  Award,
  Loader2,
} from "lucide-react";
import { WorldRankingVerification } from "@/types";

interface RankingCredentialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RankingCredentialModal({
  open,
  onOpenChange,
}: RankingCredentialModalProps) {
  const [certCode, setCertCode] = useState("CL-QS-CERT-2026-8812");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WorldRankingVerification | null>(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certCode.trim()) return;

    setLoading(true);
    setSearched(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await fetch(`/api/world-rankings/verify?code=${encodeURIComponent(certCode.trim())}`);
      const data = await res.json();

      if (data.success && data.verified && data.data) {
        setResult(data.data);
      } else {
        setErrorMsg(data.message || "Certificate could not be verified in the global registry.");
      }
    } catch {
      setErrorMsg("Verification request failed. Please check network connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">
                Cryptographic World Ranking Credential Verifier
              </DialogTitle>
              <DialogDescription className="text-xs">
                Validate official QS Quacquarelli Symonds & THE accreditation dockets.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-1 text-xs">
          <form onSubmit={handleVerify} className="flex gap-2">
            <Input
              placeholder="e.g. CL-QS-CERT-2026-8812"
              value={certCode}
              onChange={(e) => setCertCode(e.target.value)}
              className="font-mono text-xs"
              required
            />
            <Button type="submit" size="sm" disabled={loading} className="gap-1.5 flex-shrink-0">
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Search className="h-3.5 w-3.5" />
                  Verify
                </>
              )}
            </Button>
          </form>

          {/* Quick sample buttons */}
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span>Try sample:</span>
            <button
              type="button"
              onClick={() => setCertCode("CL-QS-CERT-2026-8812")}
              className="text-primary hover:underline font-mono"
            >
              QS-2026
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setCertCode("CL-THE-CERT-2026-5590")}
              className="text-primary hover:underline font-mono"
            >
              THE-2026
            </button>
          </div>

          {/* Result Display */}
          {searched && (
            <div>
              {result ? (
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs px-2 py-0.5 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      AUTHENTIC & VERIFIED
                    </Badge>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {result.certificate_code}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <Building className="h-4 w-4 text-primary" />
                      {result.institution_legal_name}
                    </div>
                    <div className="text-xs font-semibold text-primary flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5" />
                      {result.rank_achieved_display}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-emerald-500/20 text-muted-foreground">
                    <div>
                      <span className="block font-medium text-foreground">Issuer Agency:</span>
                      {result.issuer_agency}
                    </div>
                    <div>
                      <span className="block font-medium text-foreground">Validity Window:</span>
                      {result.issue_date} to {result.valid_until}
                    </div>
                  </div>

                  <div className="p-2 rounded bg-background/60 border border-emerald-500/20 text-[10px] font-mono break-all text-muted-foreground">
                    <strong className="text-emerald-600 dark:text-emerald-400 block mb-0.5">
                      DIGITAL SIGNATURE HASH:
                    </strong>
                    {result.digital_signature_hash}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5 space-y-2 text-destructive">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertTriangle className="h-4 w-4" />
                    Verification Failed
                  </div>
                  <p className="text-xs leading-relaxed">{errorMsg}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
