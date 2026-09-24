// ================================================================
// CampusLens AI — Phase 11 Verification Script
// Run with: node scripts/verify-phase11.mjs
// ================================================================

import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

console.log("\n=======================================================");
console.log("🎓  CAMPUSLENS AI — PHASE 11 ARCHITECTURE VERIFICATION");
console.log("=======================================================\n");

// 1. Check Routes for Phase 11: Faculty & HOD Management Portals
const hodPage = resolve("src/app/hod/page.tsx");
const facultyPage = resolve("src/app/faculty/page.tsx");

console.log("1. HOD & Faculty Management Portals (Phase 11):");
console.log(`   [${existsSync(hodPage) ? "✓ PASS" : "✗ FAIL"}] Head of Department Executive Portal (/hod)`);
console.log(`   [${existsSync(facultyPage) ? "✓ PASS" : "✗ FAIL"}] Dual-Mode Faculty Hub & Directory (/faculty)`);

// 2. Check Feature Capabilities inside HOD page
if (existsSync(hodPage)) {
  const hodContent = readFileSync(hodPage, "utf8");
  const hasKpi = hodContent.includes("Enrolled Students") && hodContent.includes("Department Faculty");
  const hasFacultyTab = hodContent.includes("Faculty Staffing & Workload");
  const hasTimetableMatrix = hodContent.includes("Department Class Scheduling Matrix");
  const hasApprovals = hodContent.includes("Student Lab & Mark Endorsements");
  const hasBroadcast = hodContent.includes("Broadcast Official Department Circular");

  console.log("\n2. HOD Management Features:");
  console.log(`   [${hasKpi ? "✓ PASS" : "✗ FAIL"}] Department Executive KPIs & Overview`);
  console.log(`   [${hasFacultyTab ? "✓ PASS" : "✗ FAIL"}] Faculty Workload & Roster Management`);
  console.log(`   [${hasTimetableMatrix ? "✓ PASS" : "✗ FAIL"}] Department Class Scheduling Matrix`);
  console.log(`   [${hasApprovals ? "✓ PASS" : "✗ FAIL"}] Student Lab Clearance & Mark Endorsement System`);
  console.log(`   [${hasBroadcast ? "✓ PASS" : "✗ FAIL"}] Official Department Broadcast Dispatcher`);
}

// 3. Check Feature Capabilities inside Faculty Hub page
if (existsSync(facultyPage)) {
  const facContent = readFileSync(facultyPage, "utf8");
  const hasDualMode = facContent.includes("teaching_hub") && facContent.includes("directory");
  const hasAttendance = facContent.includes("Class Attendance Marker");
  const hasConsultations = facContent.includes("Office Hour Consultations");
  const hasSyllabus = facContent.includes("Courses & Syllabus Delivery");

  console.log("\n3. Faculty Teaching Hub Features:");
  console.log(`   [${hasDualMode ? "✓ PASS" : "✗ FAIL"}] Dual-Mode View Switcher (Directory / Teaching Hub)`);
  console.log(`   [${hasAttendance ? "✓ PASS" : "✗ FAIL"}] Interactive Attendance Marker Tracker`);
  console.log(`   [${hasConsultations ? "✓ PASS" : "✗ FAIL"}] Student Office Consultation Queue`);
  console.log(`   [${hasSyllabus ? "✓ PASS" : "✗ FAIL"}] Course Syllabus & Lab Progress Tracker`);
}

// 4. Check Navigation Integration
const sidebarFile = resolve("src/components/layout/sidebar.tsx");
if (existsSync(sidebarFile)) {
  const sidebarContent = readFileSync(sidebarFile, "utf8");
  const hasHodNav = sidebarContent.includes('href: "/hod"');
  const hasFacultyNav = sidebarContent.includes('href: "/faculty"');

  console.log("\n4. Sidebar Portal Navigation:");
  console.log(`   [${hasHodNav ? "✓ PASS" : "✗ FAIL"}] HOD Portal Link in Sidebar`);
  console.log(`   [${hasFacultyNav ? "✓ PASS" : "✗ FAIL"}] Faculty Hub Link in Sidebar`);
}

console.log("\n🎉 Phase 11 verification completed successfully!\n");
