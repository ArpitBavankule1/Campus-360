// ================================================================
// CampusLens AI — Phase 25 Student Clubs & Societies Engine
// Seed clubs directory, ticketing generators & merit point calculations
// ================================================================

import {
  StudentClub,
  ClubMembership,
  ClubEventTicket,
  StudentMeritActivity,
  StudentClubOverview,
} from "@/types";

export const MOCK_COLLEGE_ID = "col-apex-001";
export const MOCK_STUDENT_ID = "00000000-0000-0000-0000-000000000001";

// 1. Mock Student Clubs
export const MOCK_CLUBS: StudentClub[] = [
  {
    id: "clb-001",
    college_id: MOCK_COLLEGE_ID,
    name: "Apex CodeCraft & AI Society",
    slug: "codecraft",
    category: "technical",
    description: "Premier competitive programming, open source development, and generative AI research community.",
    logo_url: "/icons/clubs/codecraft.svg",
    lead_student_name: "Aarav Sharma (B.Tech CSE)",
    faculty_mentor_name: "Dr. Rajesh K. Nair",
    member_count: 240,
    meeting_venue: "AI & High-Performance Lab 4",
    recruitment_open: true,
    social_links: { github: "https://github.com/apex-codecraft", discord: "https://discord.gg/codecraft" },
    created_at: "2025-08-01T00:00:00Z",
  },
  {
    id: "clb-002",
    college_id: MOCK_COLLEGE_ID,
    name: "RoboApex Mechatronics & Drone Club",
    slug: "roboapex",
    category: "technical",
    description: "Autonomous robotics, battle-bots, aerial UAV drones, and national SAE competition squad.",
    logo_url: "/icons/clubs/roboapex.svg",
    lead_student_name: "Pooja Hegde (B.Tech ECE)",
    faculty_mentor_name: "Prof. Vikram Malhotra",
    member_count: 145,
    meeting_venue: "Makerspace & IoT Prototyping Bay",
    recruitment_open: true,
    created_at: "2025-08-01T00:00:00Z",
  },
  {
    id: "clb-003",
    college_id: MOCK_COLLEGE_ID,
    name: "Dhwani Cultural & Dramatic Arts Guild",
    slug: "dhwani",
    category: "cultural",
    description: "Music bands, street theater (Nukkad Natak), classical fusion, and annual university cultural fest.",
    logo_url: "/icons/clubs/dhwani.svg",
    lead_student_name: "Rhea Iyer (B.Tech IT)",
    faculty_mentor_name: "Dr. Sunita Deshmukh",
    member_count: 180,
    meeting_venue: "Central Amphitheatre & Music Studio",
    recruitment_open: true,
    created_at: "2025-08-01T00:00:00Z",
  },
  {
    id: "clb-004",
    college_id: MOCK_COLLEGE_ID,
    name: "Apex Literary & Parliamentary Debating Society",
    slug: "literary",
    category: "literary",
    description: "Oxford-style parliamentary debates, Model UN simulations, and campus editorial journal publishing.",
    logo_url: "/icons/clubs/literary.svg",
    lead_student_name: "Karan Johar (B.Tech Mech)",
    faculty_mentor_name: "Dr. Ananya Roy",
    member_count: 95,
    meeting_venue: "Seminar Hall B, Digital Library",
    recruitment_open: false,
    created_at: "2025-08-01T00:00:00Z",
  },
  {
    id: "clb-005",
    college_id: MOCK_COLLEGE_ID,
    name: "Rotaract & Social Impact Cell",
    slug: "rotaract",
    category: "social",
    description: "Community blood donation drives, eco-friendly tree plantations, and rural education volunteering.",
    logo_url: "/icons/clubs/rotaract.svg",
    lead_student_name: "Ananya Dixit (B.Tech Civil)",
    faculty_mentor_name: "Prof. Ramesh Patel",
    member_count: 310,
    meeting_venue: "Student Activity Center Room 102",
    recruitment_open: true,
    created_at: "2025-08-01T00:00:00Z",
  },
];

