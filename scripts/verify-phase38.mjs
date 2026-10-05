#!/usr/bin/env node
/**
 * CampusLens AI — Phase 38 Verification Suite
 * Automated test: Smart Campus Digital Credentialing, Academic Convocation & Verifiable Degree Ledger
 * Run: node scripts/verify-phase38.mjs
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

console.log("\n🎓  CampusLens AI — Phase 38 Verification: Convocation & Degree Credentials\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "Convocation schema migration file exists",
  fileExists("supabase/migrations/20261005000001_convocation_schema.sql")
);
check(
  "degree_credentials, convocation_ceremonies, convocation_registrations defined with RLS",
  fileContains(
    "supabase/migrations/20261005000001_convocation_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.degree_credentials",
    "CREATE TABLE IF NOT EXISTS public.convocation_ceremonies",
    "CREATE TABLE IF NOT EXISTS public.convocation_registrations",
    "CREATE TABLE IF NOT EXISTS public.credential_verifications",
    "ALTER TABLE public.degree_credentials ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.convocation_ceremonies ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.convocation_registrations ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.credential_verifications ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "DegreeType, HonorsClassification, CeremonyStatus, GownSize exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type DegreeType",
    "export type HonorsClassification",
    "export type CeremonyStatus",
    "export type GownSize"
  )
);
check(
  "DegreeCredential, ConvocationCeremony, ConvocationRegistration exported",
  fileContains(
    "src/types/index.ts",
    "export interface DegreeCredential",
    "export interface ConvocationCeremony",
    "export interface ConvocationRegistration",
    "export interface CredentialVerificationRequest",
    "export interface ConvocationOverviewStats"
  )
);

// 3. Engine & Mock Data
console.log("\n⚙️  Convocation Engine & Seeds");
check(
  "convocation-engine.ts exists with generators and mock datasets",
  fileExists("src/lib/convocation/convocation-engine.ts") &&
    fileContains(
      "src/lib/convocation/convocation-engine.ts",
      "export function generateDegreeCode",
      "export function generateConvocationPassCode",
      "export function generateVerificationCode",
      "export function calculateConvocationOverview",
      "export const MOCK_DEGREE_CREDENTIALS",
      "export const MOCK_CONVOCATION_CEREMONY",
      "export const MOCK_CONVOCATION_REGISTRATIONS",
      "export const MOCK_CREDENTIAL_VERIFICATIONS"
    )
);

// 4. API Endpoints
console.log("\n🌐 API Endpoints");
check(
  "GET & POST /api/convocation/degrees credentials directory",
  fileExists("src/app/api/convocation/degrees/route.ts") &&
    fileContains(
      "src/app/api/convocation/degrees/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "GET & POST /api/convocation/ceremonies docket",
  fileExists("src/app/api/convocation/ceremonies/route.ts") &&
    fileContains(
      "src/app/api/convocation/ceremonies/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "GET & POST /api/convocation/register regalia and pass booking",
  fileExists("src/app/api/convocation/register/route.ts") &&
    fileContains(
      "src/app/api/convocation/register/route.ts",
      "export async function GET",
      "export async function POST",
      "generateConvocationPassCode"
    )
);
check(
  "GET & POST /api/convocation/verify credential gateway",
  fileExists("src/app/api/convocation/verify/route.ts") &&
    fileContains(
      "src/app/api/convocation/verify/route.ts",
      "export async function GET",
      "export async function POST",
      "generateVerificationCode"
    )
);

// 5. UI Components & Pages
console.log("\n🎨 UI Components & Portal");
check(
  "DegreeCredentialCard and ConvocationCeremonyCard components exist",
  fileExists("src/components/convocation/degree-credential-card.tsx") &&
    fileExists("src/components/convocation/convocation-ceremony-card.tsx")
);
check(
  "RegisterConvocationModal and VerifyDegreeModal components exist",
  fileExists("src/components/convocation/register-convocation-modal.tsx") &&
    fileExists("src/components/convocation/verify-degree-modal.tsx")
);
check(
  "Convocation Portal page exists at /convocation",
  fileExists("src/app/convocation/page.tsx") &&
    fileContains(
      "src/app/convocation/page.tsx",
      "ConvocationPortalPage",
      "DegreeCredentialCard",
      "ConvocationCeremonyCard"
    )
);

// 6. Navigation Integration
console.log("\n🧭 Navigation Integration");
check(
  "Sidebar links to /convocation with Phase 38 badge",
  fileContains("src/components/layout/sidebar.tsx", 'href: "/convocation"', "Phase 38")
);
check(
  "QuickActions includes Convocation & Degree Credentials item",
  fileContains("src/components/dashboard/quick-actions.tsx", 'href: "/convocation"', "Phase 38")
);
check(
  "Command Palette includes Convocation item",
  fileContains("src/components/layout/command-palette.tsx", 'href: "/convocation"')
);

console.log("\n" + "═".repeat(60));
console.log(`Total checks: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 Phase 38 Smart Convocation & Degree Credentials verification passed 100%!\n");
}
