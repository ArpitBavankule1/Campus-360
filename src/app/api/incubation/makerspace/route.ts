import { NextRequest, NextResponse } from "next/server";
import { MOCK_MAKER_EQUIPMENT } from "@/lib/incubation/incubation-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { MakerSpaceEquipment } from "@/types";

const activeEquipment: MakerSpaceEquipment[] = [...MOCK_MAKER_EQUIPMENT];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const equipmentType = searchParams.get("type");

    if (equipmentType && (containsSQLInjection(equipmentType) || containsXSS(equipmentType))) {
      return NextResponse.json(
        { success: false, error: "Invalid equipment query parameters." },
        { status: 400 }
      );
    }

    let results = [...activeEquipment];

    if (equipmentType && equipmentType !== "all") {
      const sanitizedType = sanitizeInput(equipmentType);
      results = results.filter((e) => e.equipment_type.toLowerCase() === sanitizedType.toLowerCase());
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
    const { equipmentId, founderName, projectTitle, date, timeSlot } = body;

    if (!equipmentId || !founderName || !projectTitle || !date || !timeSlot) {
      return NextResponse.json(
        { success: false, error: "Missing required prototyping workbench reservation parameters." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(founderName) ||
      containsXSS(founderName) ||
      containsSQLInjection(projectTitle) ||
      containsXSS(projectTitle)
    ) {
      return NextResponse.json(
        { success: false, error: "Suspicious characters detected in prototyping slot request." },
        { status: 400 }
      );
    }

    const item = activeEquipment.find((e) => e.id === equipmentId);
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Maker space equipment not found." },
        { status: 404 }
      );
    }

    const slotToken = `MS-SLOT-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    return NextResponse.json(
      {
        success: true,
        message: `Workbench slot confirmed on ${item.equipment_name}`,
        booking: {
          slotToken,
          equipmentName: item.equipment_name,
          labVenue: item.location_lab,
          reservedBy: sanitizeInput(founderName),
          projectTitle: sanitizeInput(projectTitle),
          date,
          timeSlot: sanitizeInput(timeSlot),
          status: "Lab Tech Assigned",
          confirmedAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
