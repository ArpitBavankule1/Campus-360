/**
 * Phase 51: Smart Campus Academic Bank of Credits (ABC) & APAAR ID Gateway (NEP 2020)
 * Stateful in-memory engine, credit equivalence calculation, cryptographic tokens, and DigiLocker NAD sync.
 */

import {
  ApaarStudentRegistry,
  AcademicCreditLedger,
  CreditTransferApplication,
  NepExitQualification,
  DigiLockerNadSyncLog,
  AcademicCreditsSummaryStats,
  CreditCategory,
  ApaarKycStatus,
  NepExitLevel,
  CreditVerificationStatus,
  AbcCreditTransferStatus,
  NepExitDocketStatus,
} from "@/types";

// ==========================================
// Cryptographic & Format Generators
// ==========================================

export function generateApaarId(): string {
  const segment1 = Math.floor(1000 + Math.random() * 9000);
  const segment2 = Math.floor(1000 + Math.random() * 9000);
  const segment3 = Math.floor(1000 + Math.random() * 9000);
  return `${segment1}-${segment2}-${segment3}`;
}

export function generateAbcAccountId(apaarId?: string): string {
  const base = apaarId ? apaarId.replace(/-/g, "").slice(0, 8) : Math.floor(10000000 + Math.random() * 90000000);
  return `ABC-2026-${base}`;
}

export function generateCreditVerificationToken(): string {
  const hex = Math.random().toString(36).substring(2, 8).toUpperCase();
  const num = Math.floor(1000 + Math.random() * 9000);
  return `CL-ABC-TXN-2026-${hex}-${num}`;
}

export function generateTransferDocketToken(): string {
  const hex = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CL-CRED-XFER-2026-${hex}`;
}

export function generateExitDocketToken(): string {
  const hex = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CL-NEP-EXIT-2026-${hex}`;
}

