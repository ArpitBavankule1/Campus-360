"use client";

import React, { useState, useEffect } from "react";
import {
  AisheSummaryStats,
  AisheDcfSurvey,
  AisheEnrollmentRecord,
  AisheFacultyCadre,
  AisheFinancialStatement,
} from "@/types";
import {
  AisheProfileBanner,
  DcfSurveyCard,
  EnrollmentDemographicsCard,
  FacultyCadreCard,
  FinancialStatementCard,
  UpdateSurveyBlockModal,
  ViewCertificateModal,
} from "@/components/aishe";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Landmark,
  ShieldCheck,
  Award,
  Users,
  GraduationCap,
  Building,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  Sun,
  Flame,
  Home,
  Monitor,
  BookOpen,
} from "lucide-react";
import { getAisheSummaryStats } from "@/lib/aishe/aishe-engine";

export default function AishePortalPage() {
  const [stats, setStats] = useState<AisheSummaryStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    "overview" | "surveys" | "enrollment" | "faculty" | "finances" | "infrastructure"
  >("overview");

  // Modals state
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState("");
  const [selectedBlockKey, setSelectedBlockKey] = useState("");
  const [selectedBlockStatus, setSelectedBlockStatus] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/aishe/stats");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setStats(json.data);
          return;
        }
      }
      // Fallback to local engine
      setStats(getAisheSummaryStats());
    } catch {
      setStats(getAisheSummaryStats());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleOpenBlockModal = (surveyId: string, blockKey: string, currentStatus: boolean) => {
    setSelectedSurveyId(surveyId);
    setSelectedBlockKey(blockKey);
    setSelectedBlockStatus(currentStatus);
    setBlockModalOpen(true);
  };

  const handleConfirmBlockUpdate = async (
    surveyId: string,
    blockKey: string,
    newStatus: boolean
  ) => {
    try {
      const res = await fetch("/api/aishe/surveys", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surveyId,
          block: blockKey,
          completed: newStatus,
        }),
      });
      if (res.ok) {
        await fetchStats();
      }
    } catch (err) {
      console.error("Failed to update survey block:", err);
    }
  };

  if (loading || !stats) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
        <p className="text-sm text-muted-foreground">Loading AISHE National Survey Portal Telemetry...</p>
      </div>
    );
  }

  const { profile, surveys, enrollment, faculty, finances, infrastructure } = stats;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
      {/* Top Header Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-600/15 text-blue-500 border-blue-500/30 text-xs px-2.5 py-0.5 font-semibold">
              Phase 55: Ministry of Education AISHE Gateway
            </Badge>
            <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400">
              Statutory Higher Ed Telemetry
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Landmark className="h-7 w-7 text-blue-500" />
            All India Survey on Higher Education (AISHE)
          </h1>
          <p className="text-sm text-muted-foreground">
            Official Data Capture Format (DCF), Gross Enrolment Ratio, Gender Parity & Financial Telemetry Portal
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStats}
            className="text-xs gap-1.5 h-9"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh Telemetry
          </Button>
          <Button
            size="sm"
            onClick={() => setCertModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs gap-1.5 h-9 font-medium"
          >
            <Award className="h-3.5 w-3.5" />
            Survey Certificate
          </Button>
        </div>
      </div>

      {/* Main Institution Profile Banner */}
      <AisheProfileBanner
        profile={profile}
        onViewCertificate={() => setCertModalOpen(true)}
      />

      {/* Navigation Tabs */}
      <div className="border-b border-border/60">
        <div className="flex items-center gap-2 overflow-x-auto pb-px">
          {[
            { id: "overview", label: "Executive Overview & KPIs", icon: Sparkles },
            { id: "surveys", label: "DCF Annual Surveys", icon: FileSpreadsheet, badge: surveys.length },
            { id: "enrollment", label: "Enrollment & Demographics", icon: GraduationCap, badge: stats.totalStudents.toLocaleString() },
            { id: "faculty", label: "Faculty Cadres & PTR", icon: Users, badge: `PTR ${stats.pupilTeacherRatio}:1` },
            { id: "finances", label: "Institutional Finances", icon: TrendingUp },
            { id: "infrastructure", label: "Campus Infrastructure", icon: Building },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                  isActive
                    ? "border-blue-500 text-blue-500 bg-blue-500/5 rounded-t-lg"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-blue-500" : "text-muted-foreground"}`} />
                {tab.label}
                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Executive Overview & KPIs */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Key Metric Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border/60 bg-gradient-to-br from-blue-950/20 to-card">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">Gender Parity Index (GPI)</span>
                  <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px]">
                    Exceeds National Benchmark
                  </Badge>
                </div>
                <div className="text-3xl font-extrabold text-foreground">{stats.genderParityIndex}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalFemaleStudents.toLocaleString()} Female per {stats.totalMaleStudents.toLocaleString()} Male Scholars
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-gradient-to-br from-indigo-950/20 to-card">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">Pupil-Teacher Ratio (PTR)</span>
                  <Badge className="bg-blue-500/15 text-blue-500 border-blue-500/30 text-[10px]">
                    UGC Norm Compliant
                  </Badge>
                </div>
                <div className="text-3xl font-extrabold text-foreground">{stats.pupilTeacherRatio} : 1</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalStudents.toLocaleString()} Students to {stats.totalRegularFaculty} Regular Faculty
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-gradient-to-br from-purple-950/20 to-card">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">Doctoral Faculty Ratio</span>
                  <Badge className="bg-purple-500/15 text-purple-400 border-purple-500/30 text-[10px]">
                    Tier-1 Research Standing
                  </Badge>
                </div>
                <div className="text-3xl font-extrabold text-foreground">{stats.phdFacultyPercentage}%</div>
                <p className="text-xs text-muted-foreground">
                  Ph.D. qualified faculty across all departments
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-gradient-to-br from-amber-950/20 to-card">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">Inclusivity & Diversity</span>
                  <Badge className="bg-amber-500/15 text-amber-500 border-amber-500/30 text-[10px]">
                    Pan-India Outreach
                  </Badge>
                </div>
                <div className="text-3xl font-extrabold text-foreground">{stats.socialDiversityPercentage}%</div>
                <p className="text-xs text-muted-foreground">
                  Socio-economic inclusion + {stats.outOfStatePercentage}% interstate scholars
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Cross-Statutory Compliance Eligibility Matrix */}
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-4">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    Statutory Inter-Regulatory Validation Matrix
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    AISHE Code <span className="font-mono text-foreground font-semibold">{profile.aishe_code}</span> unlocks institutional eligibility across regulatory portals
                  </p>
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-xs px-2.5 py-1">
                  100% Cleared for Regulatory Filings
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-border/60 bg-card/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-foreground">NIRF Rankings 2026</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    AISHE enrollment telemetry feeds TLR and OI parameters directly.
                  </p>
                  <Badge variant="secondary" className="text-[10px] text-blue-400">
                    Linked to /nirf
                  </Badge>
                </div>

                <div className="p-4 rounded-xl border border-border/60 bg-card/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-foreground">NAAC SSR / AQAR</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Criterion 2 & 4 quantitative indicators auto-synchronized with AISHE DCF.
                  </p>
                  <Badge variant="secondary" className="text-[10px] text-purple-400">
                    Linked to /iqac
                  </Badge>
                </div>

                <div className="p-4 rounded-xl border border-border/60 bg-card/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-foreground">AICTE Approval (EoA)</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Faculty cadre ratios and built-up area norm compliance certified.
                  </p>
                  <Badge variant="secondary" className="text-[10px] text-emerald-400">
                    Linked to /aicte
                  </Badge>
                </div>

                <div className="p-4 rounded-xl border border-border/60 bg-card/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-foreground">UGC Autonomous 12(B)</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Mandatory annual DCF upload verified for central research funding.
                  </p>
                  <Badge variant="secondary" className="text-[10px] text-amber-400">
                    Linked to /ugc
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Peek at Latest Survey Card */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Current Active Survey Cycle
            </h3>
            <DcfSurveyCard
              survey={surveys[0]}
              onUpdateBlock={handleOpenBlockModal}
            />
          </div>
        </div>
      )}

      {/* Tab 2: DCF Annual Surveys */}
      {activeTab === "surveys" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-foreground">Annual Data Capture Format (DCF) Filings</h2>
              <p className="text-xs text-muted-foreground">
                Official survey history submitted to Department of Higher Education, Ministry of Education
              </p>
            </div>
            <Badge variant="outline" className="text-xs border-primary/30 text-primary self-start sm:self-auto">
              Format: Standard DCF-II (Colleges)
            </Badge>
          </div>

          <div className="space-y-4">
            {surveys.map((survey) => (
              <DcfSurveyCard
                key={survey.id}
                survey={survey}
                onUpdateBlock={handleOpenBlockModal}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Enrollment & Demographics */}
      {activeTab === "enrollment" && (
        <EnrollmentDemographicsCard records={enrollment} />
      )}

      {/* Tab 4: Faculty Cadres & Staff */}
      {activeTab === "faculty" && (
        <FacultyCadreCard cadres={faculty} />
      )}

      {/* Tab 5: Institutional Finances */}
      {activeTab === "finances" && (
        <FinancialStatementCard statements={finances} />
      )}

      {/* Tab 6: Campus Infrastructure & Facilities */}
      {activeTab === "infrastructure" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border/60 bg-card/60">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground font-medium">Total Campus Area</span>
                  <div className="text-2xl font-bold text-foreground">{infrastructure.campus_land_area_acres} Acres</div>
                  <span className="text-[11px] text-muted-foreground">{infrastructure.built_up_area_sqm.toLocaleString()} sq.m. Built-up</span>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                  <Building className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/60">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground font-medium">Smart Classrooms</span>
                  <div className="text-2xl font-bold text-emerald-500">
                    {infrastructure.ict_enabled_classrooms} / {infrastructure.total_classrooms}
                  </div>
                  <span className="text-[11px] text-muted-foreground">95.8% ICT & Smart Board Enabled</span>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                  <Monitor className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/60">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground font-medium">Clean Energy Microgrid</span>
                  <div className="text-2xl font-bold text-amber-500">{infrastructure.solar_power_capacity_kw} kW</div>
                  <span className="text-[11px] text-muted-foreground">Rooftop Solar PV Microgrid</span>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                  <Sun className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/60">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground font-medium">Hostel Capacity</span>
                  <div className="text-2xl font-bold text-purple-500">
                    {(infrastructure.hostel_capacity_boys + infrastructure.hostel_capacity_girls).toLocaleString()}
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {infrastructure.hostel_capacity_boys} Boys + {infrastructure.hostel_capacity_girls} Girls Beds
                  </span>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
                  <Home className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-500" />
                Block G: Detailed Infrastructure Inventory Checklist
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-lg border border-border/50 bg-muted/20 space-y-1">
                  <span className="text-muted-foreground">Specialized Laboratories</span>
                  <div className="text-lg font-bold text-foreground">{infrastructure.total_laboratories} Labs</div>
                  <span className="text-[11px] text-muted-foreground">AI, Robotics, VLSI, Advanced Materials</span>
                </div>
                <div className="p-3 rounded-lg border border-border/50 bg-muted/20 space-y-1">
                  <span className="text-muted-foreground">High-End Workstations & PCs</span>
                  <div className="text-lg font-bold text-foreground">{infrastructure.computer_terminals.toLocaleString()}</div>
                  <span className="text-[11px] text-muted-foreground">10 Gbps National Knowledge Network (NKN)</span>
                </div>
                <div className="p-3 rounded-lg border border-border/50 bg-muted/20 space-y-1">
                  <span className="text-muted-foreground">Central Library Holdings</span>
                  <div className="text-lg font-bold text-foreground">{infrastructure.library_books_count.toLocaleString()} Books</div>
                  <span className="text-[11px] text-muted-foreground">{infrastructure.e_journals_subscribed.toLocaleString()} E-Journals Subscribed</span>
                </div>
                <div className="p-3 rounded-lg border border-border/50 bg-muted/20 space-y-1">
                  <span className="text-muted-foreground">Sewage & Water Treatment</span>
                  <div className="text-sm font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Operational Zero-Discharge STP
                  </div>
                  <span className="text-[11px] text-muted-foreground">100% Water recycling for horticulture</span>
                </div>
                <div className="p-3 rounded-lg border border-border/50 bg-muted/20 space-y-1">
                  <span className="text-muted-foreground">Campus Health & Emergency</span>
                  <div className="text-lg font-bold text-foreground">{infrastructure.health_center_beds} Hospital Beds</div>
                  <span className="text-[11px] text-muted-foreground">24/7 ACLS Ambulance + Medical Doctors</span>
                </div>
                <div className="p-3 rounded-lg border border-border/50 bg-muted/20 space-y-1">
                  <span className="text-muted-foreground">Fire & Life Safety Audit</span>
                  <div className="text-sm font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> NOC Certified by State Fire Dept
                  </div>
                  <span className="text-[11px] text-muted-foreground">Annual hydraulic pressure drills completed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modals */}
      <ViewCertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        profile={profile}
      />

      <UpdateSurveyBlockModal
        isOpen={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        surveyId={selectedSurveyId}
        blockKey={selectedBlockKey}
        currentStatus={selectedBlockStatus}
        onConfirm={handleConfirmBlockUpdate}
      />
    </div>
  );
}
