#!/usr/bin/env node
/**
 * CampusLens AI — Phase 40 Verification Suite
 * Automated test: Smart Campus Cloud Printing, Document Xerox & Thesis Binding Hub
 * Run: node scripts/verify-phase40.mjs
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

console.log("\n🖨️  CampusLens AI — Phase 40 Verification: Cloud Printing & Thesis Binding\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "Cloud printing schema migration file exists",
  fileExists("supabase/migrations/20261005000003_printing_schema.sql")
);
check(
  "print_stations, student_print_wallets, print_jobs, thesis_binding_orders defined with RLS",
  fileContains(
    "supabase/migrations/20261005000003_printing_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.print_stations",
    "CREATE TABLE IF NOT EXISTS public.student_print_wallets",
    "CREATE TABLE IF NOT EXISTS public.print_jobs",
    "CREATE TABLE IF NOT EXISTS public.thesis_binding_orders",
    "ALTER TABLE public.print_stations ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.student_print_wallets ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.print_jobs ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.thesis_binding_orders ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "PrintStationStatus, PrintColorMode, ThesisCoverType exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type PrintStationStatus",
    "export type PrintColorMode",
    "export type ThesisCoverType",
    "export type ThesisBindingStatus"
  )
);
check(
  "PrintStation, StudentPrintWallet, PrintJob, ThesisBindingOrder exported",
  fileContains(
    "src/types/index.ts",
    "export interface PrintStation",
    "export interface StudentPrintWallet",
    "export interface PrintJob",
    "export interface ThesisBindingOrder",
    "export interface PrintingOverviewStats"
  )
);

// 3. Engine & Mock Data
console.log("\n⚙️  Printing Engine & Seeds");
check(
  "printing-engine.ts exists with generators and mock datasets",
  fileExists("src/lib/printing/printing-engine.ts") &&
    fileContains(
      "src/lib/printing/printing-engine.ts",
      "export function generatePrintJobCode",
      "export function generateThesisBindingCode",
      "export function generateKioskReleasePin",
      "export function calculatePrintingOverview",
      "export const MOCK_PRINT_STATIONS",
      "export const MOCK_STUDENT_PRINT_WALLET",
      "export const MOCK_PRINT_JOBS",
      "export const MOCK_THESIS_BINDING_ORDERS"
    )
);

// 4. API Endpoints
console.log("\n🌐 API Endpoints");
check(
  "GET & POST /api/printing/stations kiosks telemetry",
  fileExists("src/app/api/printing/stations/route.ts") &&
    fileContains(
      "src/app/api/printing/stations/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "GET & POST /api/printing/jobs cloud spooler",
  fileExists("src/app/api/printing/jobs/route.ts") &&
    fileContains(
      "src/app/api/printing/jobs/route.ts",
      "export async function GET",
      "export async function POST",
      "generatePrintJobCode"
    )
);
check(
  "GET & POST /api/printing/thesis hardcover binding",
  fileExists("src/app/api/printing/thesis/route.ts") &&
    fileContains(
      "src/app/api/printing/thesis/route.ts",
      "export async function GET",
      "export async function POST",
      "generateThesisBindingCode"
    )
);
check(
  "GET & POST /api/printing/wallet quotas and balance",
  fileExists("src/app/api/printing/wallet/route.ts") &&
    fileContains(
      "src/app/api/printing/wallet/route.ts",
      "export async function GET",
      "export async function POST"
    )
);

// 5. UI Components & Pages
console.log("\n🎨 UI Components & Portal");
check(
  "PrintStationCard and ThesisBindingCard components exist",
  fileExists("src/components/printing/print-station-card.tsx") &&
    fileExists("src/components/printing/thesis-binding-card.tsx")
);
check(
  "SubmitPrintModal and ThesisBindingModal components exist",
  fileExists("src/components/printing/submit-print-modal.tsx") &&
    fileExists("src/components/printing/thesis-binding-modal.tsx")
);
check(
  "Printing Portal page exists at /printing",
  fileExists("src/app/printing/page.tsx") &&
    fileContains(
      "src/app/printing/page.tsx",
      "PrintingPortalPage",
      "PrintStationCard",
      "SubmitPrintModal"
    )
);

// 6. Navigation Integration
console.log("\n🧭 Navigation Integration");
check(
  "Sidebar links to /printing with Phase 40 badge",
  fileContains("src/components/layout/sidebar.tsx", 'href: "/printing"', "Phase 40")
);
check(
  "QuickActions includes Printing & Thesis Binding item",
  fileContains("src/components/dashboard/quick-actions.tsx", 'href: "/printing"', "Phase 40")
);
check(
  "Command Palette includes Printing item",
  fileContains("src/components/layout/command-palette.tsx", 'href: "/printing"')
);

console.log("\n" + "═".repeat(60));
console.log(`Total checks: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 Phase 40 Smart Cloud Printing & Thesis Binding verification passed 100%!\n");
}
