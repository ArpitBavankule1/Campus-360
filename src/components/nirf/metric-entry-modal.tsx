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
import { NirfDataMetric, NirfParameterCode } from "@/types";
import { Database, Loader2, PlusCircle } from "lucide-react";

interface MetricEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (metric: NirfDataMetric) => void;
}

export function MetricEntryModal({
  open,
  onOpenChange,
  onSuccess,
}: MetricEntryModalProps) {
  const [parameterCode, setParameterCode] = useState<NirfParameterCode>("RPC");
  const [metricCode, setMetricCode] = useState("RPC-PU-AIML");
  const [metricTitle, setMetricTitle] = useState("GenAI & Autonomous Systems Publications in Nature/IEEE");
  const [department, setDepartment] = useState("Artificial Intelligence & Data Science");
  const [reportedValue, setReportedValue] = useState("142 Scopus Papers");
  const [benchmarkValue, setBenchmarkValue] = useState("100 Papers");
  const [weightage, setWeightage] = useState(10);
  const [scoreAchieved, setScoreAchieved] = useState(9.5);
  const [verifiedBy, setVerifiedBy] = useState("Prof. R. Deshmukh (Dean AI & Computing)");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/nirf/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parameter_code: parameterCode,
          metric_code: metricCode,
          metric_title: metricTitle,
          department,
          reported_value: reportedValue,
          benchmark_value: benchmarkValue,
          weightage: Number(weightage),
          score_achieved: Number(scoreAchieved),
          verified_by: verifiedBy,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to record metric");
      }

      onSuccess(json.data);
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Record Departmental Ranking Metric
          </DialogTitle>
          <DialogDescription>
            Log audited departmental academic, research, or placement metrics toward the official NIRF institutional submission.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 text-xs text-destructive bg-destructive/10 rounded-md border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="parameterCode" className="text-xs">Parameter Code</Label>
              <select
                id="parameterCode"
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                value={parameterCode}
                onChange={(e) => setParameterCode(e.target.value as NirfParameterCode)}
              >
                <option value="TLR">TLR (Teaching & Resources)</option>
                <option value="RPC">RPC (Research & Pubs)</option>
                <option value="GO">GO (Graduation Outcomes)</option>
                <option value="OI">OI (Outreach & Inclusivity)</option>
                <option value="PR">PR (Perception)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="metricCode" className="text-xs">Metric Identifier Code</Label>
              <Input
                id="metricCode"
                className="h-9 text-xs"
                value={metricCode}
                onChange={(e) => setMetricCode(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="metricTitle" className="text-xs">Metric Title & Description</Label>
            <Input
              id="metricTitle"
              className="h-9 text-xs"
              value={metricTitle}
              onChange={(e) => setMetricTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="department" className="text-xs">Academic Faculty / Department</Label>
            <Input
              id="department"
              className="h-9 text-xs"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="reportedValue" className="text-xs">Reported Value</Label>
              <Input
                id="reportedValue"
                className="h-9 text-xs"
                value={reportedValue}
                onChange={(e) => setReportedValue(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="benchmarkValue" className="text-xs">Benchmark / Target</Label>
              <Input
                id="benchmarkValue"
                className="h-9 text-xs"
                value={benchmarkValue}
                onChange={(e) => setBenchmarkValue(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="weightage" className="text-xs">Max Weightage</Label>
              <Input
                id="weightage"
                type="number"
                step="0.5"
                className="h-9 text-xs"
                value={weightage}
                onChange={(e) => setWeightage(Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="scoreAchieved" className="text-xs">Score Achieved</Label>
              <Input
                id="scoreAchieved"
                type="number"
                step="0.1"
                className="h-9 text-xs"
                value={scoreAchieved}
                onChange={(e) => setScoreAchieved(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="verifiedBy" className="text-xs">Audited / Verified By</Label>
            <Input
              id="verifiedBy"
              className="h-9 text-xs"
              value={verifiedBy}
              onChange={(e) => setVerifiedBy(e.target.value)}
              required
            />
          </div>

          <DialogFooter className="pt-2">
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
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Recording...
                </>
              ) : (
                <>
                  <PlusCircle className="w-3.5 h-3.5" /> Save Metric
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
