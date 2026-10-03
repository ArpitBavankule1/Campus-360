// ================================================================
// CampusLens AI — Phase 33: Campus Incubation & Startup Accelerator Engine
// Seed funding calculator, pitch session scheduler & maker space mock data
// ================================================================

import {
  IncubationVenture,
  VentureFundingTranche,
  MakerSpaceEquipment,
  PitchSession,
  IncubationOverviewStats,
} from "@/types";

export function generatePitchSessionCode(): string {
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PITCH-DEMO-2026-${randomSuffix}`;
}

export function calculateIncubationOverview(
  ventures: IncubationVenture[] = MOCK_VENTURES,
  tranches: VentureFundingTranche[] = MOCK_FUNDING_TRANCHES,
  equipment: MakerSpaceEquipment[] = MOCK_MAKER_EQUIPMENT,
  pitches: PitchSession[] = MOCK_PITCHES
): IncubationOverviewStats {
  const totalGrantDisbursedInr = tranches
    .filter((t) => t.disbursement_status === "Disbursed")
    .reduce((acc, t) => acc + t.amount_inr, 0);

  const patentsFiledCount = ventures.reduce((acc, v) => acc + v.patents_filed, 0);

  return {
    totalIncubatedVentures: ventures.length,
    totalGrantDisbursedInr,
    activePrototypingJobs: equipment.filter((e) => e.is_operational).length,
    patentsFiledCount,
    ventures,
    fundingTranches: tranches,
    makerEquipment: equipment,
    pitches,
  };
}

export const MOCK_VENTURES: IncubationVenture[] = [
  {
    id: "ven-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    venture_name: "NeuroPulse Robotics",
    sector: "Robotics & Hardware",
    founder_name: "Devansh Mehta & Team",
    founder_id: "std-••••••••-3321",
    founder_role: "Student Founder (Final Year Mech)",
    pitch_deck_url: "https://campuslens.ai/incubation/neuropulse-pitch.pdf",
    stage: "Seed Funded",
    valuation_inr: 45000000,
    seed_grant_inr: 1000000,
    patents_filed: 2,
    status: "Incubated",
    created_at: "2026-02-10T10:00:00Z",
  },
  {
    id: "ven-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    venture_name: "AgriSense Satellite IoT",
    sector: "Climate & CleanTech",
    founder_name: "Dr. Ramesh Kulkarni & Ananya Sen",
    founder_id: "fac-••••••••-8812",
    founder_role: "Faculty-Student Joint Venture",
    pitch_deck_url: "https://campuslens.ai/incubation/agrisense-deck.pdf",
    stage: "Prototyping",
    valuation_inr: 25000000,
    seed_grant_inr: 750000,
    patents_filed: 1,
    status: "Incubated",
    created_at: "2026-03-01T11:30:00Z",
  },
  {
    id: "ven-33333333-3333-4111-8111-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    venture_name: "BioSynth Point-of-Care Diagnostics",
    sector: "BioTech & HealthCare",
    founder_name: "Tanvi Deshmukh",
    founder_id: "std-••••••••-9944",
    founder_role: "Postgrad Bioengineering Scholar",
    pitch_deck_url: "https://campuslens.ai/incubation/biosynth-pitch.pdf",
    stage: "Seed Funded",
    valuation_inr: 60000000,
    seed_grant_inr: 1500000,
    patents_filed: 3,
    status: "Accelerated",
    created_at: "2026-01-15T09:00:00Z",
  },
  {
    id: "ven-44444444-4444-4111-8111-444444444444",
    college_id: "c1111111-1111-4111-8111-111111111111",
    venture_name: "ZeroKnowledge Proof Identity (ZKP-ID)",
    sector: "DeepTech & AI",
    founder_name: "Kabir Verma",
    founder_id: "std-••••••••-1199",
    founder_role: "Student Founder (CS Honours)",
    pitch_deck_url: "https://campuslens.ai/incubation/zkp-id.pdf",
    stage: "Ideation",
    valuation_inr: 10000000,
    seed_grant_inr: 250000,
    patents_filed: 0,
    status: "Applied",
    created_at: "2026-09-15T14:00:00Z",
  }
];

export const MOCK_FUNDING_TRANCHES: VentureFundingTranche[] = [
  {
    id: "tra-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    venture_id: "ven-11111111-1111-4111-8111-111111111111",
    tranche_name: "Tranche 1: Prototype Actuator Milestone",
    amount_inr: 500000,
    investor_type: "Institutional Seed Fund",
    disbursement_date: "2026-04-10",
    milestone_verified: true,
    disbursement_status: "Disbursed",
    created_at: "2026-04-10T10:00:00Z",
  },
  {
    id: "tra-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    venture_id: "ven-33333333-3333-4111-8111-333333333333",
    tranche_name: "Tranche 2: Microfluidic Lab-on-Chip Trials",
    amount_inr: 750000,
    investor_type: "Government DST Grant",
    disbursement_date: "2026-06-20",
    milestone_verified: true,
    disbursement_status: "Disbursed",
    created_at: "2026-06-20T11:00:00Z",
  }
];

export const MOCK_MAKER_EQUIPMENT: MakerSpaceEquipment[] = [
  {
    id: "mak-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    equipment_name: "Stratasys F370 Industrial Dual-Extrusion 3D Printer",
    equipment_type: "Industrial 3D Printer",
    location_lab: "Apex Central Maker Space Bay 1",
    hourly_slot_capacity: 2,
    specs_summary: "Build volume 355 x 254 x 355 mm, ABS/ASA/PLA/TPU, 0.127mm layer resolution",
    is_operational: true,
    created_at: "2026-01-10T10:00:00Z",
  },
  {
    id: "mak-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    equipment_name: "Datron Neo 3-Axis Precision CNC Milling Workbench",
    equipment_type: "CNC Milling Workbench",
    location_lab: "Precision Machining Wing, Room 102",
    hourly_slot_capacity: 1,
    specs_summary: "High-speed 40,000 RPM spindle for aluminum, brass, and composite materials",
    is_operational: true,
    created_at: "2026-01-12T11:00:00Z",
  },
  {
    id: "mak-33333333-3333-4111-8111-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    equipment_name: "Epilog Fusion Pro 48 CO2 Laser Cutter & Engraver",
    equipment_type: "Laser Cutter & Engraver",
    location_lab: "Rapid Fabrication Lab Bay 3",
    hourly_slot_capacity: 3,
    specs_summary: "120W CO2 Laser, 1219 x 914 mm table, autofocus optical registration",
    is_operational: true,
    created_at: "2026-01-15T12:00:00Z",
  }
];

export const MOCK_PITCHES: PitchSession[] = [
  {
    id: "pit-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    session_code: "PITCH-DEMO-2026-NP01",
    venture_id: "ven-11111111-1111-4111-8111-111111111111",
    pitch_date: "2026-10-12T14:30:00Z",
    angel_investor_panel: [
      "Sequoia Surge Partner",
      "Apex Distinguished Angel Alumni",
      "DST TDB Director",
    ],
    venue: "Apex Incubation Boardroom & Webcast Suite",
    verdict: "Term Sheet Offered",
    created_at: "2026-09-28T16:00:00Z",
  },
  {
    id: "pit-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    session_code: "PITCH-DEMO-2026-AG04",
    venture_id: "ven-22222222-2222-4111-8111-222222222222",
    pitch_date: "2026-10-18T16:00:00Z",
    angel_investor_panel: [
      "Omnivore Agritech Syndicate",
      "Apex Dean of Research",
    ],
    venue: "Apex Incubation Boardroom & Webcast Suite",
    verdict: "Under Deliberation",
    created_at: "2026-09-30T10:00:00Z",
  }
];
