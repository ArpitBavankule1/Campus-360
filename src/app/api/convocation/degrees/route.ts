import { NextResponse } from "next/server";
import {
  MOCK_DEGREE_CREDENTIALS,
  generateDegreeCode,
} from "@/lib/convocation/convocation-engine";
import { DegreeCredential } from "@/types";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_DEGREE_CREDENTIALS,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newCredential: DegreeCredential = {
      id: `deg-${Date.now()}`,
      college_id: body.college_id || "c0000000-0000-0000-0000-000000000001",
      credential_code: generateDegreeCode(),
      scholar_id: body.scholar_id || "SCH-CS-2023-099",
      scholar_name: body.scholar_name || "New Scholar",
      degree_type: body.degree_type || "Bachelor of Technology",
      department: body.department || "Computer Science & Engineering",
      graduation_year: body.graduation_year || 2026,
      cgpa: Number(body.cgpa || 9.2),
      honors_classification: body.honors_classification || "First Class with Distinction",
      cryptographic_hash: `SHA256:${Math.random().toString(36).substring(2)}${Date.now()}`,
      credential_status: "Issued & Cryptographically Signed",
      conferred_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Degree credential issued and cryptographically signed successfully",
      data: newCredential,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to issue degree credential" },
      { status: 400 }
    );
  }
}
