/**
 * CampusLens AI — Phase 47: Smart Campus Internal Quality Assurance Cell (IQAC),
 * NAAC Criteria & Institutional Accreditation Engine
 * File: src/lib/iqac/iqac-engine.ts
 */

import {
  IqacCriterionMetric,
  IqacAqarReport,
  IqacAcademicAudit,
  IqacBestPractice,
  IqacOverviewStats,
  NaacCriterionCode,
  AccreditationGrade,
  AuditType,
  AuditStatus,
  AqarStatus,
} from "@/types";

// Token Generators
export function generateAqarToken(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-AQAR-2026-${rand}`;
}

export function generateAuditToken(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-AAA-2026-${rand}`;
}

export function generateBestPracticeToken(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-BP-2026-${rand}`;
}

export function generateIqacComplianceToken(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-IQAC-COMP-2026-${rand}`;
}

// 7 NAAC Criteria Seed Dataset
export const MOCK_IQAC_CRITERIA: IqacCriterionMetric[] = [
  {
    id: "crit-1",
    criterion_code: "CRITERION_1",
    criterion_title: "Curricular Aspects",
    lead_evaluator: "Prof. S. Venkataraman (Dean of Academic Affairs)",
    max_weightage: 100,
    current_score: 95.5,
    target_score: 98.0,
    ssr_readiness_percentage: 97.5,
    status: "validated",
    last_audited_at: "2026-09-15T10:00:00Z",
    key_indicators: [
      {
        id: "ind-1-1",
        metricCode: "1.1.1",
        description: "Curriculum design and revision incorporating NEP-2020 multi-disciplinary electives",
        type: "qualitative",
        benchmarkTarget: 100,
        achievedScore: 98,
        unit: "% alignment",
        documentationVerified: true,
      },
      {
        id: "ind-1-2",
        metricCode: "1.2.1",
        description: "Value-added courses and industry certification micro-credentials offered",
        type: "quantitative",
        benchmarkTarget: 45,
        achievedScore: 52,
        unit: "courses",
        documentationVerified: true,
      },
      {
        id: "ind-1-3",
        metricCode: "1.4.1",
        description: "Structured feedback system from students, alumni, faculty, and corporate employers",
        type: "quantitative",
        benchmarkTarget: 95,
        achievedScore: 96.8,
        unit: "% response rate",
        documentationVerified: true,
      },
    ],
  },
  {
    id: "crit-2",
    criterion_code: "CRITERION_2",
    criterion_title: "Teaching-Learning and Evaluation",
    lead_evaluator: "Dr. Ananya Mukherjee (Chair, Controller of Examinations)",
    max_weightage: 350,
    current_score: 338.0,
    target_score: 345.0,
    ssr_readiness_percentage: 96.2,
    status: "validated",
    last_audited_at: "2026-09-20T11:30:00Z",
    key_indicators: [
      {
        id: "ind-2-1",
        metricCode: "2.1.2",
        description: "Reserved category enrollment against statutory sanctioned seats (SC/ST/OBC/EWS)",
        type: "quantitative",
        benchmarkTarget: 90,
        achievedScore: 94.2,
        unit: "% filled",
        documentationVerified: true,
      },
      {
        id: "ind-2-2",
        metricCode: "2.2.1",
        description: "Student-to-Full-time Faculty Ratio (Tier-1 UGC Benchmark <= 15:1)",
        type: "quantitative",
        benchmarkTarget: 15,
        achievedScore: 12.4,
        unit: ":1 ratio",
        documentationVerified: true,
      },
      {
        id: "ind-2-3",
        metricCode: "2.5.1",
        description: "Continuous Internal Evaluation (CIE) transparency & grievance redressal turnaround",
        type: "quantitative",
        benchmarkTarget: 95,
        achievedScore: 97.4,
        unit: "% resolved in 48h",
        documentationVerified: true,
      },
    ],
  },
  {
    id: "crit-3",
    criterion_code: "CRITERION_3",
    criterion_title: "Research, Innovations and Extension",
    lead_evaluator: "Dr. Rajeshwari Pillai (Dean of Sponsored Research & Industrial Consultancy)",
    max_weightage: 110,
    current_score: 104.2,
    target_score: 108.0,
    ssr_readiness_percentage: 94.8,
    status: "validated",
    last_audited_at: "2026-09-25T14:00:00Z",
    key_indicators: [
      {
        id: "ind-3-1",
        metricCode: "3.1.1",
        description: "Internal seed money grants disbursed to early-career faculty scholars",
        type: "quantitative",
        benchmarkTarget: 50,
        achievedScore: 68.5,
        unit: "₹ Lakhs",
        documentationVerified: true,
      },
      {
        id: "ind-3-2",
        metricCode: "3.2.2",
        description: "Corporate CSR, DST, SERB, and ISRO sponsored research grants mobilization",
        type: "quantitative",
        benchmarkTarget: 600,
        achievedScore: 842.0,
        unit: "₹ Lakhs",
        documentationVerified: true,
      },
      {
        id: "ind-3-3",
        metricCode: "3.4.3",
        description: "Scopus, Web of Science, and IEEE indexed peer-reviewed journal papers per faculty",
        type: "quantitative",
        benchmarkTarget: 3.5,
        achievedScore: 4.8,
        unit: "papers/faculty",
        documentationVerified: true,
      },
    ],
  },
  {
    id: "crit-4",
    criterion_code: "CRITERION_4",
    criterion_title: "Infrastructure and Learning Resources",
    lead_evaluator: "Er. Devendra Joshi (Chief Works & Estates Engineer)",
    max_weightage: 100,
    current_score: 97.0,
    target_score: 99.0,
    ssr_readiness_percentage: 98.0,
    status: "validated",
    last_audited_at: "2026-09-28T09:00:00Z",
    key_indicators: [
      {
        id: "ind-4-1",
        metricCode: "4.1.3",
        description: "Smart ICT enabled lecture theatres with digital touch podiums and lecture capture",
        type: "quantitative",
        benchmarkTarget: 85,
        achievedScore: 92.5,
        unit: "% classrooms",
        documentationVerified: true,
      },
      {
        id: "ind-4-2",
        metricCode: "4.2.2",
        description: "Digital Library automation via KOHA, e-ShodhSindhu & IEEE/ScienceDirect remote access",
        type: "qualitative",
        benchmarkTarget: 100,
        achievedScore: 98,
        unit: "% compliance",
        documentationVerified: true,
      },
      {
        id: "ind-4-3",
        metricCode: "4.3.4",
        description: "Dedicated optical fiber broadband connectivity across campus and hostels",
        type: "quantitative",
        benchmarkTarget: 5,
        achievedScore: 10,
        unit: "Gbps",
        documentationVerified: true,
      },
    ],
  },
  {
    id: "crit-5",
    criterion_code: "CRITERION_5",
    criterion_title: "Student Support and Progression",
    lead_evaluator: "Prof. Vandana Sharma (Dean of Student Welfare)",
    max_weightage: 140,
    current_score: 132.5,
    target_score: 136.0,
    ssr_readiness_percentage: 95.0,
    status: "validated",
    last_audited_at: "2026-10-02T16:00:00Z",
    key_indicators: [
      {
        id: "ind-5-1",
        metricCode: "5.1.1",
        description: "Students supported through government and institutional fee freeships",
        type: "quantitative",
        benchmarkTarget: 40,
        achievedScore: 48.6,
        unit: "% scholars",
        documentationVerified: true,
      },
      {
        id: "ind-5-2",
        metricCode: "5.2.1",
        description: "Placement rate of graduating batch and median salary package metrics",
        type: "quantitative",
        benchmarkTarget: 90,
        achievedScore: 94.6,
        unit: "% placed",
        documentationVerified: true,
      },
      {
        id: "ind-5-3",
        metricCode: "5.3.1",
        description: "Awards and medals won in national/international inter-university athletics and arts",
        type: "quantitative",
        benchmarkTarget: 25,
        achievedScore: 38,
        unit: "medals",
        documentationVerified: true,
      },
    ],
  },
  {
    id: "crit-6",
    criterion_code: "CRITERION_6",
    criterion_title: "Governance, Leadership and Management",
    lead_evaluator: "Dr. P. K. Nambiar (Director, Internal Quality Assurance Cell)",
    max_weightage: 100,
    current_score: 96.0,
    target_score: 98.0,
    ssr_readiness_percentage: 97.0,
    status: "validated",
    last_audited_at: "2026-10-05T12:00:00Z",
    key_indicators: [
      {
        id: "ind-6-1",
        metricCode: "6.2.3",
        description: "Implementation of e-governance ERP in administration, finance, admissions and exams",
        type: "qualitative",
        benchmarkTarget: 100,
        achievedScore: 100,
        unit: "% paperless",
        documentationVerified: true,
      },
      {
        id: "ind-6-2",
        metricCode: "6.3.2",
        description: "Faculty financial support for attending IEEE/ACM international conferences",
        type: "quantitative",
        benchmarkTarget: 50,
        achievedScore: 62.4,
        unit: "% faculty",
        documentationVerified: true,
      },
      {
        id: "ind-6-3",
        metricCode: "6.5.3",
        description: "Regular IQAC statutory meetings, AQAR filings, and External Academic Audits conducted",
        type: "quantitative",
        benchmarkTarget: 4,
        achievedScore: 4,
        unit: "sessions/yr",
        documentationVerified: true,
      },
    ],
  },
  {
    id: "crit-7",
    criterion_code: "CRITERION_7",
    criterion_title: "Institutional Values and Best Practices",
    lead_evaluator: "Dr. Farhana Begum (Head, Green Campus & Ethics Council)",
    max_weightage: 100,
    current_score: 97.5,
    target_score: 99.0,
    ssr_readiness_percentage: 98.5,
    status: "validated",
    last_audited_at: "2026-10-08T15:00:00Z",
    key_indicators: [
      {
        id: "ind-7-1",
        metricCode: "7.1.2",
        description: "Solar microgrid generation (1.2 MW) and biogas green power campus offset",
        type: "quantitative",
        benchmarkTarget: 60,
        achievedScore: 78.4,
        unit: "% green power",
        documentationVerified: true,
      },
      {
        id: "ind-7-2",
        metricCode: "7.1.4",
        description: "Water conservation facilities including rainwater harvesting and zero-liquid discharge STP",
        type: "qualitative",
        benchmarkTarget: 100,
        achievedScore: 98,
        unit: "% compliant",
        documentationVerified: true,
      },
      {
        id: "ind-7-3",
        metricCode: "7.3.1",
        description: "Institutional distinctiveness: AI-powered inclusive education for rural scholars",
        type: "qualitative",
        benchmarkTarget: 100,
        achievedScore: 99,
        unit: "% benchmark",
        documentationVerified: true,
      },
    ],
  },
];

