#!/usr/bin/env node
/**
 * CampusLens AI — Phase 37 Verification Suite
 * Automated test: Smart Campus Scholarships, Financial Aid & Merit Endowment Ledger
 * Run: node scripts/verify-phase37.mjs
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

console.log("\n🎓  CampusLens AI — Phase 37 Verification: Scholarships & Financial Aid\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "Scholarships schema migration file exists",
  fileExists("supabase/migrations/20261004000003_scholarship_schema.sql")
);
check(
  "scholarship_schemes, applications, disbursements, certificates defined with RLS",
  fileContains(
    "supabase/migrations/20261004000003_scholarship_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.scholarship_schemes",
    "CREATE TABLE IF NOT EXISTS public.scholarship_applications",
    "CREATE TABLE IF NOT EXISTS public.scholarship_disbursements",
    "CREATE TABLE IF NOT EXISTS public.scholarship_certificates",
    "ALTER TABLE public.scholarship_schemes ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.scholarship_applications ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.scholarship_disbursements ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.scholarship_certificates ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "ScholarshipProvider, ScholarshipSchemeStatus, TrancheStatus exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type ScholarshipProvider",
    "export type ScholarshipSchemeStatus",
    "export type TrancheStatus"
  )
);
check(
  "ScholarshipScheme, GrantApplication, DisbursementTranche, ScholarshipCertificate exported",
  fileContains(
    "src/types/index.ts",
    "export interface ScholarshipScheme",
    "export interface GrantApplication",
    "export interface DisbursementTranche",
    "export interface ScholarshipCertificate",
    "export interface ScholarshipOverviewStats"
  )
);

// 3. Engine & Mock Data
console.log("\n⚙️  Scholarship Engine & Seeds");
check(
  "scholarship-engine.ts exists with generators and mock datasets",
  fileExists("src/lib/scholarships/scholarship-engine.ts") &&
    fileContains(
      "src/lib/scholarships/scholarship-engine.ts",
      "export function generateScholarshipAppCode",
      "export function generateTrancheCode",
      "export function generateCertificateCode",
      "export function calculateScholarshipOverview",
      "export const MOCK_SCHOLARSHIP_SCHEMES",
      "export const MOCK_SCHOLARSHIP_APPLICATIONS",
      "export const MOCK_DISBURSEMENTS",
      "export const MOCK_SCHOLARSHIP_CERTIFICATES"
    )
);

// 4. API Endpoints
console.log("\n🌐 API Endpoints");
check(
  "GET & POST /api/scholarships/schemes criteria directory",
  fileExists("src/app/api/scholarships/schemes/route.ts") &&
    fileContains(
      "src/app/api/scholarships/schemes/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "GET & POST /api/scholarships/apply student application pipeline",
  fileExists("src/app/api/scholarships/apply/route.ts") &&
    fileContains(
      "src/app/api/scholarships/apply/route.ts",
      "export async function GET",
      "export async function POST",
      "generateScholarshipAppCode"
    )
);
check(
  "GET & POST /api/scholarships/disbursements DBT tranches ledger",
  fileExists("src/app/api/scholarships/disbursements/route.ts") &&
    fileContains(
      "src/app/api/scholarships/disbursements/route.ts",
      "export async function GET",
      "export async function POST",
      "generateTrancheCode"
    )
);
check(
  "GET & POST /api/scholarships/certificates award certificates",
  fileExists("src/app/api/scholarships/certificates/route.ts") &&
    fileContains(
      "src/app/api/scholarships/certificates/route.ts",
      "export async function GET",
      "export async function POST",
      "generateCertificateCode"
    )
);

// 5. UI Components & Pages
console.log("\n🎨 UI Components & Portal");
check(
  "ScholarshipSchemeCard and AwardDisbursementCard components exist",
  fileExists("src/components/scholarships/scholarship-scheme-card.tsx") &&
    fileExists("src/components/scholarships/award-disbursement-card.tsx")
);
check(
  "ApplyScholarshipModal and VerifyAwardModal components exist",
  fileExists("src/components/scholarships/apply-scholarship-modal.tsx") &&
    fileExists("src/components/scholarships/verify-award-modal.tsx")
);
check(
  "Scholarships Portal page exists at /scholarships",
  fileExists("src/app/scholarships/page.tsx") &&
    fileContains(
      "src/app/scholarships/page.tsx",
      "ScholarshipsPortalPage",
      "ApplyScholarshipModal",
      "VerifyAwardModal"
    )
);

// 6. Navigation Integration
console.log("\n🧭 Navigation Integration");
check(
  "Sidebar links to /scholarships with Phase 37 badge",
  fileContains("src/components/layout/sidebar.tsx", 'href: "/scholarships"', "Phase 37")
);
check(
  "QuickActions includes Scholarships & Financial Aid item",
  fileContains("src/components/dashboard/quick-actions.tsx", 'href: "/scholarships"', "Phase 37")
);
check(
  "Command Palette includes Scholarships item",
  fileContains("src/components/layout/command-palette.tsx", 'href: "/scholarships"')
);

console.log("\n" + "═".repeat(60));
console.log(`Total checks: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 Phase 37 Smart Scholarships & Financial Aid verification passed 100%!\n");
}
