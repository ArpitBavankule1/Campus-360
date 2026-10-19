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
import { Lightbulb, Sparkles, CheckCircle2 } from "lucide-react";
import {
  IicYuktiInnovation,
  YuktiInnovationStage,
  YuktiPatentStatus,
} from "@/types";

interface SubmitYuktiInnovationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (newInnovation: IicYuktiInnovation) => void;
}

export function SubmitYuktiInnovationModal({
  open,
  onOpenChange,
  onSuccess,
}: SubmitYuktiInnovationModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [title, setTitle] = useState("");
  const [leadInnovator, setLeadInnovator] = useState("");
  const [innovatorType, setInnovatorType] = useState<"student" | "faculty" | "joint_consortium">("student");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [domain, setDomain] = useState("Deep-Tech / Artificial Intelligence");
  const [stage, setStage] = useState<YuktiInnovationStage>("prototype");
  const [trlLevel, setTrlLevel] = useState("6");
  const [patentStatus, setPatentStatus] = useState<YuktiPatentStatus>("published");
  const [seedFunding, setSeedFunding] = useState("250000");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !leadInnovator.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/iic/yukti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          lead_innovator: leadInnovator,
          innovator_type: innovatorType,
          department,
          domain,
          innovation_stage: stage,
          trl_level: Number(trlLevel) || 5,
          patent_status: patentStatus,
          seed_funding_received_inr: Number(seedFunding) || 150000,
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
          setLeadInnovator("");
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
              <Lightbulb className="w-4 h-4" />
            </div>
            <DialogTitle className="text-lg font-bold">
              Submit to YUKTI National Repository
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Register your innovation docket with the Ministry of Education&apos;s YUKTI
            National Innovation Repository for TRL evaluation, seed funding, and national showcase.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-foreground">
              YUKTI Docket Enrolled!
            </h4>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              National YUKTI token generated and signed with SHA-256 institutional cryptographic seal.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="yukti-title">Innovation Project Title</Label>
              <Input
                id="yukti-title"
                placeholder="e.g. BioVolt: Microbial Fuel Cell for Decentralized Sensor Power"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="yukti-lead">Lead Innovator Name</Label>
                <Input
                  id="yukti-lead"
                  placeholder="e.g. Aryan K. Verma"
                  value={leadInnovator}
                  onChange={(e) => setLeadInnovator(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="yukti-type">Innovator Category</Label>
                <select
                  id="yukti-type"
                  value={innovatorType}
                  onChange={(e) =>
                    setInnovatorType(e.target.value as "student" | "faculty" | "joint_consortium")
                  }
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-xs"
                >
                  <option value="student">Student Innovator</option>
                  <option value="faculty">Faculty Lead</option>
                  <option value="joint_consortium">Joint Student-Faculty Consortium</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="yukti-dept">Department</Label>
                <Input
                  id="yukti-dept"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="yukti-domain">Domain / Sector</Label>
                <Input
                  id="yukti-domain"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="yukti-stage">Stage</Label>
                <select
                  id="yukti-stage"
                  value={stage}
                  onChange={(e) => setStage(e.target.value as YuktiInnovationStage)}
                  className="w-full px-2 py-2 rounded-md border border-input bg-background text-xs"
                >
                  <option value="ideation">Ideation</option>
                  <option value="proof_of_concept">Proof of Concept</option>
                  <option value="prototype">Prototype</option>
                  <option value="startup_commercialized">Startup / Market</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="yukti-trl">TRL Level (1-9)</Label>
                <select
                  id="yukti-trl"
                  value={trlLevel}
                  onChange={(e) => setTrlLevel(e.target.value)}
                  className="w-full px-2 py-2 rounded-md border border-input bg-background text-xs"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
                    <option key={lvl} value={lvl}>
                      TRL {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="yukti-patent">Patent Status</Label>
                <select
                  id="yukti-patent"
                  value={patentStatus}
                  onChange={(e) => setPatentStatus(e.target.value as YuktiPatentStatus)}
                  className="w-full px-2 py-2 rounded-md border border-input bg-background text-xs"
                >
                  <option value="granted">Granted</option>
                  <option value="published">Published</option>
                  <option value="filed">Filed</option>
                  <option value="provisional">Provisional</option>
                  <option value="not_applicable">Not Applicable</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="yukti-seed">Seed Grant Tranche Requested (₹ INR)</Label>
              <Input
                id="yukti-seed"
                type="number"
                value={seedFunding}
                onChange={(e) => setSeedFunding(e.target.value)}
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
                disabled={loading || !title.trim() || !leadInnovator.trim()}
                className="gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {loading ? "Submitting..." : "Enroll in YUKTI"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
