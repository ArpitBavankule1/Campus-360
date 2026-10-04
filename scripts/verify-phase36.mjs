#!/usr/bin/env node
/**
 * CampusLens AI — Phase 36 Verification Suite
 * Automated test: Smart Campus Auditorium, Cultural Convention Center & Event Ticketing
 * Run: node scripts/verify-phase36.mjs
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

console.log("\n🎭  CampusLens AI — Phase 36 Verification: Smart Auditorium & Convention Hub\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "Auditorium schema migration file exists",
  fileExists("supabase/migrations/20261004000002_auditorium_schema.sql")
);
check(
  "auditorium_halls, reservations, tickets, equipment riders defined with RLS",
  fileContains(
    "supabase/migrations/20261004000002_auditorium_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.auditorium_halls",
    "CREATE TABLE IF NOT EXISTS public.auditorium_reservations",
    "CREATE TABLE IF NOT EXISTS public.auditorium_event_tickets",
    "CREATE TABLE IF NOT EXISTS public.stage_equipment_riders",
    "ALTER TABLE public.auditorium_halls ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.auditorium_reservations ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.auditorium_event_tickets ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.stage_equipment_riders ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "AuditoriumStatus, SeatTier, StageEquipmentType exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type AuditoriumStatus",
    "export type SeatTier",
    "export type StageEquipmentType"
  )
);
check(
  "AuditoriumHall, AuditoriumReservation, EventTicket, StageEquipmentRider exported",
  fileContains(
    "src/types/index.ts",
    "export interface AuditoriumHall",
    "export interface AuditoriumReservation",
    "export interface EventTicket",
    "export interface StageEquipmentRider",
    "export interface AuditoriumOverviewStats"
  )
);

// 3. Engine & Mock Data
console.log("\n⚙️  Auditorium Engine & Seeds");
check(
  "auditorium-engine.ts exists with generators and mock datasets",
  fileExists("src/lib/auditorium/auditorium-engine.ts") &&
    fileContains(
      "src/lib/auditorium/auditorium-engine.ts",
      "export function generateAuditoriumBookingCode",
      "export function generateEventTicketCode",
      "export function calculateAuditoriumOverview",
      "export const MOCK_AUDITORIUM_HALLS",
      "export const MOCK_AUDITORIUM_RESERVATIONS",
      "export const MOCK_EVENT_TICKETS",
      "export const MOCK_STAGE_EQUIPMENT_RIDERS"
    )
);

// 4. API Endpoints
console.log("\n🌐 API Endpoints");
check(
  "GET & POST /api/auditorium/venues halls directory",
  fileExists("src/app/api/auditorium/venues/route.ts") &&
    fileContains(
      "src/app/api/auditorium/venues/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "GET & POST /api/auditorium/bookings stage reservation",
  fileExists("src/app/api/auditorium/bookings/route.ts") &&
    fileContains(
      "src/app/api/auditorium/bookings/route.ts",
      "export async function GET",
      "export async function POST",
      "generateAuditoriumBookingCode"
    )
);
check(
  "GET & POST /api/auditorium/tickets admittance pass",
  fileExists("src/app/api/auditorium/tickets/route.ts") &&
    fileContains(
      "src/app/api/auditorium/tickets/route.ts",
      "export async function GET",
      "export async function POST",
      "generateEventTicketCode"
    )
);
check(
  "GET & POST /api/auditorium/equipment AV riders",
  fileExists("src/app/api/auditorium/equipment/route.ts") &&
    fileContains(
      "src/app/api/auditorium/equipment/route.ts",
      "export async function GET",
      "export async function POST"
    )
);

// 5. UI Components & Pages
console.log("\n🎨 UI Components & Portal");
check(
  "AuditoriumVenueCard and EventTicketCard components exist",
  fileExists("src/components/auditorium/auditorium-venue-card.tsx") &&
    fileExists("src/components/auditorium/event-ticket-card.tsx")
);
check(
  "BookHallModal and StageEquipmentModal components exist",
  fileExists("src/components/auditorium/book-hall-modal.tsx") &&
    fileExists("src/components/auditorium/stage-equipment-modal.tsx")
);
check(
  "Auditorium Portal page exists at /auditorium",
  fileExists("src/app/auditorium/page.tsx") &&
    fileContains(
      "src/app/auditorium/page.tsx",
      "AuditoriumPortalPage",
      "BookHallModal",
      "StageEquipmentModal"
    )
);

// 6. Navigation Integration
console.log("\n🧭 Navigation Integration");
check(
  "Sidebar links to /auditorium with Phase 36 badge",
  fileContains("src/components/layout/sidebar.tsx", 'href: "/auditorium"', "Phase 36")
);
check(
  "QuickActions includes Auditorium Event Ticketing item",
  fileContains("src/components/dashboard/quick-actions.tsx", 'href: "/auditorium"', "Phase 36")
);
check(
  "Command Palette includes Auditorium item",
  fileContains("src/components/layout/command-palette.tsx", 'href: "/auditorium"')
);

console.log("\n" + "═".repeat(60));
console.log(`Total checks: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 Phase 36 Smart Auditorium & Convention Hub verification passed 100%!\n");
}
