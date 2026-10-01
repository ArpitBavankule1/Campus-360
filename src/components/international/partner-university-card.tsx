"use client";

import React from "react";
import { PartnerUniversity } from "@/types";
import {
  Globe,
  MapPin,
  GraduationCap,
  Calendar,
  ExternalLink,
  Award,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PartnerUniversityCardProps {
  partner: PartnerUniversity;
  onApply?: (partner: PartnerUniversity) => void;
}

export function PartnerUniversityCard({
  partner,
  onApply,
}: PartnerUniversityCardProps) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm space-y-4 transition-all hover:border-primary/40 hover:shadow-md flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-primary/10 text-primary border-primary/20">
              QS #{partner.qs_world_ranking}
            </span>
            {partner.tuition_waiver && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                100% TUITION WAIVER
              </span>
            )}
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/50">
              {partner.semester_term}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full font-mono shrink-0">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>{partner.exchange_slots} Slots</span>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-base text-foreground leading-snug line-clamp-2">
            {partner.university_name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>
              {partner.city}, {partner.country}
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
          {partner.description}
        </p>

        {/* Programs Offered */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-foreground/80 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-500" /> Key Disciplines:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {partner.programs_offered.map((prog, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted/80 text-foreground/90 border border-border/40"
              >
                {prog}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-border/50 space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-primary" /> Min CGPA:{" "}
            <strong className="text-foreground font-semibold">
              {partner.min_gpa_required.toFixed(2)}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> Deadline:{" "}
            <span className="text-foreground font-medium">
              {new Date(partner.application_deadline).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {partner.campus_website && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-xl text-xs h-8 gap-1.5"
              onClick={() => window.open(partner.campus_website || "#", "_blank")}
            >
              <Globe className="w-3.5 h-3.5 text-muted-foreground" />
              Website
              <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
            </Button>
          )}

          <Button
            size="sm"
            className="flex-1 rounded-xl text-xs h-8 gap-1.5 bg-primary text-primary-foreground font-medium shadow-xs"
            onClick={() => onApply?.(partner)}
          >
            <Award className="w-3.5 h-3.5" />
            Exchange Apply
          </Button>
        </div>
      </div>
    </div>
  );
}
