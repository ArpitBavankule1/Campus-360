"use client";

import React, { useState } from "react";
import {
  HostelBlock,
  HostelRoom,
  HostelAllocation,
  HostelMessMenu,
  HostelOutPass,
  HostelGrievance,
} from "@/types";
import {
  MOCK_HOSTEL_BLOCKS,
  MOCK_HOSTEL_ROOMS,
  MOCK_HOSTEL_ALLOCATIONS,
  MOCK_MESS_MENUS,
  MOCK_OUT_PASSES,
  MOCK_HOSTEL_GRIEVANCES,
  calculateHostelAnalytics,
  getStudentHostelOverview,
} from "@/lib/hostel/hostel-engine";
import { HostelAllotmentCard } from "@/components/hostel/hostel-allotment-card";
import { WardenContactCard } from "@/components/hostel/warden-contact-card";
import { MessMenuSchedule } from "@/components/hostel/mess-menu-schedule";
import { OutPassRequestModal } from "@/components/hostel/out-pass-request-modal";
import { GrievanceReportModal } from "@/components/hostel/grievance-report-modal";
import {
  Building2,
  Utensils,
  LogOut,
  Wrench,
  Shield,
  Plus,
  QrCode,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Users,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HostelPortalPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "mess" | "outpasses" | "grievances" | "directory"
  >("overview");

  // State
  const [outPasses, setOutPasses] = useState<HostelOutPass[]>(MOCK_OUT_PASSES);
  const [grievances, setGrievances] = useState<HostelGrievance[]>(MOCK_HOSTEL_GRIEVANCES);
  const [showOutPassModal, setShowOutPassModal] = useState(false);
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [directorySearch, setDirectorySearch] = useState("");

  const analytics = calculateHostelAnalytics(
    MOCK_HOSTEL_BLOCKS,
    MOCK_HOSTEL_ROOMS,
    MOCK_HOSTEL_ALLOCATIONS,
    outPasses,
    grievances
  );
  const studentOverview = getStudentHostelOverview(
    "00000000-0000-0000-0000-000000000001",
    MOCK_HOSTEL_ALLOCATIONS,
    outPasses,
    grievances,
    MOCK_MESS_MENUS
  );

  const activeAllocation = MOCK_HOSTEL_ALLOCATIONS[0];
  const assignedRoom = MOCK_HOSTEL_ROOMS[0];
  const assignedBlock = MOCK_HOSTEL_BLOCKS[0];

  const filteredBlocks = MOCK_HOSTEL_BLOCKS.filter(
    (b) =>
      b.name.toLowerCase().includes(directorySearch.toLowerCase()) ||
      b.warden_name.toLowerCase().includes(directorySearch.toLowerCase()) ||
      b.gender.toLowerCase().includes(directorySearch.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl space-y-6">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-border/70 bg-gradient-to-r from-card via-card/90 to-primary/5 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              Phase 23 Milestone
            </span>
            <span className="text-xs text-muted-foreground">
              Apex Campus Residence Services
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-2">
            Hostel, Residence & Mess Portal
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
            Room allotments, daily nutritional dining schedules, verified night out-passes, and rapid facility maintenance ticketing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowOutPassModal(true)}
            className="rounded-2xl text-xs font-bold gap-1.5 h-10 shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Request Out-Pass
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowGrievanceModal(true)}
            className="rounded-2xl text-xs font-semibold gap-1.5 h-10 border-border/80"
          >
            <Wrench className="w-4 h-4 text-primary" />
            Log Grievance
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border/60">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "overview"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Building2 className="w-4 h-4" />
          My Residence Overview
        </button>

        <button
          onClick={() => setActiveTab("mess")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "mess"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Utensils className="w-4 h-4" />
          Dining & Mess Schedule
        </button>

        <button
          onClick={() => setActiveTab("outpasses")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "outpasses"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <LogOut className="w-4 h-4" />
          Night Out-Passes
          {outPasses.filter((p) => p.status === "approved" || p.status === "pending").length > 0 && (
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-black">
              {outPasses.filter((p) => p.status === "approved" || p.status === "pending").length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("grievances")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "grievances"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Wrench className="w-4 h-4" />
          Maintenance Grievances
          {grievances.filter((g) => g.status !== "resolved").length > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-black">
              {grievances.filter((g) => g.status !== "resolved").length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("directory")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "directory"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Users className="w-4 h-4" />
          Hostel Blocks & Wardens
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <HostelAllotmentCard
                allocation={activeAllocation}
                room={assignedRoom}
                block={assignedBlock}
              />
            </div>

            <div>
              <WardenContactCard block={assignedBlock} />
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-3xl border border-border/60 bg-card">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Overall Hostel Occupancy
              </div>
              <div className="text-2xl font-black text-foreground mt-2">
                {analytics.occupancyRate}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.totalOccupied} of {analytics.totalCapacity} resident beds allotted
              </p>
            </div>

            <div className="p-4 rounded-3xl border border-border/60 bg-card">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Active Out-Pass Status
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                {studentOverview.activeOutPass ? "Permit Active" : "On Campus"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {studentOverview.activeOutPass
                  ? `Permit code: ${studentOverview.activeOutPass.pass_code}`
                  : "Gate biometric access enabled"}
              </p>
            </div>

            <div className="p-4 rounded-3xl border border-border/60 bg-card">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Open Maintenance Grievances
              </div>
              <div className="text-2xl font-black text-foreground mt-2">
                {studentOverview.pendingGrievancesCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Average facility resolution turnaround: 18 hours
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Mess Schedule */}
      {activeTab === "mess" && (
        <MessMenuSchedule menus={MOCK_MESS_MENUS} />
      )}

      {/* Tab 3: Out-Passes */}
      {activeTab === "outpasses" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Digital Out-Pass Ledger
              </h3>
              <p className="text-xs text-muted-foreground">
                History of weekend recess permissions and late-night library study passes
              </p>
            </div>
            <Button
              onClick={() => setShowOutPassModal(true)}
              className="rounded-2xl text-xs gap-1.5 h-9"
            >
              <Plus className="w-4 h-4" />
              New Out-Pass Request
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outPasses.map((pass) => (
              <div
                key={pass.id}
                className="rounded-3xl border border-border/60 bg-card p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-primary">
                      {pass.pass_code}
                    </span>
                    <h4 className="text-base font-bold text-foreground mt-0.5">
                      {pass.destination}
                    </h4>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      pass.status === "approved"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        : pass.status === "returned"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-amber-500/15 text-amber-600 border border-amber-500/30"
                    }`}
                  >
                    {pass.status}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">{pass.reason}</p>

                <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-muted/40 border border-border/40">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase">Departure</div>
                    <div className="font-semibold text-foreground">
                      {new Date(pass.departure_time).toLocaleDateString()} {new Date(pass.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase">Expected Return</div>
                    <div className="font-semibold text-foreground">
                      {new Date(pass.expected_return).toLocaleDateString()} {new Date(pass.expected_return).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                {pass.warden_remarks && (
                  <p className="text-[11px] text-muted-foreground italic border-l-2 border-primary/50 pl-2">
                    {pass.warden_remarks}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Grievances */}
      {activeTab === "grievances" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Maintenance & Room Grievances
              </h3>
              <p className="text-xs text-muted-foreground">
                Track status of electrical, plumbing, carpentry, and network tickets
              </p>
            </div>
            <Button
              onClick={() => setShowGrievanceModal(true)}
              className="rounded-2xl text-xs gap-1.5 h-9"
            >
              <Plus className="w-4 h-4" />
              Report Issue
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grievances.map((g) => (
              <div
                key={g.id}
                className="rounded-3xl border border-border/60 bg-card p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      {g.category.toUpperCase()} • {g.priority.toUpperCase()} PRIORITY
                    </span>
                    <h4 className="text-base font-bold text-foreground mt-0.5">
                      {g.title}
                    </h4>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      g.status === "resolved"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : g.status === "in_progress"
                        ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                        : "bg-amber-500/15 text-amber-600"
                    }`}
                  >
                    {g.status.replace("_", " ")}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">{g.description}</p>

                <div className="text-[11px] text-muted-foreground pt-2 border-t border-border/40 flex items-center justify-between">
                  <span>Assigned: {g.assigned_to || "Duty Technician"}</span>
                  <span>{new Date(g.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Blocks Directory */}
      {activeTab === "directory" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Campus Residence Halls Directory
              </h3>
              <p className="text-xs text-muted-foreground">
                Capacity, amenities, and resident warden contact particulars
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search blocks or wardens..."
                value={directorySearch}
                onChange={(e) => setDirectorySearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-2xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filteredBlocks.map((b) => (
              <div
                key={b.id}
                className="rounded-3xl border border-border/60 bg-card p-5 space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                      {b.gender} block
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {b.total_rooms} Rooms
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-foreground mt-2">
                    {b.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {b.description}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-muted/40 border border-border/40 text-xs space-y-1.5">
                  <div className="font-semibold text-foreground">
                    Warden: {b.warden_name}
                  </div>
                  <div className="text-muted-foreground">{b.warden_phone}</div>
                  <div className="text-muted-foreground">{b.warden_email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showOutPassModal && (
        <OutPassRequestModal
          onClose={() => setShowOutPassModal(false)}
          onSuccess={(newPass) => {
            setOutPasses([newPass, ...outPasses]);
          }}
        />
      )}

      {showGrievanceModal && (
        <GrievanceReportModal
          onClose={() => setShowGrievanceModal(false)}
          onSuccess={(newGrievance) => {
            setGrievances([newGrievance, ...grievances]);
          }}
        />
      )}
    </div>
  );
}
