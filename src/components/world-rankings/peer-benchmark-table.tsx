"use client";

import React from "react";
import { WorldRankingBenchmark } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Globe2 } from "lucide-react";

interface PeerBenchmarkTableProps {
  benchmarks: WorldRankingBenchmark[];
}

export function PeerBenchmarkTable({ benchmarks }: PeerBenchmarkTableProps) {
  return (
    <Card className="border-border/80 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Global Peer Institutional Benchmarking</CardTitle>
              <p className="text-xs text-muted-foreground">
                Comparative indicators against world-leading universities (MIT, Oxford, NUS, IIT Bombay)
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            {benchmarks.length} Institutions
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-1">
        <div className="rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="p-3 font-semibold text-xs text-muted-foreground">Institution</th>
                <th className="p-3 font-semibold text-xs text-center text-muted-foreground">QS Rank</th>
                <th className="p-3 font-semibold text-xs text-center text-muted-foreground">THE Rank</th>
                <th className="p-3 font-semibold text-xs text-center text-muted-foreground">Citations / Faculty</th>
                <th className="p-3 font-semibold text-xs text-center text-muted-foreground">Intl Students %</th>
                <th className="p-3 font-semibold text-xs text-center text-muted-foreground">Faculty-Student</th>
                <th className="p-3 font-semibold text-xs text-center text-muted-foreground">Academic Rep</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {benchmarks.map((b) => {
                const isOurInstitution = b.peer_institution_name.includes("CampusLens");
                return (
                  <tr
                    key={b.id}
                    className={
                      isOurInstitution
                        ? "bg-primary/10 font-medium hover:bg-primary/15 transition-colors"
                        : "hover:bg-muted/30 transition-colors"
                    }
                  >
                    <td className="p-3 text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <Globe2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        <div>
                          <div>{b.peer_institution_name}</div>
                          <div className="text-[11px] text-muted-foreground font-normal">
                            {b.peer_country}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-xs text-center font-mono font-bold">
                      #{b.peer_qs_rank}
                    </td>

                    <td className="p-3 text-xs text-center font-mono">
                      #{b.peer_the_rank}
                    </td>

                    <td className="p-3 text-xs text-center font-mono">
                      {b.citations_per_faculty.toFixed(1)}
                    </td>

                    <td className="p-3 text-xs text-center font-mono">
                      {b.international_student_pct.toFixed(1)}%
                    </td>

                    <td className="p-3 text-xs text-center font-mono">
                      1:{b.faculty_student_ratio.toFixed(1)}
                    </td>

                    <td className="p-3 text-xs text-center font-mono">
                      {b.academic_reputation_score.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
