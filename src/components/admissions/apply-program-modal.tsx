"use client";

import React, { useState } from "react";
import { AcademicProgram, AdmissionApplication, QuotaCategory } from "@/types";
import {
  X,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  User,
  Mail,
  Phone,
  Award,
  BookOpen,
} from "lucide-react";

interface ApplyProgramModalProps {
  program: AcademicProgram | null;
  isOpen: boolean;
  onClose: () => void;
  onApplicationCreated: (app: AdmissionApplication) => void;
}

const QUOTA_CATEGORIES: QuotaCategory[] = [
  "All India Open (General)",
  "OBC-NCL",
  "SC",
  "ST",
  "EWS",
  "Defense & PwD",
  "Supernumerary International",
];

export function ApplyProgramModal({
  program,
  isOpen,
  onClose,
  onApplicationCreated,
}: ApplyProgramModalProps) {
  const [candidateName, setCandidateName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [quotaCategory, setQuotaCategory] = useState<QuotaCategory>(
    "All India Open (General)"
  );
  const [entranceExam, setEntranceExam] = useState("National Entrance Examination 2026");
  const [entranceScoreRank, setEntranceScoreRank] = useState("Score 94.5 (Rank 1240)");
  const [qualifyingPercentage, setQualifyingPercentage] = useState("92.5");
  const [sop, setSop] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdApp, setCreatedApp] = useState<AdmissionApplication | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !program) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admissions/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_name: candidateName,
          email,
          phone,
          program_code: program.program_code,
          program_name: program.program_name,
          quota_category: quotaCategory,
          entrance_exam: entranceExam,
          entrance_score_rank: entranceScoreRank,
          qualifying_percentage: parseFloat(qualifyingPercentage) || 90.0,
          statement_of_purpose: sop || "Passionate scholar focused on academic excellence.",
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setCreatedApp(data.data);
        onApplicationCreated(data.data);
      }
    } catch (err) {
      console.error("Failed to submit admission application", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (createdApp) {
      navigator.clipboard.writeText(createdApp.application_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleResetAndClose = () => {
    setCreatedApp(null);
    setCandidateName("");
    setEmail("");
    setPhone("");
    setSop("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 shadow-2xl">
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {createdApp ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Application Successfully Submitted!
            </h2>
            <p className="text-sm text-slate-300 mb-6 max-w-md mx-auto">
              Your application for{" "}
              <strong className="text-white">{createdApp.program_name}</strong> has
              been registered in the admissions evaluation ledger.
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 max-w-md mx-auto mb-6 text-left space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Application Reference ID:</span>
                <span className="font-mono font-bold text-blue-400">
                  {createdApp.application_number}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Candidate Name:</span>
                <span className="text-white font-medium">{createdApp.candidate_name}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Category / Quota:</span>
                <span className="text-purple-300">{createdApp.quota_category}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Application Fee:</span>
                <span className="text-emerald-400 font-semibold">Exempted / Paid (₹0 Online)</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied ID" : "Copy Application ID"}
              </button>
              <button
                onClick={handleResetAndClose}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Online Program Application</h2>
                <p className="text-xs text-blue-300/80">Academic Year 2026-2027 Admissions</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 mb-5">
              <div className="text-xs font-semibold text-white">{program.program_name}</div>
              <div className="text-[11px] text-slate-400">
                {program.degree_level} • {program.duration_years} Years • Code: {program.program_code}
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Candidate Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="scholar@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Mobile Contact *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98000 00000"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Quota / Reservation Category
                  </label>
                  <select
                    value={quotaCategory}
                    onChange={(e) => setQuotaCategory(e.target.value as QuotaCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {QUOTA_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Qualifying Aggregate %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={qualifyingPercentage}
                    onChange={(e) => setQualifyingPercentage(e.target.value)}
                    placeholder="92.5"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Entrance Exam Taken
                  </label>
                  <input
                    type="text"
                    value={entranceExam}
                    onChange={(e) => setEntranceExam(e.target.value)}
                    placeholder="JEE / GATE / CAT / Apex CET"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Score / All India Rank
                  </label>
                  <input
                    type="text"
                    value={entranceScoreRank}
                    onChange={(e) => setEntranceScoreRank(e.target.value)}
                    placeholder="e.g. AIR 1240 / 97.2 Percentile"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Statement of Academic Purpose (Optional)
                </label>
                <textarea
                  rows={3}
                  value={sop}
                  onChange={(e) => setSop(e.target.value)}
                  placeholder="Outline your research interests, career aspirations, and motivations..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
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
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? "Submitting Application..." : "Submit Application"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
