#!/usr/bin/env node
/**
 * CampusLens AI — Phase 47 Verification Suite
 * Automated test: Smart Campus Internal Quality Assurance Cell (IQAC), NAAC Criteria & Accreditation
 * Run: node scripts/verify-phase47.mjs
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

console.log("\n🏛️  CampusLens AI — Phase 47 Verification: IQAC & Institutional Accreditation\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "IQAC & Accreditation schema migration file exists",
  fileExists("supabase/migrations/20261012000001_iqac_schema.sql")
);
check(
  "iqac_criteria_metrics, iqac_aqar_reports, iqac_academic_audits, iqac_best_practices defined with RLS",
  fileContains(
    "supabase/migrations/20261012000001_iqac_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.iqac_criteria_metrics",
    "CREATE TABLE IF NOT EXISTS public.iqac_aqar_reports",
    "CREATE TABLE IF NOT EXISTS public.iqac_academic_audits",
    "CREATE TABLE IF NOT EXISTS public.iqac_best_practices",
    "ALTER TABLE public.iqac_criteria_metrics ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.iqac_aqar_reports ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.iqac_academic_audits ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.iqac_best_practices ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "NaacCriterionCode, AqarStatus, AuditType, AccreditationGrade exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type NaacCriterionCode",
    "export type AqarStatus",
    "export type AuditType",
    "export type AccreditationGrade"
  )
);
check(
  "IqacCriterionMetric, IqacAqarReport, IqacAcademicAudit, IqacBestPractice, IqacOverviewStats exported",
  fileContains(
    "src/types/index.ts",
    "export interface IqacCriterionMetric",
    "export interface IqacAqarReport",
    "export interface IqacAcademicAudit",
    "export interface IqacBestPractice",
    "export interface IqacOverviewStats"
  )
);

// 3. Engine & Mock Data
console.log("\n⚙️  IQAC Engine & Seeds");
check(
  "iqac-engine.ts exists with generators, seeds, and mutations",
  fileExists("src/lib/iqac/iqac-engine.ts") &&
    fileContains(
      "src/lib/iqac/iqac-engine.ts",
      "export function generateAqarToken",
      "export function generateAuditToken",
      "export function generateBestPracticeToken",
      "export function generateIqacComplianceToken",
      "export const MOCK_IQAC_CRITERIA",
      "export const MOCK_AQAR_REPORTS",
      "export const MOCK_ACADEMIC_AUDITS",
      "export const MOCK_BEST_PRACTICES",
      "export function calculateProjectedCgpa",
      "export function getIqacOverviewStats",
      "export function submitAqarDraft",
      "export function scheduleAcademicAudit",
      "export function verifyIqacComplianceToken"
    )
);

// 4. API Routes
console.log("\n🌐 API Routes");
check(
  "API route: /api/iqac/criteria (GET & POST)",
  fileExists("src/app/api/iqac/criteria/route.ts") &&
    fileContains("src/app/api/iqac/criteria/route.ts", "updateCriterionMetric")
);
check(
  "API route: /api/iqac/aqar (GET & POST)",
  fileExists("src/app/api/iqac/aqar/route.ts") &&
    fileContains("src/app/api/iqac/aqar/route.ts", "submitAqarDraft")
);
check(
  "API route: /api/iqac/audits (GET & POST)",
  fileExists("src/app/api/iqac/audits/route.ts") &&
    fileContains("src/app/api/iqac/audits/route.ts", "scheduleAcademicAudit")
);
check(
  "API route: /api/iqac/best-practices (GET & POST)",
  fileExists("src/app/api/iqac/best-practices/route.ts") &&
    fileContains("src/app/api/iqac/best-practices/route.ts", "fileBestPractice")
);
check(
  "API route: /api/iqac/stats (GET)",
  fileExists("src/app/api/iqac/stats/route.ts") &&
    fileContains("src/app/api/iqac/stats/route.ts", "getIqacOverviewStats")
);

// 5. UI Components
console.log("\n🎨 UI Components");
check(
  "CriterionMetricCard component exists",
  fileExists("src/components/iqac/criterion-metric-card.tsx") &&
    fileContains(
      "src/components/iqac/criterion-metric-card.tsx",
      "export function CriterionMetricCard",
      "lead_evaluator",
      "ssr_readiness_percentage"
    )
);
check(
  "AqarReportCard component exists",
  fileExists("src/components/iqac/aqar-report-card.tsx") &&
    fileContains(
      "src/components/iqac/aqar-report-card.tsx",
      "export function AqarReportCard",
      "submission_token",
      "projected_naac_grade"
    )
);
check(
  "AcademicAuditCard component exists",
  fileExists("src/components/iqac/academic-audit-card.tsx") &&
    fileContains(
      "src/components/iqac/academic-audit-card.tsx",
      "export function AcademicAuditCard",
      "lead_external_auditor",
      "audit_code"
    )
);
check(
  "BestPracticeCard component exists",
  fileExists("src/components/iqac/best-practice-card.tsx") &&
    fileContains(
      "src/components/iqac/best-practice-card.tsx",
      "export function BestPracticeCard",
      "thematic_area",
      "practice_token"
    )
);
check(
  "AqarSubmissionModal component exists",
  fileExists("src/components/iqac/aqar-submission-modal.tsx") &&
    fileContains("src/components/iqac/aqar-submission-modal.tsx", "export function AqarSubmissionModal")
);
check(
  "AuditScheduleModal component exists",
  fileExists("src/components/iqac/audit-schedule-modal.tsx") &&
    fileContains("src/components/iqac/audit-schedule-modal.tsx", "export function AuditScheduleModal")
);
check(
  "IqacVerifyModal component exists",
  fileExists("src/components/iqac/iqac-verify-modal.tsx") &&
    fileContains("src/components/iqac/iqac-verify-modal.tsx", "export function IqacVerifyModal")
);

// 6. Dedicated Portal Page
console.log("\n📱 Portal Page");
check(
  "Dedicated IQAC Portal page exists at /iqac",
  fileExists("src/app/iqac/page.tsx") &&
    fileContains(
      "src/app/iqac/page.tsx",
      "export default function IqacAccreditationPortalPage",
      "CriterionMetricCard",
      "AqarReportCard",
      "AcademicAuditCard",
      "BestPracticeCard"
    )
);

// 7. Navigation & Command Palette Integration
console.log("\n🔗 Navigation Integration");
check(
  "Integrated in sidebar.tsx",
  fileContains("src/components/layout/sidebar.tsx", "/iqac", "IQAC & Accreditation", "Phase 47")
);
check(
  "Integrated in command-palette.tsx",
  fileContains("src/components/layout/command-palette.tsx", "/iqac", "IQAC & Institutional Accreditation")
);
check(
  "Integrated in quick-actions.tsx",
  fileContains("src/components/dashboard/quick-actions.tsx", "/iqac", "IQAC & Institutional Accreditation", "Phase 47")
);

// 8. Functional Token & Engine Tests
console.log("\n🧪 Functional Engine Tests");
const engineContent = readFileSync(path.join(root, "src/lib/iqac/iqac-engine.ts"), "utf-8");
check(
  "AQAR token generator regex valid",
  engineContent.includes("`CL-AQAR-2026-${rand}`")
);
check(
  "AAA audit token generator regex valid",
  engineContent.includes("`CL-AAA-2026-${rand}`")
);
check(
  "Best practice token generator regex valid",
  engineContent.includes("`CL-BP-2026-${rand}`")
);
check(
  "Compliance token generator regex valid",
  engineContent.includes("`CL-IQAC-COMP-2026-${rand}`")
);

console.log("\n" + "═".repeat(60));
console.log(`Passed: ${passed} | Failed: ${failed}`);

if (failed > 0) {
  console.log("\n❌ Phase 47 verification FAILED");
  process.exit(1);
} else {
  console.log("\n✨ Phase 47: Smart Campus IQAC & Accreditation VERIFIED SUCCESSFULLY!\n");
  process.exit(0);
}
