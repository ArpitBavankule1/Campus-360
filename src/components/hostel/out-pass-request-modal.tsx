"use client";

import React, { useState } from "react";
import { HostelOutPass } from "@/types";
import {
  X,
  Send,
  Calendar,
  Phone,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle2,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";

interface OutPassRequestModalProps {
  onClose: () => void;
  onSuccess: (newPass: HostelOutPass) => void;
}

export function OutPassRequestModal({
  onClose,
  onSuccess,
}: OutPassRequestModalProps) {
  const [destination, setDestination] = useState("");
  const [reason, setReason] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("");
  const [parentContact, setParentContact] = useState("+91 94220 12345");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdPass, setCreatedPass] = useState<HostelOutPass | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/hostel/out-passes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          reason,
          departureTime,
          expectedReturn,
          parentContact,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit out-pass request.");
      }

      setCreatedPass(data.data);
      onSuccess(data.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-border/80 bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!createdPass ? (
          <>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Request Night Out-Pass
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Institutional electronic pass with verified parent contact and warden sign-off
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  Destination Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Home (Pune, MH) or Tech Park Hub"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  Reason for Out-Pass
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Detail the purpose of departure, event, or family requirement"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    Departure Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    Expected Return Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-1">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  Parent / Guardian Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 94220 12345"
                  value={parentContact}
                  onChange={(e) => setParentContact(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="rounded-2xl text-xs h-10 px-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="rounded-2xl text-xs h-10 px-5 gap-1.5 font-bold"
                >
                  <Send className="w-3.5 h-3.5" />
                  {loading ? "Verifying..." : "Submit Pass Request"}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4 py-2">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-foreground">
                Out-Pass Approved & Issued!
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Scan at the main campus security turnstiles upon departure
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-white border border-border/60 shadow-inner">
              <QRCodeSVG
                value={createdPass.pass_code}
                size={160}
                level="H"
                includeMargin
                className="rounded-xl"
              />
              <span className="text-xs font-mono font-bold text-zinc-700 mt-2">
                {createdPass.pass_code}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-muted/40 border border-border/40 text-xs text-left space-y-1">
              <div>
                <span className="text-muted-foreground">Destination:</span>{" "}
                <span className="font-semibold text-foreground">{createdPass.destination}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Valid Departure:</span>{" "}
                <span className="font-semibold text-foreground">
                  {new Date(createdPass.departure_time).toLocaleString()}
                </span>
              </div>
            </div>

            <Button
              onClick={onClose}
              className="w-full rounded-2xl text-xs font-bold h-10"
            >
              Done & Return to Residence Portal
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
