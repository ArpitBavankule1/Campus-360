// ================================================================
// CampusLens AI — Phase 23 Hostel & Residence Engine
// Business logic, analytics calculations, pass generation & seed datasets
// ================================================================

import {
  HostelBlock,
  HostelRoom,
  HostelAllocation,
  HostelMessMenu,
  HostelOutPass,
  HostelGrievance,
  StudentHostelOverview,
  HostelAnalyticsSummary,
  MealType,
  MessDayOfWeek,
} from "@/types";

export const MOCK_COLLEGE_ID = "col-apex-001";

// 1. Mock Hostel Blocks
export const MOCK_HOSTEL_BLOCKS: HostelBlock[] = [
  {
    id: "hb-001",
    college_id: MOCK_COLLEGE_ID,
    name: "Aryabhata Hall of Residence (Boys)",
    gender: "boys",
    total_floors: 4,
    total_rooms: 80,
    warden_name: "Dr. Suresh Varma",
    warden_phone: "+91 98765 43210",
    warden_email: "suresh.varma@apex.edu",
    description: "North Campus 4-storey residential block with dedicated high-speed LAN, gym, and badminton court.",
    created_at: "2026-01-15T08:00:00Z",
  },
  {
    id: "hb-002",
    college_id: MOCK_COLLEGE_ID,
    name: "Gargi Hall of Residence (Girls)",
    gender: "girls",
    total_floors: 4,
    total_rooms: 80,
    warden_name: "Prof. Meenakshi Sundaram",
    warden_phone: "+91 98765 43211",
    warden_email: "meenakshi.s@apex.edu",
    description: "South Campus residential pavilion featuring biometric turnstiles, 24/7 solar hot water, and study commons.",
    created_at: "2026-01-15T08:00:00Z",
  },
  {
    id: "hb-003",
    college_id: MOCK_COLLEGE_ID,
    name: "Kalam International & Scholar Residency",
    gender: "coed",
    total_floors: 5,
    total_rooms: 60,
    warden_name: "Dr. Rajesh K. Nair",
    warden_phone: "+91 98765 43212",
    warden_email: "rajesh.nair@apex.edu",
    description: "Modern climate-controlled accommodation for postgraduate scholars and international research fellows.",
    created_at: "2026-01-15T08:00:00Z",
  },
];

// 2. Mock Hostel Rooms
export const MOCK_HOSTEL_ROOMS: HostelRoom[] = [
  {
    id: "hr-101",
    college_id: MOCK_COLLEGE_ID,
    block_id: "hb-001",
    room_number: "A-204",
    floor: 2,
    capacity: 2,
    occupied_count: 2,
    room_type: "double",
    monthly_rent: 6500.0,
    ac_enabled: false,
    amenities: ["bed", "study_table", "ergonomic_chair", "wardrobe", "gigabit_lan", "balcony"],
    created_at: "2026-01-15T08:00:00Z",
  },
  {
    id: "hr-102",
    college_id: MOCK_COLLEGE_ID,
    block_id: "hb-001",
    room_number: "A-308",
    floor: 3,
    capacity: 1,
    occupied_count: 1,
    room_type: "single",
    monthly_rent: 9500.0,
    ac_enabled: true,
    amenities: ["bed", "study_table", "ac_unit", "attached_washroom", "refrigerator", "lan_port"],
    created_at: "2026-01-15T08:00:00Z",
  },
  {
    id: "hr-103",
    college_id: MOCK_COLLEGE_ID,
    block_id: "hb-002",
    room_number: "G-105",
    floor: 1,
    capacity: 2,
    occupied_count: 2,
    room_type: "double",
    monthly_rent: 6500.0,
    ac_enabled: false,
    amenities: ["bed", "study_table", "wardrobe", "bookshelf", "lan_port"],
    created_at: "2026-01-15T08:00:00Z",
  },
  {
    id: "hr-104",
    college_id: MOCK_COLLEGE_ID,
    block_id: "hb-003",
    room_number: "K-401",
    floor: 4,
    capacity: 1,
    occupied_count: 1,
    room_type: "single",
    monthly_rent: 11000.0,
    ac_enabled: true,
    amenities: ["bed", "study_table", "ac_unit", "attached_washroom", "smart_tv", "high_speed_wifi"],
    created_at: "2026-01-15T08:00:00Z",
  },
];

// 3. Mock Student Allocations
export const MOCK_HOSTEL_ALLOCATIONS: HostelAllocation[] = [
  {
    id: "ha-001",
    college_id: MOCK_COLLEGE_ID,
    room_id: "hr-101",
    student_id: "00000000-0000-0000-0000-000000000001",
    bed_number: "Bed A",
    academic_year: "2025-2026",
    status: "active",
    allocated_at: "2025-08-01T09:00:00Z",
    room: MOCK_HOSTEL_ROOMS[0],
  },
];

