"use client";

import React from "react";
import { MealOrder } from "@/types";
import { Badge } from "@/components/ui/badge";
import { QrCode, Clock, CheckCircle2, AlertCircle, ShoppingBag } from "lucide-react";

interface MealOrderCardProps {
  order: MealOrder;
  onViewToken?: (order: MealOrder) => void;
}

export function MealOrderCard({ order, onViewToken }: MealOrderCardProps) {
  const isReady = order.order_status === "Ready for Pickup";
  const isCompleted = order.order_status === "Completed";

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 via-card/50 to-background/80 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-amber-500/50 hover:shadow-xl">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 group-hover:scale-105 transition-transform">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm tracking-tight leading-tight">
              {order.vendor_name}
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              {order.order_code}
            </span>
          </div>
        </div>
        <Badge
          variant="outline"
          className={
            isReady
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 animate-pulse"
              : isCompleted
              ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
              : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
          }
        >
          {order.order_status}
        </Badge>
      </div>

      <div className="space-y-1.5 py-2 text-xs text-muted-foreground border-y border-border/40 my-2.5">
        <p className="font-medium text-foreground text-xs line-clamp-1">
          {order.items_summary}
        </p>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-blue-500" />
            Pickup Slot: <strong className="text-foreground">{order.pickup_slot}</strong>
          </span>
          <span className="font-bold text-foreground">
            ₹{order.total_amount_inr.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
          <QrCode className="h-3 w-3 text-amber-500" />
          <span>{order.token_pass_code}</span>
        </div>
        <span className="text-[11px] text-muted-foreground">
          Via {order.payment_method}
        </span>
      </div>
    </div>
  );
}
