// ================================================================
// CampusLens AI — Phase 27: Smart Campus Transport & EV Shuttle Engine
// Business logic, boarding pass generation, bay calculation, and seed data
// ================================================================

import {
  TransportRoute,
  TransportSchedule,
  TransportPass,
  ParkingZone,
  ParkingReservation,
  CarpoolListing,
  TransportOverviewStats,
} from "@/types";

export function generateTransportPassCode(routeCode: string = "LOOP"): string {
  const cleanCode = routeCode.replace(/[^A-Za-z0-9]/g, "").substring(0, 4).toUpperCase() || "PASS";
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CL-TRN-${cleanCode}-2026-${randomSuffix}`;
}

export function generateParkingPassCode(zoneCode: string = "BAY"): string {
  const cleanCode = zoneCode.replace(/[^A-Za-z0-9]/g, "").substring(0, 3).toUpperCase() || "PRK";
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CL-PRK-${cleanCode}-${randomSuffix}`;
}

export function calculateTransportOverview(
  routes: TransportRoute[] = MOCK_ROUTES,
  schedules: TransportSchedule[] = MOCK_SCHEDULES,
  passes: TransportPass[] = MOCK_TRANSPORT_PASSES,
  zones: ParkingZone[] = MOCK_PARKING_ZONES,
  carpools: CarpoolListing[] = MOCK_CARPOOL_LISTINGS
): TransportOverviewStats {
  const activeShuttles = schedules.filter((s) => s.live_status !== "completed").length;
  const avgWait = schedules.length > 0
    ? Math.round(schedules.reduce((acc, s) => acc + s.live_eta_mins, 0) / schedules.length)
    : 8;

  const totalParkingBays = zones.reduce((acc, z) => acc + z.total_bays, 0);
  const occupiedBays = zones.reduce((acc, z) => acc + z.occupied_bays, 0);
  const parkingAvailableBays = Math.max(0, totalParkingBays - occupiedBays);

  const activeCarpools = carpools.filter((c) => c.is_active && c.seats_available > 0).length;

  return {
    activeShuttles,
    averageWaitTimeMins: avgWait,
    parkingAvailableBays,
    totalParkingBays,
    activeCarpools,
    routes,
    schedules,
  };
}

export const MOCK_ROUTES: TransportRoute[] = [
  {
    id: "rt-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    route_name: "Green Horizon EV Circular Loop",
    route_code: "EV-LOOP-A",
    shuttle_type: "electric_bus",
    start_point: "Metro Station North Interchange",
    end_point: "Central Technology Tower & AI Quad",
    stops: [
      { name: "Metro Interchange North", eta_mins: 0, landmark: "Gate 1 Exit" },
      { name: "Boys Residential Hall (Block A-C)", eta_mins: 4, landmark: "Hostel Dining Hub" },
      { name: "Central Library & Digital Commons", eta_mins: 8, landmark: "Knowledge Garden" },
      { name: "Main Academic Quad & Lecture Halls", eta_mins: 12, landmark: "Clock Tower" },
      { name: "Tech Innovation & Robotics Hub", eta_mins: 15, landmark: "North Gate Terminal" },
    ],
    operating_hours: "07:00 AM - 10:30 PM",
    frequency_mins: 10,
    status: "active",
    created_at: "2026-02-01T08:00:00Z",
  },
  {
    id: "rt-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    route_name: "South Campus & Sports Arena Shuttle",
    route_code: "EV-LOOP-B",
    shuttle_type: "electric_bus",
    start_point: "Central Technology Tower",
    end_point: "Olympic Aquatics Complex & Cricket Stadium",
    stops: [
      { name: "Central Technology Tower", eta_mins: 0, landmark: "South Concourse" },
      { name: "Girls Residence Hall & Infirmary", eta_mins: 5, landmark: "Health Center OPD" },
      { name: "Staff Residential Quarters", eta_mins: 9, landmark: "Faculty Club" },
      { name: "Indoor Badminton & Olympic Arena", eta_mins: 14, landmark: "Sports Pavilion" },
    ],
    operating_hours: "06:30 AM - 09:30 PM",
    frequency_mins: 15,
    status: "active",
    created_at: "2026-02-05T09:00:00Z",
  },
  {
    id: "rt-33333333-3333-4111-8111-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    route_name: "Late-Night Safe Transit Shuttle",
    route_code: "NIGHT-EXPR",
    shuttle_type: "night_transit",
    start_point: "Central Library (24/7 Reading Hall)",
    end_point: "All Campus Residences & Main Gates",
    stops: [
      { name: "Digital Library 24x7 Porch", eta_mins: 0, landmark: "Security Point Alpha" },
      { name: "Girls Hostel Complex Gate", eta_mins: 6, landmark: "Warden Checkpoint" },
      { name: "Boys Hostel Complex Gate", eta_mins: 12, landmark: "Dining Square" },
      { name: "Campus Hospital & Ambulance Bay", eta_mins: 16, landmark: "Emergency Gate" },
      { name: "Main Highway Exit Gate", eta_mins: 22, landmark: "Highway Junction" },
    ],
    operating_hours: "10:00 PM - 05:30 AM",
    frequency_mins: 20,
    status: "active",
    created_at: "2026-02-10T11:00:00Z",
  }
];

