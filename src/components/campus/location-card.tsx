"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  ArrowRight,
  Bookmark,
  Sparkles,
  CheckCircle2,
  Building,
  Navigation,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { LocationRow } from "@/lib/supabase/queries";
import { cn } from "cn";

interface LocationCardProps {
  location: LocationRow;
}

export function LocationCard({ location }: LocationCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "academic":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20";
      case "library":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20";
      case "laboratory":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20";
      case "sports":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
      case "cafeteria":
        return "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20";
      case "auditorium":
        return "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl bg-card border border-border/70 overflow-hidden shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/40">
      {/* Cover Image & Badges */}
      <div className="relative h-44 w-full bg-muted overflow-hidden">
        {location.image_url ? (
          <img
            src={location.image_url}
            alt={location.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
            <Building className="h-10 w-10 opacity-30" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category Pill Top Left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={cn(
              "text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md shadow-2xs",
              getCategoryColor(location.category)
            )}
          >
            {location.category}
          </span>
          {location.code && (
            <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-background/80 backdrop-blur-md text-foreground border shadow-2xs">
              {location.code}
            </span>
          )}
        </div>

        {/* Bookmark Button Top Right */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsBookmarked(!isBookmarked);
          }}
          className={cn(
            "absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center backdrop-blur-md border shadow-xs transition-all cursor-pointer",
            isBookmarked
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background/80 text-foreground hover:bg-background border-border/70"
          )}
          title={isBookmarked ? "Remove Bookmark" : "Save Space"}
        >
          <Bookmark className="h-4 w-4" />
        </button>

        {/* Bottom Bar Info */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
          <span className="flex items-center gap-1 font-medium drop-shadow-xs">
            <Building className="h-3.5 w-3.5" />
            <span className="truncate">{location.building}</span>
          </span>

          {location.floor && (
            <span className="text-[11px] bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md drop-shadow-xs">
              {location.floor}
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
              {location.name}
            </h3>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {location.description || "Campus location available for students and staff."}
          </p>

          {/* Amenities Badges */}
          {location.amenities && location.amenities.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {location.amenities.slice(0, 3).map((amenity) => (
                <span
                  key={amenity}
                  className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md border border-border/50 font-medium"
                >
                  {amenity}
                </span>
              ))}
              {location.amenities.length > 3 && (
                <span className="text-[10px] text-muted-foreground/70">
                  +{location.amenities.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3 text-emerald-600" />
            <span>{location.opening_time || "08:00 AM"} – {location.closing_time || "08:00 PM"}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={`/map?id=${location.id}`}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-8 text-xs font-semibold px-2.5 flex items-center gap-1"
              )}
            >
              <Navigation className="h-3 w-3 text-primary" />
              <span>Map</span>
            </Link>

            <Link
              href={`/explore/${location.id}`}
              className={cn(
                buttonVariants({ size: "sm" }),
                "h-8 text-xs font-semibold px-3 flex items-center gap-1 shadow-2xs"
              )}
            >
              <span>View</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
