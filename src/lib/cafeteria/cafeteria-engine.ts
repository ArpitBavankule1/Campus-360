// ================================================================
// CampusLens AI — Phase 35: Smart Campus Cafeteria & Dining Engine
// Meal order voucher generator, wallet ledger & dining seed data
// ================================================================

import {
  DiningVendor,
  MenuItem,
  DiningWallet,
  MealOrder,
  CafeteriaOverviewStats,
} from "@/types";

export function generateMealOrderCode(): string {
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CL-DINE-2026-${randomSuffix}`;
}

export function generateMealTokenPass(): string {
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TOKEN-${randomSuffix}`;
}

export function generateWalletQRToken(): string {
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `WALLET-QR-2026-${randomSuffix}`;
}

export function calculateCafeteriaOverview(
  vendors: DiningVendor[] = MOCK_DINING_VENDORS,
  menuItems: MenuItem[] = MOCK_MENU_ITEMS,
  wallet: DiningWallet = MOCK_DINING_WALLET,
  orders: MealOrder[] = MOCK_MEAL_ORDERS
): CafeteriaOverviewStats {
  return {
    activeVendors: vendors.filter((v) => v.is_accepting_orders).length,
    availableMenuItems: menuItems.filter((m) => m.is_in_stock).length,
    activeOrdersInKitchen: orders.filter(
      (o) => o.order_status === "Preparing" || o.order_status === "Ready for Pickup"
    ).length,
    totalMealsServedToday: 1842,
    vendors,
    menuItems,
    wallet,
    recentOrders: orders,
  };
}

export const MOCK_DINING_VENDORS: DiningVendor[] = [
  {
    id: "vnd-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    vendor_name: "Annapurna Royal Thali & Curries",
    cuisine_type: "North Indian & Thali",
    location_stall: "Food Court Block A, Stall #1",
    opening_time: "08:00:00",
    closing_time: "22:00:00",
    rating: 4.8,
    is_accepting_orders: true,
    average_prep_time_mins: 12,
    created_at: "2026-01-10T08:00:00Z",
  },
  {
    id: "vnd-22222222-2222-4222-8222-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    vendor_name: "Dakshin Delight Tiffin Corner",
    cuisine_type: "South Indian Tiffin",
    location_stall: "Food Court Block A, Stall #2",
    opening_time: "07:00:00",
    closing_time: "21:30:00",
    rating: 4.9,
    is_accepting_orders: true,
    average_prep_time_mins: 8,
    created_at: "2026-01-10T08:00:00Z",
  },
  {
    id: "vnd-33333333-3333-4333-8333-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    vendor_name: "The Artisan Bistro & Pasta Bar",
    cuisine_type: "Continental & Italian",
    location_stall: "Central Plaza Terrace, Kiosk #3",
    opening_time: "10:30:00",
    closing_time: "23:00:00",
    rating: 4.6,
    is_accepting_orders: true,
    average_prep_time_mins: 15,
    created_at: "2026-01-10T08:00:00Z",
  },
  {
    id: "vnd-44444444-4444-4444-8444-444444444444",
    college_id: "c1111111-1111-4111-8111-111111111111",
    vendor_name: "GreenFuel Organic & Protein Bowls",
    cuisine_type: "Healthy Protein Bowls",
    location_stall: "Sports Complex Concourse, Kiosk #1",
    opening_time: "07:30:00",
    closing_time: "21:00:00",
    rating: 4.7,
    is_accepting_orders: true,
    average_prep_time_mins: 10,
    created_at: "2026-01-10T08:00:00Z",
  },
  {
    id: "vnd-55555555-5555-4555-8555-555555555555",
    college_id: "c1111111-1111-4111-8111-111111111111",
    vendor_name: "BrewLab Artisanal Coffee & Bakery",
    cuisine_type: "Specialty Coffee & Tea",
    location_stall: "Central Library Atrium, Ground Floor",
    opening_time: "07:00:00",
    closing_time: "23:30:00",
    rating: 4.9,
    is_accepting_orders: true,
    average_prep_time_mins: 5,
    created_at: "2026-01-10T08:00:00Z",
  },
];

