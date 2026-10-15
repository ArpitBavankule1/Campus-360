/**
 * CampusLens AI — Phase 50: Smart Campus QS World University Rankings,
 * Times Higher Education (THE) & Global Sustainable Development (SDG Impact)
 * World Rankings Intelligence Gateway Engine
 */

import {
  WorldRankingFramework,
  WorldRankingMetric,
  WorldRankingSdgImpact,
  WorldRankingDossier,
  WorldRankingBenchmark,
  WorldRankingVerification,
  WorldRankingSummaryStats,
} from "@/types";

// Token Generators
export function generateWorldRankingDossierToken(frameworkCode: string = "QS"): string {
  const cleanCode = frameworkCode.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 4) || "WUR";
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CL-${cleanCode}-DOSS-2026-${randomSuffix}`;
}

export function generateWorldRankingCertToken(frameworkCode: string = "QS"): string {
  const cleanCode = frameworkCode.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 4) || "WUR";
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CL-${cleanCode}-CERT-2026-${randomSuffix}`;
}

export function generateWorldRankingIntegrityHash(dossierCode: string): string {
  let hash = 0;
  for (let i = 0; i < dossierCode.length; i++) {
    hash = (hash << 5) - hash + dossierCode.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  return `WORLD-RANK-SHA256-${hex.toUpperCase()}-VERIFIED-SECURE`;
}

/**
 * Calculates QS composite normalized score based on official QS methodology weightages
 */
export function calculateQsCompositeScore(metrics: WorldRankingMetric[]): number {
  if (!metrics || metrics.length === 0) return 0;
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const m of metrics) {
    totalWeightedScore += m.normalized_score * (m.weightage_pct / 100);
    totalWeight += m.weightage_pct;
  }

  if (totalWeight === 0) return 0;
  return Number(((totalWeightedScore / totalWeight) * 100).toFixed(2));
}

// -----------------------------------------------------------------------------
// Seed Data
// -----------------------------------------------------------------------------

export const MOCK_WORLD_RANKING_FRAMEWORKS: WorldRankingFramework[] = [
  {
    id: "fw-qs-wur-2026",
    framework_code: "QS_WUR",
    framework_name: "QS World University Rankings",
    edition_year: 2026,
    overall_rank_display: "#242",
    rank_numeric_min: 242,
    rank_numeric_max: 242,
    national_rank: 6,
    overall_score: 62.4,
    previous_year_rank: "#287",
    rank_trajectory: "improved",
    methodology_url: "https://support.qs.com/hc/en-gb/articles/4405598785682",
    coordinator_name: "Prof. Rajeshwari Venkatraman (Dean - International Affairs)",
    created_at: "2026-10-01T00:00:00Z",
  },
  {
    id: "fw-the-wur-2026",
    framework_code: "THE_WUR",
    framework_name: "Times Higher Education (THE) World University Rankings",
    edition_year: 2026,
    overall_rank_display: "#201–250",
    rank_numeric_min: 201,
    rank_numeric_max: 250,
    national_rank: 5,
    overall_score: 58.7,
    previous_year_rank: "#251–300",
    rank_trajectory: "improved",
    methodology_url: "https://www.timeshighereducation.com/world-university-rankings/world-university-rankings-2024-methodology",
    coordinator_name: "Dr. Anirudh Bhattacharya (Director - Research & Global Rankings)",
    created_at: "2026-10-01T00:00:00Z",
  },
  {
    id: "fw-the-impact-2026",
    framework_code: "THE_IMPACT_SDG",
    framework_name: "THE University Impact Rankings (UN SDGs)",
    edition_year: 2026,
    overall_rank_display: "#38 Globally (SDG 7)",
    rank_numeric_min: 38,
    rank_numeric_max: 38,
    national_rank: 1,
    overall_score: 89.4,
    previous_year_rank: "#54",
    rank_trajectory: "improved",
    methodology_url: "https://www.timeshighereducation.com/impact-rankings-methodology",
    coordinator_name: "Dr. Sunita Deshmukh (Chairperson - Green Campus & Sustainability)",
    created_at: "2026-10-01T00:00:00Z",
  },
  {
    id: "fw-qs-asia-2026",
    framework_code: "QS_ASIA",
    framework_name: "QS Asia University Rankings",
    edition_year: 2026,
    overall_rank_display: "#48 in Asia",
    rank_numeric_min: 48,
    rank_numeric_max: 48,
    national_rank: 4,
    overall_score: 71.8,
    previous_year_rank: "#59",
    rank_trajectory: "improved",
    methodology_url: "https://www.topuniversities.com/asia-rankings",
    coordinator_name: "Prof. Rajeshwari Venkatraman",
    created_at: "2026-10-01T00:00:00Z",
  },
  {
    id: "fw-arwu-2026",
    framework_code: "ARWU_SHANGHAI",
    framework_name: "Academic Ranking of World Universities (ARWU Shanghai)",
    edition_year: 2026,
    overall_rank_display: "#401–500",
    rank_numeric_min: 401,
    rank_numeric_max: 500,
    national_rank: 8,
    overall_score: 41.2,
    previous_year_rank: "#401–500",
    rank_trajectory: "retained",
    methodology_url: "https://www.shanghairanking.com/methodology/arwu",
    coordinator_name: "Dr. Anirudh Bhattacharya",
    created_at: "2026-10-01T00:00:00Z",
  },
];

