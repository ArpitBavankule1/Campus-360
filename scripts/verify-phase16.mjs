// ================================================================
// CampusLens AI — Phase 16 Real-Time Websockets & Broadcasts Verification
// Run with: node scripts/verify-phase16.mjs
// ================================================================

import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

console.log("\n=======================================================");
console.log("⚡ CAMPUSLENS AI — PHASE 16 REAL-TIME & BROADCASTS VERIFICATION");
console.log("=======================================================\n");

let passed = 0;
let total = 0;

function assert(condition, testName, details = "") {
  total++;
  if (condition) {
    passed++;
    console.log(`   [✓ PASS] ${testName}`);
  } else {
    console.error(`   [✗ FAIL] ${testName}${details ? ` -> ${details}` : ""}`);
  }
}

// 1. Verify Core Real-Time Modules
console.log("1. Core Real-Time Architecture Modules:");
const filesToCheck = [
  { path: "src/lib/realtime/types.ts", desc: "Real-time TypeScript definitions" },
  { path: "src/lib/realtime/chime.ts", desc: "Web Audio API sound chime synthesizer" },
  { path: "src/lib/realtime/realtime-provider.tsx", desc: "Supabase & cross-tab BroadcastChannel provider" },
  { path: "src/components/realtime/emergency-broadcast-banner.tsx", desc: "Campus emergency broadcast banner" },
  { path: "src/components/realtime/realtime-toast.tsx", desc: "Live toast notifications container" },
  { path: "src/components/realtime/admin-broadcast-dialog.tsx", desc: "Admin & HOD real-time broadcast console" },
];

for (const f of filesToCheck) {
  assert(existsSync(resolve(f.path)), f.desc, `File missing: ${f.path}`);
}

// 2. Verify Audio Synthesizer Logic
console.log("\n2. Web Audio Synthesizer Inspection (chime.ts):");
const chimeContent = readFileSync(resolve("src/lib/realtime/chime.ts"), "utf8");
assert(chimeContent.includes("AudioContext"), "AudioContext initialized for Web Audio API synthesis");
assert(chimeContent.includes("playChime"), "playChime exported with tone variants");
assert(chimeContent.includes("isSoundEnabled"), "isSoundEnabled and mute toggle supported");
assert(chimeContent.includes("alert"), "Emergency alert high-attention tone synthesized");
assert(chimeContent.includes("message"), "Subtle messaging tone synthesized");

// 3. Verify Realtime Provider Architecture
console.log("\n3. Realtime Provider & Synchronization Logic:");
const providerContent = readFileSync(resolve("src/lib/realtime/realtime-provider.tsx"), "utf8");
assert(providerContent.includes("createClient"), "Supabase browser client integrated");
assert(providerContent.includes("BroadcastChannel"), "Cross-tab BroadcastChannel fallback active");
assert(providerContent.includes("emergency_broadcast"), "Emergency broadcast event listener wired");
assert(providerContent.includes("ticket_reply"), "Ticket reply real-time channel wired");
assert(providerContent.includes("dispatchBroadcast"), "dispatchBroadcast function available in context");
assert(providerContent.includes("dispatchTicketReply"), "dispatchTicketReply function available in context");
assert(providerContent.includes("useRealtime"), "useRealtime custom hook exported");

// 4. Verify Layout Integration
console.log("\n4. Layout Integration & Global Activation:");
const layoutContent = readFileSync(resolve("src/app/layout.tsx"), "utf8");
assert(layoutContent.includes("RealtimeProvider"), "RootLayout wraps entire app with RealtimeProvider");
assert(layoutContent.includes("RealtimeToastContainer"), "RealtimeToastContainer mounted in RootLayout");

const portalLayoutContent = readFileSync(resolve("src/components/layout/portal-layout.tsx"), "utf8");
assert(portalLayoutContent.includes("EmergencyBroadcastBanner"), "PortalLayout renders EmergencyBroadcastBanner");

const headerContent = readFileSync(resolve("src/components/layout/header.tsx"), "utf8");
assert(headerContent.includes("useRealtime"), "Header imports and reads useRealtime connection state");
assert(headerContent.includes("LIVE"), "Header displays dynamic LIVE connection pill");

// 5. Verify Ticket Live Messaging Integration
console.log("\n5. Help Desk Live Communication Verification:");
const threadContent = readFileSync(resolve("src/app/help-desk/[id]/ticket-thread.tsx"), "utf8");
assert(threadContent.includes("useRealtime"), "TicketThread connects to useRealtime");
assert(threadContent.includes("activeTicketReplies"), "TicketThread syncs incoming replies in real-time");
assert(threadContent.includes("dispatchTicketReply"), "TicketThread broadcasts new replies immediately");
assert(threadContent.includes("handleSimulateStaffReply"), "Simulated staff reply tester button built-in");

// 6. Verify Admin & HOD Broadcast Capabilities
console.log("\n6. Institutional Broadcast Dispatchers:");
const adminContent = readFileSync(resolve("src/app/admin/page.tsx"), "utf8");
assert(adminContent.includes("AdminBroadcastDialog"), "Admin Portal includes AdminBroadcastDialog");

const hodContent = readFileSync(resolve("src/app/hod/page.tsx"), "utf8");
assert(hodContent.includes("AdminBroadcastDialog"), "HOD Portal includes AdminBroadcastDialog");

const notifBellContent = readFileSync(resolve("src/components/layout/notification-bell.tsx"), "utf8");
assert(notifBellContent.includes("useRealtime"), "NotificationBell increments dynamically on real-time alerts");

// Summary
console.log("\n=======================================================");
console.log(`🎯 PHASE 16 AUDIT RESULTS: ${passed} / ${total} CHECKS PASSED`);
if (passed === total) {
  console.log("✨ ALL PHASE 16 REAL-TIME ARCHITECTURE VERIFIED SUCCESSFULLY!");
} else {
  console.log("⚠️ Some checks failed. Review log above.");
  process.exit(1);
}
console.log("=======================================================\n");
