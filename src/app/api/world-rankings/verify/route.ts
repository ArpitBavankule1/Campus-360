import { NextRequest, NextResponse } from "next/server";
import {
  getWorldRankingVerifications,
  verifyWorldRankingCertificate,
} from "@/lib/world-rankings/world-rankings-engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (code) {
      const match = verifyWorldRankingCertificate(code);
      if (match) {
        return NextResponse.json({
          success: true,
          verified: true,
          data: match,
        });
      }
      return NextResponse.json({
        success: true,
        verified: false,
        message: `No credentials matching certificate code '${code}' were found in the global verification registry.`,
      });
    }

    const allVerifications = getWorldRankingVerifications();
    return NextResponse.json({
      success: true,
      data: allVerifications,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to verify credential" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { certificate_code } = body;

    if (!certificate_code) {
      return NextResponse.json(
        { success: false, error: "Certificate code is required" },
        { status: 400 }
      );
    }

    const verification = verifyWorldRankingCertificate(certificate_code);
    if (!verification) {
      return NextResponse.json(
        {
          success: true,
          verified: false,
          message: `Certificate '${certificate_code}' could not be verified in the international repository.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      data: verification,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Verification process failed" },
      { status: 500 }
    );
  }
}
