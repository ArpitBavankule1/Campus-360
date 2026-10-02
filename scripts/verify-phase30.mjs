#!/usr/bin/env node
/**
 * CampusLens AI — Phase 30 Verification Suite
 * Automated test: Smart Campus Sustainability & Green Energy Ledger
 * Run: node scripts/verify-phase30.mjs
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

console.log("\n🌱  CampusLens AI — Phase 30 Verification: Smart Campus Sustainability & Green Energy\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "Sustainability schema migration file exists",
  fileExists("supabase/migrations/20261002000002_sustainability_schema.sql")
);
check(
  "sustainability_solar_telemetry table defined with array zone and battery level",
  fileContains(
    "supabase/migrations/20261002000002_sustainability_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.sustainability_solar_telemetry",
    "array_zone TEXT NOT NULL CHECK",
    "battery_storage_percent INTEGER"
  )
);
check(
  "sustainability_water_metrics and sustainability_waste_audits defined with RLS",
  fileContains(
    "supabase/migrations/20261002000002_sustainability_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.sustainability_water_metrics",
    "CREATE TABLE IF NOT EXISTS public.sustainability_waste_audits",
    "ALTER TABLE public.sustainability_water_metrics ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.sustainability_waste_audits ENABLE ROW LEVEL SECURITY"
  )
);
check(
  "sustainability_eco_credits table defined with commute mode and certificates",
  fileContains(
    "supabase/migrations/20261002000002_sustainability_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.sustainability_eco_credits",
    "commute_mode TEXT NOT NULL CHECK",
    "certificate_code TEXT NOT NULL UNIQUE"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "SolarArrayZone, CommuteMode exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type SolarArrayZone",
    "export type CommuteMode"
  )
);
check(
  "SolarTelemetry, WaterMetric, WasteAudit, EcoCredit exported",
  fileContains(
    "src/types/index.ts",
    "export interface SolarTelemetry",
    "export interface WaterMetric",
    "export interface WasteAudit",
    "export interface EcoCredit"
  )
);
check(
  "SustainabilityOverviewStats exported",
  fileContains(
    "src/types/index.ts",
    "export interface SustainabilityOverviewStats"
  )
);
check(
  "Phase 30 tables declared in src/types/database.types.ts",
  fileContains(
    "src/types/database.types.ts",
    "sustainability_solar_telemetry:",
    "sustainability_water_metrics:",
    "sustainability_waste_audits:",
    "sustainability_eco_credits:"
  )
);

// 3. Engine & Seed Data
console.log("\n⚙️  Sustainability Engine & Telemetry Logic");
check(
  "Sustainability engine file exists",
  fileExists("src/lib/sustainability/sustainability-engine.ts")
);
check(
  "generateEcoCertificateCode and calculateSustainabilityOverview exported",
  fileContains(
    "src/lib/sustainability/sustainability-engine.ts",
    "export function generateEcoCertificateCode",
    "export function calculateSustainabilityOverview"
  )
);
check(
  "Seed telemetry catalogs for solar, water, waste, and eco-credits exported",
  fileContains(
    "src/lib/sustainability/sustainability-engine.ts",
    "MOCK_SOLAR_TELEMETRY",
    "MOCK_WATER_METRICS",
    "MOCK_WASTE_AUDITS",
    "MOCK_ECO_CREDITS"
  )
);

// 4. API Endpoints
console.log("\n🌐 API Endpoints");
check(
  "Solar telemetry API route exists with GET & POST",
  fileExists("src/app/api/sustainability/solar/route.ts") &&
    fileContains(
      "src/app/api/sustainability/solar/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "Water telemetry API route exists with GET & POST",
  fileExists("src/app/api/sustainability/water/route.ts") &&
    fileContains(
      "src/app/api/sustainability/water/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "Waste audit API route exists with GET & POST",
  fileExists("src/app/api/sustainability/waste/route.ts") &&
    fileContains(
      "src/app/api/sustainability/waste/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "Eco-credits API route exists with GET & POST",
  fileExists("src/app/api/sustainability/eco-credits/route.ts") &&
    fileContains(
      "src/app/api/sustainability/eco-credits/route.ts",
      "export async function GET",
      "export async function POST"
    )
);

// 5. UI Components & Portal View
console.log("\n🎨 UI Components & Portal View");
check(
  "SolarTelemetryGauge and WaterResourceCard components exist",
  fileExists("src/components/sustainability/solar-telemetry-gauge.tsx") &&
    fileExists("src/components/sustainability/water-resource-card.tsx")
);
check(
  "WasteAuditTracker and EcoCreditModal components exist",
  fileExists("src/components/sustainability/waste-audit-tracker.tsx") &&
    fileExists("src/components/sustainability/eco-credit-modal.tsx")
);
check(
  "Dedicated /sustainability portal page exists",
  fileExists("src/app/sustainability/page.tsx") &&
    fileContains(
      "src/app/sustainability/page.tsx",
      "SustainabilityPortalPage",
      "calculateSustainabilityOverview"
    )
);

// 6. Navigation Shell Integration
console.log("\n🧭 Navigation Shell Integration");
check(
  "Sidebar contains Campus Sustainability link (Phase 30)",
  fileContains(
    "src/components/layout/sidebar.tsx",
    'href: "/sustainability"',
    'badge: "Phase 30"'
  )
);
check(
  "Quick Actions contains Campus Sustainability action item",
  fileContains(
    "src/components/dashboard/quick-actions.tsx",
    'href: "/sustainability"',
    'badge: "Phase 30"'
  )
);
check(
  "Command Palette contains Campus Sustainability entry",
  fileContains(
    "src/components/layout/command-palette.tsx",
    'href: "/sustainability"'
  )
);

console.log("\n" + "═".repeat(60));
console.log(`\nPhase 30 Verification Summary: ${passed} Passed, ${failed} Failed\n`);

if (failed > 0) {
  process.exit(1);
}
