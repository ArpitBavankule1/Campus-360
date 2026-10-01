import { NextRequest, NextResponse } from "next/server";
import { MOCK_DONATIONS, generateDonationReceiptCode } from "@/lib/alumni/alumni-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { AlumniDonation, DonationCampaign } from "@/types";

const activeDonations: AlumniDonation[] = [...MOCK_DONATIONS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const campaign = searchParams.get("campaign");

    if (campaign && (containsSQLInjection(campaign) || containsXSS(campaign))) {
      return NextResponse.json(
        { success: false, error: "Invalid campaign parameter." },
        { status: 400 }
      );
    }

    let results = [...activeDonations];

    if (campaign && campaign !== "all") {
      results = results.filter((d) => d.campaign === campaign);
    }

    const campaignStats: Record<string, number> = {
      stem_scholarship: 0,
      innovation_lab: 0,
      sports_complex: 0,
      hardship_fund: 0,
      library_endowment: 0,
    };

    let totalRaised = 0;
    activeDonations.forEach((d) => {
      if (d.pledge_status === "completed") {
        totalRaised += Number(d.amount);
        if (campaignStats[d.campaign] !== undefined) {
          campaignStats[d.campaign] += Number(d.amount);
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: results,
      stats: {
        totalRaised,
        campaignStats,
        donorsCount: activeDonations.length,
      },
    });
  } catch (error) {
    console.error("Donations GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch donations." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      donor_name,
      donor_email,
      graduating_year,
      campaign,
      amount,
      is_anonymous,
      message,
    } = body;

    const numAmount = Number(amount);
    if (!donor_name || !donor_email || !campaign || isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid donation or missing mandatory donor details." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(donor_name) ||
      containsXSS(donor_name) ||
      containsSQLInjection(donor_email) ||
      (message && containsXSS(message))
    ) {
      return NextResponse.json(
        { success: false, error: "Unsafe inputs detected in donation pledge." },
        { status: 400 }
      );
    }

    const receiptCode = generateDonationReceiptCode(campaign);
    const txnRef = `TXN-GIVE-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const newDonation: AlumniDonation = {
      id: `don-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      donor_name: is_anonymous ? "Anonymous Benefactor" : sanitizeInput(donor_name),
      donor_email: sanitizeInput(donor_email),
      graduating_year: graduating_year ? Number(graduating_year) : null,
      campaign: campaign as DonationCampaign,
      amount: numAmount,
      currency: "INR",
      pledge_status: "completed",
      transaction_ref: txnRef,
      receipt_code: receiptCode,
      is_anonymous: Boolean(is_anonymous),
      message: message ? sanitizeInput(message) : null,
      created_at: new Date().toISOString(),
    };

    activeDonations.unshift(newDonation);

    return NextResponse.json(
      {
        success: true,
        message: "Endowment contribution successfully processed! Tax exemption receipt generated.",
        data: newDonation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Donation creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record donation contribution." },
      { status: 500 }
    );
  }
}
