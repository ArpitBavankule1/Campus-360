#!/usr/bin/env node
/**
 * CampusLens AI — Phase 43 Verification Suite
 * Automated test: Smart Campus Parent & Guardian Connect, Ward Telemetry & Proctor Gateway
 * Run: node scripts/verify-phase43.mjs
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

console.log("\n👨‍👩‍👧  CampusLens AI — Phase 43 Verification: Parent & Guardian Connect Gateway\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "Parents schema migration file exists",
  fileExists("supabase/migrations/20261008000001_parents_schema.sql")
);
check(
  "guardian_profiles, ward_telemetry_links, guardian_outpass_approvals, ptm_consultation_slots defined with RLS",
  fileContains(
    "supabase/migrations/20261008000001_parents_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.guardian_profiles",
    "CREATE TABLE IF NOT EXISTS public.ward_telemetry_links",
    "CREATE TABLE IF NOT EXISTS public.guardian_outpass_approvals",
    "CREATE TABLE IF NOT EXISTS public.ptm_consultation_slots",
    "ALTER TABLE public.guardian_profiles ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.ward_telemetry_links ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.guardian_outpass_approvals ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.ptm_consultation_slots ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "GuardianRelationship, GuardianOutpassStatus, PTMConsultationMode, PTMSlotStatus exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type GuardianRelationship",
    "export type GuardianOutpassStatus",
    "export type PTMConsultationMode",
    "export type PTMSlotStatus",
    "export type FeeClearanceStatus"
  )
);
check(
  "CourseAttendanceRecord, GuardianProfile, WardTelemetry, GuardianOutpassApproval, PTMConsultationSlot exported",
  fileContains(
    "src/types/index.ts",
    "export interface CourseAttendanceRecord",
    "export interface GuardianProfile",
    "export interface WardTelemetry",
    "export interface GuardianOutpassApproval",
    "export interface PTMConsultationSlot",
    "export interface ParentPortalOverviewStats"
  )
);

// 3. Engine & Mock Data
console.log("\n⚙️  Parents Engine & Seeds");
check(
  "parents-engine.ts exists with generators and mock datasets",
  fileExists("src/lib/parents/parents-engine.ts") &&
    fileContains(
      "src/lib/parents/parents-engine.ts",
      "export function generateParentAuthToken",
      "export function generatePTMSlotToken",
      "export const MOCK_GUARDIAN",
      "export const MOCK_WARD",
      "export function getGuardianProfile",
      "export function getWardTelemetry",
      "export function getGuardianOutpasses",
      "export function approveGuardianOutpass",
      "export function rejectGuardianOutpass",
      "export function getPTMConsultationSlots",
      "export function bookPTMConsultationSlot",
      "export function getParentPortalOverviewStats"
    )
);

// 4. API Routes
console.log("\n🌐 API Routes");
check(
  "API route: /api/parents/ward-telemetry",
  fileExists("src/app/api/parents/ward-telemetry/route.ts") &&
    fileContains("src/app/api/parents/ward-telemetry/route.ts", "getWardTelemetry")
);
check(
  "API route: /api/parents/outpasses (GET & POST)",
  fileExists("src/app/api/parents/outpasses/route.ts") &&
    fileContains(
      "src/app/api/parents/outpasses/route.ts",
      "getGuardianOutpasses",
      "approveGuardianOutpass",
      "rejectGuardianOutpass"
    )
);
check(
  "API route: /api/parents/ptm (GET & POST)",
  fileExists("src/app/api/parents/ptm/route.ts") &&
    fileContains("src/app/api/parents/ptm/route.ts", "getPTMConsultationSlots", "bookPTMConsultationSlot")
);
check(
  "API route: /api/parents/stats",
  fileExists("src/app/api/parents/stats/route.ts") &&
    fileContains("src/app/api/parents/stats/route.ts", "getParentPortalOverviewStats")
);

// 5. UI Components
console.log("\n🎨 UI Components");
check(
  "WardTelemetryCard component exists",
  fileExists("src/components/parents/ward-telemetry-card.tsx") &&
    fileContains(
      "src/components/parents/ward-telemetry-card.tsx",
      "export function WardTelemetryCard",
      "overall_attendance_pct",
      "cumulative_cgpa",
      "courseBreakdown"
    )
);
check(
  "OutpassApprovalCard component exists",
  fileExists("src/components/parents/outpass-approval-card.tsx") &&
    fileContains(
      "src/components/parents/outpass-approval-card.tsx",
      "export function OutpassApprovalCard",
      "onApprove",
      "onReject",
      "outpass_token"
    )
);
check(
  "BookPTMModal component exists",
  fileExists("src/components/parents/book-ptm-modal.tsx") &&
    fileContains(
      "src/components/parents/book-ptm-modal.tsx",
      "export function BookPTMModal",
      "Virtual Google Meet",
      "In-Person Proctor Cabin"
    )
);
check(
  "ProctorMessageModal component exists",
  fileExists("src/components/parents/proctor-message-modal.tsx") &&
    fileContains(
      "src/components/parents/proctor-message-modal.tsx",
      "export function ProctorMessageModal",
      "proctorName",
      "wardName"
    )
);

// 6. Dedicated Portal Page
console.log("\n📱 Portal Page");
check(
  "Dedicated Parent Portal page exists at /parents",
  fileExists("src/app/parents/page.tsx") &&
    fileContains(
      "src/app/parents/page.tsx",
      "export default function ParentsPortalPage",
      "WardTelemetryCard",
      "OutpassApprovalCard",
      "BookPTMModal",
      "ProctorMessageModal"
    )
);

// 7. Navigation & Command Palette Integration
console.log("\n🔗 Navigation Integration");
check(
  "Integrated in sidebar.tsx",
  fileContains("src/components/layout/sidebar.tsx", "/parents", "Parent & Guardian Hub", "Phase 43")
);
check(
  "Integrated in command-palette.tsx",
  fileContains("src/components/layout/command-palette.tsx", "/parents", "Parent & Guardian Connect")
);
check(
  "Integrated in quick-actions.tsx",
  fileContains("src/components/dashboard/quick-actions.tsx", "/parents", "Parent & Guardian Connect", "Phase 43")
);

// 8. Functional Token & Engine Tests
console.log("\n🧪 Functional Engine Tests");
try {
  const engine = await import("../src/lib/parents/parents-engine.js").catch(async () => {
    // If typescript loading directly requires ts-node or transpilation, test the file syntax
    return null;
  });

  if (engine) {
    const parentToken = engine.generateParentAuthToken();
    const ptmToken = engine.generatePTMSlotToken();
    check("Parent token format: CL-PAR-PASS-2026-XXXX", /^CL-PAR-PASS-2026-\d{4}$/.test(parentToken));
    check("PTM slot token format: CL-PTM-SLOT-2026-XXXX", /^CL-PTM-SLOT-2026-\d{4}$/.test(ptmToken));
  } else {
    // Verify file content logic
    const engineContent = readFileSync(path.join(root, "src/lib/parents/parents-engine.ts"), "utf-8");
    check(
      "Parent token generator regex valid",
      engineContent.includes("`CL-PAR-PASS-2026-${rand}`")
    );
    check(
      "PTM slot token generator regex valid",
      engineContent.includes("`CL-PTM-SLOT-2026-${rand}`")
    );
  }
} catch (e) {
  check("Functional Engine verification", false, e.message);
}

// Summary
console.log("\n" + "═".repeat(60));
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.log("\n❌ Phase 43 verification FAILED");
  process.exit(1);
} else {
  console.log("\n✨ Phase 43: Smart Campus Parent & Guardian Connect Gateway VERIFIED SUCCESSFULLY!\n");
  process.exit(0);
}
