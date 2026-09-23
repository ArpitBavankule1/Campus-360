"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PortalLayout } from "@/components/layout/portal-layout";
import { CampusMap } from "@/components/campus/campus-map";
import { getCampusLocations, type LocationRow, MOCK_LOCATIONS } from "@/lib/supabase/queries";
import {
  MapPin,
  Search,
  ArrowLeft,
  Navigation,
  Building,
  Clock,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "cn";

function MapPageContent() {
  const searchParams = useSearchParams();
  const targetId = searchParams.get("id");

  const [locations, setLocations] = useState<LocationRow[]>(MOCK_LOCATIONS);
  const [selectedId, setSelectedId] = useState<string | null>(targetId || null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    async function load() {
      const data = await getCampusLocations();
      if (data && data.length > 0) {
        setLocations(data);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (targetId) {
      setSelectedId(targetId);
    }
  }, [targetId]);

  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      if (selectedCategory !== "all" && loc.category !== selectedCategory) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          loc.name.toLowerCase().includes(q) ||
          loc.building.toLowerCase().includes(q) ||
          loc.room_number?.toLowerCase().includes(q) ||
          loc.code?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [locations, selectedCategory, search]);

  const selectedLocation = useMemo(() => {
    return locations.find((l) => l.id === selectedId) || null;
  }, [locations, selectedId]);

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/explore"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Campus Explorer</span>
            </Link>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span>Interactive Campus Map</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Badge variant="outline" className="px-2.5 py-1">
            Apex Tech Campus (12.9716° N, 77.5946° E)
          </Badge>
        </div>
      </div>

      {/* Main Map + Directory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Space Directory */}
        <div className="lg:col-span-4 rounded-3xl bg-card border border-border/70 p-4 shadow-xs space-y-3 flex flex-col h-[650px]">
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Find room or building..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9 rounded-xl bg-muted/30 text-xs"
              />
            </div>

            {/* Quick Category filter buttons */}
            <div className="flex gap-1 overflow-x-auto pb-1 text-[11px] no-scrollbar">
              {["all", "academic", "library", "laboratory", "cafeteria", "sports"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg capitalize font-medium transition-all shrink-0 cursor-pointer",
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-muted/40 text-muted-foreground hover:bg-muted/70"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List of locations */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-border/40">
            {filteredLocations.map((loc) => {
              const isSelected = loc.id === selectedId;

              return (
                <div
                  key={loc.id}
                  onClick={() => setSelectedId(loc.id)}
                  className={cn(
                    "p-3 rounded-2xl transition-all duration-150 cursor-pointer text-left space-y-1 mt-1",
                    isSelected
                      ? "bg-primary/10 border border-primary/40 shadow-xs"
                      : "hover:bg-muted/40 border border-transparent"
                  )}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-foreground line-clamp-1">
                      {loc.name}
                    </span>
                    {loc.code && (
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {loc.code}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-muted-foreground line-clamp-1 flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    <span>{loc.building} ({loc.floor || "Main"})</span>
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    <span className="capitalize text-primary font-semibold">
                      {loc.category}
                    </span>
                    <span className="text-muted-foreground">
                      {loc.opening_time || "8 AM"} - {loc.closing_time || "8 PM"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Geospatial Interactive Map */}
        <div className="lg:col-span-8">
          <CampusMap
            locations={filteredLocations}
            selectedLocationId={selectedId}
            onLocationSelect={(loc) => setSelectedId(loc.id)}
            className="h-[650px] w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <PortalLayout>
      <Suspense fallback={<div className="p-12 text-center text-xs text-muted-foreground">Loading Interactive Campus Map...</div>}>
        <MapPageContent />
      </Suspense>
    </PortalLayout>
  );
}
