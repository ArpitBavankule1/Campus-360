"use client";

import React from "react";
import { FeeTransaction } from "@/types";
import {
  Receipt,
  Download,
  Printer,
  CheckCircle2,
  Calendar,
  CreditCard,
  Building,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface DigitalReceiptCardProps {
  transactions: FeeTransaction[];
}

export function DigitalReceiptCard({ transactions }: DigitalReceiptCardProps) {
  function handlePrintReceipt(tx: FeeTransaction) {
    alert(`Generating printable institutional voucher for ${tx.receipt_number}...`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-500" />
            Verified Digital Fee Receipts ({transactions.length})
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tamper-proof digital vouchers with institutional QR verification stamps.
          </p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-2xl bg-card/40 text-muted-foreground">
          No payment transactions found on record.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {transactions.map((tx) => {
            const dateObj = new Date(tx.payment_date);
            const dateStr = dateObj.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const timeStr = dateObj.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={tx.id}
                className="rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card/90 to-emerald-500/5 p-6 backdrop-blur-md shadow-sm space-y-4 relative overflow-hidden"
              >
                {/* Official Institutional Watermark Top Bar */}
                <div className="flex items-start justify-between gap-4 border-b border-border/50 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Institutional E-Receipt
                    </span>
                    <h4 className="text-base font-black text-foreground mt-0.5 font-mono">
                      {tx.receipt_number}
                    </h4>
                  </div>
                  <div className="p-1.5 bg-white rounded-xl shadow-xs">
                    <QRCodeSVG value={`https://campuslens.edu/verify/receipt/${tx.receipt_number}`} size={42} />
                  </div>
                </div>

                {/* Main Content */}
                <div className="space-y-2">
                  <div className="text-sm font-bold text-foreground">
                    {tx.fee_title || "Semester Tuition / Dues Settlement"}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>
                      <span>Transaction Ref:</span>
                      <div className="font-mono text-foreground font-semibold text-[11px] truncate">
                        {tx.transaction_ref}
                      </div>
                    </div>
                    <div>
                      <span>Method:</span>
                      <div className="text-foreground font-semibold capitalize">
                        {tx.payment_method.replace("_", " ")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remittance Amount Banner */}
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Settled Amount
                  </span>
                  <div className="text-xl font-black text-foreground">
                    ₹{tx.amount_paid.toLocaleString()}
                  </div>
                </div>

                {/* Footer Timestamps and Actions */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>{dateStr} • {timeStr}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePrintReceipt(tx)}
                      className="inline-flex items-center gap-1 text-primary hover:underline font-bold"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => handlePrintReceipt(tx)}
                      className="inline-flex items-center gap-1 text-primary hover:underline font-bold"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
