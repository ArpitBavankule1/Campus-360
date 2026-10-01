import { NextRequest, NextResponse } from "next/server";
import { MOCK_CARPOOL_LISTINGS } from "@/lib/transport/transport-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { CarpoolListing } from "@/types";

const activeCarpools: CarpoolListing[] = [...MOCK_CARPOOL_LISTINGS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");

    if (location && (containsSQLInjection(location) || containsXSS(location))) {
      return NextResponse.json(
        { success: false, error: "Invalid location filter." },
        { status: 400 }
      );
    }

    let results = activeCarpools.filter((c) => c.is_active);

    if (location && location.trim()) {
      const sanitized = sanitizeInput(location).toLowerCase();
      results = results.filter(
        (c) =>
          c.departure_location.toLowerCase().includes(sanitized) ||
          c.destination_campus.toLowerCase().includes(sanitized)
      );
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Carpool GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch carpool listings." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, carpool_id, driver_id, driver_name, driver_role, departure_location, departure_time, seats_available, price_per_seat, vehicle_model, contact_phone } = body;

    // Join ride action
    if (action === "join" && carpool_id) {
      const carpool = activeCarpools.find((c) => c.id === carpool_id);
      if (!carpool) {
        return NextResponse.json(
          { success: false, error: "Carpool listing not found." },
          { status: 404 }
        );
      }
      if (carpool.seats_available <= 0) {
        return NextResponse.json(
          { success: false, error: "All seats have been filled." },
          { status: 400 }
        );
      }
      carpool.seats_available -= 1;
      return NextResponse.json({
        success: true,
        message: "Seat reserved in carpool! Contact details shared.",
        data: carpool,
      });
    }

    // Publish ride action
    if (!driver_id || !driver_name || !departure_location || !departure_time || !vehicle_model) {
      return NextResponse.json(
        { success: false, error: "Missing required ride publication parameters." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(driver_name) ||
      containsXSS(driver_name) ||
      containsSQLInjection(departure_location)
    ) {
      return NextResponse.json(
        { success: false, error: "Unsafe inputs in carpool publication." },
        { status: 400 }
      );
    }

    const newCarpool: CarpoolListing = {
      id: `car-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      driver_id: sanitizeInput(driver_id),
      driver_name: sanitizeInput(driver_name),
      driver_role: driver_role || "student",
      departure_location: sanitizeInput(departure_location),
      destination_campus: "Main Campus North Gate",
      departure_time: sanitizeInput(departure_time),
      seats_available: Number(seats_available) || 3,
      price_per_seat: Number(price_per_seat) || 0,
      vehicle_model: sanitizeInput(vehicle_model),
      contact_phone: sanitizeInput(contact_phone || "+91 99999 88888"),
      is_active: true,
      created_at: new Date().toISOString(),
    };

    activeCarpools.unshift(newCarpool);

    return NextResponse.json(
      {
        success: true,
        message: "Campus carpool published successfully!",
        data: newCarpool,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Carpool publication error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to publish carpool." },
      { status: 500 }
    );
  }
}
