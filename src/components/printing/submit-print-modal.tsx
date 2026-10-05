"use client";

import React, { useState } from "react";
import { X, Printer, CheckCircle2, KeyRound } from "lucide-react";
import { PrintJob, PrintStation, PrintColorMode, PrintDuplexMode } from "@/types";
import { QRCodeSVG } from "qrcode.react";

interface SubmitPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  stations: PrintStation[];
  selectedStation?: PrintStation | null;
  onSuccess: (job: PrintJob) => void;
}

export function SubmitPrintModal({
  isOpen,
  onClose,
  stations,
  selectedStation,
  onSuccess,
}: SubmitPrintModalProps) {
  const [docName, setDocName] = useState("Final_Project_Report.pdf");
  const [pageCount, setPageCount] = useState(15);
  const [colorMode, setColorMode] = useState<PrintColorMode>("Monochrome B&W");
  const [duplexMode, setDuplexMode] = useState<PrintDuplexMode>("Double-Sided Duplex");
  const [kioskName, setKioskName] = useState(
    selectedStation ? selectedStation.kiosk_name : stations[0]?.kiosk_name || ""
  );
  const [loading, setLoading] = useState(false);
  const [createdJob, setCreatedJob] = useState<PrintJob | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/printing/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_name: docName,
          page_count: pageCount,
          color_mode: colorMode,
          duplex_mode: duplexMode,
          pickup_kiosk_name: kioskName,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setCreatedJob(json.data);
        onSuccess(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const estimatedCost = colorMode === "High-Res Color" ? pageCount * 2.0 : 0.0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {createdJob ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Print Job Spooled to Cloud!</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Walk to the designated kiosk and punch in your release PIN or scan the QR code.
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left space-y-2 mb-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Release PIN:</span>
                <span className="font-mono text-xl font-black text-cyan-400 tracking-wider flex items-center gap-1">
                  <KeyRound className="w-4 h-4 text-cyan-400" />
                  {createdJob.release_pin}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Job Code:</span>
                <span className="font-mono text-slate-200 font-semibold">{createdJob.job_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Station:</span>
                <span className="text-white font-medium line-clamp-1">{createdJob.pickup_kiosk_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Specifications:</span>
                <span className="text-slate-300">
                  {createdJob.page_count} Pages • {createdJob.color_mode} • {createdJob.duplex_mode}
                </span>
              </div>
            </div>

            <div className="flex justify-center p-3 bg-white rounded-xl mb-4 w-fit mx-auto">
              <QRCodeSVG value={createdJob.release_token_hash} size={90} />
            </div>

            <button
              onClick={() => {
                setCreatedJob(null);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Printer className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Cloud Print Job Submission</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Send PDF documents to any high-speed campus kiosk with encrypted contactless release.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Document File Name</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Page Count</label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    required
                    value={pageCount}
                    onChange={(e) => setPageCount(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Color Palette</label>
                  <select
                    value={colorMode}
                    onChange={(e) => setColorMode(e.target.value as PrintColorMode)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Monochrome B&W">Monochrome B&W (Free Quota)</option>
                    <option value="High-Res Color">High-Res Color (₹2.00 / page)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Duplex Layout</label>
                  <select
                    value={duplexMode}
                    onChange={(e) => setDuplexMode(e.target.value as PrintDuplexMode)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Double-Sided Duplex">Double-Sided (Save Paper)</option>
                    <option value="Single-Sided">Single-Sided</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Pickup Smart Kiosk</label>
                  <select
                    value={kioskName}
                    onChange={(e) => setKioskName(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    {stations.map((stn) => (
                      <option key={stn.id} value={stn.kiosk_name}>
                        {stn.kiosk_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                <span className="text-slate-400">Total Print Cost:</span>
                <span className="text-sm font-bold text-white">
                  {estimatedCost === 0 ? "₹0.00 (Covered by Free Quota)" : `₹${estimatedCost.toFixed(2)}`}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/30 transition-all disabled:opacity-50"
                >
                  {loading ? "Spooled..." : "Spool Print Job"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
