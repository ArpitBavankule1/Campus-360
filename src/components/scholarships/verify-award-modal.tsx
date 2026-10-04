"use client";

import React, { useState } from "react";
import { ScholarshipCertificate } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, QrCode, CheckCircle2, ShieldCheck } from "lucide-react";

interface VerifyAwardModalProps {
  certificate: ScholarshipCertificate | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VerifyAwardModal({
  certificate,
  isOpen,
  onClose,
}: VerifyAwardModalProps) {
  const [certQuery, setCertQuery] = useState("");
  const [searchedCert, setSearchedCert] = useState<ScholarshipCertificate | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const activeCert = certificate || searchedCert;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certQuery.trim()) return;

    setIsSearching(true);
    setNotFound(false);
    try {
      const res = await fetch(`/api/scholarships/certificates?certCode=${encodeURIComponent(certQuery)}`);
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setSearchedCert(data.data[0]);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClose = () => {
    setSearchedCert(null);
    setCertQuery("");
    setNotFound(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-border/80">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Award className="h-5 w-5 text-blue-500" />
            Scholarship Sanction Certificate
          </DialogTitle>
          <DialogDescription>
            Cryptographically signed institutional award ledger.
          </DialogDescription>
        </DialogHeader>

        {activeCert ? (
          <div className="space-y-4 py-2">
            <div className="rounded-2xl border-2 border-dashed border-blue-500/40 bg-gradient-to-br from-blue-950/20 via-card to-background p-5 text-center space-y-3">
              <Award className="h-10 w-10 text-amber-500 mx-auto" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Certificate of Scholarship Honor
                </p>
                <h3 className="text-lg font-bold text-foreground mt-1">
                  {activeCert.award_title}
                </h3>
              </div>

              <div className="py-2 border-y border-border/40 text-xs space-y-1">
                <p className="text-muted-foreground">Conferred upon</p>
                <h4 className="text-base font-bold text-blue-400">
                  {activeCert.scholar_name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  Under: {activeCert.scheme_name}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                <span className="font-mono">{activeCert.certificate_code}</span>
                <span>Session: {activeCert.academic_year}</span>
              </div>
            </div>

            <div className="rounded-lg bg-muted/60 p-3 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
                <ShieldCheck className="h-4 w-4" />
                Sanctioned by Dean Academic Welfare
              </span>
              <span className="text-muted-foreground">Status: Active</span>
            </div>

            <Button onClick={handleClose} className="w-full bg-blue-600 hover:bg-blue-500 text-white">
              Close Certificate
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSearch} className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Enter Award Certificate Code</Label>
              <Input
                required
                value={certQuery}
                onChange={(e) => setCertQuery(e.target.value)}
                placeholder="e.g. CL-SCHOL-CERT-2026-8819GOLD"
                className="text-xs font-mono"
              />
            </div>

            {notFound && (
              <p className="text-xs text-rose-500">
                No verified scholarship certificate found with this code.
              </p>
            )}

            <Button
              type="submit"
              disabled={isSearching}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white"
            >
              {isSearching ? "Searching..." : "Verify Certificate"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
