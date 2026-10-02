#!/usr/bin/env node
/**
 * CampusLens AI — Phase 31 Verification Suite
 * Automated test: Campus Grievance Redressal & Student Ombudsman
 * Run: node scripts/verify-phase31.mjs
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

console.log("\n⚖️  CampusLens AI — Phase 31 Verification: Campus Grievance Redressal & Ombudsman\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "Ombudsman schema migration file exists",
  fileExists("supabase/migrations/20261002000003_ombudsman_schema.sql")
);
check(
  "grievance_cases table defined with tracking hash and statutory categories",
  fileContains(
    "supabase/migrations/20261002000003_ombudsman_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.grievance_cases",
    "tracking_hash TEXT NOT NULL UNIQUE",
    "category TEXT NOT NULL CHECK"
  )
);
check(
  "grievance_committee_members and grievance_hearings defined with RLS",
  fileContains(
    "supabase/migrations/20261002000003_ombudsman_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.grievance_committee_members",
    "CREATE TABLE IF NOT EXISTS public.grievance_hearings",
    "ALTER TABLE public.grievance_committee_members ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.grievance_hearings ENABLE ROW LEVEL SECURITY"
  )
);
check(
  "grievance_resolution_orders table defined with digital seal hash",
  fileContains(
    "supabase/migrations/20261002000003_ombudsman_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.grievance_resolution_orders",
    "order_serial_code TEXT NOT NULL UNIQUE",
    "digital_seal_hash TEXT NOT NULL"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "OmbudsmanCategory, UrgencyLevel, EscalationTier exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type OmbudsmanCategory",
    "export type UrgencyLevel",
    "export type EscalationTier"
  )
);
check(
  "GrievanceCase, OmbudsmanCommitteeMember, GrievanceHearing exported",
  fileContains(
    "src/types/index.ts",
    "export interface GrievanceCase",
    "export interface OmbudsmanCommitteeMember",
    "export interface GrievanceHearing"
  )
);
check(
  "GrievanceResolutionOrder and OmbudsmanOverviewStats exported",
  fileContains(
    "src/types/index.ts",
    "export interface GrievanceResolutionOrder",
    "export interface OmbudsmanOverviewStats"
  )
);
check(
  "Phase 31 tables declared in src/types/database.types.ts",
  fileContains(
    "src/types/database.types.ts",
    "grievance_cases:",
    "grievance_committee_members:",
    "grievance_hearings:",
    "grievance_resolution_orders:"
  )
);

// 3. Engine & Seed Data
console.log("\n⚙️  Ombudsman Engine & Seed Dockets");
check(
  "Ombudsman engine file exists",
  fileExists("src/lib/ombudsman/ombudsman-engine.ts")
);
check(
  "generateZkpTrackingHash and calculateOmbudsmanOverview exported",
  fileContains(
    "src/lib/ombudsman/ombudsman-engine.ts",
    "export function generateZkpTrackingHash",
    "export function calculateOmbudsmanOverview"
  )
);
check(
  "Seed catalogs for cases, committee, hearings, and orders exported",
  fileContains(
    "src/lib/ombudsman/ombudsman-engine.ts",
    "MOCK_GRIEVANCE_CASES",
    "MOCK_COMMITTEE_MEMBERS",
    "MOCK_HEARINGS",
    "MOCK_ORDERS"
  )
);

// 4. API Endpoints
console.log("\n🌐 API Endpoints");
check(
  "Grievance cases API route exists with GET & POST",
  fileExists("src/app/api/ombudsman/cases/route.ts") &&
    fileContains(
      "src/app/api/ombudsman/cases/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "Anti-ragging emergency API route exists with GET & POST",
  fileExists("src/app/api/ombudsman/anti-ragging/route.ts") &&
    fileContains(
      "src/app/api/ombudsman/anti-ragging/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "Hearings docket API route exists with GET & POST",
  fileExists("src/app/api/ombudsman/hearings/route.ts") &&
    fileContains(
      "src/app/api/ombudsman/hearings/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "Resolution orders API route exists with GET & POST",
  fileExists("src/app/api/ombudsman/orders/route.ts") &&
    fileContains(
      "src/app/api/ombudsman/orders/route.ts",
      "export async function GET",
      "export async function POST"
    )
);

// 5. UI Components & Portal View
console.log("\n🎨 UI Components & Portal View");
check(
  "GrievanceCaseCard and AntiRaggingEmergencyBanner components exist",
  fileExists("src/components/ombudsman/grievance-case-card.tsx") &&
    fileExists("src/components/ombudsman/anti-ragging-emergency-banner.tsx")
);
check(
  "AnonymousFilingModal and ResolutionOrderModal components exist",
  fileExists("src/components/ombudsman/anonymous-filing-modal.tsx") &&
    fileExists("src/components/ombudsman/resolution-order-modal.tsx")
);
check(
  "Dedicated /ombudsman portal page exists",
  fileExists("src/app/ombudsman/page.tsx") &&
    fileContains(
      "src/app/ombudsman/page.tsx",
      "OmbudsmanPortalPage",
      "calculateOmbudsmanOverview"
    )
);

// 6. Navigation Shell Integration
console.log("\n🧭 Navigation Shell Integration");
check(
  "Sidebar contains Student Ombudsman link (Phase 31)",
  fileContains(
    "src/components/layout/sidebar.tsx",
    'href: "/ombudsman"',
    'badge: "Phase 31"'
  )
);
check(
  "Quick Actions contains Grievance & Student Ombudsman action item",
  fileContains(
    "src/components/dashboard/quick-actions.tsx",
    'href: "/ombudsman"',
    'badge: "Phase 31"'
  )
);
check(
  "Command Palette contains Student Ombudsman entry",
  fileContains(
    "src/components/layout/command-palette.tsx",
    'href: "/ombudsman"'
  )
);

console.log("\n" + "═".repeat(60));
console.log(`\nPhase 31 Verification Summary: ${passed} Passed, ${failed} Failed\n`);

if (failed > 0) {
  process.exit(1);
}
