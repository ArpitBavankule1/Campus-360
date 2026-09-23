"use client";

import Link from "next/link";
import { Sparkles, MapPin, Calendar, ArrowRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { EventRow } from "@/lib/supabase/queries";
import { cn } from "cn";

interface UpcomingEventsProps {
  events: EventRow[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <div className="rounded-3xl bg-card border border-border/70 p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Campus Events & Fests
            </h2>
            <Badge variant="secondary" className="text-xs font-semibold">
              Upcoming
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Hackathons, tech conferences, and cultural celebrations
          </p>
        </div>

        <Link
          href="/events"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-xs font-semibold text-primary hover:text-primary flex items-center gap-1"
          )}
        >
          <span>Explore All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => {
          const startDate = new Date(event.start_date);
          const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(startDate);
          const day = startDate.getDate();

          return (
            <div
              key={event.id}
              className="group flex flex-col justify-between rounded-2xl bg-muted/20 border border-border/60 overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-primary/40"
            >
              {/* Event Image */}
              {event.image_url && (
                <div className="relative h-36 w-full overflow-hidden bg-muted">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Date Badge Float */}
                  <div className="absolute top-3 left-3 flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-card/90 backdrop-blur-md border shadow-xs text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {month}
                    </span>
                    <span className="text-sm font-extrabold text-foreground leading-none">
                      {day}
                    </span>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider backdrop-blur-md bg-background/80">
                      {event.category}
                    </Badge>
                  </div>
                </div>
              )}

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/40 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate">{event.venue_name}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-muted-foreground truncate max-w-[140px]">
                      By {event.organizer}
                    </span>

                    <Link
                      href="/events"
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "h-7 text-xs font-semibold px-2.5 flex items-center"
                      )}
                    >
                      <span>Details</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
