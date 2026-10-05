#!/usr/bin/env node
/**
 * CampusLens AI — Phase 39 Verification Suite
 * Automated test: Smart Campus Student Elections, E-Voting & Campus Democracy Portal
 * Run: node scripts/verify-phase39.mjs
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

console.log("\n🗳️  CampusLens AI — Phase 39 Verification: Student Elections & E-Voting\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "Student elections schema migration file exists",
  fileExists("supabase/migrations/20261005000002_elections_schema.sql")
);
check(
  "student_elections, election_candidates, ballot_votes, election_results defined with RLS",
  fileContains(
    "supabase/migrations/20261005000002_elections_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.student_elections",
    "CREATE TABLE IF NOT EXISTS public.election_candidates",
    "CREATE TABLE IF NOT EXISTS public.ballot_votes",
    "CREATE TABLE IF NOT EXISTS public.election_results",
    "ALTER TABLE public.student_elections ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.election_candidates ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.ballot_votes ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.election_results ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "ElectionPost, ElectionStatus, CandidateApprovalStatus exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type ElectionPost",
    "export type ElectionStatus",
    "export type CandidateApprovalStatus"
  )
);
check(
  "StudentElection, ElectionCandidate, BallotVote, ElectionResultDocket exported",
  fileContains(
    "src/types/index.ts",
    "export interface StudentElection",
    "export interface ElectionCandidate",
    "export interface BallotVote",
    "export interface ElectionResultDocket",
    "export interface ElectionsOverviewStats"
  )
);

// 3. Engine & Mock Data
console.log("\n⚙️  Elections Engine & Seeds");
check(
  "elections-engine.ts exists with generators and mock datasets",
  fileExists("src/lib/elections/elections-engine.ts") &&
    fileContains(
      "src/lib/elections/elections-engine.ts",
      "export function generateVoteReceiptCode",
      "export function generateElectionCertCode",
      "export function calculateElectionsOverview",
      "export const MOCK_STUDENT_ELECTION",
      "export const MOCK_ELECTION_CANDIDATES",
      "export const MOCK_BALLOT_VOTES",
      "export const MOCK_ELECTION_RESULTS"
    )
);

// 4. API Endpoints
console.log("\n🌐 API Endpoints");
check(
  "GET & POST /api/elections/directory election schedule",
  fileExists("src/app/api/elections/directory/route.ts") &&
    fileContains(
      "src/app/api/elections/directory/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "GET & POST /api/elections/candidates manifestos directory",
  fileExists("src/app/api/elections/candidates/route.ts") &&
    fileContains(
      "src/app/api/elections/candidates/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "GET & POST /api/elections/cast-vote anonymous ZKP ballot voting",
  fileExists("src/app/api/elections/cast-vote/route.ts") &&
    fileContains(
      "src/app/api/elections/cast-vote/route.ts",
      "export async function GET",
      "export async function POST",
      "generateVoteReceiptCode"
    )
);
check(
  "GET & POST /api/elections/results certification ledger",
  fileExists("src/app/api/elections/results/route.ts") &&
    fileContains(
      "src/app/api/elections/results/route.ts",
      "export async function GET",
      "export async function POST",
      "generateElectionCertCode"
    )
);

// 5. UI Components & Pages
console.log("\n🎨 UI Components & Portal");
check(
  "CandidateManifestoCard and ElectionResultCard components exist",
  fileExists("src/components/elections/candidate-manifesto-card.tsx") &&
    fileExists("src/components/elections/election-result-card.tsx")
);
check(
  "CastBallotModal and NominateCandidateModal components exist",
  fileExists("src/components/elections/cast-ballot-modal.tsx") &&
    fileExists("src/components/elections/nominate-candidate-modal.tsx")
);
check(
  "Elections Portal page exists at /elections",
  fileExists("src/app/elections/page.tsx") &&
    fileContains(
      "src/app/elections/page.tsx",
      "ElectionsPortalPage",
      "CandidateManifestoCard",
      "CastBallotModal"
    )
);

// 6. Navigation Integration
console.log("\n🧭 Navigation Integration");
check(
  "Sidebar links to /elections with Phase 39 badge",
  fileContains("src/components/layout/sidebar.tsx", 'href: "/elections"', "Phase 39")
);
check(
  "QuickActions includes Student Elections item",
  fileContains("src/components/dashboard/quick-actions.tsx", 'href: "/elections"', "Phase 39")
);
check(
  "Command Palette includes Elections item",
  fileContains("src/components/layout/command-palette.tsx", 'href: "/elections"')
);

console.log("\n" + "═".repeat(60));
console.log(`Total checks: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 Phase 39 Smart Student Elections & E-Voting verification passed 100%!\n");
}
