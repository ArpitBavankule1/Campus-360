"use client";

import React from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { FacilityBookingSlot } from "@/types";

interface SlotPickerProps {
  slots: FacilityBookingSlot[];
  selectedSlot: { startTime: string; endTime: string } | null;
  onSelectSlot: (slot: { startTime: string; endTime: string }) => void;
  isLoading?: boolean;
}

export const SlotPicker: React.FC<SlotPickerProps> = ({
  slots,
  selectedSlot,
  onSelectSlot,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 py-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-xl bg-muted/40 animate-pulse border border-border/40"
          />
        ))}
      </div>
    );
  }

  const availableCount = slots.filter((s) => s.isAvailable).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <Clock className="w-3.5 h-3.5 text-primary" />
          Select a 1-Hour Time Block
        </span>
        <span>
          <strong className="text-emerald-500 font-semibold">{availableCount}</strong> of{" "}
          {slots.length} slots free
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {slots.map((slot) => {
          const isSelected =
            selectedSlot?.startTime === slot.startTime &&
            selectedSlot?.endTime === slot.endTime;

          if (!slot.isAvailable) {
            return (
              <div
                key={slot.startTime}
                className="relative flex flex-col items-center justify-center p-3 rounded-xl border border-destructive/20 bg-destructive/5 text-muted-foreground/60 cursor-not-allowed select-none opacity-60"
                title={`Reserved: ${slot.purpose || "Occupied"}`}
              >
                <div className="flex items-center gap-1 text-xs font-semibold line-through">
                  <span>{slot.startTime}</span>
                  <span>-</span>
                  <span>{slot.endTime}</span>
                </div>
                <span className="text-[10px] mt-1 flex items-center gap-0.5 text-destructive/70 font-medium">
                  <XCircle className="w-2.5 h-2.5" /> Booked
                </span>
              </div>
            );
          }

          return (
            <button
              key={slot.startTime}
              type="button"
              onClick={() =>
                onSelectSlot({
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                })
              }
              className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-xs font-medium cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/30 shadow-md shadow-primary/10 scale-[1.02]"
                  : "border-border/60 bg-card hover:bg-accent/40 hover:border-border text-foreground hover:scale-[1.01]"
              }`}
            >
              <div className="flex items-center gap-1 font-semibold">
                <span>{slot.startTime}</span>
                <span>-</span>
                <span>{slot.endTime}</span>
              </div>
              <span
                className={`text-[10px] mt-1 flex items-center gap-0.5 ${
                  isSelected ? "text-primary font-semibold" : "text-emerald-500 font-medium"
                }`}
              >
                <CheckCircle2 className="w-2.5 h-2.5" />
                {isSelected ? "Selected" : "Available"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
