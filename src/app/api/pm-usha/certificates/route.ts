import { NextRequest, NextResponse } from "next/server";
import {
  getPmUshaUtilizationCertificates,
  addPmUshaUtilizationCertificate,
  updatePmUshaUtilizationCertificate,
} from "@/lib/pm-usha/pm-usha-engine";

export async function GET() {
  try {
    const certificates = getPmUshaUtilizationCertificates();
    return NextResponse.json({
      success: true,
      data: certificates,
      count: certificates.length,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch PM-USHA utilization certificates" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (
      !body.statutory_auditor_name ||
      !body.ca_membership_no ||
      !body.grant_in_aid_sanctioned_lakhs
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: statutory_auditor_name, ca_membership_no, grant_in_aid_sanctioned_lakhs",
        },
        { status: 400 }
      );
    }
    const newUc = addPmUshaUtilizationCertificate(body);
    return NextResponse.json(
      {
        success: true,
        message: "PM-USHA GFR 12-A utilization certificate filed successfully",
        data: newUc,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to file utilization certificate" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...patch } = body;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Certificate ID is required for update" },
        { status: 400 }
      );
    }
    const updated = updatePmUshaUtilizationCertificate(id, patch);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Utilization certificate not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "PM-USHA utilization certificate updated successfully",
      data: updated,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update utilization certificate" },
      { status: 500 }
    );
  }
}
