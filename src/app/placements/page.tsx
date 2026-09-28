"use client";

import React, { useState } from "react";
import {
  PlacementDrive,
  PlacementApplication,
  PlacementInterviewRound,
  PlacementOffer,
} from "@/types";
import {
  MOCK_PLACEMENT_DRIVES,
  MOCK_STUDENT_APPLICATIONS,
  MOCK_INTERVIEW_ROUNDS,
  MOCK_STUDENT_OFFERS,
  MOCK_INSTITUTIONAL_STATS,
  MOCK_STUDENT_PLACEMENT_PROFILE,
  checkDriveEligibility,
} from "@/lib/placements/placement-engine";
import { DriveCard } from "@/components/placements/drive-card";
import { EligibilityCheckerBanner } from "@/components/placements/eligibility-checker-banner";
import { ApplicationTracker } from "@/components/placements/application-tracker";
import { PlacementStatsOverview } from "@/components/placements/placement-stats-overview";
import { OfferVaultCard } from "@/components/placements/offer-vault-card";
import {
  Briefcase,
  Search,
  CheckCircle2,
  FileCheck,
  TrendingUp,
  Award,
  Sparkles,
  Calendar,
  X,
} from "lucide-react";

export default function PlacementsPage() {
  const [activeTab, setActiveTab] = useState<"drives" | "applications" | "analytics" | "offers">("drives");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedType, setSelectedType] = useState("ALL");
  const [filterOnlyEligible, setFilterOnlyEligible] = useState(false);

  // Runtime State
  const [drives, setDrives] = useState<PlacementDrive[]>(MOCK_PLACEMENT_DRIVES);
  const [applications, setApplications] = useState<PlacementApplication[]>(MOCK_STUDENT_APPLICATIONS);
  const [interviewRounds] = useState<PlacementInterviewRound[]>(MOCK_INTERVIEW_ROUNDS);
  const [offers, setOffers] = useState<PlacementOffer[]>(MOCK_STUDENT_OFFERS);
  const student = MOCK_STUDENT_PLACEMENT_PROFILE;

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Apply Handler
  function handleApply(drive: PlacementDrive) {
    const isAlreadyApplied = applications.some((a) => a.drive_id === drive.id);
    if (isAlreadyApplied) {
      setToastMessage(`You have already applied to ${drive.company_name}.`);
      return;
    }

    const eligibility = checkDriveEligibility(drive, {
      cgpa: student.cgpa,
      department: student.department,
      activeBacklogs: student.activeBacklogs,
    });

    if (!eligibility.isEligible) {
      setToastMessage(`Cannot apply: Ineligible for ${drive.company_name}.`);
      return;
    }

    const newApp: PlacementApplication = {
      id: `app-${Date.now()}`,
      drive_id: drive.id,
      student_id: student.studentId,
      college_id: drive.college_id,
      resume_url: "https://campuslens.edu/resumes/arjun-sharma-2026.pdf",
      current_cgpa: student.cgpa,
      status: "applied",
      applied_at: new Date().toISOString(),
      notes: "Application submitted via CampusLens portal.",
      drive,
    };

    setApplications([newApp, ...applications]);
    setToastMessage(`🎉 Successfully applied to ${drive.company_name} for ${drive.role_title}!`);
    setTimeout(() => setToastMessage(null), 5000);
  }

  // Update offer acceptance
  async function handleUpdateOfferStatus(offerId: string, status: "accepted" | "declined") {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, acceptance_status: status } : o))
    );
    setToastMessage(
      `Offer from ${offers.find((o) => o.id === offerId)?.company_name} marked as ${status}!`
    );
    setTimeout(() => setToastMessage(null), 4000);
  }

  // Filter drives
  const filteredDrives = drives.filter((drive) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      drive.company_name.toLowerCase().includes(q) ||
      drive.role_title.toLowerCase().includes(q) ||
      drive.skills_required.some((s) => s.toLowerCase().includes(q));

    const matchesDept =
      selectedDept === "ALL" ||
      drive.allowed_departments.includes("ALL") ||
      drive.allowed_departments.includes(selectedDept);

    const matchesType = selectedType === "ALL" || drive.drive_type === selectedType;

    const eligibility = checkDriveEligibility(drive, {
      cgpa: student.cgpa,
      department: student.department,
      activeBacklogs: student.activeBacklogs,
    });

    const matchesEligibility = !filterOnlyEligible || eligibility.isEligible;

    return matchesSearch && matchesDept && matchesType && matchesEligibility;
  });

  const eligibleDrivesCount = drives.filter((d) =>
    checkDriveEligibility(d, {
      cgpa: student.cgpa,
      department: student.department,
      activeBacklogs: student.activeBacklogs,
    }).isEligible
  ).length;

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Toast Notification */}
      {toastMessage ? (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-card border border-primary/40 text-foreground px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-muted-foreground hover:text-foreground ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : null}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" /> Phase 20
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              Training & Placement Cell (TPC)
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground mt-1">
            Career Drives & Placement Portal
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Explore industry recruitment drives, track multi-round interviews, simulate CTC packages, and access official offer letters.
          </p>
        </div>

        {/* Global Stats Snapshot */}
        <div className="flex items-center gap-3 bg-card/60 border border-border/60 p-3 rounded-2xl backdrop-blur-sm">
          <div className="text-right px-2">
            <div className="text-xs text-muted-foreground font-medium">Avg Package</div>
            <div className="text-lg font-black text-emerald-500">₹14.2 LPA</div>
          </div>
          <div className="h-8 w-px bg-border/60" />
          <div className="text-right px-2">
            <div className="text-xs text-muted-foreground font-medium">Placement %</div>
            <div className="text-lg font-black text-primary">87.6%</div>
          </div>
          <div className="h-8 w-px bg-border/60" />
          <div className="text-right px-2">
            <div className="text-xs text-muted-foreground font-medium">My Applications</div>
            <div className="text-lg font-black text-foreground">{applications.length}</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("drives")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "drives"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Active Drives ({drives.length})
        </button>

        <button
          onClick={() => setActiveTab("applications")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "applications"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <FileCheck className="w-4 h-4" />
          My Applications & Rounds ({applications.length})
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "analytics"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Placement Insights & CTC Analytics
        </button>

        <button
          onClick={() => setActiveTab("offers")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "offers"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Award className="w-4 h-4" />
          Offer Letters Vault ({offers.length})
        </button>
      </div>

      {/* Tab 1: Active Drives */}
      {activeTab === "drives" ? (
        <div className="space-y-6">
          {/* Eligibility Profile Banner */}
          <EligibilityCheckerBanner
            student={student}
            filterOnlyEligible={filterOnlyEligible}
            onToggleOnlyEligible={setFilterOnlyEligible}
            selectedDepartment={selectedDept}
            onSelectDepartment={setSelectedDept}
            selectedType={selectedType}
            onSelectType={setSelectedType}
            totalDrivesCount={drives.length}
            eligibleDrivesCount={eligibleDrivesCount}
          />

          {/* Search Input Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search companies (Google, Microsoft), job roles, or technical skills (Python, React)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border/60 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
            />
          </div>

          {/* Drives Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredDrives.map((drive) => {
              const isApplied = applications.some((a) => a.drive_id === drive.id);
              return (
                <DriveCard
                  key={drive.id}
                  drive={drive}
                  student={student}
                  isApplied={isApplied}
                  onApply={handleApply}
                />
              );
            })}
          </div>

          {filteredDrives.length === 0 ? (
            <div className="text-center py-16 border border-dashed rounded-2xl bg-card/40 text-muted-foreground">
              No placement drives found matching your filter criteria. Try adjusting the search or department filter.
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Tab 2: My Applications & Rounds */}
      {activeTab === "applications" ? (
        <ApplicationTracker
          applications={applications}
          interviewRounds={interviewRounds}
        />
      ) : null}

      {/* Tab 3: Institutional Stats & CTC Insights */}
      {activeTab === "analytics" ? (
        <PlacementStatsOverview stats={MOCK_INSTITUTIONAL_STATS} />
      ) : null}

      {/* Tab 4: Offer Letters Vault */}
      {activeTab === "offers" ? (
        <OfferVaultCard offers={offers} onUpdateStatus={handleUpdateOfferStatus} />
      ) : null}
    </div>
  );
}
