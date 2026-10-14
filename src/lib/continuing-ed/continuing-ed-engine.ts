/**
 * CampusLens AI — Phase 46: Smart Campus Continuing Education, Executive MDP & Professional Micro-Credentials Engine
 * File: src/lib/continuing-ed/continuing-ed-engine.ts
 */

import {
  ExecutiveProgram,
  ProfessionalMicroCredential,
  CorporateNomination,
  FacultyDevelopmentCohort,
  ContinuingEducationOverviewStats,
  ProgramType,
  CompetencyDomain,
  SponsorshipStatus,
} from "@/types";

// Token Generators
export function generateProgramToken(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-MDP-2026-${rand}`;
}

export function generateCredentialToken(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-CRED-2026-${rand}`;
}

export function generateNominationToken(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-NOM-2026-${rand}`;
}

export function generateCertificateToken(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-MDP-CERT-2026-${rand}`;
}

// Mock Executive Programs
export const MOCK_EXECUTIVE_PROGRAMS: ExecutiveProgram[] = [
  {
    id: "prog-001",
    program_code: "EXEC-AI-901",
    title: "Chief AI Officer & Enterprise Generative AI Systems Architecture",
    program_type: "executive_mdp",
    department: "Computer Science & Engineering",
    lead_faculty_director: "Prof. K. Ramanathan (Chair, Apex AI Supercomputing Hub)",
    co_instructors: [
      "Dr. Arvind Trivedi (Bioinformatics AI)",
      "Dr. Meenakshi Iyer (Edge Computing)",
    ],
    target_audience: "VP/Director of Engineering, Chief Technology Officers, Principal ML Architects",
    duration_weeks: 6,
    credit_units: 4.0,
    pedagogy_mode: "hybrid",
    fee_inr: 185000,
    intake_capacity: 40,
    enrolled_count: 36,
    syllabus_modules: [
      "Foundation Model Fine-Tuning & Multi-Agent RAG Orchestration",
      "Enterprise LLMOps, Vector Databases & Governance Guardrails",
      "Hardware Acceleration on GPU Clusters (DGX Superpod)",
      "Strategic AI Roadmap & Capital Allocation for C-Suite",
    ],
    program_token: "CL-MDP-2026-8104",
    start_date: "2026-11-02",
    end_date: "2026-12-14",
    status: "enrolling",
    is_active: true,
    created_at: "2026-09-10T10:00:00Z",
  },
  {
    id: "prog-002",
    program_code: "FDP-VLSI-402",
    title: "Advanced Semiconductor VLSI Physical Design & 3nm FinFET Fabrication",
    program_type: "faculty_fdp",
    department: "Electronics & Communication Engineering",
    lead_faculty_director: "Dr. Sunita Deshmukh (Director, Microelectronics Center)",
    co_instructors: ["Prof. Vikram Sengupta", "Dr. Rajeshwar Rao"],
    target_audience: "Engineering College Faculty, Postdoctoral Fellows, Senior PhD Researchers",
    duration_weeks: 3,
    credit_units: 2.5,
    pedagogy_mode: "in_person_residential",
    fee_inr: 0,
    intake_capacity: 50,
    enrolled_count: 48,
    syllabus_modules: [
      "EDA Tool Flows & Standard Cell Library Characterization",
      "Clock Tree Synthesis, Static Timing Analysis & Sign-off",
      "Cleanroom Protocol & Semiconductor Cleanroom Hands-on",
      "Pedagogy Design for National Semiconductor Mission (India)",
    ],
    program_token: "CL-MDP-2026-3240",
    start_date: "2026-10-20",
    end_date: "2026-11-10",
    status: "enrolling",
    is_active: true,
    created_at: "2026-09-01T09:00:00Z",
  },
  {
    id: "prog-003",
    program_code: "MAST-QNT-703",
    title: "Post-Quantum Cryptography & Zero-Trust Defense Masterclass",
    program_type: "industry_masterclass",
    department: "Information Technology & Cyber Defense",
    lead_faculty_director: "Dr. Aakash Mukherjee (Head of Cyber Security & Forensics)",
    co_instructors: ["Dr. Preeti Verma"],
    target_audience: "Chief Information Security Officers (CISOs), Cloud Security Engineers, Defense Tech Leads",
    duration_weeks: 4,
    credit_units: 3.0,
    pedagogy_mode: "live_virtual",
    fee_inr: 120000,
    intake_capacity: 35,
    enrolled_count: 32,
    syllabus_modules: [
      "NIST Post-Quantum Standards (ML-KEM, ML-DSA, SLH-DSA)",
      "Zero-Knowledge Proofs & Blind Cryptographic Signatures",
      "Quantum Resistant Public Key Infrastructure (PKI) Migration",
      "Red Team Simulation & Hardware Enclave Verification",
    ],
    program_token: "CL-MDP-2026-6791",
    start_date: "2026-11-15",
    end_date: "2026-12-15",
    status: "enrolling",
    is_active: true,
    created_at: "2026-09-15T11:00:00Z",
  },
  {
    id: "prog-004",
    program_code: "EXEC-EV-504",
    title: "Electric Vehicle Powertrain Dynamics & Solid-State BMS Engineering",
    program_type: "executive_mdp",
    department: "Mechanical & Mechatronics Engineering",
    lead_faculty_director: "Prof. Anant Joshi (Co-convenor, Tata Motors Innovation Hub)",
    co_instructors: ["Dr. Sneha Pillai"],
    target_audience: "Automotive R&D Directors, Battery Systems Architects, Powertrain Leads",
    duration_weeks: 5,
    credit_units: 3.5,
    pedagogy_mode: "hybrid",
    fee_inr: 150000,
    intake_capacity: 45,
    enrolled_count: 42,
    syllabus_modules: [
      "Solid-State & Sodium-Ion Cell Electrochemistry",
      "High-Voltage Battery Pack Thermal Management & Pyrotechnic Disconnects",
      "CAN-Bus & Automotive Ethernet Real-Time Telemetry",
      "Homologation, AIS-038/156 Safety Compliance & Crash Testing",
    ],
    program_token: "CL-MDP-2026-4412",
    start_date: "2026-10-25",
    end_date: "2026-11-28",
    status: "in_progress",
    is_active: true,
    created_at: "2026-08-20T12:00:00Z",
  },
];

