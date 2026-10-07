#!/usr/bin/env node
/**
 * CampusLens AI — Phase 42 Verification Suite
 * Automated test: Smart Campus Admissions, Program Applications & Merit Counseling Gateway
 * Run: node scripts/verify-phase42.mjs
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

console.log("\n🎓  CampusLens AI — Phase 42 Verification: Admissions & Merit Enrollment Gateway\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "Admissions schema migration file exists",
  fileExists("supabase/migrations/20261007000001_admissions_schema.sql")
);
check(
  "academic_programs, admission_applications, seat_allotment_dockets, campus_tour_bookings defined with RLS",
  fileContains(
    "supabase/migrations/20261007000001_admissions_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.academic_programs",
    "CREATE TABLE IF NOT EXISTS public.admission_applications",
    "CREATE TABLE IF NOT EXISTS public.seat_allotment_dockets",
    "CREATE TABLE IF NOT EXISTS public.campus_tour_bookings",
    "ALTER TABLE public.academic_programs ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.admission_applications ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.seat_allotment_dockets ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.campus_tour_bookings ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "ProgramDegreeLevel, AdmissionApplicationStatus, QuotaCategory, CounselingRound exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type ProgramDegreeLevel",
    "export type AdmissionApplicationStatus",
    "export type QuotaCategory",
    "export type CounselingRound",
    "export type CampusTourMode"
  )
);
check(
  "AcademicProgram, AdmissionApplication, SeatAllotmentDocket, CampusTourBooking exported",
  fileContains(
    "src/types/index.ts",
    "export interface AcademicProgram",
    "export interface AdmissionApplication",
    "export interface SeatAllotmentDocket",
    "export interface CampusTourBooking",
    "export interface AdmissionsOverviewStats"
  )
);

// 3. Engine & Mock Data
console.log("\n⚙️  Admissions Engine & Seeds");
check(
  "admissions-engine.ts exists with generators and mock datasets",
  fileExists("src/lib/admissions/admissions-engine.ts") &&
    fileContains(
      "src/lib/admissions/admissions-engine.ts",
      "export function generateApplicationNumber",
      "export function generateAllotmentNumber",
      "export function generateTourBookingCode",
      "export function generateProvisionalOfferLetterId",
      "export function calculateAdmissionsOverview",
      "export const MOCK_ACADEMIC_PROGRAMS",
      "export const MOCK_ADMISSION_APPLICATIONS",
      "export const MOCK_SEAT_ALLOTMENTS",
      "export const MOCK_TOUR_BOOKINGS"
    )
);

// 4. API Endpoints
console.log("\n🌐 API Endpoints");
check(
  "GET & POST /api/admissions/programs degree curricula",
  fileExists("src/app/api/admissions/programs/route.ts") &&
    fileContains(
      "src/app/api/admissions/programs/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "GET & POST /api/admissions/applications online registration",
  fileExists("src/app/api/admissions/applications/route.ts") &&
    fileContains(
      "src/app/api/admissions/applications/route.ts",
      "export async function GET",
      "export async function POST",
      "generateApplicationNumber"
    )
);
check(
  "GET & POST /api/admissions/allotments merit counseling dockets",
  fileExists("src/app/api/admissions/allotments/route.ts") &&
    fileContains(
      "src/app/api/admissions/allotments/route.ts",
      "export async function GET",
      "export async function POST",
      "generateAllotmentNumber"
    )
);
check(
  "GET & POST /api/admissions/tours campus visits & counselor desk",
  fileExists("src/app/api/admissions/tours/route.ts") &&
    fileContains(
      "src/app/api/admissions/tours/route.ts",
      "export async function GET",
      "export async function POST",
      "generateTourBookingCode"
    )
);

// 5. UI Components & Portal
console.log("\n🎨 UI Components & Portal");
check(
  "ProgramCard and SeatAllotmentCard components exist",
  fileExists("src/components/admissions/program-card.tsx") &&
    fileExists("src/components/admissions/seat-allotment-card.tsx")
);
check(
  "ApplyProgramModal and BookTourModal components exist",
  fileExists("src/components/admissions/apply-program-modal.tsx") &&
    fileExists("src/components/admissions/book-tour-modal.tsx")
);
check(
  "Admissions Portal page exists at /admissions",
  fileExists("src/app/admissions/page.tsx") &&
    fileContains(
      "src/app/admissions/page.tsx",
      "AdmissionsPortalPage",
      "ProgramCard",
      "SeatAllotmentCard"
    )
);

// 6. Navigation Integration
console.log("\n🧭 Navigation Integration");
check(
  "Sidebar links to /admissions with Phase 42 badge",
  fileContains("src/components/layout/sidebar.tsx", 'href: "/admissions"', "Phase 42")
);
check(
  "QuickActions includes Admissions & Enrollment item",
  fileContains("src/components/dashboard/quick-actions.tsx", 'href: "/admissions"', "Phase 42")
);
check(
  "Command Palette includes Admissions item",
  fileContains("src/components/layout/command-palette.tsx", 'href: "/admissions"')
);

console.log("\n" + "═".repeat(60));
console.log(`Total checks: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 Phase 42 Smart Campus Admissions & Enrollment verification passed 100%!\n");
}
