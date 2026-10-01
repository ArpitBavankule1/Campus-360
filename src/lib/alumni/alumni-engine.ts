// ================================================================
// CampusLens AI — Phase 26: Alumni Network & Mentorship Engine
// Business logic, pass generation, overview calculations, and seed datasets
// ================================================================

import {
  AlumniProfile,
  AlumniMentorshipSession,
  AlumniJobReferral,
  AlumniDonation,
  AlumniDigitalPass,
  AlumniOverviewStats,
} from "@/types";

export function generateAlumniPassCode(year: number = 2026): string {
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CL-ALUM-PASS-${year}-${randomSuffix}`;
}

export function generateDonationReceiptCode(campaign: string = "GIVE"): string {
  const codePrefix = campaign.substring(0, 4).toUpperCase();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CL-${codePrefix}-2026-${randomSuffix}`;
}

export function generateReferralCode(company: string = "CAMPUS"): string {
  const prefix = company.replace(/[^A-Za-z]/g, "").substring(0, 4).toUpperCase() || "CAMP";
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `REF-${prefix}-${randomSuffix}`;
}

export function calculateAlumniOverview(
  alumni: AlumniProfile[] = MOCK_ALUMNI,
  mentorships: AlumniMentorshipSession[] = MOCK_MENTORSHIPS,
  referrals: AlumniJobReferral[] = MOCK_JOB_REFERRALS,
  donations: AlumniDonation[] = MOCK_DONATIONS
): AlumniOverviewStats {
  const totalAlumni = alumni.length;
  const activeMentors = alumni.filter((a) => a.mentorship_available).length;
  const activeReferrals = referrals.filter((r) => r.is_active).length;
  const totalDonationsRaised = donations
    .filter((d) => d.pledge_status === "completed")
    .reduce((sum, d) => sum + Number(d.amount), 0);

  return {
    totalAlumni,
    activeMentors,
    activeReferrals,
    totalDonationsRaised,
    featuredAlumni: alumni.slice(0, 4),
    upcomingSessions: mentorships.filter((m) => m.status === "scheduled" || m.status === "confirmed"),
    latestReferrals: referrals.filter((r) => r.is_active).slice(0, 4),
  };
}

export const MOCK_ALUMNI: AlumniProfile[] = [
  {
    id: "alm-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    full_name: "Dr. Ananya Sharma",
    email: "ananya.sharma@alum.campuslens.edu",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    graduating_year: 2018,
    department: "Computer Science & Engineering",
    degree: "B.Tech & M.S.",
    current_role: "Staff Machine Learning Engineer",
    company: "Google DeepMind",
    industry: "Artificial Intelligence",
    location: "London, United Kingdom",
    bio: "Passionate about LLM reasoning, neural transformers, and mentoring scholars entering deep tech and PhD programs.",
    linkedin_url: "https://linkedin.com/in/ananya-sharma-deepmind",
    mentorship_available: true,
    willing_to_refer: true,
    created_at: "2026-01-15T08:00:00Z",
  },
  {
    id: "alm-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    full_name: "Vikramaditya Verma",
    email: "vikram.verma@alum.campuslens.edu",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    graduating_year: 2015,
    department: "Electronics & Communication",
    degree: "B.Tech",
    current_role: "VP of Semiconductor Architecture",
    company: "NVIDIA",
    industry: "Hardware & Semiconductors",
    location: "Santa Clara, California",
    bio: "11+ years leading GPU accelerator silicon design. Excited to guide students on VLSI design and silicon startups.",
    linkedin_url: "https://linkedin.com/in/vikram-verma-nvidia",
    mentorship_available: true,
    willing_to_refer: true,
    created_at: "2026-02-10T10:00:00Z",
  },
  {
    id: "alm-33333333-3333-4111-8111-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    full_name: "Sneha Mukherjee",
    email: "sneha.m@alum.campuslens.edu",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    graduating_year: 2020,
    department: "Information Technology",
    degree: "B.Tech",
    current_role: "Lead Product Designer",
    company: "Stripe",
    industry: "Fintech & Design",
    location: "Bengaluru, India",
    bio: "Obsessed with micro-interactions, accessibility, and high-conversion UX design. Happy to review UX portfolios.",
    linkedin_url: "https://linkedin.com/in/sneha-mukherjee-stripe",
    mentorship_available: true,
    willing_to_refer: true,
    created_at: "2026-03-05T09:30:00Z",
  },
  {
    id: "alm-44444444-4444-4111-8111-444444444444",
    college_id: "c1111111-1111-4111-8111-111111111111",
    full_name: "Rohan Singhania",
    email: "rohan.s@alum.campuslens.edu",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    graduating_year: 2012,
    department: "Mechanical Engineering",
    degree: "B.Tech & MBA (IIM-A)",
    current_role: "Co-Founder & CEO",
    company: "VoltDrive Robotics",
    industry: "CleanTech & Robotics",
    location: "Pune, India",
    bio: "Built an autonomous warehousing robotics venture. Keen to mentor student entrepreneurs and provide angel seed capital.",
    linkedin_url: "https://linkedin.com/in/rohan-singhania-voltdrive",
    mentorship_available: true,
    willing_to_refer: false,
    created_at: "2026-04-12T14:00:00Z",
  }
];