// 2. Mock Club Memberships
export const MOCK_MEMBERSHIPS: ClubMembership[] = [
  {
    id: "cm-001",
    college_id: MOCK_COLLEGE_ID,
    club_id: "clb-001",
    student_id: MOCK_STUDENT_ID,
    role: "core_team",
    joined_at: "2025-09-01T10:00:00Z",
    status: "active",
    club: MOCK_CLUBS[0],
  },
  {
    id: "cm-002",
    college_id: MOCK_COLLEGE_ID,
    club_id: "clb-003",
    student_id: MOCK_STUDENT_ID,
    role: "member",
    joined_at: "2025-10-15T12:00:00Z",
    status: "active",
    club: MOCK_CLUBS[2],
  },
];

// 3. Mock Club Event Tickets
export const MOCK_CLUB_TICKETS: ClubEventTicket[] = [
  {
    id: "tkt-001",
    college_id: MOCK_COLLEGE_ID,
    event_id: "evt-hack-2026",
    student_id: MOCK_STUDENT_ID,
    ticket_code: "CL-CLB-TKT-2026-8819",
    event_title: "HackApex 2026 — 36hr National Hackathon",
    venue: "Main Auditorium & Innovation Center",
    seat_tier: "Hacker Pass (Team Leader)",
    price: 0.0,
    is_verified: true,
    checked_in_at: null,
    created_at: "2026-09-20T11:00:00Z",
  },
  {
    id: "tkt-002",
    college_id: MOCK_COLLEGE_ID,
    event_id: "evt-dhwani-fest",
    student_id: MOCK_STUDENT_ID,
    ticket_code: "CL-CLB-TKT-2026-3104",
    event_title: "Dhwani Autumn Acoustic Night",
    venue: "Open Air Amphitheatre",
    seat_tier: "VIP Student Pass",
    price: 150.0,
    is_verified: true,
    checked_in_at: "2026-09-25T18:30:00Z",
    created_at: "2026-09-22T09:00:00Z",
  },
];

// 4. Mock Merit Activity Ledger
export const MOCK_MERIT_ACTIVITIES: StudentMeritActivity[] = [
  {
    id: "ma-001",
    college_id: MOCK_COLLEGE_ID,
    student_id: MOCK_STUDENT_ID,
    club_id: "clb-001",
    activity_title: "1st Prize Winner — Inter-College GenAI Hackathon",
    activity_type: "hackathon",
    merit_points: 25,
    certificate_url: "/docs/certificates/hackathon-winner.pdf",
    verified_by: "Dr. Rajesh K. Nair (Dean R&D)",
    awarded_at: "2026-09-18T16:00:00Z",
    created_at: "2026-09-18T16:00:00Z",
    club: MOCK_CLUBS[0],
  },
  {
    id: "ma-002",
    college_id: MOCK_COLLEGE_ID,
    student_id: MOCK_STUDENT_ID,
    club_id: "clb-001",
    activity_title: "Hands-on Workshop Lead — Next.js 16 Architecture",
    activity_type: "workshop",
    merit_points: 15,
    certificate_url: "/docs/certificates/speaker-merit.pdf",
    verified_by: "Dr. Sunita Deshmukh",
    awarded_at: "2026-09-10T14:00:00Z",
    created_at: "2026-09-10T14:00:00Z",
    club: MOCK_CLUBS[0],
  },
];

// Engine Functions

export function generateClubTicketCode(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CL-CLB-TKT-2026-${randomSuffix}`;
}

export function calculateClubOverview(
  studentId: string = MOCK_STUDENT_ID,
  memberships: ClubMembership[] = MOCK_MEMBERSHIPS,
  tickets: ClubEventTicket[] = MOCK_CLUB_TICKETS,
  activities: StudentMeritActivity[] = MOCK_MERIT_ACTIVITIES
): StudentClubOverview {
  const joined = memberships.filter((m) => m.student_id === studentId);
  const myTickets = tickets.filter((t) => t.student_id === studentId);
  const ledger = activities.filter((a) => a.student_id === studentId);
  const totalPoints = ledger.reduce((sum, a) => sum + a.merit_points, 0);

  return {
    joinedClubs: joined,
    myEventTickets: myTickets,
    meritLedger: ledger,
    totalMeritPoints: totalPoints,
  };
}
