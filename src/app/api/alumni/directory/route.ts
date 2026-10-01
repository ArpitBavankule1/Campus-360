import { NextRequest, NextResponse } from "next/server";
import { MOCK_ALUMNI } from "@/lib/alumni/alumni-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { AlumniProfile } from "@/types";

const activeAlumni: AlumniProfile[] = [...MOCK_ALUMNI];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const industry = searchParams.get("industry");
    const batch = searchParams.get("batch");
    const mentorshipOnly = searchParams.get("mentorship") === "true";

    if (
      (q && (containsSQLInjection(q) || containsXSS(q))) ||
      (industry && (containsSQLInjection(industry) || containsXSS(industry))) ||
      (batch && (containsSQLInjection(batch) || containsXSS(batch)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid alumni query parameter." },
        { status: 400 }
      );
    }

    let results = [...activeAlumni];

    if (industry && industry !== "all") {
      const sanitizedIndustry = sanitizeInput(industry).toLowerCase();
      results = results.filter((a) =>
        a.industry.toLowerCase().includes(sanitizedIndustry)
      );
    }

    if (batch && batch !== "all") {
      const batchYear = parseInt(batch, 10);
      if (!isNaN(batchYear)) {
        results = results.filter((a) => a.graduating_year === batchYear);
      }
    }

    if (mentorshipOnly) {
      results = results.filter((a) => a.mentorship_available);
    }

    if (q && q.trim()) {
      const sanitizedQ = sanitizeInput(q).toLowerCase();
      results = results.filter(
        (a) =>
          a.full_name.toLowerCase().includes(sanitizedQ) ||
          a.company.toLowerCase().includes(sanitizedQ) ||
          a.current_role.toLowerCase().includes(sanitizedQ) ||
          a.department.toLowerCase().includes(sanitizedQ) ||
          a.location.toLowerCase().includes(sanitizedQ)
      );
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Alumni directory API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve alumni directory." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      full_name,
      email,
      graduating_year,
      department,
      current_role,
      company,
      industry,
      location,
      bio,
      linkedin_url,
      mentorship_available,
      willing_to_refer,
    } = body;

    if (!full_name || !email || !graduating_year || !company || !current_role) {
      return NextResponse.json(
        { success: false, error: "Missing required alumni profile attributes." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(full_name) ||
      containsXSS(full_name) ||
      containsSQLInjection(email) ||
      containsSQLInjection(company)
    ) {
      return NextResponse.json(
        { success: false, error: "Unsafe inputs detected." },
        { status: 400 }
      );
    }

    const newProfile: AlumniProfile = {
      id: `alm-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      full_name: sanitizeInput(full_name),
      email: sanitizeInput(email),
      graduating_year: Number(graduating_year),
      department: sanitizeInput(department || "Engineering"),
      degree: "B.Tech",
      current_role: sanitizeInput(current_role),
      company: sanitizeInput(company),
      industry: sanitizeInput(industry || "Technology"),
      location: sanitizeInput(location || "Campus"),
      bio: bio ? sanitizeInput(bio) : null,
      linkedin_url: linkedin_url ? sanitizeInput(linkedin_url) : null,
      mentorship_available: Boolean(mentorship_available),
      willing_to_refer: Boolean(willing_to_refer),
      created_at: new Date().toISOString(),
    };

    activeAlumni.unshift(newProfile);

    return NextResponse.json(
      {
        success: true,
        message: "Alumni profile registered successfully.",
        data: newProfile,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Alumni registration error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create alumni profile." },
      { status: 500 }
    );
  }
}
