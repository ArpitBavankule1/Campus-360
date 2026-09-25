"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, Sparkles, GraduationCap, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { NotificationBell } from "@/components/layout/notification-bell";
import { Sidebar } from "@/components/layout/sidebar";
import { CommandPalette } from "@/components/layout/command-palette";
import { useAuth } from "@/components/layout/auth-provider";
import { APP_NAME } from "@/lib/constants";
import { cn } from "cn";

export function Header() {
  const { user, profile, role } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const openPalette = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  return (
    <>
      <CommandPalette />
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border/70 bg-card/85 px-4 md:px-6 backdrop-blur-md">
        {/* Mobile Menu & Logo */}
        <div className="flex items-center gap-3">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "md:hidden h-9 w-9 rounded-xl border-border/70 cursor-pointer"
              )}
              aria-label="Open portal navigation"
            >
              <Menu className="h-4 w-4" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 sm:w-80">
              <SheetTitle className="sr-only">Portal Navigation</SheetTitle>
              <SheetDescription className="sr-only">Campus navigation links</SheetDescription>
              <Sidebar onItemClick={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          <Link href="/dashboard" className="flex items-center gap-2 md:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold text-base tracking-tight">{APP_NAME}</span>
          </Link>

          {/* Global Search Bar (Desktop Trigger) */}
          <button
            type="button"
            onClick={openPalette}
            className="hidden md:flex items-center justify-between w-64 lg:w-96 h-9 px-3 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground hover:border-primary/40 hover:bg-muted/70 transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Search rooms, timetable, faculty...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-muted-foreground bg-background rounded-md border shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Mobile search icon button */}
          <button
            type="button"
            onClick={openPalette}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 hover:bg-muted text-foreground"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-full border border-border/50">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-foreground">Apex Institute (AIT)</span>
          <span className="text-muted-foreground/60">•</span>
          <span>Autumn 2026</span>
        </div>

        {/* Notification Bell Dropdown */}
        <NotificationBell />

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-border/60">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-primary/80 text-primary-foreground flex items-center justify-center font-bold text-xs shadow-2xs">
            {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || "S"}
          </div>

          <div className="hidden sm:block text-left">
            <span className="text-xs font-semibold text-foreground block leading-tight truncate max-w-[120px]">
              {profile?.full_name || user?.user_metadata?.full_name || "Student"}
            </span>
            <Badge variant="outline" className="text-[10px] h-4 px-1 font-normal capitalize">
              {role || "student"}
            </Badge>
          </div>
        </div>
      </div>
    </header>
  </>
);
}
