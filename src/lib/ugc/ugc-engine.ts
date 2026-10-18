/**
 * Phase 53: Smart Campus UGC Autonomous College Governance, Statutory Academic Council & 2(f)/12(B) Regulations Engine
 * In-memory stateful store, token generators, seed data, and compliance metrics.
 */

import {
  UgcStatutoryCouncil,
  UgcCurriculumRevision,
  UgcAutonomyReview,
  UgcGrantUtilization,
  UgcComplianceDossier,
  UgcComplianceSummaryStats,
  UgcCouncilType,
  UgcCurriculumRevisionType,
  UgcRevisionStatus,
  UgcSectionStatus,
  UgcInspectionOutcome,
  UgcUcStatus,
  UgcDossierType,
} from "@/types";

// ==========================================
// Cryptographic & Format Generators
// ==========================================

export function generateUgcResolutionToken(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  const hex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `UGC-AC-RES-2026-${hex}-${num}`;
}

export function generateCurriculumDocketToken(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  const hex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `UGC-CURR-2026-${hex}-${num}`;
}

export function generateAutonomyReviewToken(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  const hex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `UGC-REV-2026-${hex}-${num}`;
}

export function generateUcCertificateToken(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  const hex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `UGC-UC-2026-${hex}-${num}`;
}

export function generateUgcDigitalSealHash(): string {
  const chars = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 40; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

// ==========================================
// Seed Data
// ==========================================

const INITIAL_COUNCILS: UgcStatutoryCouncil[] = [
  {
    id: "council-001",
    council_type: "governing_body",
    council_name: "Apex Institute Governing Body (Apex Statutory Council)",
    chairperson: "Dr. R. K. Deshmukh (Chancellor & Industrialist)",
    university_nominee: "Prof. S. N. Banerjee (Dean Faculty of Tech, Affiliating Univ)",
    ugc_nominee: "Dr. K. V. Ramanathan (Former Vice-Chancellor & UGC Nominee)",
    state_gov_nominee: "Joint Director (Technical Education, State Govt)",
    total_members: 15,
    tenure_period: "2024-2027 (3 Years)",
    last_meeting_date: "2026-06-18",
    next_meeting_date: "2026-11-25",
    resolution_token: "UGC-GB-RES-2026-A101-9481",
    compliance_status: "compliant",
    created_at: "2024-06-01T10:00:00Z",
    updated_at: "2026-06-18T16:00:00Z",
  },
  {
    id: "council-002",
    council_type: "academic_council",
    council_name: "Apex Autonomous Academic Council (AAC)",
    chairperson: "Prof. Dr. Vikram S. Mehta (Principal & Chairperson AAC)",
    university_nominee: "Dr. Anita Joshi (Senior Professor, Computer Engg)",
    ugc_nominee: "Prof. M. K. Narayanan (Eminent Academician Nominee)",
    state_gov_nominee: "Regional Officer (DTE State Directorate)",
    total_members: 24,
    tenure_period: "2024-2026 (2 Years)",
    last_meeting_date: "2026-07-22",
    next_meeting_date: "2026-12-10",
    resolution_token: "UGC-AC-RES-2026-B204-7732",
    compliance_status: "compliant",
    created_at: "2024-06-01T10:00:00Z",
    updated_at: "2026-07-22T15:30:00Z",
  },
  {
    id: "council-003",
    council_type: "board_of_studies",
    council_name: "Board of Studies (BoS) — Computer Science & AI Cluster",
    chairperson: "Dr. Arundhati Roy (Head of Department, CSE)",
    university_nominee: "Dr. Rajiv Singhania (Univ Subject Expert CSE)",
    ugc_nominee: "Prof. T. G. Sitharam (Distinguished Adjunct Expert)",
    state_gov_nominee: "Senior Technical Officer (Govt IT Department)",
    total_members: 12,
    tenure_period: "2025-2028 (3 Years)",
    last_meeting_date: "2026-08-14",
    next_meeting_date: "2026-11-30",
    resolution_token: "UGC-BOS-RES-2026-C309-5519",
    compliance_status: "compliant",
    created_at: "2025-01-10T10:00:00Z",
    updated_at: "2026-08-14T14:00:00Z",
  },
  {
    id: "council-004",
    council_type: "finance_committee",
    council_name: "Statutory Standing Finance Committee (SFC)",
    chairperson: "Prof. Dr. Vikram S. Mehta (Principal & Head of Institution)",
    university_nominee: "Finance Officer (Affiliating State Technical Univ)",
    ugc_nominee: "Chartered Accountant UGC Audit Nominee",
    state_gov_nominee: "Treasury Accounts Officer (Govt Dept)",
    total_members: 7,
    tenure_period: "2024-2027 (3 Years)",
    last_meeting_date: "2026-05-30",
    next_meeting_date: "2026-11-15",
    resolution_token: "UGC-FC-RES-2026-D412-3321",
    compliance_status: "compliant",
    created_at: "2024-06-01T10:00:00Z",
    updated_at: "2026-05-30T16:00:00Z",
  },
  {
    id: "council-005",
    council_type: "examination_cell",
    council_name: "Autonomous Examination & Evaluation Cell",
    chairperson: "Prof. H. R. Sharma (Controller of Examinations — CoE)",
    university_nominee: "CoE Representative (Affiliating Univ)",
    ugc_nominee: "Evaluation Specialist (Autonomous Norms)",
    state_gov_nominee: "Examinations Observer (State Technical Board)",
    total_members: 9,
    tenure_period: "2024-2027 (3 Years)",
    last_meeting_date: "2026-09-02",
    next_meeting_date: "2026-12-05",
    resolution_token: "UGC-COE-RES-2026-E518-8810",
    compliance_status: "compliant",
    created_at: "2024-06-01T10:00:00Z",
    updated_at: "2026-09-02T11:00:00Z",
  },
];

const INITIAL_CURRICULUM_REVISIONS: UgcCurriculumRevision[] = [
  {
    id: "curr-001",
    program_code: "BTECH-CSE",
    program_name: "B.Tech Computer Science & Engineering",
    department: "Computer Science & Engineering",
    regulation_year: "R-2026 CBCS Autonomous Regulations",
    revision_type: "full_curriculum_revision",
    bos_approval_date: "2026-06-12",
    academic_council_approval_date: "2026-07-22",
    total_credits: 160,
    industry_component_pct: 32.5,
    status: "approved_ratified",
    curriculum_docket_token: "UGC-CURR-2026-CSE-9901",
    created_at: "2026-06-12T10:00:00Z",
  },
  {
    id: "curr-002",
    program_code: "BTECH-AI-DS",
    program_name: "B.Tech Artificial Intelligence & Data Science",
    department: "Data Science & AI",
    regulation_year: "R-2026 CBCS Autonomous Regulations",
    revision_type: "nep_multidisciplinary_minor",
    bos_approval_date: "2026-06-15",
    academic_council_approval_date: "2026-07-22",
    total_credits: 164,
    industry_component_pct: 38.0,
    status: "approved_ratified",
    curriculum_docket_token: "UGC-CURR-2026-AIDS-4412",
    created_at: "2026-06-15T10:00:00Z",
  },
  {
    id: "curr-003",
    program_code: "BTECH-ECE",
    program_name: "B.Tech Electronics & Communication Engineering",
    department: "Electronics & Communication",
    regulation_year: "R-2026 CBCS Autonomous Regulations",
    revision_type: "industry_internship_embed",
    bos_approval_date: "2026-07-02",
    academic_council_approval_date: "2026-07-22",
    total_credits: 160,
    industry_component_pct: 28.0,
    status: "approved_ratified",
    curriculum_docket_token: "UGC-CURR-2026-ECE-3319",
    created_at: "2026-07-02T10:00:00Z",
  },
  {
    id: "curr-004",
    program_code: "MTECH-VLSI",
    program_name: "M.Tech VLSI & Embedded Systems Design",
    department: "Electronics & Communication",
    regulation_year: "R-2026 PG Autonomous Framework",
    revision_type: "elective_basket_update",
    bos_approval_date: "2026-08-10",
    academic_council_approval_date: "2026-08-25",
    total_credits: 68,
    industry_component_pct: 42.0,
    status: "approved_ratified",
    curriculum_docket_token: "UGC-CURR-2026-VLSI-7782",
    created_at: "2026-08-10T10:00:00Z",
  },
];

const INITIAL_AUTONOMY_REVIEWS: UgcAutonomyReview[] = [
  {
    id: "rev-001",
    autonomy_cycle: "Cycle III — 10-Year Autonomous Extension (2022-2032)",
    ugc_conferment_letter_no: "UGC/F.22-1/2022(AC)-APEX-992",
    ugc_section_status: "2f_and_12b_recognized",
    validity_start_year: 2022,
    validity_end_year: 2032,
    expert_committee_visit_date: "2022-04-18",
    inspection_outcome: "unconditional_extension",
    annual_compliance_report_token: "UGC-ACR-2026-CY3-1189",
    naac_score_multiplier: 3.65,
    autonomy_dossier_hash: "0x892a4bc089df11e892cfae89012356789abcdef0",
    created_at: "2022-05-01T10:00:00Z",
  },
  {
    id: "rev-002",
    autonomy_cycle: "Mid-Term Autonomy Review & NEP 2020 Compliance Evaluation",
    ugc_conferment_letter_no: "UGC/RO-W/2026/NEP-AUTONOMY-302",
    ugc_section_status: "2f_and_12b_recognized",
    validity_start_year: 2026,
    validity_end_year: 2032,
    expert_committee_visit_date: "2026-02-14",
    inspection_outcome: "extension_recommended",
    annual_compliance_report_token: "UGC-ACR-2026-MID-4402",
    naac_score_multiplier: 3.65,
    autonomy_dossier_hash: "0xfa12948c201385ef9802bc345678912345abcdef",
    created_at: "2026-03-01T10:00:00Z",
  },
];

const INITIAL_GRANTS: UgcGrantUtilization[] = [
  {
    id: "grant-001",
    grant_scheme: "UGC Autonomous Colleges Development Grant (Merged Schemes)",
    financial_year: "2026-27",
    sanctioned_amount_inr: 3000000,
    released_amount_inr: 2500000,
    utilized_amount_inr: 2350000,
    uc_status: "uc_audited_submitted",
    chartered_accountant_audit_no: "UDIN-2026-881290-CA-MUM",
    uc_certificate_token: "UGC-UC-2026-DEV-8891",
    created_at: "2026-04-10T10:00:00Z",
  },
  {
    id: "grant-002",
    grant_scheme: "UGC Examination Reforms & Digital Valuation Infrastructure Grant",
    financial_year: "2026-27",
    sanctioned_amount_inr: 2000000,
    released_amount_inr: 2000000,
    utilized_amount_inr: 1820000,
    uc_status: "uc_audited_submitted",
    chartered_accountant_audit_no: "UDIN-2026-773194-CA-MUM",
    uc_certificate_token: "UGC-UC-2026-EXAM-4410",
    created_at: "2026-04-10T10:00:00Z",
  },
  {
    id: "grant-003",
    grant_scheme: "UGC Faculty Minor Research & Curriculum Innovation Seed Fund",
    financial_year: "2026-27",
    sanctioned_amount_inr: 1500000,
    released_amount_inr: 1200000,
    utilized_amount_inr: 980000,
    uc_status: "partially_utilized",
    chartered_accountant_audit_no: "UDIN-2026-552011-CA-MUM",
    uc_certificate_token: "UGC-UC-2026-RES-2290",
    created_at: "2026-05-15T10:00:00Z",
  },
  {
    id: "grant-004",
    grant_scheme: "UGC Library Automation, E-Resources & Institutional Repository",
    financial_year: "2026-27",
    sanctioned_amount_inr: 1000000,
    released_amount_inr: 1000000,
    utilized_amount_inr: 960000,
    uc_status: "uc_audited_submitted",
    chartered_accountant_audit_no: "UDIN-2026-339180-CA-MUM",
    uc_certificate_token: "UGC-UC-2026-LIB-1104",
    created_at: "2026-05-15T10:00:00Z",
  },
];

const INITIAL_DOSSIERS: UgcComplianceDossier[] = [
  {
    id: "dos-001",
    dossier_type: "annual_autonomy_return",
    title: "Annual Autonomous Performance & Compliance Report (Academic Year 2025-26)",
    academic_year: "2025-26",
    submission_date: "2026-08-30",
    dossier_token: "UGC-DOS-2026-AR-8819",
    approval_status: "verified_compliant",
    digital_seal_hash: "0x89ab12cd34ef560123456789abcdef0123456789",
    created_at: "2026-08-30T11:00:00Z",
  },
  {
    id: "dos-002",
    dossier_type: "governing_body_minutes",
    title: "Statutory Governing Body Formal Minutes of Meeting & Policy Ratifications",
    academic_year: "2026-27",
    submission_date: "2026-06-25",
    dossier_token: "UGC-DOS-2026-GBM-3321",
    approval_status: "governing_body_approved",
    digital_seal_hash: "0x1234567890abcdef1234567890abcdef12345678",
    created_at: "2026-06-25T14:30:00Z",
  },
  {
    id: "dos-003",
    dossier_type: "ugc_2f_12b_certificate",
    title: "Permanent Recognition Certificate under Section 2(f) & 12(B) of UGC Act, 1956",
    academic_year: "Permanent",
    submission_date: "2026-01-10",
    dossier_token: "UGC-DOS-2026-2F12B-0012",
    approval_status: "verified_compliant",
    digital_seal_hash: "0xabcdef0123456789abcdef0123456789abcdef01",
    created_at: "2026-01-10T09:00:00Z",
  },
];

// ==========================================
// Stateful UGC Autonomous Store
// ==========================================

export class UgcAutonomousStore {
  private councils: UgcStatutoryCouncil[] = [...INITIAL_COUNCILS];
  private curriculumRevisions: UgcCurriculumRevision[] = [...INITIAL_CURRICULUM_REVISIONS];
  private autonomyReviews: UgcAutonomyReview[] = [...INITIAL_AUTONOMY_REVIEWS];
  private grants: UgcGrantUtilization[] = [...INITIAL_GRANTS];
  private dossiers: UgcComplianceDossier[] = [...INITIAL_DOSSIERS];

  // Councils
  public getCouncils(): UgcStatutoryCouncil[] {
    return [...this.councils];
  }

  public scheduleCouncilMeeting(input: {
    councilId: string;
    nextMeetingDate: string;
    agendaTitle?: string;
  }): UgcStatutoryCouncil | null {
    const council = this.councils.find((c) => c.id === input.councilId);
    if (!council) return null;
    council.last_meeting_date = new Date().toISOString().split("T")[0];
    council.next_meeting_date = input.nextMeetingDate;
    council.resolution_token = generateUgcResolutionToken();
    council.updated_at = new Date().toISOString();
    return { ...council };
  }

  public updateCouncilCompliance(
    id: string,
    status: "active" | "term_renewal_due" | "compliant"
  ): UgcStatutoryCouncil | null {
    const council = this.councils.find((c) => c.id === id);
    if (!council) return null;
    council.compliance_status = status;
    council.updated_at = new Date().toISOString();
    return { ...council };
  }

  // Curriculum Revisions
  public getCurriculumRevisions(): UgcCurriculumRevision[] {
    return [...this.curriculumRevisions];
  }

  public submitCurriculumProposal(input: {
    programCode: string;
    programName: string;
    department: string;
    revisionType: UgcCurriculumRevisionType;
    totalCredits: number;
    industryComponentPct: number;
    regulationYear?: string;
  }): UgcCurriculumRevision {
    const today = new Date().toISOString().split("T")[0];
    const newRevision: UgcCurriculumRevision = {
      id: `curr-${Date.now()}`,
      program_code: input.programCode,
      program_name: input.programName,
      department: input.department,
      regulation_year: input.regulationYear || "R-2026 CBCS Autonomous Regulations",
      revision_type: input.revisionType,
      bos_approval_date: today,
      academic_council_approval_date: today,
      total_credits: input.totalCredits,
      industry_component_pct: input.industryComponentPct,
      status: "approved_ratified",
      curriculum_docket_token: generateCurriculumDocketToken(),
      created_at: new Date().toISOString(),
    };
    this.curriculumRevisions.unshift(newRevision);
    return newRevision;
  }

  public updateCurriculumStatus(id: string, status: UgcRevisionStatus): UgcCurriculumRevision | null {
    const item = this.curriculumRevisions.find((r) => r.id === id);
    if (!item) return null;
    item.status = status;
    return { ...item };
  }

  // Autonomy Reviews
  public getAutonomyReviews(): UgcAutonomyReview[] {
    return [...this.autonomyReviews];
  }

  public addAutonomyReview(input: Omit<UgcAutonomyReview, "id" | "created_at">): UgcAutonomyReview {
    const review: UgcAutonomyReview = {
      id: `rev-${Date.now()}`,
      ...input,
      created_at: new Date().toISOString(),
    };
    this.autonomyReviews.unshift(review);
    return review;
  }

  // Grants Utilization
  public getGrantsUtilization(): UgcGrantUtilization[] {
    return [...this.grants];
  }

  public addGrantRecord(input: {
    grantScheme: string;
    financialYear: string;
    sanctionedAmountInr: number;
    releasedAmountInr: number;
    utilizedAmountInr: number;
    charteredAccountantAuditNo: string;
    ucStatus?: UgcUcStatus;
  }): UgcGrantUtilization {
    const grant: UgcGrantUtilization = {
      id: `grant-${Date.now()}`,
      grant_scheme: input.grantScheme,
      financial_year: input.financialYear,
      sanctioned_amount_inr: input.sanctionedAmountInr,
      released_amount_inr: input.releasedAmountInr,
      utilized_amount_inr: input.utilizedAmountInr,
      uc_status: input.ucStatus || "uc_audited_submitted",
      chartered_accountant_audit_no: input.charteredAccountantAuditNo,
      uc_certificate_token: generateUcCertificateToken(),
      created_at: new Date().toISOString(),
    };
    this.grants.unshift(grant);
    return grant;
  }

  // Dossiers
  public getDossiers(): UgcComplianceDossier[] {
    return [...this.dossiers];
  }

  public submitComplianceDossier(input: {
    dossierType: UgcDossierType;
    title: string;
    academicYear?: string;
  }): UgcComplianceDossier {
    const dossier: UgcComplianceDossier = {
      id: `dos-${Date.now()}`,
      dossier_type: input.dossierType,
      title: input.title,
      academic_year: input.academicYear || "2026-27",
      submission_date: new Date().toISOString().split("T")[0],
      dossier_token: generateCurriculumDocketToken().replace("CURR", "DOS"),
      approval_status: "verified_compliant",
      digital_seal_hash: generateUgcDigitalSealHash(),
      created_at: new Date().toISOString(),
    };
    this.dossiers.unshift(dossier);
    return dossier;
  }

  // Summary Stats
  public getComplianceSummaryStats(): UgcComplianceSummaryStats {
    const totalSanctioned = this.grants.reduce((sum, g) => sum + g.sanctioned_amount_inr, 0);
    const totalUtilized = this.grants.reduce((sum, g) => sum + g.utilized_amount_inr, 0);
    const utilizationPct = totalSanctioned > 0 ? (totalUtilized / totalSanctioned) * 100 : 0;

    return {
      autonomyCycle: "Cycle III (2022-2032)",
      ugcSectionStatus: "2f_and_12b_recognized",
      validityRange: "2022 - 2032 (10-Year Autonomous Extension)",
      totalCouncils: this.councils.length,
      compliantCouncils: this.councils.filter((c) => c.compliance_status === "compliant").length,
      totalRevisions: this.curriculumRevisions.length,
      ratifiedRevisions: this.curriculumRevisions.filter((r) => r.status === "approved_ratified").length,
      totalSanctionedGrantsInr: totalSanctioned,
      totalUtilizedGrantsInr: totalUtilized,
      grantsUtilizationPct: Math.round(utilizationPct * 10) / 10,
      councils: this.getCouncils(),
      curriculumRevisions: this.getCurriculumRevisions(),
      autonomyReviews: this.getAutonomyReviews(),
      grants: this.getGrantsUtilization(),
      dossiers: this.getDossiers(),
    };
  }
}

// Global Singleton
export const ugcAutonomousStore = new UgcAutonomousStore();
