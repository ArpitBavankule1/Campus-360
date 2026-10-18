#!/usr/bin/env node
/**
 * CampusLens AI — Phase 53 Verification Suite
 * Automated test: Smart Campus UGC Autonomous College Governance, Statutory Academic Council & 2(f)/12(B) Regulations Gateway
 * Run: node scripts/verify-phase53.mjs
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

console.log("\n🏛️  CampusLens AI — Phase 53 Verification: UGC Autonomous College Governance & 2(f)/12(B) Gateway\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "UGC autonomous governance schema migration file exists",
  fileExists("supabase/migrations/20261018000001_ugc_autonomous_governance_schema.sql")
);
check(
  "ugc_statutory_councils, ugc_curriculum_revisions, ugc_autonomy_reviews, ugc_grants_utilization, ugc_compliance_dossiers defined with RLS",
  fileContains(
    "supabase/migrations/20261018000001_ugc_autonomous_governance_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.ugc_statutory_councils",
    "CREATE TABLE IF NOT EXISTS public.ugc_curriculum_revisions",
    "CREATE TABLE IF NOT EXISTS public.ugc_autonomy_reviews",
    "CREATE TABLE IF NOT EXISTS public.ugc_grants_utilization",
    "CREATE TABLE IF NOT EXISTS public.ugc_compliance_dossiers",
    "ALTER TABLE public.ugc_statutory_councils ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.ugc_curriculum_revisions ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.ugc_autonomy_reviews ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.ugc_grants_utilization ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.ugc_compliance_dossiers ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🔷 TypeScript Domain Definitions");
check(
  "UgcCouncilType, UgcCurriculumRevisionType, UgcRevisionStatus, UgcSectionStatus, UgcInspectionOutcome, UgcUcStatus exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type UgcCouncilType",
    "export type UgcCurriculumRevisionType",
    "export type UgcRevisionStatus",
    "export type UgcSectionStatus",
    "export type UgcInspectionOutcome",
    "export type UgcUcStatus",
    "export type UgcDossierType"
  )
);
check(
  "UgcStatutoryCouncil, UgcCurriculumRevision, UgcAutonomyReview, UgcGrantUtilization, UgcComplianceDossier, UgcComplianceSummaryStats exported",
  fileContains(
    "src/types/index.ts",
    "export interface UgcStatutoryCouncil",
    "export interface UgcCurriculumRevision",
    "export interface UgcAutonomyReview",
    "export interface UgcGrantUtilization",
    "export interface UgcComplianceDossier",
    "export interface UgcComplianceSummaryStats"
  )
);

// 3. Engine & Computational Helpers
console.log("\n⚙️  UGC Autonomous Governance Domain Engine & Computations");
check(
  "ugc-engine.ts exists",
  fileExists("src/lib/ugc/ugc-engine.ts")
);
check(
  "Token generators and store operations implemented",
  fileContains(
    "src/lib/ugc/ugc-engine.ts",
    "generateUgcResolutionToken",
    "generateCurriculumDocketToken",
    "generateAutonomyReviewToken",
    "generateUcCertificateToken",
    "generateUgcDigitalSealHash",
    "ugcAutonomousStore"
  )
);

// 4. API Endpoints
console.log("\n🔌 API Endpoints");
check(
  "GET/POST/PATCH /api/ugc/councils route exists",
  fileExists("src/app/api/ugc/councils/route.ts") &&
    fileContains("src/app/api/ugc/councils/route.ts", "export async function GET", "export async function POST", "export async function PATCH")
);
check(
  "GET/POST /api/ugc/curriculum route exists",
  fileExists("src/app/api/ugc/curriculum/route.ts") &&
    fileContains("src/app/api/ugc/curriculum/route.ts", "export async function GET", "export async function POST")
);
check(
  "GET /api/ugc/reviews route exists",
  fileExists("src/app/api/ugc/reviews/route.ts") &&
    fileContains("src/app/api/ugc/reviews/route.ts", "export async function GET")
);
check(
  "GET/POST /api/ugc/grants route exists",
  fileExists("src/app/api/ugc/grants/route.ts") &&
    fileContains("src/app/api/ugc/grants/route.ts", "export async function GET", "export async function POST")
);
check(
  "GET/POST /api/ugc/dossiers route exists",
  fileExists("src/app/api/ugc/dossiers/route.ts") &&
    fileContains("src/app/api/ugc/dossiers/route.ts", "export async function GET", "export async function POST")
);
check(
  "GET /api/ugc/stats route exists",
  fileExists("src/app/api/ugc/stats/route.ts") &&
    fileContains("src/app/api/ugc/stats/route.ts", "export async function GET")
);

// 5. UI Components
console.log("\n🎨 UI Components");
check(
  "StatutoryBodyCard component exists",
  fileExists("src/components/ugc/statutory-body-card.tsx")
);
check(
  "CurriculumRevisionCard component exists",
  fileExists("src/components/ugc/curriculum-revision-card.tsx")
);
check(
  "AutonomyReviewCard component exists",
  fileExists("src/components/ugc/autonomy-review-card.tsx")
);
check(
  "GrantUtilizationCard component exists",
  fileExists("src/components/ugc/grant-utilization-card.tsx")
);
check(
  "UgcComplianceDossierCard component exists",
  fileExists("src/components/ugc/ugc-compliance-dossier-card.tsx")
);
check(
  "ScheduleCouncilMeetingModal component exists",
  fileExists("src/components/ugc/schedule-council-meeting-modal.tsx")
);
check(
  "SubmitCurriculumProposalModal component exists",
  fileExists("src/components/ugc/submit-curriculum-proposal-modal.tsx")
);
check(
  "Barrel export src/components/ugc/index.ts exists",
  fileExists("src/components/ugc/index.ts")
);

// 6. Dedicated Portal Page
console.log("\n🖥️  Dedicated Portal Page");
check(
  "/ugc page route exists",
  fileExists("src/app/ugc/page.tsx")
);
check(
  "UGC portal page contains all tabs and KPIs",
  fileContains(
    "src/app/ugc/page.tsx",
    "UGC Autonomous College Governance & 2(f)/12(B) Gateway",
    "Phase 53: UGC Autonomous College Regulations & Statutes",
    "StatutoryBodyCard",
    "CurriculumRevisionCard",
    "AutonomyReviewCard",
    "GrantUtilizationCard",
    "UgcComplianceDossierCard",
    "ScheduleCouncilMeetingModal",
    "SubmitCurriculumProposalModal"
  )
);

// 7. Global Navigation & Command Palette Integration
console.log("\n🧭 Global Navigation & Quick Actions");
check(
  "Sidebar contains UGC Autonomous Governance with Phase 53 badge",
  fileContains("src/components/layout/sidebar.tsx", "/ugc", "UGC Autonomous Governance", "Phase 53")
);
check(
  "Quick Actions contains UGC Autonomous College Governance with Phase 53 badge",
  fileContains("src/components/dashboard/quick-actions.tsx", "/ugc", "UGC Autonomous College Governance", "Phase 53")
);
check(
  "Command Palette contains UGC Autonomous Governance navigation item",
  fileContains("src/components/layout/command-palette.tsx", "/ugc", "p-ugc")
);

// Summary
console.log("\n" + "═".repeat(60));
console.log(`Phase 53 Tests Passed: ${passed}`);
console.log(`Phase 53 Tests Failed: ${failed}`);

if (failed > 0) {
  console.log("\n❌ Phase 53 verification FAILED");
  process.exit(1);
} else {
  console.log("\n✨ Phase 53: Smart Campus UGC Autonomous College Governance & 2(f)/12(B) Gateway VERIFIED SUCCESSFULLY!\n");
  process.exit(0);
}
