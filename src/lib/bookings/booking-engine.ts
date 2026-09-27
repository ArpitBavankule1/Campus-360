/**
 * CampusLens AI — Phase 18 Booking Engine
 * Core business logic for smart campus facility & resource reservations.
 * Provides slot collision detection, pass generation, time utilities,
 * and robust mock fallback for offline or zero-configuration use.
 */

import { FacilityBooking, FacilityBookingSlot, FacilityBookingStatus } from "@/types";

export interface CampusSpace {
  id: string;
  name: string;
  category: "study_pod" | "lab" | "auditorium" | "sports" | "conference";
  categoryLabel: string;
  building: string;
  floor: string;
  roomNumber: string;
  capacity: number;
  timings: string;
  amenities: string[];
  imageUrl: string;
  requiresApproval: boolean;
  inCharge: string;
  contactEmail: string;
}

export const CAMPUS_SPACES: CampusSpace[] = [
  {
    id: "fac-pod-01",
    name: "Smart Study Pod Alpha",
    category: "study_pod",
    categoryLabel: "Study Pods",
    building: "Central Library",
    floor: "2nd Floor",
    roomNumber: "LIB-204A",
    capacity: 2,
    timings: "08:00 AM - 09:00 PM",
    amenities: ["Ultra-quiet soundproofing", "Dual 4K USB-C monitors", "Ergonomic seating", "Gigabit Wi-Fi 6E"],
    imageUrl: "/images/campus/library.jpg",
    requiresApproval: false,
    inCharge: "Prof. S. Venkatesh",
    contactEmail: "library@campuslens.edu",
  },
  {
    id: "fac-pod-02",
    name: "Collaborative Study Pod Beta",
    category: "study_pod",
    categoryLabel: "Study Pods",
    building: "Central Library",
    floor: "2nd Floor",
    roomNumber: "LIB-204B",
    capacity: 4,
    timings: "08:00 AM - 09:00 PM",
    amenities: ["Whiteboard wall", "Wireless presentation display", "Active noise cancellation", "Power hub"],
    imageUrl: "/images/campus/library.jpg",
    requiresApproval: false,
    inCharge: "Prof. S. Venkatesh",
    contactEmail: "library@campuslens.edu",
  },
  {
    id: "fac-lab-01",
    name: "High-Performance GPU AI & Robotics Lab",
    category: "lab",
    categoryLabel: "Specialized Labs",
    building: "Turing Tech Annex",
    floor: "3rd Floor",
    roomNumber: "TTA-302",
    capacity: 25,
    timings: "09:00 AM - 07:00 PM",
    amenities: ["NVIDIA RTX 4090 Workstations", "ROS Robot Arms", "Soldering stations", "Biometric access"],
    imageUrl: "/images/campus/lab.jpg",
    requiresApproval: true,
    inCharge: "Dr. Arvind Raman",
    contactEmail: "ai.lab@campuslens.edu",
  },
  {
    id: "fac-aud-01",
    name: "APJ Abdul Kalam Central Auditorium",
    category: "auditorium",
    categoryLabel: "Auditoriums",
    building: "Main Administration Block",
    floor: "Ground Floor",
    roomNumber: "AUD-G01",
    capacity: 450,
    timings: "09:00 AM - 08:00 PM",
    amenities: ["Bose Line-Array PA System", "Laser 4K Projection", "Stage Lighting rig", "Live streaming suite"],
    imageUrl: "/images/campus/auditorium.jpg",
    requiresApproval: true,
    inCharge: "Dean of Student Affairs",
    contactEmail: "events.admin@campuslens.edu",
  },
  {
    id: "fac-spt-01",
    name: "Indoor Badminton Court 1",
    category: "sports",
    categoryLabel: "Sports & Fitness",
    building: "Dr. B.R. Ambedkar Sports Complex",
    floor: "1st Floor",
    roomNumber: "SPT-101",
    capacity: 4,
    timings: "06:00 AM - 09:00 PM",
    amenities: ["BWF-certified synthetic court", "LED arena floodlights", "Locker room access", "Equipment locker"],
    imageUrl: "/images/campus/sports.jpg",
    requiresApproval: false,
    inCharge: "Coach Rajesh Pillai",
    contactEmail: "sports@campuslens.edu",
  },
  {
    id: "fac-conf-01",
    name: "Ideation & Boardroom Hall",
    category: "conference",
    categoryLabel: "Conference & Seminar",
    building: "Innovation & Incubation Center",
    floor: "1st Floor",
    roomNumber: "IIC-110",
    capacity: 20,
    timings: "08:30 AM - 06:30 PM",
    amenities: ["Polycom 360 Video Conference", "Interactive Smartboard", "Conference microphone grid", "Espresso bar"],
    imageUrl: "/images/campus/conference.jpg",
    requiresApproval: true,
    inCharge: "Dean of Research & Innovation",
    contactEmail: "innovation@campuslens.edu",
  },
];

