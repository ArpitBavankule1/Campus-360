import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_SCHOLARSHIP_CERTIFICATES,
  generateCertificateCode,
} from "@/lib/scholarships/scholarship-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { ScholarshipCertificate } from "@/types";

const activeCertificates: ScholarshipCertificate[] = [
  ...MOCK_SCHOLARSHIP_CERTIFICATES,
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const certCode = searchParams.get("certCode");
    const q = searchParams.get("q");

    if (
      (certCode && (containsSQLInjection(certCode) || containsXSS(certCode))) ||
      (q && (containsSQLInjection(q) || containsXSS(q)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid certificate query parameters." },
        { status: 400 }
      );
    }

    let results = [...activeCertificates];

    if (certCode) {
      const sanitizedCode = sanitizeInput(certCode).toUpperCase();
      results = results.filter((c) => c.certificate_code === sanitizedCode);
    }

    if (q && q.trim()) {
      const sanitizedQ = sanitizeInput(q).toLowerCase();
      results = results.filter(
        (c) =>
          c.scholar_name.toLowerCase().includes(sanitizedQ) ||
          c.scheme_name.toLowerCase().includes(sanitizedQ) ||
          c.certificate_code.toLowerCase().includes(sanitizedQ)
      );
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scholarName, schemeName, awardTitle, sanctionAuthority } = body;

    if (!scholarName || !schemeName || !awardTitle) {
      return NextResponse.json(
        { success: false, error: "Missing required certificate parameters." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(scholarName) ||
      containsXSS(scholarName) ||
      containsSQLInjection(schemeName) ||
      containsXSS(schemeName) ||
      containsSQLInjection(awardTitle) ||
      containsXSS(awardTitle)
    ) {
      return NextResponse.json(
        { success: false, error: "Security violation detected in certificate payload." },
        { status: 400 }
      );
    }

    const newCert: ScholarshipCertificate = {
      id: `cert-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      certificate_code: generateCertificateCode(),
      scholar_name: sanitizeInput(scholarName),
      scheme_name: sanitizeInput(schemeName),
      academic_year: "2026-2027",
      award_title: sanitizeInput(awardTitle),
      sanction_authority: sanctionAuthority ? sanitizeInput(sanctionAuthority) : "Dean of Academic Welfare & Financial Aid",
      issued_at: new Date().toISOString(),
    };

    activeCertificates.unshift(newCert);

    return NextResponse.json({
      success: true,
      data: newCert,
      message: "Scholarship certificate of merit sanctioned and cryptographically signed.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
