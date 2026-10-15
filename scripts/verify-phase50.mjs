#!/usr/bin/env node
/**
 * CampusLens AI — Phase 50 Verification Suite
 * Automated test: Smart Campus QS World University Rankings, Times Higher Education (THE) & Global Sustainable Development (SDG Impact) Intelligence Gateway
 * Run: node scripts/verify-phase50.mjs
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

console.log("\n🌐  CampusLens AI — Phase 50 Verification: QS & THE World Rankings & SDG Impact Gateway\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "World rankings schema migration file exists",
  fileExists("supabase/migrations/20261015000001_world_rankings_schema.sql")
);
check(
  "world_ranking_frameworks, world_ranking_metrics, world_ranking_sdg_impacts, world_ranking_dossiers, world_ranking_benchmarks, world_ranking_verifications defined with RLS",
  fileContains(
    "supabase/migrations/20261015000001_world_rankings_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.world_ranking_frameworks",
    "CREATE TABLE IF NOT EXISTS public.world_ranking_metrics",
    "CREATE TABLE IF NOT EXISTS public.world_ranking_sdg_impacts",
    "CREATE TABLE IF NOT EXISTS public.world_ranking_dossiers",
    "CREATE TABLE IF NOT EXISTS public.world_ranking_benchmarks",
    "CREATE TABLE IF NOT EXISTS public.world_ranking_verifications",
    "ALTER TABLE public.world_ranking_frameworks ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.world_ranking_metrics ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.world_ranking_sdg_impacts ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.world_ranking_dossiers ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.world_ranking_benchmarks ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.world_ranking_verifications ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🔷 TypeScript Domain Definitions");
check(
  "WorldRankingFramework, WorldRankingMetric, WorldRankingSdgImpact, WorldRankingDossier exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export interface WorldRankingFramework",
    "export interface WorldRankingMetric",
    "export interface WorldRankingSdgImpact",
    "export interface WorldRankingDossier",
    "export interface WorldRankingBenchmark",
    "export interface WorldRankingVerification",
    "export interface WorldRankingSummaryStats"
  )
);

// 3. Engine & Computational Helpers
console.log("\n⚙️  World Rankings Domain Engine & Computations");
check(
  "world-rankings-engine.ts exists",
  fileExists("src/lib/world-rankings/world-rankings-engine.ts")
);
check(
  "Token generators and getters implemented",
  fileContains(
    "src/lib/world-rankings/world-rankings-engine.ts",
    "generateWorldRankingDossierToken",
    "generateWorldRankingCertToken",
    "generateWorldRankingIntegrityHash",
    "calculateQsCompositeScore",
    "getWorldRankingFrameworks",
    "getWorldRankingMetrics",
    "getWorldRankingSdgs",
    "getWorldRankingBenchmarks",
    "getWorldRankingDossiers",
    "getWorldRankingVerifications",
    "createWorldRankingDossier",
    "verifyWorldRankingCertificate",
    "getWorldRankingOverviewStats"
  )
);

// 4. API Endpoints
console.log("\n🔌 API Endpoints");
check(
  "GET /api/world-rankings/frameworks route exists",
  fileExists("src/app/api/world-rankings/frameworks/route.ts")
);
check(
  "GET /api/world-rankings/metrics route exists",
  fileExists("src/app/api/world-rankings/metrics/route.ts")
);
check(
  "GET /api/world-rankings/sdg route exists",
  fileExists("src/app/api/world-rankings/sdg/route.ts")
);
check(
  "GET/POST /api/world-rankings/dossiers route exists",
  fileExists("src/app/api/world-rankings/dossiers/route.ts") &&
    fileContains("src/app/api/world-rankings/dossiers/route.ts", "export async function GET", "export async function POST")
);
check(
  "GET /api/world-rankings/benchmarks route exists",
  fileExists("src/app/api/world-rankings/benchmarks/route.ts")
);
check(
  "GET/POST /api/world-rankings/verify route exists",
  fileExists("src/app/api/world-rankings/verify/route.ts") &&
    fileContains("src/app/api/world-rankings/verify/route.ts", "export async function GET", "export async function POST")
);
check(
  "GET /api/world-rankings/stats route exists",
  fileExists("src/app/api/world-rankings/stats/route.ts")
);

// 5. UI Components
console.log("\n🎨 UI Components");
check(
  "RankingFrameworkCard component exists",
  fileExists("src/components/world-rankings/ranking-framework-card.tsx")
);
check(
  "MetricBreakdownCard component exists",
  fileExists("src/components/world-rankings/metric-breakdown-card.tsx")
);
check(
  "SdgImpactCard component exists",
  fileExists("src/components/world-rankings/sdg-impact-card.tsx")
);
check(
  "PeerBenchmarkTable component exists",
  fileExists("src/components/world-rankings/peer-benchmark-table.tsx")
);
check(
  "RankingDossierCard component exists",
  fileExists("src/components/world-rankings/ranking-dossier-card.tsx")
);
check(
  "DossierSubmissionModal component exists",
  fileExists("src/components/world-rankings/dossier-submission-modal.tsx")
);
check(
  "RankingCredentialModal component exists",
  fileExists("src/components/world-rankings/ranking-credential-modal.tsx")
);
check(
  "Barrel export src/components/world-rankings/index.ts exists",
  fileExists("src/components/world-rankings/index.ts")
);

// 6. Dedicated Portal Page
console.log("\n🖥️  Dedicated Portal Page");
check(
  "/world-rankings page route exists",
  fileExists("src/app/world-rankings/page.tsx")
);
check(
  "World rankings portal page contains all tabs and KPIs",
  fileContains(
    "src/app/world-rankings/page.tsx",
    "QS World University Rankings & THE Impact Gateway",
    "Phase 50: Global Rankings Intelligence",
    "RankingFrameworkCard",
    "MetricBreakdownCard",
    "SdgImpactCard",
    "PeerBenchmarkTable",
    "RankingDossierCard"
  )
);

// 7. Global Navigation & Command Palette Integration
console.log("\n🧭 Global Navigation & Quick Actions");
check(
  "Sidebar contains QS & THE World Rankings with Phase 50 badge",
  fileContains("src/components/layout/sidebar.tsx", "/world-rankings", "QS & THE World Rankings", "Phase 50")
);
check(
  "Quick Actions contains QS & THE World Rankings with Phase 50 badge",
  fileContains("src/components/dashboard/quick-actions.tsx", "/world-rankings", "QS & THE World Rankings", "Phase 50")
);
check(
  "Command Palette contains QS & THE World Rankings navigation item",
  fileContains("src/components/layout/command-palette.tsx", "/world-rankings", "p-world-rankings")
);

// Summary
console.log("\n" + "═".repeat(60));
console.log(`Phase 50 Tests Passed: ${passed}`);
console.log(`Phase 50 Tests Failed: ${failed}`);

if (failed > 0) {
  console.log("\n❌ Phase 50 verification FAILED");
  process.exit(1);
} else {
  console.log("\n✨ Phase 50: Smart Campus QS & THE World Rankings Gateway VERIFIED SUCCESSFULLY!\n");
  process.exit(0);
}
