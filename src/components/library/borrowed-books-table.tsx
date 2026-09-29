"use client";

import React, { useState } from "react";
import { LibraryBorrowRecord } from "@/types";
import {
  Calendar,
  RotateCw,
  QrCode,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  BookMarked,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BorrowedBooksTableProps {
  records: LibraryBorrowRecord[];
  onRenewLoan: (loanId: string) => Promise<void>;
  onViewPass: (record: LibraryBorrowRecord) => void;
}

export function BorrowedBooksTable({
  records,
  onRenewLoan,
  onViewPass,
}: BorrowedBooksTableProps) {
  const [renewingId, setRenewingId] = useState<string | null>(null);

  const handleRenew = async (loanId: string) => {
    try {
      setRenewingId(loanId);
      await onRenewLoan(loanId);
    } finally {
      setRenewingId(null);
    }
  };

  if (records.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center bg-card">
        <BookMarked className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
        <h4 className="font-bold text-foreground text-base">No Borrowed Books Found</h4>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
          You currently have no active physical book loans from the Vikram Sarabhai Central Library.
          Browse the catalog to check out books.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Book Details</th>
              <th className="py-3.5 px-4">Borrow Pass Code</th>
              <th className="py-3.5 px-4">Dates & Deadlines</th>
              <th className="py-3.5 px-4">Renewals</th>
              <th className="py-3.5 px-4">Status & Fine</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {records.map((rec) => {
              const isOverdue = rec.status === "overdue";
              const isReturned = rec.status === "returned";
              const canRenew =
                rec.status === "active" &&
                rec.renewal_count < rec.max_renewals &&
                rec.fine_amount === 0;

              const dueDateObj = new Date(rec.due_date);
              const formattedDueDate = dueDateObj.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              const formattedBorrowDate = new Date(rec.borrowed_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              });

              return (
                <tr
                  key={rec.id}
                  className={`hover:bg-muted/20 transition-colors ${
                    isOverdue ? "bg-amber-500/[0.03]" : ""
                  }`}
                >
                  {/* Book details */}
                  <td className="py-4 px-4 max-w-xs">
                    <div className="font-bold text-foreground line-clamp-1 text-sm">
                      {rec.book?.title || "Unknown Book Title"}
                    </div>
                    <div className="text-muted-foreground text-[11px] mt-0.5 line-clamp-1">
                      {rec.book?.author || "Author Unspecified"}
                    </div>
                    <div className="text-[10px] text-primary/80 font-mono mt-1">
                      {rec.book?.call_number} • {rec.book?.shelf_location}
                    </div>
                  </td>

                  {/* Pass code */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="font-mono text-xs font-bold px-2 py-1 rounded-md bg-muted text-foreground border border-border/50">
                      {rec.borrow_pass_code}
                    </span>
                  </td>

                  {/* Dates */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span>Issued: {formattedBorrowDate}</span>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 font-semibold text-xs mt-1 ${
                        isOverdue
                          ? "text-red-600 dark:text-red-400"
                          : "text-foreground"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>Due: {formattedDueDate}</span>
                    </div>
                  </td>

                  {/* Renewals */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="text-xs font-medium text-foreground">
                      {rec.renewal_count} / {rec.max_renewals}
                    </span>
                    <p className="text-[10px] text-muted-foreground">extensions used</p>
                  </td>

                  {/* Status & Fine */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {isReturned ? (
                      <Badge className="bg-muted text-muted-foreground border-border/40 text-[11px]">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" />
                        Returned
                      </Badge>
                    ) : isOverdue ? (
                      <div>
                        <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 text-[11px]">
                          <AlertTriangle className="w-3 h-3 mr-1 text-red-500" />
                          Overdue
                        </Badge>
                        <p className="text-[11px] font-bold text-red-600 dark:text-red-400 mt-1">
                          Fine: ₹{rec.fine_amount.toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[11px]">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" />
                        Active Loan
                      </Badge>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewPass(rec)}
                        className="rounded-xl h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                        title="View Digital Borrow Pass"
                      >
                        <QrCode className="w-3.5 h-3.5 mr-1" />
                        Pass
                      </Button>

                      {!isReturned && (
                        <Button
                          size="sm"
                          disabled={!canRenew || renewingId === rec.id}
                          onClick={() => handleRenew(rec.id)}
                          className="rounded-xl h-8 px-3 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs"
                        >
                          {renewingId === rec.id ? (
                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          ) : (
                            <RotateCw className="w-3 h-3 mr-1" />
                          )}
                          Renew (+14d)
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
