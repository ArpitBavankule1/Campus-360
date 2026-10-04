// ================================================================
// CampusLens AI — Phase 36: Smart Campus Auditorium & Convention Hub
// Auditorium booking engine, cryptographic ticket pass generator & seed data
// ================================================================

import {
  AuditoriumHall,
  AuditoriumReservation,
  EventTicket,
  StageEquipmentRider,
  AuditoriumOverviewStats,
} from "@/types";

export function generateAuditoriumBookingCode(): string {
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RES-AUD-2026-${randomSuffix}`;
}

export function generateEventTicketCode(): string {
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CL-AUD-PASS-2026-${randomSuffix}`;
}

export function calculateAuditoriumOverview(
  halls: AuditoriumHall[] = MOCK_AUDITORIUM_HALLS,
  reservations: AuditoriumReservation[] = MOCK_AUDITORIUM_RESERVATIONS,
  tickets: EventTicket[] = MOCK_EVENT_TICKETS,
  riders: StageEquipmentRider[] = MOCK_STAGE_EQUIPMENT_RIDERS
): AuditoriumOverviewStats {
  const totalCapacity = halls.reduce((acc, h) => acc + h.seating_capacity, 0);
  return {
    totalAuditoriums: halls.length,
    totalSeatingCapacity: totalCapacity,
    activeEventsToday: reservations.filter((r) => r.booking_status === "Confirmed").length,
    totalTicketsIssued: 1420,
    halls,
    reservations,
    tickets,
    equipmentRiders: riders,
  };
}

export const MOCK_AUDITORIUM_HALLS: AuditoriumHall[] = [
  {
    id: "aud-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    hall_name: "Dr. A.P.J. Abdul Kalam Grand Auditorium",
    seating_capacity: 1200,
    venue_building: "Central Administrative Tower, West Wing",
    acoustic_rating: "Dolby Atmos Pro Sound (Bose RoomMatch)",
    stage_dimensions: "60ft x 40ft Grand Proscenium Stage",
    projector_type: "Laser 4K Christie Digital 30,000 Lumens",
    current_status: "Available",
    created_at: "2026-01-10T08:00:00Z",
  },
  {
    id: "aud-22222222-2222-4222-8222-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    hall_name: "Rabindranath Tagore Open-Air Amphitheatre",
    seating_capacity: 2500,
    venue_building: "Campus Green Valley Lawn & Promenade",
    acoustic_rating: "Harman Professional JBL VTX Line Array",
    stage_dimensions: "80ft x 50ft Stepped Semi-Circular Stage",
    projector_type: "Outdoor Daylight High-Nits LED Mega Wall",
    current_status: "Available",
    created_at: "2026-01-10T08:00:00Z",
  },
  {
    id: "aud-33333333-3333-4333-8333-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    hall_name: "Homi Bhabha Memorial Seminar Hall",
    seating_capacity: 350,
    venue_building: "Physics & Nano-Sciences Block, 2nd Floor",
    acoustic_rating: "Shure Microflex Advance Ceiling Arrays",
    stage_dimensions: "30ft x 18ft Symposium Presentation Stage",
    projector_type: "Dual 4K HDR Sony Laser Interactive Displays",
    current_status: "In Session",
    created_at: "2026-01-10T08:00:00Z",
  },
  {
    id: "aud-44444444-4444-4444-8444-444444444444",
    college_id: "c1111111-1111-4111-8111-111111111111",
    hall_name: "Sarojini Naidu Cultural Chamber",
    seating_capacity: 450,
    venue_building: "Humanities & Fine Arts Complex, Ground Floor",
    acoustic_rating: "Meyer Sound Constellation Acoustic Architecture",
    stage_dimensions: "35ft x 25ft Wooden Dance & Drama Deck",
    projector_type: "Barco High-Contrast Cinema Projector",
    current_status: "Available",
    created_at: "2026-01-10T08:00:00Z",
  },
];

