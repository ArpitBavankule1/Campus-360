"use client";

import React from "react";
import { SwayamLocalChapter } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Award,
  Sparkles,
  Mail,
  UserCheck,
  Calendar,
  Building,
  Star,
  ExternalLink,
  ShieldCheck,
  Trophy,
} from "lucide-react";

interface ChapterProfileBannerProps {
  chapter: SwayamLocalChapter;
  onExploreCourses?: () => void;
}

export function ChapterProfileBanner({
  chapter,
  onExploreCourses,
}: ChapterProfileBannerProps) {
  const ratingColors = {
    AAA: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    AA: "bg-blue-500/15 text-blue-500 border-blue-500/30",
    A: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    Active: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  };

  return (
    <Card className="border-border/60 bg-gradient-to-r from-blue-950/20 via-background to-teal-950/20 shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Chapter Metadata & Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge className="bg-blue-600/15 text-blue-500 border-blue-500/30 text-xs px-2.5 py-0.5 font-semibold">
                Ministry of Education • SWAYAM-NPTEL
              </Badge>
              <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-xs px-2.5 py-0.5 font-semibold flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Local Chapter ID: {chapter.local_chapter_id}
              </Badge>
              <Badge className={`text-xs px-2.5 py-0.5 font-semibold flex items-center gap-1 ${ratingColors[chapter.rating_tier]}`}>
                <Star className="h-3 w-3 fill-current" />
                Rating: {chapter.rating_tier} Star Chapter
              </Badge>
              <Badge className="bg-purple-500/15 text-purple-400 border-purple-500/30 text-xs px-2.5 py-0.5 font-semibold flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                All-India Rank #{chapter.national_rank}
              </Badge>
            </div>

            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                <GraduationCap className="h-7 w-7 text-blue-500 shrink-0" />
                {chapter.institution_name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                <Building className="h-4 w-4 text-muted-foreground/70" />
                Active Cycle: <span className="font-medium text-foreground">{chapter.active_semester_cycle}</span>
                {" • "}
                <span>Status: </span>
                <span className="font-semibold text-emerald-500 uppercase text-xs">
                  {chapter.status}
                </span>
              </p>
            </div>

            {/* SPOC Info */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1 border-t border-border/40">
              <span className="flex items-center gap-1">
                <UserCheck className="h-3.5 w-3.5 text-blue-500" />
                SPOC: <strong className="text-foreground ml-0.5">{chapter.spoc_name}</strong> ({chapter.spoc_designation})
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-blue-500" />
                {chapter.spoc_email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-blue-500" />
                Token: <code className="font-mono text-foreground/80">{chapter.chapter_token}</code>
              </span>
            </div>
          </div>

          {/* Quick Metrics Summary */}
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 shrink-0">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg border border-border/50 bg-background/50 p-3 min-w-[110px]">
                <div className="text-2xl font-bold text-blue-500">{chapter.total_enrollments}</div>
                <div className="text-xs text-muted-foreground font-medium">Enrolled</div>
              </div>
              <div className="rounded-lg border border-border/50 bg-background/50 p-3 min-w-[110px]">
                <div className="text-2xl font-bold text-emerald-500">{chapter.successful_certifications}</div>
                <div className="text-xs text-muted-foreground font-medium">Certified</div>
              </div>
              <div className="rounded-lg border border-border/50 bg-background/50 p-3 min-w-[110px]">
                <div className="text-2xl font-bold text-amber-500">{chapter.elite_gold_certifications}</div>
                <div className="text-xs text-muted-foreground font-medium">Elite + Gold</div>
              </div>
              <div className="rounded-lg border border-border/50 bg-background/50 p-3 min-w-[110px]">
                <div className="text-2xl font-bold text-purple-400">{chapter.faculty_fdp_certifications}</div>
                <div className="text-xs text-muted-foreground font-medium">Faculty FDPs</div>
              </div>
            </div>

            {onExploreCourses && (
              <div className="flex lg:flex-col gap-2 w-full lg:w-auto">
                <Button
                  onClick={onExploreCourses}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm flex items-center gap-1.5 w-full"
                >
                  <Sparkles className="h-4 w-4" />
                  Explore Catalog
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
