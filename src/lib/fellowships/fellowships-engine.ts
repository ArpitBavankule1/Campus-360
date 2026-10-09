/**
 * CampusLens AI — Phase 44: Smart Campus Teaching Assistantships, Graduate Fellowships & Work-Study Engine
 * Token generators, verification hashing, and seed datasets
 */

import {
  FellowshipPosition,
  FellowshipApplication,
  FellowshipTimesheet,
  FellowshipDisbursement,
  FellowshipOverviewStats,
  FellowshipType,
} from "@/types";

// --- Token Generators ---

export function generateFellowshipAppToken(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-FEL-APP-2026-${rand}`;
}

export function generateFellowshipAppointmentToken(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-FEL-APPT-2026-${rand}`;
}

export function generateStipendVoucherToken(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-STIP-2026-${rand}`;
}

// --- Seed Mock Datasets ---

export const MOCK_FELLOWSHIP_POSITIONS: FellowshipPosition[] = [
  {
    id: "pos-cs201-ta",
    college_id: "col-apex-001",
    title: "Head Teaching Assistant — Data Structures & Algorithms",
    position_type: "teaching_assistant",
    department: "Computer Science & Engineering",
    course_code: "CS201",
    course_name: "Data Structures & Algorithms",
    faculty_supervisor_name: "Dr. Vikram Seth",
    faculty_supervisor_email: "vikram.seth@apex.edu",
    monthly_stipend_inr: 16000,
    required_hours_per_week: 12,
    open_slots: 4,
    filled_slots: 2,
    min_cgpa_requirement: 8.5,
    prerequisite_course_grade: "A",
    description:
      "Conduct weekly problem-solving tutorial recitations, supervise laboratory hands-on coding sessions, grade programming assignments, and hold 2 hours of student office hours.",
    responsibilities: [
      "Conduct 2 weekly problem recitations (60 students each)",
      "Evaluate algorithmic programming homework and code efficiency",
      "Supervise 3-hour laboratory slots in Computing Complex Lab 3",
      "Host weekly doubts clearing office hours in Block B-204",
    ],
    academic_term: "Autumn 2026-27",
    application_deadline: "2026-10-25T18:00:00Z",
    is_active: true,
    created_at: "2026-09-01T00:00:00Z",
  },
  {
    id: "pos-ai-ra",
    college_id: "col-apex-001",
    title: "Graduate Research Assistant — Deep Learning & Autonomous Systems",
    position_type: "research_assistant",
    department: "Computer Science & Engineering",
    course_code: "CS602",
    course_name: "Reinforcement Learning & Robotics",
    faculty_supervisor_name: "Prof. Priya Nair",
    faculty_supervisor_email: "priya.nair@apex.edu",
    monthly_stipend_inr: 22000,
    required_hours_per_week: 15,
    open_slots: 3,
    filled_slots: 1,
    min_cgpa_requirement: 8.8,
    prerequisite_course_grade: "A+",
    description:
      "Assist in training deep transformer models on the campus GPU cluster, maintain experimental benchmark datasets, and co-author conference submissions for IEEE/NeurIPS.",
    responsibilities: [
      "Manage PyTorch fine-tuning pipelines on the NVIDIA A100 GPU cluster",
      "Run ablation evaluations and maintain Weights & Biases telemetry logs",
      "Draft experimental results and methodology sections for peer review",
      "Mentor 2 undergraduate scholars on computer vision capstones",
    ],
    academic_term: "Autumn 2026-27",
    application_deadline: "2026-10-30T18:00:00Z",
    is_active: true,
    created_at: "2026-09-05T00:00:00Z",
  },
  {
    id: "pos-ece-lab-demo",
    college_id: "col-apex-001",
    title: "Lab Demonstrator — Embedded Systems & IoT Architectures",
    position_type: "lab_demonstrator",
    department: "Electronics & Communication Engineering",
    course_code: "EC304",
    course_name: "Embedded Microcontrollers & Edge IoT",
    faculty_supervisor_name: "Dr. Anand Kulkarni",
    faculty_supervisor_email: "anand.kulkarni@apex.edu",
    monthly_stipend_inr: 14000,
    required_hours_per_week: 10,
    open_slots: 3,
    filled_slots: 1,
    min_cgpa_requirement: 8.0,
    prerequisite_course_grade: "A",
    description:
      "Guide junior scholars through ARM Cortex-M4 firmware programming, logic analyzer debugging, and circuit breadboarding in the Advanced Hardware Pavilion.",
    responsibilities: [
      "Setup hardware kits (STM32, ESP32, oscilloscopes) prior to lab blocks",
      "Demonstrate I2C/SPI sensor interfacing and troubleshoot hardware faults",
      "Enforce lab safety and ESD precautions in Hardware Lab 2",
      "Check viva questions and verify weekly lab experiment journals",
    ],
    academic_term: "Autumn 2026-27",
    application_deadline: "2026-10-22T18:00:00Z",
    is_active: true,
    created_at: "2026-09-08T00:00:00Z",
  },
  {
    id: "pos-lib-workstudy",
    college_id: "col-apex-001",
    title: "Work-Study Scholar — Central Knowledge Commons & Archival Systems",
    position_type: "work_study",
    department: "Central University Administration",
    course_code: "WS101",
    course_name: "Knowledge Commons Management",
    faculty_supervisor_name: "Dr. Meenakshi Sundaram",
    faculty_supervisor_email: "meenakshi.sundaram@apex.edu",
    monthly_stipend_inr: 10000,
    required_hours_per_week: 8,
    open_slots: 5,
    filled_slots: 3,
    min_cgpa_requirement: 7.5,
    prerequisite_course_grade: "B+",
    description:
      "Manage circulation desk queries, assist scholars with RFID self-checkout kiosks, digitize institutional dissertations, and curate study pod reservations.",
    responsibilities: [
      "Staff the 2nd Floor Reference Desk during evening study blocks",
      "Scan and OCR doctoral theses into the institutional repository",
      "Verify book return barcodes and shelve volumes according to Dewey Decimal",
      "Assist visiting researchers with IEEE/ACM database access",
    ],
    academic_term: "Autumn 2026-27",
    application_deadline: "2026-11-05T18:00:00Z",
    is_active: true,
    created_at: "2026-09-10T00:00:00Z",
  },
  {
    id: "pos-maker-proctor",
    college_id: "col-apex-001",
    title: "Student Maker Proctor — Rapid Prototyping & CNC Machine Hub",
    position_type: "maker_proctor",
    department: "Mechanical & Mechatronics Engineering",
    course_code: "ME290",
    course_name: "Additive Manufacturing & Machining",
    faculty_supervisor_name: "Prof. Rohan Sengupta",
    faculty_supervisor_email: "rohan.sengupta@apex.edu",
    monthly_stipend_inr: 15000,
    required_hours_per_week: 12,
    open_slots: 2,
    filled_slots: 1,
    min_cgpa_requirement: 8.0,
    prerequisite_course_grade: "A",
    description:
      "Supervise student 3D printing jobs on Stratasys industrial printers, inspect G-code files, enforce PPE compliance, and maintain laser cutting optics.",
    responsibilities: [
      "Review student STL files for slicer errors before print authorization",
      "Perform bed leveling, nozzle swaps, and filament inventory logging",
      "Supervise laser cutter exhaust filtration and fire safety monitors",
      "Conduct introductory safety orientations for first-year design teams",
    ],
    academic_term: "Autumn 2026-27",
    application_deadline: "2026-10-28T18:00:00Z",
    is_active: true,
    created_at: "2026-09-12T00:00:00Z",
  },
];

export const MOCK_FELLOWSHIP_APPLICATIONS: FellowshipApplication[] = [
  {
    id: "app-aarav-ta",
    college_id: "col-apex-001",
    position_id: "pos-cs201-ta",
    student_id: "stu-aarav-2024",
    student_name: "Aarav Sharma",
    roll_number: "2024BCSE042",
    department: "Computer Science & Engineering",
    student_cgpa: 8.84,
    course_grade: "A+",
    statement_of_purpose:
      "I excelled in CS201 with top percentile marks and have a strong passion for helping juniors master recursion, trees, and dynamic programming.",
    portfolio_url: "https://github.com/aarav-apex/algo-visualizer",
    weekly_availability_hours: 12,
    application_token: "CL-FEL-APP-2026-1102",
    status: "appointed",
    appointment_token: "CL-FEL-APPT-2026-8812",
    appointed_at: "2026-09-15T10:00:00Z",
    faculty_feedback:
      "Outstanding domain clarity and demonstrated mentorship during prior peer tutoring circles. Appointed Head TA.",
    position: MOCK_FELLOWSHIP_POSITIONS[0],
    created_at: "2026-09-02T14:30:00Z",
  },
  {
    id: "app-ananya-ra",
    college_id: "col-apex-001",
    position_id: "pos-ai-ra",
    student_id: "stu-ananya-2024",
    student_name: "Ananya Verma",
    roll_number: "2024BCSE088",
    department: "Computer Science & Engineering",
    student_cgpa: 9.12,
    course_grade: "A+",
    statement_of_purpose:
      "Published a workshop paper on sparse vision transformers; eager to contribute to multi-modal autonomous robotics research.",
    portfolio_url: "https://github.com/ananya-v/robotics-vla",
    weekly_availability_hours: 15,
    application_token: "CL-FEL-APP-2026-3391",
    status: "shortlisted",
    faculty_feedback: "Shortlisted for panel technical review. High candidate merit.",
    position: MOCK_FELLOWSHIP_POSITIONS[1],
    created_at: "2026-09-10T11:20:00Z",
  },
  {
    id: "app-rohan-maker",
    college_id: "col-apex-001",
    position_id: "pos-maker-proctor",
    student_id: "stu-rohan-2024",
    student_name: "Rohan Patel",
    roll_number: "2024BECE015",
    department: "Electronics & Communication Engineering",
    student_cgpa: 8.25,
    course_grade: "A",
    statement_of_purpose:
      "3 years of experience operating FDM/SLA 3D printers and CNC mills; built the solar telemetry rover chassis for the SAE team.",
    portfolio_url: "https://maker.apex.edu/rohan-portfolio",
    weekly_availability_hours: 12,
    application_token: "CL-FEL-APP-2026-5541",
    status: "interview_scheduled",
    faculty_feedback: "Lab hands-on demo scheduled for Tuesday 4 PM at Innovation Center.",
    position: MOCK_FELLOWSHIP_POSITIONS[4],
    created_at: "2026-09-18T16:45:00Z",
  },
];

export const MOCK_FELLOWSHIP_TIMESHEETS: FellowshipTimesheet[] = [
  {
    id: "time-wk1",
    college_id: "col-apex-001",
    application_id: "app-aarav-ta",
    student_name: "Aarav Sharma",
    roll_number: "2024BCSE042",
    week_start_date: "2026-09-15",
    week_end_date: "2026-09-21",
    hours_logged: 12.0,
    duty_type: "laboratory_supervision",
    duty_summary:
      "Supervised Lab Session 1 on Dynamic Memory Allocation & Pointer Arithmetic. Assisted 38 students with memory leak debugging in Valgrind.",
    supervisor_feedback: "Detailed lab supervision report. Approved.",
    approval_status: "faculty_approved",
    approved_by_supervisor: "Dr. Vikram Seth",
    approved_at: "2026-09-22T09:30:00Z",
    created_at: "2026-09-21T18:00:00Z",
  },
  {
    id: "time-wk2",
    college_id: "col-apex-001",
    application_id: "app-aarav-ta",
    student_name: "Aarav Sharma",
    roll_number: "2024BCSE042",
    week_start_date: "2026-09-22",
    week_end_date: "2026-09-28",
    hours_logged: 12.0,
    duty_type: "tutorial_conduct",
    duty_summary:
      "Conducted 2 recitation sessions on Linked Lists and Stack/Queue implementations. Held 2 hours office hours for midterm query resolution.",
    supervisor_feedback: "Excellent student engagement feedback recorded.",
    approval_status: "faculty_approved",
    approved_by_supervisor: "Dr. Vikram Seth",
    approved_at: "2026-09-29T10:15:00Z",
    created_at: "2026-09-28T19:00:00Z",
  },
  {
    id: "time-wk3",
    college_id: "col-apex-001",
    application_id: "app-aarav-ta",
    student_name: "Aarav Sharma",
    roll_number: "2024BCSE042",
    week_start_date: "2026-09-29",
    week_end_date: "2026-10-05",
    hours_logged: 14.0,
    duty_type: "grading_assessments",
    duty_summary:
      "Evaluated 65 student submissions for Assignment 2 (Binary Search Trees & Heap Sort). Verified asymptotic complexity analysis.",
    supervisor_feedback: "Grading marks sheet uploaded to institutional portal.",
    approval_status: "faculty_approved",
    approved_by_supervisor: "Dr. Vikram Seth",
    approved_at: "2026-10-06T11:00:00Z",
    created_at: "2026-10-05T20:30:00Z",
  },
  {
    id: "time-wk4",
    college_id: "col-apex-001",
    application_id: "app-aarav-ta",
    student_name: "Aarav Sharma",
    roll_number: "2024BCSE042",
    week_start_date: "2026-10-06",
    week_end_date: "2026-10-12",
    hours_logged: 12.0,
    duty_type: "office_hours",
    duty_summary:
      "Conducted Graph Traversal (BFS/DFS) workshop and held 3 hours of pre-midterm doubt solving in Room B-204.",
    approval_status: "submitted",
    created_at: "2026-10-08T18:00:00Z",
  },
];

export const MOCK_FELLOWSHIP_DISBURSEMENTS: FellowshipDisbursement[] = [
  {
    id: "disb-sep-2026",
    college_id: "col-apex-001",
    student_id: "stu-aarav-2024",
    student_name: "Aarav Sharma",
    roll_number: "2024BCSE042",
    fellowship_title: "Head Teaching Assistant — Data Structures & Algorithms",
    disbursement_month: "September 2026",
    gross_stipend_inr: 16000,
    attendance_deductions_inr: 0,
    net_stipend_inr: 16000,
    dbt_bank_account_mask: "HDFC-XXXX-8821",
    utr_transaction_number: "UTR-20260930-APEX-88219",
    voucher_token: "CL-STIP-2026-4401",
    status: "disbursed",
    disbursed_at: "2026-09-30T16:00:00Z",
    created_at: "2026-09-30T16:00:00Z",
  },
  {
    id: "disb-oct-2026",
    college_id: "col-apex-001",
    student_id: "stu-aarav-2024",
    student_name: "Aarav Sharma",
    roll_number: "2024BCSE042",
    fellowship_title: "Head Teaching Assistant — Data Structures & Algorithms",
    disbursement_month: "October 2026",
    gross_stipend_inr: 16000,
    attendance_deductions_inr: 0,
    net_stipend_inr: 16000,
    dbt_bank_account_mask: "HDFC-XXXX-8821",
    utr_transaction_number: "UTR-20261031-APEX-99120",
    voucher_token: "CL-STIP-2026-4402",
    status: "escrow_locked",
    disbursed_at: "2026-10-31T16:00:00Z",
    created_at: "2026-10-01T00:00:00Z",
  },
];

export const MOCK_FELLOWSHIP_OVERVIEW_STATS: FellowshipOverviewStats = {
  totalPositions: 17,
  activeAppointments: 24,
  totalMonthlyStipendOutlay: 384000,
  pendingTimesheetApprovals: 4,
  positions: MOCK_FELLOWSHIP_POSITIONS,
  applications: MOCK_FELLOWSHIP_APPLICATIONS,
  timesheets: MOCK_FELLOWSHIP_TIMESHEETS,
  disbursements: MOCK_FELLOWSHIP_DISBURSEMENTS,
};

// --- Helper Functions ---

export function filterFellowshipPositions(
  positions: FellowshipPosition[],
  typeFilter: FellowshipType | "all" = "all",
  departmentFilter: string = "all",
  query: string = ""
): FellowshipPosition[] {
  return positions.filter((pos) => {
    const matchesType = typeFilter === "all" || pos.position_type === typeFilter;
    const matchesDept = departmentFilter === "all" || pos.department === departmentFilter;
    const q = query.toLowerCase().trim();
    const matchesQuery =
      !q ||
      pos.title.toLowerCase().includes(q) ||
      pos.department.toLowerCase().includes(q) ||
      (pos.course_code && pos.course_code.toLowerCase().includes(q)) ||
      pos.faculty_supervisor_name.toLowerCase().includes(q);
    return matchesType && matchesDept && matchesQuery;
  });
}

export function calculateCompletedHours(timesheets: FellowshipTimesheet[]): number {
  return timesheets
    .filter((t) => t.approval_status === "faculty_approved")
    .reduce((acc, curr) => acc + curr.hours_logged, 0);
}

// In-memory collections for active session state
let positionsStore = [...MOCK_FELLOWSHIP_POSITIONS];
let applicationsStore = [...MOCK_FELLOWSHIP_APPLICATIONS];
let timesheetsStore = [...MOCK_FELLOWSHIP_TIMESHEETS];
let disbursementsStore = [...MOCK_FELLOWSHIP_DISBURSEMENTS];

export function getFellowshipPositions(
  typeFilter: FellowshipType | "all" = "all",
  departmentFilter: string = "all",
  query: string = ""
): FellowshipPosition[] {
  return filterFellowshipPositions(positionsStore, typeFilter, departmentFilter, query);
}

export function getFellowshipApplications(studentId?: string): FellowshipApplication[] {
  if (!studentId) return applicationsStore;
  return applicationsStore.filter((app) => app.student_id === studentId);
}

export function submitFellowshipApplication(payload: {
  position_id: string;
  student_name: string;
  roll_number: string;
  department: string;
  student_cgpa: number;
  course_grade: string;
  statement_of_purpose: string;
  portfolio_url?: string;
  weekly_availability_hours?: number;
}): FellowshipApplication {
  const position = positionsStore.find((p) => p.id === payload.position_id);
  const newApp: FellowshipApplication = {
    id: `app-${Date.now()}`,
    college_id: "col-apex-001",
    position_id: payload.position_id,
    student_id: "stu-aarav-2024",
    student_name: payload.student_name,
    roll_number: payload.roll_number,
    department: payload.department,
    student_cgpa: payload.student_cgpa,
    course_grade: payload.course_grade,
    statement_of_purpose: payload.statement_of_purpose,
    portfolio_url: payload.portfolio_url,
    weekly_availability_hours: payload.weekly_availability_hours || 12,
    application_token: generateFellowshipAppToken(),
    status: "submitted",
    position: position,
    created_at: new Date().toISOString(),
  };
  applicationsStore.unshift(newApp);
  return newApp;
}

export function getFellowshipTimesheets(applicationId?: string): FellowshipTimesheet[] {
  if (!applicationId) return timesheetsStore;
  return timesheetsStore.filter((t) => t.application_id === applicationId);
}

export function submitFellowshipTimesheet(payload: {
  application_id: string;
  student_name: string;
  roll_number: string;
  week_start_date: string;
  week_end_date: string;
  hours_logged: number;
  duty_type: any;
  duty_summary: string;
}): FellowshipTimesheet {
  const newTimesheet: FellowshipTimesheet = {
    id: `time-${Date.now()}`,
    college_id: "col-apex-001",
    application_id: payload.application_id,
    student_name: payload.student_name,
    roll_number: payload.roll_number,
    week_start_date: payload.week_start_date,
    week_end_date: payload.week_end_date,
    hours_logged: payload.hours_logged,
    duty_type: payload.duty_type,
    duty_summary: payload.duty_summary,
    approval_status: "submitted",
    created_at: new Date().toISOString(),
  };
  timesheetsStore.unshift(newTimesheet);
  return newTimesheet;
}

export function updateFellowshipTimesheetStatus(
  id: string,
  status: "faculty_approved" | "rejected",
  supervisorFeedback?: string
): FellowshipTimesheet | null {
  const sheet = timesheetsStore.find((t) => t.id === id);
  if (!sheet) return null;
  sheet.approval_status = status;
  sheet.supervisor_feedback = supervisorFeedback || (status === "faculty_approved" ? "Duty approved by supervisor" : "Returned for clarification");
  if (status === "faculty_approved") {
    sheet.approved_by_supervisor = "Dr. Vikram Seth";
    sheet.approved_at = new Date().toISOString();
  }
  return sheet;
}

export function getFellowshipDisbursements(studentId?: string): FellowshipDisbursement[] {
  if (!studentId) return disbursementsStore;
  return disbursementsStore.filter((d) => d.student_id === studentId);
}

export function getFellowshipOverviewStats(): FellowshipOverviewStats {
  return {
    totalPositions: positionsStore.length,
    activeAppointments: applicationsStore.filter((a) => a.status === "appointed").length,
    totalMonthlyStipendOutlay: disbursementsStore.reduce((acc, curr) => acc + curr.net_stipend_inr, 0) * 12,
    pendingTimesheetApprovals: timesheetsStore.filter((t) => t.approval_status === "submitted").length,
    positions: positionsStore,
    applications: applicationsStore,
    timesheets: timesheetsStore,
    disbursements: disbursementsStore,
  };
}

