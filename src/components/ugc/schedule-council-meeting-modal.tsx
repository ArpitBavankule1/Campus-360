"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Landmark, Sparkles, CheckCircle2 } from "lucide-react";
import { UgcStatutoryCouncil } from "@/types";

interface ScheduleCouncilMeetingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCouncil: UgcStatutoryCouncil | null;
  onSuccess?: (updatedCouncil: UgcStatutoryCouncil) => void;
}

export function ScheduleCouncilMeetingModal({
  open,
  onOpenChange,
  selectedCouncil,
  onSuccess,
}: ScheduleCouncilMeetingModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [nextMeetingDate, setNextMeetingDate] = useState("2026-12-15");
  const [agendaTitle, setAgendaTitle] = useState("Ratification of R-2026 Curriculum & Autonomy Compliance Review");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCouncil) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ugc/councils", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          councilId: selectedCouncil.id,
          nextMeetingDate,
          agendaTitle,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        onSuccess?.(data.data);
        setTimeout(() => {
          setSubmitted(false);
          onOpenChange(false);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-border/80 bg-card/95 backdrop-blur-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <Landmark className="h-5 w-5" />
            <DialogTitle className="text-lg">Convene Statutory Council Quorum Meeting</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Schedule formal statutory body quorum under UGC Autonomous College Regulations.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-3 text-center">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="font-semibold text-foreground">Council Meeting Quorum Convened</h4>
            <p className="text-xs text-muted-foreground max-w-xs">
              Statutory notice dispatched to University and UGC nominees with formal resolution token.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="p-3 rounded-lg bg-muted/40 border border-border/50 text-xs space-y-1">
              <span className="text-muted-foreground block">Convening Body:</span>
              <strong className="text-foreground text-sm block">
                {selectedCouncil?.council_name || "Statutory Council"}
              </strong>
              <p className="text-[11px] text-muted-foreground">
                Chairperson: {selectedCouncil?.chairperson}
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nextDate" className="text-xs">Next Quorum Date</Label>
              <Input
                id="nextDate"
                type="date"
                value={nextMeetingDate}
                onChange={(e) => setNextMeetingDate(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="agenda" className="text-xs">Statutory Agenda & Order of Business</Label>
              <Input
                id="agenda"
                value={agendaTitle}
                onChange={(e) => setAgendaTitle(e.target.value)}
                placeholder="e.g. Consideration of BoS recommendations and autonomous grant allocations"
                required
                className="text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={loading} className="gap-1.5">
                {loading ? "Convening..." : "Dispatch Statutory Notice"}
                <Sparkles className="h-3.5 w-3.5" />
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