// Mock Professional Micro-Credentials
export const MOCK_MICRO_CREDENTIALS: ProfessionalMicroCredential[] = [
  {
    id: "cred-001",
    credential_code: "CRED-LLM-01",
    badge_title: "Applied LLM Engineering & Agentic RAG Architect",
    competency_domain: "generative_ai",
    issuing_board: "Apex Center for Continuing Engineering Education (CCEE)",
    ceu_credits: 3.0,
    prerequisites: ["Python Proficiency", "Deep Learning Fundamentals", "Cloud Compute Setup"],
    credential_token: "CL-CRED-2026-5510",
    credential_hash: "sha256-e91823abf894109ca8376510a9f8723910b87f4c3912da01837e2",
    evaluation_mode: "capstone_peer_review",
    total_certified_scholars: 240,
    validity_years: 3,
    badge_icon_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80",
    created_at: "2026-01-10T10:00:00Z",
  },
  {
    id: "cred-002",
    credential_code: "CRED-K8S-02",
    badge_title: "Cloud Native Kubernetes & GitOps Platform Engineer",
    competency_domain: "cloud_devops",
    issuing_board: "Apex CCEE & CNCF Academic Alliance",
    ceu_credits: 2.5,
    prerequisites: ["Linux System Administration", "Docker Containers", "YAML & Helm"],
    credential_token: "CL-CRED-2026-9021",
    credential_hash: "sha256-491a92bfce102948bbca778810ea3410928ffcba8294108827fa1",
    evaluation_mode: "proctored_exam",
    total_certified_scholars: 310,
    validity_years: 3,
    badge_icon_url: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=120&q=80",
    created_at: "2026-02-15T11:00:00Z",
  },
  {
    id: "cred-003",
    credential_code: "CRED-ZT-03",
    badge_title: "Zero-Trust Architecture & Threat Intelligence Specialist",
    competency_domain: "cybersecurity",
    issuing_board: "Apex CCEE National Cyber Defense Consortium",
    ceu_credits: 3.0,
    prerequisites: ["Network Protocols (TCP/IP)", "Identity & Access Management (IAM)"],
    credential_token: "CL-CRED-2026-7734",
    credential_hash: "sha256-8201fa091bbce82910fa983177bb390192837bcba9918237fa991",
    evaluation_mode: "industry_hackathon",
    total_certified_scholars: 185,
    validity_years: 2,
    badge_icon_url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&q=80",
    created_at: "2026-03-01T09:30:00Z",
  },
  {
    id: "cred-004",
    credential_code: "CRED-QNT-04",
    badge_title: "Post-Quantum Lattice Cryptography & Security Auditor",
    competency_domain: "quantum_computing",
    issuing_board: "Apex Quantum Science Center & CCEE",
    ceu_credits: 4.0,
    prerequisites: ["Abstract Algebra & Number Theory", "Public Key Cryptography"],
    credential_token: "CL-CRED-2026-4489",
    credential_hash: "sha256-11823ba09fe82910da8273910beaf73920194827bbaf892018374",
    evaluation_mode: "capstone_peer_review",
    total_certified_scholars: 92,
    validity_years: 3,
    badge_icon_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=120&q=80",
    created_at: "2026-04-12T14:00:00Z",
  },
];

