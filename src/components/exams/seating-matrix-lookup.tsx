"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  MapPin,
  Building2,
  Calendar,
  Clock,
  User,
  Armchair,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { ExamSeating } from "@/types";
import { MOCK_SEATING_ALLOCATIONS } from "@/lib/exams/exam-engine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SeatingMatrixLookupProps {
  initialAllocations?: ExamSeating[];
}

export const SeatingMatrixLookup: React.FC<SeatingMatrixLookupProps> = ({
  initialAllocations = MOCK_SEATING_ALLOCATIONS,
}) => {
  const [query, setQuery] = useState("2023-CSE-042");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  const results = useMemo(() => {
    return initialAllocations.filter((seat) => {
      const matchesQuery =
        !query.trim() ||
        seat.roll_number.toLowerCase().includes(query.toLowerCase()) ||
        seat.student_name.toLowerCase().includes(query.toLowerCase()) ||
        seat.room_number.toLowerCase().includes(query.toLowerCase());

      const matchesSubject =
        selectedSubject === "all" || seat.subject_code === selectedSubject;

      return matchesQuery && matchesSubject;
    });
  }, [initialAllocations, query, selectedSubject]);

  return (
    <div className="space-y-5">
      {/* Search & Filter Header */}
      <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-4">
        <div>
          <h3 className="font-bold text-foreground text-base">
            Live Exam Seating Allotment Matrix
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Search your roll number or examination hall to locate your exact row and bench allotment.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Roll No (e.g. 2023-CSE-042) or Student Name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            {["all", "CS601", "CS602", "CS603"].map((sub) => (
              <Button
                key={sub}
                size="sm"
                variant={selectedSubject === sub ? "default" : "outline"}
                onClick={() => setSelectedSubject(sub)}
                className={`text-xs h-8 rounded-lg font-medium ${
                  selectedSubject === sub
                    ? "shadow-sm"
                    : "border-border/60 text-muted-foreground"
                }`}
              >
                {sub === "all" ? "All Subjects" : sub}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Display */}
      {results.length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-dashed border-border/80 bg-card/40 space-y-2">
          <Armchair className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
          <h4 className="font-semibold text-foreground text-sm">No Seating Records Found</h4>
          <p className="text-xs text-muted-foreground">
            No bench assignments matched your search query. Check your roll number or select All Subjects.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((seat) => (
            <div
              key={seat.id}
              className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/5 p-5 shadow-sm hover:border-primary/40 hover:shadow-md transition-all space-y-3"
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/60">
                <Badge
                  variant="outline"
                  className="font-mono text-xs text-primary border-primary/30 bg-primary/10"
                >
                  {seat.subject_code}
                </Badge>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="w-3.5 h-3.5" />
                  <span className="font-semibold text-foreground">{seat.student_name}</span>
                  <span className="font-mono text-[11px]">({seat.roll_number})</span>
                </div>
              </div>

              {/* Subject Title */}
              <div>
                <h4 className="font-bold text-foreground text-sm">
                  {seat.subject_name}
                </h4>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-primary/70" />
                    {seat.exam_date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-primary/70" />
                    {seat.start_time} - {seat.end_time}
                  </span>
                </div>
              </div>

              {/* Bench Allocation Highlight Box */}
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                    <Armchair className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block">
                      Allocated Bench
                    </span>
                    <strong className="text-sm font-bold text-foreground font-mono">
                      {seat.bench_number}
                    </strong>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground block">Room / Hall</span>
                  <strong className="text-sm font-bold text-primary font-mono">
                    {seat.room_number}
                  </strong>
                </div>
              </div>

              {/* Building & Map Navigation */}
              <div className="pt-1 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-muted-foreground/70" />
                  <span>{seat.building_name} ({seat.floor})</span>
                </div>

                <Link
                  href="/map"
                  className="flex items-center gap-1 text-primary hover:underline font-medium text-[11px]"
                >
                  <span>Locate Hall</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
