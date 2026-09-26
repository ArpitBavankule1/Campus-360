"use client";

import { useRealtime } from "@/lib/realtime/realtime-provider";
import { X, MessageSquare, AlertCircle, Radio, Bell } from "lucide-react";
import Link from "next/link";
import { cn } from "cn";

export function RealtimeToastContainer() {
  const { toasts, dismissToast } = useRealtime();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Real-time notifications"
      className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none"
    >
      {toasts.map((toast) => {
        const isBroadcast = toast.type === "broadcast";
        const isReply = toast.type === "reply";
        const isNotice = toast.type === "notice";

        return (
          <div
            key={toast.id}
            role="status"
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-top-4 fade-in-0 duration-200",
              isBroadcast
                ? "bg-rose-500/15 border-rose-500/30 text-rose-950 dark:text-rose-100"
                : isReply
                ? "bg-card/95 border-primary/30 text-foreground"
                : "bg-card/95 border-border/80 text-foreground"
            )}
          >
            <div
              className={cn(
                "p-2 rounded-xl shrink-0 mt-0.5",
                isBroadcast
                  ? "bg-rose-500 text-white"
                  : isReply
                  ? "bg-primary text-primary-foreground"
                  : "bg-amber-500 text-white"
              )}
            >
              {isBroadcast ? (
                <Radio className="h-3.5 w-3.5" />
              ) : isReply ? (
                <MessageSquare className="h-3.5 w-3.5" />
              ) : isNotice ? (
                <AlertCircle className="h-3.5 w-3.5" />
              ) : (
                <Bell className="h-3.5 w-3.5" />
              )}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <h5 className="text-xs font-bold truncate leading-tight">
                {toast.title}
              </h5>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                {toast.message}
              </p>

              {toast.link && (
                <Link
                  href={toast.link}
                  onClick={() => dismissToast(toast.id)}
                  className="text-xs text-primary font-semibold hover:underline inline-block mt-1.5"
                >
                  View Details →
                </Link>
              )}
            </div>

            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
