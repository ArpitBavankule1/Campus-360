import { NextRequest, NextResponse } from "next/server";
import { getTechnologyLicenses, requestTechLicense } from "@/lib/partnerships/partnerships-engine";
import { LicenseStatus } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = (searchParams.get("status") as LicenseStatus) || undefined;

    const licenses = getTechnologyLicenses(status);
    return NextResponse.json({
      success: true,
      data: licenses,
      count: licenses.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch technology licenses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.patent_title || !body.licensee_org || !body.trl_level || !body.license_type) {
      return NextResponse.json(
        { success: false, error: "Missing required fields for technology license request" },
        { status: 400 }
      );
    }

    const license = requestTechLicense(body);
    return NextResponse.json({
      success: true,
      message: "Technology license inquiry submitted successfully",
      data: license,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to submit technology license request" },
      { status: 500 }
    );
  }
}
