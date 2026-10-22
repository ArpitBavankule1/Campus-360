"use client";

import React, { useState } from "react";
import { SamarthSyncLog } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  ArrowLeftRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Hash,
  RefreshCw,
  Search,
} from "lucide-react";

interface SyncTelemetryCardProps {
  logs: SamarthSyncLog[];
  onTriggerSync?: () => void;
}

export function SyncTelemetryCard({
  logs,
  onTriggerSync,
}: SyncTelemetryCardProps) {
  const [filterDirection, setFilterDirection] = useState<string>("ALL");

  const directionIcons = {
    INBOUND: <ArrowDownRight className="h-3.5 w-3.5 text-blue-400" />,
    OUTBOUND: <ArrowUpRight className="h-3.5 w-3.5 text-purple-400" />,
    BIDIRECTIONAL: <ArrowLeftRight className="h-3.5 w-3.5 text-emerald-400" />,
  };

  const statusBadges = {
    COMPLETED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    IN_PROGRESS: "bg-blue-500/15 text-blue-400 border-blue-500/30 animate-pulse",
    PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    FAILED: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  };

  const filtered = logs.filter((l) => {
    if (filterDirection === "ALL") return true;
    return l.direction === filterDirection;
  });

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              SAMARTH ERP Sync Telemetry & Transaction Pipeline
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Live bi-directional synchronization logs between CampusLens multi-tenant database and MoE SAMARTH ERP
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-border/50 p-0.5 text-xs">
              {["ALL", "INBOUND", "OUTBOUND", "BIDIRECTIONAL"].map((dir) => (
                <button
                  key={dir}
                  onClick={() => setFilterDirection(dir)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                    filterDirection === dir
                      ? "bg-indigo-600 text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {dir}
                </button>
              ))}
            </div>
            <Button
              size="sm"
              onClick={onTriggerSync}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Sync Telemetry
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border border-border/50 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/50 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Sync Token & Module</th>
                <th className="py-2.5 px-3">Direction</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Records Processed</th>
                <th className="py-2.5 px-3">Latency</th>
                <th className="py-2.5 px-3">Checksum</th>
                <th className="py-2.5 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono text-[11px]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-foreground">
                    <div>
                      <span className="text-indigo-400 font-semibold">{log.sync_token}</span>
                      <p className="text-[10px] text-muted-foreground font-sans mt-0.5">
                        {log.module_key}
                      </p>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="flex items-center gap-1.5 font-medium text-foreground">
                      {directionIcons[log.direction]}
                      {log.direction}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans">
                    <Badge className={`text-[10px] px-2 py-0.5 font-semibold ${statusBadges[log.status]}`}>
                      {log.status}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-foreground font-semibold">{log.records_processed}</span>{" "}
                    <span className="text-muted-foreground text-[10px] font-sans">
                      ({log.records_updated} updated, {log.records_failed} failed)
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground font-sans">
                    <span className="text-indigo-400 font-semibold font-mono">{log.latency_ms} ms</span>
                  </td>
                  <td className="py-2.5 px-3 text-[10px] text-muted-foreground/80 max-w-[140px] truncate">
                    {log.payload_checksum}
                  </td>
                  <td className="py-2.5 px-3 text-right text-muted-foreground font-sans">
                    {new Date(log.synced_at).toLocaleTimeString()}
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
