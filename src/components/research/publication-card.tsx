"use client";

import React, { useState } from "react";
import { ResearchPublication } from "@/types";
import {
  BookOpen,
  Quote,
  ExternalLink,
  Copy,
  Check,
  Award,
  Sparkles,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PublicationCardProps {
  publication: ResearchPublication;
}

export function PublicationCard({ publication }: PublicationCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCitation = () => {
    const citation = `${publication.authors.join(", ")} (${new Date(
      publication.publication_date
    ).getFullYear()}). "${publication.title}". ${publication.journal_or_conference}. DOI: ${publication.doi}`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIndexingBadge = () => {
    switch (publication.indexing) {
      case "IEEE Xplore":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "Springer":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "ACM":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      default:
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
    }
  };

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm space-y-4 transition-all hover:border-primary/40 hover:shadow-md flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getIndexingBadge()}`}
            >
              {publication.indexing}
            </span>
            {publication.open_access && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                OPEN ACCESS
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
            <Quote className="w-3 h-3" />
            <span>{publication.citation_count} Citations</span>
          </div>
        </div>

        <div>
          <h4 className="text-base font-bold text-foreground leading-snug">
            {publication.title}
          </h4>
          <p className="text-xs text-primary font-medium mt-1">
            {publication.authors.join(", ")}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 italic">
            {publication.journal_or_conference} ({new Date(publication.publication_date).getFullYear()})
          </p>
        </div>

        {/* Abstract */}
        <p className="text-xs text-muted-foreground/90 line-clamp-3 leading-relaxed">
          {publication.abstract}
        </p>

        {/* DOI */}
        <div className="p-2.5 rounded-2xl bg-muted/40 border border-border/40 text-[11px] font-mono flex items-center justify-between">
          <span className="text-muted-foreground truncate">DOI: {publication.doi}</span>
          <button
            onClick={handleCopyCitation}
            className="hover:text-primary transition-colors flex items-center gap-1 text-[10px] font-sans font-semibold text-primary ml-2"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Cite
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground">
          Dept: {publication.department}
        </span>
        {publication.pdf_url && (
          <a
            href={publication.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all"
          >
            Read Article
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
