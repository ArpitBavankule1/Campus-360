import { NextRequest, NextResponse } from "next/server";
import { MOCK_PARTNER_UNIVERSITIES } from "@/lib/international/international-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { PartnerUniversity } from "@/types";

const activePartners: PartnerUniversity[] = [...MOCK_PARTNER_UNIVERSITIES];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get("country");
    const term = searchParams.get("term");
    const q = searchParams.get("q");

    if (
      (country && (containsSQLInjection(country) || containsXSS(country))) ||
      (term && (containsSQLInjection(term) || containsXSS(term))) ||
      (q && (containsSQLInjection(q) || containsXSS(q)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid partner university query parameters." },
        { status: 400 }
      );
    }

    let results = [...activePartners];

    if (country && country !== "all") {
      const sanitizedCountry = sanitizeInput(country).toLowerCase();
      results = results.filter((p) => p.country.toLowerCase().includes(sanitizedCountry));
    }

    if (term && term !== "all") {
      results = results.filter((p) => p.semester_term === term);
    }

    if (q && q.trim()) {
      const sanitizedQ = sanitizeInput(q).toLowerCase();
      results = results.filter(
        (p) =>
          p.university_name.toLowerCase().includes(sanitizedQ) ||
          p.city.toLowerCase().includes(sanitizedQ) ||
          p.description.toLowerCase().includes(sanitizedQ) ||
          p.programs_offered.some((prog) => prog.toLowerCase().includes(sanitizedQ))
      );
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Partner universities GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch partner universities." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      university_name,
      country,
      city,
      qs_world_ranking,
      programs_offered,
      min_gpa_required,
      exchange_slots,
      tuition_waiver,
      application_deadline,
      semester_term,
      description,
      campus_website,
    } = body;

    if (!university_name || !country || !city || !description || !semester_term) {
      return NextResponse.json(
        { success: false, error: "Missing required partner university fields." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(university_name) ||
      containsXSS(university_name) ||
      containsSQLInjection(country) ||
      containsXSS(country) ||
      containsSQLInjection(city) ||
      containsXSS(city) ||
      containsSQLInjection(description) ||
      containsXSS(description)
    ) {
      return NextResponse.json(
        { success: false, error: "Potential security threat detected in payload." },
        { status: 400 }
      );
    }

    const newPartner: PartnerUniversity = {
      id: `univ-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      university_name: sanitizeInput(university_name),
      country: sanitizeInput(country),
      city: sanitizeInput(city),
      qs_world_ranking: Number(qs_world_ranking) || 100,
      programs_offered: Array.isArray(programs_offered)
        ? programs_offered.map((p) => sanitizeInput(String(p)))
        : ["Engineering & Computing"],
      min_gpa_required: Number(min_gpa_required) || 3.0,
      exchange_slots: Number(exchange_slots) || 4,
      tuition_waiver: Boolean(tuition_waiver),
      application_deadline: sanitizeInput(application_deadline || "2026-12-31"),
      semester_term,
      description: sanitizeInput(description),
      campus_website: campus_website ? sanitizeInput(campus_website) : null,
      created_at: new Date().toISOString(),
    };

    activePartners.unshift(newPartner);

    return NextResponse.json(
      {
        success: true,
        message: "Partner university successfully listed.",
        data: newPartner,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Partner universities POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create partner university listing." },
      { status: 500 }
    );
  }
}
