#!/usr/bin/env node
/**
 * CampusLens AI — Phase 41 Verification Suite
 * Automated test: Smart Campus Mental Health, Psychological Counseling & Peer Support Sanctuary
 * Run: node scripts/verify-phase41.mjs
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

console.log("\n🧠  CampusLens AI — Phase 41 Verification: Mental Health & Counseling Sanctuary\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "Counseling schema migration file exists",
  fileExists("supabase/migrations/20261006000001_counseling_schema.sql")
);
check(
  "counseling_sessions, peer_support_circles, mood_checkins, crisis_helplines defined with RLS",
  fileContains(
    "supabase/migrations/20261006000001_counseling_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.counseling_sessions",
    "CREATE TABLE IF NOT EXISTS public.peer_support_circles",
    "CREATE TABLE IF NOT EXISTS public.mood_checkins",
    "CREATE TABLE IF NOT EXISTS public.crisis_helplines",
    "ALTER TABLE public.counseling_sessions ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.peer_support_circles ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.mood_checkins ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.crisis_helplines ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "CounselingSessionType, CounselingMode, MoodTag exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type CounselingSessionType",
    "export type CounselingStatus",
    "export type CounselingMode",
    "export type CircleTheme",
    "export type MoodTag"
  )
);
check(
  "CounselingSession, PeerSupportCircle, MoodCheckin, CrisisHelpline exported",
  fileContains(
    "src/types/index.ts",
    "export interface CounselingSession",
    "export interface PeerSupportCircle",
    "export interface MoodCheckin",
    "export interface CrisisHelpline",
    "export interface CounselingOverviewStats"
  )
);

// 3. Engine & Mock Data
console.log("\n⚙️  Counseling Engine & Seeds");
check(
  "counseling-engine.ts exists with generators and mock datasets",
  fileExists("src/lib/counseling/counseling-engine.ts") &&
    fileContains(
      "src/lib/counseling/counseling-engine.ts",
      "export function generateSessionCode",
      "export function generateCounselingPassToken",
      "export function calculateCounselingOverview",
      "export const MOCK_COUNSELING_SESSIONS",
      "export const MOCK_PEER_CIRCLES",
      "export const MOCK_MOOD_CHECKINS",
      "export const MOCK_CRISIS_HELPLINES"
    )
);

// 4. API Endpoints
console.log("\n🌐 API Endpoints");
check(
  "GET & POST /api/counseling/sessions appointments",
  fileExists("src/app/api/counseling/sessions/route.ts") &&
    fileContains(
      "src/app/api/counseling/sessions/route.ts",
      "export async function GET",
      "export async function POST",
      "generateSessionCode"
    )
);
check(
  "GET & POST /api/counseling/circles peer support groups",
  fileExists("src/app/api/counseling/circles/route.ts") &&
    fileContains(
      "src/app/api/counseling/circles/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "GET & POST /api/counseling/mood daily emotional check-ins",
  fileExists("src/app/api/counseling/mood/route.ts") &&
    fileContains(
      "src/app/api/counseling/mood/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "GET /api/counseling/helplines emergency lifelines",
  fileExists("src/app/api/counseling/helplines/route.ts") &&
    fileContains(
      "src/app/api/counseling/helplines/route.ts",
      "export async function GET"
    )
);

// 5. UI Components & Portal
console.log("\n🎨 UI Components & Portal");
check(
  "CounselorSessionCard and PeerCircleCard components exist",
  fileExists("src/components/counseling/counselor-session-card.tsx") &&
    fileExists("src/components/counseling/peer-circle-card.tsx")
);
check(
  "BookSessionModal and MoodCheckinModal components exist",
  fileExists("src/components/counseling/book-session-modal.tsx") &&
    fileExists("src/components/counseling/mood-checkin-modal.tsx")
);
check(
  "Counseling Portal page exists at /counseling",
  fileExists("src/app/counseling/page.tsx") &&
    fileContains(
      "src/app/counseling/page.tsx",
      "CounselingPortalPage",
      "CounselorSessionCard",
      "PeerCircleCard"
    )
);

// 6. Navigation Integration
console.log("\n🧭 Navigation Integration");
check(
  "Sidebar links to /counseling with Phase 41 badge",
  fileContains("src/components/layout/sidebar.tsx", 'href: "/counseling"', "Phase 41")
);
check(
  "QuickActions includes Counseling & Mental Health item",
  fileContains("src/components/dashboard/quick-actions.tsx", 'href: "/counseling"', "Phase 41")
);
check(
  "Command Palette includes Counseling item",
  fileContains("src/components/layout/command-palette.tsx", 'href: "/counseling"')
);

console.log("\n" + "═".repeat(60));
console.log(`Total checks: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 Phase 41 Smart Campus Mental Health & Counseling verification passed 100%!\n");
}
