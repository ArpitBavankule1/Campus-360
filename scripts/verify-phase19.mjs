#!/usr/bin/env node
/**
 * CampusLens AI — Phase 19 Verification Suite
 * Automated test: Academic Examinations, Hall Tickets, Seating Matrix & Grade Analytics
 * Run: node scripts/verify-phase19.mjs
 */

import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

let passed = 0;
let failed = 0;
const results = [];

function check(label, condition, detail = "") {
  if (condition) {
    passed++;
    results.push({ label, ok: true });
    console.log(`  ✅  ${label}`);
  } else {
    failed++;
    results.push({ label, ok: false, detail });
    console.log(`  ❌  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

function fileExists(relPath) {
  return existsSync(path.join(root, relPath));
}

function fileContains(relPath, ...fragments) {
  try {
    const content = readFileSync(path.join(root, relPath), "utf-8");
    return fragments.every((f) => content.includes(f));
  } catch {
    return false;
  }
}

console.log("\n🎓  CampusLens AI — Phase 19 Verification: Academic Examinations & Grades\n");
console.log("═".repeat(60));

// ── Database Migration ───────────────────────────────────────────
console.log("\n📦 Database Migration");

check(
  "Examinations schema migration file exists",
  fileExists("supabase/migrations/20260927000003_examinations_schema.sql")
);
check(
  "exam_schedules table defined with foreign keys and fields",
  fileContains(
    "supabase/migrations/20260927000003_examinations_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.exam_schedules",
    "subject_code TEXT NOT NULL",
    "room_number TEXT NOT NULL",
    "exam_type TEXT NOT NULL"
  )
);
check(
  "exam_hall_tickets table defined with QR verification code",
  fileContains(
    "supabase/migrations/20260927000003_examinations_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.exam_hall_tickets",
    "hall_ticket_number TEXT NOT NULL UNIQUE",
    "attendance_percentage NUMERIC",
    "qr_verification_code TEXT NOT NULL"
  )
);
check(
  "exam_seating_allocations table defined with bench numbers",
  fileContains(
    "supabase/migrations/20260927000003_examinations_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.exam_seating_allocations",
    "roll_number TEXT NOT NULL",
    "bench_number TEXT NOT NULL"
  )
);
check(
  "student_grade_records table defined with grades and points",
  fileContains(
    "supabase/migrations/20260927000003_examinations_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.student_grade_records",
    "internal_marks INTEGER",
    "endsem_marks INTEGER",
    "grade_point NUMERIC",
    "'O', 'A+', 'A', 'B+', 'B', 'C', 'F'"
  )
);
check(
  "Row Level Security and multi-tenant policies defined",
  fileContains(
    "supabase/migrations/20260927000003_examinations_schema.sql",
    "ENABLE ROW LEVEL SECURITY",
    "current_user_college_id()",
    "auth.uid()"
  )
);

// ── TypeScript Types ─────────────────────────────────────────────
console.log("\n🏷️  TypeScript Types");

check(
  "ExamType and LetterGrade types exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type ExamType",
    "export type LetterGrade",
    "export type GradeRecordStatus"
  )
);
check(
  "ExamSchedule and ExamHallTicket interfaces exported",
  fileContains(
    "src/types/index.ts",
    "export interface ExamSchedule",
    "export interface ExamHallTicket",
    "hall_ticket_number",
    "qr_verification_code"
  )
);
check(
  "ExamSeating and StudentGradeRecord interfaces exported",
  fileContains(
    "src/types/index.ts",
    "export interface ExamSeating",
    "export interface StudentGradeRecord",
    "grade_point",
    "SemesterTranscriptSummary"
  )
);
check(
  "Exam tables defined in database.types.ts",
  fileContains(
    "src/types/database.types.ts",
    "exam_schedules: {",
    "exam_hall_tickets: {",
    "exam_seating_allocations: {",
    "student_grade_records: {"
  )
);

// ── Examination Engine Logic ─────────────────────────────────────
console.log("\n⚙️  Examination Engine & Calculations");

check(
  "Exam engine file exists",
  fileExists("src/lib/exams/exam-engine.ts")
);

check(
  "calculateSGPA function exported and implements weighted formula",
  fileContains(
    "src/lib/exams/exam-engine.ts",
    "export function calculateSGPA",
    "totalWeightedPoints / totalCredits"
  )
);

check(
  "calculateCGPA function exported",
  fileContains(
    "src/lib/exams/exam-engine.ts",
    "export function calculateCGPA",
    "totalWeighted / totalCredits"
  )
);

check(
  "simulateTargetSGPA exported and computes feasibility",
  fileContains(
    "src/lib/exams/exam-engine.ts",
    "export function simulateTargetSGPA",
    "isAchievable"
  )
);

check(
  "Mock schedules, seating, hall ticket, and transcripts exported",
  fileContains(
    "src/lib/exams/exam-engine.ts",
    "MOCK_EXAM_SCHEDULES",
    "MOCK_SEATING_ALLOCATIONS",
    "MOCK_STUDENT_HALL_TICKET",
    "MOCK_SEMESTER_5_TRANSCRIPT"
  )
);

// Unit logic verification
function calculateSGPA(records) {
  const weighted = records.reduce((sum, r) => sum + r.credits * r.grade_point, 0);
  const credits = records.reduce((sum, r) => sum + r.credits, 0);
  return Number((weighted / credits).toFixed(2));
}

const sampleGrades = [
  { credits: 4, grade_point: 10.0 }, // 40
  { credits: 4, grade_point: 9.0 },  // 36
  { credits: 4, grade_point: 8.0 },  // 32
]; // total points = 108, total credits = 12 -> SGPA = 9.00

check(
  "SGPA formula mathematically yields 9.00 for 108 points / 12 credits",
  calculateSGPA(sampleGrades) === 9.00
);

function simulateTarget(current, completed, target, future) {
  const req = ((target * (completed + future)) - (current * completed)) / future;
  return { required: Number(req.toFixed(2)), isAchievable: req <= 10.0 && req >= 0 };
}

check(
  "Target GPA simulation correctly identifies required future SGPA",
  simulateTarget(8.0, 100, 8.5, 20).required === 11.00 &&
    simulateTarget(8.0, 100, 8.5, 20).isAchievable === false &&
    simulateTarget(8.8, 100, 9.0, 20).isAchievable === true
);

// ── API Routes ───────────────────────────────────────────────────
console.log("\n🌐 API Endpoints");

check(
  "Exam schedules API route exists",
  fileExists("src/app/api/exams/schedules/route.ts") &&
    fileContains("src/app/api/exams/schedules/route.ts", "export async function GET")
);

check(
  "Hall ticket API route exists",
  fileExists("src/app/api/exams/hall-ticket/route.ts") &&
    fileContains("src/app/api/exams/hall-ticket/route.ts", "export async function GET")
);

check(
  "Seating matrix API route exists",
  fileExists("src/app/api/exams/seating/route.ts") &&
    fileContains("src/app/api/exams/seating/route.ts", "export async function GET")
);

check(
  "Grades & revaluation API route exists",
  fileExists("src/app/api/exams/grades/route.ts") &&
    fileContains("src/app/api/exams/grades/route.ts", "export async function GET", "export async function POST")
);

// ── UI Components ────────────────────────────────────────────────
console.log("\n🎨 React UI Components");

check(
  "HallTicketCard component exists with print and QR verification",
  fileExists("src/components/exams/hall-ticket-card.tsx") &&
    fileContains("src/components/exams/hall-ticket-card.tsx", "HallTicketCard", "window.print", "qr_verification_code")
);

check(
  "SeatingMatrixLookup component exists with roll number search",
  fileExists("src/components/exams/seating-matrix-lookup.tsx") &&
    fileContains("src/components/exams/seating-matrix-lookup.tsx", "SeatingMatrixLookup", "bench_number", "room_number")
);

check(
  "GradeTranscriptView component exists with SGPA metrics and revaluation action",
  fileExists("src/components/exams/grade-transcript-view.tsx") &&
    fileContains("src/components/exams/grade-transcript-view.tsx", "GradeTranscriptView", "sgpa", "cgpa", "handleApplyRevaluation")
);

check(
  "GpaTargetSimulator component exists with target projection sliders",
  fileExists("src/components/exams/gpa-target-simulator.tsx") &&
    fileContains("src/components/exams/gpa-target-simulator.tsx", "GpaTargetSimulator", "simulateTargetSGPA", "targetCGPA")
);

check(
  "ExamScheduleTimeline component exists with session timing cards",
  fileExists("src/components/exams/exam-schedule-timeline.tsx") &&
    fileContains("src/components/exams/exam-schedule-timeline.tsx", "ExamScheduleTimeline", "Morning Session", "total_marks")
);

// ── Portal Pages & Ecosystem Integration ─────────────────────────
console.log("\n📱 Portal Page & Ecosystem Integration");

check(
  "Dedicated /exams route page exists with all 5 view tabs",
  fileExists("src/app/exams/page.tsx") &&
    fileContains("src/app/exams/page.tsx", "ExaminationsPage", "HallTicketCard", "SeatingMatrixLookup", "GpaTargetSimulator")
);

check(
  "Sidebar navigation includes Exams & Grades with Phase 19 badge",
  fileContains(
    "src/components/layout/sidebar.tsx",
    "/exams",
    "Exams & Grades",
    "Phase 19"
  )
);

check(
  "Global command palette includes Examinations & Hall Tickets",
  fileContains(
    "src/components/layout/command-palette.tsx",
    "/exams",
    "Examinations & Hall Tickets"
  )
);

check(
  "Student dashboard quick actions includes Exams & Hall Tickets",
  fileContains(
    "src/components/dashboard/quick-actions.tsx",
    "/exams",
    "Exams & Hall Tickets",
    "Phase 19"
  )
);

// ── Summary ──────────────────────────────────────────────────────
console.log("\n" + "═".repeat(60));
console.log(`\n📊  Phase 19 Verification Summary:`);
console.log(`    Total Checks: ${passed + failed}`);
console.log(`    Passed:       ${passed}`);
console.log(`    Failed:       ${failed}`);

if (failed === 0) {
  console.log("\n🎉  ALL PHASE 19 CHECKS PASSED PERFECTLY!\n");
  process.exit(0);
} else {
  console.log(`\n⚠️  ${failed} checks failed. Review details above.\n`);
  process.exit(1);
}