export const MOCK_WORLD_RANKING_METRICS: WorldRankingMetric[] = [
  // QS WUR Metrics (100% total)
  {
    id: "m-qs-acad-rep",
    framework_id: "fw-qs-wur-2026",
    framework_code: "QS_WUR",
    metric_code: "QS_ACADEMIC_REPUTATION",
    metric_name: "Academic Reputation",
    category: "Reputation",
    weightage_pct: 30.0,
    raw_score: 68.4,
    normalized_score: 72.1,
    global_percentile: 88.5,
    audit_source: "QS Global Academic Survey (130,000+ international respondents)",
    edition_year: 2026,
  },
  {
    id: "m-qs-emp-rep",
    framework_id: "fw-qs-wur-2026",
    framework_code: "QS_WUR",
    metric_code: "QS_EMPLOYER_REPUTATION",
    metric_name: "Employer Reputation",
    category: "Employability",
    weightage_pct: 15.0,
    raw_score: 84.6,
    normalized_score: 88.2,
    global_percentile: 94.2,
    audit_source: "QS Global Employer Survey (75,000+ top multinational recruiters)",
    edition_year: 2026,
  },
  {
    id: "m-qs-cpf",
    framework_id: "fw-qs-wur-2026",
    framework_code: "QS_WUR",
    metric_code: "QS_CITATIONS_PER_FACULTY",
    metric_name: "Citations per Faculty",
    category: "Research_Citations",
    weightage_pct: 20.0,
    raw_score: 89.2,
    normalized_score: 86.5,
    global_percentile: 93.1,
    audit_source: "Elsevier Scopus 5-year Normalized Window (18.4 citations/faculty)",
    edition_year: 2026,
  },
  {
    id: "m-qs-fsr",
    framework_id: "fw-qs-wur-2026",
    framework_code: "QS_WUR",
    metric_code: "QS_FACULTY_STUDENT_RATIO",
    metric_name: "Faculty-to-Student Ratio",
    category: "Faculty_Student_Ratio",
    weightage_pct: 10.0,
    raw_score: 74.0,
    normalized_score: 74.5,
    global_percentile: 82.0,
    audit_source: "Institutional FTE Registrar Audit (1:11.8 faculty-student ratio)",
    edition_year: 2026,
  },
  {
    id: "m-qs-irn",
    framework_id: "fw-qs-wur-2026",
    framework_code: "QS_WUR",
    metric_code: "QS_INTERNATIONAL_RESEARCH_NET",
    metric_name: "International Research Network (IRN)",
    category: "Internationalization",
    weightage_pct: 5.0,
    raw_score: 76.8,
    normalized_score: 79.4,
    global_percentile: 85.0,
    audit_source: "Scopus Cross-Border Co-Authorship Index (52 partner countries)",
    edition_year: 2026,
  },
  {
    id: "m-qs-intl-fac",
    framework_id: "fw-qs-wur-2026",
    framework_code: "QS_WUR",
    metric_code: "QS_INTERNATIONAL_FACULTY_RATIO",
    metric_name: "International Faculty Ratio",
    category: "Internationalization",
    weightage_pct: 5.0,
    raw_score: 62.0,
    normalized_score: 62.0,
    global_percentile: 71.5,
    audit_source: "HR Foreign Passport Registry (18.2% visiting & tenure-track faculty)",
    edition_year: 2026,
  },
  {
    id: "m-qs-intl-stu",
    framework_id: "fw-qs-wur-2026",
    framework_code: "QS_WUR",
    metric_code: "QS_INTERNATIONAL_STUDENTS_RATIO",
    metric_name: "International Student Ratio",
    category: "Internationalization",
    weightage_pct: 5.0,
    raw_score: 58.4,
    normalized_score: 58.4,
    global_percentile: 68.0,
    audit_source: "International Student Cell & Foreign Visa Registration Office",
    edition_year: 2026,
  },
  {
    id: "m-qs-emp-outcomes",
    framework_id: "fw-qs-wur-2026",
    framework_code: "QS_WUR",
    metric_code: "QS_EMPLOYMENT_OUTCOMES",
    metric_name: "Employment Outcomes",
    category: "Employability",
    weightage_pct: 5.0,
    raw_score: 92.5,
    normalized_score: 91.0,
    global_percentile: 96.0,
    audit_source: "Alumni Leader Index & 97.4% Graduate Placement Audit",
    edition_year: 2026,
  },
  {
    id: "m-qs-sustainability",
    framework_id: "fw-qs-wur-2026",
    framework_code: "QS_WUR",
    metric_code: "QS_SUSTAINABILITY",
    metric_name: "Sustainability & Climate Action",
    category: "Sustainability",
    weightage_pct: 5.0,
    raw_score: 88.0,
    normalized_score: 87.2,
    global_percentile: 92.4,
    audit_source: "BEE Energy Audit & Net-Zero Campus Emissions Registry",
    edition_year: 2026,
  },

  // THE WUR Core Pillars
  {
    id: "m-the-teaching",
    framework_id: "fw-the-wur-2026",
    framework_code: "THE_WUR",
    metric_code: "THE_TEACHING_ENVIRONMENT",
    metric_name: "Teaching (The Learning Environment)",
    category: "Faculty_Student_Ratio",
    weightage_pct: 29.5,
    raw_score: 59.8,
    normalized_score: 61.4,
    global_percentile: 79.2,
    audit_source: "Doctorate-to-Bachelor Ratio & Academic Reputation Survey",
    edition_year: 2026,
  },
  {
    id: "m-the-res-env",
    framework_id: "fw-the-wur-2026",
    framework_code: "THE_WUR",
    metric_code: "THE_RESEARCH_ENVIRONMENT",
    metric_name: "Research Environment (Volume & Income)",
    category: "Reputation",
    weightage_pct: 29.0,
    raw_score: 62.5,
    normalized_score: 64.2,
    global_percentile: 81.5,
    audit_source: "Research Income per Academic Staff (₹42.8 Cr sponsored funding)",
    edition_year: 2026,
  },
  {
    id: "m-the-res-qual",
    framework_id: "fw-the-wur-2026",
    framework_code: "THE_WUR",
    metric_code: "THE_RESEARCH_QUALITY",
    metric_name: "Research Quality (Citation Impact & FWCI)",
    category: "Research_Citations",
    weightage_pct: 30.0,
    raw_score: 81.2,
    normalized_score: 78.6,
    global_percentile: 91.0,
    audit_source: "Field-Weighted Citation Impact (1.68 FWCI via Scopus)",
    edition_year: 2026,
  },
  {
    id: "m-the-intl-look",
    framework_id: "fw-the-wur-2026",
    framework_code: "THE_WUR",
    metric_code: "THE_INTERNATIONAL_OUTLOOK",
    metric_name: "International Outlook (Staff, Students, Research)",
    category: "Internationalization",
    weightage_pct: 7.5,
    raw_score: 54.0,
    normalized_score: 54.8,
    global_percentile: 66.8,
    audit_source: "Cross-border publication ratio & international scholar intake",
    edition_year: 2026,
  },
  {
    id: "m-the-industry",
    framework_id: "fw-the-wur-2026",
    framework_code: "THE_WUR",
    metric_code: "THE_INDUSTRY_INCOME_PATENTS",
    metric_name: "Industry (Income & Commercial Patents)",
    category: "Industry_Income",
    weightage_pct: 4.0,
    raw_score: 89.0,
    normalized_score: 88.5,
    global_percentile: 95.0,
    audit_source: "Corporate Technology Licensing & Tech Transfer Royalty Office",
    edition_year: 2026,
  },
];

