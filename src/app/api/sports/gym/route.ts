import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_GYM_MEMBERS,
  generateGymPassCode,
} from "@/lib/sports/sports-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { GymMembership } from "@/types";

const activeMembers: GymMembership[] = [...MOCK_GYM_MEMBERS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const passCode = searchParams.get("passCode");
    const tier = searchParams.get("tier");

    if (
      (passCode && (containsSQLInjection(passCode) || containsXSS(passCode))) ||
      (tier && (containsSQLInjection(tier) || containsXSS(tier)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid gym membership query parameters." },
        { status: 400 }
      );
    }

    let results = [...activeMembers];

    if (passCode) {
      const sanitizedCode = sanitizeInput(passCode).toUpperCase();
      results = results.filter((m) => m.pass_code === sanitizedCode);
    }

    if (tier && tier !== "all") {
      const sanitizedTier = sanitizeInput(tier);
      results = results.filter((m) => m.tier.toLowerCase() === sanitizedTier.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scholarName, scholarId, tier, fitnessSlot, trainerAssigned } = body;

    if (!scholarName || !scholarId || !fitnessSlot) {
      return NextResponse.json(
        { success: false, error: "Missing required gym enrollment parameters." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(scholarName) ||
      containsXSS(scholarName) ||
      containsSQLInjection(fitnessSlot)
    ) {
      return NextResponse.json(
        { success: false, error: "Suspicious characters in gym pass request." },
        { status: 400 }
      );
    }

    const passCode = generateGymPassCode();
    const newMember: GymMembership = {
      id: `gym-${Math.random().toString(36).substring(2, 10)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      scholar_id: sanitizeInput(scholarId),
      scholar_name: sanitizeInput(scholarName),
      pass_code: passCode,
      tier: tier || "Student All-Access",
      fitness_slot: fitnessSlot,
      trainer_assigned: trainerAssigned ? sanitizeInput(trainerAssigned) : "Coach Vikram Singh (NSNIS Certified)",
      bmi_index: 22.0,
      is_biometric_active: true,
      valid_until: "2027-04-30",
      created_at: new Date().toISOString(),
    };

    activeMembers.unshift(newMember);

    return NextResponse.json(
      {
        success: true,
        message: "Gym membership pass generated successfully with biometric clearance.",
        membership: newMember,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
