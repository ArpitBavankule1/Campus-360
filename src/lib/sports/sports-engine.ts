// ================================================================
// CampusLens AI — Phase 32: Smart Campus Sports Arena & Athletics Engine
// Slot availability evaluator, gym biometric pass generator & seed data
// ================================================================

import {
  SportsArena,
  AthleticLeague,
  GymMembership,
  EquipmentLoan,
  SportsOverviewStats,
} from "@/types";

export function generateGymPassCode(): string {
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CL-GYM-PASS-2026-${randomSuffix}`;
}

export function generateEquipmentCode(): string {
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `EQ-SPT-2026-${randomSuffix}`;
}

export function calculateSportsOverview(
  arenas: SportsArena[] = MOCK_SPORTS_ARENAS,
  leagues: AthleticLeague[] = MOCK_ATHLETIC_LEAGUES,
  gymMembers: GymMembership[] = MOCK_GYM_MEMBERS,
  loans: EquipmentLoan[] = MOCK_EQUIPMENT_LOANS
): SportsOverviewStats {
  return {
    totalArenas: arenas.length,
    activeAthleticTournaments: leagues.filter(
      (l) => l.status === "Registration Open" || l.status === "Knockouts Ongoing"
    ).length,
    enrolledGymMembers: gymMembers.length,
    activeEquipmentLoans: loans.filter((l) => l.status === "Active Loan").length,
    arenas,
    leagues,
    gymMembers,
    equipmentLoans: loans,
  };
}

export const MOCK_SPORTS_ARENAS: SportsArena[] = [
  {
    id: "arn-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    arena_name: "Olympic Synthetic Badminton Arena",
    sport_type: "Badminton",
    location_venue: "Indoor Sports Complex Block B, Court 1-4",
    total_courts: 4,
    court_surface: "BWF-Approved Yonex Vinyl Mat",
    hourly_rate: 0,
    is_floodlit: true,
    opening_time: "06:00:00",
    closing_time: "22:00:00",
    current_status: "Available",
    created_at: "2026-01-10T08:00:00Z",
  },
  {
    id: "arn-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    arena_name: "FIBA Hardwood Basketball Arena",
    sport_type: "Basketball",
    location_venue: "Apex Main Pavilion Ground Floor",
    total_courts: 2,
    court_surface: "Imported Maple Hardwood Floor",
    hourly_rate: 0,
    is_floodlit: true,
    opening_time: "06:00:00",
    closing_time: "21:30:00",
    current_status: "Available",
    created_at: "2026-01-12T08:00:00Z",
  },
  {
    id: "arn-33333333-3333-4111-8111-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    arena_name: "All-Weather FIFA Standard Turf Arena",
    sport_type: "Football / Turf",
    location_venue: "Campus North Sports Grounds",
    total_courts: 1,
    court_surface: "Monofilament Synthetic Astroturf",
    hourly_rate: 0,
    is_floodlit: true,
    opening_time: "05:30:00",
    closing_time: "23:00:00",
    current_status: "Available",
    created_at: "2026-01-15T09:00:00Z",
  },
  {
    id: "arn-44444444-4444-4111-8111-444444444444",
    college_id: "c1111111-1111-4111-8111-111111111111",
    arena_name: "Grand Slam Synthetic Tennis Arena",
    sport_type: "Tennis",
    location_venue: "East Quad Courts 1 & 2",
    total_courts: 2,
    court_surface: "Cushioned Acrylic Hard Court",
    hourly_rate: 0,
    is_floodlit: true,
    opening_time: "06:00:00",
    closing_time: "20:00:00",
    current_status: "Booked Out",
    created_at: "2026-01-18T10:00:00Z",
  },
  {
    id: "arn-55555555-5555-4111-8111-555555555555",
    college_id: "c1111111-1111-4111-8111-111111111111",
    arena_name: "Olympic 8-Lane Heated Swimming Complex",
    sport_type: "Swimming Pool",
    location_venue: "Aquatic Center Block C",
    total_courts: 8,
    court_surface: "Ozone Treated Temperature Regulated Basin",
    hourly_rate: 0,
    is_floodlit: true,
    opening_time: "06:00:00",
    closing_time: "21:00:00",
    current_status: "Available",
    created_at: "2026-01-20T10:00:00Z",
  }
];

export const MOCK_ATHLETIC_LEAGUES: AthleticLeague[] = [
  {
    id: "lea-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    tournament_title: "Inter-Department Premier Futsal League 2026",
    sport_type: "Football / Turf",
    organizer_department: "Department of Physical Education & Sports",
    season_year: 2026,
    start_date: "2026-10-10",
    end_date: "2026-10-18",
    participating_teams: 12,
    prize_pool_inr: 50000,
    status: "Registration Open",
    created_at: "2026-09-25T11:00:00Z",
  },
  {
    id: "lea-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    tournament_title: "Apex Inter-Collegiate Badminton Smash Cup",
    sport_type: "Badminton",
    organizer_department: "Apex Sports Council",
    season_year: 2026,
    start_date: "2026-10-15",
    end_date: "2026-10-20",
    participating_teams: 16,
    prize_pool_inr: 35000,
    status: "Upcoming",
    created_at: "2026-09-28T14:00:00Z",
  },
  {
    id: "lea-33333333-3333-4111-8111-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    tournament_title: "3v3 Half-Court Street Basketball Invitational",
    sport_type: "Basketball",
    organizer_department: "Computer Science Athletic Wing",
    season_year: 2026,
    start_date: "2026-10-02",
    end_date: "2026-10-06",
    participating_teams: 8,
    prize_pool_inr: 20000,
    status: "Knockouts Ongoing",
    created_at: "2026-09-20T10:00:00Z",
  }
];

export const MOCK_GYM_MEMBERS: GymMembership[] = [
  {
    id: "gym-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    scholar_id: "std-••••••••-4821",
    scholar_name: "Aarav Sharma",
    pass_code: "CL-GYM-PASS-2026-AR77",
    tier: "Athlete High-Performance",
    fitness_slot: "Evening Surge (17:00 - 19:30)",
    trainer_assigned: "Coach Vikram Singh (NSNIS Certified)",
    bmi_index: 22.4,
    is_biometric_active: true,
    valid_until: "2027-04-30",
    created_at: "2026-08-01T10:00:00Z",
  },
  {
    id: "gym-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    scholar_id: "std-••••••••-1199",
    scholar_name: "Sneha Patel",
    pass_code: "CL-GYM-PASS-2026-SN42",
    tier: "Student All-Access",
    fitness_slot: "Early Bird (06:00 - 08:00)",
    trainer_assigned: "Coach Priya Verma",
    bmi_index: 21.1,
    is_biometric_active: true,
    valid_until: "2027-03-31",
    created_at: "2026-08-15T09:30:00Z",
  }
];

export const MOCK_EQUIPMENT_LOANS: EquipmentLoan[] = [
  {
    id: "lo-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    equipment_code: "EQ-SPT-2026-BD09",
    item_name: "Yonex Nanoray 800 Carbon Graphite Rackets (Set of 2)",
    sport_type: "Badminton",
    borrower_id: "std-••••••••-4821",
    borrower_name: "Aarav Sharma",
    quantity: 2,
    checkout_time: "2026-10-03T09:00:00Z",
    due_time: "2026-10-03T12:00:00Z",
    deposit_inr: 500,
    item_condition: "Mint",
    status: "Active Loan",
    created_at: "2026-10-03T09:00:00Z",
  },
  {
    id: "lo-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    equipment_code: "EQ-SPT-2026-FB21",
    item_name: "Nike Club Team Match Ball (Size 5)",
    sport_type: "Football / Turf",
    borrower_id: "std-••••••••-8812",
    borrower_name: "Rohan Kapoor",
    quantity: 1,
    checkout_time: "2026-10-03T08:30:00Z",
    due_time: "2026-10-03T11:30:00Z",
    deposit_inr: 300,
    item_condition: "Good",
    status: "Active Loan",
    created_at: "2026-10-03T08:30:00Z",
  }
];
