"use client";

import React, { useState } from "react";
import { X, UserPlus, CheckCircle2 } from "lucide-react";
import { ElectionCandidate, ElectionPost } from "@/types";

interface NominateCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (candidate: ElectionCandidate) => void;
}

export function NominateCandidateModal({
  isOpen,
  onClose,
  onSuccess,
}: NominateCandidateModalProps) {
  const [candidateName, setCandidateName] = useState("");
  const [scholarId, setScholarId] = useState("");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [yearOfStudy, setYearOfStudy] = useState(3);
  const [postContested, setPostContested] = useState<ElectionPost>("President");
  const [campaignTagline, setCampaignTagline] = useState("");
  const [manifestoSlogan, setManifestoSlogan] = useState("");
  const [initiatives, setInitiatives] = useState("24x7 Innovation Labs\nTransparent Council Budgets\nCampus EV Shuttles");
  const [loading, setLoading] = useState(false);
  const [nominated, setNominated] = useState<ElectionCandidate | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/elections/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_name: candidateName,
          scholar_id: scholarId,
          department,
          year_of_study: yearOfStudy,
          post_contested: postContested,
          campaign_tagline: campaignTagline,
          manifesto_slogan: manifestoSlogan,
          key_initiatives: initiatives.split("\n").filter((i) => i.trim().length > 0),
        }),
      });

      const json = await res.json();
      if (json.success) {
        setNominated(json.data);
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

        {nominated ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Nomination Docket Vetted & Filed!</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Your candidacy has been submitted to the Chief Election Officer for scrutiny.
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left space-y-2 mb-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Candidate:</span>
                <span className="font-bold text-white">{nominated.candidate_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Post Contested:</span>
                <span className="font-bold text-violet-400">{nominated.post_contested}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-semibold text-emerald-400">{nominated.approval_status}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setNominated(null);
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
              <UserPlus className="w-5 h-5 text-violet-400" />
              <h3 className="text-lg font-bold text-white">Student Council Candidate Nomination</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              File official candidacy papers and manifesto pillars for the 2026 Gymkhana Elections.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Candidate Name"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Roll ID</label>
                  <input
                    type="text"
                    required
                    value={scholarId}
                    onChange={(e) => setScholarId(e.target.value)}
                    placeholder="e.g. SCH-CS-2023-019"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Post Contested</label>
                  <select
                    value={postContested}
                    onChange={(e) => setPostContested(e.target.value as ElectionPost)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="President">President</option>
                    <option value="Vice President">Vice President</option>
                    <option value="General Secretary Academic">Gen Sec Academic</option>
                    <option value="General Secretary Cultural">Gen Sec Cultural</option>
                    <option value="General Secretary Sports">Gen Sec Sports</option>
                    <option value="General Secretary Technical">Gen Sec Technical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Campaign Tagline</label>
                <input
                  type="text"
                  required
                  value={campaignTagline}
                  onChange={(e) => setCampaignTagline(e.target.value)}
                  placeholder="e.g. Empowering Every Scholar's Voice"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Manifesto Slogan</label>
                <input
                  type="text"
                  required
                  value={manifestoSlogan}
                  onChange={(e) => setManifestoSlogan(e.target.value)}
                  placeholder="e.g. Transparent Governance & 24x7 Innovation"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Key Initiatives (one per line)</label>
                <textarea
                  rows={2}
                  value={initiatives}
                  onChange={(e) => setInitiatives(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 resize-none"
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
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/30 transition-all disabled:opacity-50"
                >
                  {loading ? "Filing..." : "Submit Candidate Nomination"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
