"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Send,
  GraduationCap,
  BookOpen,
  Award,
  Layers,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { PortalLayout } from "@/components/layout/portal-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/layout/auth-provider";
import { AdminBroadcastDialog } from "@/components/realtime/admin-broadcast-dialog";
import {
  MOCK_FACULTY,
  MOCK_TIMETABLE,
  MOCK_HELP_REQUESTS,
  MOCK_DEPARTMENTS,
  type HelpRequestWithDetails,
} from "@/lib/supabase/queries";
import { cn } from "cn";

export default function HodDashboardPage() {
  const { user, profile, role } = useAuth();

  const [selectedDeptId, setSelectedDeptId] = useState(MOCK_DEPARTMENTS[0].id);
  const [activeTab, setActiveTab] = useState<"overview" | "faculty" | "timetable" | "approvals" | "broadcast">("overview");

  // Escalated requests state
  const [departmentRequests, setDepartmentRequests] = useState<HelpRequestWithDetails[]>(
    MOCK_HELP_REQUESTS.filter((r) => r.department_id === "a1111111-1111-4111-8111-111111111111" || r.priority === "urgent" || r.category === "Laboratory")
  );

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastTarget, setBroadcastTarget] = useState("all_cse");
  const [broadcastBody, setBroadcastBody] = useState("");
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Selected Department
  const currentDept = MOCK_DEPARTMENTS.find((d) => d.id === selectedDeptId) || MOCK_DEPARTMENTS[0];

  // Faculty in current department
  const deptFaculty = MOCK_FACULTY.filter((f) => f.department_id === selectedDeptId);

  // Timetable slots
  const [selectedYear, setSelectedYear] = useState<number>(3);
  const deptTimetable = MOCK_TIMETABLE.filter((t) => t.year === selectedYear);

  const handleApproveRequest = (id: string) => {
    setDepartmentRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "resolved",
              resolution_notes: `Endorsed and approved by Head of Department (${profile?.full_name || "Dr. Rajeshwar Sharma"}) on ${new Date().toLocaleDateString()}. Access granted.`,
            }
          : r
      )
    );
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastBody.trim()) return;

    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastTitle("");
      setBroadcastBody("");
      setBroadcastSent(false);
    }, 3500);
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Executive Header Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
                Department Executive Management Console
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  {currentDept.name} ({currentDept.code})
                </h1>
                <Badge className="bg-indigo-500/20 text-indigo-200 border-indigo-400/30">
                  HOD Portal
                </Badge>
              </div>

              <p className="text-indigo-200 text-sm max-w-2xl leading-relaxed">
                HOD: <strong className="text-white">Dr. Rajeshwar Sharma</strong> • Headquarters: {currentDept.building} ({currentDept.room_number}) • Contact: {currentDept.contact_email}
              </p>
            </div>

            {/* Department Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-300 ml-2" />
                <select
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  className="bg-transparent text-white text-xs font-semibold focus:outline-none pr-3 cursor-pointer"
                >
                  {MOCK_DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                      {d.code} — {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <AdminBroadcastDialog
                buttonLabel="Emergency Broadcast"
                triggerClassName="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
              />

              <Link
                href="/faculty"
                className="px-4 py-2 rounded-xl bg-white text-indigo-950 font-bold text-xs shadow-md hover:bg-indigo-50 transition-colors"
              >
                View Public Directory
              </Link>
            </div>
          </div>

          {/* Decorative Glow */}
          <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        </div>

        {/* Real-time Department KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border shadow-xs bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Enrolled Students</p>
                <p className="text-xl font-bold">480 Students</p>
                <span className="text-[10px] text-emerald-600 font-semibold">98.4% Academic Attendance</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-xs bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Department Faculty</p>
                <p className="text-xl font-bold">{deptFaculty.length || 18} Professors</p>
                <span className="text-[10px] text-muted-foreground">100% Lecture Coverage</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-xs bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Pending Approvals</p>
                <p className="text-xl font-bold">
                  {departmentRequests.filter((r) => r.status !== "resolved").length} Tickets
                </p>
                <span className="text-[10px] text-amber-600 font-semibold">Action required</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-xs bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Active Research Labs</p>
                <p className="text-xl font-bold">6 Labs</p>
                <span className="text-[10px] text-emerald-600 font-semibold">AI, IoT, Cloud, Cyber</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "overview", label: "Executive Overview", icon: Layers },
            { id: "faculty", label: "Faculty Staffing & Workload", icon: Users },
            { id: "timetable", label: "Department Timetable Matrix", icon: Calendar },
            {
              id: "approvals",
              label: "Student Lab & Mark Endorsements",
              icon: CheckCircle2,
              badge: departmentRequests.filter((r) => r.status !== "resolved").length,
            },
            { id: "broadcast", label: "Broadcast Department Notice", icon: Send },
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
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded-full text-[10px]",
                      isActive ? "bg-white/20 text-white" : "bg-amber-500/20 text-amber-600 font-bold"
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Executive Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions & Recent Escalations */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold flex items-center justify-between">
                    <span>Department Lab Approvals & Endorsements</span>
                    <button
                      onClick={() => setActiveTab("approvals")}
                      className="text-xs text-primary hover:underline font-semibold"
                    >
                      View All
                    </button>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Pending student research clearances and mid-term exam mark re-evaluations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {departmentRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-xl border border-border/70 hover:border-primary/40 bg-card/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] font-mono">
                            #{req.id.slice(0, 8)}
                          </Badge>
                          <Badge
                            className={cn(
                              "text-[10px]",
                              req.priority === "urgent" ? "bg-rose-500/10 text-rose-600 border-rose-500/20" : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                            )}
                          >
                            {req.priority.toUpperCase()}
                          </Badge>
                          <span className="text-xs font-semibold text-foreground">
                            {req.category}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-foreground">{req.subject}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{req.description}</p>
                      </div>

                      {req.status === "resolved" ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold shrink-0">
                          <CheckCircle2 className="w-4 h-4" /> Endorsed
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleApproveRequest(req.id)}
                          className="rounded-xl text-xs font-semibold shrink-0"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Endorse Clearance
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Today's Teaching Highlights */}
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold flex items-center justify-between">
                    <span>Department Lectures in Progress Today</span>
                    <button
                      onClick={() => setActiveTab("timetable")}
                      className="text-xs text-primary hover:underline font-semibold"
                    >
                      Full Matrix →
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {MOCK_TIMETABLE.slice(0, 3).map((slot) => (
                    <div
                      key={slot.id}
                      className="p-3 rounded-xl border bg-muted/20 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary font-bold">
                          {slot.room_number}
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-sm">{slot.subject_name}</p>
                          <p className="text-muted-foreground text-xs">
                            {slot.start_time} - {slot.end_time} • Faculty: {slot.faculty_name}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        Year {slot.year} Div {slot.division}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Department Quick Stats Sidebar */}
            <div className="space-y-6">
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold">Department Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-muted/40 space-y-1">
                    <span className="text-muted-foreground block text-[11px]">Academic Mission</span>
                    <p className="font-medium text-foreground leading-relaxed">
                      {currentDept.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-lg border bg-card">
                      <span className="text-muted-foreground block">Building</span>
                      <span className="font-bold text-foreground">{currentDept.building}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border bg-card">
                      <span className="text-muted-foreground block">HOD Room</span>
                      <span className="font-bold text-foreground">{currentDept.room_number}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t flex flex-col gap-2">
                    <button
                      onClick={() => setActiveTab("broadcast")}
                      className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center gap-2 shadow-xs hover:bg-primary/90 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Broadcast Department Circular
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Research Facilities */}
              <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold">Research Labs & Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg border bg-card">
                    <span className="font-semibold">Apex AI & Robotics Hub (B-108)</span>
                    <Badge variant="outline" className="text-[10px] text-emerald-600 bg-emerald-500/10">
                      Operational
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg border bg-card">
                    <span className="font-semibold">Cloud & Systems Lab (A-315)</span>
                    <Badge variant="outline" className="text-[10px] text-emerald-600 bg-emerald-500/10">
                      Operational
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg border bg-card">
                    <span className="font-semibold">Cybersecurity Sandbox (A-320)</span>
                    <Badge variant="outline" className="text-[10px] text-emerald-600 bg-emerald-500/10">
                      Operational
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Tab 2: Faculty Staffing & Workload */}
        {activeTab === "faculty" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Faculty Members & Academic Workload ({deptFaculty.length})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Monitor weekly hours, consultation schedules, and office presence.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Target Workload: 14h / week
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deptFaculty.map((prof) => (
                <Card key={prof.id} className="border shadow-xs hover:border-primary/40 transition-colors">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-foreground">{prof.name}</h4>
                        <p className="text-xs text-primary font-medium">{prof.designation}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600">
                        Active
                      </Badge>
                    </div>

                    <div className="space-y-1 text-xs text-muted-foreground border-t pt-2.5">
                      <p>🏢 **Office:** {prof.office_room}</p>
                      <p>⏰ **Hours:** {prof.office_hours}</p>
                      <p>📧 **Email:** {prof.email}</p>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {prof.specializations?.map((s, idx) => (
                        <span key={idx} className="text-[10px] bg-muted px-2 py-0.5 rounded-md text-foreground">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Weekly Load:</span>
                      <span className="font-bold text-foreground">12 hrs/wk (Optimal)</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Department Timetable Matrix */}
        {activeTab === "timetable" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Department Class Scheduling Matrix
                </h3>
                <p className="text-xs text-muted-foreground">
                  Verify lecture schedules, laboratory sessions, and room occupancy.
                </p>
              </div>

              {/* Year filter */}
              <div className="flex items-center gap-1.5 bg-card p-1 rounded-xl border">
                {[1, 2, 3, 4].map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={cn(
                      "px-3 py-1 rounded-lg text-xs font-semibold transition-colors",
                      selectedYear === year
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Year {year}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="p-3.5">Day</th>
                      <th className="p-3.5">Time Slot</th>
                      <th className="p-3.5">Subject & Code</th>
                      <th className="p-3.5">Type</th>
                      <th className="p-3.5">Faculty In-Charge</th>
                      <th className="p-3.5">Venue</th>
                      <th className="p-3.5">Division</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {deptTimetable.map((slot) => (
                      <tr key={slot.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3.5 font-bold text-foreground">{slot.day_of_week}</td>
                        <td className="p-3.5 font-mono text-muted-foreground">
                          {slot.start_time} - {slot.end_time}
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-foreground block">{slot.subject_name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">{slot.subject_code}</span>
                        </td>
                        <td className="p-3.5">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px]",
                              slot.type === "lab" ? "bg-purple-500/10 text-purple-600 border-purple-500/20" : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                            )}
                          >
                            {slot.type.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-foreground font-medium">{slot.faculty_name}</td>
                        <td className="p-3.5 font-mono font-bold text-primary">{slot.room_number}</td>
                        <td className="p-3.5">Div {slot.division}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Student Lab & Mark Endorsements */}
        {activeTab === "approvals" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-foreground">
                Escalated Student Requests & Clearances ({departmentRequests.length})
              </h3>
              <p className="text-xs text-muted-foreground">
                Formal requests requiring HOD endorsement for laboratory compute, project equipment, or mark retotals.
              </p>
            </div>

            <div className="space-y-3">
              {departmentRequests.map((req) => (
                <Card key={req.id} className="border shadow-xs">
                  <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground uppercase">
                          #{req.id.slice(0, 8)}
                        </span>
                        <Badge
                          className={cn(
                            "text-[10px]",
                            req.status === "resolved"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          )}
                        >
                          {req.status.toUpperCase()}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {req.category}
                        </Badge>
                      </div>

                      <h4 className="text-base font-bold text-foreground">{req.subject}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{req.description}</p>

                      {req.resolution_notes && (
                        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                          {req.resolution_notes}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {req.status === "resolved" ? (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Endorsed by HOD
                        </span>
                      ) : (
                        <Button
                          onClick={() => handleApproveRequest(req.id)}
                          className="rounded-xl text-xs font-semibold gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Endorse Approval
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Broadcast Department Notice */}
        {activeTab === "broadcast" && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div>
              <h3 className="text-base font-bold text-foreground">
                Broadcast Official Department Circular
              </h3>
              <p className="text-xs text-muted-foreground">
                Broadcast instant push alerts to all students and faculty enrolled in {currentDept.name}.
              </p>
            </div>

            {broadcastSent && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Notice published successfully! Broadcast sent to student portals.
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-4 border p-6 rounded-2xl bg-card shadow-xs">
              <div className="space-y-1.5">
                <label className="text-xs font-bold">Target Cohort</label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs shadow-xs"
                >
                  <option value="all_cse">All Computer Science Students (Year 1 - 4)</option>
                  <option value="y3_cse">Year 3 Students (Div A & B)</option>
                  <option value="faculty_cse">Department Faculty Members Only</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold">Circular Title</label>
                <Input
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Mandatory Lab Orientation & Submission of Mini-Project Proposals"
                  required
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold">Detailed Announcement</label>
                <textarea
                  rows={4}
                  value={broadcastBody}
                  onChange={(e) => setBroadcastBody(e.target.value)}
                  placeholder="State the guidelines, deadline dates, and submission room coordinates..."
                  required
                  className="w-full rounded-xl border border-input bg-background p-3 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="flex items-center justify-end pt-2">
                <Button type="submit" className="rounded-xl text-xs font-semibold gap-1.5 shadow-sm">
                  <Send className="w-3.5 h-3.5" />
                  Broadcast Notice
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
