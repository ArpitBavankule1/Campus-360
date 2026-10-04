import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_DINING_VENDORS,
  MOCK_MENU_ITEMS,
} from "@/lib/cafeteria/cafeteria-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { DiningVendor } from "@/types";

const activeVendors: DiningVendor[] = [...MOCK_DINING_VENDORS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cuisine = searchParams.get("cuisine");
    const q = searchParams.get("q");

    if (
      (cuisine && (containsSQLInjection(cuisine) || containsXSS(cuisine))) ||
      (q && (containsSQLInjection(q) || containsXSS(q)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid dining vendor query parameters." },
        { status: 400 }
      );
    }

    let results = [...activeVendors];

    if (cuisine && cuisine !== "all") {
      const sanitizedCuisine = sanitizeInput(cuisine).toLowerCase();
      results = results.filter((v) =>
        v.cuisine_type.toLowerCase().includes(sanitizedCuisine)
      );
    }

    if (q && q.trim()) {
      const sanitizedQ = sanitizeInput(q).toLowerCase();
      results = results.filter(
        (v) =>
          v.vendor_name.toLowerCase().includes(sanitizedQ) ||
          v.location_stall.toLowerCase().includes(sanitizedQ) ||
          v.cuisine_type.toLowerCase().includes(sanitizedQ)
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
    const { vendorName, cuisineType, locationStall, openingTime, closingTime } = body;

    if (!vendorName || !cuisineType || !locationStall) {
      return NextResponse.json(
        { success: false, error: "Missing required vendor fields." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(vendorName) ||
      containsXSS(vendorName) ||
      containsSQLInjection(locationStall) ||
      containsXSS(locationStall)
    ) {
      return NextResponse.json(
        { success: false, error: "Security violation detected in vendor payload." },
        { status: 400 }
      );
    }

    const newVendor: DiningVendor = {
      id: `vnd-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      vendor_name: sanitizeInput(vendorName),
      cuisine_type: cuisineType,
      location_stall: sanitizeInput(locationStall),
      opening_time: openingTime || "08:00:00",
      closing_time: closingTime || "22:00:00",
      rating: 4.8,
      is_accepting_orders: true,
      average_prep_time_mins: 12,
      created_at: new Date().toISOString(),
    };

    activeVendors.unshift(newVendor);

    return NextResponse.json({
      success: true,
      data: newVendor,
      message: "Dining vendor outlet registered successfully.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
