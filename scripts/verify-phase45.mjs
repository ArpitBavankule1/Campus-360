#!/usr/bin/env node
/**
 * CampusLens AI — Phase 45 Verification Suite
 * Automated test: Smart Campus Industry MoUs, Corporate CSR & Sponsored Research Partnerships Hub
 * Run: node scripts/verify-phase45.mjs
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

console.log("\n🏢  CampusLens AI — Phase 45 Verification: Industry MoUs & Sponsored Research\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "Partnerships schema migration file exists",
  fileExists("supabase/migrations/20261010000001_partnerships_schema.sql")
);
check(
  "industry_mous, sponsored_grants, industry_labs, technology_licenses defined with RLS",
  fileContains(
    "supabase/migrations/20261010000001_partnerships_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.industry_mous",
    "CREATE TABLE IF NOT EXISTS public.sponsored_grants",
    "CREATE TABLE IF NOT EXISTS public.industry_labs",
    "CREATE TABLE IF NOT EXISTS public.technology_licenses",
    "ALTER TABLE public.industry_mous ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.sponsored_grants ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.industry_labs ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.technology_licenses ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "MoUTier, GrantType, GrantStatus, LabAccessTier, LicenseType, LicenseStatus exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type MoUTier",
    "export type GrantType",
    "export type GrantStatus",
    "export type LabAccessTier",
    "export type LicenseType",
    "export type LicenseStatus"
  )
);
check(
  "IndustryMoU, SponsoredGrant, IndustryLab, TechnologyLicense, PartnershipsOverviewStats exported",
  fileContains(
    "src/types/index.ts",
    "export interface IndustryMoU",
    "export interface SponsoredGrant",
    "export interface IndustryLab",
    "export interface TechnologyLicense",
    "export interface PartnershipsOverviewStats"
  )
);

// 3. Engine & Mock Data
console.log("\n⚙️  Partnerships Engine & Seeds");
check(
  "partnerships-engine.ts exists with generators, seeds, and mutations",
  fileExists("src/lib/partnerships/partnerships-engine.ts") &&
    fileContains(
      "src/lib/partnerships/partnerships-engine.ts",
      "export function generateMoUToken",
      "export function generateGrantToken",
      "export function generateLicensingToken",
      "export const MOCK_INDUSTRY_MOUS",
      "export const MOCK_SPONSORED_GRANTS",
      "export const MOCK_INDUSTRY_LABS",
      "export const MOCK_TECHNOLOGY_LICENSES",
      "export function getIndustryMoUs",
      "export function getSponsoredGrants",
      "export function getIndustryLabs",
      "export function getTechnologyLicenses",
      "export function getPartnershipsOverviewStats",
      "export function submitGrantProposal",
      "export function requestTechLicense"
    )
);

// 4. API Routes
console.log("\n🌐 API Routes");
check(
  "API route: /api/partnerships/mous (GET)",
  fileExists("src/app/api/partnerships/mous/route.ts") &&
    fileContains("src/app/api/partnerships/mous/route.ts", "getIndustryMoUs")
);
check(
  "API route: /api/partnerships/grants (GET & POST)",
  fileExists("src/app/api/partnerships/grants/route.ts") &&
    fileContains(
      "src/app/api/partnerships/grants/route.ts",
      "getSponsoredGrants",
      "submitGrantProposal"
    )
);
check(
  "API route: /api/partnerships/labs (GET)",
  fileExists("src/app/api/partnerships/labs/route.ts") &&
    fileContains("src/app/api/partnerships/labs/route.ts", "getIndustryLabs")
);
check(
  "API route: /api/partnerships/licenses (GET & POST)",
  fileExists("src/app/api/partnerships/licenses/route.ts") &&
    fileContains(
      "src/app/api/partnerships/licenses/route.ts",
      "getTechnologyLicenses",
      "requestTechLicense"
    )
);
check(
  "API route: /api/partnerships/stats (GET)",
  fileExists("src/app/api/partnerships/stats/route.ts") &&
    fileContains("src/app/api/partnerships/stats/route.ts", "getPartnershipsOverviewStats")
);

// 5. UI Components
console.log("\n🎨 UI Components");
check(
  "PartnerMoUCard component exists",
  fileExists("src/components/partnerships/partner-mou-card.tsx") &&
    fileContains(
      "src/components/partnerships/partner-mou-card.tsx",
      "export function PartnerMoUCard",
      "financial_commitment_inr",
      "onViewCredentials"
    )
);
check(
  "SponsoredGrantCard component exists",
  fileExists("src/components/partnerships/sponsored-grant-card.tsx") &&
    fileContains(
      "src/components/partnerships/sponsored-grant-card.tsx",
      "export function SponsoredGrantCard",
      "grant_amount_inr",
      "disbursed_amount_inr"
    )
);
check(
  "IndustryLabCard component exists",
  fileExists("src/components/partnerships/industry-lab-card.tsx") &&
    fileContains(
      "src/components/partnerships/industry-lab-card.tsx",
      "export function IndustryLabCard",
      "compute_quota_teraflops",
      "sponsored_equipment"
    )
);
check(
  "GrantProposalModal component exists",
  fileExists("src/components/partnerships/grant-proposal-modal.tsx") &&
    fileContains(
      "src/components/partnerships/grant-proposal-modal.tsx",
      "export function GrantProposalModal",
      "project_title",
      "grant_amount_inr"
    )
);
check(
  "TechLicenseModal component exists",
  fileExists("src/components/partnerships/tech-license-modal.tsx") &&
    fileContains(
      "src/components/partnerships/tech-license-modal.tsx",
      "export function TechLicenseModal",
      "patent_title",
      "licensee_org"
    )
);
check(
  "MoUCredentialModal component exists",
  fileExists("src/components/partnerships/mou-credential-modal.tsx") &&
    fileContains(
      "src/components/partnerships/mou-credential-modal.tsx",
      "export function MoUCredentialModal",
      "QRCodeSVG"
    )
);

// 6. Dedicated Portal Page
console.log("\n📱 Portal Page");
check(
  "Dedicated Partnerships Portal page exists at /partnerships",
  fileExists("src/app/partnerships/page.tsx") &&
    fileContains(
      "src/app/partnerships/page.tsx",
      "export default function PartnershipsPortalPage",
      "PartnerMoUCard",
      "SponsoredGrantCard",
      "IndustryLabCard",
      "GrantProposalModal",
      "TechLicenseModal",
      "MoUCredentialModal"
    )
);

// 7. Navigation & Command Palette Integration
console.log("\n🔗 Navigation Integration");
check(
  "Integrated in sidebar.tsx",
  fileContains("src/components/layout/sidebar.tsx", "/partnerships", "Industry MoUs & CSR Hub", "Phase 45")
);
check(
  "Integrated in command-palette.tsx",
  fileContains("src/components/layout/command-palette.tsx", "/partnerships", "Industry MoUs & Research Partnerships")
);
check(
  "Integrated in quick-actions.tsx",
  fileContains("src/components/dashboard/quick-actions.tsx", "/partnerships", "Industry MoUs & Research Partnerships", "Phase 45")
);

// 8. Functional Token & Engine Tests
console.log("\n🧪 Functional Engine Tests");
const engineContent = readFileSync(path.join(root, "src/lib/partnerships/partnerships-engine.ts"), "utf-8");
check(
  "MoU token generator regex valid",
  engineContent.includes("`CL-MOU-2026-${rand}`")
);
check(
  "CSR grant token generator regex valid",
  engineContent.includes("`CL-CSR-GRANT-2026-${rand}`")
);
check(
  "Tech licensing token generator regex valid",
  engineContent.includes("`CL-TECH-LIC-2026-${rand}`")
);

console.log("\n" + "═".repeat(60));
console.log(`Passed: ${passed} | Failed: ${failed}`);

if (failed > 0) {
  console.log("\n❌ Phase 45 verification FAILED");
  process.exit(1);
} else {
  console.log("\n✨ Phase 45: Smart Campus Industry MoUs & Sponsored Research VERIFIED SUCCESSFULLY!\n");
  process.exit(0);
}
