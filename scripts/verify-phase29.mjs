#!/usr/bin/env node
/**
 * CampusLens AI — Phase 29 Verification Suite
 * Automated test: International Scholars, Exchange Programs & Global Mobility Hub
 * Run: node scripts/verify-phase29.mjs
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

console.log("\n🌍  CampusLens AI — Phase 29 Verification: International Scholars & Global Mobility\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "International mobility migration file exists",
  fileExists("supabase/migrations/20261002000001_international_schema.sql")
);
check(
  "partner_universities table defined with QS ranking and exchange slots",
  fileContains(
    "supabase/migrations/20261002000001_international_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.partner_universities",
    "qs_world_ranking INTEGER",
    "exchange_slots INTEGER NOT NULL DEFAULT 5"
  )
);
check(
  "international_scholarships and credit_transfer_requests tables defined with RLS",
  fileContains(
    "supabase/migrations/20261002000001_international_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.international_scholarships",
    "CREATE TABLE IF NOT EXISTS public.credit_transfer_requests",
    "ALTER TABLE public.international_scholarships ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.credit_transfer_requests ENABLE ROW LEVEL SECURITY"
  )
);
check(
  "travel_clearance_passes table defined with cryptographic QR tokens",
  fileContains(
    "supabase/migrations/20261002000001_international_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.travel_clearance_passes",
    "pass_code TEXT NOT NULL UNIQUE",
    "digital_qr_token TEXT NOT NULL"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "ExchangeSemesterTerm, ScholarshipCoverage, VisaCategory exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type ExchangeSemesterTerm",
    "export type ScholarshipCoverage",
    "export type VisaCategory"
  )
);
check(
  "PartnerUniversity, InternationalScholarship, CreditTransferRequest exported",
  fileContains(
    "src/types/index.ts",
    "export interface PartnerUniversity",
    "export interface InternationalScholarship",
    "export interface CreditTransferRequest"
  )
);
check(
  "TravelClearancePass and GlobalMobilityOverviewStats exported",
  fileContains(
    "src/types/index.ts",
    "export interface TravelClearancePass",
    "export interface GlobalMobilityOverviewStats"
  )
);
check(
  "Phase 29 tables declared in src/types/database.types.ts",
  fileContains(
    "src/types/database.types.ts",
    "partner_universities:",
    "international_scholarships:",
    "credit_transfer_requests:",
    "travel_clearance_passes:"
  )
);

// 3. International Engine & Logic
console.log("\n⚙️  Global Mobility Engine & Seed Data");
check(
  "Global mobility engine file exists",
  fileExists("src/lib/international/international-engine.ts")
);
check(
  "generateTravelClearanceCode and calculateGlobalMobilityOverview exported",
  fileContains(
    "src/lib/international/international-engine.ts",
    "export function generateTravelClearanceCode",
    "export function calculateGlobalMobilityOverview"
  )
);
check(
  "Seed catalogs for universities, scholarships, and travel passes exported",
  fileContains(
    "src/lib/international/international-engine.ts",
    "MOCK_PARTNER_UNIVERSITIES",
    "MOCK_INTERNATIONAL_SCHOLARSHIPS",
    "MOCK_CREDIT_TRANSFERS",
    "MOCK_TRAVEL_PASSES"
  )
);

// 4. API Endpoints
console.log("\n🌐 API Endpoints");
check(
  "Partner universities API route exists with GET & POST",
  fileExists("src/app/api/international/partners/route.ts") &&
    fileContains(
      "src/app/api/international/partners/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "Scholarships API route exists with GET & POST",
  fileExists("src/app/api/international/scholarships/route.ts") &&
    fileContains(
      "src/app/api/international/scholarships/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "Credit transfer API route exists with GET & POST",
  fileExists("src/app/api/international/credits/route.ts") &&
    fileContains(
      "src/app/api/international/credits/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "Travel clearance pass API route exists with GET & POST",
  fileExists("src/app/api/international/clearance/route.ts") &&
    fileContains(
      "src/app/api/international/clearance/route.ts",
      "export async function GET",
      "export async function POST"
    )
);

// 5. UI Components & Portal Page
console.log("\n🎨 UI Components & Portal View");
check(
  "PartnerUniversityCard and GlobalScholarshipCard components exist",
  fileExists("src/components/international/partner-university-card.tsx") &&
    fileExists("src/components/international/global-scholarship-card.tsx")
);
check(
  "CreditTransferModal and TravelClearanceModal components exist",
  fileExists("src/components/international/credit-transfer-modal.tsx") &&
    fileExists("src/components/international/travel-clearance-modal.tsx")
);
check(
  "Dedicated /international portal page exists",
  fileExists("src/app/international/page.tsx") &&
    fileContains(
      "src/app/international/page.tsx",
      "InternationalPortalPage",
      "calculateGlobalMobilityOverview"
    )
);

// 6. Navigation Shell Integration
console.log("\n🧭 Navigation Shell Integration");
check(
  "Sidebar contains International & Exchange link (Phase 29)",
  fileContains(
    "src/components/layout/sidebar.tsx",
    'href: "/international"',
    'badge: "Phase 29"'
  )
);
check(
  "Quick Actions contains International & Global Mobility action item",
  fileContains(
    "src/components/dashboard/quick-actions.tsx",
    'href: "/international"',
    'badge: "Phase 29"'
  )
);
check(
  "Command Palette contains International Scholars entry",
  fileContains(
    "src/components/layout/command-palette.tsx",
    'href: "/international"'
  )
);

console.log("\n" + "═".repeat(60));
console.log(`\nPhase 29 Verification Summary: ${passed} Passed, ${failed} Failed\n`);

if (failed > 0) {
  process.exit(1);
}
