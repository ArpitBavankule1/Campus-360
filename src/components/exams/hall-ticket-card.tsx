"use client";

import React, { useRef } from "react";
import {
  Printer,
  QrCode,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  User,
  AlertTriangle,
  GraduationCap,
  Download,
} from "lucide-react";
import { ExamHallTicket } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HallTicketCardProps {
  ticket: ExamHallTicket;
}

export const HallTicketCard: React.FC<HallTicketCardProps> = ({ ticket }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-xs px-2.5 py-0.5 border-emerald-500/30 text-emerald-500 bg-emerald-500/10 font-semibold"
          >
            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified Candidate
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">
            ID: {ticket.hall_ticket_number}
          </span>
        </div>

        <Button
          size="sm"
          onClick={handlePrint}
          className="gap-1.5 text-xs font-semibold shadow-sm hover:shadow"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Export PDF</span>
        </Button>
      </div>

      {/* Main Printable Admit Card Container */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-3xl border-2 border-border/80 bg-card p-6 md:p-8 shadow-xl print:m-0 print:p-6 print:border-black print:shadow-none"
      >
        {/* Decorative Institutional Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b-2 border-border/80 gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground block">
                Office of the Controller of Examinations
              </span>
              <h2 className="text-lg md:text-xl font-extrabold text-foreground tracking-tight">
                Apex Institute of Technology — CampusLens AI
              </h2>
              <p className="text-xs font-semibold text-primary mt-0.5">
                {ticket.semester}
              </p>
            </div>
          </div>

          <div className="text-right flex md:flex-col items-center md:items-end justify-between gap-1 shrink-0">
            <span className="text-[10px] text-muted-foreground uppercase font-mono">
              Admit Card Serial
            </span>
            <span className="font-mono text-xs md:text-sm font-bold text-foreground bg-muted/60 px-2.5 py-1 rounded-lg border border-border/60">
              {ticket.hall_ticket_number}
            </span>
          </div>
        </div>

        {/* Candidate Meta Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-5 border-b border-border/60 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">
              Candidate Full Name
            </span>
            <div className="font-bold text-foreground text-sm">
              {ticket.student_name}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">
              Enrollment Roll Number
            </span>
            <div className="font-mono font-bold text-primary text-sm">
              {ticket.roll_number}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">
              Academic Program
            </span>
            <div className="font-medium text-foreground">
              {ticket.enrolled_program}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">
              Exam Center & Hall
            </span>
            <div className="font-medium text-foreground">
              {ticket.exam_center}
            </div>
          </div>
        </div>

        {/* Eligibility & Clearances Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-4 border-b border-border/60 text-xs">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <div>
              <span className="text-[10px] font-semibold block uppercase">
                Attendance Metric
              </span>
              <strong>{ticket.attendance_percentage}% (Eligible)</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <div>
              <span className="text-[10px] font-semibold block uppercase">
                Semester Accounts
              </span>
              <strong>Tuition & Lab Dues Cleared</strong>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 flex items-center gap-2 p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <QrCode className="w-4 h-4 shrink-0" />
            <div>
              <span className="text-[10px] font-semibold block uppercase">
                Security Hologram
              </span>
              <strong className="font-mono text-[11px]">RFID Cryptotoken Active</strong>
            </div>
          </div>
        </div>

        {/* Exam Papers Table */}
        <div className="py-5 space-y-3">
          <h3 className="font-bold text-sm text-foreground uppercase tracking-wide">
            Registered Examination Papers
          </h3>

          <div className="overflow-x-auto rounded-xl border border-border/70">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/60 text-muted-foreground border-b border-border/60 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">Paper Code</th>
                  <th className="p-3">Subject Description</th>
                  <th className="p-3">Exam Date</th>
                  <th className="p-3">Time Window</th>
                  <th className="p-3">Hall / Room</th>
                  <th className="p-3 text-center">Invigilator Sign</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {ticket.schedules.map((paper) => (
                  <tr key={paper.id} className="hover:bg-muted/30">
                    <td className="p-3 font-mono font-bold text-primary">
                      {paper.subject_code}
                    </td>
                    <td className="p-3 font-semibold text-foreground">
                      {paper.subject_name}
                      <span className="block text-[10px] text-muted-foreground font-normal">
                        Max Marks: {paper.total_marks} • Type: {paper.exam_type.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-foreground whitespace-nowrap">
                      {paper.exam_date}
                    </td>
                    <td className="p-3 whitespace-nowrap text-muted-foreground">
                      {paper.start_time} - {paper.end_time}
                    </td>
                    <td className="p-3 font-medium text-foreground">
                      {paper.room_number}
                    </td>
                    <td className="p-3 text-center border-l border-border/60 w-32">
                      <div className="h-6 border-b border-dashed border-border/60" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security QR & Instructions Footer */}
        <div className="pt-4 border-t-2 border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5 flex-1 text-[11px] text-muted-foreground">
            <span className="font-semibold text-foreground flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Candidate Examination Instructions:
            </span>
            <ul className="list-disc pl-4 space-y-0.5">
              {ticket.instructions.slice(0, 3).map((inst, i) => (
                <li key={i}>{inst}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/40 border border-border/60 shrink-0">
            <div className="p-2 rounded-xl bg-background border border-border text-foreground">
              <QrCode className="w-12 h-12 text-primary" />
            </div>
            <div className="text-left space-y-0.5">
              <span className="text-[9px] uppercase font-mono text-muted-foreground block">
                Digital Verification
              </span>
              <span className="font-mono text-[10px] font-bold text-foreground block">
                {ticket.qr_verification_code.slice(0, 16)}...
              </span>
              <span className="text-[10px] text-emerald-500 font-semibold block">
                ✓ Cryptographically Signed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
