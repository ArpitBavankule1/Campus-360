import { NextRequest, NextResponse } from "next/server";
import { MOCK_ROUTES, MOCK_SCHEDULES } from "@/lib/transport/transport-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { TransportRoute, ShuttleType } from "@/types";

const activeRoutes: TransportRoute[] = [...MOCK_ROUTES];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    if (
      (type && (containsSQLInjection(type) || containsXSS(type))) ||
      (status && (containsSQLInjection(status) || containsXSS(status)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid route query parameter." },
        { status: 400 }
      );
    }

    let results = [...activeRoutes];

    if (type && type !== "all") {
      results = results.filter((r) => r.shuttle_type === type);
    }
    if (status && status !== "all") {
      results = results.filter((r) => r.status === status);
    }

    // Attach current active schedule to route
    const enriched = results.map((route) => {
      const schedule = MOCK_SCHEDULES.find((s) => s.route_id === route.id);
      return {
        ...route,
        current_schedule: schedule || null,
      };
    });

    return NextResponse.json({
      success: true,
      data: enriched,
      total: enriched.length,
    });
  } catch (error) {
    console.error("Transport routes GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve transport routes." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      route_name,
      route_code,
      shuttle_type,
      start_point,
      end_point,
      operating_hours,
      frequency_mins,
    } = body;

    if (!route_name || !route_code || !start_point || !end_point) {
      return NextResponse.json(
        { success: false, error: "Missing required route attributes." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(route_name) ||
      containsXSS(route_name) ||
      containsSQLInjection(route_code)
    ) {
      return NextResponse.json(
        { success: false, error: "Unsafe route inputs detected." },
        { status: 400 }
      );
    }

    const newRoute: TransportRoute = {
      id: `rt-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      route_name: sanitizeInput(route_name),
      route_code: sanitizeInput(route_code).toUpperCase(),
      shuttle_type: (shuttle_type as ShuttleType) || "electric_bus",
      start_point: sanitizeInput(start_point),
      end_point: sanitizeInput(end_point),
      stops: [
        { name: sanitizeInput(start_point), eta_mins: 0 },
        { name: "Central Academic Complex", eta_mins: 8 },
        { name: sanitizeInput(end_point), eta_mins: 15 },
      ],
      operating_hours: operating_hours ? sanitizeInput(operating_hours) : "07:30 AM - 10:00 PM",
      frequency_mins: Number(frequency_mins) || 15,
      status: "active",
      created_at: new Date().toISOString(),
    };

    activeRoutes.push(newRoute);

    return NextResponse.json(
      {
        success: true,
        message: "Transport route registered successfully.",
        data: newRoute,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Transport route creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create transport route." },
      { status: 500 }
    );
  }
}
