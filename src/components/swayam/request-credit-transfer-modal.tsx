"use client";

import React, { useState } from "react";
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
import { ArrowRight, GraduationCap } from "lucide-react";

interface RequestCreditTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

export function RequestCreditTransferModal({
  isOpen,
  onClose,
  onSuccess,
}: RequestCreditTransferModalProps) {
  const [studentName, setStudentName] = useState("Aaditya S. Verma");
  const [rollNumber, setRollNumber] = useState("22CS084");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [swayamCode, setSwayamCode] = useState("noc26-cs42");
  const [swayamTitle, setSwayamTitle] = useState("Deep Learning for Computer Vision & Multimodal AI");
  const [curriculumCourse, setCurriculumCourse] = useState("CS-602: Advanced Deep Learning & Neural Architectures");
  const [credits, setCredits] = useState<2 | 3 | 4>(4);
  const [grade, setGrade] = useState<"O" | "A+" | "A" | "B+" | "B">("O");
  const [apaarId, setApaarId] = useState("APAAR-2026-6612-9901");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/swayam/credit-transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cert_token: `NPTEL-CERT-2026-GLD-${Math.floor(1000 + Math.random() * 9000)}`,
          student_name: studentName,
          roll_number: rollNumber,
          department,
          swayam_course_code: swayamCode,
          swayam_course_title: swayamTitle,
          equivalent_curriculum_course: curriculumCourse,
          credits_transferred: credits,
          grade_awarded: grade,
          bos_approval_date: new Date().toISOString().split("T")[0],
          academic_council_ref: "AC-RES-2026-06-ITEM-08B",
          approval_status: "approved_transferred",
          abc_sync_status: "synced_abc",
          apaar_id: apaarId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess(data.data);
        onClose();
      }
    } catch (err) {
      console.error("Failed to submit credit transfer", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="h-5 w-5 text-emerald-500" />
            NEP 2020 Academic Credit Transfer Application
          </DialogTitle>
          <DialogDescription>
            Submit course equivalence for Board of Studies (BoS) ratification and Academic Bank of Credits (ABC) deposit.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="sName" className="text-xs">Student Full Name</Label>
              <Input
                id="sName"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sRoll" className="text-xs">Roll Number</Label>
              <Input
                id="sRoll"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="sDept" className="text-xs">Department</Label>
              <Input
                id="sDept"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sApaar" className="text-xs">APAAR / ABC ID</Label>
              <Input
                id="sApaar"
                value={apaarId}
                onChange={(e) => setApaarId(e.target.value)}
                required
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="swTitle" className="text-xs">SWAYAM / NPTEL Course Title</Label>
            <Input
              id="swTitle"
              value={swayamTitle}
              onChange={(e) => setSwayamTitle(e.target.value)}
              required
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="currCourse" className="text-xs">Equivalent Institutional Curriculum Course</Label>
            <Input
              id="currCourse"
              value={curriculumCourse}
              onChange={(e) => setCurriculumCourse(e.target.value)}
              required
              className="h-8 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="credits" className="text-xs">Credits to Transfer</Label>
              <select
                id="credits"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value) as 2 | 3 | 4)}
                className="w-full h-8 text-xs rounded-md border border-input bg-background px-2"
              >
                <option value={2}>2 Academic Credits</option>
                <option value={3}>3 Academic Credits</option>
                <option value={4}>4 Academic Credits</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="grade" className="text-xs">Consolidated Grade</Label>
              <select
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value as any)}
                className="w-full h-8 text-xs rounded-md border border-input bg-background px-2"
              >
                <option value="O">O (Outstanding 90%+ / Grade O)</option>
                <option value="A+">A+ (Excellent 80-89%)</option>
                <option value="A">A (Very Good 70-79%)</option>
                <option value="B+">B+ (Good 60-69%)</option>
                <option value="B">B (Above Average 50-59%)</option>
              </select>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {submitting ? "Submitting..." : "Submit for BoS Ratification"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