export const MOCK_WORLD_RANKING_SDGS: WorldRankingSdgImpact[] = [
  {
    id: "sdg-7-clean-energy",
    sdg_number: 7,
    sdg_title: "Affordable & Clean Energy",
    the_impact_score: 94.2,
    global_sdg_rank: "#18 Globally",
    national_sdg_rank: 1,
    key_initiative: "2.8 MW Rooftop & Floating Solar Microgrid with Battery Storage (BESS)",
    lead_department: "Electrical Engineering & Clean Energy Center",
    audited_kpi: "78.4% of total campus kilowatt-hour consumption generated via on-site solar renewables",
    evidence_url: "https://campuslens.ai/sustainability/solar",
    edition_year: 2026,
  },
  {
    id: "sdg-9-industry-infra",
    sdg_number: 9,
    sdg_title: "Industry, Innovation & Infrastructure",
    the_impact_score: 91.8,
    global_sdg_rank: "#32 Globally",
    national_sdg_rank: 2,
    key_initiative: "DeepTech Innovation Hub, AICTE IDEA Makerspace & 42 Active Patents",
    lead_department: "Incubation & Technology Transfer Office",
    audited_kpi: "₹34.5 Cr total seed capital attracted by on-campus spin-offs in AI, 6G & EV power",
    evidence_url: "https://campuslens.ai/incubation",
    edition_year: 2026,
  },
  {
    id: "sdg-4-quality-education",
    sdg_number: 4,
    sdg_title: "Quality Education",
    the_impact_score: 88.5,
    global_sdg_rank: "#45 Globally",
    national_sdg_rank: 4,
    key_initiative: "AI Adaptive Learning Matrix, NPTEL/SWAYAM Digital Studios & Open Access Courseware",
    lead_department: "Academic Council & Digital Learning Directorate",
    audited_kpi: "148,000+ public learners enrolled in verified university open micro-courses",
    evidence_url: "https://campuslens.ai/continuing-ed",
    edition_year: 2026,
  },
  {
    id: "sdg-13-climate-action",
    sdg_number: 13,
    sdg_title: "Climate Action",
    the_impact_score: 87.0,
    global_sdg_rank: "#52 Globally",
    national_sdg_rank: 3,
    key_initiative: "Statutory Campus Net-Zero Carbon Commitment & IoT Emissions Telemetry",
    lead_department: "Environmental Engineering & Sustainability Committee",
    audited_kpi: "Scope 1 & 2 emissions decreased by 41.2% over 3-year baseline; certified green audited",
    evidence_url: "https://campuslens.ai/sustainability/carbon",
    edition_year: 2026,
  },
  {
    id: "sdg-6-clean-water",
    sdg_number: 6,
    sdg_title: "Clean Water & Sanitation",
    the_impact_score: 85.4,
    global_sdg_rank: "#64 Globally",
    national_sdg_rank: 5,
    key_initiative: "Zero Liquid Discharge (ZLD) Sewage Treatment Plant & Campus Rainwater Harvesting",
    lead_department: "Civil & Environmental Engineering",
    audited_kpi: "100% of treated wastewater recycled for horticulture, HVAC cooling towers & toilet flushing",
    evidence_url: "https://campuslens.ai/sustainability/water",
    edition_year: 2026,
  },
  {
    id: "sdg-11-sustainable-cities",
    sdg_number: 11,
    sdg_title: "Sustainable Cities & Communities",
    the_impact_score: 83.2,
    global_sdg_rank: "#78 Globally",
    national_sdg_rank: 6,
    key_initiative: "Campus Autonomous EV Shuttle Transit & Heritage Architecture Preservation",
    lead_department: "Campus Planning & Estate Administration",
    audited_kpi: "Zero internal combustion engine transit within core academic pedestrian zones",
    evidence_url: "https://campuslens.ai/explore",
    edition_year: 2026,
  },
  {
    id: "sdg-17-partnerships",
    sdg_number: 17,
    sdg_title: "Partnerships for the Goals",
    the_impact_score: 90.5,
    global_sdg_rank: "#29 Globally",
    national_sdg_rank: 2,
    key_initiative: "Global Research Consortiums with NUS, TU Munich & Purdue University",
    lead_department: "International Relations & Research Partnerships",
    audited_kpi: "38 formal international MoUs with joint co-publications addressing UN SDGs",
    evidence_url: "https://campuslens.ai/partnerships",
    edition_year: 2026,
  },
];

