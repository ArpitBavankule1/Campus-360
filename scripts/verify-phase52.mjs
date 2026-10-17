#!/usr/bin/env node
/**
 * CampusLens AI — Phase 52 Verification Suite
 * Automated test: Smart Campus AICTE Approval Process Handbook (APH), Extension of Approval (EoA) & Statutory Regulatory Compliance Gateway
 * Run: node scripts/verify-phase52.mjs
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

console.log("\n🏛️  CampusLens AI — Phase 52 Verification: AICTE Regulatory Compliance & EoA Gateway\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "AICTE compliance schema migration file exists",
  fileExists("supabase/migrations/20261017000001_aicte_compliance_schema.sql")
);
check(
  "aicte_approved_programs, aicte_infrastructure_norms, aicte_cadre_fsr_metrics, aicte_statutory_committees, aicte_eoa_dossiers defined with RLS",
  fileContains(
    "supabase/migrations/20261017000001_aicte_compliance_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.aicte_approved_programs",
    "CREATE TABLE IF NOT EXISTS public.aicte_infrastructure_norms",
    "CREATE TABLE IF NOT EXISTS public.aicte_cadre_fsr_metrics",
    "CREATE TABLE IF NOT EXISTS public.aicte_statutory_committees",
    "CREATE TABLE IF NOT EXISTS public.aicte_eoa_dossiers",
    "ALTER TABLE public.aicte_approved_programs ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.aicte_infrastructure_norms ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.aicte_cadre_fsr_metrics ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.aicte_statutory_committees ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.aicte_eoa_dossiers ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🔷 TypeScript Domain Definitions");
check(
  "AicteProgramLevel, AicteEoaStatus, AicteRoomType, AicteCommitteeType exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type AicteProgramLevel",
    "export type AicteEoaStatus",
    "export type AicteRoomType",
    "export type AicteCommitteeType",
    "export type AicteInspectionStatus"
  )
);
check(
  "AicteApprovedProgram, AicteInfrastructureNorm, AicteCadreFsrMetric, AicteStatutoryCommittee, AicteEoaDossier exported",
  fileContains(
    "src/types/index.ts",
    "export interface AicteApprovedProgram",
    "export interface AicteInfrastructureNorm",
    "export interface AicteCadreFsrMetric",
    "export interface AicteStatutoryCommittee",
    "export interface AicteEoaDossier",
    "export interface AicteComplianceSummaryStats"
  )
);

// 3. Engine & Computational Helpers
console.log("\n⚙️  AICTE Compliance Domain Engine & Computations");
check(
  "aicte-engine.ts exists",
  fileExists("src/lib/aicte/aicte-engine.ts")
);
check(
  "Token generators and store operations implemented",
  fileContains(
    "src/lib/aicte/aicte-engine.ts",
    "generateAicteApplicationNumber",
    "generateEoaDocketToken",
    "generateMandatoryDisclosureToken",
    "generateEvcAuditToken",
    "generateDigitalSignatureHash",
    "aicteComplianceStore"
  )
);

// 4. API Endpoints
console.log("\n🔌 API Endpoints");
check(
  "GET/POST /api/aicte/programs route exists",
  fileExists("src/app/api/aicte/programs/route.ts") &&
    fileContains("src/app/api/aicte/programs/route.ts", "export async function GET", "export async function POST")
);
check(
  "GET /api/aicte/infrastructure route exists",
  fileExists("src/app/api/aicte/infrastructure/route.ts") &&
    fileContains("src/app/api/aicte/infrastructure/route.ts", "export async function GET")
);
check(
  "GET /api/aicte/cadre-fsr route exists",
  fileExists("src/app/api/aicte/cadre-fsr/route.ts") &&
    fileContains("src/app/api/aicte/cadre-fsr/route.ts", "export async function GET")
);
check(
  "GET/PATCH /api/aicte/committees route exists",
  fileExists("src/app/api/aicte/committees/route.ts") &&
    fileContains("src/app/api/aicte/committees/route.ts", "export async function GET", "export async function PATCH")
);
check(
  "GET/POST /api/aicte/dossiers route exists",
  fileExists("src/app/api/aicte/dossiers/route.ts") &&
    fileContains("src/app/api/aicte/dossiers/route.ts", "export async function GET", "export async function POST")
);
check(
  "GET /api/aicte/stats route exists",
  fileExists("src/app/api/aicte/stats/route.ts") &&
    fileContains("src/app/api/aicte/stats/route.ts", "export async function GET")
);

// 5. UI Components
console.log("\n🎨 UI Components");
check(
  "ProgramIntakeCard component exists",
  fileExists("src/components/aicte/program-intake-card.tsx")
);
check(
  "InfrastructureNormCard component exists",
  fileExists("src/components/aicte/infrastructure-norm-card.tsx")
);
check(
  "CadreFsrTable component exists",
  fileExists("src/components/aicte/cadre-fsr-table.tsx")
);
check(
  "StatutoryCommitteeCard component exists",
  fileExists("src/components/aicte/statutory-committee-card.tsx")
);
check(
  "EoaDossierCard component exists",
  fileExists("src/components/aicte/eoa-dossier-card.tsx")
);
check(
  "SubmitEoaModal component exists",
  fileExists("src/components/aicte/submit-eoa-modal.tsx")
);
check(
  "MandatoryDisclosureModal component exists",
  fileExists("src/components/aicte/mandatory-disclosure-modal.tsx")
);
check(
  "Barrel export src/components/aicte/index.ts exists",
  fileExists("src/components/aicte/index.ts")
);

// 6. Dedicated Portal Page
console.log("\n🖥️  Dedicated Portal Page");
check(
  "/aicte page route exists",
  fileExists("src/app/aicte/page.tsx")
);
check(
  "AICTE portal page contains all tabs and KPIs",
  fileContains(
    "src/app/aicte/page.tsx",
    "AICTE Regulatory Compliance & EoA Gateway",
    "Phase 52: AICTE Approval Process Handbook",
    "ProgramIntakeCard",
    "InfrastructureNormCard",
    "CadreFsrTable",
    "StatutoryCommitteeCard",
    "EoaDossierCard",
    "SubmitEoaModal",
    "MandatoryDisclosureModal"
  )
);

// 7. Global Navigation & Command Palette Integration
console.log("\n🧭 Global Navigation & Quick Actions");
check(
  "Sidebar contains AICTE Regulatory Compliance with Phase 52 badge",
  fileContains("src/components/layout/sidebar.tsx", "/aicte", "AICTE Regulatory Compliance", "Phase 52")
);
check(
  "Quick Actions contains AICTE Regulatory Compliance with Phase 52 badge",
  fileContains("src/components/dashboard/quick-actions.tsx", "/aicte", "AICTE Regulatory Compliance", "Phase 52")
);
check(
  "Command Palette contains AICTE Compliance navigation item",
  fileContains("src/components/layout/command-palette.tsx", "/aicte", "p-aicte")
);

// Summary
console.log("\n" + "═".repeat(60));
console.log(`Phase 52 Tests Passed: ${passed}`);
console.log(`Phase 52 Tests Failed: ${failed}`);

if (failed > 0) {
  console.log("\n❌ Phase 52 verification FAILED");
  process.exit(1);
} else {
  console.log("\n✨ Phase 52: Smart Campus AICTE Regulatory Compliance Gateway VERIFIED SUCCESSFULLY!\n");
  process.exit(0);
}