// Mock AQAR Reports
export const MOCK_AQAR_REPORTS: IqacAqarReport[] = [
  {
    id: "aqar-001",
    academic_year: "2025-2026",
    submission_token: "CL-AQAR-2026-8812",
    iqac_director: "Dr. P. K. Nambiar (Director, IQAC)",
    overall_cgpa_projected: 3.86,
    projected_naac_grade: "A++",
    aqar_status: "submitted_naac",
    executive_signoff_date: "2026-09-30T10:00:00Z",
    executive_signoff_by: "Prof. Sudhir K. Verma (Vice Chancellor)",
    criteria_summary: {
      CRITERION_1: 95.5,
      CRITERION_2: 338.0,
      CRITERION_3: 104.2,
      CRITERION_4: 97.0,
      CRITERION_5: 132.5,
      CRITERION_6: 96.0,
      CRITERION_7: 97.5,
    },
    document_attachment_url: "/docs/aqar/aqar_2025_2026_final_signed.pdf",
    created_at: "2026-09-10T08:00:00Z",
    updated_at: "2026-09-30T10:00:00Z",
  },
  {
    id: "aqar-002",
    academic_year: "2026-2027",
    submission_token: "CL-AQAR-2026-9403",
    iqac_director: "Dr. P. K. Nambiar (Director, IQAC)",
    overall_cgpa_projected: 3.88,
    projected_naac_grade: "A++",
    aqar_status: "peer_review",
    executive_signoff_date: null,
    executive_signoff_by: null,
    criteria_summary: {
      CRITERION_1: 96.0,
      CRITERION_2: 341.0,
      CRITERION_3: 106.0,
      CRITERION_4: 98.0,
      CRITERION_5: 134.0,
      CRITERION_6: 97.0,
      CRITERION_7: 98.5,
    },
    document_attachment_url: "/docs/aqar/aqar_2026_2027_midterm_draft.pdf",
    created_at: "2026-10-01T09:00:00Z",
    updated_at: "2026-10-10T14:30:00Z",
  },
  {
    id: "aqar-003",
    academic_year: "2024-2025",
    submission_token: "CL-AQAR-2026-7241",
    iqac_director: "Dr. P. K. Nambiar (Director, IQAC)",
    overall_cgpa_projected: 3.79,
    projected_naac_grade: "A++",
    aqar_status: "submitted_naac",
    executive_signoff_date: "2025-10-12T11:15:00Z",
    executive_signoff_by: "Prof. Sudhir K. Verma (Vice Chancellor)",
    criteria_summary: {
      CRITERION_1: 94.0,
      CRITERION_2: 330.0,
      CRITERION_3: 101.5,
      CRITERION_4: 95.0,
      CRITERION_5: 129.0,
      CRITERION_6: 94.5,
      CRITERION_7: 95.0,
    },
    document_attachment_url: "/docs/aqar/aqar_2024_2025_accredited.pdf",
    created_at: "2025-09-12T08:00:00Z",
    updated_at: "2025-10-12T11:15:00Z",
  },
];

