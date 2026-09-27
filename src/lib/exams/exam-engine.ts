/**
 * CampusLens AI — Phase 19 Examinations & Grades Engine
 * Provides SGPA/CGPA calculations, target GPA simulator logic,
 * hall ticket QR generator, seating lookup, and realistic seed data.
 */

import {
  ExamHallTicket,
  ExamSchedule,
  ExamSeating,
  LetterGrade,
  SemesterTranscriptSummary,
  StudentGradeRecord,
} from "@/types";

export const GRADE_POINT_MAP: Record<LetterGrade, number> = {
  O: 10.0,
  "A+": 9.0,
  A: 8.0,
  "B+": 7.0,
  B: 6.0,
  C: 5.0,
  F: 0.0,
};

/**
 * Calculates Semester Grade Point Average (SGPA)
 * SGPA = Σ (credits * grade_point) / Σ (credits)
 */
export function calculateSGPA(records: StudentGradeRecord[]): number {
  const validRecords = records.filter((r) => r.status !== "under_revaluation");
  if (validRecords.length === 0) return 0.0;

  const totalWeightedPoints = validRecords.reduce(
    (sum, r) => sum + r.credits * r.grade_point,
    0
  );
  const totalCredits = validRecords.reduce((sum, r) => sum + r.credits, 0);

  if (totalCredits === 0) return 0.0;
  return Number((totalWeightedPoints / totalCredits).toFixed(2));
}

/**
 * Calculates Cumulative Grade Point Average (CGPA) across multiple semester summaries
 */
export function calculateCGPA(
  semesterSummaries: { totalCredits: number; sgpa: number }[]
): number {
  if (semesterSummaries.length === 0) return 0.0;

  const totalWeighted = semesterSummaries.reduce(
    (sum, s) => sum + s.totalCredits * s.sgpa,
    0
  );
  const totalCredits = semesterSummaries.reduce(
    (sum, s) => sum + s.totalCredits,
    0
  );

  if (totalCredits === 0) return 0.0;
  return Number((totalWeighted / totalCredits).toFixed(2));
}

/**
 * Simulates target GPA required in future semester to achieve target CGPA
 * Formula: Required SGPA = ((Target CGPA * Total Credits) - (Current CGPA * Completed Credits)) / Future Credits
 */
export function simulateTargetSGPA(
  currentCGPA: number,
  completedCredits: number,
  targetCGPA: number,
  futureCredits: number
): { requiredSGPA: number; isAchievable: boolean } {
  if (futureCredits <= 0) {
    return { requiredSGPA: targetCGPA, isAchievable: currentCGPA >= targetCGPA };
  }

  const totalCredits = completedCredits + futureCredits;
  const currentTotalWeighted = currentCGPA * completedCredits;
  const targetTotalWeighted = targetCGPA * totalCredits;

  const requiredPoints = targetTotalWeighted - currentTotalWeighted;
  const requiredSGPA = Number((requiredPoints / futureCredits).toFixed(2));

  return {
    requiredSGPA,
    isAchievable: requiredSGPA <= 10.0 && requiredSGPA >= 0,
  };
}

/**
 * Mock Examination Schedules for Autumn Semester 2026
 */
