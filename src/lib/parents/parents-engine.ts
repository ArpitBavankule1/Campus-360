/**
 * CampusLens AI — Phase 43: Smart Campus Parent & Guardian Connect Engine
 * Telemetry calculators, token generators, and seed datasets
 */

import {
  GuardianProfile,
  WardTelemetry,
  GuardianOutpassApproval,
  PTMConsultationSlot,
  ParentPortalOverviewStats,
  CourseAttendanceRecord,
} from "@/types";

// --- Token Generators ---

export function generateParentAuthToken(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-PAR-PASS-2026-${rand}`;
}

export function generatePTMSlotToken(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-PTM-SLOT-2026-${rand}`;
}

// --- Mock Datasets ---

export const MOCK_GUARDIAN: GuardianProfile = {
  id: "guard-8821-apex",
  college_id: "col-apex-001",
  guardian_name: "Dr. Rajesh Sharma",
  email: "rajesh.sharma.apex@gmail.com",
  phone: "+91 98450 12894",
  relationship: "Father",
  emergency_contact: "+91 98450 12895",
  residential_address: "Plot 42, Green Horizon Enclave, Indiranagar, Bengaluru, KA - 560038",
  is_identity_verified: true,
  created_at: new Date().toISOString(),
};

export const MOCK_COURSES: CourseAttendanceRecord[] = [
  {
    courseCode: "CS501",
    courseTitle: "Distributed Systems & Cloud Architecture",
    facultyName: "Dr. Vikram Seth",
    totalConducted: 36,
    totalAttended: 33,
    attendancePercentage: 91.67,
    isBelowMandate: false,
  },
  {
    courseCode: "CS502",
    courseTitle: "Deep Learning & Neural Foundations",
    facultyName: "Prof. Priya Nair",
    totalConducted: 40,
    totalAttended: 36,
    attendancePercentage: 90.0,
    isBelowMandate: false,
  },
  {
    courseCode: "CS503",
    courseTitle: "Compiler Design & Code Optimization",
    facultyName: "Dr. Anand Kulkarni",
    totalConducted: 32,
    totalAttended: 27,
    attendancePercentage: 84.38,
    isBelowMandate: false,
  },
  {
    courseCode: "CS504",
    courseTitle: "Cryptographic Protocols & Blockchain",
    facultyName: "Dr. Meenakshi Sundaram",
    totalConducted: 28,
    totalAttended: 20,
    attendancePercentage: 71.43,
    isBelowMandate: true, // Warning: Below 75% statutory mandate!
  },
  {
    courseCode: "CS505P",
    courseTitle: "High-Performance Computing Lab",
    facultyName: "Prof. Rohan Sengupta",
    totalConducted: 24,
    totalAttended: 22,
    attendancePercentage: 91.67,
    isBelowMandate: false,
  },
];

export const MOCK_WARD: WardTelemetry = {
  id: "ward-link-104",
  college_id: "col-apex-001",
  guardian_id: "guard-8821-apex",
  student_id: "stu-aarav-2024",
  student_name: "Aarav Sharma",
  roll_number: "2024BCSE042",
  department: "Computer Science & Engineering",
  academic_year: 3,
  semester: 5,
  cumulative_cgpa: 8.84,
  overall_attendance_pct: 85.88,
  theory_attendance_pct: 88.71,
  practical_attendance_pct: 91.67,
  fee_dues_inr: 0,
  fee_status: "cleared",
  assigned_proctor_name: "Dr. Ananya Iyer",
  assigned_proctor_email: "ananya.iyer@apex.edu.in",
  hostel_room: "Aryabhatta Hall B-304",
  courseBreakdown: MOCK_COURSES,
  created_at: new Date().toISOString(),
};

export const INITIAL_OUTPASS_APPROVALS: GuardianOutpassApproval[] = [
  {
    id: "outpass-req-01",
    college_id: "col-apex-001",
    ward_id: "ward-link-104",
    student_name: "Aarav Sharma",
    roll_number: "2024BCSE042",
    destination_city: "Bengaluru (Home)",
    leave_start_date: "2026-10-16T18:00:00Z",
    return_expected_date: "2026-10-19T08:30:00Z",
    reason: "Diwali festival family gathering and weekend home visit",
    outpass_token: "CL-PAR-PASS-2026-4819",
    guardian_status: "pending",
    warden_status: "awaiting_guardian",
    guardian_action_at: null,
    guardian_remarks: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "outpass-req-02",
    college_id: "col-apex-001",
    ward_id: "ward-link-104",
    student_name: "Aarav Sharma",
    roll_number: "2024BCSE042",
    destination_city: "Hyderabad (HITEC City)",
    leave_start_date: "2026-10-24T06:00:00Z",
    return_expected_date: "2026-10-26T22:00:00Z",
    reason: "Participating in National Smart India Hackathon Grand Finale at T-Hub",
    outpass_token: "CL-PAR-PASS-2026-3190",
    guardian_status: "approved",
    warden_status: "approved_by_warden",
    guardian_action_at: "2026-10-06T14:30:00Z",
    guardian_remarks: "Approved. All train reservations and faculty escort confirmed.",
    created_at: "2026-10-06T12:00:00Z",
  },
];