// Mock Corporate Nominations
export const MOCK_CORPORATE_NOMINATIONS: CorporateNomination[] = [
  {
    id: "nom-001",
    program_id: "prog-001",
    program_title: "Chief AI Officer & Enterprise Generative AI Systems Architecture",
    corporate_sponsor: "NVIDIA India Technologies",
    participant_name: "Rahul Sharma",
    participant_email: "rahul.sharma@nvidia.corp",
    designation: "Lead AI Platform Architect",
    years_of_experience: 11,
    nomination_token: "CL-NOM-2026-1102",
    sponsorship_status: "sponsored_approved",
    attendance_percentage: 95.5,
    capstone_submitted: true,
    certificate_issued: true,
    certificate_token: "CL-MDP-CERT-2026-8801",
    grade: "Distinction",
    created_at: "2026-09-12T10:00:00Z",
  },
  {
    id: "nom-002",
    program_id: "prog-002",
    program_title: "Advanced Semiconductor VLSI Physical Design & 3nm FinFET Fabrication",
    corporate_sponsor: "NIT Rourkela (Institutional Sponsorship)",
    participant_name: "Dr. Ananya Roy",
    participant_email: "ananya.roy@nitrkl.ac.in",
    designation: "Associate Professor (ECE)",
    years_of_experience: 9,
    nomination_token: "CL-NOM-2026-4432",
    sponsorship_status: "scholarship_waived",
    attendance_percentage: 98.0,
    capstone_submitted: true,
    certificate_issued: true,
    certificate_token: "CL-MDP-CERT-2026-5542",
    grade: "Distinction",
    created_at: "2026-09-14T11:00:00Z",
  },
  {
    id: "nom-003",
    program_id: "prog-003",
    program_title: "Post-Quantum Cryptography & Zero-Trust Defense Masterclass",
    corporate_sponsor: "Tata Digital Enterprise",
    participant_name: "Vikram Malhotra",
    participant_email: "v.malhotra@tatadigital.com",
    designation: "Director of Cyber Defense",
    years_of_experience: 14,
    nomination_token: "CL-NOM-2026-7819",
    sponsorship_status: "sponsored_approved",
    attendance_percentage: 88.0,
    capstone_submitted: false,
    certificate_issued: false,
    grade: "Pending",
    created_at: "2026-09-18T14:30:00Z",
  },
  {
    id: "nom-004",
    program_id: "prog-004",
    program_title: "Electric Vehicle Powertrain Dynamics & Solid-State BMS Engineering",
    corporate_sponsor: "Mahindra Electric Mobility",
    participant_name: "Pooja Hegde",
    participant_email: "hegde.pooja@mahindra.com",
    designation: "Senior Battery Systems Engineer",
    years_of_experience: 7,
    nomination_token: "CL-NOM-2026-9051",
    sponsorship_status: "sponsored_approved",
    attendance_percentage: 92.0,
    capstone_submitted: true,
    certificate_issued: true,
    certificate_token: "CL-MDP-CERT-2026-9921",
    grade: "Merit",
    created_at: "2026-08-25T16:00:00Z",
  },
];

