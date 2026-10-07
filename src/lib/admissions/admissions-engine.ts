// CampusLens AI — Phase 42: Smart Campus Admissions, Program Application & Seat Allocation Gateway
// src/lib/admissions/admissions-engine.ts

import {
  AcademicProgram,
  AdmissionApplication,
  SeatAllotmentDocket,
  CampusTourBooking,
  AdmissionsOverviewStats,
} from "@/types";

export function generateApplicationNumber(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-ADM-APP-2026-${rand}`;
}

export function generateAllotmentNumber(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-ADM-SEAT-2026-${rand}`;
}

export function generateTourBookingCode(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-ADM-TOUR-2026-${rand}`;
}

export function generateProvisionalOfferLetterId(): string {
  const hex = Math.floor(0x100000 + Math.random() * 0xefffff)
    .toString(16)
    .toUpperCase();
  return `CL-ADM-OFFER-2026-${hex}`;
}

export const MOCK_ACADEMIC_PROGRAMS: AcademicProgram[] = [
  {
    id: "prog-1",
    college_id: "c0000000-0000-0000-0000-000000000001",
    program_code: "BTECH-CSE",
    program_name: "B.Tech in Computer Science & Engineering (AI & Systems)",
    department: "Computer Science and Engineering",
    degree_level: "Undergraduate (B.Tech)",
    duration_years: 4,
    total_seats: 180,
    available_seats: 24,
    annual_tuition_inr: 220000,
    eligibility_cutoff: "JEE Main / Advanced (Percentile >= 96.5) or Apex CET Rank <= 1200",
    accreditation: "NBA Tier-1 (Washington Accord) & NAAC A++",
    application_deadline: "2026-11-15",
    is_admissions_open: true,
    brochure_url: "/docs/brochures/btech-cse-curriculum-2026.pdf",
    created_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "prog-2",
    college_id: "c0000000-0000-0000-0000-000000000001",
    program_code: "BTECH-AI-ROB",
    program_name: "B.Tech in Artificial Intelligence & Autonomous Robotics",
    department: "Computer Science and Engineering",
    degree_level: "Undergraduate (B.Tech)",
    duration_years: 4,
    total_seats: 120,
    available_seats: 18,
    annual_tuition_inr: 240000,
    eligibility_cutoff: "JEE Main (Percentile >= 95.0) or State CET Rank <= 2400",
    accreditation: "NBA Tier-1 & AICTE National Center of Excellence",
    application_deadline: "2026-11-20",
    is_admissions_open: true,
    brochure_url: "/docs/brochures/btech-ai-robotics-2026.pdf",
    created_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "prog-3",
    college_id: "c0000000-0000-0000-0000-000000000001",
    program_code: "MTECH-DS-CYBER",
    program_name: "M.Tech in Data Science & Quantum Cybersecurity",
    department: "Information Technology",
    degree_level: "Postgraduate (M.Tech)",
    duration_years: 2,
    total_seats: 60,
    available_seats: 12,
    annual_tuition_inr: 180000,
    eligibility_cutoff: "GATE Score >= 580 (CS/IT/EC) or Apex PG Entrance Rank <= 450",
    accreditation: "NBA Accredited & DST Center for Cyber-Physical Systems",
    application_deadline: "2026-11-30",
    is_admissions_open: true,
    brochure_url: "/docs/brochures/mtech-datascience-2026.pdf",
    created_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "prog-4",
    college_id: "c0000000-0000-0000-0000-000000000001",
    program_code: "MBA-TECH-INNOV",
    program_name: "MBA in Technology Management & Venture Incubation",
    department: "Management Studies",
    degree_level: "Master of Business Administration (MBA)",
    duration_years: 2,
    total_seats: 90,
    available_seats: 31,
    annual_tuition_inr: 350000,
    eligibility_cutoff: "CAT Percentile >= 85.0 or GMAT Score >= 640 + Personal Interview",
    accreditation: "AACSB Member & AICTE Approved",
    application_deadline: "2026-12-05",
    is_admissions_open: true,
    brochure_url: "/docs/brochures/mba-technology-2026.pdf",
    created_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "prog-5",
    college_id: "c0000000-0000-0000-0000-000000000001",
    program_code: "PHD-COMP-NEURO",
    program_name: "Ph.D. in Computational Neuroscience & Quantum ML",
    department: "Research & Advanced Studies",
    degree_level: "Doctor of Philosophy (Ph.D.)",
    duration_years: 3.5,
    total_seats: 25,
    available_seats: 7,
    annual_tuition_inr: 75000,
    eligibility_cutoff: "CSIR-UGC NET JRF or GATE Score >= 650 + Research Proposal Defense",
    accreditation: "Institute of National Eminence Recognized",
    application_deadline: "2026-12-15",
    is_admissions_open: true,
    brochure_url: "/docs/brochures/phd-quantum-neuro-2026.pdf",
    created_at: "2026-08-01T00:00:00Z",
  },
];

export const MOCK_ADMISSION_APPLICATIONS: AdmissionApplication[] = [
  {
    id: "app-1",
    college_id: "c0000000-0000-0000-0000-000000000001",
    application_number: "CL-ADM-APP-2026-4081",
    candidate_name: "Rohan V. Deshmukh",
    email: "rohan.deshmukh2026@gmail.com",
    phone: "+91 98201 44520",
    program_code: "BTECH-CSE",
    program_name: "B.Tech in Computer Science & Engineering (AI & Systems)",
    quota_category: "All India Open (General)",
    entrance_exam: "JEE Advanced 2026",
    entrance_score_rank: "AIR 842",
    qualifying_percentage: 95.8,
    statement_of_purpose: "Aspiring to research scalable distributed operating systems and decentralized consensus networks.",
    status: "seat_allotted",
    allotment_token: "CL-ADM-SEAT-2026-8921",
    provisional_letter_id: "CL-ADM-OFFER-2026-7B891A",
    application_fee_paid: true,
    applied_at: "2026-09-15T10:30:00Z",
    created_at: "2026-09-15T10:30:00Z",
  },
  {
    id: "app-2",
    college_id: "c0000000-0000-0000-0000-000000000001",
    application_number: "CL-ADM-APP-2026-7129",
    candidate_name: "Tanvi S. Kulkarni",
    email: "tanvi.kulkarni@outlook.com",
    phone: "+91 94220 89104",
    program_code: "BTECH-AI-ROB",
    program_name: "B.Tech in Artificial Intelligence & Autonomous Robotics",
    quota_category: "OBC-NCL",
    entrance_exam: "Apex National CET",
    entrance_score_rank: "Rank 348",
    qualifying_percentage: 94.2,
    statement_of_purpose: "Focused on bio-inspired swarm robotics and edge vision processing for search and rescue operations.",
    status: "document_verified",
    allotment_token: null,
    provisional_letter_id: null,
    application_fee_paid: true,
    applied_at: "2026-09-20T14:15:00Z",
    created_at: "2026-09-20T14:15:00Z",
  },
  {
    id: "app-3",
    college_id: "c0000000-0000-0000-0000-000000000001",
    application_number: "CL-ADM-APP-2026-1934",
    candidate_name: "Vikramaditya Sengupta",
    email: "vikram.sengupta@iitkgp.alumni",
    phone: "+91 98310 22001",
    program_code: "MTECH-DS-CYBER",
    program_name: "M.Tech in Data Science & Quantum Cybersecurity",
    quota_category: "EWS",
    entrance_exam: "GATE CS/IT 2026",
    entrance_score_rank: "Score 710 (AIR 142)",
    qualifying_percentage: 89.4,
    statement_of_purpose: "Specializing in lattice-based post-quantum cryptography algorithms and zero-knowledge privacy protocols.",
    status: "provisional_admitted",
    allotment_token: "CL-ADM-SEAT-2026-3114",
    provisional_letter_id: "CL-ADM-OFFER-2026-2F109C",
    application_fee_paid: true,
    applied_at: "2026-09-08T09:00:00Z",
    created_at: "2026-09-08T09:00:00Z",
  },
];

export const MOCK_SEAT_ALLOTMENTS: SeatAllotmentDocket[] = [
  {
    id: "allot-1",
    college_id: "c0000000-0000-0000-0000-000000000001",
    allotment_number: "CL-ADM-SEAT-2026-8921",
    candidate_name: "Rohan V. Deshmukh",
    application_number: "CL-ADM-APP-2026-4081",
    program_code: "BTECH-CSE",
    program_name: "B.Tech in Computer Science & Engineering (AI & Systems)",
    counseling_round: "Round 1 (Merit Allocation)",
    allotted_category: "All India Open (General)",
    merit_rank: 842,
    acceptance_deadline: "2026-10-25",
    seat_lock_deposit_inr: 25000,
    is_seat_accepted: true,
    provisional_letter_url: "/admissions/letters/CL-ADM-OFFER-2026-7B891A.pdf",
    created_at: "2026-10-01T12:00:00Z",
  },
  {
    id: "allot-2",
    college_id: "c0000000-0000-0000-0000-000000000001",
    allotment_number: "CL-ADM-SEAT-2026-3114",
    candidate_name: "Vikramaditya Sengupta",
    application_number: "CL-ADM-APP-2026-1934",
    program_code: "MTECH-DS-CYBER",
    program_name: "M.Tech in Data Science & Quantum Cybersecurity",
    counseling_round: "Round 1 (Merit Allocation)",
    allotted_category: "EWS",
    merit_rank: 142,
    acceptance_deadline: "2026-10-22",
    seat_lock_deposit_inr: 25000,
    is_seat_accepted: true,
    provisional_letter_url: "/admissions/letters/CL-ADM-OFFER-2026-2F109C.pdf",
    created_at: "2026-09-28T10:00:00Z",
  },
  {
    id: "allot-3",
    college_id: "c0000000-0000-0000-0000-000000000001",
    allotment_number: "CL-ADM-SEAT-2026-5542",
    candidate_name: "Aanya Verma",
    application_number: "CL-ADM-APP-2026-9011",
    program_code: "MBA-TECH-INNOV",
    program_name: "MBA in Technology Management & Venture Incubation",
    counseling_round: "Round 2 (Upgradation Round)",
    allotted_category: "All India Open (General)",
    merit_rank: 418,
    acceptance_deadline: "2026-10-28",
    seat_lock_deposit_inr: 25000,
    is_seat_accepted: false,
    provisional_letter_url: "/admissions/letters/CL-ADM-OFFER-2026-88F41D.pdf",
    created_at: "2026-10-04T15:30:00Z",
  },
];

export const MOCK_TOUR_BOOKINGS: CampusTourBooking[] = [
  {
    id: "tour-1",
    college_id: "c0000000-0000-0000-0000-000000000001",
    booking_code: "CL-ADM-TOUR-2026-2091",
    candidate_name: "Ananya Iyer & Parents",
    email: "ananya.iyer.family@gmail.com",
    phone: "+91 98400 12390",
    preferred_date: "2026-10-18",
    time_slot: "10:30 AM - 12:30 PM",
    tour_mode: "In-Person Welcome Center",
    assigned_counselor: "Prof. Sudhir Rao (Dean Admissions)",
    guests_count: 3,
    status: "confirmed",
    created_at: "2026-10-02T11:00:00Z",
  },
  {
    id: "tour-2",
    college_id: "c0000000-0000-0000-0000-000000000001",
    booking_code: "CL-ADM-TOUR-2026-7734",
    candidate_name: "Kabir Malhotra",
    email: "kabir.malhotra.tech@gmail.com",
    phone: "+91 97110 54321",
    preferred_date: "2026-10-20",
    time_slot: "03:00 PM - 04:30 PM",
    tour_mode: "Virtual 360 Video Tour",
    assigned_counselor: "Dr. Pallavi Roy (Admissions Liaison)",
    guests_count: 1,
    status: "confirmed",
    created_at: "2026-10-05T09:30:00Z",
  },
];

export function calculateAdmissionsOverview(
  programs: AcademicProgram[] = MOCK_ACADEMIC_PROGRAMS,
  applications: AdmissionApplication[] = MOCK_ADMISSION_APPLICATIONS,
  allotments: SeatAllotmentDocket[] = MOCK_SEAT_ALLOTMENTS,
  tourBookings: CampusTourBooking[] = MOCK_TOUR_BOOKINGS
): AdmissionsOverviewStats {
  const totalProgramsCount = programs.length;
  const totalIntakeSeats = programs.reduce((acc, p) => acc + p.total_seats, 0);
  const totalApplicationsReceived = applications.length;
  const totalSeatsAllotted = allotments.length;

  return {
    totalProgramsCount,
    totalIntakeSeats,
    totalApplicationsReceived,
    totalSeatsAllotted,
    programs,
    applications,
    allotments,
    tourBookings,
  };
}
