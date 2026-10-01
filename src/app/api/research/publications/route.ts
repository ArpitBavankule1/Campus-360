import { NextRequest, NextResponse } from "next/server";
import { MOCK_PUBLICATIONS } from "@/lib/research/research-engine";
import {
  containsSQLInjection,
  containsXSS,
  sanitizeInput,
} from "@/lib/security/sanitize";
import { ResearchPublication, ResearchIndexing } from "@/types";

const activePublications: ResearchPublication[] = [...MOCK_PUBLICATIONS];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const indexing = searchParams.get("indexing");
    const dept = searchParams.get("department");
    const q = searchParams.get("q");

    if (
      (indexing && (containsSQLInjection(indexing) || containsXSS(indexing))) ||
      (dept && (containsSQLInjection(dept) || containsXSS(dept))) ||
      (q && (containsSQLInjection(q) || containsXSS(q)))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid publication query parameters." },
        { status: 400 }
      );
    }

    let results = [...activePublications];

    if (indexing && indexing !== "all") {
      results = results.filter((p) => p.indexing === indexing);
    }
    if (dept && dept !== "all") {
      const sanitizedDept = sanitizeInput(dept).toLowerCase();
      results = results.filter((p) =>
        p.department.toLowerCase().includes(sanitizedDept)
      );
    }
    if (q && q.trim()) {
      const sanitizedQ = sanitizeInput(q).toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(sanitizedQ) ||
          p.journal_or_conference.toLowerCase().includes(sanitizedQ) ||
          p.doi.toLowerCase().includes(sanitizedQ) ||
          p.authors.some((author) => author.toLowerCase().includes(sanitizedQ))
      );
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error("Publications GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch research publications." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      authors,
      department,
      journal_or_conference,
      publication_date,
      doi,
      indexing,
      abstract,
      pdf_url,
    } = body;

    if (!title || !authors || !department || !journal_or_conference || !doi || !abstract) {
      return NextResponse.json(
        { success: false, error: "Missing required publication metadata." },
        { status: 400 }
      );
    }

    if (
      containsSQLInjection(title) ||
      containsXSS(title) ||
      containsSQLInjection(doi)
    ) {
      return NextResponse.json(
        { success: false, error: "Unsafe inputs detected in publication submission." },
        { status: 400 }
      );
    }

    const newPublication: ResearchPublication = {
      id: `pub-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
      college_id: "c1111111-1111-4111-8111-111111111111",
      title: sanitizeInput(title),
      authors: Array.isArray(authors)
        ? authors.map((a: string) => sanitizeInput(a))
        : [sanitizeInput(authors)],
      department: sanitizeInput(department),
      journal_or_conference: sanitizeInput(journal_or_conference),
      publication_date: publication_date || new Date().toISOString().split("T")[0],
      doi: sanitizeInput(doi),
      citation_count: 0,
      indexing: (indexing as ResearchIndexing) || "Scopus",
      open_access: true,
      abstract: sanitizeInput(abstract),
      pdf_url: pdf_url ? sanitizeInput(pdf_url) : null,
      created_at: new Date().toISOString(),
    };

    activePublications.unshift(newPublication);

    return NextResponse.json(
      {
        success: true,
        message: "Research paper indexed successfully in institutional repository!",
        data: newPublication,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Publication submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit research paper." },
      { status: 500 }
    );
  }
}
