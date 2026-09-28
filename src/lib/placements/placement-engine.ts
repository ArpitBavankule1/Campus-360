/**
 * CampusLens AI — Phase 20 Placements, Career Drives & TPC Engine
 * Core business logic for eligibility evaluation, skill matching,
 * CTC analytics, interview round scheduling, and offer letters.
 */

import {
  PlacementDrive,
  PlacementApplication,
  PlacementInterviewRound,
  PlacementOffer,
  InstitutionalPlacementStats,
  DepartmentPlacementStat,
} from "@/types";

export interface StudentPlacementProfile {
  studentId: string;
  fullName: string;
  rollNumber: string;
  department: string;
  cgpa: number;
  activeBacklogs: number;
  skills: string[];
}

export const MOCK_STUDENT_PLACEMENT_PROFILE: StudentPlacementProfile = {
  studentId: "usr-demo-01",
  fullName: "Arjun Sharma",
  rollNumber: "2023-CSE-042",
  department: "CSE",
  cgpa: 8.85,
  activeBacklogs: 0,
  skills: [
    "TypeScript",
    "React",
    "Next.js",
    "Python",
    "PostgreSQL",
    "Data Structures",
    "Algorithms",
    "System Design",
    "Docker",
    "Tailwind CSS",
  ],
};

/**
 * Validates whether a student satisfies the strict eligibility criteria of a placement drive.
 */
export function checkDriveEligibility(
  drive: PlacementDrive,
  student: { cgpa: number; department: string; activeBacklogs: number }
): { isEligible: boolean; reasons: string[] } {
  const reasons: string[] = [];

  if (student.cgpa < drive.eligibility_min_cgpa) {
    reasons.push(
      `CGPA (${student.cgpa.toFixed(2)}) is below the required minimum of ${drive.eligibility_min_cgpa.toFixed(2)}`
    );
  }

  const deptUpper = student.department.toUpperCase();
  const allowedUpper = drive.allowed_departments.map((d) => d.toUpperCase());
  if (!allowedUpper.includes("ALL") && !allowedUpper.includes(deptUpper)) {
    reasons.push(
      `Department ${student.department} is not in the eligible branches (${drive.allowed_departments.join(", ")})`
    );
  }

  if (student.activeBacklogs > drive.max_active_backlogs) {
    reasons.push(
      `Active backlogs (${student.activeBacklogs}) exceed maximum allowed (${drive.max_active_backlogs})`
    );
  }

  return {
    isEligible: reasons.length === 0,
    reasons,
  };
}

/**
 * Computes skill match score and matching tags between job requirement and student skillset.
 */
