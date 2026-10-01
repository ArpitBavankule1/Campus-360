"use client";

import React, { useState } from "react";
import { TravelClearancePass, VisaCategory } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Plane,
  QrCode,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";

interface TravelClearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pass: TravelClearancePass) => void;
}

export function TravelClearanceModal({
  isOpen,
  onClose,
  onSuccess,
}: TravelClearanceModalProps) {
  const [studentName, setStudentName] = useState("Arpit Bavankule");
  const [studentId, setStudentId] = useState("std-11111111-1111-4111-8111-111111111111");
  const [destinationCountry, setDestinationCountry] = useState("Switzerland");
  const [hostInstitution, setHostInstitution] = useState("ETH Zürich");
  const [passportMasked, setPassportMasked] = useState("Z••••••88");
  const [visaType, setVisaType] = useState<VisaCategory>("Schengen Student (EU)");
  const [validFrom, setValidFrom] = useState("2026-09-01");
  const [validUntil, setValidUntil] = useState("2027-02-28");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [issuedPass, setIssuedPass] = useState<TravelClearancePass | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/international/clearance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          student_name: studentName,
          destination_country: destinationCountry,
          host_institution: hostInstitution,
          passport_number_masked: passportMasked,
          visa_type: visaType,
          valid_from: validFrom,
          valid_until: validUntil,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to issue travel clearance pass.");
      }

      setIssuedPass(data.data);
      onSuccess(data.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (issuedPass) {
      navigator.clipboard.writeText(issuedPass.pass_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-card border border-border/80 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                {issuedPass ? "Pass Issued & Verified" : "Request Travel Clearance"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {issuedPass
                  ? "Your institutional departure voucher is Dean-authorized with verifiable cryptographic QR."
                  : "Submit verified visa details to obtain authorized global mobility clearance."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {issuedPass ? (
          <div className="space-y-4 pt-2">
            <div className="p-5 rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-muted border border-primary/30 text-center space-y-3">
              <div className="flex justify-center">
                <div className="p-3 rounded-2xl bg-card border border-border shadow-xs text-primary">
                  <QrCode className="w-16 h-16" />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Digital Clearance Pass Code
                </span>
                <div className="font-mono font-extrabold text-lg text-primary flex items-center justify-center gap-2 mt-0.5">
                  <span>{issuedPass.pass_code}</span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="text-xs space-y-1 text-muted-foreground pt-2 border-t border-border/40">
                <div className="flex justify-between">
                  <span>Destination:</span>
                  <strong className="text-foreground">{issuedPass.destination_country}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Institution:</span>
                  <strong className="text-foreground">{issuedPass.host_institution}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Visa Protocol:</span>
                  <strong className="text-foreground">{issuedPass.visa_type}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Validity Window:</span>
                  <strong className="text-foreground">
                    {issuedPass.valid_from} ➔ {issuedPass.valid_until}
                  </strong>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Authorized by Dean of International Affairs</span>
              </div>
            </div>

            <Button
              className="w-full rounded-2xl text-xs h-9 bg-primary text-primary-foreground font-semibold"
              onClick={onClose}
            >
              Done & Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground/80 block mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground/80 block mb-1">
                  Passport (Masked)
                </label>
                <input
                  type="text"
                  required
                  value={passportMasked}
                  onChange={(e) => setPassportMasked(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
                  placeholder="e.g. N••••••48"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground/80 block mb-1">
                  Host Country
                </label>
                <input
                  type="text"
                  required
                  value={destinationCountry}
                  onChange={(e) => setDestinationCountry(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
                  placeholder="e.g. Switzerland"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground/80 block mb-1">
                  Host Institution
                </label>
                <input
                  type="text"
                  required
                  value={hostInstitution}
                  onChange={(e) => setHostInstitution(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
                  placeholder="e.g. ETH Zürich"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground/80 block mb-1">
                Visa Classification
              </label>
              <select
                value={visaType}
                onChange={(e) => setVisaType(e.target.value as VisaCategory)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
              >
                <option value="Schengen Student (EU)">Schengen Student (EU)</option>
                <option value="F-1 / J-1 (USA)">F-1 / J-1 (USA)</option>
                <option value="Tier 4 / Student Visa (UK)">Tier 4 / Student Visa (UK)</option>
                <option value="Student Pass (Singapore)">Student Pass (Singapore)</option>
                <option value="Australian Student 500">Australian Student 500</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground/80 block mb-1">
                  Valid From
                </label>
                <input
                  type="date"
                  required
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground/80 block mb-1">
                  Valid Until
                </label>
                <input
                  type="date"
                  required
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="rounded-xl text-xs h-9 px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={loading}
                className="rounded-xl text-xs h-9 px-4 gap-1.5 bg-primary text-primary-foreground font-semibold"
              >
                <Plane className="w-3.5 h-3.5" />
                {loading ? "Issuing..." : "Generate Travel Pass"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
