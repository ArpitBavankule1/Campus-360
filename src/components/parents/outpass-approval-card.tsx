"use client";

import React, { useState } from "react";
import { GuardianOutpassApproval } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle,
  XCircle,
  FileText,
  AlertCircle,
} from "lucide-react";

interface OutpassApprovalCardProps {
  outpass: GuardianOutpassApproval;
  onApprove: (outpassId: string, remarks: string) => void;
  onReject: (outpassId: string, remarks: string) => void;
}

export function OutpassApprovalCard({
  outpass,
  onApprove,
  onReject,
}: OutpassApprovalCardProps) {
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPending = outpass.guardian_status === "pending";
  const isApproved = outpass.guardian_status === "approved";
  const isRejected = outpass.guardian_status === "rejected";

  const handleApprove = () => {
    setIsSubmitting(true);
    onApprove(outpass.id, remarks || "Approved by Guardian via Smart Portal");
    setIsSubmitting(false);
  };

  const handleReject = () => {
    setIsSubmitting(true);
    onReject(outpass.id, remarks || "Declined by Guardian");
    setIsSubmitting(false);
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <Card className="border border-border/60 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden hover:border-primary/40 transition-all">
      <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
              {outpass.outpass_token}
            </span>
            <Badge
              variant="outline"
              className={
                isPending
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs font-semibold"
                  : isApproved
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold"
                  : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 text-xs font-semibold"
              }
            >
              {isPending && <Clock className="h-3 w-3 mr-1" />}
              {isApproved && <CheckCircle className="h-3 w-3 mr-1" />}
              {isRejected && <XCircle className="h-3 w-3 mr-1" />}
              {isPending
                ? "Pending Guardian Consent"
                : isApproved
                ? "Guardian Approved"
                : "Guardian Declined"}
            </Badge>
          </div>

          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Warden:{" "}
            <strong className="text-foreground capitalize">
              {outpass.warden_status.replace(/_/g, " ")}
            </strong>
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Core details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="text-muted-foreground">Destination:</span>
              <p className="font-semibold text-foreground text-sm">{outpass.destination_city}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="text-muted-foreground">Purpose / Reason:</span>
              <p className="font-medium text-foreground">{outpass.reason}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-muted-foreground">Departure Date & Time:</span>
              <p className="font-medium text-foreground">{formatDate(outpass.leave_start_date)}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="text-muted-foreground">Expected Return Time:</span>
              <p className="font-medium text-foreground">{formatDate(outpass.return_expected_date)}</p>
            </div>
          </div>
        </div>

        {/* Action Remarks or Display Remarks */}
        {outpass.guardian_remarks && (
          <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40 text-xs">
            <span className="text-muted-foreground">Guardian Note: </span>
            <span className="text-foreground font-medium">{outpass.guardian_remarks}</span>
          </div>
        )}

        {/* Action Buttons for Pending Request */}
        {isPending && (
          <div className="pt-2 border-t border-border/40 space-y-3">
            <input
              type="text"
              placeholder="Optional remarks (e.g., Confirmed with ward over phone)..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-border/60 bg-background/50 focus:outline-none focus:ring-1 focus:ring-primary"
            />

            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReject}
                disabled={isSubmitting}
                className="text-xs text-red-600 dark:text-red-400 border-red-500/30 hover:bg-red-500/10"
              >
                <XCircle className="h-3.5 w-3.5 mr-1" />
                Decline Leave
              </Button>

              <Button
                size="sm"
                onClick={handleApprove}
                disabled={isSubmitting}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                Authorize & Approve Out-Pass
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
