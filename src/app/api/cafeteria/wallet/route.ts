import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_DINING_WALLET,
  generateWalletQRToken,
} from "@/lib/cafeteria/cafeteria-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { DiningWallet } from "@/types";

let currentWallet: DiningWallet = { ...MOCK_DINING_WALLET };

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const scholarId = searchParams.get("scholarId");

    if (scholarId && (containsSQLInjection(scholarId) || containsXSS(scholarId))) {
      return NextResponse.json(
        { success: false, error: "Invalid scholar query parameter." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: currentWallet,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topupAmount, autoReload } = body;

    const amount = Number(topupAmount);
    if (!amount || amount <= 0 || isNaN(amount)) {
      return NextResponse.json(
        { success: false, error: "Invalid top-up credit amount." },
        { status: 400 }
      );
    }

    currentWallet = {
      ...currentWallet,
      wallet_balance_inr: currentWallet.wallet_balance_inr + amount,
      auto_reload_enabled: autoReload !== undefined ? Boolean(autoReload) : currentWallet.auto_reload_enabled,
      qr_payment_token: generateWalletQRToken(),
      last_topup_date: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: currentWallet,
      message: `₹${amount.toFixed(2)} added to dining wallet successfully.`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
