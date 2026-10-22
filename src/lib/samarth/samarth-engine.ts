/**
 * Phase 57: Smart Campus SAMARTH eGov Suite & Enterprise ERP Integration Gateway Engine
 * In-memory stateful store, cryptographic token generators, seed data, and sync analytics.
 */

import {
  SamarthInstance,
  SamarthModule,
  SamarthSyncLog,
  SamarthCasApplication,
  SamarthStudentOnboarding,
  SamarthSummaryStats,
  SamarthDeploymentStatus,
  SamarthModuleCategory,
  SamarthSyncDirection,
  SamarthSyncStatus,
  SamarthCasStage,
  SamarthCasStatus,
  SamarthOnboardingStatus,
} from "@/types";

// ==========================================
// Cryptographic & Format Generators
// ==========================================

export function generateSamarthSyncToken(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  const hex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SAMARTH-SYNC-2026-${hex}-${num}`;
}

export function generateSamarthCasToken(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  const hex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SAMARTH-CAS-2026-${hex}-${num}`;
}

export function generateSamarthOnboardingToken(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  const hex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SAMARTH-STU-2026-${hex}-${num}`;
}

export function generateSamarthSecurityHash(payload: string = ""): string {
  const chars = "0123456789abcdef";
  let hash = "sha256:0x";
  for (let i = 0; i < 40; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

// ==========================================
// Seed Data
// ==========================================

export const MOCK_SAMARTH_INSTANCE: SamarthInstance = {
  id: "samarth-inst-001",
  instance_code: "SAMARTH-IN-4109",
  institutional_name: "CampusLens Autonomous Institute of Technology & Research",
  moe_institution_code: "U-0842-AUTONOMOUS",
  samarth_version: "v4.2-enterprise-lts",
  environment: "production",
  api_endpoint_url: "https://api.samarth.ac.in/v4/gateway/in-4109",
  deployment_status: "active",
  last_sync_at: "2026-10-22T21:45:00Z",
  health_score: 99.4,
  active_microservices_count: 38,
  created_at: "2026-01-15T09:00:00Z",
  updated_at: "2026-10-22T21:45:00Z",
};

export const MOCK_SAMARTH_MODULES: SamarthModule[] = [
  {
    id: "mod-001",
    module_key: "student_admissions_cuet",
    name: "Student Lifecycle & CUET Onboarding",
    category: "student_lifecycle",
    description: "National CUET scorecard ingestion, merit counseling allotment & digital verification ledger.",
    is_enabled: true,
    sync_frequency: "realtime",
    api_route: "/api/v4/student/lifecycle",
    total_records_synced: 4820,
    last_successful_sync_at: "2026-10-22T21:40:00Z",
    created_at: "2026-01-15T09:00:00Z",
  },
  {
    id: "mod-002",
    module_key: "examination_hallticket_results",
    name: "Continuous Evaluation & Transcripts",
    category: "student_lifecycle",
    description: "Controller of Examinations (CoE) grade ledger, DigiLocker push & automated transcript generator.",
    is_enabled: true,
    sync_frequency: "realtime",
    api_route: "/api/v4/exam/coe-results",
    total_records_synced: 12450,
    last_successful_sync_at: "2026-10-22T21:35:00Z",
    created_at: "2026-01-15T09:00:00Z",
  },
  {
    id: "mod-003",
    module_key: "faculty_cas_promotions",
    name: "Faculty HRMS & CAS Promotions",
    category: "hrms_faculty",
    description: "UGC 7th CPC Career Advancement Scheme (CAS) e-Dossier, API score verification & screening minutes.",
    is_enabled: true,
    sync_frequency: "daily",
    api_route: "/api/v4/hrms/cas-scrutiny",
    total_records_synced: 385,
    last_successful_sync_at: "2026-10-22T18:00:00Z",
    created_at: "2026-01-15T09:00:00Z",
  },
  {
    id: "mod-004",
    module_key: "academic_council_governance",
    name: "Academic Council & BoS Governance",
    category: "governance_academics",
    description: "Statutory bodies agenda tracking, Board of Studies resolution dispatch & institutional ordinances.",
    is_enabled: true,
    sync_frequency: "daily",
    api_route: "/api/v4/governance/ordinances",
    total_records_synced: 760,
    last_successful_sync_at: "2026-10-22T19:15:00Z",
    created_at: "2026-01-15T09:00:00Z",
  },
  {
    id: "mod-005",
    module_key: "research_seed_grants",
    name: "Research Grants & IP Portfolio",
    category: "research_development",
    description: "ANRF, SERB, MoE research project monitoring, utilization certificates (UC) & patent filings.",
    is_enabled: true,
    sync_frequency: "biweekly",
    api_route: "/api/v4/research/grants-uc",
    total_records_synced: 290,
    last_successful_sync_at: "2026-10-21T14:30:00Z",
    created_at: "2026-01-15T09:00:00Z",
  },
  {
    id: "mod-006",
    module_key: "gem_procurement_estate",
    name: "Finance, GeM Interop & Estate",
    category: "finance_logistics",
    description: "Government e-Marketplace (GeM) purchase sanction, central asset barcoding & PFMS fund reconciliation.",
    is_enabled: true,
    sync_frequency: "hourly",
    api_route: "/api/v4/finance/gem-pfms",
    total_records_synced: 6420,
    last_successful_sync_at: "2026-10-22T21:10:00Z",
    created_at: "2026-01-15T09:00:00Z",
  },
];

export const MOCK_SAMARTH_SYNC_LOGS: SamarthSyncLog[] = [
  {
    id: "sync-001",
    sync_token: "SAMARTH-SYNC-2026-QW82-1042",
    module_key: "student_admissions_cuet",
    direction: "INBOUND",
    status: "COMPLETED",
    records_processed: 250,
    records_updated: 248,
    records_failed: 2,
    latency_ms: 142,
    payload_checksum: "sha256:0x8f2a11b9c3e47012d98a0c21345bfae18820c7d4",
    initiated_by: "samarth-daemon-worker",
    synced_at: "2026-10-22T21:40:00Z",
    created_at: "2026-10-22T21:40:00Z",
  },
  {
    id: "sync-002",
    sync_token: "SAMARTH-SYNC-2026-MN94-2084",
    module_key: "examination_hallticket_results",
    direction: "OUTBOUND",
    status: "COMPLETED",
    records_processed: 640,
    records_updated: 640,
    records_failed: 0,
    latency_ms: 215,
    payload_checksum: "sha256:0x3c7104b901a8ef83921d7b324ca9574ef99104ad",
    initiated_by: "coe-dispatch-service",
    synced_at: "2026-10-22T21:35:00Z",
    created_at: "2026-10-22T21:35:00Z",
  },
  {
    id: "sync-003",
    sync_token: "SAMARTH-SYNC-2026-PL17-3091",
    module_key: "faculty_cas_promotions",
    direction: "BIDIRECTIONAL",
    status: "COMPLETED",
    records_processed: 42,
    records_updated: 42,
    records_failed: 0,
    latency_ms: 180,
    payload_checksum: "sha256:0x6b49e21f7c001a483e028b12f45812a02e77b941",
    initiated_by: "iqac-cas-evaluator",
    synced_at: "2026-10-22T18:00:00Z",
    created_at: "2026-10-22T18:00:00Z",
  },
  {
    id: "sync-004",
    sync_token: "SAMARTH-SYNC-2026-ZX55-4128",
    module_key: "gem_procurement_estate",
    direction: "INBOUND",
    status: "COMPLETED",
    records_processed: 120,
    records_updated: 119,
    records_failed: 1,
    latency_ms: 260,
    payload_checksum: "sha256:0xaa4819d4b0032e185f471b659c8401ee43a910bf",
    initiated_by: "gem-pfms-poller",
    synced_at: "2026-10-22T21:10:00Z",
    created_at: "2026-10-22T21:10:00Z",
  },
  {
    id: "sync-005",
    sync_token: "SAMARTH-SYNC-2026-TR88-5192",
    module_key: "research_seed_grants",
    direction: "OUTBOUND",
    status: "COMPLETED",
    records_processed: 35,
    records_updated: 35,
    records_failed: 0,
    latency_ms: 195,
    payload_checksum: "sha256:0x7e120d918bca4401fe39810a44cb9128f773612d",
    initiated_by: "dean-rd-portal",
    synced_at: "2026-10-21T14:30:00Z",
    created_at: "2026-10-21T14:30:00Z",
  },
];

export const MOCK_SAMARTH_CAS_APPLICATIONS: SamarthCasApplication[] = [
  {
    id: "cas-001",
    cas_token: "SAMARTH-CAS-2026-K921-7140",
    faculty_name: "Dr. Arvind R. Kulkarni",
    faculty_email: "arvind.kulkarni@campuslens.edu",
    department: "Computer Science & Engineering",
    current_designation: "Associate Professor",
    current_stage: "Stage 4 (Associate Prof)",
    target_stage: "Stage 5 (Professor)",
    api_score_claimed: 142.5,
    api_score_verified: 138.0,
    publications_count: 24,
    research_projects_count: 5,
    status: "COMMITTEE_APPROVED",
    scrutiny_notes: "Recommended unanimously by Selection Committee with 138.0 validated API units.",
    gazette_notification_number: "SAMARTH-GAZ-2026-EDU-092",
    submission_date: "2026-08-15",
    created_at: "2026-08-15T10:00:00Z",
  },
  {
    id: "cas-002",
    cas_token: "SAMARTH-CAS-2026-B441-8201",
    faculty_name: "Dr. Meenakshi S. Sundaram",
    faculty_email: "m.sundaram@campuslens.edu",
    department: "Electrical & Electronics Engineering",
    current_designation: "Assistant Professor Senior",
    current_stage: "Stage 2 (Assistant Prof Senior)",
    target_stage: "Stage 3 (Assistant Prof Selection Grade)",
    api_score_claimed: 96.0,
    api_score_verified: 94.5,
    publications_count: 14,
    research_projects_count: 2,
    status: "GAZETTED",
    scrutiny_notes: "Formally notified in university gazette order after Syndicate approval.",
    gazette_notification_number: "SAMARTH-GAZ-2026-EDU-081",
    submission_date: "2026-07-20",
    created_at: "2026-07-20T09:30:00Z",
  },
  {
    id: "cas-003",
    cas_token: "SAMARTH-CAS-2026-C119-9302",
    faculty_name: "Dr. Rajesh K. Varma",
    faculty_email: "rajesh.varma@campuslens.edu",
    department: "Mechanical & Mechatronics Engineering",
    current_designation: "Assistant Professor",
    current_stage: "Stage 1 (Assistant Prof)",
    target_stage: "Stage 2 (Assistant Prof Senior)",
    api_score_claimed: 82.0,
    api_score_verified: 79.0,
    publications_count: 9,
    research_projects_count: 1,
    status: "UNDER_SCRUTINY",
    scrutiny_notes: "Internal IQAC verification completed. Awaiting external referee evaluations.",
    submission_date: "2026-09-10",
    created_at: "2026-09-10T11:00:00Z",
  },
  {
    id: "cas-004",
    cas_token: "SAMARTH-CAS-2026-F672-4015",
    faculty_name: "Dr. Sunita Banerjee",
    faculty_email: "sunita.banerjee@campuslens.edu",
    department: "Applied Sciences & Nanotechnology",
    current_designation: "Associate Professor",
    current_stage: "Stage 4 (Associate Prof)",
    target_stage: "Stage 5 (Professor)",
    api_score_claimed: 155.0,
    api_score_verified: 151.0,
    publications_count: 31,
    research_projects_count: 6,
    status: "SUBMITTED",
    scrutiny_notes: "Dossier uploaded with 10 best research publications and patent grant certificates.",
    submission_date: "2026-10-05",
    created_at: "2026-10-05T14:20:00Z",
  },
];

export const MOCK_SAMARTH_STUDENT_ONBOARDINGS: SamarthStudentOnboarding[] = [
  {
    id: "stu-001",
    onboarding_token: "SAMARTH-STU-2026-H102-1101",
    student_name: "Aaditya Vikramaditya Sharma",
    student_email: "aaditya.sharma@campuslens.edu",
    enrollment_number: "2026-BTECH-CSE-001",
    apaar_id: "APAAR-8812-4019-2026",
    program_name: "B.Tech in Artificial Intelligence & Data Systems",
    admission_quota: "State Merit (Cap Round 1)",
    academic_year: "2026-2027",
    verification_status: "VERIFIED",
    fee_clearance_status: "CLEARED",
    digilocker_verified: true,
    samarth_sso_linked: true,
    created_at: "2026-07-28T10:00:00Z",
  },
  {
    id: "stu-002",
    onboarding_token: "SAMARTH-STU-2026-J204-2202",
    student_name: "Ananya R. Deshmukh",
    student_email: "ananya.deshmukh@campuslens.edu",
    enrollment_number: "2026-BTECH-ECE-044",
    apaar_id: "APAAR-7731-9024-2026",
    program_name: "B.Tech in Electronics & VLSI Systems",
    admission_quota: "All India JEE Main Quota",
    academic_year: "2026-2027",
    verification_status: "VERIFIED",
    fee_clearance_status: "CLEARED",
    digilocker_verified: true,
    samarth_sso_linked: true,
    created_at: "2026-07-29T11:30:00Z",
  },
  {
    id: "stu-003",
    onboarding_token: "SAMARTH-STU-2026-K309-3303",
    student_name: "Rohan Siddharth Mehta",
    student_email: "rohan.mehta@campuslens.edu",
    enrollment_number: "2026-MTECH-CYB-012",
    apaar_id: "APAAR-6649-1102-2026",
    program_name: "M.Tech in Cybersecurity & Defense Architecture",
    admission_quota: "GATE Merit Fellowship",
    academic_year: "2026-2027",
    verification_status: "VERIFIED",
    fee_clearance_status: "CLEARED",
    digilocker_verified: true,
    samarth_sso_linked: true,
    created_at: "2026-08-01T14:15:00Z",
  },
  {
    id: "stu-004",
    onboarding_token: "SAMARTH-STU-2026-M411-4404",
    student_name: "Tanya Jennifer D'Souza",
    student_email: "tanya.dsouza@campuslens.edu",
    enrollment_number: "2026-BTECH-MEC-028",
    apaar_id: "APAAR-5521-8890-2026",
    program_name: "B.Tech in Robotics & Autonomous Systems",
    admission_quota: "Institutional Endowment Merit",
    academic_year: "2026-2027",
    verification_status: "IN_REVIEW",
    fee_clearance_status: "PARTIAL",
    digilocker_verified: true,
    samarth_sso_linked: true,
    created_at: "2026-08-05T16:00:00Z",
  },
  {
    id: "stu-005",
    onboarding_token: "SAMARTH-STU-2026-P522-5505",
    student_name: "Karan Preet Singh",
    student_email: "karan.singh@campuslens.edu",
    enrollment_number: "2026-BTECH-CIV-019",
    apaar_id: "APAAR-4410-6721-2026",
    program_name: "B.Tech in Sustainable Smart Infrastructure",
    admission_quota: "Sports & Cultural Merit",
    academic_year: "2026-2027",
    verification_status: "VERIFIED",
    fee_clearance_status: "CLEARED",
    digilocker_verified: true,
    samarth_sso_linked: true,
    created_at: "2026-08-08T09:45:00Z",
  },
];

// ==========================================
// In-Memory Stateful Store
// ==========================================

let samarthInstance = { ...MOCK_SAMARTH_INSTANCE };
let samarthModules = [...MOCK_SAMARTH_MODULES];
let samarthSyncLogs = [...MOCK_SAMARTH_SYNC_LOGS];
let samarthCasApplications = [...MOCK_SAMARTH_CAS_APPLICATIONS];
let samarthStudentOnboardings = [...MOCK_SAMARTH_STUDENT_ONBOARDINGS];

// ==========================================
// Calculators & Telemetry
// ==========================================

export function calculateErpSyncSuccessRate(logs: SamarthSyncLog[] = samarthSyncLogs): number {
  if (logs.length === 0) return 100;
  const completed = logs.filter((l) => l.status === "COMPLETED").length;
  return Number(((completed / logs.length) * 100).toFixed(1));
}

export function calculateCasApprovalRate(applications: SamarthCasApplication[] = samarthCasApplications): number {
  if (applications.length === 0) return 0;
  const approved = applications.filter(
    (a) => a.status === "COMMITTEE_APPROVED" || a.status === "GAZETTED"
  ).length;
  return Number(((approved / applications.length) * 100).toFixed(1));
}

export function calculateActiveModulesCoverage(modules: SamarthModule[] = samarthModules): number {
  if (modules.length === 0) return 0;
  const active = modules.filter((m) => m.is_enabled).length;
  return Number(((active / modules.length) * 100).toFixed(1));
}

export function calculateStudentOnboardingRate(onboardings: SamarthStudentOnboarding[] = samarthStudentOnboardings): number {
  if (onboardings.length === 0) return 0;
  const verified = onboardings.filter((o) => o.verification_status === "VERIFIED").length;
  return Number(((verified / onboardings.length) * 100).toFixed(1));
}

// ==========================================
// Store Operations
// ==========================================

export function getSamarthInstance(): SamarthInstance {
  return samarthInstance;
}

export function updateSamarthInstance(updates: Partial<SamarthInstance>): SamarthInstance {
  samarthInstance = {
    ...samarthInstance,
    ...updates,
    updated_at: new Date().toISOString(),
  };
  return samarthInstance;
}

export function getSamarthModules(): SamarthModule[] {
  return samarthModules;
}

export function addSamarthModule(moduleData: Omit<SamarthModule, "id" | "created_at" | "updated_at">): SamarthModule {
  const newModule: SamarthModule = {
    ...moduleData,
    id: `mod-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  samarthModules.unshift(newModule);
  return newModule;
}

