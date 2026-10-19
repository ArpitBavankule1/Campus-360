import { NextRequest, NextResponse } from "next/server";
import {
  getIicYuktiInnovations,
  submitYuktiInnovation,
} from "@/lib/iic/iic-engine";
import { YuktiInnovationStage, YuktiPatentStatus } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stage = searchParams.get("stage") as YuktiInnovationStage | null;
    const trl = searchParams.get("trl");

    let innovations = getIicYuktiInnovations();

    if (stage) {
      innovations = innovations.filter((i) => i.innovation_stage === stage);
    }
    if (trl) {
      innovations = innovations.filter((i) => i.trl_level === Number(trl));
    }

    return NextResponse.json({
      success: true,
      count: innovations.length,
      data: innovations,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch YUKTI innovations" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      !body.title ||
      !body.lead_innovator ||
      !body.innovator_type ||
      !body.department ||
      !body.domain ||
      !body.innovation_stage ||
      !body.trl_level
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required YUKTI submission fields" },
        { status: 400 }
      );
    }

    const newInnovation = submitYuktiInnovation({
      title: body.title,
      lead_innovator: body.lead_innovator,
      innovator_type: body.innovator_type,
      department: body.department,
      domain: body.domain,
      innovation_stage: body.innovation_stage as YuktiInnovationStage,
      trl_level: Number(body.trl_level),
      patent_status: (body.patent_status || "published") as YuktiPatentStatus,
      patent_application_no: body.patent_application_no,
      seed_funding_received_inr: Number(body.seed_funding_received_inr) || 150000,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Innovation submitted to MoE YUKTI National Repository",
        data: newInnovation,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to submit YUKTI innovation" },
      { status: 500 }
    );
  }
}
