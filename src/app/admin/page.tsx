"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  Users,
  MapPin,
  BellRing,
  Calendar,
  LifeBuoy,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Database,
  Lock,
  Layers,
  GraduationCap,
  School,
  ExternalLink,
  Trash2,
  Edit,
} from "lucide-react";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/layout/auth-provider";
import {
  MOCK_LOCATIONS,
  MOCK_NOTICES,
  MOCK_TIMETABLE,
  MOCK_HELP_REQUESTS,
  MOCK_FACULTY,
  MOCK_DEPARTMENTS,
  createCampusLocation,
  createInstitutionalNotice,
  updateTicketStatusAndResolution,
  type LocationRow,
  type NoticeRow,
  type HelpRequestWithDetails,
} from "@/lib/supabase/queries";
import type { LocationCategory, NoticeCategory, NoticePriority, RequestStatus } from "@/types/database.types";
import { cn } from "cn";

export default function AdminDashboardPage() {
  const { user, profile, role } = useAuth();

  const [activeTab, setActiveTab] = useState<"overview" | "locations" | "notices" | "timetable" | "triage" | "system">("overview");

  // Locations state
  const [locations, setLocations] = useState<LocationRow[]>(MOCK_LOCATIONS);
  const [locationSearch, setLocationSearch] = useState("");
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocName, setNewLocName] = useState("");
  const [newLocCode, setNewLocCode] = useState("");
  const [newLocCategory, setNewLocCategory] = useState<LocationCategory>("academic");
  const [newLocBuilding, setNewLocBuilding] = useState("");
  const [newLocRoom, setNewLocRoom] = useState("");
  const [newLocDesc, setNewLocDesc] = useState("");

  // Notices state
  const [notices, setNotices] = useState<NoticeRow[]>(MOCK_NOTICES);
  const [showAddNotice, setShowAddNotice] = useState(false);
  const [newNoticeTitle, setNewNoticeTitle] = useState("");
  const [newNoticeCategory, setNewNoticeCategory] = useState<NoticeCategory>("academic");
  const [newNoticePriority, setNewNoticePriority] = useState<NoticePriority>("normal");
  const [newNoticeAudience, setNewNoticeAudience] = useState("All Students & Faculty");
  const [newNoticeContent, setNewNoticeContent] = useState("");

  // Help requests triage state
  const [tickets, setTickets] = useState<HelpRequestWithDetails[]>(MOCK_HELP_REQUESTS);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [resolutionNoteInput, setResolutionNoteInput] = useState("");

  // Location search filter
  const filteredLocations = locations.filter((l) =>
    l.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
    l.building.toLowerCase().includes(locationSearch.toLowerCase()) ||
    l.category.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName.trim() || !newLocBuilding.trim()) return;

    const res = await createCampusLocation({
      college_id: "11111111-1111-4111-8111-111111111111",
      name: newLocName,
      code: newLocCode || `LOC-${Date.now().toString().slice(-4)}`,
      category: newLocCategory,
      building: newLocBuilding,
      room_number: newLocRoom,
      latitude: 12.9715,
      longitude: 77.5945,
      description: newLocDesc || "Campus facility and learning room.",
    });

    if (res.success && res.data) {
      setLocations((prev) => [res.data, ...prev]);
      setNewLocName("");
      setNewLocCode("");
      setNewLocBuilding("");
      setNewLocRoom("");
      setNewLocDesc("");
      setShowAddLocation(false);
    }
  };

  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim() || !newNoticeContent.trim()) return;

    const res = await createInstitutionalNotice({
      college_id: "11111111-1111-4111-8111-111111111111",
      title: newNoticeTitle,
      category: newNoticeCategory,
      priority: newNoticePriority,
      author_name: newNoticeAudience || "Central Administration",
      content: newNoticeContent,
      is_pinned: newNoticePriority === "urgent",
    });

    if (res.success && res.data) {
      setNotices((prev) => [res.data, ...prev]);
      setNewNoticeTitle("");
      setNewNoticeContent("");
      setShowAddNotice(false);
    }
  };

  const handleUpdateTicketStatus = async (
    ticketId: string,
    status: RequestStatus,
    resolutionNote?: string
  ) => {
    await updateTicketStatusAndResolution(
      ticketId,
      status,
      resolutionNote,
      profile?.full_name || "Central Administrator"
    );

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status,
              resolution_notes: resolutionNote || t.resolution_notes,
              assigned_to: profile?.full_name || "Central Administrator",
            }
          : t
      )
    );
    setSelectedTicketId(null);
    setResolutionNoteInput("");
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Administrator Executive Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-950 via-slate-900 to-indigo-950 p-6 md:p-8 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold tracking-wide">
                <ShieldAlert className="w-3.5 h-3.5" />
                Apex Institute Superadmin Console Active
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Central Campus Administration Portal
              </h1>

              <p className="text-rose-100/80 text-sm max-w-2xl leading-relaxed">
                Full institutional administrative control over campus infrastructure, department circulars, timetable schedules, and support escalations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl bg-white text-rose-950 font-bold text-xs shadow-md hover:bg-rose-50 transition-colors flex items-center gap-1.5"
              >
                <span>Student View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/hod"
                className="px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 font-semibold text-xs hover:bg-white/20 transition-colors"
              >
                HOD Console
              </Link>
            </div>
          </div>

          {/* Decorative Glow */}
          <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
        </div>

        {/* Global Statistics Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <Card className="border shadow-xs bg-card/80 backdrop-blur-sm">
            <CardContent className="p-3.5 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">Total Students</p>
                <p className="text-lg font-bold">1,420 Enrolled</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-xs bg-card/80 backdrop-blur-sm">
            <CardContent className="p-3.5 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">Faculty Staff</p>
                <p className="text-lg font-bold">96 Professors</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-xs bg-card/80 backdrop-blur-sm">
            <CardContent className="p-3.5 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">Campus Locations</p>
                <p className="text-lg font-bold">{locations.length} Facilities</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-xs bg-card/80 backdrop-blur-sm">
            <CardContent className="p-3.5 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                <BellRing className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">Active Notices</p>
                <p className="text-lg font-bold">{notices.length} Published</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-xs bg-card/80 backdrop-blur-sm col-span-2 lg:col-span-1">
            <CardContent className="p-3.5 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600">
                <LifeBuoy className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium">Open Support</p>
                <p className="text-lg font-bold">
                  {tickets.filter((t) => t.status !== "resolved").length} Tickets
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "overview", label: "Executive Cockpit", icon: Layers },
            { id: "locations", label: "Campus Locations & Rooms", icon: MapPin, badge: locations.length },
            { id: "notices", label: "Notices & Circulars", icon: BellRing, badge: notices.length },
            { id: "timetable", label: "Master Schedule Timetable", icon: Calendar },
            {
              id: "triage",
              label: "Help Desk Central Triage",
              icon: LifeBuoy,
              badge: tickets.filter((t) => t.status !== "resolved").length,
            },
            { id: "system", label: "Security & Database RLS", icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap",
                  isActive
                    ? "bg-rose-600 text-white shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded-full text-[10px]",
                      isActive ? "bg-white/20 text-white" : "bg-muted-foreground/20 text-muted-foreground font-bold"
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: EXECUTIVE COCKPIT OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions Panel */}
              <Card className="border shadow-xs">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold flex items-center justify-between">
                    <span>Central Operations Quick Actions</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Quickly add campus facilities, broadcast circulars, or resolve student tickets
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      setActiveTab("locations");
                      setShowAddLocation(true);
                    }}
                    className="p-3.5 rounded-xl border border-dashed border-border/80 hover:border-primary/50 hover:bg-primary/5 transition-all text-left flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-foreground">Add Campus Building</span>
                      <PlusCircle className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-[11px] text-muted-foreground mt-2">
                      Register new labs, halls, or sports complexes on map.
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("notices");
                      setShowAddNotice(true);
                    }}
                    className="p-3.5 rounded-xl border border-dashed border-border/80 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all text-left flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-foreground">Publish Notice</span>
                      <BellRing className="w-4 h-4 text-amber-500" />
                    </div>
                    <span className="text-[11px] text-muted-foreground mt-2">
                      Broadcast institutional circulars with priority tags.
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("triage")}
                    className="p-3.5 rounded-xl border border-dashed border-border/80 hover:border-rose-500/50 hover:bg-rose-500/5 transition-all text-left flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-foreground">Triage Support</span>
                      <LifeBuoy className="w-4 h-4 text-rose-500" />
                    </div>
                    <span className="text-[11px] text-muted-foreground mt-2">
                      Review and resolve open student inquiries.
                    </span>
                  </button>
                </CardContent>
              </Card>

              {/* Recent Open Tickets Strip */}
              <Card className="border shadow-xs">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">Unresolved Campus Support Tickets</CardTitle>
                    <CardDescription className="text-xs">Prioritize urgent inquiries requiring department action</CardDescription>
                  </div>
                  <button
                    onClick={() => setActiveTab("triage")}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    All Tickets →
                  </button>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {tickets.filter((t) => t.status !== "resolved").slice(0, 3).map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-3 rounded-xl border bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] text-muted-foreground uppercase">
                            #{ticket.id.slice(0, 8)}
                          </span>
                          <Badge variant="outline" className="text-[10px]">
                            {ticket.priority.toUpperCase()}
                          </Badge>
                          <span className="font-semibold text-foreground">{ticket.subject}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{ticket.category} • Assigned: {ticket.assigned_to || "Unassigned"}</p>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setActiveTab("triage");
                          setSelectedTicketId(ticket.id);
                        }}
                        className="h-7 text-xs rounded-lg shrink-0"
                      >
                        Triage Ticket
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* System Info Sidebar */}
            <div className="space-y-6">
              <Card className="border shadow-xs">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-500" />
                    Supabase Infrastructure Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span>Row Level Security (RLS)</span>
                      <span>ACTIVE</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      Multi-tenant isolation active across colleges, profiles, and tickets.
                    </p>
                  </div>

                  <div className="space-y-2 border-t pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">PostgreSQL Tables:</span>
                      <span className="font-mono font-bold text-foreground">12 Connected</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Auth Session:</span>
                      <span className="font-semibold text-emerald-600">Enterprise Verified</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">AI RAG Index:</span>
                      <span className="font-semibold text-primary">Synchronized</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 2: CAMPUS LOCATIONS & ROOMS MANAGER */}
        {activeTab === "locations" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Campus Facilities & Locations ({filteredLocations.length})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Manage geographical landmarks, lecture rooms, and facility operational hours.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-48 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search locations..."
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="pl-8 h-9 text-xs rounded-xl"
                  />
                </div>

                <Button
                  size="sm"
                  onClick={() => setShowAddLocation(!showAddLocation)}
                  className="rounded-xl text-xs gap-1.5 h-9"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  {showAddLocation ? "Cancel" : "Add Location"}
                </Button>
              </div>
            </div>

            {/* Add Location Form Drawer/Panel */}
            {showAddLocation && (
              <form onSubmit={handleAddLocation} className="p-5 rounded-2xl border bg-card shadow-sm space-y-4">
                <h4 className="font-bold text-sm text-foreground">Register New Campus Location</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <Label className="text-xs font-semibold">Location Name *</Label>
                    <Input
                      required
                      placeholder="e.g. Quantum Computing Lab"
                      value={newLocName}
                      onChange={(e) => setNewLocName(e.target.value)}
                      className="mt-1 h-9 rounded-xl"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Location Code</Label>
                    <Input
                      placeholder="e.g. LOC-QUANTUM"
                      value={newLocCode}
                      onChange={(e) => setNewLocCode(e.target.value)}
                      className="mt-1 h-9 rounded-xl"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Category</Label>
                    <select
                      value={newLocCategory}
                      onChange={(e) => setNewLocCategory(e.target.value as any)}
                      className="mt-1 w-full h-9 rounded-xl border border-input bg-background px-3 text-xs shadow-xs"
                    >
                      <option value="academic">Academic</option>
                      <option value="library">Library</option>
                      <option value="laboratory">Laboratory</option>
                      <option value="sports">Sports</option>
                      <option value="cafeteria">Cafeteria</option>
                      <option value="auditorium">Auditorium</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Building Block *</Label>
                    <Input
                      required
                      placeholder="e.g. Alan Turing Block"
                      value={newLocBuilding}
                      onChange={(e) => setNewLocBuilding(e.target.value)}
                      className="mt-1 h-9 rounded-xl"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Room Number</Label>
                    <Input
                      placeholder="e.g. Room A-310"
                      value={newLocRoom}
                      onChange={(e) => setNewLocRoom(e.target.value)}
                      className="mt-1 h-9 rounded-xl"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Description</Label>
                    <Input
                      placeholder="Brief notes regarding amenities..."
                      value={newLocDesc}
                      onChange={(e) => setNewLocDesc(e.target.value)}
                      className="mt-1 h-9 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddLocation(false)}
                    className="rounded-xl text-xs"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="rounded-xl text-xs">
                    Save Location
                  </Button>
                </div>
              </form>
            )}

            {/* Locations Table */}
            <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="p-3.5">Name</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Building</th>
                      <th className="p-3.5">Room</th>
                      <th className="p-3.5">Hours</th>
                      <th className="p-3.5">Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredLocations.map((loc) => (
                      <tr key={loc.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3.5 font-bold text-foreground">{loc.name}</td>
                        <td className="p-3.5">
                          <Badge variant="secondary" className="capitalize text-[10px]">
                            {loc.category}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-muted-foreground">{loc.building}</td>
                        <td className="p-3.5 font-mono">{loc.room_number || "—"}</td>
                        <td className="p-3.5 text-muted-foreground">{loc.opening_time} - {loc.closing_time}</td>
                        <td className="p-3.5 text-muted-foreground">{loc.contact_number}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NOTICES & CIRCULARS PUBLISHER */}
        {activeTab === "notices" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Institutional Notices & Circulars ({notices.length})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Publish campus bulletins, examination notices, and holiday announcements.
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => setShowAddNotice(!showAddNotice)}
                className="rounded-xl text-xs gap-1.5 h-9"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                {showAddNotice ? "Cancel" : "Publish Notice"}
              </Button>
            </div>

            {/* Add Notice Form */}
            {showAddNotice && (
              <form onSubmit={handleAddNotice} className="p-5 rounded-2xl border bg-card shadow-sm space-y-4 max-w-2xl">
                <h4 className="font-bold text-sm text-foreground">Publish Institutional Circular</h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <Label className="text-xs font-semibold">Notice Title *</Label>
                    <Input
                      required
                      placeholder="e.g. Schedule for End-Semester Practical Examinations 2026"
                      value={newNoticeTitle}
                      onChange={(e) => setNewNoticeTitle(e.target.value)}
                      className="mt-1 h-9 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs font-semibold">Category</Label>
                      <select
                        value={newNoticeCategory}
                        onChange={(e) => setNewNoticeCategory(e.target.value as any)}
                        className="mt-1 w-full h-9 rounded-xl border border-input bg-background px-3 text-xs shadow-xs"
                      >
                        <option value="academic">Academic</option>
                        <option value="exam">Examination</option>
                        <option value="event">Event</option>
                        <option value="administrative">Administrative</option>
                        <option value="placement">Placement</option>
                      </select>
                    </div>

                    <div>
                      <Label className="text-xs font-semibold">Priority</Label>
                      <select
                        value={newNoticePriority}
                        onChange={(e) => setNewNoticePriority(e.target.value as any)}
                        className="mt-1 w-full h-9 rounded-xl border border-input bg-background px-3 text-xs shadow-xs"
                      >
                        <option value="normal">Normal</option>
                        <option value="important">Important</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Notice Content *</Label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Type circular details, room numbers, guidelines..."
                      value={newNoticeContent}
                      onChange={(e) => setNewNoticeContent(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-input bg-background p-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddNotice(false)}
                    className="rounded-xl text-xs"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="rounded-xl text-xs">
                    Publish to Student Portal
                  </Button>
                </div>
              </form>
            )}

            {/* Notices Table */}
            <div className="space-y-3">
              {notices.map((notice) => (
                <Card key={notice.id} className="border shadow-xs">
                  <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={cn(
                            "text-[10px]",
                            notice.priority === "urgent"
                              ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                              : notice.priority === "important"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                          )}
                        >
                          {notice.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] capitalize">
                          {notice.category}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(notice.published_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-foreground">{notice.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{notice.content}</p>
                    </div>

                    <Link
                      href="/notices"
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 shrink-0"
                    >
                      <span>View Notice</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MASTER SCHEDULE TIMETABLE */}
        {activeTab === "timetable" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-foreground">
                Master Schedule & Lecture Allocations
              </h3>
              <p className="text-xs text-muted-foreground">
                Live view of all scheduled classes across engineering departments.
              </p>
            </div>

            <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="p-3.5">Day</th>
                      <th className="p-3.5">Time</th>
                      <th className="p-3.5">Course</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Faculty</th>
                      <th className="p-3.5">Room</th>
                      <th className="p-3.5">Cohort</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {MOCK_TIMETABLE.map((slot) => (
                      <tr key={slot.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3.5 font-bold">{slot.day_of_week}</td>
                        <td className="p-3.5 font-mono text-muted-foreground">
                          {slot.start_time} - {slot.end_time}
                        </td>
                        <td className="p-3.5 font-semibold text-foreground">{slot.subject_name}</td>
                        <td className="p-3.5">
                          <Badge variant="outline" className="text-[10px]">
                            {slot.type.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-muted-foreground">{slot.faculty_name}</td>
                        <td className="p-3.5 font-bold font-mono text-primary">{slot.room_number}</td>
                        <td className="p-3.5">Year {slot.year} Div {slot.division}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: HELP DESK CENTRAL TRIAGE */}
        {activeTab === "triage" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-foreground">
                Central Help Desk Triage Console ({tickets.length} Tickets)
              </h3>
              <p className="text-xs text-muted-foreground">
                Assign officers, adjust SLA priorities, and append official resolution determinations.
              </p>
            </div>

            <div className="space-y-3">
              {tickets.map((t) => (
                <Card key={t.id} className="border shadow-xs">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground uppercase">
                          #{t.id.slice(0, 8)}
                        </span>
                        <Badge
                          className={cn(
                            "text-[10px]",
                            t.status === "resolved"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          )}
                        >
                          {t.status.toUpperCase()}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {t.category}
                        </Badge>
                      </div>

                      <span className="text-xs text-muted-foreground">
                        Assigned To: <strong className="text-foreground">{t.assigned_to || "Unassigned"}</strong>
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-foreground">{t.subject}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{t.description}</p>

                    {t.resolution_notes && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
                        <strong>Official Resolution:</strong> {t.resolution_notes}
                      </div>
                    )}

                    {/* Triage Action Controls */}
                    <div className="pt-2 border-t flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateTicketStatus(t.id, "in_progress")}
                          className="h-8 text-xs rounded-xl"
                        >
                          Set In Progress
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateTicketStatus(t.id, "resolved", "Issue resolved and verified by central administration.")}
                          className="h-8 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Mark Resolved
                        </Button>
                      </div>

                      <Link
                        href={`/help-desk/${t.id}`}
                        className="text-primary font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>Open Thread</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SECURITY & DATABASE RLS */}
        {activeTab === "system" && (
          <div className="max-w-3xl space-y-4">
            <Card className="border shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-500" />
                  Supabase Row Level Security Architecture
                </CardTitle>
                <CardDescription className="text-xs">
                  Active security boundaries isolating multi-tenant student and staff data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                  <span className="font-bold text-foreground">Multi-Tenant Scoping by College ID</span>
                  <p className="text-muted-foreground leading-relaxed">
                    All SQL tables (locations, faculty, timetable, notices, help_requests) enforce foreign key references to public.colleges.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                  <span className="font-bold text-foreground">RBAC Policies via current_user_role()</span>
                  <p className="text-muted-foreground leading-relaxed">
                    Supabase PostgreSQL JWT triggers determine user role (student, faculty, hod, admin) ensuring students cannot write to institutional notices or alter timetable records.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                  <span className="font-bold text-foreground">Audit Log & State Immutability</span>
                  <p className="text-muted-foreground leading-relaxed">
                    Automated tr_updated_at triggers capture modification timestamps across all database mutations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
