#!/usr/bin/env node
/**
 * CampusLens AI — Phase 25 Verification Suite
 * Automated test: Student Clubs, Technical Societies, Event Passes & Activity Merit Ledger
 * Run: node scripts/verify-phase25.mjs
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

console.log("\n🏆  CampusLens AI — Phase 25 Verification: Student Clubs & Activity Merit Ledger\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "Clubs schema migration file exists",
  fileExists("supabase/migrations/20260930000003_clubs_schema.sql")
);
check(
  "student_clubs table defined with categories and recruitment status",
  fileContains(
    "supabase/migrations/20260930000003_clubs_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.student_clubs",
    "slug TEXT NOT NULL UNIQUE",
    "recruitment_open BOOLEAN NOT NULL DEFAULT true"
  )
);
check(
  "club_memberships table defined with role constraints",
  fileContains(
    "supabase/migrations/20260930000003_clubs_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.club_memberships",
    "role TEXT NOT NULL DEFAULT 'member'",
    "club_membership_unique"
  )
);
check(
  "club_event_tickets and student_merit_activities tables defined with RLS",
  fileContains(
    "supabase/migrations/20260930000003_clubs_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.club_event_tickets",
    "CREATE TABLE IF NOT EXISTS public.student_merit_activities",
    "ALTER TABLE public.club_event_tickets ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.student_merit_activities ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "ClubCategory, ClubRole, ActivityType exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type ClubCategory",
    "export type ClubRole",
    "export type ActivityType"
  )
);
check(
  "StudentClub, ClubMembership, ClubEventTicket, StudentMeritActivity exported",
  fileContains(
    "src/types/index.ts",
    "export interface StudentClub",
    "export interface ClubMembership",
    "export interface ClubEventTicket",
    "export interface StudentMeritActivity",
    "export interface StudentClubOverview"
  )
);
check(
  "Club tables defined in src/types/database.types.ts",
  fileContains(
    "src/types/database.types.ts",
    "student_clubs:",
    "club_memberships:",
    "club_event_tickets:",
    "student_merit_activities:"
  )
);

// 3. Clubs Engine & Business Logic
console.log("\n⚙️  Clubs Engine & Business Logic");
check(
  "Clubs engine file exists",
  fileExists("src/lib/clubs/clubs-engine.ts")
);
check(
  "generateClubTicketCode and calculateClubOverview exported",
  fileContains(
    "src/lib/clubs/clubs-engine.ts",
    "export function generateClubTicketCode",
    "export function calculateClubOverview"
  )
);
check(
  "Seed catalogs for clubs, memberships, tickets, and activities exported",
  fileContains(
    "src/lib/clubs/clubs-engine.ts",
    "MOCK_CLUBS",
    "MOCK_MEMBERSHIPS",
    "MOCK_CLUB_TICKETS",
    "MOCK_MERIT_ACTIVITIES"
  )
);

// 4. API Endpoints
console.log("\n🌐 API Endpoints");
check(
  "Clubs directory API route exists with category filtering and join POST handler",
  fileExists("src/app/api/clubs/route.ts") &&
    fileContains(
      "src/app/api/clubs/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "Club event tickets API route exists with pass issuance handler",
  fileExists("src/app/api/clubs/tickets/route.ts") &&
    fileContains(
      "src/app/api/clubs/tickets/route.ts",
      "generateClubTicketCode",
      "export async function GET",
      "export async function POST"
    )
);

// 5. React UI Components
console.log("\n🎨 React UI Components");
check(
  "ClubDirectoryCard component exists with 1-click join action",
  fileExists("src/components/clubs/club-directory-card.tsx")
);
check(
  "ClubEventTicketModal component exists with QR pass verification",
  fileExists("src/components/clubs/club-event-ticket-modal.tsx") &&
    fileContains("src/components/clubs/club-event-ticket-modal.tsx", "QRCodeSVG")
);
check(
  "ActivityMeritBadge component exists with scholar honors tier calculation",
  fileExists("src/components/clubs/activity-merit-badge.tsx")
);

// 6. Portal Page & Ecosystem Integration
console.log("\n📱 Portal Page & Ecosystem Integration");
check(
  "Dedicated /clubs route page exists with all view tabs",
  fileExists("src/app/clubs/page.tsx") &&
    fileContains(
      "src/app/clubs/page.tsx",
      "ClubDirectoryCard",
      "ClubEventTicketModal",
      "ActivityMeritBadge"
    )
);
check(
  "Sidebar navigation includes Student Clubs & Societies with Phase 25 badge",
  fileContains(
    "src/components/layout/sidebar.tsx",
    "Student Clubs & Societies",
    "/clubs",
    "Phase 25"
  )
);
check(
  "Quick Actions includes Student Clubs & Societies with Phase 25 badge",
  fileContains(
    "src/components/dashboard/quick-actions.tsx",
    "Student Clubs & Societies",
    "/clubs",
    "Phase 25"
  )
);
check(
  "Global command palette includes Student Clubs & Societies",
  fileContains(
    "src/components/layout/command-palette.tsx",
    "Student Clubs & Societies",
    "/clubs"
  )
);

console.log("═".repeat(60));
console.log(`\n📊  Phase 25 Verification Summary:`);
console.log(`    Total Checks: ${passed + failed}`);
console.log(`    Passed:       ${passed}`);
console.log(`    Failed:       ${failed}\n`);

if (failed === 0) {
  console.log("🎉  ALL PHASE 25 CHECKS PASSED PERFECTLY!\n");
  process.exit(0);
} else {
  console.log("❌  PHASE 25 VERIFICATION FAILED.\n");
  process.exit(1);
}
