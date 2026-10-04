// ================================================================
// CampusLens AI — Phase 37: Smart Campus Scholarships & Financial Aid Engine
// Scholarship eligibility calculator, award certificate generator & seed data
// ================================================================

import {
  ScholarshipScheme,
  ScholarshipApplication,
  DisbursementTranche,
  ScholarshipCertificate,
  ScholarshipOverviewStats,
} from "@/types";

export function generateScholarshipAppCode(): string {
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SCHOL-APP-2026-${randomSuffix}`;
}

export function generateTrancheCode(): string {
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DBT-TRN-2026-${randomSuffix}`;
}

export function generateCertificateCode(): string {
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CL-SCHOL-CERT-2026-${randomSuffix}`;
}

export function calculateScholarshipOverview(
  schemes: ScholarshipScheme[] = MOCK_SCHOLARSHIP_SCHEMES,
  applications: ScholarshipApplication[] = MOCK_SCHOLARSHIP_APPLICATIONS,
  disbursements: DisbursementTranche[] = MOCK_DISBURSEMENTS,
  certificates: ScholarshipCertificate[] = MOCK_SCHOLARSHIP_CERTIFICATES
): ScholarshipOverviewStats {
  const totalFunding = schemes.reduce((acc, s) => acc + s.total_budget_inr, 0);
  const totalDisbursed = schemes.reduce((acc, s) => acc + s.disbursed_budget_inr, 0);
  return {
    totalScholarshipFundingInr: totalFunding,
    totalDisbursedInr: totalDisbursed,
    activeSchemesCount: schemes.filter((s) => s.status === "Applications Open").length,
    scholarsBenefitedCount: 420,
    schemes,
    applications,
    disbursements,
    certificates,
  };
}

export const MOCK_SCHOLARSHIP_SCHEMES: ScholarshipScheme[] = [
  {
    id: "sch-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    scheme_name: "Apex Chairman's Academic Excellence Gold Fellowship",
    provider_type: "Institutional Merit",
    amount_per_scholar_inr: 120000,
    total_budget_inr: 6000000,
    disbursed_budget_inr: 3600000,
    min_cgpa: 9.0,
    max_family_income_lpa: 12.0,
    application_deadline: "2026-11-15",
    status: "Applications Open",
    created_at: "2026-01-10T08:00:00Z",
  },
  {
    id: "sch-22222222-2222-4222-8222-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    scheme_name: "Google DeepMind Diversity in STEM Innovation Grant",
    provider_type: "Corporate CSR",
    amount_per_scholar_inr: 150000,
    total_budget_inr: 7500000,
    disbursed_budget_inr: 4500000,
    min_cgpa: 8.2,
    max_family_income_lpa: 8.0,
    application_deadline: "2026-10-31",
    status: "Applications Open",
    created_at: "2026-01-10T08:00:00Z",
  },
  {
    id: "sch-33333333-3333-4333-8333-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    scheme_name: "Distinguished Alumni Class of 2004 Endowed Scholarship",
    provider_type: "Alumni Endowment",
    amount_per_scholar_inr: 80000,
    total_budget_inr: 3200000,
    disbursed_budget_inr: 2400000,
    min_cgpa: 7.8,
    max_family_income_lpa: 6.0,
    application_deadline: "2026-11-30",
    status: "Applications Open",
    created_at: "2026-01-10T08:00:00Z",
  },
  {
    id: "sch-44444444-4444-4444-8444-444444444444",
    college_id: "c1111111-1111-4111-8111-111111111111",
    scheme_name: "National Merit Post-Matric DBT Fellowship (Central Govt)",
    provider_type: "Government DBT",
    amount_per_scholar_inr: 100000,
    total_budget_inr: 10000000,
    disbursed_budget_inr: 8000000,
    min_cgpa: 7.0,
    max_family_income_lpa: 4.5,
    application_deadline: "2026-12-15",
    status: "Applications Open",
    created_at: "2026-01-10T08:00:00Z",
  },
];

export const MOCK_SCHOLARSHIP_APPLICATIONS: ScholarshipApplication[] = [
  {
    id: "app-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    application_code: "SCHOL-APP-2026-88A1",
    scheme_name: "Apex Chairman's Academic Excellence Gold Fellowship",
    scholar_id: "SCH-2026-8819",
    scholar_name: "Arpit Bavankule",
    department: "Computer Science & Engineering",
    current_cgpa: 9.42,
    annual_family_income_inr: 540000,
    status: "Dean Approved",
    statement_of_purpose: "Pursuing deep-learning optimization architectures for institutional IoT.",
    created_at: "2026-09-28T10:00:00Z",
  },
  {
    id: "app-22222222-2222-4222-8222-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    application_code: "SCHOL-APP-2026-33K9",
    scheme_name: "Google DeepMind Diversity in STEM Innovation Grant",
    scholar_id: "SCH-2026-4102",
    scholar_name: "Pooja Sharma",
    department: "Artificial Intelligence & Data Science",
    current_cgpa: 8.85,
    annual_family_income_inr: 420000,
    status: "Documents Verified",
    statement_of_purpose: "Researching multimodal foundation models for Indian rural healthcare.",
    created_at: "2026-10-01T11:30:00Z",
  },
];

export const MOCK_DISBURSEMENTS: DisbursementTranche[] = [
  {
    id: "dbt-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    tranche_code: "DBT-TRN-2026-99A1",
    scholar_id: "SCH-2026-8819",
    scholar_name: "Arpit Bavankule",
    scheme_name: "Apex Chairman's Academic Excellence Gold Fellowship",
    tranche_number: 1,
    amount_inr: 60000,
    bank_ref_no: "UTR-SBIN-2026-904128",
    disbursement_date: "2026-10-02",
    status: "Credited",
    created_at: "2026-10-02T12:00:00Z",
  },
  {
    id: "dbt-22222222-2222-4222-8222-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    tranche_code: "DBT-TRN-2026-77F4",
    scholar_id: "SCH-2026-4102",
    scholar_name: "Pooja Sharma",
    scheme_name: "Google DeepMind Diversity in STEM Innovation Grant",
    tranche_number: 1,
    amount_inr: 75000,
    bank_ref_no: "UTR-HDFC-2026-819203",
    disbursement_date: "2026-10-03",
    status: "Escrow Processing",
    created_at: "2026-10-03T10:00:00Z",
  },
];

export const MOCK_SCHOLARSHIP_CERTIFICATES: ScholarshipCertificate[] = [
  {
    id: "cert-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    certificate_code: "CL-SCHOL-CERT-2026-8819GOLD",
    scholar_name: "Arpit Bavankule",
    scheme_name: "Apex Chairman's Academic Excellence Gold Fellowship",
    academic_year: "2026-2027",
    award_title: "Chairman's Gold Scholar of Distinction",
    sanction_authority: "Dean of Academic Welfare & Financial Aid",
    issued_at: "2026-10-02T14:00:00Z",
  },
];
