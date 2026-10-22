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
import { Award, PlusCircle } from "lucide-react";

interface SubmitCasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    faculty_name: string;
    department: string;
    current_stage: any;
    target_stage: any;
    api_score_claimed: number;
    publications_count: number;
    research_projects_count: number;
    scrutiny_notes: string;
  }) => Promise<void>;
}

export function SubmitCasModal({
  isOpen,
  onClose,
  onSubmit,
}: SubmitCasModalProps) {
  const [facultyName, setFacultyName] = useState("");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [currentStage, setCurrentStage] = useState("Stage 1 (Assistant Prof)");
  const [targetStage, setTargetStage] = useState("Stage 2 (Assistant Prof Senior)");
  const [apiScore, setApiScore] = useState(85);
  const [publications, setPublications] = useState(6);
  const [projects, setProjects] = useState(1);
  const [notes, setNotes] = useState("Self-appraisal submitted with verified UGC CARE publications.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stages = [
    "Stage 1 (Assistant Prof)",
    "Stage 2 (Assistant Prof Senior)",
    "Stage 3 (Assistant Prof Selection Grade)",
    "Stage 4 (Associate Prof)",
    "Stage 5 (Professor)",
    "Stage 6 (Senior Professor)",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyName) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        faculty_name: facultyName,
        department,
        current_stage: currentStage,
        target_stage: targetStage,
        api_score_claimed: Number(apiScore),
        publications_count: Number(publications),
        research_projects_count: Number(projects),
        scrutiny_notes: notes,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card border-border/80">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
            <Award className="h-5 w-5 text-indigo-500" />
            Apply for Faculty CAS Promotion
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Submit UGC 7th CPC Career Advancement Scheme dossier with Academic Performance Indicator (API) scores.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 py-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Faculty Full Name</label>
            <Input
              required
              placeholder="e.g. Dr. Rajesh K. Varma"
              value={facultyName}
              onChange={(e) => setFacultyName(e.target.value)}
              className="text-xs h-8 bg-background/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full text-xs h-8 bg-background border border-border/60 rounded px-2 text-foreground"
            >
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
              <option value="Mechanical & Mechatronics Engineering">Mechanical & Mechatronics Engineering</option>
              <option value="Applied Sciences & Nanotechnology">Applied Sciences & Nanotechnology</option>
              <option value="Civil & Environmental Engineering">Civil & Environmental Engineering</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Current Stage</label>
              <select
                value={currentStage}
                onChange={(e) => setCurrentStage(e.target.value)}
                className="w-full text-xs h-8 bg-background border border-border/60 rounded px-2 text-foreground"
              >
                {stages.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Target Promotion Stage</label>
              <select
                value={targetStage}
                onChange={(e) => setTargetStage(e.target.value)}
                className="w-full text-xs h-8 bg-background border border-border/60 rounded px-2 text-foreground"
              >
                {stages.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">API Claimed</label>
              <Input
                type="number"
                value={apiScore}
                onChange={(e) => setApiScore(Number(e.target.value))}
                className="text-xs h-8 bg-background/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Publications</label>
              <Input
                type="number"
                value={publications}
                onChange={(e) => setPublications(Number(e.target.value))}
                className="text-xs h-8 bg-background/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Projects</label>
              <Input
                type="number"
                value={projects}
                onChange={(e) => setProjects(Number(e.target.value))}
                className="text-xs h-8 bg-background/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Scrutiny Summary / Remarks</label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-xs h-8 bg-background/50"
            />
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs h-8">
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8"
            >
              {isSubmitting ? "Submitting..." : "Submit CAS Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
