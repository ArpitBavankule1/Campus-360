import { NextResponse } from "next/server";
import { MOCK_STUDENT_PRINT_WALLET } from "@/lib/printing/printing-engine";
import { StudentPrintWallet } from "@/types";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_STUDENT_PRINT_WALLET,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const topupAmount = Number(body.topup_amount_inr || 100);

    const updatedWallet: StudentPrintWallet = {
      ...MOCK_STUDENT_PRINT_WALLET,
      wallet_balance_inr: MOCK_STUDENT_PRINT_WALLET.wallet_balance_inr + topupAmount,
      last_used_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: `Print wallet recharged with ₹${topupAmount}. New balance: ₹${updatedWallet.wallet_balance_inr}`,
      data: updatedWallet,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to top up print wallet" },
      { status: 400 }
    );
  }
}
