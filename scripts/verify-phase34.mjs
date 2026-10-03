#!/usr/bin/env node
/**
 * CampusLens AI — Phase 34 Verification Suite
 * Automated test: Campus Security, Visitor Passes, RFID Turnstiles & AI Lost & Found
 * Run: node scripts/verify-phase34.mjs
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

console.log("\n🛡️  CampusLens AI — Phase 34 Verification: Campus Security & Command Hub\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "Security schema migration file exists",
  fileExists("supabase/migrations/20261003000003_security_schema.sql")
);
check(
  "security_visitor_passes table defined with pass code, entry gate, and purpose",
  fileContains(
    "supabase/migrations/20261003000003_security_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.security_visitor_passes",
    "pass_code TEXT NOT NULL UNIQUE",
    "visiting_purpose TEXT NOT NULL",
    "entry_gate TEXT NOT NULL"
  )
);
check(
  "turnstile logs, lost & found, patrol checkpoints defined with RLS",
  fileContains(
    "supabase/migrations/20261003000003_security_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.turnstile_access_logs",
    "CREATE TABLE IF NOT EXISTS public.lost_and_found_items",
    "CREATE TABLE IF NOT EXISTS public.campus_patrol_checkpoints",
    "ALTER TABLE public.security_visitor_passes ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.turnstile_access_logs ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.lost_and_found_items ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.campus_patrol_checkpoints ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "VisitingPurpose, VisitorPassStatus, LostFoundCategory exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type VisitingPurpose",
    "export type VisitorPassStatus",
    "export type LostFoundCategory"
  )
);
check(
  "VisitorPass, TurnstileLog, LostAndFoundItem, PatrolCheckpoint exported",
  fileContains(
    "src/types/index.ts",
    "export interface VisitorPass",
    "export interface TurnstileLog",
    "export interface LostAndFoundItem",
    "export interface PatrolCheckpoint",
    "export interface SecurityOverviewStats"
  )
);

// 3. Engine & Mock Data
console.log("\n⚙️  Security Engine & Seeds");
check(
  "security-engine.ts exists with generators and mock data",
  fileExists("src/lib/security-hub/security-engine.ts") &&
    fileContains(
      "src/lib/security-hub/security-engine.ts",
      "export function generateVisitorPassCode",
      "export function generateLostItemCode",
      "export function calculateSecurityOverview",
      "export const MOCK_VISITOR_PASSES",
      "export const MOCK_TURNSTILE_LOGS",
      "export const MOCK_LOST_ITEMS",
      "export const MOCK_PATROLS"
    )
);

// 4. API Endpoints
console.log("\n🌐 API Endpoints");
check(
  "GET & POST /api/security-hub/visitors pre-registration pass",
  fileExists("src/app/api/security-hub/visitors/route.ts") &&
    fileContains(
      "src/app/api/security-hub/visitors/route.ts",
      "export async function GET",
      "export async function POST",
      "generateVisitorPassCode"
    )
);
check(
  "GET & POST /api/security-hub/turnstiles RFID tap stream",
  fileExists("src/app/api/security-hub/turnstiles/route.ts") &&
    fileContains(
      "src/app/api/security-hub/turnstiles/route.ts",
      "export async function GET",
      "export async function POST",
      "checkpointName"
    )
);
check(
  "GET & POST /api/security-hub/lost-found item catalog & claim",
  fileExists("src/app/api/security-hub/lost-found/route.ts") &&
    fileContains(
      "src/app/api/security-hub/lost-found/route.ts",
      "export async function GET",
      "export async function POST",
      "generateLostItemCode"
    )
);
check(
  "GET & POST /api/security-hub/patrols checkpoint telemetry",
  fileExists("src/app/api/security-hub/patrols/route.ts") &&
    fileContains(
      "src/app/api/security-hub/patrols/route.ts",
      "export async function GET",
      "export async function POST",
      "checkpointMarker"
    )
);

// 5. UI Components & Pages
console.log("\n🎨 UI Components & Portal");
check(
  "VisitorPassCard and LostFoundItemCard components exist",
  fileExists("src/components/security-hub/visitor-pass-card.tsx") &&
    fileExists("src/components/security-hub/lost-found-item-card.tsx")
);
check(
  "VisitorRequestModal and ReportLostItemModal components exist",
  fileExists("src/components/security-hub/visitor-request-modal.tsx") &&
    fileExists("src/components/security-hub/report-lost-item-modal.tsx")
);
check(
  "Security Hub Portal page exists at /security-hub",
  fileExists("src/app/security-hub/page.tsx") &&
    fileContains("src/app/security-hub/page.tsx", "SecurityHubPortalPage", "VisitorRequestModal", "ReportLostItemModal")
);

// 6. Navigation Integration
console.log("\n🧭 Navigation Integration");
check(
  "Sidebar links to /security-hub with Phase 34 badge",
  fileContains("src/components/layout/sidebar.tsx", 'href: "/security-hub"', "Phase 34")
);
check(
  "QuickActions includes Security Command Hub item",
  fileContains("src/components/dashboard/quick-actions.tsx", 'href: "/security-hub"', "Phase 34")
);
check(
  "Command Palette includes Security Hub item",
  fileContains("src/components/layout/command-palette.tsx", 'href: "/security-hub"')
);

console.log("\n" + "═".repeat(60));
console.log(`Total checks: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 Phase 34 Campus Security & Command Hub verification passed 100%!\n");
}
