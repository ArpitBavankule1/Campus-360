import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_PARKING_ZONES,
  generateParkingPassCode,
} from "@/lib/transport/transport-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { ParkingZone, ParkingReservation, VehicleType } from "@/types";

const activeZones: ParkingZone[] = [...MOCK_PARKING_ZONES];
const activeReservations: ParkingReservation[] = [];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    if (category && (containsSQLInjection(category) || containsXSS(category))) {
      return NextResponse.json(
        { success: false, error: "Invalid parking query parameter." },
        { status: 400 }
      );
    }

    let results = [...activeZones];
    if (category && category !== "all") {
      results = results.filter((z) => z.category === category);
    }

    const totalBays = activeZones.reduce((acc, z) => acc + z.total_bays, 0);
    const totalOccupied = activeZones.reduce((acc, z) => acc + z.occupied_bays, 0);

    return NextResponse.json({
      success: true,
      data: results,
      stats: {
        totalBays,
        totalOccupied,
        availableBays: totalBays - totalOccupied,
      },
    });
  } catch (error) {
    console.error("Parking GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch parking zones." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      user_id,
      user_name,
      zone_id,
      vehicle_plate,
      vehicle_type,
      duration_hours,
    } = body;

    if (!user_id || !user_name || !zone_id || !vehicle_plate) {
      return NextResponse.json(
        { success: false, error: "Missing required parking reservation details." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(user_name) ||
      containsXSS(user_name) ||
      containsSQLInjection(vehicle_plate)
    ) {
      return NextResponse.json(
        { success: false, error: "Unsafe inputs in parking reservation." },
        { status: 400 }
      );
    }

    const zone = activeZones.find((z) => z.id === zone_id);
    if (!zone) {
      return NextResponse.json(
        { success: false, error: "Parking zone not found." },
        { status: 404 }
      );
    }

    if (zone.occupied_bays >= zone.total_bays) {
      return NextResponse.json(
        { success: false, error: "Selected parking zone is currently fully occupied." },
        { status: 400 }
      );
    }

    // Allocate next bay
    zone.occupied_bays += 1;
    const bayNumber = `${zone.zone_code.split("-")[0]}-${zone.occupied_bays.toString().padStart(2, "0")}`;
    const passCode = generateParkingPassCode(zone.zone_code);
    const hours = Number(duration_hours) || 4;

    const newReservation: ParkingReservation = {
      id: `res-prk-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      user_id: sanitizeInput(user_id),
      user_name: sanitizeInput(user_name),
      zone_id: zone.id,
      bay_number: bayNumber,
      vehicle_plate: sanitizeInput(vehicle_plate).toUpperCase(),
      vehicle_type: (vehicle_type as VehicleType) || "ev",
      reserved_from: new Date().toISOString(),
      reserved_until: new Date(Date.now() + hours * 60 * 60 * 1000).toISOString(),
      pass_code: passCode,
      status: "active",
      created_at: new Date().toISOString(),
      zone,
    };

    activeReservations.unshift(newReservation);

    return NextResponse.json(
      {
        success: true,
        message: `Bay ${bayNumber} reserved successfully at ${zone.zone_name}!`,
        data: newReservation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Parking reservation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reserve parking bay." },
      { status: 500 }
    );
  }
}
