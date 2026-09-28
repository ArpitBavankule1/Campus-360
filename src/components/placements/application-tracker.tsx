"use client";

import React from "react";
import {
  PlacementApplication,
  PlacementInterviewRound,
} from "@/types";
import {
  Building2,
  Calendar,
  Clock,
  Video,
  FileCheck,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Info,
} from "lucide-react";

interface ApplicationTrackerProps {
  applications: PlacementApplication[];
  interviewRounds: PlacementInterviewRound[];
}

export function ApplicationTracker({
  applications,
  interviewRounds,
}: ApplicationTrackerProps) {
  const steps = [
    { key: "applied", label: "Applied" },
    { key: "shortlisted", label: "Resume Shortlisted" },
    { key: "assessment_scheduled", label: "Online Assessment" },
    { key: "interview_scheduled", label: "Interviews" },
    { key: "offered", label: "Offer Extended" },
  ];

  function getStepIndex(status: string): number {
    switch (status) {
      case "applied":
        return 0;
      case "shortlisted":
        return 1;
      case "assessment_scheduled":
        return 2;
      case "interview_scheduled":
        return 3;
      case "offered":
        return 4;
      default:
        return 0;
    }
  }

  return (
    <div className="space-y-6">
      {/* Active Applications Section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-primary" />
          Active Drive Applications ({applications.length})
        </h3>

        {applications.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-2xl bg-card/40 text-muted-foreground">
            No active placement applications yet. Explore the drives tab and apply!
          </div>
        ) : (
          applications.map((app) => {
            const currentIdx = getStepIndex(app.status);
            const drive = app.drive;

            return (
              <div
                key={app.id}
                className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-6 shadow-sm space-y-4"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground">
                        {drive?.company_name || "Enterprise Partner"}
                      </h4>
                      <p className="text-xs text-muted-foreground font-medium">
                        {drive?.role_title || "Engineering Role"} • Applied on{" "}
                        {new Date(app.applied_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full capitalize">
                      {app.status.replace("_", " ")}
                    </span>
                    {drive?.ctc_lpa ? (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                        ₹{drive.ctc_lpa} LPA
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Visual Stepper Pipeline */}
                <div className="py-2">
                  <div className="grid grid-cols-5 gap-2 relative">
                    {steps.map((step, idx) => {
                      const isCompleted = idx < currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={step.key} className="flex flex-col items-center text-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border ${
                              isCompleted
                                ? "bg-emerald-500 text-white border-emerald-500"
                                : isCurrent
                                ? "bg-primary text-primary-foreground border-primary ring-4 ring-primary/20"
                                : "bg-muted text-muted-foreground border-border"
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[11px] mt-2 font-medium leading-tight ${
                              isCurrent
                                ? "text-primary font-bold"
                                : isCompleted
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Notes & Feedback */}
                {app.notes ? (
                  <div className="text-xs p-3 rounded-xl bg-muted/40 border border-border/40 text-muted-foreground flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary shrink-0" />
                    <span>{app.notes}</span>
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>

      {/* Scheduled Interview Rounds & Assessments */}
      <div className="space-y-4 pt-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Scheduled Rounds & Assessments ({interviewRounds.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interviewRounds.map((rnd) => {
            const dateObj = new Date(rnd.scheduled_at);
            const dateStr = dateObj.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const timeStr = dateObj.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={rnd.id}
                className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                      {rnd.company_name} • Round {rnd.round_number}
                    </span>
                    <h4 className="text-sm font-bold text-foreground mt-0.5">
                      {rnd.round_name}
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      rnd.status === "cleared"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : rnd.status === "scheduled"
                        ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {rnd.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground py-1 border-y border-border/40">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>{dateStr}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>{timeStr} ({rnd.duration_minutes} mins)</span>
                  </div>
                </div>

                {rnd.feedback ? (
                  <p className="text-xs text-muted-foreground italic bg-muted/30 p-2.5 rounded-lg border border-border/30">
                    💡 {rnd.feedback}
                  </p>
                ) : null}

                {rnd.venue_or_link ? (
                  <div className="pt-1">
                    <a
                      href={rnd.venue_or_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
                    >
                      <Video className="w-3.5 h-3.5" />
                      Join Assessment / Meet Room
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
