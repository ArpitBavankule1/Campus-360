"use client";

import React, { useState } from "react";
import { SamarthStudentOnboarding } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  CreditCard,
  KeyRound,
  FileText,
  BadgeCheck,
} from "lucide-react";

interface StudentOnboardingCardProps {
  onboardings: SamarthStudentOnboarding[];
  onVerifyOnboarding?: (token: string) => void;
}

export function StudentOnboardingCard({
  onboardings,
  onVerifyOnboarding,
}: StudentOnboardingCardProps) {
  const [search, setSearch] = useState("");
  const [quotaFilter, setQuotaFilter] = useState("ALL");

  const verificationBadges: Record<string, string> = {
    VERIFIED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    IN_REVIEW: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    PROVISIONAL: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    FLAGGED: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  };

  const filtered = onboardings.filter((stu) => {
    const matchesSearch =
      stu.student_name.toLowerCase().includes(search.toLowerCase()) ||
      stu.enrollment_number.toLowerCase().includes(search.toLowerCase()) ||
      stu.apaar_id.toLowerCase().includes(search.toLowerCase()) ||
      stu.program_name.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-500" />
              SAMARTH Student Lifecycle & Digital Onboarding Ledger
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Unified scholar registry linked with APAAR ID, DigiLocker credentials & MoE SAMARTH Single Sign-On (SSO)
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scholar or APAAR..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs h-9 bg-background/50"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border border-border/50 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/50 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Scholar & Enrollment</th>
                <th className="py-2.5 px-3">Program & Quota</th>
                <th className="py-2.5 px-3">APAAR / ABC ID</th>
                <th className="py-2.5 px-3">Verification</th>
                <th className="py-2.5 px-3">Fee Status</th>
                <th className="py-2.5 px-3">Integrations</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map((stu) => (
                <tr key={stu.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-foreground">
                    <div>
                      <span className="font-semibold">{stu.student_name}</span>
                      <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                        {stu.enrollment_number}
                      </p>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <p className="font-medium text-foreground">{stu.program_name}</p>
                    <p className="text-[10px] text-indigo-400">{stu.admission_quota}</p>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-muted-foreground">
                    <span className="bg-muted/40 px-1.5 py-0.5 rounded border border-border/40">
                      {stu.apaar_id}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <Badge className={`text-[10px] px-2 py-0.5 font-semibold ${verificationBadges[stu.verification_status]}`}>
                      {stu.verification_status}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[11px] font-semibold ${
                        stu.fee_clearance_status === "CLEARED"
                          ? "text-emerald-400"
                          : "text-amber-400"
                      }`}
                    >
                      {stu.fee_clearance_status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5 text-[10px]">
                      {stu.digilocker_verified && (
                        <Badge variant="outline" className="text-[9px] px-1 py-0 text-blue-400 border-blue-500/30">
                          DigiLocker ✓
                        </Badge>
                      )}
                      {stu.samarth_sso_linked && (
                        <Badge variant="outline" className="text-[9px] px-1 py-0 text-indigo-400 border-indigo-500/30">
                          SSO Active
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {stu.verification_status !== "VERIFIED" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onVerifyOnboarding?.(stu.onboarding_token)}
                        className="text-[11px] h-7 px-2 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                      >
                        Verify
                      </Button>
                    ) : (
                      <span className="text-emerald-400 font-semibold text-[11px] flex items-center justify-end gap-1">
                        <BadgeCheck className="h-3.5 w-3.5" /> Enrolled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
