import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_PLACEMENT_DRIVES,
} from "@/lib/placements/placement-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { PlacementDrive } from "@/types";

let activeDrives: PlacementDrive[] = [...MOCK_PLACEMENT_DRIVES];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const department = searchParams.get("department");
    const status = searchParams.get("status");

    // Guard against SQL injection or XSS in search query parameters
    if (
      (search && (containsSQLInjection(search) || containsXSS(search))) ||
      (department && (containsSQLInjection(department) || containsXSS(department)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid parameter format detected." },
        { status: 400 }
      );
    }

    let results = [...activeDrives];

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (d) =>
          d.company_name.toLowerCase().includes(q) ||
          d.role_title.toLowerCase().includes(q) ||
          d.skills_required.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (department && department !== "ALL") {
      const dep = department.toUpperCase();
      results = results.filter(
        (d) =>
          d.allowed_departments.includes("ALL") ||
          d.allowed_departments.map((x) => x.toUpperCase()).includes(dep)
      );
    }

    if (status) {
      results = results.filter((d) => d.status === status);
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      data: results,
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
      company_name,
      role_title,
      drive_type = "full_time",
      ctc_lpa,
      stipend_monthly = 0,
      location = "Campus / Hybrid",
      eligibility_min_cgpa = 6.0,
      allowed_departments = ["CSE", "IT", "ECE"],
      max_active_backlogs = 0,
      application_deadline,
      drive_date,
      job_description,
      skills_required = [],
    } = body;

    if (!company_name || !role_title || !ctc_lpa || !application_deadline || !drive_date) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: company_name, role_title, ctc_lpa, application_deadline, drive_date",
        },
        { status: 400 }
      );
    }

    // Anti-injection defenses
    if (
      containsSQLInjection(company_name) ||
      containsSQLInjection(role_title) ||
      containsSQLInjection(job_description || "") ||
      containsXSS(company_name) ||
      containsXSS(role_title)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Malicious payload detected: SQL injection or script attempt blocked.",
        },
        { status: 400 }
      );
    }

    const cleanCompany = sanitizeInput(company_name, 100);
    const cleanRole = sanitizeInput(role_title, 100);
    const cleanDesc = sanitizeInput(job_description || "", 1000);

    const newDrive: PlacementDrive = {
      id: `drv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      college_id: "c0000000-0000-0000-0000-000000000001",
      company_name: cleanCompany,
      role_title: cleanRole,
      drive_type,
      ctc_lpa: Number(ctc_lpa),
      stipend_monthly: Number(stipend_monthly),
      location: sanitizeInput(location, 100),
      eligibility_min_cgpa: Number(eligibility_min_cgpa),
      allowed_departments: Array.isArray(allowed_departments) ? allowed_departments : ["CSE"],
      max_active_backlogs: Number(max_active_backlogs),
      application_deadline,
      drive_date,
      status: "upcoming",
      job_description: cleanDesc,
      skills_required: Array.isArray(skills_required) ? skills_required : [],
      created_at: new Date().toISOString(),
      total_applicants: 0,
    };

    activeDrives.unshift(newDrive);

    return NextResponse.json(
      {
        success: true,
        message: "Placement drive published successfully.",
        data: newDrive,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
