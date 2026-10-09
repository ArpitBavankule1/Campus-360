"use client";

import React from "react";
import { FellowshipApplication } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from "qrcode.react";
import {
  ShieldCheck,
  Award,
  Calendar,
  Building,
  CheckCircle2,
  Printer,
  X,
  IndianRupee,
} from "lucide-react";

interface FellowshipAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: FellowshipApplication | null;
}

export function FellowshipAppointmentModal({
  isOpen,
  onClose,
  application,
}: FellowshipAppointmentModalProps) {
  if (!application) return null;

  const apptToken = application.appointment_token || "CL-FEL-APPT-2026-8812";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border border-primary/30 bg-background/95 backdrop-blur-2xl shadow-2xl p-0 overflow-hidden">
        {/* Holographic Header Band */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 text-white text-center relative">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Award className="w-5 h-5 text-amber-300" />
            <span className="font-extrabold tracking-wider text-xs uppercase">
              Apex Institute of Technology
            </span>
          </div>
          <h2 className="text-base font-extrabold tracking-tight">
            Official Fellowship Appointment Pass
          </h2>
          <span className="text-[11px] text-blue-100 block">
            Office of Academic Deanery & Graduate Studies
          </span>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* QR Code & Token Section */}
          <div className="flex items-center justify-center flex-col p-4 rounded-xl bg-muted/40 border border-border/50 text-center space-y-2">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <QRCodeSVG
                value={`https://campuslens.ai/verify/fellowship/${apptToken}`}
                size={110}
                level="M"
              />
            </div>
            <div className="space-y-0.5">
              <span className="font-mono text-xs font-bold text-primary block">
                {apptToken}
              </span>
              <span className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Cryptographically Signed by Deanery
              </span>
            </div>
          </div>

          {/* Scholar Details */}
          <div className="space-y-2 p-3 rounded-lg bg-card border border-border/40">
            <div className="flex justify-between items-center pb-1 border-b border-border/30">
              <span className="text-muted-foreground">Appointed Scholar:</span>
              <strong className="text-foreground font-semibold">{application.student_name}</strong>
            </div>
            <div className="flex justify-between items-center pb-1 border-b border-border/30">
              <span className="text-muted-foreground">Roll Number:</span>
              <span className="font-mono font-bold text-foreground">{application.roll_number}</span>
            </div>
            <div className="flex justify-between items-center pb-1 border-b border-border/30">
              <span className="text-muted-foreground">Position Role:</span>
              <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                {application.position?.title || "Head Teaching Assistant"}
              </Badge>
            </div>
            <div className="flex justify-between items-center pb-1 border-b border-border/30">
              <span className="text-muted-foreground">Department:</span>
              <span className="text-foreground">{application.department}</span>
            </div>
            <div className="flex justify-between items-center pb-1 border-b border-border/30">
              <span className="text-muted-foreground">Faculty Mentor:</span>
              <strong className="text-foreground">{application.position?.faculty_supervisor_name || "Dr. Vikram Seth"}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Monthly Stipend:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
                <IndianRupee className="w-3 h-3 mr-0.5" />
                ₹{application.position?.monthly_stipend_inr.toLocaleString("en-IN") || "16,000"} / mo
              </strong>
            </div>
          </div>

          {/* Access Badges */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Authorized Campus Clearances
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>24/7 Lab Keycard Access</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Tier-1 Server Cluster</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Office Room Access</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                <span>Direct DBT Payroll</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
            <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
              Close Pass
            </Button>
            <Button size="sm" onClick={() => window.print()} className="text-xs font-semibold gap-1.5">
              <Printer className="w-3.5 h-3.5" />
              Print Appointment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