export const MOCK_EXAM_SCHEDULES: ExamSchedule[] = [
  {
    id: "ex-sch-01",
    college_id: "c0000000-0000-0000-0000-000000000001",
    semester: "Semester 6 - Autumn 2026",
    subject_code: "CS601",
    subject_name: "Distributed Cloud Computing & Microservices",
    exam_date: "2026-10-12",
    start_time: "10:00 AM",
    end_time: "01:00 PM",
    room_number: "AUD-G01",
    building_name: "APJ Abdul Kalam Block",
    total_marks: 100,
    exam_type: "end_sem",
  },
  {
    id: "ex-sch-02",
    college_id: "c0000000-0000-0000-0000-000000000001",
    semester: "Semester 6 - Autumn 2026",
    subject_code: "CS602",
    subject_name: "Deep Learning & Neural Network Architectures",
    exam_date: "2026-10-15",
    start_time: "10:00 AM",
    end_time: "01:00 PM",
    room_number: "AUD-G01",
    building_name: "APJ Abdul Kalam Block",
    total_marks: 100,
    exam_type: "end_sem",
  },
  {
    id: "ex-sch-03",
    college_id: "c0000000-0000-0000-0000-000000000001",
    semester: "Semester 6 - Autumn 2026",
    subject_code: "CS603",
    subject_name: "Information Security & Cryptographic Protocols",
    exam_date: "2026-10-18",
    start_time: "02:00 PM",
    end_time: "05:00 PM",
    room_number: "LH-301",
    building_name: "Turing Academic Annex",
    total_marks: 100,
    exam_type: "end_sem",
  },
  {
    id: "ex-sch-04",
    college_id: "c0000000-0000-0000-0000-000000000001",
    semester: "Semester 6 - Autumn 2026",
    subject_code: "CS604",
    subject_name: "Full Stack DevOps & Container Orchestration",
    exam_date: "2026-10-21",
    start_time: "10:00 AM",
    end_time: "01:00 PM",
    room_number: "LH-302",
    building_name: "Turing Academic Annex",
    total_marks: 100,
    exam_type: "end_sem",
  },
  {
    id: "ex-sch-05",
    college_id: "c0000000-0000-0000-0000-000000000001",
    semester: "Semester 6 - Autumn 2026",
    subject_code: "CS605P",
    subject_name: "Capstone Cloud Engineering Practical & Viva",
    exam_date: "2026-10-24",
    start_time: "09:00 AM",
    end_time: "01:00 PM",
    room_number: "TTA-302",
    building_name: "High-Performance GPU Lab",
    total_marks: 50,
    exam_type: "practical",
  },
];

/**
 * Mock Seating Arrangements Allocation Matrix
 */
export const MOCK_SEATING_ALLOCATIONS: ExamSeating[] = [
  {
    id: "seat-01",
    exam_schedule_id: "ex-sch-01",
    student_id: "usr-demo-01",
    roll_number: "2023-CSE-042",
    student_name: "Aarav Sharma",
    subject_code: "CS601",
    subject_name: "Distributed Cloud Computing & Microservices",
    room_number: "AUD-G01",
    building_name: "Central Auditorium",
    floor: "Ground Floor",
    bench_number: "Row C - Bench 04",
    exam_date: "2026-10-12",
    start_time: "10:00 AM",
    end_time: "01:00 PM",
  },
  {
    id: "seat-02",
    exam_schedule_id: "ex-sch-02",
    student_id: "usr-demo-01",
    roll_number: "2023-CSE-042",
    student_name: "Aarav Sharma",
    subject_code: "CS602",
    subject_name: "Deep Learning & Neural Network Architectures",
    room_number: "AUD-G01",
    building_name: "Central Auditorium",
    floor: "Ground Floor",
    bench_number: "Row C - Bench 04",
    exam_date: "2026-10-15",
    start_time: "10:00 AM",
    end_time: "01:00 PM",
  },
  {
    id: "seat-03",
    exam_schedule_id: "ex-sch-03",
    student_id: "usr-demo-01",
    roll_number: "2023-CSE-042",
    student_name: "Aarav Sharma",
    subject_code: "CS603",
    subject_name: "Information Security & Cryptographic Protocols",
    room_number: "LH-301",
    building_name: "Turing Academic Annex",
    floor: "3rd Floor",
    bench_number: "Row B - Bench 12",
    exam_date: "2026-10-18",
    start_time: "02:00 PM",
    end_time: "05:00 PM",
  },
  {
    id: "seat-04",
    exam_schedule_id: "ex-sch-01",
    student_id: "usr-demo-02",
    roll_number: "2023-CSE-043",
    student_name: "Priya Nair",
    subject_code: "CS601",
    subject_name: "Distributed Cloud Computing & Microservices",
    room_number: "AUD-G01",
    building_name: "Central Auditorium",
    floor: "Ground Floor",
    bench_number: "Row C - Bench 05",
    exam_date: "2026-10-12",
    start_time: "10:00 AM",
    end_time: "01:00 PM",
  },
  {
    id: "seat-05",
    exam_schedule_id: "ex-sch-01",
    student_id: "usr-demo-03",
    roll_number: "2023-CSE-044",
    student_name: "Rohan Kulkarni",
    subject_code: "CS601",
    subject_name: "Distributed Cloud Computing & Microservices",
    room_number: "AUD-G01",
    building_name: "Central Auditorium",
    floor: "Ground Floor",
    bench_number: "Row C - Bench 06",
    exam_date: "2026-10-12",
    start_time: "10:00 AM",
    end_time: "01:00 PM",
  },
];

