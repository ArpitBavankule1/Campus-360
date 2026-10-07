"use client";

import React, { useState } from "react";
import { CampusTourBooking, CampusTourMode } from "@/types";
import {
  X,
  Compass,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Video,
  User,
  Mail,
  Phone,
  Users,
} from "lucide-react";

interface BookTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingCreated: (booking: CampusTourBooking) => void;
}

export function BookTourModal({
  isOpen,
  onClose,
  onBookingCreated,
}: BookTourModalProps) {
  const [candidateName, setCandidateName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("2026-10-24");
  const [timeSlot, setTimeSlot] = useState("11:00 AM - 12:30 PM");
  const [tourMode, setTourMode] = useState<CampusTourMode>(
    "In-Person Welcome Center"
  );
  const [guestsCount, setGuestsCount] = useState("2");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<CampusTourBooking | null>(
    null
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admissions/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_name: candidateName,
          email,
          phone,
          preferred_date: preferredDate,
          time_slot: timeSlot,
          tour_mode: tourMode,
          assigned_counselor: "Prof. Sudhir Rao (Dean Admissions)",
          guests_count: parseInt(guestsCount, 10) || 2,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setCreatedBooking(data.data);
        onBookingCreated(data.data);
      }
    } catch (err) {
      console.error("Failed to book campus visit", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setCreatedBooking(null);
    setCandidateName("");
    setEmail("");
    setPhone("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 shadow-2xl">
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {createdBooking ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Campus Visit Confirmed!
            </h2>
            <p className="text-sm text-slate-300 mb-6">
              Your appointment with the Admissions Counselor has been scheduled.
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 mb-6 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Appointment Code:</span>
                <span className="font-mono font-bold text-teal-400">
                  {createdBooking.booking_code}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Mode:</span>
                <span className="text-white font-medium">{createdBooking.tour_mode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Scheduled Date & Time:</span>
                <span className="text-white font-mono">
                  {createdBooking.preferred_date} • {createdBooking.time_slot}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Assigned Counselor:</span>
                <span className="text-slate-200">{createdBooking.assigned_counselor}</span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-colors"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Campus Visit & Counselor Desk</h2>
                <p className="text-xs text-teal-300/80">Guided tour of labs, smart hostels & studios</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Visitor Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="e.g. Ananya Iyer & Parents"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="visitor@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Phone *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98000 00000"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tour Mode</label>
                  <select
                    value={tourMode}
                    onChange={(e) => setTourMode(e.target.value as CampusTourMode)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="In-Person Welcome Center">In-Person Welcome Center</option>
                    <option value="Virtual 360 Video Tour">Virtual 360 Video Tour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Guests Count</label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Time Window</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="09:30 AM - 11:00 AM">09:30 AM - 11:00 AM</option>
                    <option value="11:00 AM - 12:30 PM">11:00 AM - 12:30 PM</option>
                    <option value="02:30 PM - 04:00 PM">02:30 PM - 04:00 PM</option>
                    <option value="04:00 PM - 05:30 PM">04:00 PM - 05:30 PM</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-semibold shadow-md shadow-teal-600/20 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? "Confirming Visit..." : "Schedule Campus Visit"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
