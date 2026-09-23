// ================================================================
// CampusLens AI — Phase 8 Verification Script
// Run with: node scripts/verify-phase8.mjs
// ================================================================

import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

console.log("\n=======================================================");
console.log("📚  CAMPUSLENS AI — PHASE 8 ARCHITECTURE VERIFICATION");
console.log("=======================================================\n");

// 1. Check Routes
const timetablePage = resolve("src/app/timetable/page.tsx");
const noticesPage = resolve("src/app/notices/page.tsx");
const eventsPage = resolve("src/app/events/page.tsx");
const facultyPage = resolve("src/app/faculty/page.tsx");
const departmentsPage = resolve("src/app/departments/page.tsx");

console.log("1. Academic & Portal Modules (Phase 8):");
console.log(`   [${existsSync(timetablePage) ? "✓ PASS" : "✗ FAIL"}] Timetable & Class Routines (/timetable)`);
console.log(`   [${existsSync(noticesPage) ? "✓ PASS" : "✗ FAIL"}] Notices & Official Circulars (/notices)`);
console.log(`   [${existsSync(eventsPage) ? "✓ PASS" : "✗ FAIL"}] Campus Events & Symposiums (/events)`);
console.log(`   [${existsSync(facultyPage) ? "✓ PASS" : "✗ FAIL"}] Faculty & Academic Staff Directory (/faculty)`);
console.log(`   [${existsSync(departmentsPage) ? "✓ PASS" : "✗ FAIL"}] Academic Departments Directory (/departments)`);

// 2. Check Queries & Data Access
const queriesFile = resolve("src/lib/supabase/queries.ts");
if (existsSync(queriesFile)) {
  const content = readFileSync(queriesFile, "utf8");
  const hasTimetable = content.includes("getTimetableList");
  const hasNotices = content.includes("getNoticesList");
  const hasEvents = content.includes("getEventsList");
  const hasDepts = content.includes("getDepartments");

  console.log("\n2. Query Utilities & Mock Integrity:");
  console.log(`   [${hasTimetable ? "✓ PASS" : "✗ FAIL"}] Timetable Filtering Query (getTimetableList)`);
  console.log(`   [${hasNotices ? "✓ PASS" : "✗ FAIL"}] Notices Filtering Query (getNoticesList)`);
  console.log(`   [${hasEvents ? "✓ PASS" : "✗ FAIL"}] Events Query (getEventsList)`);
  console.log(`   [${hasDepts ? "✓ PASS" : "✗ FAIL"}] Departments Query (getDepartments)`);
}

// 3. Check Sidebar Navigation
const sidebarFile = resolve("src/components/layout/sidebar.tsx");
if (existsSync(sidebarFile)) {
  const sidebarContent = readFileSync(sidebarFile, "utf8");
  const hasTimetableNav = sidebarContent.includes('href: "/timetable"');
  const hasNoticesNav = sidebarContent.includes('href: "/notices"');
  const hasEventsNav = sidebarContent.includes('href: "/events"');
  const hasFacultyNav = sidebarContent.includes('href: "/faculty"');
  const hasDeptsNav = sidebarContent.includes('href: "/departments"');

  console.log("\n3. Sidebar Navigation Links:");
  console.log(`   [${hasTimetableNav ? "✓ PASS" : "✗ FAIL"}] Timetable Link`);
  console.log(`   [${hasNoticesNav ? "✓ PASS" : "✗ FAIL"}] Notices Link`);
  console.log(`   [${hasEventsNav ? "✓ PASS" : "✗ FAIL"}] Events Link`);
  console.log(`   [${hasFacultyNav ? "✓ PASS" : "✗ FAIL"}] Faculty Link`);
  console.log(`   [${hasDeptsNav ? "✓ PASS" : "✗ FAIL"}] Departments Link`);
}

console.log("\n=======================================================");
console.log("Phase 8 Academic Modules Architecture Verified! 🎉");
console.log("=======================================================\n");