export const MOCK_MENTORSHIPS: AlumniMentorshipSession[] = [
  {
    id: "ses-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    alumni_id: "alm-11111111-1111-4111-8111-111111111111",
    student_id: "usr-student-001",
    student_name: "Arpit Bavankule",
    student_email: "arpit.student@campuslens.edu",
    topic: "resume_review",
    session_type: "virtual",
    scheduled_at: "2026-10-05T15:30:00Z",
    duration_minutes: 45,
    meeting_url: "https://meet.google.com/xyz-alum-demo",
    notes: "Deep dive into research CV targeting top-tier AI labs and internships.",
    status: "confirmed",
    created_at: "2026-09-28T10:00:00Z",
    alumni: MOCK_ALUMNI[0],
  },
  {
    id: "ses-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    alumni_id: "alm-33333333-3333-4111-8111-333333333333",
    student_id: "usr-student-002",
    student_name: "Priya Nair",
    student_email: "priya.nair@campuslens.edu",
    topic: "career_guidance",
    session_type: "virtual",
    scheduled_at: "2026-10-08T18:00:00Z",
    duration_minutes: 45,
    meeting_url: "https://meet.google.com/str-ux-guide",
    notes: "Transitioning from software engineering to product design in global fintech.",
    status: "scheduled",
    created_at: "2026-09-29T11:20:00Z",
    alumni: MOCK_ALUMNI[2],
  }
];

export const MOCK_JOB_REFERRALS: AlumniJobReferral[] = [
  {
    id: "ref-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    alumni_id: "alm-11111111-1111-4111-8111-111111111111",
    alumni_name: "Dr. Ananya Sharma",
    company: "Google DeepMind",
    role_title: "Research Software Engineer — Gemini Core",
    job_type: "full_time",
    experience_level: "entry_level",
    location: "London / Bengaluru (Hybrid)",
    salary_range: "₹38,00,000 - ₹52,00,000 + Equity",
    application_deadline: "2026-10-31T23:59:59Z",
    referral_code: "REF-GOOG-9182",
    apply_url: "https://careers.google.com",
    description: "Looking for strong algorithmic foundation, C++/Python expertise, and distributed model training experience.",
    is_active: true,
    created_at: "2026-09-25T12:00:00Z",
  },
  {
    id: "ref-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    alumni_id: "alm-33333333-3333-4111-8111-333333333333",
    alumni_name: "Sneha Mukherjee",
    company: "Stripe",
    role_title: "Product Design Fellow (New Grad 2026)",
    job_type: "full_time",
    experience_level: "entry_level",
    location: "Bengaluru, India",
    salary_range: "₹24,00,000 - ₹32,00,000 + RSUs",
    application_deadline: "2026-11-15T23:59:59Z",
    referral_code: "REF-STRP-4712",
    apply_url: "https://stripe.com/jobs",
    description: "Craft world-class financial interfaces, design systems, and seamless checkout flows across 140+ countries.",
    is_active: true,
    created_at: "2026-09-27T14:30:00Z",
  },
  {
    id: "ref-33333333-3333-4111-8111-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    alumni_id: "alm-22222222-2222-4111-8111-222222222222",
    alumni_name: "Vikramaditya Verma",
    company: "NVIDIA",
    role_title: "ASIC & Silicon Verification Engineer Intern",
    job_type: "internship",
    experience_level: "intern",
    location: "Pune / Hyderabad",
    salary_range: "₹90,000 / month Stipend",
    application_deadline: "2026-10-25T23:59:59Z",
    referral_code: "REF-NVDA-8821",
    apply_url: "https://nvidia.wd5.myworkdayjobs.com",
    description: "Pre-silicon functional verification using SystemVerilog and UVM for next-generation Blackwell & Rubin architectures.",
    is_active: true,
    created_at: "2026-09-29T16:00:00Z",
  }
];

