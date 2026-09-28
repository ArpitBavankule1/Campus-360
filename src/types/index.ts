// ===========================================
// CampusLens AI — TypeScript Type Definitions
// ===========================================

// --- Database Entity Types ---

export type UserRole = "student" | "faculty" | "hod" | "admin";

export type NoticePriority = "normal" | "important" | "urgent";

export type HelpRequestStatus =
  | "submitted"
  | "under_review"
  | "in_progress"
  | "resolved";

export type HelpRequestCategory =
  | "academic_query"
  | "technical_issue"
  | "campus_facility"
  | "general_question"
  | "complaint";

export type NotificationType =
  | "notice"
  | "event"
  | "schedule_change"
  | "query_update"
  | "announcement";

export type LocationCategory =
  | "department"
  | "classroom"
  | "laboratory"
  | "library"
  | "auditorium"
  | "cafeteria"
  | "sports"
  | "parking"
  | "administrative"
  | "medical"
  | "hostel"
  | "computer_center"
  | "other";

// --- Core Models ---

export interface College {
  id: string;
  name: string;
  code: string;
  description: string | null;
  logo_url: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  college_id: string;
  full_name: string;
  email: string;
  student_id: string | null;
  department_id: string | null;
  year: number | null;
  division: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface Department {
  id: string;
  college_id: string;
  name: string;
  code: string;
  description: string | null;
  hod_id: string | null;
  building: string | null;
  room_number: string | null;
  contact_email: string | null;
  created_at: string;
}

export interface Faculty {
  id: string;
  college_id: string;
  department_id: string;
  name: string;
  email: string;
  designation: string | null;
  room_number: string | null;
  subjects: string[] | null;
  photo_url: string | null;
  created_at: string;
}

export interface Location {
  id: string;
  college_id: string;
  name: string;
  category: LocationCategory;
  building: string | null;
  floor: string | null;
  room_number: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  opening_hours: string | null;
  contact: string | null;
  created_at: string;
}

export interface TimetableEntry {
  id: string;
  college_id: string;
  department_id: string;
  year: number;
  division: string;
  day: string;
  start_time: string;
  end_time: string;
  subject: string;
  faculty_id: string | null;
  room_number: string | null;
}

export interface Event {
  id: string;
  college_id: string;
  department_id: string | null;
  title: string;
  description: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location_id: string | null;
  organizer: string | null;
  image_url: string | null;
  registration_url: string | null;
  created_at: string;
}

export interface Notice {
  id: string;
  college_id: string;
  department_id: string | null;
  title: string;
  description: string;
  priority: NoticePriority;
  attachment_url: string | null;
  published_by: string | null;
  published_at: string;
  created_at: string;
}

export interface Facility {
  id: string;
  college_id: string;
  name: string;
  description: string | null;
  location_id: string | null;
  opening_hours: string | null;
  contact: string | null;
  image_url: string | null;
}

export interface HelpRequest {
  id: string;
  college_id: string;
  student_id: string;
  category: HelpRequestCategory;
  subject: string;
  description: string;
  attachment_url: string | null;
  priority: NoticePriority;
  status: HelpRequestStatus;
  assigned_to: string | null;
  response: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  college_id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  location_id: string;
  created_at: string;
}

export interface AIConversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

export interface AIMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  message: string;
  created_at: string;
}

// --- Joined / Extended Types ---

export interface TimetableWithFaculty extends TimetableEntry {
  faculty?: Faculty;
}

export interface NoticeWithDepartment extends Notice {
  department?: Department;
}

export interface EventWithLocation extends Event {
  location?: Location;
  department?: Department;
}

export interface HelpRequestWithProfile extends HelpRequest {
  profile?: Profile;
}

// --- Navigation ---

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavItem[];
}

// --- Phase 18: Campus Facility & Resource Booking Types ---

export type FacilityBookingStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "completed";

export interface FacilityBooking {
  id: string;
  college_id: string;
  facility_id: string;
  user_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  purpose: string;
  attendees_count: number;
  status: FacilityBookingStatus;
  booking_pass_code: string;
  approved_by?: string | null;
  rejection_reason?: string | null;
  created_at: string;
  updated_at: string;
  facility?: Facility;
  user_name?: string;
  user_email?: string;
  user_role?: UserRole;
}

export interface FacilityBookingSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  bookingId?: string;
  purpose?: string;
}

// --- Phase 19: Academic Examinations & Grade Analytics Types ---

export type ExamType = "mid_term" | "end_sem" | "practical" | "viva";
export type LetterGrade = "O" | "A+" | "A" | "B+" | "B" | "C" | "F";
export type GradeRecordStatus = "passed" | "failed" | "under_revaluation";

