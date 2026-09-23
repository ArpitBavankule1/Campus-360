"use client";

import Link from "next/link";
import { BellRing, AlertCircle, ArrowRight, Pin, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { NoticeRow } from "@/lib/supabase/queries";
import { cn } from "cn";

interface LatestNoticesProps {
  notices: NoticeRow[];
}

export function LatestNotices({ notices }: LatestNoticesProps) {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return (
          <Badge className="bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20 text-[10px] h-5 px-1.5 font-bold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-ping" />
            Urgent
          </Badge>
        );
      case "important":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20 text-[10px] h-5 px-1.5 font-semibold">
            Important
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-medium text-muted-foreground">
            Official
          </Badge>
        );
    }
  };

  return (
    <div className="rounded-3xl bg-card border border-border/70 p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Campus Circulars
            </h2>
            <Badge variant="secondary" className="text-xs font-semibold">
              Live Updates
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verified institutional notices and examination alerts
          </p>
        </div>

        <Link
          href="/notices"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-xs font-semibold text-primary hover:text-primary flex items-center gap-1"
          )}
        >
          <span>All Circulars</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="group relative p-4 rounded-2xl bg-muted/20 border border-border/60 transition-all duration-200 hover:bg-muted/40 hover:border-primary/30"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {getPriorityBadge(notice.priority)}
                <Badge variant="outline" className="text-[10px] h-5 px-1.5 capitalize font-medium">
                  {notice.category}
                </Badge>
                {notice.is_pinned && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    <Pin className="h-2.5 w-2.5" />
                    Pinned
                  </span>
                )}
              </div>

              <span className="text-[11px] text-muted-foreground shrink-0">
                {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
                  new Date(notice.published_at)
                )}
              </span>
            </div>

            <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
              {notice.title}
            </h3>

            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
              {notice.content}
            </p>

            <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="font-medium text-foreground/80 flex items-center gap-1">
                <FileText className="h-3 w-3 text-primary" />
                {notice.author_name}
              </span>

              <Link
                href="/notices"
                className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
              >
                <span>Read Full</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
