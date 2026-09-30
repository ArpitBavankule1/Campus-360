"use client";

import React, { useState } from "react";
import { HostelMessMenu, MealType, MessDayOfWeek } from "@/types";
import {
  Utensils,
  Clock,
  Flame,
  Sparkles,
  QrCode,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MealCouponModal } from "./meal-coupon-modal";

interface MessMenuScheduleProps {
  menus: HostelMessMenu[];
}

const DAYS: { key: MessDayOfWeek; label: string }[] = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" },
];

export function MessMenuSchedule({ menus }: MessMenuScheduleProps) {
  const [selectedDay, setSelectedDay] = useState<MessDayOfWeek>("monday");
  const [selectedMealForCoupon, setSelectedMealForCoupon] = useState<HostelMessMenu | null>(null);

  const dayMenus = menus.filter((m) => m.day_of_week === selectedDay);

  const getMealGradient = (type: MealType) => {
    switch (type) {
      case "breakfast":
        return "from-amber-500/10 via-card to-card border-amber-500/20";
      case "lunch":
        return "from-emerald-500/10 via-card to-card border-emerald-500/20";
      case "snacks":
        return "from-blue-500/10 via-card to-card border-blue-500/20";
      case "dinner":
        return "from-purple-500/10 via-card to-card border-purple-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Day Selector Pill Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Utensils className="w-5 h-5 text-primary" />
            Hostel Dining & Mess Schedule
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Nutritionally balanced meal rotations with vegetarian and high-protein alternatives
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/60 border border-border/50">
          {DAYS.map((d) => (
            <button
              key={d.key}
              onClick={() => setSelectedDay(d.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedDay === d.key
                  ? "bg-background text-primary shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Meal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dayMenus.length > 0 ? (
          dayMenus.map((meal) => (
            <div
              key={meal.id}
              className={`rounded-3xl border p-5 bg-gradient-to-br transition-all hover:shadow-md ${getMealGradient(
                meal.meal_type
              )}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-background border border-border/60 text-foreground">
                    {meal.meal_type}
                  </span>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>{meal.timings}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    ~{meal.calories_approx} kcal
                  </span>
                </div>
              </div>

              {/* Special Item Highlight */}
              {meal.special_item && (
                <div className="my-3 p-2.5 rounded-2xl bg-primary/10 border border-primary/20 flex items-center gap-2 text-xs font-semibold text-primary">
                  <Sparkles className="w-4 h-4 shrink-0 text-primary" />
                  <span>Chef's Special: {meal.special_item}</span>
                </div>
              )}

              {/* Menu items list */}
              <div className="my-3 space-y-1.5">
                {meal.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs text-foreground/90 font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Dietary Tags & Token Button */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/40 mt-4">
                <div className="flex flex-wrap items-center gap-1">
                  {meal.dietary_tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-background text-[10px] font-medium text-muted-foreground border border-border/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedMealForCoupon(meal)}
                  className="rounded-xl text-xs gap-1.5 h-8 border-primary/40 hover:bg-primary/10 hover:text-primary"
                >
                  <QrCode className="w-3.5 h-3.5 text-primary" />
                  Meal QR Token
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-8 text-center rounded-3xl border border-dashed border-border bg-card/50">
            <Utensils className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">Menu publishing in progress</p>
            <p className="text-xs text-muted-foreground">
              Sunday and weekend banquet menus are refreshed every Friday evening.
            </p>
          </div>
        )}
      </div>

      {/* Meal Coupon Modal */}
      {selectedMealForCoupon && (
        <MealCouponModal
          meal={selectedMealForCoupon}
          onClose={() => setSelectedMealForCoupon(null)}
        />
      )}
    </div>
  );
}