export const MOCK_DONATIONS: AlumniDonation[] = [
  {
    id: "don-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    donor_name: "Dr. Ananya Sharma",
    donor_email: "ananya.sharma@alum.campuslens.edu",
    graduating_year: 2018,
    campaign: "stem_scholarship",
    amount: 500000,
    currency: "INR",
    pledge_status: "completed",
    transaction_ref: "TXN-GIVE-2026-08129",
    receipt_code: "CL-STEM-2026-8812",
    is_anonymous: false,
    message: "Supporting meritorious women scholars in computer science and advanced AI research.",
    created_at: "2026-08-15T09:00:00Z",
  },
  {
    id: "don-22222222-2222-4111-8111-222222222222",
    college_id: "c1111111-1111-4111-8111-111111111111",
    donor_name: "Rohan Singhania",
    donor_email: "rohan.s@alum.campuslens.edu",
    graduating_year: 2012,
    campaign: "innovation_lab",
    amount: 1500000,
    currency: "INR",
    pledge_status: "completed",
    transaction_ref: "TXN-GIVE-2026-09141",
    receipt_code: "CL-INNO-2026-4421",
    is_anonymous: false,
    message: "Equipping the collegiate robotics maker lab with 5-axis CNC and high-speed telemetry testing bays.",
    created_at: "2026-09-01T14:30:00Z",
  },
  {
    id: "don-33333333-3333-4111-8111-333333333333",
    college_id: "c1111111-1111-4111-8111-111111111111",
    donor_name: "Anonymous Benefactor (Class of 2010)",
    donor_email: "alum.endowment@campuslens.edu",
    graduating_year: 2010,
    campaign: "hardship_fund",
    amount: 250000,
    currency: "INR",
    pledge_status: "completed",
    transaction_ref: "TXN-GIVE-2026-09943",
    receipt_code: "CL-HARD-2026-1928",
    is_anonymous: true,
    message: "Emergency tuition support fund for scholars facing unexpected medical or financial crises.",
    created_at: "2026-09-20T17:00:00Z",
  }
];

export const MOCK_ALUMNI_PASSES: AlumniDigitalPass[] = [
  {
    id: "pas-11111111-1111-4111-8111-111111111111",
    college_id: "c1111111-1111-4111-8111-111111111111",
    alumni_id: "alm-11111111-1111-4111-8111-111111111111",
    pass_code: "CL-ALUM-PASS-2026-AN82",
    issue_date: "2026-01-15",
    valid_until: "2031-01-15",
    privileges: ["library_access", "guest_house", "gym_access", "campus_entry", "auditorium_privileges"],
    is_active: true,
    created_at: "2026-01-15T08:30:00Z",
    alumni: MOCK_ALUMNI[0],
  }
];
