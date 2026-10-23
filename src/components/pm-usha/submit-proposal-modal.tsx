"use client";

import React, { useState } from "react";
import { PmUshaComponentType } from "@/types";
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
import { PlusCircle, CheckCircle2 } from "lucide-react";

interface SubmitProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (proposal: {
    title: string;
    component_type: PmUshaComponentType;
    estimated_budget_lakhs: number;
    approved_budget_lakhs: number;
    central_share_percentage: number;
    state_share_percentage: number;
    target_completion_date: string;
    review_remarks?: string;
  }) => void;
}

export function SubmitProposalModal({
  isOpen,
  onClose,
  onSubmit,
}: SubmitProposalModalProps) {
  const [title, setTitle] = useState("");
  const [componentType, setComponentType] = useState<PmUshaComponentType>("MERU_UPGRADE");
  const [budgetLakhs, setBudgetLakhs] = useState<number>(500);
  const [completionDate, setCompletionDate] = useState("2027-03-31");
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !budgetLakhs) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({
        title,
        component_type: componentType,
        estimated_budget_lakhs: Number(budgetLakhs),
        approved_budget_lakhs: Number(budgetLakhs) * 0.95,
        central_share_percentage: 60,
        state_share_percentage: 40,
        target_completion_date: completionDate,
        review_remarks: remarks || "Detailed Project Report compiled and submitted via Institutional PMU.",
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg border-border/80 bg-background/95 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-emerald-400" />
            Submit New PM-USHA DPR Proposal
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Formulate an institutional development proposal for State Higher Education Council (SHEC) & MoE sanction
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Project Title / Institutional Focus</label>
            <Input
              required
              placeholder="e.g. Center for Renewable Energy & Clean Mobility Labs"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Component Scheme</label>
              <select
                value={componentType}
                onChange={(e) => setComponentType(e.target.value as PmUshaComponentType)}
                className="w-full text-xs h-9 bg-background border border-border/60 rounded px-2 text-foreground"
              >
                <option value="MERU_UPGRADE">MERU Multi-Disciplinary Upgrade</option>
                <option value="INFRASTRUCTURE_GRANTS">Infrastructure Grants to College</option>
                <option value="RESEARCH_INNOVATION">Research & Innovation Ecosystem</option>
                <option value="GENDER_EQUITY">Gender Inclusion & Equity Center</option>
                <option value="DIGITAL_LEARNING_CENTER">Digital Learning & MOOCs Center</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Estimated Outlay (₹ in Lakhs)</label>
              <Input
                type="number"
                required
                min={10}
                max={5000}
                value={budgetLakhs}
                onChange={(e) => setBudgetLakhs(Number(e.target.value))}
                className="text-xs h-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Target Completion Date</label>
            <Input
              type="date"
              required
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Executive Summary & Objectives</label>
            <textarea
              placeholder="Brief summary of civil, equipment, or pedagogical upgrades planned..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              className="w-full text-xs bg-background border border-border/60 rounded p-2 text-foreground resize-none"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={onClose} size="sm" className="text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-4 flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Submit DPR Proposal
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
