"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/portal-layout";
import { getDepartments, type DepartmentRow, MOCK_DEPARTMENTS } from "@/lib/supabase/queries";
import {
  School,
  Building,
  Mail,
  ArrowRight,
  ArrowLeft,
  Compass,
  CalendarDays,
  Users,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

function DepartmentsContent() {
  const [departments, setDepartments] = useState<DepartmentRow[]>(MOCK_DEPARTMENTS);

  useEffect(() => {
    async function load() {
      const data = await getDepartments();
      if (data && data.length > 0) {
        setDepartments(data);
      }
    }
    load();
  }, []);

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
            <School className="h-7 w-7 text-primary" />
            <span>Academic Departments & Faculties</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Explore degree programs, specialized laboratories, and departmental blocks
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Badge variant="outline" className="px-3 py-1 text-xs">
            {departments.length} Engineering Departments
          </Badge>
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="group flex flex-col justify-between rounded-3xl bg-card border border-border/70 p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/40 space-y-5"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2.5 rounded-2xl bg-primary/10 text-primary shadow-2xs font-extrabold text-sm">
                    {dept.code}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                      {dept.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">Department of {dept.code}</span>
                  </div>
                </div>

                <Badge variant="secondary" className="text-[10px] font-mono font-bold">
                  {dept.code}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {dept.description}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-border/50 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>
                    <strong>Building:</strong> {dept.building}
                  </span>
                </div>
                {dept.room_number && (
                  <div className="flex items-center gap-2">
                    <Compass className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>
                      <strong>HOD Office:</strong> Room {dept.room_number}
                    </span>
                  </div>
                )}
                {dept.contact_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>{dept.contact_email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Shortcuts */}
            <div className="pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-xs">
              <Link
                href={`/timetable`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "text-xs font-semibold h-8 px-3 flex items-center gap-1.5"
                )}
              >
                <CalendarDays className="h-3.5 w-3.5 text-primary" />
                <span>Class Routine</span>
              </Link>

              <Link
                href={`/explore?q=${encodeURIComponent(dept.building || dept.code)}`}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "text-xs font-semibold h-8 px-3 flex items-center gap-1.5 shadow-xs"
                )}
              >
                <Building className="h-3.5 w-3.5" />
                <span>Explore Block</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DepartmentsPage() {
  return (
    <PortalLayout>
      <Suspense fallback={<div className="p-12 text-center text-xs text-muted-foreground">Loading Departments...</div>}>
        <DepartmentsContent />
      </Suspense>
    </PortalLayout>
  );
}
