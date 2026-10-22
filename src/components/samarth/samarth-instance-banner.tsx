"use client";

import React from "react";
import { SamarthInstance } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Server,
  ShieldCheck,
  Activity,
  Layers,
  RefreshCw,
  ExternalLink,
  Building,
  CheckCircle2,
  Cpu,
} from "lucide-react";

interface SamarthInstanceBannerProps {
  instance: SamarthInstance;
  onTriggerSync?: () => void;
}

export function SamarthInstanceBanner({
  instance,
  onTriggerSync,
}: SamarthInstanceBannerProps) {
  const statusColors: Record<string, string> = {
    active: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    syncing: "bg-blue-500/15 text-blue-500 border-blue-500/30 animate-pulse",
    degraded: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    maintenance: "bg-rose-500/15 text-rose-500 border-rose-500/30",
  };

  return (
    <Card className="border-border/60 bg-gradient-to-r from-blue-950/20 via-background to-indigo-950/20 shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Instance Metadata & Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge className="bg-indigo-600/15 text-indigo-400 border-indigo-500/30 text-xs px-2.5 py-0.5 font-semibold">
                Ministry of Education • SAMARTH eGov Suite
              </Badge>
              <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/30 text-xs px-2.5 py-0.5 font-semibold flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Instance Code: {instance.instance_code}
              </Badge>
              <Badge className={`text-xs px-2.5 py-0.5 font-semibold capitalize flex items-center gap-1 ${statusColors[instance.deployment_status] || statusColors.active}`}>
                <Activity className="h-3 w-3" />
                Status: {instance.deployment_status}
              </Badge>
              <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs px-2.5 py-0.5 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Health: {instance.health_score}%
              </Badge>
              <Badge className="bg-purple-500/15 text-purple-400 border-purple-500/30 text-xs px-2.5 py-0.5 font-semibold flex items-center gap-1">
                <Cpu className="h-3 w-3" />
                {instance.samarth_version}
              </Badge>
            </div>

            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                <Server className="h-7 w-7 text-indigo-500 shrink-0" />
                {instance.institutional_name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                <Building className="h-4 w-4 text-muted-foreground/70" />
                MoE Code: <span className="font-semibold text-foreground">{instance.moe_institution_code}</span>
                {" • "}
                <span>Environment: </span>
                <span className="font-semibold text-indigo-400 uppercase text-xs">
                  {instance.environment}
                </span>
                {" • "}
                <span>Active Microservices: </span>
                <span className="font-semibold text-emerald-400 text-xs">
                  {instance.active_microservices_count} Microservices Active
                </span>
              </p>
            </div>

            {/* API Endpoint & Telemetry */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1 border-t border-border/40">
              <span className="flex items-center gap-1">
                <Layers className="h-3.5 w-3.5 text-indigo-400" />
                Gateway Route: <span className="font-mono text-foreground/80">{instance.api_endpoint_url}</span>
              </span>
              <span className="flex items-center gap-1">
                <RefreshCw className="h-3.5 w-3.5 text-blue-400" />
                Last Synchronized: <span className="font-medium text-foreground">{new Date(instance.last_sync_at).toLocaleString()}</span>
              </span>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex flex-row lg:flex-col items-center gap-2.5 shrink-0">
            <Button
              onClick={onTriggerSync}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2 w-full lg:w-auto text-xs"
            >
              <RefreshCw className="h-4 w-4" />
              Trigger ERP Sync
            </Button>
            <a
              href="https://samarth.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-border/60 hover:bg-muted/50 text-xs px-3 py-1.5 font-medium transition-colors w-full lg:w-auto text-muted-foreground hover:text-foreground gap-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              MoE SAMARTH Portal
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