export const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: "mnu-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    vendor_id: "vnd-11111111-1111-4111-8111-111111111111",
    vendor_name: "Annapurna Royal Thali",
    item_name: "Deluxe Shahi Paneer Thali with Jeera Rice & 3 Rotis",
    category: "Lunch Specials",
    price_inr: 140,
    dietary_tag: "Pure Veg",
    calories: 620,
    is_in_stock: true,
    prep_time_mins: 10,
    created_at: "2026-01-10T08:00:00Z",
  },
  {
    id: "mnu-22222222-2222-4222-8222-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    vendor_id: "vnd-22222222-2222-4222-8222-222222222222",
    vendor_name: "Dakshin Delight",
    item_name: "Crispy Ghee Podi Masala Dosa with Sambar & 2 Chutneys",
    category: "Breakfast",
    price_inr: 85,
    dietary_tag: "Pure Veg",
    calories: 410,
    is_in_stock: true,
    prep_time_mins: 8,
    created_at: "2026-01-10T08:00:00Z",
  },
  {
    id: "mnu-33333333-3333-4333-8333-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    vendor_id: "vnd-33333333-3333-4333-8333-333333333333",
    vendor_name: "The Artisan Bistro",
    item_name: "Tuscan Sun-Dried Tomato Penne Alfredo",
    category: "Lunch Specials",
    price_inr: 160,
    dietary_tag: "Pure Veg",
    calories: 550,
    is_in_stock: true,
    prep_time_mins: 15,
    created_at: "2026-01-10T08:00:00Z",
  },
  {
    id: "mnu-44444444-4444-4444-8444-444444444444",
    college_id: "c1111111-1111-4111-8111-111111111111",
    vendor_id: "vnd-44444444-4444-4444-8444-444444444444",
    vendor_name: "GreenFuel Organic",
    item_name: "Grilled Tofu & Quinoa High-Protein Power Bowl",
    category: "Healthy Bowls",
    price_inr: 175,
    dietary_tag: "Vegan",
    calories: 380,
    is_in_stock: true,
    prep_time_mins: 10,
    created_at: "2026-01-10T08:00:00Z",
  },
  {
    id: "mnu-55555555-5555-4555-8555-555555555555",
    college_id: "c1111111-1111-4111-8111-111111111111",
    vendor_id: "vnd-55555555-5555-4555-8555-555555555555",
    vendor_name: "BrewLab Artisanal Coffee",
    item_name: "Vanilla Cold Brew & Warm Chocolate Croissant",
    category: "Snacks & Beverages",
    price_inr: 110,
    dietary_tag: "Egg",
    calories: 290,
    is_in_stock: true,
    prep_time_mins: 5,
    created_at: "2026-01-10T08:00:00Z",
  },
];

export const MOCK_DINING_WALLET: DiningWallet = {
  id: "wlt-11111111-1111-4111-8111-111111111111",
  college_id: "c1111111-1111-4111-8111-111111111111",
  scholar_id: "SCH-2026-8819",
  scholar_name: "Arpit Bavankule",
  wallet_balance_inr: 1420.5,
  monthly_subsidy_inr: 500.0,
  auto_reload_enabled: true,
  qr_payment_token: "WALLET-QR-2026-8819X",
  last_topup_date: "2026-10-01T09:00:00Z",
  created_at: "2026-01-10T08:00:00Z",
};

export const MOCK_MEAL_ORDERS: MealOrder[] = [
  {
    id: "ord-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    order_code: "CL-DINE-2026-78A1",
    scholar_id: "SCH-2026-8819",
    scholar_name: "Arpit Bavankule",
    vendor_name: "Annapurna Royal Thali",
    items_summary: "1x Deluxe Shahi Paneer Thali",
    total_amount_inr: 140.0,
    pickup_slot: "13:15 - 13:30 (Lunch Surge)",
    order_status: "Ready for Pickup",
    payment_method: "Dining Wallet",
    token_pass_code: "TOKEN-78A190",
    created_at: "2026-10-04T07:45:00Z",
  },
  {
    id: "ord-22222222-2222-4222-8222-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    order_code: "CL-DINE-2026-44B9",
    scholar_id: "SCH-2026-8819",
    scholar_name: "Arpit Bavankule",
    vendor_name: "BrewLab Artisanal Coffee",
    items_summary: "1x Vanilla Cold Brew & Croissant",
    total_amount_inr: 110.0,
    pickup_slot: "09:15 - 09:30 (Morning Break)",
    order_status: "Completed",
    payment_method: "Dining Wallet",
    token_pass_code: "TOKEN-44B912",
    created_at: "2026-10-04T03:30:00Z",
  },
  {
    id: "ord-33333333-3333-4333-8333-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    order_code: "CL-DINE-2026-92K4",
    scholar_id: "SCH-2026-4102",
    scholar_name: "Pooja Sharma",
    vendor_name: "GreenFuel Organic",
    items_summary: "1x Grilled Tofu & Quinoa Bowl",
    total_amount_inr: 175.0,
    pickup_slot: "13:30 - 13:45",
    order_status: "Preparing",
    payment_method: "UPI Instant",
    token_pass_code: "TOKEN-92K448",
    created_at: "2026-10-04T07:55:00Z",
  },
];
