// ================================================================
// CampusLens AI — Phase 31: Campus Grievance Redressal & Student Ombudsman Engine
// Zero-knowledge anonymous case hasher, statutory committee registries, and orders
// ================================================================

import {
  GrievanceCase,
  OmbudsmanCommitteeMember,
  GrievanceHearing,
  GrievanceResolutionOrder,
  OmbudsmanOverviewStats,
} from "@/types";

export function generateZkpTrackingHash(): string {
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ZKP-CASE-2026-${randomSuffix}`;
}

export function generateOrderSerialCode(): string {
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CL-GRV-ORD-2026-${randomSuffix}`;
}

export function calculateOmbudsmanOverview(
  cases: GrievanceCase[] = MOCK_GRIEVANCE_CASES,
  committee: OmbudsmanCommitteeMember[] = MOCK_COMMITTEE_MEMBERS,
  hearings: GrievanceHearing[] = MOCK_HEARINGS,
  orders: GrievanceResolutionOrder[] = MOCK_ORDERS
): OmbudsmanOverviewStats {
  const totalCasesReported = cases.length;
  const activeUnderHearing = cases.filter(
    (c) => c.status === "Submitted" || c.status === "Under Hearing"
  ).length;
  const resolvedCases = cases.filter(
    (c) => c.status === "Resolved" || c.status === "Directive Issued"
  ).length;

  const averageResolutionHours = 44; // SLA is 72 hours max
  const complianceRatePercent = 98.5;

  return {
    totalCasesReported,
    activeUnderHearing,
    resolvedCases,
    averageResolutionHours,
    complianceRatePercent,
    cases,
    committeeMembers: committee,
    hearings,
    resolutionOrders: orders,
  };
}

export const MOCK_GRIEVANCE_CASES: GrievanceCase[] = [
  {
    id: "grv-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    tracking_hash: "ZKP-CASE-2026-RAG1",
    category: "Anti-Ragging Squad",
    title: "Hostel Block 3 Late-Night Intimidation and Senior Coercion",
    description: "Anonymous reporting of junior scholar harassment outside 2nd floor common room past 11:30 PM. Instant Anti-Ragging rapid response squad mobilized.",
    is_anonymous: true,
    complainant_masked_id: "ANON-SCHOLAR-882",
    urgency_level: "Critical Emergency",
    escalation_tier: "Proctorial Board",
    sla_deadline: "2026-10-04T12:00:00Z",
    status: "Under Hearing",
    evidence_attachments: ["https://campuslens.ai/evidence/audio-redacted-01.enc"],
    created_at: "2026-10-01T23:30:00Z",
  },
  {
    id: "grv-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    tracking_hash: "ZKP-CASE-2026-ICC9",
    category: "Internal Complaints Committee (ICC)",
    title: "Gender Disrespect and Unsolicited Electronic Messaging in Research Lab",
    description: "Statutory complaint filed under POSH / ICC framework. Presiding officer constituted formal inquiry tribunal with confidentiality protocol.",
    is_anonymous: false,
    complainant_masked_id: "std-••••••••-4821",
    urgency_level: "High Priority",
    escalation_tier: "Campus Ombudsman",
    sla_deadline: "2026-10-05T17:00:00Z",
    status: "Under Hearing",
    evidence_attachments: ["https://campuslens.ai/evidence/chat-screenshot-redacted.pdf"],
    created_at: "2026-09-30T10:15:00Z",
  },
  {
    id: "grv-33333333-3333-4111-8111-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    tracking_hash: "ZKP-CASE-2026-EXM4",
    category: "Academic Evaluation & Exams",
    title: "Improper Question Paper Syllabus Overreach in Advanced Algorithms End-Sem",
    description: "14 enrolled scholars lodged joint petition demonstrating Question 4 exceeded published BoS syllabus guidelines. Board of Studies re-evaluation completed.",
    is_anonymous: false,
    complainant_masked_id: "std-••••••••-1199",
    urgency_level: "Standard Review",
    escalation_tier: "Department Committee",
    sla_deadline: "2026-09-29T18:00:00Z",
    status: "Resolved",
    evidence_attachments: ["https://campuslens.ai/evidence/exam-paper-cs401.pdf"],
    created_at: "2026-09-26T14:00:00Z",
  }
];