// Mock Academic & Administrative Audits (AAA)
export const MOCK_ACADEMIC_AUDITS: IqacAcademicAudit[] = [
  {
    id: "audit-001",
    audit_code: "AAA-CSE-2026-01",
    audit_title: "School of Computing & AI Departmental Academic Performance Audit",
    audit_type: "academic",
    target_department: "Computer Science & Engineering and AI Hub",
    lead_external_auditor: "Prof. N. K. Bansal (Emeritus Chair, IIT Bombay)",
    external_auditor_affiliation: "Indian Institute of Technology Bombay",
    internal_co_auditor: "Dr. Ananya Mukherjee (CoE)",
    scheduled_date: "2026-09-18",
    completion_date: "2026-09-19",
    overall_compliance_score: 97.2,
    audit_status: "completed",
    key_observations: [
      "Exceptional student-faculty publication ratio in Scopus/IEEE conferences (4.8/faculty).",
      "Outcome-Based Education (OBE) course outcome attainment mapping verified across 48 courses.",
      "Recommended upgrading GPU cluster nodes from H100 to Blackwell B200 for next-gen LLM research.",
    ],
    action_taken_report: "Approved allocation of ₹1.8 Crore for AI Lab cluster upgrades via Industry CSR funds.",
    created_at: "2026-09-01T10:00:00Z",
  },
  {
    id: "audit-002",
    audit_code: "AAA-GREEN-2026-02",
    audit_title: "Campus Environmental Sustainability & Green Energy Audit",
    audit_type: "green_energy",
    target_department: "Central Works, Solar Microgrid & Estates",
    lead_external_auditor: "Dr. R. C. Mathur (BEE Accredited Principal Energy Auditor)",
    external_auditor_affiliation: "Bureau of Energy Efficiency (BEE) Council",
    internal_co_auditor: "Er. Devendra Joshi (Chief Engineer)",
    scheduled_date: "2026-09-24",
    completion_date: "2026-09-25",
    overall_compliance_score: 96.0,
    audit_status: "completed",
    key_observations: [
      "1.2 MW rooftop solar installations generating 4,200 kWh daily, reducing carbon footprint by 38%.",
      "Sensor-based LED illumination and HVAC thermal sensors successfully deployed across 90% of blocks.",
      "Recommended implementing smart IoT rainwater sub-metering across girls' and boys' hostel quads.",
    ],
    action_taken_report: "IoT ultrasonic flow transmitters ordered and scheduled for installation in Q4.",
    created_at: "2026-09-05T11:00:00Z",
  },
  {
    id: "audit-003",
    audit_code: "AAA-ADMIN-2026-03",
    audit_title: "Academic Registrar, Student Life & Grievance Administrative Audit",
    audit_type: "administrative",
    target_department: "Admissions Registry & Examination Cell",
    lead_external_auditor: "Shri V. Sridhar (Former Senior Registrar, Anna University)",
    external_auditor_affiliation: "State Higher Education Quality Council",
    internal_co_auditor: "Dr. P. K. Nambiar (IQAC Director)",
    scheduled_date: "2026-10-18",
    completion_date: null,
    overall_compliance_score: 94.5,
    audit_status: "scheduled",
    key_observations: [
      "E-governance degree certificate verification and DigiLocker NAD API synchronization functioning flawlessly.",
      "Inspection will review student scholarship escrow reconciliation and automated hostel outpass logs.",
    ],
    action_taken_report: null,
    created_at: "2026-10-02T14:00:00Z",
  },
];

