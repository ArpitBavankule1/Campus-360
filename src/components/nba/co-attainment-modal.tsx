"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NbaProgram, NbaCourseOutcome, BloomLevel } from "@/types";
import { Target, Loader2, Calculator } from "lucide-react";

interface CoAttainmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  programs: NbaProgram[];
  onSuccess: (newCo: NbaCourseOutcome) => void;
}

export function CoAttainmentModal({
  isOpen,
  onClose,
  programs,
  onSuccess,
}: CoAttainmentModalProps) {
  const [selectedProgramId, setSelectedProgramId] = useState(programs[0]?.id || "");
  const [courseCode, setCourseCode] = useState("CS302");
  const [courseName, setCourseName] = useState("Database Management Systems & Distributed Storage");
  const [coCode, setCoCode] = useState("CO1");
  const [statement, setStatement] = useState("Construct normalized relational schemas and ACID transaction schedules for concurrent execution.");
  const [bloomLevel, setBloomLevel] = useState<BloomLevel>("Apply");
  const [directInternal, setDirectInternal] = useState("85");
  const [directExternal, setDirectExternal] = useState("82");
  const [indirectSurvey, setIndirectSurvey] = useState("88");
  const [facultyName, setFacultyName] = useState("Dr. S. K. Bhattacharya");
  const [semester, setSemester] = useState("4");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live preview calculation:
  // Direct = 30% CIE + 70% SEE
  // Composite = 80% Direct + 20% Indirect
  // Score = (Composite / 100) * 3
  const directCIE = parseFloat(directInternal) || 0;
  const directSEE = parseFloat(directExternal) || 0;
  const indSurvey = parseFloat(indirectSurvey) || 0;
  const directComp = (directCIE * 0.3) + (directSEE * 0.7);
  const compositePct = (directComp * 0.8) + (indSurvey * 0.2);
  const estimatedScore = ((compositePct / 100) * 3).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setSubmitting(true);
      const res = await fetch("/api/nba/attainment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          program_id: selectedProgramId,
          course_code: courseCode.trim(),
          course_name: courseName.trim(),
          co_code: coCode.trim(),
          statement: statement.trim(),
          bloom_level: bloomLevel,
          direct_internal: directCIE,
          direct_external: directSEE,
          indirect_survey: indSurvey,
          faculty_in_charge: facultyName.trim(),
          semester: parseInt(semester, 10) || 4,
          academic_year: "2025-2026",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to record Course Outcome attainment");
      }

      onSuccess(json.data);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error recording outcome attainment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground font-bold text-lg">
            <Target className="w-5 h-5 text-primary" />
            Compute & Record Course Outcome (CO) Attainment
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            NBA Washington Accord compliant attainment calculator (30% CIE + 70% SEE direct evaluation & 20% student exit survey).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
          {error && (
            <div className="p-2.5 rounded bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-semibold text-foreground block mb-1">
                Course Code
              </label>
              <Input
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="text-xs font-mono"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-foreground block mb-1">
                CO Code
              </label>
              <Input
                value={coCode}
                onChange={(e) => setCoCode(e.target.value)}
                placeholder="e.g. CO1"
                className="text-xs font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-foreground block mb-1">
              Course Name
            </label>
            <Input
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="text-xs"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-foreground block mb-1">
              Course Outcome Statement
            </label>
            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              rows={2}
              className="w-full px-3 py-1.5 rounded-md border border-input bg-background text-foreground text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-semibold text-foreground block mb-1">
                Bloom&apos;s Taxonomy Level
              </label>
              <select
                value={bloomLevel}
                onChange={(e) => setBloomLevel(e.target.value as BloomLevel)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value="Remember">Remember (L1)</option>
                <option value="Understand">Understand (L2)</option>
                <option value="Apply">Apply (L3)</option>
                <option value="Analyze">Analyze (L4)</option>
                <option value="Evaluate">Evaluate (L5)</option>
                <option value="Create">Create (L6)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-foreground block mb-1">
                Faculty-In-Charge
              </label>
              <Input
                value={facultyName}
                onChange={(e) => setFacultyName(e.target.value)}
                className="text-xs"
                required
              />
            </div>
          </div>

          {/* Attainment Inputs */}
          <div className="p-3 rounded-lg bg-muted/40 border border-border/60 space-y-2">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-primary" /> Evaluation Scores (% Attained):
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-muted-foreground block mb-0.5">
                  Internal CIE (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={directInternal}
                  onChange={(e) => setDirectInternal(e.target.value)}
                  className="text-xs text-center font-bold"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground block mb-0.5">
                  External SEE (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={directExternal}
                  onChange={(e) => setDirectExternal(e.target.value)}
                  className="text-xs text-center font-bold"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground block mb-0.5">
                  Course Exit (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={indirectSurvey}
                  onChange={(e) => setIndirectSurvey(e.target.value)}
                  className="text-xs text-center font-bold"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-border/40 text-xs">
              <span className="text-muted-foreground">Estimated Attainment Index:</span>
              <span className="text-base font-black text-primary">
                {estimatedScore} <span className="text-xs font-normal text-muted-foreground">/ 3.00</span>
              </span>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting} className="flex items-center gap-1.5">
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Recording...
                </>
              ) : (
                "Save Attainment Record"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
