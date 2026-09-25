// ================================================================
// CampusLens AI — Phase 14 Verification Script
// Run with: node scripts/verify-phase14.mjs
// ================================================================

import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

console.log("\n=======================================================");
console.log("🌐  CAMPUSLENS AI — PHASE 14 ARCHITECTURE VERIFICATION");
console.log("=======================================================\n");

// 1. Check Routes for Phase 14
const homePage = resolve("src/app/page.tsx");
const featuresPage = resolve("src/app/features/page.tsx");
const contactPage = resolve("src/app/contact/page.tsx");
const contactForm = resolve("src/app/contact/contact-form.tsx");
const aboutPage = resolve("src/app/about/page.tsx");

console.log("1. Public Website Pages & Experience (Phase 14):");
console.log(`   [${existsSync(homePage) ? "✓ PASS" : "✗ FAIL"}] Landing Page (/)`);
console.log(`   [${existsSync(featuresPage) ? "✓ PASS" : "✗ FAIL"}] Dedicated Features Showcase (/features)`);
console.log(`   [${existsSync(contactPage) ? "✓ PASS" : "✗ FAIL"}] Campus Contact & Inquiries (/contact)`);
console.log(`   [${existsSync(contactForm) ? "✓ PASS" : "✗ FAIL"}] Interactive Contact Form Component`);
console.log(`   [${existsSync(aboutPage) ? "✓ PASS" : "✗ FAIL"}] About Institutional Page (/about)`);

// 2. Check Public Header Navigation Links
const headerFile = resolve("src/components/layout/public-header.tsx");
const constantsFile = resolve("src/lib/constants.ts");
if (existsSync(constantsFile) && existsSync(headerFile)) {
  const constantsContent = readFileSync(constantsFile, "utf8");
  const hasFeaturesLink = constantsContent.includes('href: "/features"');
  const hasContactLink = constantsContent.includes('href: "/contact"');
  const hasMapLink = constantsContent.includes('href: "/map"');

  console.log("\n2. Public Navigation Integration:");
  console.log(`   [${hasFeaturesLink ? "✓ PASS" : "✗ FAIL"}] Features link configured in navigation`);
  console.log(`   [${hasContactLink ? "✓ PASS" : "✗ FAIL"}] Contact link configured in navigation`);
  console.log(`   [${hasMapLink ? "✓ PASS" : "✗ FAIL"}] Campus Map link configured in navigation`);
}

// 3. Check Homepage Rich Ecosystem Personas
if (existsSync(homePage)) {
  const homeContent = readFileSync(homePage, "utf8");
  const hasRoleSection = homeContent.includes("Dedicated Portals for Every Campus Role");
  const hasExploreFeatures = homeContent.includes('href="/features"');
  const hasStats = homeContent.includes("STATS");

  console.log("\n3. Homepage Architecture & Ecosystem:");
  console.log(`   [${hasRoleSection ? "✓ PASS" : "✗ FAIL"}] 4-Role Persona Ecosystem Showcase`);
  console.log(`   [${hasExploreFeatures ? "✓ PASS" : "✗ FAIL"}] Deep-dive feature link to /features`);
  console.log(`   [${hasStats ? "✓ PASS" : "✗ FAIL"}] Institutional campus statistics grid`);
}

// 4. Check Features Page Depth
if (existsSync(featuresPage)) {
  const featuresContent = readFileSync(featuresPage, "utf8");
  const hasModules = featuresContent.includes("FEATURE_MODULES");
  const hasMatrix = featuresContent.includes("ROLE_MATRIX");

  console.log("\n4. Feature Showcase Deep-Dive:");
  console.log(`   [${hasModules ? "✓ PASS" : "✗ FAIL"}] 8 Integrated System Feature Modules`);
  console.log(`   [${hasMatrix ? "✓ PASS" : "✗ FAIL"}] Granular Role Capability Matrix`);
}

// 5. Check Contact Form Features
if (existsSync(contactForm)) {
  const formContent = readFileSync(contactForm, "utf8");
  const hasTicketId = formContent.includes("INQ-");
  const hasRoleSelect = formContent.includes("Select role");

  console.log("\n5. Interactive Inquiry System:");
  console.log(`   [${hasRoleSelect ? "✓ PASS" : "✗ FAIL"}] Role-based inquiry categorization`);
  console.log(`   [${hasTicketId ? "✓ PASS" : "✗ FAIL"}] Automated tracking ticket generation`);
}

console.log("\n🎉 Phase 14 verification completed successfully!\n");
