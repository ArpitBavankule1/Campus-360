"use client";

import React, { useState } from "react";
import { X, GraduationCap, CheckCircle2, Ticket } from "lucide-react";
import { ConvocationRegistration, GownSize } from "@/types";
import { QRCodeSVG } from "qrcode.react";

interface RegisterConvocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (reg: ConvocationRegistration) => void;
}

export function RegisterConvocationModal({
  isOpen,
  onClose,
  onSuccess,
}: RegisterConvocationModalProps) {
  const [scholarName, setScholarName] = useState("Aarav Sharma");
  const [scholarId, setScholarId] = useState("SCH-CS-2022-019");
  const [degreeAwarded, setDegreeAwarded] = useState("Bachelor of Technology");
  const [gownSize, setGownSize] = useState<GownSize>("Large (L)");
  const [guestCount, setGuestCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const [registeredDocket, setRegisteredDocket] = useState<ConvocationRegistration | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/convocation/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scholar_name: scholarName,
          scholar_id: scholarId,
          degree_awarded: degreeAwarded,
          gown_size: gownSize,
          guest_pass_count: guestCount,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setRegisteredDocket(json.data);
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

        {registeredDocket ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Convocation Seat & Regalia Confirmed!</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Your official academic regalia docket and admittance pass are generated.
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left space-y-2 mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Admittance Pass:</span>
                <span className="font-mono font-bold text-indigo-400">{registeredDocket.admittance_pass_code}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Allocated Seat:</span>
                <span className="font-bold text-white">{registeredDocket.allocated_seat_number}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Regalia Robe Size:</span>
                <span className="font-semibold text-amber-400">{registeredDocket.gown_size}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Guest Passes:</span>
                <span className="font-semibold text-slate-200">{registeredDocket.guest_pass_count} Guest Seats</span>
              </div>
            </div>

            <div className="flex justify-center p-3 bg-white rounded-xl mb-4 w-fit mx-auto">
              <QRCodeSVG value={registeredDocket.admittance_pass_code} size={96} />
            </div>

            <button
              onClick={() => {
                setRegisteredDocket(null);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">Convocation Registration & Regalia Desk</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Reserve your ceremonial gown, guest tickets, and auditorium seat for the 32nd Convocation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Graduating Scholar</label>
                  <input
                    type="text"
                    required
                    value={scholarName}
                    onChange={(e) => setScholarName(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Scholar Roll ID</label>
                  <input
                    type="text"
                    required
                    value={scholarId}
                    onChange={(e) => setScholarId(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Degree Program</label>
                <select
                  value={degreeAwarded}
                  onChange={(e) => setDegreeAwarded(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Bachelor of Technology">Bachelor of Technology (B.Tech)</option>
                  <option value="Master of Technology">Master of Technology (M.Tech)</option>
                  <option value="Doctor of Philosophy">Doctor of Philosophy (Ph.D.)</option>
                  <option value="Master of Business Admin">Master of Business Admin (MBA)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Ceremonial Gown Size</label>
                  <select
                    value={gownSize}
                    onChange={(e) => setGownSize(e.target.value as GownSize)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Small (S)">Small (S) - 5'0" to 5'4"</option>
                    <option value="Medium (M)">Medium (M) - 5'5" to 5'8"</option>
                    <option value="Large (L)">Large (L) - 5'9" to 6'0"</option>
                    <option value="Extra Large (XL)">Extra Large (XL) - 6'1"+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Guest Seats (Family)</label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value={1}>1 Guest Pass</option>
                    <option value={2}>2 Guest Passes (Recommended)</option>
                    <option value={3}>3 Guest Passes</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                <div className="font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                  <Ticket className="w-3.5 h-3.5 text-indigo-400" />
                  Regalia Distribution Notice
                </div>
                Gowns and stoles can be collected from Central Auditorium Counter 4 starting 8:00 AM on ceremony day with this registration QR.
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
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                >
                  {loading ? "Registering..." : "Confirm Convocation Registration"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
