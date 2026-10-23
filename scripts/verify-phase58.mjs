#!/usr/bin/env node
/**
 * CampusLens AI — Phase 58 Verification Suite
 * Automated test: Smart Campus PM-USHA (Pradhan Mantri Uchchatar Shiksha Abhiyan),
 * Grants & Institutional Development Gateway
 * Run: node scripts/verify-phase58.mjs
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

console.log("\n🏛️  CampusLens AI — Phase 58 Verification: PM-USHA Grants & Development Gateway\n");
console.log("═".repeat(65));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "PM-USHA gateway schema migration file exists",
  fileExists("supabase/migrations/20261023000001_pm_usha_gateway_schema.sql")
);
check(
  "pm_usha_institutional_profiles, pm_usha_project_proposals, pm_usha_fund_allocations, pm_usha_physical_milestones, pm_usha_utilization_certificates defined with RLS",
  fileContains(
    "supabase/migrations/20261023000001_pm_usha_gateway_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.pm_usha_institutional_profiles",
    "CREATE TABLE IF NOT EXISTS public.pm_usha_project_proposals",
    "CREATE TABLE IF NOT EXISTS public.pm_usha_fund_allocations",
    "CREATE TABLE IF NOT EXISTS public.pm_usha_physical_milestones",
    "CREATE TABLE IF NOT EXISTS public.pm_usha_utilization_certificates",
    "ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Domain Definitions
console.log("\n🔷 TypeScript Domain Definitions");
check(
  "PmUshaCategory, PmUshaComponentType, PmUshaProposalStatus, PmUshaDisbursalStatus, PmUshaMilestoneCategory, PmUshaInspectionStatus, PmUshaUcStatus exported",
  fileContains(
    "src/types/index.ts",
    "export type PmUshaCategory",
    "export type PmUshaComponentType",
    "export type PmUshaProposalStatus",
    "export type PmUshaDisbursalStatus",
    "export type PmUshaMilestoneCategory",
    "export type PmUshaInspectionStatus",
    "export type PmUshaUcStatus"
  )
);
check(
  "PmUshaInstitutionalProfile, PmUshaProjectProposal, PmUshaFundAllocation, PmUshaPhysicalMilestone, PmUshaUtilizationCertificate, PmUshaSummaryStats exported",
  fileContains(
    "src/types/index.ts",
    "export interface PmUshaInstitutionalProfile",
    "export interface PmUshaProjectProposal",
    "export interface PmUshaFundAllocation",
    "export interface PmUshaPhysicalMilestone",
    "export interface PmUshaUtilizationCertificate",
    "export interface PmUshaSummaryStats"
  )
);

// 3. PM-USHA Domain Engine & Computations
console.log("\n⚙️  PM-USHA Domain Engine & Computations");
check("pm-usha-engine.ts exists", fileExists("src/lib/pm-usha/pm-usha-engine.ts"));
check(
  "Token generators and store operations implemented",
  fileContains(
    "src/lib/pm-usha/pm-usha-engine.ts",
    "generatePmUshaProposalCode",
    "generatePmUshaSanctionToken",
    "generatePmUshaMilestoneCode",
    "generatePmUshaUcVerificationHash",
    "getPmUshaProfile",
    "getPmUshaProposals",
    "getPmUshaFundAllocations",
    "getPmUshaMilestones",
    "getPmUshaUtilizationCertificates",
    "getPmUshaSummaryStats",
    "calculateFundUtilizationRate",
    "calculateMilestoneCompletionRate",
    "calculatePfmsComplianceScore",
    "calculateCentralStateDisbursalRatio"
  )
);

// 4. API Endpoints
console.log("\n🔌 API Endpoints");
check(
  "GET/PATCH /api/pm-usha/profile route exists",
  fileExists("src/app/api/pm-usha/profile/route.ts") &&
    fileContains("src/app/api/pm-usha/profile/route.ts", "GET", "PATCH")
);
check(
  "GET/POST/PATCH /api/pm-usha/proposals route exists",
  fileExists("src/app/api/pm-usha/proposals/route.ts") &&
    fileContains("src/app/api/pm-usha/proposals/route.ts", "GET", "POST", "PATCH")
);
check(
  "GET/POST/PATCH /api/pm-usha/allocations route exists",
  fileExists("src/app/api/pm-usha/allocations/route.ts") &&
    fileContains("src/app/api/pm-usha/allocations/route.ts", "GET", "POST", "PATCH")
);
check(
  "GET/POST/PATCH /api/pm-usha/milestones route exists",
  fileExists("src/app/api/pm-usha/milestones/route.ts") &&
    fileContains("src/app/api/pm-usha/milestones/route.ts", "GET", "POST", "PATCH")
);
check(
  "GET/POST/PATCH /api/pm-usha/certificates route exists",
  fileExists("src/app/api/pm-usha/certificates/route.ts") &&
    fileContains("src/app/api/pm-usha/certificates/route.ts", "GET", "POST", "PATCH")
);
check(
  "GET /api/pm-usha/stats route exists",
  fileExists("src/app/api/pm-usha/stats/route.ts") &&
    fileContains("src/app/api/pm-usha/stats/route.ts", "GET")
);

// 5. UI Components
console.log("\n🎨 UI Components");
check(
  "PmUshaProfileBanner component exists",
  fileExists("src/components/pm-usha/pm-usha-profile-banner.tsx")
);
check(
  "ProjectProposalCard component exists",
  fileExists("src/components/pm-usha/project-proposal-card.tsx")
);
check(
  "FundAllocationLedgerCard component exists",
  fileExists("src/components/pm-usha/fund-allocation-ledger-card.tsx")
);
check(
  "PhysicalMilestoneTrackerCard component exists",
  fileExists("src/components/pm-usha/physical-milestone-tracker-card.tsx")
);
check(
  "UtilizationCertificateCard component exists",
  fileExists("src/components/pm-usha/utilization-certificate-card.tsx")
);
check(
  "SubmitProposalModal component exists",
  fileExists("src/components/pm-usha/submit-proposal-modal.tsx")
);
check(
  "SubmitUcModal component exists",
  fileExists("src/components/pm-usha/submit-uc-modal.tsx")
);
check(
  "Barrel export src/components/pm-usha/index.ts exists",
  fileExists("src/components/pm-usha/index.ts") &&
    fileContains(
      "src/components/pm-usha/index.ts",
      "pm-usha-profile-banner",
      "project-proposal-card",
      "fund-allocation-ledger-card",
      "physical-milestone-tracker-card",
      "utilization-certificate-card"
    )
);

// 6. Dedicated Portal Page
console.log("\n🖥️  Dedicated Portal Page");
check("src/app/pm-usha/page.tsx route exists", fileExists("src/app/pm-usha/page.tsx"));
check(
  "PM-USHA portal page contains all tabs and KPIs",
  fileContains(
    "src/app/pm-usha/page.tsx",
    "Phase 58: Ministry of Education PM-USHA",
    "PM-USHA Grants, Infrastructure & Institutional Development Gateway",
    "PmUshaProfileBanner",
    "ProjectProposalCard",
    "FundAllocationLedgerCard",
    "PhysicalMilestoneTrackerCard",
    "UtilizationCertificateCard"
  )
);

// 7. Global Navigation & Quick Actions
console.log("\n🧭 Global Navigation & Quick Actions");
check(
  "Sidebar contains PM-USHA Grants with Phase 58 badge",
  fileContains("src/components/layout/sidebar.tsx", "/pm-usha", "PM-USHA Grants", "Phase 58")
);
check(
  "Quick Actions contains PM-USHA Grants Gateway with Phase 58 badge",
  fileContains("src/components/dashboard/quick-actions.tsx", "/pm-usha", "PM-USHA Grants Gateway", "Phase 58")
);
check(
  "Command Palette contains PM-USHA navigation item",
  fileContains("src/components/layout/command-palette.tsx", "/pm-usha", "p-pm-usha")
);

// Summary
console.log("\n" + "═".repeat(65));
console.log(`Phase 58 Tests Passed: ${passed}`);
console.log(`Phase 58 Tests Failed: ${failed}`);

if (failed > 0) {
  console.log("\n❌ Phase 58 verification FAILED\n");
  process.exit(1);
} else {
  console.log("\n✨ Phase 58: Smart Campus PM-USHA Grants & Institutional Development Gateway VERIFIED SUCCESSFULLY!\n");
  process.exit(0);
}
