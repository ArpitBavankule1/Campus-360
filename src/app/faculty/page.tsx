"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layout/portal-layout";
import { getFacultyDirectory, type FacultyRow, MOCK_FACULTY, MOCK_TIMETABLE } from "@/lib/supabase/queries";
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
  CheckCircle2,
  XCircle,
  FileText,
  UserCheck,
  BookOpen,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "cn";

interface StudentAttendanceRecord {
  id: string;
  name: string;
  roll: string;
  status: "present" | "absent" | "late";
}

const INITIAL_STUDENTS: StudentAttendanceRecord[] = [
  { id: "1", name: "Aarav Sharma", roll: "CSE-2023-001", status: "present" },
  { id: "2", name: "Aditi Rao", roll: "CSE-2023-002", status: "present" },
  { id: "3", name: "Bhavin Patel", roll: "CSE-2023-003", status: "absent" },
  { id: "4", name: "Divya Nair", roll: "CSE-2023-004", status: "present" },
  { id: "5", name: "Ishaan Gupta", roll: "CSE-2023-005", status: "late" },
  { id: "6", name: "Kavya Menon", roll: "CSE-2023-006", status: "present" },
  { id: "7", name: "Rohan Deshmukh", roll: "CSE-2023-007", status: "present" },
  { id: "8", name: "Tanvi Verma", roll: "CSE-2023-008", status: "present" },
];

