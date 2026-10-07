"use client";

import React, { useState, useEffect } from "react";
import {
  AcademicProgram,
  AdmissionApplication,
  SeatAllotmentDocket,
  CampusTourBooking,
  ProgramDegreeLevel,
} from "@/types";
import {
  calculateAdmissionsOverview,
  MOCK_ACADEMIC_PROGRAMS,
  MOCK_ADMISSION_APPLICATIONS,
  MOCK_SEAT_ALLOTMENTS,
  MOCK_TOUR_BOOKINGS,
} from "@/lib/admissions/admissions-engine";
import { ProgramCard } from "@/components/admissions/program-card";
import { SeatAllotmentCard } from "@/components/admissions/seat-allotment-card";
import { ApplyProgramModal } from "@/components/admissions/apply-program-modal";
import { BookTourModal } from "@/components/admissions/book-tour-modal";
import {
  GraduationCap,
  Users,
  FileCheck2,
  Compass,
  Search,
  Sparkles,
  PhoneCall,
  Mail,
  Building,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Award,
  Download,
  X,
  FileText,
} from "lucide-react";

export default function AdmissionsPortalPage() {
  const [programs, setPrograms] = useState<AcademicProgram[]>(MOCK_ACADEMIC_PROGRAMS);
  const [applications, setApplications] = useState<AdmissionApplication[]>(
    MOCK_ADMISSION_APPLICATIONS
  );
  const [allotments, setAllotments] = useState<SeatAllotmentDocket[]>(
    MOCK_SEAT_ALLOTMENTS
  );
  const [tours, setTours] = useState<CampusTourBooking[]>(MOCK_TOUR_BOOKINGS);

  const [activeTab, setActiveTab] = useState<
    "programs" | "allotments" | "applications" | "tours" | "helpline"
  >("programs");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDegree, setSelectedDegree] = useState<string>("ALL");

  // Modals state
  const [selectedProgramForApply, setSelectedProgramForApply] =
    useState<AcademicProgram | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [selectedLetterDocket, setSelectedLetterDocket] =
    useState<SeatAllotmentDocket | null>(null);

  const stats = calculateAdmissionsOverview(programs, applications, allotments, tours);

  // Filter programs
  const filteredPrograms = programs.filter((p) => {
    const matchesQuery =
      p.program_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.program_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDegree =
      selectedDegree === "ALL" || p.degree_level.includes(selectedDegree);
    return matchesQuery && matchesDegree;
  });

  const handleOpenApply = (program: AcademicProgram) => {
    setSelectedProgramForApply(program);
    setIsApplyModalOpen(true);
  };

  const handleApplicationCreated = (newApp: AdmissionApplication) => {
    setApplications((prev) => [newApp, ...prev]);
  };

  const handleTourCreated = (newTour: CampusTourBooking) => {
    setTours((prev) => [newTour, ...prev]);
  };

  const handleAcceptSeat = (docket: SeatAllotmentDocket) => {
    setAllotments((prev) =>
      prev.map((item) =>
        item.id === docket.id ? { ...item, is_seat_accepted: true } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 lg:p-10 space-y-8">
      {/* Top Breadcrumb & Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-blue-950/40 p-6 md:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Phase 42
              </span>
              <span className="text-xs text-slate-400">
                Admissions, Merit Counseling & Enrollment Gateway
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Smart Campus Admissions & Seat Allocation Gateway
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Explore accredited B.Tech, M.Tech, MBA, and Ph.D. degree curricula, track merit seat
              allotment dockets, schedule personalized campus welcome tours, and receive verified
              provisional offer letters.
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsTourModalOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Compass className="w-4 h-4 text-teal-400" />
              Schedule Campus Visit
            </button>
            <button
              onClick={() => {
                if (programs.length > 0) handleOpenApply(programs[0]);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Apply Online 2026-27
            </button>
          </div>
        </div>

        {/* Telemetry Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-blue-400 mb-1">
              <GraduationCap className="w-4 h-4" />
              <span className="text-xs font-medium">Academic Programs</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {stats.totalProgramsCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Undergraduate & Graduate</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium">Total Seat Intake</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {stats.totalIntakeSeats}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Approved AICTE/UGC Intake</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <FileCheck2 className="w-4 h-4" />
              <span className="text-xs font-medium">Applications Received</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {stats.totalApplicationsReceived}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Active Candidate Dockets</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <Award className="w-4 h-4" />
              <span className="text-xs font-medium">Seats Allotted</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {stats.totalSeatsAllotted}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Round 1 & 2 Merit Dockets</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        <button
          onClick={() => setActiveTab("programs")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "programs"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          🎓 Degree Programs ({programs.length})
        </button>
        <button
          onClick={() => setActiveTab("allotments")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "allotments"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          📜 Merit Seat Allotments ({allotments.length})
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "applications"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          📋 Registered Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab("tours")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "tours"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          🧭 Campus Tours & Counselor Desk ({tours.length})
        </button>
        <button
          onClick={() => setActiveTab("helpline")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === "helpline"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          📞 Admissions Deanery & Helpline
        </button>
      </div>

      {/* Tab 1: Academic Programs */}
      {activeTab === "programs" && (
        <div className="space-y-6">
          {/* Search & Degree Level Filter */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search programs by name, code or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {["ALL", "B.Tech", "M.Tech", "MBA", "Ph.D."].map((deg) => (
                <button
                  key={deg}
                  onClick={() => setSelectedDegree(deg)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedDegree === deg
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {deg === "ALL" ? "All Levels" : deg}
                </button>
              ))}
            </div>
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onApply={handleOpenApply}
              />
            ))}
          </div>

          {filteredPrograms.length === 0 && (
            <div className="text-center py-12 rounded-2xl border border-slate-800 bg-slate-900/30">
              <p className="text-sm text-slate-400">
                No academic programs found matching your search criteria.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Merit Seat Allotments */}
      {activeTab === "allotments" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">
                Merit Seat Allotment & Counseling Dockets
              </h2>
              <p className="text-xs text-slate-400">
                All India open category and affirmative action reservation seat allocations
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Counseling Cycle 2026-27 Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allotments.map((docket) => (
              <SeatAllotmentCard
                key={docket.id}
                docket={docket}
                onAcceptSeat={handleAcceptSeat}
                onDownloadLetter={(d) => setSelectedLetterDocket(d)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Applications Registry */}
      {activeTab === "applications" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">
                Candidate Applications Pipeline
              </h2>
              <p className="text-xs text-slate-400">
                Live submission status, document verification, and merit rankings
              </p>
            </div>
            <button
              onClick={() => {
                if (programs.length > 0) handleOpenApply(programs[0]);
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
            >
              + New Application
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Application ID</th>
                  <th className="p-3.5">Candidate Name</th>
                  <th className="p-3.5">Program Applied</th>
                  <th className="p-3.5">Quota</th>
                  <th className="p-3.5">Entrance Score</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Applied Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 font-mono text-blue-400 font-semibold">
                      {app.application_number}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{app.candidate_name}</div>
                      <div className="text-[11px] text-slate-400">{app.email}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-slate-300 font-medium">
                        {app.program_code}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="text-purple-300">{app.quota_category}</span>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-200">{app.entrance_score_rank}</div>
                      <div className="text-[10px] text-slate-400">{app.entrance_exam}</div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          app.status === "seat_allotted" || app.status === "provisional_admitted"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {app.status.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {new Date(app.applied_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Campus Tours & Counselor Bookings */}
      {activeTab === "tours" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">
                Campus Visits & Admissions Counselor Consultations
              </h2>
              <p className="text-xs text-slate-400">
                1-on-1 sessions with Faculty Deans and guided laboratory tours
              </p>
            </div>
            <button
              onClick={() => setIsTourModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-md shadow-teal-600/20 transition-all"
            >
              + Book Visit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tours.map((tour) => (
              <div
                key={tour.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      {tour.booking_code}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {tour.tour_mode}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Confirmed
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{tour.candidate_name}</h3>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Date & Window:</span>
                    <span className="text-slate-200 font-mono">
                      {tour.preferred_date} • {tour.time_slot}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Counselor:</span>
                    <span className="text-teal-300 font-medium">{tour.assigned_counselor}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Attendees:</span>
                    <span className="text-slate-300">{tour.guests_count} Guests</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Admissions Deanery & Helpline */}
      {activeTab === "helpline" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Central Admissions Directorate
                </h3>
                <p className="text-xs text-slate-400">Administrative Block, Level 1</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Official office hours: Monday to Saturday, 09:00 AM – 05:30 PM IST.
              Walk-in document verification, physical certificate scanning, and fee
              counters operate continuously during counseling rounds.
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <PhoneCall className="w-4 h-4 text-blue-400" />
                <span>+91 22 2654 3000 / +91 1800 200 4545 (Toll-Free)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>admissions@apex-university.edu.in</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Merit & Verification Assurance
                </h3>
                <p className="text-xs text-slate-400">Anti-Capitation & Equal Opportunity</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Admissions are conducted strictly based on merit rankings in national entrance
              examinations adhering to Supreme Court, UGC, and AICTE reservation statutes. Zero
              capitation or management quota fees are permitted.
            </p>

            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs space-y-1 text-emerald-300">
              <div className="font-semibold">Statutory Ombudsman Oversight</div>
              <div className="text-[11px] text-slate-400">
                Grievances regarding seat allocation can be directly lodged with the
                Student Ombudsman at /ombudsman.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Provisional Letter Viewer Modal */}
      {selectedLetterDocket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 shadow-2xl">
            <button
              onClick={() => setSelectedLetterDocket(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-white">
                Provisional Admission Offer Letter
              </h2>
              <p className="text-xs text-blue-300/80">
                Academic Session 2026-2027 • Institutional Seal
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Allotment Token:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {selectedLetterDocket.allotment_number}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Candidate:</span>
                <span className="text-white font-semibold">
                  {selectedLetterDocket.candidate_name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Program:</span>
                <span className="text-slate-200">{selectedLetterDocket.program_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Allotted Category:</span>
                <span className="text-purple-300">{selectedLetterDocket.allotted_category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Acceptance Status:</span>
                <span className="text-emerald-400 font-semibold">
                  {selectedLetterDocket.is_seat_accepted ? "Seat Locked" : "Pending Acceptance"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedLetterDocket(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(
                    `Provisional Admission Docket ${selectedLetterDocket.allotment_number} downloaded.`
                  );
                  setSelectedLetterDocket(null);
                }}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Program Application Modal */}
      <ApplyProgramModal
        program={selectedProgramForApply}
        isOpen={isApplyModalOpen}
        onClose={() => {
          setIsApplyModalOpen(false);
          setSelectedProgramForApply(null);
        }}
        onApplicationCreated={handleApplicationCreated}
      />

      {/* Campus Tour Booking Modal */}
      <BookTourModal
        isOpen={isTourModalOpen}
        onClose={() => setIsTourModalOpen(false)}
        onBookingCreated={handleTourCreated}
      />
    </div>
  );
}
