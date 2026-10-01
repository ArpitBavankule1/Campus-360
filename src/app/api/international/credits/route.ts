import { NextRequest, NextResponse } from "next/server";
import { MOCK_CREDIT_TRANSFERS } from "@/lib/international/international-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { CreditTransferRequest } from "@/types";

const activeCreditTransfers: CreditTransferRequest[] = [...MOCK_CREDIT_TRANSFERS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const studentId = searchParams.get("studentId");
    const q = searchParams.get("q");

    if (
      (status && (containsSQLInjection(status) || containsXSS(status))) ||
      (studentId && (containsSQLInjection(studentId) || containsXSS(studentId))) ||
      (q && (containsSQLInjection(q) || containsXSS(q)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid credit transfer query parameters." },
        { status: 400 }
      );
    }

    let results = [...activeCreditTransfers];

    if (status && status !== "all") {
      results = results.filter((c) => c.status === status);
    }

    if (studentId) {
      results = results.filter((c) => c.student_id === studentId);
    }

    if (q && q.trim()) {
      const sanitizedQ = sanitizeInput(q).toLowerCase();
      results = results.filter(
        (c) =>
          c.foreign_course_title.toLowerCase().includes(sanitizedQ) ||
          c.foreign_course_code.toLowerCase().includes(sanitizedQ) ||
          c.host_university.toLowerCase().includes(sanitizedQ) ||
          c.equivalent_domestic_course.toLowerCase().includes(sanitizedQ) ||
          c.student_name.toLowerCase().includes(sanitizedQ)
      );
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Credit transfers GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch credit transfer requests." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      student_id,
      student_name,
      host_university,
      foreign_course_code,
      foreign_course_title,
      credits_earned,
      equivalent_domestic_course,
      equivalent_credits,
      grade_earned,
      syllabus_document_url,
    } = body;

    if (
      !student_id ||
      !student_name ||
      !host_university ||
      !foreign_course_code ||
      !foreign_course_title ||
      !equivalent_domestic_course ||
      !grade_earned
    ) {
      return NextResponse.json(
        { success: false, error: "Missing mandatory credit transfer fields." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(student_name) ||
      containsXSS(student_name) ||
      containsSQLInjection(host_university) ||
      containsXSS(host_university) ||
      containsSQLInjection(foreign_course_code) ||
      containsXSS(foreign_course_code) ||
      containsSQLInjection(foreign_course_title) ||
      containsXSS(foreign_course_title) ||
      containsSQLInjection(equivalent_domestic_course) ||
      containsXSS(equivalent_domestic_course) ||
      containsSQLInjection(grade_earned) ||
      containsXSS(grade_earned)
    ) {
      return NextResponse.json(
        { success: false, error: "Security validation error in course request payload." },
        { status: 400 }
      );
    }

    const newRequest: CreditTransferRequest = {
      id: `ctr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      student_id: sanitizeInput(student_id),
      student_name: sanitizeInput(student_name),
      host_university: sanitizeInput(host_university),
      foreign_course_code: sanitizeInput(foreign_course_code),
      foreign_course_title: sanitizeInput(foreign_course_title),
      credits_earned: Number(credits_earned) || 4,
      equivalent_domestic_course: sanitizeInput(equivalent_domestic_course),
      equivalent_credits: Number(equivalent_credits) || 4,
      grade_earned: sanitizeInput(grade_earned),
      syllabus_document_url: syllabus_document_url ? sanitizeInput(syllabus_document_url) : null,
      status: "pending",
      evaluator_remarks: "Application received and queued for Department Board of Studies equivalency committee evaluation.",
      submitted_at: new Date().toISOString(),
    };

    activeCreditTransfers.unshift(newRequest);

    return NextResponse.json(
      {
        success: true,
        message: "Academic credit transfer request lodged successfully.",
        data: newRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Credit transfers POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit credit transfer request." },
      { status: 500 }
    );
  }
}
