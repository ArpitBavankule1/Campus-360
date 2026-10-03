#!/usr/bin/env node
/**
 * CampusLens AI — Phase 32 Verification Suite
 * Automated test: Smart Campus Sports Arena, Athletic Leagues & Gym
 * Run: node scripts/verify-phase32.mjs
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

console.log("\n🏆  CampusLens AI — Phase 32 Verification: Sports Arena & Athletics\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "Sports schema migration file exists",
  fileExists("supabase/migrations/20261003000001_sports_schema.sql")
);
check(
  "sports_arenas table defined with surface, floodlit and status",
  fileContains(
    "supabase/migrations/20261003000001_sports_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.sports_arenas",
    "sport_type TEXT NOT NULL CHECK",
    "court_surface TEXT NOT NULL",
    "is_floodlit BOOLEAN"
  )
);
check(
  "athletic_leagues, gym_memberships, equipment_loans defined with RLS",
  fileContains(
    "supabase/migrations/20261003000001_sports_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.athletic_leagues",
    "CREATE TABLE IF NOT EXISTS public.gym_memberships",
    "CREATE TABLE IF NOT EXISTS public.equipment_loans",
    "ALTER TABLE public.sports_arenas ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.athletic_leagues ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.gym_memberships ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.equipment_loans ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "SportType, ArenaStatus, GymMembershipTier exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type SportType",
    "export type ArenaStatus",
    "export type GymMembershipTier"
  )
);
check(
  "SportsArena, AthleticLeague, GymMembership, EquipmentLoan exported",
  fileContains(
    "src/types/index.ts",
    "export interface SportsArena",
    "export interface AthleticLeague",
    "export interface GymMembership",
    "export interface EquipmentLoan",
    "export interface SportsOverviewStats"
  )
);

// 3. Engine & Mock Data
console.log("\n⚙️  Sports Engine & Seeds");
check(
  "sports-engine.ts exists with generators and mock data",
  fileExists("src/lib/sports/sports-engine.ts") &&
    fileContains(
      "src/lib/sports/sports-engine.ts",
      "export function generateGymPassCode",
      "export function generateEquipmentCode",
      "export function calculateSportsOverview",
      "export const MOCK_SPORTS_ARENAS",
      "export const MOCK_ATHLETIC_LEAGUES",
      "export const MOCK_GYM_MEMBERS",
      "export const MOCK_EQUIPMENT_LOANS"
    )
);

// 4. API Endpoints
console.log("\n🌐 API Endpoints");
check(
  "GET /api/sports/arenas & court reservation POST",
  fileExists("src/app/api/sports/arenas/route.ts") &&
    fileContains(
      "src/app/api/sports/arenas/route.ts",
      "export async function GET",
      "export async function POST",
      "containsSQLInjection",
      "RES-COURT-2026-"
    )
);
check(
  "GET & POST /api/sports/leagues team entry",
  fileExists("src/app/api/sports/leagues/route.ts") &&
    fileContains(
      "src/app/api/sports/leagues/route.ts",
      "export async function GET",
      "export async function POST",
      "REG-TEAM-2026-"
    )
);
check(
  "GET & POST /api/sports/gym biometric pass",
  fileExists("src/app/api/sports/gym/route.ts") &&
    fileContains(
      "src/app/api/sports/gym/route.ts",
      "export async function GET",
      "export async function POST",
      "generateGymPassCode"
    )
);
check(
  "GET & POST /api/sports/equipment loan checkout",
  fileExists("src/app/api/sports/equipment/route.ts") &&
    fileContains(
      "src/app/api/sports/equipment/route.ts",
      "export async function GET",
      "export async function POST",
      "generateEquipmentCode"
    )
);

// 5. UI Components & Pages
console.log("\n🎨 UI Components & Portal");
check(
  "ArenaBookingCard and AthleticMatchCard components exist",
  fileExists("src/components/sports/arena-booking-card.tsx") &&
    fileExists("src/components/sports/athletic-match-card.tsx")
);
check(
  "CourtReservationModal and GymPassModal components exist with QR support",
  fileExists("src/components/sports/court-reservation-modal.tsx") &&
    fileExists("src/components/sports/gym-pass-modal.tsx") &&
    fileContains("src/components/sports/court-reservation-modal.tsx", "QRCodeSVG") &&
    fileContains("src/components/sports/gym-pass-modal.tsx", "QRCodeSVG")
);
check(
  "Sports Portal page exists at /sports",
  fileExists("src/app/sports/page.tsx") &&
    fileContains("src/app/sports/page.tsx", "SportsPortalPage", "CourtReservationModal", "GymPassModal")
);

// 6. Navigation Integration
console.log("\n🧭 Navigation Integration");
check(
  "Sidebar links to /sports with Phase 32 badge",
  fileContains("src/components/layout/sidebar.tsx", 'href: "/sports"', "Phase 32")
);
check(
  "QuickActions includes Sports Arena item",
  fileContains("src/components/dashboard/quick-actions.tsx", 'href: "/sports"', "Phase 32")
);
check(
  "Command Palette includes Sports Complex item",
  fileContains("src/components/layout/command-palette.tsx", 'href: "/sports"')
);

console.log("\n" + "═".repeat(60));
console.log(`Total checks: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 Phase 32 Sports Arena & Athletics verification passed 100%!\n");
}
