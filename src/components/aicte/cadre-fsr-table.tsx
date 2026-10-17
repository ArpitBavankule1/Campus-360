"use client";

import React from "react";
import { AicteCadreFsrMetric } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle2, Award, GraduationCap } from "lucide-react";

interface CadreFsrTableProps {
  metrics: AicteCadreFsrMetric[];
}

export function CadreFsrTable({ metrics }: CadreFsrTableProps) {
  return (
    <Card className="border-border/80 bg-card/60 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/50 border-b border-border/80 uppercase font-semibold text-muted-foreground text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-3 text-center">Total Students</th>
                <th className="py-3 px-3 text-center">Req / Avail Faculty</th>
                <th className="py-3 px-3 text-center">FSR Ratio</th>
                <th className="py-3 px-3 text-center">Cadre (Prof : Assoc : Asst)</th>
                <th className="py-3 px-3 text-center">Ph.D. Qualified</th>
                <th className="py-3 px-4 text-right">Cadre Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {metrics.map((row) => (
                <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-semibold text-foreground">
                    {row.department}
                  </td>

                  <td className="py-3 px-3 text-center font-mono font-medium text-foreground">
                    {row.total_students}
                  </td>

                  <td className="py-3 px-3 text-center font-mono">
                    <span className="text-muted-foreground">{row.required_faculty}</span> /{" "}
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{row.available_faculty}</span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <Badge variant="outline" className="font-mono text-[10px] bg-primary/10 text-primary border-primary/20">
                      {row.fsr_ratio}
                    </Badge>
                  </td>

                  <td className="py-3 px-3 text-center font-mono text-[11px]">
                    <span className="font-bold text-foreground">{row.professors_count}</span> :{" "}
                    <span className="font-bold text-foreground">{row.assoc_professors_count}</span> :{" "}
                    <span className="font-bold text-foreground">{row.asst_professors_count}</span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className="font-semibold text-foreground">{row.phd_faculty_pct}%</span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    {row.cadre_ratio_compliant ? (
                      <Badge variant="outline" className="text-[10px] gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                        <CheckCircle2 className="h-3 w-3" />
                        1:2:6 Ratio Met
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30">
                        Deviation
                      </Badge>
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
