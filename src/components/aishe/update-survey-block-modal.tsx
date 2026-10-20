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
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ShieldCheck, FileText, AlertCircle } from "lucide-react";

interface UpdateSurveyBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyId: string;
  blockKey: string;
  currentStatus: boolean;
  onConfirm: (surveyId: string, blockKey: string, newStatus: boolean) => Promise<void>;
}

export function UpdateSurveyBlockModal({
  isOpen,
  onClose,
  surveyId,
  blockKey,
  currentStatus,
  onConfirm,
}: UpdateSurveyBlockModalProps) {
  const [loading, setLoading] = useState(false);

  const blockNames: Record<string, string> = {
    block_a_basic_info: "Block A: Basic Institutional Info",
    block_b_programmes: "Block B: Programmes & Disciplines",
    block_c_student_enrollment: "Block C: Student Enrollment",
    block_d_foreign_students: "Block D: Foreign & Interstate Scholars",
    block_e_staff_information: "Block E: Faculty Cadres & Staff",
    block_f_financial_info: "Block F: Financial Statements & Grants",
    block_g_infrastructure: "Block G: Campus Infrastructure & Labs",
    block_h_scholarships: "Block H: Scholarships & Financial Aid",
  };

  const displayName = blockNames[blockKey] || blockKey;

  const handleToggle = async () => {
    try {
      setLoading(true);
      await onConfirm(surveyId, blockKey, !currentStatus);
      onClose();
    } catch (error) {
      console.error("Failed to update block status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-border/60">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-blue-600/15 text-blue-500 border-blue-500/30 text-xs">
              AISHE DCF Verification
            </Badge>
          </div>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Update DCF Survey Block
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Verify and update statutory reporting data for Ministry of Education AISHE Data Capture Format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="p-3.5 rounded-lg border border-border/60 bg-muted/30 space-y-2">
            <div className="text-xs font-semibold text-foreground">{displayName}</div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Current Block Status:</span>
              <Badge
                className={
                  currentStatus
                    ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
                    : "bg-amber-500/15 text-amber-500 border-amber-500/30"
                }
              >
                {currentStatus ? "Verified & Completed" : "Pending Verification"}
              </Badge>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-blue-950/20 p-3 rounded-lg border border-blue-500/20">
            <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
            <span>
              Updating this survey block will automatically recalculate overall DCF completion percentage and refresh the statutory AISHE clearance audit docket.
            </span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={loading} className="text-xs h-9">
            Cancel
          </Button>
          <Button
            onClick={handleToggle}
            disabled={loading}
            className={`text-xs h-9 text-white font-medium ${
              currentStatus
                ? "bg-amber-600 hover:bg-amber-500"
                : "bg-emerald-600 hover:bg-emerald-500"
            }`}
          >
            {loading
              ? "Saving..."
              : currentStatus
              ? "Mark as Pending"
              : "Mark as Completed & Certified"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
