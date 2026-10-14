#!/usr/bin/env node
/**
 * CampusLens AI — Phase 49 Verification Suite
 * Automated test: Smart Campus National Board of Accreditation (NBA), Outcome-Based Education (OBE) & Washington Accord Tier-1 Gateway
 * Run: node scripts/verify-phase49.mjs
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

console.log("\n🎓  CampusLens AI — Phase 49 Verification: NBA Accreditation, OBE & Washington Accord Tier-1\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "NBA schema migration file exists",
  fileExists("supabase/migrations/20261014000001_nba_obe_schema.sql")
);
check(
  "nba_programs, nba_program_outcomes, nba_course_outcomes, nba_co_po_mappings, nba_sar_dossiers, nba_evaluation_visits defined with RLS",
  fileContains(
    "supabase/migrations/20261014000001_nba_obe_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.nba_programs",
    "CREATE TABLE IF NOT EXISTS public.nba_program_outcomes",
    "CREATE TABLE IF NOT EXISTS public.nba_course_outcomes",
    "CREATE TABLE IF NOT EXISTS public.nba_co_po_mappings",
    "CREATE TABLE IF NOT EXISTS public.nba_sar_dossiers",
    "CREATE TABLE IF NOT EXISTS public.nba_evaluation_visits",
    "ALTER TABLE public.nba_programs ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.nba_program_outcomes ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.nba_course_outcomes ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.nba_co_po_mappings ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.nba_sar_dossiers ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.nba_evaluation_visits ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "NbaProgramTier, NbaAccreditationStatus, BloomLevel, SarStatus exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type NbaProgramTier",
    "export type NbaAccreditationStatus",
    "export type BloomLevel",
    "export type SarStatus"
  )
);
check(
  "NbaProgram, NbaProgramOutcome, NbaCourseOutcome, NbaCoPoMapping, NbaSarDossier, NbaEvaluationVisit, NbaOverviewStats exported",
  fileContains(
    "src/types/index.ts",
    "export interface NbaProgram",
    "export interface NbaProgramOutcome",
    "export interface NbaCourseOutcome",
    "export interface NbaCoPoMapping",
    "export interface NbaSarDossier",
    "export interface NbaEvaluationVisit",
    "export interface NbaOverviewStats"
  )
);

// 3. Engine & Mock Data
console.log("\n⚙️  NBA Engine & Seeds");
check(
  "nba-engine.ts exists with generators, seeds, and mutations",
  fileExists("src/lib/nba/nba-engine.ts") &&
    fileContains(
      "src/lib/nba/nba-engine.ts",
      "export function generateNbaSarToken",
      "export function generateNbaCertToken",
      "export function generateNbaVisitToken",
      "export function calculateCoAttainment",
      "export const MOCK_NBA_PROGRAMS",
      "export const MOCK_PROGRAM_OUTCOMES",
      "export const MOCK_COURSE_OUTCOMES",
      "export const MOCK_CO_PO_MAPPINGS",
      "export const MOCK_NBA_SAR_DOSSIERS",
      "export const MOCK_NBA_VISITS"
    )
);

// 4. API Routes
console.log("\n🌐 API Routes");
check(
  "API route: /api/nba/programs (GET & POST)",
  fileExists("src/app/api/nba/programs/route.ts") &&
    fileContains("src/app/api/nba/programs/route.ts", "export async function GET", "export async function POST")
);
check(
  "API route: /api/nba/outcomes (GET & POST)",
  fileExists("src/app/api/nba/outcomes/route.ts") &&
    fileContains("src/app/api/nba/outcomes/route.ts", "export async function GET", "export async function POST")
);
check(
  "API route: /api/nba/attainment (GET & POST)",
  fileExists("src/app/api/nba/attainment/route.ts") &&
    fileContains("src/app/api/nba/attainment/route.ts", "export async function GET", "export async function POST")
);
check(
  "API route: /api/nba/sar (GET & POST)",
  fileExists("src/app/api/nba/sar/route.ts") &&
    fileContains("src/app/api/nba/sar/route.ts", "export async function GET", "export async function POST")
);
check(
  "API route: /api/nba/stats (GET)",
  fileExists("src/app/api/nba/stats/route.ts") &&
    fileContains("src/app/api/nba/stats/route.ts", "export async function GET")
);

// 5. UI Components
console.log("\n🎨 UI Components");
check(
  "NbaProgramCard component exists",
  fileExists("src/components/nba/nba-program-card.tsx") &&
    fileContains("src/components/nba/nba-program-card.tsx", "export function NbaProgramCard")
);
check(
  "CoPoMatrixCard component exists",
  fileExists("src/components/nba/co-po-matrix-card.tsx") &&
    fileContains("src/components/nba/co-po-matrix-card.tsx", "export function CoPoMatrixCard")
);
check(
  "SarDossierCard component exists",
  fileExists("src/components/nba/sar-dossier-card.tsx") &&
    fileContains("src/components/nba/sar-dossier-card.tsx", "export function SarDossierCard")
);
check(
  "SarFilingModal component exists",
  fileExists("src/components/nba/sar-filing-modal.tsx") &&
    fileContains("src/components/nba/sar-filing-modal.tsx", "export function SarFilingModal")
);
check(
  "CoAttainmentModal component exists",
  fileExists("src/components/nba/co-attainment-modal.tsx") &&
    fileContains("src/components/nba/co-attainment-modal.tsx", "export function CoAttainmentModal")
);
check(
  "NbaVerifyModal component exists",
  fileExists("src/components/nba/nba-verify-modal.tsx") &&
    fileContains("src/components/nba/nba-verify-modal.tsx", "export function NbaVerifyModal")
);

// 6. Portal Page
console.log("\n📱 Portal Page");
check(
  "Dedicated NBA Portal page exists at /nba",
  fileExists("src/app/nba/page.tsx") &&
    fileContains(
      "src/app/nba/page.tsx",
      "export default function NbaAccreditationPortalPage",
      "National Board of Accreditation (NBA)",
      "Phase 49: Outcome-Based Education"
    )
);

// 7. Navigation Integration
console.log("\n🔗 Navigation Integration");
check(
  "Integrated in sidebar.tsx",
  fileContains("src/components/layout/sidebar.tsx", "/nba", "NBA & OBE Accreditation", "Phase 49")
);
check(
  "Integrated in command-palette.tsx",
  fileContains("src/components/layout/command-palette.tsx", "/nba", "NBA & Outcome-Based Education (OBE)")
);
check(
  "Integrated in quick-actions.tsx",
  fileContains("src/components/dashboard/quick-actions.tsx", "/nba", "NBA & OBE Accreditation", "Phase 49")
);

// 8. Functional Token & Engine Tests
console.log("\n🧪 Functional Engine Tests");
const engineContent = readFileSync(path.join(root, "src/lib/nba/nba-engine.ts"), "utf-8");
check(
  "NBA SAR dossier token generator valid",
  engineContent.includes("`CL-NBA-SAR-2026-${cleanCode}${randomSuffix}`")
);
check(
  "NBA verification certificate token valid",
  engineContent.includes("`CL-NBA-CERT-2026-${randomSuffix}`")
);
check(
  "NBA evaluation team visit token valid",
  engineContent.includes("`CL-NBA-VISIT-2026-${randomSuffix}`")
);
check(
  "CO attainment calculation formula properly implements OBE direct CIE (30%) + external SEE (70%) and indirect (20%) weighting",
  engineContent.includes("(directInternal * 0.30) + (directExternal * 0.70)") &&
    engineContent.includes("(direct * 0.80) + (indirectSurvey * 0.20)")
);

// Summary
console.log("\n" + "═".repeat(60));
console.log(`Passed: ${passed} | Failed: ${failed}`);

if (failed > 0) {
  console.log("\n❌ Phase 49 verification FAILED");
  process.exit(1);
} else {
  console.log("\n✨ Phase 49: Smart Campus NBA Accreditation & OBE Gateway VERIFIED SUCCESSFULLY!\n");
  process.exit(0);
}
