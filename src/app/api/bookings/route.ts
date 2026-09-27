import { NextRequest, NextResponse } from "next/server";
import {
  CAMPUS_SPACES,
  determineBookingInitialStatus,
  generateBookingPassCode,
  getInitialSeedBookings,
  isSlotAvailable,
} from "@/lib/bookings/booking-engine";
import { FacilityBooking } from "@/types";

// In-memory runtime cache for seamless operation across the server session
let activeBookings: FacilityBooking[] = getInitialSeedBookings();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const facilityId = searchParams.get("facility_id");
    const date = searchParams.get("date");
    const userId = searchParams.get("user_id");
    const status = searchParams.get("status");

    let results = [...activeBookings];

    if (facilityId) {
      results = results.filter((b) => b.facility_id === facilityId);
    }
    if (date) {
      results = results.filter((b) => b.booking_date === date);
    }
    if (userId) {
      results = results.filter((b) => b.user_id === userId);
    }
    if (status) {
      results = results.filter((b) => b.status === status);
    }

    // Attach facility details
    const enrichedResults = results.map((b) => {
      const space = CAMPUS_SPACES.find((s) => s.id === b.facility_id);
      return {
        ...b,
        facilityDetails: space || null,
      };
    });

    return NextResponse.json({
      success: true,
      count: enrichedResults.length,
      data: enrichedResults,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      facility_id,
      user_id = "usr-demo-01",
      booking_date,
      start_time,
      end_time,
      purpose,
      attendees_count = 1,
      user_name = "Campus Student",
      user_email = "student@campuslens.edu",
      user_role = "student",
    } = body;

    if (!facility_id || !booking_date || !start_time || !end_time || !purpose) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: facility_id, booking_date, start_time, end_time, purpose",
        },
        { status: 400 }
      );
    }

    const space = CAMPUS_SPACES.find((s) => s.id === facility_id);
    if (!space) {
      return NextResponse.json(
        { success: false, error: "Facility not found" },
        { status: 404 }
      );
    }

    // Collision Check
    const available = isSlotAvailable(
      activeBookings,
      facility_id,
      booking_date,
      start_time,
      end_time
    );

    if (!available) {
      return NextResponse.json(
        {
          success: false,
          error: "Slot collision: This facility is already reserved for the requested timeframe.",
        },
        { status: 409 }
      );
    }

    const status = determineBookingInitialStatus(space);
    const passCode = generateBookingPassCode(space.category);

    const newBooking: FacilityBooking = {
      id: `bk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      college_id: "c0000000-0000-0000-0000-000000000001",
      facility_id,
      user_id,
      booking_date,
      start_time,
      end_time,
      purpose,
      attendees_count: Number(attendees_count) || 1,
      status,
      booking_pass_code: passCode,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_name,
      user_email,
      user_role,
    };

    activeBookings.unshift(newBooking);

    return NextResponse.json(
      {
        success: true,
        message:
          status === "approved"
            ? "Facility reservation confirmed! Your digital booking pass is ready."
            : "Facility reservation submitted for administrative approval.",
        data: {
          ...newBooking,
          facilityDetails: space,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
