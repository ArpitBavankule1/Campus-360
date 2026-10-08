"use client";

import React, { useState } from "react";
import {
  GuardianProfile,
  WardTelemetry,
  GuardianOutpassApproval,
  PTMConsultationSlot,
} from "@/types";
import {
  getGuardianProfile,
  getWardTelemetry,
  getGuardianOutpasses,
  getPTMConsultationSlots,
  approveGuardianOutpass,
  rejectGuardianOutpass,
} from "@/lib/parents/parents-engine";
import { WardTelemetryCard } from "@/components/parents/ward-telemetry-card";
import { OutpassApprovalCard } from "@/components/parents/outpass-approval-card";
import { BookPTMModal } from "@/components/parents/book-ptm-modal";
import { ProctorMessageModal } from "@/components/parents/proctor-message-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HeartHandshake,
  GraduationCap,
  CalendarCheck,
  Clock,
  ShieldCheck,
  UserCheck,
  PhoneCall,
  BellRing,
  CreditCard,
  MessageSquare,
  Building,
  AlertTriangle,
  Video,
  ExternalLink,
  Receipt,
  FileCheck2,
} from "lucide-react";

export default function ParentsPortalPage() {
  const [guardian] = useState<GuardianProfile>(getGuardianProfile());
  const [ward] = useState<WardTelemetry>(getWardTelemetry());
  const [outpasses, setOutpasses] = useState<GuardianOutpassApproval[]>(getGuardianOutpasses());
  const [ptmSlots, setPtmSlots] = useState<PTMConsultationSlot[]>(getPTMConsultationSlots());

  const [activeTab, setActiveTab] = useState<"telemetry" | "outpasses" | "ptm" | "advisories">("telemetry");

  const [isBookPTMOpen, setIsBookPTMOpen] = useState(false);
  const [isProctorMsgOpen, setIsProctorMsgOpen] = useState(false);

  const pendingOutpasses = outpasses.filter((o) => o.guardian_status === "pending");

  const handleApproveOutpass = (outpassId: string, remarks: string) => {
    approveGuardianOutpass(outpassId, remarks);
    setOutpasses(getGuardianOutpasses());
  };

  const handleRejectOutpass = (outpassId: string, remarks: string) => {
    rejectGuardianOutpass(outpassId, remarks);
    setOutpasses(getGuardianOutpasses());
  };

  const handleBookPTMSuccess = (newSlot: PTMConsultationSlot) => {
    setPtmSlots([newSlot, ...ptmSlots]);
  };

  return (
    <div className="min-h-screen bg-background/50 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 pt-6">
      {/* Top Banner / Header */}
      <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 sm:p-8 backdrop-blur-xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="bg-primary/15 text-primary border-primary/30 px-3 py-1 text-xs font-semibold">
                Phase 43 Gateway
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-medium">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Verified Guardian Portal
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Parent & Guardian Connect Hub
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Real-time academic performance telemetry, statutory 75% attendance audit, digital hostel out-pass authorizations, and direct proctor consultations for enrolled scholars.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsProctorMsgOpen(true)}
              className="text-xs bg-background/80 hover:bg-background shadow-xs border-border/80"
            >
              <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-primary" />
              Message Proctor
            </Button>
            <Button
              size="sm"
              onClick={() => setIsBookPTMOpen(true)}
              className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
            >
              <CalendarCheck className="h-3.5 w-3.5 mr-1.5" />
              Schedule PTM
            </Button>
          </div>
        </div>

        {/* Guardian Profile Strip */}
        <div className="mt-6 pt-4 border-t border-border/40 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-primary" />
            <span>
              Authenticated Guardian: <strong className="text-foreground">{guardian.guardian_name}</strong> ({guardian.relationship})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-primary" />
            <span>
              Enrolled Ward: <strong className="text-foreground">{ward.student_name}</strong> ({ward.roll_number})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-emerald-500" />
            <span>
              Hostel Warden SOS Helpline: <strong className="text-foreground">+91 11 2659 7000</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Overview Metric Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Ward Overall Attendance</p>
              <h3 className="text-2xl font-black mt-1 text-foreground">
                {ward.overall_attendance_pct.toFixed(1)}%
              </h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                <span>Statutory mandate (&gt;75%) met</span>
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <CalendarCheck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card/60 backdrop-blur-md shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Cumulative CGPA</p>
              <h3 className="text-2xl font-black mt-1 text-foreground">
                {ward.cumulative_cgpa.toFixed(2)} / 10
              </h3>
              <p className="text-[11px] text-primary mt-0.5">
                Dean&apos;s Honor Distinction
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <GraduationCap className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card/60 backdrop-blur-md shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Out-Pass Approvals</p>
              <h3 className="text-2xl font-black mt-1 text-foreground">
                {pendingOutpasses.length} Pending
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {outpasses.length} Total Semester Requests
              </p>
            </div>
            <div
              className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                pendingOutpasses.length > 0
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card/60 backdrop-blur-md shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">PTM & Consultations</p>
              <h3 className="text-2xl font-black mt-1 text-foreground">
                {ptmSlots.length} Booked
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                With {ward.assigned_proctor_name}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <HeartHandshake className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-border/60 space-x-1 sm:space-x-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab("telemetry")}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "telemetry"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <CalendarCheck className="h-4 w-4" />
          Ward Academic & Attendance
        </button>

        <button
          onClick={() => setActiveTab("outpasses")}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "outpasses"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Clock className="h-4 w-4" />
          Hostel Out-Pass Approvals
          {pendingOutpasses.length > 0 && (
            <Badge className="h-5 px-1.5 text-[10px] bg-amber-500 text-white rounded-full">
              {pendingOutpasses.length}
            </Badge>
          )}
        </button>

        <button
          onClick={() => setActiveTab("ptm")}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "ptm"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <HeartHandshake className="h-4 w-4" />
          Proctor & PTM Consultations
        </button>

        <button
          onClick={() => setActiveTab("advisories")}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === "advisories"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BellRing className="h-4 w-4" />
          Advisories & Fee Receipts
        </button>
      </div>

      {/* Tab 1: Ward Telemetry */}
      {activeTab === "telemetry" && (
        <div className="space-y-6">
          <WardTelemetryCard
            ward={ward}
            onSchedulePTM={() => setIsBookPTMOpen(true)}
            onSendMessage={() => setIsProctorMsgOpen(true)}
          />

          {/* Academic Examination Eligibility Summary */}
          <Card className="border border-border/60 bg-card/60 backdrop-blur-md shadow-xs">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <FileCheck2 className="h-4 w-4 text-emerald-500" />
                    Semester V Examination Admittance Standing
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Hall Ticket Status: <strong className="text-emerald-600 dark:text-emerald-400">PROVISIONALLY CLEARED</strong>.
                    Academic dues cleared and overall attendance exceeds the statutory threshold.
                  </p>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs py-1 px-3">
                  Admittance Pass: CL-EXAM-2026-V-OK
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Outpasses */}
      {activeTab === "outpasses" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold">Hostel Overnight Leave Requests</h3>
              <p className="text-xs text-muted-foreground">
                In compliance with residential hall policy, overnight excursions require explicit guardian authorization.
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {outpasses.length} Total Leave Records
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {outpasses.map((op) => (
              <OutpassApprovalCard
                key={op.id}
                outpass={op}
                onApprove={handleApproveOutpass}
                onReject={handleRejectOutpass}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Proctor & PTM */}
      {activeTab === "ptm" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold">Academic Proctor Consultations</h3>
              <p className="text-xs text-muted-foreground">
                Scheduled 1-on-1 progress discussions with {ward.assigned_proctor_name}.
              </p>
            </div>
            <Button size="sm" onClick={() => setIsBookPTMOpen(true)} className="text-xs">
              <CalendarCheck className="h-3.5 w-3.5 mr-1" />
              Book New Appointment
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ptmSlots.map((slot) => (
              <Card key={slot.id} className="border border-border/60 bg-card/60 backdrop-blur-md shadow-xs">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                        {slot.booking_token}
                      </span>
                      <h4 className="font-bold text-sm mt-2">{slot.faculty_proctor_name}</h4>
                      <p className="text-xs text-muted-foreground">{slot.faculty_proctor_designation}</p>
                    </div>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs">
                      {slot.status}
                    </Badge>
                  </div>

                  <div className="p-3 bg-muted/40 rounded-xl space-y-1.5 text-xs">
                    <p className="text-muted-foreground">
                      <strong>Date & Time:</strong> {slot.scheduled_date} • {slot.time_slot}
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Mode:</strong> {slot.consultation_mode}
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Agenda:</strong> {slot.agenda}
                    </p>
                    {slot.proctor_notes && (
                      <p className="text-primary pt-1 border-t border-border/40">
                        <strong>Proctor Note:</strong> {slot.proctor_notes}
                      </p>
                    )}
                  </div>

                  {slot.meeting_link && (
                    <a
                      href={slot.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-lg border border-primary/40 bg-background px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Video className="h-3.5 w-3.5 mr-1.5" />
                      Join Virtual Meeting (Google Meet)
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Advisories & Receipts */}
      {activeTab === "advisories" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fee Receipts & Accounts */}
            <Card className="border border-border/60 bg-card/60 backdrop-blur-md shadow-xs">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-primary" />
                    <h4 className="font-bold text-sm">Tuition & Hostel Fee Account</h4>
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs">
                    Cleared
                  </Badge>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-border/30">
                    <span className="text-muted-foreground">Semester V Academic Tuition Fee</span>
                    <span className="font-mono font-semibold">₹1,10,000 (Paid)</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border/30">
                    <span className="text-muted-foreground">Aryabhatta Hall Hostel & Mess Charges</span>
                    <span className="font-mono font-semibold">₹45,000 (Paid)</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border/30">
                    <span className="text-muted-foreground">Special Examination & Lab Evaluation Fee</span>
                    <span className="font-mono font-semibold">₹2,500 (Paid)</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 font-bold text-sm">
                    <span>Outstanding Balance Due</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono">₹0.00</span>
                  </div>
                </div>

                <div className="p-3 bg-muted/30 rounded-xl text-xs text-muted-foreground flex items-center justify-between">
                  <span>Official Receipt: <strong>REC-2026-SEM5-8491</strong></span>
                  <Badge variant="outline" className="text-[10px]">Tax Exempt 80G</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Official Advisories for Parents */}
            <Card className="border border-border/60 bg-card/60 backdrop-blur-md shadow-xs">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div className="flex items-center gap-2">
                    <BellRing className="h-4 w-4 text-primary" />
                    <h4 className="font-bold text-sm">Institutional Advisories for Parents</h4>
                  </div>
                  <Badge variant="outline" className="text-xs">Active Circulars</Badge>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-background/50 border border-border/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">Diwali Festival Recess Advisory</span>
                      <span className="text-[10px] text-muted-foreground">Oct 16, 2026</span>
                    </div>
                    <p className="text-muted-foreground">
                      Hostel gates close for Diwali break on Oct 16 at 20:00 IST. Normal classes resume on Oct 20.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-background/50 border border-border/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">Annual Proctor-Parent Meet (Hybrid)</span>
                      <span className="text-[10px] text-muted-foreground">Oct 24, 2026</span>
                    </div>
                    <p className="text-muted-foreground">
                      Dean of Academic Welfare welcomes parents for the Autumn term progress symposium.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-background/50 border border-border/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">End-Semester Final Exam Schedule Published</span>
                      <span className="text-[10px] text-muted-foreground">Nov 02, 2026</span>
                    </div>
                    <p className="text-muted-foreground">
                      Hall ticket admittance and exam timetable available in the examinations portal.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Modals */}
      <BookPTMModal
        isOpen={isBookPTMOpen}
        onClose={() => setIsBookPTMOpen(false)}
        onBookSuccess={handleBookPTMSuccess}
        assignedProctorName={ward.assigned_proctor_name}
      />

      <ProctorMessageModal
        isOpen={isProctorMsgOpen}
        onClose={() => setIsProctorMsgOpen(false)}
        proctorName={ward.assigned_proctor_name}
        wardName={ward.student_name}
      />
    </div>
  );
}
