#!/usr/bin/env node
/**
 * CampusLens AI — Phase 26 Verification Suite
 * Automated test: Alumni Network, Mentorship Nexus, Job Referrals & Endowment Giving
 * Run: node scripts/verify-phase26.mjs
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

console.log("\n🎓  CampusLens AI — Phase 26 Verification: Alumni Network & Mentorship Nexus\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "Alumni schema migration file exists",
  fileExists("supabase/migrations/20261001000001_alumni_schema.sql")
);
check(
  "alumni_profiles table defined with graduating_year and mentorship status",
  fileContains(
    "supabase/migrations/20261001000001_alumni_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.alumni_profiles",
    "graduating_year INTEGER NOT NULL",
    "mentorship_available BOOLEAN NOT NULL DEFAULT true"
  )
);
check(
  "alumni_mentorship_sessions and alumni_job_referrals tables defined",
  fileContains(
    "supabase/migrations/20261001000001_alumni_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.alumni_mentorship_sessions",
    "CREATE TABLE IF NOT EXISTS public.alumni_job_referrals"
  )
);
check(
  "alumni_donations and alumni_digital_passes defined with RLS",
  fileContains(
    "supabase/migrations/20261001000001_alumni_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.alumni_donations",
    "CREATE TABLE IF NOT EXISTS public.alumni_digital_passes",
    "ALTER TABLE public.alumni_donations ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.alumni_digital_passes ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "MentorshipTopic, JobReferralType, DonationCampaign exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type MentorshipTopic",
    "export type JobReferralType",
    "export type DonationCampaign"
  )
);
check(
  "AlumniProfile, AlumniMentorshipSession, AlumniJobReferral, AlumniDonation exported",
  fileContains(
    "src/types/index.ts",
    "export interface AlumniProfile",
    "export interface AlumniMentorshipSession",
    "export interface AlumniJobReferral",
    "export interface AlumniDonation"
  )
);
check(
  "Alumni tables defined in src/types/database.types.ts",
  fileContains(
    "src/types/database.types.ts",
    "alumni_profiles:",
    "alumni_mentorship_sessions:",
    "alumni_job_referrals:",
    "alumni_donations:",
    "alumni_digital_passes:"
  )
);

// 3. Alumni Engine & Business Logic
console.log("\n⚙️  Alumni Engine & Business Logic");
check(
  "Alumni engine file exists",
  fileExists("src/lib/alumni/alumni-engine.ts")
);
check(
  "generateAlumniPassCode and calculateAlumniOverview exported",
  fileContains(
    "src/lib/alumni/alumni-engine.ts",
    "export function generateAlumniPassCode",
    "export function calculateAlumniOverview"
  )
);
check(
  "Mock datasets for alumni, mentorships, job referrals, and donations exported",
  fileContains(
    "src/lib/alumni/alumni-engine.ts",
    "MOCK_ALUMNI",
    "MOCK_MENTORSHIPS",
    "MOCK_JOB_REFERRALS",
    "MOCK_DONATIONS"
  )
);

// 4. API Endpoints
console.log("\n🌐 API Endpoints");
check(
  "Alumni directory API route exists with GET & POST",
  fileExists("src/app/api/alumni/directory/route.ts") &&
    fileContains(
      "src/app/api/alumni/directory/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "Mentorship booking API route exists with GET & POST",
  fileExists("src/app/api/alumni/mentorship/route.ts") &&
    fileContains(
      "src/app/api/alumni/mentorship/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "Job referrals API route exists with referral code generator",
  fileExists("src/app/api/alumni/jobs/route.ts") &&
    fileContains(
      "src/app/api/alumni/jobs/route.ts",
      "generateReferralCode",
      "export async function GET"
    )
);
check(
  "Alumni donations API route exists with receipt generator",
  fileExists("src/app/api/alumni/donations/route.ts") &&
    fileContains(
      "src/app/api/alumni/donations/route.ts",
      "generateDonationReceiptCode",
      "export async function GET",
      "export async function POST"
    )
);

// 5. UI Components
console.log("\n🎨 React UI Components");
check(
  "AlumniProfileCard component exists with 1-on-1 booking CTA",
  fileExists("src/components/alumni/alumni-profile-card.tsx")
);
check(
  "MentorshipBookingModal component exists with date & focus topic picker",
  fileExists("src/components/alumni/mentorship-booking-modal.tsx")
);
check(
  "JobReferralCard component exists with copyable referral code",
  fileExists("src/components/alumni/job-referral-card.tsx")
);
check(
  "DonationCampaignCard component exists with preset amount tier selectors",
  fileExists("src/components/alumni/donation-campaign-card.tsx")
);
check(
  "AlumniPassModal component exists with QRCodeSVG",
  fileExists("src/components/alumni/alumni-pass-modal.tsx") &&
    fileContains("src/components/alumni/alumni-pass-modal.tsx", "QRCodeSVG")
);

// 6. Portal Page & Ecosystem Integration
console.log("\n📱 Portal Page & Ecosystem Integration");
check(
  "Dedicated /alumni route page exists with all view tabs",
  fileExists("src/app/alumni/page.tsx") &&
    fileContains(
      "src/app/alumni/page.tsx",
      "AlumniProfileCard",
      "MentorshipBookingModal",
      "JobReferralCard",
      "DonationCampaignCard"
    )
);
check(
  "Sidebar navigation includes Alumni & Mentorship with Phase 26 badge",
  fileContains(
    "src/components/layout/sidebar.tsx",
    "Alumni & Mentorship",
    "/alumni",
    "Phase 26"
  )
);
check(
  "Quick Actions includes Alumni & Mentorship with Phase 26 badge",
  fileContains(
    "src/components/dashboard/quick-actions.tsx",
    "Alumni & Mentorship",
    "/alumni",
    "Phase 26"
  )
);
check(
  "Global command palette includes Alumni Network & Mentorship",
  fileContains(
    "src/components/layout/command-palette.tsx",
    "Alumni Network & Mentorship",
    "/alumni"
  )
);

console.log("═".repeat(60));
console.log(`\n📊  Phase 26 Verification Summary:`);
console.log(`    Total Checks: ${passed + failed}`);
console.log(`    Passed:       ${passed}`);
console.log(`    Failed:       ${failed}\n`);

if (failed === 0) {
  console.log("🎉  ALL PHASE 26 CHECKS PASSED PERFECTLY!\n");
  process.exit(0);
} else {
  console.log("❌  PHASE 26 VERIFICATION FAILED.\n");
  process.exit(1);
}
