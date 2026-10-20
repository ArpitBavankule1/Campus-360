#!/usr/bin/env node
/**
 * CampusLens AI — Phase 55 Verification Suite
 * Automated test: Smart Campus All India Survey on Higher Education (AISHE), Ministry of Education DCF Portal & Telemetry Gateway
 * Run: node scripts/verify-phase55.mjs
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

console.log("\n🏛️  CampusLens AI — Phase 55 Verification: MoE AISHE Survey & National Telemetry Gateway\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "AISHE national survey schema migration file exists",
  fileExists("supabase/migrations/20261020000001_aishe_national_survey_schema.sql")
);
check(
  "aishe_institution_profiles, aishe_dcf_surveys, aishe_enrollment_telemetry, aishe_faculty_cadres, aishe_financial_statements defined with RLS",
  fileContains(
    "supabase/migrations/20261020000001_aishe_national_survey_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.aishe_institution_profiles",
    "CREATE TABLE IF NOT EXISTS public.aishe_dcf_surveys",
    "CREATE TABLE IF NOT EXISTS public.aishe_enrollment_telemetry",
    "CREATE TABLE IF NOT EXISTS public.aishe_faculty_cadres",
    "CREATE TABLE IF NOT EXISTS public.aishe_financial_statements",
    "ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Domain Definitions
console.log("\n🔷 TypeScript Domain Definitions");
check(
  "AisheSurveyStatus, AisheDcfType, AisheDcfStatus, AisheProgrammeLevel, AisheCadreType exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type AisheSurveyStatus",
    "export type AisheDcfType",
    "export type AisheDcfStatus",
    "export type AisheProgrammeLevel",
    "export type AisheCadreType"
  )
);
check(
  "AisheInstitutionProfile, AisheDcfSurvey, AisheEnrollmentRecord, AisheFacultyCadre, AisheFinancialStatement, AisheInfrastructureAudit, AisheSummaryStats exported",
  fileContains(
    "src/types/index.ts",
    "export interface AisheInstitutionProfile",
    "export interface AisheDcfSurvey",
    "export interface AisheEnrollmentRecord",
    "export interface AisheFacultyCadre",
    "export interface AisheFinancialStatement",
    "export interface AisheInfrastructureAudit",
    "export interface AisheSummaryStats"
  )
);

// 3. AISHE Domain Engine & Computations
console.log("\n⚙️  AISHE Domain Engine & Computations");
check("aishe-engine.ts exists", fileExists("src/lib/aishe/aishe-engine.ts"));
check(
  "Token generators and store operations implemented",
  fileContains(
    "src/lib/aishe/aishe-engine.ts",
    "generateAisheCertToken",
    "generateAisheDcfToken",
    "generateAisheUdinToken",
    "generateAisheVerificationHash",
    "getAisheProfile",
    "getAisheSurveys",
    "getAisheEnrollment",
    "getAisheFacultyCadres",
    "getAisheFinancialStatements",
    "getAisheSummaryStats",
    "calculateGenderParityIndex",
    "calculatePupilTeacherRatio",
    "calculateSocialDiversityPercentage"
  )
);

// 4. API Endpoints
console.log("\n🔌 API Endpoints");
check(
  "GET/PATCH /api/aishe/profile route exists",
  fileExists("src/app/api/aishe/profile/route.ts") &&
    fileContains("src/app/api/aishe/profile/route.ts", "GET", "PATCH")
);
check(
  "GET/PATCH /api/aishe/surveys route exists",
  fileExists("src/app/api/aishe/surveys/route.ts") &&
    fileContains("src/app/api/aishe/surveys/route.ts", "GET", "PATCH")
);
check(
  "GET/POST /api/aishe/enrollment route exists",
  fileExists("src/app/api/aishe/enrollment/route.ts") &&
    fileContains("src/app/api/aishe/enrollment/route.ts", "GET", "POST")
);
check(
  "GET/POST /api/aishe/faculty route exists",
  fileExists("src/app/api/aishe/faculty/route.ts") &&
    fileContains("src/app/api/aishe/faculty/route.ts", "GET", "POST")
);
check(
  "GET/POST /api/aishe/finances route exists",
  fileExists("src/app/api/aishe/finances/route.ts") &&
    fileContains("src/app/api/aishe/finances/route.ts", "GET", "POST")
);
check(
  "GET /api/aishe/stats route exists",
  fileExists("src/app/api/aishe/stats/route.ts") &&
    fileContains("src/app/api/aishe/stats/route.ts", "GET")
);

// 5. UI Components
console.log("\n🎨 UI Components");
check(
  "AisheProfileBanner component exists",
  fileExists("src/components/aishe/aishe-profile-banner.tsx")
);
check(
  "DcfSurveyCard component exists",
  fileExists("src/components/aishe/dcf-survey-card.tsx")
);
check(
  "EnrollmentDemographicsCard component exists",
  fileExists("src/components/aishe/enrollment-demographics-card.tsx")
);
check(
  "FacultyCadreCard component exists",
  fileExists("src/components/aishe/faculty-cadre-card.tsx")
);
check(
  "FinancialStatementCard component exists",
  fileExists("src/components/aishe/financial-statement-card.tsx")
);
check(
  "UpdateSurveyBlockModal component exists",
  fileExists("src/components/aishe/update-survey-block-modal.tsx")
);
check(
  "ViewCertificateModal component exists",
  fileExists("src/components/aishe/view-certificate-modal.tsx")
);
check(
  "Barrel export src/components/aishe/index.ts exists",
  fileExists("src/components/aishe/index.ts") &&
    fileContains(
      "src/components/aishe/index.ts",
      "aishe-profile-banner",
      "dcf-survey-card",
      "enrollment-demographics-card",
      "faculty-cadre-card",
      "financial-statement-card"
    )
);

// 6. Dedicated Portal Page
console.log("\n🖥️  Dedicated Portal Page");
check("src/app/aishe/page.tsx route exists", fileExists("src/app/aishe/page.tsx"));
check(
  "AISHE portal page contains all tabs and KPIs",
  fileContains(
    "src/app/aishe/page.tsx",
    "Phase 55: Ministry of Education AISHE Gateway",
    "All India Survey on Higher Education (AISHE)",
    "AisheProfileBanner",
    "DcfSurveyCard",
    "EnrollmentDemographicsCard",
    "FacultyCadreCard",
    "FinancialStatementCard"
  )
);

// 7. Global Navigation & Quick Actions
console.log("\n🧭 Global Navigation & Quick Actions");
check(
  "Sidebar contains AISHE MoE Survey with Phase 55 badge",
  fileContains("src/components/layout/sidebar.tsx", "/aishe", "AISHE MoE Survey", "Phase 55")
);
check(
  "Quick Actions contains AISHE MoE Survey Gateway with Phase 55 badge",
  fileContains("src/components/dashboard/quick-actions.tsx", "/aishe", "AISHE MoE Survey Gateway", "Phase 55")
);
check(
  "Command Palette contains AISHE navigation item",
  fileContains("src/components/layout/command-palette.tsx", "/aishe", "p-aishe")
);

// Summary
console.log("\n" + "═".repeat(60));
console.log(`Phase 55 Tests Passed: ${passed}`);
console.log(`Phase 55 Tests Failed: ${failed}`);

if (failed > 0) {
  console.log("\n❌ Phase 55 verification FAILED\n");
  process.exit(1);
} else {
  console.log("\n✨ Phase 55: Smart Campus All India Survey on Higher Education (AISHE) Gateway VERIFIED SUCCESSFULLY!\n");
  process.exit(0);
}
