import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_EQUIPMENT_LOANS,
  generateEquipmentCode,
} from "@/lib/sports/sports-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { EquipmentLoan } from "@/types";

const activeLoans: EquipmentLoan[] = [...MOCK_EQUIPMENT_LOANS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const equipmentCode = searchParams.get("code");
    const status = searchParams.get("status");

    if (
      (equipmentCode && (containsSQLInjection(equipmentCode) || containsXSS(equipmentCode))) ||
      (status && (containsSQLInjection(status) || containsXSS(status)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid equipment query parameters." },
        { status: 400 }
      );
    }

    let results = [...activeLoans];

    if (equipmentCode) {
      const sanitizedCode = sanitizeInput(equipmentCode).toUpperCase();
      results = results.filter((l) => l.equipment_code === sanitizedCode);
    }

    if (status && status !== "all") {
      const sanitizedStatus = sanitizeInput(status);
      results = results.filter((l) => l.status.toLowerCase() === sanitizedStatus.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { itemName, sportType, borrowerName, borrowerId, quantity, depositInr } = body;

    if (!itemName || !borrowerName || !borrowerId) {
      return NextResponse.json(
        { success: false, error: "Missing required equipment checkout parameters." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(itemName) ||
      containsXSS(itemName) ||
      containsSQLInjection(borrowerName) ||
      containsXSS(borrowerName)
    ) {
      return NextResponse.json(
        { success: false, error: "Suspicious characters detected in checkout request." },
        { status: 400 }
      );
    }

    const code = generateEquipmentCode();
    const now = new Date();
    const due = new Date(now.getTime() + 3 * 60 * 60 * 1000); // 3-hour loan window

    const newLoan: EquipmentLoan = {
      id: `lo-${Math.random().toString(36).substring(2, 10)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      equipment_code: code,
      item_name: sanitizeInput(itemName),
      sport_type: sportType ? sanitizeInput(sportType) : "General Sports",
      borrower_id: sanitizeInput(borrowerId),
      borrower_name: sanitizeInput(borrowerName),
      quantity: quantity || 1,
      checkout_time: now.toISOString(),
      due_time: due.toISOString(),
      deposit_inr: depositInr || 200,
      item_condition: "Good",
      status: "Active Loan",
      created_at: now.toISOString(),
    };

    activeLoans.unshift(newLoan);

    return NextResponse.json(
      {
        success: true,
        message: "Equipment checked out successfully. Return before SLA expiry to reclaim deposit.",
        loan: newLoan,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
