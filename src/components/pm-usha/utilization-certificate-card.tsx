"use client";

import React, { useState } from "react";
import { PmUshaUtilizationCertificate, PmUshaUcStatus } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileCheck2,
  CheckCircle2,
  Clock,
  Shield,
  Copy,
  Check,
  Building,
  Award,
  Calendar,
} from "lucide-react";

interface UtilizationCertificateCardProps {
  certificates: PmUshaUtilizationCertificate[];
  onFileUc?: () => void;
}

export function UtilizationCertificateCard({
  certificates,
  onFileUc,
}: UtilizationCertificateCardProps) {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const getStatusBadge = (status: PmUshaUcStatus) => {
    switch (status) {
      case "MoE_Accepted":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> MoE Accepted
          </Badge>
        );
      case "Submitted_to_SHEC":
        return (
          <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30 text-[11px] font-semibold flex items-center gap-1">
            <Clock className="h-3 w-3" /> SHEC Scrutiny
          </Badge>
        );
      case "Certified_by_CA":
        return (
          <Badge className="bg-purple-500/15 text-purple-400 border-purple-500/30 text-[11px] font-semibold flex items-center gap-1">
            <Award className="h-3 w-3" /> CA Certified
          </Badge>
        );
      case "Draft":
        return (
          <Badge className="bg-muted text-muted-foreground text-[11px] font-semibold">
            Draft
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="border-border/60 bg-card/60 shadow-sm">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
              <FileCheck2 className="h-5 w-5 text-emerald-400" />
              GFR 12-A Statutory Utilization Certificates (UC)
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Audited General Financial Rules (GFR) certificates submitted to State Project Directorate & MoE
            </CardDescription>
          </div>
          {onFileUc && (
            <Button
              onClick={onFileUc}
              size="sm"
              variant="outline"
              className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs font-medium"
            >
              + File GFR 12-A
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2">
        <div className="space-y-3.5">
          {certificates.map((uc) => (
            <div
              key={uc.id}
              className="p-4 rounded-xl border border-border/50 bg-background/50 hover:border-emerald-500/30 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-foreground">
                      {uc.certificate_number}
                    </span>
                    <Badge variant="outline" className="text-[10px] font-medium border-border/60">
                      {uc.gfr_format}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] font-medium border-border/60">
                      FY: {uc.financial_year}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-purple-400" />
                    <span>Auditor: {uc.statutory_auditor_name} (Reg: {uc.ca_membership_no})</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Signed: {uc.signed_date}
                    </span>
                  </p>
                </div>
                {getStatusBadge(uc.submission_status)}
              </div>

              {/* Financial Figures Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-muted/30 p-3 rounded-lg border border-border/40 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Sanctioned Grant</span>
                  <span className="font-bold text-foreground">
                    ₹{uc.grant_in_aid_sanctioned_lakhs.toFixed(2)} L
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Interest Accrued</span>
                  <span className="font-bold text-teal-400">
                    ₹{uc.interest_earned_lakhs.toFixed(2)} L
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Expenditure Incurred</span>
                  <span className="font-bold text-cyan-400">
                    ₹{uc.expenditure_incurred_lakhs.toFixed(2)} L
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Unspent Balance</span>
                  <span className="font-bold text-emerald-400">
                    ₹{uc.unspent_balance_lakhs.toFixed(2)} L
                  </span>
                </div>
              </div>

              {/* SHA-256 Digital Verification Hash */}
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-muted-foreground flex items-center gap-1 font-mono text-[10px]">
                  <Shield className="h-3 w-3 text-emerald-400" />
                  Hash: {uc.verification_hash}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopyHash(uc.verification_hash)}
                  className="h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground"
                >
                  {copiedHash === uc.verification_hash ? (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Check className="h-3 w-3" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="h-3 w-3" /> Copy Hash
                    </span>
                  )}
                </Button>
              </div>
            </div>
          ))}

          {certificates.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              <FileCheck2 className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No utilization certificates filed for current financial year.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
