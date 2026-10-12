"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Calendar, CheckCircle2 } from "lucide-react";
import { IqacAcademicAudit, AuditType } from "@/types";

interface AuditScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (audit: IqacAcademicAudit) => void;
}

export function AuditScheduleModal({
  isOpen,
  onClose,
  onSubmit,
}: AuditScheduleModalProps) {
  const [auditTitle, setAuditTitle] = useState("");
  const [auditType, setAuditType] = useState<AuditType>("academic");
  const [targetDept, setTargetDept] = useState("");
  const [externalAuditor, setExternalAuditor] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [scheduledDate, setScheduledDate] = useState("2026-11-05");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<IqacAcademicAudit | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/iqac/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audit_title: auditTitle,
          audit_type: auditType,
          target_department: targetDept,
          lead_external_auditor: externalAuditor,
          external_auditor_affiliation: affiliation,
          scheduled_date: scheduledDate,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSuccess(json.data);
        onSubmit(json.data);
      } else {
        alert(json.error || "Failed to schedule audit");
      }
    } catch {
      alert("Error scheduling audit");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleReset}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Building2 className="w-5 h-5 text-primary" />
            Schedule Academic & Administrative Audit (AAA)
          </DialogTitle>
          <DialogDescription className="text-xs">
            Convene an external peer-review committee for departmental quality and compliance audit.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-6 space-y-4 text-center">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">Audit Scheduled!</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Notice dispatched to {success.target_department}.
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg font-mono text-xs text-center border">
              <span className="text-muted-foreground block text-[11px]">Audit Docket Code</span>
              <span className="font-bold text-primary text-sm">{success.audit_code}</span>
            </div>
            <Button onClick={handleReset} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <Label htmlFor="auditTitle">Audit Title</Label>
              <Input
                id="auditTitle"
                value={auditTitle}
                onChange={(e) => setAuditTitle(e.target.value)}
                placeholder="e.g. Electrical & Electronics Engineering Academic Audit"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="auditType">Audit Category</Label>
                <select
                  id="auditType"
                  value={auditType}
                  onChange={(e) => setAuditType(e.target.value as AuditType)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
                >
                  <option value="academic">Academic Audit</option>
                  <option value="administrative">Administrative Audit</option>
                  <option value="green_energy">Green Energy & Eco</option>
                  <option value="gender_equity">Gender Equity</option>
                  <option value="financial_compliance">Financial Compliance</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="scheduledDate">Scheduled Date</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="targetDept">Target Department / Unit</Label>
              <Input
                id="targetDept"
                value={targetDept}
                onChange={(e) => setTargetDept(e.target.value)}
                placeholder="e.g. Department of Mechanical & Mechatronics"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="externalAuditor">Lead External Auditor (Peer Reviewer)</Label>
              <Input
                id="externalAuditor"
                value={externalAuditor}
                onChange={(e) => setExternalAuditor(e.target.value)}
                placeholder="e.g. Prof. M. K. Seshadri (IIT Madras)"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="affiliation">Auditor Affiliation / Organization</Label>
              <Input
                id="affiliation"
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                placeholder="e.g. Indian Institute of Technology Madras"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Scheduling..." : "Schedule Audit"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
