import { NextRequest, NextResponse } from "next/server";
import {
  getFellowshipApplications,
  submitFellowshipApplication,
} from "@/lib/fellowships/fellowships-engine";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("student_id") || undefined;
    const applications = getFellowshipApplications(studentId);

    return NextResponse.json({
      success: true,
      data: applications,
      count: applications.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch fellowship applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      position_id,
      student_name,
      roll_number,
      department,
      student_cgpa,
      course_grade,
      statement_of_purpose,
      portfolio_url,
      weekly_availability_hours,
    } = body;

    if (!position_id || !student_name || !roll_number || !statement_of_purpose) {
      return NextResponse.json(
        { success: false, error: "Missing mandatory application fields" },
        { status: 400 }
      );
    }

    const application = submitFellowshipApplication({
      position_id,
      student_name,
      roll_number,
      department: department || "Computer Science & Engineering",
      student_cgpa: Number(student_cgpa) || 8.5,
      course_grade: course_grade || "A",
      statement_of_purpose,
      portfolio_url,
      weekly_availability_hours: Number(weekly_availability_hours) || 12,
    });

    return NextResponse.json({
      success: true,
      message: "Fellowship application submitted successfully",
      data: application,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process fellowship application" },
      { status: 500 }
    );
  }
}
