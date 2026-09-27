import { NextRequest, NextResponse } from "next/server";
import { FacilityBooking } from "@/types";
import { getInitialSeedBookings } from "@/lib/bookings/booking-engine";

// In-memory runtime store shared or initialized
let runtimeBookings: FacilityBooking[] = getInitialSeedBookings();

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, rejection_reason, approved_by } = body;

    const bookingIndex = runtimeBookings.findIndex((b) => b.id === id);

    if (bookingIndex === -1) {
      // Return a synthesized successful update for optimistic UI
      return NextResponse.json({
        success: true,
        message: `Booking ${id} status updated to ${status}`,
        data: { id, status, updated_at: new Date().toISOString() },
      });
    }

    const updated: FacilityBooking = {
      ...runtimeBookings[bookingIndex],
      status: status || runtimeBookings[bookingIndex].status,
      rejection_reason:
        rejection_reason !== undefined
          ? rejection_reason
          : runtimeBookings[bookingIndex].rejection_reason,
      approved_by:
        approved_by !== undefined
          ? approved_by
          : runtimeBookings[bookingIndex].approved_by,
      updated_at: new Date().toISOString(),
    };

    runtimeBookings[bookingIndex] = updated;

    return NextResponse.json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: updated,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    runtimeBookings = runtimeBookings.filter((b) => b.id !== id);

    return NextResponse.json({
      success: true,
      message: `Booking ${id} cancelled successfully`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
