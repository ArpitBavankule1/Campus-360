"use client";

import React from "react";
import { AlumniProfile } from "@/types";
import {
  Briefcase,
  Building2,
  GraduationCap,
  MapPin,
  Calendar,
  Sparkles,
  ExternalLink,
  MessageSquareCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AlumniProfileCardProps {
  alumni: AlumniProfile;
  onBookMentorship: (alumni: AlumniProfile) => void;
  onRequestReferral?: (alumni: AlumniProfile) => void;
}

export function AlumniProfileCard({
  alumni,
  onBookMentorship,
  onRequestReferral,
}: AlumniProfileCardProps) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm space-y-4 transition-all hover:border-primary/40 hover:shadow-md flex flex-col justify-between">
      <div className="space-y-4">
        {/* Header with avatar & info */}
        <div className="flex items-start gap-4">
          <div className="relative">
            {alumni.avatar_url ? (
              <img
                src={alumni.avatar_url}
                alt={alumni.full_name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-primary/20 shadow-sm"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-xl">
                {alumni.full_name[0]}
              </div>
            )}
            {alumni.mentorship_available && (
              <span
                title="Active Mentor"
                className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background"
              >
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-base font-bold text-foreground truncate">
                {alumni.full_name}
              </h4>
              {alumni.linkedin_url && (
                <a
                  href={alumni.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-blue-500 transition-colors p-1"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            <p className="text-xs font-semibold text-primary truncate flex items-center gap-1.5 mt-0.5">
              <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
              {alumni.current_role}
            </p>
            <p className="text-xs text-muted-foreground truncate flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
              {alumni.company}
            </p>
          </div>
        </div>

        {/* Education & Location Meta */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground pt-1 border-t border-border/40">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-primary" />
            <span>Class of {alumni.graduating_year}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="truncate">{alumni.location}</span>
          </div>
        </div>

        {/* Bio */}
        {alumni.bio && (
          <p className="text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed">
            {alumni.bio}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            {alumni.industry}
          </span>
          {alumni.willing_to_refer && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" /> Direct Referrals
            </span>
          )}
          {alumni.mentorship_available && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Open to Mentor
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-border/50 flex gap-2">
        <Button
          size="sm"
          className="flex-1 rounded-xl text-xs gap-1.5"
          disabled={!alumni.mentorship_available}
          onClick={() => onBookMentorship(alumni)}
        >
          <Calendar className="w-3.5 h-3.5" />
          {alumni.mentorship_available ? "Book 1-on-1" : "Full"}
        </Button>
        {onRequestReferral && alumni.willing_to_refer && (
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl text-xs gap-1.5"
            onClick={() => onRequestReferral(alumni)}
          >
            <MessageSquareCheck className="w-3.5 h-3.5" />
            Referral
          </Button>
        )}
      </div>
    </div>
  );
}
