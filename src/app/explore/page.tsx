"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PortalLayout } from "@/components/layout/portal-layout";
import { LocationFilters, type FilterState } from "@/components/campus/location-filters";
import { LocationCard } from "@/components/campus/location-card";
import { CampusMap } from "@/components/campus/campus-map";
import { getCampusLocations, type LocationRow, MOCK_LOCATIONS } from "@/lib/supabase/queries";
import { Compass, MapPin, LayoutGrid, Map, ArrowLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "cn";

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "all";

  const [locations, setLocations] = useState<LocationRow[]>(MOCK_LOCATIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "split" | "map">("grid");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: initialQuery,
    category: initialCategory,
    accessibleOnly: false,
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getCampusLocations();
        if (data && data.length > 0) {
          setLocations(data);
        }
      } catch (err) {
        console.error("Failed to load locations:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Filtered locations
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      // Category filter
      if (filters.category !== "all" && loc.category !== filters.category) {
        return false;
      }

      // Accessibility filter
      if (filters.accessibleOnly && !loc.is_accessible) {
        return false;
      }

      // Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = loc.name.toLowerCase().includes(q);
        const matchesBuilding = loc.building.toLowerCase().includes(q);
        const matchesRoom = loc.room_number?.toLowerCase().includes(q);
        const matchesCode = loc.code?.toLowerCase().includes(q);
        const matchesDesc = loc.description?.toLowerCase().includes(q);

        return matchesName || matchesBuilding || matchesRoom || matchesCode || matchesDesc;
      }

      return true;
    });
  }, [locations, filters]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/70">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Compass className="h-7 w-7 text-primary" />
            <span>Campus Explorer</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Discover academic lecture halls, digital libraries, laboratories, and athletic spaces
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-card border border-border/70 shadow-2xs self-start md:self-center">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
              viewMode === "grid"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Grid Cards</span>
          </button>

          <button
            onClick={() => setViewMode("split")}
            className={cn(
              "hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
              viewMode === "split"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>Split View</span>
          </button>

          <button
            onClick={() => setViewMode("map")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
              viewMode === "map"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            <Map className="h-3.5 w-3.5" />
            <span>Full Map</span>
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <LocationFilters
        filters={filters}
        onFilterChange={setFilters}
        totalCount={filteredLocations.length}
      />

      {/* Main View Area */}
      {viewMode === "map" ? (
        <div className="space-y-4">
          <CampusMap
            locations={filteredLocations}
            selectedLocationId={selectedLocationId}
            onLocationSelect={(loc) => setSelectedLocationId(loc.id)}
            className="h-[620px] w-full"
          />
        </div>
      ) : viewMode === "split" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 space-y-4 max-h-[700px] overflow-y-auto pr-1">
            {filteredLocations.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-muted/20 border border-dashed text-xs text-muted-foreground">
                No matching campus locations found.
              </div>
            ) : (
              filteredLocations.map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLocationId(loc.id)}
                  className="cursor-pointer"
                >
                  <LocationCard location={loc} />
                </div>
              ))
            )}
          </div>

          <div className="lg:col-span-6 sticky top-20">
            <CampusMap
              locations={filteredLocations}
              selectedLocationId={selectedLocationId}
              onLocationSelect={(loc) => setSelectedLocationId(loc.id)}
              className="h-[650px] w-full"
            />
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        <div>
          {filteredLocations.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-card border border-dashed border-border/80 space-y-3">
              <Compass className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
              <h3 className="text-base font-bold text-foreground">No campus spaces match your criteria</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Try clearing your search query or selecting a different category from the filter pills above.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilters({ searchQuery: "", category: "all", accessibleOnly: false })
                }
                className="text-xs mt-2"
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLocations.map((loc) => (
                <LocationCard key={loc.id} location={loc} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <PortalLayout>
      <Suspense fallback={<div className="p-12 text-center text-xs text-muted-foreground">Loading Campus Explorer...</div>}>
        <ExploreContent />
      </Suspense>
    </PortalLayout>
  );
}
