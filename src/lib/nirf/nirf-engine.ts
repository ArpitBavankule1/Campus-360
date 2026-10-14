/**
 * CampusLens AI — Phase 48: Smart Campus National Institutional Ranking Framework (NIRF),
 * Institutional Benchmarking & Higher Education Ranking Intelligence Gateway Engine
 */

import {
  NirfCategory,
  NirfParameterCode,
  NirfParameterMetric,
  NirfDossier,
  NirfBenchmarkPeer,
  NirfDataMetric,
  NirfOverviewStats,
} from "@/types";

// Token Generators
export function generateNirfDossierToken(category: NirfCategory = "Engineering"): string {
  const prefixMap: Record<NirfCategory, string> = {
    Engineering: "ENG",
    Overall: "OVR",
    Research: "RES",
    Management: "MGT",
    Innovation: "INV",
    State_Public_University: "SPU",
  };
  const code = prefixMap[category] || "GEN";
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CL-NIRF-DOSS-2026-${code}${randomSuffix}`;
}

export function generateNirfCertToken(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CL-NIRF-CERT-2026-${randomSuffix}`;
}

export function generateNirfAuditToken(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CL-NIRF-AUD-2026-${randomSuffix}`;
}

export function generateNirfVerificationHash(dossierCode: string): string {
  let hash = 0;
  for (let i = 0; i < dossierCode.length; i++) {
    hash = (hash << 5) - hash + dossierCode.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  return `NIRF-SHA256-${hex.toUpperCase()}-EVAL-SECURE`;
}

// Seed Parameters (The 5 NIRF Core Pillars)
export const MOCK_NIRF_PARAMETERS: NirfParameterMetric[] = [
  {
    id: "param-tlr-01",
    code: "TLR",
    name: "Teaching, Learning & Resources",
    description: "Evaluates core student strength, faculty-student ratio, doctoral scholar enrollments, and capital/operational financial resource allocation.",
    max_weightage: 100,
    current_score: 83.40,
    projected_score: 86.20,
    lead_coordinator: "Prof. Arvind Ramanathan (Dean Academic Affairs)",
    status: "verified",
    sub_metrics: [
      {
        code: "SS",
        title: "Student Strength (UG + PG + Ph.D.)",
        maxScore: 20,
        achievedScore: 18.2,
        unit: "Students",
        benchmarkValue: "4,500+",
        actualValue: "4,820 Enrolled Scholars",
      },
      {
        code: "FSR",
        title: "Faculty-Student Ratio",
        maxScore: 30,
        achievedScore: 26.5,
        unit: "Ratio",
        benchmarkValue: "1:15",
        actualValue: "1:14 (345 Full-time Faculty)",
      },
      {
        code: "FQE",
        title: "Faculty Qualification & Experience (Ph.D. %)",
        maxScore: 20,
        achievedScore: 17.8,
        unit: "% Ph.D.",
        benchmarkValue: "85%",
        actualValue: "92.4% Ph.D. from IITs/IISc/Global Top 100",
      },
      {
        code: "FRU",
        title: "Financial Resources & Annual Utilization",
        maxScore: 30,
        achievedScore: 20.9,
        unit: "₹ Crores",
        benchmarkValue: "₹45 Cr/yr",
        actualValue: "₹52.4 Cr Capital & Operational Spend",
      },
    ],
  },
  {
    id: "param-rpc-02",
    code: "RPC",
    name: "Research and Professional Practice",
    description: "Assesses peer-reviewed publications indexed in Scopus/Web of Science, quality citation impact, patent filings, and sponsored grant outlays.",
    max_weightage: 100,
    current_score: 84.10,
    projected_score: 87.50,
    lead_coordinator: "Dr. Sandeep Vardhan (Dean R&D)",
    status: "verified",
    sub_metrics: [
      {
        code: "PU",
        title: "Combined Metric for Publications (Scopus / WoS)",
        maxScore: 35,
        achievedScore: 30.5,
        unit: "Indexed Papers",
        benchmarkValue: "1,200 papers",
        actualValue: "1,450 Scopus Indexed (Last 3 Yrs)",
      },
      {
        code: "QP",
        title: "Quality of Publications (Citations & H-Index)",
        maxScore: 40,
        achievedScore: 33.2,
        unit: "Citations/Paper",
        benchmarkValue: "12.0",
        actualValue: "14.8 Average Citations (H-Index: 68)",
      },
      {
        code: "IPR",
        title: "Patents Granted & Published (Indian & PCT)",
        maxScore: 15,
        achievedScore: 12.8,
        unit: "Patents",
        benchmarkValue: "40 Patents",
        actualValue: "58 Published / 24 Granted",
      },
      {
        code: "FPPP",
        title: "Sponsored Research & Consultancy Funding",
        maxScore: 10,
        achievedScore: 7.6,
        unit: "₹ Crores",
        benchmarkValue: "₹20 Cr",
        actualValue: "₹26.8 Cr Active R&D Projects",
      },
    ],
  },
  {
    id: "param-go-03",
    code: "GO",
    name: "Graduation Outcomes",
    description: "Reflects student employment placement percentages, median annual salaries, top-tier higher education admissions, and university examination metrics.",
    max_weightage: 100,
    current_score: 86.80,
    projected_score: 89.20,
    lead_coordinator: "Dr. Vikramaditya Sen (Head T&P)",
    status: "verified",
    sub_metrics: [
      {
        code: "GPH",
        title: "Combined Metric for Placement & Higher Studies",
        maxScore: 40,
        achievedScore: 37.4,
        unit: "% Placed/Admitted",
        benchmarkValue: "88%",
        actualValue: "94.2% Placed or Admitted to Tier-1 Grad Schools",
      },
      {
        code: "GUE",
        title: "Metric for University Examinations Pass Percentage",
        maxScore: 15,
        achievedScore: 13.8,
        unit: "% Pass",
        benchmarkValue: "92%",
        actualValue: "96.5% Within Stipulated Time",
      },
      {
        code: "GMS",
        title: "Median Salary of Placed Graduates",
        maxScore: 40,
        achievedScore: 31.6,
        unit: "LPA (Lakhs)",
        benchmarkValue: "₹12.0 LPA",
        actualValue: "₹14.50 LPA (Highest ₹64.0 LPA)",
      },
      {
        code: "GPHD",
        title: "Graduated Ph.D. Scholars Output",
        maxScore: 5,
        achievedScore: 4.0,
        unit: "Graduated",
        benchmarkValue: "35 / year",
        actualValue: "42 Graduated Last Academic Year",
      },
    ],
  },
  {
    id: "param-oi-04",
    code: "OI",
    name: "Outreach and Inclusivity",
    description: "Evaluates geographical and demographic diversity, women scholar and faculty ratios, economically challenged scholarships, and accessibility facilities.",
    max_weightage: 100,
    current_score: 78.50,
    projected_score: 81.30,
    lead_coordinator: "Dr. Meenakshi Sundaram (Dean Student Welfare)",
    status: "action_required",
    sub_metrics: [
      {
        code: "RD",
        title: "Region Diversity (Outside State & International)",
        maxScore: 30,
        achievedScore: 23.4,
        unit: "% Outside State",
        benchmarkValue: "40%",
        actualValue: "44.8% Outside State / 6.2% International",
      },
      {
        code: "WD",
        title: "Women Diversity (Female Students & Faculty)",
        maxScore: 30,
        achievedScore: 22.1,
        unit: "% Women",
        benchmarkValue: "35%",
        actualValue: "34.2% Scholars / 38.0% Faculty",
      },
      {
        code: "ES",
        title: "Economically & Socially Challenged (Fee Waivers)",
        maxScore: 20,
        achievedScore: 16.5,
        unit: "% Reimbursed",
        benchmarkValue: "25%",
        actualValue: "29.4% Receiving Full/Partial Waivers",
      },
      {
        code: "PCS",
        title: "Physically Challenged Accessible Infrastructure",
        maxScore: 20,
        achievedScore: 16.5,
        unit: "Compliance %",
        benchmarkValue: "85%",
        actualValue: "92% Barrier-Free Braille & Lift Access",
      },
    ],
  },
  {
    id: "param-pr-05",
    code: "PR",
    name: "Perception",
    description: "Measures national academic peer appraisal, corporate employer reputation surveys, and public perception metrics across higher education stakeholders.",
    max_weightage: 100,
    current_score: 79.20,
    projected_score: 82.50,
    lead_coordinator: "Prof. Rajeshwari Nair (Pro-Vice Chancellor)",
    status: "in_review",
    sub_metrics: [
      {
        code: "PR-ACAD",
        title: "Academic Peer Perception (Vice-Chancellors/Deans)",
        maxScore: 50,
        achievedScore: 40.2,
        unit: "Survey Score",
        benchmarkValue: "80.0",
        actualValue: "82.5 Nationwide Academic Score",
      },
      {
        code: "PR-EMP",
        title: "Employer & Corporate Recruiter Reputation",
        maxScore: 50,
        achievedScore: 39.0,
        unit: "Recruiter Score",
        benchmarkValue: "80.0",
        actualValue: "81.8 Corporate Recruiter Trust Score",
      },
    ],
  },
];

// Seed Dossiers
export const MOCK_NIRF_DOSSIERS: NirfDossier[] = [
  {
    id: "dossier-eng-2026",
    dossier_code: "CL-NIRF-DOSS-2026-ENG91",
    academic_year: "2025-2026",
    category: "Engineering",
    composite_score: 82.85,
    projected_rank_range: "Rank #12 – #16",
    previous_year_rank: 18,
    submitted_by: "Dr. Ananya Mukherjee (Director, Quality Assurance & CoE)",
    approving_authority: "Prof. K. R. Sreenivasan (Vice Chancellor)",
    verification_hash: "NIRF-SHA256-4B9F2A1C-EVAL-SECURE",
    status: "submitted_to_moe",
    submission_date: "2026-02-15",
    dossier_metadata: {
      total_enrolled: 4820,
      faculty_count: 345,
      phd_scholars: 380,
      total_publications: 1450,
      median_salary_lpa: 14.5,
    },
  },
  {
    id: "dossier-ovr-2026",
    dossier_code: "CL-NIRF-DOSS-2026-OVR44",
    academic_year: "2025-2026",
    category: "Overall",
    composite_score: 78.40,
    projected_rank_range: "Rank #20 – #25",
    previous_year_rank: 27,
    submitted_by: "Prof. Arvind Ramanathan (Dean Academic Affairs)",
    approving_authority: "Prof. K. R. Sreenivasan (Vice Chancellor)",
    verification_hash: "NIRF-SHA256-8A33D07F-EVAL-SECURE",
    status: "board_approved",
    submission_date: "2026-02-18",
    dossier_metadata: {
      total_enrolled: 6200,
      faculties: 480,
      multidisciplinary_programs: 28,
    },
  },
  {
    id: "dossier-res-2026",
    dossier_code: "CL-NIRF-DOSS-2026-RES72",
    academic_year: "2025-2026",
    category: "Research",
    composite_score: 81.20,
    projected_rank_range: "Rank #17 – #21",
    previous_year_rank: 24,
    submitted_by: "Dr. Sandeep Vardhan (Dean R&D)",
    approving_authority: "Prof. K. R. Sreenivasan (Vice Chancellor)",
    verification_hash: "NIRF-SHA256-11CE9B4E-EVAL-SECURE",
    status: "internal_audit",
    submission_date: null,
    dossier_metadata: {
      total_grants_cr: 26.8,
      international_citations: 18200,
      pct_patents: 8,
    },
  },
];

// Peer Benchmarks
export const MOCK_NIRF_BENCHMARKS: NirfBenchmarkPeer[] = [
  {
    id: "bench-apex",
    institute_name: "Apex Institute of Technology (Our Campus)",
    category: "Engineering",
    academic_year: "2025-2026",
    current_rank: 18,
    tlr_score: 83.4,
    rpc_score: 84.1,
    go_score: 86.8,
    oi_score: 78.5,
    pr_score: 79.2,
    composite_score: 82.85,
    institute_type: "Apex_Institute",
    city: "Bangalore",
    state: "Karnataka",
  },
  {
    id: "bench-iitb",
    institute_name: "Indian Institute of Technology Bombay (IITB)",
    category: "Engineering",
    academic_year: "2025-2026",
    current_rank: 3,
    tlr_score: 89.2,
    rpc_score: 93.4,
    go_score: 91.5,
    oi_score: 82.1,
    pr_score: 91.8,
    composite_score: 89.65,
    institute_type: "IIT",
    city: "Mumbai",
    state: "Maharashtra",
  },
  {
    id: "bench-nitt",
    institute_name: "National Institute of Technology Tiruchirappalli (NITT)",
    category: "Engineering",
    academic_year: "2025-2026",
    current_rank: 9,
    tlr_score: 86.1,
    rpc_score: 85.9,
    go_score: 88.4,
    oi_score: 81.0,
    pr_score: 84.6,
    composite_score: 85.20,
    institute_type: "NIT",
    city: "Tiruchirappalli",
    state: "Tamil Nadu",
  },
  {
    id: "bench-bits",
    institute_name: "BITS Pilani (Birla Institute of Technology & Science)",
    category: "Engineering",
    academic_year: "2025-2026",
    current_rank: 15,
    tlr_score: 84.3,
    rpc_score: 83.8,
    go_score: 87.2,
    oi_score: 79.2,
    pr_score: 81.0,
    composite_score: 83.10,
    institute_type: "BITS",
    city: "Pilani",
    state: "Rajasthan",
  },
  {
    id: "bench-iiith",
    institute_name: "International Institute of Information Technology Hyderabad (IIITH)",
    category: "Engineering",
    academic_year: "2025-2026",
    current_rank: 21,
    tlr_score: 80.5,
    rpc_score: 84.7,
    go_score: 85.0,
    oi_score: 72.8,
    pr_score: 76.0,
    composite_score: 79.80,
    institute_type: "IIIT",
    city: "Hyderabad",
    state: "Telangana",
  },
];

// Department Data Metrics
export const MOCK_NIRF_DATA_METRICS: NirfDataMetric[] = [
  {
    id: "metric-01",
    parameter_code: "RPC",
    metric_code: "RPC-PU-CSE",
    metric_title: "High-Impact Scopus/IEEE Journals & Conferences",
    department: "Computer Science & Engineering",
    reported_value: "385 Papers",
    benchmark_value: "300 Papers",
    weightage: 15.0,
    score_achieved: 14.2,
    verified_by: "Prof. R. Deshmukh (HOD CSE)",
    audit_status: "verified",
    evidence_url: "https://campuslens.ai/nirf/evidence/cse-publications-2026.pdf",
  },
  {
    id: "metric-02",
    parameter_code: "RPC",
    metric_code: "RPC-IPR-ECE",
    metric_title: "Semiconductor 3nm & 6G Wireless Patents",
    department: "Electronics & Communication Engineering",
    reported_value: "16 Filings / 8 Granted",
    benchmark_value: "10 Filings",
    weightage: 8.0,
    score_achieved: 7.6,
    verified_by: "Dr. Kavita Menon (HOD ECE)",
    audit_status: "verified",
    evidence_url: "https://campuslens.ai/nirf/evidence/ece-patents-2026.pdf",
  },
  {
    id: "metric-03",
    parameter_code: "GO",
    metric_code: "GO-GMS-CAMPUS",
    metric_title: "Campus Placements Median CTC Audited by T&P",
    department: "Institutional Training & Placement Cell",
    reported_value: "₹14.50 LPA Median",
    benchmark_value: "₹12.00 LPA",
    weightage: 20.0,
    score_achieved: 18.8,
    verified_by: "Dr. Vikramaditya Sen (Head TPO)",
    audit_status: "verified",
    evidence_url: "https://campuslens.ai/nirf/evidence/placements-audit-2026.pdf",
  },
  {
    id: "metric-04",
    parameter_code: "TLR",
    metric_code: "TLR-FQE-MECH",
    metric_title: "Faculty Ph.D. Credentials & Industrial Years",
    department: "Mechanical & Aerospace Engineering",
    reported_value: "94% Ph.D. Holders",
    benchmark_value: "85%",
    weightage: 10.0,
    score_achieved: 9.4,
    verified_by: "Prof. S. N. Varma (HOD MECH)",
    audit_status: "verified",
    evidence_url: "https://campuslens.ai/nirf/evidence/mech-faculty-2026.pdf",
  },
  {
    id: "metric-05",
    parameter_code: "OI",
    metric_code: "OI-RD-INTL",
    metric_title: "Interstate & International Scholar Enrollment Ratio",
    department: "Dean International & Admissions",
    reported_value: "44.8% Out-of-State / 6.2% International",
    benchmark_value: "40.0%",
    weightage: 15.0,
    score_achieved: 13.9,
    verified_by: "Dr. Meenakshi Sundaram (Dean Student Welfare)",
    audit_status: "verified",
    evidence_url: "https://campuslens.ai/nirf/evidence/diversity-intake-2026.pdf",
  },
];

// In-Memory Storage for Mutations
const parametersState: NirfParameterMetric[] = [...MOCK_NIRF_PARAMETERS];
let dossiersState: NirfDossier[] = [...MOCK_NIRF_DOSSIERS];
const benchmarksState: NirfBenchmarkPeer[] = [...MOCK_NIRF_BENCHMARKS];
let metricsState: NirfDataMetric[] = [...MOCK_NIRF_DATA_METRICS];

export function getNirfParameters(): NirfParameterMetric[] {
  return [...parametersState];
}

export function getNirfDossiers(): NirfDossier[] {
  return [...dossiersState];
}

export function getNirfBenchmarks(): NirfBenchmarkPeer[] {
  return [...benchmarksState];
}

export function getNirfDataMetrics(): NirfDataMetric[] {
  return [...metricsState];
}

/**
 * Calculates official NIRF composite weighted score
 * Standard NIRF formula weights:
 * TLR: 0.30 | RPC: 0.30 | GO: 0.20 | OI: 0.10 | PR: 0.10
 */
export function calculateCompositeNirfScore(
  tlr: number,
  rpc: number,
  go: number,
  oi: number,
  pr: number
): number {
  const composite = (tlr * 0.30) + (rpc * 0.30) + (go * 0.20) + (oi * 0.10) + (pr * 0.10);
  return Number(composite.toFixed(2));
}

export function getNirfStats(): NirfOverviewStats {
  const tlr = parametersState.find((p) => p.code === "TLR")?.current_score ?? 83.4;
  const rpc = parametersState.find((p) => p.code === "RPC")?.current_score ?? 84.1;
  const go = parametersState.find((p) => p.code === "GO")?.current_score ?? 86.8;
  const oi = parametersState.find((p) => p.code === "OI")?.current_score ?? 78.5;
  const pr = parametersState.find((p) => p.code === "PR")?.current_score ?? 79.2;

  const composite = calculateCompositeNirfScore(tlr, rpc, go, oi, pr);

  return {
    compositeScore: composite,
    projectedEngineeringRank: 14,
    projectedOverallRank: 22,
    projectedResearchRank: 19,
    previousEngineeringRank: 18,
    dataReadinessPercentage: 96.8,
    totalVerifiedMetrics: metricsState.filter((m) => m.audit_status === "verified").length,
    parameters: [...parametersState],
    dossiers: [...dossiersState],
    benchmarks: [...benchmarksState],
    metrics: [...metricsState],
  };
}

export function createNirfDossier(data: {
  category: NirfCategory;
  academic_year: string;
  submitted_by: string;
  approving_authority: string;
  composite_score?: number;
  projected_rank_range?: string;
  previous_year_rank?: number;
}): NirfDossier {
  const dossier_code = generateNirfDossierToken(data.category);
  const verification_hash = generateNirfVerificationHash(dossier_code);
  const composite_score = data.composite_score ?? 82.85;

  const newDossier: NirfDossier = {
    id: `dossier-${Date.now()}`,
    dossier_code,
    academic_year: data.academic_year,
    category: data.category,
    composite_score,
    projected_rank_range: data.projected_rank_range ?? "Rank #12 – #16",
    previous_year_rank: data.previous_year_rank ?? 18,
    submitted_by: data.submitted_by,
    approving_authority: data.approving_authority,
    verification_hash,
    status: "internal_audit",
    submission_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  dossiersState = [newDossier, ...dossiersState];
  return newDossier;
}

export function addNirfDataMetric(metric: {
  parameter_code: NirfParameterCode;
  metric_code: string;
  metric_title: string;
  department: string;
  reported_value: string;
  benchmark_value: string;
  weightage: number;
  score_achieved: number;
  verified_by: string;
  evidence_url?: string;
}): NirfDataMetric {
  const newMetric: NirfDataMetric = {
    id: `metric-${Date.now()}`,
    parameter_code: metric.parameter_code,
    metric_code: metric.metric_code,
    metric_title: metric.metric_title,
    department: metric.department,
    reported_value: metric.reported_value,
    benchmark_value: metric.benchmark_value,
    weightage: metric.weightage,
    score_achieved: metric.score_achieved,
    verified_by: metric.verified_by,
    audit_status: "verified",
    evidence_url: metric.evidence_url,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  metricsState = [newMetric, ...metricsState];
  return newMetric;
}
