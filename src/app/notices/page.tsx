"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/portal-layout";
import { getNoticesList, type NoticeRow, MOCK_NOTICES } from "@/lib/supabase/queries";
import {
  BellRing,
  Search,
  Pin,
  FileText,
  AlertCircle,
  Calendar,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Share2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "cn";

function NoticesContent() {
  const [notices, setNotices] = useState<NoticeRow[]>(MOCK_NOTICES);
  const [search, setSearch] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getNoticesList();
      if (data && data.length > 0) {
        setNotices(data);
      }
    }
    load();
  }, []);

  const filteredNotices = useMemo(() => {
    return notices.filter((notice) => {
      if (selectedPriority !== "all" && notice.priority !== selectedPriority) return false;
      if (selectedCategory !== "all" && notice.category !== selectedCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return notice.title.toLowerCase().includes(q) || notice.content.toLowerCase().includes(q);
      }
      return true;
    });
  }, [notices, selectedPriority, selectedCategory, search]);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return (
          <Badge className="bg-destructive/15 text-destructive border-destructive/30 text-[10px] h-5 px-2 font-bold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-ping" />
            Urgent
          </Badge>
        );
      case "important":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px] h-5 px-2 font-semibold">
            Important
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px] h-5 px-2 font-medium text-muted-foreground">
            Official
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
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
            <BellRing className="h-7 w-7 text-primary" />
            <span>Campus Notices & Circulars</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Official institutional circulars, exam schedules, and council announcements
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Badge variant="outline" className="px-3 py-1 text-xs">
            {filteredNotices.length} Active Circulars
          </Badge>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="rounded-3xl bg-card border border-border/70 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search circulars by keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-muted/30 text-sm"
            />
          </div>

          {/* Priority filter buttons */}
          <div className="flex items-center gap-1 text-xs overflow-x-auto pb-1">
            {["all", "urgent", "important", "normal"].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPriority(p)}
                className={cn(
                  "px-3 py-1.5 rounded-xl capitalize font-medium transition-all shrink-0 cursor-pointer",
                  selectedPriority === p
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted/70 border border-border/50"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-border/50 pt-3 text-xs">
          {["all", "exam", "academic", "event", "placement"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1 rounded-full capitalize font-medium transition-all shrink-0 cursor-pointer",
                selectedCategory === cat
                  ? "bg-foreground text-background font-semibold shadow-xs"
                  : "bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-card border border-dashed border-border/80 space-y-2">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
            <h3 className="text-base font-bold text-foreground">No circulars match your search</h3>
            <p className="text-xs text-muted-foreground">Try clearing your filters or search terms.</p>
          </div>
        ) : (
          filteredNotices.map((notice) => {
            const isExpanded = expandedId === notice.id;

            return (
              <div
                key={notice.id}
                className={cn(
                  "p-5 rounded-3xl border transition-all duration-200 shadow-xs",
                  notice.is_pinned
                    ? "bg-gradient-to-r from-primary/5 via-card to-card border-primary/30"
                    : "bg-card border-border/70"
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {getPriorityBadge(notice.priority)}
                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">
                      {notice.category}
                    </Badge>
                    {notice.is_pinned && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        <Pin className="h-3 w-3" />
                        Pinned Notice
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(notice.published_at))}
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground leading-snug">
                  {notice.title}
                </h3>

                <p className={cn("text-xs text-muted-foreground mt-2 leading-relaxed", !isExpanded && "line-clamp-2")}>
                  {notice.content}
                </p>

                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground/80 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    {notice.author_name}
                  </span>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : notice.id)}
                    className="flex items-center gap-1 text-primary font-bold hover:underline cursor-pointer"
                  >
                    <span>{isExpanded ? "Collapse Notice" : "Read Full Circular"}</span>
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function NoticesPage() {
  return (
    <PortalLayout>
      <Suspense fallback={<div className="p-12 text-center text-xs text-muted-foreground">Loading Circulars...</div>}>
        <NoticesContent />
      </Suspense>
    </PortalLayout>
  );
}
