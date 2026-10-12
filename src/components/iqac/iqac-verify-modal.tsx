"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CheckCircle2, XCircle, Search } from "lucide-react";
import { verifyIqacComplianceToken } from "@/lib/iqac/iqac-engine";

interface IqacVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialToken?: string;
}

export function IqacVerifyModal({
  isOpen,
  onClose,
  initialToken = "",
}: IqacVerifyModalProps) {
  const [token, setToken] = useState(initialToken);
  const [result, setResult] = useState<{
    tested: boolean;
    valid: boolean;
    type: string;
    data: any;
  }>({
    tested: false,
    valid: false,
    type: "",
    data: null,
  });

  React.useEffect(() => {
    if (initialToken) {
      setToken(initialToken);
      const res = verifyIqacComplianceToken(initialToken);
      setResult({ tested: true, ...res });
    }
  }, [initialToken]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    const res = verifyIqacComplianceToken(token.trim());
    setResult({ tested: true, ...res });
  };

  const handleClose = () => {
    setResult({ tested: false, valid: false, type: "", data: null });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            Accreditation & Quality Verification Gateway
          </DialogTitle>
          <DialogDescription className="text-xs">
            Verify tamper-proof cryptographic tokens for NAAC AQAR dockets, institutional audit reports, and compliance credentials.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleVerify} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <Label htmlFor="tokenInput">Compliance Token or Audit Code</Label>
            <div className="flex gap-2">
              <Input
                id="tokenInput"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="e.g. CL-AQAR-2026-8812 or CL-BP-2026-4401"
                className="font-mono text-xs"
                required
              />
              <Button type="submit" size="sm" className="flex items-center gap-1">
                <Search className="w-3.5 h-3.5" /> Verify
              </Button>
            </div>
          </div>
        </form>

        {result.tested && (
          <div className="pt-2">
            {result.valid ? (
              <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Cryptographically Valid
                  </span>
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {result.type}
                  </Badge>
                </div>
                <div className="space-y-1 text-muted-foreground text-[11px] pt-1 border-t border-emerald-500/20">
                  <p>
                    <strong className="text-foreground">Record:</strong>{" "}
                    {result.data.practice_title ||
                      result.data.audit_title ||
                      `AY ${result.data.academic_year} (${result.data.projected_naac_grade || "A++"})` ||
                      result.data.status}
                  </p>
                  <p>
                    <strong className="text-foreground">Token:</strong>{" "}
                    <span className="font-mono text-primary font-bold">
                      {result.data.submission_token ||
                        result.data.practice_token ||
                        result.data.audit_code ||
                        result.data.token}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs space-y-1 text-rose-600 dark:text-rose-400">
                <div className="flex items-center gap-1 font-bold">
                  <XCircle className="w-4 h-4" /> Token Not Found or Invalid
                </div>
                <p className="text-[11px] text-muted-foreground">
                  The token could not be verified against the IQAC institutional registry. Check formatting and try again.
                </p>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="pt-2">
          <Button variant="outline" size="sm" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
