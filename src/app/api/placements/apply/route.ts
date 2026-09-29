import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_PLACEMENT_DRIVES,
  MOCK_STUDENT_APPLICATIONS,
  checkDriveEligibility,
} from "@/lib/placements/placement-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { PlacementApplication } from "@/types";

const activeApplications: PlacementApplication[] = [...MOCK_STUDENT_APPLICATIONS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("student_id") || "usr-demo-01";

    const userApps = activeApplications.filter((a) => a.student_id === studentId);

    // Enrich with drive details
    const enriched = userApps.map((app) => ({
      ...app,
      drive: MOCK_PLACEMENT_DRIVES.find((d) => d.id === app.drive_id) || app.drive,
    }));

    return NextResponse.json({
      success: true,
      count: enriched.length,
      data: enriched,
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
      drive_id,
      student_id = "usr-demo-01",
      cgpa = 8.85,
      department = "CSE",
      active_backlogs = 0,
      notes,
      resume_url = "https://campuslens.edu/resumes/arjun-sharma-2026.pdf",
    } = body;

    if (!drive_id) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: drive_id" },
        { status: 400 }
      );
    }

    // Protection against injection attacks
    if (
      containsSQLInjection(drive_id) ||
      containsSQLInjection(notes || "") ||
      containsXSS(notes || "")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Malicious payload detected: SQL injection or script attempt blocked.",
        },
        { status: 400 }
      );
    }

    const drive = MOCK_PLACEMENT_DRIVES.find((d) => d.id === drive_id);
    if (!drive) {
      return NextResponse.json(
        { success: false, error: "Placement drive not found." },
        { status: 404 }
      );
    }

    // Check duplicate application
    const existing = activeApplications.find(
      (a) => a.drive_id === drive_id && a.student_id === student_id
    );
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "You have already submitted an application for this placement drive.",
        },
        { status: 409 }
      );
    }

    // Eligibility verification
    const eligibility = checkDriveEligibility(drive, {
      cgpa: Number(cgpa),
      department: String(department),
      activeBacklogs: Number(active_backlogs),
    });

    if (!eligibility.isEligible) {
      return NextResponse.json(
        {
          success: false,
          error: `Application rejected: Ineligible for drive. ${eligibility.reasons.join(". ")}`,
          reasons: eligibility.reasons,
        },
        { status: 403 }
      );
    }

    const newApp: PlacementApplication = {
      id: `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      drive_id,
      student_id,
      college_id: "c0000000-0000-0000-0000-000000000001",
      resume_url,
      current_cgpa: Number(cgpa),
      status: "applied",
      applied_at: new Date().toISOString(),
      notes: notes ? sanitizeInput(notes, 300) : "Candidate applied via portal.",
      drive,
    };

    activeApplications.unshift(newApp);

    return NextResponse.json(
      {
        success: true,
        message: `Application to ${drive.company_name} for ${drive.role_title} submitted successfully!`,
        data: newApp,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