export const MOCK_COMMITTEE_MEMBERS: OmbudsmanCommitteeMember[] = [
  {
    id: "com-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    member_name: "Justice (Retd.) P. K. Saxena",
    designation: "Former Principal District Judge & Legal Scholar",
    committee_role: "Ombudsman Chair (Retd. District Judge)",
    contact_email: "ombudsman.chair@apex.edu",
    office_location: "Statutory Tribunal Chambers, Apex Administrative Block",
    is_active: true,
    created_at: "2026-01-10T10:00:00Z",
  },
  {
    id: "com-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    member_name: "Dr. S. R. Venkatraman",
    designation: "Professor & Chief Proctor",
    committee_role: "Chief Proctor",
    contact_email: "proctor@apex.edu",
    office_location: "Proctorial Board Office, Gate 2",
    is_active: true,
    created_at: "2026-01-15T11:00:00Z",
  },
  {
    id: "com-33333333-3333-4111-8111-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    member_name: "Prof. Meenakshi Sundaram",
    designation: "Senior Faculty & POSH Legal Advisor",
    committee_role: "ICC Presiding Officer",
    contact_email: "icc.head@apex.edu",
    office_location: "Internal Complaints Cell, Room 204",
    is_active: true,
    created_at: "2026-01-20T12:00:00Z",
  },
  {
    id: "com-44444444-4444-4111-8111-444444444444",
    college_id: "c1111111-1111-4111-8111-111111111111",
    member_name: "Dr. Ananya Mukherjee",
    designation: "Dean of Student Welfare (DSW)",
    committee_role: "Dean of Student Welfare",
    contact_email: "dsw@apex.edu",
    office_location: "Student Activity Center Floor 1",
    is_active: true,
    created_at: "2026-01-25T14:00:00Z",
  }
];

export const MOCK_HEARINGS: GrievanceHearing[] = [
  {
    id: "hrg-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    case_id: "grv-11111111-1111-4111-8111-111111111111",
    docket_number: "DOCKET-2026-RAG-004",
    hearing_date: "2026-10-03T15:00:00Z",
    tribunal_venue: "Ombudsman In-Camera Hearing Chamber 101",
    presiding_officer: "Justice (Retd.) P. K. Saxena",
    quorum_present: [
      "Justice (Retd.) P. K. Saxena",
      "Dr. S. R. Venkatraman",
      "Dr. Ananya Mukherjee",
    ],
    hearing_notes: "CCTV logs of Hostel Block 3 corridor requisitioned. Accused party summoned for confidential deposition.",
    status: "Scheduled",
    created_at: "2026-10-02T08:00:00Z",
  },
  {
    id: "hrg-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    case_id: "grv-22222222-2222-4111-8111-222222222222",
    docket_number: "DOCKET-2026-ICC-012",
    hearing_date: "2026-10-04T11:00:00Z",
    tribunal_venue: "Confidential ICC Chamber (Room 204)",
    presiding_officer: "Prof. Meenakshi Sundaram",
    quorum_present: ["Prof. Meenakshi Sundaram", "External NGO Advocate"],
    hearing_notes: "Witness statements scheduled for recorded audio deposition with disguised vocal synthesizer.",
    status: "Scheduled",
    created_at: "2026-10-01T14:30:00Z",
  }
];

export const MOCK_ORDERS: GrievanceResolutionOrder[] = [
  {
    id: "ord-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    case_id: "grv-33333333-3333-4111-8111-333333333333",
    order_serial_code: "CL-GRV-ORD-2026-EX88",
    presiding_authority: "Justice (Retd.) P. K. Saxena (Ombudsman)",
    findings_summary: "Upon independent technical review by External Subject Matter Experts, Question 4 was determined to contain out-of-syllabus NP-Hard reductions not covered in CS-401.",
    mandatory_directives: "Full 8 grace marks awarded uniformly to all registered examinees. Examination controller ordered to revise transcript ledger immediately.",
    compliance_deadline: "2026-10-05",
    is_statutory_binding: true,
    digital_seal_hash: "SEAL_0x8F9B2C4E_APEX_OMBUDSMAN_CONFIDENTIAL",
    issued_at: "2026-09-28T16:00:00Z",
  }
];