export interface ExamSchedule {
  id: string;
  college_id: string;
  department_id?: string | null;
  semester: string;
  subject_code: string;
  subject_name: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  room_number: string;
  building_name: string;
  total_marks: number;
  exam_type: ExamType;
  created_at?: string;
}

export interface ExamHallTicket {
  id: string;
  college_id: string;
  student_id: string;
  student_name: string;
  roll_number: string;
  enrolled_program: string;
  semester: string;
  hall_ticket_number: string;
  is_eligible: boolean;
  attendance_percentage: number;
  fee_clearance: boolean;
  qr_verification_code: string;
  exam_center: string;
  schedules: ExamSchedule[];
  instructions: string[];
}

export interface ExamSeating {
  id: string;
  exam_schedule_id: string;
  student_id: string;
  roll_number: string;
  student_name: string;
  subject_code: string;
  subject_name: string;
  room_number: string;
  building_name: string;
  floor: string;
  bench_number: string;
  exam_date: string;
  start_time: string;
  end_time: string;
}

export interface StudentGradeRecord {
  id: string;
  student_id: string;
  semester: string;
  subject_code: string;
  subject_name: string;
  credits: number;
  internal_marks: number;
  endsem_marks: number;
  total_marks: number;
  grade: LetterGrade;
  grade_point: number;
  status: GradeRecordStatus;
}

export interface SemesterTranscriptSummary {
  semester: string;
  totalCredits: number;
  creditsEarned: number;
  sgpa: number;
  cgpa: number;
  totalMarksScored: number;
  maxMarks: number;
  percentage: number;
  records: StudentGradeRecord[];
}

// --- Phase 20: Campus Placements & Career Ecosystem Types ---

export type DriveType = "full_time" | "internship" | "intern_to_fte";
export type DriveStatus = "upcoming" | "ongoing" | "completed" | "cancelled";
export type ApplicationStatus =
  | "applied"
  | "shortlisted"
  | "assessment_scheduled"
  | "interview_scheduled"
  | "offered"
  | "rejected"
  | "withdrawn";
export type InterviewRoundStatus = "scheduled" | "cleared" | "failed" | "rescheduled";
export type OfferAcceptanceStatus = "pending" | "accepted" | "declined";

export interface PlacementDrive {
  id: string;
  college_id: string;
  company_name: string;
  company_logo_url?: string | null;
  role_title: string;
  drive_type: DriveType;
  ctc_lpa: number;
  stipend_monthly?: number;
  location: string;
  eligibility_min_cgpa: number;
  allowed_departments: string[];
  max_active_backlogs: number;
  application_deadline: string;
  drive_date: string;
  status: DriveStatus;
  job_description: string;
  skills_required: string[];
  created_at?: string;
  total_applicants?: number;
}

export interface PlacementApplication {
  id: string;
  drive_id: string;
  student_id: string;
  college_id: string;
  resume_url?: string | null;
  current_cgpa: number;
  status: ApplicationStatus;
  applied_at: string;
  notes?: string | null;
  drive?: PlacementDrive;
}

export interface PlacementInterviewRound {
  id: string;
  application_id: string;
  drive_id: string;
  round_number: number;
  round_name: string;
  scheduled_at: string;
  duration_minutes: number;
  mode: "online" | "on_campus";
  venue_or_link: string;
  status: InterviewRoundStatus;
  feedback?: string | null;
  company_name?: string;
  role_title?: string;
}

export interface PlacementOffer {
  id: string;
  application_id: string;
  student_id: string;
  college_id: string;
  company_name: string;
  role_title: string;
  offered_ctc_lpa: number;
  bonus_joining?: number;
  offer_letter_url?: string | null;
  acceptance_status: OfferAcceptanceStatus;
  offer_date: string;
  valid_until: string;
  created_at?: string;
}

export interface DepartmentPlacementStat {
  department: string;
  totalEligible: number;
  totalPlaced: number;
  placementPercentage: number;
  avgCtcLpa: number;
  highestCtcLpa: number;
}

export interface InstitutionalPlacementStats {
  totalStudentsEligible: number;
  totalOffersMade: number;
  uniqueStudentsPlaced: number;
  overallPlacementRate: number;
  averageCtcLpa: number;
  highestCtcLpa: number;
  medianCtcLpa: number;
  totalParticipatingCompanies: number;
  departmentStats: DepartmentPlacementStat[];
  topRecruiters: { company: string; offersCount: number; maxCtc: number }[];
}

