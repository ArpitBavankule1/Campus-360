/**
 * Phase 54: Smart Campus MoE Institution's Innovation Council (IIC 6.0/7.0), NISP & YUKTI Repository Engine
 * In-memory stateful store, token generators, seed data, and MoE/MIC compliance metrics.
 */

import {
  IicCouncilMember,
  IicQuarterlyActivity,
  IicNispPolicy,
  IicYuktiInnovation,
  IicAriiaRanking,
  IicPerformanceRating,
  IicComplianceSummaryStats,
  IicQuarter,
  IicActivityCategory,
  IicActivityStatus,
  YuktiInnovationStage,
  YuktiPatentStatus,
} from "@/types";

// ==========================================
// Cryptographic & Format Generators
// ==========================================

export function generateMicActivityToken(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  const hex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MIC-ACT-2026-${hex}-${num}`;
}

export function generateYuktiToken(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  const hex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `YUKTI-2026-${hex}-${num}`;
}

export function generateNispResolutionToken(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  const hex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `NISP-RES-2026-${hex}-${num}`;
}

export function generateIicCertToken(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  const hex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CL-IIC-CERT-2026-${hex}-${num}`;
}

export function generateIicDigitalSealHash(): string {
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

const INITIAL_COUNCIL_MEMBERS: IicCouncilMember[] = [
  {
    id: "iic-mem-001",
    role: "president",
    name: "Dr. Arvind S. Kulkarni",
    designation: "Dean of Innovation, R&D & Incubation",
    department: "Computer Science & Engineering",
    email: "a.kulkarni@apex.edu.in",
    tenure_year: "2026-27 (IIC 7.0)",
    member_type: "internal_faculty",
    status: "active",
    created_at: "2026-06-01T09:00:00Z",
    updated_at: "2026-06-01T09:00:00Z",
  },
  {
    id: "iic-mem-002",
    role: "convener",
    name: "Dr. Shalini S. Nair",
    designation: "Professor & Head of Centre for AI Innovations",
    department: "Artificial Intelligence & Data Science",
    email: "s.nair@apex.edu.in",
    tenure_year: "2026-27 (IIC 7.0)",
    member_type: "internal_faculty",
    status: "active",
    created_at: "2026-06-01T09:00:00Z",
    updated_at: "2026-06-01T09:00:00Z",
  },
  {
    id: "iic-mem-003",
    role: "ipr_coordinator",
    name: "Prof. Rajesh V. Iyer",
    designation: "Associate Professor & Registered Indian Patent Agent",
    department: "Electronics & Communication Engineering",
    email: "r.iyer@apex.edu.in",
    tenure_year: "2026-27 (IIC 7.0)",
    member_type: "internal_faculty",
    status: "active",
    created_at: "2026-06-01T09:00:00Z",
    updated_at: "2026-06-01T09:00:00Z",
  },
  {
    id: "iic-mem-004",
    role: "startup_coordinator",
    name: "Dr. Meera P. Joshi",
    designation: "Director, Apex Deep-Tech Venture Foundry",
    department: "Management & Technology Entrepreneurship",
    email: "m.joshi@apex.edu.in",
    tenure_year: "2026-27 (IIC 7.0)",
    member_type: "internal_faculty",
    status: "active",
    created_at: "2026-06-01T09:00:00Z",
    updated_at: "2026-06-01T09:00:00Z",
  },
  {
    id: "iic-mem-005",
    role: "nirf_ariia_coordinator",
    name: "Prof. Vikramaditya Sen",
    designation: "Head of Institutional Quality Assurance & Rankings",
    department: "Mechanical Engineering",
    email: "v.sen@apex.edu.in",
    tenure_year: "2026-27 (IIC 7.0)",
    member_type: "internal_faculty",
    status: "active",
    created_at: "2026-06-01T09:00:00Z",
    updated_at: "2026-06-01T09:00:00Z",
  },
  {
    id: "iic-mem-006",
    role: "external_expert",
    name: "Mr. Harshavardhan Rao",
    designation: "Managing Partner, DeepTech Angels Network India",
    department: "External Venture Capital & Angel Consortium",
    email: "h.rao@deeptechangels.in",
    tenure_year: "2026-27 (IIC 7.0)",
    member_type: "angel_investor",
    status: "active",
    created_at: "2026-06-01T09:00:00Z",
    updated_at: "2026-06-01T09:00:00Z",
  },
  {
    id: "iic-mem-007",
    role: "social_media_coordinator",
    name: "Dr. Ananya Roy",
    designation: "Assistant Professor, Digital Communication Lab",
    department: "Information Technology",
    email: "a.roy@apex.edu.in",
    tenure_year: "2026-27 (IIC 7.0)",
    member_type: "internal_faculty",
    status: "active",
    created_at: "2026-06-01T09:00:00Z",
    updated_at: "2026-06-01T09:00:00Z",
  },
  {
    id: "iic-mem-008",
    role: "student_lead",
    name: "Rohan K. Singhania",
    designation: "President, Student Innovation & Robotics Club",
    department: "Computer Science & Engineering (Final Year)",
    email: "rohan.singhania@student.apex.edu.in",
    tenure_year: "2026-27 (IIC 7.0)",
    member_type: "student_coordinator",
    status: "active",
    created_at: "2026-06-01T09:00:00Z",
    updated_at: "2026-06-01T09:00:00Z",
  },
];

const INITIAL_QUARTERLY_ACTIVITIES: IicQuarterlyActivity[] = [
  {
    id: "iic-act-001",
    activity_code: "IIC-Q1-MIC-01",
    title: "MoE Innovation Cell Mandatory Orientation & Innovation Ecosystem Roadshow",
    category: "mic_driven",
    quarter: "Q1",
    academic_year: "2026-27",
    start_date: "2026-08-12",
    end_date: "2026-08-12",
    coordinator_name: "Dr. Arvind S. Kulkarni",
    participant_count: 640,
    faculty_participant_count: 52,
    expenditure_inr: 45000,
    mic_reward_points: 25,
    status: "verified_approved",
    mic_verification_token: "MIC-ACT-2026-Q1A1-8831",
    report_url: "https://mic.gov.in/reports/2026/apex-q1-orientation.pdf",
    created_at: "2026-08-13T10:00:00Z",
  },
  {
    id: "iic-act-002",
    activity_code: "IIC-Q1-CAL-02",
    title: "Workshop on Intellectual Property Rights (IPR), Patent Drafting & Prior-Art Search",
    category: "calendar_activity",
    quarter: "Q1",
    academic_year: "2026-27",
    start_date: "2026-09-05",
    end_date: "2026-09-06",
    coordinator_name: "Prof. Rajesh V. Iyer",
    participant_count: 380,
    faculty_participant_count: 44,
    expenditure_inr: 65000,
    mic_reward_points: 20,
    status: "verified_approved",
    mic_verification_token: "MIC-ACT-2026-Q1P2-7190",
    report_url: "https://mic.gov.in/reports/2026/apex-ipr-workshop.pdf",
    created_at: "2026-09-07T11:00:00Z",
  },
  {
    id: "iic-act-003",
    activity_code: "IIC-Q1-CEL-03",
    title: "National Innovation Day Celebration & Dr. APJ Abdul Kalam Memorial Ideathon",
    category: "celebration_activity",
    quarter: "Q1",
    academic_year: "2026-27",
    start_date: "2026-10-15",
    end_date: "2026-10-15",
    coordinator_name: "Dr. Shalini S. Nair",
    participant_count: 512,
    faculty_participant_count: 38,
    expenditure_inr: 58000,
    mic_reward_points: 15,
    status: "verified_approved",
    mic_verification_token: "MIC-ACT-2026-Q1K3-5491",
    report_url: "https://mic.gov.in/reports/2026/apex-kalam-ideathon.pdf",
    created_at: "2026-10-16T14:00:00Z",
  },
  {
    id: "iic-act-004",
    activity_code: "IIC-Q2-MIC-04",
    title: "MoE Smart India Hackathon (SIH 2026) Institutional Internal Scrutiny Hackathon",
    category: "mic_driven",
    quarter: "Q2",
    academic_year: "2026-27",
    start_date: "2026-11-20",
    end_date: "2026-11-21",
    coordinator_name: "Dr. Arvind S. Kulkarni",
    participant_count: 480,
    faculty_participant_count: 36,
    expenditure_inr: 120000,
    mic_reward_points: 30,
    status: "verified_approved",
    mic_verification_token: "MIC-ACT-2026-Q2S4-6290",
    report_url: "https://mic.gov.in/reports/2026/apex-sih-internal.pdf",
    created_at: "2026-11-22T16:00:00Z",
  },
  {
    id: "iic-act-005",
    activity_code: "IIC-Q2-CAL-05",
    title: "Design Thinking, Critical Problem Solving & Minimum Viable Product (MVP) Sprint",
    category: "calendar_activity",
    quarter: "Q2",
    academic_year: "2026-27",
    start_date: "2026-12-10",
    end_date: "2026-12-12",
    coordinator_name: "Dr. Meera P. Joshi",
    participant_count: 310,
    faculty_participant_count: 28,
    expenditure_inr: 75000,
    mic_reward_points: 20,
    status: "verified_approved",
    mic_verification_token: "MIC-ACT-2026-Q2D5-3841",
    report_url: "https://mic.gov.in/reports/2026/apex-mvp-sprint.pdf",
    created_at: "2026-12-13T10:00:00Z",
  },
  {
    id: "iic-act-006",
    activity_code: "IIC-Q3-MIC-06",
    title: "National Science Day & Grand Prototype Exhibition: Deep-Tech for Viksit Bharat",
    category: "mic_driven",
    quarter: "Q3",
    academic_year: "2026-27",
    start_date: "2027-02-28",
    end_date: "2027-02-28",
    coordinator_name: "Dr. Shalini S. Nair",
    participant_count: 720,
    faculty_participant_count: 65,
    expenditure_inr: 110000,
    mic_reward_points: 25,
    status: "verified_approved",
    mic_verification_token: "MIC-ACT-2026-Q3N6-9041",
    report_url: "https://mic.gov.in/reports/2026/apex-science-day.pdf",
    created_at: "2027-03-01T12:00:00Z",
  },
  {
    id: "iic-act-007",
    activity_code: "IIC-Q3-CAL-07",
    title: "Angel Investor Pitch Day & Seed Capital Tranche Allocation Conclave",
    category: "self_driven",
    quarter: "Q3",
    academic_year: "2026-27",
    start_date: "2027-03-18",
    end_date: "2027-03-18",
    coordinator_name: "Mr. Harshavardhan Rao",
    participant_count: 220,
    faculty_participant_count: 22,
    expenditure_inr: 95000,
    mic_reward_points: 20,
    status: "verified_approved",
    mic_verification_token: "MIC-ACT-2026-Q3A7-4410",
    report_url: "https://mic.gov.in/reports/2026/apex-angel-pitch.pdf",
    created_at: "2027-03-19T09:30:00Z",
  },
  {
    id: "iic-act-008",
    activity_code: "IIC-Q4-MIC-08",
    title: "World Intellectual Property Day: Patent Commercialization & University Licensing",
    category: "mic_driven",
    quarter: "Q4",
    academic_year: "2026-27",
    start_date: "2027-04-26",
    end_date: "2027-04-26",
    coordinator_name: "Prof. Rajesh V. Iyer",
    participant_count: 430,
    faculty_participant_count: 48,
    expenditure_inr: 68000,
    mic_reward_points: 25,
    status: "verified_approved",
    mic_verification_token: "MIC-ACT-2026-Q4W8-1932",
    report_url: "https://mic.gov.in/reports/2026/apex-world-ip-day.pdf",
    created_at: "2027-04-27T15:00:00Z",
  },
  {
    id: "iic-act-009",
    activity_code: "IIC-Q4-CAL-09",
    title: "Annual YUKTI Repository Showcase & National Technology Readiness (TRL) Review",
    category: "calendar_activity",
    quarter: "Q4",
    academic_year: "2026-27",
    start_date: "2027-05-14",
    end_date: "2027-05-15",
    coordinator_name: "Dr. Arvind S. Kulkarni",
    participant_count: 360,
    faculty_participant_count: 34,
    expenditure_inr: 85000,
    mic_reward_points: 20,
    status: "report_submitted",
    mic_verification_token: "MIC-ACT-2026-Q4Y9-7721",
    report_url: "https://mic.gov.in/reports/2026/apex-yukti-showcase.pdf",
    created_at: "2027-05-16T11:00:00Z",
  },
  {
    id: "iic-act-010",
    activity_code: "IIC-Q4-SEL-10",
    title: "Apex Innovation Summit & Young Innovator Awards Ceremony 2027",
    category: "self_driven",
    quarter: "Q4",
    academic_year: "2026-27",
    start_date: "2027-05-28",
    end_date: "2027-05-28",
    coordinator_name: "Dr. Shalini S. Nair",
    participant_count: 550,
    faculty_participant_count: 50,
    expenditure_inr: 135000,
    mic_reward_points: 15,
    status: "scheduled",
    mic_verification_token: "MIC-ACT-2026-Q4S0-9943",
    report_url: undefined,
    created_at: "2027-05-01T08:00:00Z",
  },
];

const INITIAL_NISP_POLICIES: IicNispPolicy[] = [
  {
    id: "nisp-001",
    policy_dimension: "Budget Allocation for Innovation & Entrepreneurship",
    clause_title: "Mandatory Minimum 1% Institutional Budget Earmarking",
    description: "Statutory allocation of 1.25% of annual institutional operating budget directly into the Apex Innovation & Incubation Fund to support pre-incubation, prototyping, patent filings, and seed grants.",
    institutional_target: "₹45,00,000 INR (1.25% of Annual Budget)",
    budget_allocated_inr: 4500000,
    budget_percentage: 1.25,
    academic_incentives: "Direct seed grants up to ₹2.5 Lakhs per student/faculty prototype; 100% patent filing fee reimbursement.",
    equity_sharing_slab: "2.0% - 9.5% based on facility utilization tier",
    ip_ownership_terms: "100% student/faculty IP ownership when developed without exclusive institutional lab funding; 50:50 joint ownership when using institute capital.",
    status: "active_enacted",
    policy_resolution_token: "NISP-RES-2026-BD01-1029",
    created_at: "2026-06-15T10:00:00Z",
  },
  {
    id: "nisp-002",
    policy_dimension: "Academic Flexibility & Attendance Relief",
    clause_title: "Student Innovator & Founder Academic Relief Provisions",
    description: "Registered student founders working on incubatee startups receive up to 20% attendance waiver for innovation sprints, pitch competitions, and prototyping residencies.",
    institutional_target: "Up to 20% attendance waiver & deferred exams",
    budget_allocated_inr: 600000,
    budget_percentage: 1.25,
    academic_incentives: "Option to substitute 8th-semester capstone project with verified incubatee startup progress; deferred placement slot reservation.",
    equity_sharing_slab: "2.5% institutional equity stake",
    ip_ownership_terms: "Full commercialization rights retained by student founders with irrevocable royalty-free academic license for teaching.",
    status: "active_enacted",
    policy_resolution_token: "NISP-RES-2026-AF02-4412",
    created_at: "2026-06-15T10:00:00Z",
  },
  {
    id: "nisp-003",
    policy_dimension: "Academic Credit Mobility & Startup Credits",
    clause_title: "Earning Course Credits for Prototyping & Enterprise Creation",
    description: "Under NEP 2020 guidelines, students earn up to 8 academic credits toward elective requirements by filing patents, reaching TRL 6+, and securing external angel/grant funding.",
    institutional_target: "Up to 8 Academic Credits via BoS & Academic Council",
    budget_allocated_inr: 400000,
    budget_percentage: 1.25,
    academic_incentives: "Direct inclusion in Academic Bank of Credits (ABC) passbook under Skill Enhancement & Multidisciplinary buckets.",
    equity_sharing_slab: "3.0% equity in incorporated entities",
    ip_ownership_terms: "Inventorship fully accredited to student researchers with co-inventor credit to supervising faculty guides.",
    status: "active_enacted",
    policy_resolution_token: "NISP-RES-2026-CM03-8821",
    created_at: "2026-06-15T10:00:00Z",
  },
  {
    id: "nisp-004",
    policy_dimension: "Faculty Entrepreneurship & Sabbatical Provisions",
    clause_title: "Faculty Start-up Spin-Offs & Consulting Sabbaticals",
    description: "Tenured and tenure-track faculty are permitted to serve as Executive Directors or Technical Advisors in registered spin-off ventures with up to 1-year paid entrepreneurial sabbatical.",
    institutional_target: "1-Year Entrepreneurial Sabbatical & 20% Consulting Time",
    budget_allocated_inr: 1200000,
    budget_percentage: 1.25,
    academic_incentives: "Innovation and patent outcomes counted with triple weightage in Career Advancement Scheme (CAS) and annual appraisal.",
    equity_sharing_slab: "5.0% - 7.5% institutional equity stake",
    ip_ownership_terms: "Institutional TTO negotiates commercial licensing with 70% net royalties disbursed directly to faculty inventors.",
    status: "active_enacted",
    policy_resolution_token: "NISP-RES-2026-FE04-3310",
    created_at: "2026-06-15T10:00:00Z",
  },
  {
    id: "nisp-005",
    policy_dimension: "Pre-Incubation & Incubation Infrastructure Access",
    clause_title: "24/7 Maker Space, Industrial Prototyping & High-Performance Compute",
    description: "Guaranteed round-the-clock access to Tier-1 GPU supercomputing clusters, 5-axis CNC machining, Stratasys 3D printing, and wet-lab analytical instruments for all endorsed incubatees.",
    institutional_target: "24/7 Access to 12,000 sq.ft Maker Space & Supercomputing",
    budget_allocated_inr: 1800000,
    budget_percentage: 1.25,
    academic_incentives: "Zero-cost desk space, free high-speed bandwidth, and subsidized electrical utility tariff for the first 18 months of incubation.",
    equity_sharing_slab: "2.0% equity upon completion of 12 months",
    ip_ownership_terms: "Subsidized patent attorney support via Indian Patent Office empanelled counsels.",
    status: "active_enacted",
    policy_resolution_token: "NISP-RES-2026-PI05-6629",
    created_at: "2026-06-15T10:00:00Z",
  },
];

const INITIAL_YUKTI_INNOVATIONS: IicYuktiInnovation[] = [
  {
    id: "yukti-001",
    yukti_token: "YUKTI-2026-AG01-8192",
    title: "AeroAgri AI: Autonomous Multispectral Drone for Real-Time Crop Disease Diagnosis",
    lead_innovator: "Aditya V. Sharma (B.Tech ECE Final Year)",
    innovator_type: "student",
    department: "Electronics & Communication Engineering",
    domain: "Agriculture & Rural Deep-Tech",
    innovation_stage: "prototype",
    trl_level: 7,
    patent_status: "published",
    patent_application_no: "IN-2026-21049182",
    seed_funding_received_inr: 350000,
    moe_mic_evaluated: true,
    national_recognition_status: "National Top 30 Finalist (SIH 2026)",
    digital_signature_hash: "0x8fa3e91b4028cd76aa529c8e102f9a741369bcf2",
    created_at: "2026-09-10T11:00:00Z",
    updated_at: "2026-11-15T14:00:00Z",
  },
  {
    id: "yukti-002",
    yukti_token: "YUKTI-2026-HC02-3914",
    title: "CardioSense: Ultra-Low-Power Wearable Patch for Predictive Arrhythmia Detection",
    lead_innovator: "Dr. Shalini S. Nair & Riya Deshpande",
    innovator_type: "joint_consortium",
    department: "Artificial Intelligence & Biomedical Tech",
    domain: "Healthcare & MedTech Diagnostics",
    innovation_stage: "startup_commercialized",
    trl_level: 8,
    patent_status: "granted",
    patent_application_no: "IN-2025-41092811",
    seed_funding_received_inr: 750000,
    moe_mic_evaluated: true,
    national_recognition_status: "MoE Innovation Cell Seed Grant Winner",
    digital_signature_hash: "0x3bc791ef49021da6330182fc9910d54a20516bca",
    created_at: "2026-08-20T09:30:00Z",
    updated_at: "2026-12-05T16:00:00Z",
  },
  {
    id: "yukti-003",
    yukti_token: "YUKTI-2026-CL03-7281",
    title: "EcoCarbon: Graphene-Reinforced Bio-Composite Material from Agricultural Crop Residue",
    lead_innovator: "Prof. Vikramaditya Sen & Team CleanTech",
    innovator_type: "faculty",
    department: "Mechanical Engineering & Materials",
    domain: "ClimateTech, Circular Economy & Waste-to-Wealth",
    innovation_stage: "prototype",
    trl_level: 6,
    patent_status: "published",
    patent_application_no: "IN-2026-11082914",
    seed_funding_received_inr: 500000,
    moe_mic_evaluated: true,
    national_recognition_status: "DST-SERB & MoE Joint Showcase Gold Medal",
    digital_signature_hash: "0x77ae2409df881023aebc91104928feac880192ea",
    created_at: "2026-10-02T10:15:00Z",
    updated_at: "2027-01-10T12:00:00Z",
  },
  {
    id: "yukti-004",
    yukti_token: "YUKTI-2026-EN04-5510",
    title: "VoltGrid AI: Edge-Computing Smart Inverter for Microgrid Phase-Balancing",
    lead_innovator: "Kunal S. Mehta (M.Tech Power Systems)",
    innovator_type: "student",
    department: "Electrical Engineering",
    domain: "Clean Energy & Renewable Smart Grids",
    innovation_stage: "proof_of_concept",
    trl_level: 5,
    patent_status: "filed",
    patent_application_no: "IN-2026-31077421",
    seed_funding_received_inr: 250000,
    moe_mic_evaluated: true,
    national_recognition_status: "Shortlisted for National Innovation Fair 2027",
    digital_signature_hash: "0x91823abfca98028172cdef401928374a56b20194",
    created_at: "2026-11-12T14:00:00Z",
    updated_at: "2027-02-18T10:00:00Z",
  },
  {
    id: "yukti-005",
    yukti_token: "YUKTI-2026-CS05-1940",
    title: "ZeroLeak: Post-Quantum Cryptographic Microkernel for Critical Infrastructure SCADA",
    lead_innovator: "Dr. Arvind S. Kulkarni & Rohan K. Singhania",
    innovator_type: "joint_consortium",
    department: "Computer Science & Engineering",
    domain: "Cybersecurity & Defence Tech",
    innovation_stage: "prototype",
    trl_level: 7,
    patent_status: "published",
    patent_application_no: "IN-2026-21098402",
    seed_funding_received_inr: 600000,
    moe_mic_evaluated: true,
    national_recognition_status: "MoE Cyber Innovation Accelerator Selected",
    digital_signature_hash: "0x192830faeb9284102948cde9102837482910faec",
    created_at: "2026-12-01T15:30:00Z",
    updated_at: "2027-03-04T11:20:00Z",
  },
  {
    id: "yukti-006",
    yukti_token: "YUKTI-2026-WT06-8829",
    title: "HydroPure: Nano-Catalytic Autonomous Water Purification Kiosk for Rural Panchayats",
    lead_innovator: "Sneha P. Patil (B.Tech Chemical Engineering)",
    innovator_type: "student",
    department: "Chemical & Environmental Engineering",
    domain: "Sanitation, Clean Water & Smart Villages",
    innovation_stage: "startup_commercialized",
    trl_level: 8,
    patent_status: "granted",
    patent_application_no: "IN-2025-11029410",
    seed_funding_received_inr: 800000,
    moe_mic_evaluated: true,
    national_recognition_status: "Commercialized: Deployed across 18 Rural Gram Panchayats",
    digital_signature_hash: "0x6619028eab91029471fecba910283471629abce9",
    created_at: "2026-07-15T09:00:00Z",
    updated_at: "2027-03-25T17:00:00Z",
  },
];

const INITIAL_ARIIA_RANKING: IicAriiaRanking = {
  id: "ariia-2026",
  ranking_year: "2026-27",
  rank_band: "Band 1: Top 10-50 / Excellent",
  total_score: 89.65,
  mindset_development_score: 94.2,
  infrastructure_facilities_score: 91.5,
  annual_budget_expenditure_score: 86.8,
  patents_and_commercialization_score: 88.4,
  startups_graduated_score: 87.35,
  annual_dossier_token: "CL-ARIIA-2026-APEX-0941",
  created_at: "2026-08-01T08:00:00Z",
};

const INITIAL_PERFORMANCE_RATING: IicPerformanceRating = {
  id: "iic-rating-2026",
  council_code: "IIC-HEI-2026-APEX-0941",
  academic_year: "2026-27",
  star_rating: 5,
  cumulative_points: 98.4,
  national_percentile: 99.45,
  annual_certificate_token: "CL-IIC-CERT-2026-STAR5-9981",
  verified_by_mic: "Prof. Anil Sahasrabudhe (Chairman, MoE Innovation Cell)",
  qr_verification_url: "https://mic.gov.in/verify-iic?code=IIC-HEI-2026-APEX-0941",
  created_at: "2026-08-15T12:00:00Z",
};

// ==========================================
// Stateful Store & Operations
// ==========================================

let councilMembersStore = [...INITIAL_COUNCIL_MEMBERS];
let quarterlyActivitiesStore = [...INITIAL_QUARTERLY_ACTIVITIES];
let nispPoliciesStore = [...INITIAL_NISP_POLICIES];
let yuktiInnovationsStore = [...INITIAL_YUKTI_INNOVATIONS];
let ariiaRankingStore = { ...INITIAL_ARIIA_RANKING };
let performanceRatingStore = { ...INITIAL_PERFORMANCE_RATING };

export function getIicCouncilMembers(): IicCouncilMember[] {
  return [...councilMembersStore];
}

export function getIicQuarterlyActivities(): IicQuarterlyActivity[] {
  return [...quarterlyActivitiesStore];
}

export function getIicNispPolicies(): IicNispPolicy[] {
  return [...nispPoliciesStore];
}

export function getIicYuktiInnovations(): IicYuktiInnovation[] {
  return [...yuktiInnovationsStore];
}

export function getIicAriiaMetrics(): IicAriiaRanking {
  return { ...ariiaRankingStore };
}

export function getIicPerformanceRating(): IicPerformanceRating {
  return { ...performanceRatingStore };
}

export function getIicSummaryStats(): IicComplianceSummaryStats {
  const totalActivities = quarterlyActivitiesStore.length;
  const totalParticipants = quarterlyActivitiesStore.reduce(
    (sum, a) => sum + a.participant_count,
    0
  );
  const totalYukti = yuktiInnovationsStore.length;
  const commercialized = yuktiInnovationsStore.filter(
    (i) => i.innovation_stage === "startup_commercialized"
  ).length;

  return {
    councilCode: performanceRatingStore.council_code,
    academicYear: performanceRatingStore.academic_year,
    starRating: performanceRatingStore.star_rating,
    cumulativePoints: performanceRatingStore.cumulative_points,
    nationalPercentile: performanceRatingStore.national_percentile,
    rankBand: ariiaRankingStore.rank_band,
    nispBudgetAllocatedInr: 4500000,
    nispBudgetPct: 1.25,
    totalCouncilMembers: councilMembersStore.length,
    totalActivitiesConducted: totalActivities,
    totalParticipants: totalParticipants,
    totalYuktiInnovations: totalYukti,
    commercializedInnovations: commercialized,
    members: [...councilMembersStore],
    activities: [...quarterlyActivitiesStore],
    nispPolicies: [...nispPoliciesStore],
    innovations: [...yuktiInnovationsStore],
    ariiaRanking: { ...ariiaRankingStore },
    performanceRating: { ...performanceRatingStore },
  };
}

export function submitIicActivity(data: {
  title: string;
  category: IicActivityCategory;
  quarter: IicQuarter;
  coordinator_name: string;
  start_date: string;
  end_date: string;
  participant_count: number;
  faculty_participant_count?: number;
  expenditure_inr?: number;
  mic_reward_points?: number;
}): IicQuarterlyActivity {
  const newActivity: IicQuarterlyActivity = {
    id: `iic-act-${Date.now()}`,
    activity_code: `IIC-${data.quarter}-ACT-${Math.floor(10 + Math.random() * 90)}`,
    title: data.title,
    category: data.category,
    quarter: data.quarter,
    academic_year: "2026-27",
    start_date: data.start_date,
    end_date: data.end_date,
    coordinator_name: data.coordinator_name,
    participant_count: data.participant_count,
    faculty_participant_count: data.faculty_participant_count || 10,
    expenditure_inr: data.expenditure_inr || 35000,
    mic_reward_points: data.mic_reward_points || 20,
    status: "report_submitted",
    mic_verification_token: generateMicActivityToken(),
    report_url: `https://mic.gov.in/reports/2026/act-${Date.now()}.pdf`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  quarterlyActivitiesStore.unshift(newActivity);
  return newActivity;
}

export function updateActivityStatus(
  id: string,
  status: IicActivityStatus
): IicQuarterlyActivity | null {
  const index = quarterlyActivitiesStore.findIndex((a) => a.id === id);
  if (index === -1) return null;

  quarterlyActivitiesStore[index] = {
    ...quarterlyActivitiesStore[index],
    status,
    updated_at: new Date().toISOString(),
  };

  return quarterlyActivitiesStore[index];
}

export function submitYuktiInnovation(data: {
  title: string;
  lead_innovator: string;
  innovator_type: "student" | "faculty" | "joint_consortium";
  department: string;
  domain: string;
  innovation_stage: YuktiInnovationStage;
  trl_level: number;
  patent_status: YuktiPatentStatus;
  patent_application_no?: string;
  seed_funding_received_inr?: number;
}): IicYuktiInnovation {
  const newInnovation: IicYuktiInnovation = {
    id: `yukti-${Date.now()}`,
    yukti_token: generateYuktiToken(),
    title: data.title,
    lead_innovator: data.lead_innovator,
    innovator_type: data.innovator_type,
    department: data.department,
    domain: data.domain,
    innovation_stage: data.innovation_stage,
    trl_level: data.trl_level,
    patent_status: data.patent_status,
    patent_application_no: data.patent_application_no || `IN-2026-${Math.floor(10000000 + Math.random() * 90000000)}`,
    seed_funding_received_inr: data.seed_funding_received_inr || 150000,
    moe_mic_evaluated: true,
    national_recognition_status: "Verified MoE YUKTI Repository Listing",
    digital_signature_hash: generateIicDigitalSealHash(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  yuktiInnovationsStore.unshift(newInnovation);
  return newInnovation;
}

export function resetIicStore(): void {
  councilMembersStore = [...INITIAL_COUNCIL_MEMBERS];
  quarterlyActivitiesStore = [...INITIAL_QUARTERLY_ACTIVITIES];
  nispPoliciesStore = [...INITIAL_NISP_POLICIES];
  yuktiInnovationsStore = [...INITIAL_YUKTI_INNOVATIONS];
  ariiaRankingStore = { ...INITIAL_ARIIA_RANKING };
  performanceRatingStore = { ...INITIAL_PERFORMANCE_RATING };
}
