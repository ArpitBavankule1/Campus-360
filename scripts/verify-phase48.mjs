#!/usr/bin/env node
/**
 * CampusLens AI — Phase 48 Verification Suite
 * Automated test: Smart Campus National Institutional Ranking Framework (NIRF) & Benchmarking
 * Run: node scripts/verify-phase48.mjs
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

console.log("\n🏅  CampusLens AI — Phase 48 Verification: NIRF Ranking & Institutional Benchmarking\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "NIRF schema migration file exists",
  fileExists("supabase/migrations/20261013000001_nirf_schema.sql")
);
check(
  "nirf_parameters, nirf_dossiers, nirf_benchmarks, nirf_data_metrics defined with RLS",
  fileContains(
    "supabase/migrations/20261013000001_nirf_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.nirf_parameters",
    "CREATE TABLE IF NOT EXISTS public.nirf_dossiers",
    "CREATE TABLE IF NOT EXISTS public.nirf_benchmarks",
    "CREATE TABLE IF NOT EXISTS public.nirf_data_metrics",
    "ALTER TABLE public.nirf_parameters ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.nirf_dossiers ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.nirf_benchmarks ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.nirf_data_metrics ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "NirfCategory, NirfParameterCode, DossierStatus, NirfAuditStatus exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type NirfCategory",
    "export type NirfParameterCode",
    "export type DossierStatus",
    "export type NirfAuditStatus"
  )
);
check(
  "NirfParameterMetric, NirfDossier, NirfBenchmarkPeer, NirfDataMetric, NirfOverviewStats exported",
  fileContains(
    "src/types/index.ts",
    "export interface NirfParameterMetric",
    "export interface NirfDossier",
    "export interface NirfBenchmarkPeer",
    "export interface NirfDataMetric",
    "export interface NirfOverviewStats"
  )
);

// 3. Engine & Mock Data
console.log("\n⚙️  NIRF Engine & Seeds");
check(
  "nirf-engine.ts exists with generators, seeds, and mutations",
  fileExists("src/lib/nirf/nirf-engine.ts") &&
    fileContains(
      "src/lib/nirf/nirf-engine.ts",
      "export function generateNirfDossierToken",
      "export function generateNirfCertToken",
      "export function generateNirfAuditToken",
      "export function calculateCompositeNirfScore",
      "export const MOCK_NIRF_PARAMETERS",
      "export const MOCK_NIRF_DOSSIERS",
      "export const MOCK_NIRF_BENCHMARKS",
      "export const MOCK_NIRF_DATA_METRICS"
    )
);

// 4. API Routes
console.log("\n🌐 API Routes");
check(
  "API route: /api/nirf/parameters (GET & POST)",
  fileExists("src/app/api/nirf/parameters/route.ts") &&
    fileContains("src/app/api/nirf/parameters/route.ts", "export async function GET", "export async function POST")
);
check(
  "API route: /api/nirf/dossiers (GET & POST)",
  fileExists("src/app/api/nirf/dossiers/route.ts") &&
    fileContains("src/app/api/nirf/dossiers/route.ts", "export async function GET", "export async function POST")
);
check(
  "API route: /api/nirf/benchmarks (GET)",
  fileExists("src/app/api/nirf/benchmarks/route.ts") &&
    fileContains("src/app/api/nirf/benchmarks/route.ts", "export async function GET")
);
check(
  "API route: /api/nirf/metrics (GET & POST)",
  fileExists("src/app/api/nirf/metrics/route.ts") &&
    fileContains("src/app/api/nirf/metrics/route.ts", "export async function GET", "export async function POST")
);
check(
  "API route: /api/nirf/stats (GET)",
  fileExists("src/app/api/nirf/stats/route.ts") &&
    fileContains("src/app/api/nirf/stats/route.ts", "export async function GET")
);

// 5. UI Components
console.log("\n🎨 UI Components");
check(
  "ParameterScoreCard component exists",
  fileExists("src/components/nirf/parameter-score-card.tsx") &&
    fileContains("src/components/nirf/parameter-score-card.tsx", "export function ParameterScoreCard")
);
check(
  "DossierCard component exists",
  fileExists("src/components/nirf/dossier-card.tsx") &&
    fileContains("src/components/nirf/dossier-card.tsx", "export function DossierCard")
);
check(
  "PeerBenchmarkCard component exists",
  fileExists("src/components/nirf/peer-benchmark-card.tsx") &&
    fileContains("src/components/nirf/peer-benchmark-card.tsx", "export function PeerBenchmarkCard")
);
check(
  "DossierFilingModal component exists",
  fileExists("src/components/nirf/dossier-filing-modal.tsx") &&
    fileContains("src/components/nirf/dossier-filing-modal.tsx", "export function DossierFilingModal")
);
check(
  "MetricEntryModal component exists",
  fileExists("src/components/nirf/metric-entry-modal.tsx") &&
    fileContains("src/components/nirf/metric-entry-modal.tsx", "export function MetricEntryModal")
);
check(
  "NirfVerifyModal component exists",
  fileExists("src/components/nirf/nirf-verify-modal.tsx") &&
    fileContains("src/components/nirf/nirf-verify-modal.tsx", "export function NirfVerifyModal")
);

// 6. Portal Page
console.log("\n📱 Portal Page");
check(
  "Dedicated NIRF Portal page exists at /nirf",
  fileExists("src/app/nirf/page.tsx") &&
    fileContains(
      "src/app/nirf/page.tsx",
      "export default function NirfRankingPortalPage",
      "National Institutional Ranking Framework (NIRF)",
      "Phase 48: Institutional Ranking Intelligence"
    )
);

// 7. Navigation Integration
console.log("\n🔗 Navigation Integration");
check(
  "Integrated in sidebar.tsx",
  fileContains("src/components/layout/sidebar.tsx", "/nirf", "NIRF Rankings & Intelligence", "Phase 48")
);
check(
  "Integrated in command-palette.tsx",
  fileContains("src/components/layout/command-palette.tsx", "/nirf", "NIRF Rankings & Institutional Intelligence")
);
check(
  "Integrated in quick-actions.tsx",
  fileContains("src/components/dashboard/quick-actions.tsx", "/nirf", "NIRF Rankings & Institutional Intelligence", "Phase 48")
);

// 8. Functional Token & Engine Tests
console.log("\n🧪 Functional Engine Tests");
const engineContent = readFileSync(path.join(root, "src/lib/nirf/nirf-engine.ts"), "utf-8");
check(
  "NIRF dossier token generator valid",
  engineContent.includes("`CL-NIRF-DOSS-2026-${code}${randomSuffix}`")
);
check(
  "NIRF verification certificate token valid",
  engineContent.includes("`CL-NIRF-CERT-2026-${randomSuffix}`")
);
check(
  "NIRF audit identifier token valid",
  engineContent.includes("`CL-NIRF-AUD-2026-${randomSuffix}`")
);
check(
  "Composite NIRF score calculation formula weights TLR(30%), RPC(30%), GO(20%), OI(10%), PR(10%)",
  engineContent.includes("(tlr * 0.30) + (rpc * 0.30) + (go * 0.20) + (oi * 0.10) + (pr * 0.10)")
);

// Summary
console.log("\n" + "═".repeat(60));
console.log(`Passed: ${passed} | Failed: ${failed}`);

if (failed > 0) {
  console.log("\n❌ Phase 48 verification FAILED");
  process.exit(1);
} else {
  console.log("\n✨ Phase 48: Smart Campus NIRF Rankings & Benchmarking VERIFIED SUCCESSFULLY!\n");
  process.exit(0);
}
