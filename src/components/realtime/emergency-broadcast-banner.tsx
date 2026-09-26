"use client";

import { useRealtime } from "@/lib/realtime/realtime-provider";
import {
  AlertTriangle,
  Info,
  Radio,
  X,
  Volume2,
  VolumeX,
  ExternalLink,
  Wifi,
  WifiOff,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export function EmergencyBroadcastBanner() {
  const {
    broadcasts,
    dismissBroadcast,
    soundEnabled,
    toggleSound,
    connectionState,
  } = useRealtime();

  if (broadcasts.length === 0) return null;

  return (
    <aside aria-label="Campus emergency alerts" className="w-full flex flex-col gap-2 mb-4">
      {broadcasts.map((broadcast) => {
        const isCritical = broadcast.severity === "critical";
        const isWarning = broadcast.severity === "warning";

        return (
          <div
            key={broadcast.id}
            role="alert"
            aria-live={isCritical ? "assertive" : "polite"}
            className={cn(
              "relative overflow-hidden rounded-2xl border p-4 shadow-sm transition-all duration-200",
              isCritical
                ? "bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-100"
                : isWarning
                ? "bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-100"
                : "bg-primary/10 border-primary/25 text-foreground"
            )}
          >
            {/* Ambient Pulse Glow */}
            <div
              className={cn(
                "absolute top-0 left-0 bottom-0 w-1.5",
                isCritical
                  ? "bg-rose-500 animate-pulse"
                  : isWarning
                  ? "bg-amber-500"
                  : "bg-primary"
              )}
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pl-2">
              {/* Alert Badge & Info */}
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 sm:mt-0 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold",
                    isCritical
                      ? "bg-rose-500 text-white animate-bounce"
                      : isWarning
                      ? "bg-amber-500 text-white"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  {isCritical ? (
                    <Flame className="h-4 w-4" />
                  ) : isWarning ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <Radio className="h-4 w-4" />
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full",
                        isCritical
                          ? "bg-rose-500 text-white"
                          : isWarning
                          ? "bg-amber-500 text-white"
                          : "bg-primary/20 text-primary font-bold"
                      )}
                    >
                      {isCritical ? "Critical Alert" : isWarning ? "Urgent Advisory" : "Campus Notice"}
                    </span>

                    <h4 className="text-sm font-bold tracking-tight">
                      {broadcast.title}
                    </h4>

                    <span className="text-[11px] text-muted-foreground hidden md:inline-flex items-center gap-1">
                      • {broadcast.source}
                    </span>
                  </div>

                  <p className="text-xs text-foreground/85 leading-relaxed max-w-4xl">
                    {broadcast.message}
                  </p>
                </div>
              </div>

              {/* Action Buttons & Telemetry */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {/* Realtime Status Indicator */}
                <div
                  className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 border text-[10px] text-muted-foreground"
                  title={`Realtime Status: ${connectionState}`}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      connectionState === "connected"
                        ? "bg-emerald-500 animate-pulse"
                        : connectionState === "fallback"
                        ? "bg-blue-500"
                        : "bg-amber-500"
                    )}
                  />
                  <span>
                    {connectionState === "connected" ? "Live WS" : "Live Bus"}
                  </span>
                </div>

                {/* Sound Toggle */}
                <button
                  type="button"
                  onClick={toggleSound}
                  className="p-1.5 rounded-lg border bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title={soundEnabled ? "Mute alert audio" : "Enable alert audio"}
                  aria-label={soundEnabled ? "Mute sound alerts" : "Enable sound alerts"}
                >
                  {soundEnabled ? (
                    <Volume2 className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <VolumeX className="h-3.5 w-3.5" />
                  )}
                </button>

                {/* Action Link */}
                {broadcast.actionLink && (
                  <Link
                    href={broadcast.actionLink}
                    className={cn(
                      buttonVariants({
                        size: "sm",
                        variant: isCritical ? "destructive" : "default",
                      }),
                      "h-7 text-xs px-2.5 rounded-xl font-medium gap-1"
                    )}
                  >
                    {broadcast.actionText || "View Action"}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                )}

                {/* Dismiss Button */}
                {broadcast.dismissible !== false && (
                  <button
                    type="button"
                    onClick={() => dismissBroadcast(broadcast.id)}
                    className="p-1 rounded-lg hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label="Dismiss alert"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </aside>
  );
}