function FacultyContent() {
  const { user, profile, role } = useAuth();
  const [activeView, setActiveView] = useState<"directory" | "teaching_hub">(
    role === "faculty" ? "teaching_hub" : "directory"
  );

  const [faculty, setFaculty] = useState<FacultyRow[]>(MOCK_FACULTY);
  const [search, setSearch] = useState("");

  // Attendance Tracker state
  const [students, setStudents] = useState<StudentAttendanceRecord[]>(INITIAL_STUDENTS);
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  // Office consultations state
  const [consultations, setConsultations] = useState([
    { id: "c1", student: "Aarav Sharma", topic: "Final Year Capstone Project Architecture Review", time: "02:30 PM", status: "confirmed" },
    { id: "c2", student: "Divya Nair", topic: "Clarification on Paxos Consensus Algorithm in Midterm", time: "03:15 PM", status: "confirmed" },
    { id: "c3", student: "Kavya Menon", topic: "Recommendation letter request for summer research internship", time: "04:00 PM", status: "pending" },
  ]);

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

  const toggleStudentStatus = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === "present" ? "absent" : s.status === "absent" ? "late" : "present";
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const handleSaveAttendance = () => {
    setAttendanceSaved(true);
    setTimeout(() => setAttendanceSaved(false), 3000);
  };

  const handleCompleteConsultation = (id: string) => {
    setConsultations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "completed" } : c))
    );
  };

  const presentCount = students.filter((s) => s.status === "present").length;
  const lateCount = students.filter((s) => s.status === "late").length;
  const absentCount = students.filter((s) => s.status === "absent").length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & View Switcher */}
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
            <span>Faculty & Academic Staff Portal</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Browse teaching staff or switch to your personal faculty teaching console
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-card border rounded-2xl shadow-xs">
          <button
            onClick={() => setActiveView("directory")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5",
              activeView === "directory"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Users className="w-3.5 h-3.5" />
            Public Directory
          </button>

          <button
            onClick={() => setActiveView("teaching_hub")}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5",
              activeView === "teaching_hub"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Faculty Teaching Hub
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
          </button>
        </div>
      </div>

      {/* VIEW 1: FACULTY TEACHING HUB */}
      {activeView === "teaching_hub" && (
        <div className="space-y-6">
          {/* Teacher Profile Quick Strip */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
                Teaching Faculty Console • Academic Term 2026
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
                Welcome, {profile?.full_name || "Prof. Anita Desai"}
              </h2>
              <p className="text-xs text-indigo-200">
                Department of Computer Science & Engineering • Office: Turing Block A-308 • Office Hours: 11:00 AM - 01:00 PM
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/timetable"
                className="px-4 py-2 rounded-xl bg-white text-indigo-950 font-bold text-xs shadow-xs hover:bg-indigo-50 transition-colors"
              >
                View Full Timetable
              </Link>
              <Link
                href="/hod"
                className="px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 font-semibold text-xs hover:bg-white/20 transition-colors"
              >
                HOD Oversight
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border shadow-xs">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Today's Lectures</p>
                  <p className="text-lg font-bold">2 Slots Assigned</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-xs">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Average Attendance</p>
                  <p className="text-lg font-bold">92.4%</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-xs">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Consultation Bookings</p>
                  <p className="text-lg font-bold">{consultations.filter(c => c.status !== "completed").length} Students</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-xs">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Syllabus Completion</p>
                  <p className="text-lg font-bold">78% Progress</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive Attendance Marker Tool */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="border shadow-xs">
                <CardHeader className="pb-3 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-primary" />
                      Class Attendance Marker — CS-501 (Year 3 Div A)
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Lecture: Turing Block A-301 • 09:00 AM - 10:00 AM • Tap roll call to toggle status
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {presentCount} Present
                    </span>
                    <span className="text-xs font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md">
                      {lateCount} Late
                    </span>
                    <span className="text-xs font-semibold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-md">
                      {absentCount} Absent
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-4">
                  {attendanceSaved && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4" />
                      Attendance submitted and synced with Supabase academic registry!
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                    {students.map((student) => (
                      <div
                        key={student.id}
                        onClick={() => toggleStudentStatus(student.id)}
                        className={cn(
                          "p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all select-none",
                          student.status === "present"
                            ? "bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/60"
                            : student.status === "late"
                            ? "bg-amber-500/5 border-amber-500/30 hover:border-amber-500/60"
                            : "bg-rose-500/5 border-rose-500/30 hover:border-rose-500/60"
                        )}
                      >
                        <div>
                          <p className="font-bold text-xs text-foreground">{student.name}</p>
                          <span className="text-[10px] font-mono text-muted-foreground">{student.roll}</span>
                        </div>

                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] capitalize font-bold",
                            student.status === "present"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                              : student.status === "late"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                              : "bg-rose-500/10 text-rose-600 border-rose-500/30"
                          )}
                        >
                          {student.status}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t text-xs">
                    <span className="text-muted-foreground">Click any student card to cycle status</span>
                    <Button
                      size="sm"
                      onClick={handleSaveAttendance}
                      className="rounded-xl text-xs font-semibold shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                      Save & Broadcast Roll Call
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Course Materials & Syllabus Progress */}
              <Card className="border shadow-xs">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Courses & Syllabus Delivery
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl border bg-card space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">CS-501: Distributed Systems</span>
                      <span className="font-bold text-primary">Module 4 / 5 (80%)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: "80%" }} />
                    </div>
                    <span className="text-[11px] text-muted-foreground block">
                      Next Lecture Topic: Byzantine Fault Tolerance & Raft Consensus
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border bg-card space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">CS-508: Cloud Architecture Lab</span>
                      <span className="font-bold text-purple-600">Lab 7 / 10 (70%)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: "70%" }} />
                    </div>
                    <span className="text-[11px] text-muted-foreground block">
                      Current Assignment: Kubernetes Cluster Deployment on GCP
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Office Hours & Student Consultation Queue */}
            <div className="space-y-4">
              <Card className="border shadow-xs">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-sm font-bold flex items-center justify-between">
                    <span>Office Hour Consultations</span>
                    <Badge variant="outline" className="text-[10px]">
                      Today
                    </Badge>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Students booked for consultation in Turing Block A-308
                  </p>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {consultations.map((c) => (
                    <div
                      key={c.id}
                      className={cn(
                        "p-3 rounded-xl border transition-all space-y-1.5",
                        c.status === "completed"
                          ? "bg-muted/30 border-border/50 opacity-60"
                          : "bg-card border-border/80"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-foreground">{c.student}</span>
                        <span className="text-[10px] font-mono font-semibold bg-muted px-1.5 py-0.5 rounded text-primary">
                          {c.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{c.topic}</p>

                      <div className="flex items-center justify-end pt-1">
                        {c.status === "completed" ? (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Met
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCompleteConsultation(c.id)}
                            className="h-6 text-[10px] rounded-lg px-2"
                          >
                            Mark Completed
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Guidance Box */}
              <div className="p-4 rounded-xl border bg-muted/20 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Faculty Policy Reminders</span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Attendance records should be locked within 24 hours of lecture completion. Mid-term re-evaluations must be acknowledged within 3 academic days.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: PUBLIC FACULTY DIRECTORY */}
      {activeView === "directory" && (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search faculty by professor name, office room, specialization, or designation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-11 text-xs md:text-sm rounded-xl"
              />
            </div>
          </div>

          {/* Faculty Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFaculty.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden border border-border/70 hover:border-primary/50 transition-all hover:shadow-md group flex flex-col justify-between"
              >
                <div>
                  {/* Card Header Top */}
                  <div className="p-5 pb-4 bg-gradient-to-br from-muted/30 to-muted/10 border-b border-border/50">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        {item.avatar_url ? (
                          <img
                            src={item.avatar_url}
                            alt={item.name}
                            className="h-16 w-16 rounded-2xl object-cover border-2 border-background shadow-xs group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl border-2 border-background shadow-xs">
                            {item.name.charAt(0)}
                          </div>
                        )}
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-background" />
                      </div>

                      {/* Name & Title */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs text-primary font-medium truncate mt-0.5">
                          {item.designation}
                        </p>
                        {item.qualifications && (
                          <p className="text-[11px] text-muted-foreground truncate mt-1 flex items-center gap-1">
                            <Award className="h-3 w-3 shrink-0" />
                            <span>{item.qualifications}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3.5">
                    {/* Bio */}
                    {item.bio && (
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {item.bio}
                      </p>
                    )}

                    {/* Specializations Tags */}
                    {item.specializations && item.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.specializations.map((spec, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-[10px] font-normal px-2 py-0.5"
                          >
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Office Details */}
                    <div className="pt-2 border-t border-border/50 space-y-1.5 text-xs">
                      {item.office_room && (
                        <div className="flex items-center gap-2 text-foreground font-medium">
                          <Building className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span>{item.office_room}</span>
                        </div>
                      )}

                      {item.office_hours && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span>Hours: {item.office_hours}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 pt-0 border-t border-border/40 bg-muted/10 flex items-center justify-between gap-2 mt-auto">
                  {item.email && (
                    <a
                      href={`mailto:${item.email}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 text-xs font-semibold text-foreground hover:bg-muted transition-colors flex-1 justify-center"
                    >
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      <span>Email</span>
                    </a>
                  )}

                  {item.phone && (
                    <a
                      href={`tel:${item.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 text-xs font-semibold text-foreground hover:bg-muted transition-colors flex-1 justify-center"
                    >
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      <span>Call</span>
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {filteredFaculty.length === 0 && (
            <div className="text-center py-16 border rounded-2xl bg-card">
              <Users className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
              <h3 className="font-semibold text-sm">No Faculty Found</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Try adjusting your search keywords or clearing the filter query.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FacultyPage() {
  return (
    <PortalLayout>
      <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading Faculty Directory...</div>}>
        <FacultyContent />
      </Suspense>
    </PortalLayout>
  );
}