export function toggleSamarthModule(moduleKey: string): SamarthModule | null {
  const index = samarthModules.findIndex((m) => m.module_key === moduleKey);
  if (index === -1) return null;
  samarthModules[index] = {
    ...samarthModules[index],
    is_enabled: !samarthModules[index].is_enabled,
    updated_at: new Date().toISOString(),
  };
  return samarthModules[index];
}

export function getSamarthSyncLogs(): SamarthSyncLog[] {
  return samarthSyncLogs;
}

export function createSamarthSyncLog(
  data: Partial<SamarthSyncLog> & { module_key: string; records_processed: number }
): SamarthSyncLog {
  const newLog: SamarthSyncLog = {
    id: `sync-${Date.now()}`,
    sync_token: data.sync_token || generateSamarthSyncToken(),
    module_key: data.module_key,
    direction: data.direction || "BIDIRECTIONAL",
    status: data.status || "COMPLETED",
    records_processed: data.records_processed,
    records_updated: data.records_updated ?? data.records_processed,
    records_failed: data.records_failed ?? 0,
    latency_ms: data.latency_ms ?? Math.floor(120 + Math.random() * 150),
    payload_checksum: data.payload_checksum || generateSamarthSecurityHash(),
    initiated_by: data.initiated_by || "samarth-gateway-manual",
    synced_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };
  samarthSyncLogs.unshift(newLog);

  // Update instance sync time
  samarthInstance = {
    ...samarthInstance,
    last_sync_at: newLog.synced_at,
    updated_at: newLog.synced_at,
  };

  return newLog;
}

