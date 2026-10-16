"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { CreditTransferApplication } from "@/types";

interface ApplyTransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (newTransfer: CreditTransferApplication) => void;
}

export function ApplyTransferModal({
  open,
  onOpenChange,
  onSuccess,
}: ApplyTransferModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    apaar_id: "9081-3421-7789",
    student_name: "Aryan Sharma",
    source_institution: "IIT Bombay (SWAYAM / NPTEL)",
    course_code: "NPTEL-CS-79",
    course_name: "Reinforcement Learning & Robotics",
    credits_claimed: 3,
    target_equivalent_course_code: "CS-608",
    target_equivalent_course_name: "Advanced Robotics & Control",
    equivalence_score: 92,
    scrutiny_remarks: "Course certificate verified with 88% gold medal score.",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/academic-credits/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <ArrowRightLeft className="h-4 w-4" />
            <span>Academic Credit Mobility</span>
          </div>
          <DialogTitle className="text-xl">Apply for Inter-University Credit Transfer</DialogTitle>
          <DialogDescription>
            Submit external SWAYAM, NPTEL, or university credits for equivalence mapping under NEP 2020.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Transfer Application Filed</h3>
            <p className="text-sm text-muted-foreground">
              Docket token generated and queued for Board of Studies (BOS) approval.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="apaar_id" className="text-xs">12-Digit APAAR ID</Label>
                <Input
                  id="apaar_id"
                  value={formData.apaar_id}
                  onChange={(e) => setFormData({ ...formData, apaar_id: e.target.value })}
                  required
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="student_name" className="text-xs">Student Full Name</Label>
                <Input
                  id="student_name"
                  value={formData.student_name}
                  onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                  required
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="source_institution" className="text-xs">Awarding Institution / Platform</Label>
              <Input
                id="source_institution"
                value={formData.source_institution}
                onChange={(e) => setFormData({ ...formData, source_institution: e.target.value })}
                required
                placeholder="e.g. IIT Madras (NPTEL) or University of Delhi"
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="course_name" className="text-xs">Source Course Title</Label>
                <Input
                  id="course_name"
                  value={formData.course_name}
                  onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                  required
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="credits_claimed" className="text-xs">Credits</Label>
                <Input
                  id="credits_claimed"
                  type="number"
                  min="1"
                  max="12"
                  value={formData.credits_claimed}
                  onChange={(e) => setFormData({ ...formData, credits_claimed: Number(e.target.value) })}
                  required
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="target_code" className="text-xs">Campus Course Code</Label>
                <Input
                  id="target_code"
                  value={formData.target_equivalent_course_code}
                  onChange={(e) => setFormData({ ...formData, target_equivalent_course_code: e.target.value })}
                  required
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="target_name" className="text-xs">Equivalent Course Title</Label>
                <Input
                  id="target_name"
                  value={formData.target_equivalent_course_name}
                  onChange={(e) => setFormData({ ...formData, target_equivalent_course_name: e.target.value })}
                  required
                  className="text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/40">
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
                disabled={loading}
                className="gap-1.5 bg-primary text-primary-foreground"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {loading ? "Submitting..." : "Submit for BOS Equivalence"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
