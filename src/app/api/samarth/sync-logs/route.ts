import { NextRequest, NextResponse } from "next/server";
import { getSamarthSyncLogs, createSamarthSyncLog } from "@/lib/samarth/samarth-engine";

export async function GET() {
  try {
    const logs = getSamarthSyncLogs();
    return NextResponse.json({
      success: true,
      data: logs,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch SAMARTH sync logs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.module_key) {
      return NextResponse.json(
        { success: false, error: "Missing module_key parameter" },
        { status: 400 }
      );
    }
    const newLog = createSamarthSyncLog({
      module_key: body.module_key,
      direction: body.direction || "BIDIRECTIONAL",
      records_processed: body.records_processed ?? 150,
      records_updated: body.records_updated,
      records_failed: body.records_failed,
      latency_ms: body.latency_ms,
      status: body.status || "COMPLETED",
      initiated_by: body.initiated_by || "samarth-api-gateway",
    });
    return NextResponse.json({
      success: true,
      message: "SAMARTH synchronization completed successfully",
      data: newLog,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to trigger SAMARTH synchronization" },
      { status: 500 }
    );
  }
}
