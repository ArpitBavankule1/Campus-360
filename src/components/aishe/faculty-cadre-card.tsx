"use client";

import React from "react";
import { AisheFacultyCadre } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users2,
  Award,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

interface FacultyCadreCardProps {
  cadres: AisheFacultyCadre[];
}

export function FacultyCadreCard({ cadres }: FacultyCadreCardProps) {
  const totalSanctioned = cadres.reduce((acc, c) => acc + c.sanctioned_posts, 0);
  const totalRegular = cadres.reduce((acc, c) => acc + c.regular_in_position, 0);
  const totalContractual = cadres.reduce((acc, c) => acc + c.contractual_in_position, 0);
  const totalFaculty = totalRegular + totalContractual;
  const totalPhd = cadres.reduce((acc, c) => acc + c.phd_holders, 0);
  const totalMale = cadres.reduce((acc, c) => acc + c.male_faculty, 0);
  const totalFemale = cadres.reduce((acc, c) => acc + c.female_faculty, 0);

  const phdPercentage = totalFaculty > 0 ? ((totalPhd / totalFaculty) * 100).toFixed(1) : "0.0";
  const fulfillmentPct = totalSanctioned > 0 ? ((totalRegular / totalSanctioned) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      {/* Top Faculty KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium">Total Teaching Faculty</span>
              <div className="text-2xl font-bold text-foreground">{totalFaculty}</div>
              <span className="text-[11px] text-muted-foreground">{totalRegular} Regular + {totalContractual} Adjunct</span>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <Users2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium">Doctoral Qualification (Ph.D.)</span>
              <div className="text-2xl font-bold text-emerald-500">{phdPercentage}%</div>
              <span className="text-[11px] text-muted-foreground">{totalPhd} Doctoral Degree Holders</span>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
              <Award className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium">Cadre Sanction Fulfillment</span>
              <div className="text-2xl font-bold text-indigo-500">{fulfillmentPct}%</div>
              <span className="text-[11px] text-muted-foreground">{totalRegular} of {totalSanctioned} Sanctioned Posts</span>
            </div>
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium">Faculty Gender Diversity</span>
              <div className="text-2xl font-bold text-purple-500">
                {totalFemale} : {totalMale}
              </div>
              <span className="text-[11px] text-muted-foreground">
                {((totalFemale / totalFaculty) * 100).toFixed(1)}% Women Faculty Presence
              </span>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
              <GraduationCap className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cadre Details Table */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3 border-b border-border/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-500" />
                Block E: Staff & Faculty Cadre Strength Breakdown
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Statutory cadre distribution under UGC/AICTE Cadre Ratio Norms (1:2:6)
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-semibold self-start sm:self-auto border-indigo-500/30 text-indigo-400">
              UGC Cadre Ratio Compliant
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border/40">
                <tr>
                  <th className="text-left py-3 px-4">Designation / Cadre</th>
                  <th className="text-right py-3 px-3">Sanctioned</th>
                  <th className="text-right py-3 px-3">In Position (Reg)</th>
                  <th className="text-right py-3 px-3">Contract / Adj</th>
                  <th className="text-right py-3 px-3">Ph.D. Holders</th>
                  <th className="text-right py-3 px-3">Male</th>
                  <th className="text-right py-3 px-3">Female</th>
                  <th className="text-right py-3 px-4">SC/ST/OBC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {cadres.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-foreground capitalize">
                      {c.cadre_type.replace(/_/g, " ")}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-muted-foreground">{c.sanctioned_posts}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-foreground">{c.regular_in_position}</td>
                    <td className="py-3 px-3 text-right font-mono text-muted-foreground">{c.contractual_in_position}</td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-400 font-semibold">{c.phd_holders}</td>
                    <td className="py-3 px-3 text-right font-mono text-blue-400">{c.male_faculty}</td>
                    <td className="py-3 px-3 text-right font-mono text-purple-400">{c.female_faculty}</td>
                    <td className="py-3 px-4 text-right font-mono text-amber-500 font-medium">
                      {c.sc_faculty + c.st_faculty + c.obc_faculty}
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
