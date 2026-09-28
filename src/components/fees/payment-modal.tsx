"use client";

import React, { useState } from "react";
import { StudentFeeDue, PaymentMethod } from "@/types";
import {
  X,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface PaymentModalProps {
  due: StudentFeeDue;
  onClose: () => void;
  onSuccess: (paymentData: {
    fee_due_id: string;
    amount: number;
    payment_method: PaymentMethod;
    upi_id?: string;
  }) => Promise<void>;
}

export function PaymentModal({ due, onClose, onSuccess }: PaymentModalProps) {
  const balance = Math.max(0, due.amount_due + (due.penalty_amount || 0) - due.amount_paid);
  const [amount, setAmount] = useState<number>(balance);
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [upiId, setUpiId] = useState("arjun.sharma@okaxis");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 9012");
  const [processing, setProcessing] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (amount <= 0 || amount > balance) return;

    setProcessing(true);
    try {
      // Simulate real bank gateway handshake (1.2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 1200));
      await onSuccess({
        fee_due_id: due.id,
        amount,
        payment_method: method,
        upi_id: method === "upi" ? upiId : undefined,
      });
      onClose();
    } finally {
      setProcessing(false);
    }
  }

  const paymentUPIString = `upi://pay?pa=campuslens.finance@hdfcbank&pn=ApexInstitute&am=${amount}&cu=INR&tn=${encodeURIComponent(due.title)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-border/80 bg-card p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Secure Fee Payment Gateway
            </span>
            <h3 className="text-lg font-black text-foreground mt-0.5">
              {due.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Section */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Outstanding Balance:</span>
            <span className="font-bold text-foreground">₹{balance.toLocaleString()}</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Amount to Remit (INR):
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-muted-foreground font-bold text-sm">
                ₹
              </span>
              <input
                type="number"
                min={100}
                max={balance}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2 rounded-xl bg-card border border-border/60 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Payment Method Switcher */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-foreground">
            Select Payment Method:
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setMethod("upi")}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 font-semibold transition-all ${
                method === "upi"
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-muted/20 border-border/40 text-muted-foreground hover:bg-muted/40"
              }`}
            >
              <QrCode className="w-5 h-5" />
              <span>UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod("credit_card")}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 font-semibold transition-all ${
                method === "credit_card"
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-muted/20 border-border/40 text-muted-foreground hover:bg-muted/40"
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span>Cards</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod("net_banking")}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 font-semibold transition-all ${
                method === "net_banking"
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-muted/20 border-border/40 text-muted-foreground hover:bg-muted/40"
              }`}
            >
              <Building className="w-5 h-5" />
              <span>NetBanking</span>
            </button>
          </div>
        </div>

        {/* Method Specific UI */}
        {method === "upi" ? (
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-muted/20 border border-border/40 space-y-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <QRCodeSVG value={paymentUPIString} size={130} />
            </div>
            <p className="text-[11px] text-muted-foreground text-center">
              Scan with GPay, PhonePe, or Paytm to complete instant verification
            </p>
            <input
              type="text"
              placeholder="Or enter UPI ID (e.g. name@okhdfcbank)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-card border border-border/60 text-foreground"
            />
          </div>
        ) : null}

        {method === "credit_card" ? (
          <div className="space-y-2 p-3 rounded-xl bg-muted/20 border border-border/40 text-xs">
            <div>
              <span className="text-muted-foreground">Card Number:</span>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 rounded-lg bg-card border border-border/60 text-foreground font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-muted-foreground">Expiry:</span>
                <input
                  type="text"
                  defaultValue="08/28"
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-card border border-border/60 text-foreground"
                />
              </div>
              <div>
                <span className="text-muted-foreground">CVV:</span>
                <input
                  type="password"
                  defaultValue="•••"
                  className="w-full mt-1 px-3 py-1.5 rounded-lg bg-card border border-border/60 text-foreground font-mono"
                />
              </div>
            </div>
          </div>
        ) : null}

        {method === "net_banking" ? (
          <div className="p-3 rounded-xl bg-muted/20 border border-border/40 text-xs space-y-2">
            <span className="text-muted-foreground">Select Accredited Bank:</span>
            <select className="w-full px-3 py-2 rounded-lg bg-card border border-border/60 text-foreground">
              <option>HDFC Bank Institutional Gateway</option>
              <option>State Bank of India (SBI)</option>
              <option>ICICI Corporate Banking</option>
              <option>Axis Bank Education Portal</option>
            </select>
          </div>
        ) : null}

        {/* Security Assurance */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            256-Bit SSL Encrypted Transaction
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            PCI-DSS Level 1
          </span>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={processing || amount <= 0 || amount > balance}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md disabled:opacity-50"
        >
          {processing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              <span>Authorizing Transaction...</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span>Authorize Remittance of ₹{amount.toLocaleString()}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
