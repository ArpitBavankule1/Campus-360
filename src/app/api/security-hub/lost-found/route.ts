import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_LOST_ITEMS,
  generateLostItemCode,
} from "@/lib/security-hub/security-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { LostAndFoundItem } from "@/types";

const activeItems: LostAndFoundItem[] = [...MOCK_LOST_ITEMS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const q = searchParams.get("q");

    if (
      (category && (containsSQLInjection(category) || containsXSS(category))) ||
      (status && (containsSQLInjection(status) || containsXSS(status))) ||
      (q && (containsSQLInjection(q) || containsXSS(q)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid lost & found query parameters." },
        { status: 400 }
      );
    }

    let results = [...activeItems];

    if (category && category !== "all") {
      const sanitizedCat = sanitizeInput(category);
      results = results.filter((i) => i.category.toLowerCase() === sanitizedCat.toLowerCase());
    }

    if (status && status !== "all") {
      const sanitizedStatus = sanitizeInput(status);
      results = results.filter((i) => i.status.toLowerCase() === sanitizedStatus.toLowerCase());
    }

    if (q && q.trim()) {
      const sanitizedQ = sanitizeInput(q).toLowerCase();
      results = results.filter(
        (i) =>
          i.title.toLowerCase().includes(sanitizedQ) ||
          i.description.toLowerCase().includes(sanitizedQ) ||
          i.found_location.toLowerCase().includes(sanitizedQ) ||
          i.item_code.toLowerCase().includes(sanitizedQ)
      );
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
    const { action, itemId, claimerId, title, category, foundLocation, description, reportedBy } = body;

    if (action === "claim") {
      if (!itemId || !claimerId) {
        return NextResponse.json(
          { success: false, error: "Item ID and claimer credentials required." },
          { status: 400 }
        );
      }

      const item = activeItems.find((i) => i.id === itemId);
      if (!item) {
        return NextResponse.json(
          { success: false, error: "Item not found in catalog." },
          { status: 404 }
        );
      }

      item.status = "Verification Pending";
      item.claimed_by_id = sanitizeInput(claimerId);

      return NextResponse.json({
        success: true,
        message: "Claim request logged. Present valid ID at Campus Security Office Counter.",
        item,
      });
    }

    // Report found item
    if (!title || !category || !foundLocation || !description || !reportedBy) {
      return NextResponse.json(
        { success: false, error: "Missing required fields for reporting item." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(title) ||
      containsXSS(title) ||
      containsSQLInjection(foundLocation) ||
      containsXSS(foundLocation)
    ) {
      return NextResponse.json(
        { success: false, error: "Suspicious characters in lost item submission." },
        { status: 400 }
      );
    }

    const itemCode = generateLostItemCode();
    const newItem: LostAndFoundItem = {
      id: `lnf-${Math.random().toString(36).substring(2, 10)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      item_code: itemCode,
      title: sanitizeInput(title),
      category,
      found_location: sanitizeInput(foundLocation),
      description: sanitizeInput(description),
      image_url: null,
      status: "Unclaimed",
      reported_by: sanitizeInput(reportedBy),
      reported_at: new Date().toISOString(),
    };

    activeItems.unshift(newItem);

    return NextResponse.json(
      {
        success: true,
        message: "Item cataloged in Campus Lost & Found repository.",
        item: newItem,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
