"use client";

import React, { useState } from "react";
import { X, BookOpen, CheckCircle2, Sparkles } from "lucide-react";
import { ThesisBindingOrder, ThesisCoverType } from "@/types";

interface ThesisBindingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (order: ThesisBindingOrder) => void;
}

export function ThesisBindingModal({
  isOpen,
  onClose,
  onSuccess,
}: ThesisBindingModalProps) {
  const [scholarName, setScholarName] = useState("Aarav Sharma");
  const [scholarId, setScholarId] = useState("SCH-CS-2023-019");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [thesisTitle, setThesisTitle] = useState("");
  const [degreeProgram, setDegreeProgram] = useState("B.Tech in Artificial Intelligence");
  const [coverType, setCoverType] = useState<ThesisCoverType>("Hardcover Royal Navy (Gold Foil)");
  const [copies, setCopies] = useState(3);
  const [embossingText, setEmbossingText] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("2026-10-15");
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<ThesisBindingOrder | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/printing/thesis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scholar_name: scholarName,
          scholar_id: scholarId,
          department,
          thesis_title: thesisTitle,
          degree_program: degreeProgram,
          cover_type: coverType,
          copies_requested: copies,
          embossing_text: embossingText || `${thesisTitle} • ${scholarName} • 2026`,
          target_delivery_date: deliveryDate,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setPlacedOrder(json.data);
        onSuccess(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {placedOrder ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Thesis Hardbound Order Queued!</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Your binding order and gold embossing specifications have been sent to Central Binding Works.
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left space-y-2 mb-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Order Docket:</span>
                <span className="font-mono font-bold text-cyan-400">{placedOrder.order_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cover Finish:</span>
                <span className="font-semibold text-amber-300">{placedOrder.cover_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Delivery Target:</span>
                <span className="text-white font-medium">{placedOrder.target_delivery_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Fee:</span>
                <span className="font-bold text-emerald-400 text-sm">₹{placedOrder.total_fee_inr}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setPlacedOrder(null);
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
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Hardcover Thesis & Binding Desk</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Order institutional gold-embossed hardbound copies for final university degree deposition.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Dissertation / Thesis Title</label>
                <input
                  type="text"
                  required
                  value={thesisTitle}
                  onChange={(e) => setThesisTitle(e.target.value)}
                  placeholder="e.g. Neuromorphic Vision Transformers for Edge Drones"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Academic Department</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Degree Program</label>
                  <input
                    type="text"
                    required
                    value={degreeProgram}
                    onChange={(e) => setDegreeProgram(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Cover Finish</label>
                  <select
                    value={coverType}
                    onChange={(e) => setCoverType(e.target.value as ThesisCoverType)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Hardcover Royal Navy (Gold Foil)">Hardcover Royal Navy (Gold Foil)</option>
                    <option value="Hardcover Emerald Green (Silver Foil)">Hardcover Emerald Green (Silver Foil)</option>
                    <option value="Deluxe Leatherette Archival">Deluxe Leatherette Archival</option>
                    <option value="Softcover Spiral Binding">Softcover Spiral Binding</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Copies Required</label>
                  <select
                    value={copies}
                    onChange={(e) => setCopies(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value={2}>2 Copies (Library + Dept)</option>
                    <option value={3}>3 Copies (Library + Guide + Personal)</option>
                    <option value={4}>4 Copies (Standard Doctoral)</option>
                    <option value={5}>5 Copies</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Spine Gold Embossing Text</label>
                <input
                  type="text"
                  value={embossingText}
                  onChange={(e) => setEmbossingText(e.target.value)}
                  placeholder="e.g. APEX INSTITUTE • NEUROMORPHIC VISION • AARAV SHARMA • 2026"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
                />
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
                  {loading ? "Ordering..." : "Order Hardbound Thesis"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
