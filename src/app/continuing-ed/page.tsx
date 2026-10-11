"use client";

import React, { useState } from "react";
import {
  ExecutiveProgram,
  ProfessionalMicroCredential,
  CorporateNomination,
  FacultyDevelopmentCohort,
  ProgramType,
  CompetencyDomain,
} from "@/types";
import {
  MOCK_EXECUTIVE_PROGRAMS,
  MOCK_MICRO_CREDENTIALS,
  MOCK_CORPORATE_NOMINATIONS,
  MOCK_FACULTY_COHORTS,
  submitCorporateNomination,
  issueMicroCredentialEnrollment,
} from "@/lib/continuing-ed/continuing-ed-engine";
import {
  ExecutiveProgramCard,
  MicroCredentialBadgeCard,
  CorporateNominationCard,
  CorporateNominationModal,
  CredentialVerifyModal,
} from "@/components/continuing-ed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Award,
  Building2,
  Users,
  Search,
  PlusCircle,
  IndianRupee,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Filter,
} from "lucide-react";

export default function ContinuingEducationPortalPage() {
  const [programs] = useState<ExecutiveProgram[]>(MOCK_EXECUTIVE_PROGRAMS);
  const [credentials, setCredentials] = useState<ProfessionalMicroCredential[]>(MOCK_MICRO_CREDENTIALS);
  const [nominations, setNominations] = useState<CorporateNomination[]>(MOCK_CORPORATE_NOMINATIONS);
  const [facultyCohorts] = useState<FacultyDevelopmentCohort[]>(MOCK_FACULTY_COHORTS);

  const [activeTab, setActiveTab] = useState<"programs" | "credentials" | "nominations" | "faculty_cohorts">("programs");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");

  const [selectedProgramForModal, setSelectedProgramForModal] = useState<ExecutiveProgram | null>(null);
  const [isNominationModalOpen, setIsNominationModalOpen] = useState(false);

  const [selectedCredentialForVerify, setSelectedCredentialForVerify] = useState<ProfessionalMicroCredential | null>(null);
  const [selectedNominationForPass, setSelectedNominationForPass] = useState<CorporateNomination | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const [selectedProgramSyllabus, setSelectedProgramSyllabus] = useState<ExecutiveProgram | null>(null);

  // Handlers
  const handleOpenNomination = (prog: ExecutiveProgram) => {
    setSelectedProgramForModal(prog);
    setIsNominationModalOpen(true);
  };

  const handleCreateNomination = (data: any) => {
    const created = submitCorporateNomination(data);
    setNominations([created, ...nominations]);
  };

  const handleVerifyCredential = (cred: ProfessionalMicroCredential) => {
    setSelectedCredentialForVerify(cred);
    setSelectedNominationForPass(null);
    setIsVerifyModalOpen(true);
  };

  const handleViewPass = (nom: CorporateNomination) => {
    setSelectedNominationForPass(nom);
    setSelectedCredentialForVerify(null);
    setIsVerifyModalOpen(true);
  };

  // Filtered Programs
  const filteredPrograms = programs.filter((p) => {
    const matchQuery =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.program_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = selectedType === "all" || p.program_type === selectedType;
    return matchQuery && matchType;
  });

  // Filtered Credentials
  const filteredCredentials = credentials.filter((c) => {
    const matchQuery =
      c.badge_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.credential_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.issuing_board.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDomain = selectedDomain === "all" || c.competency_domain === selectedDomain;
    return matchQuery && matchDomain;
  });

  const totalCertifiedScholars = credentials.reduce((acc, c) => acc + c.total_certified_scholars, 0);
  const totalCEUs = programs.reduce((acc, p) => acc + Number(p.credit_units), 0).toFixed(1);
  const totalEnrolled = programs.reduce((acc, p) => acc + p.enrolled_count, 0);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/50 via-purple-950/40 to-background border border-border/60 p-6 md:p-8 shadow-sm">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="border-primary/40 text-primary bg-primary/10 font-bold px-3 py-1 text-xs">
              Phase 46 Gateway
            </Badge>
            <Badge variant="secondary" className="text-xs bg-muted/60 text-muted-foreground">
              Executive Continuing Education & Skill Badges
            </Badge>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            Continuing Education, Executive MDP & Micro-Credentials
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm max-w-3xl leading-relaxed">
            Institutional gateway for Executive Management Development Programs (MDP), AICTE-ATAL Faculty Development Programs (FDP),
            cryptographically verifiable micro-credentials, and corporate sponsored professional upskilling.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="bg-card/70 backdrop-blur-md p-3 rounded-xl border border-border/50">
              <span className="text-[11px] text-muted-foreground block">Active Executive Cohorts</span>
              <span className="text-xl md:text-2xl font-bold text-foreground">{programs.length} Programs</span>
            </div>
            <div className="bg-card/70 backdrop-blur-md p-3 rounded-xl border border-border/50">
              <span className="text-[11px] text-muted-foreground block">Enrolled Executives & Faculty</span>
              <span className="text-xl md:text-2xl font-bold text-indigo-600 dark:text-indigo-400">{totalEnrolled} Scholars</span>
            </div>
            <div className="bg-card/70 backdrop-blur-md p-3 rounded-xl border border-border/50">
              <span className="text-[11px] text-muted-foreground block">Total Certified Scholars</span>
              <span className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">{totalCertifiedScholars} Certified</span>
            </div>
            <div className="bg-card/70 backdrop-blur-md p-3 rounded-xl border border-border/50">
              <span className="text-[11px] text-muted-foreground block">CEU Credits Curricular Weight</span>
              <span className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400">{totalCEUs} CEUs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Button
            variant={activeTab === "programs" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("programs")}
            className="text-xs h-8.5 font-semibold flex items-center gap-1.5"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Executive Programs ({programs.length})</span>
          </Button>

          <Button
            variant={activeTab === "credentials" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("credentials")}
            className="text-xs h-8.5 font-semibold flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Micro-Credentials ({credentials.length})</span>
          </Button>

          <Button
            variant={activeTab === "nominations" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("nominations")}
            className="text-xs h-8.5 font-semibold flex items-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Corporate Nominations ({nominations.length})</span>
          </Button>

          <Button
            variant={activeTab === "faculty_cohorts" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("faculty_cohorts")}
            className="text-xs h-8.5 font-semibold flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Faculty ATAL Tracks ({facultyCohorts.length})</span>
          </Button>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="text-xs h-8.5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-1.5 shrink-0"
            onClick={() => {
              if (programs.length > 0) {
                handleOpenNomination(programs[0]);
              }
            }}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nominate Candidate</span>
          </Button>
        </div>
      </div>

      {/* TAB 1: EXECUTIVE PROGRAMS */}
      {activeTab === "programs" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card/60 p-3 rounded-xl border border-border/50">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by program title, code, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg bg-background border border-border/80 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-background border border-border/80 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Program Tracks</option>
                <option value="executive_mdp">Executive MDP</option>
                <option value="faculty_fdp">Faculty FDP (ATAL)</option>
                <option value="industry_masterclass">Industry Masterclass</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrograms.map((program) => (
              <ExecutiveProgramCard
                key={program.id}
                program={program}
                onNominate={handleOpenNomination}
                onViewSyllabus={(prog) => setSelectedProgramSyllabus(prog)}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PROFESSIONAL MICRO-CREDENTIALS */}
      {activeTab === "credentials" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card/60 p-3 rounded-xl border border-border/50">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search micro-credential badges by title or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg bg-background border border-border/80 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-background border border-border/80 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Domains</option>
                <option value="generative_ai">Generative AI</option>
                <option value="cloud_devops">Cloud & DevOps</option>
                <option value="cybersecurity">Cybersecurity</option>
                <option value="quantum_computing">Quantum Computing</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCredentials.map((cred) => (
              <MicroCredentialBadgeCard
                key={cred.id}
                credential={cred}
                onVerify={handleVerifyCredential}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CORPORATE NOMINATIONS */}
      {activeTab === "nominations" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-card/60 border border-border/50 text-xs">
            <span className="text-muted-foreground">
              Official Corporate & Institutional Sponsored Executives Ledger
            </span>
            <span className="font-mono font-bold text-primary">
              {nominations.length} Active Candidates
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nominations.map((nomination) => (
              <CorporateNominationCard
                key={nomination.id}
                nomination={nomination}
                onViewPass={handleViewPass}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FACULTY ATAL TRACKS */}
      {activeTab === "faculty_cohorts" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {facultyCohorts.map((cohort) => (
              <Card key={cohort.id} className="border border-border/60 bg-card/60 backdrop-blur-md shadow-sm">
                <CardHeader className="pb-3 border-b border-border/40">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                      {cohort.aicte_atal_recognized ? "AICTE-ATAL Approved" : "Institutional Track"}
                    </Badge>
                    <span className="text-[11px] font-medium text-muted-foreground capitalize">
                      {cohort.status}
                    </span>
                  </div>
                  <CardTitle className="text-base font-bold mt-2">
                    {cohort.cohort_name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{cohort.coordinating_department}</p>
                </CardHeader>
                <CardContent className="pt-4 space-y-3 text-xs">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Convenor:</span> {cohort.lead_convenor}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Participating Colleges:</span> {cohort.participating_institutions_count} Institutions
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Enrolled Faculty Fellows:</span> {cohort.faculty_fellows_enrolled} Fellows
                    </p>
                  </div>
                  <div className="bg-muted/30 p-2.5 rounded-lg border border-border/40 flex items-center justify-between">
                    <span className="text-muted-foreground">Grant Outlay</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{(cohort.grant_subsidy_inr / 100000).toFixed(1)} Lakhs
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Nomination Modal */}
      <CorporateNominationModal
        isOpen={isNominationModalOpen}
        onClose={() => setIsNominationModalOpen(false)}
        program={selectedProgramForModal}
        onSubmit={handleCreateNomination}
      />

      {/* Verification Docket Modal */}
      <CredentialVerifyModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        credential={selectedCredentialForVerify}
        nomination={selectedNominationForPass}
      />

      {/* Syllabus Detail Dialog */}
      {selectedProgramSyllabus && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="outline" className="text-xs text-primary bg-primary/10 mb-1">
                  {selectedProgramSyllabus.program_code}
                </Badge>
                <h3 className="text-lg font-bold text-foreground">
                  {selectedProgramSyllabus.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Director: {selectedProgramSyllabus.lead_faculty_director}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Executive Curriculum Modules
              </span>
              <div className="space-y-2">
                {selectedProgramSyllabus.syllabus_modules.map((mod, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-muted/30 border border-border/40 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{mod}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                size="sm"
                className="text-xs"
                onClick={() => setSelectedProgramSyllabus(null)}
              >
                Close Syllabus
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
