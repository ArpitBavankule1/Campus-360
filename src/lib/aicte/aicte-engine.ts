/**
 * Phase 52: Smart Campus AICTE Approval Process Handbook (APH) & Statutory Regulatory Compliance Engine
 * In-memory stateful store, deficiency index calculator, token generators, and APH compliance checks.
 */

import {
  AicteApprovedProgram,
  AicteInfrastructureNorm,
  AicteCadreFsrMetric,
  AicteStatutoryCommittee,
  AicteEoaDossier,
  AicteComplianceSummaryStats,
  AicteProgramLevel,
  AicteEoaStatus,
  AicteAccreditationStatus,
  AicteRoomType,
  AicteCommitteeType,
  AicteInspectionStatus,
} from "@/types";

// ==========================================
// Cryptographic & Format Generators
// ==========================================

export function generateAicteApplicationNumber(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `AICTE-EOA-2026-${num}`;
}

export function generateEoaDocketToken(): string {
  const hex = Math.random().toString(36).substring(2, 8).toUpperCase();
  const num = Math.floor(1000 + Math.random() * 9000);
  return `CL-AICTE-EOA-2026-${hex}-${num}`;
}

export function generateMandatoryDisclosureToken(): string {
  const hex = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CL-AICTE-MD-2026-${hex}`;
}

export function generateEvcAuditToken(): string {
  const hex = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CL-AICTE-EVC-2026-${hex}`;
}

