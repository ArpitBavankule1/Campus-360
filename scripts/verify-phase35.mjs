#!/usr/bin/env node
/**
 * CampusLens AI — Phase 35 Verification Suite
 * Automated test: Smart Campus Cafeteria, Dining Wallets & Contactless Food Ordering
 * Run: node scripts/verify-phase35.mjs
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

console.log("\n🍲  CampusLens AI — Phase 35 Verification: Smart Cafeteria & Dining Wallets\n");
console.log("═".repeat(60));

// 1. Database Migration
console.log("\n📦 Database Migration");
check(
  "Cafeteria schema migration file exists",
  fileExists("supabase/migrations/20261004000001_cafeteria_schema.sql")
);
check(
  "dining_vendors, cafeteria_menu_items, dining_wallets, meal_orders defined with RLS",
  fileContains(
    "supabase/migrations/20261004000001_cafeteria_schema.sql",
    "CREATE TABLE IF NOT EXISTS public.dining_vendors",
    "CREATE TABLE IF NOT EXISTS public.cafeteria_menu_items",
    "CREATE TABLE IF NOT EXISTS public.dining_wallets",
    "CREATE TABLE IF NOT EXISTS public.meal_orders",
    "ALTER TABLE public.dining_vendors ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.cafeteria_menu_items ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.dining_wallets ENABLE ROW LEVEL SECURITY",
    "ALTER TABLE public.meal_orders ENABLE ROW LEVEL SECURITY"
  )
);

// 2. TypeScript Types
console.log("\n🏷️  TypeScript Types");
check(
  "CuisineType, MealCategory, DietaryTag, OrderStatus exported in src/types/index.ts",
  fileContains(
    "src/types/index.ts",
    "export type CuisineType",
    "export type MealCategory",
    "export type DietaryTag",
    "export type OrderStatus"
  )
);
check(
  "DiningVendor, MenuItem, DiningWallet, MealOrder, CafeteriaOverviewStats exported",
  fileContains(
    "src/types/index.ts",
    "export interface DiningVendor",
    "export interface MenuItem",
    "export interface DiningWallet",
    "export interface MealOrder",
    "export interface CafeteriaOverviewStats"
  )
);

// 3. Engine & Mock Data
console.log("\n⚙️  Cafeteria Engine & Seeds");
check(
  "cafeteria-engine.ts exists with generators and mock datasets",
  fileExists("src/lib/cafeteria/cafeteria-engine.ts") &&
    fileContains(
      "src/lib/cafeteria/cafeteria-engine.ts",
      "export function generateMealOrderCode",
      "export function generateMealTokenPass",
      "export function generateWalletQRToken",
      "export function calculateCafeteriaOverview",
      "export const MOCK_DINING_VENDORS",
      "export const MOCK_MENU_ITEMS",
      "export const MOCK_DINING_WALLET",
      "export const MOCK_MEAL_ORDERS"
    )
);

// 4. API Endpoints
console.log("\n🌐 API Endpoints");
check(
  "GET & POST /api/cafeteria/vendors dining outlets",
  fileExists("src/app/api/cafeteria/vendors/route.ts") &&
    fileContains(
      "src/app/api/cafeteria/vendors/route.ts",
      "export async function GET",
      "export async function POST"
    )
);
check(
  "GET & POST /api/cafeteria/orders meal pickup token",
  fileExists("src/app/api/cafeteria/orders/route.ts") &&
    fileContains(
      "src/app/api/cafeteria/orders/route.ts",
      "export async function GET",
      "export async function POST",
      "generateMealOrderCode"
    )
);
check(
  "GET & POST /api/cafeteria/wallet smart balance & reload",
  fileExists("src/app/api/cafeteria/wallet/route.ts") &&
    fileContains(
      "src/app/api/cafeteria/wallet/route.ts",
      "export async function GET",
      "export async function POST",
      "generateWalletQRToken"
    )
);
check(
  "GET & POST /api/cafeteria/menu catalog & dietary tags",
  fileExists("src/app/api/cafeteria/menu/route.ts") &&
    fileContains(
      "src/app/api/cafeteria/menu/route.ts",
      "export async function GET",
      "export async function POST"
    )
);

// 5. UI Components & Pages
console.log("\n🎨 UI Components & Portal");
check(
  "DiningVendorCard and MealOrderCard components exist",
  fileExists("src/components/cafeteria/dining-vendor-card.tsx") &&
    fileExists("src/components/cafeteria/meal-order-card.tsx")
);
check(
  "FoodOrderModal and WalletTopupModal components exist",
  fileExists("src/components/cafeteria/food-order-modal.tsx") &&
    fileExists("src/components/cafeteria/wallet-topup-modal.tsx")
);
check(
  "Cafeteria Portal page exists at /cafeteria",
  fileExists("src/app/cafeteria/page.tsx") &&
    fileContains(
      "src/app/cafeteria/page.tsx",
      "CafeteriaPortalPage",
      "FoodOrderModal",
      "WalletTopupModal"
    )
);

// 6. Navigation Integration
console.log("\n🧭 Navigation Integration");
check(
  "Sidebar links to /cafeteria with Phase 35 badge",
  fileContains("src/components/layout/sidebar.tsx", 'href: "/cafeteria"', "Phase 35")
);
check(
  "QuickActions includes Cafeteria Dining Wallets item",
  fileContains("src/components/dashboard/quick-actions.tsx", 'href: "/cafeteria"', "Phase 35")
);
check(
  "Command Palette includes Cafeteria item",
  fileContains("src/components/layout/command-palette.tsx", 'href: "/cafeteria"')
);

console.log("\n" + "═".repeat(60));
console.log(`Total checks: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 Phase 35 Smart Cafeteria & Dining Wallets verification passed 100%!\n");
}
