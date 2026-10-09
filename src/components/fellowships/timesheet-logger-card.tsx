"use client";

import React, { useState } from "react";
import { FellowshipTimesheet, DutyCategory } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Briefcase,
  FileText,
} from "lucide-react";

interface TimesheetLoggerCardProps {
  timesheets: FellowshipTimesheet[];
  onLogTimesheet: (data: {
    week_start_date: string;
    week_end_date: string;
    hours_logged: number;
    duty_type: DutyCategory;
    duty_summary: string;
  }) => void;
}

export function TimesheetLoggerCard({
  timesheets,
  onLogTimesheet,
}: TimesheetLoggerCardProps) {
  const [showForm, setShowForm] = useState(false);
  const [startDate, setStartDate] = useState("2026-10-13");
  const [endDate, setEndDate] = useState("2026-10-19");
  const [hours, setHours] = useState("12");
  const [dutyType, setDutyType] = useState<DutyCategory>("laboratory_supervision");
  const [summary, setSummary] = useState("");

  const handleLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) return;

    onLogTimesheet({
      week_start_date: startDate,
      week_end_date: endDate,
      hours_logged: parseFloat(hours) || 12,
      duty_type: dutyType,
      duty_summary: summary,
    });
    setSummary("");
    setShowForm(false);
  };

  const totalApprovedHours = timesheets
    .filter((t) => t.approval_status === "faculty_approved")
    .reduce((acc, t) => acc + t.hours_logged, 0);

  const getDutyLabel = (cat: string) => {
    switch (cat) {
      case "laboratory_supervision":
        return "Lab Supervision";
      case "tutorial_conduct":
        return "Tutorial Recitation";
      case "grading_assessments":
        return "Grading Homework";
      case "office_hours":
        return "Office Hours";
      case "research_experiments":
        return "Research Experiment";
      default:
        return cat;
    }
  };

  return (
    <Card className="border border-border/60 bg-card/60 backdrop-blur-md shadow-sm">
      <CardHeader className="pb-3 border-b border-border/40 bg-muted/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Weekly Duty Timesheet & Supervisor Sign-off
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            Log weekly hours conducted. Mandatory for monthly stipend DBT release.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold">
            {totalApprovedHours} hrs Verified
          </Badge>
          <Button
            size="sm"
            onClick={() => setShowForm(!showForm)}
            className="text-xs font-semibold h-8 flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            {showForm ? "Cancel" : "Log Week"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {showForm && (
          <form onSubmit={handleLog} className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-3 text-xs animate-in fade-in-50 duration-200">
            <h4 className="font-bold text-foreground flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-primary" />
              Submit Weekly Timesheet Entry
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Week Start</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-xs outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Week End</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-xs outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Hours Worked</label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="30"
                  required
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-xs outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Primary Duty Type</label>
              <select
                value={dutyType}
                onChange={(e) => setDutyType(e.target.value as DutyCategory)}
                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-xs outline-none"
              >
                <option value="laboratory_supervision">Laboratory Supervision & Hands-on</option>
                <option value="tutorial_conduct">Tutorial Recitation & Problem Solving</option>
                <option value="grading_assessments">Grading Homework & Programming Submissions</option>
                <option value="office_hours">Doubts Office Hours</option>
                <option value="research_experiments">Research Experiments & Model Training</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Summary of Duties Conducted</label>
              <textarea
                required
                rows={2}
                placeholder="Mention specific lab batch, assignment topic, or recitation problems covered..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full p-2.5 rounded-md border border-input bg-background text-xs outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs font-semibold">
                Submit Timesheet
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-2.5">
          {timesheets.map((sheet) => {
            const isApproved = sheet.approval_status === "faculty_approved";
            const isSubmitted = sheet.approval_status === "submitted";

            return (
              <div
                key={sheet.id}
                className="p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/20 transition-all space-y-2 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-foreground flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      {sheet.week_start_date} to {sheet.week_end_date}
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                      {getDutyLabel(sheet.duty_type)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-foreground">{sheet.hours_logged} hrs</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold ${
                        isApproved
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          : isSubmitted
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                          : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30"
                      }`}
                    >
                      {isApproved ? "Approved" : isSubmitted ? "Pending Review" : "Rejected"}
                    </Badge>
                  </div>
                </div>

                <p className="text-muted-foreground text-xs leading-relaxed">
                  {sheet.duty_summary}
                </p>

                {sheet.supervisor_feedback && (
                  <div className="pt-1 text-[11px] text-muted-foreground flex items-center gap-1.5 border-t border-border/30">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span>Proctor Note: {sheet.supervisor_feedback}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
