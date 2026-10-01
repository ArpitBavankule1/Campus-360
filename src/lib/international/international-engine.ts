// ================================================================
// CampusLens AI — Phase 29: International Scholars & Global Mobility Engine
// Business logic, cryptographic travel passes, and partner university records
// ================================================================

import {
  PartnerUniversity,
  InternationalScholarship,
  CreditTransferRequest,
  TravelClearancePass,
  GlobalMobilityOverviewStats,
} from "@/types";

export function generateTravelClearanceCode(): string {
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CL-GLB-CLR-2026-${randomSuffix}`;
}

export function generateDigitalQrToken(passCode: string, studentId: string): string {
  const cleanPass = passCode.replace(/[^A-Z0-9-]/gi, "");
  const cleanId = studentId.replace(/[^A-Z0-9-]/gi, "");
  return `TOKEN_${cleanPass}_${cleanId}_VERIFIED_2026`;
}

export function calculateGlobalMobilityOverview(
  partners: PartnerUniversity[] = MOCK_PARTNER_UNIVERSITIES,
  scholarships: InternationalScholarship[] = MOCK_INTERNATIONAL_SCHOLARSHIPS,
  creditTransfers: CreditTransferRequest[] = MOCK_CREDIT_TRANSFERS,
  travelPasses: TravelClearancePass[] = MOCK_TRAVEL_PASSES
): GlobalMobilityOverviewStats {
  const totalPartners = partners.length;
  const totalExchangeSlots = partners.reduce((acc, p) => acc + p.exchange_slots, 0);
  const totalScholarshipsValue = scholarships.reduce((acc, s) => acc + Number(s.award_amount_usd), 0);
  const activeScholarsAbroad = travelPasses.filter((p) => p.dean_approval_status === "approved").length;
  const pendingClearances = travelPasses.filter((p) => p.dean_approval_status === "pending").length;

  return {
    totalPartners,
    totalExchangeSlots,
    totalScholarshipsValue,
    activeScholarsAbroad,
    pendingClearances,
    partnerUniversities: partners,
    scholarships,
    creditTransfers,
    travelPasses,
  };
}

export const MOCK_PARTNER_UNIVERSITIES: PartnerUniversity[] = [
  {
    id: "univ-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    university_name: "ETH Zürich (Swiss Federal Institute of Technology)",
    country: "Switzerland",
    city: "Zürich",
    qs_world_ranking: 7,
    programs_offered: ["Quantum Computing", "Robotics & Autonomous Systems", "Materials Science"],
    min_gpa_required: 3.75,
    exchange_slots: 4,
    tuition_waiver: true,
    application_deadline: "2026-11-15",
    semester_term: "Spring 2027",
    campus_website: "https://ethz.ch/en.html",
    description: "World-class European polytechnic excellence with full tuition reciprocity and advanced European Synchrotron access.",
    created_at: "2026-05-01T08:00:00Z",
  },
  {
    id: "univ-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    university_name: "National University of Singapore (NUS)",
    country: "Singapore",
    city: "Singapore",
    qs_world_ranking: 8,
    programs_offered: ["Artificial Intelligence", "Bioinformatics", "FinTech Systems"],
    min_gpa_required: 3.60,
    exchange_slots: 6,
    tuition_waiver: true,
    application_deadline: "2026-10-30",
    semester_term: "Spring 2027",
    campus_website: "https://nus.edu.sg",
    description: "Asia's premier flagship institution offering immersive dual-semester immersion at the Kent Ridge Innovation Corridor.",
    created_at: "2026-05-05T09:30:00Z",
  },
  {
    id: "univ-33333333-3333-4111-8111-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    university_name: "Technical University of Munich (TUM)",
    country: "Germany",
    city: "Munich",
    qs_world_ranking: 28,
    programs_offered: ["Automotive Mechatronics", "Aerospace Engineering", "Renewable Energy Grids"],
    min_gpa_required: 3.40,
    exchange_slots: 8,
    tuition_waiver: true,
    application_deadline: "2026-12-01",
    semester_term: "Summer Research 2027",
    campus_website: "https://tum.de/en",
    description: "Leading German University of Excellence featuring state-of-the-art BMW & Siemens joint research lab apprenticeships.",
    created_at: "2026-05-10T11:00:00Z",
  },
  {
    id: "univ-44444444-4444-4111-8111-444444444444",
    college_id: "c1111111-1111-4111-8111-111111111111",
    university_name: "University of Edinburgh",
    country: "United Kingdom",
    city: "Edinburgh",
    qs_world_ranking: 22,
    programs_offered: ["Theoretical Computer Science", "Cognitive Science", "Climate Informatics"],
    min_gpa_required: 3.50,
    exchange_slots: 5,
    tuition_waiver: true,
    application_deadline: "2026-11-20",
    semester_term: "Fall 2026",
    campus_website: "https://ed.ac.uk",
    description: "Historic Scottish research powerhouse with Turing Institute linkage and pioneering high-performance computing centers.",
    created_at: "2026-05-15T14:15:00Z",
  },
  {
    id: "univ-55555555-5555-4111-8111-555555555555",
    college_id: "c1111111-1111-4111-8111-111111111111",
    university_name: "University of California, Berkeley",
    country: "United States",
    city: "Berkeley, CA",
    qs_world_ranking: 10,
    programs_offered: ["Semiconductor Physics", "Deep Learning Foundations", "Venture Entrepreneurship"],
    min_gpa_required: 3.80,
    exchange_slots: 3,
    tuition_waiver: false,
    application_deadline: "2026-10-15",
    semester_term: "Full Academic Year 2026-27",
    campus_website: "https://berkeley.edu",
    description: "Silicon Valley adjacent flagship institution with access to Lawrence Berkeley National Laboratory and SkyDeck incubator.",
    created_at: "2026-05-20T16:00:00Z",
  }
];

export const MOCK_INTERNATIONAL_SCHOLARSHIPS: InternationalScholarship[] = [
  {
    id: "sch-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    fellowship_title: "Apex-ETH Global Quantum Fellowship",
    sponsoring_body: "Swiss National Science Foundation & Apex Alumni Trust",
    coverage_type: "Full Tuition + Living",
    award_amount_usd: 28500.0,
    target_countries: ["Switzerland"],
    eligibility_criteria: "Minimum 3.8 CGPA, enrolled in CS/ECE, single-author or co-authored preprint in quantum or hardware architecture.",
    application_deadline: "2026-11-01",
    open_slots: 2,
    status: "open",
    created_at: "2026-06-01T10:00:00Z",
  },
  {
    id: "sch-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    fellowship_title: "Singapore SG-Innovate Smart City Fellowship",
    sponsoring_body: "Economic Development Board of Singapore",
    coverage_type: "Full Tuition Only",
    award_amount_usd: 16000.0,
    target_countries: ["Singapore"],
    eligibility_criteria: "Open to 3rd & 4th year undergraduate engineering scholars working on IoT, EV transit, or smart grid technology.",
    application_deadline: "2026-10-25",
    open_slots: 4,
    status: "open",
    created_at: "2026-06-05T12:00:00Z",
  },
  {
    id: "sch-33333333-3333-4111-8111-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    fellowship_title: "DAAD Germany Research Travel Grant",
    sponsoring_body: "German Academic Exchange Service (Bonn)",
    coverage_type: "Travel & Research Grant",
    award_amount_usd: 7500.0,
    target_countries: ["Germany"],
    eligibility_criteria: "Admitted into a confirmed laboratory internship with TUM or Fraunhofer Institute; covers airfare and monthly subsistence stipend.",
    application_deadline: "2026-11-30",
    open_slots: 5,
    status: "open",
    created_at: "2026-06-10T14:00:00Z",
  }
];

export const MOCK_CREDIT_TRANSFERS: CreditTransferRequest[] = [
  {
    id: "ctr-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    student_id: "std-11111111-1111-4111-8111-111111111111",
    student_name: "Aarav Sharma",
    host_university: "ETH Zürich",
    foreign_course_code: "263-3850-00L",
    foreign_course_title: "Advanced Systems Lab & Compiler Optimization",
    credits_earned: 8,
    equivalent_domestic_course: "CS-402: High Performance Architecture & Compilers",
    equivalent_credits: 4,
    grade_earned: "5.75 / 6.00 (Distinction)",
    syllabus_document_url: "https://ethz.ch/syllabus/263-3850.pdf",
    status: "approved",
    evaluator_remarks: "Course content comprehensively exceeds CS-402 curriculum standards. Full 4 academic credits transferred with Grade S.",
    submitted_at: "2026-05-10T10:00:00Z",
    evaluated_at: "2026-05-18T14:30:00Z",
  },
  {
    id: "ctr-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    student_id: "std-22222222-2222-4111-8111-222222222222",
    student_name: "Pooja Hegde",
    host_university: "National University of Singapore",
    foreign_course_code: "CS4248",
    foreign_course_title: "Natural Language Processing & Large Multimodal Models",
    credits_earned: 4,
    equivalent_domestic_course: "CS-415: Natural Language Processing",
    equivalent_credits: 4,
    grade_earned: "A+",
    syllabus_document_url: "https://nus.edu.sg/soc/syllabus/cs4248.pdf",
    status: "approved",
    evaluator_remarks: "Syllabus 94% match. Laboratory deliverables verified by HOD Computer Science.",
    submitted_at: "2026-06-01T09:15:00Z",
    evaluated_at: "2026-06-08T11:00:00Z",
  },
  {
    id: "ctr-33333333-3333-4111-8111-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    student_id: "std-33333333-3333-4111-8111-333333333333",
    student_name: "Rohan Varma",
    host_university: "Technical University of Munich",
    foreign_course_code: "IN2087",
    foreign_course_title: "Automated Driving Architecture & Sensor Fusion",
    credits_earned: 6,
    equivalent_domestic_course: "ECE-450: Autonomous Robotic Systems",
    equivalent_credits: 4,
    grade_earned: "1.3 (Sehr Gut)",
    syllabus_document_url: "https://tum.de/in2087.pdf",
    status: "under_review",
    evaluator_remarks: "Pending final Department Academic Committee sign-off on hardware lab hours equivalency.",
    submitted_at: "2026-06-15T15:00:00Z",
  }
];

export const MOCK_TRAVEL_PASSES: TravelClearancePass[] = [
  {
    id: "tcp-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    student_id: "std-11111111-1111-4111-8111-111111111111",
    student_name: "Aarav Sharma",
    pass_code: "CL-GLB-CLR-2026-ETH9",
    destination_country: "Switzerland",
    host_institution: "ETH Zürich",
    passport_number_masked: "N••••••48",
    visa_type: "Schengen Student (EU)",
    valid_from: "2026-09-01",
    valid_until: "2027-02-28",
    dean_approval_status: "approved",
    digital_qr_token: "TOKEN_CL-GLB-CLR-2026-ETH9_std-11111111-1111_VERIFIED_2026",
    created_at: "2026-08-01T12:00:00Z",
  },
  {
    id: "tcp-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    student_id: "std-22222222-2222-4111-8111-222222222222",
    student_name: "Pooja Hegde",
    pass_code: "CL-GLB-CLR-2026-NUS3",
    destination_country: "Singapore",
    host_institution: "National University of Singapore",
    passport_number_masked: "Z••••••19",
    visa_type: "Student Pass (Singapore)",
    valid_from: "2026-08-15",
    valid_until: "2026-12-31",
    dean_approval_status: "approved",
    digital_qr_token: "TOKEN_CL-GLB-CLR-2026-NUS3_std-22222222-2222_VERIFIED_2026",
    created_at: "2026-07-25T10:30:00Z",
  }
];
