/**
 * CampusLens AI — Phase 21 Student Fees & Digital Payments Engine
 * Business logic for student fee calculations, clearance eligibility,
 * digital receipt generation, and scholarship matching.
 */

import {
  StudentFeeDue,
  FeeTransaction,
  ScholarshipProgram,
  ScholarshipApplication,
  StudentFeeSummary,
  InstitutionalFeeAnalytics,
  FeeCategory,
} from "@/types";

/**
 * Calculates a student's total financial standing and determines
 * if the student is cleared for exam hall tickets and campus services.
 */
export function calculateStudentFeeSummary(
  dues: StudentFeeDue[],
  studentName = "Arjun Sharma",
  rollNumber = "2023-CSE-042"
): StudentFeeSummary {
  let totalPayable = 0;
  let totalPaid = 0;
  let hasOverdue = false;
  let paidCount = 0;

  const now = new Date();

  dues.forEach((due) => {
    totalPayable += due.amount_due + (due.penalty_amount || 0);
    totalPaid += due.amount_paid || 0;

    const dueDate = new Date(due.due_date);
    if (due.status === "paid") {
      paidCount++;
    } else if (due.status === "overdue" || dueDate.getTime() < now.getTime()) {
      hasOverdue = true;
    }
  });

  const outstandingBalance = Math.max(0, totalPayable - totalPaid);

  // Clearance is granted if student has 0 outstanding balance OR no overdue core dues
  const feeClearanceStatus = outstandingBalance === 0 || !hasOverdue;

  return {
    studentId: dues[0]?.student_id || "usr-demo-01",
    studentName,
    rollNumber,
    totalPayable,
    totalPaid,
    outstandingBalance,
    hasOverdue,
    feeClearanceStatus,
    duesCount: dues.length,
    paidCount,
  };
}

/**
 * Generates an official verifiable receipt tracking code.
 */
