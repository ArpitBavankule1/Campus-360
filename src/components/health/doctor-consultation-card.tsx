"use client";

import React from "react";
import { CampusDoctorSchedule } from "@/types";
import {
  Stethoscope,
  Clock,
  MapPin,
  CalendarCheck,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DoctorConsultationCardProps {
  doctor: CampusDoctorSchedule;
  onBookAppointment: (doctor: CampusDoctorSchedule) => void;
}

export function DoctorConsultationCard({
  doctor,
  onBookAppointment,
}: DoctorConsultationCardProps) {
  const getStatusBadge = () => {
    switch (doctor.activeStatus) {
      case "in_clinic":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-3 h-3" />
            In Clinic Now
          </span>
        );
      case "on_call":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
            <Clock className="w-3 h-3" />
            On Call
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground">
            Off Duty
          </span>
        );
    }
  };

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm space-y-4 transition-all hover:border-primary/40 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg">
            {doctor.name.replace("Dr. ", "").charAt(0)}
          </div>
          <div>
            <h4 className="text-base font-bold text-foreground">
              {doctor.name}
            </h4>
            <p className="text-xs text-primary font-medium">
              {doctor.specialization}
            </p>
          </div>
        </div>

        {getStatusBadge()}
      </div>

      <p className="text-xs text-muted-foreground">{doctor.qualifications}</p>

      <div className="space-y-1.5 p-3 rounded-2xl bg-muted/40 border border-border/40 text-xs">
        <div className="flex items-center gap-2 text-foreground font-medium">
          <Clock className="w-3.5 h-3.5 text-primary" />
          <span>
            {doctor.opdDays} • {doctor.opdTimings}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span>{doctor.roomNumber}</span>
        </div>
      </div>

      <Button
        onClick={() => onBookAppointment(doctor)}
        className="w-full rounded-2xl text-xs font-bold gap-1.5 h-9"
      >
        <CalendarCheck className="w-4 h-4" />
        Book OPD Consultation
      </Button>
    </div>
  );
}