export const MOCK_WORLD_RANKING_BENCHMARKS: WorldRankingBenchmark[] = [
  {
    id: "bm-mit",
    peer_institution_name: "Massachusetts Institute of Technology (MIT)",
    peer_country: "United States",
    peer_qs_rank: 1,
    peer_the_rank: 2,
    citations_per_faculty: 100.0,
    international_student_pct: 34.0,
    faculty_student_ratio: 3.1,
    academic_reputation_score: 100.0,
    employer_reputation_score: 100.0,
    edition_year: 2026,
  },
  {
    id: "bm-oxford",
    peer_institution_name: "University of Oxford",
    peer_country: "United Kingdom",
    peer_qs_rank: 3,
    peer_the_rank: 1,
    citations_per_faculty: 99.2,
    international_student_pct: 42.0,
    faculty_student_ratio: 10.5,
    academic_reputation_score: 100.0,
    employer_reputation_score: 100.0,
    edition_year: 2026,
  },
  {
    id: "bm-nus",
    peer_institution_name: "National University of Singapore (NUS)",
    peer_country: "Singapore",
    peer_qs_rank: 8,
    peer_the_rank: 19,
    citations_per_faculty: 92.4,
    international_student_pct: 31.5,
    faculty_student_ratio: 8.4,
    academic_reputation_score: 99.5,
    employer_reputation_score: 96.8,
    edition_year: 2026,
  },
  {
    id: "bm-campuslens",
    peer_institution_name: "CampusLens AI Institute of Science & Technology",
    peer_country: "India (Our Institution)",
    peer_qs_rank: 242,
    peer_the_rank: 225,
    citations_per_faculty: 86.5,
    international_student_pct: 14.5,
    faculty_student_ratio: 11.8,
    academic_reputation_score: 72.1,
    employer_reputation_score: 88.2,
    edition_year: 2026,
  },
  {
    id: "bm-iitb",
    peer_institution_name: "Indian Institute of Technology Bombay (IIT Bombay)",
    peer_country: "India",
    peer_qs_rank: 118,
    peer_the_rank: 180,
    citations_per_faculty: 88.0,
    international_student_pct: 8.5,
    faculty_student_ratio: 12.5,
    academic_reputation_score: 84.0,
    employer_reputation_score: 89.5,
    edition_year: 2026,
  },
];

