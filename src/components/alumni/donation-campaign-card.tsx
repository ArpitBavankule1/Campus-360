"use client";

import React, { useState } from "react";
import { DonationCampaign } from "@/types";
import {
  Heart,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DonationCampaignCardProps {
  campaignId: DonationCampaign;
  title: string;
  categoryName: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  donorCount: number;
  onDonate: (campaignId: DonationCampaign, amount: number) => void;
}

export function DonationCampaignCard({
  campaignId,
  title,
  categoryName,
  description,
  targetAmount,
  raisedAmount,
  donorCount,
  onDonate,
}: DonationCampaignCardProps) {
  const [customAmount, setCustomAmount] = useState<string>("5000");
  const percent = Math.min(100, Math.round((raisedAmount / targetAmount) * 100));

  const presetAmounts = [2500, 5000, 25000, 50000];

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm space-y-4 transition-all hover:border-primary/40 hover:shadow-md flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              {categoryName}
            </span>
            <h4 className="text-base font-bold text-foreground mt-1.5">{title}</h4>
          </div>
          <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <Heart className="w-5 h-5 fill-current" />
          </div>
        </div>

        <p className="text-xs text-muted-foreground/90 leading-relaxed">
          {description}
        </p>

        {/* Progress Bar & Metrics */}
        <div className="space-y-2 p-3.5 rounded-2xl bg-muted/40 border border-border/50">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground">
              ₹{raisedAmount.toLocaleString("en-IN")}
            </span>
            <span className="text-muted-foreground">
              Target: ₹{targetAmount.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
            <span className="text-primary font-semibold">{percent}% Funded</span>
            <span>{donorCount} Benefactors</span>
          </div>
        </div>

        {/* Amount Presets */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-muted-foreground">
            Select Contribution Tier
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {presetAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setCustomAmount(amt.toString())}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                  customAmount === amt.toString()
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 border-border text-foreground hover:bg-muted"
                }`}
              >
                ₹{amt >= 1000 ? `${amt / 1000}k` : amt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Donate Action */}
      <div className="pt-3 border-t border-border/50 flex gap-2">
        <Button
          size="sm"
          className="w-full rounded-xl text-xs gap-1.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white border-0"
          onClick={() => onDonate(campaignId, Number(customAmount) || 5000)}
        >
          <Gift className="w-3.5 h-3.5" />
          Pledge ₹{Number(customAmount || 5000).toLocaleString("en-IN")}
        </Button>
      </div>
    </div>
  );
}
