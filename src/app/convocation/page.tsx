"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Award,
  ShieldCheck,
  Search,
  Filter,
  Users,
  Scroll,
} from "lucide-react";
import {
  MOCK_DEGREE_CREDENTIALS,
  MOCK_CONVOCATION_CEREMONY,
  MOCK_CONVOCATION_REGISTRATIONS,
  MOCK_CREDENTIAL_VERIFICATIONS,
  calculateConvocationOverview,
} from "@/lib/convocation/convocation-engine";
import { DegreeCredential, ConvocationRegistration } from "@/types";
import { DegreeCredentialCard } from "@/components/convocation/degree-credential-card";
import { ConvocationCeremonyCard } from "@/components/convocation/convocation-ceremony-card";
import { RegisterConvocationModal } from "@/components/convocation/register-convocation-modal";
import { VerifyDegreeModal } from "@/components/convocation/verify-degree-modal";

export default function ConvocationPortalPage() {
  const [credentials, setCredentials] = useState<DegreeCredential[]>(MOCK_DEGREE_CREDENTIALS);
  const [registrations, setRegistrations] = useState<ConvocationRegistration[]>(MOCK_CONVOCATION_REGISTRATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("All");

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [selectedCred, setSelectedCred] = useState<DegreeCredential | null>(null);

  const stats = calculateConvocationOverview(
    credentials,
    MOCK_CONVOCATION_CEREMONY,
    registrations,
    MOCK_CREDENTIAL_VERIFICATIONS
  );

  const filteredCredentials = credentials.filter((c) => {
    const matchesSearch =
      c.scholar_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.credential_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === "All" ||
      (filterType === "Gold Medalists" &&
        (c.honors_classification === "Dean's Gold Medalist" ||
          c.honors_classification === "Chancellor's Citation")) ||
      c.degree_type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            Phase 38 • Academic Convocation & Verifiable Degree Ledger
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Degree Credentials & Academic Convocation
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Cryptographically sealed academic degree registry, graduation regalia reservations, and instant employer background check gateway.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedCred(null);
              setIsVerifyOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Employer Verification
          </button>
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4" />
            Register for Convocation
          </button>
        </div>
      </div>

      {/* Convocation Ceremony Banner */}
      <ConvocationCeremonyCard
        ceremony={MOCK_CONVOCATION_CEREMONY}
        onRegisterClick={() => setIsRegisterOpen(true)}
      />

      {/* Telemetry Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <Scroll className="w-4 h-4 text-indigo-400" />
            Degrees Conferred
          </div>
          <div className="text-2xl font-bold text-white">
            {stats.totalDegreesIssued.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Verified across all schools & labs
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <Award className="w-4 h-4 text-amber-400" />
            Gold Medalists
          </div>
          <div className="text-2xl font-bold text-amber-300">
            {stats.goldMedalistsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Dean's & Chancellor's honors
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <Users className="w-4 h-4 text-cyan-400" />
            Scholars Registered
          </div>
          <div className="text-2xl font-bold text-cyan-300">
            {stats.registeredScholarsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Auditorium seating allocated
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Employer Audits
          </div>
          <div className="text-2xl font-bold text-emerald-300">
            {stats.employerVerificationsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            100% cryptographic ledger matches
          </div>
        </div>
      </div>

      {/* Degree Credentials Directory Header & Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              Conferred Degrees & Cryptographic Records
            </h2>
            <p className="text-xs text-slate-400">
              Select any scholar record to inspect cryptographic tamper-proof hash and verify authentication.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search scholar, roll ID, dept..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl bg-slate-900 border border-slate-800 pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 w-64"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500 ml-2" />
              {["All", "Bachelor of Technology", "Doctor of Philosophy", "Gold Medalists"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    filterType === type
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCredentials.map((cred) => (
            <DegreeCredentialCard
              key={cred.id}
              credential={cred}
              onVerify={(c) => {
                setSelectedCred(c);
                setIsVerifyOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      <RegisterConvocationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={(newReg) => {
          setRegistrations((prev) => [newReg, ...prev]);
        }}
      />

      <VerifyDegreeModal
        isOpen={isVerifyOpen}
        onClose={() => {
          setIsVerifyOpen(false);
          setSelectedCred(null);
        }}
        initialCredential={selectedCred}
      />
    </div>
  );
}
