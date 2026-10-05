"use client";

import React from "react";
import { DegreeCredential } from "@/types";
import { Award, ShieldCheck, GraduationCap, FileCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface DegreeCredentialCardProps {
  credential: DegreeCredential;
  onVerify?: (credential: DegreeCredential) => void;
}

export function DegreeCredentialCard({
  credential,
  onVerify,
}: DegreeCredentialCardProps) {
  const isGoldMedalist =
    credential.honors_classification === "Dean's Gold Medalist" ||
    credential.honors_classification === "Chancellor's Citation";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border backdrop-blur-md p-6 transition-all duration-300 hover:shadow-xl ${
        isGoldMedalist
          ? "border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-amber-950/5 to-slate-900/60 shadow-amber-500/5"
          : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
      }`}
    >
      {/* Top Banner & Status */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl border ${
              isGoldMedalist
                ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
            }`}
          >
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                {credential.credential_code}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                  isGoldMedalist
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                {credential.credential_status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              {credential.scholar_name}
            </h3>
            <p className="text-xs text-slate-400">ID: {credential.scholar_id}</p>
          </div>
        </div>

        {/* QR Code preview */}
        <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-200">
          <QRCodeSVG value={`https://campuslens.ai/verify?code=${credential.credential_code}`} size={56} />
        </div>
      </div>

      {/* Degree & Honors Details */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80 text-xs">
          <span className="text-slate-400">Degree Conferred</span>
          <span className="font-semibold text-slate-200">{credential.degree_type}</span>
        </div>
        <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80 text-xs">
          <span className="text-slate-400">Academic Dept</span>
          <span className="font-medium text-slate-300">{credential.department}</span>
        </div>
        <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80 text-xs">
          <span className="text-slate-400">Graduation Class</span>
          <span className="font-semibold text-indigo-400">{credential.graduation_year}</span>
        </div>
        <div className="flex items-center justify-between py-1.5 text-xs">
          <span className="text-slate-400">Cumulative CGPA</span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-emerald-400">{credential.cgpa} / 10.0</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                isGoldMedalist
                  ? "bg-amber-400 text-slate-950 flex items-center gap-0.5"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              {isGoldMedalist && <Award className="w-3 h-3" />}
              {credential.honors_classification}
            </span>
          </div>
        </div>
      </div>

      {/* Cryptographic SHA-256 Hash Seal */}
      <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 mb-4">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
          <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-medium">Cryptographic Ledger Signature</span>
        </div>
        <p className="font-mono text-[10px] text-slate-400 break-all leading-tight">
          {credential.cryptographic_hash}
        </p>
      </div>

      {/* Action footer */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <span className="text-[11px] text-slate-500">
          Conferred: {new Date(credential.conferred_at).toLocaleDateString()}
        </span>
        {onVerify && (
          <button
            onClick={() => onVerify(credential)}
            className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors flex items-center gap-1.5 shadow-sm shadow-indigo-600/20"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Verify Credential
          </button>
        )}
      </div>
    </div>
  );
}