// 4. Mock Mess Menus (Weekly Schedule)
export const MOCK_MESS_MENUS: HostelMessMenu[] = [
  {
    id: "mm-mon-bf",
    college_id: MOCK_COLLEGE_ID,
    day_of_week: "monday",
    meal_type: "breakfast",
    timings: "07:30 AM – 09:30 AM",
    items: ["Masala Idli & Medu Vada", "Coconut Chutney & Sambar", "Sprouted Moong Salad", "Tea / Fresh Filter Coffee"],
    special_item: "Hot Mysore Bonda",
    calories_approx: 580,
    dietary_tags: ["Vegetarian", "High Protein", "Gluten-Free Option"],
  },
  {
    id: "mm-mon-lu",
    college_id: MOCK_COLLEGE_ID,
    day_of_week: "monday",
    meal_type: "lunch",
    timings: "12:30 PM – 02:30 PM",
    items: ["Steamed Jeera Rice", "Dal Tadka", "Paneer Butter Masala", "Phulka Rotis (3)", "Cucumber Boondi Raita", "Papad & Pickle"],
    special_item: "Gulab Jamun (1 pc)",
    calories_approx: 780,
    dietary_tags: ["Vegetarian", "Balanced Meal"],
  },
  {
    id: "mm-mon-sn",
    college_id: MOCK_COLLEGE_ID,
    day_of_week: "monday",
    meal_type: "snacks",
    timings: "05:00 PM – 06:15 PM",
    items: ["Vegetable Cutlet with Green Mint Chutney", "Marie / Bourbon Biscuits", "Cardamom Masala Chai", "Bournvita Milk"],
    special_item: "Crispy Vegetable Puff",
    calories_approx: 340,
    dietary_tags: ["Vegetarian", "Quick Energy"],
  },
  {
    id: "mm-mon-dn",
    college_id: MOCK_COLLEGE_ID,
    day_of_week: "monday",
    meal_type: "dinner",
    timings: "07:45 PM – 09:45 PM",
    items: ["Tawa Paratha with Chana Masala", "Steamed Basmati Rice", "Rasam", "Mixed Vegetable Poriyal", "Curd Bowl"],
    special_item: "Kesar Kheer",
    calories_approx: 720,
    dietary_tags: ["Vegetarian", "Fiber Rich"],
  },
  {
    id: "mm-tue-bf",
    college_id: MOCK_COLLEGE_ID,
    day_of_week: "tuesday",
    meal_type: "breakfast",
    timings: "07:30 AM – 09:30 AM",
    items: ["Poha with Roasted Peanuts", "Boiled Eggs (Non-Veg) / Sprouts (Veg)", "Upma with Tomato Chutney", "Tea / Coffee"],
    special_item: "Banana Walnut Smoothie",
    calories_approx: 520,
    dietary_tags: ["Vegetarian / Egg Option"],
  },
  {
    id: "mm-wed-dn",
    college_id: MOCK_COLLEGE_ID,
    day_of_week: "wednesday",
    meal_type: "dinner",
    timings: "07:45 PM – 09:45 PM",
    items: ["Hyderabadi Veg Dum Biryani", "Kadai Paneer", "Mirchi Ka Salan", "Burani Raita", "Laccha Onions"],
    special_item: "Special Feast Wednesday Night",
    calories_approx: 850,
    dietary_tags: ["Vegetarian", "Chef Special"],
  },
];

// 5. Mock Out-Passes
export const MOCK_OUT_PASSES: HostelOutPass[] = [
  {
    id: "op-001",
    college_id: MOCK_COLLEGE_ID,
    student_id: "00000000-0000-0000-0000-000000000001",
    pass_code: "CL-HST-PASS-2026-8942",
    destination: "Home (Pune, Maharashtra)",
    reason: "Family wedding and extended weekend recess",
    departure_time: "2026-10-02T16:00:00Z",
    expected_return: "2026-10-05T20:00:00Z",
    actual_return: null,
    parent_contact: "+91 94220 12345",
    parent_consent_verified: true,
    status: "approved",
    warden_remarks: "Approved by Dr. Suresh Varma. Verified via telephonic consent with father.",
    created_at: "2026-09-29T10:00:00Z",
  },
  {
    id: "op-002",
    college_id: MOCK_COLLEGE_ID,
    student_id: "00000000-0000-0000-0000-000000000001",
    pass_code: "CL-HST-PASS-2026-4119",
    destination: "City Central Library, Cyber Towers",
    reason: "Late night hackathon project research with club teammates",
    departure_time: "2026-09-25T18:00:00Z",
    expected_return: "2026-09-25T23:30:00Z",
    actual_return: "2026-09-25T23:15:00Z",
    parent_contact: "+91 94220 12345",
    parent_consent_verified: true,
    status: "returned",
    warden_remarks: "Gate clearance recorded at 23:15 PM.",
    created_at: "2026-09-25T12:00:00Z",
  },
];