/**
 * Mock Official Student Hall Ticket
 */
export const MOCK_STUDENT_HALL_TICKET: ExamHallTicket = {
  id: "ht-2026-001",
  college_id: "c0000000-0000-0000-0000-000000000001",
  student_id: "usr-demo-01",
  student_name: "Aarav Sharma",
  roll_number: "2023-CSE-042",
  enrolled_program: "B.Tech in Computer Science & Engineering (Year 3)",
  semester: "Semester 6 — End-Term Examination (Autumn 2026)",
  hall_ticket_number: "HT-2026-AUT-CSE-0429",
  is_eligible: true,
  attendance_percentage: 88.5,
  fee_clearance: true,
  qr_verification_code: "CL-EXAM-VERIFY-HT20260429-VALID",
  exam_center: "Apex Institute of Technology, Campus Center Block A",
  schedules: MOCK_EXAM_SCHEDULES,
  instructions: [
    "Candidates must carry this official Hall Ticket along with their Holographic Digital Campus ID.",
    "Entry into the examination hall is permitted up to 15 minutes before scheduled start time.",
    "Smartwatches, programmable calculators, and unauthorized electronic devices are strictly prohibited.",
    "Ensure the invigilator signs your attendance ledger matching your allocated bench number.",
  ],
};

/**
 * Mock Semester Transcripts & Grade Records
 */
export const MOCK_SEMESTER_5_TRANSCRIPT: SemesterTranscriptSummary = {
  semester: "Semester 5 (Spring 2026)",
  totalCredits: 22,
  creditsEarned: 22,
  sgpa: 9.18,
  cgpa: 8.92,
  totalMarksScored: 524,
  maxMarks: 600,
  percentage: 87.3,
  records: [
    {
      id: "gr-501",
      student_id: "usr-demo-01",
      semester: "Semester 5",
      subject_code: "CS501",
      subject_name: "Design & Analysis of Algorithms",
      credits: 4,
      internal_marks: 28,
      endsem_marks: 66,
      total_marks: 94,
      grade: "O",
      grade_point: 10.0,
      status: "passed",
    },
    {
      id: "gr-502",
      student_id: "usr-demo-01",
      semester: "Semester 5",
      subject_code: "CS502",
      subject_name: "Database Engineering & Query Optimization",
      credits: 4,
      internal_marks: 27,
      endsem_marks: 63,
      total_marks: 90,
      grade: "O",
      grade_point: 10.0,
      status: "passed",
    },
    {
      id: "gr-503",
      student_id: "usr-demo-01",
      semester: "Semester 5",
      subject_code: "CS503",
      subject_name: "Operating Systems Internals & Concurrency",
      credits: 4,
      internal_marks: 25,
      endsem_marks: 61,
      total_marks: 86,
      grade: "A+",
      grade_point: 9.0,
      status: "passed",
    },
    {
      id: "gr-504",
      student_id: "usr-demo-01",
      semester: "Semester 5",
      subject_code: "CS504",
      subject_name: "Software Engineering & Agile Methodologies",
      credits: 3,
      internal_marks: 26,
      endsem_marks: 58,
      total_marks: 84,
      grade: "A+",
      grade_point: 9.0,
      status: "passed",
    },
    {
      id: "gr-505",
      student_id: "usr-demo-01",
      semester: "Semester 5",
      subject_code: "CS505",
      subject_name: "Computer Networks & Socket Programming",
      credits: 4,
      internal_marks: 24,
      endsem_marks: 58,
      total_marks: 82,
      grade: "A+",
      grade_point: 9.0,
      status: "passed",
    },
    {
      id: "gr-506P",
      student_id: "usr-demo-01",
      semester: "Semester 5",
      subject_code: "CS506P",
      subject_name: "Systems Programming & Linux Lab",
      credits: 3,
      internal_marks: 29,
      endsem_marks: 59,
      total_marks: 88,
      grade: "A+",
      grade_point: 9.0,
      status: "passed",
    },
  ],
};