export function getSamarthCasApplications(): SamarthCasApplication[] {
  return samarthCasApplications;
}

export function createSamarthCasApplication(
  data: Omit<SamarthCasApplication, "id" | "cas_token" | "created_at" | "updated_at">
): SamarthCasApplication {
  const newApp: SamarthCasApplication = {
    ...data,
    id: `cas-${Date.now()}`,
    cas_token: generateSamarthCasToken(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  samarthCasApplications.unshift(newApp);
  return newApp;
}

export function updateSamarthCasStatus(
  casToken: string,
  status: SamarthCasStatus,
  notes?: string
): SamarthCasApplication | null {
  const index = samarthCasApplications.findIndex((a) => a.cas_token === casToken);
  if (index === -1) return null;
  samarthCasApplications[index] = {
    ...samarthCasApplications[index],
    status,
    scrutiny_notes: notes || samarthCasApplications[index].scrutiny_notes,
    updated_at: new Date().toISOString(),
  };
  return samarthCasApplications[index];
}

export function getSamarthStudentOnboardings(): SamarthStudentOnboarding[] {
  return samarthStudentOnboardings;
}

export function createSamarthStudentOnboarding(
  data: Omit<SamarthStudentOnboarding, "id" | "onboarding_token" | "created_at" | "updated_at">
): SamarthStudentOnboarding {
  const newStudent: SamarthStudentOnboarding = {
    ...data,
    id: `stu-${Date.now()}`,
    onboarding_token: generateSamarthOnboardingToken(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  samarthStudentOnboardings.unshift(newStudent);
  return newStudent;
}

export function updateSamarthOnboardingStatus(
  token: string,
  verification_status: SamarthOnboardingStatus
): SamarthStudentOnboarding | null {
  const index = samarthStudentOnboardings.findIndex((s) => s.onboarding_token === token);
  if (index === -1) return null;
  samarthStudentOnboardings[index] = {
    ...samarthStudentOnboardings[index],
    verification_status,
    updated_at: new Date().toISOString(),
  };
  return samarthStudentOnboardings[index];
}

export function getSamarthSummaryStats(): SamarthSummaryStats {
  const activeCount = samarthModules.filter((m) => m.is_enabled).length;
  return {
    instanceCode: samarthInstance.instance_code,
    institutionalName: samarthInstance.institutional_name,
    samarthVersion: samarthInstance.samarth_version,
    deploymentStatus: samarthInstance.deployment_status,
    healthScorePct: samarthInstance.health_score,
    activeModulesCount: activeCount,
    totalModulesCount: samarthModules.length,
    totalSyncEventsToday: samarthSyncLogs.length,
    syncSuccessRatePct: calculateErpSyncSuccessRate(),
    casTotalApplications: samarthCasApplications.length,
    casApprovedRatePct: calculateCasApprovalRate(),
    studentOnboardingsTotal: samarthStudentOnboardings.length,
    studentVerifiedRatePct: calculateStudentOnboardingRate(),
    instance: samarthInstance,
    modules: samarthModules,
    syncLogs: samarthSyncLogs,
    casApplications: samarthCasApplications,
    studentOnboardings: samarthStudentOnboardings,
  };
}
