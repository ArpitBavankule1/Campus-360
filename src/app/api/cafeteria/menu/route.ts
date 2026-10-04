import { NextRequest, NextResponse } from "next/server";
import { MOCK_MENU_ITEMS } from "@/lib/cafeteria/cafeteria-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { MenuItem } from "@/types";

const activeMenuItems: MenuItem[] = [...MOCK_MENU_ITEMS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const dietaryTag = searchParams.get("dietaryTag");
    const q = searchParams.get("q");

    if (
      (category && (containsSQLInjection(category) || containsXSS(category))) ||
      (dietaryTag && (containsSQLInjection(dietaryTag) || containsXSS(dietaryTag))) ||
      (q && (containsSQLInjection(q) || containsXSS(q)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid menu query parameters." },
        { status: 400 }
      );
    }

    let results = [...activeMenuItems];

    if (category && category !== "all") {
      const sanitizedCat = sanitizeInput(category).toLowerCase();
      results = results.filter((m) =>
        m.category.toLowerCase().includes(sanitizedCat)
      );
    }

    if (dietaryTag && dietaryTag !== "all") {
      const sanitizedTag = sanitizeInput(dietaryTag).toLowerCase();
      results = results.filter((m) =>
        m.dietary_tag.toLowerCase().includes(sanitizedTag)
      );
    }

    if (q && q.trim()) {
      const sanitizedQ = sanitizeInput(q).toLowerCase();
      results = results.filter(
        (m) =>
          m.item_name.toLowerCase().includes(sanitizedQ) ||
          (m.vendor_name && m.vendor_name.toLowerCase().includes(sanitizedQ)) ||
          m.dietary_tag.toLowerCase().includes(sanitizedQ)
      );
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { vendorId, vendorName, itemName, category, priceInr, dietaryTag, calories } = body;

    if (!itemName || !category || !priceInr) {
      return NextResponse.json(
        { success: false, error: "Missing required menu item fields." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(itemName) ||
      containsXSS(itemName) ||
      containsSQLInjection(category) ||
      containsXSS(category)
    ) {
      return NextResponse.json(
        { success: false, error: "Security violation detected in menu payload." },
        { status: 400 }
      );
    }

    const newItem: MenuItem = {
      id: `mnu-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      vendor_id: vendorId || "vnd-11111111-1111-4111-8111-111111111111",
      vendor_name: vendorName ? sanitizeInput(vendorName) : "Annapurna Royal Thali",
      item_name: sanitizeInput(itemName),
      category: category,
      price_inr: Number(priceInr),
      dietary_tag: dietaryTag || "Pure Veg",
      calories: Number(calories) || 350,
      is_in_stock: true,
      prep_time_mins: 10,
      created_at: new Date().toISOString(),
    };

    activeMenuItems.unshift(newItem);

    return NextResponse.json({
      success: true,
      data: newItem,
      message: "Menu item added to live cafeteria catalog.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
