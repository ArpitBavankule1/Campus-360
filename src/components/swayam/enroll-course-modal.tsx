"use client";

import React, { useState } from "react";
import { SwayamCourse, SwayamRole } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User, Sparkles } from "lucide-react";

interface EnrollCourseModalProps {
  course: SwayamCourse | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

export function EnrollCourseModal({
  course,
  isOpen,
  onClose,
  onSuccess,
}: EnrollCourseModalProps) {
  const [userName, setUserName] = useState("Kavya N. Murthy");
  const [rollNumber, setRollNumber] = useState("23CS105");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [academicYear, setAcademicYear] = useState("Second Year (Sem 4)");
  const [role, setRole] = useState<SwayamRole>("student");
  const [examCity, setExamCity] = useState("Bengaluru Central (Test Center 2)");
  const [submitting, setSubmitting] = useState(false);

  if (!course) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!course) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/swayam/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: userName,
          roll_number: rollNumber,
          department,
          academic_year: academicYear,
          course_code: course.course_code,
          course_title: course.course_title,
          role,
          enrollment_status: "enrolled",
          assignment_avg_score: 85.0,
          hall_ticket_no: `NPTEL-HT-2026-${Math.floor(100000 + Math.random() * 900000)}`,
          exam_city: examCity,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess(data.data);
        onClose();
      }
    } catch (err) {
      console.error("Failed to enroll in course", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-blue-500" />
            SWAYAM Course Enrollment
          </DialogTitle>
          <DialogDescription>
            Register for national proctored certification via Local Chapter LC-4109.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Selected Course Preview */}
          <div className="p-3 bg-muted/40 rounded-lg border border-border/50 text-xs space-y-1">
            <div className="font-semibold text-foreground">{course.course_title}</div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Code: {course.course_code}</span>
              <Badge variant="outline" className="text-[10px]">
                {course.offering_institute}
              </Badge>
            </div>
            <div className="text-[11px] text-blue-500 font-medium">
              Equivalency: {course.credit_equivalency} Academic Credits
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="userName" className="text-xs">Learner Name</Label>
              <Input
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rollNumber" className="text-xs">Roll / Employee ID</Label>
              <Input
                id="rollNumber"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="department" className="text-xs">Department</Label>
              <Input
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-xs">Role Category</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as SwayamRole)}
                className="w-full h-8 text-xs rounded-md border border-input bg-background px-2"
              >
                <option value="student">Student (Credit Transfer)</option>
                <option value="faculty">Faculty (AICTE FDP / CAS)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="examCity" className="text-xs">Preferred Exam City Center</Label>
            <Input
              id="examCity"
              value={examCity}
              onChange={(e) => setExamCity(e.target.value)}
              required
              className="h-8 text-xs"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {submitting ? "Registering..." : "Confirm Enrollment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
