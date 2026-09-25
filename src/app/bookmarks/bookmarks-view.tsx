"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  MapPin,
  BellRing,
  Sparkles,
  Users,
  Trash2,
  ExternalLink,
  ArrowRight,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { EnrichedBookmark, BookmarkType } from "@/lib/supabase/queries";
import { cn } from "cn";

interface BookmarksViewProps {
  initialBookmarks: EnrichedBookmark[];
}

export function BookmarksView({ initialBookmarks }: BookmarksViewProps) {
  const [bookmarks, setBookmarks] = useState<EnrichedBookmark[]>(initialBookmarks);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const removeBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const filterTabs = [
    { label: "All Saved", value: "all", count: bookmarks.length },
    { label: "Locations", value: "location", count: bookmarks.filter((b) => b.entity_type === "location").length },
    { label: "Notices", value: "notice", count: bookmarks.filter((b) => b.entity_type === "notice").length },
    { label: "Events", value: "event", count: bookmarks.filter((b) => b.entity_type === "event").length },
    { label: "Faculty", value: "faculty", count: bookmarks.filter((b) => b.entity_type === "faculty").length },
  ];

  const filteredBookmarks = bookmarks.filter((b) => {
    if (activeFilter === "all") return true;
    return b.entity_type === activeFilter;
  });

  const getEntityIcon = (type: BookmarkType) => {
    switch (type) {
      case "location":
        return <MapPin className="w-4 h-4 text-emerald-500" />;
      case "notice":
        return <BellRing className="w-4 h-4 text-amber-500" />;
      case "event":
        return <Sparkles className="w-4 h-4 text-indigo-500" />;
      case "faculty":
        return <Users className="w-4 h-4 text-primary" />;
      default:
        return <Bookmark className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Filter Tabs Bar */}
      <div className="flex items-center justify-between gap-4 bg-card p-3 rounded-2xl border shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1.5 scrollbar-none">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded-full text-[10px]",
                    isActive ? "bg-white/20 text-white" : "bg-muted-foreground/20 text-muted-foreground"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {bookmarks.length > 0 && (
          <span className="text-xs text-muted-foreground hidden sm:block shrink-0 px-2 font-medium">
            {filteredBookmarks.length} bookmarked items
          </span>
        )}
      </div>

      {/* Bookmarks Grid */}
      <div className="space-y-3">
        {filteredBookmarks.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed bg-card/40 flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground">
              <Bookmark className="w-6 h-6 text-muted-foreground/60" />
            </div>
            <h3 className="font-semibold text-foreground">No Bookmarks in this Category</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              Save campus locations, official circulars, upcoming hackathons, or faculty contacts for quick 1-click access.
            </p>
            <div className="flex gap-2 pt-2">
              <Link
                href="/explore"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs"
              >
                <Compass className="w-3.5 h-3.5" />
                Explore Campus
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBookmarks.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden border border-border/70 hover:border-primary/50 transition-all hover:shadow-md bg-card/80 backdrop-blur-sm group flex flex-col justify-between"
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-muted shrink-0">
                        {getEntityIcon(item.entity_type)}
                      </div>
                      <div>
                        <Badge variant="secondary" className="text-[10px] capitalize font-medium">
                          {item.categoryLabel || item.entity_type}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground block mt-0.5">
                          Saved on {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBookmark(item.id)}
                      className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t flex items-center justify-between">
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Open Item</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