export function calculateSkillMatchScore(
  driveSkills: string[],
  studentSkills: string[]
): { matchedSkills: string[]; missingSkills: string[]; matchPercentage: number } {
  if (!driveSkills || driveSkills.length === 0) {
    return { matchedSkills: [], missingSkills: [], matchPercentage: 100 };
  }

  const studentSkillsLower = studentSkills.map((s) => s.toLowerCase().trim());
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  driveSkills.forEach((skill) => {
    if (studentSkillsLower.includes(skill.toLowerCase().trim())) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const matchPercentage = Math.round(
    (matchedSkills.length / driveSkills.length) * 100
  );

  return {
    matchedSkills,
    missingSkills,
    matchPercentage,
  };
}

/**
 * Computes institutional placement statistics from drives and offer records.
 */
export function aggregatePlacementStatistics(
  offers: PlacementOffer[]
): { averageCtcLpa: number; highestCtcLpa: number; medianCtcLpa: number; totalOffers: number } {
  if (offers.length === 0) {
    return { averageCtcLpa: 0, highestCtcLpa: 0, medianCtcLpa: 0, totalOffers: 0 };
  }

  const ctcValues = offers.map((o) => o.offered_ctc_lpa).sort((a, b) => a - b);
  const totalOffers = ctcValues.length;
  const sumCtc = ctcValues.reduce((acc, curr) => acc + curr, 0);
  const averageCtcLpa = parseFloat((sumCtc / totalOffers).toFixed(2));
  const highestCtcLpa = ctcValues[ctcValues.length - 1];

  let medianCtcLpa = 0;
  const mid = Math.floor(totalOffers / 2);
  if (totalOffers % 2 === 0) {
    medianCtcLpa = parseFloat(((ctcValues[mid - 1] + ctcValues[mid]) / 2).toFixed(2));
  } else {
    medianCtcLpa = ctcValues[mid];
  }

  return {
    averageCtcLpa,
    highestCtcLpa,
    medianCtcLpa,
    totalOffers,
  };
}

// -------------------------------------------------------------
// Realistic Seed Catalog of Placement Drives (Apex Tech Campus)
// -------------------------------------------------------------

export const MOCK_PLACEMENT_DRIVES: PlacementDrive[] = [
  {
    id: "drv-001",
    college_id: "c0000000-0000-0000-0000-000000000001",
    company_name: "Google Cloud",
    company_logo_url: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=128&auto=format&fit=crop&q=80",
    role_title: "Software Development Engineer - I",
    drive_type: "full_time",
    ctc_lpa: 32.5,
    location: "Bangalore / Hyderabad (Hybrid)",
    eligibility_min_cgpa: 8.0,
    allowed_departments: ["CSE", "IT", "ECE"],
    max_active_backlogs: 0,
    application_deadline: "2026-10-15T23:59:59Z",
    drive_date: "2026-10-22",
    status: "ongoing",
    job_description:
      "Join the Google Cloud core infrastructure team architecting ultra-scalable distributed microservices, Kubernetes orchestrations, and real-time telemetry streaming engines.",
    skills_required: ["Data Structures", "Algorithms", "Python", "Go", "Distributed Systems", "PostgreSQL"],
    total_applicants: 142,
  },
  {
    id: "drv-002",
    college_id: "c0000000-0000-0000-0000-000000000001",
    company_name: "Microsoft",
    company_logo_url: "https://images.unsplash.com/photo-1642132652075-2bfa32242194?w=128&auto=format&fit=crop&q=80",
    role_title: "Full-Stack Software Engineer Intern (Summer '27)",
    drive_type: "intern_to_fte",
    ctc_lpa: 28.0,
    stipend_monthly: 95000,
    location: "Hyderabad / Noida",
    eligibility_min_cgpa: 7.5,
    allowed_departments: ["CSE", "IT", "ECE", "AI_DS"],
    max_active_backlogs: 0,
    application_deadline: "2026-10-10T23:59:59Z",
    drive_date: "2026-10-18",
    status: "ongoing",
    job_description:
      "Design next-generation developer tooling, Azure cloud solutions, and enterprise AI copilots. Converts to Full-Time Employee (FTE) based on internship performance.",
    skills_required: ["TypeScript", "React", "Next.js", "C#", "System Design", "Docker"],
    total_applicants: 198,
  },
  {
    id: "drv-003",
    college_id: "c0000000-0000-0000-0000-000000000001",
    company_name: "Amazon Web Services",
    company_logo_url: "https://images.unsplash.com/photo-1523474253246-73be1ad4256c?w=128&auto=format&fit=crop&q=80",
    role_title: "Cloud Solutions Architect Associate",
    drive_type: "full_time",
    ctc_lpa: 24.0,
    location: "Bangalore",
    eligibility_min_cgpa: 7.0,
    allowed_departments: ["CSE", "IT", "ECE", "EEE"],
    max_active_backlogs: 0,
    application_deadline: "2026-10-25T23:59:59Z",
    drive_date: "2026-11-02",
    status: "upcoming",
    job_description:
      "Collaborate with enterprise partners deploying high-throughput, fault-tolerant cloud architectures using AWS serverless, RDS, and Edge computing nodes.",
    skills_required: ["AWS", "Networking", "Python", "Linux", "Terraform", "PostgreSQL"],
    total_applicants: 87,
  },
  {
    id: "drv-004",
    college_id: "c0000000-0000-0000-0000-000000000001",
    company_name: "Atlassian",
    company_logo_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80",
    role_title: "Site Reliability & DevOps Engineer",
    drive_type: "full_time",
    ctc_lpa: 36.0,
    location: "Bangalore (Remote-Friendly)",
    eligibility_min_cgpa: 8.5,
    allowed_departments: ["CSE", "IT"],
    max_active_backlogs: 0,
    application_deadline: "2026-10-05T23:59:59Z",
    drive_date: "2026-10-12",
    status: "ongoing",
    job_description:
      "Build ultra-resilient multi-region platforms that power Jira and Confluence for over 250,000 global customers with 99.999% availability targets.",
    skills_required: ["Docker", "Kubernetes", "Go", "Python", "Linux", "CI/CD"],
    total_applicants: 110,
  },
  {
    id: "drv-005",
    college_id: "c0000000-0000-0000-0000-000000000001",
    company_name: "Goldman Sachs",
    company_logo_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80",
    role_title: "Quantitative Analytics & Tech Analyst",
    drive_type: "full_time",
    ctc_lpa: 30.0,
    location: "Bangalore",
    eligibility_min_cgpa: 8.2,
    allowed_departments: ["CSE", "IT", "ECE"],
    max_active_backlogs: 0,
    application_deadline: "2026-10-30T23:59:59Z",
    drive_date: "2026-11-08",
    status: "upcoming",
    job_description:
      "Develop low-latency algorithmic trading systems, stochastic risk analysis engines, and financial time-series predictive modeling pipelines.",
    skills_required: ["Data Structures", "Algorithms", "C++", "Python", "Linear Algebra"],
    total_applicants: 92,
  },
  {
    id: "drv-006",
    college_id: "c0000000-0000-0000-0000-000000000001",
    company_name: "Tata Consultancy Services (TCS)",
    company_logo_url: "https://images.unsplash.com/photo-1554774853-719586f82d77?w=128&auto=format&fit=crop&q=80",
    role_title: "Digital Cadre Systems Engineer",
    drive_type: "full_time",
    ctc_lpa: 9.0,
    location: "Pan-India",
    eligibility_min_cgpa: 6.5,
    allowed_departments: ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"],
    max_active_backlogs: 1,
    application_deadline: "2026-11-15T23:59:59Z",
    drive_date: "2026-11-25",
    status: "upcoming",
    job_description:
      "Engage in enterprise digital transformations utilizing cloud computing, full-stack microservices, generative AI prototyping, and automated testing.",
    skills_required: ["Java", "Python", "SQL", "HTML/CSS", "JavaScript"],
    total_applicants: 420,
  },
];

// Initial active student applications
export const MOCK_STUDENT_APPLICATIONS: PlacementApplication[] = [
  {
    id: "app-001",
    drive_id: "drv-001",
    student_id: "usr-demo-01",
    college_id: "c0000000-0000-0000-0000-000000000001",
    resume_url: "https://campuslens.edu/resumes/arjun-sharma-2026.pdf",
    current_cgpa: 8.85,
    status: "interview_scheduled",
    applied_at: "2026-09-20T14:30:00Z",
    notes: "Cleared Online Assessment (96/100). Technical Round 1 scheduled.",
    drive: MOCK_PLACEMENT_DRIVES[0],
  },
  {
    id: "app-002",
    drive_id: "drv-002",
    student_id: "usr-demo-01",
    college_id: "c0000000-0000-0000-0000-000000000001",
    resume_url: "https://campuslens.edu/resumes/arjun-sharma-2026.pdf",
    current_cgpa: 8.85,
    status: "assessment_scheduled",
    applied_at: "2026-09-22T10:15:00Z",
    notes: "Coding HackerRank assessment window opens Oct 12, 10:00 AM.",
    drive: MOCK_PLACEMENT_DRIVES[1],
  },
  {
    id: "app-003",
    drive_id: "drv-004",
    student_id: "usr-demo-01",
    college_id: "c0000000-0000-0000-0000-000000000001",
    resume_url: "https://campuslens.edu/resumes/arjun-sharma-2026.pdf",
    current_cgpa: 8.85,
    status: "shortlisted",
    applied_at: "2026-09-21T09:00:00Z",
    notes: "Resume shortlisted by hiring committee.",
    drive: MOCK_PLACEMENT_DRIVES[3],
  },
];

// Interview Rounds
export const MOCK_INTERVIEW_ROUNDS: PlacementInterviewRound[] = [
  {
    id: "rnd-001",
    application_id: "app-001",
    drive_id: "drv-001",
    round_number: 1,
    round_name: "Online Coding Assessment (DSA)",
    scheduled_at: "2026-09-24T10:00:00Z",
    duration_minutes: 90,
    mode: "online",
    venue_or_link: "https://tests.google.com/assessment/apex-2026",
    status: "cleared",
    feedback: "High efficiency in Dynamic Programming and Graph queries (Score: 96%).",
    company_name: "Google Cloud",
    role_title: "Software Development Engineer - I",
  },
  {
    id: "rnd-002",
    application_id: "app-001",
    drive_id: "drv-001",
    round_number: 2,
    round_name: "Technical Interview 1 (System Design & Concurrency)",
    scheduled_at: "2026-10-02T14:30:00Z",
    duration_minutes: 60,
    mode: "online",
    venue_or_link: "https://meet.google.com/xyz-campus-apex",
    status: "scheduled",
    feedback: "Focus preparation on Distributed Caching (Redis), Kafka streaming, and database isolation levels.",
    company_name: "Google Cloud",
    role_title: "Software Development Engineer - I",
  },
  {
    id: "rnd-003",
    application_id: "app-002",
    drive_id: "drv-002",
    round_number: 1,
    round_name: "Codility Global Assessment",
    scheduled_at: "2026-10-12T10:00:00Z",
    duration_minutes: 75,
    mode: "online",
    venue_or_link: "https://codility.com/c/msft-apex-2026",
    status: "scheduled",
    feedback: "Three questions: Array manipulation, Binary Search Trees, and System API mock.",
    company_name: "Microsoft",
    role_title: "Full-Stack Software Engineer Intern",
  },
];

// Offers Vault
export const MOCK_STUDENT_OFFERS: PlacementOffer[] = [
  {
    id: "ofr-001",
    application_id: "app-sample-09",
    student_id: "usr-demo-01",
    college_id: "c0000000-0000-0000-0000-000000000001",
    company_name: "Oracle Cloud Infrastructure",
    role_title: "Member of Technical Staff - I",
    offered_ctc_lpa: 22.0,
    bonus_joining: 250000,
    offer_letter_url: "https://campuslens.edu/vault/ofr-oracle-arjun.pdf",
    acceptance_status: "pending",
    offer_date: "2026-09-18",
    valid_until: "2026-10-18T23:59:59Z",
  },
];

// Institutional Placement Stats
export const MOCK_DEPARTMENT_STATS: DepartmentPlacementStat[] = [
  {
    department: "Computer Science & Eng (CSE)",
    totalEligible: 240,
    totalPlaced: 228,
    placementPercentage: 95.0,
    avgCtcLpa: 17.8,
    highestCtcLpa: 44.0,
  },
  {
    department: "Information Technology (IT)",
    totalEligible: 180,
    totalPlaced: 167,
    placementPercentage: 92.8,
    avgCtcLpa: 15.6,
    highestCtcLpa: 36.5,
  },
  {
    department: "Electronics & Communication (ECE)",
    totalEligible: 200,
    totalPlaced: 172,
    placementPercentage: 86.0,
    avgCtcLpa: 12.4,
    highestCtcLpa: 28.0,
  },
  {
    department: "Electrical & Electronics (EEE)",
    totalEligible: 120,
    totalPlaced: 98,
    placementPercentage: 81.7,
    avgCtcLpa: 10.2,
    highestCtcLpa: 21.0,
  },
  {
    department: "Mechanical Engineering (MECH)",
    totalEligible: 140,
    totalPlaced: 106,
    placementPercentage: 75.7,
    avgCtcLpa: 8.5,
    highestCtcLpa: 16.0,
  },
];

export const MOCK_INSTITUTIONAL_STATS: InstitutionalPlacementStats = {
  totalStudentsEligible: 880,
  totalOffersMade: 942,
  uniqueStudentsPlaced: 771,
  overallPlacementRate: 87.6,
  averageCtcLpa: 14.2,
  highestCtcLpa: 44.0,
  medianCtcLpa: 12.5,
  totalParticipatingCompanies: 114,
  departmentStats: MOCK_DEPARTMENT_STATS,
  topRecruiters: [
    { company: "Google", offersCount: 14, maxCtc: 44.0 },
    { company: "Microsoft", offersCount: 22, maxCtc: 38.0 },
    { company: "Amazon", offersCount: 35, maxCtc: 32.0 },
    { company: "Atlassian", offersCount: 8, maxCtc: 36.0 },
    { company: "Oracle", offersCount: 28, maxCtc: 24.0 },
    { company: "TCS / Infosys", offersCount: 185, maxCtc: 9.5 },
  ],
};
