"use client";

import React from "react";
import { AisheEnrollmentRecord } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Users,
  Globe,
  HeartHandshake,
  Percent,
  CheckCircle2,
} from "lucide-react";

interface EnrollmentDemographicsCardProps {
  records: AisheEnrollmentRecord[];
}

export function EnrollmentDemographicsCard({ records }: EnrollmentDemographicsCardProps) {
  const totalStudents = records.reduce((acc, c) => acc + c.total_enrolled, 0);
  const totalMale = records.reduce((acc, c) => acc + c.enrolled_male, 0);
  const totalFemale = records.reduce((acc, c) => acc + c.enrolled_female, 0);
  const gpi = totalMale > 0 ? (totalFemale / totalMale).toFixed(2) : "1.00";

  const totalSC = records.reduce((acc, c) => acc + c.sc_count, 0);
  const totalST = records.reduce((acc, c) => acc + c.st_count, 0);
  const totalOBC = records.reduce((acc, c) => acc + c.obc_count, 0);
  const totalGeneral = records.reduce((acc, c) => acc + c.general_count, 0);
  const totalEWS = records.reduce((acc, c) => acc + c.ews_count, 0);
  const totalPWD = records.reduce((acc, c) => acc + c.pwd_count, 0);
  const totalOutOfState = records.reduce((acc, c) => acc + c.out_of_state_count, 0);
  const totalForeign = records.reduce((acc, c) => acc + c.foreign_national_count, 0);

  const reservedTotal = totalSC + totalST + totalOBC + totalEWS + totalPWD;
  const socialInclusionPct = totalStudents > 0 ? ((reservedTotal / totalStudents) * 100).toFixed(1) : "0.0";
  const diversityPct = totalStudents > 0 ? (((totalOutOfState + totalForeign) / totalStudents) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium">Total Enrollment</span>
              <div className="text-2xl font-bold text-foreground">{totalStudents.toLocaleString()}</div>
              <span className="text-[11px] text-muted-foreground">Across all UG, PG & PhD Disciplines</span>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium">Gender Parity Index (GPI)</span>
              <div className="text-2xl font-bold text-emerald-500">{gpi}</div>
              <span className="text-[11px] text-muted-foreground">
                {totalFemale.toLocaleString()} Female ({((totalFemale / totalStudents) * 100).toFixed(1)}%) vs {totalMale.toLocaleString()} Male
              </span>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
              <HeartHandshake className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium">Socio-Economic Inclusion</span>
              <div className="text-2xl font-bold text-purple-500">{socialInclusionPct}%</div>
              <span className="text-[11px] text-muted-foreground">{reservedTotal.toLocaleString()} SC/ST/OBC/EWS/PwD Scholars</span>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
              <Percent className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium">National & Global Diversity</span>
              <div className="text-2xl font-bold text-amber-500">{diversityPct}%</div>
              <span className="text-[11px] text-muted-foreground">{totalOutOfState} Interstate + {totalForeign} Foreign</span>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
              <Globe className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Program-wise Enrollment Telemetry Table */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3 border-b border-border/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-500" />
                Block C: Programme-Wise Student Enrollment Telemetry
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Statutory AISHE Data Capture Format breakdown by discipline, level, gender and category
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-semibold self-start sm:self-auto border-blue-500/30 text-blue-400">
              {records.length} Verified Disciplines
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border/40">
                <tr>
                  <th className="text-left py-3 px-4">Discipline / Programme</th>
                  <th className="text-center py-3 px-3">Level</th>
                  <th className="text-right py-3 px-3">Intake</th>
                  <th className="text-right py-3 px-3">Male</th>
                  <th className="text-right py-3 px-3">Female</th>
                  <th className="text-right py-3 px-3">Total</th>
                  <th className="text-right py-3 px-3">SC / ST</th>
                  <th className="text-right py-3 px-3">OBC / EWS</th>
                  <th className="text-right py-3 px-4">Interstate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">
                      {r.discipline_name}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                        {r.programme_level}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-muted-foreground">{r.sanctioned_intake}</td>
                    <td className="py-3 px-3 text-right font-mono text-blue-400">{r.enrolled_male}</td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-400">{r.enrolled_female}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-foreground">{r.total_enrolled}</td>
                    <td className="py-3 px-3 text-right font-mono text-muted-foreground">
                      {r.sc_count + r.st_count}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-muted-foreground">
                      {r.obc_count + r.ews_count}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-amber-500 font-medium">
                      {r.out_of_state_count + r.foreign_national_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
