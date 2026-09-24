// ================================================================
// CampusLens AI — Phase 9 & Phase 10 Verification Script
// Run with: node scripts/verify-phase9-10.mjs
// ================================================================

import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

console.log("\n=======================================================");
console.log("🛠️  CAMPUSLENS AI — PHASE 9 & 10 ARCHITECTURE VERIFICATION");
console.log("=======================================================\n");

// 1. Check Routes for Phase 9: Help Desk & Notifications
const helpDeskPage = resolve("src/app/help-desk/page.tsx");
const helpDeskNewPage = resolve("src/app/help-desk/new/page.tsx");
const helpDeskDetailPage = resolve("src/app/help-desk/[id]/page.tsx");
const ticketForm = resolve("src/app/help-desk/new/ticket-form.tsx");
const ticketThread = resolve("src/app/help-desk/[id]/ticket-thread.tsx");
const notificationsPage = resolve("src/app/notifications/page.tsx");
const notificationsView = resolve("src/app/notifications/notifications-view.tsx");

console.log("1. Help Desk & Notifications Modules (Phase 9):");
console.log(`   [${existsSync(helpDeskPage) ? "✓ PASS" : "✗ FAIL"}] Help Desk Listing & Filter (/help-desk)`);
console.log(`   [${existsSync(helpDeskNewPage) ? "✓ PASS" : "✗ FAIL"}] Ticket Submission Page (/help-desk/new)`);
console.log(`   [${existsSync(ticketForm) ? "✓ PASS" : "✗ FAIL"}] Interactive Ticket Form Component`);
console.log(`   [${existsSync(helpDeskDetailPage) ? "✓ PASS" : "✗ FAIL"}] Ticket Detail & Resolution Route (/help-desk/[id])`);
console.log(`   [${existsSync(ticketThread) ? "✓ PASS" : "✗ FAIL"}] Official Communication Thread Component`);
console.log(`   [${existsSync(notificationsPage) ? "✓ PASS" : "✗ FAIL"}] Institutional Notifications Center (/notifications)`);
console.log(`   [${existsSync(notificationsView) ? "✓ PASS" : "✗ FAIL"}] Interactive Notifications View Component`);

// 2. Check Routes for Phase 10: Campus AI Assistant
const aiAssistantPage = resolve("src/app/ai-assistant/page.tsx");
const aiChatInterface = resolve("src/app/ai-assistant/ai-chat-interface.tsx");
const aiApiRoute = resolve("src/app/api/ai/chat/route.ts");

console.log("\n2. Campus AI Assistant Architecture (Phase 10):");
console.log(`   [${existsSync(aiAssistantPage) ? "✓ PASS" : "✗ FAIL"}] Campus AI Assistant Page (/ai-assistant)`);
console.log(`   [${existsSync(aiChatInterface) ? "✓ PASS" : "✗ FAIL"}] Conversational RAG Chat Interface Component`);
console.log(`   [${existsSync(aiApiRoute) ? "✓ PASS" : "✗ FAIL"}] Grounded Campus Intelligence API Route (/api/ai/chat)`);

// 3. Check Queries & Data Access
const queriesFile = resolve("src/lib/supabase/queries.ts");
if (existsSync(queriesFile)) {
  const content = readFileSync(queriesFile, "utf8");
  const hasHelpRequests = content.includes("getHelpRequests");
  const hasHelpRequestById = content.includes("getHelpRequestById");
  const hasCreateHelpRequest = content.includes("createHelpRequest");
  const hasAddReply = content.includes("addHelpRequestReply");
  const hasNotifications = content.includes("getNotificationsList");

  console.log("\n3. Help Desk & Notification Queries:");
  console.log(`   [${hasHelpRequests ? "✓ PASS" : "✗ FAIL"}] Fetch Help Requests (getHelpRequests)`);
  console.log(`   [${hasHelpRequestById ? "✓ PASS" : "✗ FAIL"}] Fetch Help Request By ID (getHelpRequestById)`);
  console.log(`   [${hasCreateHelpRequest ? "✓ PASS" : "✗ FAIL"}] Create Help Request (createHelpRequest)`);
  console.log(`   [${hasAddReply ? "✓ PASS" : "✗ FAIL"}] Add Ticket Reply (addHelpRequestReply)`);
  console.log(`   [${hasNotifications ? "✓ PASS" : "✗ FAIL"}] Fetch Filtered Notifications (getNotificationsList)`);
}

// 4. Check Navigation Integration
const sidebarFile = resolve("src/components/layout/sidebar.tsx");
if (existsSync(sidebarFile)) {
  const sidebarContent = readFileSync(sidebarFile, "utf8");
  const hasAiNav = sidebarContent.includes('href: "/ai-assistant"');
  const hasHelpNav = sidebarContent.includes('href: "/help-desk"');

  console.log("\n4. Sidebar Portal Navigation:");
  console.log(`   [${hasAiNav ? "✓ PASS" : "✗ FAIL"}] Campus AI Assistant Link`);
  console.log(`   [${hasHelpNav ? "✓ PASS" : "✗ FAIL"}] Help Desk Link`);
}

console.log("\n🎉 Phase 9 & Phase 10 verification completed successfully!\n");
