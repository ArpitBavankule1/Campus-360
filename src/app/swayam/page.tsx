"use client";

import React, { useState, useEffect } from "react";
import {
  SwayamSummaryStats,
  SwayamCourse,
  SwayamEnrollment,
  SwayamCertification,
  SwayamCreditTransfer,
} from "@/types";
import {
  ChapterProfileBanner,
  CourseCatalogCard,
  EnrollmentTrackerCard,
  CertificationsShowcaseCard,
  CreditTransferCard,
  EnrollCourseModal,
  RequestCreditTransferModal,
} from "@/components/swayam";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  BookOpen,
  Award,
  Users,
  Trophy,
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  Database,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { getSwayamSummaryStats } from "@/lib/swayam/swayam-engine";

export default function SwayamPortalPage() {
  const [stats, setStats] = useState<SwayamSummaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "courses" | "enrollments" | "certifications" | "transfers"
  >("overview");

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");

  // Modal states
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState<SwayamCourse | null>(null);
  const [transferModalOpen, setTransferModalOpen] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/swayam/stats");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setStats(json.data);
          return;
        }
      }
      setStats(getSwayamSummaryStats());
    } catch {
      setStats(getSwayamSummaryStats());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleOpenEnrollModal = (course: SwayamCourse) => {
    setSelectedCourseForEnroll(course);
    setEnrollModalOpen(true);
  };

  const handleEnrollSuccess = () => {
    fetchStats();
  };

  const handleTransferSuccess = () => {
    fetchStats();
  };

  if (loading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-sm text-muted-foreground">
          Loading SWAYAM-NPTEL Gateway & Academic Credit Transfer Ledger...
        </p>
      </div>
    );
  }

  // Filtered courses
  const filteredCourses = stats.courses.filter((course) => {
    const matchesQuery =
      course.course_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.course_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.offering_institute.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiscipline =
      selectedDiscipline === "all" || course.discipline.includes(selectedDiscipline);
    return matchesQuery && matchesDiscipline;
  });

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl animate-in fade-in-50 duration-300">
      {/* Top Header Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-blue-600/15 text-blue-500 border-blue-500/30 font-semibold px-2.5 py-0.5">
              Phase 56: Ministry of Education SWAYAM-NPTEL Gateway
            </Badge>
            <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-xs font-semibold">
              NEP 2020 Credit Transfer Active
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <GraduationCap className="h-8 w-8 text-blue-500 shrink-0" />
            SWAYAM-NPTEL MOOCs & Academic Credit Transfer Portal
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Official institutional gateway for SWAYAM/NPTEL online courses, Local Chapter LC-4109 management, proctored examinations, and Board of Studies (BoS) credit transfers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStats}
            className="flex items-center gap-1.5 text-xs h-9"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Sync Ledger
          </Button>
          <Button
            size="sm"
            onClick={() => setTransferModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 text-xs h-9 font-medium shadow-sm"
          >
            <Database className="h-3.5 w-3.5" />
            Apply for Credit Transfer
          </Button>
        </div>
      </div>

      {/* Chapter Profile Banner */}
      <ChapterProfileBanner
        chapter={stats.chapter}
        onExploreCourses={() => setActiveTab("courses")}
      />

      {/* High-Level Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Total Enrolled</span>
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.totalEnrollments}</div>
            <p className="text-[11px] text-muted-foreground">Students & Faculty</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Exam Registrations</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.examRegistrations}</div>
            <p className="text-[11px] text-muted-foreground">NTA / TCS iON Centers</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Certified Scholars</span>
              <Award className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-500">{stats.totalCertified}</div>
            <p className="text-[11px] text-muted-foreground">Successful Completions</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Elite + Gold</span>
              <Trophy className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-500">{stats.eliteGoldCount}</div>
            <p className="text-[11px] text-muted-foreground">Score &ge; 90% (Top 1-2%)</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Faculty FDPs</span>
              <Sparkles className="h-4 w-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-400">{stats.facultyFdpCount}</div>
            <p className="text-[11px] text-muted-foreground">AICTE Approved CAS</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">NEP Credits</span>
              <Database className="h-4 w-4 text-teal-400" />
            </div>
            <div className="text-2xl font-bold text-teal-400">{stats.totalCreditsTransferred}</div>
            <p className="text-[11px] text-muted-foreground">ABC Bank Deposited</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 border-b border-border/60 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-blue-600/10 text-blue-500 border-b-2 border-blue-500"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          Overview & Telemetry
        </button>

        <button
          onClick={() => setActiveTab("courses")}
          className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "courses"
              ? "bg-blue-600/10 text-blue-500 border-b-2 border-blue-500"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          Curated Course Catalog ({stats.courses.length})
        </button>

        <button
          onClick={() => setActiveTab("enrollments")}
          className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "enrollments"
              ? "bg-blue-600/10 text-blue-500 border-b-2 border-blue-500"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          Active Enrollments ({stats.enrollments.length})
        </button>

        <button
          onClick={() => setActiveTab("certifications")}
          className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "certifications"
              ? "bg-blue-600/10 text-blue-500 border-b-2 border-blue-500"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Award className="h-3.5 w-3.5" />
          Certifications & FDPs ({stats.certifications.length})
        </button>

        <button
          onClick={() => setActiveTab("transfers")}
          className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "transfers"
              ? "bg-blue-600/10 text-blue-500 border-b-2 border-blue-500"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Database className="h-3.5 w-3.5" />
          Academic Credit Transfer Ledger ({stats.creditTransfers.length})
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* National Performance Card */}
            <Card className="lg:col-span-2 border-border/60 bg-card/60 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-amber-500" />
                      Local Chapter National Standing & Elite Ratio
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Ministry of Education & NPTEL IIT Madras Local Chapter AAA Rating Tier
                    </p>
                  </div>
                  <Badge className="bg-amber-500/15 text-amber-500 border-amber-500/30 text-xs font-semibold">
                    Top 1% Nationally
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2">
                  <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                    <div className="text-xs text-muted-foreground">National Rank</div>
                    <div className="text-xl font-extrabold text-blue-500">#{stats.nationalRank}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Out of 5,200+ Colleges</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                    <div className="text-xs text-muted-foreground">Elite Pass Rate</div>
                    <div className="text-xl font-extrabold text-emerald-500">{stats.elitePassRatePct}%</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">&ge; 60% Exam Score</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                    <div className="text-xs text-muted-foreground">Elite + Silver</div>
                    <div className="text-xl font-extrabold text-slate-300">{stats.eliteSilverCount}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Score 75-89%</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                    <div className="text-xs text-muted-foreground">NEP Transfer Cap</div>
                    <div className="text-xl font-extrabold text-teal-400">40%</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">UGC Credit Ceiling</div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-950/20 border border-blue-500/20 text-xs space-y-1.5 leading-relaxed text-muted-foreground">
                  <div className="font-semibold text-blue-400 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    NEP 2020 & UGC Online Credit Transfer Framework (Regulations 2021)
                  </div>
                  <p>
                    Students may transfer up to 40% of the total semester credits through SWAYAM-NPTEL MOOCs upon approval by the Board of Studies (BoS) and Academic Council. Credits are directly ratified and deposited into the student's Academic Bank of Credits (ABC) / APAAR ID with zero loss of academic standing.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  Quick Actions
                </h3>
                <div className="space-y-2.5">
                  <Button
                    onClick={() => setActiveTab("courses")}
                    variant="outline"
                    className="w-full justify-start text-xs h-10 gap-2 border-border/70"
                  >
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    Browse Curated Course Catalog
                  </Button>
                  <Button
                    onClick={() => setTransferModalOpen(true)}
                    variant="outline"
                    className="w-full justify-start text-xs h-10 gap-2 border-border/70"
                  >
                    <Database className="h-4 w-4 text-emerald-500" />
                    Apply for BoS Credit Equivalence
                  </Button>
                  <Button
                    onClick={() => setActiveTab("certifications")}
                    variant="outline"
                    className="w-full justify-start text-xs h-10 gap-2 border-border/70"
                  >
                    <Award className="h-4 w-4 text-amber-500" />
                    Verify NPTEL e-Certificates
                  </Button>
                  <Button
                    onClick={() => setActiveTab("enrollments")}
                    variant="outline"
                    className="w-full justify-start text-xs h-10 gap-2 border-border/70"
                  >
                    <Users className="h-4 w-4 text-purple-400" />
                    View Active Student Cohorts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Featured Courses Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground">Featured Institutional Courses</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("courses")}
                className="text-xs text-blue-500 flex items-center gap-1"
              >
                View all ({stats.courses.length}) <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.courses.slice(0, 3).map((course) => (
                <CourseCatalogCard
                  key={course.id}
                  course={course}
                  onEnroll={handleOpenEnrollModal}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Courses */}
      {activeTab === "courses" && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search course title, code, institute..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                className="h-9 text-xs rounded-md border border-input bg-background px-3"
              >
                <option value="all">All Disciplines</option>
                <option value="Computer Science">Computer Science & Engineering</option>
                <option value="Electrical">Electrical & Electronics</option>
                <option value="Mechanical">Mechanical & Materials</option>
                <option value="Management">Management & Innovation</option>
                <option value="Biotechnology">Biotechnology & Bioinformatics</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => (
              <CourseCatalogCard
                key={course.id}
                course={course}
                onEnroll={handleOpenEnrollModal}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Enrollments */}
      {activeTab === "enrollments" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">
                Active Student & Faculty Enrollments
              </h3>
              <p className="text-xs text-muted-foreground">
                Live weekly assignment tracking, admit cards, and proctored examination center details.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.enrollments.map((enr) => (
              <EnrollmentTrackerCard key={enr.id} enrollment={enr} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Certifications */}
      {activeTab === "certifications" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">
                NPTEL Proctored Certifications & AICTE FDPs
              </h3>
              <p className="text-xs text-muted-foreground">
                Cryptographically verifiable electronic certificates with Elite Gold/Silver medals.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.certifications.map((cert) => (
              <CertificationsShowcaseCard
                key={cert.id}
                certification={cert}
                onViewDetails={(c) => alert(`Cryptographic Verification Hash: ${c.verification_hash}\nQR Payload: ${c.qr_seal_payload}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Credit Transfers */}
      {activeTab === "transfers" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">
                Board of Studies (BoS) Academic Credit Transfer Ledger
              </h3>
              <p className="text-xs text-muted-foreground">
                NEP 2020 course equivalence ratification and Academic Bank of Credits (ABC) synchronization.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setTransferModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
            >
              New Transfer Application
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.creditTransfers.map((trf) => (
              <CreditTransferCard key={trf.id} transfer={trf} />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <EnrollCourseModal
        course={selectedCourseForEnroll}
        isOpen={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
        onSuccess={handleEnrollSuccess}
      />

      <RequestCreditTransferModal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        onSuccess={handleTransferSuccess}
      />
    </div>
  );
}
