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
import { Award, CheckCircle2 } from "lucide-react";

interface SubmitUcModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (uc: {
    financial_year: string;
    gfr_format: string;
    grant_in_aid_sanctioned_lakhs: number;
    interest_earned_lakhs: number;
    expenditure_incurred_lakhs: number;
    unspent_balance_lakhs: number;
    statutory_auditor_name: string;
    ca_membership_no: string;
    signed_date: string;
  }) => void;
}

export function SubmitUcModal({
  isOpen,
  onClose,
  onSubmit,
}: SubmitUcModalProps) {
  const [financialYear, setFinancialYear] = useState("2025-2026");
  const [sanctionedLakhs, setSanctionedLakhs] = useState<number>(350);
  const [interestLakhs, setInterestLakhs] = useState<number>(2.5);
  const [expenditureLakhs, setExpenditureLakhs] = useState<number>(310);
  const [auditorName, setAuditorName] = useState("M/s Deshmukh & Singhania Chartered Accountants");
  const [caRegNo, setCaRegNo] = useState("CA-FCA-094812");
  const [signedDate, setSignedDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const unspentLakhs = Math.max(0, sanctionedLakhs + interestLakhs - expenditureLakhs);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditorName || !caRegNo || !sanctionedLakhs) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({
        financial_year: financialYear,
        gfr_format: "GFR 12-A",
        grant_in_aid_sanctioned_lakhs: Number(sanctionedLakhs),
        interest_earned_lakhs: Number(interestLakhs),
        expenditure_incurred_lakhs: Number(expenditureLakhs),
        unspent_balance_lakhs: Number(unspentLakhs.toFixed(2)),
        statutory_auditor_name: auditorName,
        ca_membership_no: caRegNo,
        signed_date: signedDate,
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg border-border/80 bg-background/95 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-400" />
            File GFR 12-A Utilization Certificate
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Digital statutory submission certified by Chartered Accountant under General Financial Rules (GFR 12-A)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Financial Year</label>
              <select
                value={financialYear}
                onChange={(e) => setFinancialYear(e.target.value)}
                className="w-full text-xs h-9 bg-background border border-border/60 rounded px-2 text-foreground"
              >
                <option value="2024-2025">2024-2025</option>
                <option value="2025-2026">2025-2026</option>
                <option value="2026-2027">2026-2027</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Certification Date</label>
              <Input
                type="date"
                required
                value={signedDate}
                onChange={(e) => setSignedDate(e.target.value)}
                className="text-xs h-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Grant Sanctioned (₹ L)</label>
              <Input
                type="number"
                required
                min={0}
                value={sanctionedLakhs}
                onChange={(e) => setSanctionedLakhs(Number(e.target.value))}
                className="text-xs h-9"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Interest Accrued (₹ L)</label>
              <Input
                type="number"
                required
                min={0}
                step={0.01}
                value={interestLakhs}
                onChange={(e) => setInterestLakhs(Number(e.target.value))}
                className="text-xs h-9"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Expenditure (₹ L)</label>
              <Input
                type="number"
                required
                min={0}
                value={expenditureLakhs}
                onChange={(e) => setExpenditureLakhs(Number(e.target.value))}
                className="text-xs h-9"
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/40 border border-border/50 text-xs flex items-center justify-between">
            <span className="text-muted-foreground">Computed Unspent Balance:</span>
            <span className="font-bold text-emerald-400">₹{unspentLakhs.toFixed(2)} Lakhs</span>
          </div>

          <div className="space-y-2.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Statutory CA Audit Firm Name</label>
              <Input
                required
                value={auditorName}
                onChange={(e) => setAuditorName(e.target.value)}
                className="text-xs h-9"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">CA Membership / Registration Number</label>
              <Input
                required
                value={caRegNo}
                onChange={(e) => setCaRegNo(e.target.value)}
                className="text-xs h-9"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={onClose} size="sm" className="text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-4 flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <span>Certifying...</span>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Sign & File GFR 12-A
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