export const MOCK_SCHEDULES: TransportSchedule[] = [
  {
    id: "sch-11111111-1111-4111-8111-111111111111",
    route_id: "rt-11111111-1111-4111-8111-111111111111",
    bus_number: "EV-BUS-01 (Tata Starbus Electric)",
    driver_name: "Mukesh Kumar",
    driver_phone: "+91 98765 43210",
    departure_time: "10:15 AM",
    current_stop: "Boys Residential Hall (Block A-C)",
    live_eta_mins: 4,
    live_status: "approaching",
    created_at: "2026-10-01T04:45:00Z",
    route: MOCK_ROUTES[0],
  },
  {
    id: "sch-22222222-2222-4111-8111-222222222222",
    route_id: "rt-11111111-1111-4111-8111-111111111111",
    bus_number: "EV-BUS-02 (Olectra Greentech e-Coach)",
    driver_name: "Sunil Yadav",
    driver_phone: "+91 98765 43211",
    departure_time: "10:25 AM",
    current_stop: "Metro Interchange North",
    live_eta_mins: 10,
    live_status: "on_time",
    created_at: "2026-10-01T04:55:00Z",
    route: MOCK_ROUTES[0],
  },
  {
    id: "sch-33333333-3333-4111-8111-333333333333",
    route_id: "rt-22222222-2222-4111-8111-222222222222",
    bus_number: "EV-BUS-03 (JBM Ecolife Zero Emission)",
    driver_name: "Rajesh Shinde",
    driver_phone: "+91 98765 43212",
    departure_time: "10:20 AM",
    current_stop: "Girls Residence Hall & Infirmary",
    live_eta_mins: 6,
    live_status: "on_time",
    created_at: "2026-10-01T04:50:00Z",
    route: MOCK_ROUTES[1],
  }
];

export const MOCK_TRANSPORT_PASSES: TransportPass[] = [
  {
    id: "pas-trn-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    scholar_id: "usr-student-001",
    scholar_name: "Arpit Bavankule",
    pass_type: "semester_unlimited",
    pass_code: "CL-TRN-EV-2026-AP81",
    route_id: "rt-11111111-1111-4111-8111-111111111111",
    valid_from: "2026-08-01",
    valid_to: "2027-01-31",
    status: "active",
    created_at: "2026-08-01T09:00:00Z",
    route: MOCK_ROUTES[0],
  }
];

export const MOCK_PARKING_ZONES: ParkingZone[] = [
  {
    id: "prk-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    zone_name: "North Gate Solar EV Rapid Bay",
    zone_code: "EV-BAY-N1",
    category: "ev_charging",
    total_bays: 30,
    occupied_bays: 12,
    hourly_rate: 15.00,
    created_at: "2026-01-10T08:00:00Z",
  },
  {
    id: "prk-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    zone_name: "Central Academic Complex Parking",
    zone_code: "ACAD-LOT-C",
    category: "faculty",
    total_bays: 80,
    occupied_bays: 48,
    hourly_rate: 0.00,
    created_at: "2026-01-10T08:00:00Z",
  },
  {
    id: "prk-33333333-3333-4111-8111-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    zone_name: "Scholar & Student Two-Wheeler Plaza",
    zone_code: "STU-BIKE-S",
    category: "scholar",
    total_bays: 200,
    occupied_bays: 135,
    hourly_rate: 5.00,
    created_at: "2026-01-10T08:00:00Z",
  },
  {
    id: "prk-44444444-4444-4111-8111-444444444444",
    college_id: "c1111111-1111-4111-8111-111111111111",
    zone_name: "Visitor & Auditorium Guest Parking",
    zone_code: "VIS-AUD-G",
    category: "visitor",
    total_bays: 50,
    occupied_bays: 18,
    hourly_rate: 20.00,
    created_at: "2026-01-10T08:00:00Z",
  }
];

export const MOCK_CARPOOL_LISTINGS: CarpoolListing[] = [
  {
    id: "car-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    driver_id: "usr-faculty-004",
    driver_name: "Dr. Sandeep Deshmukh",
    driver_role: "faculty",
    departure_location: "Kothrud Chandani Chowk",
    destination_campus: "Main Campus North Gate",
    departure_time: "08:15 AM Daily",
    seats_available: 3,
    price_per_seat: 40.00,
    vehicle_model: "Tata Nexon EV (White)",
    contact_phone: "+91 98220 12345",
    is_active: true,
    created_at: "2026-09-20T08:00:00Z",
  },
  {
    id: "car-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    driver_id: "usr-student-008",
    driver_name: "Tanvi Kulkarni",
    driver_role: "student",
    departure_location: "Aundh Parihar Chowk",
    destination_campus: "AI Technology Tower",
    departure_time: "08:30 AM Daily",
    seats_available: 2,
    price_per_seat: 30.00,
    vehicle_model: "Hyundai i20 (Grey)",
    contact_phone: "+91 97654 98765",
    is_active: true,
    created_at: "2026-09-22T09:30:00Z",
  }
];
