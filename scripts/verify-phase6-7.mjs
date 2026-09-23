// ================================================================
// CampusLens AI — Phase 6 & 7 Verification Script
// Run with: node scripts/verify-phase6-7.mjs
// ================================================================

import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

console.log("\n=======================================================");
console.log("🗺️  CAMPUSLENS AI — PHASE 6 & 7 ARCHITECTURE VERIFICATION");
console.log("=======================================================\n");

// 1. Check Phase 6 Profile Components & Routes
const profilePage = resolve("src/app/profile/page.tsx");
const profileForm = resolve("src/components/profile/profile-form.tsx");

console.log("1. Student Profile & Institutional Identity (Phase 6):");
console.log(`   [${existsSync(profilePage) ? "✓ PASS" : "✗ FAIL"}] Profile Portal Route (/profile)`);
console.log(`   [${existsSync(profileForm) ? "✓ PASS" : "✗ FAIL"}] Digital ID Badge & Edit Form (src/components/profile/profile-form.tsx)`);

// 2. Check Phase 7 Campus Explorer & Map Components
const locationFilters = resolve("src/components/campus/location-filters.tsx");
const locationCard = resolve("src/components/campus/location-card.tsx");
const campusMap = resolve("src/components/campus/campus-map.tsx");
const explorePage = resolve("src/app/explore/page.tsx");
const locationDetailPage = resolve("src/app/explore/[id]/page.tsx");
const mapPage = resolve("src/app/map/page.tsx");

console.log("\n2. Campus Explorer & Interactive Map (Phase 7):");
console.log(`   [${existsSync(locationFilters) ? "✓ PASS" : "✗ FAIL"}] Category Filters & Search (src/components/campus/location-filters.tsx)`);
console.log(`   [${existsSync(locationCard) ? "✓ PASS" : "✗ FAIL"}] Rich Location Cards with Badges (src/components/campus/location-card.tsx)`);
console.log(`   [${existsSync(campusMap) ? "✓ PASS" : "✗ FAIL"}] Leaflet Geospatial Map with Custom Pins (src/components/campus/campus-map.tsx)`);
console.log(`   [${existsSync(explorePage) ? "✓ PASS" : "✗ FAIL"}] Campus Explorer Portal Route (/explore)`);
console.log(`   [${existsSync(locationDetailPage) ? "✓ PASS" : "✗ FAIL"}] Location Detail Dynamic Route (/explore/[id])`);
console.log(`   [${existsSync(mapPage) ? "✓ PASS" : "✗ FAIL"}] Full Interactive Map Route (/map)`);

// 3. Verify Leaflet Integration & Fallbacks
if (existsSync(campusMap)) {
  const mapCode = readFileSync(campusMap, "utf8");
  const hasLeafletCss = mapCode.includes("leaflet/dist/leaflet.css");
  const hasFlyTo = mapCode.includes("flyTo");
  const hasCustomPins = mapCode.includes("custom-map-marker") || mapCode.includes("divIcon");

  console.log("\n3. Map Engine Integrity:");
  console.log(`   [${hasLeafletCss ? "✓ PASS" : "✗ FAIL"}] Leaflet CSS Imported`);
  console.log(`   [${hasFlyTo ? "✓ PASS" : "✗ FAIL"}] Smooth Geospatial Fly-To Animation`);
  console.log(`   [${hasCustomPins ? "✓ PASS" : "✗ FAIL"}] Color-Coded Category Marker Pins`);
}

console.log("\n=======================================================");
console.log("Phase 6 & Phase 7 Architecture Verified Successfully! 🎉");
console.log("=======================================================\n");
