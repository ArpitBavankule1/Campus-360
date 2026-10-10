"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  MapPin,
  CalendarDays,
  BellRing,
  Sparkles,
  Users,
  LifeBuoy,
  LogOut,
  GraduationCap,
  ChevronRight,
  School,
  Bot,
  Building2,
  ShieldAlert,
  Bookmark,
  ScanLine,
  CalendarCheck,
  Briefcase,
  CreditCard,
  BookOpen,
  Bed,
  HeartPulse,
  Trophy,
  Bus,
  Lightbulb,
  Globe,
  Leaf,
  Scale,
  Dumbbell,
  Rocket,
  ShieldCheck,
  UtensilsCrossed,
  Theater,
  Award,
  Vote,
  Printer,
  HeartHandshake,
  UserPlus,
  UserCheck,
  FileText,
} from "lucide-react";
import { useAuth } from "@/components/layout/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { cn } from "cn";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isAi?: boolean;
}

const studentNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Attendance Check-In",
    href: "/attendance",
    icon: ScanLine,
    badge: "Phase 17",
  },
  {
    title: "Facility Bookings",
    href: "/bookings",
    icon: CalendarCheck,
    badge: "Phase 18",
  },
  {
    title: "Exams & Grades",
    href: "/exams",
    icon: GraduationCap,
    badge: "Phase 19",
  },
  {
    title: "Career & Placements",
    href: "/placements",
    icon: Briefcase,
    badge: "Phase 20",
  },
  {
    title: "Fee Portal & Payments",
    href: "/fees",
    icon: CreditCard,
    badge: "Phase 21",
  },
  {
    title: "Digital Library & Commons",
    href: "/library",
    icon: BookOpen,
    badge: "Phase 22",
  },
  {
    title: "Hostel & Residence",
    href: "/hostel",
    icon: Bed,
    badge: "Phase 23",
  },
  {
    title: "Campus Health & SOS",
    href: "/health",
    icon: HeartPulse,
    badge: "Phase 24",
  },
  {
    title: "Student Clubs & Societies",
    href: "/clubs",
    icon: Trophy,
    badge: "Phase 25",
  },
  {
    title: "Alumni & Mentorship",
    href: "/alumni",
    icon: GraduationCap,
    badge: "Phase 26",
  },
  {
    title: "Campus Transport & EV",
    href: "/transport",
    icon: Bus,
    badge: "Phase 27",
  },
  {
    title: "Research & Innovation",
    href: "/research",
    icon: Lightbulb,
    badge: "Phase 28",
  },
  {
    title: "International & Exchange",
    href: "/international",
    icon: Globe,
    badge: "Phase 29",
  },
  {
    title: "Campus Sustainability",
    href: "/sustainability",
    icon: Leaf,
    badge: "Phase 30",
  },
  {
    title: "Student Ombudsman",
    href: "/ombudsman",
    icon: Scale,
    badge: "Phase 31",
  },
  {
    title: "Sports & Athletics",
    href: "/sports",
    icon: Dumbbell,
    badge: "Phase 32",
  },
  {
    title: "Startup Incubation",
    href: "/incubation",
    icon: Rocket,
    badge: "Phase 33",
  },
  {
    title: "Campus Security & Gates",
    href: "/security-hub",
    icon: ShieldCheck,
    badge: "Phase 34",
  },
  {
    title: "Cafeteria & Dining",
    href: "/cafeteria",
    icon: UtensilsCrossed,
    badge: "Phase 35",
  },
  {
    title: "Auditorium & Events",
    href: "/auditorium",
    icon: Theater,
    badge: "Phase 36",
  },
  {
    title: "Scholarships & Aid",
    href: "/scholarships",
    icon: Award,
    badge: "Phase 37",
  },
  {
    title: "Convocation & Degrees",
    href: "/convocation",
    icon: GraduationCap,
    badge: "Phase 38",
  },
  {
    title: "Student Elections",
    href: "/elections",
    icon: Vote,
    badge: "Phase 39",
  },
  {
    title: "Printing & Binding",
    href: "/printing",
    icon: Printer,
    badge: "Phase 40",
  },
  {
    title: "Counseling & Wellness",
    href: "/counseling",
    icon: HeartHandshake,
    badge: "Phase 41",
  },
  {
    title: "Admissions & Enrollment",
    href: "/admissions",
    icon: UserPlus,
    badge: "Phase 42",
  },
  {
    title: "Parent & Guardian Hub",
    href: "/parents",
    icon: UserCheck,
    badge: "Phase 43",
  },
  {
    title: "Fellowships & TA Hub",
    href: "/fellowships",
    icon: FileText,
    badge: "Phase 44",
  },
  {
    title: "Industry MoUs & CSR Hub",
    href: "/partnerships",
    icon: Building2,
    badge: "Phase 45",
  },
  {
    title: "Campus Explorer",
    href: "/explore",
    icon: Compass,
  },
  {
    title: "Interactive Map",
    href: "/map",
    icon: MapPin,
  },
  {
    title: "Class Timetable",
    href: "/timetable",
    icon: CalendarDays,
  },
  {
    title: "Notices & Circulars",
    href: "/notices",
    icon: BellRing,
    badge: "New",
  },
  {
    title: "Campus Events",
    href: "/events",
    icon: Sparkles,
  },
  {
    title: "Faculty Hub",
    href: "/faculty",
    icon: Users,
  },
  {
    title: "Academic Depts",
    href: "/departments",
    icon: School,
  },
  {
    title: "HOD Dept Portal",
    href: "/hod",
    icon: Building2,
    badge: "Staff",
  },
  {
    title: "Admin Console",
    href: "/admin",
    icon: ShieldAlert,
    badge: "Admin",
  },
  {
    title: "Campus AI Assistant",
    href: "/ai-assistant",
    icon: Bot,
    isAi: true,
  },
  {
    title: "Help Desk",
    href: "/help-desk",
    icon: LifeBuoy,
  },
  {
    title: "My Bookmarks",
    href: "/bookmarks",
    icon: Bookmark,
  },
];

