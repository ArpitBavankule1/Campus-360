"use client";

import React, { useState } from "react";
import {
  StudentHealthProfile,
  HealthAppointment,
  MedicalLeaveRequest,
  DispensaryMedicine,
  CampusDoctorSchedule,
} from "@/types";
import {
  MOCK_DOCTOR_SCHEDULES,
  MOCK_HEALTH_PROFILE,
  MOCK_HEALTH_APPOINTMENTS,
  MOCK_MEDICAL_LEAVES,
  MOCK_DISPENSARY_MEDICINES,
  getStudentHealthOverview,
} from "@/lib/health/health-engine";
import { HealthProfileSummary } from "@/components/health/health-profile-summary";
import { EmergencySOSBeacon } from "@/components/health/emergency-sos-beacon";
import { DoctorConsultationCard } from "@/components/health/doctor-consultation-card";
import { DispensaryStockTable } from "@/components/health/dispensary-stock-table";
import { MedicalLeaveModal } from "@/components/health/medical-leave-modal";
import {
  HeartPulse,
  Stethoscope,
  Pill,
  FileCheck,
  Siren,
  Plus,
  CalendarCheck,
  Clock,
  CheckCircle2,
  Phone,
  Shield,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HealthCenterPortalPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "doctors" | "dispensary" | "leaves" | "emergency"
  >("overview");

  // State
  const [appointments, setAppointments] = useState<HealthAppointment[]>(MOCK_HEALTH_APPOINTMENTS);
  const [leaves, setLeaves] = useState<MedicalLeaveRequest[]>(MOCK_MEDICAL_LEAVES);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState<CampusDoctorSchedule | null>(null);

  const healthOverview = getStudentHealthOverview(
    "00000000-0000-0000-0000-000000000001",
    MOCK_HEALTH_PROFILE,
    appointments,
    leaves
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl space-y-6">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-border/70 bg-gradient-to-r from-card via-card/90 to-rose-500/5 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              Phase 24 Milestone
            </span>
            <span className="text-xs text-muted-foreground">
              Apex Campus Healthcare & Wellness Services
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-2">
            Campus Health Center & Infirmary
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
            24/7 emergency response, doctor OPD appointments, complimentary dispensary medicine inventory, and academic medical leave waivers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowLeaveModal(true)}
            className="rounded-2xl text-xs font-bold gap-1.5 h-10 shadow-sm"
          >
            <FileCheck className="w-4 h-4" />
            Apply Medical Leave
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveTab("doctors")}
            className="rounded-2xl text-xs font-semibold gap-1.5 h-10 border-border/80"
          >
            <Stethoscope className="w-4 h-4 text-primary" />
            Find Doctors
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
          <HeartPulse className="w-4 h-4" />
          Health Profile & SOS
        </button>

        <button
          onClick={() => setActiveTab("doctors")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "doctors"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          OPD Doctors Directory
        </button>

        <button
          onClick={() => setActiveTab("dispensary")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "dispensary"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Pill className="w-4 h-4" />
          Dispensary & Pharmacy Stock
        </button>

        <button
          onClick={() => setActiveTab("leaves")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "leaves"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Medical Leave Waivers
        </button>

        <button
          onClick={() => setActiveTab("emergency")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === "emergency"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
        >
          <Siren className="w-4 h-4" />
          Emergency Hotlines
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <EmergencySOSBeacon />

          <HealthProfileSummary profile={healthOverview.profile} />

          {/* Active Appointments */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-foreground">
              Scheduled Clinic Consultations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {healthOverview.activeAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="rounded-3xl border border-border/60 bg-card p-5 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-primary">
                        Token #{appt.token_number}
                      </span>
                      <h4 className="text-base font-bold text-foreground mt-0.5">
                        {appt.doctor_name}
                      </h4>
                      <p className="text-xs text-muted-foreground">{appt.specialization}</p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      Confirmed
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground italic">
                    "{appt.symptoms}"
                  </p>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-border/40 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {appt.appointment_date} ({appt.time_slot})
                    </span>
                    <span>Infirmary Room 1</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Doctors Directory */}
      {activeTab === "doctors" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              Consulting Physicians & Specialists
            </h3>
            <p className="text-xs text-muted-foreground">
              Free campus OPD consultations for all enrolled scholars and resident staff
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {MOCK_DOCTOR_SCHEDULES.map((doc) => (
              <DoctorConsultationCard
                key={doc.id}
                doctor={doc}
                onBookAppointment={(d) => {
                  setBookingDoctor(d);
                }}
              />
            ))}
          </div>

          {/* Simple Booking Alert if selected */}
          {bookingDoctor && (
            <div className="p-4 rounded-3xl border border-primary/30 bg-primary/10 flex items-center justify-between gap-3 animate-in fade-in">
              <div className="text-xs text-foreground">
                <span className="font-bold">Next Slot with {bookingDoctor.name}:</span>{" "}
                Tomorrow at 10:30 AM in {bookingDoctor.roomNumber}.
              </div>
              <Button
                size="sm"
                onClick={() => {
                  alert(`Appointment confirmed with ${bookingDoctor.name}! Token #22`);
                  setBookingDoctor(null);
                }}
                className="rounded-xl text-xs h-8"
              >
                Confirm Booking
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Dispensary */}
      {activeTab === "dispensary" && (
        <DispensaryStockTable medicines={MOCK_DISPENSARY_MEDICINES} />
      )}

      {/* Tab 4: Medical Leaves */}
      {activeTab === "leaves" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Academic Medical Leaves & Attendance Excuses
              </h3>
              <p className="text-xs text-muted-foreground">
                Official medical leaves certified by Chief Medical Officer with automatic attendance quota adjustment
              </p>
            </div>
            <Button
              onClick={() => setShowLeaveModal(true)}
              className="rounded-2xl text-xs gap-1.5 h-9"
            >
              <Plus className="w-4 h-4" />
              Apply Medical Leave
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leaves.map((leave) => (
              <div
                key={leave.id}
                className="rounded-3xl border border-border/60 bg-card p-5 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-primary">
                      {leave.leave_code}
                    </span>
                    <h4 className="text-base font-bold text-foreground mt-0.5">
                      {leave.total_days} Days Medical Leave
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    {leave.status}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">{leave.reason}</p>

                <div className="p-3 rounded-2xl bg-muted/40 border border-border/40 text-xs flex items-center justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-semibold text-foreground">
                    {leave.start_date} to {leave.end_date}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 text-muted-foreground">
                  <span>Sign-off: {leave.verified_by || "Medical Board"}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Waiver Credited
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Emergency Hotlines */}
      {activeTab === "emergency" && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-border/60 bg-card p-6 space-y-4">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Siren className="w-5 h-5 text-destructive" />
              Campus Emergency Hotlines & Ambulance Dispatch
            </h3>
            <p className="text-xs text-muted-foreground">
              Keep these numbers saved on speed-dial. Campus security & paramedics operate 24 hours a day, 365 days a year.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl border border-destructive/30 bg-destructive/5 space-y-2">
                <div className="text-xs font-bold uppercase text-destructive">
                  Campus Ambulance Direct
                </div>
                <div className="text-lg font-black text-foreground">
                  +91 98765 11108
                </div>
                <p className="text-[11px] text-muted-foreground">Average on-campus arrival: 3 minutes</p>
              </div>

              <div className="p-4 rounded-2xl border border-border/60 bg-muted/30 space-y-2">
                <div className="text-xs font-bold uppercase text-primary">
                  Infirmary Duty Desk
                </div>
                <div className="text-lg font-black text-foreground">
                  +91 98765 11100
                </div>
                <p className="text-[11px] text-muted-foreground">Triage, basic dressing, and first aid</p>
              </div>

              <div className="p-4 rounded-2xl border border-border/60 bg-muted/30 space-y-2">
                <div className="text-xs font-bold uppercase text-emerald-600">
                  Mental Wellness Helpline
                </div>
                <div className="text-lg font-black text-foreground">
                  +91 98765 11109
                </div>
                <p className="text-[11px] text-muted-foreground">Confidential 24/7 counseling support</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Medical Leave Modal */}
      {showLeaveModal && (
        <MedicalLeaveModal
          onClose={() => setShowLeaveModal(false)}
          onSuccess={(newLeave) => {
            setLeaves([newLeave, ...leaves]);
          }}
        />
      )}
    </div>
  );
}
