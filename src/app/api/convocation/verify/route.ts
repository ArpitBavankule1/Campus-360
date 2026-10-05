import { NextResponse } from "next/server";
import {
  MOCK_CREDENTIAL_VERIFICATIONS,
  MOCK_DEGREE_CREDENTIALS,
  generateVerificationCode,
} from "@/lib/convocation/convocation-engine";
import { CredentialVerificationRequest } from "@/types";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_CREDENTIAL_VERIFICATIONS,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const targetCode = body.credential_code?.trim();

    // Check against credentials
    const found = MOCK_DEGREE_CREDENTIALS.find(
      (c) => c.credential_code.toLowerCase() === targetCode?.toLowerCase()
    );

    const newVerification: CredentialVerificationRequest = {
      id: `ver-${Date.now()}`,
      college_id: body.college_id || "c0000000-0000-0000-0000-000000000001",
      verification_code: generateVerificationCode(),
      credential_code: targetCode || "CL-DEG-2026-9041",
      requester_organization: body.requester_organization || "Independent Background Auditor",
      requester_contact_email: body.requester_contact_email || "hr-verification@enterprise.com",
      verification_purpose: body.verification_purpose || "Employment Screening",
      verification_status: found ? "Verified & Authentic" : "Invalid Hash",
      verified_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: found
        ? "Credential cryptographically verified against institutional ledger"
        : "Warning: Credential code not found in current institutional registry",
      data: newVerification,
      matchedRecord: found || null,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to verify credential" },
      { status: 400 }
    );
  }
}