export function generateNadMerkleRoot(): string {
  const chars = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 40; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export function calculateNepExitEligibility(credits: number): NepExitLevel {
  if (credits >= 160) return "honours_research";
  if (credits >= 120) return "degree";
  if (credits >= 80) return "diploma";
  if (credits >= 40) return "certificate";
  return "none";
}

// ==========================================
// In-Memory Seed State
// ==========================================

const INITIAL_REGISTRIES: ApaarStudentRegistry[] = [
  {
    id: "apaar-reg-001",
    student_id: "usr-stu-101",
    apaar_id: "9081-3421-7789",
    abc_account_id: "ABC-2026-9081-3421",
    full_name: "Aryan Sharma",
    enrollment_number: "EN-2023-CSE-014",
    department: "Computer Science & Engineering",
    admission_year: 2023,
    aadhar_linked: true,
    digilocker_verified: true,
    kyc_status: "verified",
    total_credits_accumulated: 134,
    total_credits_redeemed: 0,
    current_credit_balance: 134,
    exit_pathway_eligible: "degree",
    nad_certificate_uri: "https://nad.digilocker.gov.in/verify/CL-ABC-9081-3421",
    created_at: "2024-08-15T09:30:00Z",
    updated_at: "2026-10-15T11:20:00Z",
  },
  {
    id: "apaar-reg-002",
    student_id: "usr-stu-102",
    apaar_id: "9081-5512-8821",
    abc_account_id: "ABC-2026-9081-5512",
    full_name: "Priya Venkataraman",
    enrollment_number: "EN-2024-ECE-042",
    department: "Electronics & Communication",
    admission_year: 2024,
    aadhar_linked: true,
    digilocker_verified: true,
    kyc_status: "verified",
    total_credits_accumulated: 92,
    total_credits_redeemed: 0,
    current_credit_balance: 92,
    exit_pathway_eligible: "diploma",
    nad_certificate_uri: "https://nad.digilocker.gov.in/verify/CL-ABC-9081-5512",
    created_at: "2024-09-01T10:15:00Z",
    updated_at: "2026-10-14T14:45:00Z",
  },
  {
    id: "apaar-reg-003",
    student_id: "usr-stu-103",
    apaar_id: "9081-7729-1144",
    abc_account_id: "ABC-2026-9081-7729",
    full_name: "Rohan Deshmukh",
    enrollment_number: "EN-2025-MECH-089",
    department: "Mechanical Engineering",
    admission_year: 2025,
    aadhar_linked: true,
    digilocker_verified: true,
    kyc_status: "verified",
    total_credits_accumulated: 46,
    total_credits_redeemed: 0,
    current_credit_balance: 46,
    exit_pathway_eligible: "certificate",
    nad_certificate_uri: "https://nad.digilocker.gov.in/verify/CL-ABC-9081-7729",
    created_at: "2025-08-10T11:00:00Z",
    updated_at: "2026-10-12T16:30:00Z",
  },
  {
    id: "apaar-reg-004",
    student_id: "usr-stu-104",
    apaar_id: "9081-2290-6633",
    abc_account_id: "ABC-2026-9081-2290",
    full_name: "Ananya Sengupta",
    enrollment_number: "EN-2022-IT-003",
    department: "Information Technology",
    admission_year: 2022,
    aadhar_linked: true,
    digilocker_verified: true,
    kyc_status: "verified",
    total_credits_accumulated: 168,
    total_credits_redeemed: 0,
    current_credit_balance: 168,
    exit_pathway_eligible: "honours_research",
    nad_certificate_uri: "https://nad.digilocker.gov.in/verify/CL-ABC-9081-2290",
    created_at: "2023-07-20T14:00:00Z",
    updated_at: "2026-10-15T09:10:00Z",
  },
  {
    id: "apaar-reg-005",
    student_id: "usr-stu-105",
    apaar_id: "9081-8843-9910",
    abc_account_id: "ABC-2026-9081-8843",
    full_name: "Tanmay Kulkarni",
    enrollment_number: "EN-2024-DS-019",
    department: "Data Science & AI",
    admission_year: 2024,
    aadhar_linked: true,
    digilocker_verified: false,
    kyc_status: "pending",
    total_credits_accumulated: 84,
    total_credits_redeemed: 0,
    current_credit_balance: 84,
    exit_pathway_eligible: "diploma",
    nad_certificate_uri: null,
    created_at: "2024-08-25T13:40:00Z",
    updated_at: "2026-10-10T12:00:00Z",
  },
];

const INITIAL_LEDGERS: AcademicCreditLedger[] = [
  {
    id: "cred-led-001",
    apaar_id: "9081-3421-7789",
    course_code: "CS-401",
    course_title: "Advanced Data Structures & Algorithms",
    course_category: "major",
    awarding_institution: "CampusLens Institute of Technology",
    awarding_university_code: "UGC-INST-0842",
    credits: 4,
    grade_earned: "A+",
    grade_points: 10.0,
    semester_earned: "Semester IV",
    academic_year: "2024-25",
    verification_status: "verified_nad",
    nad_transaction_hash: "0x4a8f912e77b1029c",
    verification_token: "CL-ABC-TXN-2026-DSA-401",
    created_at: "2025-06-12T10:00:00Z",
  },
  {
    id: "cred-led-002",
    apaar_id: "9081-3421-7789",
    course_code: "QC-502",
    course_title: "Quantum Computing & Algorithms",
    course_category: "multidisciplinary",
    awarding_institution: "IIT Madras (SWAYAM / NPTEL)",
    awarding_university_code: "IITM-SWAYAM-01",
    credits: 3,
    grade_earned: "O",
    grade_points: 10.0,
    semester_earned: "Semester V",
    academic_year: "2025-26",
    verification_status: "verified_nad",
    nad_transaction_hash: "0x88c21a91e50f34aa",
    verification_token: "CL-ABC-TXN-2026-QC-502",
    created_at: "2025-12-05T15:30:00Z",
  },
  {
    id: "cred-led-003",
    apaar_id: "9081-3421-7789",
    course_code: "IKS-201",
    course_title: "Indian Knowledge Systems & Logic",
    course_category: "vac",
    awarding_institution: "CampusLens Institute of Technology",
    awarding_university_code: "UGC-INST-0842",
    credits: 2,
    grade_earned: "A",
    grade_points: 9.0,
    semester_earned: "Semester III",
    academic_year: "2024-25",
    verification_status: "deposited",
    nad_transaction_hash: "0x33b98721cda9081f",
    verification_token: "CL-ABC-TXN-2026-IKS-201",
    created_at: "2024-12-20T11:45:00Z",
  },
  {
    id: "cred-led-004",
    apaar_id: "9081-5512-8821",
    course_code: "EC-303",
    course_title: "Signals, Systems & DSP Architecture",
    course_category: "major",
    awarding_institution: "CampusLens Institute of Technology",
    awarding_university_code: "UGC-INST-0842",
    credits: 4,
    grade_earned: "A",
    grade_points: 9.0,
    semester_earned: "Semester III",
    academic_year: "2025-26",
    verification_status: "verified_nad",
    nad_transaction_hash: "0x9911eaf40182bc33",
    verification_token: "CL-ABC-TXN-2026-EC-303",
    created_at: "2025-12-22T09:00:00Z",
  },
  {
    id: "cred-led-005",
    apaar_id: "9081-2290-6633",
    course_code: "IT-801",
    course_title: "Autonomous Systems Capstone Thesis",
    course_category: "internship_project",
    awarding_institution: "CampusLens Institute of Technology",
    awarding_university_code: "UGC-INST-0842",
    credits: 6,
    grade_earned: "O",
    grade_points: 10.0,
    semester_earned: "Semester VII",
    academic_year: "2025-26",
    verification_status: "verified_nad",
    nad_transaction_hash: "0x55d491c128ba7744",
    verification_token: "CL-ABC-TXN-2026-IT-801",
    created_at: "2026-05-18T16:00:00Z",
  },
  {
    id: "cred-led-006",
    apaar_id: "9081-7729-1144",
    course_code: "ME-201",
    course_title: "Thermodynamics & Fluid Mechanics",
    course_category: "major",
    awarding_institution: "CampusLens Institute of Technology",
    awarding_university_code: "UGC-INST-0842",
    credits: 4,
    grade_earned: "B+",
    grade_points: 8.0,
    semester_earned: "Semester II",
    academic_year: "2025-26",
    verification_status: "deposited",
    nad_transaction_hash: "0x1177af8942bca012",
    verification_token: "CL-ABC-TXN-2026-ME-201",
    created_at: "2026-06-10T14:30:00Z",
  },
];

const INITIAL_TRANSFERS: CreditTransferApplication[] = [
  {
    id: "cred-xfer-001",
    apaar_id: "9081-3421-7789",
    student_name: "Aryan Sharma",
    source_institution: "IIT Kharagpur (SWAYAM MOOC)",
    course_code: "NPTEL-CS-88",
    course_name: "Deep Learning for Computer Vision",
    credits_claimed: 4,
    target_equivalent_course_code: "CS-504",
    target_equivalent_course_name: "Machine Learning & Pattern Recognition",
    evaluation_status: "approved_by_dean",
    equivalence_score: 94,
    transfer_docket_token: "CL-CRED-XFER-2026-DL94",
    scrutiny_remarks: "94% syllabus syllabus match; proctored national exam verified with 91% score.",
    created_at: "2026-02-10T11:00:00Z",
    updated_at: "2026-03-01T14:20:00Z",
  },
  {
    id: "cred-xfer-002",
    apaar_id: "9081-5512-8821",
    student_name: "Priya Venkataraman",
    source_institution: "IISc Bangalore (NPTEL)",
    course_code: "NPTEL-EE-54",
    course_name: "System-on-Chip (SoC) Design & Verification",
    credits_claimed: 3,
    target_equivalent_course_code: "EC-602",
    target_equivalent_course_name: "Advanced VLSI Design",
    evaluation_status: "approved_by_dean",
    equivalence_score: 88,
    transfer_docket_token: "CL-CRED-XFER-2026-SOC88",
    scrutiny_remarks: "BOS Committee ratified equivalence; credit recognized under NEP Minor specialization.",
    created_at: "2026-03-15T09:30:00Z",
    updated_at: "2026-04-02T16:10:00Z",
  },
  {
    id: "cred-xfer-003",
    apaar_id: "9081-8843-9910",
    student_name: "Tanmay Kulkarni",
    source_institution: "Coursera / Imperial College London",
    course_code: "MATH-ML-01",
    course_name: "Mathematics for Machine Learning: PCA & SVD",
    credits_claimed: 3,
    target_equivalent_course_code: "MA-401",
    target_equivalent_course_name: "Applied Linear Algebra & Optimization",
    evaluation_status: "under_scrutiny",
    equivalence_score: 82,
    transfer_docket_token: "CL-CRED-XFER-2026-MTH82",
    scrutiny_remarks: "Syllabus mapping pending departmental academic committee vote on exam proctoring credentials.",
    created_at: "2026-09-20T15:00:00Z",
    updated_at: "2026-10-05T10:00:00Z",
  },
];

const INITIAL_EXITS: NepExitQualification[] = [
  {
    id: "nep-exit-001",
    apaar_id: "9081-2290-6633",
    student_name: "Ananya Sengupta",
    program_enrolled: "B.Tech in Information Technology",
    target_exit_level: "honours_research",
    required_credits: 160,
    completed_credits: 168,
    exit_status: "docket_awarded",
    qualification_docket_token: "CL-NEP-EXIT-2026-HON-001",
    academic_council_approval_ref: "AC-RES-2026-884",
    convocation_signoff_date: "2026-07-28",
    created_at: "2026-06-01T10:00:00Z",
  },
  {
    id: "nep-exit-002",
    apaar_id: "9081-3421-7789",
    student_name: "Aryan Sharma",
    program_enrolled: "B.Tech in Computer Science & Engineering",
    target_exit_level: "degree",
    required_credits: 120,
    completed_credits: 134,
    exit_status: "docket_awarded",
    qualification_docket_token: "CL-NEP-EXIT-2026-DEG-014",
    academic_council_approval_ref: "AC-RES-2026-791",
    convocation_signoff_date: "2026-07-28",
    created_at: "2026-06-15T11:30:00Z",
  },
  {
    id: "nep-exit-003",
    apaar_id: "9081-5512-8821",
    student_name: "Priya Venkataraman",
    program_enrolled: "B.Tech in Electronics & Communication",
    target_exit_level: "diploma",
    required_credits: 80,
    completed_credits: 92,
    exit_status: "eligible",
    qualification_docket_token: "CL-NEP-EXIT-2026-DIP-042",
    academic_council_approval_ref: null,
    convocation_signoff_date: null,
    created_at: "2026-08-01T09:00:00Z",
  },
  {
    id: "nep-exit-004",
    apaar_id: "9081-7729-1144",
    student_name: "Rohan Deshmukh",
    program_enrolled: "B.Tech in Mechanical Engineering",
    target_exit_level: "certificate",
    required_credits: 40,
    completed_credits: 46,
    exit_status: "application_filed",
    qualification_docket_token: "CL-NEP-EXIT-2026-CRT-089",
    academic_council_approval_ref: null,
    convocation_signoff_date: null,
    created_at: "2026-09-12T14:00:00Z",
  },
];

const INITIAL_SYNC_LOGS: DigiLockerNadSyncLog[] = [
  {
    id: "nad-sync-001",
    batch_token: "NAD-BATCH-2026-OCT-01",
    synced_records_count: 4820,
    sha256_merkle_root: "0x8a9f3b184029ae4890c4bf210928ad7429beff89",
    sync_status: "synced",
    sync_timestamp: "2026-10-14T23:59:00Z",
    operator_officer: "Dr. K. Swaminathan (Controller of Examinations)",
  },
  {
    id: "nad-sync-002",
    batch_token: "NAD-BATCH-2026-OCT-02",
    synced_records_count: 1250,
    sha256_merkle_root: "0x4b7c892019ab984716edb50293847a9128fef310",
    sync_status: "synced",
    sync_timestamp: "2026-10-15T18:30:00Z",
    operator_officer: "Er. Sunita Verma (Chief Registrar & NAD Nodal Officer)",
  },
];

// In-Memory store
class AcademicCreditsStore {
  registries: ApaarStudentRegistry[] = [...INITIAL_REGISTRIES];
  ledgers: AcademicCreditLedger[] = [...INITIAL_LEDGERS];
  transfers: CreditTransferApplication[] = [...INITIAL_TRANSFERS];
  exitQualifications: NepExitQualification[] = [...INITIAL_EXITS];
  syncLogs: DigiLockerNadSyncLog[] = [...INITIAL_SYNC_LOGS];

  // APAAR Registries
  getApaarRegistries(search?: string): ApaarStudentRegistry[] {
    if (!search) return this.registries;
    const q = search.toLowerCase();
    return this.registries.filter(
      (r) =>
        r.full_name.toLowerCase().includes(q) ||
        r.apaar_id.toLowerCase().includes(q) ||
        r.enrollment_number.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q)
    );
  }

  getApaarRegistryById(idOrApaar: string): ApaarStudentRegistry | undefined {
    return this.registries.find(
      (r) => r.id === idOrApaar || r.apaar_id === idOrApaar || r.student_id === idOrApaar
    );
  }

  registerApaar(data: Partial<ApaarStudentRegistry>): ApaarStudentRegistry {
    const apaar_id = data.apaar_id || generateApaarId();
    const abc_account_id = data.abc_account_id || generateAbcAccountId(apaar_id);
    const credits = data.total_credits_accumulated || 0;
    const newRecord: ApaarStudentRegistry = {
      id: `apaar-reg-${Date.now()}`,
      student_id: data.student_id || `usr-stu-${Math.floor(100 + Math.random() * 900)}`,
      apaar_id,
      abc_account_id,
      full_name: data.full_name || "New Scholar",
      enrollment_number: data.enrollment_number || `EN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      department: data.department || "Computer Science & Engineering",
      admission_year: data.admission_year || 2026,
      aadhar_linked: data.aadhar_linked ?? true,
      digilocker_verified: data.digilocker_verified ?? true,
      kyc_status: (data.kyc_status as ApaarKycStatus) || "verified",
      total_credits_accumulated: credits,
      total_credits_redeemed: 0,
      current_credit_balance: credits,
      exit_pathway_eligible: calculateNepExitEligibility(credits),
      nad_certificate_uri: `https://nad.digilocker.gov.in/verify/CL-ABC-${apaar_id}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.registries.unshift(newRecord);
    return newRecord;
  }

  // Credit Ledgers
  getCreditLedgers(apaarId?: string): AcademicCreditLedger[] {
    if (!apaarId) return this.ledgers;
    return this.ledgers.filter((l) => l.apaar_id === apaarId);
  }

  depositCredit(data: Partial<AcademicCreditLedger>): AcademicCreditLedger {
    const newCredit: AcademicCreditLedger = {
      id: `cred-led-${Date.now()}`,
      apaar_id: data.apaar_id || "9081-3421-7789",
      course_code: data.course_code || "CS-500",
      course_title: data.course_title || "Special Topics in Computing",
      course_category: (data.course_category as CreditCategory) || "major",
      awarding_institution: data.awarding_institution || "CampusLens Institute of Technology",
      awarding_university_code: data.awarding_university_code || "UGC-INST-0842",
      credits: Number(data.credits) || 3,
      grade_earned: data.grade_earned || "A+",
      grade_points: Number(data.grade_points) || 10.0,
      semester_earned: data.semester_earned || "Semester V",
      academic_year: data.academic_year || "2026-27",
      verification_status: (data.verification_status as CreditVerificationStatus) || "deposited",
      nad_transaction_hash: generateNadMerkleRoot().slice(0, 18),
      verification_token: generateCreditVerificationToken(),
      created_at: new Date().toISOString(),
    };

    this.ledgers.unshift(newCredit);

    // Update student's cumulative balance
    const student = this.registries.find((r) => r.apaar_id === newCredit.apaar_id);
    if (student) {
      student.total_credits_accumulated += newCredit.credits;
      student.current_credit_balance += newCredit.credits;
      student.exit_pathway_eligible = calculateNepExitEligibility(student.current_credit_balance);
      student.updated_at = new Date().toISOString();
    }

    return newCredit;
  }

  // Credit Transfers
  getCreditTransfers(): CreditTransferApplication[] {
    return this.transfers;
  }

  submitCreditTransfer(data: Partial<CreditTransferApplication>): CreditTransferApplication {
    const newTransfer: CreditTransferApplication = {
      id: `cred-xfer-${Date.now()}`,
      apaar_id: data.apaar_id || "9081-3421-7789",
      student_name: data.student_name || "Enrolled Student",
      source_institution: data.source_institution || "External University / SWAYAM",
      course_code: data.course_code || "EXT-101",
      course_name: data.course_name || "External Course",
      credits_claimed: Number(data.credits_claimed) || 3,
      target_equivalent_course_code: data.target_equivalent_course_code || "EQV-101",
      target_equivalent_course_name: data.target_equivalent_course_name || "Equivalent Core Elective",
      evaluation_status: "submitted",
      equivalence_score: data.equivalence_score || 85,
      transfer_docket_token: generateTransferDocketToken(),
      scrutiny_remarks: data.scrutiny_remarks || "Transfer docket queued for Departmental Equivalence Committee review.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.transfers.unshift(newTransfer);
    return newTransfer;
  }

  updateTransferStatus(
    id: string,
    status: AbcCreditTransferStatus,
    score?: number,
    remarks?: string
  ): CreditTransferApplication | undefined {
    const item = this.transfers.find((t) => t.id === id);
    if (item) {
      item.evaluation_status = status;
      if (score !== undefined) item.equivalence_score = score;
      if (remarks) item.scrutiny_remarks = remarks;
      item.updated_at = new Date().toISOString();

      if (status === "approved_by_dean") {
        this.depositCredit({
          apaar_id: item.apaar_id,
          course_code: item.target_equivalent_course_code,
          course_title: item.target_equivalent_course_name,
          course_category: "multidisciplinary",
          awarding_institution: item.source_institution,
          credits: item.credits_claimed,
          verification_status: "transferred",
        });
      }
    }
    return item;
  }

  // NEP Multiple Exits
  getNepExitQualifications(): NepExitQualification[] {
    return this.exitQualifications;
  }

  applyNepExit(data: Partial<NepExitQualification>): NepExitQualification {
    const targetLevel = (data.target_exit_level as Exclude<NepExitLevel, "none">) || "degree";
    const reqCredits =
      targetLevel === "honours_research" ? 160 : targetLevel === "degree" ? 120 : targetLevel === "diploma" ? 80 : 40;

    const newExit: NepExitQualification = {
      id: `nep-exit-${Date.now()}`,
      apaar_id: data.apaar_id || "9081-3421-7789",
      student_name: data.student_name || "Enrolled Student",
      program_enrolled: data.program_enrolled || "B.Tech in Computer Science & Engineering",
      target_exit_level: targetLevel,
      required_credits: reqCredits,
      completed_credits: Number(data.completed_credits) || reqCredits,
      exit_status: (data.exit_status as NepExitDocketStatus) || "application_filed",
      qualification_docket_token: generateExitDocketToken(),
      academic_council_approval_ref: data.academic_council_approval_ref || null,
      convocation_signoff_date: data.convocation_signoff_date || null,
      created_at: new Date().toISOString(),
    };
    this.exitQualifications.unshift(newExit);
    return newExit;
  }

  // DigiLocker NAD Sync
  getNadSyncLogs(): DigiLockerNadSyncLog[] {
    return this.syncLogs;
  }

  triggerNadSync(officer: string): DigiLockerNadSyncLog {
    const unverifiedCount = this.ledgers.filter((l) => l.verification_status === "deposited").length || 350;
    const newLog: DigiLockerNadSyncLog = {
      id: `nad-sync-${Date.now()}`,
      batch_token: `NAD-BATCH-2026-OCT-${Math.floor(10 + Math.random() * 90)}`,
      synced_records_count: unverifiedCount,
      sha256_merkle_root: generateNadMerkleRoot(),
      sync_status: "synced",
      sync_timestamp: new Date().toISOString(),
      operator_officer: officer || "Chief Registrar & Institutional NAD Coordinator",
    };

    // Mark deposited ledgers as verified_nad
    this.ledgers.forEach((l) => {
      if (l.verification_status === "deposited") {
        l.verification_status = "verified_nad";
      }
    });

    this.syncLogs.unshift(newLog);
    return newLog;
  }

  getSummaryStats(): AcademicCreditsSummaryStats {
    const totalAccumulated = this.registries.reduce((acc, curr) => acc + curr.total_credits_accumulated, 0);
    const verifiedDigi = this.registries.filter((r) => r.digilocker_verified).length;
    const verifiedPct = this.registries.length ? Math.round((verifiedDigi / this.registries.length) * 100) : 100;
    const transfersApproved = this.transfers.filter((t) => t.evaluation_status === "approved_by_dean").length;
    const exitsAwarded = this.exitQualifications.filter((e) => e.exit_status === "docket_awarded").length;

    return {
      totalApaarRegistered: this.registries.length,
      totalCreditsAccumulated: totalAccumulated,
      digilockerVerifiedPct: verifiedPct,
      totalTransfersApproved: transfersApproved,
      totalNepExitDocketsAwarded: exitsAwarded,
      latestNadBatchToken: this.syncLogs[0]?.batch_token || "NAD-BATCH-2026-OCT-01",
      registries: this.registries,
      ledgers: this.ledgers,
      transfers: this.transfers,
      exitQualifications: this.exitQualifications,
      syncLogs: this.syncLogs,
    };
  }
}

// Global Singleton Store across API routes
const globalForStore = globalThis as unknown as { academicCreditsStore?: AcademicCreditsStore };
export const academicCreditsStore = globalForStore.academicCreditsStore ?? new AcademicCreditsStore();
if (process.env.NODE_ENV !== "production") {
  globalForStore.academicCreditsStore = academicCreditsStore;
}
