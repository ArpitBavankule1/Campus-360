"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/portal-layout";
import { getEventsList, type EventRow, MOCK_EVENTS } from "@/lib/supabase/queries";
import {
  Sparkles,
  Calendar,
  MapPin,
  Search,
  ArrowLeft,
  ExternalLink,
  Users,
  CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

function EventsContent() {
  const [events, setEvents] = useState<EventRow[]>(MOCK_EVENTS);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getEventsList();
      if (data && data.length > 0) {
        setEvents(data);
      }
    }
    load();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (selectedCategory !== "all" && e.category !== selectedCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.organizer.toLowerCase().includes(q);
      }
      return true;
    });
  }, [events, selectedCategory, search]);

  const featuredEvent = useMemo(() => {
    return events.find((e) => e.is_featured) || events[0];
  }, [events]);

  const toggleRegister = (id: string) => {
    setRegisteredIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
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
            <Sparkles className="h-7 w-7 text-primary" />
            <span>Campus Events & Symposiums</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Technical hackathons, research summits, cultural fests, and sports tournaments
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Badge variant="outline" className="px-3 py-1 text-xs">
            {filteredEvents.length} Active Events
          </Badge>
        </div>
      </div>

      {/* Featured Event Hero */}
      {featuredEvent && (
        <div className="relative overflow-hidden rounded-3xl bg-card border border-border/70 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {featuredEvent.image_url && (
              <div className="lg:col-span-6 relative h-64 lg:h-80 w-full overflow-hidden bg-muted">
                <img
                  src={featuredEvent.image_url}
                  alt={featuredEvent.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground font-bold text-xs uppercase px-3 py-1 shadow-xs">
                    Featured Event
                  </Badge>
                </div>
              </div>
            )}

            <div className="lg:col-span-6 p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="capitalize font-bold text-primary">{featuredEvent.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
                    new Date(featuredEvent.start_date)
                  )}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground leading-snug">
                {featuredEvent.title}
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {featuredEvent.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/50">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  {featuredEvent.venue_name}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  By {featuredEvent.organizer}
                </span>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => toggleRegister(featuredEvent.id)}
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "text-xs font-bold px-4 h-9 shadow-xs cursor-pointer flex items-center gap-1.5",
                    registeredIds.includes(featuredEvent.id)
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : ""
                  )}
                >
                  {registeredIds.includes(featuredEvent.id) ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Registration Confirmed</span>
                    </>
                  ) : (
                    <span>Register for Event</span>
                  )}
                </button>

                <Link
                  href="/map"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "text-xs font-semibold h-9 px-3"
                  )}
                >
                  <MapPin className="h-3.5 w-3.5 mr-1 text-primary" />
                  <span>View Venue</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Strip */}
      <div className="rounded-3xl bg-card border border-border/70 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search by event title, organizer, or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-muted/30 text-sm"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 text-xs overflow-x-auto pb-1">
            {["all", "tech", "sports", "cultural"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-xl capitalize font-medium transition-all shrink-0 cursor-pointer",
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted/70 border border-border/50"
                )}
              >
                {cat === "all" ? "All Events" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const startDate = new Date(event.start_date);
          const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(startDate);
          const day = startDate.getDate();
          const isRegistered = registeredIds.includes(event.id);

          return (
            <div
              key={event.id}
              className="group flex flex-col justify-between rounded-3xl bg-card border border-border/70 overflow-hidden shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/40"
            >
              {/* Event Image & Date Badge */}
              <div className="relative h-44 w-full overflow-hidden bg-muted">
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-muted">
                    <Calendar className="h-10 w-10 text-muted-foreground opacity-30" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Date Badge */}
                <div className="absolute top-3 left-3 flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-card/90 backdrop-blur-md border shadow-xs text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    {month}
                  </span>
                  <span className="text-sm font-extrabold text-foreground leading-none">
                    {day}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider backdrop-blur-md bg-background/80">
                    {event.category}
                  </Badge>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate">{event.venue_name}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] truncate max-w-[130px]">
                      By {event.organizer}
                    </span>

                    <button
                      onClick={() => toggleRegister(event.id)}
                      className={cn(
                        buttonVariants({
                          variant: isRegistered ? "default" : "outline",
                          size: "sm",
                        }),
                        "h-7 text-xs font-semibold px-2.5 cursor-pointer shadow-2xs",
                        isRegistered && "bg-emerald-600 hover:bg-emerald-700 text-white"
                      )}
                    >
                      {isRegistered ? "Registered ✓" : "Register"}
                    </button>
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

export default function EventsPage() {
  return (
    <PortalLayout>
      <Suspense fallback={<div className="p-12 text-center text-xs text-muted-foreground">Loading Campus Events...</div>}>
        <EventsContent />
      </Suspense>
    </PortalLayout>
  );
}
