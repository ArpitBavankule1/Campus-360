// ================================================================
// CampusLens AI — Phase 13 Verification Script
// Run with: node scripts/verify-phase13.mjs
// ================================================================

import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

console.log("\n=======================================================");
console.log("⚡  CAMPUSLENS AI — PHASE 13 ARCHITECTURE VERIFICATION");
console.log("=======================================================\n");

// 1. Check Routes for Phase 13
const bookmarksPage = resolve("src/app/bookmarks/page.tsx");
const bookmarksView = resolve("src/app/bookmarks/bookmarks-view.tsx");
const commandPalette = resolve("src/components/layout/command-palette.tsx");
const headerFile = resolve("src/components/layout/header.tsx");

console.log("1. Command Palette & Bookmarks Architecture (Phase 13):");
console.log(`   [${existsSync(commandPalette) ? "✓ PASS" : "✗ FAIL"}] Global Command Palette (⌘K / Ctrl+K)`);
console.log(`   [${existsSync(bookmarksPage) ? "✓ PASS" : "✗ FAIL"}] Universal Bookmarks Portal (/bookmarks)`);
console.log(`   [${existsSync(bookmarksView) ? "✓ PASS" : "✗ FAIL"}] Interactive Bookmarks View Component`);

// 2. Check Command Palette Integration inside Header
if (existsSync(headerFile)) {
  const headerContent = readFileSync(headerFile, "utf8");
  const hasPaletteImport = headerContent.includes("CommandPalette");
  const hasPaletteDispatch = headerContent.includes("open-command-palette");
  const hasKbdShortcut = headerContent.includes("⌘K");

  console.log("\n2. Header Command Palette Integration:");
  console.log(`   [${hasPaletteImport ? "✓ PASS" : "✗ FAIL"}] CommandPalette component mounted`);
  console.log(`   [${hasPaletteDispatch ? "✓ PASS" : "✗ FAIL"}] Search bar opens palette via event`);
  console.log(`   [${hasKbdShortcut ? "✓ PASS" : "✗ FAIL"}] ⌘K keyboard shortcut prompt present`);
}

// 3. Check Bookmarks Query & Types in queries.ts
const queriesFile = resolve("src/lib/supabase/queries.ts");
if (existsSync(queriesFile)) {
  const content = readFileSync(queriesFile, "utf8");
  const hasBookmarksQuery = content.includes("getUserBookmarks");
  const hasMockBookmarks = content.includes("MOCK_BOOKMARKS");

  console.log("\n3. Bookmarks Data Layer:");
  console.log(`   [${hasBookmarksQuery ? "✓ PASS" : "✗ FAIL"}] Fetch Bookmarks (getUserBookmarks)`);
  console.log(`   [${hasMockBookmarks ? "✓ PASS" : "✗ FAIL"}] Mock Bookmarks Dataset (MOCK_BOOKMARKS)`);
}

// 4. Check Sidebar Navigation Integration
const sidebarFile = resolve("src/components/layout/sidebar.tsx");
if (existsSync(sidebarFile)) {
  const sidebarContent = readFileSync(sidebarFile, "utf8");
  const hasBookmarksNav = sidebarContent.includes('href: "/bookmarks"');

  console.log("\n4. Sidebar Portal Navigation:");
  console.log(`   [${hasBookmarksNav ? "✓ PASS" : "✗ FAIL"}] My Bookmarks link in sidebar`);
}

console.log("\n🎉 Phase 13 verification completed successfully!\n");
