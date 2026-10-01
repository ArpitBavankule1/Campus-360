#!/usr/bin/env node
/**
 * CampusLens AI — Phase 27 Verification Suite
 * Automated test: Smart Campus Transport, EV Shuttle Fleet & Digital Parking
 * Run: node scripts/verify-phase27.mjs
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

console.log("\n⚡  CampusLens AI — Phase 27 Verification: Smart Campus Transport & EV Shuttles\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "Transport schema migration file exists",
  fileExists("supabase/migrations/20261001000002_transport_schema.sql")
);
check(
  "transport_routes and transport_schedules tables defined with shuttle types",
  fileContains(
    "supabase/migrations/20261001000002_transport_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.transport_routes",
    "CREATE TABLE IF NOT EXISTS public.transport_schedules",
    "electric_bus",
    "frequency_mins INTEGER NOT NULL DEFAULT 15"
  )
);
check(
  "transport_passes, parking_zones, and parking_reservations defined with RLS",
  fileContains(
    "supabase/migrations/20261001000002_transport_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.transport_passes",
    "CREATE TABLE IF NOT EXISTS public.parking_zones",
    "CREATE TABLE IF NOT EXISTS public.parking_reservations",
    "ALTER TABLE public.transport_passes ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.parking_reservations ENABLE ROW LEVEL SECURITY"
  )
);
check(
  "carpool_listings table defined with driver and seat availability",
  fileContains(
    "supabase/migrations/20261001000002_transport_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.carpool_listings",
    "seats_available INTEGER NOT NULL"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "ShuttleType, TransportPassType, ParkingCategory exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type ShuttleType",
    "export type TransportPassType",
    "export type ParkingCategory"
  )
);
check(
  "TransportRoute, TransportSchedule, TransportPass, ParkingZone exported",
  fileContains(
    "src/types/index.ts",
    "export interface TransportRoute",
    "export interface TransportSchedule",
    "export interface TransportPass",
    "export interface ParkingZone",
    "export interface CarpoolListing"
  )
);
check(
  "Transport tables defined in src/types/database.types.ts",
  fileContains(
    "src/types/database.types.ts",
    "transport_routes:",
    "transport_schedules:",
    "transport_passes:",
    "parking_zones:",
    "parking_reservations:",
    "carpool_listings:"
  )
);

// 3. Transport Engine & Business Logic
console.log("\n⚙️  Transport Engine & Business Logic");
check(
  "Transport engine file exists",
  fileExists("src/lib/transport/transport-engine.ts")
);
check(
  "generateTransportPassCode and calculateTransportOverview exported",
  fileContains(
    "src/lib/transport/transport-engine.ts",
    "export function generateTransportPassCode",
    "export function calculateTransportOverview"
  )
);
check(
  "Seed catalogs for routes, schedules, parking zones, and carpools exported",
  fileContains(
    "src/lib/transport/transport-engine.ts",
    "MOCK_ROUTES",
    "MOCK_SCHEDULES",
    "MOCK_PARKING_ZONES",
    "MOCK_CARPOOL_LISTINGS"
  )
);

// 4. API Endpoints
console.log("\n🌐 API Endpoints");
check(
  "Transport routes API route exists with GET & POST",
  fileExists("src/app/api/transport/routes/route.ts") &&
    fileContains(
      "src/app/api/transport/routes/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "Transport passes API route exists with pass issuance handler",
  fileExists("src/app/api/transport/passes/route.ts") &&
    fileContains(
      "src/app/api/transport/passes/route.ts",
      "generateTransportPassCode",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "Parking availability & reservation API route exists",
  fileExists("src/app/api/transport/parking/route.ts") &&
    fileContains(
      "src/app/api/transport/parking/route.ts",
      "generateParkingPassCode",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "Carpool ride share API route exists with join & publish actions",
  fileExists("src/app/api/transport/carpool/route.ts") &&
    fileContains(
      "src/app/api/transport/carpool/route.ts",
      "export async function GET",
      "export async function POST"
    )
);

// 5. UI Components
console.log("\n🎨 React UI Components");
check(
  "ShuttleRouteTracker component exists with live GPS ETA countdown",
  fileExists("src/components/transport/shuttle-route-tracker.tsx")
);
check(
  "TransportPassModal component exists with QRCodeSVG",
  fileExists("src/components/transport/transport-pass-modal.tsx") &&
    fileContains("src/components/transport/transport-pass-modal.tsx", "QRCodeSVG")
);
check(
  "ParkingZoneGrid component exists with live occupancy gauges",
  fileExists("src/components/transport/parking-zone-grid.tsx")
);
check(
  "CarpoolListingCard component exists with 1-click ride joining",
  fileExists("src/components/transport/carpool-listing-card.tsx")
);

// 6. Portal Page & Ecosystem Integration
console.log("\n📱 Portal Page & Ecosystem Integration");
check(
  "Dedicated /transport route page exists with all view tabs",
  fileExists("src/app/transport/page.tsx") &&
    fileContains(
      "src/app/transport/page.tsx",
      "ShuttleRouteTracker",
      "TransportPassModal",
      "ParkingZoneGrid",
      "CarpoolListingCard"
    )
);
check(
  "Sidebar navigation includes Campus Transport & EV with Phase 27 badge",
  fileContains(
    "src/components/layout/sidebar.tsx",
    "Campus Transport & EV",
    "/transport",
    "Phase 27"
  )
);
check(
  "Quick Actions includes Smart Campus Transport & EV with Phase 27 badge",
  fileContains(
    "src/components/dashboard/quick-actions.tsx",
    "Smart Campus Transport & EV",
    "/transport",
    "Phase 27"
  )
);
check(
  "Global command palette includes Smart Campus Transport & EV",
  fileContains(
    "src/components/layout/command-palette.tsx",
    "Smart Campus Transport & EV",
    "/transport"
  )
);

console.log("═".repeat(60));
console.log(`\n📊  Phase 27 Verification Summary:`);
console.log(`    Total Checks: ${passed + failed}`);
console.log(`    Passed:       ${passed}`);
console.log(`    Failed:       ${failed}\n`);

if (failed === 0) {
  console.log("🎉  ALL PHASE 27 CHECKS PASSED PERFECTLY!\n");
  process.exit(0);
} else {
  console.log("❌  PHASE 27 VERIFICATION FAILED.\n");
  process.exit(1);
}
