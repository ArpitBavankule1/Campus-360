// ================================================================
// CampusLens AI — Phase 30: Smart Campus Sustainability & Green Energy Engine
// Solar PV telemetry, water conservation sensors, and eco-credit certificates
// ================================================================

import {
  SolarTelemetry,
  WaterMetric,
  WasteAudit,
  EcoCredit,
  SustainabilityOverviewStats,
} from "@/types";

export function generateEcoCertificateCode(): string {
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CL-ECO-CRD-2026-${randomSuffix}`;
}

export function calculateSustainabilityOverview(
  solar: SolarTelemetry[] = MOCK_SOLAR_TELEMETRY,
  water: WaterMetric[] = MOCK_WATER_METRICS,
  waste: WasteAudit[] = MOCK_WASTE_AUDITS,
  credits: EcoCredit[] = MOCK_ECO_CREDITS
): SustainabilityOverviewStats {
  const totalInstantGenerationKw = solar.reduce((acc, s) => acc + Number(s.current_generation_kw), 0);
  const totalDailyGenerationKwh = solar.reduce((acc, s) => acc + Number(s.daily_total_kwh), 0);
  const totalCarbonOffsetKg = solar.reduce((acc, s) => acc + Number(s.carbon_offset_kg), 0);
  const averageBatteryStoragePercent = Math.round(
    solar.reduce((acc, s) => acc + s.battery_storage_percent, 0) / (solar.length || 1)
  );

  const totalWaterReservesKl = water.reduce((acc, w) => acc + Number(w.current_reserve_kiloliters), 0);
  const campusDiversionRatePercent = waste.length
    ? Number((waste.reduce((acc, w) => acc + Number(w.landfill_diversion_rate_percent), 0) / waste.length).toFixed(1))
    : 85.0;

  const totalEcoPointsLogged = credits.reduce((acc, c) => acc + c.eco_points_earned, 0);

  return {
    totalInstantGenerationKw: Number(totalInstantGenerationKw.toFixed(1)),
    totalDailyGenerationKwh: Number(totalDailyGenerationKwh.toFixed(1)),
    totalCarbonOffsetKg: Number(totalCarbonOffsetKg.toFixed(1)),
    averageBatteryStoragePercent,
    totalWaterReservesKl: Number(totalWaterReservesKl.toFixed(1)),
    campusDiversionRatePercent,
    totalEcoPointsLogged,
    solarTelemetry: solar,
    waterMetrics: water,
    wasteAudits: waste,
    ecoCredits: credits,
  };
}

export const MOCK_SOLAR_TELEMETRY: SolarTelemetry[] = [
  {
    id: "sol-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    array_zone: "Engineering Block A & B",
    peak_capacity_kwp: 320.0,
    current_generation_kw: 248.5,
    daily_total_kwh: 1420.0,
    battery_storage_percent: 92,
    grid_export_kw: 45.2,
    carbon_offset_kg: 1164.4,
    timestamp: "2026-10-02T11:00:00Z",
  },
  {
    id: "sol-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    array_zone: "Central Library Complex",
    peak_capacity_kwp: 180.0,
    current_generation_kw: 142.0,
    daily_total_kwh: 810.0,
    battery_storage_percent: 88,
    grid_export_kw: 18.0,
    carbon_offset_kg: 664.2,
    timestamp: "2026-10-02T11:00:00Z",
  },
  {
    id: "sol-33333333-3333-4111-8111-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    array_zone: "Indoor Sports Arena",
    peak_capacity_kwp: 210.0,
    current_generation_kw: 165.2,
    daily_total_kwh: 940.0,
    battery_storage_percent: 84,
    grid_export_kw: 22.5,
    carbon_offset_kg: 770.8,
    timestamp: "2026-10-02T11:00:00Z",
  },
  {
    id: "sol-44444444-4444-4111-8111-444444444444",
    college_id: "c1111111-1111-4111-8111-111111111111",
    array_zone: "Scholars Residence Hall",
    peak_capacity_kwp: 250.0,
    current_generation_kw: 195.0,
    daily_total_kwh: 1100.0,
    battery_storage_percent: 78,
    grid_export_kw: 12.0,
    carbon_offset_kg: 902.0,
    timestamp: "2026-10-02T11:00:00Z",
  },
  {
    id: "sol-55555555-5555-4111-8111-555555555555",
    college_id: "c1111111-1111-4111-8111-111111111111",
    array_zone: "Administrative Tower",
    peak_capacity_kwp: 120.0,
    current_generation_kw: 98.4,
    daily_total_kwh: 560.0,
    battery_storage_percent: 94,
    grid_export_kw: 31.0,
    carbon_offset_kg: 459.2,
    timestamp: "2026-10-02T11:00:00Z",
  }
];

export const MOCK_WATER_METRICS: WaterMetric[] = [
  {
    id: "wat-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    reservoir_name: "Main Campus Rainwater Reservoir Alpha",
    capacity_kiloliters: 450.0,
    current_reserve_kiloliters: 395.0,
    greywater_recycled_liters_today: 18500.0,
    water_quality_index: 96.5,
    tds_ppm: 110,
    ph_level: 7.2,
    updated_at: "2026-10-02T10:30:00Z",
  },
  {
    id: "wat-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    reservoir_name: "South Quad Retention & Percolation Basin",
    capacity_kiloliters: 300.0,
    current_reserve_kiloliters: 245.0,
    greywater_recycled_liters_today: 12200.0,
    water_quality_index: 93.0,
    tds_ppm: 135,
    ph_level: 7.1,
    updated_at: "2026-10-02T10:30:00Z",
  },
  {
    id: "wat-33333333-3333-4111-8111-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    reservoir_name: "East Hostel Greywater Recycling Facility",
    capacity_kiloliters: 200.0,
    current_reserve_kiloliters: 178.0,
    greywater_recycled_liters_today: 24500.0,
    water_quality_index: 91.5,
    tds_ppm: 155,
    ph_level: 7.4,
    updated_at: "2026-10-02T10:30:00Z",
  }
];

export const MOCK_WASTE_AUDITS: WasteAudit[] = [
  {
    id: "wst-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    audit_week: "Week 39 (Late Sept 2026)",
    organic_compost_kg: 1840.0,
    dry_recyclables_kg: 1120.0,
    electronic_waste_kg: 85.0,
    landfill_waste_kg: 320.0,
    landfill_diversion_rate_percent: 90.5,
    auditor_officer: "Er. Ramesh Kulkarni (Director of Campus Facilities)",
    remarks: "Cafeteria food composting exceeded 1.8 tonnes; organic compost distributed to campus botanical garden.",
    created_at: "2026-09-28T16:00:00Z",
  },
  {
    id: "wst-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    audit_week: "Week 38 (Mid Sept 2026)",
    organic_compost_kg: 1720.0,
    dry_recyclables_kg: 1050.0,
    electronic_waste_kg: 40.0,
    landfill_waste_kg: 390.0,
    landfill_diversion_rate_percent: 87.8,
    auditor_officer: "Er. Ramesh Kulkarni (Director of Campus Facilities)",
    remarks: "Paperless exam initiative reduced paper waste generation by 32% across testing centers.",
    created_at: "2026-09-21T16:00:00Z",
  }
];

export const MOCK_ECO_CREDITS: EcoCredit[] = [
  {
    id: "eco-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    student_id: "std-11111111-1111-4111-8111-111111111111",
    student_name: "Arpit Bavankule",
    commute_mode: "Bicycle",
    distance_km: 18.5,
    co2_saved_kg: 3.88,
    eco_points_earned: 185,
    certificate_code: "CL-ECO-CRD-2026-CYC1",
    logged_at: "2026-10-02T08:30:00Z",
  },
  {
    id: "eco-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    student_id: "std-22222222-2222-4111-8111-222222222222",
    student_name: "Pooja Hegde",
    commute_mode: "Campus EV Shuttle",
    distance_km: 24.0,
    co2_saved_kg: 4.56,
    eco_points_earned: 240,
    certificate_code: "CL-ECO-CRD-2026-EVS8",
    logged_at: "2026-10-02T09:15:00Z",
  },
  {
    id: "eco-33333333-3333-4111-8111-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    student_id: "std-33333333-3333-4111-8111-333333333333",
    student_name: "Rohan Varma",
    commute_mode: "Walking",
    distance_km: 6.2,
    co2_saved_kg: 1.30,
    eco_points_earned: 120,
    certificate_code: "CL-ECO-CRD-2026-WLK4",
    logged_at: "2026-10-01T17:45:00Z",
  }
];