// Mock Faculty Development Cohorts
export const MOCK_FACULTY_COHORTS: FacultyDevelopmentCohort[] = [
  {
    id: "cohort-001",
    cohort_name: "AICTE ATAL National Faculty Development Cohort on 3nm VLSI",
    program_id: "prog-002",
    coordinating_department: "Electronics & Communication Engineering",
    aicte_atal_recognized: true,
    funding_source: "aicte_atal_grant",
    participating_institutions_count: 24,
    faculty_fellows_enrolled: 48,
    grant_subsidy_inr: 950000,
    lead_convenor: "Dr. Sunita Deshmukh",
    status: "active",
    created_at: "2026-09-05T09:00:00Z",
  },
  {
    id: "cohort-002",
    cohort_name: "National Pedagogy Track on Post-Quantum Cryptography & Enclaves",
    program_id: "prog-003",
    coordinating_department: "Information Technology",
    aicte_atal_recognized: true,
    funding_source: "aicte_atal_grant",
    participating_institutions_count: 18,
    faculty_fellows_enrolled: 36,
    grant_subsidy_inr: 800000,
    lead_convenor: "Dr. Aakash Mukherjee",
    status: "scheduled",
    created_at: "2026-09-12T10:00:00Z",
  },
  {
    id: "cohort-003",
    cohort_name: "Inter-Institutional Consortium on Generative AI Engineering",
    program_id: "prog-001",
    coordinating_department: "Computer Science & Engineering",
    aicte_atal_recognized: false,
    funding_source: "institutional_endowment",
    participating_institutions_count: 12,
    faculty_fellows_enrolled: 30,
    grant_subsidy_inr: 600000,
    lead_convenor: "Prof. K. Ramanathan",
    status: "active",
    created_at: "2026-08-28T11:00:00Z",
  },
];

// In-Memory Session Stores (stateful across client mutations during server uptime)
const programsStore: ExecutiveProgram[] = [...MOCK_EXECUTIVE_PROGRAMS];
const credentialsStore: ProfessionalMicroCredential[] = [...MOCK_MICRO_CREDENTIALS];
const nominationsStore: CorporateNomination[] = [...MOCK_CORPORATE_NOMINATIONS];
const cohortsStore: FacultyDevelopmentCohort[] = [...MOCK_FACULTY_COHORTS];

// Query Functions
export function getContinuingEducationStats(): ContinuingEducationOverviewStats {
  const activeEnrolled = programsStore.reduce((acc, p) => acc + p.enrolled_count, 0);
  const totalMicroCreds = credentialsStore.reduce((acc, c) => acc + c.total_certified_scholars, 0);
  const uniqueCorporates = new Set(nominationsStore.map((n) => n.corporate_sponsor)).size;
  const totalCredits = programsStore.reduce((acc, p) => acc + Number(p.credit_units), 0);

  return {
    totalPrograms: programsStore.length,
    activeEnrolledExecutives: activeEnrolled,
    totalMicroCredentialsIssued: totalMicroCreds,
    corporatePartnersCount: uniqueCorporates,
    totalContinuingEducationCredits: totalCredits,
    programs: programsStore,
    credentials: credentialsStore,
    nominations: nominationsStore,
    facultyCohorts: cohortsStore,
  };
}

export function getExecutivePrograms(filter?: { type?: ProgramType; department?: string }): ExecutiveProgram[] {
  let list = [...programsStore];
  if (filter?.type) {
    list = list.filter((p) => p.program_type === filter.type);
  }
  if (filter?.department) {
    list = list.filter((p) => p.department.toLowerCase().includes(filter.department!.toLowerCase()));
  }
  return list;
}

