// ================================================================
// CampusLens AI — Phase 34: Smart Campus Security & Command Hub Engine
// Visitor pass generator, RFID tap simulator, lost & found catalog & patrol telemetry
// ================================================================

import {
  VisitorPass,
  TurnstileLog,
  LostAndFoundItem,
  PatrolCheckpoint,
  SecurityOverviewStats,
} from "@/types";

export function generateVisitorPassCode(): string {
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `GATE-PASS-2026-${randomSuffix}`;
}

export function generateLostItemCode(): string {
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LNF-APEX-2026-${randomSuffix}`;
}

export function calculateSecurityOverview(
  visitors: VisitorPass[] = MOCK_VISITOR_PASSES,
  logs: TurnstileLog[] = MOCK_TURNSTILE_LOGS,
  items: LostAndFoundItem[] = MOCK_LOST_ITEMS,
  patrols: PatrolCheckpoint[] = MOCK_PATROLS
): SecurityOverviewStats {
  const activeVisitorsOnCampus = visitors.filter((v) => v.status === "Checked In").length;
  const unclaimedLostItems = items.filter((i) => i.status === "Unclaimed").length;

  return {
    activeVisitorsOnCampus,
    dailyTurnstileTaps: logs.length * 142 + 2890,
    unclaimedLostItems,
    patrolRouteCompletionRate: 99.4,
    visitors,
    turnstileLogs: logs,
    lostItems: items,
    patrolCheckpoints: patrols,
  };
}

export const MOCK_VISITOR_PASSES: VisitorPass[] = [
  {
    id: "vis-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    pass_code: "GATE-PASS-2026-VP01",
    visitor_name: "Dr. Arvind Subramanian",
    visitor_phone: "+91 98230 44120",
    visitor_id_proof: "Aadhaar Card (•••• •••• 9210)",
    visiting_purpose: "Guest Lecture & Academic Seminar",
    host_person: "Dr. S. R. Venkatraman (Chief Proctor)",
    entry_gate: "Main Gate 1 (North Arch)",
    valid_date: "2026-10-03",
    status: "Checked In",
    vehicle_number: "DL 03 CA 4821",
    issued_at: "2026-10-03T08:30:00Z",
  },
  {
    id: "vis-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    pass_code: "GATE-PASS-2026-VP02",
    visitor_name: "Rajesh & Sunita Sharma",
    visitor_phone: "+91 97112 30044",
    visitor_id_proof: "Voter ID (ABC1234567)",
    visiting_purpose: "Parent & Guardian Residence Visit",
    host_person: "Aarav Sharma (Scholar CS 4th Sem)",
    entry_gate: "Gate 2 (Hostel Quad)",
    valid_date: "2026-10-03",
    status: "Checked In",
    vehicle_number: "MH 12 QW 9901",
    issued_at: "2026-10-03T09:15:00Z",
  },
  {
    id: "vis-33333333-3333-4111-8111-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    pass_code: "GATE-PASS-2026-VP03",
    visitor_name: "Vikram Singhania (Stripe Talent Acquisition)",
    visitor_phone: "+91 99881 22334",
    visitor_id_proof: "Corporate Badge (STRIPE-IND-88)",
    visiting_purpose: "Corporate Campus Recruitment",
    host_person: "Prof. Priya Iyer (Placement Officer)",
    entry_gate: "Gate 4 (Research Park)",
    valid_date: "2026-10-03",
    status: "Pre-Registered",
    vehicle_number: "KA 01 MG 2026",
    issued_at: "2026-10-02T16:00:00Z",
  }
];

export const MOCK_TURNSTILE_LOGS: TurnstileLog[] = [
  {
    id: "log-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    checkpoint_name: "Academic Block North Speedlane #3",
    card_hash: "RFID_0x9A4F...8821",
    user_role: "student",
    access_result: "Granted",
    anomaly_flag: false,
    tap_time: "2026-10-03T10:14:22Z",
  },
  {
    id: "log-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    checkpoint_name: "Library Turnstile Gate #1",
    card_hash: "RFID_0x1B82...3390",
    user_role: "faculty",
    access_result: "Granted",
    anomaly_flag: false,
    tap_time: "2026-10-03T10:13:05Z",
  },
  {
    id: "log-33333333-3333-4111-8111-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    checkpoint_name: "Hostel Block 3 Outer Turnstile",
    card_hash: "RFID_0xEE12...9902",
    user_role: "student",
    access_result: "Anomaly Tailgating Flagged",
    anomaly_flag: true,
    tap_time: "2026-10-03T10:11:40Z",
  }
];

export const MOCK_LOST_ITEMS: LostAndFoundItem[] = [
  {
    id: "lnf-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    item_code: "LNF-APEX-2026-EL01",
    title: "Space Grey Apple MacBook Air M2 with stickers",
    category: "Electronics & Laptops",
    found_location: "Central Library 2nd Floor Silent Pod 14",
    description: "MacBook Air 13-inch with GitHub octocat and Rust language stickers on outer casing. Found plugged into desk power pod.",
    image_url: "https://campuslens.ai/lost/macbook-stickers.jpg",
    status: "Unclaimed",
    reported_by: "Library Circulation Desk Attendant",
    reported_at: "2026-10-02T19:40:00Z",
  },
  {
    id: "lnf-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    item_code: "LNF-APEX-2026-WL04",
    title: "Brown Leather Bi-fold Wallet with Scholar ID",
    category: "Wallets & ID Cards",
    found_location: "Cafeteria Food Court Table 22",
    description: "Contains Apex Student ID (Rohan Kapoor), SBI Debit Card, and metro transit token.",
    image_url: "https://campuslens.ai/lost/wallet-brown.jpg",
    status: "Verification Pending",
    claimed_by_id: "std-••••••••-8812",
    reported_by: "Food Court Housekeeping",
    reported_at: "2026-10-03T08:15:00Z",
  },
  {
    id: "lnf-33333333-3333-4111-8111-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    item_code: "LNF-APEX-2026-KY08",
    title: "Royal Enfield Motorcycle Smart Key with Apex Lanyard",
    category: "Keys & Smart Badges",
    found_location: "Campus East Two-Wheeler Parking Lot",
    description: "Electronic key fob with Apex Institute of Technology red lanyard and brass tag #204.",
    image_url: null,
    status: "Unclaimed",
    reported_by: "Parking Patrol Guard #4",
    reported_at: "2026-10-03T07:50:00Z",
  }
];

export const MOCK_PATROLS: PatrolCheckpoint[] = [
  {
    id: "pat-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    route_name: "Perimeter Night Patrol Route Alpha",
    checkpoint_marker: "Checkpoint 14 (Boundary Wall East Gate)",
    guard_name: "Head Constable Gurdeep Singh",
    last_patrolled_at: "2026-10-03T09:45:00Z",
    status: "Normal Secure",
    created_at: "2026-10-01T00:00:00Z",
  },
  {
    id: "pat-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    route_name: "Hostel Quad & Dining Perimeter Route",
    checkpoint_marker: "Checkpoint 07 (Girls Hostel Block 2 Annex)",
    guard_name: "Security Officer Sunita Devi",
    last_patrolled_at: "2026-10-03T10:05:00Z",
    status: "Normal Secure",
    created_at: "2026-10-01T00:00:00Z",
  }
];
