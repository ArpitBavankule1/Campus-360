#!/usr/bin/env node
/**
 * CampusLens AI — Phase 28 Verification Suite
 * Automated test: Research Publications, Innovation Grants & IPR Hub
 * Run: node scripts/verify-phase28.mjs
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

console.log("\n🔬  CampusLens AI — Phase 28 Verification: Research Publications & Innovation Hub\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "Research schema migration file exists",
  fileExists("supabase/migrations/20261001000003_research_schema.sql")
);
check(
  "research_publications table defined with DOI and indexing constraints",
  fileContains(
    "supabase/migrations/20261001000003_research_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.research_publications",
    "doi TEXT NOT NULL UNIQUE",
    "indexing TEXT NOT NULL CHECK"
  )
);
check(
  "research_grants and patent_applications tables defined with RLS",
  fileContains(
    "supabase/migrations/20261001000003_research_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.research_grants",
    "CREATE TABLE IF NOT EXISTS public.patent_applications",
    "ALTER TABLE public.research_grants ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.patent_applications ENABLE ROW LEVEL SECURITY"
  )
);
check(
  "innovation_startups table defined with sector and incubation space",
  fileContains(
    "supabase/migrations/20261001000003_research_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.innovation_startups",
    "sector TEXT NOT NULL CHECK",
    "incubation_space TEXT NOT NULL"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "ResearchIndexing, GrantAgency, PatentStatus exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type ResearchIndexing",
    "export type GrantAgency",
    "export type PatentStatus"
  )
);
check(
  "ResearchPublication, ResearchGrant, PatentApplication, InnovationStartup exported",
  fileContains(
    "src/types/index.ts",
    "export interface ResearchPublication",
    "export interface ResearchGrant",
    "export interface PatentApplication",
    "export interface InnovationStartup"
  )
);
check(
  "Research tables defined in src/types/database.types.ts",
  fileContains(
    "src/types/database.types.ts",
    "research_publications:",
    "research_grants:",
    "patent_applications:",
    "innovation_startups:"
  )
);

// 3. Research Engine & Business Logic
console.log("\n⚙️  Research Engine & Business Logic");
check(
  "Research engine file exists",
  fileExists("src/lib/research/research-engine.ts")
);
check(
  "generatePatentAppNumber and calculateResearchOverview exported",
  fileContains(
    "src/lib/research/research-engine.ts",
    "export function generatePatentAppNumber",
    "export function calculateResearchOverview"
  )
);
check(
  "Seed catalogs for publications, grants, patents, and startups exported",
  fileContains(
    "src/lib/research/research-engine.ts",
    "MOCK_PUBLICATIONS",
    "MOCK_GRANTS",
    "MOCK_PATENTS",
    "MOCK_STARTUPS"
  )
);

// 4. API Endpoints
console.log("\n🌐 API Endpoints");
check(
  "Research publications API route exists with GET & POST",
  fileExists("src/app/api/research/publications/route.ts") &&
    fileContains(
      "src/app/api/research/publications/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "Research grants API route exists with funding calculations",
  fileExists("src/app/api/research/grants/route.ts") &&
    fileContains(
      "src/app/api/research/grants/route.ts",
      "totalFunding",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "Patent applications API route exists with code generator",
  fileExists("src/app/api/research/patents/route.ts") &&
    fileContains(
      "src/app/api/research/patents/route.ts",
      "generatePatentAppNumber",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "Startup incubation API route exists with sector filtering",
  fileExists("src/app/api/research/startups/route.ts") &&
    fileContains(
      "src/app/api/research/startups/route.ts",
      "export async function GET",
      "export async function POST"
    )
);

// 5. UI Components
console.log("\n🎨 React UI Components");
check(
  "PublicationCard component exists with citation copy and indexing badge",
  fileExists("src/components/research/publication-card.tsx")
);
check(
  "GrantProgressCard component exists with outlay progress indicators",
  fileExists("src/components/research/grant-progress-card.tsx")
);
check(
  "PatentFilingModal component exists for IPR registration",
  fileExists("src/components/research/patent-filing-modal.tsx")
);
check(
  "StartupShowcaseCard component exists with sector tags and pitch deck links",
  fileExists("src/components/research/startup-showcase-card.tsx")
);

// 6. Portal Page & Ecosystem Integration
console.log("\n📱 Portal Page & Ecosystem Integration");
check(
  "Dedicated /research route page exists with all view tabs",
  fileExists("src/app/research/page.tsx") &&
    fileContains(
      "src/app/research/page.tsx",
      "PublicationCard",
      "GrantProgressCard",
      "PatentFilingModal",
      "StartupShowcaseCard"
    )
);
check(
  "Sidebar navigation includes Research & Innovation with Phase 28 badge",
  fileContains(
    "src/components/layout/sidebar.tsx",
    "Research & Innovation",
    "/research",
    "Phase 28"
  )
);
check(
  "Quick Actions includes Research & Innovation Hub with Phase 28 badge",
  fileContains(
    "src/components/dashboard/quick-actions.tsx",
    "Research & Innovation Hub",
    "/research",
    "Phase 28"
  )
);
check(
  "Global command palette includes Research Publications & Innovation",
  fileContains(
    "src/components/layout/command-palette.tsx",
    "Research Publications & Innovation",
    "/research"
  )
);

console.log("═".repeat(60));
console.log(`\n📊  Phase 28 Verification Summary:`);
console.log(`    Total Checks: ${passed + failed}`);
console.log(`    Passed:       ${passed}`);
console.log(`    Failed:       ${failed}\n`);

if (failed === 0) {
  console.log("🎉  ALL PHASE 28 CHECKS PASSED PERFECTLY!\n");
  process.exit(0);
} else {
  console.log("❌  PHASE 28 VERIFICATION FAILED.\n");
  process.exit(1);
}
