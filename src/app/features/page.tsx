import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  MapPin,
  Bot,
  Megaphone,
  CalendarDays,
  LifeBuoy,
  ShieldAlert,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  Check,
  Building,
  Users,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PublicHeader } from "@/components/layout/public-header";
import { Footer } from "@/components/layout/footer";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Platform Features",
  description: `Explore the full suite of intelligent college management and student success tools built into ${APP_NAME}.`,
};

const FEATURE_MODULES = [
  {
    badge: "Student Success",
    title: "Student Portal & Digital Identity",
    icon: GraduationCap,
    color: "from-blue-600/20 to-indigo-600/10 text-blue-600 dark:text-blue-400",
    description:
      "A personalized command center for everyday academic life. Digital identity verification, customized daily lecture schedules, and real-time announcements all in one synchronized workspace.",
    highlights: [
      "Holographic Digital ID card with QR verification & active status indicator",
      "Department, academic year, and division auto-filtering",
      "Today's schedule with room codes, timings, and instructor details",
      "One-click quick actions to campus maps, timetable, and help tickets",
    ],
  },
  {
    badge: "Geospatial Navigation",
    title: "Interactive Campus Explorer & Leaflet Maps",
    icon: MapPin,
    color: "from-emerald-600/20 to-teal-600/10 text-emerald-600 dark:text-emerald-400",
    description:
      "Full-scale geospatial mapping powered by Leaflet and OpenStreetMap. Never get lost looking for labs, lecture theatres, libraries, or faculty offices.",
    highlights: [
      "Interactive pan-zoom campus map with color-coded category markers",
      "Filter by category: Academic, Labs, Libraries, Auditoriums, Cafeterias, Sports",
      "Wheelchair accessibility filter and operational hour badges",
      "Smooth geospatial fly-to transitions and instant location bookmarking",
    ],
  },
  {
    badge: "Grounded AI Intelligence",
    title: "CampusLens AI Conversational Assistant",
    icon: Bot,
    color: "from-purple-600/20 to-pink-600/10 text-purple-600 dark:text-purple-400",
    description:
      "Context-aware generative campus intelligence grounded directly in your college's live database. Provides factual answers without hallucinations.",
    highlights: [
      "Intent detection engine resolving queries about rooms, timetables, events, and staff",
      "Direct database grounding for zero-hallucination factual responses",
      "Multi-turn conversation threads with conversation memory",
      "Suggested prompt chips for fast 1-tap inquiries",
    ],
  },
  {
    badge: "Academics & Communications",
    title: "Timetable, Notices & Events Center",
    icon: Megaphone,
    color: "from-amber-600/20 to-orange-600/10 text-amber-600 dark:text-amber-400",
    description:
      "Streamlined institutional communications. Keep the whole college updated with urgency-ranked circulars and interactive RSVP-ready campus events.",
    highlights: [
      "Dynamic timetable with department, year, division, and weekday filters",
      "Urgency-tagged institutional notices: Normal, Important, and Urgent",
      "Campus events with dates, venues, organizers, and audience tags",
      "Centralized academic department profiles and complete faculty directory",
    ],
  },
  {
    badge: "Support & Resolution",
    title: "Student Help Desk & Issue Resolution",
    icon: LifeBuoy,
    color: "from-rose-600/20 to-red-600/10 text-rose-600 dark:text-rose-400",
    description:
      "Transparent student grievance and query handling. Submit academic, technical, or facility tickets and track progress through resolution.",
    highlights: [
      "Categorized ticket submissions: Academic, Technical, Facilities, General",
      "Multi-stage status lifecycle: Submitted → Under Review → In Progress → Resolved",
      "Detailed conversation threads with staff and administrative replies",
      "Real-time notifications when your ticket status is updated",
    ],
  },
  {
    badge: "Faculty & Department Leaders",
    title: "Faculty Teaching Hub & HOD Analytics",
    icon: Users,
    color: "from-cyan-600/20 to-blue-600/10 text-cyan-600 dark:text-cyan-400",
    description:
      "Empower educators and department heads with operational clarity, lecture tracking, student query management, and faculty roster oversight.",
    highlights: [
      "Dual-mode Teaching Hub with today's class schedule and quick notice creation",
      "Department-level key performance metrics: faculty count, student intake, workload",
      "Assigned student query triage and direct response tools",
      "Roster management and subject syllabus assignment tracking",
    ],
  },
  {
    badge: "Institutional Governance",
    title: "Central Campus Administration Portal",
    icon: ShieldAlert,
    color: "from-red-600/20 to-purple-600/10 text-red-600 dark:text-red-400",
    description:
      "Total control over college entities. Full Create-Read-Update-Delete (CRUD) capabilities across 10 core institutional data domains.",
    highlights: [
      "Multi-resource CRUD: Students, Faculty, HODs, Departments, Locations, Notices, Events",
      "Live analytics cards monitoring campus enrollment, facilities, and active requests",
      "Multi-college tenant scoping enforced at Row-Level Security (RLS)",
      "Instant entity search, filtering, status toggling, and data management",
    ],
  },
  {
    badge: "Speed & Usability",
    title: "Global Command Palette (⌘K) & Bookmarks",
    icon: Search,
    color: "from-emerald-600/20 to-blue-600/10 text-emerald-600 dark:text-emerald-400",
    description:
      "Blazing fast navigation built for modern keyboard workflows. Jump to any room, timetable schedule, notice, or portal in milliseconds.",
    highlights: [
      "Global shortcut ⌘K / Ctrl+K accessible from anywhere in the portal",
      "Fuzzy search indexing across rooms, faculty, events, notices, and quick links",
      "Saved Bookmarks repository to keep important spaces and notices at your fingertips",
      "Responsive drawer navigation on tablets and mobile phones",
    ],
  },
];