export const MOCK_AUDITORIUM_RESERVATIONS: AuditoriumReservation[] = [
  {
    id: "res-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    booking_code: "RES-AUD-2026-88F1",
    hall_name: "Dr. A.P.J. Abdul Kalam Grand Auditorium",
    event_title: "Apex Annual Global Tech Summit & Hackathon Keynote",
    organizer_name: "Dr. Rajesh K. Verma",
    organizer_role: "Dean Office",
    event_date: "2026-10-15",
    start_time: "09:30:00",
    end_time: "17:30:00",
    expected_attendees: 1150,
    booking_status: "Confirmed",
    created_at: "2026-10-01T09:00:00Z",
  },
  {
    id: "res-22222222-2222-4222-8222-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    booking_code: "RES-AUD-2026-34C2",
    hall_name: "Rabindranath Tagore Open-Air Amphitheatre",
    event_title: "Campus Wave: Inter-Collegiate Battle of the Bands",
    organizer_name: "Arpit Bavankule",
    organizer_role: "Student Club Lead",
    event_date: "2026-10-24",
    start_time: "18:00:00",
    end_time: "22:00:00",
    expected_attendees: 2100,
    booking_status: "Confirmed",
    created_at: "2026-10-02T10:00:00Z",
  },
  {
    id: "res-33333333-3333-4333-8333-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    booking_code: "RES-AUD-2026-90K7",
    hall_name: "Homi Bhabha Memorial Seminar Hall",
    event_title: "Frontiers in Quantum Computing & Cryptography",
    organizer_name: "Prof. Ananya Sen",
    organizer_role: "Faculty Coordinator",
    event_date: "2026-10-04",
    start_time: "14:00:00",
    end_time: "16:30:00",
    expected_attendees: 300,
    booking_status: "Confirmed",
    created_at: "2026-10-03T08:00:00Z",
  },
];

export const MOCK_EVENT_TICKETS: EventTicket[] = [
  {
    id: "tkt-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    ticket_code: "CL-AUD-PASS-2026-88A9F1",
    event_title: "Apex Annual Global Tech Summit & Hackathon Keynote",
    hall_name: "Dr. A.P.J. Abdul Kalam Grand Auditorium",
    attendee_name: "Arpit Bavankule",
    seat_number: "Orchestra Row D, Seat 14",
    tier: "Orchestra Premium",
    is_checked_in: true,
    issued_at: "2026-10-02T14:30:00Z",
  },
  {
    id: "tkt-22222222-2222-4222-8222-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    ticket_code: "CL-AUD-PASS-2026-44B910",
    event_title: "Campus Wave: Inter-Collegiate Battle of the Bands",
    hall_name: "Rabindranath Tagore Open-Air Amphitheatre",
    attendee_name: "Arpit Bavankule",
    seat_number: "Stepped Promenade Block B, Seat 42",
    tier: "General Balcony",
    is_checked_in: false,
    issued_at: "2026-10-03T11:00:00Z",
  },
  {
    id: "tkt-33333333-3333-4333-8333-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    ticket_code: "CL-AUD-PASS-2026-92K477",
    event_title: "Frontiers in Quantum Computing & Cryptography",
    hall_name: "Homi Bhabha Memorial Seminar Hall",
    attendee_name: "Rohan Deshmukh",
    seat_number: "Center Row A, Seat 08",
    tier: "VIP Dignitary",
    is_checked_in: true,
    issued_at: "2026-10-03T16:00:00Z",
  },
];

export const MOCK_STAGE_EQUIPMENT_RIDERS: StageEquipmentRider[] = [
  {
    id: "eqr-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    equipment_type: "Wireless Lapel Mics",
    quantity: 6,
    technician_assigned: "Suresh Patil (Senior Sound Engineer)",
    status: "Installed & Tested",
    created_at: "2026-10-04T07:00:00Z",
  },
  {
    id: "eqr-22222222-2222-4222-8222-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    equipment_type: "Digital Mixer 32-Ch",
    quantity: 1,
    technician_assigned: "Kavita Rao (Stage Audio Lead)",
    status: "Installed & Tested",
    created_at: "2026-10-04T07:00:00Z",
  },
  {
    id: "eqr-33333333-3333-4333-8333-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    equipment_type: "Moving Head LED Rigs",
    quantity: 16,
    technician_assigned: "Vikram Mehta (Lighting Designer)",
    status: "Installed & Tested",
    created_at: "2026-10-04T07:00:00Z",
  },
  {
    id: "eqr-44444444-4444-4444-8444-444444444444",
    college_id: "c1111111-1111-4111-8111-111111111111",
    equipment_type: "4K Telepresence Cameras",
    quantity: 3,
    technician_assigned: "Anita Sen (Broadcast Director)",
    status: "Dispatched",
    created_at: "2026-10-04T08:00:00Z",
  },
];
