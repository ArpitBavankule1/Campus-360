import { NextRequest, NextResponse } from "next/server";
import { MOCK_STUDENT_OFFERS } from "@/lib/placements/placement-engine";
import { PlacementOffer } from "@/types";

const activeOffers: PlacementOffer[] = [...MOCK_STUDENT_OFFERS];

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: activeOffers,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { offer_id, acceptance_status } = body;

    if (!offer_id || !acceptance_status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: offer_id, acceptance_status" },
        { status: 400 }
      );
    }

    if (!["accepted", "declined"].includes(acceptance_status)) {
      return NextResponse.json(
        { success: false, error: "acceptance_status must be 'accepted' or 'declined'" },
        { status: 400 }
      );
    }

    const offer = activeOffers.find((o) => o.id === offer_id);
    if (!offer) {
      return NextResponse.json(
        { success: false, error: "Offer not found." },
        { status: 404 }
      );
    }

    offer.acceptance_status = acceptance_status;

    return NextResponse.json({
      success: true,
      message: `Offer from ${offer.company_name} successfully ${acceptance_status}!`,
      data: offer,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
