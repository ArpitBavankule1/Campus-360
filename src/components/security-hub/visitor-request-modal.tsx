"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CheckCircle2, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { VisitorPass, VisitingPurpose } from "@/types";

interface VisitorRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (pass: VisitorPass) => void;
}

export function VisitorRequestModal({
  isOpen,
  onClose,
  onSuccess,
}: VisitorRequestModalProps) {
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("+91 ");
  const [visitorIdProof, setVisitorIdProof] = useState("National ID / Passport");
  const [visitingPurpose, setVisitingPurpose] =
    useState<VisitingPurpose>("Guest Lecture & Academic Seminar");
  const [hostPerson, setHostPerson] = useState("Dr. S. R. Venkatraman");
  const [entryGate, setEntryGate] = useState("Main Gate 1 (North Arch)");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultPass, setResultPass] = useState<VisitorPass | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/security-hub/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorName,
          visitorPhone,
          visitorIdProof,
          visitingPurpose,
          hostPerson,
          entryGate,
          validDate: new Date().toISOString().split("T")[0],
          vehicleNumber,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to issue visitor pass.");
      }

      setResultPass(data.pass);
      if (onSuccess) onSuccess(data.pass);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error generating visitor badge");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-border/80 bg-card p-6 shadow-2xl animate-in fade-in-50 zoom-in-95">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {!resultPass ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Pre-Register Campus Visitor Pass
                </h2>
                <p className="text-xs text-muted-foreground">Automated RFID & Cryptographic Turnstile Authorization</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-destructive/15 p-3 text-xs text-destructive border border-destructive/20">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Visitor Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Arvind Kumar"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Contact Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={visitorPhone}
                    onChange={(e) => setVisitorPhone(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Visiting Purpose
                  </label>
                  <select
                    value={visitingPurpose}
                    onChange={(e) => setVisitingPurpose(e.target.value as VisitingPurpose)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Guest Lecture & Academic Seminar">Guest Lecture & Academic Seminar</option>
                    <option value="Parent & Guardian Residence Visit">Parent & Guardian Residence Visit</option>
                    <option value="Vendor & Logistics Delivery">Vendor & Logistics Delivery</option>
                    <option value="Corporate Campus Recruitment">Corporate Campus Recruitment</option>
                    <option value="Official Statutory Inspection">Official Statutory Inspection</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Host Faculty / Scholar
                  </label>
                  <input
                    type="text"
                    required
                    value={hostPerson}
                    onChange={(e) => setHostPerson(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Authorized Entry Gate
                  </label>
                  <select
                    value={entryGate}
                    onChange={(e) => setEntryGate(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Main Gate 1 (North Arch)">Main Gate 1 (North Arch)</option>
                    <option value="Gate 2 (Hostel Quad)">Gate 2 (Hostel Quad)</option>
                    <option value="Gate 3 (Sports Complex)">Gate 3 (Sports Complex)</option>
                    <option value="Gate 4 (Research Park)">Gate 4 (Research Park)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    Vehicle Reg (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DL 03 CA 1234"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Government ID Reference
                </label>
                <input
                  type="text"
                  required
                  value={visitorIdProof}
                  onChange={(e) => setVisitorIdProof(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
                <p>• Fast-track QR scan at turnstiles without paper visitor logs.</p>
                <p>• SMS notification sent to host faculty upon security barrier scan.</p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-amber-600 hover:bg-amber-500 text-white"
                >
                  {loading ? "Generating..." : "Issue Digital Pass"}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-2 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 mb-2">
                Pass Active & Verifiable
              </Badge>
              <h3 className="text-lg font-bold text-foreground">
                {resultPass.visitor_name}
              </h3>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                {resultPass.pass_code}
              </p>
            </div>

            <div className="flex justify-center p-3 bg-white rounded-xl shadow-inner w-fit mx-auto border border-border/40">
              <QRCodeSVG value={resultPass.pass_code} size={130} />
            </div>

            <div className="rounded-xl bg-muted/30 p-3 text-xs text-left text-muted-foreground space-y-1 font-mono">
              <div>Host: <strong className="text-foreground">{resultPass.host_person}</strong></div>
              <div>Gate: <strong className="text-foreground">{resultPass.entry_gate}</strong></div>
              <div>Purpose: <strong className="text-foreground">{resultPass.visiting_purpose}</strong></div>
              <div>Valid Date: <strong className="text-foreground">{resultPass.valid_date}</strong></div>
            </div>

            <Button onClick={onClose} className="w-full bg-amber-600 hover:bg-amber-500 text-white">
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
