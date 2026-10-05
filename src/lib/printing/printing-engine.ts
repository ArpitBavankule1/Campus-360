// CampusLens AI — Phase 40: Smart Campus Cloud Printing, Document Xerox & Thesis Binding Engine
// src/lib/printing/printing-engine.ts

import {
  PrintStation,
  StudentPrintWallet,
  PrintJob,
  ThesisBindingOrder,
  PrintingOverviewStats,
} from "@/types";

export function generatePrintJobCode(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-PRINT-2026-${rand}`;
}

export function generateThesisBindingCode(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-THESIS-2026-${rand}`;
}

export function generateKioskReleasePin(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export const MOCK_PRINT_STATIONS: PrintStation[] = [
  {
    id: "stn-1",
    college_id: "c0000000-0000-0000-0000-000000000001",
    kiosk_name: "Central Library Smart Kiosk A (Canon ImageRunner 5560)",
    campus_building: "Central Knowledge Library",
    floor_location: "Ground Floor - Digital Commons",
    status: "Online & Ready",
    paper_level_pct: 92,
    toner_level_pct: 88,
    supported_sizes: ["A4", "A3", "Glossy"],
    is_color_capable: true,
    is_duplex_capable: true,
    queue_jobs_count: 2,
    created_at: "2026-09-01T00:00:00Z",
  },
  {
    id: "stn-2",
    college_id: "c0000000-0000-0000-0000-000000000001",
    kiosk_name: "Computer Center High-Speed Xerox Station (Xerox AltaLink)",
    campus_building: "Ramanujan Computing Complex",
    floor_location: "First Floor - Lab Corridor",
    status: "Online & Ready",
    paper_level_pct: 84,
    toner_level_pct: 79,
    supported_sizes: ["A4", "A3"],
    is_color_capable: true,
    is_duplex_capable: true,
    queue_jobs_count: 5,
    created_at: "2026-09-01T00:00:00Z",
  },
  {
    id: "stn-3",
    college_id: "c0000000-0000-0000-0000-000000000001",
    kiosk_name: "Aryabhata Academic Block Fast Kiosk",
    campus_building: "Aryabhata Engineering Block",
    floor_location: "Second Floor - Department Foyer",
    status: "Paper Tray Low",
    paper_level_pct: 18,
    toner_level_pct: 65,
    supported_sizes: ["A4"],
    is_color_capable: false,
    is_duplex_capable: true,
    queue_jobs_count: 1,
    created_at: "2026-09-10T00:00:00Z",
  },
  {
    id: "stn-4",
    college_id: "c0000000-0000-0000-0000-000000000001",
    kiosk_name: "Hostel Quad 24/7 Night Print Hub",
    campus_building: "Kalam Residential Hall (Block C)",
    floor_location: "Ground Floor - Recreation Quad",
    status: "Online & Ready",
    paper_level_pct: 75,
    toner_level_pct: 95,
    supported_sizes: ["A4"],
    is_color_capable: true,
    is_duplex_capable: true,
    queue_jobs_count: 0,
    created_at: "2026-09-15T00:00:00Z",
  },
];

export const MOCK_STUDENT_PRINT_WALLET: StudentPrintWallet = {
  id: "wal-1",
  college_id: "c0000000-0000-0000-0000-000000000001",
  scholar_id: "SCH-CS-2023-019",
  scholar_name: "Aarav Sharma",
  semester_free_quota_pages: 500,
  free_pages_remaining: 382,
  wallet_balance_inr: 220.0,
  total_pages_printed: 118,
  last_used_at: "2026-10-04T16:20:00Z",
  created_at: "2026-08-01T00:00:00Z",
};

export const MOCK_PRINT_JOBS: PrintJob[] = [
  {
    id: "job-1",
    college_id: "c0000000-0000-0000-0000-000000000001",
    job_code: "CL-PRINT-2026-8812",
    scholar_id: "SCH-CS-2023-019",
    scholar_name: "Aarav Sharma",
    document_name: "Deep_Learning_Final_Project_Report.pdf",
    page_count: 24,
    color_mode: "High-Res Color",
    duplex_mode: "Double-Sided Duplex",
    total_cost_inr: 48.0,
    pickup_kiosk_name: "Central Library Smart Kiosk A (Canon ImageRunner 5560)",
    status: "Ready for Kiosk Pickup",
    release_pin: "749201",
    release_token_hash: "TOKEN_0x8C1B4A9E_PRINT_SECURE",
    submitted_at: "2026-10-05T08:15:00Z",
  },
  {
    id: "job-2",
    college_id: "c0000000-0000-0000-0000-000000000001",
    job_code: "CL-PRINT-2026-4420",
    scholar_id: "SCH-CS-2023-019",
    scholar_name: "Aarav Sharma",
    document_name: "Operating_Systems_Lab_Assignment_4.pdf",
    page_count: 8,
    color_mode: "Monochrome B&W",
    duplex_mode: "Double-Sided Duplex",
    total_cost_inr: 0.0,
    pickup_kiosk_name: "Computer Center High-Speed Xerox Station (Xerox AltaLink)",
    status: "Printed & Collected",
    release_pin: "338192",
    release_token_hash: "TOKEN_0x3D7F2A11_PRINT_SECURE",
    submitted_at: "2026-10-04T14:10:00Z",
  },
];

export const MOCK_THESIS_BINDING_ORDERS: ThesisBindingOrder[] = [
  {
    id: "th-1",
    college_id: "c0000000-0000-0000-0000-000000000001",
    order_code: "CL-THESIS-2026-1049",
    scholar_id: "SCH-CS-2023-019",
    scholar_name: "Aarav Sharma",
    department: "Computer Science & Engineering",
    thesis_title: "Neuromorphic Vision Transformers for Edge Autonomous Drones",
    degree_program: "B.Tech Honours in Artificial Intelligence",
    cover_type: "Hardcover Royal Navy (Gold Foil)",
    copies_requested: 3,
    embossing_text: "APEX INSTITUTE OF TECHNOLOGY • NEUROMORPHIC VISION TRANSFORMERS • AARAV SHARMA • 2026",
    binding_status: "Cover Embossing",
    department_signoff_status: "Approved by HOD",
    target_delivery_date: "2026-10-12",
    total_fee_inr: 1350.0,
    created_at: "2026-10-03T11:00:00Z",
  },
  {
    id: "th-2",
    college_id: "c0000000-0000-0000-0000-000000000001",
    order_code: "CL-THESIS-2026-2180",
    scholar_id: "SCH-PHD-2021-008",
    scholar_name: "Dr. Siddharth Verma",
    department: "Physics & Photonics",
    thesis_title: "Quantum State Tomography in High-Dimensional Optical Waveguides",
    degree_program: "Doctor of Philosophy (Ph.D.)",
    cover_type: "Deluxe Leatherette Archival",
    copies_requested: 4,
    embossing_text: "DOCTORAL DISSERTATION • SIDDHARTH VERMA • QUANTUM OPTICAL TOMOGRAPHY • 2026",
    binding_status: "Ready for Library Deposit",
    department_signoff_status: "Approved by HOD",
    target_delivery_date: "2026-10-08",
    total_fee_inr: 2400.0,
    created_at: "2026-09-28T09:30:00Z",
  },
];

export function calculatePrintingOverview(
  stations: PrintStation[] = MOCK_PRINT_STATIONS,
  wallet: StudentPrintWallet = MOCK_STUDENT_PRINT_WALLET,
  jobs: PrintJob[] = MOCK_PRINT_JOBS,
  thesisOrders: ThesisBindingOrder[] = MOCK_THESIS_BINDING_ORDERS
): PrintingOverviewStats {
  const activeKiosksCount = stations.filter(
    (s) => s.status === "Online & Ready" || s.status === "Paper Tray Low"
  ).length;

  const totalPagesPrintedToday = jobs.reduce((sum, j) => sum + j.page_count, 0);

  return {
    activeKiosksCount,
    totalJobsPrintedToday: jobs.length,
    totalPagesPrintedToday,
    activeThesisBindingsCount: thesisOrders.length,
    stations,
    wallet,
    recentJobs: jobs,
    thesisOrders,
  };
}