export function getExecutiveProgramByCode(code: string): ExecutiveProgram | undefined {
  return programsStore.find((p) => p.program_code.toLowerCase() === code.toLowerCase() || p.program_token === code);
}

export function getMicroCredentials(domain?: CompetencyDomain): ProfessionalMicroCredential[] {
  if (domain) {
    return credentialsStore.filter((c) => c.competency_domain === domain);
  }
  return credentialsStore;
}

export function getCorporateNominations(): CorporateNomination[] {
  return nominationsStore;
}

export function getFacultyCohorts(): FacultyDevelopmentCohort[] {
  return cohortsStore;
}

// Mutation Functions
export function submitCorporateNomination(data: {
  program_id: string;
  corporate_sponsor: string;
  participant_name: string;
  participant_email: string;
  designation: string;
  years_of_experience: number;
  sponsorship_status?: SponsorshipStatus;
}): CorporateNomination {
  const nominationToken = generateNominationToken();
  const program = programsStore.find((p) => p.id === data.program_id);

  const newNomination: CorporateNomination = {
    id: `nom-${Date.now()}`,
    program_id: data.program_id,
    program_title: program?.title || "Executive Continuing Education Program",
    corporate_sponsor: data.corporate_sponsor,
    participant_name: data.participant_name,
    participant_email: data.participant_email,
    designation: data.designation,
    years_of_experience: data.years_of_experience,
    nomination_token: nominationToken,
    sponsorship_status: data.sponsorship_status || "sponsored_approved",
    attendance_percentage: 0,
    capstone_submitted: false,
    certificate_issued: false,
    grade: "Pending",
    created_at: new Date().toISOString(),
  };

  nominationsStore.unshift(newNomination);

  // If program exists, increment enrolled_count
  if (program && program.enrolled_count < program.intake_capacity) {
    program.enrolled_count += 1;
  }

  return newNomination;
}

export function issueMicroCredentialEnrollment(data: {
  badge_title: string;
  competency_domain: CompetencyDomain;
  issuing_board: string;
  ceu_credits: number;
  prerequisites?: string[];
}): ProfessionalMicroCredential {
  const token = generateCredentialToken();
  const randHash = `sha256-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  const code = `CRED-${data.competency_domain.substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;

  const newCred: ProfessionalMicroCredential = {
    id: `cred-${Date.now()}`,
    credential_code: code,
    badge_title: data.badge_title,
    competency_domain: data.competency_domain,
    issuing_board: data.issuing_board,
    ceu_credits: data.ceu_credits,
    prerequisites: data.prerequisites || ["Relevant Bachelor's Degree or Equivalent Work Experience"],
    credential_token: token,
    credential_hash: randHash,
    evaluation_mode: "capstone_peer_review",
    total_certified_scholars: 1,
    validity_years: 3,
    created_at: new Date().toISOString(),
  };

  credentialsStore.unshift(newCred);
  return newCred;
}

export function registerFacultyCohort(data: {
  cohort_name: string;
  program_id?: string;
  coordinating_department: string;
  aicte_atal_recognized: boolean;
  lead_convenor: string;
  grant_subsidy_inr: number;
}): FacultyDevelopmentCohort {
  const newCohort: FacultyDevelopmentCohort = {
    id: `cohort-${Date.now()}`,
    cohort_name: data.cohort_name,
    program_id: data.program_id,
    coordinating_department: data.coordinating_department,
    aicte_atal_recognized: data.aicte_atal_recognized,
    funding_source: data.aicte_atal_recognized ? "aicte_atal_grant" : "institutional_endowment",
    participating_institutions_count: 15,
    faculty_fellows_enrolled: 30,
    grant_subsidy_inr: data.grant_subsidy_inr,
    lead_convenor: data.lead_convenor,
    status: "active",
    created_at: new Date().toISOString(),
  };

  cohortsStore.unshift(newCohort);
  return newCohort;
}
