import { NextRequest, NextResponse } from "next/server";
import { getSwayamEnrollments, enrollSwayamCourse } from "@/lib/swayam/swayam-engine";

export async function GET() {
  try {
    const enrollments = getSwayamEnrollments();
    return NextResponse.json({
      success: true,
      data: enrollments,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch SWAYAM enrollments" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const enrolled = enrollSwayamCourse(body);
    return NextResponse.json({
      success: true,
      message: "Learner enrolled in SWAYAM course successfully",
      data: enrolled,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to enroll learner in SWAYAM course" },
      { status: 500 }
    );
  }
}
