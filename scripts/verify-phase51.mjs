#!/usr/bin/env node
/**
 * CampusLens AI — Phase 51 Verification Suite
 * Automated test: Smart Campus Academic Bank of Credits (ABC), APAAR ID & NEP 2020 Multi-Disciplinary Credit Mobility Gateway
 * Run: node scripts/verify-phase51.mjs
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

console.log("\n💳  CampusLens AI — Phase 51 Verification: Academic Bank of Credits (ABC) & APAAR ID Gateway\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "Academic Credits schema migration file exists",
  fileExists("supabase/migrations/20261016000001_academic_credits_schema.sql")
);
check(
  "apaar_student_registries, academic_credit_ledgers, credit_transfer_applications, nep_exit_qualifications, digilocker_nad_sync_logs defined with RLS",
  fileContains(
    "supabase/migrations/20261016000001_academic_credits_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.apaar_student_registries",
    "CREATE TABLE IF NOT EXISTS public.academic_credit_ledgers",
    "CREATE TABLE IF NOT EXISTS public.credit_transfer_applications",
    "CREATE TABLE IF NOT EXISTS public.nep_exit_qualifications",
    "CREATE TABLE IF NOT EXISTS public.digilocker_nad_sync_logs",
    "ALTER TABLE public.apaar_student_registries ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.academic_credit_ledgers ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.credit_transfer_applications ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.nep_exit_qualifications ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.digilocker_nad_sync_logs ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🔷 TypeScript Domain Definitions");
check(
  "CreditCategory, ApaarKycStatus, NepExitLevel exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type CreditCategory",
    "export type ApaarKycStatus",
    "export type NepExitLevel",
    "export type CreditVerificationStatus",
    "export type AbcCreditTransferStatus"
  )
);
check(
  "ApaarStudentRegistry, AcademicCreditLedger, CreditTransferApplication, NepExitQualification, DigiLockerNadSyncLog exported",
  fileContains(
    "src/types/index.ts",
    "export interface ApaarStudentRegistry",
    "export interface AcademicCreditLedger",
    "export interface CreditTransferApplication",
    "export interface NepExitQualification",
    "export interface DigiLockerNadSyncLog",
    "export interface AcademicCreditsSummaryStats"
  )
);

// 3. Engine & Computational Helpers
console.log("\n⚙️  Academic Bank of Credits Domain Engine & Computations");
check(
  "academic-credits-engine.ts exists",
  fileExists("src/lib/academic-credits/academic-credits-engine.ts")
);
check(
  "Token generators and store operations implemented",
  fileContains(
    "src/lib/academic-credits/academic-credits-engine.ts",
    "generateApaarId",
    "generateAbcAccountId",
    "generateCreditVerificationToken",
    "generateTransferDocketToken",
    "generateExitDocketToken",
    "generateNadMerkleRoot",
    "calculateNepExitEligibility",
    "academicCreditsStore"
  )
);

// 4. API Endpoints
console.log("\n🔌 API Endpoints");
check(
  "GET/POST /api/academic-credits/apaar route exists",
  fileExists("src/app/api/academic-credits/apaar/route.ts") &&
    fileContains("src/app/api/academic-credits/apaar/route.ts", "export async function GET", "export async function POST")
);
check(
  "GET/POST /api/academic-credits/ledger route exists",
  fileExists("src/app/api/academic-credits/ledger/route.ts") &&
    fileContains("src/app/api/academic-credits/ledger/route.ts", "export async function GET", "export async function POST")
);
check(
  "GET/POST/PATCH /api/academic-credits/transfers route exists",
  fileExists("src/app/api/academic-credits/transfers/route.ts") &&
    fileContains("src/app/api/academic-credits/transfers/route.ts", "export async function GET", "export async function POST", "export async function PATCH")
);
check(
  "GET/POST /api/academic-credits/exit route exists",
  fileExists("src/app/api/academic-credits/exit/route.ts") &&
    fileContains("src/app/api/academic-credits/exit/route.ts", "export async function GET", "export async function POST")
);
check(
  "GET/POST /api/academic-credits/sync route exists",
  fileExists("src/app/api/academic-credits/sync/route.ts") &&
    fileContains("src/app/api/academic-credits/sync/route.ts", "export async function GET", "export async function POST")
);
check(
  "GET /api/academic-credits/stats route exists",
  fileExists("src/app/api/academic-credits/stats/route.ts") &&
    fileContains("src/app/api/academic-credits/stats/route.ts", "export async function GET")
);

// 5. UI Components
console.log("\n🎨 UI Components");
check(
  "ApaarRegistryCard component exists",
  fileExists("src/components/academic-credits/apaar-registry-card.tsx")
);
check(
  "CreditLedgerCard component exists",
  fileExists("src/components/academic-credits/credit-ledger-card.tsx")
);
check(
  "CreditTransferCard component exists",
  fileExists("src/components/academic-credits/credit-transfer-card.tsx")
);
check(
  "NepExitCard component exists",
  fileExists("src/components/academic-credits/nep-exit-card.tsx")
);
check(
  "ApplyTransferModal component exists",
  fileExists("src/components/academic-credits/apply-transfer-modal.tsx")
);
check(
  "VerifyDigilockerModal component exists",
  fileExists("src/components/academic-credits/verify-digilocker-modal.tsx")
);
check(
  "Barrel export src/components/academic-credits/index.ts exists",
  fileExists("src/components/academic-credits/index.ts")
);

// 6. Dedicated Portal Page
console.log("\n🖥️  Dedicated Portal Page");
check(
  "/academic-credits page route exists",
  fileExists("src/app/academic-credits/page.tsx")
);
check(
  "Academic Credits portal page contains all tabs and KPIs",
  fileContains(
    "src/app/academic-credits/page.tsx",
    "Academic Bank of Credits (ABC) & APAAR ID",
    "Phase 51: National Education Policy (NEP 2020)",
    "ApaarRegistryCard",
    "CreditLedgerCard",
    "CreditTransferCard",
    "NepExitCard",
    "ApplyTransferModal",
    "VerifyDigilockerModal"
  )
);

// 7. Global Navigation & Command Palette Integration
console.log("\n🧭 Global Navigation & Quick Actions");
check(
  "Sidebar contains Academic Bank of Credits with Phase 51 badge",
  fileContains("src/components/layout/sidebar.tsx", "/academic-credits", "Academic Bank of Credits (ABC)", "Phase 51")
);
check(
  "Quick Actions contains Academic Bank of Credits with Phase 51 badge",
  fileContains("src/components/dashboard/quick-actions.tsx", "/academic-credits", "Academic Bank of Credits & APAAR", "Phase 51")
);
check(
  "Command Palette contains Academic Bank of Credits navigation item",
  fileContains("src/components/layout/command-palette.tsx", "/academic-credits", "p-abc")
);

// Summary
console.log("\n" + "═".repeat(60));
console.log(`Phase 51 Tests Passed: ${passed}`);
console.log(`Phase 51 Tests Failed: ${failed}`);

if (failed > 0) {
  console.log("\n❌ Phase 51 verification FAILED");
  process.exit(1);
} else {
  console.log("\n✨ Phase 51: Smart Campus Academic Bank of Credits & APAAR Gateway VERIFIED SUCCESSFULLY!\n");
  process.exit(0);
}
