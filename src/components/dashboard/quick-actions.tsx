"use client";

import Link from "next/link";
import {
  Compass,
  CalendarDays,
  BellRing,
  Sparkles,
  Bot,
  LifeBuoy,
  ArrowRight,
  CalendarCheck,
  GraduationCap,
  Briefcase,
  CreditCard,
  BookOpen,
  Bed,
} from "lucide-react";
import { cn } from "cn";

interface QuickActionItem {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  badge?: string;
  badgeBg?: string;
}

const actionItems: QuickActionItem[] = [
  {
    title: "Campus Explorer",
    description: "Navigate classrooms, research labs, auditoriums & amenities",
    href: "/explore",
    icon: Compass,
    iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Class Timetable",
    description: "View today's lecture schedule, lab halls, and faculty rooms",
    href: "/timetable",
    icon: CalendarDays,
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Facility Bookings",
    description: "Reserve smart study pods, GPU AI labs & campus sports arenas",
    href: "/bookings",
    icon: CalendarCheck,
    iconBg: "bg-teal-500/10 dark:bg-teal-500/20",
    iconColor: "text-teal-600 dark:text-teal-400",
    badge: "Phase 18",
    badgeBg: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
  },
  {
    title: "Exams & Hall Tickets",
    description: "Official admit card, seating matrix, transcripts & GPA planner",
    href: "/exams",
    icon: GraduationCap,
    iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    badge: "Phase 19",
    badgeBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
  },
  {
    title: "Career & Placements",
    description: "Industry recruitment drives, CTC simulator & offer letter vault",
    href: "/placements",
    icon: Briefcase,
    iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    badge: "Phase 20",
    badgeBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  },
  {
    title: "Fee Portal & Payments",
    description: "Clear semester dues, download e-receipts & apply for aid",
    href: "/fees",
    icon: CreditCard,
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    badge: "Phase 21",
    badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  {
    title: "Digital Library & Commons",
    description: "Search 150k+ book catalog, reserve holds & access IEEE e-resources",
    href: "/library",
    icon: BookOpen,
    iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    badge: "Phase 22",
    badgeBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  },
  {
    title: "Hostel, Residence & Mess",
    description: "Manage room allotments, dining menus, night out-passes & facility maintenance",
    href: "/hostel",
    icon: Bed,
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    iconColor: "text-amber-600 dark:text-amber-400",
    badge: "Phase 23",
    badgeBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
  {
    title: "Notices & Circulars",
    description: "Official notifications, examination routines & circulars",
    href: "/notices",
    icon: BellRing,
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    iconColor: "text-amber-600 dark:text-amber-400",
    badge: "Urgent",
    badgeBg: "bg-destructive/10 text-destructive border-destructive/20",
  },
  {
    title: "Campus Events",
    description: "Upcoming hackathons, technical symposiums & fests",
    href: "/events",
    icon: Sparkles,
    iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    title: "Campus AI Assistant",
    description: "Ask questions about classrooms, policies, or faculty timings",
    href: "/ai-assistant",
    icon: Bot,
    iconBg: "bg-primary/10 dark:bg-primary/20",
    iconColor: "text-primary",
    badge: "AI Powered",
    badgeBg: "bg-primary/15 text-primary border-primary/30",
  },
  {
    title: "Help Desk Portal",
    description: "Raise academic, facility or hostel queries with campus staff",
    href: "/help-desk",
    icon: LifeBuoy,
    iconBg: "bg-rose-500/10 dark:bg-rose-500/20",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
];

export function QuickActions() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Quick Actions
          </h2>
          <p className="text-xs text-muted-foreground">
            Frequently accessed portals and instant utilities
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actionItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="group relative flex flex-col justify-between p-5 rounded-2xl bg-card border border-border/70 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-primary/40 overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110",
                      item.iconBg,
                      item.iconColor
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {item.badge && (
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                        item.badgeBg
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                    <span>{item.title}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                <span>Access module</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
