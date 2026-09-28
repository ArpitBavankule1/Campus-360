"use client";

import React from "react";
import { StudentFeeDue } from "@/types";
import {
  GraduationCap,
  Building,
  BookOpen,
  FileText,
  Cpu,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  Calendar,
} from "lucide-react";

interface FeeDuesTableProps {
  dues: StudentFeeDue[];
  onOpenPaymentModal: (due: StudentFeeDue) => void;
}

export function FeeDuesTable({ dues, onOpenPaymentModal }: FeeDuesTableProps) {
  const categoryIcons: Record<string, React.ReactNode> = {
    tuition: <GraduationCap className="w-4 h-4 text-blue-500" />,
    hostel: <Building className="w-4 h-4 text-amber-500" />,
    library: <BookOpen className="w-4 h-4 text-purple-500" />,
    examination: <FileText className="w-4 h-4 text-emerald-500" />,
    lab_equipment: <Cpu className="w-4 h-4 text-cyan-500" />,
  };

  const statusBadges: Record<string, { label: string; class: string }> = {
    paid: {
      label: "Fully Paid",
      class: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    partially_paid: {
      label: "Partially Paid",
      class: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    pending: {
      label: "Pending",
      class: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    overdue: {
      label: "Overdue",
      class: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    },
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden shadow-sm">
      <div className="p-5 border-b border-border/60 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Current Semester Assessed Dues & Accounts
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Institutional ledger of semester tuition, lab fees, examination charges, and residential dues.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/40 border-b border-border/50 text-muted-foreground uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Fee Head & Category</th>
              <th className="py-3 px-4">Semester</th>
              <th className="py-3 px-4 text-right">Assessed Amount</th>
              <th className="py-3 px-4 text-right">Amount Paid</th>
              <th className="py-3 px-4 text-right">Balance Due</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {dues.map((due) => {
              const balance = Math.max(0, due.amount_due + (due.penalty_amount || 0) - due.amount_paid);
              const isPaid = due.status === "paid";
              const dueDateObj = new Date(due.due_date);
              const formattedDate = dueDateObj.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <tr key={due.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-muted/60 border border-border/40">
                        {categoryIcons[due.category] || <FileText className="w-4 h-4 text-primary" />}
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-sm">{due.title}</div>
                        <div className="text-[11px] text-muted-foreground capitalize">
                          {due.category.replace("_", " ")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-foreground">
                    {due.semester}
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-foreground">
                    ₹{due.amount_due.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-emerald-600 dark:text-emerald-400">
                    ₹{due.amount_paid.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-foreground">
                    {balance > 0 ? (
                      <span className="text-amber-500">₹{balance.toLocaleString()}</span>
                    ) : (
                      <span className="text-muted-foreground">₹0</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {formattedDate}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${
                        statusBadges[due.status]?.class || "bg-muted text-muted-foreground"
                      }`}
                    >
                      {statusBadges[due.status]?.label || due.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {isPaid ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Settled
                      </span>
                    ) : (
                      <button
                        onClick={() => onOpenPaymentModal(due)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        Pay Online
                      </button>
                    )}
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