interface SidebarProps {
  className?: string;
  onItemClick?: () => void;
}

export function Sidebar({ className, onItemClick }: SidebarProps) {
  const pathname = usePathname();
  const { user, profile, role, signOut } = useAuth();

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-card border-r border-border/70 select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-border/60">
        <Link
          href="/dashboard"
          onClick={onItemClick}
          className="flex items-center gap-2.5 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-base tracking-tight leading-tight flex items-center gap-1.5">
              <span>{APP_NAME}</span>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground block">
              Institutional Smart Portal
            </span>
          </div>
        </Link>
      </div>

      {/* College Badge */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-muted/40 border border-border/50 text-xs">
          <School className="h-4 w-4 text-primary shrink-0" />
          <div className="truncate">
            <span className="font-semibold text-foreground truncate block">
              Apex Inst. of Technology
            </span>
            <span className="text-[10px] text-muted-foreground">Bengaluru Campus</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        <div className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Navigation
        </div>

        {studentNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "group flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70",
                item.isAi && !isActive && "text-primary/90 bg-primary/5 hover:bg-primary/10"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-primary-foreground" : item.isAi ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span>{item.title}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <Badge
                    variant={isActive ? "outline" : "secondary"}
                    className={cn(
                      "text-[10px] h-4.5 px-1.5",
                      isActive && "border-primary-foreground/40 text-primary-foreground"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
                {item.isAi && !isActive && (
                  <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* User Footer Profile & Sign Out */}
      <div className="p-3 border-t border-border/60 bg-muted/20">
        <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border/60 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || "S"}
            </div>
            <div className="truncate">
              <span className="text-xs font-semibold text-foreground truncate block">
                {profile?.full_name || user?.user_metadata?.full_name || "Student"}
              </span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1 capitalize">
                <GraduationCap className="h-2.5 w-2.5 text-primary" />
                {role || "student"}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="Sign Out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
