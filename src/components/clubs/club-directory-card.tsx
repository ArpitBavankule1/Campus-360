"use client";

import React from "react";
import { StudentClub } from "@/types";
import {
  Users,
  MapPin,
  Sparkles,
  UserCheck,
  CheckCircle,
  ExternalLink,
  Code2,
  Music,
  Trophy,
  BookOpen,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClubDirectoryCardProps {
  club: StudentClub;
  isMember?: boolean;
  onJoin: (club: StudentClub) => void;
}

export function ClubDirectoryCard({
  club,
  isMember,
  onJoin,
}: ClubDirectoryCardProps) {
  const getCategoryIcon = () => {
    switch (club.category) {
      case "technical":
        return <Code2 className="w-5 h-5 text-blue-500" />;
      case "cultural":
        return <Music className="w-5 h-5 text-purple-500" />;
      case "sports":
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case "literary":
        return <BookOpen className="w-5 h-5 text-emerald-500" />;
      default:
        return <HeartHandshake className="w-5 h-5 text-rose-500" />;
    }
  };

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm space-y-4 transition-all hover:border-primary/40 hover:shadow-md flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-muted/60 border border-border/50">
              {getCategoryIcon()}
            </div>
            <div>
              <h4 className="text-base font-bold text-foreground">
                {club.name}
              </h4>
              <span className="text-[11px] font-semibold text-primary capitalize">
                {club.category} Society
              </span>
            </div>
          </div>

          {club.recruitment_open ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              Recruiting
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-muted text-muted-foreground">
              Closed
            </span>
          )}
        </div>

        <p className="text-xs text-muted-foreground line-clamp-3">
          {club.description}
        </p>

        <div className="space-y-1.5 p-3 rounded-2xl bg-muted/40 border border-border/40 text-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Student Lead:</span>
            <span className="font-semibold text-foreground">{club.lead_student_name}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Faculty Mentor:</span>
            <span className="font-semibold text-foreground">{club.faculty_mentor_name}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground pt-1 border-t border-border/30">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              Venue:
            </span>
            <span className="font-medium text-foreground truncate max-w-[180px]">
              {club.meeting_venue}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between gap-2 border-t border-border/40">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
          <Users className="w-3.5 h-3.5 text-primary" />
          <span>{club.member_count} Scholars</span>
        </div>

        {isMember ? (
          <Button
            size="sm"
            disabled
            className="rounded-xl text-xs bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 h-8"
          >
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Active Member
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => onJoin(club)}
            className="rounded-xl text-xs gap-1 h-8"
          >
            <UserCheck className="w-3.5 h-3.5" />
            Join Society
          </Button>
        )}
      </div>
    </div>
  );
}
