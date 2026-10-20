import { NextRequest, NextResponse } from "next/server";
import {
  getAisheFinancialStatements,
  addAisheFinancialStatement,
} from "@/lib/aishe/aishe-engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fy = searchParams.get("fy");

    let statements = getAisheFinancialStatements();
    if (fy) {
      statements = statements.filter((s) => s.financial_year === fy);
    }

    return NextResponse.json({
      success: true,
      count: statements.length,
      data: statements,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch AISHE financial statements" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.financial_year || !body.ca_auditor_name || !body.audit_date) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: financial_year, ca_auditor_name, audit_date" },
        { status: 400 }
      );
    }

    const totalIncome =
      (Number(body.recurring_grants_gov_inr) || 0) +
      (Number(body.non_recurring_grants_inr) || 0) +
      (Number(body.tuition_fee_income_inr) || 0) +
      (Number(body.other_income_inr) || 0);

    const totalExpenditure =
      (Number(body.faculty_salary_expenditure_inr) || 0) +
      (Number(body.non_teaching_salary_expenditure_inr) || 0) +
      (Number(body.laboratory_capex_inr) || 0) +
      (Number(body.library_capex_inr) || 0) +
      (Number(body.scholarships_distributed_inr) || 0);

    const newStatement = addAisheFinancialStatement({
      survey_year: body.survey_year || "2025-2026",
      financial_year: body.financial_year,
      recurring_grants_gov_inr: Number(body.recurring_grants_gov_inr) || 0,
      non_recurring_grants_inr: Number(body.non_recurring_grants_inr) || 0,
      tuition_fee_income_inr: Number(body.tuition_fee_income_inr) || 0,
      other_income_inr: Number(body.other_income_inr) || 0,
      total_income_inr: totalIncome,
      faculty_salary_expenditure_inr: Number(body.faculty_salary_expenditure_inr) || 0,
      non_teaching_salary_expenditure_inr: Number(body.non_teaching_salary_expenditure_inr) || 0,
      laboratory_capex_inr: Number(body.laboratory_capex_inr) || 0,
      library_capex_inr: Number(body.library_capex_inr) || 0,
      scholarships_distributed_inr: Number(body.scholarships_distributed_inr) || 0,
      total_expenditure_inr: totalExpenditure,
      ca_auditor_name: body.ca_auditor_name,
      audit_date: body.audit_date,
    });

    return NextResponse.json({
      success: true,
      message: "Financial statement recorded with audited UDIN token",
      data: newStatement,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to add AISHE financial statement" },
      { status: 500 }
    );
  }
}