// Mock Best Practices Dataset
export const MOCK_BEST_PRACTICES: IqacBestPractice[] = [
  {
    id: "bp-001",
    practice_token: "CL-BP-2026-4401",
    practice_title: "Net-Zero Circular Campus Microgrid & Zero-Liquid-Discharge Hydro Hub",
    criterion_alignment: "CRITERION_7",
    thematic_area: "Environmental Sustainability & Clean Energy",
    contextual_background: "Addressing water stress and grid carbon intensity through decentralised renewable generation and complete effluent recycling on a 150-acre smart campus.",
    objectives: "Achieve net-positive clean energy generation during daylight hours, reduce municipal water intake by 70%, and integrate environmental telemetry into student curricula.",
    practice_implementation: "1.2 MW rooftop photovoltaic arrays, 500 KLD membrane bioreactor STP recycling water for cooling towers and horticulture, and real-time public telemetry dashboards.",
    evidence_of_success: "Carbon footprint reduced by 1,450 tonnes CO2-equivalent annually. Recognized with National Green Institutional Sustainability Award 2025.",
    sdg_goals: ["SDG 6: Clean Water", "SDG 7: Affordable & Clean Energy", "SDG 12: Responsible Consumption"],
    beneficiaries_impacted: 12500,
    institutional_status: "nationally_recognized",
    created_at: "2026-08-15T09:00:00Z",
  },
  {
    id: "bp-002",
    practice_token: "CL-BP-2026-5512",
    practice_title: "AI-Powered Adaptive Learning & Automated Continuous Bloom's Taxonomy Assessment",
    criterion_alignment: "CRITERION_2",
    thematic_area: "Pedagogical Innovation & Student Progression",
    contextual_background: "Bridging individual learning velocity gaps among diverse cohorts admitted through multi-state entrance exams and affirmative action quotas.",
    objectives: "Deliver individualized remedial learning pathways, automated Bloom's Taxonomy cognitive level tagging for exam question banks, and early warning for at-risk scholars.",
    practice_implementation: "Integrated smart LMS engine analyzing attendance telemetry, continuous internal evaluation results, and providing automated peer mentoring and faculty advisor alerts.",
    evidence_of_success: "Course completion rates in foundational engineering mathematics increased from 78% to 94.2%. First-year retention rate improved to 98.4%.",
    sdg_goals: ["SDG 4: Quality Education", "SDG 9: Industry, Innovation and Infrastructure", "SDG 10: Reduced Inequalities"],
    beneficiaries_impacted: 8400,
    institutional_status: "institutionalized",
    created_at: "2026-08-20T10:30:00Z",
  },
];