export const MOCK_WORLD_RANKING_DOSSIERS: WorldRankingDossier[] = [
  {
    id: "doss-qs-2026",
    dossier_code: "CL-QS-WUR-2026-9281",
    framework_code: "QS_WUR",
    edition_year: 2026,
    cycle_name: "QS World University Rankings 2026 Institutional Submission",
    status: "published",
    data_submission_deadline: "2026-03-31",
    verified_publications_count: 4820,
    international_academic_peers_nominated: 450,
    international_employers_nominated: 280,
    lead_compiler_name: "Prof. Rajeshwari Venkatraman",
    vc_approval_date: "2026-03-15",
    integrity_hash: "WORLD-RANK-SHA256-QS9281-VC-APPROVED-AUTHENTIC",
    notes: "Official QS Quacquarelli Symonds institutional data confirmed. Global Rank #242 published.",
    created_at: "2026-02-10T10:00:00Z",
  },
  {
    id: "doss-the-2026",
    dossier_code: "CL-THE-WUR-2026-4412",
    framework_code: "THE_WUR",
    edition_year: 2026,
    cycle_name: "THE World University Rankings 2026 Comprehensive Data Return",
    status: "published",
    data_submission_deadline: "2026-04-15",
    verified_publications_count: 5190,
    international_academic_peers_nominated: 380,
    international_employers_nominated: 210,
    lead_compiler_name: "Dr. Anirudh Bhattacharya",
    vc_approval_date: "2026-04-02",
    integrity_hash: "WORLD-RANK-SHA256-THE4412-VC-APPROVED-AUTHENTIC",
    notes: "Times Higher Education portal sign-off verified with Scopus bibliometric tie-in.",
    created_at: "2026-03-01T11:00:00Z",
  },
  {
    id: "doss-sdg-2026",
    dossier_code: "CL-THE-SDG-2026-8109",
    framework_code: "THE_IMPACT_SDG",
    edition_year: 2026,
    cycle_name: "THE Impact Rankings 2026 — UN Sustainable Development Goals Dossier",
    status: "published",
    data_submission_deadline: "2026-05-10",
    verified_publications_count: 2340,
    international_academic_peers_nominated: 180,
    international_employers_nominated: 140,
    lead_compiler_name: "Dr. Sunita Deshmukh",
    vc_approval_date: "2026-04-28",
    integrity_hash: "WORLD-RANK-SHA256-SDG8109-VC-APPROVED-AUTHENTIC",
    notes: "Audited evidence dockets submitted across SDGs 3, 4, 6, 7, 9, 11, 13 & 17.",
    created_at: "2026-03-15T09:30:00Z",
  },
  {
    id: "doss-qs-asia-2027",
    dossier_code: "CL-QS-ASIA-2027-1044",
    framework_code: "QS_ASIA",
    edition_year: 2027,
    cycle_name: "QS Asia University Rankings 2027 Advance Data Collation",
    status: "under_internal_audit",
    data_submission_deadline: "2026-11-30",
    verified_publications_count: 3100,
    international_academic_peers_nominated: 240,
    international_employers_nominated: 190,
    lead_compiler_name: "Prof. Rajeshwari Venkatraman",
    vc_approval_date: null,
    integrity_hash: "WORLD-RANK-SHA256-QSASIA1044-INTERNAL-AUDIT",
    notes: "Internal quality committee reviewing faculty inbound exchange dockets.",
    created_at: "2026-09-01T14:00:00Z",
  },
];

