#!/usr/bin/env node
/**
 * CampusLens AI — Phase 33 Verification Suite
 * Automated test: Campus Incubation, Startup Accelerator & Maker Space
 * Run: node scripts/verify-phase33.mjs
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

console.log("\n🚀  CampusLens AI — Phase 33 Verification: Incubation & Accelerator\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "Incubation schema migration file exists",
  fileExists("supabase/migrations/20261003000002_incubation_schema.sql")
);
check(
  "incubation_ventures table defined with sectors, stages, and valuation",
  fileContains(
    "supabase/migrations/20261003000002_incubation_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.incubation_ventures",
    "sector TEXT NOT NULL CHECK",
    "stage TEXT NOT NULL",
    "valuation_inr BIGINT"
  )
);
check(
  "funding tranches, maker equipment, pitch sessions defined with RLS",
  fileContains(
    "supabase/migrations/20261003000002_incubation_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.venture_funding_tranches",
    "CREATE TABLE IF NOT EXISTS public.maker_space_equipment",
    "CREATE TABLE IF NOT EXISTS public.pitch_sessions",
    "ALTER TABLE public.incubation_ventures ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.venture_funding_tranches ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.maker_space_equipment ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.pitch_sessions ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "VentureSector, VentureStage, VentureStatus exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type VentureSector",
    "export type VentureStage",
    "export type VentureStatus"
  )
);
check(
  "IncubationVenture, VentureFundingTranche, MakerSpaceEquipment, PitchSession exported",
  fileContains(
    "src/types/index.ts",
    "export interface IncubationVenture",
    "export interface VentureFundingTranche",
    "export interface MakerSpaceEquipment",
    "export interface PitchSession",
    "export interface IncubationOverviewStats"
  )
);

// 3. Engine & Mock Data
console.log("\n⚙️  Incubation Engine & Seeds");
check(
  "incubation-engine.ts exists with generators and mock data",
  fileExists("src/lib/incubation/incubation-engine.ts") &&
    fileContains(
      "src/lib/incubation/incubation-engine.ts",
      "export function generatePitchSessionCode",
      "export function calculateIncubationOverview",
      "export const MOCK_VENTURES",
      "export const MOCK_FUNDING_TRANCHES",
      "export const MOCK_MAKER_EQUIPMENT",
      "export const MOCK_PITCHES"
    )
);

// 4. API Endpoints
console.log("\n🌐 API Endpoints");
check(
  "GET & POST /api/incubation/ventures founder application",
  fileExists("src/app/api/incubation/ventures/route.ts") &&
    fileContains(
      "src/app/api/incubation/ventures/route.ts",
      "export async function GET",
      "export async function POST",
      "containsSQLInjection"
    )
);
check(
  "GET & POST /api/incubation/funding tranche grant ledger",
  fileExists("src/app/api/incubation/funding/route.ts") &&
    fileContains(
      "src/app/api/incubation/funding/route.ts",
      "export async function GET",
      "export async function POST",
      "totalDisbursedInr"
    )
);
check(
  "GET & POST /api/incubation/makerspace workbench reservation",
  fileExists("src/app/api/incubation/makerspace/route.ts") &&
    fileContains(
      "src/app/api/incubation/makerspace/route.ts",
      "export async function GET",
      "export async function POST",
      "MS-SLOT-2026-"
    )
);
check(
  "GET & POST /api/incubation/pitches angel demo day session",
  fileExists("src/app/api/incubation/pitches/route.ts") &&
    fileContains(
      "src/app/api/incubation/pitches/route.ts",
      "export async function GET",
      "export async function POST",
      "generatePitchSessionCode"
    )
);

// 5. UI Components & Pages
console.log("\n🎨 UI Components & Portal");
check(
  "VenturePortfolioCard and MakerEquipmentCard components exist",
  fileExists("src/components/incubation/venture-portfolio-card.tsx") &&
    fileExists("src/components/incubation/maker-equipment-card.tsx")
);
check(
  "FounderApplicationModal and PitchBookingModal components exist",
  fileExists("src/components/incubation/founder-application-modal.tsx") &&
    fileExists("src/components/incubation/pitch-booking-modal.tsx")
);
check(
  "Incubation Portal page exists at /incubation",
  fileExists("src/app/incubation/page.tsx") &&
    fileContains("src/app/incubation/page.tsx", "IncubationPortalPage", "FounderApplicationModal", "PitchBookingModal")
);

// 6. Navigation Integration
console.log("\n🧭 Navigation Integration");
check(
  "Sidebar links to /incubation with Phase 33 badge",
  fileContains("src/components/layout/sidebar.tsx", 'href: "/incubation"', "Phase 33")
);
check(
  "QuickActions includes Startup Accelerator item",
  fileContains("src/components/dashboard/quick-actions.tsx", 'href: "/incubation"', "Phase 33")
);
check(
  "Command Palette includes Startup Foundry item",
  fileContains("src/components/layout/command-palette.tsx", 'href: "/incubation"')
);

console.log("\n" + "═".repeat(60));
console.log(`Total checks: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 Phase 33 Incubation & Accelerator verification passed 100%!\n");
}