export function generateReceiptNumber(category: FeeCategory): string {
  const prefixMap: Record<FeeCategory, string> = {
    tuition: "TUI",
    hostel: "HST",
    library: "LIB",
    examination: "EXM",
    lab_equipment: "LAB",
  };
  const prefix = prefixMap[category] || "GEN";
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CL-REC-${prefix}-2026-${randomSuffix}`;
}

/**
 * Evaluates whether a student meets the criteria for a financial aid or scholarship grant.
 */
export function checkScholarshipEligibility(
  scholarship: ScholarshipProgram,
  student: { cgpa: number; familyIncome: number }
): { isEligible: boolean; reasons: string[] } {
  const reasons: string[] = [];

  if (student.cgpa < scholarship.min_cgpa) {
    reasons.push(
      `CGPA (${student.cgpa.toFixed(2)}) is below the required ${scholarship.min_cgpa.toFixed(2)}`
    );
  }

  if (student.familyIncome > scholarship.max_family_income) {
    reasons.push(
      `Annual family income (₹${(student.familyIncome / 100000).toFixed(1)}L) exceeds the ceiling of ₹${(scholarship.max_family_income / 100000).toFixed(1)}L`
    );
  }

  return {
    isEligible: reasons.length === 0,
    reasons,
  };
}

// -------------------------------------------------------------
// Seed Data: Realistic Student Fee Accounts & Institutional Ledger
// -------------------------------------------------------------

export const MOCK_STUDENT_FEE_DUES: StudentFeeDue[] = [
  {
    id: "fee-001",
    college_id: "c0000000-0000-0000-0000-000000000001",
    student_id: "usr-demo-01",
    semester: "Semester 5",
    academic_year: "2026-2027",
    category: "tuition",
    title: "Semester 5 Core Engineering Tuition",
    amount_due: 65000,
    amount_paid: 65000,
    penalty_amount: 0,
    due_date: "2026-08-15",
    status: "paid",
    created_at: "2026-07-01T00:00:00Z",
  },
  {
    id: "fee-002",
    college_id: "c0000000-0000-0000-0000-000000000001",
    student_id: "usr-demo-01",
    semester: "Semester 5",
    academic_year: "2026-2027",
    category: "examination",
    title: "End-Semester Examination & Hall Ticket Fee",
    amount_due: 3500,
    amount_paid: 3500,
    penalty_amount: 0,
    due_date: "2026-09-10",
    status: "paid",
    created_at: "2026-08-20T00:00:00Z",
  },
  {
    id: "fee-003",
    college_id: "c0000000-0000-0000-0000-000000000001",
    student_id: "usr-demo-01",
    semester: "Semester 5",
    academic_year: "2026-2027",
    category: "lab_equipment",
    title: "Advanced AI & Cloud Computing Lab Access",
    amount_due: 12000,
    amount_paid: 0,
    penalty_amount: 0,
    due_date: "2026-10-25",
    status: "pending",
    created_at: "2026-09-01T00:00:00Z",
  },
  {
    id: "fee-004",
    college_id: "c0000000-0000-0000-0000-000000000001",
    student_id: "usr-demo-01",
    semester: "Semester 5",
    academic_year: "2026-2027",
    category: "hostel",
    title: "Hostel Residency & Mess Dues (Q3)",
    amount_due: 28000,
    amount_paid: 14000,
    penalty_amount: 0,
    due_date: "2026-11-15",
    status: "partially_paid",
    created_at: "2026-09-05T00:00:00Z",
  },
  {
    id: "fee-005",
    college_id: "c0000000-0000-0000-0000-000000000001",
    student_id: "usr-demo-01",
    semester: "Semester 5",
    academic_year: "2026-2027",
    category: "library",
    title: "Central Digital Library Subscription & Book Access",
    amount_due: 1500,
    amount_paid: 1500,
    penalty_amount: 0,
    due_date: "2026-08-30",
    status: "paid",
    created_at: "2026-08-01T00:00:00Z",
  },
];

export const MOCK_FEE_TRANSACTIONS: FeeTransaction[] = [
  {
    id: "tx-001",
    fee_due_id: "fee-001",
    student_id: "usr-demo-01",
    college_id: "c0000000-0000-0000-0000-000000000001",
    transaction_ref: "TXN-UPI-2026-908234",
    payment_method: "upi",
    amount_paid: 65000,
    payment_date: "2026-08-10T14:32:00Z",
    receipt_number: "CL-REC-TUI-2026-4891",
    status: "success",
    fee_title: "Semester 5 Core Engineering Tuition",
    category: "tuition",
    gateway_response_id: "rzp_live_89a7f34bc9d2",
  },
  {
    id: "tx-002",
    fee_due_id: "fee-002",
    student_id: "usr-demo-01",
    college_id: "c0000000-0000-0000-0000-000000000001",
    transaction_ref: "TXN-CARD-2026-118274",
    payment_method: "credit_card",
    amount_paid: 3500,
    payment_date: "2026-09-02T11:15:00Z",
    receipt_number: "CL-REC-EXM-2026-7732",
    status: "success",
    fee_title: "End-Semester Examination & Hall Ticket Fee",
    category: "examination",
    gateway_response_id: "rzp_live_55a12ef901cb",
  },
  {
    id: "tx-003",
    fee_due_id: "fee-004",
    student_id: "usr-demo-01",
    college_id: "c0000000-0000-0000-0000-000000000001",
    transaction_ref: "TXN-NB-2026-443890",
    payment_method: "net_banking",
    amount_paid: 14000,
    payment_date: "2026-09-12T16:45:00Z",
    receipt_number: "CL-REC-HST-2026-3390",
    status: "success",
    fee_title: "Hostel Residency & Mess Dues (Q3) - Part 1",
    category: "hostel",
    gateway_response_id: "rzp_live_33f99b22a001",
  },
];

export const MOCK_SCHOLARSHIPS: ScholarshipProgram[] = [
  {
    id: "sch-001",
    college_id: "c0000000-0000-0000-0000-000000000001",
    title: "Apex Academic Excellence Merit Scholarship",
    provider: "Institutional Trust & Endowment",
    grant_amount: 40000,
    min_cgpa: 8.5,
    max_family_income: 1200000,
    deadline: "2026-10-31",
    status: "open",
    description:
      "Full or partial tuition fee waiver awarded to students demonstrating top 5% academic performance with consistent CGPA >= 8.5.",
    eligibility_criteria: ["CGPA >= 8.50", "Clean disciplinary track", "Zero active backlogs"],
  },
  {
    id: "sch-002",
    college_id: "c0000000-0000-0000-0000-000000000001",
    title: "National STEM Leadership Fellowship",
    provider: "Ministry of Education & DST",
    grant_amount: 50000,
    min_cgpa: 8.0,
    max_family_income: 600000,
    deadline: "2026-11-15",
    status: "open",
    description:
      "Central government financial grant supporting meritorious engineering scholars in computer science and advanced electronics.",
    eligibility_criteria: ["CGPA >= 8.00", "Annual income < 6 Lakhs", "Enrolled in B.Tech STEM"],
  },
  {
    id: "sch-003",
    college_id: "c0000000-0000-0000-0000-000000000001",
    title: "Corporate AI & Cloud Diversity Grant",
    provider: "Tech Mahindra Foundation",
    grant_amount: 30000,
    min_cgpa: 7.5,
    max_family_income: 800000,
    deadline: "2026-10-20",
    status: "open",
    description:
      "Industry fellowship covering semester laboratory and computing lab fees for students excelling in machine learning coursework.",
    eligibility_criteria: ["CGPA >= 7.50", "Verified project in AI/Cloud"],
  },
];

export const MOCK_SCHOLARSHIP_APPLICATIONS: ScholarshipApplication[] = [
  {
    id: "sapp-001",
    scholarship_id: "sch-001",
    student_id: "usr-demo-01",
    college_id: "c0000000-0000-0000-0000-000000000001",
    applied_at: "2026-09-15T10:00:00Z",
    status: "under_review",
    disbursed_amount: 0,
    notes: "Academic transcripts verified. Scheduled for final dean board review.",
    scholarship: MOCK_SCHOLARSHIPS[0],
  },
];

export const MOCK_INSTITUTIONAL_FEE_STATS: InstitutionalFeeAnalytics = {
  totalExpectedRevenue: 48500000,
  totalCollectedRevenue: 43200000,
  totalOutstandingRevenue: 5300000,
  overallCollectionPercentage: 89.1,
  totalStudentsClear: 2140,
  totalStudentsPending: 260,
  categoryBreakdown: [
    { category: "tuition", collected: 32000000, pending: 3500000 },
    { category: "hostel", collected: 6800000, pending: 1100000 },
    { category: "examination", collected: 2100000, pending: 200000 },
    { category: "lab_equipment", collected: 1500000, pending: 400000 },
    { category: "library", collected: 800000, pending: 100000 },
  ],
};
