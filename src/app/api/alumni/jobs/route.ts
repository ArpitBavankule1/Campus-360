import { NextRequest, NextResponse } from "next/server";
import { MOCK_JOB_REFERRALS, generateReferralCode } from "@/lib/alumni/alumni-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { AlumniJobReferral, JobReferralType, JobExperienceLevel } from "@/types";

const activeReferrals: AlumniJobReferral[] = [...MOCK_JOB_REFERRALS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const exp = searchParams.get("experience");
    const q = searchParams.get("q");

    if (
      (type && (containsSQLInjection(type) || containsXSS(type))) ||
      (exp && (containsSQLInjection(exp) || containsXSS(exp))) ||
      (q && (containsSQLInjection(q) || containsXSS(q)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid referral query parameters." },
        { status: 400 }
      );
    }

    let results = activeReferrals.filter((r) => r.is_active);

    if (type && type !== "all") {
      results = results.filter((r) => r.job_type === type);
    }
    if (exp && exp !== "all") {
      results = results.filter((r) => r.experience_level === exp);
    }
    if (q && q.trim()) {
      const sanitizedQ = sanitizeInput(q).toLowerCase();
      results = results.filter(
        (r) =>
          r.role_title.toLowerCase().includes(sanitizedQ) ||
          r.company.toLowerCase().includes(sanitizedQ) ||
          r.location.toLowerCase().includes(sanitizedQ) ||
          r.description.toLowerCase().includes(sanitizedQ)
      );
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Job referrals GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch job referrals." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      alumni_id,
      alumni_name,
      company,
      role_title,
      job_type,
      experience_level,
      location,
      salary_range,
      application_deadline,
      apply_url,
      description,
    } = body;

    if (!company || !role_title || !job_type || !location || !description) {
      return NextResponse.json(
        { success: false, error: "Missing required job referral fields." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(company) ||
      containsXSS(company) ||
      containsSQLInjection(role_title)
    ) {
      return NextResponse.json(
        { success: false, error: "Unsafe referral details detected." },
        { status: 400 }
      );
    }

    const referralCode = generateReferralCode(company);
    const newReferral: AlumniJobReferral = {
      id: `ref-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      alumni_id: alumni_id ? sanitizeInput(alumni_id) : "alm-custom",
      alumni_name: sanitizeInput(alumni_name || "Distinguished Alumnus"),
      company: sanitizeInput(company),
      role_title: sanitizeInput(role_title),
      job_type: (job_type as JobReferralType) || "full_time",
      experience_level: (experience_level as JobExperienceLevel) || "entry_level",
      location: sanitizeInput(location),
      salary_range: salary_range ? sanitizeInput(salary_range) : null,
      application_deadline: application_deadline
        ? new Date(application_deadline).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      referral_code: referralCode,
      apply_url: apply_url ? sanitizeInput(apply_url) : null,
      description: sanitizeInput(description),
      is_active: true,
      created_at: new Date().toISOString(),
    };

    activeReferrals.unshift(newReferral);

    return NextResponse.json(
      {
        success: true,
        message: "Job referral posted successfully!",
        data: newReferral,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Job referral submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit job referral." },
      { status: 500 }
    );
  }
}
