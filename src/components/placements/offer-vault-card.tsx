"use client";

import React, { useState } from "react";
import { PlacementOffer } from "@/types";
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Building2,
  FileCheck,
  TrendingUp,
  Gift,
} from "lucide-react";

interface OfferVaultCardProps {
  offers: PlacementOffer[];
  onUpdateStatus: (offerId: string, status: "accepted" | "declined") => Promise<void>;
}

export function OfferVaultCard({ offers, onUpdateStatus }: OfferVaultCardProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleAction(offerId: string, status: "accepted" | "declined") {
    setLoadingId(offerId);
    try {
      await onUpdateStatus(offerId, status);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-500" />
            Official Offer Letters Vault ({offers.length})
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verified institutional letters of intent, employment contracts, and compensation packages.
          </p>
        </div>
      </div>

      {offers.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-2xl bg-card/40 text-muted-foreground">
          No offer letters extended yet. Continue applying to active drives!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {offers.map((offer) => {
            const validDate = new Date(offer.valid_until);
            const isPending = offer.acceptance_status === "pending";
            const isAccepted = offer.acceptance_status === "accepted";
            const isDeclined = offer.acceptance_status === "declined";

            return (
              <div
                key={offer.id}
                className="rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card/80 to-emerald-500/5 p-6 backdrop-blur-md shadow-sm space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground">{offer.company_name}</h4>
                      <p className="text-xs text-muted-foreground font-medium">{offer.role_title}</p>
                    </div>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full border font-bold capitalize ${
                      isAccepted
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : isDeclined
                        ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    }`}
                  >
                    {offer.acceptance_status}
                  </span>
                </div>

                {/* Compensation Package Details */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-muted/40 border border-border/40 text-xs">
                  <div>
                    <span className="text-muted-foreground flex items-center gap-1 font-medium">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Annual CTC
                    </span>
                    <div className="text-xl font-black text-foreground mt-0.5">
                      ₹{offer.offered_ctc_lpa} <span className="text-xs font-bold text-muted-foreground">LPA</span>
                    </div>
                  </div>
                  {offer.bonus_joining ? (
                    <div>
                      <span className="text-muted-foreground flex items-center gap-1 font-medium">
                        <Gift className="w-3.5 h-3.5 text-purple-500" /> Joining Bonus
                      </span>
                      <div className="text-xl font-black text-foreground mt-0.5">
                        ₹{(offer.bonus_joining / 100000).toFixed(1)} <span className="text-xs font-bold text-muted-foreground">Lakhs</span>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Validity */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    Valid until: {validDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  {offer.offer_letter_url ? (
                    <button
                      onClick={() => alert(`Downloading verified offer letter for ${offer.company_name}...`)}
                      className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF Letter
                    </button>
                  ) : null}
                </div>

                {/* Decision Action Buttons */}
                {isPending ? (
                  <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                    <button
                      onClick={() => handleAction(offer.id, "accepted")}
                      disabled={loadingId === offer.id}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Accept Offer
                    </button>
                    <button
                      onClick={() => handleAction(offer.id, "declined")}
                      disabled={loadingId === offer.id}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/30 text-rose-500 font-bold text-xs hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      Decline
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-primary" />
                    <span>
                      Decision recorded: You have {offer.acceptance_status} this placement offer.
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
