"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, CheckCircle2, Award } from "lucide-react";
import { IicQuarterlyActivity, IicQuarter, IicActivityCategory } from "@/types";

interface SubmitActivityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (newActivity: IicQuarterlyActivity) => void;
}

export function SubmitActivityModal({
  open,
  onOpenChange,
  onSuccess,
}: SubmitActivityModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<IicActivityCategory>("mic_driven");
  const [quarter, setQuarter] = useState<IicQuarter>("Q4");
  const [coordinatorName, setCoordinatorName] = useState("Dr. Arvind S. Kulkarni");
  const [startDate, setStartDate] = useState("2027-05-20");
  const [endDate, setEndDate] = useState("2027-05-20");
  const [participantCount, setParticipantCount] = useState("350");
  const [expenditureInr, setExpenditureInr] = useState("45000");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/iic/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          quarter,
          coordinator_name: coordinatorName,
          start_date: startDate,
          end_date: endDate,
          participant_count: Number(participantCount) || 100,
          expenditure_inr: Number(expenditureInr) || 35000,
          mic_reward_points: 25,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        onSuccess?.(data.data);
        setTimeout(() => {
          setSubmitted(false);
          onOpenChange(false);
          setTitle("");
        }, 1400);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Award className="w-4 h-4" />
            </div>
            <DialogTitle className="text-lg font-bold">
              Log MoE / IIC Quarterly Activity
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Submit an innovation event report for validation and reward scoring by the
            Ministry of Education&apos;s Innovation Cell (MIC).
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-foreground">
              Activity Report Dispatched!
            </h4>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Cryptographic verification token generated and queued for MoE MIC quarterly rating ledger.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="act-title">Activity Title</Label>
              <Input
                id="act-title"
                placeholder="e.g. Ideathon 2027: DeepTech for Sustainable Industry"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="act-quarter">Quarter</Label>
                <select
                  id="act-quarter"
                  value={quarter}
                  onChange={(e) => setQuarter(e.target.value as IicQuarter)}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-xs"
                >
                  <option value="Q1">Quarter 1 (Jul - Sep)</option>
                  <option value="Q2">Quarter 2 (Oct - Dec)</option>
                  <option value="Q3">Quarter 3 (Jan - Mar)</option>
                  <option value="Q4">Quarter 4 (Apr - Jun)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="act-category">Activity Category</Label>
                <select
                  id="act-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IicActivityCategory)}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-xs"
                >
                  <option value="mic_driven">MoE / MIC Driven</option>
                  <option value="calendar_activity">IIC Calendar Activity</option>
                  <option value="celebration_activity">Celebration Activity</option>
                  <option value="self_driven">Self-Driven Initiative</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="act-start">Start Date</Label>
                <Input
                  id="act-start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="act-end">End Date</Label>
                <Input
                  id="act-end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="act-participants">Total Participants</Label>
                <Input
                  id="act-participants"
                  type="number"
                  value={participantCount}
                  onChange={(e) => setParticipantCount(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="act-exp">Expenditure (₹ INR)</Label>
                <Input
                  id="act-exp"
                  type="number"
                  value={expenditureInr}
                  onChange={(e) => setExpenditureInr(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="act-coord">Faculty Coordinator</Label>
              <Input
                id="act-coord"
                value={coordinatorName}
                onChange={(e) => setCoordinatorName(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={loading || !title.trim()}
                className="gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {loading ? "Transmitting..." : "Submit to MIC Portal"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
