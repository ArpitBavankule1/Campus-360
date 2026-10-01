"use client";

import React, { useState } from "react";
import { AlumniProfile, MentorshipTopic } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Video,
  Sparkles,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  Building2,
} from "lucide-react";

interface MentorshipBookingModalProps {
  alumni: AlumniProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (sessionData: any) => void;
}

export function MentorshipBookingModal({
  alumni,
  isOpen,
  onClose,
  onSuccess,
}: MentorshipBookingModalProps) {
  const [topic, setTopic] = useState<MentorshipTopic>("resume_review");
  const [date, setDate] = useState("2026-10-10");
  const [timeSlot, setTimeSlot] = useState("16:00");
  const [notes, setNotes] = useState("");
  const [studentName, setStudentName] = useState("Arpit Bavankule");
  const [studentEmail, setStudentEmail] = useState("arpit.student@campuslens.edu");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!alumni) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const scheduledAt = new Date(`${date}T${timeSlot}:00`).toISOString();
      const res = await fetch("/api/alumni/mentorship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alumni_id: alumni.id,
          student_id: "usr-student-001",
          student_name: studentName,
          student_email: studentEmail,
          topic,
          scheduled_at: scheduledAt,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to confirm session.");
      }

      onSuccess(data.data);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to book mentorship.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-3xl p-6 bg-card border-border/80 shadow-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Book 1-on-1 Mentorship
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Connect directly with {alumni.full_name} ({alumni.company})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Mentor summary banner */}
        <div className="p-3.5 rounded-2xl bg-muted/50 border border-border/60 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            {alumni.avatar_url ? (
              <img
                src={alumni.avatar_url}
                alt={alumni.full_name}
                className="w-9 h-9 rounded-xl object-cover border border-border"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                {alumni.full_name[0]}
              </div>
            )}
            <div>
              <p className="font-semibold text-foreground">{alumni.full_name}</p>
              <p className="text-[11px] text-muted-foreground">
                {alumni.current_role} at {alumni.company}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            45 Min Google Meet
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Mentorship Focus Area
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value as MentorshipTopic)}
              className="w-full text-xs rounded-xl border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="resume_review">📄 Industry CV & Resume Critique</option>
              <option value="mock_interview">🎯 Technical & Behavioral Mock Interview</option>
              <option value="career_guidance">🧭 Career Roadmap & Tech Transitions</option>
              <option value="phd_advice">🎓 Graduate School & PhD Application Advice</option>
              <option value="startup_mentorship">🚀 Startup Pitch & Product Ideation</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Preferred Date
              </label>
              <input
                type="date"
                value={date}
                min="2026-10-02"
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs rounded-xl border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full text-xs rounded-xl border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="15:00">03:00 PM - 03:45 PM IST</option>
                <option value="16:00">04:00 PM - 04:45 PM IST</option>
                <option value="17:00">05:00 PM - 05:45 PM IST</option>
                <option value="18:30">06:30 PM - 07:15 PM IST</option>
                <option value="20:00">08:00 PM - 08:45 PM IST</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Preparation Notes & Questions for Mentor
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What specific questions, projects, or portfolios would you like to discuss?"
              className="w-full text-xs rounded-xl border border-input bg-background p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="rounded-xl text-xs gap-1.5"
            >
              {loading ? "Scheduling..." : "Confirm & Send Calendar Invite"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
