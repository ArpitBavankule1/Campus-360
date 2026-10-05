"use client";

import React, { useState } from "react";
import {
  Printer,
  BookOpen,
  CreditCard,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  Plus,
} from "lucide-react";
import {
  MOCK_PRINT_STATIONS,
  MOCK_STUDENT_PRINT_WALLET,
  MOCK_PRINT_JOBS,
  MOCK_THESIS_BINDING_ORDERS,
  calculatePrintingOverview,
} from "@/lib/printing/printing-engine";
import { PrintStation, PrintJob, ThesisBindingOrder } from "@/types";
import { PrintStationCard } from "@/components/printing/print-station-card";
import { ThesisBindingCard } from "@/components/printing/thesis-binding-card";
import { SubmitPrintModal } from "@/components/printing/submit-print-modal";
import { ThesisBindingModal } from "@/components/printing/thesis-binding-modal";

export default function PrintingPortalPage() {
  const [stations] = useState<PrintStation[]>(MOCK_PRINT_STATIONS);
  const [wallet, setWallet] = useState(MOCK_STUDENT_PRINT_WALLET);
  const [jobs, setJobs] = useState<PrintJob[]>(MOCK_PRINT_JOBS);
  const [thesisOrders, setThesisOrders] = useState<ThesisBindingOrder[]>(MOCK_THESIS_BINDING_ORDERS);

  const [activeTab, setActiveTab] = useState<"kiosks" | "jobs" | "thesis">("kiosks");
  const [selectedStation, setSelectedStation] = useState<PrintStation | null>(null);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isThesisOpen, setIsThesisOpen] = useState(false);

  const stats = calculatePrintingOverview(stations, wallet, jobs, thesisOrders);

  async function handleTopup() {
    try {
      const res = await fetch("/api/printing/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topup_amount_inr: 100 }),
      });
      const json = await res.json();
      if (json.success) {
        setWallet(json.data);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
            <Printer className="w-3.5 h-3.5" />
            Phase 40 • Cloud Printing, Xerox & Thesis Binding Hub
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Smart Cloud Printing & Thesis Desk
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Distributed campus smart kiosk spooling, 500-page semester quota ledger, and institutional gold-foil thesis binding.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsThesisOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            Hardcover Binding Order
          </button>
          <button
            onClick={() => {
              setSelectedStation(null);
              setIsPrintOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Spool Cloud Document
          </button>
        </div>
      </div>

      {/* Student Quota & Wallet Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 via-slate-900/60 to-slate-900/90 p-6 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                Semester Free Print Quota
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">{wallet.free_pages_remaining}</span>
                <span className="text-xs text-slate-400">/ {wallet.semester_free_quota_pages} pages remaining</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Free duplex monochrome printing allocated to {wallet.scholar_name} ({wallet.scholar_id}).
              </p>
            </div>

            <div className="w-full sm:w-48">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Usage</span>
                <span className="font-bold text-white">
                  {Math.round(((wallet.semester_free_quota_pages - wallet.free_pages_remaining) / wallet.semester_free_quota_pages) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                  style={{
                    width: `${((wallet.semester_free_quota_pages - wallet.free_pages_remaining) / wallet.semester_free_quota_pages) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              Prepaid Print Balance
            </div>
            <div className="text-3xl font-black text-emerald-400">
              ₹{wallet.wallet_balance_inr.toFixed(2)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              For high-res color pages and hardcover binding services.
            </p>
          </div>

          <button
            onClick={handleTopup}
            className="mt-3 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Recharge ₹100
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-sm">
        <button
          onClick={() => setActiveTab("kiosks")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "kiosks"
              ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          Campus Smart Kiosks ({stations.length})
        </button>
        <button
          onClick={() => setActiveTab("jobs")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "jobs"
              ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          My Print Queue ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab("thesis")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "thesis"
              ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          Thesis & Binding Orders ({thesisOrders.length})
        </button>
      </div>

      {/* Tab 1: Kiosks */}
      {activeTab === "kiosks" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stations.map((station) => (
            <PrintStationCard
              key={station.id}
              station={station}
              onPrintHere={(stn) => {
                setSelectedStation(stn);
                setIsPrintOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Tab 2: Jobs */}
      {activeTab === "jobs" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {job.job_code}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {job.status}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white">{job.document_name}</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Release PIN</div>
                    <div className="font-mono font-bold text-cyan-400 text-lg">{job.release_pin}</div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <div>Pickup Kiosk: <strong className="text-slate-200">{job.pickup_kiosk_name}</strong></div>
                  <div>Format: <strong className="text-slate-200">{job.page_count} Pages • {job.color_mode} • {job.duplex_mode}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Thesis */}
      {activeTab === "thesis" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {thesisOrders.map((order) => (
            <ThesisBindingCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* Modals */}
      <SubmitPrintModal
        isOpen={isPrintOpen}
        onClose={() => {
          setIsPrintOpen(false);
          setSelectedStation(null);
        }}
        stations={stations}
        selectedStation={selectedStation}
        onSuccess={(newJob) => {
          setJobs((prev) => [newJob, ...prev]);
          setWallet((prev) => ({
            ...prev,
            free_pages_remaining: Math.max(0, prev.free_pages_remaining - newJob.page_count),
          }));
        }}
      />

      <ThesisBindingModal
        isOpen={isThesisOpen}
        onClose={() => setIsThesisOpen(false)}
        onSuccess={(newOrder) => {
          setThesisOrders((prev) => [newOrder, ...prev]);
        }}
      />
    </div>
  );
}