// 6. Mock Maintenance Grievances
export const MOCK_HOSTEL_GRIEVANCES: HostelGrievance[] = [
  {
    id: "gr-001",
    college_id: MOCK_COLLEGE_ID,
    student_id: "00000000-0000-0000-0000-000000000001",
    room_id: "hr-101",
    category: "wifi",
    priority: "high",
    title: "LAN port RJ45 connectivity intermittent in Bed A",
    description: "Ethernet connection drops packets periodically every 15 minutes during academic lab sessions.",
    status: "in_progress",
    assigned_to: "Ramesh Sharma (Campus Network Engineer)",
    resolved_at: null,
    created_at: "2026-09-28T14:30:00Z",
  },
  {
    id: "gr-002",
    college_id: MOCK_COLLEGE_ID,
    student_id: "00000000-0000-0000-0000-000000000001",
    room_id: "hr-101",
    category: "plumbing",
    priority: "medium",
    title: "Bathroom mixer tap washer replacement",
    description: "Slight water dripping when faucet is tightened completely.",
    status: "resolved",
    assigned_to: "Kishan Lal (Maintenance Staff)",
    resolved_at: "2026-09-27T16:00:00Z",
    created_at: "2026-09-26T10:15:00Z",
  },
];

// Business Logic Functions

export function generateOutPassCode(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CL-HST-PASS-2026-${randomSuffix}`;
}

export function generateMealPassCode(mealType: MealType): string {
  const prefix = mealType.substring(0, 3).toUpperCase();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CL-HST-MESS-${prefix}-${randomSuffix}`;
}

export function validateOutPassRequest(payload: {
  destination?: string;
  reason?: string;
  departureTime?: string;
  expectedReturn?: string;
  parentContact?: string;
}): { valid: boolean; error?: string } {
  if (!payload.destination || payload.destination.trim().length < 3) {
    return { valid: false, error: "Destination must be at least 3 characters long." };
  }
  if (!payload.reason || payload.reason.trim().length < 5) {
    return { valid: false, error: "Please provide a valid explanation for your out-pass request." };
  }
  if (!payload.departureTime || !payload.expectedReturn) {
    return { valid: false, error: "Departure and expected return timestamps are required." };
  }
  const dep = new Date(payload.departureTime);
  const ret = new Date(payload.expectedReturn);
  if (ret <= dep) {
    return { valid: false, error: "Expected return time must be strictly after the departure time." };
  }
  if (!payload.parentContact || !/^\+?[0-9\s-]{10,15}$/.test(payload.parentContact.trim())) {
    return { valid: false, error: "A valid 10 to 15 digit parent/guardian contact number is mandatory." };
  }
  return { valid: true };
}

export function calculateHostelAnalytics(
  blocks: HostelBlock[] = MOCK_HOSTEL_BLOCKS,
  rooms: HostelRoom[] = MOCK_HOSTEL_ROOMS,
  allocations: HostelAllocation[] = MOCK_HOSTEL_ALLOCATIONS,
  outPasses: HostelOutPass[] = MOCK_OUT_PASSES,
  grievances: HostelGrievance[] = MOCK_HOSTEL_GRIEVANCES
): HostelAnalyticsSummary {
  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);
  const totalOccupied = rooms.reduce((sum, r) => sum + r.occupied_count, 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;
  const activeOutPassesCount = outPasses.filter((op) => op.status === "approved" || op.status === "departed").length;
  const openGrievancesCount = grievances.filter((g) => g.status !== "resolved").length;

  const blockStats = blocks.map((b) => {
    const blockRooms = rooms.filter((r) => r.block_id === b.id);
    const capacity = blockRooms.reduce((sum, r) => sum + r.capacity, 0);
    const occupied = blockRooms.reduce((sum, r) => sum + r.occupied_count, 0);
    return {
      name: b.name,
      occupancy: occupied,
      total: capacity || b.total_rooms * 2,
    };
  });

  return {
    totalCapacity: totalCapacity || 280,
    totalOccupied: totalOccupied || 264,
    occupancyRate: occupancyRate || 94,
    activeOutPassesCount,
    openGrievancesCount,
    blocks: blockStats,
  };
}

export function getStudentHostelOverview(
  studentId: string = "00000000-0000-0000-0000-000000000001",
  allocations: HostelAllocation[] = MOCK_HOSTEL_ALLOCATIONS,
  outPasses: HostelOutPass[] = MOCK_OUT_PASSES,
  grievances: HostelGrievance[] = MOCK_HOSTEL_GRIEVANCES,
  messMenus: HostelMessMenu[] = MOCK_MESS_MENUS
): StudentHostelOverview {
  const studentAlloc = allocations.find((a) => a.student_id === studentId && a.status === "active") || null;
  const activeOutPass = outPasses.find((op) => op.student_id === studentId && (op.status === "approved" || op.status === "pending")) || null;
  const pendingGrievances = grievances.filter((g) => g.student_id === studentId && g.status !== "resolved").length;

  return {
    isHostelite: !!studentAlloc,
    allocation: studentAlloc,
    activeOutPass,
    pendingGrievancesCount: pendingGrievances,
    todaysMeals: messMenus.filter((m) => m.day_of_week === "monday"),
  };
}
