/**
 * Phase 55: Smart Campus All India Survey on Higher Education (AISHE), Ministry of Education DCF Portal & Telemetry Engine
 * In-memory stateful store, token generators, seed data, and MoE/AISHE telemetry metrics.
 */

import {
  AisheInstitutionProfile,
  AisheDcfSurvey,
  AisheEnrollmentRecord,
  AisheFacultyCadre,
  AisheFinancialStatement,
  AisheInfrastructureAudit,
  AisheSummaryStats,
  AisheSurveyStatus,
  AisheDcfType,
  AisheDcfStatus,
  AisheProgrammeLevel,
  AisheCadreType,
} from "@/types";

// ==========================================
// Cryptographic & Format Generators
// ==========================================

export function generateAisheCertToken(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  const hex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AISHE-CERT-2026-${hex}-${num}`;
}

export function generateAisheDcfToken(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  const hex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AISHE-DCF-2026-${hex}-${num}`;
}

export function generateAisheUdinToken(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  const hex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `UDIN-2026-${hex}-${num}`;
}

export function generateAisheVerificationHash(): string {
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

export const MOCK_AISHE_PROFILE: AisheInstitutionProfile = {
  id: "aishe-prof-001",
  aishe_code: "C-48291",
  institution_name: "CampusLens Autonomous Institute of Technology",
  affiliating_university: "State Technological University (STU)",
  institution_type: "autonomous_affiliated_college",
  management_type: "private_unaided",
  survey_year: "2025-2026",
  year_of_establishment: 1998,
  nodal_officer_name: "Dr. Arvind S. Kulkarni",
  nodal_officer_email: "nodal.aishe@campuslens.edu.in",
  nodal_officer_phone: "+91 98220 54321",
  survey_status: "certified_submitted",
  certificate_token: "AISHE-CERT-2026-MOE-8842",
  verification_hash: "0x7f4e8b9a1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
  moe_approval_date: "2026-02-14",
  created_at: "2026-01-05T09:00:00Z",
  updated_at: "2026-02-14T16:30:00Z",
};

export const MOCK_AISHE_DCF_SURVEYS: AisheDcfSurvey[] = [
  {
    id: "dcf-2025-01",
    survey_year: "2025-2026",
    dcf_type: "DCF-II",
    submission_deadline: "2026-02-28",
    completion_percentage: 100.0,
    status: "approved_certified",
    block_a_basic_info: true,
    block_b_programmes: true,
    block_c_student_enrollment: true,
    block_d_foreign_students: true,
    block_e_staff_information: true,
    block_f_financial_info: true,
    block_g_infrastructure: true,
    block_h_scholarships: true,
    filing_token: "AISHE-DCF-2026-C48291-01",
    certified_by: "Dr. Arvind S. Kulkarni (AISHE Nodal Officer)",
    created_at: "2026-01-10T10:00:00Z",
  },
  {
    id: "dcf-2026-02",
    survey_year: "2026-2027",
    dcf_type: "DCF-II",
    submission_deadline: "2027-02-28",
    completion_percentage: 62.5,
    status: "under_verification",
    block_a_basic_info: true,
    block_b_programmes: true,
    block_c_student_enrollment: true,
    block_d_foreign_students: true,
    block_e_staff_information: true,
    block_f_financial_info: false,
    block_g_infrastructure: false,
    block_h_scholarships: false,
    filing_token: "AISHE-DCF-2027-C48291-02",
    certified_by: "Verification in Progress",
    created_at: "2026-08-15T11:30:00Z",
  },
  {
    id: "dcf-2024-00",
    survey_year: "2024-2025",
    dcf_type: "DCF-II",
    submission_deadline: "2025-02-28",
    completion_percentage: 100.0,
    status: "approved_certified",
    block_a_basic_info: true,
    block_b_programmes: true,
    block_c_student_enrollment: true,
    block_d_foreign_students: true,
    block_e_staff_information: true,
    block_f_financial_info: true,
    block_g_infrastructure: true,
    block_h_scholarships: true,
    filing_token: "AISHE-DCF-2025-C48291-99",
    certified_by: "Dr. Arvind S. Kulkarni (AISHE Nodal Officer)",
    created_at: "2025-01-12T10:00:00Z",
  },
];

export const MOCK_AISHE_ENROLLMENT: AisheEnrollmentRecord[] = [
  {
    id: "enr-ug-cse",
    survey_year: "2025-2026",
    programme_level: "undergraduate",
    discipline_name: "B.Tech Computer Science & Engineering",
    sanctioned_intake: 240,
    enrolled_male: 520,
    enrolled_female: 440,
    enrolled_transgender: 0,
    total_enrolled: 960,
    sc_count: 144,
    st_count: 72,
    obc_count: 288,
    general_count: 360,
    ews_count: 96,
    pwd_count: 18,
    out_of_state_count: 280,
    foreign_national_count: 14,
    created_at: "2026-01-15T10:00:00Z",
  },
  {
    id: "enr-ug-ece",
    survey_year: "2025-2026",
    programme_level: "undergraduate",
    discipline_name: "B.Tech Electronics & Communication Engineering",
    sanctioned_intake: 180,
    enrolled_male: 380,
    enrolled_female: 340,
    enrolled_transgender: 0,
    total_enrolled: 720,
    sc_count: 108,
    st_count: 54,
    obc_count: 216,
    general_count: 270,
    ews_count: 72,
    pwd_count: 12,
    out_of_state_count: 195,
    foreign_national_count: 8,
    created_at: "2026-01-15T10:00:00Z",
  },
  {
    id: "enr-ug-me",
    survey_year: "2025-2026",
    programme_level: "undergraduate",
    discipline_name: "B.Tech Mechanical Engineering",
    sanctioned_intake: 120,
    enrolled_male: 390,
    enrolled_female: 90,
    enrolled_transgender: 0,
    total_enrolled: 480,
    sc_count: 72,
    st_count: 36,
    obc_count: 144,
    general_count: 180,
    ews_count: 48,
    pwd_count: 8,
    out_of_state_count: 110,
    foreign_national_count: 4,
    created_at: "2026-01-15T10:00:00Z",
  },
  {
    id: "enr-ug-ee",
    survey_year: "2025-2026",
    programme_level: "undergraduate",
    discipline_name: "B.Tech Electrical & Electronics Engineering",
    sanctioned_intake: 120,
    enrolled_male: 260,
    enrolled_female: 220,
    enrolled_transgender: 0,
    total_enrolled: 480,
    sc_count: 72,
    st_count: 36,
    obc_count: 144,
    general_count: 180,
    ews_count: 48,
    pwd_count: 9,
    out_of_state_count: 125,
    foreign_national_count: 6,
    created_at: "2026-01-15T10:00:00Z",
  },
  {
    id: "enr-pg-mtech",
    survey_year: "2025-2026",
    programme_level: "postgraduate",
    discipline_name: "M.Tech Artificial Intelligence & Robotics",
    sanctioned_intake: 60,
    enrolled_male: 58,
    enrolled_female: 62,
    enrolled_transgender: 0,
    total_enrolled: 120,
    sc_count: 18,
    st_count: 9,
    obc_count: 36,
    general_count: 45,
    ews_count: 12,
    pwd_count: 3,
    out_of_state_count: 48,
    foreign_national_count: 5,
    created_at: "2026-01-15T10:00:00Z",
  },
  {
    id: "enr-pg-mba",
    survey_year: "2025-2026",
    programme_level: "postgraduate",
    discipline_name: "MBA Innovation & Technology Management",
    sanctioned_intake: 120,
    enrolled_male: 115,
    enrolled_female: 125,
    enrolled_transgender: 0,
    total_enrolled: 240,
    sc_count: 36,
    st_count: 18,
    obc_count: 72,
    general_count: 90,
    ews_count: 24,
    pwd_count: 5,
    out_of_state_count: 92,
    foreign_national_count: 9,
    created_at: "2026-01-15T10:00:00Z",
  },
  {
    id: "enr-phd-eng",
    survey_year: "2025-2026",
    programme_level: "doctoral",
    discipline_name: "Ph.D. Engineering & Advanced Technologies",
    sanctioned_intake: 45,
    enrolled_male: 82,
    enrolled_female: 98,
    enrolled_transgender: 0,
    total_enrolled: 180,
    sc_count: 27,
    st_count: 14,
    obc_count: 54,
    general_count: 68,
    ews_count: 17,
    pwd_count: 4,
    out_of_state_count: 85,
    foreign_national_count: 12,
    created_at: "2026-01-15T10:00:00Z",
  },
];

export const MOCK_AISHE_FACULTY: AisheFacultyCadre[] = [
  {
    id: "cadre-prof",
    survey_year: "2025-2026",
    cadre_type: "professor",
    sanctioned_posts: 36,
    regular_in_position: 34,
    contractual_in_position: 2,
    male_faculty: 20,
    female_faculty: 16,
    phd_holders: 36,
    sc_faculty: 5,
    st_faculty: 3,
    obc_faculty: 10,
    general_faculty: 15,
    ews_faculty: 3,
    pwd_faculty: 1,
    created_at: "2026-01-18T11:00:00Z",
  },
  {
    id: "cadre-assoc-prof",
    survey_year: "2025-2026",
    cadre_type: "associate_professor",
    sanctioned_posts: 72,
    regular_in_position: 70,
    contractual_in_position: 2,
    male_faculty: 38,
    female_faculty: 34,
    phd_holders: 68,
    sc_faculty: 11,
    st_faculty: 5,
    obc_faculty: 20,
    general_faculty: 30,
    ews_faculty: 6,
    pwd_faculty: 2,
    created_at: "2026-01-18T11:00:00Z",
  },
  {
    id: "cadre-asst-prof",
    survey_year: "2025-2026",
    cadre_type: "assistant_professor",
    sanctioned_posts: 110,
    regular_in_position: 108,
    contractual_in_position: 2,
    male_faculty: 54,
    female_faculty: 56,
    phd_holders: 78,
    sc_faculty: 16,
    st_faculty: 8,
    obc_faculty: 32,
    general_faculty: 44,
    ews_faculty: 10,
    pwd_faculty: 3,
    created_at: "2026-01-18T11:00:00Z",
  },
  {
    id: "cadre-adjunct",
    survey_year: "2025-2026",
    cadre_type: "adjunct_visiting",
    sanctioned_posts: 15,
    regular_in_position: 0,
    contractual_in_position: 14,
    male_faculty: 9,
    female_faculty: 5,
    phd_holders: 12,
    sc_faculty: 2,
    st_faculty: 1,
    obc_faculty: 4,
    general_faculty: 6,
    ews_faculty: 1,
    pwd_faculty: 0,
    created_at: "2026-01-18T11:00:00Z",
  },
];

export const MOCK_AISHE_FINANCES: AisheFinancialStatement[] = [
  {
    id: "fin-2025-26",
    survey_year: "2025-2026",
    financial_year: "2024-2025",
    recurring_grants_gov_inr: 85000000.0, // 8.5 Cr
    non_recurring_grants_inr: 42000000.0, // 4.2 Cr
    tuition_fee_income_inr: 385000000.0, // 38.5 Cr
    other_income_inr: 48000000.0, // 4.8 Cr
    total_income_inr: 560000000.0, // 56.0 Cr
    faculty_salary_expenditure_inr: 260000000.0, // 26.0 Cr
    non_teaching_salary_expenditure_inr: 75000000.0, // 7.5 Cr
    laboratory_capex_inr: 58000000.0, // 5.8 Cr
    library_capex_inr: 16000000.0, // 1.6 Cr
    scholarships_distributed_inr: 45000000.0, // 4.5 Cr
    total_expenditure_inr: 512000000.0, // 51.2 Cr
    audited_udin_token: "UDIN-2026-CA-774921",
    ca_auditor_name: "M/s Deshmukh, Singhal & Associates (Chartered Accountants)",
    audit_date: "2025-09-28",
    created_at: "2026-01-20T12:00:00Z",
  },
  {
    id: "fin-2024-25",
    survey_year: "2024-2025",
    financial_year: "2023-2024",
    recurring_grants_gov_inr: 72000000.0,
    non_recurring_grants_inr: 35000000.0,
    tuition_fee_income_inr: 340000000.0,
    other_income_inr: 38000000.0,
    total_income_inr: 485000000.0,
    faculty_salary_expenditure_inr: 235000000.0,
    non_teaching_salary_expenditure_inr: 68000000.0,
    laboratory_capex_inr: 49000000.0,
    library_capex_inr: 14000000.0,
    scholarships_distributed_inr: 38000000.0,
    total_expenditure_inr: 445000000.0,
    audited_udin_token: "UDIN-2025-CA-663810",
    ca_auditor_name: "M/s Deshmukh, Singhal & Associates (Chartered Accountants)",
    audit_date: "2024-09-22",
    created_at: "2025-01-22T12:00:00Z",
  },
];

export const MOCK_AISHE_INFRASTRUCTURE: AisheInfrastructureAudit = {
  id: "infra-001",
  campus_land_area_acres: 52.4,
  built_up_area_sqm: 114500,
  total_classrooms: 96,
  ict_enabled_classrooms: 92,
  total_laboratories: 74,
  computer_terminals: 1850,
  library_books_count: 148500,
  e_journals_subscribed: 8400,
  hostel_capacity_boys: 1600,
  hostel_capacity_girls: 1400,
  solar_power_capacity_kw: 850,
  water_recycling_plant: true,
  health_center_beds: 18,
  safety_fire_audit_certified: true,
};

// ==========================================
// Calculators & Telemetry Computations
// ==========================================

export function calculateGenderParityIndex(enrollments: AisheEnrollmentRecord[]): number {
  const totalMale = enrollments.reduce((acc, curr) => acc + curr.enrolled_male, 0);
  const totalFemale = enrollments.reduce((acc, curr) => acc + curr.enrolled_female, 0);
  if (totalMale === 0) return 1.0;
  return Number((totalFemale / totalMale).toFixed(2));
}

export function calculatePupilTeacherRatio(
  enrollments: AisheEnrollmentRecord[],
  faculty: AisheFacultyCadre[]
): number {
  const totalStudents = enrollments.reduce((acc, curr) => acc + curr.total_enrolled, 0);
  const totalRegularFaculty = faculty.reduce((acc, curr) => acc + curr.regular_in_position, 0);
  if (totalRegularFaculty === 0) return 0;
  return Number((totalStudents / totalRegularFaculty).toFixed(1));
}

export function calculateSocialDiversityPercentage(enrollments: AisheEnrollmentRecord[]): number {
  const totalStudents = enrollments.reduce((acc, curr) => acc + curr.total_enrolled, 0);
  if (totalStudents === 0) return 0;
  const reservedStudents = enrollments.reduce(
    (acc, curr) => acc + curr.sc_count + curr.st_count + curr.obc_count + curr.ews_count + curr.pwd_count,
    0
  );
  return Number(((reservedStudents / totalStudents) * 100).toFixed(1));
}

export function calculateOutOfStatePercentage(enrollments: AisheEnrollmentRecord[]): number {
  const totalStudents = enrollments.reduce((acc, curr) => acc + curr.total_enrolled, 0);
  if (totalStudents === 0) return 0;
  const outOfState = enrollments.reduce(
    (acc, curr) => acc + curr.out_of_state_count + curr.foreign_national_count,
    0
  );
  return Number(((outOfState / totalStudents) * 100).toFixed(1));
}

export function calculatePhdPercentage(faculty: AisheFacultyCadre[]): number {
  const totalFaculty = faculty.reduce(
    (acc, curr) => acc + curr.regular_in_position + curr.contractual_in_position,
    0
  );
  if (totalFaculty === 0) return 0;
  const phdCount = faculty.reduce((acc, curr) => acc + curr.phd_holders, 0);
  return Number(((phdCount / totalFaculty) * 100).toFixed(1));
}

// ==========================================
// In-Memory Stateful Store
// ==========================================

let profileState: AisheInstitutionProfile = { ...MOCK_AISHE_PROFILE };
let surveysState: AisheDcfSurvey[] = [...MOCK_AISHE_DCF_SURVEYS];
let enrollmentState: AisheEnrollmentRecord[] = [...MOCK_AISHE_ENROLLMENT];
let facultyState: AisheFacultyCadre[] = [...MOCK_AISHE_FACULTY];
let financesState: AisheFinancialStatement[] = [...MOCK_AISHE_FINANCES];
let infrastructureState: AisheInfrastructureAudit = { ...MOCK_AISHE_INFRASTRUCTURE };

// Profile getters & updates
export function getAisheProfile(): AisheInstitutionProfile {
  return profileState;
}

export function updateAisheProfile(updates: Partial<AisheInstitutionProfile>): AisheInstitutionProfile {
  profileState = {
    ...profileState,
    ...updates,
    updated_at: new Date().toISOString(),
  };
  return profileState;
}

// Surveys getters & mutations
export function getAisheSurveys(): AisheDcfSurvey[] {
  return surveysState;
}

export function getAisheSurveyById(id: string): AisheDcfSurvey | undefined {
  return surveysState.find((s) => s.id === id);
}

export function updateAisheSurveyBlock(
  surveyId: string,
  block: keyof Pick<
    AisheDcfSurvey,
    | "block_a_basic_info"
    | "block_b_programmes"
    | "block_c_student_enrollment"
    | "block_d_foreign_students"
    | "block_e_staff_information"
    | "block_f_financial_info"
    | "block_g_infrastructure"
    | "block_h_scholarships"
  >,
  completed: boolean
): AisheDcfSurvey | null {
  const index = surveysState.findIndex((s) => s.id === surveyId);
  if (index === -1) return null;

  const current = surveysState[index];
  const updated = {
    ...current,
    [block]: completed,
  };

  // Recalculate completion percentage
  const blocks = [
    updated.block_a_basic_info,
    updated.block_b_programmes,
    updated.block_c_student_enrollment,
    updated.block_d_foreign_students,
    updated.block_e_staff_information,
    updated.block_f_financial_info,
    updated.block_g_infrastructure,
    updated.block_h_scholarships,
  ];
  const completedCount = blocks.filter(Boolean).length;
  updated.completion_percentage = Number(((completedCount / 8) * 100).toFixed(1));
  if (updated.completion_percentage === 100.0) {
    updated.status = "approved_certified";
  } else {
    updated.status = "under_verification";
  }

  surveysState[index] = updated;
  return updated;
}

// Enrollment operations
export function getAisheEnrollment(): AisheEnrollmentRecord[] {
  return enrollmentState;
}

export function addAisheEnrollmentRecord(
  data: Omit<AisheEnrollmentRecord, "id" | "total_enrolled" | "created_at">
): AisheEnrollmentRecord {
  const total = data.enrolled_male + data.enrolled_female + (data.enrolled_transgender || 0);
  const newRecord: AisheEnrollmentRecord = {
    ...data,
    id: `enr-${Date.now()}`,
    total_enrolled: total,
    created_at: new Date().toISOString(),
  };
  enrollmentState.push(newRecord);
  return newRecord;
}

// Faculty operations
export function getAisheFacultyCadres(): AisheFacultyCadre[] {
  return facultyState;
}

export function addAisheFacultyCadre(
  data: Omit<AisheFacultyCadre, "id" | "created_at">
): AisheFacultyCadre {
  const newCadre: AisheFacultyCadre = {
    ...data,
    id: `cadre-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  facultyState.push(newCadre);
  return newCadre;
}

// Financial statements
export function getAisheFinancialStatements(): AisheFinancialStatement[] {
  return financesState;
}

export function addAisheFinancialStatement(
  data: Omit<AisheFinancialStatement, "id" | "audited_udin_token" | "created_at">
): AisheFinancialStatement {
  const newStatement: AisheFinancialStatement = {
    ...data,
    id: `fin-${Date.now()}`,
    audited_udin_token: generateAisheUdinToken(),
    created_at: new Date().toISOString(),
  };
  financesState.push(newStatement);
  return newStatement;
}

// Infrastructure audit
export function getAisheInfrastructureAudit(): AisheInfrastructureAudit {
  return infrastructureState;
}

export function updateAisheInfrastructureAudit(
  updates: Partial<AisheInfrastructureAudit>
): AisheInfrastructureAudit {
  infrastructureState = {
    ...infrastructureState,
    ...updates,
  };
  return infrastructureState;
}

// Master summary telemetry
export function getAisheSummaryStats(): AisheSummaryStats {
  const totalMale = enrollmentState.reduce((acc, c) => acc + c.enrolled_male, 0);
  const totalFemale = enrollmentState.reduce((acc, c) => acc + c.enrolled_female, 0);
  const totalStudents = enrollmentState.reduce((acc, c) => acc + c.total_enrolled, 0);
  const totalRegularFaculty = facultyState.reduce((acc, c) => acc + c.regular_in_position, 0);

  const latestFinances = financesState[0] || MOCK_AISHE_FINANCES[0];

  return {
    aisheCode: profileState.aishe_code,
    surveyYear: profileState.survey_year,
    surveyStatus: profileState.survey_status,
    certificateToken: profileState.certificate_token,
    totalStudents,
    totalMaleStudents: totalMale,
    totalFemaleStudents: totalFemale,
    genderParityIndex: calculateGenderParityIndex(enrollmentState),
    pupilTeacherRatio: calculatePupilTeacherRatio(enrollmentState, facultyState),
    totalRegularFaculty,
    phdFacultyPercentage: calculatePhdPercentage(facultyState),
    socialDiversityPercentage: calculateSocialDiversityPercentage(enrollmentState),
    outOfStatePercentage: calculateOutOfStatePercentage(enrollmentState),
    totalIncomeInr: latestFinances.total_income_inr,
    totalExpenditureInr: latestFinances.total_expenditure_inr,
    profile: profileState,
    surveys: surveysState,
    enrollment: enrollmentState,
    faculty: facultyState,
    finances: financesState,
    infrastructure: infrastructureState,
  };
}
