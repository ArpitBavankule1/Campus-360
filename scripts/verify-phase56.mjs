#!/usr/bin/env node
/**
 * CampusLens AI — Phase 56 Verification Suite
 * Automated test: Smart Campus SWAYAM-NPTEL MOOCs, Local Chapter & Academic Credit Transfer Gateway
 * Run: node scripts/verify-phase56.mjs
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

console.log("\n🎓  CampusLens AI — Phase 56 Verification: SWAYAM-NPTEL MOOCs & Credit Transfer Gateway\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "SWAYAM-NPTEL gateway schema migration file exists",
  fileExists("supabase/migrations/20261021000001_swayam_nptel_gateway_schema.sql")
);
check(
  "swayam_local_chapters, swayam_courses, swayam_enrollments, swayam_certifications, swayam_credit_transfers defined with RLS",
  fileContains(
    "supabase/migrations/20261021000001_swayam_nptel_gateway_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.swayam_local_chapters",
    "CREATE TABLE IF NOT EXISTS public.swayam_courses",
    "CREATE TABLE IF NOT EXISTS public.swayam_enrollments",
    "CREATE TABLE IF NOT EXISTS public.swayam_certifications",
    "CREATE TABLE IF NOT EXISTS public.swayam_credit_transfers",
    "ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Domain Definitions
console.log("\n🔷 TypeScript Domain Definitions");
check(
  "SwayamChapterRating, SwayamCourseDuration, SwayamEnrollmentStatus, SwayamCertTier, SwayamCreditTransferStatus exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type SwayamChapterRating",
    "export type SwayamCourseDuration",
    "export type SwayamEnrollmentStatus",
    "export type SwayamCertTier",
    "export type SwayamCreditTransferStatus"
  )
);
check(
  "SwayamLocalChapter, SwayamCourse, SwayamEnrollment, SwayamCertification, SwayamCreditTransfer, SwayamSummaryStats exported",
  fileContains(
    "src/types/index.ts",
    "export interface SwayamLocalChapter",
    "export interface SwayamCourse",
    "export interface SwayamEnrollment",
    "export interface SwayamCertification",
    "export interface SwayamCreditTransfer",
    "export interface SwayamSummaryStats"
  )
);

// 3. SWAYAM Domain Engine & Computations
console.log("\n⚙️  SWAYAM Domain Engine & Computations");
check("swayam-engine.ts exists", fileExists("src/lib/swayam/swayam-engine.ts"));
check(
  "Token generators and store operations implemented",
  fileContains(
    "src/lib/swayam/swayam-engine.ts",
    "generateSwayamEnrollmentToken",
    "generateNptelCertToken",
    "generateSwayamTransferToken",
    "generateNptelVerificationHash",
    "getSwayamChapter",
    "getSwayamCourses",
    "getSwayamEnrollments",
    "getSwayamCertifications",
    "getSwayamCreditTransfers",
    "getSwayamSummaryStats",
    "calculateElitePassRate",
    "calculateCreditTransferIndex",
    "calculateTotalCreditsEarned"
  )
);

// 4. API Endpoints
console.log("\n🔌 API Endpoints");
check(
  "GET/PATCH /api/swayam/chapter route exists",
  fileExists("src/app/api/swayam/chapter/route.ts") &&
    fileContains("src/app/api/swayam/chapter/route.ts", "GET", "PATCH")
);
check(
  "GET/POST /api/swayam/courses route exists",
  fileExists("src/app/api/swayam/courses/route.ts") &&
    fileContains("src/app/api/swayam/courses/route.ts", "GET", "POST")
);
check(
  "GET/POST /api/swayam/enrollments route exists",
  fileExists("src/app/api/swayam/enrollments/route.ts") &&
    fileContains("src/app/api/swayam/enrollments/route.ts", "GET", "POST")
);
check(
  "GET/POST /api/swayam/certifications route exists",
  fileExists("src/app/api/swayam/certifications/route.ts") &&
    fileContains("src/app/api/swayam/certifications/route.ts", "GET", "POST")
);
check(
  "GET/POST/PATCH /api/swayam/credit-transfers route exists",
  fileExists("src/app/api/swayam/credit-transfers/route.ts") &&
    fileContains("src/app/api/swayam/credit-transfers/route.ts", "GET", "POST", "PATCH")
);
check(
  "GET /api/swayam/stats route exists",
  fileExists("src/app/api/swayam/stats/route.ts") &&
    fileContains("src/app/api/swayam/stats/route.ts", "GET")
);

// 5. UI Components
console.log("\n🎨 UI Components");
check(
  "ChapterProfileBanner component exists",
  fileExists("src/components/swayam/chapter-profile-banner.tsx")
);
check(
  "CourseCatalogCard component exists",
  fileExists("src/components/swayam/course-catalog-card.tsx")
);
check(
  "EnrollmentTrackerCard component exists",
  fileExists("src/components/swayam/enrollment-tracker-card.tsx")
);
check(
  "CertificationsShowcaseCard component exists",
  fileExists("src/components/swayam/certifications-showcase-card.tsx")
);
check(
  "CreditTransferCard component exists",
  fileExists("src/components/swayam/credit-transfer-card.tsx")
);
check(
  "EnrollCourseModal component exists",
  fileExists("src/components/swayam/enroll-course-modal.tsx")
);
check(
  "RequestCreditTransferModal component exists",
  fileExists("src/components/swayam/request-credit-transfer-modal.tsx")
);
check(
  "Barrel export src/components/swayam/index.ts exists",
  fileExists("src/components/swayam/index.ts") &&
    fileContains(
      "src/components/swayam/index.ts",
      "chapter-profile-banner",
      "course-catalog-card",
      "enrollment-tracker-card",
      "certifications-showcase-card",
      "credit-transfer-card"
    )
);

// 6. Dedicated Portal Page
console.log("\n🖥️  Dedicated Portal Page");
check("src/app/swayam/page.tsx route exists", fileExists("src/app/swayam/page.tsx"));
check(
  "SWAYAM portal page contains all tabs and KPIs",
  fileContains(
    "src/app/swayam/page.tsx",
    "Phase 56: Ministry of Education SWAYAM-NPTEL Gateway",
    "SWAYAM-NPTEL MOOCs & Academic Credit Transfer Portal",
    "ChapterProfileBanner",
    "CourseCatalogCard",
    "EnrollmentTrackerCard",
    "CertificationsShowcaseCard",
    "CreditTransferCard"
  )
);

// 7. Global Navigation & Quick Actions
console.log("\n🧭 Global Navigation & Quick Actions");
check(
  "Sidebar contains SWAYAM-NPTEL MOOCs with Phase 56 badge",
  fileContains("src/components/layout/sidebar.tsx", "/swayam", "SWAYAM-NPTEL MOOCs", "Phase 56")
);
check(
  "Quick Actions contains SWAYAM-NPTEL Gateway with Phase 56 badge",
  fileContains("src/components/dashboard/quick-actions.tsx", "/swayam", "SWAYAM-NPTEL Gateway", "Phase 56")
);
check(
  "Command Palette contains SWAYAM navigation item",
  fileContains("src/components/layout/command-palette.tsx", "/swayam", "p-swayam")
);

// Summary
console.log("\n" + "═".repeat(60));
console.log(`Phase 56 Tests Passed: ${passed}`);
console.log(`Phase 56 Tests Failed: ${failed}`);

if (failed > 0) {
  console.log("\n❌ Phase 56 verification FAILED\n");
  process.exit(1);
} else {
  console.log("\n✨ Phase 56: Smart Campus SWAYAM-NPTEL MOOCs & Credit Transfer Gateway VERIFIED SUCCESSFULLY!\n");
  process.exit(0);
}
