"use client";

import React, { useState } from "react";
import { SamarthModule, SamarthModuleCategory } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Layers,
  Search,
  CheckCircle,
  XCircle,
  RefreshCw,
  FolderTree,
  SlidersHorizontal,
  ArrowRight,
  Database,
} from "lucide-react";

interface ModuleCatalogCardProps {
  modules: SamarthModule[];
  onToggleModule?: (moduleKey: string) => void;
  onSyncModule?: (moduleKey: string) => void;
}

export function ModuleCatalogCard({
  modules,
  onToggleModule,
  onSyncModule,
}: ModuleCatalogCardProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = [
    { key: "ALL", label: "All Microservices" },
    { key: "student_lifecycle", label: "Student Life Cycle" },
    { key: "hrms_faculty", label: "HRMS & Faculty" },
    { key: "governance_academics", label: "Governance & BoS" },
    { key: "research_development", label: "Research & ANRF" },
    { key: "finance_logistics", label: "Finance & GeM" },
  ];

  const categoryBadges: Record<SamarthModuleCategory, string> = {
    student_lifecycle: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    hrms_faculty: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    governance_academics: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    research_development: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    finance_logistics: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  };

  const filtered = modules.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.module_key.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-500" />
              SAMARTH Microservices Catalog & Interop Directory
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              40+ integrated microservice packages for academic governance, student administration, and institutional ERP
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search modules..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 text-xs h-9 bg-background/50"
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3">
          {categories.map((c) => (
            <Button
              key={c.key}
              variant={selectedCategory === c.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(c.key)}
              className={`text-xs h-7 px-2.5 ${
                selectedCategory === c.key
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "border-border/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((mod) => (
            <div
              key={mod.id}
              className={`p-4 rounded-lg border transition-all ${
                mod.is_enabled
                  ? "border-border/60 bg-card/60 hover:border-indigo-500/40"
                  : "border-border/30 bg-muted/20 opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge
                  className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 ${categoryBadges[mod.category]}`}
                >
                  {mod.category.replace("_", " ")}
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-[10px] ${
                    mod.is_enabled
                      ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/10"
                      : "text-muted-foreground border-border/40"
                  }`}
                >
                  {mod.is_enabled ? "Active" : "Disabled"}
                </Badge>
              </div>

              <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-1">{mod.name}</h3>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                {mod.description}
              </p>

              <div className="space-y-1.5 text-xs text-muted-foreground pt-2 border-t border-border/40 mb-3 font-mono">
                <div className="flex justify-between items-center text-[11px]">
                  <span>API Route:</span>
                  <span className="text-foreground/90 font-semibold">{mod.api_route}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span>Sync Frequency:</span>
                  <span className="capitalize text-indigo-400 font-semibold">{mod.sync_frequency}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span>Records Synced:</span>
                  <span className="text-emerald-400 font-semibold">{mod.total_records_synced.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onToggleModule?.(mod.module_key)}
                  className="w-1/2 text-[11px] h-7 border-border/60"
                >
                  {mod.is_enabled ? (
                    <span className="flex items-center gap-1 text-amber-500">
                      <XCircle className="h-3 w-3" /> Disable
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-500">
                      <CheckCircle className="h-3 w-3" /> Enable
                    </span>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSyncModule?.(mod.module_key)}
                  className="w-1/2 text-[11px] h-7 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
                >
                  <RefreshCw className="h-3 w-3 mr-1" /> Sync Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
