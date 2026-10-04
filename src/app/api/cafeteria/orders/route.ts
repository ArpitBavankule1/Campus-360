import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_MEAL_ORDERS,
  generateMealOrderCode,
  generateMealTokenPass,
} from "@/lib/cafeteria/cafeteria-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { MealOrder } from "@/types";

const activeOrders: MealOrder[] = [...MOCK_MEAL_ORDERS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderCode = searchParams.get("orderCode");
    const status = searchParams.get("status");

    if (
      (orderCode && (containsSQLInjection(orderCode) || containsXSS(orderCode))) ||
      (status && (containsSQLInjection(status) || containsXSS(status)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid meal order query parameters." },
        { status: 400 }
      );
    }

    let results = [...activeOrders];

    if (orderCode) {
      const sanitizedCode = sanitizeInput(orderCode).toUpperCase();
      results = results.filter((o) => o.order_code === sanitizedCode);
    }

    if (status && status !== "all") {
      const sanitizedStatus = sanitizeInput(status).toLowerCase();
      results = results.filter(
        (o) => o.order_status.toLowerCase() === sanitizedStatus
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
    const {
      scholarId,
      scholarName,
      vendorName,
      itemsSummary,
      totalAmountInr,
      pickupSlot,
      paymentMethod,
    } = body;

    if (!scholarName || !vendorName || !itemsSummary || !totalAmountInr) {
      return NextResponse.json(
        { success: false, error: "Missing required order parameters." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(scholarName) ||
      containsXSS(scholarName) ||
      containsSQLInjection(vendorName) ||
      containsXSS(vendorName) ||
      containsSQLInjection(itemsSummary) ||
      containsXSS(itemsSummary)
    ) {
      return NextResponse.json(
        { success: false, error: "Security violation detected in meal order payload." },
        { status: 400 }
      );
    }

    const newOrder: MealOrder = {
      id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      order_code: generateMealOrderCode(),
      scholar_id: scholarId || "SCH-2026-8819",
      scholar_name: sanitizeInput(scholarName),
      vendor_name: sanitizeInput(vendorName),
      items_summary: sanitizeInput(itemsSummary),
      total_amount_inr: Number(totalAmountInr),
      pickup_slot: pickupSlot || "Immediate Express Pickup (10 mins)",
      order_status: "Preparing",
      payment_method: paymentMethod || "Dining Wallet",
      token_pass_code: generateMealTokenPass(),
      created_at: new Date().toISOString(),
    };

    activeOrders.unshift(newOrder);

    return NextResponse.json({
      success: true,
      data: newOrder,
      message: "Meal order placed with cryptographic counter token.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
