import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_DOCTOR_SCHEDULES,
  MOCK_HEALTH_APPOINTMENTS,
} from "@/lib/health/health-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { HealthAppointment } from "@/types";

const activeAppointments: HealthAppointment[] = [...MOCK_HEALTH_APPOINTMENTS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctor_id");
    const studentId = searchParams.get("student_id");

    if (
      (doctorId && (containsSQLInjection(doctorId) || containsXSS(doctorId))) ||
      (studentId && (containsSQLInjection(studentId) || containsXSS(studentId)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid query parameter." },
        { status: 400 }
      );
    }

    let results = [...activeAppointments];

    if (studentId) {
      const sanitizedStudent = sanitizeInput(studentId);
      results = results.filter((a) => a.student_id === sanitizedStudent);
    }

    return NextResponse.json({
      success: true,
      data: results,
      doctors: MOCK_DOCTOR_SCHEDULES,
      total: results.length,
    });
  } catch (error) {
    console.error("Health appointments fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve appointment schedule." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { doctorName, specialization, appointmentDate, timeSlot, symptoms, studentId } = body;

    if (!doctorName || !appointmentDate || !timeSlot || !symptoms) {
      return NextResponse.json(
        { success: false, error: "Doctor, date, time slot, and symptoms are mandatory." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(doctorName) ||
      containsXSS(doctorName) ||
      containsSQLInjection(symptoms) ||
      containsXSS(symptoms)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid characters in booking details." },
        { status: 400 }
      );
    }

    const tokenNumber = Math.floor(10 + Math.random() * 40);

    const newAppointment: HealthAppointment = {
      id: `ha-${Date.now()}`,
      college_id: "col-apex-001",
      student_id: studentId || "00000000-0000-0000-0000-000000000001",
      doctor_name: sanitizeInput(doctorName),
      specialization: sanitizeInput(specialization || "General Medicine"),
      appointment_date: sanitizeInput(appointmentDate),
      time_slot: sanitizeInput(timeSlot),
      token_number: tokenNumber,
      symptoms: sanitizeInput(symptoms),
      status: "scheduled",
      created_at: new Date().toISOString(),
    };

    activeAppointments.unshift(newAppointment);

    return NextResponse.json({
      success: true,
      data: newAppointment,
      message: `Appointment scheduled with ${newAppointment.doctor_name}. Token #${tokenNumber}`,
    });
  } catch (error) {
    console.error("Appointment booking error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to schedule appointment." },
      { status: 500 }
    );
  }
}
