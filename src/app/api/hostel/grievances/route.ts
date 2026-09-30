import { NextRequest, NextResponse } from "next/server";
import { MOCK_HOSTEL_GRIEVANCES } from "@/lib/hostel/hostel-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { GrievanceCategory, GrievancePriority, GrievanceStatus, HostelGrievance } from "@/types";

const activeGrievances: HostelGrievance[] = [...MOCK_HOSTEL_GRIEVANCES];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    if (
      (category && (containsSQLInjection(category) || containsXSS(category))) ||
      (status && (containsSQLInjection(status) || containsXSS(status)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid grievance query parameter." },
        { status: 400 }
      );
    }

    let results = [...activeGrievances];

    if (category && category !== "all") {
      const sanitizedCat = sanitizeInput(category).toLowerCase();
      results = results.filter((g) => g.category === sanitizedCat);
    }

    if (status && status !== "all") {
      const sanitizedStatus = sanitizeInput(status).toLowerCase();
      results = results.filter((g) => g.status === sanitizedStatus);
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Grievances fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch grievances." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, category, priority, roomId, studentId } = body;

    if (!title || title.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "Title must be at least 5 characters long." },
        { status: 400 }
      );
    }

    if (!description || description.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Description must be at least 10 characters long." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(title) ||
      containsXSS(title) ||
      containsSQLInjection(description) ||
      containsXSS(description)
    ) {
      return NextResponse.json(
        { success: false, error: "Malicious input detected in grievance description." },
        { status: 400 }
      );
    }

    const newGrievance: HostelGrievance = {
      id: `gr-${Date.now()}`,
      college_id: "col-apex-001",
      student_id: studentId || "00000000-0000-0000-0000-000000000001",
      room_id: roomId ? sanitizeInput(roomId) : "hr-101",
      category: (category as GrievanceCategory) || "other",
      priority: (priority as GrievancePriority) || "medium",
      title: sanitizeInput(title),
      description: sanitizeInput(description),
      status: "reported",
      assigned_to: "Duty Hostel Maintenance Technician",
      resolved_at: null,
      created_at: new Date().toISOString(),
    };

    activeGrievances.unshift(newGrievance);

    return NextResponse.json({
      success: true,
      data: newGrievance,
      message: "Maintenance grievance logged successfully.",
    });
  } catch (error) {
    console.error("Grievance submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit grievance." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { grievanceId, status, assignedTo } = body;

    if (!grievanceId || !status) {
      return NextResponse.json(
        { success: false, error: "Grievance ID and updated status are required." },
        { status: 400 }
      );
    }

    const index = activeGrievances.findIndex((g) => g.id === grievanceId);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Grievance record not found." },
        { status: 404 }
      );
    }

    activeGrievances[index] = {
      ...activeGrievances[index],
      status: status as GrievanceStatus,
      assigned_to: assignedTo ? sanitizeInput(assignedTo) : activeGrievances[index].assigned_to,
      resolved_at: status === "resolved" ? new Date().toISOString() : activeGrievances[index].resolved_at,
    };

    return NextResponse.json({
      success: true,
      data: activeGrievances[index],
      message: "Grievance status updated successfully.",
    });
  } catch (error) {
    console.error("Grievance status update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update grievance status." },
      { status: 500 }
    );
  }
}
