"use client";

import React, { useState } from "react";
import {
  FellowshipPosition,
  FellowshipApplication,
  FellowshipTimesheet,
  FellowshipDisbursement,
  FellowshipType,
  DutyCategory,
} from "@/types";
import {
  MOCK_FELLOWSHIP_POSITIONS,
  MOCK_FELLOWSHIP_APPLICATIONS,
  MOCK_FELLOWSHIP_TIMESHEETS,
  MOCK_FELLOWSHIP_DISBURSEMENTS,
  getFellowshipPositions,
  submitFellowshipApplication,
  submitFellowshipTimesheet,
} from "@/lib/fellowships/fellowships-engine";
import { FellowshipPositionCard } from "@/components/fellowships/fellowship-position-card";
import { ApplyFellowshipModal } from "@/components/fellowships/apply-fellowship-modal";
import { TimesheetLoggerCard } from "@/components/fellowships/timesheet-logger-card";
import { DisbursementLedgerCard } from "@/components/fellowships/disbursement-ledger-card";
import { FellowshipAppointmentModal } from "@/components/fellowships/fellowship-appointment-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Briefcase,
  Clock,
  IndianRupee,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Award,
  BookOpen,
  FileText,
  UserCheck,
  ExternalLink,
} from "lucide-react";

export default function FellowshipsPortalPage() {
  const [positions, setPositions] = useState<FellowshipPosition[]>(MOCK_FELLOWSHIP_POSITIONS);
  const [applications, setApplications] = useState<FellowshipApplication[]>(MOCK_FELLOWSHIP_APPLICATIONS);
  const [timesheets, setTimesheets] = useState<FellowshipTimesheet[]>(MOCK_FELLOWSHIP_TIMESHEETS);
  const [disbursements] = useState<FellowshipDisbursement[]>(MOCK_FELLOWSHIP_DISBURSEMENTS);

  const [activeTab, setActiveTab] = useState<"positions" | "applications" | "timesheet" | "disbursements" | "policy">("positions");
  const [selectedType, setSelectedType] = useState<FellowshipType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedPositionForApply, setSelectedPositionForApply] = useState<FellowshipPosition | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedAppForPass, setSelectedAppForPass] = useState<FellowshipApplication | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  // Filter positions
  const filteredPositions = getFellowshipPositions(selectedType, "all", searchQuery);

  const handleOpenApply = (pos: FellowshipPosition) => {
    setSelectedPositionForApply(pos);
    setIsApplyModalOpen(true);
  };

  const handleApplySubmit = (data: any) => {
    const newApp = submitFellowshipApplication(data);
    setApplications([newApp, ...applications]);
  };

  const handleLogTimesheet = (data: any) => {
    const appointedApp = applications.find((a) => a.status === "appointed") || applications[0];
    const newSheet = submitFellowshipTimesheet({
      application_id: appointedApp.id,
      student_name: appointedApp.student_name,
      roll_number: appointedApp.roll_number,
      ...data,
    });
    setTimesheets([newSheet, ...timesheets]);
  };

  const appointedApplication = applications.find((a) => a.status === "appointed");

  return (
    <div className="min-h-screen bg-background/50 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 pt-6">
      {/* Top Banner / Header */}
      <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-gradient-to-r from-blue-600/10 via-indigo-500/5 to-background p-6 sm:p-8 backdrop-blur-xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="bg-primary/15 text-primary border-primary/30 px-3 py-1 text-xs font-semibold">
                Phase 44 Gateway
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-medium">
                <ShieldCheck className="h-3 w-3 mr-1" />
                UGC & AICTE Norms Compliant
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Teaching Assistantships & Graduate Fellowships
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Institutional portal for open departmental teaching assistantships, laboratory recitations, weekly supervisor timesheet validation, and monthly stipend Direct Benefit Transfer (DBT) releases.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {appointedApplication && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedAppForPass(appointedApplication);
                  setIsPassModalOpen(true);
                }}
                className="text-xs bg-background/80 hover:bg-background shadow-xs border-border/80 flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-primary" />
                Appointment Pass
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => setActiveTab("timesheet")}
              className="text-xs font-semibold flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              Log Timesheet
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 text-blue-500" />
              Active Appointments
            </span>
            <div className="text-2xl font-extrabold text-foreground">24</div>
            <span className="text-[11px] text-muted-foreground block">Across 6 departments</span>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card/60 backdrop-blur-md">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <IndianRupee className="h-3.5 w-3.5 text-emerald-500" />
              Monthly Outlay
            </span>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              ₹3.84L
            </div>
            <span className="text-[11px] text-muted-foreground block">Direct Benefit Transfer</span>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card/60 backdrop-blur-md">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-indigo-500" />
              Average Weekly Hours
            </span>
            <div className="text-2xl font-extrabold text-foreground">12.5 hrs</div>
            <span className="text-[11px] text-muted-foreground block">UGC max ceiling: 20 hrs</span>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card/60 backdrop-blur-md">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-purple-500" />
              Disbursement SLA
            </span>
            <div className="text-2xl font-extrabold text-foreground">100%</div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-medium">On-time escrow release</span>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border/60 overflow-x-auto gap-2 text-sm font-medium">
        <button
          onClick={() => setActiveTab("positions")}
          className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "positions"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Open Positions ({positions.length})
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "applications"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Award className="w-4 h-4" />
          My Applications & Pass ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab("timesheet")}
          className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "timesheet"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Clock className="w-4 h-4" />
          Duty Timesheet ({timesheets.length})
        </button>
        <button
          onClick={() => setActiveTab("disbursements")}
          className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "disbursements"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <IndianRupee className="w-4 h-4" />
          Stipend DBT Payroll ({disbursements.length})
        </button>
        <button
          onClick={() => setActiveTab("policy")}
          className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "policy"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Guidelines & Policy
        </button>
      </div>

      {/* Tab 1: Positions */}
      {activeTab === "positions" && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by course, role title, faculty or dept..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-input bg-card/60 backdrop-blur-md outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <Button
                variant={selectedType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("all")}
                className="text-xs h-8"
              >
                All Roles
              </Button>
              <Button
                variant={selectedType === "teaching_assistant" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("teaching_assistant")}
                className="text-xs h-8"
              >
                TA
              </Button>
              <Button
                variant={selectedType === "research_assistant" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("research_assistant")}
                className="text-xs h-8"
              >
                RA
              </Button>
              <Button
                variant={selectedType === "lab_demonstrator" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("lab_demonstrator")}
                className="text-xs h-8"
              >
                Lab Demo
              </Button>
              <Button
                variant={selectedType === "work_study" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("work_study")}
                className="text-xs h-8"
              >
                Work-Study
              </Button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPositions.map((pos) => (
              <FellowshipPositionCard
                key={pos.id}
                position={pos}
                onApply={handleOpenApply}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Applications & Appointment Pass */}
      {activeTab === "applications" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map((app) => {
              const isAppointed = app.status === "appointed";
              const isShortlisted = app.status === "shortlisted";

              return (
                <Card
                  key={app.id}
                  className="border border-border/60 bg-card/60 backdrop-blur-md shadow-sm space-y-3 p-4 overflow-hidden hover:border-primary/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                          {app.application_token}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-xs font-semibold ${
                            isAppointed
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                              : isShortlisted
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {app.status.toUpperCase()}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-sm text-foreground">
                        {app.position?.title || "Department Fellowship"}
                      </h3>
                    </div>

                    {isAppointed && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedAppForPass(app);
                          setIsPassModalOpen(true);
                        }}
                        className="text-xs h-8 gap-1.5 font-semibold"
                      >
                        <Award className="w-3.5 h-3.5" />
                        Digital Pass
                      </Button>
                    )}
                  </div>

                  <div className="text-xs space-y-1.5 p-3 rounded-lg bg-muted/30 border border-border/40">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Scholar:</span>
                      <strong className="text-foreground">{app.student_name} ({app.roll_number})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CGPA & Prereq:</span>
                      <span>CGPA {app.student_cgpa} • Grade {app.course_grade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weekly Commitment:</span>
                      <span>{app.weekly_availability_hours} hours / week</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="font-semibold text-muted-foreground">Statement of Purpose:</span>
                    <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                      {app.statement_of_purpose}
                    </p>
                  </div>

                  {app.faculty_feedback && (
                    <div className="pt-2 border-t border-border/40 text-xs text-muted-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Note: {app.faculty_feedback}</span>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Timesheet */}
      {activeTab === "timesheet" && (
        <TimesheetLoggerCard
          timesheets={timesheets}
          onLogTimesheet={handleLogTimesheet}
        />
      )}

      {/* Tab 4: Disbursements */}
      {activeTab === "disbursements" && (
        <DisbursementLedgerCard disbursements={disbursements} />
      )}

      {/* Tab 5: Policy */}
      {activeTab === "policy" && (
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md">
          <CardContent className="p-6 space-y-4 text-xs leading-relaxed text-muted-foreground">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Statutory Fellowship Guidelines & Teaching Assistantship Code
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/40 border border-border/40 space-y-1">
                <strong className="text-foreground block">1. Maximum Workload Ceiling</strong>
                <p>Under AICTE and UGC statutory frameworks, enrolled scholars may not be engaged in teaching assistantships or lab duties for more than 20 hours per week during active instruction semesters.</p>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 border border-border/40 space-y-1">
                <strong className="text-foreground block">2. Minimum Academic Standing</strong>
                <p>Scholars must maintain a minimum cumulative CGPA of 8.00 and cannot hold active course backlogs. Falling below threshold prompts immediate academic review by the Deanery.</p>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 border border-border/40 space-y-1">
                <strong className="text-foreground block">3. Biometric Timesheet & Monthly Escrow Releases</strong>
                <p>Stipends are disbursed via Direct Benefit Transfer (DBT) on the final calendar day of each month upon verified digital sign-off from the supervising faculty member.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <ApplyFellowshipModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        position={selectedPositionForApply}
        onSubmit={handleApplySubmit}
      />

      <FellowshipAppointmentModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        application={selectedAppForPass}
      />
    </div>
  );
}
