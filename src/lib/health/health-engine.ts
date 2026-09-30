// ================================================================
// CampusLens AI — Phase 24 Health Center & Infirmary Engine
// Triage calculations, attendance waiver engine & seed clinical data
// ================================================================

import {
  StudentHealthProfile,
  HealthAppointment,
  MedicalLeaveRequest,
  DispensaryMedicine,
  EmergencySOSDispatch,
  CampusDoctorSchedule,
  StudentHealthOverview,
} from "@/types";

export const MOCK_COLLEGE_ID = "col-apex-001";
export const MOCK_STUDENT_ID = "00000000-0000-0000-0000-000000000001";

// 1. Mock Doctors OPD Directory
export const MOCK_DOCTOR_SCHEDULES: CampusDoctorSchedule[] = [
  {
    id: "doc-001",
    name: "Dr. Ananya Sen, MD",
    specialization: "Chief Campus Physician & Internal Medicine",
    qualifications: "MBBS, MD (General Medicine) - AIIMS New Delhi",
    opdDays: "Mon – Fri",
    opdTimings: "09:00 AM – 01:30 PM",
    roomNumber: "Consultation Room 1, Infirmary Wing",
    activeStatus: "in_clinic",
  },
  {
    id: "doc-002",
    name: "Dr. Farhan Qureshi, MS",
    specialization: "Orthopedics & Sports Physiotherapy",
    qualifications: "MBBS, MS (Orthopedics), Dip. Sports Medicine",
    opdDays: "Mon, Wed, Fri",
    opdTimings: "02:00 PM – 05:30 PM",
    roomNumber: "Physio & Rehabilitation Suite",
    activeStatus: "in_clinic",
  },
  {
    id: "doc-003",
    name: "Dr. Shalini Kulkarni, Ph.D.",
    specialization: "Clinical Psychologist & Student Wellness",
    qualifications: "M.Phil, Ph.D. (Clinical Psychology) - NIMHANS",
    opdDays: "Tue, Thu, Sat",
    opdTimings: "10:00 AM – 04:00 PM",
    roomNumber: "Wellness Sanctuary, 2nd Floor",
    activeStatus: "on_call",
  },
  {
    id: "doc-004",
    name: "Dr. Arvind Chawla, MBBS",
    specialization: "Emergency Trauma & Duty Medical Officer",
    qualifications: "MBBS, Fellow Emergency Medicine (FEM)",
    opdDays: "24/7 Rotational",
    opdTimings: "Emergency Night Shift",
    roomNumber: "Triage Bay & Ambulance Station",
    activeStatus: "in_clinic",
  },
];

// 2. Mock Student Health Profile
export const MOCK_HEALTH_PROFILE: StudentHealthProfile = {
  id: "shp-001",
  college_id: MOCK_COLLEGE_ID,
  student_id: MOCK_STUDENT_ID,
  blood_group: "O+",
  allergies: ["Penicillin", "Dust Mites"],
  chronic_conditions: ["Mild Allergic Rhinitis"],
  emergency_contact_name: "Ramesh Sharma (Father)",
  emergency_contact_phone: "+91 94220 12345",
  emergency_contact_relation: "Father",
  insurance_policy_no: "APEX-STU-MED-2025-9941",
  created_at: "2025-08-01T10:00:00Z",
  updated_at: "2026-09-01T10:00:00Z",
};

// 3. Mock Health Appointments
export const MOCK_HEALTH_APPOINTMENTS: HealthAppointment[] = [
  {
    id: "ha-001",
    college_id: MOCK_COLLEGE_ID,
    student_id: MOCK_STUDENT_ID,
    doctor_name: "Dr. Ananya Sen, MD",
    specialization: "Chief Campus Physician",
    appointment_date: "2026-10-02",
    time_slot: "10:30 AM – 11:00 AM",
    token_number: 14,
    symptoms: "Seasonal allergic sneezing, mild throat irritation post badminton session",
    status: "scheduled",
    created_at: "2026-09-29T14:00:00Z",
  },
  {
    id: "ha-002",
    college_id: MOCK_COLLEGE_ID,
    student_id: MOCK_STUDENT_ID,
    doctor_name: "Dr. Farhan Qureshi, MS",
    specialization: "Sports Physiotherapy",
    appointment_date: "2026-09-12",
    time_slot: "03:00 PM – 03:30 PM",
    token_number: 6,
    symptoms: "Right ankle ligament sprain during inter-department basketball tournament",
    status: "completed",
    prescription_notes: "Advised RICE protocol, crepe bandage support for 5 days, and Ibuprofen 400mg SOS.",
    created_at: "2026-09-11T16:00:00Z",
  },
];

