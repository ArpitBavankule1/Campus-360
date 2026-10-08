import { NextResponse } from "next/server";
import {
  getPTMConsultationSlots,
  bookPTMConsultationSlot,
} from "@/lib/parents/parents-engine";

export async function GET() {
  try {
    const slots = getPTMConsultationSlots();
    return NextResponse.json({
      success: true,
      data: slots,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch PTM consultation slots" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { facultyName, designation, mode, scheduledDate, timeSlot, agenda } = body;

    if (!facultyName || !scheduledDate || !timeSlot || !agenda) {
      return NextResponse.json(
        { success: false, error: "Required fields missing for PTM consultation booking." },
        { status: 400 }
      );
    }

    const slot = bookPTMConsultationSlot({
      facultyName,
      designation: designation || "Academic Proctor & Faculty Mentor",
      mode: mode || "Virtual Google Meet",
      scheduledDate,
      timeSlot,
      agenda,
    });

    return NextResponse.json({
      success: true,
      message: "PTM Proctor consultation appointment booked successfully.",
      data: slot,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to book PTM consultation appointment" },
      { status: 500 }
    );
  }
}
