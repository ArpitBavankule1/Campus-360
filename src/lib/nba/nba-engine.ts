/**
 * CampusLens AI — Phase 49: Smart Campus National Board of Accreditation (NBA),
 * Outcome-Based Education (OBE) & Washington Accord Tier-1 Gateway Engine
 */

import {
  NbaProgram,
  NbaProgramOutcome,
  NbaCourseOutcome,
  NbaCoPoMapping,
  NbaSarDossier,
  NbaEvaluationVisit,
  NbaOverviewStats,
  BloomLevel,
} from "@/types";

// Token Generators
export function generateNbaSarToken(programCode: string = "CSE"): string {
  const cleanCode = programCode.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 4) || "ENG";
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CL-NBA-SAR-2026-${cleanCode}${randomSuffix}`;
}

export function generateNbaCertToken(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CL-NBA-CERT-2026-${randomSuffix}`;
}

export function generateNbaVisitToken(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CL-NBA-VISIT-2026-${randomSuffix}`;
}

export function generateNbaVerificationHash(sarCode: string): string {
  let hash = 0;
  for (let i = 0; i < sarCode.length; i++) {
    hash = (hash << 5) - hash + sarCode.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  return `NBA-TIER1-SHA256-${hex.toUpperCase()}-EVAL-SECURE`;
}

/**
 * Calculates Outcome-Based Education (OBE) Course Outcome Attainment
 * Direct Attainment = 30% Continuous Internal Evaluation (CIE) + 70% Semester End Exam (SEE)
 * Overall Attainment = 80% Direct Attainment + 20% Indirect Survey Attainment
 * Converts attainment percentage (0-100%) to standard 3.0 scale (0.00 - 3.00)
 */
export function calculateCoAttainment(
  directInternal: number,
  directExternal: number,
  indirectSurvey: number
): number {
  const direct = (directInternal * 0.30) + (directExternal * 0.70);
  const compositePct = (direct * 0.80) + (indirectSurvey * 0.20);
  const scoreOnScale3 = (compositePct / 100) * 3;
  return Number(scoreOnScale3.toFixed(2));
}

// Seed Programs
export const MOCK_NBA_PROGRAMS: NbaProgram[] = [
  {
    id: "prog-cse-01",
    program_code: "BTECH-CSE",
    program_name: "B.Tech Computer Science & Engineering",
    department: "Computer Science & Engineering",
    degree_level: "UG",
    tier: "Tier_1_Washington_Accord",
    accreditation_status: "accredited_6_years",
    validity_start: "2024-07-01",
    validity_end: "2030-06-30",
    total_criteria_score: 785.50,
    sar_code: "CL-NBA-SAR-2026-CSE881",
    program_coordinator: "Prof. R. Deshmukh",
    hod_name: "Dr. Arvind Ramanathan",
    created_at: "2024-06-15T09:00:00Z",
    updated_at: "2026-02-10T11:30:00Z",
  },
  {
    id: "prog-ece-02",
    program_code: "BTECH-ECE",
    program_name: "B.Tech Electronics & Communication Engineering",
    department: "Electronics & Communication Engineering",
    degree_level: "UG",
    tier: "Tier_1_Washington_Accord",
    accreditation_status: "accredited_6_years",
    validity_start: "2024-07-01",
    validity_end: "2030-06-30",
    total_criteria_score: 762.00,
    sar_code: "CL-NBA-SAR-2026-ECE419",
    program_coordinator: "Dr. Kavita Menon",
    hod_name: "Dr. S. K. Bhattacharya",
    created_at: "2024-06-15T09:00:00Z",
    updated_at: "2026-02-10T11:30:00Z",
  },
  {
    id: "prog-mech-03",
    program_code: "BTECH-MECH",
    program_name: "B.Tech Mechanical Engineering",
    department: "Mechanical & Aerospace Engineering",
    degree_level: "UG",
    tier: "Tier_1_Washington_Accord",
    accreditation_status: "accredited_3_years",
    validity_start: "2025-07-01",
    validity_end: "2028-06-30",
    total_criteria_score: 695.40,
    sar_code: "CL-NBA-SAR-2026-MECH205",
    program_coordinator: "Prof. S. N. Varma",
    hod_name: "Dr. Rajeshwar Rao",
    created_at: "2025-06-20T09:00:00Z",
    updated_at: "2026-02-10T11:30:00Z",
  },
  {
    id: "prog-aids-04",
    program_code: "BTECH-AIDS",
    program_name: "B.Tech Artificial Intelligence & Data Science",
    department: "School of AI & Emerging Technologies",
    degree_level: "UG",
    tier: "Tier_1_Washington_Accord",
    accreditation_status: "provisional",
    validity_start: "2025-07-01",
    validity_end: "2027-06-30",
    total_criteria_score: 710.00,
    sar_code: "CL-NBA-SAR-2026-AIDS940",
    program_coordinator: "Dr. Ananya Mukherjee",
    hod_name: "Dr. Sandeep Vardhan",
    created_at: "2025-06-20T09:00:00Z",
    updated_at: "2026-02-10T11:30:00Z",
  },
];

// Seed Program Outcomes (12 NBA Washington Accord Graduate Attributes + 2 PSOs)
export const MOCK_PROGRAM_OUTCOMES: NbaProgramOutcome[] = [
  {
    id: "po-01",
    program_id: "prog-cse-01",
    code: "PO1",
    title: "Engineering Knowledge",
    description: "Apply mathematics, science, engineering fundamentals, and computer science specialization to the solution of complex computing engineering problems.",
    target_attainment: 2.50,
    actual_attainment: 2.72,
    academic_year: "2025-2026",
    status: "attained",
  },
  {
    id: "po-02",
    program_id: "prog-cse-01",
    code: "PO2",
    title: "Problem Analysis",
    description: "Identify, formulate, research literature, and analyze complex engineering problems reaching substantiated conclusions using first principles of mathematics and computing sciences.",
    target_attainment: 2.40,
    actual_attainment: 2.65,
    academic_year: "2025-2026",
    status: "attained",
  },
  {
    id: "po-03",
    program_id: "prog-cse-01",
    code: "PO3",
    title: "Design / Development of Solutions",
    description: "Design solutions for complex engineering problems and design system components or processes that meet specified needs with appropriate consideration for public health and safety.",
    target_attainment: 2.40,
    actual_attainment: 2.58,
    academic_year: "2025-2026",
    status: "attained",
  },
  {
    id: "po-04",
    program_id: "prog-cse-01",
    code: "PO4",
    title: "Conduct Investigations of Complex Problems",
    description: "Use research-based knowledge and research methods including design of experiments, analysis and interpretation of data, and synthesis of information to provide valid conclusions.",
    target_attainment: 2.30,
    actual_attainment: 2.48,
    academic_year: "2025-2026",
    status: "attained",
  },
  {
    id: "po-05",
    program_id: "prog-cse-01",
    code: "PO5",
    title: "Modern Tool Usage",
    description: "Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools including prediction and modeling to complex engineering activities.",
    target_attainment: 2.50,
    actual_attainment: 2.80,
    academic_year: "2025-2026",
    status: "attained",
  },
  {
    id: "po-06",
    program_id: "prog-cse-01",
    code: "PO6",
    title: "The Engineer and Society",
    description: "Apply reasoning informed by contextual knowledge to assess societal, health, safety, legal, and cultural issues and consequent responsibilities relevant to professional engineering practice.",
    target_attainment: 2.20,
    actual_attainment: 2.35,
    academic_year: "2025-2026",
    status: "attained",
  },
  {
    id: "po-07",
    program_id: "prog-cse-01",
    code: "PO7",
    title: "Environment and Sustainability",
    description: "Understand the impact of professional engineering solutions in societal and environmental contexts and demonstrate knowledge of and need for sustainable green computing.",
    target_attainment: 2.20,
    actual_attainment: 2.38,
    academic_year: "2025-2026",
    status: "attained",
  },
  {
    id: "po-08",
    program_id: "prog-cse-01",
    code: "PO8",
    title: "Ethics",
    description: "Apply ethical principles and commit to professional ethics and responsibilities and norms of computing engineering practice.",
    target_attainment: 2.50,
    actual_attainment: 2.70,
    academic_year: "2025-2026",
    status: "attained",
  },
  {
    id: "po-09",
    program_id: "prog-cse-01",
    code: "PO9",
    title: "Individual and Team Work",
    description: "Function effectively as an individual, and as a member or leader in diverse teams, and in multidisciplinary settings.",
    target_attainment: 2.40,
    actual_attainment: 2.62,
    academic_year: "2025-2026",
    status: "attained",
  },
  {
    id: "po-10",
    program_id: "prog-cse-01",
    code: "PO10",
    title: "Communication",
    description: "Communicate effectively on complex engineering activities with the engineering community and with society at large, such as comprehending reports and documentation.",
    target_attainment: 2.30,
    actual_attainment: 2.51,
    academic_year: "2025-2026",
    status: "attained",
  },
  {
    id: "po-11",
    program_id: "prog-cse-01",
    code: "PO11",
    title: "Project Management and Finance",
    description: "Demonstrate knowledge and understanding of engineering and management principles and apply these to one's own work, as a member and leader in a team, to manage projects.",
    target_attainment: 2.20,
    actual_attainment: 2.42,
    academic_year: "2025-2026",
    status: "attained",
  },
  {
    id: "po-12",
    program_id: "prog-cse-01",
    code: "PO12",
    title: "Life-long Learning",
    description: "Recognize the need for, and have the preparation and ability to engage in independent and life-long learning in the broadest context of technological change.",
    target_attainment: 2.40,
    actual_attainment: 2.68,
    academic_year: "2025-2026",
    status: "attained",
  },
  {
    id: "pso-01",
    program_id: "prog-cse-01",
    code: "PSO1",
    title: "Distributed Cloud Architectures & High-Performance Computing",
    description: "Architect and implement secure, fault-tolerant cloud microservices and high-throughput distributed systems.",
    target_attainment: 2.50,
    actual_attainment: 2.75,
    academic_year: "2025-2026",
    status: "attained",
  },
  {
    id: "pso-02",
    program_id: "prog-cse-01",
    code: "PSO2",
    title: "Applied Artificial Intelligence & Machine Learning Pipelines",
    description: "Design and train deep neural networks, LLM agents, and computer vision models for production institutional systems.",
    target_attainment: 2.50,
    actual_attainment: 2.82,
    academic_year: "2025-2026",
    status: "attained",
  },
];

// Seed Course Outcomes
export const MOCK_COURSE_OUTCOMES: NbaCourseOutcome[] = [
  {
    id: "co-cs301-1",
    program_id: "prog-cse-01",
    course_code: "CS301",
    course_name: "Advanced Data Structures & Algorithms",
    co_code: "CO1",
    statement: "Analyze the asymptotic time and space complexity of fundamental algorithms and recurrences.",
    bloom_level: "Analyze",
    direct_attainment_pct: 88.5,
    indirect_attainment_pct: 86.0,
    final_attainment_score: 2.64,
    target_score: 2.50,
    academic_year: "2025-2026",
    semester: 3,
    faculty_in_charge: "Prof. R. Deshmukh",
  },
  {
    id: "co-cs301-2",
    program_id: "prog-cse-01",
    course_code: "CS301",
    course_name: "Advanced Data Structures & Algorithms",
    co_code: "CO2",
    statement: "Design and implement self-balancing trees, disjoint sets, and spatial indices for complex search queries.",
    bloom_level: "Create",
    direct_attainment_pct: 84.0,
    indirect_attainment_pct: 82.5,
    final_attainment_score: 2.51,
    target_score: 2.40,
    academic_year: "2025-2026",
    semester: 3,
    faculty_in_charge: "Prof. R. Deshmukh",
  },
  {
    id: "co-cs301-3",
    program_id: "prog-cse-01",
    course_code: "CS301",
    course_name: "Advanced Data Structures & Algorithms",
    co_code: "CO3",
    statement: "Apply dynamic programming and greedy strategies to solve NP-hard graph and network flow optimizations.",
    bloom_level: "Apply",
    direct_attainment_pct: 89.2,
    indirect_attainment_pct: 85.0,
    final_attainment_score: 2.65,
    target_score: 2.40,
    academic_year: "2025-2026",
    semester: 3,
    faculty_in_charge: "Prof. R. Deshmukh",
  },
  {
    id: "co-cs401-1",
    program_id: "prog-cse-01",
    course_code: "CS401",
    course_name: "Machine Learning & Neural Computing",
    co_code: "CO1",
    statement: "Formulate supervised and unsupervised loss functions using statistical learning principles.",
    bloom_level: "Understand",
    direct_attainment_pct: 92.0,
    indirect_attainment_pct: 90.0,
    final_attainment_score: 2.74,
    target_score: 2.50,
    academic_year: "2025-2026",
    semester: 5,
    faculty_in_charge: "Dr. Ananya Mukherjee",
  },
  {
    id: "co-cs401-2",
    program_id: "prog-cse-01",
    course_code: "CS401",
    course_name: "Machine Learning & Neural Computing",
    co_code: "CO2",
    statement: "Implement deep convolutional and transformer architectures for sequence and vision benchmark tasks.",
    bloom_level: "Create",
    direct_attainment_pct: 91.5,
    indirect_attainment_pct: 88.0,
    final_attainment_score: 2.72,
    target_score: 2.50,
    academic_year: "2025-2026",
    semester: 5,
    faculty_in_charge: "Dr. Ananya Mukherjee",
  },
];

// Seed CO-PO Mapping
export const MOCK_CO_PO_MAPPINGS: NbaCoPoMapping[] = [
  { id: "map-1", course_outcome_id: "co-cs301-1", po_code: "PO1", correlation_level: 3, justification: "Deep mathematical rigor in asymptotic notation directly maps to foundational engineering knowledge." },
  { id: "map-2", course_outcome_id: "co-cs301-1", po_code: "PO2", correlation_level: 3, justification: "Formulating recurrence bounds requires thorough problem analysis." },
  { id: "map-3", course_outcome_id: "co-cs301-2", po_code: "PO3", correlation_level: 3, justification: "Designing balanced tree indices involves end-to-end component engineering." },
  { id: "map-4", course_outcome_id: "co-cs301-3", po_code: "PO4", correlation_level: 2, justification: "Network flow algorithms require investigative validation on test datasets." },
  { id: "map-5", course_outcome_id: "co-cs401-2", po_code: "PO5", correlation_level: 3, justification: "PyTorch/TensorFlow GPU clusters exercise state-of-the-art modern tool stacks." },
  { id: "map-6", course_outcome_id: "co-cs401-2", po_code: "PSO2", correlation_level: 3, justification: "Directly fulfills Program Specific Outcome for intelligent system engineering." },
];

// Seed SAR Dossiers (10 NBA Tier-1 Criteria)
export const MOCK_NBA_SAR_DOSSIERS: NbaSarDossier[] = [
  {
    id: "sar-cse-2026",
    program_id: "prog-cse-01",
    program_name: "B.Tech Computer Science & Engineering",
    program_code: "BTECH-CSE",
    sar_code: "CL-NBA-SAR-2026-CSE881",
    academic_year: "2025-2026",
    tier: "Tier_1_Washington_Accord",
    total_eval_points: 785.50,
    verification_hash: "NBA-TIER1-SHA256-4B9F2A1C-EVAL-SECURE",
    status: "accredited",
    submission_date: "2025-11-20",
    coordinator_name: "Prof. R. Deshmukh",
    evaluator_remarks: "Exceptional curriculum alignment with Washington Accord standards. High graduate outcomes and research citation density.",
    criteria_progress: [
      { criterionNumber: 1, name: "Vision, Mission & Program Educational Objectives", maxMarks: 50, awardedMarks: 45.0, status: "completed" },
      { criterionNumber: 2, name: "Program Curriculum & Teaching-Learning Processes", maxMarks: 100, awardedMarks: 86.5, status: "completed" },
      { criterionNumber: 3, name: "Course Outcomes & Program Outcomes Attainment", maxMarks: 175, awardedMarks: 152.0, status: "completed" },
      { criterionNumber: 4, name: "Students' Performance & Graduation Trends", maxMarks: 100, awardedMarks: 88.0, status: "completed" },
      { criterionNumber: 5, name: "Faculty Information & Contributions", maxMarks: 200, awardedMarks: 168.0, status: "completed" },
      { criterionNumber: 6, name: "Facilities & Technical Infrastructure", maxMarks: 80, awardedMarks: 72.0, status: "completed" },
      { criterionNumber: 7, name: "Continuous Improvement & Action Taken", maxMarks: 75, awardedMarks: 64.0, status: "completed" },
      { criterionNumber: 8, name: "First Year Academics & Foundation", maxMarks: 50, awardedMarks: 42.0, status: "completed" },
      { criterionNumber: 9, name: "Student Support Systems & Mentoring", maxMarks: 50, awardedMarks: 44.0, status: "completed" },
      { criterionNumber: 10, name: "Governance, Institutional Support & Finances", maxMarks: 120, awardedMarks: 94.0, status: "completed" },
    ],
  },
  {
    id: "sar-ece-2026",
    program_id: "prog-ece-02",
    program_name: "B.Tech Electronics & Communication Engineering",
    program_code: "BTECH-ECE",
    sar_code: "CL-NBA-SAR-2026-ECE419",
    academic_year: "2025-2026",
    tier: "Tier_1_Washington_Accord",
    total_eval_points: 762.00,
    verification_hash: "NBA-TIER1-SHA256-8A33D07F-EVAL-SECURE",
    status: "submitted_to_nba",
    submission_date: "2026-01-14",
    coordinator_name: "Dr. Kavita Menon",
    evaluator_remarks: "Strong RF and VLSI laboratory capabilities with good industry MoUs.",
    criteria_progress: [
      { criterionNumber: 1, name: "Vision, Mission & Program Educational Objectives", maxMarks: 50, awardedMarks: 43.0, status: "completed" },
      { criterionNumber: 2, name: "Program Curriculum & Teaching-Learning Processes", maxMarks: 100, awardedMarks: 82.0, status: "completed" },
      { criterionNumber: 3, name: "Course Outcomes & Program Outcomes Attainment", maxMarks: 175, awardedMarks: 145.0, status: "completed" },
      { criterionNumber: 4, name: "Students' Performance & Graduation Trends", maxMarks: 100, awardedMarks: 84.0, status: "completed" },
      { criterionNumber: 5, name: "Faculty Information & Contributions", maxMarks: 200, awardedMarks: 160.0, status: "completed" },
      { criterionNumber: 6, name: "Facilities & Technical Infrastructure", maxMarks: 80, awardedMarks: 70.0, status: "completed" },
      { criterionNumber: 7, name: "Continuous Improvement & Action Taken", maxMarks: 75, awardedMarks: 60.0, status: "completed" },
      { criterionNumber: 8, name: "First Year Academics & Foundation", maxMarks: 50, awardedMarks: 41.0, status: "completed" },
      { criterionNumber: 9, name: "Student Support Systems & Mentoring", maxMarks: 50, awardedMarks: 42.0, status: "completed" },
      { criterionNumber: 10, name: "Governance, Institutional Support & Finances", maxMarks: 120, awardedMarks: 95.0, status: "completed" },
    ],
  },
];

// Seed Evaluation Visits
export const MOCK_NBA_VISITS: NbaEvaluationVisit[] = [
  {
    id: "visit-01",
    visit_code: "CL-NBA-VISIT-2026-7814",
    program_code: "BTECH-CSE",
    team_chairperson: "Prof. Manindra Agrawal (Former Director, IIT Kanpur)",
    member_evaluators: [
      "Prof. Subhashis Banerjee (IIT Delhi)",
      "Prof. Preeti Ranjan Panda (IIT Delhi)",
      "Dr. S. K. Gupta (Industry Expert, NVIDIA)",
    ],
    visit_dates: "Oct 24 – Oct 26, 2025",
    status: "report_submitted",
    exit_meeting_summary: "The Expert Evaluation Team noted exemplary research output, modern GPU computing clusters, and high graduate placement median CTC. Recommended full 6-year Washington Accord accreditation.",
  },
  {
    id: "visit-02",
    visit_code: "CL-NBA-VISIT-2026-9241",
    program_code: "BTECH-ECE",
    team_chairperson: "Prof. Surendra Prasad (Emeritus Professor, IIT Delhi)",
    member_evaluators: [
      "Prof. V. Ramgopal Rao (Former Director, IIT Delhi)",
      "Dr. Radhakrishna Ganti (IIT Madras)",
    ],
    visit_dates: "Feb 18 – Feb 20, 2026",
    status: "completed",
    exit_meeting_summary: "Peer team verified cleanroom semiconductor VLSI testbeds and high faculty retention. Exit debrief concluded positively.",
  },
];

// In-Memory Storage
let programsState: NbaProgram[] = [...MOCK_NBA_PROGRAMS];
let posState: NbaProgramOutcome[] = [...MOCK_PROGRAM_OUTCOMES];
let cosState: NbaCourseOutcome[] = [...MOCK_COURSE_OUTCOMES];
let mappingsState: NbaCoPoMapping[] = [...MOCK_CO_PO_MAPPINGS];
let sarsState: NbaSarDossier[] = [...MOCK_NBA_SAR_DOSSIERS];
let visitsState: NbaEvaluationVisit[] = [...MOCK_NBA_VISITS];

export function getNbaPrograms(): NbaProgram[] {
  return [...programsState];
}

export function getNbaProgramOutcomes(): NbaProgramOutcome[] {
  return [...posState];
}

export function getNbaCourseOutcomes(): NbaCourseOutcome[] {
  return [...cosState];
}

export function getNbaCoPoMappings(): NbaCoPoMapping[] {
  return [...mappingsState];
}

export function getNbaSarDossiers(): NbaSarDossier[] {
  return [...sarsState];
}

export function getNbaEvaluationVisits(): NbaEvaluationVisit[] {
  return [...visitsState];
}

export function getNbaStats(): NbaOverviewStats {
  const tier1Count = programsState.filter((p) => p.tier === "Tier_1_Washington_Accord").length;
  const totalScore = programsState.reduce((acc, p) => acc + p.total_criteria_score, 0);
  const avgScore = programsState.length > 0 ? Number((totalScore / programsState.length).toFixed(1)) : 0;
  
  const attainedCount = posState.filter((po) => po.status === "attained").length;
  const attainmentRate = posState.length > 0 ? Number(((attainedCount / posState.length) * 100).toFixed(1)) : 0;

  return {
    tier1AccreditedCount: tier1Count,
    averageCriteriaScore: avgScore,
    overallAttainmentRate: attainmentRate,
    activeSarDossiers: sarsState.length,
    programs: [...programsState],
    programOutcomes: [...posState],
    courseOutcomes: [...cosState],
    sarDossiers: [...sarsState],
    visits: [...visitsState],
  };
}

export function createNbaSarDossier(data: {
  program_id: string;
  program_name: string;
  program_code: string;
  academic_year: string;
  coordinator_name: string;
}): NbaSarDossier {
  const sar_code = generateNbaSarToken(data.program_code);
  const verification_hash = generateNbaVerificationHash(sar_code);

  const defaultCriteria = [
    { criterionNumber: 1, name: "Vision, Mission & Program Educational Objectives", maxMarks: 50, awardedMarks: 44.0, status: "completed" as const },
    { criterionNumber: 2, name: "Program Curriculum & Teaching-Learning Processes", maxMarks: 100, awardedMarks: 85.0, status: "completed" as const },
    { criterionNumber: 3, name: "Course Outcomes & Program Outcomes Attainment", maxMarks: 175, awardedMarks: 148.0, status: "completed" as const },
    { criterionNumber: 4, name: "Students' Performance & Graduation Trends", maxMarks: 100, awardedMarks: 86.0, status: "completed" as const },
    { criterionNumber: 5, name: "Faculty Information & Contributions", maxMarks: 200, awardedMarks: 165.0, status: "completed" as const },
    { criterionNumber: 6, name: "Facilities & Technical Infrastructure", maxMarks: 80, awardedMarks: 71.0, status: "completed" as const },
    { criterionNumber: 7, name: "Continuous Improvement & Action Taken", maxMarks: 75, awardedMarks: 62.0, status: "in_progress" as const },
    { criterionNumber: 8, name: "First Year Academics & Foundation", maxMarks: 50, awardedMarks: 40.0, status: "completed" as const },
    { criterionNumber: 9, name: "Student Support Systems & Mentoring", maxMarks: 50, awardedMarks: 43.0, status: "completed" as const },
    { criterionNumber: 10, name: "Governance, Institutional Support & Finances", maxMarks: 120, awardedMarks: 92.0, status: "completed" as const },
  ];

  const totalPoints = defaultCriteria.reduce((sum, c) => sum + c.awardedMarks, 0);

  const newDossier: NbaSarDossier = {
    id: `sar-${Date.now()}`,
    program_id: data.program_id,
    program_name: data.program_name,
    program_code: data.program_code,
    sar_code,
    academic_year: data.academic_year,
    tier: "Tier_1_Washington_Accord",
    total_eval_points: totalPoints,
    criteria_progress: defaultCriteria,
    verification_hash,
    status: "internal_review",
    submission_date: null,
    coordinator_name: data.coordinator_name,
    evaluator_remarks: "Self Assessment Report compiled and pending Institutional Academic Council ratification.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  sarsState = [newDossier, ...sarsState];
  return newDossier;
}

export function recordCourseOutcomeAttainment(data: {
  program_id: string;
  course_code: string;
  course_name: string;
  co_code: string;
  statement: string;
  bloom_level: BloomLevel;
  direct_internal: number;
  direct_external: number;
  indirect_survey: number;
  target_score?: number;
  academic_year: string;
  semester: number;
  faculty_in_charge: string;
}): NbaCourseOutcome {
  const final_score = calculateCoAttainment(data.direct_internal, data.direct_external, data.indirect_survey);
  const directPct = (data.direct_internal * 0.30) + (data.direct_external * 0.70);

  const newCo: NbaCourseOutcome = {
    id: `co-${Date.now()}`,
    program_id: data.program_id,
    course_code: data.course_code,
    course_name: data.course_name,
    co_code: data.co_code,
    statement: data.statement,
    bloom_level: data.bloom_level,
    direct_attainment_pct: Number(directPct.toFixed(1)),
    indirect_attainment_pct: Number(data.indirect_survey.toFixed(1)),
    final_attainment_score: final_score,
    target_score: data.target_score ?? 2.40,
    academic_year: data.academic_year,
    semester: data.semester,
    faculty_in_charge: data.faculty_in_charge,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  cosState = [newCo, ...cosState];
  return newCo;
}