// 4. Mock Medical Leave Requests
export const MOCK_MEDICAL_LEAVES: MedicalLeaveRequest[] = [
  {
    id: "ml-001",
    college_id: MOCK_COLLEGE_ID,
    student_id: MOCK_STUDENT_ID,
    leave_code: "CL-MED-LEV-2026-8812",
    start_date: "2026-09-12",
    end_date: "2026-09-15",
    total_days: 4,
    reason: "Severe acute ankle sprain and mobility restriction advised by campus orthopedist",
    doctor_certificate_url: "/docs/certificates/medical-cert-8812.pdf",
    attendance_waiver_granted: true,
    verified_by: "Dr. Ananya Sen (Chief Medical Officer)",
    status: "approved",
    created_at: "2026-09-12T11:00:00Z",
  },
];

// 5. Mock Dispensary Medicines
export const MOCK_DISPENSARY_MEDICINES: DispensaryMedicine[] = [
  {
    id: "dm-001",
    college_id: MOCK_COLLEGE_ID,
    name: "Paracetamol 650mg (Dolo)",
    generic_name: "Paracetamol",
    dosage: "650mg",
    available_quantity: 450,
    unit: "strips",
    requires_prescription: false,
    is_in_stock: true,
  },
  {
    id: "dm-002",
    college_id: MOCK_COLLEGE_ID,
    name: "Cetirizine 10mg",
    generic_name: "Cetirizine Hydrochloride",
    dosage: "10mg",
    available_quantity: 320,
    unit: "strips",
    requires_prescription: false,
    is_in_stock: true,
  },
  {
    id: "dm-003",
    college_id: MOCK_COLLEGE_ID,
    name: "Electral Oral Rehydration Salts (ORS)",
    generic_name: "WHO Formula Rehydration Salts",
    dosage: "21.8g Sachet",
    available_quantity: 600,
    unit: "sachets",
    requires_prescription: false,
    is_in_stock: true,
  },
  {
    id: "dm-004",
    college_id: MOCK_COLLEGE_ID,
    name: "Digene Gel Mint (Antacid)",
    generic_name: "Aluminium Hydroxide + Magnesium Hydroxide",
    dosage: "200ml Bottle",
    available_quantity: 85,
    unit: "bottles",
    requires_prescription: false,
    is_in_stock: true,
  },
  {
    id: "dm-005",
    college_id: MOCK_COLLEGE_ID,
    name: "Amoxicillin 500mg (Antibiotic)",
    generic_name: "Amoxicillin Trihydrate",
    dosage: "500mg",
    available_quantity: 120,
    unit: "strips",
    requires_prescription: true,
    is_in_stock: true,
  },
];

// Helper Functions

export function generateLeaveCode(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CL-MED-LEV-2026-${randomSuffix}`;
}

export function generateSOSTicketCode(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CL-EMG-SOS-2026-${randomSuffix}`;
}

export function calculateAttendanceWaiver(
  totalDaysLeave: number,
  conductedLectures: number = 60,
  attendedLectures: number = 42
): {
  originalPercentage: number;
  waivedPercentage: number;
  excusedHours: number;
} {
  const originalPercentage = Math.round((attendedLectures / conductedLectures) * 100);
  // Assume 4 lecture hours per working day
  const excusedHours = totalDaysLeave * 4;
  const effectiveConducted = Math.max(1, conductedLectures - excusedHours);
  const waivedPercentage = Math.min(100, Math.round((attendedLectures / effectiveConducted) * 100));

  return {
    originalPercentage,
    waivedPercentage,
    excusedHours,
  };
}

export function getStudentHealthOverview(
  studentId: string = MOCK_STUDENT_ID,
  profile: StudentHealthProfile = MOCK_HEALTH_PROFILE,
  appointments: HealthAppointment[] = MOCK_HEALTH_APPOINTMENTS,
  leaves: MedicalLeaveRequest[] = MOCK_MEDICAL_LEAVES
): StudentHealthOverview {
  const activeAppts = appointments.filter((a) => a.student_id === studentId && a.status === "scheduled");
  const recentLeaves = leaves.filter((l) => l.student_id === studentId);
  const hasSevereAllergy = profile.allergies.length > 0;

  return {
    profile,
    activeAppointments: activeAppts,
    recentMedicalLeaves: recentLeaves,
    healthStatus: hasSevereAllergy ? "critical_allergy" : "fit",
  };
}
