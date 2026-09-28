"use client";

import React, { useState } from "react";
import {
  StudentFeeDue,
  FeeTransaction,
  ScholarshipProgram,
  ScholarshipApplication,
  PaymentMethod,
} from "@/types";
import {
  MOCK_STUDENT_FEE_DUES,
  MOCK_FEE_TRANSACTIONS,
  MOCK_SCHOLARSHIPS,
  MOCK_SCHOLARSHIP_APPLICATIONS,
  MOCK_INSTITUTIONAL_FEE_STATS,
  calculateStudentFeeSummary,
  generateReceiptNumber,
} from "@/lib/fees/fee-engine";
import { FeeSummaryCards } from "@/components/fees/fee-summary-cards";
import { FeeDuesTable } from "@/components/fees/fee-dues-table";
import { PaymentModal } from "@/components/fees/payment-modal";
import { DigitalReceiptCard } from "@/components/fees/digital-receipt-card";
import { ScholarshipCard } from "@/components/fees/scholarship-card";
import {
  CreditCard,
  Receipt,
  Award,
  PieChart,
  Sparkles,
  CheckCircle2,
  X,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default function FeesPortalPage() {
  const [activeTab, setActiveTab] = useState<"dues" | "receipts" | "scholarships" | "analytics">("dues");

  // State
  const [dues, setDues] = useState<StudentFeeDue[]>(MOCK_STUDENT_FEE_DUES);
  const [transactions, setTransactions] = useState<FeeTransaction[]>(MOCK_FEE_TRANSACTIONS);
  const [scholarships] = useState<ScholarshipProgram[]>(MOCK_SCHOLARSHIPS);
  const [myScholarshipApps, setMyScholarshipApps] = useState<ScholarshipApplication[]>(MOCK_SCHOLARSHIP_APPLICATIONS);

  // Active Payment Modal Target
  const [payingDue, setPayingDue] = useState<StudentFeeDue | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const studentCgpa = 8.85;
  const studentIncome = 450000;

  const summary = calculateStudentFeeSummary(dues);

  // Process simulated payment
  async function handleProcessPayment(data: {
    fee_due_id: string;
    amount: number;
    payment_method: PaymentMethod;
    upi_id?: string;
  }) {
    const target = dues.find((d) => d.id === data.fee_due_id);
    if (!target) return;

    const receiptNum = generateReceiptNumber(target.category);
    const newTx: FeeTransaction = {
      id: `tx-${Date.now()}`,
      fee_due_id: target.id,
      student_id: target.student_id,
      college_id: target.college_id,
      transaction_ref: `TXN-${data.payment_method.toUpperCase()}-${Date.now().toString().slice(-6)}`,
      payment_method: data.payment_method,
      amount_paid: data.amount,
      payment_date: new Date().toISOString(),
      receipt_number: receiptNum,
      status: "success",
      fee_title: target.title,
      category: target.category,
      gateway_response_id: `rzp_live_${Math.random().toString(36).slice(2, 9)}`,
    };

    // Update dues
    setDues((prev) =>
      prev.map((d) => {
        if (d.id === target.id) {
          const newPaid = d.amount_paid + data.amount;
          const isComplete = newPaid >= d.amount_due + (d.penalty_amount || 0);
          return {
            ...d,
            amount_paid: newPaid,
            status: isComplete ? "paid" : "partially_paid",
          };
        }
        return d;
      })
    );

    setTransactions([newTx, ...transactions]);
    setToastMessage(`Payment of ₹${data.amount.toLocaleString()} settled! Receipt: ${receiptNum}`);
    setTimeout(() => setToastMessage(null), 5000);
  }

  // Handle scholarship application
  async function handleApplyScholarship(scholarshipId: string) {
    const sch = scholarships.find((s) => s.id === scholarshipId);
    if (!sch) return;

    const newApp: ScholarshipApplication = {
      id: `sapp-${Date.now()}`,
      scholarship_id: sch.id,
      student_id: "usr-demo-01",
      college_id: sch.college_id,
      applied_at: new Date().toISOString(),
      status: "submitted",
      disbursed_amount: 0,
      notes: "Application submitted via CampusLens portal with verified academic transcripts.",
      scholarship: sch,
    };

    setMyScholarshipApps([newApp, ...myScholarshipApps]);
    setToastMessage(`🎉 Application for ${sch.title} submitted successfully!`);
    setTimeout(() => setToastMessage(null), 5000);
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Toast Notification */}
      {toastMessage ? (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-card border border-primary/40 text-foreground px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-muted-foreground hover:text-foreground ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : null}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" /> Phase 21
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              Institutional Bursar & Financial Accounts
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground mt-1">
            Student Fee Portal & Digital Payments
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Settle semester tuition dues, download verified digital e-receipts, check exam clearance, and apply for academic scholarships.
          </p>
        </div>

        {/* Status Chip */}
        <div className="flex items-center gap-3 bg-card/60 border border-border/60 p-3.5 rounded-2xl backdrop-blur-sm">
          <div className="text-right px-2">
            <div className="text-xs text-muted-foreground font-medium">Exam Admit Clearance</div>
            <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
              <ShieldCheck className="w-4 h-4" />
              {summary.feeClearanceStatus ? "APPROVED" : "PENDING"}
            </div>
          </div>
          <div className="h-8 w-px bg-border/60" />
          <div className="text-right px-2">
            <div className="text-xs text-muted-foreground font-medium">Outstanding</div>
            <div className="text-base font-black text-amber-500">
              ₹{summary.outstandingBalance.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Top Financial Standing Cards */}
      <FeeSummaryCards summary={summary} />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("dues")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "dues"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Semester Dues & Fee Heads ({dues.length})
        </button>

        <button
          onClick={() => setActiveTab("receipts")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "receipts"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Receipt className="w-4 h-4" />
          Transaction History & E-Receipts ({transactions.length})
        </button>

        <button
          onClick={() => setActiveTab("scholarships")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "scholarships"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Award className="w-4 h-4" />
          Scholarships & Financial Aid ({scholarships.length})
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "analytics"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <PieChart className="w-4 h-4" />
          Institutional Revenue & Audit
        </button>
      </div>

      {/* Tab 1: Semester Dues */}
      {activeTab === "dues" ? (
        <FeeDuesTable
          dues={dues}
          onOpenPaymentModal={(due) => setPayingDue(due)}
        />
      ) : null}

      {/* Tab 2: Receipts */}
      {activeTab === "receipts" ? (
        <DigitalReceiptCard transactions={transactions} />
      ) : null}

      {/* Tab 3: Scholarships */}
      {activeTab === "scholarships" ? (
        <ScholarshipCard
          scholarships={scholarships}
          myApplications={myScholarshipApps}
          studentCgpa={studentCgpa}
          studentIncome={studentIncome}
          onApplyScholarship={handleApplyScholarship}
        />
      ) : null}

      {/* Tab 4: Institutional Analytics */}
      {activeTab === "analytics" ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-border/60">
              <span className="text-xs text-muted-foreground font-semibold uppercase">
                Expected Campus Revenue
              </span>
              <div className="text-2xl font-black text-foreground mt-1">
                ₹{(MOCK_INSTITUTIONAL_FEE_STATS.totalExpectedRevenue / 10000000).toFixed(2)} Crores
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/60">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                Collected To Date
              </span>
              <div className="text-2xl font-black text-foreground mt-1">
                ₹{(MOCK_INSTITUTIONAL_FEE_STATS.totalCollectedRevenue / 10000000).toFixed(2)} Crores
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Collection rate: {MOCK_INSTITUTIONAL_FEE_STATS.overallCollectionPercentage}%
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border/60">
              <span className="text-xs text-amber-500 font-semibold uppercase">
                Outstanding Balance
              </span>
              <div className="text-2xl font-black text-foreground mt-1">
                ₹{(MOCK_INSTITUTIONAL_FEE_STATS.totalOutstandingRevenue / 100000).toFixed(1)} Lakhs
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Across {MOCK_INSTITUTIONAL_FEE_STATS.totalStudentsPending} student accounts
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/60 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Fee Collection by Category
            </h3>
            <div className="space-y-3">
              {MOCK_INSTITUTIONAL_FEE_STATS.categoryBreakdown.map((item) => {
                const total = item.collected + item.pending;
                const percentage = Math.round((item.collected / total) * 100);

                return (
                  <div key={item.category} className="space-y-1 text-xs">
                    <div className="flex justify-between font-medium">
                      <span className="capitalize text-foreground font-bold">
                        {item.category.replace("_", " ")}
                      </span>
                      <span className="text-muted-foreground">
                        ₹{(item.collected / 100000).toFixed(1)}L / ₹{(total / 100000).toFixed(1)}L ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted/60 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {/* Payment Gateway Modal */}
      {payingDue ? (
        <PaymentModal
          due={payingDue}
          onClose={() => setPayingDue(null)}
          onSuccess={handleProcessPayment}
        />
      ) : null}
    </div>
  );
}
