import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_STUDENT_FEE_DUES,
  MOCK_FEE_TRANSACTIONS,
  generateReceiptNumber,
} from "@/lib/fees/fee-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { FeeTransaction, StudentFeeDue } from "@/types";

const activeDues: StudentFeeDue[] = [...MOCK_STUDENT_FEE_DUES];
const activeTransactions: FeeTransaction[] = [...MOCK_FEE_TRANSACTIONS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("student_id") || "usr-demo-01";

    const studentTransactions = activeTransactions.filter(
      (tx) => tx.student_id === studentId
    );

    return NextResponse.json({
      success: true,
      count: studentTransactions.length,
      data: studentTransactions,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fee_due_id,
      amount,
      payment_method = "upi",
      student_id = "usr-demo-01",
      upi_id,
    } = body;

    if (!fee_due_id || !amount || Number(amount) <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid fee_due_id and payment amount are required." },
        { status: 400 }
      );
    }

    // Protection against injection attacks
    if (
      containsSQLInjection(fee_due_id) ||
      containsSQLInjection(payment_method) ||
      containsSQLInjection(upi_id || "") ||
      containsXSS(payment_method) ||
      containsXSS(upi_id || "")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Malicious payload detected: SQL injection or script attempt blocked.",
        },
        { status: 400 }
      );
    }

    const targetDue = activeDues.find((d) => d.id === fee_due_id);
    if (!targetDue) {
      return NextResponse.json(
        { success: false, error: "Fee due record not found." },
        { status: 404 }
      );
    }

    const payAmount = Number(amount);
    const newPaid = targetDue.amount_paid + payAmount;
    targetDue.amount_paid = newPaid;

    if (newPaid >= targetDue.amount_due + (targetDue.penalty_amount || 0)) {
      targetDue.status = "paid";
    } else {
      targetDue.status = "partially_paid";
    }

    const receiptNum = generateReceiptNumber(targetDue.category);
    const transactionRef = `TXN-${payment_method.toUpperCase()}-${Date.now().toString().slice(-6)}`;

    const newTx: FeeTransaction = {
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fee_due_id,
      student_id,
      college_id: targetDue.college_id,
      transaction_ref: transactionRef,
      payment_method,
      amount_paid: payAmount,
      payment_date: new Date().toISOString(),
      receipt_number: receiptNum,
      status: "success",
      fee_title: targetDue.title,
      category: targetDue.category,
      gateway_response_id: `rzp_live_${Math.random().toString(36).slice(2, 10)}`,
    };

    activeTransactions.unshift(newTx);

    return NextResponse.json(
      {
        success: true,
        message: `Payment of ₹${payAmount.toLocaleString()} processed successfully!`,
        data: {
          transaction: newTx,
          updatedDue: targetDue,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
