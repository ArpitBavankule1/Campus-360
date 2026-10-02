import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_GRIEVANCE_CASES,
  generateZkpTrackingHash,
} from "@/lib/ombudsman/ombudsman-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { GrievanceCase } from "@/types";

const activeCases: GrievanceCase[] = [...MOCK_GRIEVANCE_CASES];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const trackingHash = searchParams.get("trackingHash");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const q = searchParams.get("q");

    if (
      (trackingHash && (containsSQLInjection(trackingHash) || containsXSS(trackingHash))) ||
      (category && (containsSQLInjection(category) || containsXSS(category))) ||
      (status && (containsSQLInjection(status) || containsXSS(status))) ||
      (q && (containsSQLInjection(q) || containsXSS(q)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid grievance query parameters." },
        { status: 400 }
      );
    }

    let results = [...activeCases];

    if (trackingHash) {
      const sanitizedHash = sanitizeInput(trackingHash).toUpperCase();
      results = results.filter((c) => c.tracking_hash === sanitizedHash);
    }

    if (category && category !== "all") {
      results = results.filter((c) => c.category === category);
    }

    if (status && status !== "all") {
      results = results.filter((c) => c.status === status);
    }

    if (q && q.trim()) {
      const sanitizedQ = sanitizeInput(q).toLowerCase();
      results = results.filter(
        (c) =>
          c.title.toLowerCase().includes(sanitizedQ) ||
          c.description.toLowerCase().includes(sanitizedQ) ||
          c.tracking_hash.toLowerCase().includes(sanitizedQ)
      );
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Grievance cases GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch grievance cases." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      category,
      title,
      description,
      is_anonymous,
      urgency_level,
      evidence_attachments,
    } = body;

    if (!category || !title || !description) {
      return NextResponse.json(
        { success: false, error: "Missing required grievance submission details." },
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
        { success: false, error: "Security violation detected in grievance payload." },
        { status: 400 }
      );
    }

    const trackingHash = generateZkpTrackingHash();
    // Statutory SLA deadline: 72 hours from submission
    const slaDeadline = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();
    const isAnon = is_anonymous !== false;
    const maskedId = isAnon
      ? `ANON-SCHOLAR-${Math.floor(100 + Math.random() * 900)}`
      : `std-••••••••-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCase: GrievanceCase = {
      id: `grv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      tracking_hash: trackingHash,
      category,
      title: sanitizeInput(title),
      description: sanitizeInput(description),
      is_anonymous: isAnon,
      complainant_masked_id: maskedId,
      urgency_level: urgency_level || "Standard Review",
      escalation_tier:
        category === "Anti-Ragging Squad"
          ? "Proctorial Board"
          : category === "Internal Complaints Committee (ICC)"
          ? "Campus Ombudsman"
          : "Department Committee",
      sla_deadline: slaDeadline,
      status: "Submitted",
      evidence_attachments: Array.isArray(evidence_attachments)
        ? evidence_attachments.map((u) => sanitizeInput(String(u)))
        : [],
      created_at: new Date().toISOString(),
    };

    activeCases.unshift(newCase);

    return NextResponse.json(
      {
        success: true,
        message: "Confidential grievance logged. Keep your Zero-Knowledge Tracking Code secure.",
        tracking_hash: trackingHash,
        data: newCase,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Grievance cases POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record grievance case." },
      { status: 500 }
    );
  }
}
