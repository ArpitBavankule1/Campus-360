#!/usr/bin/env node
/**
 * CampusLens AI — Phase 54 Verification Suite
 * Automated test: Smart Campus MoE Institution's Innovation Council (IIC 6.0/7.0), NISP & YUKTI Repository Gateway
 * Run: node scripts/verify-phase54.mjs
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

console.log("\n💡 CampusLens AI — Phase 54 Verification: MoE Innovation Council (IIC), NISP & YUKTI Gateway\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "IIC innovation council schema migration file exists",
  fileExists("supabase/migrations/20261019000001_iic_innovation_council_schema.sql")
);
check(
  "iic_council_members, iic_quarterly_activities, iic_nisp_policies, iic_yukti_innovations, iic_ariia_rankings defined with RLS",
  fileContains(
    "supabase/migrations/20261019000001_iic_innovation_council_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.iic_council_members",
    "CREATE TABLE IF NOT EXISTS public.iic_quarterly_activities",
    "CREATE TABLE IF NOT EXISTS public.iic_nisp_policies",
    "CREATE TABLE IF NOT EXISTS public.iic_yukti_innovations",
    "CREATE TABLE IF NOT EXISTS public.iic_ariia_rankings",
    "ALTER TABLE public.iic_council_members ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.iic_quarterly_activities ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.iic_nisp_policies ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.iic_yukti_innovations ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.iic_ariia_rankings ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🔷 TypeScript Domain Definitions");
check(
  "IicCouncilRole, IicMemberType, IicQuarter, IicActivityCategory, IicActivityStatus, NispPolicyStatus, YuktiInnovationStage exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type IicCouncilRole",
    "export type IicMemberType",
    "export type IicQuarter",
    "export type IicActivityCategory",
    "export type IicActivityStatus",
    "export type NispPolicyStatus",
    "export type YuktiInnovationStage"
  )
);
check(
  "IicCouncilMember, IicQuarterlyActivity, IicNispPolicy, IicYuktiInnovation, IicAriiaRanking, IicPerformanceRating, IicComplianceSummaryStats exported",
  fileContains(
    "src/types/index.ts",
    "export interface IicCouncilMember",
    "export interface IicQuarterlyActivity",
    "export interface IicNispPolicy",
    "export interface IicYuktiInnovation",
    "export interface IicAriiaRanking",
    "export interface IicPerformanceRating",
    "export interface IicComplianceSummaryStats"
  )
);

// 3. Engine & Computational Helpers
console.log("\n⚙️  IIC Domain Engine & Computations");
check(
  "iic-engine.ts exists",
  fileExists("src/lib/iic/iic-engine.ts")
);
check(
  "Token generators and store operations implemented",
  fileContains(
    "src/lib/iic/iic-engine.ts",
    "generateMicActivityToken",
    "generateYuktiToken",
    "generateNispResolutionToken",
    "generateIicCertToken",
    "generateIicDigitalSealHash",
    "getIicSummaryStats"
  )
);

// 4. API Endpoints
console.log("\n🔌 API Endpoints");
check(
  "GET /api/iic/members route exists",
  fileExists("src/app/api/iic/members/route.ts") &&
    fileContains("src/app/api/iic/members/route.ts", "export async function GET")
);
check(
  "GET/POST/PATCH /api/iic/activities route exists",
  fileExists("src/app/api/iic/activities/route.ts") &&
    fileContains(
      "src/app/api/iic/activities/route.ts",
      "export async function GET",
      "export async function POST",
      "export async function PATCH"
    )
);
check(
  "GET /api/iic/nisp route exists",
  fileExists("src/app/api/iic/nisp/route.ts") &&
    fileContains("src/app/api/iic/nisp/route.ts", "export async function GET")
);
check(
  "GET/POST /api/iic/yukti route exists",
  fileExists("src/app/api/iic/yukti/route.ts") &&
    fileContains(
      "src/app/api/iic/yukti/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "GET /api/iic/ariia route exists",
  fileExists("src/app/api/iic/ariia/route.ts") &&
    fileContains("src/app/api/iic/ariia/route.ts", "export async function GET")
);
check(
  "GET /api/iic/stats route exists",
  fileExists("src/app/api/iic/stats/route.ts") &&
    fileContains("src/app/api/iic/stats/route.ts", "export async function GET")
);

// 5. UI Components
console.log("\n🎨 UI Components");
check(
  "CouncilMemberCard component exists",
  fileExists("src/components/iic/council-member-card.tsx")
);
check(
  "QuarterlyActivityCard component exists",
  fileExists("src/components/iic/quarterly-activity-card.tsx")
);
check(
  "NispPolicyCard component exists",
  fileExists("src/components/iic/nisp-policy-card.tsx")
);
check(
  "YuktiInnovationCard component exists",
  fileExists("src/components/iic/yukti-innovation-card.tsx")
);
check(
  "AriiaPerformanceCard component exists",
  fileExists("src/components/iic/ariia-performance-card.tsx")
);
check(
  "SubmitActivityModal component exists",
  fileExists("src/components/iic/submit-activity-modal.tsx")
);
check(
  "SubmitYuktiInnovationModal component exists",
  fileExists("src/components/iic/submit-yukti-innovation-modal.tsx")
);
check(
  "Barrel export src/components/iic/index.ts exists",
  fileExists("src/components/iic/index.ts")
);

// 6. Dedicated Portal Page
console.log("\n🖥️  Dedicated Portal Page");
check(
  "/iic page route exists",
  fileExists("src/app/iic/page.tsx")
);
check(
  "IIC portal page contains all tabs and KPIs",
  fileContains(
    "src/app/iic/page.tsx",
    "Innovation Council (IIC), NISP & YUKTI Gateway",
    "Phase 54: MoE Innovation Cell (MIC) & IIC 7.0",
    "CouncilMemberCard",
    "QuarterlyActivityCard",
    "NispPolicyCard",
    "YuktiInnovationCard",
    "AriiaPerformanceCard",
    "SubmitActivityModal",
    "SubmitYuktiInnovationModal"
  )
);

// 7. Global Navigation & Quick Actions
console.log("\n🧭 Global Navigation & Quick Actions");
check(
  "Sidebar contains MoE Innovation Council (IIC) with Phase 54 badge",
  fileContains("src/components/layout/sidebar.tsx", "/iic", "MoE Innovation Council (IIC)", "Phase 54")
);
check(
  "Quick Actions contains MoE Innovation Council (IIC) with Phase 54 badge",
  fileContains("src/components/dashboard/quick-actions.tsx", "/iic", "MoE Innovation Council (IIC)", "Phase 54")
);
check(
  "Command Palette contains IIC navigation item",
  fileContains("src/components/layout/command-palette.tsx", "/iic", "p-iic")
);

// Summary
console.log("\n" + "═".repeat(60));
console.log(`Phase 54 Tests Passed: ${passed}`);
console.log(`Phase 54 Tests Failed: ${failed}`);

if (failed > 0) {
  console.log("\n❌ Phase 54 verification FAILED");
  process.exit(1);
} else {
  console.log("\n✨ Phase 54: MoE Institution's Innovation Council (IIC), NISP & YUKTI Gateway VERIFIED SUCCESSFULLY!\n");
  process.exit(0);
}
