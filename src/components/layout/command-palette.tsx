"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Compass,
  MapPin,
  CalendarDays,
  BellRing,
  Sparkles,
  Users,
  School,
  Building2,
  ShieldAlert,
  Bot,
  LifeBuoy,
  Bookmark,
  User,
  ArrowRight,
  Command,
  X,
  ExternalLink,
} from "lucide-react";
import {
  MOCK_LOCATIONS,
  MOCK_FACULTY,
  MOCK_NOTICES,
  MOCK_EVENTS,
} from "@/lib/supabase/queries";
import { Badge } from "@/components/ui/badge";
import { cn } from "cn";

interface PaletteItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "Navigation" | "Locations" | "Faculty" | "Notices" | "Actions";
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard Listener for ⌘K / Ctrl+K and Custom Events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Construct items
  const allItems: PaletteItem[] = [
    // Navigation
    { id: "p-dash", title: "Dashboard Overview", subtitle: "Today's timeline & schedule", category: "Navigation", href: "/dashboard", icon: LayoutDashboard },
    { id: "p-explore", title: "Campus Explorer", subtitle: "Directory of buildings & facilities", category: "Navigation", href: "/explore", icon: Compass },
    { id: "p-map", title: "Interactive 3D Campus Map", subtitle: "Real-time geographical pinpoints", category: "Navigation", href: "/map", icon: MapPin },
    { id: "p-time", title: "Class Timetable", subtitle: "Day-wise lecture routines", category: "Navigation", href: "/timetable", icon: CalendarDays },
    { id: "p-notices", title: "Notices & Circulars", subtitle: "Official university announcements", category: "Navigation", href: "/notices", icon: BellRing },
    { id: "p-events", title: "Campus Events & Festivals", subtitle: "Hackathons, symposiums, cultural fest", category: "Navigation", href: "/events", icon: Sparkles },
    { id: "p-fac", title: "Faculty Directory & Teaching Hub", subtitle: "Professor profiles & office hours", category: "Navigation", href: "/faculty", icon: Users },
    { id: "p-dept", title: "Academic Departments", subtitle: "CSE, IT, ECE, MECH overview", category: "Navigation", href: "/departments", icon: School },
    { id: "p-hod", title: "HOD Department Portal", subtitle: "Curriculum & faculty oversight", category: "Navigation", href: "/hod", icon: Building2 },
    { id: "p-admin", title: "Admin Management Console", subtitle: "Institutional CRUD & triage", category: "Navigation", href: "/admin", icon: ShieldAlert },
    { id: "p-ai", title: "CampusLens AI Assistant", subtitle: "24/7 intelligent grounded guide", category: "Navigation", href: "/ai-assistant", icon: Bot },
    { id: "p-help", title: "Student Help Desk", subtitle: "Raise tickets & track inquiries", category: "Navigation", href: "/help-desk", icon: LifeBuoy },
    { id: "p-bm", title: "My Saved Bookmarks", subtitle: "Personalized quick access items", category: "Navigation", href: "/bookmarks", icon: Bookmark },
    { id: "p-prof", title: "Digital Student ID & Profile", subtitle: "Holographic student badge & RFID", category: "Navigation", href: "/profile", icon: User },

    // Actions
    { id: "a-ticket", title: "Raise a Support Ticket", subtitle: "Submit IT, Hostel, or Exam inquiry", category: "Actions", href: "/help-desk/new", icon: LifeBuoy },
    { id: "a-ai", title: "Ask AI Campus Assistant", subtitle: "Ask about room locations or exams", category: "Actions", href: "/ai-assistant", icon: Bot },

    // Locations
    ...MOCK_LOCATIONS.map((l) => ({
      id: `loc-${l.id}`,
      title: l.name,
      subtitle: `${l.building} (${l.floor || ""}) • ${l.category.toUpperCase()}`,
      category: "Locations" as const,
      href: `/explore/${l.id}`,
      icon: MapPin,
    })),

    // Faculty
    ...MOCK_FACULTY.map((f) => ({
      id: `fac-${f.id}`,
      title: `${f.name} — ${f.designation}`,
      subtitle: `Office: ${f.office_room} • ${f.specializations?.slice(0, 2).join(", ")}`,
      category: "Faculty" as const,
      href: "/faculty",
      icon: Users,
    })),
  ];

  const filteredItems = allItems.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle?.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }).slice(0, 9); // limit to top 9 results

  const handleSelect = (item: PaletteItem) => {
    setIsOpen(false);
    router.push(item.href);
  };

  const handleKeyDownInInput = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-150">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={() => setIsOpen(false)} />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b flex items-center gap-3 bg-muted/20">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, building name, notice, or professor..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownInInput}
            className="w-full bg-transparent text-sm font-medium focus:outline-none placeholder:text-muted-foreground/70"
          />

          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-mono font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-md border">
            <span>ESC to close</span>
          </div>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 flex-1">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-xs text-muted-foreground space-y-1">
              <Command className="w-6 h-6 mx-auto text-muted-foreground/40 mb-2" />
              <p className="font-semibold text-foreground">No matches found</p>
              <p>Try searching for "Library", "Timetable", "Anita Desai", or "Notices"</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = selectedIndex === idx;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    "p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all text-xs select-none",
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "hover:bg-muted/60 text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "p-2 rounded-lg shrink-0",
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm truncate">{item.title}</span>
                        <Badge
                          variant={isSelected ? "outline" : "secondary"}
                          className={cn(
                            "text-[9px] px-1.5 py-0 h-4 capitalize",
                            isSelected && "border-white/30 text-white"
                          )}
                        >
                          {item.category}
                        </Badge>
                      </div>

                      {item.subtitle && (
                        <p
                          className={cn(
                            "text-[11px] truncate mt-0.5",
                            isSelected ? "text-white/80" : "text-muted-foreground"
                          )}
                        >
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <ArrowRight
                    className={cn(
                      "w-4 h-4 shrink-0 transition-transform",
                      isSelected ? "text-white translate-x-0.5" : "text-muted-foreground opacity-30"
                    )}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="p-3 border-t bg-muted/40 flex items-center justify-between text-[11px] text-muted-foreground px-4">
          <div className="flex items-center gap-3">
            <span>
              Use <strong className="font-mono text-foreground">↑</strong>{" "}
              <strong className="font-mono text-foreground">↓</strong> to navigate
            </span>
            <span>•</span>
            <span>
              <strong className="font-mono text-foreground">Enter</strong> to select
            </span>
          </div>

          <span className="font-semibold text-primary">CampusLens Omnisearch</span>
        </div>
      </div>
    </div>
  );
}
