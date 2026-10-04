"use client";

import React, { useState } from "react";
import { DiningWallet } from "@/types";
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
import { Wallet, QrCode, CheckCircle2 } from "lucide-react";

interface WalletTopupModalProps {
  wallet: DiningWallet;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedWallet: DiningWallet) => void;
}

export function WalletTopupModal({
  wallet,
  isOpen,
  onClose,
  onSuccess,
}: WalletTopupModalProps) {
  const [amount, setAmount] = useState("500");
  const [autoReload, setAutoReload] = useState(wallet.auto_reload_enabled);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/cafeteria/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topupAmount: Number(amount),
          autoReload,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message);
        onSuccess(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccessMsg(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border-border/80">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Wallet className="h-5 w-5 text-amber-500" />
            Dining Smart Wallet Top-Up
          </DialogTitle>
          <DialogDescription>
            Current Balance: ₹{wallet.wallet_balance_inr.toFixed(2)} • Monthly Subsidy: ₹{wallet.monthly_subsidy_inr.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        {successMsg ? (
          <div className="space-y-4 py-3 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
            <p className="text-sm font-semibold text-foreground">{successMsg}</p>
            <div className="rounded-lg bg-muted/60 p-3 text-xs font-mono">
              <QrCode className="h-4 w-4 text-amber-500 mx-auto mb-1" />
              <span>Token: {wallet.qr_payment_token}</span>
            </div>
            <Button onClick={handleClose} className="w-full bg-amber-600 hover:bg-amber-500 text-white">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleTopup} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs">Quick Amounts</Label>
              <div className="grid grid-cols-3 gap-2">
                {["200", "500", "1000"].map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant={amount === preset ? "default" : "outline"}
                    onClick={() => setAmount(preset)}
                    className={amount === preset ? "bg-amber-600 text-white text-xs" : "text-xs"}
                  >
                    +₹{preset}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Custom Recharge Amount (₹)</Label>
              <Input
                type="number"
                min="50"
                max="10000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                id="autoReload"
                checked={autoReload}
                onChange={(e) => setAutoReload(e.target.checked)}
                className="rounded border-input text-amber-600"
              />
              <label htmlFor="autoReload" className="cursor-pointer">
                Auto-reload ₹500 when balance falls below ₹100
              </label>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !amount}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white mt-2"
            >
              {isSubmitting ? "Processing Recharge..." : `Recharge ₹${amount}`}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