const ROLE_MATRIX = [
  {
    feature: "Personalized Daily Lecture Schedule",
    student: true,
    faculty: true,
    hod: true,
    admin: true,
  },
  {
    feature: "Holographic Digital ID & Roll Verification",
    student: true,
    faculty: false,
    hod: false,
    admin: false,
  },
  {
    feature: "Interactive Leaflet Campus Map & Space Directory",
    student: true,
    faculty: true,
    hod: true,
    admin: true,
  },
  {
    feature: "CampusLens AI Chatbot with Database Grounding",
    student: true,
    faculty: true,
    hod: true,
    admin: true,
  },
  {
    feature: "Help Desk Ticket Submission & Resolution Thread",
    student: true,
    faculty: true,
    hod: true,
    admin: true,
  },
  {
    feature: "Publish Department Announcements & Notices",
    student: false,
    faculty: true,
    hod: true,
    admin: true,
  },
  {
    feature: "Department Faculty Workload & Intake Analytics",
    student: false,
    faculty: false,
    hod: true,
    admin: true,
  },
  {
    feature: "Multi-Resource CRUD & User Role Assignment",
    student: false,
    faculty: false,
    hod: false,
    admin: true,
  },
  {
    feature: "Multi-Tenant College Isolation (RLS Security)",
    student: true,
    faculty: true,
    hod: true,
    admin: true,
  },
];

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-28 bg-gradient-to-b from-background via-muted/20 to-background border-b border-border/40">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute right-10 top-20 h-[350px] w-[350px] rounded-full bg-blue-500/5 blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                Comprehensive Feature Tour
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Engineered for Every Layer of <span className="text-gradient">Higher Education</span>
              </h1>
              <p className="mt-5 text-lg text-muted-foreground sm:text-xl leading-relaxed">
                From undergraduate students finding their next lecture to college deans managing institutional data, {APP_NAME} unifies the entire college ecosystem.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button size="lg" className="gap-2 px-8" render={<Link href="/register" />}>
                  Start Free Demo
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="gap-2 px-8" render={<Link href="/map" />}>
                  <Compass className="h-4 w-4" />
                  Try Campus Map
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid Breakdown */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                8 Integrated Systems in One Unified Hub
              </h2>
              <p className="mt-3 text-base text-muted-foreground sm:text-lg">
                Eliminate fragmented spreadsheets, outdated paper noticeboards, and lost inquiries with purpose-built university software.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {FEATURE_MODULES.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <Card
                    key={idx}
                    className="relative overflow-hidden border border-border/60 bg-card/80 hover:border-primary/40 transition-all hover:shadow-xl hover:shadow-primary/5 group"
                  >
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${item.color} shadow-xs`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <Badge variant="outline" className="text-xs font-semibold px-2.5 py-0.5 border-border/70">
                          {item.badge}
                        </Badge>
                      </div>

                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>

                      <div className="mt-6 pt-6 border-t border-border/50 space-y-2.5">
                        {item.highlights.map((highlight, hIdx) => (
                          <div key={hIdx} className="flex items-start gap-2.5 text-xs text-foreground/90">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Feature Comparison Matrix */}
        <section className="py-20 sm:py-28 bg-muted/20 border-t border-border/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <Badge variant="secondary" className="mb-3">
                Role-Based Architecture
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Capability Matrix by Campus Role
              </h2>
              <p className="mt-3 text-muted-foreground text-sm sm:text-base">
                Granular Row-Level Security (RLS) policies guarantee that each persona gets exactly the tools and privacy protections they need.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card shadow-sm">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/40">
                    <th className="py-4 px-6 font-semibold text-foreground">Platform Capability</th>
                    <th className="py-4 px-4 font-semibold text-center text-foreground">Student</th>
                    <th className="py-4 px-4 font-semibold text-center text-foreground">Faculty</th>
                    <th className="py-4 px-4 font-semibold text-center text-foreground">HOD</th>
                    <th className="py-4 px-4 font-semibold text-center text-foreground">Administrator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {ROLE_MATRIX.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-6 font-medium text-foreground/90">{row.feature}</td>
                      <td className="py-3.5 px-4 text-center">
                        {row.student ? (
                          <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {row.faculty ? (
                          <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {row.hod ? (
                          <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {row.admin ? (
                          <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 sm:py-28 border-t border-border/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground shadow-2xl sm:px-16">
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl font-extrabold sm:text-4xl">
                  Empower Your College Campus Today
                </h2>
                <p className="mt-4 text-base text-primary-foreground/85 sm:text-lg">
                  Get full access to all portals, geospatial mapping, AI assistance, and academic scheduling in minutes.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="gap-2 px-8 font-semibold shadow-md"
                    render={<Link href="/register" />}
                  >
                    Create Free Account
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 border-primary-foreground/30 px-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    render={<Link href="/contact" />}
                  >
                    Contact Institutional Team
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