export function generateDigitalSignatureHash(): string {
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

const INITIAL_PROGRAMS: AicteApprovedProgram[] = [
  {
    id: "prog-001",
    program_name: "B.Tech Computer Science & Engineering",
    program_level: "undergraduate",
    department: "Computer Science & Engineering",
    approved_intake: 240,
    applied_intake: 240,
    eoa_status: "approved",
    approval_academic_year: "2026-27",
    accreditation_status: "tier_1_accredited",
    nri_quota_approved: true,
    pio_fn_quota_approved: true,
    tfw_quota_approved: true,
    created_at: "2024-05-10T10:00:00Z",
    updated_at: "2026-04-15T12:00:00Z",
  },
  {
    id: "prog-002",
    program_name: "B.Tech Electronics & Communication Engineering",
    program_level: "undergraduate",
    department: "Electronics & Communication",
    approved_intake: 180,
    applied_intake: 180,
    eoa_status: "approved",
    approval_academic_year: "2026-27",
    accreditation_status: "tier_1_accredited",
    nri_quota_approved: true,
    pio_fn_quota_approved: true,
    tfw_quota_approved: true,
    created_at: "2024-05-10T10:00:00Z",
    updated_at: "2026-04-15T12:00:00Z",
  },
  {
    id: "prog-003",
    program_name: "B.Tech Artificial Intelligence & Data Science",
    program_level: "undergraduate",
    department: "Data Science & AI",
    approved_intake: 180,
    applied_intake: 180,
    eoa_status: "approved",
    approval_academic_year: "2026-27",
    accreditation_status: "accredited",
    nri_quota_approved: true,
    pio_fn_quota_approved: true,
    tfw_quota_approved: true,
    created_at: "2024-05-10T10:00:00Z",
    updated_at: "2026-04-15T12:00:00Z",
  },
  {
    id: "prog-004",
    program_name: "B.Tech Information Technology",
    program_level: "undergraduate",
    department: "Information Technology",
    approved_intake: 180,
    applied_intake: 180,
    eoa_status: "approved",
    approval_academic_year: "2026-27",
    accreditation_status: "tier_1_accredited",
    nri_quota_approved: true,
    pio_fn_quota_approved: false,
    tfw_quota_approved: true,
    created_at: "2024-05-10T10:00:00Z",
    updated_at: "2026-04-15T12:00:00Z",
  },
  {
    id: "prog-005",
    program_name: "B.Tech Mechanical Engineering",
    program_level: "undergraduate",
    department: "Mechanical Engineering",
    approved_intake: 120,
    applied_intake: 120,
    eoa_status: "approved",
    approval_academic_year: "2026-27",
    accreditation_status: "tier_1_accredited",
    nri_quota_approved: false,
    pio_fn_quota_approved: false,
    tfw_quota_approved: true,
    created_at: "2024-05-10T10:00:00Z",
    updated_at: "2026-04-15T12:00:00Z",
  },
  {
    id: "prog-006",
    program_name: "M.Tech Cybersecurity & Cloud Architecture",
    program_level: "postgraduate",
    department: "Computer Science & Engineering",
    approved_intake: 30,
    applied_intake: 30,
    eoa_status: "approved",
    approval_academic_year: "2026-27",
    accreditation_status: "eligible",
    nri_quota_approved: false,
    pio_fn_quota_approved: false,
    tfw_quota_approved: false,
    created_at: "2024-05-10T10:00:00Z",
    updated_at: "2026-04-15T12:00:00Z",
  },
  {
    id: "prog-007",
    program_name: "M.Tech VLSI Design & Embedded Systems",
    program_level: "postgraduate",
    department: "Electronics & Communication",
    approved_intake: 30,
    applied_intake: 30,
    eoa_status: "approved",
    approval_academic_year: "2026-27",
    accreditation_status: "eligible",
    nri_quota_approved: false,
    pio_fn_quota_approved: false,
    tfw_quota_approved: false,
    created_at: "2024-05-10T10:00:00Z",
    updated_at: "2026-04-15T12:00:00Z",
  },
  {
    id: "prog-008",
    program_name: "Master of Business Administration (Tech Management)",
    program_level: "postgraduate",
    department: "Management Studies",
    approved_intake: 120,
    applied_intake: 120,
    eoa_status: "approved",
    approval_academic_year: "2026-27",
    accreditation_status: "accredited",
    nri_quota_approved: true,
    pio_fn_quota_approved: true,
    tfw_quota_approved: true,
    created_at: "2024-05-10T10:00:00Z",
    updated_at: "2026-04-15T12:00:00Z",
  },
  {
    id: "prog-009",
    program_name: "Master of Computer Applications (MCA)",
    program_level: "postgraduate",
    department: "Computer Applications",
    approved_intake: 120,
    applied_intake: 120,
    eoa_status: "approved",
    approval_academic_year: "2026-27",
    accreditation_status: "accredited",
    nri_quota_approved: false,
    pio_fn_quota_approved: false,
    tfw_quota_approved: true,
    created_at: "2024-05-10T10:00:00Z",
    updated_at: "2026-04-15T12:00:00Z",
  },
  {
    id: "prog-010",
    program_name: "Ph.D. in Engineering & Applied Computing",
    program_level: "doctoral",
    department: "Institutional Research Deanery",
    approved_intake: 40,
    applied_intake: 40,
    eoa_status: "approved",
    approval_academic_year: "2026-27",
    accreditation_status: "tier_1_accredited",
    nri_quota_approved: false,
    pio_fn_quota_approved: false,
    tfw_quota_approved: false,
    created_at: "2024-05-10T10:00:00Z",
    updated_at: "2026-04-15T12:00:00Z",
  },
];

const INITIAL_INFRA_NORMS: AicteInfrastructureNorm[] = [
  {
    id: "infra-001",
    room_type: "classroom",
    category_name: "Classrooms & Smart ICT Lecture Halls",
    required_area_sqm: 2772.0,
    available_area_sqm: 3240.0,
    required_count: 42,
    available_count: 48,
    deficiency_percentage: 0.0,
    compliance_status: "compliant",
    audited_by: "AICTE Regional Inspection Directorate",
    created_at: "2026-01-15T09:00:00Z",
  },
  {
    id: "infra-002",
    room_type: "tutorial_room",
    category_name: "Tutorial & Remedial Mentorship Rooms",
    required_area_sqm: 363.0,
    available_area_sqm: 462.0,
    required_count: 11,
    available_count: 14,
    deficiency_percentage: 0.0,
    compliance_status: "compliant",
    audited_by: "AICTE Regional Inspection Directorate",
    created_at: "2026-01-15T09:00:00Z",
  },
  {
    id: "infra-003",
    room_type: "computer_center",
    category_name: "Central Computer Centers & HPC Labs",
    required_area_sqm: 1056.0,
    available_area_sqm: 1480.0,
    required_count: 16,
    available_count: 20,
    deficiency_percentage: 0.0,
    compliance_status: "compliant",
    audited_by: "AICTE Regional Inspection Directorate",
    created_at: "2026-01-15T09:00:00Z",
  },
  {
    id: "infra-004",
    room_type: "laboratory",
    category_name: "Specialized Engineering & Research Labs",
    required_area_sqm: 3564.0,
    available_area_sqm: 4120.0,
    required_count: 54,
    available_count: 58,
    deficiency_percentage: 0.0,
    compliance_status: "compliant",
    audited_by: "AICTE Regional Inspection Directorate",
    created_at: "2026-01-15T09:00:00Z",
  },
  {
    id: "infra-005",
    room_type: "library",
    category_name: "Central Knowledge Commons & Reading Hall",
    required_area_sqm: 800.0,
    available_area_sqm: 1250.0,
    required_count: 1,
    available_count: 1,
    deficiency_percentage: 0.0,
    compliance_status: "compliant",
    audited_by: "AICTE Regional Inspection Directorate",
    created_at: "2026-01-15T09:00:00Z",
  },
  {
    id: "infra-006",
    room_type: "seminar_hall",
    category_name: "Auditoriums & AC Seminar Halls",
    required_area_sqm: 495.0,
    available_area_sqm: 820.0,
    required_count: 3,
    available_count: 4,
    deficiency_percentage: 0.0,
    compliance_status: "compliant",
    audited_by: "AICTE Regional Inspection Directorate",
    created_at: "2026-01-15T09:00:00Z",
  },
  {
    id: "infra-007",
    room_type: "administrative",
    category_name: "Administrative Offices & Faculty Cabins",
    required_area_sqm: 1200.0,
    available_area_sqm: 1640.0,
    required_count: 25,
    available_count: 30,
    deficiency_percentage: 0.0,
    compliance_status: "compliant",
    audited_by: "AICTE Regional Inspection Directorate",
    created_at: "2026-01-15T09:00:00Z",
  },
  {
    id: "infra-008",
    room_type: "amenities",
    category_name: "Student Amenities (Cafeteria, Sports, Infirmary)",
    required_area_sqm: 950.0,
    available_area_sqm: 1420.0,
    required_count: 8,
    available_count: 12,
    deficiency_percentage: 0.0,
    compliance_status: "compliant",
    audited_by: "AICTE Regional Inspection Directorate",
    created_at: "2026-01-15T09:00:00Z",
  },
];

const INITIAL_CADRE_FSR: AicteCadreFsrMetric[] = [
  {
    id: "fsr-001",
    department: "Computer Science & Engineering",
    total_students: 960,
    required_faculty: 64,
    available_faculty: 68,
    fsr_ratio: "1:14.1",
    professors_count: 8,
    assoc_professors_count: 16,
    asst_professors_count: 44,
    phd_faculty_pct: 62.5,
    cadre_ratio_compliant: true,
    created_at: "2026-02-01T10:00:00Z",
  },
  {
    id: "fsr-002",
    department: "Electronics & Communication",
    total_students: 720,
    required_faculty: 48,
    available_faculty: 50,
    fsr_ratio: "1:14.4",
    professors_count: 6,
    assoc_professors_count: 12,
    asst_professors_count: 32,
    phd_faculty_pct: 58.0,
    cadre_ratio_compliant: true,
    created_at: "2026-02-01T10:00:00Z",
  },
  {
    id: "fsr-003",
    department: "Information Technology",
    total_students: 720,
    required_faculty: 48,
    available_faculty: 51,
    fsr_ratio: "1:14.1",
    professors_count: 6,
    assoc_professors_count: 12,
    asst_professors_count: 33,
    phd_faculty_pct: 56.8,
    cadre_ratio_compliant: true,
    created_at: "2026-02-01T10:00:00Z",
  },
  {
    id: "fsr-004",
    department: "Mechanical Engineering",
    total_students: 480,
    required_faculty: 32,
    available_faculty: 34,
    fsr_ratio: "1:14.1",
    professors_count: 4,
    assoc_professors_count: 8,
    asst_professors_count: 22,
    phd_faculty_pct: 64.7,
    cadre_ratio_compliant: true,
    created_at: "2026-02-01T10:00:00Z",
  },
  {
    id: "fsr-005",
    department: "Management Studies & MCA",
    total_students: 480,
    required_faculty: 24,
    available_faculty: 26,
    fsr_ratio: "1:18.4",
    professors_count: 3,
    assoc_professors_count: 6,
    asst_professors_count: 17,
    phd_faculty_pct: 53.8,
    cadre_ratio_compliant: true,
    created_at: "2026-02-01T10:00:00Z",
  },
];

const INITIAL_COMMITTEES: AicteStatutoryCommittee[] = [
  {
    id: "comm-001",
    committee_name: "Apex Anti-Ragging Committee & Flying Squad",
    committee_type: "anti_ragging",
    chairperson_name: "Dr. K. Swaminathan (Dean Student Affairs)",
    external_member_name: "ACP Rajesh Patil (Law Enforcement Representative)",
    total_members: 15,
    last_meeting_date: "2026-08-14",
    mom_docket_token: "CL-AICTE-ARC-2026-081",
    statutory_compliance_status: "compliant",
    created_at: "2026-01-10T10:00:00Z",
  },
  {
    id: "comm-002",
    committee_name: "Internal Complaints Committee (ICC / POSH Act 2013)",
    committee_type: "icc_posh",
    chairperson_name: "Dr. Radhika Iyer (Professor & Head)",
    external_member_name: "Adv. Shalini Deshmukh (High Court Counsel / NGO)",
    total_members: 9,
    last_meeting_date: "2026-09-02",
    mom_docket_token: "CL-AICTE-ICC-2026-092",
    statutory_compliance_status: "compliant",
    created_at: "2026-01-10T10:00:00Z",
  },
  {
    id: "comm-003",
    committee_name: "SC/ST Welfare & Inclusivity Cell Committee",
    committee_type: "sc_st_cell",
    chairperson_name: "Prof. M. Chandrashekhar (Associate Dean)",
    external_member_name: "Smt. Anuradha Kamble (Social Welfare Officer)",
    total_members: 7,
    last_meeting_date: "2026-07-20",
    mom_docket_token: "CL-AICTE-SCST-2026-072",
    statutory_compliance_status: "compliant",
    created_at: "2026-01-10T10:00:00Z",
  },
  {
    id: "comm-004",
    committee_name: "Student Grievance Redressal Committee (SGRC)",
    committee_type: "grievance_sgrc",
    chairperson_name: "Dr. Anand S. Joshi (University Ombudsman Nominee)",
    external_member_name: "Dr. P. R. Menon (Former Principal)",
    total_members: 9,
    last_meeting_date: "2026-09-18",
    mom_docket_token: "CL-AICTE-SGRC-2026-091",
    statutory_compliance_status: "compliant",
    created_at: "2026-01-10T10:00:00Z",
  },
  {
    id: "comm-005",
    committee_name: "Industry-Institute Interaction Cell (IIIC)",
    committee_type: "industry_cell",
    chairperson_name: "Er. Vikram Malhotra (VP Engineering, Tata Tech)",
    external_member_name: "Ms. Sunita Roy (HR Director, Infosys)",
    total_members: 8,
    last_meeting_date: "2026-10-04",
    mom_docket_token: "CL-AICTE-IIIC-2026-104",
    statutory_compliance_status: "compliant",
    created_at: "2026-01-10T10:00:00Z",
  },
];

const INITIAL_DOSSIERS: AicteEoaDossier[] = [
  {
    id: "eoa-001",
    application_number: "AICTE-EOA-2026-94812",
    academic_year: "2026-27",
    submission_date: "2026-02-18",
    deficiency_index: 0.0,
    evc_inspection_status: "recommended",
    eoa_docket_token: "CL-AICTE-EOA-2026-94812",
    mandatory_disclosure_token: "CL-AICTE-MD-2026-94812",
    digital_signature_hash: "0x89e21bf4a01948ba2901cfa99120bc7145fa8821",
    created_at: "2026-02-18T14:30:00Z",
  },
  {
    id: "eoa-002",
    application_number: "AICTE-EOA-2025-88210",
    academic_year: "2025-26",
    submission_date: "2025-02-22",
    deficiency_index: 0.0,
    evc_inspection_status: "scrutiny_cleared",
    eoa_docket_token: "CL-AICTE-EOA-2025-88210",
    mandatory_disclosure_token: "CL-AICTE-MD-2025-88210",
    digital_signature_hash: "0x44ab9102cda890123ef1993412aa89104041bc89",
    created_at: "2025-02-22T11:00:00Z",
  },
];

// In-Memory store
class AicteComplianceStore {
  programs: AicteApprovedProgram[] = [...INITIAL_PROGRAMS];
  infrastructureNorms: AicteInfrastructureNorm[] = [...INITIAL_INFRA_NORMS];
  cadreMetrics: AicteCadreFsrMetric[] = [...INITIAL_CADRE_FSR];
  committees: AicteStatutoryCommittee[] = [...INITIAL_COMMITTEES];
  dossiers: AicteEoaDossier[] = [...INITIAL_DOSSIERS];

  // Programs
  getPrograms(search?: string, level?: string): AicteApprovedProgram[] {
    let result = this.programs;
    if (level && level !== "all") {
      result = result.filter((p) => p.program_level === level);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.program_name.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q)
      );
    }
    return result;
  }

  addProgram(data: Partial<AicteApprovedProgram>): AicteApprovedProgram {
    const intake = Number(data.approved_intake) || 60;
    const newProg: AicteApprovedProgram = {
      id: `prog-${Date.now()}`,
      program_name: data.program_name || "New Emerging Tech Program",
      program_level: (data.program_level as AicteProgramLevel) || "undergraduate",
      department: data.department || "Engineering Deanery",
      approved_intake: intake,
      applied_intake: Number(data.applied_intake) || intake,
      eoa_status: "applied",
      approval_academic_year: data.approval_academic_year || "2026-27",
      accreditation_status: (data.accreditation_status as AicteAccreditationStatus) || "eligible",
      nri_quota_approved: data.nri_quota_approved ?? false,
      pio_fn_quota_approved: data.pio_fn_quota_approved ?? false,
      tfw_quota_approved: data.tfw_quota_approved ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.programs.unshift(newProg);
    return newProg;
  }

  // Infrastructure
  getInfrastructureNorms(): AicteInfrastructureNorm[] {
    return this.infrastructureNorms;
  }

  // Cadre FSR
  getCadreMetrics(): AicteCadreFsrMetric[] {
    return this.cadreMetrics;
  }

  // Committees
  getCommittees(): AicteStatutoryCommittee[] {
    return this.committees;
  }

  updateCommitteeMeeting(id: string, date: string): AicteStatutoryCommittee | undefined {
    const comm = this.committees.find((c) => c.id === id);
    if (comm) {
      comm.last_meeting_date = date;
      comm.statutory_compliance_status = "compliant";
    }
    return comm;
  }

  // Dossiers
  getDossiers(): AicteEoaDossier[] {
    return this.dossiers;
  }

  createEoaDossier(data: Partial<AicteEoaDossier>): AicteEoaDossier {
    const appNo = data.application_number || generateAicteApplicationNumber();
    const newDossier: AicteEoaDossier = {
      id: `eoa-${Date.now()}`,
      application_number: appNo,
      academic_year: data.academic_year || "2026-27",
      submission_date: new Date().toISOString().split("T")[0],
      deficiency_index: Number(data.deficiency_index) || 0.0,
      evc_inspection_status: (data.evc_inspection_status as AicteInspectionStatus) || "under_scrutiny",
      eoa_docket_token: generateEoaDocketToken(),
      mandatory_disclosure_token: generateMandatoryDisclosureToken(),
      digital_signature_hash: generateDigitalSignatureHash(),
      created_at: new Date().toISOString(),
    };
    this.dossiers.unshift(newDossier);
    return newDossier;
  }

  getSummaryStats(): AicteComplianceSummaryStats {
    const totalApproved = this.programs.reduce((acc, curr) => acc + curr.approved_intake, 0);
    const totalApplied = this.programs.reduce((acc, curr) => acc + curr.applied_intake, 0);
    const totalArea = this.infrastructureNorms.reduce((acc, curr) => acc + curr.available_area_sqm, 0);

    return {
      totalApprovedIntake: totalApproved,
      totalAppliedIntake: totalApplied,
      overallFsrRatio: "1:14.3",
      deficiencyIndex: 0.0,
      eoaApprovalYear: "2026-27",
      activeCommitteesCount: this.committees.length,
      totalInstructionalAreaSqm: Math.round(totalArea),
      programs: this.programs,
      infrastructureNorms: this.infrastructureNorms,
      cadreMetrics: this.cadreMetrics,
      committees: this.committees,
      dossiers: this.dossiers,
    };
  }
}

// Global Singleton Store across API routes
const globalForStore = globalThis as unknown as { aicteComplianceStore?: AicteComplianceStore };
export const aicteComplianceStore = globalForStore.aicteComplianceStore ?? new AicteComplianceStore();
if (process.env.NODE_ENV !== "production") {
  globalForStore.aicteComplianceStore = aicteComplianceStore;
}
