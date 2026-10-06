"use client";

import React, { useState } from "react";
import { CounselingSession, CounselingSessionType, CounselingMode } from "@/types";
import { X, HeartHandshake, ShieldCheck, CheckCircle2, Lock, Sparkles } from "lucide-react";

interface BookSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionBooked: (session: CounselingSession) => void;
}

export function BookSessionModal({
  isOpen,
  onClose,
  onSessionBooked,
}: BookSessionModalProps) {
  const [counselorName, setCounselorName] = useState("Dr. Ananya Sen, Ph.D.");
  const [specialization, setSpecialization] = useState(
    "Clinical Psychologist & Cognitive Behavioral Therapy (CBT)"
  );
  const [sessionType, setSessionType] = useState<CounselingSessionType>(
    "One-on-One Tele-Therapy"
  );
  const [mode, setMode] = useState<CounselingMode>("Confidential Video Call");
  const [scheduledDate, setScheduledDate] = useState("2026-10-14");
  const [scheduledSlot, setScheduledSlot] = useState("15:00 - 16:00 IST");
  const [loading, setLoading] = useState(false);
  const [confirmedSession, setConfirmedSession] = useState<CounselingSession | null>(null);

  if (!isOpen) return null;

  const handleCounselorChange = (name: string) => {
    setCounselorName(name);
    if (name.includes("Ananya")) {
      setSpecialization("Clinical Psychologist & Cognitive Behavioral Therapy (CBT)");
    } else if (name.includes("Rajesh")) {
      setSpecialization("Academic Anxiety, Imposter Syndrome & Peak Performance");
    } else {
      setSpecialization("Psychiatry & Holistic Sleep Wellness");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/counseling/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          counselor_name: counselorName,
          counselor_specialization: specialization,
          session_type: sessionType,
          mode,
          scheduled_date: scheduledDate,
          scheduled_time_slot: scheduledSlot,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setConfirmedSession(data.data);
        onSessionBooked(data.data);
      }
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAll = () => {
    setConfirmedSession(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleCloseAll}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedSession ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              Confidential Session Confirmed!
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Your appointment is secured with end-to-end encryption.
            </p>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left space-y-2 mb-6">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Booking Reference:</span>
                <span className="font-mono font-bold text-violet-300">
                  {confirmedSession.session_code}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Counselor:</span>
                <span className="font-semibold text-slate-200">
                  {confirmedSession.counselor_name}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Session Mode:</span>
                <span className="text-violet-300 font-medium">
                  {confirmedSession.mode}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Date & Slot:</span>
                <span className="text-slate-200">
                  {confirmedSession.scheduled_date} • {confirmedSession.scheduled_time_slot}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Encrypted Access Key
                </span>
                <span className="font-mono text-slate-400">
                  {confirmedSession.access_pass_token}
                </span>
              </div>
            </div>

            <button
              onClick={handleCloseAll}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/25 transition-all"
            >
              Done & Return to Wellness Hub
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Schedule Confidential Consultation
                </h2>
                <p className="text-xs text-slate-400">
                  100% private, non-judgmental professional psychological counseling
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/20 flex items-center gap-2 text-xs text-violet-300">
              <Lock className="w-4 h-4 text-violet-400 shrink-0" />
              <span>
                Protected under statutory medical privacy. Session notes are never shared with academic departments or placement officers.
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Select Clinical Counselor
              </label>
              <select
                value={counselorName}
                onChange={(e) => handleCounselorChange(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
              >
                <option value="Dr. Ananya Sen, Ph.D.">
                  Dr. Ananya Sen, Ph.D. (Cognitive Behavioral Therapy & General Anxiety)
                </option>
                <option value="Prof. Rajesh Kulkarni, M.Phil.">
                  Prof. Rajesh Kulkarni, M.Phil. (Academic Anxiety, Imposter Syndrome & Performance)
                </option>
                <option value="Dr. Shalini Deshmukh, MD">
                  Dr. Shalini Deshmukh, MD (Psychiatry, Sleep Hygiene & Stress Management)
                </option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Session Type
                </label>
                <select
                  value={sessionType}
                  onChange={(e) =>
                    setSessionType(e.target.value as CounselingSessionType)
                  }
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                >
                  <option value="One-on-One Tele-Therapy">One-on-One Tele-Therapy</option>
                  <option value="In-Person Clinic Visit">In-Person Clinic Visit</option>
                  <option value="Stress & Academic Anxiety">Stress & Academic Anxiety</option>
                  <option value="Urgent Crisis Counseling">Urgent Crisis Counseling</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Consultation Mode
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as CounselingMode)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                >
                  <option value="Confidential Video Call">Confidential Video Call</option>
                  <option value="Infirmary Wellness Suite">Infirmary Wellness Suite</option>
                  <option value="Anonymous Voice Line">Anonymous Voice Line</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Time Slot
                </label>
                <select
                  value={scheduledSlot}
                  onChange={(e) => setScheduledSlot(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                >
                  <option value="10:00 - 11:00 IST">10:00 - 11:00 IST</option>
                  <option value="11:30 - 12:30 IST">11:30 - 12:30 IST</option>
                  <option value="14:00 - 15:00 IST">14:00 - 15:00 IST</option>
                  <option value="15:00 - 16:00 IST">15:00 - 16:00 IST</option>
                  <option value="16:30 - 17:30 IST">16:30 - 17:30 IST</option>
                  <option value="18:00 - 19:00 IST">18:00 - 19:00 IST (Evening)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseAll}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {loading ? (
                  "Confirming..."
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" /> Confirm Appointment
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
