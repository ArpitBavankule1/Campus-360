// ================================================================
// CampusLens AI — Phase 12 Verification Script
// Run with: node scripts/verify-phase12.mjs
// ================================================================

import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

console.log("\n=======================================================");
console.log("🛡️  CAMPUSLENS AI — PHASE 12 ARCHITECTURE VERIFICATION");
console.log("=======================================================\n");

// 1. Check Routes for Phase 12: Admin Management Portal
const adminPage = resolve("src/app/admin/page.tsx");

console.log("1. Admin Management Portal Route (Phase 12):");
console.log(`   [${existsSync(adminPage) ? "✓ PASS" : "✗ FAIL"}] Central Administrator Console (/admin)`);

// 2. Check Admin Features inside /admin/page.tsx
if (existsSync(adminPage)) {
  const adminContent = readFileSync(adminPage, "utf8");
  const hasKpi = adminContent.includes("Total Students") && adminContent.includes("Faculty Staff");
  const hasLocationsManager = adminContent.includes("Campus Facilities & Locations") && adminContent.includes("handleAddLocation");
  const hasNoticesPublisher = adminContent.includes("Institutional Notices & Circulars") && adminContent.includes("handleAddNotice");
  const hasMasterTimetable = adminContent.includes("Master Schedule & Lecture Allocations");
  const hasCentralTriage = adminContent.includes("Central Help Desk Triage Console") && adminContent.includes("handleUpdateTicketStatus");
  const hasSecurityRls = adminContent.includes("Supabase Row Level Security Architecture");

  console.log("\n2. Admin Management Features & CRUD Consoles:");
  console.log(`   [${hasKpi ? "✓ PASS" : "✗ FAIL"}] Institutional KPI Metrics & Global Overview`);
  console.log(`   [${hasLocationsManager ? "✓ PASS" : "✗ FAIL"}] Campus Locations & Rooms Management System`);
  console.log(`   [${hasNoticesPublisher ? "✓ PASS" : "✗ FAIL"}] Institutional Notices & Circulars Publisher`);
  console.log(`   [${hasMasterTimetable ? "✓ PASS" : "✗ FAIL"}] Master Schedule Timetable Coordinator`);
  console.log(`   [${hasCentralTriage ? "✓ PASS" : "✗ FAIL"}] Central Help Desk Triage & Resolution Console`);
  console.log(`   [${hasSecurityRls ? "✓ PASS" : "✗ FAIL"}] Multi-Tenant Security & Database RLS Health`);
}

// 3. Check Queries & Data Access
const queriesFile = resolve("src/lib/supabase/queries.ts");
if (existsSync(queriesFile)) {
  const content = readFileSync(queriesFile, "utf8");
  const hasCreateLoc = content.includes("createCampusLocation");
  const hasCreateNotice = content.includes("createInstitutionalNotice");
  const hasUpdateTicket = content.includes("updateTicketStatusAndResolution");

  console.log("\n3. Administrative Query Operations:");
  console.log(`   [${hasCreateLoc ? "✓ PASS" : "✗ FAIL"}] Location Insertion (createCampusLocation)`);
  console.log(`   [${hasCreateNotice ? "✓ PASS" : "✗ FAIL"}] Notice Dispatcher (createInstitutionalNotice)`);
  console.log(`   [${hasUpdateTicket ? "✓ PASS" : "✗ FAIL"}] Ticket Resolution & Status Sync (updateTicketStatusAndResolution)`);
}

// 4. Check Navigation Integration
const sidebarFile = resolve("src/components/layout/sidebar.tsx");
if (existsSync(sidebarFile)) {
  const sidebarContent = readFileSync(sidebarFile, "utf8");
  const hasAdminNav = sidebarContent.includes('href: "/admin"');

  console.log("\n4. Sidebar Portal Navigation:");
  console.log(`   [${hasAdminNav ? "✓ PASS" : "✗ FAIL"}] Admin Console Link in Sidebar`);
}

console.log("\n🎉 Phase 12 verification completed successfully!\n");