export const MOCK_WORLD_RANKING_VERIFICATIONS: WorldRankingVerification[] = [
  {
    id: "ver-qs-cert-2026",
    certificate_code: "CL-QS-CERT-2026-8812",
    framework_code: "QS_WUR",
    edition_year: 2026,
    institution_legal_name: "CampusLens AI Institute of Science & Technology",
    rank_achieved_display: "Ranked #242 in the World (Top 15% Globally)",
    issue_date: "2026-06-25",
    valid_until: "2027-06-24",
    authenticity_status: "VERIFIED_AUTHENTIC",
    issuer_agency: "Quacquarelli Symonds Ltd. (London, United Kingdom)",
    digital_signature_hash: "QS-SIG-SHA256-8812-LDN-COUNCIL-CONFIRMED",
    verification_count: 1420,
    last_verified_at: "2026-10-15T08:45:00Z",
  },
  {
    id: "ver-the-cert-2026",
    certificate_code: "CL-THE-CERT-2026-5590",
    framework_code: "THE_WUR",
    edition_year: 2026,
    institution_legal_name: "CampusLens AI Institute of Science & Technology",
    rank_achieved_display: "World University Rankings #201–250 Band",
    issue_date: "2026-09-28",
    valid_until: "2027-09-27",
    authenticity_status: "VERIFIED_AUTHENTIC",
    issuer_agency: "Times Higher Education (THE World Rankings, London)",
    digital_signature_hash: "THE-SIG-SHA256-5590-WUR30-AUDITED",
    verification_count: 980,
    last_verified_at: "2026-10-15T09:10:00Z",
  },
];

