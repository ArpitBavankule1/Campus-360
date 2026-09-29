"use client";

import React from "react";
import { LibraryEResource } from "@/types";
import {
  FileText,
  ExternalLink,
  Download,
  BookOpenCheck,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DigitalResourceCardProps {
  resource: LibraryEResource;
}

export function DigitalResourceCard({ resource }: DigitalResourceCardProps) {
  const typeLabels: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    journal: {
      label: "Peer-Reviewed Journal",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      icon: <Award className="w-3.5 h-3.5" />,
    },
    ebook: {
      label: "Institutional E-Book",
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      icon: <BookOpenCheck className="w-3.5 h-3.5" />,
    },
    research_paper: {
      label: "AIT Research Paper",
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      icon: <FileText className="w-3.5 h-3.5" />,
    },
    conference: {
      label: "Conference Proceedings",
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      icon: <FileText className="w-3.5 h-3.5" />,
    },
    thesis: {
      label: "Master / PhD Thesis",
      color: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
      icon: <FileText className="w-3.5 h-3.5" />,
    },
  };

  const meta = typeLabels[resource.type] || typeLabels.journal;

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between hover:border-primary/40 group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge className={`text-[11px] font-semibold flex items-center gap-1.5 ${meta.color}`}>
            {meta.icon}
            {meta.label}
          </Badge>
          {resource.is_open_access ? (
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Open Access
            </span>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
              Campus Proxy
            </span>
          )}
        </div>

        <h4 className="font-bold text-foreground text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {resource.title}
        </h4>

        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1">
          Publisher: <span className="font-medium text-foreground">{resource.publisher}</span>
        </p>

        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-primary" />
            <strong>{resource.downloads_count.toLocaleString()}</strong> academic citations & downloads
          </span>
        </div>
      </div>

      <div className="mt-4 pt-2">
        <a
          href={resource.access_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full"
        >
          <Button
            variant="outline"
            className="w-full rounded-xl text-xs h-9 font-semibold text-primary hover:bg-primary/10 border-primary/30"
          >
            Access Digital Resource
            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </a>
      </div>
    </div>
  );
}
