"use client";

import React from "react";
import { AcademicProgram } from "@/types";
import {
  GraduationCap,
  Calendar,
  Users,
  Award,
  IndianRupee,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react";

interface ProgramCardProps {
  program: AcademicProgram;
  onApply: (program: AcademicProgram) => void;
}

export function ProgramCard({ program, onApply }: ProgramCardProps) {
  const seatsOccupied = program.total_seats - program.available_seats;
  const occupancyPercent = Math.min(
    100,
    Math.round((seatsOccupied / program.total_seats) * 100)
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-6 hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl border bg-blue-500/10 border-blue-500/20 text-blue-400 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                  {program.program_code}
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                  {program.degree_level}
                </span>
                {program.is_admissions_open && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Open for 2026-27
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white mt-1.5 leading-snug">
                {program.program_name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Dept of {program.department}
              </p>
            </div>
          </div>
        </div>

        {/* Program Highlights Box */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Duration:
            </span>
            <span className="font-semibold text-slate-200">
              {program.duration_years} Years ({program.duration_years * 2} Semesters)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5 text-slate-500" /> Annual Tuition:
            </span>
            <span className="font-semibold text-emerald-400 font-mono">
              ₹{program.annual_tuition_inr.toLocaleString("en-IN")} / yr
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-blue-400" /> Accreditation:
            </span>
            <span className="text-slate-300 font-medium text-[11px]">
              {program.accreditation}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300">Eligibility: </span>
              {program.eligibility_cutoff}
            </p>
          </div>
        </div>

        {/* Seat Availability Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-500" /> Intake Capacity:
            </span>
            <span className="font-mono text-slate-200">
              <strong className="text-white">{program.available_seats}</strong> seats left / {program.total_seats}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                occupancyPercent > 80
                  ? "bg-amber-500"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500"
              }`}
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
        </div>

        {/* Application Deadline Badge */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/15 text-xs mb-4">
          <div className="flex items-center gap-1.5 text-blue-300">
            <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-[11px]">Apply Before: {program.application_deadline}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Merit Cycle 1</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
        <a
          href={program.brochure_url || "#"}
          onClick={(e) => {
            if (!program.brochure_url) e.preventDefault();
          }}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          Brochure
        </a>

        <button
          onClick={() => onApply(program)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Apply Online
        </button>
      </div>
    </div>
  );
}
