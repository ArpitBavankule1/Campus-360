import { NextRequest, NextResponse } from "next/server";
import { getSamarthModules, addSamarthModule, toggleSamarthModule } from "@/lib/samarth/samarth-engine";

export async function GET() {
  try {
    const modules = getSamarthModules();
    return NextResponse.json({
      success: true,
      data: modules,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch SAMARTH modules catalog" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.module_key || !body.name || !body.category) {
      return NextResponse.json(
        { success: false, error: "Missing required module attributes (module_key, name, category)" },
        { status: 400 }
      );
    }
    const newModule = addSamarthModule(body);
    return NextResponse.json({
      success: true,
      message: "SAMARTH module added successfully",
      data: newModule,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to register SAMARTH module" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.module_key) {
      return NextResponse.json(
        { success: false, error: "Missing module_key parameter" },
        { status: 400 }
      );
    }
    const updated = toggleSamarthModule(body.module_key);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "SAMARTH module not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "SAMARTH module toggle status updated",
      data: updated,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update SAMARTH module status" },
      { status: 500 }
    );
  }
}