export const INITIAL_PTM_SLOTS: PTMConsultationSlot[] = [
  {
    id: "ptm-slot-01",
    college_id: "col-apex-001",
    ward_id: "ward-link-104",
    faculty_proctor_name: "Dr. Ananya Iyer",
    faculty_proctor_designation: "Associate Professor & Chief Academic Proctor",
    consultation_mode: "Virtual Google Meet",
    scheduled_date: "2026-10-20",
    time_slot: "04:30 PM - 05:00 PM IST",
    agenda: "Mid-Semester CGPA Review & Cryptography attendance advisory",
    booking_token: "CL-PTM-SLOT-2026-7721",
    status: "scheduled",
    meeting_link: "https://meet.google.com/apx-ptm-coun",
    proctor_notes: "Discussion regarding CS504 elective laboratory hours and placement orientation.",
    created_at: new Date().toISOString(),
  },
];

// In-memory state for local mutations
let outpassesStore = [...INITIAL_OUTPASS_APPROVALS];
let ptmSlotsStore = [...INITIAL_PTM_SLOTS];

// --- Engine Methods ---

export function getGuardianProfile(): GuardianProfile {
  return MOCK_GUARDIAN;
}

export function getWardTelemetry(): WardTelemetry {
  return MOCK_WARD;
}

export function getGuardianOutpasses(): GuardianOutpassApproval[] {
  return [...outpassesStore];
}

export function approveGuardianOutpass(
  outpassId: string,
  remarks: string = "Approved by guardian"
): GuardianOutpassApproval | null {
  const index = outpassesStore.findIndex((o) => o.id === outpassId);
  if (index === -1) return null;

  outpassesStore[index] = {
    ...outpassesStore[index],
    guardian_status: "approved",
    warden_status: "approved_by_warden",
    guardian_action_at: new Date().toISOString(),
    guardian_remarks: remarks,
  };

  return outpassesStore[index];
}

export function rejectGuardianOutpass(
  outpassId: string,
  remarks: string = "Declined by guardian"
): GuardianOutpassApproval | null {
  const index = outpassesStore.findIndex((o) => o.id === outpassId);
  if (index === -1) return null;

  outpassesStore[index] = {
    ...outpassesStore[index],
    guardian_status: "rejected",
    warden_status: "rejected_by_warden",
    guardian_action_at: new Date().toISOString(),
    guardian_remarks: remarks,
  };

  return outpassesStore[index];
}

export function getPTMConsultationSlots(): PTMConsultationSlot[] {
  return [...ptmSlotsStore];
}

export function bookPTMConsultationSlot(params: {
  facultyName: string;
  designation: string;
  mode: "Virtual Google Meet" | "In-Person Proctor Cabin";
  scheduledDate: string;
  timeSlot: string;
  agenda: string;
}): PTMConsultationSlot {
  const newSlot: PTMConsultationSlot = {
    id: `ptm-slot-${Date.now()}`,
    college_id: MOCK_WARD.college_id,
    ward_id: MOCK_WARD.id,
    faculty_proctor_name: params.facultyName,
    faculty_proctor_designation: params.designation,
    consultation_mode: params.mode,
    scheduled_date: params.scheduledDate,
    time_slot: params.timeSlot,
    agenda: params.agenda,
    booking_token: generatePTMSlotToken(),
    status: "scheduled",
    meeting_link:
      params.mode === "Virtual Google Meet"
        ? `https://meet.google.com/apx-ptm-${Math.floor(100 + Math.random() * 900)}`
        : undefined,
    created_at: new Date().toISOString(),
  };

  ptmSlotsStore.unshift(newSlot);
  return newSlot;
}

export function getParentPortalOverviewStats(): ParentPortalOverviewStats {
  const outpasses = getGuardianOutpasses();
  const pendingCount = outpasses.filter((o) => o.guardian_status === "pending").length;
  const ward = getWardTelemetry();

  return {
    guardian: MOCK_GUARDIAN,
    ward,
    pendingOutpassCount: pendingCount,
    totalOutpasses: outpasses.length,
    outpasses,
    ptmSlots: getPTMConsultationSlots(),
    overallAttendancePct: ward.overall_attendance_pct,
    isAttendanceCritical: ward.overall_attendance_pct < 75,
  };
}
