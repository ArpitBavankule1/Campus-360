"use client";

import React, { useState } from "react";
import { FellowshipPosition } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Sparkles,
  IndianRupee,
  Clock,
  Send,
  CheckCircle2,
} from "lucide-react";

interface ApplyFellowshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: FellowshipPosition | null;
  onSubmit: (data: {
    position_id: string;
    student_name: string;
    roll_number: string;
    department: string;
    student_cgpa: number;
    course_grade: string;
    statement_of_purpose: string;
    portfolio_url?: string;
    weekly_availability_hours: number;
  }) => void;
}

export function ApplyFellowshipModal({
  isOpen,
  onClose,
  position,
  onSubmit,
}: ApplyFellowshipModalProps) {
  const [studentName, setStudentName] = useState("Aarav Sharma");
  const [rollNumber, setRollNumber] = useState("2024BCSE042");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [cgpa, setCgpa] = useState("8.84");
  const [grade, setGrade] = useState("A+");
  const [sop, setSop] = useState("");
  const [portfolio, setPortfolio] = useState("https://github.com/aarav-apex");
  const [hours, setHours] = useState("12");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!position) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sop.trim()) return;

    setIsSubmitting(true);
    onSubmit({
      position_id: position.id,
      student_name: studentName,
      roll_number: rollNumber,
      department,
      student_cgpa: parseFloat(cgpa) || 8.5,
      course_grade: grade,
      statement_of_purpose: sop,
      portfolio_url: portfolio,
      weekly_availability_hours: parseInt(hours) || 12,
    });
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setSop("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg sm:max-w-xl max-h-[90vh] overflow-y-auto border border-border/80 bg-background/95 backdrop-blur-xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              {position.academic_term}
            </Badge>
            <span className="text-xs text-muted-foreground">App ID: #{position.id}</span>
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            Apply: {position.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Submit your candidacy for faculty review and departmental appointment.
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">Application Lodged!</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Your dossier has been transmitted to <strong>{position.faculty_supervisor_name}</strong>.
                You will receive proctor updates via your scholar portal.
              </p>
            </div>
            <Button onClick={handleClose} className="text-xs font-semibold">
              Return to Positions
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="p-3 rounded-lg bg-muted/40 border border-border/40 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Supervisor:</span>
                <span className="font-semibold text-foreground">{position.faculty_supervisor_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Stipend:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
                  <IndianRupee className="w-3 h-3 mr-0.5" />
                  ₹{position.monthly_stipend_inr.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Weekly Commitment:</span>
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3 text-primary" />
                  {position.required_hours_per_week} hrs/week
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Candidate Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md border border-input bg-background text-xs focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Roll Number</label>
                <input
                  type="text"
                  required
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md border border-input bg-background text-xs focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Cumulative CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md border border-input bg-background text-xs focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Prerequisite Grade</label>
                <input
                  type="text"
                  required
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md border border-input bg-background text-xs focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-muted-foreground">Statement of Purpose & Teaching Fit</label>
              <textarea
                required
                rows={3}
                placeholder="Describe your subject mastery, motivation, and prior mentoring or lab experience..."
                value={sop}
                onChange={(e) => setSop(e.target.value)}
                className="w-full p-2.5 rounded-md border border-input bg-background text-xs focus:ring-1 focus:ring-primary outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Portfolio / GitHub / Paper URL</label>
                <input
                  type="url"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full px-3 py-1.5 rounded-md border border-input bg-background text-xs focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Available Hours / Week</label>
                <input
                  type="number"
                  min="6"
                  max="20"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md border border-input bg-background text-xs focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={handleClose} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !sop.trim()} className="text-xs font-semibold flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
