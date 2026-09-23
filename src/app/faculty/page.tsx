"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/portal-layout";
import { getFacultyDirectory, type FacultyRow, MOCK_FACULTY } from "@/lib/supabase/queries";
import { useAuth } from "@/components/layout/auth-provider";
import {
  Users,
  Search,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Clock,
  ArrowLeft,
  Calendar,
  Sparkles,
  Award,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

function FacultyContent() {
  const { role } = useAuth();
  const [faculty, setFaculty] = useState<FacultyRow[]>(MOCK_FACULTY);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");

  useEffect(() => {
    async function load() {
      const data = await getFacultyDirectory();
      if (data && data.length > 0) {
        setFaculty(data);
      }
    }
    load();
  }, []);

  const filteredFaculty = useMemo(() => {
    return faculty.filter((f) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = f.name.toLowerCase().includes(q);
        const matchesDesignation = f.designation.toLowerCase().includes(q);
        const matchesOffice = f.office_room?.toLowerCase().includes(q);
        const matchesSpecialization = f.specializations?.some((s) => s.toLowerCase().includes(q));

        return matchesName || matchesDesignation || matchesOffice || matchesSpecialization;
      }
      return true;
    });
  }, [faculty, search]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            <span>Faculty & Academic Staff Directory</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Connect with department heads, professors, and laboratory researchers
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Badge variant="outline" className="px-3 py-1 text-xs">
            {filteredFaculty.length} Academic Faculty
          </Badge>
        </div>
      </div>

      {/* Role Notice (if Faculty) */}
      {role === "faculty" && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
          <span className="font-semibold">
            Logged in with Faculty Privileges. You can publish department circulars and view assigned class schedules.
          </span>
          <Link
            href="/timetable"
            className={cn(buttonVariants({ size: "sm", variant: "outline" }), "text-xs h-7")}
          >
            My Classes
          </Link>
        </div>
      )}

      {/* Search Header */}
      <div className="rounded-3xl bg-card border border-border/70 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search faculty by name, research area, or office..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-muted/30 text-sm"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            <Badge variant="secondary" className="px-3 py-1 font-semibold">
              Apex Institute Faculty
            </Badge>
          </div>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFaculty.map((prof) => (
          <div
            key={prof.id}
            className="group flex flex-col justify-between rounded-3xl bg-card border border-border/70 p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/40 space-y-5"
          >
            <div className="space-y-4">
              {/* Photo & Header */}
              <div className="flex items-start gap-4">
                {prof.avatar_url ? (
                  <img
                    src={prof.avatar_url}
                    alt={prof.name}
                    className="h-16 w-16 rounded-2xl object-cover border-2 border-primary/20 shadow-xs shrink-0"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shrink-0">
                    {prof.name.charAt(0)}
                  </div>
                )}

                <div className="space-y-1 min-w-0">
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-tight truncate">
                    {prof.name}
                  </h3>
                  <p className="text-xs font-semibold text-primary/90">
                    {prof.designation}
                  </p>
                  {prof.qualifications && (
                    <p className="text-[11px] text-muted-foreground truncate">
                      {prof.qualifications}
                    </p>
                  )}
                </div>
              </div>

              {/* Bio */}
              {prof.bio && (
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {prof.bio}
                </p>
              )}

              {/* Specializations Badges */}
              {prof.specializations && prof.specializations.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {prof.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="text-[10px] bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-md border border-border/50 font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              )}

              {/* Details List */}
              <div className="space-y-1.5 pt-2 border-t border-border/50 text-xs text-muted-foreground">
                {prof.office_room && (
                  <div className="flex items-center gap-2">
                    <Building className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate">
                      <strong>Office:</strong> {prof.office_room}
                    </span>
                  </div>
                )}

                {prof.office_hours && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">
                      <strong>Hours:</strong> {prof.office_hours}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
              <a
                href={`mailto:${prof.email}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "text-xs font-semibold h-8 px-3 flex-1 flex items-center justify-center gap-1.5"
                )}
              >
                <Mail className="h-3.5 w-3.5 text-primary" />
                <span>Email Faculty</span>
              </a>

              {prof.phone && (
                <a
                  href={`tel:${prof.phone}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                    "h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground shrink-0"
                  )}
                  title={prof.phone}
                >
                  <Phone className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FacultyPage() {
  return (
    <PortalLayout>
      <Suspense fallback={<div className="p-12 text-center text-xs text-muted-foreground">Loading Faculty Directory...</div>}>
        <FacultyContent />
      </Suspense>
    </PortalLayout>
  );
}
