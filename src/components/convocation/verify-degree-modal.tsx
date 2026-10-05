"use client";

import React, { useState } from "react";
import { X, ShieldCheck, Building2, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { DegreeCredential } from "@/types";

interface VerifyDegreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCredential?: DegreeCredential | null;
}

export function VerifyDegreeModal({
  isOpen,
  onClose,
  initialCredential,
}: VerifyDegreeModalProps) {
  const [credentialCode, setCredentialCode] = useState(
    initialCredential ? initialCredential.credential_code : "CL-DEG-2026-9041"
  );
  const [requesterOrg, setRequesterOrg] = useState("Google DeepMind Talent Verification");
  const [requesterEmail, setRequesterEmail] = useState("verification@deepmind.com");
  const [purpose, setPurpose] = useState("Pre-Employment Background Verification");
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  if (!isOpen) return null;

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/convocation/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credential_code: credentialCode,
          requester_organization: requesterOrg,
          requester_contact_email: requesterEmail,
          verification_purpose: purpose,
        }),
      });

      const json = await res.json();
      setVerificationResult(json);
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

        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">Cryptographic Degree Verification Gateway</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Instant background verification against the immutable Apex Academic Ledger.
        </p>

        {verificationResult ? (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                verificationResult.matchedRecord
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-400"
              }`}
            >
              {verificationResult.matchedRecord ? (
                <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-bold text-sm text-white">
                  {verificationResult.matchedRecord
                    ? "Cryptographically Authentic & Verified"
                    : "Unverified / Record Under Audit"}
                </h4>
                <p className="text-xs mt-1 text-slate-300">
                  {verificationResult.message}
                </p>
              </div>
            </div>

            {verificationResult.matchedRecord && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Scholar Name:</span>
                  <span className="font-bold text-white">{verificationResult.matchedRecord.scholar_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Degree & Major:</span>
                  <span className="font-semibold text-slate-200">
                    {verificationResult.matchedRecord.degree_type} ({verificationResult.matchedRecord.department})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">CGPA / Honours:</span>
                  <span className="font-semibold text-emerald-400">
                    {verificationResult.matchedRecord.cgpa} / 10.0 • {verificationResult.matchedRecord.honors_classification}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Conferred Date:</span>
                  <span className="text-slate-300">
                    {new Date(verificationResult.matchedRecord.conferred_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-500 block mb-0.5 text-[10px]">Verification Audit Code:</span>
                  <span className="font-mono text-indigo-400 font-semibold">{verificationResult.data.verification_code}</span>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setVerificationResult(null);
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Credential Code to Verify
              </label>
              <input
                type="text"
                required
                value={credentialCode}
                onChange={(e) => setCredentialCode(e.target.value)}
                placeholder="e.g. CL-DEG-2026-9041"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Requesting Employer / Institution
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={requesterOrg}
                  onChange={(e) => setRequesterOrg(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Official Contact Email
                </label>
                <input
                  type="email"
                  required
                  value={requesterEmail}
                  onChange={(e) => setRequesterEmail(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Verification Purpose
                </label>
                <input
                  type="text"
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <FileText className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                All verifications generate a cryptographically logged audit trail signed by the Office of the Controller of Examinations.
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
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Validate Credential"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
