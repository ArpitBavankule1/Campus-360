"use client";

import Link from "next/link";
import { MapPin, Compass, ArrowRight, BookOpen, Utensils, Activity, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

const facilityStatus = [
  {
    name: "Central Digital Library",
    category: "Library & Pods",
    timing: "Open until 11:00 PM",
    status: "Open Now",
    statusColor: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    icon: BookOpen,
  },
  {
    name: "Apex AI & Robotics Hub",
    category: "GPU Workstations",
    timing: "Open until 09:00 PM",
    status: "Open Now",
    statusColor: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    icon: Cpu,
  },
  {
    name: "Student Cafeteria & Lounge",
    category: "Food Court",
    timing: "Open until 10:30 PM",
    status: "Open Now",
    statusColor: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    icon: Utensils,
  },
  {
    name: "Sports Complex & Gym",
    category: "Athletics",
    timing: "Open until 09:30 PM",
    status: "Open Now",
    statusColor: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    icon: Activity,
  },
];

export function CampusGlance() {
  return (
    <div className="rounded-3xl bg-card border border-border/70 p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Campus Facilities at a Glance
            </h2>
            <Badge variant="outline" className="text-xs">
              Live Hours
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time availability of major student centers
          </p>
        </div>

        <Link
          href="/map"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "text-xs font-semibold flex items-center gap-1.5"
          )}
        >
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span>Interactive Map</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {facilityStatus.map((facility) => {
          const Icon = facility.icon;

          return (
            <div
              key={facility.name}
              className="p-4 rounded-2xl bg-muted/20 border border-border/60 flex flex-col justify-between space-y-3 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-xl bg-background border shadow-2xs text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${facility.statusColor}`}>
                  {facility.status}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-foreground line-clamp-1">
                  {facility.name}
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {facility.category}
                </p>
                <p className="text-[11px] font-medium text-foreground/80 mt-1">
                  {facility.timing}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary text-primary-foreground shadow-xs shrink-0">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Need help finding a classroom or lab?</h4>
            <p className="text-xs text-muted-foreground">Use the Campus Explorer with step-by-step building & floor guides.</p>
          </div>
        </div>

        <Link
          href="/explore"
          className={cn(
            buttonVariants({ size: "sm" }),
            "shrink-0 text-xs font-semibold shadow-xs flex items-center"
          )}
        >
          <span>Launch Explorer</span>
          <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
        </Link>
      </div>
    </div>
  );
}