// In-Memory Session Stores
let criteriaStore: IqacCriterionMetric[] = [...MOCK_IQAC_CRITERIA];
let aqarStore: IqacAqarReport[] = [...MOCK_AQAR_REPORTS];
let auditsStore: IqacAcademicAudit[] = [...MOCK_ACADEMIC_AUDITS];
let bestPracticesStore: IqacBestPractice[] = [...MOCK_BEST_PRACTICES];

// Calculation of Projected NAAC CGPA
export function calculateProjectedCgpa(criteria: IqacCriterionMetric[]): {
  projectedCgpa: number;
  grade: AccreditationGrade;
} {
  let totalAchieved = 0;
  let totalMax = 0;

  for (const c of criteria) {
    totalAchieved += c.current_score;
    totalMax += c.max_weightage;
  }

  // NAAC 4.0 point scale conversion
  const ratio = totalMax > 0 ? totalAchieved / totalMax : 0.9;
  const rawCgpa = ratio * 4.0;
  const projectedCgpa = Math.min(4.0, Math.round(rawCgpa * 100) / 100);

  let grade: AccreditationGrade = "A++";
  if (projectedCgpa >= 3.51) {
    grade = "A++";
  } else if (projectedCgpa >= 3.26) {
    grade = "A+";
  } else if (projectedCgpa >= 3.01) {
    grade = "A";
  } else if (projectedCgpa >= 2.76) {
    grade = "B++";
  } else if (projectedCgpa >= 2.51) {
    grade = "B+";
  } else if (projectedCgpa >= 2.01) {
    grade = "B";
  } else {
    grade = "C";
  }

  return { projectedCgpa, grade };
}

