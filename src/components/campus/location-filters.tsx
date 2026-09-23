"use client";

import { Search, SlidersHorizontal, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "cn";

export interface FilterState {
  searchQuery: string;
  category: string;
  accessibleOnly: boolean;
}

interface LocationFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalCount: number;
}

const CATEGORIES = [
  { id: "all", label: "All Spaces" },
  { id: "academic", label: "Academic & Lecture Halls" },
  { id: "library", label: "Library & Study Hubs" },
  { id: "laboratory", label: "Laboratories & AI" },
  { id: "auditorium", label: "Auditoriums" },
  { id: "cafeteria", label: "Cafeteria & Dining" },
  { id: "sports", label: "Sports & Fitness" },
];

export function LocationFilters({
  filters,
  onFilterChange,
  totalCount,
}: LocationFiltersProps) {
  return (
    <div className="space-y-4 rounded-3xl bg-card border border-border/70 p-5 shadow-xs">
      {/* Top search & accessible toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search by building, room number, or facility..."
            value={filters.searchQuery}
            onChange={(e) =>
              onFilterChange({ ...filters, searchQuery: e.target.value })
            }
            className="pl-10 h-10 rounded-xl bg-muted/30 text-sm"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-foreground">
            <input
              type="checkbox"
              checked={filters.accessibleOnly}
              onChange={(e) =>
                onFilterChange({ ...filters, accessibleOnly: e.target.checked })
              }
              className="h-4 w-4 rounded-md border-border/80 text-primary accent-primary focus:ring-primary/20"
            />
            <span>Wheelchair Accessible Only</span>
          </label>

          <Badge variant="outline" className="text-xs px-2.5 py-1">
            {totalCount} {totalCount === 1 ? "space" : "spaces"} found
          </Badge>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
        {CATEGORIES.map((cat) => {
          const isActive = filters.category === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ ...filters, category: cat.id })}
              className={cn(
                "px-3.5 py-1.5 rounded-full font-medium transition-all duration-150 shrink-0 cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/70 border border-border/50"
              )}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
