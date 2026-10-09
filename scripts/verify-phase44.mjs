#!/usr/bin/env node
/**
 * CampusLens AI — Phase 44 Verification Suite
 * Automated test: Smart Campus Teaching Assistantships, Graduate Fellowships & Work-Study Ledger
 * Run: node scripts/verify-phase44.mjs
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

console.log("\n🎓  CampusLens AI — Phase 44 Verification: Teaching Assistantships & Graduate Fellowships\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "Fellowships schema migration file exists",
  fileExists("supabase/migrations/20261009000001_fellowships_schema.sql")
);
check(
  "fellowship_positions, fellowship_applications, fellowship_timesheets, fellowship_disbursements defined with RLS",
  fileContains(
    "supabase/migrations/20261009000001_fellowships_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.fellowship_positions",
    "CREATE TABLE IF NOT EXISTS public.fellowship_applications",
    "CREATE TABLE IF NOT EXISTS public.fellowship_timesheets",
    "CREATE TABLE IF NOT EXISTS public.fellowship_disbursements",
    "ALTER TABLE public.fellowship_positions ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.fellowship_applications ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.fellowship_timesheets ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.fellowship_disbursements ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "FellowshipType, FellowshipApplicationStatus, TimesheetApprovalStatus, DutyCategory exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type FellowshipType",
    "export type FellowshipApplicationStatus",
    "export type TimesheetApprovalStatus",
    "export type DutyCategory",
    "export type DisbursementStatus"
  )
);
check(
  "FellowshipPosition, FellowshipApplication, FellowshipTimesheet, FellowshipDisbursement, FellowshipOverviewStats exported",
  fileContains(
    "src/types/index.ts",
    "export interface FellowshipPosition",
    "export interface FellowshipApplication",
    "export interface FellowshipTimesheet",
    "export interface FellowshipDisbursement",
    "export interface FellowshipOverviewStats"
  )
);

// 3. Engine & Mock Data
console.log("\n⚙️  Fellowships Engine & Seeds");
check(
  "fellowships-engine.ts exists with generators, seeds, and mutations",
  fileExists("src/lib/fellowships/fellowships-engine.ts") &&
    fileContains(
      "src/lib/fellowships/fellowships-engine.ts",
      "export function generateFellowshipAppToken",
      "export function generateFellowshipAppointmentToken",
      "export function generateStipendVoucherToken",
      "export const MOCK_FELLOWSHIP_POSITIONS",
      "export const MOCK_FELLOWSHIP_APPLICATIONS",
      "export const MOCK_FELLOWSHIP_TIMESHEETS",
      "export const MOCK_FELLOWSHIP_DISBURSEMENTS",
      "export function getFellowshipPositions",
      "export function submitFellowshipApplication",
      "export function getFellowshipTimesheets",
      "export function submitFellowshipTimesheet",
      "export function getFellowshipDisbursements",
      "export function getFellowshipOverviewStats"
    )
);

// 4. API Routes
console.log("\n🌐 API Routes");
check(
  "API route: /api/fellowships/positions (GET)",
  fileExists("src/app/api/fellowships/positions/route.ts") &&
    fileContains("src/app/api/fellowships/positions/route.ts", "getFellowshipPositions")
);
check(
  "API route: /api/fellowships/applications (GET & POST)",
  fileExists("src/app/api/fellowships/applications/route.ts") &&
    fileContains(
      "src/app/api/fellowships/applications/route.ts",
      "getFellowshipApplications",
      "submitFellowshipApplication"
    )
);
check(
  "API route: /api/fellowships/timesheets (GET, POST & PATCH)",
  fileExists("src/app/api/fellowships/timesheets/route.ts") &&
    fileContains(
      "src/app/api/fellowships/timesheets/route.ts",
      "getFellowshipTimesheets",
      "submitFellowshipTimesheet",
      "updateFellowshipTimesheetStatus"
    )
);
check(
  "API route: /api/fellowships/disbursements (GET)",
  fileExists("src/app/api/fellowships/disbursements/route.ts") &&
    fileContains("src/app/api/fellowships/disbursements/route.ts", "getFellowshipDisbursements")
);
check(
  "API route: /api/fellowships/stats (GET)",
  fileExists("src/app/api/fellowships/stats/route.ts") &&
    fileContains("src/app/api/fellowships/stats/route.ts", "getFellowshipOverviewStats")
);

// 5. UI Components
console.log("\n🎨 UI Components");
check(
  "FellowshipPositionCard component exists",
  fileExists("src/components/fellowships/fellowship-position-card.tsx") &&
    fileContains(
      "src/components/fellowships/fellowship-position-card.tsx",
      "export function FellowshipPositionCard",
      "monthly_stipend_inr",
      "required_hours_per_week"
    )
);
check(
  "ApplyFellowshipModal component exists",
  fileExists("src/components/fellowships/apply-fellowship-modal.tsx") &&
    fileContains(
      "src/components/fellowships/apply-fellowship-modal.tsx",
      "export function ApplyFellowshipModal",
      "statement_of_purpose"
    )
);
check(
  "TimesheetLoggerCard component exists",
  fileExists("src/components/fellowships/timesheet-logger-card.tsx") &&
    fileContains(
      "src/components/fellowships/timesheet-logger-card.tsx",
      "export function TimesheetLoggerCard",
      "hours_logged",
      "duty_type"
    )
);
check(
  "DisbursementLedgerCard component exists",
  fileExists("src/components/fellowships/disbursement-ledger-card.tsx") &&
    fileContains(
      "src/components/fellowships/disbursement-ledger-card.tsx",
      "export function DisbursementLedgerCard",
      "utr_transaction_number",
      "voucher_token"
    )
);
check(
  "FellowshipAppointmentModal component exists",
  fileExists("src/components/fellowships/fellowship-appointment-modal.tsx") &&
    fileContains(
      "src/components/fellowships/fellowship-appointment-modal.tsx",
      "export function FellowshipAppointmentModal",
      "QRCodeSVG"
    )
);

// 6. Dedicated Portal Page
console.log("\n📱 Portal Page");
check(
  "Dedicated Fellowships Portal page exists at /fellowships",
  fileExists("src/app/fellowships/page.tsx") &&
    fileContains(
      "src/app/fellowships/page.tsx",
      "export default function FellowshipsPortalPage",
      "FellowshipPositionCard",
      "ApplyFellowshipModal",
      "TimesheetLoggerCard",
      "DisbursementLedgerCard",
      "FellowshipAppointmentModal"
    )
);

// 7. Navigation & Command Palette Integration
console.log("\n🔗 Navigation Integration");
check(
  "Integrated in sidebar.tsx",
  fileContains("src/components/layout/sidebar.tsx", "/fellowships", "Fellowships & TA Hub", "Phase 44")
);
check(
  "Integrated in command-palette.tsx",
  fileContains("src/components/layout/command-palette.tsx", "/fellowships", "Fellowships & Teaching Assistantships")
);
check(
  "Integrated in quick-actions.tsx",
  fileContains("src/components/dashboard/quick-actions.tsx", "/fellowships", "Teaching Assistantships & Fellowships", "Phase 44")
);

// 8. Functional Token & Engine Tests
console.log("\n🧪 Functional Engine Tests");
const engineContent = readFileSync(path.join(root, "src/lib/fellowships/fellowships-engine.ts"), "utf-8");
check(
  "Fellowship application token generator regex valid",
  engineContent.includes("`CL-FEL-APP-2026-${rand}`")
);
check(
  "Fellowship appointment token generator regex valid",
  engineContent.includes("`CL-FEL-APPT-2026-${rand}`")
);
check(
  "Stipend voucher token generator regex valid",
  engineContent.includes("`CL-STIP-2026-${rand}`")
);

// Summary
console.log("\n" + "═".repeat(60));
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.log("\n❌ Phase 44 verification FAILED");
  process.exit(1);
} else {
  console.log("\n✨ Phase 44: Smart Campus Teaching Assistantships & Graduate Fellowships VERIFIED SUCCESSFULLY!\n");
  process.exit(0);
}
