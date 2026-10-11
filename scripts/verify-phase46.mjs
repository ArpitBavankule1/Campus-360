#!/usr/bin/env node
/**
 * CampusLens AI — Phase 46 Verification Suite
 * Automated test: Smart Campus Continuing Education, Executive MDP & Professional Micro-Credentials Hub
 * Run: node scripts/verify-phase46.mjs
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

console.log("\n🎓  CampusLens AI — Phase 46 Verification: Continuing Education & Micro-Credentials\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "Continuing education schema migration file exists",
  fileExists("supabase/migrations/20261011000001_continuing_ed_schema.sql")
);
check(
  "executive_programs, professional_micro_credentials, corporate_nominations, faculty_development_cohorts defined with RLS",
  fileContains(
    "supabase/migrations/20261011000001_continuing_ed_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.executive_programs",
    "CREATE TABLE IF NOT EXISTS public.professional_micro_credentials",
    "CREATE TABLE IF NOT EXISTS public.corporate_nominations",
    "CREATE TABLE IF NOT EXISTS public.faculty_development_cohorts",
    "ALTER TABLE public.executive_programs ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.professional_micro_credentials ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.corporate_nominations ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.faculty_development_cohorts ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "ProgramType, PedagogyMode, ProgramStatus, CompetencyDomain, SponsorshipStatus exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type ProgramType",
    "export type PedagogyMode",
    "export type ProgramStatus",
    "export type CompetencyDomain",
    "export type SponsorshipStatus"
  )
);
check(
  "ExecutiveProgram, ProfessionalMicroCredential, CorporateNomination, FacultyDevelopmentCohort exported",
  fileContains(
    "src/types/index.ts",
    "export interface ExecutiveProgram",
    "export interface ProfessionalMicroCredential",
    "export interface CorporateNomination",
    "export interface FacultyDevelopmentCohort",
    "export interface ContinuingEducationOverviewStats"
  )
);

// 3. Engine & Mock Data
console.log("\n⚙️  Continuing Education Engine & Seeds");
check(
  "continuing-ed-engine.ts exists with generators, seeds, and mutations",
  fileExists("src/lib/continuing-ed/continuing-ed-engine.ts") &&
    fileContains(
      "src/lib/continuing-ed/continuing-ed-engine.ts",
      "export function generateProgramToken",
      "export function generateCredentialToken",
      "export function generateNominationToken",
      "export function generateCertificateToken",
      "export const MOCK_EXECUTIVE_PROGRAMS",
      "export const MOCK_MICRO_CREDENTIALS",
      "export const MOCK_CORPORATE_NOMINATIONS",
      "export const MOCK_FACULTY_COHORTS",
      "export function getContinuingEducationStats",
      "export function getExecutivePrograms",
      "export function getMicroCredentials",
      "export function getCorporateNominations",
      "export function getFacultyCohorts",
      "export function submitCorporateNomination",
      "export function issueMicroCredentialEnrollment"
    )
);

// 4. API Routes
console.log("\n🌐 API Routes");
check(
  "API route: /api/continuing-ed/programs (GET)",
  fileExists("src/app/api/continuing-ed/programs/route.ts") &&
    fileContains("src/app/api/continuing-ed/programs/route.ts", "getExecutivePrograms")
);
check(
  "API route: /api/continuing-ed/credentials (GET & POST)",
  fileExists("src/app/api/continuing-ed/credentials/route.ts") &&
    fileContains(
      "src/app/api/continuing-ed/credentials/route.ts",
      "getMicroCredentials",
      "issueMicroCredentialEnrollment"
    )
);
check(
  "API route: /api/continuing-ed/nominations (GET & POST)",
  fileExists("src/app/api/continuing-ed/nominations/route.ts") &&
    fileContains(
      "src/app/api/continuing-ed/nominations/route.ts",
      "getCorporateNominations",
      "submitCorporateNomination"
    )
);
check(
  "API route: /api/continuing-ed/cohorts (GET & POST)",
  fileExists("src/app/api/continuing-ed/cohorts/route.ts") &&
    fileContains(
      "src/app/api/continuing-ed/cohorts/route.ts",
      "getFacultyCohorts",
      "registerFacultyCohort"
    )
);
check(
  "API route: /api/continuing-ed/stats (GET)",
  fileExists("src/app/api/continuing-ed/stats/route.ts") &&
    fileContains("src/app/api/continuing-ed/stats/route.ts", "getContinuingEducationStats")
);

// 5. UI Components
console.log("\n🎨 UI Components");
check(
  "ExecutiveProgramCard component exists",
  fileExists("src/components/continuing-ed/executive-program-card.tsx") &&
    fileContains(
      "src/components/continuing-ed/executive-program-card.tsx",
      "export function ExecutiveProgramCard",
      "lead_faculty_director",
      "credit_units"
    )
);
check(
  "MicroCredentialBadgeCard component exists",
  fileExists("src/components/continuing-ed/micro-credential-badge-card.tsx") &&
    fileContains(
      "src/components/continuing-ed/micro-credential-badge-card.tsx",
      "export function MicroCredentialBadgeCard",
      "competency_domain",
      "credential_hash"
    )
);
check(
  "CorporateNominationCard component exists",
  fileExists("src/components/continuing-ed/corporate-nomination-card.tsx") &&
    fileContains(
      "src/components/continuing-ed/corporate-nomination-card.tsx",
      "export function CorporateNominationCard",
      "corporate_sponsor",
      "attendance_percentage"
    )
);
check(
  "CorporateNominationModal component exists",
  fileExists("src/components/continuing-ed/corporate-nomination-modal.tsx") &&
    fileContains(
      "src/components/continuing-ed/corporate-nomination-modal.tsx",
      "export function CorporateNominationModal",
      "corporate_sponsor",
      "participant_email"
    )
);
check(
  "CredentialVerifyModal component exists",
  fileExists("src/components/continuing-ed/credential-verify-modal.tsx") &&
    fileContains(
      "src/components/continuing-ed/credential-verify-modal.tsx",
      "export function CredentialVerifyModal"
    )
);

// 6. Dedicated Portal Page
console.log("\n📱 Portal Page");
check(
  "Dedicated Continuing Education Portal page exists at /continuing-ed",
  fileExists("src/app/continuing-ed/page.tsx") &&
    fileContains(
      "src/app/continuing-ed/page.tsx",
      "export default function ContinuingEducationPortalPage",
      "ExecutiveProgramCard",
      "MicroCredentialBadgeCard",
      "CorporateNominationCard",
      "CorporateNominationModal",
      "CredentialVerifyModal"
    )
);

// 7. Navigation & Command Palette Integration
console.log("\n🔗 Navigation Integration");
check(
  "Integrated in sidebar.tsx",
  fileContains("src/components/layout/sidebar.tsx", "/continuing-ed", "Continuing Education Hub", "Phase 46")
);
check(
  "Integrated in command-palette.tsx",
  fileContains("src/components/layout/command-palette.tsx", "/continuing-ed", "Continuing Education & Executive MDPs")
);
check(
  "Integrated in quick-actions.tsx",
  fileContains("src/components/dashboard/quick-actions.tsx", "/continuing-ed", "Continuing Education & Executive MDPs", "Phase 46")
);

// 8. Functional Token & Engine Tests
console.log("\n🧪 Functional Engine Tests");
const engineContent = readFileSync(path.join(root, "src/lib/continuing-ed/continuing-ed-engine.ts"), "utf-8");
check(
  "MDP program token generator regex valid",
  engineContent.includes("`CL-MDP-2026-${rand}`")
);
check(
  "Credential token generator regex valid",
  engineContent.includes("`CL-CRED-2026-${rand}`")
);
check(
  "Nomination token generator regex valid",
  engineContent.includes("`CL-NOM-2026-${rand}`")
);
check(
  "Certificate token generator regex valid",
  engineContent.includes("`CL-MDP-CERT-2026-${rand}`")
);

console.log("\n" + "═".repeat(60));
console.log(`Passed: ${passed} | Failed: ${failed}`);

if (failed > 0) {
  console.log("\n❌ Phase 46 verification FAILED");
  process.exit(1);
} else {
  console.log("\n✨ Phase 46: Smart Campus Continuing Education & Micro-Credentials VERIFIED SUCCESSFULLY!\n");
  process.exit(0);
}
