import { NextResponse } from "next/server";
import {
  MOCK_THESIS_BINDING_ORDERS,
  generateThesisBindingCode,
} from "@/lib/printing/printing-engine";
import { ThesisBindingOrder } from "@/types";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_THESIS_BINDING_ORDERS,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const copies = Number(body.copies_requested || 3);
    const ratePerCopy = body.cover_type?.includes("Leatherette")
      ? 600
      : body.cover_type?.includes("Hardcover")
      ? 450
      : 200;
    const totalFee = copies * ratePerCopy;

    const newOrder: ThesisBindingOrder = {
      id: `th-${Date.now()}`,
      college_id: body.college_id || "c0000000-0000-0000-0000-000000000001",
      order_code: generateThesisBindingCode(),
      scholar_id: body.scholar_id || "SCH-CS-2023-019",
      scholar_name: body.scholar_name || "Aarav Sharma",
      department: body.department || "Computer Science & Engineering",
      thesis_title: body.thesis_title || "Honours Thesis Research",
      degree_program: body.degree_program || "B.Tech in Artificial Intelligence",
      cover_type: body.cover_type || "Hardcover Royal Navy (Gold Foil)",
      copies_requested: copies,
      embossing_text: body.embossing_text || "APEX INSTITUTE OF TECHNOLOGY • THESIS • 2026",
      binding_status: "Submitted for Binding",
      department_signoff_status: "Approved by HOD",
      target_delivery_date: body.target_delivery_date || "2026-10-15",
      total_fee_inr: totalFee,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Thesis & dissertation hardcover binding order submitted successfully",
      data: newOrder,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to submit thesis binding order" },
      { status: 400 }
    );
  }
}
