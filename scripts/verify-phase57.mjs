#!/usr/bin/env node
/**
 * CampusLens AI — Phase 57 Verification Suite
 * Automated test: Smart Campus SAMARTH eGov Suite & Enterprise ERP Integration Gateway
 * Run: node scripts/verify-phase57.mjs
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

console.log("\n🏛️  CampusLens AI — Phase 57 Verification: SAMARTH eGov Suite & Enterprise ERP Gateway\n");
console.log("═".repeat(65));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "SAMARTH eGov gateway schema migration file exists",
  fileExists("supabase/migrations/20261022000001_samarth_egov_gateway_schema.sql")
);
check(
  "samarth_instances, samarth_modules, samarth_sync_logs, samarth_cas_applications, samarth_student_onboardings defined with RLS",
  fileContains(
    "supabase/migrations/20261022000001_samarth_egov_gateway_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.samarth_instances",
    "CREATE TABLE IF NOT EXISTS public.samarth_modules",
    "CREATE TABLE IF NOT EXISTS public.samarth_sync_logs",
    "CREATE TABLE IF NOT EXISTS public.samarth_cas_applications",
    "CREATE TABLE IF NOT EXISTS public.samarth_student_onboardings",
    "ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Domain Definitions
console.log("\n🔷 TypeScript Domain Definitions");
check(
  "SamarthDeploymentStatus, SamarthModuleCategory, SamarthSyncDirection, SamarthSyncStatus, SamarthCasStage, SamarthCasStatus, SamarthOnboardingStatus exported",
  fileContains(
    "src/types/index.ts",
    "export type SamarthDeploymentStatus",
    "export type SamarthModuleCategory",
    "export type SamarthSyncDirection",
    "export type SamarthSyncStatus",
    "export type SamarthCasStage",
    "export type SamarthCasStatus",
    "export type SamarthOnboardingStatus"
  )
);
check(
  "SamarthInstance, SamarthModule, SamarthSyncLog, SamarthCasApplication, SamarthStudentOnboarding, SamarthSummaryStats exported",
  fileContains(
    "src/types/index.ts",
    "export interface SamarthInstance",
    "export interface SamarthModule",
    "export interface SamarthSyncLog",
    "export interface SamarthCasApplication",
    "export interface SamarthStudentOnboarding",
    "export interface SamarthSummaryStats"
  )
);

// 3. SAMARTH Domain Engine & Computations
console.log("\n⚙️  SAMARTH Domain Engine & Computations");
check("samarth-engine.ts exists", fileExists("src/lib/samarth/samarth-engine.ts"));
check(
  "Token generators and store operations implemented",
  fileContains(
    "src/lib/samarth/samarth-engine.ts",
    "generateSamarthSyncToken",
    "generateSamarthCasToken",
    "generateSamarthOnboardingToken",
    "generateSamarthSecurityHash",
    "getSamarthInstance",
    "getSamarthModules",
    "getSamarthSyncLogs",
    "getSamarthCasApplications",
    "getSamarthStudentOnboardings",
    "getSamarthSummaryStats",
    "calculateErpSyncSuccessRate",
    "calculateCasApprovalRate",
    "calculateActiveModulesCoverage",
    "calculateStudentOnboardingRate"
  )
);

// 4. API Endpoints
console.log("\n🔌 API Endpoints");
check(
  "GET/PATCH /api/samarth/instance route exists",
  fileExists("src/app/api/samarth/instance/route.ts") &&
    fileContains("src/app/api/samarth/instance/route.ts", "GET", "PATCH")
);
check(
  "GET/POST/PATCH /api/samarth/modules route exists",
  fileExists("src/app/api/samarth/modules/route.ts") &&
    fileContains("src/app/api/samarth/modules/route.ts", "GET", "POST", "PATCH")
);
check(
  "GET/POST /api/samarth/sync-logs route exists",
  fileExists("src/app/api/samarth/sync-logs/route.ts") &&
    fileContains("src/app/api/samarth/sync-logs/route.ts", "GET", "POST")
);
check(
  "GET/POST/PATCH /api/samarth/cas-applications route exists",
  fileExists("src/app/api/samarth/cas-applications/route.ts") &&
    fileContains("src/app/api/samarth/cas-applications/route.ts", "GET", "POST", "PATCH")
);
check(
  "GET/POST/PATCH /api/samarth/onboardings route exists",
  fileExists("src/app/api/samarth/onboardings/route.ts") &&
    fileContains("src/app/api/samarth/onboardings/route.ts", "GET", "POST", "PATCH")
);
check(
  "GET /api/samarth/stats route exists",
  fileExists("src/app/api/samarth/stats/route.ts") &&
    fileContains("src/app/api/samarth/stats/route.ts", "GET")
);

// 5. UI Components
console.log("\n🎨 UI Components");
check(
  "SamarthInstanceBanner component exists",
  fileExists("src/components/samarth/samarth-instance-banner.tsx")
);
check(
  "ModuleCatalogCard component exists",
  fileExists("src/components/samarth/module-catalog-card.tsx")
);
check(
  "SyncTelemetryCard component exists",
  fileExists("src/components/samarth/sync-telemetry-card.tsx")
);
check(
  "CasPromotionLedgerCard component exists",
  fileExists("src/components/samarth/cas-promotion-ledger-card.tsx")
);
check(
  "StudentOnboardingCard component exists",
  fileExists("src/components/samarth/student-onboarding-card.tsx")
);
check(
  "TriggerSyncModal component exists",
  fileExists("src/components/samarth/trigger-sync-modal.tsx")
);
check(
  "SubmitCasModal component exists",
  fileExists("src/components/samarth/submit-cas-modal.tsx")
);
check(
  "Barrel export src/components/samarth/index.ts exists",
  fileExists("src/components/samarth/index.ts") &&
    fileContains(
      "src/components/samarth/index.ts",
      "samarth-instance-banner",
      "module-catalog-card",
      "sync-telemetry-card",
      "cas-promotion-ledger-card",
      "student-onboarding-card"
    )
);

// 6. Dedicated Portal Page
console.log("\n🖥️  Dedicated Portal Page");
check("src/app/samarth/page.tsx route exists", fileExists("src/app/samarth/page.tsx"));
check(
  "SAMARTH portal page contains all tabs and KPIs",
  fileContains(
    "src/app/samarth/page.tsx",
    "Phase 57: Ministry of Education SAMARTH eGov Suite",
    "SAMARTH eGov Suite & Enterprise ERP Integration Gateway",
    "SamarthInstanceBanner",
    "ModuleCatalogCard",
    "SyncTelemetryCard",
    "CasPromotionLedgerCard",
    "StudentOnboardingCard"
  )
);

// 7. Global Navigation & Quick Actions
console.log("\n🧭 Global Navigation & Quick Actions");
check(
  "Sidebar contains SAMARTH eGov ERP with Phase 57 badge",
  fileContains("src/components/layout/sidebar.tsx", "/samarth", "SAMARTH eGov ERP", "Phase 57")
);
check(
  "Quick Actions contains SAMARTH ERP Gateway with Phase 57 badge",
  fileContains("src/components/dashboard/quick-actions.tsx", "/samarth", "SAMARTH ERP Gateway", "Phase 57")
);
check(
  "Command Palette contains SAMARTH navigation item",
  fileContains("src/components/layout/command-palette.tsx", "/samarth", "p-samarth")
);

// Summary
console.log("\n" + "═".repeat(65));
console.log(`Phase 57 Tests Passed: ${passed}`);
console.log(`Phase 57 Tests Failed: ${failed}`);

if (failed > 0) {
  console.log("\n❌ Phase 57 verification FAILED\n");
  process.exit(1);
} else {
  console.log("\n✨ Phase 57: Smart Campus SAMARTH eGov Suite & Enterprise ERP Gateway VERIFIED SUCCESSFULLY!\n");
  process.exit(0);
}
