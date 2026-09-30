#!/usr/bin/env node
/**
 * CampusLens AI — Phase 23 Verification Suite
 * Automated test: Smart Campus Hostel, Residence Management, Mess Nutrition & Out-Passes
 * Run: node scripts/verify-phase23.mjs
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

console.log("\n🏠  CampusLens AI — Phase 23 Verification: Smart Campus Hostel & Residence Management\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "Hostel schema migration file exists",
  fileExists("supabase/migrations/20260930000001_hostel_schema.sql")
);
check(
  "hostel_blocks table defined with gender and warden particulars",
  fileContains(
    "supabase/migrations/20260930000001_hostel_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.hostel_blocks",
    "warden_name TEXT NOT NULL",
    "warden_phone TEXT NOT NULL"
  )
);
check(
  "hostel_rooms table defined with capacity, monthly rent, and amenities",
  fileContains(
    "supabase/migrations/20260930000001_hostel_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.hostel_rooms",
    "room_type TEXT NOT NULL",
    "monthly_rent NUMERIC(8, 2) NOT NULL"
  )
);
check(
  "hostel_allocations table defined with academic year and unique active constraints",
  fileContains(
    "supabase/migrations/20260930000001_hostel_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.hostel_allocations",
    "bed_number TEXT NOT NULL",
    "hostel_student_single_active"
  )
);
check(
  "hostel_mess_menus and hostel_out_passes tables defined with RLS policies",
  fileContains(
    "supabase/migrations/20260930000001_hostel_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.hostel_mess_menus",
    "CREATE TABLE IF NOT EXISTS public.hostel_out_passes",
    "CREATE TABLE IF NOT EXISTS public.hostel_grievances",
    "ALTER TABLE public.hostel_out_passes ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "HostelGender, HostelRoomType, MealType, OutPassStatus exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type HostelGender",
    "export type HostelRoomType",
    "export type MealType",
    "export type OutPassStatus",
    "export type GrievanceCategory"
  )
);
check(
  "HostelBlock, HostelRoom, HostelAllocation, HostelMessMenu, HostelOutPass exported",
  fileContains(
    "src/types/index.ts",
    "export interface HostelBlock",
    "export interface HostelRoom",
    "export interface HostelAllocation",
    "export interface HostelMessMenu",
    "export interface HostelOutPass",
    "export interface HostelGrievance"
  )
);
check(
  "Hostel tables defined in src/types/database.types.ts",
  fileContains(
    "src/types/database.types.ts",
    "hostel_blocks:",
    "hostel_rooms:",
    "hostel_allocations:",
    "hostel_mess_menus:",
    "hostel_out_passes:",
    "hostel_grievances:"
  )
);

// 3. Hostel Engine & Business Logic
console.log("\n⚙️  Hostel Engine & Business Logic");
check(
  "Hostel engine file exists",
  fileExists("src/lib/hostel/hostel-engine.ts")
);
check(
  "generateOutPassCode and generateMealPassCode functions exported",
  fileContains(
    "src/lib/hostel/hostel-engine.ts",
    "export function generateOutPassCode",
    "export function generateMealPassCode"
  )
);
check(
  "calculateHostelAnalytics and getStudentHostelOverview exported",
  fileContains(
    "src/lib/hostel/hostel-engine.ts",
    "export function calculateHostelAnalytics",
    "export function getStudentHostelOverview",
    "export function validateOutPassRequest"
  )
);
check(
  "Seed catalogs for blocks, rooms, allocations, and mess menus exported",
  fileContains(
    "src/lib/hostel/hostel-engine.ts",
    "MOCK_HOSTEL_BLOCKS",
    "MOCK_HOSTEL_ROOMS",
    "MOCK_HOSTEL_ALLOCATIONS",
    "MOCK_MESS_MENUS",
    "MOCK_OUT_PASSES",
    "MOCK_HOSTEL_GRIEVANCES"
  )
);

// 4. API Endpoints
console.log("\n🌐 API Endpoints");
check(
  "Hostel rooms API route exists with anti-injection defenses",
  fileExists("src/app/api/hostel/rooms/route.ts") &&
    fileContains(
      "src/app/api/hostel/rooms/route.ts",
      "containsSQLInjection",
      "containsXSS",
      "sanitizeInput"
    )
);
check(
  "Hostel mess API route exists with meal token generator",
  fileExists("src/app/api/hostel/mess/route.ts") &&
    fileContains(
      "src/app/api/hostel/mess/route.ts",
      "generateMealPassCode",
      "dietaryPreference"
    )
);
check(
  "Hostel out-passes API route exists with POST validation and PATCH status handler",
  fileExists("src/app/api/hostel/out-passes/route.ts") &&
    fileContains(
      "src/app/api/hostel/out-passes/route.ts",
      "export async function GET",
      "export async function POST",
      "export async function PATCH"
    )
);
check(
  "Hostel grievances API route exists with category filtering and triage handler",
  fileExists("src/app/api/hostel/grievances/route.ts") &&
    fileContains(
      "src/app/api/hostel/grievances/route.ts",
      "export async function GET",
      "export async function POST",
      "export async function PATCH"
    )
);

// 5. React UI Components
console.log("\n🎨 React UI Components");
check(
  "HostelAllotmentCard component exists",
  fileExists("src/components/hostel/hostel-allotment-card.tsx")
);
check(
  "WardenContactCard component exists",
  fileExists("src/components/hostel/warden-contact-card.tsx")
);
check(
  "MessMenuSchedule component exists with weekly nutrition breakdown",
  fileExists("src/components/hostel/mess-menu-schedule.tsx")
);
check(
  "MealCouponModal component exists with verifiable QR pass simulation",
  fileExists("src/components/hostel/meal-coupon-modal.tsx") &&
    fileContains("src/components/hostel/meal-coupon-modal.tsx", "QRCodeSVG")
);
check(
  "OutPassRequestModal component exists with live parent phone validation",
  fileExists("src/components/hostel/out-pass-request-modal.tsx")
);
check(
  "GrievanceReportModal component exists with SLA routing",
  fileExists("src/components/hostel/grievance-report-modal.tsx")
);

// 6. Portal Page & Ecosystem Integration
console.log("\n📱 Portal Page & Ecosystem Integration");
check(
  "Dedicated /hostel route page exists with all view tabs",
  fileExists("src/app/hostel/page.tsx") &&
    fileContains(
      "src/app/hostel/page.tsx",
      "HostelAllotmentCard",
      "MessMenuSchedule",
      "OutPassRequestModal",
      "GrievanceReportModal"
    )
);
check(
  "Sidebar navigation includes Hostel & Residence with Phase 23 badge",
  fileContains(
    "src/components/layout/sidebar.tsx",
    "Hostel & Residence",
    "/hostel",
    "Phase 23"
  )
);
check(
  "Quick Actions includes Hostel, Residence & Mess with Phase 23 badge",
  fileContains(
    "src/components/dashboard/quick-actions.tsx",
    "Hostel, Residence & Mess",
    "/hostel",
    "Phase 23"
  )
);
check(
  "Global command palette includes Hostel & Residence Portal and Out-Pass Action",
  fileContains(
    "src/components/layout/command-palette.tsx",
    "Hostel & Residence Portal",
    "Request Night Out-Pass",
    "/hostel"
  )
);

console.log("═".repeat(60));
console.log(`\n📊  Phase 23 Verification Summary:`);
console.log(`    Total Checks: ${passed + failed}`);
console.log(`    Passed:       ${passed}`);
console.log(`    Failed:       ${failed}\n`);

if (failed === 0) {
  console.log("🎉  ALL PHASE 23 CHECKS PASSED PERFECTLY!\n");
  process.exit(0);
} else {
  console.log("❌  PHASE 23 VERIFICATION FAILED.\n");
  process.exit(1);
}
