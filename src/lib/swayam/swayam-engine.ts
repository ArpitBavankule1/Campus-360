/**
 * Phase 56: Smart Campus SWAYAM-NPTEL MOOCs, Local Chapter & Academic Credit Transfer Gateway Engine
 * In-memory stateful store, cryptographic token generators, seed data, and credit transfer analytics.
 */

import {
  SwayamLocalChapter,
  SwayamCourse,
  SwayamEnrollment,
  SwayamCertification,
  SwayamCreditTransfer,
  SwayamSummaryStats,
  SwayamChapterRating,
  SwayamCourseDuration,
  SwayamEnrollmentStatus,
  SwayamCertTier,
  SwayamCreditTransferStatus,
  SwayamRole,
  SwayamAbcSyncStatus,
} from "@/types";

// ==========================================
// Cryptographic & Format Generators
// ==========================================

export function generateSwayamEnrollmentToken(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  const hex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SWAYAM-ENR-2026-${hex}-${num}`;
}

export function generateNptelCertToken(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  const hex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `NPTEL-CERT-2026-${hex}-${num}`;
}

export function generateSwayamTransferToken(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  const hex = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ABC-TRF-2026-${hex}-${num}`;
}

export function generateNptelVerificationHash(): string {
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

export const MOCK_SWAYAM_CHAPTER: SwayamLocalChapter = {
  id: "swayam-lc-001",
  local_chapter_id: "LC-4109",
  institution_name: "CampusLens Autonomous Institute of Technology",
  spoc_name: "Dr. Arvind R. Kulkarni",
  spoc_email: "swayam.spoc@campuslens.edu",
  spoc_designation: "Professor & Dean (Academic Programmes)",
  spoc_department: "Computer Science & Engineering",
  rating_tier: "AAA",
  active_semester_cycle: "Jan-Apr 2026",
  national_rank: 14,
  total_enrollments: 842,
  exam_registrations: 624,
  successful_certifications: 592,
  elite_gold_certifications: 68,
  elite_silver_certifications: 244,
  faculty_fdp_certifications: 54,
  status: "active",
  chapter_token: "NPTEL-LC-2026-AAA-4109",
  created_at: "2026-01-10T09:00:00Z",
  updated_at: "2026-10-21T10:00:00Z",
};

export const MOCK_SWAYAM_COURSES: SwayamCourse[] = [
  {
    id: "course-001",
    course_code: "noc26-cs42",
    course_title: "Deep Learning for Computer Vision & Multimodal AI",
    offering_institute: "IIT Madras",
    instructor_name: "Prof. C. V. Jawahar & Prof. Vineeth N. Balasubramanian",
    discipline: "Computer Science & Engineering",
    duration_weeks: "12_weeks",
    credit_equivalency: 4,
    aicte_approved_fdp: true,
    syllabus_outline: "CNN Architectures, Transformers, Vision-Language Models, Object Detection, Generative Models, Edge Inference Optimization",
    exam_date: "2026-04-26",
    enrollment_status: "enrolling",
    course_token: "SWAYAM-CRS-CS42-IITM",
    created_at: "2026-01-05T08:00:00Z",
  },
  {
    id: "course-002",
    course_code: "noc26-ee18",
    course_title: "Electric Vehicle Powertrain Architecture & Battery Management Systems",
    offering_institute: "IIT Bombay",
    instructor_name: "Prof. Kishore Chatterjee & Prof. Sandeep Anand",
    discipline: "Electrical & Electronics Engineering",
    duration_weeks: "12_weeks",
    credit_equivalency: 4,
    aicte_approved_fdp: true,
    syllabus_outline: "BMS Algorithms, Lithium-ion Cell Modeling, Thermal Runaway Prevention, Inverters, Regenerative Braking, Fast Charging Topologies",
    exam_date: "2026-04-25",
    enrollment_status: "ongoing",
    course_token: "SWAYAM-CRS-EE18-IITB",
    created_at: "2026-01-05T08:30:00Z",
  },
  {
    id: "course-003",
    course_code: "noc26-mg09",
    course_title: "Strategic Technology Innovation, IP Management & Entrepreneurship",
    offering_institute: "IIT Kharagpur",
    instructor_name: "Prof. P. K. Dan & Prof. Tapan Kumar Bagchi",
    discipline: "Management & Innovation",
    duration_weeks: "8_weeks",
    credit_equivalency: 3,
    aicte_approved_fdp: true,
    syllabus_outline: "Patent Analytics, Technology Transfer, Valuation, Business Model Canvas, Lean Startups, Venture Capital Due Diligence",
    exam_date: "2026-04-19",
    enrollment_status: "ongoing",
    course_token: "SWAYAM-CRS-MG09-IITKGP",
    created_at: "2026-01-06T09:00:00Z",
  },
  {
    id: "course-004",
    course_code: "noc26-me31",
    course_title: "Additive Manufacturing, 3D Printing & Topology Optimization",
    offering_institute: "IIT Kanpur",
    instructor_name: "Prof. J. Ramkumar",
    discipline: "Mechanical & Materials Engineering",
    duration_weeks: "8_weeks",
    credit_equivalency: 3,
    aicte_approved_fdp: true,
    syllabus_outline: "Selective Laser Sintering, Metal Binder Jetting, Lattice Structures, Finite Element Topology, Medical Implants",
    exam_date: "2026-04-18",
    enrollment_status: "ongoing",
    course_token: "SWAYAM-CRS-ME31-IITK",
    created_at: "2026-01-07T10:00:00Z",
  },
  {
    id: "course-005",
    course_code: "noc26-bt15",
    course_title: "Computational Genomics, CRISPR Therapeutics & Proteomics",
    offering_institute: "IISc Bangalore",
    instructor_name: "Prof. K. Sekar & Prof. D. N. Rao",
    discipline: "Biotechnology & Bioinformatics",
    duration_weeks: "4_weeks",
    credit_equivalency: 2,
    aicte_approved_fdp: false,
    syllabus_outline: "Next-Gen Sequencing Pipelines, Variant Calling, Cas9 Off-Target Prediction, AlphaFold Structure Modeling",
    exam_date: "2026-04-12",
    enrollment_status: "ongoing",
    course_token: "SWAYAM-CRS-BT15-IISC",
    created_at: "2026-01-08T11:00:00Z",
  },
];

export const MOCK_SWAYAM_ENROLLMENTS: SwayamEnrollment[] = [
  {
    id: "enr-001",
    enrollment_token: "SWAYAM-ENR-2026-CV89-4101",
    user_name: "Aaditya S. Verma",
    roll_number: "22CS084",
    department: "Computer Science & Engineering",
    academic_year: "Third Year (Sem 6)",
    course_code: "noc26-cs42",
    course_title: "Deep Learning for Computer Vision & Multimodal AI",
    role: "student",
    enrollment_status: "exam_registered",
    assignment_avg_score: 96.2,
    hall_ticket_no: "NPTEL-HT-2026-894101",
    exam_city: "Bengaluru Central (Test Center 4)",
    created_at: "2026-01-15T10:00:00Z",
    updated_at: "2026-03-25T14:30:00Z",
  },
  {
    id: "enr-002",
    enrollment_token: "SWAYAM-ENR-2026-EE12-4102",
    user_name: "Neha R. Sharma",
    roll_number: "23EE042",
    department: "Electrical & Electronics Engineering",
    academic_year: "Second Year (Sem 4)",
    course_code: "noc26-ee18",
    course_title: "Electric Vehicle Powertrain Architecture & Battery Management Systems",
    role: "student",
    enrollment_status: "certified",
    assignment_avg_score: 94.0,
    hall_ticket_no: "NPTEL-HT-2026-124102",
    exam_city: "Bengaluru North (Test Center 1)",
    created_at: "2026-01-16T11:15:00Z",
    updated_at: "2026-04-20T16:00:00Z",
  },
  {
    id: "enr-003",
    enrollment_token: "SWAYAM-ENR-2026-MG44-4103",
    user_name: "Dr. Sneha V. Deshmukh",
    roll_number: "FAC-EC-019",
    department: "Electronics & Communication Engineering",
    academic_year: "Faculty / CAS Cycle",
    course_code: "noc26-mg09",
    course_title: "Strategic Technology Innovation, IP Management & Entrepreneurship",
    role: "faculty",
    enrollment_status: "certified",
    assignment_avg_score: 91.5,
    hall_ticket_no: "NPTEL-HT-2026-444103",
    exam_city: "Bengaluru South (Test Center 2)",
    created_at: "2026-01-18T12:00:00Z",
    updated_at: "2026-04-19T18:00:00Z",
  },
  {
    id: "enr-004",
    enrollment_token: "SWAYAM-ENR-2026-ME71-4104",
    user_name: "Rohan M. Nair",
    roll_number: "22ME059",
    department: "Mechanical Engineering",
    academic_year: "Third Year (Sem 6)",
    course_code: "noc26-me31",
    course_title: "Additive Manufacturing, 3D Printing & Topology Optimization",
    role: "student",
    enrollment_status: "transferred",
    assignment_avg_score: 87.0,
    hall_ticket_no: "NPTEL-HT-2026-714104",
    exam_city: "Bengaluru Central (Test Center 3)",
    created_at: "2026-01-20T14:00:00Z",
    updated_at: "2026-05-02T11:20:00Z",
  },
];

export const MOCK_SWAYAM_CERTIFICATIONS: SwayamCertification[] = [
  {
    id: "cert-001",
    cert_token: "NPTEL-CERT-2026-GLD-8821",
    enrollment_token: "SWAYAM-ENR-2026-EE12-4102",
    candidate_name: "Neha R. Sharma",
    roll_number: "23EE042",
    course_code: "noc26-ee18",
    course_title: "Electric Vehicle Powertrain Architecture & Battery Management Systems",
    offering_institute: "IIT Bombay",
    assignment_score: 95.0,
    exam_score: 91.5,
    consolidated_score: 92.4,
    cert_tier: "elite_gold",
    aicte_fdp_credits: 0,
    verification_hash: "0x7f9a88c2b1e4599a01fd41c883e028f89a92cc01",
    qr_seal_payload: "https://nptel.ac.in/verify/NPTEL-CERT-2026-GLD-8821",
    issued_date: "2026-05-10",
    created_at: "2026-05-10T12:00:00Z",
  },
  {
    id: "cert-002",
    cert_token: "NPTEL-CERT-2026-SLV-4412",
    enrollment_token: "SWAYAM-ENR-2026-MG44-4103",
    candidate_name: "Dr. Sneha V. Deshmukh",
    roll_number: "FAC-EC-019",
    course_code: "noc26-mg09",
    course_title: "Strategic Technology Innovation, IP Management & Entrepreneurship",
    offering_institute: "IIT Kharagpur",
    assignment_score: 92.0,
    exam_score: 84.0,
    consolidated_score: 86.0,
    cert_tier: "elite_silver",
    aicte_fdp_credits: 1,
    verification_hash: "0x3bc191daef659011abf48821e909da41cc551982",
    qr_seal_payload: "https://nptel.ac.in/verify/NPTEL-CERT-2026-SLV-4412",
    issued_date: "2026-05-08",
    created_at: "2026-05-08T10:30:00Z",
  },
  {
    id: "cert-003",
    cert_token: "NPTEL-CERT-2026-ELT-6219",
    enrollment_token: "SWAYAM-ENR-2026-ME71-4104",
    candidate_name: "Rohan M. Nair",
    roll_number: "22ME059",
    course_code: "noc26-me31",
    course_title: "Additive Manufacturing, 3D Printing & Topology Optimization",
    offering_institute: "IIT Kanpur",
    assignment_score: 88.0,
    exam_score: 72.0,
    consolidated_score: 76.0,
    cert_tier: "elite_silver",
    aicte_fdp_credits: 0,
    verification_hash: "0x51ae949102cba8745512ee019fbb874241cd9912",
    qr_seal_payload: "https://nptel.ac.in/verify/NPTEL-CERT-2026-ELT-6219",
    issued_date: "2026-05-05",
    created_at: "2026-05-05T09:15:00Z",
  },
];

export const MOCK_SWAYAM_CREDIT_TRANSFERS: SwayamCreditTransfer[] = [
  {
    id: "trf-001",
    transfer_token: "ABC-TRF-2026-NPT-9912",
    cert_token: "NPTEL-CERT-2026-ELT-6219",
    student_name: "Rohan M. Nair",
    roll_number: "22ME059",
    department: "Mechanical Engineering",
    swayam_course_code: "noc26-me31",
    swayam_course_title: "Additive Manufacturing, 3D Printing & Topology Optimization",
    equivalent_curriculum_course: "ME-604: Advanced Digital Manufacturing & Rapid Prototyping",
    credits_transferred: 3,
    grade_awarded: "A+",
    bos_approval_date: "2026-05-18",
    academic_council_ref: "AC-RES-2026-05-ITEM-14B",
    approval_status: "approved_transferred",
    abc_sync_status: "synced_abc",
    apaar_id: "APAAR-2026-9182-4410",
    created_at: "2026-05-15T14:00:00Z",
  },
  {
    id: "trf-002",
    transfer_token: "ABC-TRF-2026-NPT-8844",
    cert_token: "NPTEL-CERT-2026-GLD-8821",
    student_name: "Neha R. Sharma",
    roll_number: "23EE042",
    department: "Electrical & Electronics Engineering",
    swayam_course_code: "noc26-ee18",
    swayam_course_title: "Electric Vehicle Powertrain Architecture & Battery Management Systems",
    equivalent_curriculum_course: "EE-408: Modern Electric Vehicle Drives & Storage Systems",
    credits_transferred: 4,
    grade_awarded: "O",
    bos_approval_date: "2026-05-20",
    academic_council_ref: "AC-RES-2026-05-ITEM-19A",
    approval_status: "approved_transferred",
    abc_sync_status: "synced_abc",
    apaar_id: "APAAR-2026-7841-2290",
    created_at: "2026-05-16T11:00:00Z",
  },
];

// ==========================================
// In-Memory Store
// ==========================================

class SwayamStore {
  chapter: SwayamLocalChapter = { ...MOCK_SWAYAM_CHAPTER };
  courses: SwayamCourse[] = [...MOCK_SWAYAM_COURSES];
  enrollments: SwayamEnrollment[] = [...MOCK_SWAYAM_ENROLLMENTS];
  certifications: SwayamCertification[] = [...MOCK_SWAYAM_CERTIFICATIONS];
  creditTransfers: SwayamCreditTransfer[] = [...MOCK_SWAYAM_CREDIT_TRANSFERS];

  getChapter(): SwayamLocalChapter {
    return { ...this.chapter };
  }

  updateChapter(patch: Partial<SwayamLocalChapter>): SwayamLocalChapter {
    this.chapter = {
      ...this.chapter,
      ...patch,
      updated_at: new Date().toISOString(),
    };
    return { ...this.chapter };
  }

  getCourses(): SwayamCourse[] {
    return [...this.courses];
  }

  addCourse(courseData: Omit<SwayamCourse, "id" | "course_token" | "created_at">): SwayamCourse {
    const newCourse: SwayamCourse = {
      id: `course-${Date.now()}`,
      course_token: `SWAYAM-CRS-${courseData.course_code.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      created_at: new Date().toISOString(),
      ...courseData,
    };
    this.courses.unshift(newCourse);
    return newCourse;
  }

  getEnrollments(): SwayamEnrollment[] {
    return [...this.enrollments];
  }

  enrollStudent(data: Omit<SwayamEnrollment, "id" | "enrollment_token" | "created_at" | "updated_at">): SwayamEnrollment {
    const newEnr: SwayamEnrollment = {
      id: `enr-${Date.now()}`,
      enrollment_token: generateSwayamEnrollmentToken(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data,
    };
    this.enrollments.unshift(newEnr);
    this.chapter.total_enrollments += 1;
    return newEnr;
  }

  getCertifications(): SwayamCertification[] {
    return [...this.certifications];
  }

  issueCertification(data: Omit<SwayamCertification, "id" | "cert_token" | "verification_hash" | "qr_seal_payload" | "created_at">): SwayamCertification {
    const certToken = generateNptelCertToken();
    const newCert: SwayamCertification = {
      id: `cert-${Date.now()}`,
      cert_token: certToken,
      verification_hash: generateNptelVerificationHash(),
      qr_seal_payload: `https://nptel.ac.in/verify/${certToken}`,
      created_at: new Date().toISOString(),
      ...data,
    };
    this.certifications.unshift(newCert);
    this.chapter.successful_certifications += 1;
    if (newCert.cert_tier === "elite_gold") this.chapter.elite_gold_certifications += 1;
    if (newCert.cert_tier === "elite_silver") this.chapter.elite_silver_certifications += 1;
    if (newCert.aicte_fdp_credits > 0) this.chapter.faculty_fdp_certifications += 1;
    return newCert;
  }

  getCreditTransfers(): SwayamCreditTransfer[] {
    return [...this.creditTransfers];
  }

  submitCreditTransfer(data: Omit<SwayamCreditTransfer, "id" | "transfer_token" | "created_at">): SwayamCreditTransfer {
    const newTransfer: SwayamCreditTransfer = {
      id: `trf-${Date.now()}`,
      transfer_token: generateSwayamTransferToken(),
      created_at: new Date().toISOString(),
      ...data,
    };
    this.creditTransfers.unshift(newTransfer);
    return newTransfer;
  }

  approveCreditTransfer(id: string, status: SwayamCreditTransferStatus = "approved_transferred"): SwayamCreditTransfer | null {
    const trf = this.creditTransfers.find((t) => t.id === id);
    if (!trf) return null;
    trf.approval_status = status;
    trf.abc_sync_status = "synced_abc";
    return { ...trf };
  }

  getSummaryStats(): SwayamSummaryStats {
    const totalCertified = this.certifications.length;
    const eliteGoldCount = this.certifications.filter((c) => c.cert_tier === "elite_gold").length;
    const eliteSilverCount = this.certifications.filter((c) => c.cert_tier === "elite_silver").length;
    const facultyFdpCount = this.certifications.filter((c) => c.aicte_fdp_credits > 0).length;
    
    const elitePassRatePct = calculateElitePassRate(this.certifications);
    const totalCreditsTransferred = calculateTotalCreditsEarned(this.creditTransfers);

    return {
      localChapterId: this.chapter.local_chapter_id,
      ratingTier: this.chapter.rating_tier,
      nationalRank: this.chapter.national_rank,
      activeSemesterCycle: this.chapter.active_semester_cycle,
      totalEnrollments: this.chapter.total_enrollments,
      examRegistrations: this.chapter.exam_registrations,
      totalCertified: this.chapter.successful_certifications,
      eliteGoldCount: this.chapter.elite_gold_certifications,
      eliteSilverCount: this.chapter.elite_silver_certifications,
      elitePassRatePct,
      facultyFdpCount: this.chapter.faculty_fdp_certifications,
      totalCreditsTransferred,
      chapter: { ...this.chapter },
      courses: [...this.courses],
      enrollments: [...this.enrollments],
      certifications: [...this.certifications],
      creditTransfers: [...this.creditTransfers],
    };
  }
}

// Global Singleton Store Instance
const globalStore = new SwayamStore();

// ==========================================
// Exported Engine Functions
// ==========================================

export function getSwayamChapter(): SwayamLocalChapter {
  return globalStore.getChapter();
}

export function updateSwayamChapter(patch: Partial<SwayamLocalChapter>): SwayamLocalChapter {
  return globalStore.updateChapter(patch);
}

export function getSwayamCourses(): SwayamCourse[] {
  return globalStore.getCourses();
}

export function addSwayamCourse(courseData: Omit<SwayamCourse, "id" | "course_token" | "created_at">): SwayamCourse {
  return globalStore.addCourse(courseData);
}

export function getSwayamEnrollments(): SwayamEnrollment[] {
  return globalStore.getEnrollments();
}

export function enrollSwayamCourse(data: Omit<SwayamEnrollment, "id" | "enrollment_token" | "created_at" | "updated_at">): SwayamEnrollment {
  return globalStore.enrollStudent(data);
}

export function getSwayamCertifications(): SwayamCertification[] {
  return globalStore.getCertifications();
}

export function issueSwayamCertification(data: Omit<SwayamCertification, "id" | "cert_token" | "verification_hash" | "qr_seal_payload" | "created_at">): SwayamCertification {
  return globalStore.issueCertification(data);
}

export function getSwayamCreditTransfers(): SwayamCreditTransfer[] {
  return globalStore.getCreditTransfers();
}

export function submitSwayamCreditTransfer(data: Omit<SwayamCreditTransfer, "id" | "transfer_token" | "created_at">): SwayamCreditTransfer {
  return globalStore.submitCreditTransfer(data);
}

export function approveSwayamCreditTransfer(id: string, status?: SwayamCreditTransferStatus): SwayamCreditTransfer | null {
  return globalStore.approveCreditTransfer(id, status);
}

export function getSwayamSummaryStats(): SwayamSummaryStats {
  return globalStore.getSummaryStats();
}

// ==========================================
// Mathematical & KPI Computations
// ==========================================

export function calculateElitePassRate(certifications: SwayamCertification[]): number {
  if (!certifications || certifications.length === 0) return 0;
  const eliteCandidates = certifications.filter(
    (c) => c.cert_tier === "elite_gold" || c.cert_tier === "elite_silver" || c.cert_tier === "elite"
  ).length;
  return Number(((eliteCandidates / certifications.length) * 100).toFixed(1));
}

export function calculateCreditTransferIndex(transfers: SwayamCreditTransfer[]): number {
  if (!transfers || transfers.length === 0) return 0;
  const approved = transfers.filter((t) => t.approval_status === "approved_transferred").length;
  return Number(((approved / transfers.length) * 100).toFixed(1));
}

export function calculateTotalCreditsEarned(transfers: SwayamCreditTransfer[]): number {
  if (!transfers || transfers.length === 0) return 0;
  return transfers
    .filter((t) => t.approval_status === "approved_transferred")
    .reduce((sum, t) => sum + (t.credits_transferred || 0), 0);
}
