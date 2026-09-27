"use client";

import React, { useState, useEffect } from "react";
import { PortalLayout } from "@/components/layout/portal-layout";
import {
  MOCK_STUDENT_HALL_TICKET,
  MOCK_EXAM_SCHEDULES,
  MOCK_SEATING_ALLOCATIONS,
  MOCK_SEMESTER_5_TRANSCRIPT,
} from "@/lib/exams/exam-engine";
import {
  ExamHallTicket,
  ExamSchedule,
  ExamSeating,
  SemesterTranscriptSummary,
} from "@/types";
import { HallTicketCard } from "@/components/exams/hall-ticket-card";
import { SeatingMatrixLookup } from "@/components/exams/seating-matrix-lookup";
import { GradeTranscriptView } from "@/components/exams/grade-transcript-view";
import { GpaTargetSimulator } from "@/components/exams/gpa-target-simulator";
import { ExamScheduleTimeline } from "@/components/exams/exam-schedule-timeline";
import {
  GraduationCap,
  FileText,
  Armchair,
  Award,
  Calculator,
  Calendar,
  Sparkles,
  ShieldCheck,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ExaminationsPage() {
  const [activeTab, setActiveTab] = useState<
    "hall-ticket" | "schedule" | "seating" | "grades" | "simulator"
  >("hall-ticket");

  const [ticket, setTicket] = useState<ExamHallTicket>(MOCK_STUDENT_HALL_TICKET);
  const [schedules, setSchedules] = useState<ExamSchedule[]>(MOCK_EXAM_SCHEDULES);
  const [seating, setSeating] = useState<ExamSeating[]>(MOCK_SEATING_ALLOCATIONS);
  const [transcript, setTranscript] = useState<SemesterTranscriptSummary>(
    MOCK_SEMESTER_5_TRANSCRIPT
  );

  // Fetch live from API or fallback
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketRes, schedulesRes, seatingRes, gradesRes] =
          await Promise.all([
            fetch("/api/exams/hall-ticket"),
            fetch("/api/exams/schedules"),
            fetch("/api/exams/seating"),
            fetch("/api/exams/grades"),
          ]);

        const ticketData = await ticketRes.json();
        if (ticketData.success && ticketData.data) setTicket(ticketData.data);

        const schedulesData = await schedulesRes.json();
        if (schedulesData.success && schedulesData.data)
          setSchedules(schedulesData.data);

        const seatingData = await seatingRes.json();
        if (seatingData.success && seatingData.data) setSeating(seatingData.data);

        const gradesData = await gradesRes.json();
        if (gradesData.success && gradesData.data) setTranscript(gradesData.data);
      } catch {
        // use fallback data already initialized
      }
    };

    fetchData();
  }, []);

  const handleRequestRevaluation = async (subjectCode: string) => {
    try {
      const res = await fetch("/api/exams/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject_code: subjectCode }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setTranscript(data.data);
      }
    } catch {
      // optimistic update
      setTranscript((prev) => ({
        ...prev,
        records: prev.records.map((r) =>
          r.subject_code === subjectCode
            ? { ...r, status: "under_revaluation" as const }
            : r
        ),
      }));
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6 pb-12">
        {/* Hero Header Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card/80 to-primary/5 p-6 md:p-8 shadow-sm">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-xs px-2.5 py-0.5 border-primary/30 text-primary bg-primary/10 font-semibold"
                >
                  <Sparkles className="w-3 h-3 mr-1" /> Phase 19
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs px-2.5 py-0.5 border-emerald-500/30 text-emerald-500 bg-emerald-500/10 font-medium"
                >
                  <ShieldCheck className="w-3 h-3 mr-1" /> Controller of Examinations
                </Badge>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                Examinations, Hall Tickets & Grade Transcripts
              </h1>

              <p className="text-sm text-muted-foreground max-w-xl">
                Access official examination admit cards, real-time classroom seating
                arrangements, semester grade point averages, and target GPA simulation.
              </p>
            </div>

            {/* Metric Overview Cards */}
            <div className="grid grid-cols-3 gap-2.5 shrink-0">
              <div className="p-3 rounded-2xl bg-background/80 border border-border/60 text-center">
                <span className="text-lg md:text-xl font-bold text-foreground block">
                  {schedules.length}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  Papers Registered
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-background/80 border border-border/60 text-center">
                <span className="text-lg md:text-xl font-bold text-primary block font-mono">
                  {transcript.cgpa.toFixed(2)}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  Current CGPA
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-background/80 border border-border/60 text-center">
                <span className="text-lg md:text-xl font-bold text-emerald-500 block font-mono">
                  {ticket.attendance_percentage}%
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  Admit Status
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* View Switcher Navigation Tabs */}
        <div className="border-b border-border/60 pb-3">
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-muted/50 border border-border/40 w-fit">
            <button
              onClick={() => setActiveTab("hall-ticket")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "hall-ticket"
                  ? "bg-card text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Admit Card / Hall Ticket</span>
            </button>

            <button
              onClick={() => setActiveTab("schedule")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "schedule"
                  ? "bg-card text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Exam Datesheet ({schedules.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("seating")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "seating"
                  ? "bg-card text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Armchair className="w-3.5 h-3.5" />
              <span>Live Seating Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab("grades")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "grades"
                  ? "bg-card text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Grades & Transcripts</span>
            </button>

            <button
              onClick={() => setActiveTab("simulator")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "simulator"
                  ? "bg-card text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Target GPA Planner</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Hall Ticket Admit Card */}
        {activeTab === "hall-ticket" && <HallTicketCard ticket={ticket} />}

        {/* Tab 2: Exam Schedule */}
        {activeTab === "schedule" && (
          <ExamScheduleTimeline schedules={schedules} />
        )}

        {/* Tab 3: Seating Matrix */}
        {activeTab === "seating" && (
          <SeatingMatrixLookup initialAllocations={seating} />
        )}

        {/* Tab 4: Grades & Transcripts */}
        {activeTab === "grades" && (
          <GradeTranscriptView
            transcript={transcript}
            onRequestRevaluation={handleRequestRevaluation}
          />
        )}

        {/* Tab 5: GPA Simulator */}
        {activeTab === "simulator" && <GpaTargetSimulator />}
      </div>
    </PortalLayout>
  );
}
