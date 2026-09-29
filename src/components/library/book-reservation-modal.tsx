"use client";

import React from "react";
import { LibraryBorrowRecord, LibraryReservation } from "@/types";
import {
  X,
  BookOpen,
  MapPin,
  Calendar,
  ShieldCheck,
  Tag,
  Printer,
  Copy,
  Check,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";

interface BookPassModalProps {
  item: LibraryBorrowRecord | LibraryReservation;
  type: "borrow" | "reservation";
  onClose: () => void;
}

export function BookReservationModal({ item, type, onClose }: BookPassModalProps) {
  const [copied, setCopied] = React.useState(false);

  const isBorrow = type === "borrow";
  const record = item as LibraryBorrowRecord;
  const reservation = item as LibraryReservation;

  const code = isBorrow ? record.borrow_pass_code : reservation.reservation_code;
  const book = isBorrow ? record.book : reservation.book;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-border/80 bg-card p-6 shadow-2xl transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="p-2 rounded-xl bg-primary/10 text-primary">
            <BookOpen className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-bold text-foreground text-base">
              {isBorrow ? "Digital Circulation Pass" : "Hold & Reservation Voucher"}
            </h3>
            <p className="text-xs text-muted-foreground">
              Vikram Sarabhai Central Library Commons
            </p>
          </div>
        </div>

        {/* Institutional Verification Card */}
        <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-card via-muted/20 to-primary/5 p-5 flex flex-col items-center text-center">
          {/* QR Code */}
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-border/40">
            <QRCodeSVG
              value={`https://campuslens.ai/library/verify?code=${code}`}
              size={130}
              level="H"
              includeMargin={false}
            />
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="font-mono text-sm font-black tracking-wider text-foreground">
              {code}
            </span>
            <button
              onClick={handleCopy}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
              title="Copy voucher code"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>RFID Registry Verified • Apex Institute</span>
          </div>

          {/* Title & Details */}
          <div className="w-full text-left mt-4 pt-4 border-t border-border/50 text-xs space-y-2">
            <div>
              <p className="text-[11px] text-muted-foreground">Title</p>
              <p className="font-bold text-foreground text-sm line-clamp-1">
                {book?.title || "Academic Volume"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-[11px] text-muted-foreground">Author</p>
                <p className="font-medium text-foreground truncate">{book?.author || "N/A"}</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">ISBN</p>
                <p className="font-mono text-foreground truncate">{book?.isbn || "N/A"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">{book?.shelf_location || "Central Stacks"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground justify-end font-mono">
                <Tag className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="truncate">{book?.call_number || "REF-001"}</span>
              </div>
            </div>

            {isBorrow ? (
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary text-xs flex items-center justify-between mt-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5" /> Due Date:
                </span>
                <span className="font-bold">
                  {new Date(record.due_date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs flex items-center justify-between mt-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5" /> Hold Expires:
                </span>
                <span className="font-bold">
                  {reservation.expires_at
                    ? new Date(reservation.expires_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "7 days from hold"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="rounded-xl text-xs h-9 text-muted-foreground hover:text-foreground flex-1"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Print Voucher
          </Button>
          <Button
            onClick={onClose}
            className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9 flex-1 shadow-xs"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
