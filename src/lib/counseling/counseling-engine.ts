// CampusLens AI — Phase 41: Smart Campus Mental Health, Psychological Counseling & Peer Support Sanctuary
// src/lib/counseling/counseling-engine.ts

import {
  CounselingSession,
  PeerSupportCircle,
  MoodCheckin,
  CrisisHelpline,
  CounselingOverviewStats,
} from "@/types";

export function generateSessionCode(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CL-WELL-2026-${rand}`;
}

export function generateCounselingPassToken(): string {
  const hex = Math.floor(0x100000 + Math.random() * 0xefffff)
    .toString(16)
    .toUpperCase();
  return `TOKEN_0x${hex}_WELLNESS_CIPHER`;
}

export const MOCK_COUNSELING_SESSIONS: CounselingSession[] = [
  {
    id: "cs-1",
    college_id: "c0000000-0000-0000-0000-000000000001",
    session_code: "CL-WELL-2026-3819",
    scholar_id: "SCH-CS-2023-019",
    scholar_name: "Aarav Sharma",
    counselor_name: "Dr. Ananya Sen, Ph.D.",
    counselor_specialization: "Clinical Psychologist & Cognitive Behavioral Therapy (CBT)",
    session_type: "One-on-One Tele-Therapy",
    scheduled_date: "2026-10-08",
    scheduled_time_slot: "14:00 - 15:00",
    mode: "Confidential Video Call",
    status: "Confirmed",
    confidential_notes_encrypted: true,
    access_pass_token: "TOKEN_0x7A4C19_WELLNESS_CIPHER",
    created_at: "2026-10-04T09:00:00Z",
  },
  {
    id: "cs-2",
    college_id: "c0000000-0000-0000-0000-000000000001",
    session_code: "CL-WELL-2026-9204",
    scholar_id: "SCH-CS-2023-019",
    scholar_name: "Aarav Sharma",
    counselor_name: "Prof. Rajesh Kulkarni, M.Phil.",
    counselor_specialization: "Academic Anxiety, Imposter Syndrome & Peak Performance",
    session_type: "In-Person Clinic Visit",
    scheduled_date: "2026-10-12",
    scheduled_time_slot: "16:30 - 17:30",
    mode: "Infirmary Wellness Suite",
    status: "Confirmed",
    confidential_notes_encrypted: true,
    access_pass_token: "TOKEN_0x9B1F22_WELLNESS_CIPHER",
    created_at: "2026-10-05T11:30:00Z",
  },
  {
    id: "cs-3",
    college_id: "c0000000-0000-0000-0000-000000000001",
    session_code: "CL-WELL-2026-1185",
    scholar_id: "SCH-EC-2024-042",
    scholar_name: "Meera Nair",
    counselor_name: "Dr. Shalini Deshmukh, MD",
    counselor_specialization: "Psychiatry & Holistic Sleep Wellness",
    session_type: "Stress & Academic Anxiety",
    scheduled_date: "2026-10-03",
    scheduled_time_slot: "11:00 - 12:00",
    mode: "Confidential Video Call",
    status: "Completed",
    confidential_notes_encrypted: true,
    access_pass_token: "TOKEN_0x4F882C_WELLNESS_CIPHER",
    created_at: "2026-09-30T14:20:00Z",
  },
];

export const MOCK_PEER_CIRCLES: PeerSupportCircle[] = [
  {
    id: "pc-1",
    college_id: "c0000000-0000-0000-0000-000000000001",
    circle_name: "Mid-Term Academic Burnout & Time Decompression",
    theme: "Exam Stress & Burnout",
    facilitator_name: "Aakash Mehta (Peer Mentor - Final Year)",
    schedule_info: "Every Tuesday • 18:00 - 19:30 IST",
    meeting_venue: "Central Library Quiet Amphitheater (Room 204)",
    max_participants: 15,
    enrolled_count: 11,
    is_anonymous: true,
    status: "Open for Joining",
    created_at: "2026-09-01T00:00:00Z",
  },
  {
    id: "pc-2",
    college_id: "c0000000-0000-0000-0000-000000000001",
    circle_name: "Tech Career Dread & Overcoming Imposter Syndrome",
    theme: "Imposter Syndrome & Tech Pressure",
    facilitator_name: "Pooja Hegde (Senior Scholar - AI Guild)",
    schedule_info: "Every Thursday • 19:00 - 20:30 IST",
    meeting_venue: "Aryabhata Tech Commons Studio",
    max_participants: 12,
    enrolled_count: 12,
    is_anonymous: true,
    status: "Full Capacity",
    created_at: "2026-09-05T00:00:00Z",
  },
  {
    id: "pc-3",
    college_id: "c0000000-0000-0000-0000-000000000001",
    circle_name: "Hostel Transitions & First-Year Adaptation Circle",
    theme: "Hostel Homesickness & Transition",
    facilitator_name: "Rohan Varma (Campus Life Fellow)",
    schedule_info: "Every Saturday • 17:00 - 18:30 IST",
    meeting_venue: "Kalam Hall Courtyard Pavilion",
    max_participants: 20,
    enrolled_count: 14,
    is_anonymous: true,
    status: "Open for Joining",
    created_at: "2026-09-12T00:00:00Z",
  },
  {
    id: "pc-4",
    college_id: "c0000000-0000-0000-0000-000000000001",
    circle_name: "Sound Sleep, Circadian Rhythm & Mindfulness Laboratory",
    theme: "Mindfulness & Sleep Hygiene",
    facilitator_name: "Dr. Ananya Sen (Faculty Advisor)",
    schedule_info: "Every Sunday • 08:30 - 09:45 IST",
    meeting_venue: "Sports Complex Yoga & Meditation Suite",
    max_participants: 25,
    enrolled_count: 18,
    is_anonymous: false,
    status: "Open for Joining",
    created_at: "2026-09-18T00:00:00Z",
  },
];

export const MOCK_MOOD_CHECKINS: MoodCheckin[] = [
  {
    id: "mc-1",
    college_id: "c0000000-0000-0000-0000-000000000001",
    scholar_id: "SCH-CS-2023-019",
    mood_score: 4,
    mood_tag: "Calm",
    sleep_hours: 7.5,
    stress_factors: ["Coding Assignments", "Project Milestone"],
    coping_exercise: "10-minute Box Breathing & Evening Green Campus Walk",
    created_at: "2026-10-06T08:00:00Z",
  },
  {
    id: "mc-2",
    college_id: "c0000000-0000-0000-0000-000000000001",
    scholar_id: "SCH-CS-2023-019",
    mood_score: 3,
    mood_tag: "Overwhelmed",
    sleep_hours: 6.0,
    stress_factors: ["Mid-Semester Exam Prep", "Late Night Study"],
    coping_exercise: "Progressive Muscle Relaxation (PMR)",
    created_at: "2026-10-05T08:30:00Z",
  },
  {
    id: "mc-3",
    college_id: "c0000000-0000-0000-0000-000000000001",
    scholar_id: "SCH-CS-2023-019",
    mood_score: 5,
    mood_tag: "Great",
    sleep_hours: 8.0,
    stress_factors: ["None"],
    coping_exercise: "Gratitude Journaling & Group Sports Session",
    created_at: "2026-10-04T07:45:00Z",
  },
];

export const MOCK_CRISIS_HELPLINES: CrisisHelpline[] = [
  {
    id: "hl-1",
    college_id: "c0000000-0000-0000-0000-000000000001",
    service_name: "Apex 24x7 Campus Crisis & Distress Rapid Response",
    phone_number: "+91 (080) 4190-8888",
    availability: "24x7 Emergency",
    coverage_scope: "Immediate on-campus counselor & proctorial wellness response (3-min ETA)",
    is_toll_free: true,
    created_at: "2026-09-01T00:00:00Z",
  },
  {
    id: "hl-2",
    college_id: "c0000000-0000-0000-0000-000000000001",
    service_name: "Tele-MANAS (National Mental Health Programme - Govt of India)",
    phone_number: "14416 / 1800-891-4416",
    availability: "24x7 Toll-Free",
    coverage_scope: "Multi-lingual round-the-clock professional psychological crisis intervention",
    is_toll_free: true,
    created_at: "2026-09-01T00:00:00Z",
  },
  {
    id: "hl-3",
    college_id: "c0000000-0000-0000-0000-000000000001",
    service_name: "Vandrevala Foundation Mental Health Lifeline",
    phone_number: "+91 9999 666 555",
    availability: "24 Hours Daily",
    coverage_scope: "Specialized student counseling, panic attack grounding & emotional support",
    is_toll_free: false,
    created_at: "2026-09-01T00:00:00Z",
  },
  {
    id: "hl-4",
    college_id: "c0000000-0000-0000-0000-000000000001",
    service_name: "KIRAN National Mental Health Rehabilitation Helpline",
    phone_number: "1800-599-0019",
    availability: "24x7 Emergency",
    coverage_scope: "Depression, suicidal ideation prevention, anxiety & psychological first aid",
    is_toll_free: true,
    created_at: "2026-09-01T00:00:00Z",
  },
];

export function calculateCounselingOverview(
  sessions: CounselingSession[] = MOCK_COUNSELING_SESSIONS,
  circles: PeerSupportCircle[] = MOCK_PEER_CIRCLES,
  moodCheckins: MoodCheckin[] = MOCK_MOOD_CHECKINS,
  helplines: CrisisHelpline[] = MOCK_CRISIS_HELPLINES
): CounselingOverviewStats {
  const totalConfirmedSessions = sessions.filter(
    (s) => s.status === "Confirmed" || s.status === "In Session"
  ).length;

  const activePeerCirclesCount = circles.filter(
    (c) => c.status === "Open for Joining" || c.status === "Session in Progress"
  ).length;

  const moodSum = moodCheckins.reduce((acc, cur) => acc + cur.mood_score, 0);
  const todayMoodAverage =
    moodCheckins.length > 0 ? Number((moodSum / moodCheckins.length).toFixed(1)) : 4.0;

  return {
    totalConfirmedSessions,
    activePeerCirclesCount,
    todayMoodAverage,
    emergencyHelplinesCount: helplines.length,
    sessions,
    circles,
    moodCheckins,
    helplines,
  };
}
