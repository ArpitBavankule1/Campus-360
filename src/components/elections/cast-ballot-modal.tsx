"use client";

import React, { useState } from "react";
import { X, Vote, CheckCircle2, ShieldCheck, Lock } from "lucide-react";
import { ElectionCandidate, BallotVote } from "@/types";
import { QRCodeSVG } from "qrcode.react";

interface CastBallotModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: ElectionCandidate | null;
  onSuccess: (ballot: BallotVote) => void;
}

export function CastBallotModal({
  isOpen,
  onClose,
  candidate,
  onSuccess,
}: CastBallotModalProps) {
  const [scholarId, setScholarId] = useState("SCH-CS-2023-019");
  const [voterToken, setVoterToken] = useState("ZKP-VOTE-TOKEN-90812");
  const [loading, setLoading] = useState(false);
  const [ballotReceipt, setBallotReceipt] = useState<BallotVote | null>(null);

  if (!isOpen || !candidate) return null;

  async function handleVote(e: React.FormEvent) {
    e.preventDefault();
    if (!candidate) return;
    setLoading(true);

    try {
      const res = await fetch("/api/elections/cast-vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_id: candidate.id,
          post_contested: candidate.post_contested,
          cryptographic_token_hash: voterToken,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setBallotReceipt(json.data);
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

        {ballotReceipt ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Ballot Successfully Cast!</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Your vote has been cryptographically recorded in the anonymous tally docket.
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left space-y-2 mb-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Ballot Receipt Code:</span>
                <span className="font-mono font-bold text-violet-400">{ballotReceipt.ballot_receipt_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Contested Post:</span>
                <span className="font-semibold text-white">{ballotReceipt.post_contested}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Anonymized Hash:</span>
                <span className="font-mono text-emerald-400">{ballotReceipt.cryptographic_token_hash}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cast Timestamp:</span>
                <span className="text-slate-300">{new Date(ballotReceipt.cast_timestamp).toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="flex justify-center p-3 bg-white rounded-xl mb-4 w-fit mx-auto">
              <QRCodeSVG value={ballotReceipt.ballot_receipt_code} size={90} />
            </div>

            <button
              onClick={() => {
                setBallotReceipt(null);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Vote className="w-5 h-5 text-violet-400" />
              <h3 className="text-lg font-bold text-white">Zero-Knowledge Anonymous E-Voting Booth</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Confirm your candidate selection for the Gymkhana Council election.
            </p>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 mb-4">
              <span className="text-[10px] font-semibold text-violet-400 uppercase tracking-wider block mb-1">
                Candidate Selected
              </span>
              <div className="text-base font-bold text-white">{candidate.candidate_name}</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Contesting for: <strong className="text-violet-300">{candidate.post_contested}</strong> • {candidate.department}
              </div>
            </div>

            <form onSubmit={handleVote} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Voter Scholar Roll ID
                </label>
                <input
                  type="text"
                  required
                  value={scholarId}
                  onChange={(e) => setScholarId(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Cryptographic Blind Token
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={voterToken}
                    onChange={(e) => setVoterToken(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="bg-violet-950/30 border border-violet-800/40 p-3 rounded-xl text-[11px] text-violet-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <span>
                  Ballots are blinded using zero-knowledge proofs. Neither the election commissioner nor server administrators can tie this ballot to your identity.
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
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/30 transition-all disabled:opacity-50"
                >
                  {loading ? "Recording Ballot..." : "Submit Confidential Ballot"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
