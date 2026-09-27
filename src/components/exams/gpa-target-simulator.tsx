"use client";

import React, { useState, useMemo } from "react";
import {
  Calculator,
  Target,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { simulateTargetSGPA } from "@/lib/exams/exam-engine";
import { Badge } from "@/components/ui/badge";

export const GpaTargetSimulator: React.FC = () => {
  const [currentCGPA, setCurrentCGPA] = useState(8.92);
  const [completedCredits, setCompletedCredits] = useState(110);
  const [targetCGPA, setTargetCGPA] = useState(9.10);
  const [futureCredits, setFutureCredits] = useState(22);

  const simulation = useMemo(() => {
    return simulateTargetSGPA(
      currentCGPA,
      completedCredits,
      targetCGPA,
      futureCredits
    );
  }, [currentCGPA, completedCredits, targetCGPA, futureCredits]);

  const getFeasibilityFeedback = () => {
    if (!simulation.isAchievable) {
      return {
        label: "Mathematically Out of Reach",
        color: "text-destructive",
        bg: "bg-destructive/10 border-destructive/20",
        desc: `Requires an SGPA of ${simulation.requiredSGPA}, which exceeds the 10.0 maximum ceiling. Consider adjusting target CGPA slightly lower.`,
      };
    }
    if (simulation.requiredSGPA > 9.5) {
      return {
        label: "High Distinction / Honors Target",
        color: "text-amber-500",
        bg: "bg-amber-500/10 border-amber-500/20",
        desc: `Requires near-perfect performance: Mostly 'O' (Outstanding 10.0) grades across all ${futureCredits} credits.`,
      };
    }
    if (simulation.requiredSGPA >= 8.5) {
      return {
        label: "Solid & Highly Achievable",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10 border-emerald-500/20",
        desc: `Targeting an average of 'A+' and 'A' grades will easily secure this goal.`,
      };
    }
    return {
      label: "Comfortably Within Range",
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20",
      desc: `Maintaining your current study routine will surpass this target threshold.`,
    };
  };

  const feedback = getFeasibilityFeedback();

  return (
    <div className="p-6 rounded-3xl border border-border/80 bg-card space-y-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="outline"
              className="text-xs text-primary border-primary/30 bg-primary/10 font-semibold"
            >
              <Calculator className="w-3.5 h-3.5 mr-1" /> GPA Planner & Simulator
            </Badge>
          </div>
          <h3 className="font-bold text-lg text-foreground">
            Target CGPA & Next Semester SGPA Projection
          </h3>
          <p className="text-xs text-muted-foreground">
            Estimate the exact semester GPA required in upcoming courses to achieve your desired graduation honors or placement benchmark.
          </p>
        </div>
      </div>

      {/* Sliders & Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Input controls */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-foreground">
              <span>Target Cumulative CGPA</span>
              <span className="font-mono text-primary font-bold text-sm">
                {targetCGPA.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={7.0}
              max={10.0}
              step={0.05}
              value={targetCGPA}
              onChange={(e) => setTargetCGPA(parseFloat(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>7.00 (First Class)</span>
              <span>8.50 (Distinction)</span>
              <span>10.00 (Max)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-foreground">
                Current CGPA
              </label>
              <input
                type="number"
                min={0}
                max={10}
                step={0.01}
                value={currentCGPA}
                onChange={(e) => setCurrentCGPA(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-border bg-background font-mono font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-foreground">
                Completed Credits
              </label>
              <input
                type="number"
                min={10}
                max={180}
                value={completedCredits}
                onChange={(e) => setCompletedCredits(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-border bg-background font-mono font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <label className="text-[11px] font-semibold text-foreground">
              Upcoming Semester Credits
            </label>
            <input
              type="number"
              min={12}
              max={30}
              value={futureCredits}
              onChange={(e) => setFutureCredits(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-border bg-background font-mono font-semibold"
            />
            <span className="text-[10px] text-muted-foreground block">
              Standard full-time semester is typically 20 - 24 credits.
            </span>
          </div>
        </div>

        {/* Right: Simulation Result Box */}
        <div className="flex flex-col justify-between p-5 rounded-2xl border border-border/80 bg-gradient-to-br from-card via-muted/30 to-primary/5 space-y-4">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block">
              Required Upcoming Semester SGPA
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className={`text-4xl font-extrabold tracking-tight font-mono ${
                  simulation.isAchievable ? "text-primary" : "text-destructive"
                }`}
              >
                {simulation.requiredSGPA > 0 ? simulation.requiredSGPA.toFixed(2) : "0.00"}
              </span>
              <span className="text-xs text-muted-foreground font-mono">/ 10.00</span>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border ${feedback.bg} space-y-1 text-xs`}>
            <div className={`font-bold flex items-center gap-1.5 ${feedback.color}`}>
              {simulation.isAchievable ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              {feedback.label}
            </div>
            <p className="text-foreground/80 leading-relaxed text-[11px]">
              {feedback.desc}
            </p>
          </div>

          <div className="text-[11px] text-muted-foreground pt-1 flex items-center justify-between border-t border-border/40">
            <span>Overall Credits at Completion:</span>
            <strong className="text-foreground font-mono">
              {completedCredits + futureCredits} Credits
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