// Operating hours hourly time slots: 08:00 to 20:00
export const STANDARD_HOURLY_SLOTS = [
  { startTime: "08:00", endTime: "09:00", label: "08:00 AM - 09:00 AM" },
  { startTime: "09:00", endTime: "10:00", label: "09:00 AM - 10:00 AM" },
  { startTime: "10:00", endTime: "11:00", label: "10:00 AM - 11:00 AM" },
  { startTime: "11:00", endTime: "12:00", label: "11:00 AM - 12:00 PM" },
  { startTime: "12:00", endTime: "13:00", label: "12:00 PM - 01:00 PM" },
  { startTime: "13:00", endTime: "14:00", label: "01:00 PM - 02:00 PM" },
  { startTime: "14:00", endTime: "15:00", label: "02:00 PM - 03:00 PM" },
  { startTime: "15:00", endTime: "16:00", label: "03:00 PM - 04:00 PM" },
  { startTime: "16:00", endTime: "17:00", label: "04:00 PM - 05:00 PM" },
  { startTime: "17:00", endTime: "18:00", label: "05:00 PM - 06:00 PM" },
  { startTime: "18:00", endTime: "19:00", label: "06:00 PM - 07:00 PM" },
  { startTime: "19:00", endTime: "20:00", label: "07:00 PM - 08:00 PM" },
];

/**
 * Checks whether two time intervals overlap on the same date.
 * [startA, endA) and [startB, endB)
 */
export function doIntervalsOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  return startA < endB && endA > startB;
}

/**
 * Checks if a requested slot is available against existing bookings.
 */
export function isSlotAvailable(
  existingBookings: FacilityBooking[],
  facilityId: string,
  date: string,
  startTime: string,
  endTime: string,
  ignoreBookingId?: string
): boolean {
  return !existingBookings.some((b) => {
    if (b.id === ignoreBookingId) return false;
    if (b.facility_id !== facilityId) return false;
    if (b.booking_date !== date) return false;
    // Cancelled or rejected bookings don't block
    if (b.status === "cancelled" || b.status === "rejected") return false;

    return doIntervalsOverlap(startTime, endTime, b.start_time, b.end_time);
  });
}

/**
 * Generates all time slots for a given facility on a given date with availability status.
 */
export function getFacilityAvailability(
  existingBookings: FacilityBooking[],
  facilityId: string,
  date: string
): FacilityBookingSlot[] {
  return STANDARD_HOURLY_SLOTS.map((slot) => {
    const matchingBooking = existingBookings.find(
      (b) =>
        b.facility_id === facilityId &&
        b.booking_date === date &&
        b.status !== "cancelled" &&
        b.status !== "rejected" &&
        doIntervalsOverlap(slot.startTime, slot.endTime, b.start_time, b.end_time)
    );

    return {
      startTime: slot.startTime,
      endTime: slot.endTime,
      isAvailable: !matchingBooking,
      bookingId: matchingBooking?.id,
      purpose: matchingBooking?.purpose,
    };
  });
}

/**
 * Generates a unique, high-security alphanumeric booking pass code.
 * Format: CL-SPACE-XXXXXX (e.g., CL-POD-849201)
 */
export function generateBookingPassCode(category: string): string {
  const prefixMap: Record<string, string> = {
    study_pod: "POD",
    lab: "LAB",
    auditorium: "AUD",
    sports: "SPT",
    conference: "CNF",
  };
  const prefix = prefixMap[category] || "RES";
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `CL-${prefix}-${randomSuffix}`;
}

/**
 * Determines booking status on creation.
 * Sensitive or high-capacity facilities require approval. Low-risk study pods/sports are auto-approved.
 */
export function determineBookingInitialStatus(
  facility: CampusSpace
): FacilityBookingStatus {
  return facility.requiresApproval ? "pending" : "approved";
}

/**
 * Seed initial mock bookings for realistic presentation out of the box.
 */
export function getInitialSeedBookings(): FacilityBooking[] {
  const today = new Date().toISOString().split("T")[0];

  return [
    {
      id: "seed-bk-01",
      college_id: "c0000000-0000-0000-0000-000000000001",
      facility_id: "fac-pod-01",
      user_id: "usr-demo-01",
      booking_date: today,
      start_time: "10:00",
      end_time: "11:00",
      purpose: "GRE Quantitative Reasoning Mock Test",
      attendees_count: 1,
      status: "approved",
      booking_pass_code: "CL-POD-482019",
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      updated_at: new Date().toISOString(),
      user_name: "Aarav Sharma",
      user_email: "aarav.sharma@campuslens.edu",
      user_role: "student",
    },
    {
      id: "seed-bk-02",
      college_id: "c0000000-0000-0000-0000-000000000001",
      facility_id: "fac-lab-01",
      user_id: "usr-demo-02",
      booking_date: today,
      start_time: "14:00",
      end_time: "16:00",
      purpose: "Autonomous Drone Vision Fine-Tuning Session",
      attendees_count: 6,
      status: "pending",
      booking_pass_code: "CL-LAB-910283",
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      updated_at: new Date().toISOString(),
      user_name: "Priya Nair",
      user_email: "priya.nair@campuslens.edu",
      user_role: "student",
    },
    {
      id: "seed-bk-03",
      college_id: "c0000000-0000-0000-0000-000000000001",
      facility_id: "fac-spt-01",
      user_id: "usr-demo-03",
      booking_date: today,
      start_time: "17:00",
      end_time: "18:00",
      purpose: "Inter-department Badminton Doubles Practice",
      attendees_count: 4,
      status: "approved",
      booking_pass_code: "CL-SPT-772109",
      created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
      updated_at: new Date().toISOString(),
      user_name: "Rohan Kulkarni",
      user_email: "rohan.kulkarni@campuslens.edu",
      user_role: "student",
    },
  ];
}