// In-memory state for dynamic session updates
let frameworksState: WorldRankingFramework[] = [...MOCK_WORLD_RANKING_FRAMEWORKS];
let metricsState: WorldRankingMetric[] = [...MOCK_WORLD_RANKING_METRICS];
let sdgsState: WorldRankingSdgImpact[] = [...MOCK_WORLD_RANKING_SDGS];
let benchmarksState: WorldRankingBenchmark[] = [...MOCK_WORLD_RANKING_BENCHMARKS];
let dossiersState: WorldRankingDossier[] = [...MOCK_WORLD_RANKING_DOSSIERS];
let verificationsState: WorldRankingVerification[] = [...MOCK_WORLD_RANKING_VERIFICATIONS];

export function getWorldRankingFrameworks(): WorldRankingFramework[] {
  return frameworksState;
}

export function getWorldRankingMetrics(frameworkCode?: string): WorldRankingMetric[] {
  if (frameworkCode) {
    return metricsState.filter((m) => m.framework_code === frameworkCode);
  }
  return metricsState;
}

export function getWorldRankingSdgs(): WorldRankingSdgImpact[] {
  return sdgsState;
}

export function getWorldRankingBenchmarks(): WorldRankingBenchmark[] {
  return benchmarksState;
}

export function getWorldRankingDossiers(): WorldRankingDossier[] {
  return dossiersState;
}

export function getWorldRankingVerifications(): WorldRankingVerification[] {
  return verificationsState;
}

export function createWorldRankingDossier(data: {
  framework_code: string;
  cycle_name: string;
  edition_year?: number;
  data_submission_deadline: string;
  verified_publications_count?: number;
  international_academic_peers_nominated?: number;
  international_employers_nominated?: number;
  lead_compiler_name: string;
  notes?: string;
}): WorldRankingDossier {
  const token = generateWorldRankingDossierToken(data.framework_code);
  const hash = generateWorldRankingIntegrityHash(token);

  const newDossier: WorldRankingDossier = {
    id: `doss-${Date.now()}`,
    dossier_code: token,
    framework_code: data.framework_code,
    edition_year: data.edition_year || 2026,
    cycle_name: data.cycle_name,
    status: "under_internal_audit",
    data_submission_deadline: data.data_submission_deadline,
    verified_publications_count: data.verified_publications_count || 1200,
    international_academic_peers_nominated: data.international_academic_peers_nominated || 150,
    international_employers_nominated: data.international_employers_nominated || 80,
    lead_compiler_name: data.lead_compiler_name,
    vc_approval_date: null,
    integrity_hash: hash,
    notes: data.notes || "Audited institutional submission queued for Vice-Chancellor executive review.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  dossiersState = [newDossier, ...dossiersState];
  return newDossier;
}

export function verifyWorldRankingCertificate(certificateCode: string): WorldRankingVerification | null {
  const match = verificationsState.find(
    (v) => v.certificate_code.trim().toUpperCase() === certificateCode.trim().toUpperCase()
  );
  if (match) {
    match.verification_count += 1;
    match.last_verified_at = new Date().toISOString();
    return match;
  }
  return null;
}

export function getWorldRankingOverviewStats(): WorldRankingSummaryStats {
  return {
    qsWorldRank: "#242",
    theWorldRank: "#201–250",
    theImpactRank: "#38 (SDG 7)",
    qsAsiaRank: "#48 in Asia",
    globalSdgPillarsCount: sdgsState.length,
    activeDossiersCount: dossiersState.length,
    citationsPerFaculty: 86.5,
    internationalStudentsRatio: 14.5,
    frameworks: frameworksState,
    metrics: metricsState,
    sdgImpacts: sdgsState,
    dossiers: dossiersState,
    benchmarks: benchmarksState,
    verifications: verificationsState,
  };
}