// Stats Getter
export function getIqacOverviewStats(): IqacOverviewStats {
  const { projectedCgpa, grade } = calculateProjectedCgpa(criteriaStore);

  const avgReadiness =
    criteriaStore.reduce((acc, c) => acc + c.ssr_readiness_percentage, 0) /
    (criteriaStore.length || 1);

  const aqarSubmitted = aqarStore.filter(
    (a) => a.aqar_status === "submitted_naac"
  ).length;

  const auditsCompleted = auditsStore.filter(
    (a) => a.audit_status === "completed"
  ).length;

  return {
    projectedCgpa,
    projectedGrade: grade,
    ssrOverallReadiness: Math.round(avgReadiness * 10) / 10,
    aqarSubmittedCount: aqarSubmitted,
    auditsCompletedCount: auditsCompleted,
    bestPracticesCount: bestPracticesStore.length,
    criteria: criteriaStore,
    aqarReports: aqarStore,
    audits: auditsStore,
    bestPractices: bestPracticesStore,
  };
}

// Mutations
export function submitAqarDraft(data: {
  academic_year: string;
  iqac_director: string;
  criteria_scores?: Record<string, number>;
}): IqacAqarReport {
  const token = generateAqarToken();
  const { projectedCgpa, grade } = calculateProjectedCgpa(criteriaStore);

  const newReport: IqacAqarReport = {
    id: `aqar-${Date.now()}`,
    academic_year: data.academic_year,
    submission_token: token,
    iqac_director: data.iqac_director || "Dr. P. K. Nambiar (IQAC Director)",
    overall_cgpa_projected: projectedCgpa,
    projected_naac_grade: grade,
    aqar_status: "peer_review",
    executive_signoff_date: null,
    executive_signoff_by: null,
    criteria_summary: data.criteria_scores || {
      CRITERION_1: 96.0,
      CRITERION_2: 340.0,
      CRITERION_3: 105.0,
      CRITERION_4: 97.5,
      CRITERION_5: 133.0,
      CRITERION_6: 96.5,
      CRITERION_7: 98.0,
    },
    document_attachment_url: `/docs/aqar/aqar_${data.academic_year.replace("-", "_")}_draft.pdf`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  aqarStore.unshift(newReport);
  return newReport;
}

export function scheduleAcademicAudit(data: {
  audit_title: string;
  audit_type: AuditType;
  target_department: string;
  lead_external_auditor: string;
  external_auditor_affiliation: string;
  internal_co_auditor: string;
  scheduled_date: string;
}): IqacAcademicAudit {
  const token = generateAuditToken();
  const code = `AAA-${data.target_department.substring(0, 3).toUpperCase()}-2026-${Math.floor(10 + Math.random() * 90)}`;

  const newAudit: IqacAcademicAudit = {
    id: `audit-${Date.now()}`,
    audit_code: code,
    audit_title: data.audit_title,
    audit_type: data.audit_type,
    target_department: data.target_department,
    lead_external_auditor: data.lead_external_auditor,
    external_auditor_affiliation: data.external_auditor_affiliation,
    internal_co_auditor: data.internal_co_auditor,
    scheduled_date: data.scheduled_date,
    completion_date: null,
    overall_compliance_score: 95.0,
    audit_status: "scheduled",
    key_observations: [
      `Official notice issued for ${data.audit_type} audit of ${data.target_department}.`,
      `Documentation and Self-Study dossier requested from department chair.`,
    ],
    action_taken_report: null,
    created_at: new Date().toISOString(),
  };

  auditsStore.unshift(newAudit);
  return newAudit;
}

export function fileBestPractice(data: {
  practice_title: string;
  thematic_area: string;
  contextual_background: string;
  objectives: string;
  practice_implementation: string;
  evidence_of_success: string;
  sdg_goals: string[];
  beneficiaries_impacted: number;
}): IqacBestPractice {
  const token = generateBestPracticeToken();

  const newPractice: IqacBestPractice = {
    id: `bp-${Date.now()}`,
    practice_token: token,
    practice_title: data.practice_title,
    criterion_alignment: "CRITERION_7",
    thematic_area: data.thematic_area,
    contextual_background: data.contextual_background,
    objectives: data.objectives,
    practice_implementation: data.practice_implementation,
    evidence_of_success: data.evidence_of_success,
    sdg_goals: data.sdg_goals.length > 0 ? data.sdg_goals : ["SDG 4: Quality Education"],
    beneficiaries_impacted: data.beneficiaries_impacted || 5000,
    institutional_status: "institutionalized",
    created_at: new Date().toISOString(),
  };

  bestPracticesStore.unshift(newPractice);
  return newPractice;
}

export function updateCriterionMetric(
  code: NaacCriterionCode,
  newScore: number,
  readinessPercentage: number
): IqacCriterionMetric | null {
  const item = criteriaStore.find((c) => c.criterion_code === code);
  if (!item) return null;

  item.current_score = Math.min(item.max_weightage, Math.max(0, newScore));
  item.ssr_readiness_percentage = Math.min(100, Math.max(0, readinessPercentage));
  item.last_audited_at = new Date().toISOString();
  item.status = "validated";
  return item;
}

export function verifyIqacComplianceToken(token: string): {
  valid: boolean;
  type: string;
  data: any;
} {
  const trimmed = token.trim();

  // Check AQAR
  const aqar = aqarStore.find((a) => a.submission_token === trimmed);
  if (aqar) {
    return {
      valid: true,
      type: "AQAR Submission Docket",
      data: aqar,
    };
  }

  // Check Best Practice
  const bp = bestPracticesStore.find((b) => b.practice_token === trimmed);
  if (bp) {
    return {
      valid: true,
      type: "Institutional Best Practice Certificate",
      data: bp,
    };
  }

  // Check Audit code
  const audit = auditsStore.find((a) => a.audit_code === trimmed);
  if (audit) {
    return {
      valid: true,
      type: "Academic & Administrative Audit Docket",
      data: audit,
    };
  }

  // Match pattern CL-IQAC-COMP-2026-XXXX
  if (/^CL-IQAC-COMP-2026-\d{4}$/.test(trimmed)) {
    return {
      valid: true,
      type: "Institutional IQAC Compliance Certificate",
      data: {
        token: trimmed,
        status: "Officially Accredited A++ (CGPA: 3.86/4.00)",
        regulatory_framework: "NAAC Cycle-4 Accreditation & NIRF Top 25 Tier-1 Engineering",
        issued_by: "Internal Quality Assurance Cell (IQAC)",
        date: new Date().toISOString(),
      },
    };
  }

  return {
    valid: false,
    type: "Unknown",
    data: null,
  };
}
