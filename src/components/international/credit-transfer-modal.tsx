"use client";

import React, { useState } from "react";
import { CreditTransferRequest } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Building2,
  FileCheck,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface CreditTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (request: CreditTransferRequest) => void;
}

export function CreditTransferModal({
  isOpen,
  onClose,
  onSuccess,
}: CreditTransferModalProps) {
  const [studentName, setStudentName] = useState("Arpit Bavankule");
  const [studentId, setStudentId] = useState("std-11111111-1111-4111-8111-111111111111");
  const [hostUniversity, setHostUniversity] = useState("ETH Zürich");
  const [foreignCode, setForeignCode] = useState("");
  const [foreignTitle, setForeignTitle] = useState("");
  const [foreignCredits, setForeignCredits] = useState("6");
  const [domesticCourse, setDomesticCourse] = useState("");
  const [domesticCredits, setDomesticCredits] = useState("4");
  const [gradeEarned, setGradeEarned] = useState("A (Distinction)");
  const [syllabusUrl, setSyllabusUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/international/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          student_name: studentName,
          host_university: hostUniversity,
          foreign_course_code: foreignCode,
          foreign_course_title: foreignTitle,
          credits_earned: Number(foreignCredits),
          equivalent_domestic_course: domesticCourse,
          equivalent_credits: Number(domesticCredits),
          grade_earned: gradeEarned,
          syllabus_document_url: syllabusUrl || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to lodge credit transfer request.");
      }

      onSuccess(data.data);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-3xl p-6 bg-card border border-border/80 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                Lodge Academic Credit Transfer
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Map credits completed at a foreign partner university toward domestic graduation requirements.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground/80 block mb-1">
                Student Name
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground/80 block mb-1">
                Host Global Institution
              </label>
              <input
                type="text"
                required
                value={hostUniversity}
                onChange={(e) => setHostUniversity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
                placeholder="e.g. ETH Zürich, NUS, TUM"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="col-span-1">
              <label className="text-xs font-semibold text-foreground/80 block mb-1">
                Foreign Code
              </label>
              <input
                type="text"
                required
                value={foreignCode}
                onChange={(e) => setForeignCode(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
                placeholder="e.g. 263-3850"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-foreground/80 block mb-1">
                Foreign Course Title
              </label>
              <input
                type="text"
                required
                value={foreignTitle}
                onChange={(e) => setForeignTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
                placeholder="e.g. Advanced Compiler Design"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground/80 block mb-1">
                Credits Earned (Foreign)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                required
                value={foreignCredits}
                onChange={(e) => setForeignCredits(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground/80 block mb-1">
                Grade Earned
              </label>
              <input
                type="text"
                required
                value={gradeEarned}
                onChange={(e) => setGradeEarned(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
                placeholder="e.g. A+ or 5.75 / 6.0"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground/80 block mb-1">
              Equivalent Domestic Course
            </label>
            <input
              type="text"
              required
              value={domesticCourse}
              onChange={(e) => setDomesticCourse(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
              placeholder="e.g. CS-402: High Performance Architecture"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground/80 block mb-1">
              Syllabus Document Link (PDF / Portal)
            </label>
            <input
              type="url"
              value={syllabusUrl}
              onChange={(e) => setSyllabusUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-muted/60 border border-border focus:outline-hidden focus:ring-1 focus:ring-primary text-foreground"
              placeholder="https://partner.univ/syllabus.pdf (optional)"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl text-xs h-9 px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="rounded-xl text-xs h-9 px-4 gap-1.5 bg-primary text-primary-foreground font-semibold"
            >
              <FileCheck className="w-3.5 h-3.5" />
              {loading ? "Submitting..." : "Submit for Evaluation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
