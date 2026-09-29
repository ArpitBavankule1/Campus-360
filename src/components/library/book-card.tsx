"use client";

import React, { useState } from "react";
import Image from "next/image";
import { LibraryBook } from "@/types";
import {
  BookOpen,
  MapPin,
  Tag,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  BookmarkPlus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BookCardProps {
  book: LibraryBook;
  onBorrow?: (bookId: string) => Promise<void>;
  onReserve?: (bookId: string) => Promise<void>;
}

export function BookCard({ book, onBorrow, onReserve }: BookCardProps) {
  const [loading, setLoading] = useState(false);

  const isAvailable = book.available_copies > 0;

  const handleBorrow = async () => {
    if (!onBorrow) return;
    try {
      setLoading(true);
      await onBorrow(book.id);
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async () => {
    if (!onReserve) return;
    try {
      setLoading(true);
      await onReserve(book.id);
    } finally {
      setLoading(false);
    }
  };

  const categoryLabels: Record<string, { label: string; color: string }> = {
    computer_science: {
      label: "Computer Science",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    electronics: {
      label: "Electronics & Comm",
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    mechanical: {
      label: "Mechanical Engg",
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    },
    civil: {
      label: "Civil Engineering",
      color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    },
    mathematics: {
      label: "Applied Mathematics",
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    physics: {
      label: "Applied Physics",
      color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    },
    management: {
      label: "Management & Tech",
      color: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    },
    literature: {
      label: "Literature & Arts",
      color: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    },
    general: {
      label: "General Reference",
      color: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
    },
  };

  const cat = categoryLabels[book.category] || categoryLabels.general;

  return (
    <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-primary/40">
      <div>
        {/* Cover thumbnail / header banner */}
        <div className="relative h-44 w-full bg-muted/40 overflow-hidden flex items-center justify-center">
          {book.cover_image_url ? (
            <Image
              src={book.cover_image_url}
              alt={book.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <BookOpen className="w-12 h-12 text-muted-foreground/30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

          {/* Availability pill */}
          <div className="absolute top-3 right-3">
            {isAvailable ? (
              <Badge className="bg-emerald-500/90 text-white font-semibold shadow-xs flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3 h-3" />
                {book.available_copies} of {book.total_copies} Available
              </Badge>
            ) : (
              <Badge className="bg-amber-500/90 text-white font-semibold shadow-xs flex items-center gap-1 text-[11px]">
                <AlertCircle className="w-3 h-3" />
                All Copies Loaned
              </Badge>
            )}
          </div>

          {/* Digital E-Book badge */}
          {book.is_digital_available && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-0.5 rounded-full bg-primary/90 text-primary-foreground font-bold text-[10px] tracking-wide uppercase shadow-xs">
                E-Resource Available
              </span>
            </div>
          )}
        </div>

        {/* Book details */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${cat.color}`}>
              {cat.label}
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              ISBN {book.isbn}
            </span>
          </div>

          <h3 className="font-bold text-foreground text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {book.title}
          </h3>

          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            by <span className="font-medium text-foreground">{book.author}</span>
          </p>

          {book.edition && (
            <p className="text-[11px] text-muted-foreground/80 mt-0.5">
              {book.edition} • {book.publisher}
            </p>
          )}

          {book.description && (
            <p className="text-xs text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
              {book.description}
            </p>
          )}

          {/* Shelf location & call number */}
          <div className="mt-4 pt-3 border-t border-border/50 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">{book.shelf_location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-[11px] justify-end">
              <Tag className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{book.call_number}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons footer */}
      <div className="p-5 pt-0">
        {isAvailable ? (
          <Button
            onClick={handleBorrow}
            disabled={loading}
            className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9 shadow-xs"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
            ) : (
              <FileCheck2 className="w-3.5 h-3.5 mr-1.5" />
            )}
            Instant Checkout (14 Days)
          </Button>
        ) : (
          <Button
            onClick={handleReserve}
            disabled={loading}
            variant="outline"
            className="w-full rounded-xl border-amber-500/40 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-xs h-9"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
            ) : (
              <BookmarkPlus className="w-3.5 h-3.5 mr-1.5" />
            )}
            Place Hold / Reserve
          </Button>
        )}
      </div>
    </div>
  );
}
