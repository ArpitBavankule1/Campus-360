// ================================================================
// CampusLens AI — Centralized Data Queries & Mock Fallback Layer
// Provides clean, typed query methods for dashboards and pages.
// Automatically falls back to high-fidelity mock data if Supabase
// credentials are not yet configured in local development.
// ================================================================

import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

export type LocationRow = Database["public"]["Tables"]["locations"]["Row"];
export type FacultyRow = Database["public"]["Tables"]["faculty"]["Row"];
export type TimetableRow = Database["public"]["Tables"]["timetable"]["Row"];
export type NoticeRow = Database["public"]["Tables"]["notices"]["Row"];
export type EventRow = Database["public"]["Tables"]["events"]["Row"];
export type FacilityRow = Database["public"]["Tables"]["facilities"]["Row"];
export type HelpRequestRow = Database["public"]["Tables"]["help_requests"]["Row"];
export type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];
export type DepartmentRow = Database["public"]["Tables"]["departments"]["Row"];

// High-fidelity fallback data for demonstration & offline development
export const MOCK_LOCATIONS: LocationRow[] = [
  {
    id: "c1111111-1111-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    name: "Turing Computer Science Building",
    code: "LOC-CS",
    category: "academic",
    building: "Alan Turing Block (Block A)",
    floor: "3rd Floor",
    room_number: "A-301 to A-320",
    latitude: 12.9715987,
    longitude: 77.5945627,
    description: "Main headquarters for Computer Science & Engineering department, faculty offices, and advanced computing labs.",
    image_url: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80",
    amenities: ["Wi-Fi 6", "Air Conditioned", "Smart Displays", "Elevator Access", "Wheelchair Ramp"],
    is_accessible: true,
    opening_time: "08:00 AM",
    closing_time: "08:00 PM",
    contact_number: "+91 80 2345 6710",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c2222222-2222-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    name: "Central Digital Library & Research Commons",
    code: "LOC-LIB",
    category: "library",
    building: "Vikram Sarabhai Knowledge Hub",
    floor: "Ground to 3rd Floor",
    room_number: "LIB-100",
    latitude: 12.972105,
    longitude: 77.59512,
    description: "Four-storey state-of-the-art library with 150,000+ volumes, IEEE digital subscriptions, and 24/7 quiet study pods.",
    image_url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80",
    amenities: ["High-Speed Wi-Fi", "Silent Study Pods", "RFID Checkout", "Cafe", "Printing & Scanning"],
    is_accessible: true,
    opening_time: "07:30 AM",
    closing_time: "11:00 PM",
    contact_number: "+91 80 2345 6720",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c3333333-3333-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    name: "Apex Innovation & AI Robotics Hub",
    code: "LOC-AI-LAB",
    category: "laboratory",
    building: "Ada Lovelace Block (Block B)",
    floor: "1st Floor",
    room_number: "B-108",
    latitude: 12.97125,
    longitude: 77.5939,
    description: "Advanced AI and Machine Learning research facility equipped with NVIDIA DGX GPU workstations and IoT robotics testbeds.",
    image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80",
    amenities: ["NVIDIA GPUs", "3D Printers", "Oscilloscopes", "VR Testbed"],
    is_accessible: true,
    opening_time: "08:30 AM",
    closing_time: "09:00 PM",
    contact_number: "+91 80 2345 6730",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c4444444-4444-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    name: "Grand Tech Auditorium",
    code: "LOC-AUD",
    category: "auditorium",
    building: "Central Convocation Center",
    floor: "Ground Floor",
    room_number: "AUD-01",
    latitude: 12.9708,
    longitude: 77.5948,
    description: "1,200-seat acoustic auditorium featuring 4K LED video wall and streaming infrastructure for conferences and festivals.",
    image_url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80",
    amenities: ["4K Projection", "Acoustic Walls", "Green Rooms", "Wheelchair Access"],
    is_accessible: true,
    opening_time: "09:00 AM",
    closing_time: "09:00 PM",
    contact_number: "+91 80 2345 6740",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c5555555-5555-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    name: "Student Activity Center & Food Court",
    code: "LOC-CAFE",
    category: "cafeteria",
    building: "Student Plaza (Block D)",
    floor: "Ground & 1st Floor",
    room_number: "SAC-G",
    latitude: 12.9725,
    longitude: 77.5942,
    description: "Dynamic culinary and recreation zone with multi-cuisine counters, barista coffee bar, indoor sports, and lounge seating.",
    image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80",
    amenities: ["Organic Food Stations", "Outdoor Patio", "Charging Stations", "Filtered Water"],
    is_accessible: true,
    opening_time: "07:00 AM",
    closing_time: "10:30 PM",
    contact_number: "+91 80 2345 6750",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c6666666-6666-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    name: "Olympic Sports Complex & Gym",
    code: "LOC-SPORTS",
    category: "sports",
    building: "Chhatrapati Shivaji Sports Pavilion",
    floor: "Ground Level",
    room_number: "SPT-01",
    latitude: 12.9731,
    longitude: 77.5956,
    description: "Full athletics stadium with synthetic 400m running track, Olympic swimming pool, gym, and badminton courts.",
    image_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80",
    amenities: ["Locker Rooms", "Showers", "First Aid Station", "Physiotherapy Center"],
    is_accessible: true,
    opening_time: "06:00 AM",
    closing_time: "09:30 PM",
    contact_number: "+91 80 2345 6760",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const MOCK_NOTICES: NoticeRow[] = [
  {
    id: "f1111111-1111-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    department_id: "a1111111-1111-4111-8111-111111111111",
    title: "Mid-Semester Theory & Practical Examination Schedule Announced",
    content: "The official schedule for the Autumn Semester Mid-Term Examinations is now released. Students must carry their institutional digital ID badge. Hall tickets will be verified at the entrance.",
    priority: "urgent",
    category: "exam",
    author_id: null,
    author_name: "Controller of Examinations",
    published_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    expires_at: null,
    attachments: null,
    is_pinned: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "f2222222-2222-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    department_id: null,
    title: "CampusLens AI Hackathon 2026: Team Registrations Open",
    content: "Join 500+ student developers, designers, and innovators in a 36-hour sprint building real-world AI applications. Cash prizes worth ₹2,50,000 + internship interviews with top tech sponsors.",
    priority: "important",
    category: "event",
    author_id: null,
    author_name: "Apex Innovation Council",
    published_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    expires_at: null,
    attachments: null,
    is_pinned: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "f3333333-3333-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    department_id: null,
    title: "Central Digital Library: Extended 24/7 Hours for Study Weeks",
    content: "Starting this Monday, the Vikram Sarabhai Central Library reading floors will remain open 24 hours daily. Quiet study pods can be booked up to 48 hours in advance through the campus portal.",
    priority: "normal",
    category: "academic",
    author_id: null,
    author_name: "Chief Librarian Desk",
    published_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    expires_at: null,
    attachments: null,
    is_pinned: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "f4444444-4444-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    department_id: "a1111111-1111-4111-8111-111111111111",
    title: "Placement Readiness: Mock Technical & System Design Interviews",
    content: "Department of CSE is hosting dedicated mock technical interviews with alumni working at Google, Amazon, and Microsoft this Saturday. Slot booking is mandatory.",
    priority: "important",
    category: "placement",
    author_id: null,
    author_name: "Department Training & Placement Cell",
    published_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    expires_at: null,
    attachments: null,
    is_pinned: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const MOCK_TIMETABLE: TimetableRow[] = [
  {
    id: "e1111111-1111-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    department_id: "a1111111-1111-4111-8111-111111111111",
    year: 2,
    division: "A",
    day_of_week: "Monday",
    start_time: "09:00 AM",
    end_time: "10:00 AM",
    subject_name: "Data Structures & Algorithms",
    subject_code: "CS-201",
    faculty_id: "d1111111-1111-4111-8111-111111111111",
    faculty_name: "Dr. Rajeshwar Sharma",
    room_number: "A-301 (Turing Lecture Hall)",
    location_id: "c1111111-1111-4111-8111-111111111111",
    type: "lecture",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "e2222222-2222-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    department_id: "a1111111-1111-4111-8111-111111111111",
    year: 2,
    division: "A",
    day_of_week: "Monday",
    start_time: "10:15 AM",
    end_time: "11:15 AM",
    subject_name: "Database Management Systems",
    subject_code: "CS-202",
    faculty_id: "d3333333-3333-4111-8111-111111111111",
    faculty_name: "Dr. Vikramaditya Rao",
    room_number: "A-302 (Seminar Room)",
    location_id: "c1111111-1111-4111-8111-111111111111",
    type: "lecture",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "e3333333-3333-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    department_id: "a1111111-1111-4111-8111-111111111111",
    year: 2,
    division: "A",
    day_of_week: "Monday",
    start_time: "11:30 AM",
    end_time: "01:30 PM",
    subject_name: "Data Structures Practical Lab",
    subject_code: "CS-201L",
    faculty_id: "d1111111-1111-4111-8111-111111111111",
    faculty_name: "Dr. Rajeshwar Sharma",
    room_number: "Lab 4 (Turing 2nd Floor)",
    location_id: "c1111111-1111-4111-8111-111111111111",
    type: "lab",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "e4444444-4444-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    department_id: "a1111111-1111-4111-8111-111111111111",
    year: 2,
    division: "A",
    day_of_week: "Monday",
    start_time: "02:30 PM",
    end_time: "03:30 PM",
    subject_name: "Artificial Intelligence Foundations",
    subject_code: "CS-204",
    faculty_id: "d2222222-2222-4111-8111-111111111111",
    faculty_name: "Prof. Anita Desai",
    room_number: "A-301 (Turing Lecture Hall)",
    location_id: "c1111111-1111-4111-8111-111111111111",
    type: "lecture",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "e5555555-5555-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    department_id: "a1111111-1111-4111-8111-111111111111",
    year: 2,
    division: "A",
    day_of_week: "Tuesday",
    start_time: "09:00 AM",
    end_time: "10:00 AM",
    subject_name: "Operating Systems & Kernel Architecture",
    subject_code: "CS-203",
    faculty_id: "d3333333-3333-4111-8111-111111111111",
    faculty_name: "Dr. Vikramaditya Rao",
    room_number: "A-301 (Turing Lecture Hall)",
    location_id: "c1111111-1111-4111-8111-111111111111",
    type: "lecture",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "e6666666-6666-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    department_id: "a1111111-1111-4111-8111-111111111111",
    year: 2,
    division: "A",
    day_of_week: "Wednesday",
    start_time: "09:00 AM",
    end_time: "11:00 AM",
    subject_name: "Database Systems Lab & SQL Workshop",
    subject_code: "CS-202L",
    faculty_id: "d3333333-3333-4111-8111-111111111111",
    faculty_name: "Dr. Vikramaditya Rao",
    room_number: "Lab 2 (Turing 2nd Floor)",
    location_id: "c1111111-1111-4111-8111-111111111111",
    type: "lab",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const MOCK_EVENTS: EventRow[] = [
  {
    id: "1a111111-1111-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    department_id: "a1111111-1111-4111-8111-111111111111",
    title: "Apex AI & Cloud Summit 2026",
    description: "Keynote addresses by AI researchers from Google, Microsoft, and premier startups. Live demonstrations on autonomous robotics, multimodal LLMs, and quantum computing.",
    category: "tech",
    start_date: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString(),
    end_date: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
    location_id: "c4444444-4444-4111-8111-111111111111",
    venue_name: "Grand Tech Auditorium (AUD-01)",
    organizer: "Computer Science Dept & IEEE Student Branch",
    registration_link: "https://demo-apex.edu/ai-summit-2026",
    image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "1a222222-2222-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    department_id: null,
    title: "Inter-College Sports Championship 2026",
    description: "Athletics, football, basketball, and badminton tournaments featuring over 24 competing regional institutions. Opening ceremony starts at 08:30 AM.",
    category: "sports",
    start_date: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(),
    end_date: new Date(Date.now() + 12 * 24 * 3600 * 1000).toISOString(),
    location_id: "c6666666-6666-4111-8111-111111111111",
    venue_name: "Shivaji Sports Arena & Stadium",
    organizer: "Apex Sports Council",
    registration_link: "https://demo-apex.edu/sports-2026",
    image_url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80",
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "1a333333-3333-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    department_id: null,
    title: "Annual Cultural Fest: 'Aura 2026'",
    description: "Three days of music bands, battle of dance groups, theatre plays, and live concerts featuring celebrity artists.",
    category: "cultural",
    start_date: new Date(Date.now() + 18 * 24 * 3600 * 1000).toISOString(),
    end_date: new Date(Date.now() + 20 * 24 * 3600 * 1000).toISOString(),
    location_id: "c4444444-4444-4111-8111-111111111111",
    venue_name: "Amphitheatre & Main Lawns",
    organizer: "Student Cultural Society",
    registration_link: "https://demo-apex.edu/aura-2026",
    image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const MOCK_FACULTY: FacultyRow[] = [
  {
    id: "d1111111-1111-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    department_id: "a1111111-1111-4111-8111-111111111111",
    profile_id: null,
    name: "Dr. Rajeshwar Sharma",
    designation: "Professor & Head of Department",
    email: "r.sharma@demo-apex.edu",
    phone: "+91 80 2345 6701",
    office_room: "A-301, Turing Block",
    bio: "20+ years of academia and industry research in Distributed Algorithms, Cloud Systems, and Database Optimizations.",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    qualifications: "Ph.D. in Computer Science (IISc Bengaluru)",
    specializations: ["Distributed Systems", "Cloud Computing", "Database Architecture"],
    office_hours: "Mon & Wed: 02:00 PM - 04:00 PM",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "d2222222-2222-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    department_id: "a1111111-1111-4111-8111-111111111111",
    profile_id: null,
    name: "Prof. Anita Desai",
    designation: "Associate Professor",
    email: "anita.desai@demo-apex.edu",
    phone: "+91 80 2345 6702",
    office_room: "A-308, Turing Block",
    bio: "Leading the Artificial Intelligence & NLP laboratory. Author of 35+ peer-reviewed papers on deep neural networks.",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    qualifications: "M.Tech (IIT Bombay), Ph.D. (Pursuing)",
    specializations: ["Machine Learning", "Computer Vision", "Deep Learning", "Python"],
    office_hours: "Tue & Thu: 11:00 AM - 01:00 PM",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "d3333333-3333-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    department_id: "a1111111-1111-4111-8111-111111111111",
    profile_id: null,
    name: "Dr. Vikramaditya Rao",
    designation: "Assistant Professor",
    email: "v.rao@demo-apex.edu",
    phone: "+91 80 2345 6703",
    office_room: "A-312, Turing Block",
    bio: "Specialist in Cyber-Physical Systems, Operating Systems Kernel architecture, and modern secure network protocols.",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    qualifications: "Ph.D. in Computer Engineering (IIT Madras)",
    specializations: ["Operating Systems", "Cybersecurity", "Networks", "Rust/C++"],
    office_hours: "Wed & Fri: 03:00 PM - 05:00 PM",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const MOCK_NOTIFICATIONS: NotificationRow[] = [
  {
    id: "n1111111-1111-4111-8111-111111111111",
    user_id: "mock-user",
    college_id: "11111111-1111-4111-8111-111111111111",
    title: "Mid-Term Exam Schedule Published",
    message: "Check your department exam schedule and hall seating.",
    type: "notice",
    link: "/notices",
    is_read: false,
    created_at: new Date(Date.now() - 3600 * 1000).toISOString(),
  },
  {
    id: "n2222222-2222-4111-8111-111111111111",
    user_id: "mock-user",
    college_id: "11111111-1111-4111-8111-111111111111",
    title: "Hackathon Registration Confirmed",
    message: "Your team slot for CampusLens Hackathon 2026 is reserved.",
    type: "event",
    link: "/events",
    is_read: false,
    created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: "n3333333-3333-4111-8111-111111111111",
    user_id: "mock-user",
    college_id: "11111111-1111-4111-8111-111111111111",
    title: "Class Venue Update",
    message: "Database Systems Lab shifted to Turing 2nd Floor Lab 2.",
    type: "timetable",
    link: "/timetable",
    is_read: true,
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
];

// -----------------------------------------------------------------
// Query Functions with Graceful DB Fallback
// -----------------------------------------------------------------

/**
 * Fetch Student Dashboard Data
 */
export async function getStudentDashboardData(params: {
  collegeId?: string;
  departmentId?: string;
  year?: number | null;
  division?: string | null;
}) {
  const supabase = createClient();
  const currentDay = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());

  try {
    // Try fetching live timetable
    let classes: TimetableRow[] = [];
    const timetableQuery = supabase
      .from("timetable")
      .select("*")
      .order("start_time", { ascending: true });

    if (params.collegeId) timetableQuery.eq("college_id", params.collegeId);
    if (params.departmentId) timetableQuery.eq("department_id", params.departmentId);

    const { data: dbClasses, error: ttError } = await timetableQuery;

    if (!ttError && dbClasses && dbClasses.length > 0) {
      // Filter for current day or default to Monday for demo
      const todayClasses = dbClasses.filter(c => c.day_of_week.toLowerCase() === currentDay.toLowerCase());
      classes = todayClasses.length > 0 ? todayClasses : dbClasses.filter(c => c.day_of_week === "Monday");
    } else {
      // Mock Fallback
      classes = MOCK_TIMETABLE.filter(c => c.day_of_week === "Monday");
    }

    // Try fetching live notices
    let notices: NoticeRow[] = [];
    const { data: dbNotices, error: nError } = await supabase
      .from("notices")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(4);

    if (!nError && dbNotices && dbNotices.length > 0) {
      notices = dbNotices;
    } else {
      notices = MOCK_NOTICES;
    }

    // Try fetching live events
    let events: EventRow[] = [];
    const { data: dbEvents, error: eError } = await supabase
      .from("events")
      .select("*")
      .order("start_date", { ascending: true })
      .limit(3);

    if (!eError && dbEvents && dbEvents.length > 0) {
      events = dbEvents;
    } else {
      events = MOCK_EVENTS;
    }

    // Try fetching campus locations
    let locations: LocationRow[] = [];
    const { data: dbLocations, error: lError } = await supabase
      .from("locations")
      .select("*")
      .limit(6);

    if (!lError && dbLocations && dbLocations.length > 0) {
      locations = dbLocations;
    } else {
      locations = MOCK_LOCATIONS;
    }

    return {
      classes,
      notices,
      events,
      locations,
      currentDay,
      unreadNotificationsCount: 2,
    };
  } catch {
    // If Supabase connection is in mock/placeholder mode
    return {
      classes: MOCK_TIMETABLE.filter(c => c.day_of_week === "Monday"),
      notices: MOCK_NOTICES,
      events: MOCK_EVENTS,
      locations: MOCK_LOCATIONS,
      currentDay,
      unreadNotificationsCount: 2,
    };
  }
}

/**
 * Fetch Campus Locations
 */
export async function getCampusLocations(category?: string) {
  const supabase = createClient();
  try {
    let query = supabase.from("locations").select("*").order("name", { ascending: true });
    if (category && category !== "all") {
      query = query.eq("category", category as any);
    }
    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch {
    // fallback
  }

  if (category && category !== "all") {
    return MOCK_LOCATIONS.filter(l => l.category === category);
  }
  return MOCK_LOCATIONS;
}

/**
 * Fetch Faculty Directory
 */
export async function getFacultyDirectory(departmentId?: string) {
  const supabase = createClient();
  try {
    let query = supabase.from("faculty").select("*").order("name", { ascending: true });
    if (departmentId) {
      query = query.eq("department_id", departmentId);
    }
    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch {
    // fallback
  }
  return MOCK_FACULTY;
}

/**
 * Fetch User Notifications
 */
export async function getUserNotifications(userId?: string) {
  const supabase = createClient();
  if (userId) {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // fallback
    }
  }
  return MOCK_NOTIFICATIONS;
}

/**
 * Fetch Location By ID
 */
export async function getLocationById(id: string): Promise<LocationRow | null> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      return data;
    }
  } catch {
    // fallback
  }

  const found = MOCK_LOCATIONS.find((loc) => loc.id === id);
  return found || null;
}

/**
 * Update Profile Information
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Database["public"]["Tables"]["profiles"]["Update"]>
) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update profile" };
  }
}

export const MOCK_DEPARTMENTS: DepartmentRow[] = [
  {
    id: "a1111111-1111-4111-8111-111111111111",
    college_id: "11111111-1111-4111-8111-111111111111",
    name: "Computer Science & Engineering",
    code: "CSE",
    description: "Pioneering research in artificial intelligence, distributed systems, algorithms, and cybersecurity.",
    building: "Alan Turing Block (Block A)",
    room_number: "A-301",
    contact_email: "cse@demo-apex.edu",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "a2222222-2222-4222-8222-222222222222",
    college_id: "11111111-1111-4111-8111-111111111111",
    name: "Information Technology",
    code: "IT",
    description: "Focusing on enterprise cloud architecture, mobile app engineering, devops, and full-stack software.",
    building: "Ada Lovelace Block (Block B)",
    room_number: "B-205",
    contact_email: "it@demo-apex.edu",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "a3333333-3333-4333-8333-333333333333",
    college_id: "11111111-1111-4111-8111-111111111111",
    name: "Electronics & Telecommunication",
    code: "ECE",
    description: "Specialized in VLSI circuit design, embedded microcontrollers, IoT hardware, and signal processing.",
    building: "Claude Shannon Hall (Block C)",
    room_number: "C-102",
    contact_email: "ece@demo-apex.edu",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "a4444444-4444-4444-8444-444444444444",
    college_id: "11111111-1111-4111-8111-111111111111",
    name: "Mechanical Engineering & Robotics",
    code: "MECH",
    description: "Autonomous robotics, thermodynamics, additive manufacturing, CAD/CAM, and automotive mechanics.",
    building: "Newton Engineering Wing (Block E)",
    room_number: "N-101",
    contact_email: "mech@demo-apex.edu",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/**
 * Fetch Department Directory
 */
export async function getDepartments(): Promise<DepartmentRow[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("departments")
      .select("*")
      .order("name", { ascending: true });
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch {
    // fallback
  }
  return MOCK_DEPARTMENTS;
}

/**
 * Fetch Timetable with Filters
 */
export async function getTimetableList(params?: {
  day?: string;
  year?: number;
  division?: string;
  departmentId?: string;
}): Promise<TimetableRow[]> {
  const supabase = createClient();
  try {
    let query = supabase.from("timetable").select("*").order("start_time", { ascending: true });

    if (params?.day && params.day !== "all") query = query.eq("day_of_week", params.day);
    if (params?.year) query = query.eq("year", params.year);
    if (params?.division && params.division !== "all") query = query.eq("division", params.division);
    if (params?.departmentId) query = query.eq("department_id", params.departmentId);

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch {
    // fallback
  }

  let list = MOCK_TIMETABLE;
  if (params?.day && params.day !== "all") {
    list = list.filter((t) => t.day_of_week.toLowerCase() === params.day!.toLowerCase());
  }
  if (params?.year) {
    list = list.filter((t) => t.year === params.year);
  }
  if (params?.division && params.division !== "all") {
    list = list.filter((t) => t.division.toUpperCase() === params.division!.toUpperCase());
  }
  return list;
}

/**
 * Fetch Notices with Filters
 */
export async function getNoticesList(params?: {
  category?: string;
  priority?: string;
  search?: string;
}): Promise<NoticeRow[]> {
  const supabase = createClient();
  try {
    let query = supabase.from("notices").select("*").order("published_at", { ascending: false });

    if (params?.category && params.category !== "all") query = query.eq("category", params.category as any);
    if (params?.priority && params.priority !== "all") query = query.eq("priority", params.priority as any);

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch {
    // fallback
  }

  let list = MOCK_NOTICES;
  if (params?.category && params.category !== "all") {
    list = list.filter((n) => n.category === params.category);
  }
  if (params?.priority && params.priority !== "all") {
    list = list.filter((n) => n.priority === params.priority);
  }
  if (params?.search && params.search.trim()) {
    const q = params.search.toLowerCase();
    list = list.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
  }
  return list;
}

/**
 * Fetch Events with Filters
 */
export async function getEventsList(params?: {
  category?: string;
  search?: string;
}): Promise<EventRow[]> {
  const supabase = createClient();
  try {
    let query = supabase.from("events").select("*").order("start_date", { ascending: true });

    if (params?.category && params.category !== "all") query = query.eq("category", params.category as any);

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch {
    // fallback
  }

  let list = MOCK_EVENTS;
  if (params?.category && params.category !== "all") {
    list = list.filter((e) => e.category === params.category);
  }
  if (params?.search && params.search.trim()) {
    const q = params.search.toLowerCase();
    list = list.filter((e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
  }
  return list;
}


