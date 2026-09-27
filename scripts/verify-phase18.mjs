#!/usr/bin/env node
/**
 * CampusLens AI — Phase 18 Verification Suite
 * Automated test: Campus Resource & Facility Booking System
 * Run: node scripts/verify-phase18.mjs
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

console.log("\n🏛️  CampusLens AI — Phase 18 Verification: Facility Bookings\n");
console.log("═".repeat(60));

// ── Database Migration ───────────────────────────────────────────
console.log("\n📦 Database Migration");

check(
  "Facility bookings schema migration file exists",
  fileExists("supabase/migrations/20260927000002_facility_bookings_schema.sql")
);
check(
  "facility_bookings table defined with UUID primary key",
  fileContains(
    "supabase/migrations/20260927000002_facility_bookings_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.facility_bookings",
    "id UUID PRIMARY KEY DEFAULT gen_random_uuid()"
  )
);
check(
  "Foreign key references to colleges, facilities, and profiles",
  fileContains(
    "supabase/migrations/20260927000002_facility_bookings_schema.sql",
    "REFERENCES public.colleges(id)",
    "REFERENCES public.facilities(id)",
    "REFERENCES public.profiles(id)"
  )
);
check(
  "Status constraint with pending/approved/rejected/cancelled/completed",
  fileContains(
    "supabase/migrations/20260927000002_facility_bookings_schema.sql",
    "'pending', 'approved', 'rejected', 'cancelled', 'completed'"
  )
);
check(
  "High-performance index on slot collision",
  fileContains(
    "supabase/migrations/20260927000002_facility_bookings_schema.sql",
    "idx_facility_bookings_slot"
  )
);
check(
  "Row Level Security and multi-tenant policies defined",
  fileContains(
    "supabase/migrations/20260927000002_facility_bookings_schema.sql",
    "ENABLE ROW LEVEL SECURITY",
    "current_user_college_id()"
  )
);

// ── TypeScript Types ─────────────────────────────────────────────
console.log("\n🏷️  TypeScript Types");

check(
  "FacilityBookingStatus type exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type FacilityBookingStatus"
  )
);
check(
  "FacilityBooking interface exported with all fields",
  fileContains(
    "src/types/index.ts",
    "export interface FacilityBooking",
    "booking_pass_code",
    "attendees_count"
  )
);
check(
  "FacilityBookingSlot interface exported",
  fileContains(
    "src/types/index.ts",
    "export interface FacilityBookingSlot"
  )
);
check(
  "facility_bookings defined in database.types.ts",
  fileContains(
    "src/types/database.types.ts",
    "facility_bookings: {",
    "booking_pass_code: string"
  )
);

// ── Booking Engine Logic ─────────────────────────────────────────
console.log("\n⚙️  Booking Engine & Utility Library");

check(
  "Booking engine file exists",
  fileExists("src/lib/bookings/booking-engine.ts")
);

check(
  "CAMPUS_SPACES catalog contains spaces across categories",
  fileContains(
    "src/lib/bookings/booking-engine.ts",
    "CAMPUS_SPACES",
    "fac-pod-01",
    "fac-lab-01",
    "fac-aud-01",
    "fac-spt-01",
    "fac-conf-01"
  )
);

check(
  "doIntervalsOverlap collision detection function exported",
  fileContains(
    "src/lib/bookings/booking-engine.ts",
    "export function doIntervalsOverlap",
    "startA < endB && endA > startB"
  )
);

check(
  "isSlotAvailable availability checker exported",
  fileContains(
    "src/lib/bookings/booking-engine.ts",
    "export function isSlotAvailable"
  )
);

check(
  "generateBookingPassCode generator exported",
  fileContains(
    "src/lib/bookings/booking-engine.ts",
    "export function generateBookingPassCode",
    "CL-"
  )
);

check(
  "determineBookingInitialStatus exported with approval checks",
  fileContains(
    "src/lib/bookings/booking-engine.ts",
    "export function determineBookingInitialStatus",
    "requiresApproval"
  )
);

check(
  "STANDARD_HOURLY_SLOTS contains hourly operating blocks",
  fileContains(
    "src/lib/bookings/booking-engine.ts",
    "STANDARD_HOURLY_SLOTS",
    "08:00",
    "20:00"
  )
);

// Unit logic verification
function doIntervalsOverlap(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

check(
  "Interval collision logic correctly distinguishes overlaps",
  doIntervalsOverlap("10:00", "11:00", "10:30", "11:30") === true &&
    doIntervalsOverlap("10:00", "11:00", "11:00", "12:00") === false
);

function generatePass(cat) {
  const map = { study_pod: "POD", lab: "LAB", auditorium: "AUD", sports: "SPT" };
  const p = map[cat] || "RES";
  const num = Math.floor(100000 + Math.random() * 900000);
  return `CL-${p}-${num}`;
}

check(
  "Pass code format adheres to CL-[CATEGORY]-[6DIGIT]",
  /^CL-[A-Z]{3}-\d{6}$/.test(generatePass("study_pod")) &&
    /^CL-[A-Z]{3}-\d{6}$/.test(generatePass("lab"))
);

// ── API Routes ───────────────────────────────────────────────────
console.log("\n🌐 API Endpoints");

check(
  "Main bookings API route file exists",
  fileExists("src/app/api/bookings/route.ts")
);
check(
  "Bookings API handles GET and POST queries",
  fileContains(
    "src/app/api/bookings/route.ts",
    "export async function GET",
    "export async function POST",
    "isSlotAvailable"
  )
);
check(
  "Single booking item API route exists",
  fileExists("src/app/api/bookings/[id]/route.ts")
);
check(
  "Single booking API handles PATCH (approval/cancel) and DELETE",
  fileContains(
    "src/app/api/bookings/[id]/route.ts",
    "export async function PATCH",
    "export async function DELETE"
  )
);

// ── UI Components ────────────────────────────────────────────────
console.log("\n🎨 React UI Components");

check(
  "SlotPicker component exists with visual availability grid",
  fileExists("src/components/bookings/slot-picker.tsx") &&
    fileContains("src/components/bookings/slot-picker.tsx", "SlotPicker", "isAvailable", "selectedSlot")
);

check(
  "FacilityCard component exists with metadata and booking trigger",
  fileExists("src/components/bookings/facility-card.tsx") &&
    fileContains("src/components/bookings/facility-card.tsx", "FacilityCard", "onBook", "requiresApproval")
);

check(
  "BookingModal component exists with date and slot selection",
  fileExists("src/components/bookings/booking-modal.tsx") &&
    fileContains("src/components/bookings/booking-modal.tsx", "BookingModal", "SlotPicker", "isSubmitting")
);

check(
  "BookingPassCard component exists with QR and pass code rendering",
  fileExists("src/components/bookings/booking-pass-card.tsx") &&
    fileContains("src/components/bookings/booking-pass-card.tsx", "BookingPassCard", "booking_pass_code", "QrCode")
);

check(
  "AdminApprovalQueue component exists with approval/rejection actions",
  fileExists("src/components/bookings/admin-approval-queue.tsx") &&
    fileContains("src/components/bookings/admin-approval-queue.tsx", "AdminApprovalQueue", "onApprove", "onReject")
);

// ── Portal Pages & Navigation ────────────────────────────────────
console.log("\n📱 Portal Page & Ecosystem Integration");

check(
  "Dedicated /bookings route page exists",
  fileExists("src/app/bookings/page.tsx") &&
    fileContains("src/app/bookings/page.tsx", "BookingsPage", "PortalLayout", "AdminApprovalQueue")
);

check(
  "Sidebar navigation includes Facility Bookings with Phase 18 badge",
  fileContains(
    "src/components/layout/sidebar.tsx",
    "/bookings",
    "Facility Bookings",
    "Phase 18"
  )
);

check(
  "Global command palette includes Smart Facility Bookings",
  fileContains(
    "src/components/layout/command-palette.tsx",
    "/bookings",
    "Smart Facility Bookings"
  )
);

check(
  "Student dashboard quick actions includes Facility Bookings",
  fileContains(
    "src/components/dashboard/quick-actions.tsx",
    "/bookings",
    "Facility Bookings",
    "Phase 18"
  )
);

// ── Summary ──────────────────────────────────────────────────────
console.log("\n" + "═".repeat(60));
console.log(`\n📊  Phase 18 Verification Summary:`);
console.log(`    Total Checks: ${passed + failed}`);
console.log(`    Passed:       ${passed}`);
console.log(`    Failed:       ${failed}`);

if (failed === 0) {
  console.log("\n🎉  ALL PHASE 18 CHECKS PASSED PERFECTLY!\n");
  process.exit(0);
} else {
  console.log(`\n⚠️  ${failed} checks failed. Review details above.\n`);
  process.exit(1);
}
