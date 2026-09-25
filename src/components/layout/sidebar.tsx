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
