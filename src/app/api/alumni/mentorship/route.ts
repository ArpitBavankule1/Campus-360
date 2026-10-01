import { NextRequest, NextResponse } from "next/server";
import { MOCK_ALUMNI, MOCK_MENTORSHIPS } from "@/lib/alumni/alumni-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { AlumniMentorshipSession, MentorshipTopic } from "@/types";

const activeSessions: AlumniMentorshipSession[] = [...MOCK_MENTORSHIPS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const alumniId = searchParams.get("alumni_id");
    const studentId = searchParams.get("student_id");
    const status = searchParams.get("status");

    if (
      (alumniId && (containsSQLInjection(alumniId) || containsXSS(alumniId))) ||
      (studentId && (containsSQLInjection(studentId) || containsXSS(studentId)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid mentorship parameters." },
        { status: 400 }
      );
    }

    let results = [...activeSessions];

    if (alumniId) {
      results = results.filter((s) => s.alumni_id === alumniId);
    }
    if (studentId) {
      results = results.filter((s) => s.student_id === studentId);
    }
    if (status && status !== "all") {
      results = results.filter((s) => s.status === status);
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Mentorship API GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch mentorship sessions." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { alumni_id, student_id, student_name, student_email, topic, scheduled_at, notes } = body;

    if (!alumni_id || !student_id || !student_name || !topic || !scheduled_at) {
      return NextResponse.json(
        { success: false, error: "Missing required mentorship booking parameters." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(student_name) ||
      containsXSS(student_name) ||
      containsSQLInjection(topic)
    ) {
      return NextResponse.json(
        { success: false, error: "Unsafe booking details detected." },
        { status: 400 }
      );
    }

    const alumni = MOCK_ALUMNI.find((a) => a.id === alumni_id);
    if (!alumni) {
      return NextResponse.json(
        { success: false, error: "Alumni mentor not found." },
        { status: 404 }
      );
    }

    if (!alumni.mentorship_available) {
      return NextResponse.json(
        { success: false, error: "This mentor is currently not accepting new bookings." },
        { status: 400 }
      );
    }

    const newSession: AlumniMentorshipSession = {
      id: `ses-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      alumni_id: sanitizeInput(alumni_id),
      student_id: sanitizeInput(student_id),
      student_name: sanitizeInput(student_name),
      student_email: sanitizeInput(student_email || "scholar@campuslens.edu"),
      topic: topic as MentorshipTopic,
      session_type: "virtual",
      scheduled_at: new Date(scheduled_at).toISOString(),
      duration_minutes: 45,
      meeting_url: `https://meet.google.com/alm-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`,
      notes: notes ? sanitizeInput(notes) : null,
      status: "confirmed",
      created_at: new Date().toISOString(),
      alumni,
    };

    activeSessions.unshift(newSession);

    return NextResponse.json(
      {
        success: true,
        message: "Mentorship session booked successfully!",
        data: newSession,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Mentorship booking error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to book mentorship session." },
      { status: 500 }
    );
  }
}
