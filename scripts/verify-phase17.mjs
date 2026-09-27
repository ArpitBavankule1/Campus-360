#!/usr/bin/env node
/**
 * CampusLens AI — Phase 17 Verification Suite
 * Automated test: QR Lecture Check-In & Attendance System
 * Run: node scripts/verify-phase17.mjs
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

console.log("\n🎓 CampusLens AI — Phase 17 Verification: QR Lecture Check-In\n");
console.log("═".repeat(60));

// ── Database Migration ───────────────────────────────────────────
console.log("\n📦 Database Migration");

check(
  "Attendance schema migration file exists",
  fileExists("supabase/migrations/20260927000001_attendance_schema.sql")
);
check(
  "attendance_sessions table defined",
  fileContains(
    "supabase/migrations/20260927000001_attendance_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.attendance_sessions"
  )
);
check(
  "attendance_records table defined",
  fileContains(
    "supabase/migrations/20260927000001_attendance_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.attendance_records"
  )
);
check(
  "RLS policies defined for attendance_sessions",
  fileContains(
    "supabase/migrations/20260927000001_attendance_schema.sql",
    "ENABLE ROW LEVEL SECURITY",
    "attendance_sessions_select_any_auth"
  )
);
check(
  "RLS policies defined for attendance_records",
  fileContains(
    "supabase/migrations/20260927000001_attendance_schema.sql",
    "attendance_records_insert_self",
    "attendance_records_select_self"
  )
);
check(
  "Indexes created for performance",
  fileContains(
    "supabase/migrations/20260927000001_attendance_schema.sql",
    "idx_attendance_sessions_faculty",
    "idx_attendance_records_student"
  )
);
check(
  "updated_at trigger defined",
  fileContains(
    "supabase/migrations/20260927000001_attendance_schema.sql",
    "trg_attendance_sessions_updated_at",
    "trg_attendance_records_updated_at"
  )
);

// ── Library Utilities ────────────────────────────────────────────
console.log("\n🔧 Library Utilities");

check(
  "QR token generator exists",
  fileExists("src/lib/attendance/qr-generator.ts")
);
check(
  "generateLectureToken function exported",
  fileContains(
    "src/lib/attendance/qr-generator.ts",
    "export function generateLectureToken"
  )
);
check(
  "encodeSessionPayload & decodeSessionPayload exported",
  fileContains(
    "src/lib/attendance/qr-generator.ts",
    "export function encodeSessionPayload",
    "export function decodeSessionPayload"
  )
);
check(
  "Session verifier exists",
  fileExists("src/lib/attendance/verify-session.ts")
);
check(
  "Geofence validation implemented",
  fileContains(
    "src/lib/attendance/verify-session.ts",
    "campusBounds",
    "inBounds"
  )
);

// ── API Routes ───────────────────────────────────────────────────
console.log("\n🌐 API Routes");

check(
  "Check-in API route exists",
  fileExists("src/app/api/attendance/check-in/route.ts")
);
check(
  "Check-in API handles POST method",
  fileContains(
    "src/app/api/attendance/check-in/route.ts",
    "export async function POST"
  )
);
check(
  "Check-in API decodes QR token",
  fileContains(
    "src/app/api/attendance/check-in/route.ts",
    "decodeSessionPayload"
  )
);
check(
  "Check-in API validates expiry",
  fileContains(
    "src/app/api/attendance/check-in/route.ts",
    "token.expiresAt",
    "410"
  )
);
check(
  "Check-in API performs geofence check",
  fileContains(
    "src/app/api/attendance/check-in/route.ts",
    "CAMPUS_BOUNDS",
    "inBounds"
  )
);
check(
  "Check-in API requires authentication",
  fileContains(
    "src/app/api/attendance/check-in/route.ts",
    "auth.getUser",
    "401"
  )
);
check(
  "Check-in API uses upsert to prevent duplicates",
  fileContains(
    "src/app/api/attendance/check-in/route.ts",
    "upsert",
    "onConflict"
  )
);
check(
  "Session creation API route exists",
  fileExists("src/app/api/attendance/session/route.ts")
);
check(
  "Session API generates QR token",
  fileContains(
    "src/app/api/attendance/session/route.ts",
    "generateLectureToken",
    "encodeSessionPayload"
  )
);

// ── React Components ─────────────────────────────────────────────
console.log("\n🎨 React Components");

check(
  "QrCodeDisplay component exists",
  fileExists("src/components/attendance/qr-code-display.tsx")
);
check(
  "QrCodeDisplay uses dynamic import for qrcode.react",
  fileContains(
    "src/components/attendance/qr-code-display.tsx",
    "import(\"qrcode.react\")",
    "QRCodeSVG"
  )
);
check(
  "FacultyQrGenerator component exists",
  fileExists("src/components/attendance/faculty-qr-generator.tsx")
);
check(
  "FacultyQrGenerator has countdown timer logic",
  fileContains(
    "src/components/attendance/faculty-qr-generator.tsx",
    "secondsLeft",
    "expiresAt",
    "formatTime"
  )
);
check(
  "FacultyQrGenerator has progress bar",
  fileContains(
    "src/components/attendance/faculty-qr-generator.tsx",
    "progressPct",
    "w-full bg-muted"
  )
);
check(
  "FacultyQrGenerator shows expired state",
  fileContains(
    "src/components/attendance/faculty-qr-generator.tsx",
    "isExpired",
    "Regenerate Session"
  )
);
check(
  "StudentAttendanceHistory component exists",
  fileExists("src/components/attendance/student-attendance-history.tsx")
);
check(
  "Attendance history shows risk percentages",
  fileContains(
    "src/components/attendance/student-attendance-history.tsx",
    "At Risk",
    "75",
    "const pct ="
  )
);

// ── Pages ────────────────────────────────────────────────────────
console.log("\n📄 Pages");

check(
  "Student attendance page exists at /attendance",
  fileExists("src/app/attendance/page.tsx")
);
check(
  "Attendance page has check-in tab",
  fileContains(
    "src/app/attendance/page.tsx",
    "activeTab === \"checkin\"",
    "qrInput"
  )
);
check(
  "Attendance page has history tab",
  fileContains(
    "src/app/attendance/page.tsx",
    "activeTab === \"history\"",
    "StudentAttendanceHistory"
  )
);
check(
  "Attendance page has geofence toggle",
  fileContains(
    "src/app/attendance/page.tsx",
    "requestLocation",
    "locationEnabled"
  )
);
check(
  "Attendance page has demo quick-load tokens",
  fileContains(
    "src/app/attendance/page.tsx",
    "DEMO_QUICK_TOKENS",
    "handleDemoToken"
  )
);
check(
  "Attendance page calls check-in API",
  fileContains(
    "src/app/attendance/page.tsx",
    "/api/attendance/check-in",
    "fetch"
  )
);

// ── Navigation ───────────────────────────────────────────────────
console.log("\n🧭 Navigation & Integration");

check(
  "Attendance link added to sidebar",
  fileContains(
    "src/components/layout/sidebar.tsx",
    "/attendance",
    "ScanLine"
  )
);
check(
  "FacultyQrGenerator integrated into Faculty Teaching Hub",
  fileContains(
    "src/app/faculty/page.tsx",
    "FacultyQrGenerator",
    "@/components/attendance/faculty-qr-generator"
  )
);

// ── npm packages ─────────────────────────────────────────────────
console.log("\n📦 NPM Packages");

check(
  "qrcode.react installed",
  fileContains("package.json", "qrcode.react")
);

// ── Summary ──────────────────────────────────────────────────────
console.log("\n" + "═".repeat(60));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log("🎉 Phase 17 QR Lecture Check-In: ALL CHECKS PASSED!\n");
  process.exit(0);
} else {
  console.log(`⚠️  ${failed} check(s) failed. Review the output above.\n`);
  process.exit(1);
}
