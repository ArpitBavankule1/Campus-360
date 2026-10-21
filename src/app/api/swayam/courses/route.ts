import { NextRequest, NextResponse } from "next/server";
import { getSwayamCourses, addSwayamCourse } from "@/lib/swayam/swayam-engine";

export async function GET() {
  try {
    const courses = getSwayamCourses();
    return NextResponse.json({
      success: true,
      data: courses,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch curated SWAYAM courses" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = addSwayamCourse(body);
    return NextResponse.json({
      success: true,
      message: "SWAYAM course added to institutional repository",
      data: created,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to add SWAYAM course" },
      { status: 500 }
    );
  }
}
