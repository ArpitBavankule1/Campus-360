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

// --- Phase 21: Student Fee Management, Payments & Scholarships Types ---

export type FeeCategory =
  | "tuition"
  | "hostel"
  | "library"
  | "examination"
  | "lab_equipment";

export type FeeStatus = "pending" | "partially_paid" | "paid" | "overdue";
export type PaymentMethod = "upi" | "credit_card" | "debit_card" | "net_banking";
export type PaymentTransactionStatus = "success" | "pending" | "failed";
export type ScholarshipStatus = "open" | "closed";
export type ScholarshipApplicationStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "disbursed"
  | "rejected";

export interface StudentFeeDue {
  id: string;
  college_id: string;
  student_id: string;
  semester: string;
  academic_year: string;
  category: FeeCategory;
  title: string;
  amount_due: number;
  amount_paid: number;
  penalty_amount: number;
  due_date: string;
  status: FeeStatus;
  created_at?: string;
}

export interface FeeTransaction {
  id: string;
  fee_due_id: string;
  student_id: string;
  college_id: string;
  transaction_ref: string;
  payment_method: PaymentMethod;
  amount_paid: number;
  payment_date: string;
  receipt_number: string;
  status: PaymentTransactionStatus;
  fee_title?: string;
  category?: FeeCategory;
  gateway_response_id?: string;
}

export interface ScholarshipProgram {
  id: string;
  college_id: string;
  title: string;
  provider: string;
  grant_amount: number;
  min_cgpa: number;
  max_family_income: number;
  deadline: string;
  status: ScholarshipStatus;
  description: string;
  eligibility_criteria?: string[];
}

export interface ScholarshipApplication {
  id: string;
  scholarship_id: string;
  student_id: string;
  college_id: string;
  applied_at: string;
  status: ScholarshipApplicationStatus;
  disbursed_amount: number;
  notes?: string | null;
  scholarship?: ScholarshipProgram;
}

export interface StudentFeeSummary {
  studentId: string;
  studentName: string;
  rollNumber: string;
  totalPayable: number;
  totalPaid: number;
  outstandingBalance: number;
  hasOverdue: boolean;
  feeClearanceStatus: boolean; // Cleared for Exam Hall Ticket issuance
  duesCount: number;
  paidCount: number;
}

export interface InstitutionalFeeAnalytics {
  totalExpectedRevenue: number;
  totalCollectedRevenue: number;
  totalOutstandingRevenue: number;
  overallCollectionPercentage: number;
  totalStudentsClear: number;
  totalStudentsPending: number;
  categoryBreakdown: { category: FeeCategory; collected: number; pending: number }[];
}

// ================================================================
// Phase 22 — Smart Digital Library & Knowledge Commons
// ================================================================

export type BookCategory =
  | "computer_science"
  | "electronics"
  | "mechanical"
  | "civil"
  | "mathematics"
  | "physics"
  | "management"
  | "literature"
  | "general";

export type BorrowStatus = "active" | "returned" | "overdue" | "lost";

export type ReservationStatus =
  | "queued"
  | "ready_for_pickup"
  | "fulfilled"
  | "cancelled"
  | "expired";

export type EResourceType =
  | "journal"
  | "ebook"
  | "research_paper"
  | "conference"
  | "thesis";

export interface LibraryBook {
  id: string;
  college_id: string;
  title: string;
  author: string;
  isbn: string;
  category: BookCategory;
  publisher: string;
  edition?: string | null;
  call_number: string;
  shelf_location: string;
  total_copies: number;
  available_copies: number;
  cover_image_url?: string | null;
  description?: string | null;
  is_digital_available: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LibraryBorrowRecord {
  id: string;
  college_id: string;
  book_id: string;
  student_id: string;
  borrow_pass_code: string;
  borrowed_at: string;
  due_date: string;
  returned_at?: string | null;
  renewal_count: number;
  max_renewals: number;
  fine_amount: number;
  fine_paid: boolean;
  status: BorrowStatus;
  book?: LibraryBook;
}

export interface LibraryReservation {
  id: string;
  college_id: string;
  book_id: string;
  student_id: string;
  reservation_code: string;
  status: ReservationStatus;
  reserved_at: string;
  expires_at?: string | null;
  book?: LibraryBook;
}

export interface LibraryEResource {
  id: string;
  college_id: string;
  title: string;
  type: EResourceType;
  publisher: string;
  access_url: string;
  department_id?: string | null;
  downloads_count: number;
  is_open_access: boolean;
  created_at?: string;
}

export interface StudentLibrarySummary {
  studentId: string;
  activeBorrowsCount: number;
  overdueCount: number;
  totalFinesPending: number;
  reservationsCount: number;
  borrowingPrivilegeActive: boolean;
}

export interface InstitutionalLibraryStats {
  totalVolumes: number;
  totalActiveLoans: number;
  totalOverdueLoans: number;
  totalReservations: number;
  digitalAccessCount: number;
  categoryDistribution: { category: BookCategory; count: number }[];
}

// ================================================================
// Phase 23: Smart Campus Hostel, Residence & Mess Ecosystem
// ================================================================

export type HostelGender = 'boys' | 'girls' | 'coed';
export type HostelRoomType = 'single' | 'double' | 'triple' | 'quad';
export type AllocationStatus = 'active' | 'vacated' | 'suspended';
export type MealType = 'breakfast' | 'lunch' | 'snacks' | 'dinner';
export type MessDayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type OutPassStatus = 'pending' | 'approved' | 'rejected' | 'departed' | 'returned' | 'overdue';
export type GrievanceCategory = 'plumbing' | 'electrical' | 'carpentry' | 'cleanliness' | 'wifi' | 'other';
export type GrievancePriority = 'low' | 'medium' | 'high' | 'urgent';
export type GrievanceStatus = 'reported' | 'assigned' | 'in_progress' | 'resolved';

export interface HostelBlock {
  id: string;
  college_id: string;
  name: string;
  gender: HostelGender;
  total_floors: number;
  total_rooms: number;
  warden_name: string;
  warden_phone: string;
  warden_email: string;
  description?: string | null;
  created_at?: string;
}

export interface HostelRoom {
  id: string;
  college_id: string;
  block_id: string;
  room_number: string;
  floor: number;
  capacity: number;
  occupied_count: number;
  room_type: HostelRoomType;
  monthly_rent: number;
  ac_enabled: boolean;
  amenities: string[];
  block?: HostelBlock;
  created_at?: string;
}

export interface HostelAllocation {
  id: string;
  college_id: string;
  room_id: string;
  student_id: string;
  bed_number: string;
  academic_year: string;
  status: AllocationStatus;
  allocated_at: string;
  vacated_at?: string | null;
  room?: HostelRoom;
}

export interface HostelMessMenu {
  id: string;
  college_id: string;
  day_of_week: MessDayOfWeek;
  meal_type: MealType;
  timings: string;
  items: string[];
  special_item?: string | null;
  calories_approx: number;
  dietary_tags: string[];
}

export interface HostelOutPass {
  id: string;
  college_id: string;
  student_id: string;
  pass_code: string;
  destination: string;
  reason: string;
  departure_time: string;
  expected_return: string;
  actual_return?: string | null;
  parent_contact: string;
  parent_consent_verified: boolean;
  status: OutPassStatus;
  warden_remarks?: string | null;
  created_at: string;
}

export interface HostelGrievance {
  id: string;
  college_id: string;
  student_id: string;
  room_id?: string | null;
  category: GrievanceCategory;
  priority: GrievancePriority;
  title: string;
  description: string;
  status: GrievanceStatus;
  assigned_to?: string | null;
  resolved_at?: string | null;
  created_at: string;
}

export interface StudentHostelOverview {
  isHostelite: boolean;
  allocation?: HostelAllocation | null;
  activeOutPass?: HostelOutPass | null;
  pendingGrievancesCount: number;
  todaysMeals: HostelMessMenu[];
}

export interface HostelAnalyticsSummary {
  totalCapacity: number;
  totalOccupied: number;
  occupancyRate: number;
  activeOutPassesCount: number;
  openGrievancesCount: number;
  blocks: { name: string; occupancy: number; total: number }[];
}

// ================================================================
// Phase 24: Campus Health Center, Infirmary & Emergency Health SOS
// ================================================================

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';
export type MedicalLeaveStatus = 'pending' | 'approved' | 'rejected';
export type EmergencySOSType = 'cardiac' | 'trauma' | 'asthma' | 'fainting' | 'general';
export type EmergencySOSStatus = 'dispatched' | 'en_route' | 'attended' | 'resolved';

export interface StudentHealthProfile {
  id: string;
  college_id: string;
  student_id: string;
  blood_group: BloodGroup;
  allergies: string[];
  chronic_conditions: string[];
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relation: string;
  insurance_policy_no?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface HealthAppointment {
  id: string;
  college_id: string;
  student_id: string;
  doctor_name: string;
  specialization: string;
  appointment_date: string;
  time_slot: string;
  token_number: number;
  symptoms: string;
  status: AppointmentStatus;
  prescription_notes?: string | null;
  created_at: string;
}

export interface MedicalLeaveRequest {
  id: string;
  college_id: string;
  student_id: string;
  leave_code: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  doctor_certificate_url?: string | null;
  attendance_waiver_granted: boolean;
  verified_by?: string | null;
  status: MedicalLeaveStatus;
  created_at: string;
}

export interface DispensaryMedicine {
  id: string;
  college_id: string;
  name: string;
  generic_name: string;
  dosage: string;
  available_quantity: number;
  unit: string;
  requires_prescription: boolean;
  is_in_stock: boolean;
}

export interface EmergencySOSDispatch {
  id: string;
  college_id: string;
  student_id: string;
  sos_ticket_code: string;
  latitude: number;
  longitude: number;
  building_reference: string;
  emergency_type: EmergencySOSType;
  ambulance_dispatched: boolean;
  status: EmergencySOSStatus;
  responder_notes?: string | null;
  triggered_at: string;
  resolved_at?: string | null;
}

export interface CampusDoctorSchedule {
  id: string;
  name: string;
  specialization: string;
  qualifications: string;
  opdDays: string;
  opdTimings: string;
  roomNumber: string;
  activeStatus: "in_clinic" | "on_call" | "off_duty";
  avatarUrl?: string;
}

export interface StudentHealthOverview {
  profile: StudentHealthProfile;
  activeAppointments: HealthAppointment[];
  recentMedicalLeaves: MedicalLeaveRequest[];
  healthStatus: "fit" | "under_care" | "critical_allergy";
}

// ================================================================
// Phase 25: Student Clubs, Technical Societies & Activity Merit Ledgers
// ================================================================

export type ClubCategory = 'technical' | 'cultural' | 'sports' | 'literary' | 'social';
export type ClubRole = 'member' | 'core_team' | 'lead' | 'treasurer';
export type ActivityType = 'hackathon' | 'workshop' | 'cultural_performance' | 'sports_meet' | 'paper_presentation';

export interface StudentClub {
  id: string;
  college_id: string;
  name: string;
  slug: string;
  category: ClubCategory;
  description: string;
  logo_url?: string | null;
  lead_student_name: string;
  faculty_mentor_name: string;
  member_count: number;
  meeting_venue: string;
  recruitment_open: boolean;
  social_links?: Record<string, string>;
  created_at?: string;
}

export interface ClubMembership {
  id: string;
  college_id: string;
  club_id: string;
  student_id: string;
  role: ClubRole;
  joined_at: string;
  status: 'active' | 'alumni' | 'pending';
  club?: StudentClub;
}

export interface ClubEventTicket {
  id: string;
  college_id: string;
  event_id: string;
  student_id: string;
  ticket_code: string;
  event_title: string;
  venue: string;
  seat_tier: string;
  price: number;
  is_verified: boolean;
  checked_in_at?: string | null;
  created_at: string;
}

export interface StudentMeritActivity {
  id: string;
  college_id: string;
  student_id: string;
  club_id?: string | null;
  activity_title: string;
  activity_type: ActivityType;
  merit_points: number;
  certificate_url?: string | null;
  verified_by: string;
  awarded_at: string;
  created_at?: string;
  club?: StudentClub;
}

export interface StudentClubOverview {
  joinedClubs: ClubMembership[];
  myEventTickets: ClubEventTicket[];
  meritLedger: StudentMeritActivity[];
  totalMeritPoints: number;
}

// ================================================================
// Phase 26 — Alumni Network, Mentorship Nexus & Endowment Giving
// ================================================================

export type MentorshipTopic =
  | "resume_review"
  | "mock_interview"
  | "career_guidance"
  | "phd_advice"
  | "startup_mentorship";

export type MentorshipStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled";

export type JobReferralType =
  | "full_time"
  | "internship"
  | "remote"
  | "contract";

export type JobExperienceLevel =
  | "entry_level"
  | "mid_level"
  | "senior"
  | "intern";

export type DonationCampaign =
  | "stem_scholarship"
  | "innovation_lab"
  | "sports_complex"
  | "hardship_fund"
  | "library_endowment";

export type PledgeStatus = "pledged" | "completed" | "processing";

export interface AlumniProfile {
  id: string;
  college_id: string;
  user_id?: string | null;
  full_name: string;
  email: string;
  avatar_url?: string | null;
  graduating_year: number;
  department: string;
  degree: string;
  current_role: string;
  company: string;
  industry: string;
  location: string;
  bio?: string | null;
  linkedin_url?: string | null;
  mentorship_available: boolean;
  willing_to_refer: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AlumniMentorshipSession {
  id: string;
  college_id: string;
  alumni_id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  topic: MentorshipTopic;
  session_type: string;
  scheduled_at: string;
  duration_minutes: number;
  meeting_url?: string | null;
  notes?: string | null;
  status: MentorshipStatus;
  created_at?: string;
  alumni?: AlumniProfile;
}

export interface AlumniJobReferral {
  id: string;
  college_id: string;
  alumni_id: string;
  alumni_name: string;
  company: string;
  role_title: string;
  job_type: JobReferralType;
  experience_level: JobExperienceLevel;
  location: string;
  salary_range?: string | null;
  application_deadline: string;
  referral_code: string;
  apply_url?: string | null;
  description: string;
  is_active: boolean;
  created_at?: string;
}

export interface AlumniDonation {
  id: string;
  college_id: string;
  donor_name: string;
  donor_email: string;
  graduating_year?: number | null;
  campaign: DonationCampaign;
  amount: number;
  currency: string;
  pledge_status: PledgeStatus;
  transaction_ref: string;
  receipt_code: string;
  is_anonymous: boolean;
  message?: string | null;
  created_at?: string;
}

export interface AlumniDigitalPass {
  id: string;
  college_id: string;
  alumni_id: string;
  pass_code: string;
  issue_date: string;
  valid_until: string;
  privileges: string[];
  is_active: boolean;
  created_at?: string;
  alumni?: AlumniProfile;
}

export interface AlumniOverviewStats {
  totalAlumni: number;
  activeMentors: number;
  activeReferrals: number;
  totalDonationsRaised: number;
  featuredAlumni: AlumniProfile[];
  upcomingSessions: AlumniMentorshipSession[];
  latestReferrals: AlumniJobReferral[];
}

// ================================================================
// Phase 27 — Smart Campus Transport, EV Shuttles & Digital Parking
// ================================================================

export type ShuttleType =
  | "electric_bus"
  | "mini_van"
  | "express_shuttle"
  | "night_transit";

export type TransportPassType =
  | "semester_unlimited"
  | "monthly_commuter"
  | "faculty_express"
  | "single_day_guest";

export type ParkingCategory =
  | "faculty"
  | "scholar"
  | "visitor"
  | "ev_charging";

export type VehicleType = "car" | "two_wheeler" | "ev";

export interface TransportRoute {
  id: string;
  college_id: string;
  route_name: string;
  route_code: string;
  shuttle_type: ShuttleType;
  start_point: string;
  end_point: string;
  stops: { name: string; eta_mins: number; landmark?: string }[];
  operating_hours: string;
  frequency_mins: number;
  status: "active" | "delayed" | "off_duty";
  created_at?: string;
}

export interface TransportSchedule {
  id: string;
  route_id: string;
  bus_number: string;
  driver_name: string;
  driver_phone: string;
  departure_time: string;
  current_stop: string;
  live_eta_mins: number;
  live_status: "on_time" | "approaching" | "delayed" | "completed";
  created_at?: string;
  route?: TransportRoute;
}

export interface TransportPass {
  id: string;
  college_id: string;
  scholar_id: string;
  scholar_name: string;
  pass_type: TransportPassType;
  pass_code: string;
  route_id?: string | null;
  valid_from: string;
  valid_to: string;
  status: "active" | "expired" | "suspended";
  created_at?: string;
  route?: TransportRoute;
}

export interface ParkingZone {
  id: string;
  college_id: string;
  zone_name: string;
  zone_code: string;
  category: ParkingCategory;
  total_bays: number;
  occupied_bays: number;
  hourly_rate: number;
  created_at?: string;
}

export interface ParkingReservation {
  id: string;
  college_id: string;
  user_id: string;
  user_name: string;
  zone_id: string;
  bay_number: string;
  vehicle_plate: string;
  vehicle_type: VehicleType;
  reserved_from: string;
  reserved_until: string;
  pass_code: string;
  status: "active" | "completed" | "cancelled";
  created_at?: string;
  zone?: ParkingZone;
}

export interface CarpoolListing {
  id: string;
  college_id: string;
  driver_id: string;
  driver_name: string;
  driver_role: "student" | "faculty" | "staff";
  departure_location: string;
  destination_campus: string;
  departure_time: string;
  seats_available: number;
  price_per_seat: number;
  vehicle_model: string;
  contact_phone: string;
  is_active: boolean;
  created_at?: string;
}

export interface TransportOverviewStats {
  activeShuttles: number;
  averageWaitTimeMins: number;
  parkingAvailableBays: number;
  totalParkingBays: number;
  activeCarpools: number;
  routes: TransportRoute[];
  schedules: TransportSchedule[];
}

// ================================================================
// Phase 28 — Research Publications, Innovation Grants & IPR Hub
// ================================================================

export type ResearchIndexing =
  | "Scopus"
  | "IEEE Xplore"
  | "Springer"
  | "ACM"
  | "SCI"
  | "Other";

export type GrantAgency =
  | "DST"
  | "SERB"
  | "ISRO"
  | "DRDO"
  | "Industry Sponsored"
  | "EU Horizon"
  | "Institutional Grant";

export type PatentStatus =
  | "filed"
  | "published"
  | "granted"
  | "commercialized";

export type IPRType =
  | "Patent"
  | "Copyright"
  | "Industrial Design"
  | "Trademark";

export type StartupSector =
  | "EdTech"
  | "CleanTech"
  | "HealthTech"
  | "AI/ML"
  | "Robotics"
  | "FinTech"
  | "BioTech";

export type StartupFundingStage =
  | "Idea"
  | "Prototype"
  | "Seed Funded"
  | "Series A"
  | "Revenue Generating";

export interface ResearchPublication {
  id: string;
  college_id: string;
  title: string;
  authors: string[];
  department: string;
  journal_or_conference: string;
  publication_date: string;
  doi: string;
  citation_count: number;
  indexing: ResearchIndexing;
  open_access: boolean;
  abstract: string;
  pdf_url?: string | null;
  created_at?: string;
}

export interface ResearchGrant {
  id: string;
  college_id: string;
  project_title: string;
  principal_investigator: string;
  co_pis: string[];
  funding_agency: GrantAgency;
  total_grant_amount: number;
  disbursed_amount: number;
  start_date: string;
  end_date: string;
  milestone_status: "ongoing" | "completed" | "under_review" | "extended";
  deliverables_summary?: string | null;
  created_at?: string;
}

export interface PatentApplication {
  id: string;
  college_id: string;
  title: string;
  inventors: string[];
  application_number: string;
  filing_date: string;
  status: PatentStatus;
  ipr_type: IPRType;
  abstract: string;
  commercial_partner?: string | null;
  created_at?: string;
}

export interface InnovationStartup {
  id: string;
  college_id: string;
  startup_name: string;
  founder_name: string;
  founder_role: "student" | "faculty" | "alumni" | "team";
  sector: StartupSector;
  funding_stage: StartupFundingStage;
  incubation_space: string;
  seed_grant_awarded: number;
  pitch_deck_url?: string | null;
  website_url?: string | null;
  description: string;
  created_at?: string;
}

export interface ResearchOverviewStats {
  totalPublications: number;
  totalCitations: number;
  totalGrantFunding: number;
  totalPatentsFiled: number;
  incubatedStartupsCount: number;
  publications: ResearchPublication[];
  grants: ResearchGrant[];
  patents: PatentApplication[];
  startups: InnovationStartup[];
}

// ================================================================
// Phase 29 — International Scholars & Global Mobility Hub
// ================================================================

export type ExchangeSemesterTerm =
  | "Fall 2026"
  | "Spring 2027"
  | "Summer Research 2027"
  | "Full Academic Year 2026-27";

export type ScholarshipCoverage =
  | "Full Tuition + Living"
  | "Full Tuition Only"
  | "Travel & Research Grant"
  | "Partial Subsidy";

export type VisaCategory =
  | "F-1 / J-1 (USA)"
  | "Tier 4 / Student Visa (UK)"
  | "Schengen Student (EU)"
  | "Student Pass (Singapore)"
  | "Australian Student 500";

export type CreditTransferStatus = "pending" | "approved" | "rejected" | "under_review";

export interface PartnerUniversity {
  id: string;
  college_id: string;
  university_name: string;
  country: string;
  city: string;
  qs_world_ranking: number;
  programs_offered: string[];
  min_gpa_required: number;
  exchange_slots: number;
  tuition_waiver: boolean;
  application_deadline: string;
  semester_term: ExchangeSemesterTerm;
  campus_website?: string | null;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface InternationalScholarship {
  id: string;
  college_id: string;
  fellowship_title: string;
  sponsoring_body: string;
  coverage_type: ScholarshipCoverage;
  award_amount_usd: number;
  target_countries: string[];
  eligibility_criteria: string;
  application_deadline: string;
  open_slots: number;
  status: "open" | "closed" | "reviewing";
  created_at?: string;
}

export interface CreditTransferRequest {
  id: string;
  college_id: string;
  student_id: string;
  student_name: string;
  host_university: string;
  foreign_course_code: string;
  foreign_course_title: string;
  credits_earned: number;
  equivalent_domestic_course: string;
  equivalent_credits: number;
  grade_earned: string;
  syllabus_document_url?: string | null;
  status: CreditTransferStatus;
  evaluator_remarks?: string | null;
  submitted_at: string;
  evaluated_at?: string | null;
}

export interface TravelClearancePass {
  id: string;
  college_id: string;
  student_id: string;
  student_name: string;
  pass_code: string;
  destination_country: string;
  host_institution: string;
  passport_number_masked: string;
  visa_type: VisaCategory;
  valid_from: string;
  valid_until: string;
  dean_approval_status: "pending" | "approved" | "denied";
  digital_qr_token: string;
  created_at: string;
}

export interface GlobalMobilityOverviewStats {
  totalPartners: number;
  totalExchangeSlots: number;
  totalScholarshipsValue: number;
  activeScholarsAbroad: number;
  pendingClearances: number;
  partnerUniversities: PartnerUniversity[];
  scholarships: InternationalScholarship[];
  creditTransfers: CreditTransferRequest[];
  travelPasses: TravelClearancePass[];
}

// ================================================================
// Phase 30 — Smart Campus Sustainability & Green Energy
// ================================================================

export type SolarArrayZone =
  | "Engineering Block A & B"
  | "Central Library Complex"
  | "Indoor Sports Arena"
  | "Scholars Residence Hall"
  | "Administrative Tower";

export type CommuteMode = "Bicycle" | "Walking" | "Campus EV Shuttle" | "Carpooling";

export interface SolarTelemetry {
  id: string;
  college_id: string;
  array_zone: SolarArrayZone;
  peak_capacity_kwp: number;
  current_generation_kw: number;
  daily_total_kwh: number;
  battery_storage_percent: number;
  grid_export_kw: number;
  carbon_offset_kg: number;
  timestamp: string;
}

export interface WaterMetric {
  id: string;
  college_id: string;
  reservoir_name: string;
  capacity_kiloliters: number;
  current_reserve_kiloliters: number;
  greywater_recycled_liters_today: number;
  water_quality_index: number;
  tds_ppm: number;
  ph_level: number;
  updated_at: string;
}

export interface WasteAudit {
  id: string;
  college_id: string;
  audit_week: string;
  organic_compost_kg: number;
  dry_recyclables_kg: number;
  electronic_waste_kg: number;
  landfill_waste_kg: number;
  landfill_diversion_rate_percent: number;
  auditor_officer: string;
  remarks?: string | null;
  created_at: string;
}

export interface EcoCredit {
  id: string;
  college_id: string;
  student_id: string;
  student_name: string;
  commute_mode: CommuteMode;
  distance_km: number;
  co2_saved_kg: number;
  eco_points_earned: number;
  certificate_code: string;
  logged_at: string;
}

export interface SustainabilityOverviewStats {
  totalInstantGenerationKw: number;
  totalDailyGenerationKwh: number;
  totalCarbonOffsetKg: number;
  averageBatteryStoragePercent: number;
  totalWaterReservesKl: number;
  campusDiversionRatePercent: number;
  totalEcoPointsLogged: number;
  solarTelemetry: SolarTelemetry[];
  waterMetrics: WaterMetric[];
  wasteAudits: WasteAudit[];
  ecoCredits: EcoCredit[];
}

// ================================================================
// Phase 31 — Campus Grievance Redressal & Student Ombudsman
// ================================================================

export type OmbudsmanCategory =
  | "Anti-Ragging Squad"
  | "Internal Complaints Committee (ICC)"
  | "Academic Evaluation & Exams"
  | "Hostel Amenities & Mess"
  | "Discrimination & Harassment"
  | "General Grievance";

export type UrgencyLevel = "Critical Emergency" | "High Priority" | "Standard Review";

export type EscalationTier =
  | "Department Committee"
  | "Proctorial Board"
  | "Dean of Student Welfare"
  | "Campus Ombudsman";

export type OmbudsmanCaseStatus =
  | "Submitted"
  | "Under Hearing"
  | "Directive Issued"
  | "Resolved"
  | "Dismissed";

export interface GrievanceCase {
  id: string;
  college_id: string;
  tracking_hash: string;
  category: OmbudsmanCategory;
  title: string;
  description: string;
  is_anonymous: boolean;
  complainant_masked_id: string;
  urgency_level: UrgencyLevel;
  escalation_tier: EscalationTier;
  sla_deadline: string;
  status: OmbudsmanCaseStatus;
  evidence_attachments: string[];
  created_at: string;
  updated_at?: string;
}

export interface OmbudsmanCommitteeMember {
  id: string;
  college_id: string;
  member_name: string;
  designation: string;
  committee_role: string;
  contact_email: string;
  office_location: string;
  is_active: boolean;
  created_at?: string;
}

export interface GrievanceHearing {
  id: string;
  college_id: string;
  case_id: string;
  docket_number: string;
  hearing_date: string;
  tribunal_venue: string;
  presiding_officer: string;
  quorum_present: string[];
  hearing_notes?: string | null;
  status: "Scheduled" | "In Session" | "Concluded" | "Adjourned";
  created_at?: string;
}

export interface GrievanceResolutionOrder {
  id: string;
  college_id: string;
  case_id: string;
  order_serial_code: string;
  presiding_authority: string;
  findings_summary: string;
  mandatory_directives: string;
  compliance_deadline: string;
  is_statutory_binding: boolean;
  digital_seal_hash: string;
  issued_at: string;
}

export interface OmbudsmanOverviewStats {
  totalCasesReported: number;
  activeUnderHearing: number;
  resolvedCases: number;
  averageResolutionHours: number;
  complianceRatePercent: number;
  cases: GrievanceCase[];
  committeeMembers: OmbudsmanCommitteeMember[];
  hearings: GrievanceHearing[];
  resolutionOrders: GrievanceResolutionOrder[];
}

// ================================================================
// Phase 32 — Smart Campus Sports Arena, Athletic Leagues & Gym
// ================================================================

export type SportType =
  | "Badminton"
  | "Basketball"
  | "Tennis"
  | "Football / Turf"
  | "Cricket Nets"
  | "Swimming Pool"
  | "Table Tennis"
  | "Squash";

export type ArenaStatus = "Available" | "Booked Out" | "Maintenance";

export type GymMembershipTier =
  | "Student All-Access"
  | "Faculty Executive"
  | "Athlete High-Performance"
  | "Day Pass";

export type FitnessSlot =
  | "Early Bird (06:00 - 08:00)"
  | "Morning Peak (08:00 - 10:00)"
  | "Evening Surge (17:00 - 19:30)"
  | "Night Owl (19:30 - 22:00)";

export type EquipmentLoanStatus =
  | "Active Loan"
  | "Returned On-Time"
  | "Overdue"
  | "Deposit Forfeited";

export interface SportsArena {
  id: string;
  college_id: string;
  arena_name: string;
  sport_type: SportType;
  location_venue: string;
  total_courts: number;
  court_surface: string;
  hourly_rate: number;
  is_floodlit: boolean;
  opening_time: string;
  closing_time: string;
  current_status: ArenaStatus;
  created_at?: string;
}

export interface AthleticLeague {
  id: string;
  college_id: string;
  tournament_title: string;
  sport_type: string;
  organizer_department: string;
  season_year: number;
  start_date: string;
  end_date: string;
  participating_teams: number;
  prize_pool_inr: number;
  status: "Upcoming" | "Registration Open" | "Knockouts Ongoing" | "Completed";
  created_at?: string;
}

export interface GymMembership {
  id: string;
  college_id: string;
  scholar_id: string;
  scholar_name: string;
  pass_code: string;
  tier: GymMembershipTier;
  fitness_slot: FitnessSlot;
  trainer_assigned?: string | null;
  bmi_index?: number | null;
  is_biometric_active: boolean;
  valid_until: string;
  created_at?: string;
}

export interface EquipmentLoan {
  id: string;
  college_id: string;
  equipment_code: string;
  item_name: string;
  sport_type: string;
  borrower_id: string;
  borrower_name: string;
  quantity: number;
  checkout_time: string;
  due_time: string;
  deposit_inr: number;
  item_condition: "Mint" | "Good" | "Fair" | "Damaged";
  status: EquipmentLoanStatus;
  created_at?: string;
}

export interface SportsOverviewStats {
  totalArenas: number;
  activeAthleticTournaments: number;
  enrolledGymMembers: number;
  activeEquipmentLoans: number;
  arenas: SportsArena[];
  leagues: AthleticLeague[];
  gymMembers: GymMembership[];
  equipmentLoans: EquipmentLoan[];
}

// ================================================================
// Phase 33 — Campus Incubation, Startup Accelerator & Maker Space
// ================================================================

export type VentureSector =
  | "DeepTech & AI"
  | "Climate & CleanTech"
  | "BioTech & HealthCare"
  | "FinTech & Web3"
  | "Robotics & Hardware"
  | "EdTech & Consumer";

export type VentureStage =
  | "Ideation"
  | "Prototyping"
  | "Seed Funded"
  | "Series A Scaled"
  | "Graduated";

export type VentureStatus =
  | "Applied"
  | "Incubated"
  | "Accelerated"
  | "Exited"
  | "Rejected";

export interface IncubationVenture {
  id: string;
  college_id: string;
  venture_name: string;
  sector: VentureSector;
  founder_name: string;
  founder_id: string;
  founder_role: string;
  pitch_deck_url?: string | null;
  stage: VentureStage;
  valuation_inr: number;
  seed_grant_inr: number;
  patents_filed: number;
  status: VentureStatus;
  created_at?: string;
}

export interface VentureFundingTranche {
  id: string;
  college_id: string;
  venture_id: string;
  tranche_name: string;
  amount_inr: number;
  investor_type: string;
  disbursement_date: string;
  milestone_verified: boolean;
  disbursement_status: "Pending Audit" | "Approved" | "Disbursed" | "Withheld";
  created_at?: string;
}

export interface MakerSpaceEquipment {
  id: string;
  college_id: string;
  equipment_name: string;
  equipment_type: string;
  location_lab: string;
  hourly_slot_capacity: number;
  specs_summary: string;
  is_operational: boolean;
  created_at?: string;
}

export interface PitchSession {
  id: string;
  college_id: string;
  session_code: string;
  venture_id: string;
  pitch_date: string;
  angel_investor_panel: string[];
  venue: string;
  verdict:
    | "Term Sheet Offered"
    | "Seed Grant Approved"
    | "Follow-up Diligence"
    | "Under Deliberation"
    | "Declined";
  created_at?: string;
}

export interface IncubationOverviewStats {
  totalIncubatedVentures: number;
  totalGrantDisbursedInr: number;
  activePrototypingJobs: number;
  patentsFiledCount: number;
  ventures: IncubationVenture[];
  fundingTranches: VentureFundingTranche[];
  makerEquipment: MakerSpaceEquipment[];
  pitches: PitchSession[];
}

// ================================================================
// Phase 34 — Smart Campus Security, Visitor Passes & AI Lost & Found
// ================================================================

export type VisitingPurpose =
  | "Guest Lecture & Academic Seminar"
  | "Parent & Guardian Residence Visit"
  | "Vendor & Logistics Delivery"
  | "Corporate Campus Recruitment"
  | "Official Statutory Inspection"
  | "General Inquiry";

export type VisitorPassStatus =
  | "Pre-Registered"
  | "Checked In"
  | "Departed"
  | "Expired"
  | "Revoked";

export type LostFoundCategory =
  | "Electronics & Laptops"
  | "Wallets & ID Cards"
  | "Keys & Smart Badges"
  | "Bags & Backpacks"
  | "Watches & Jewellery"
  | "Books & Documents"
  | "Other Items";

export type LostFoundStatus =
  | "Unclaimed"
  | "Verification Pending"
  | "Claimed & Returned"
  | "Auctioned / Disposed";

export interface VisitorPass {
  id: string;
  college_id: string;
  pass_code: string;
  visitor_name: string;
  visitor_phone: string;
  visitor_id_proof: string;
  visiting_purpose: VisitingPurpose;
  host_person: string;
  entry_gate: string;
  valid_date: string;
  status: VisitorPassStatus;
  vehicle_number?: string | null;
  issued_at: string;
}

export interface TurnstileLog {
  id: string;
  college_id: string;
  checkpoint_name: string;
  card_hash: string;
  user_role: "student" | "faculty" | "visitor" | "contractor" | "security_staff";
  access_result: string;
  anomaly_flag: boolean;
  tap_time: string;
}

export interface LostAndFoundItem {
  id: string;
  college_id: string;
  item_code: string;
  title: string;
  category: LostFoundCategory;
  found_location: string;
  description: string;
  image_url?: string | null;
  status: LostFoundStatus;
  claimed_by_id?: string | null;
  reported_by: string;
  reported_at: string;
}

export interface PatrolCheckpoint {
  id: string;
  college_id: string;
  route_name: string;
  checkpoint_marker: string;
  guard_name: string;
  last_patrolled_at: string;
  status: "Normal Secure" | "Observation Logged" | "Incident Alerted";
  created_at?: string;
}

export interface SecurityOverviewStats {
  activeVisitorsOnCampus: number;
  dailyTurnstileTaps: number;
  unclaimedLostItems: number;
  patrolRouteCompletionRate: number;
  visitors: VisitorPass[];
  turnstileLogs: TurnstileLog[];
  lostItems: LostAndFoundItem[];
  patrolCheckpoints: PatrolCheckpoint[];
}

// ================================================================
// Phase 35 — Smart Campus Cafeteria, Dining Wallets & Contactless Food Ordering
// ================================================================

export type CuisineType =
  | "North Indian & Thali"
  | "South Indian Tiffin"
  | "Continental & Italian"
  | "Asian & Wok"
  | "Fresh Juice & Bakery"
  | "Healthy Protein Bowls"
  | "Specialty Coffee & Tea";

export type MealCategory =
  | "Breakfast"
  | "Lunch Specials"
  | "Snacks & Beverages"
  | "Healthy Bowls"
  | "Dinner";

export type DietaryTag =
  | "Pure Veg"
  | "Vegan"
  | "Egg"
  | "Non-Veg"
  | "Jain Option";

export type OrderStatus =
  | "Preparing"
  | "Ready for Pickup"
  | "Completed"
  | "Cancelled";

export type DiningPaymentMethod =
  | "Dining Wallet"
  | "UPI Instant"
  | "Campus Card";

export interface DiningVendor {
  id: string;
  college_id: string;
  vendor_name: string;
  cuisine_type: CuisineType;
  location_stall: string;
  opening_time: string;
  closing_time: string;
  rating: number;
  is_accepting_orders: boolean;
  average_prep_time_mins: number;
  created_at?: string;
}

export interface MenuItem {
  id: string;
  college_id: string;
  vendor_id: string;
  vendor_name?: string;
  item_name: string;
  category: MealCategory;
  price_inr: number;
  dietary_tag: DietaryTag;
  calories: number;
  is_in_stock: boolean;
  prep_time_mins: number;
  created_at?: string;
}

export interface DiningWallet {
  id: string;
  college_id: string;
  scholar_id: string;
  scholar_name: string;
  wallet_balance_inr: number;
  monthly_subsidy_inr: number;
  auto_reload_enabled: boolean;
  qr_payment_token: string;
  last_topup_date: string;
  created_at?: string;
}

export interface MealOrder {
  id: string;
  college_id: string;
  order_code: string;
  scholar_id: string;
  scholar_name: string;
  vendor_name: string;
  items_summary: string;
  total_amount_inr: number;
  pickup_slot: string;
  order_status: OrderStatus;
  payment_method: DiningPaymentMethod;
  token_pass_code: string;
  created_at: string;
}

export interface CafeteriaOverviewStats {
  activeVendors: number;
  availableMenuItems: number;
  activeOrdersInKitchen: number;
  totalMealsServedToday: number;
  vendors: DiningVendor[];
  menuItems: MenuItem[];
  wallet: DiningWallet;
  recentOrders: MealOrder[];
}

// ================================================================
// Phase 36 — Smart Campus Auditorium, Cultural Convention Center & Event Ticketing
// ================================================================

export type AuditoriumStatus = "Available" | "In Session" | "Under Maintenance";

export type AuditoriumOrganizerRole =
  | "Student Club Lead"
  | "Faculty Coordinator"
  | "Dean Office"
  | "External Guest Speaker";

export type AuditoriumBookingStatus =
  | "Confirmed"
  | "Pending Approval"
  | "Cancelled";

export type SeatTier =
  | "Orchestra Premium"
  | "Executive Mezzanine"
  | "General Balcony"
  | "VIP Dignitary";

export type StageEquipmentType =
  | "Wireless Lapel Mics"
  | "Digital Mixer 32-Ch"
  | "Line Array PA Speakers"
  | "Moving Head LED Rigs"
  | "4K Telepresence Cameras";

export type EquipmentRiderStatus =
  | "Dispatched"
  | "Installed & Tested"
  | "Returned";

export interface AuditoriumHall {
  id: string;
  college_id: string;
  hall_name: string;
  seating_capacity: number;
  venue_building: string;
  acoustic_rating: string;
  stage_dimensions: string;
  projector_type: string;
  current_status: AuditoriumStatus;
  created_at?: string;
}

export interface AuditoriumReservation {
  id: string;
  college_id: string;
  booking_code: string;
  hall_name: string;
  event_title: string;
  organizer_name: string;
  organizer_role: AuditoriumOrganizerRole;
  event_date: string;
  start_time: string;
  end_time: string;
  expected_attendees: number;
  booking_status: AuditoriumBookingStatus;
  created_at?: string;
}

export interface EventTicket {
  id: string;
  college_id: string;
  ticket_code: string;
  event_title: string;
  hall_name: string;
  attendee_name: string;
  seat_number: string;
  tier: SeatTier;
  is_checked_in: boolean;
  issued_at: string;
}

export interface StageEquipmentRider {
  id: string;
  college_id: string;
  reservation_id?: string;
  equipment_type: StageEquipmentType;
  quantity: number;
  technician_assigned: string;
  status: EquipmentRiderStatus;
  created_at?: string;
}

export interface AuditoriumOverviewStats {
  totalAuditoriums: number;
  totalSeatingCapacity: number;
  activeEventsToday: number;
  totalTicketsIssued: number;
  halls: AuditoriumHall[];
  reservations: AuditoriumReservation[];
  tickets: EventTicket[];
  equipmentRiders: StageEquipmentRider[];
}

// ================================================================
// Phase 37 — Smart Campus Scholarships, Financial Aid & Merit Endowment Ledger
// ================================================================

export type ScholarshipProvider =
  | "Institutional Merit"
  | "Corporate CSR"
  | "Alumni Endowment"
  | "Government DBT"
  | "Sports Excellence";

export type ScholarshipSchemeStatus =
  | "Applications Open"
  | "Scrutiny Phase"
  | "Disbursed"
  | "Archived";

export type GrantApplicationStatus =
  | "Submitted"
  | "Documents Verified"
  | "Dean Approved"
  | "Disbursed"
  | "Rejected";

export type TrancheStatus = "Credited" | "Escrow Processing" | "On Hold";

export interface ScholarshipScheme {
  id: string;
  college_id: string;
  scheme_name: string;
  provider_type: ScholarshipProvider;
  amount_per_scholar_inr: number;
  total_budget_inr: number;
  disbursed_budget_inr: number;
  min_cgpa: number;
  max_family_income_lpa: number;
  application_deadline: string;
  status: ScholarshipSchemeStatus;
  created_at?: string;
}

export interface GrantApplication {
  id: string;
  college_id: string;
  application_code: string;
  scheme_name: string;
  scholar_id: string;
  scholar_name: string;
  department: string;
  current_cgpa: number;
  annual_family_income_inr: number;
  status: GrantApplicationStatus;
  statement_of_purpose?: string | null;
  created_at: string;
}

export interface DisbursementTranche {
  id: string;
  college_id: string;
  tranche_code: string;
  scholar_id: string;
  scholar_name: string;
  scheme_name: string;
  tranche_number: number;
  amount_inr: number;
  bank_ref_no: string;
  disbursement_date: string;
  status: TrancheStatus;
  created_at?: string;
}

export interface ScholarshipCertificate {
  id: string;
  college_id: string;
  certificate_code: string;
  scholar_name: string;
  scheme_name: string;
  academic_year: string;
  award_title: string;
  sanction_authority: string;
  issued_at: string;
}

export interface ScholarshipOverviewStats {
  totalScholarshipFundingInr: number;
  totalDisbursedInr: number;
  activeSchemesCount: number;
  scholarsBenefitedCount: number;
  schemes: ScholarshipScheme[];
  applications: GrantApplication[];
  disbursements: DisbursementTranche[];
  certificates: ScholarshipCertificate[];
}

// ================================================================
// Phase 38 — Smart Campus Digital Credentialing, Academic Convocation & Verifiable Degree Ledger
// ================================================================

export type DegreeType =
  | "Bachelor of Technology"
  | "Master of Technology"
  | "Doctor of Philosophy"
  | "Master of Business Admin"
  | "Honorary Doctorate";

export type HonorsClassification =
  | "First Class with Distinction"
  | "First Class Honours"
  | "Dean's Gold Medalist"
  | "Chancellor's Citation";

export type CeremonyStatus = "Scheduled" | "In Procession" | "Concluded";

export type GownSize = "Small (S)" | "Medium (M)" | "Large (L)" | "Extra Large (XL)";

export type CredentialStatus =
  | "Issued & Cryptographically Signed"
  | "Pending Convocation"
  | "Revoked";

export type VerificationStatus =
  | "Verified & Authentic"
  | "Record Under Audit"
  | "Invalid Hash";

export interface DegreeCredential {
  id: string;
  college_id: string;
  credential_code: string;
  scholar_id: string;
  scholar_name: string;
  degree_type: DegreeType;
  department: string;
  graduation_year: number;
  cgpa: number;
  honors_classification: HonorsClassification;
  cryptographic_hash: string;
  credential_status: CredentialStatus;
  conferred_at: string;
  created_at?: string;
}

export interface ConvocationCeremony {
  id: string;
  college_id: string;
  edition_title: string;
  academic_session: string;
  chief_guest_name: string;
  chief_guest_designation: string;
  ceremony_date: string;
  ceremony_time: string;
  venue_auditorium: string;
  total_degrees_awarded: number;
  regalia_dress_code: string;
  ceremony_status: CeremonyStatus;
  created_at?: string;
}

export interface ConvocationRegistration {
  id: string;
  college_id: string;
  registration_code: string;
  scholar_id: string;
  scholar_name: string;
  ceremony_id?: string;
  degree_awarded: string;
  gown_size: GownSize;
  guest_pass_count: number;
  allocated_seat_number: string;
  admittance_pass_code: string;
  is_gown_collected: boolean;
  is_checked_in: boolean;
  registered_at: string;
}

export interface CredentialVerificationRequest {
  id: string;
  college_id: string;
  verification_code: string;
  credential_code: string;
  requester_organization: string;
  requester_contact_email: string;
  verification_purpose: string;
  verification_status: VerificationStatus;
  verified_at: string;
}

export interface ConvocationOverviewStats {
  totalDegreesIssued: number;
  registeredScholarsCount: number;
  goldMedalistsCount: number;
  employerVerificationsCount: number;
  credentials: DegreeCredential[];
  ceremony: ConvocationCeremony;
  registrations: ConvocationRegistration[];
  recentVerifications: CredentialVerificationRequest[];
}

// ================================================================
// Phase 39 — Smart Campus Student Elections, E-Voting & Campus Democracy Portal
// ================================================================

export type ElectionPost =
  | "President"
  | "Vice President"
  | "General Secretary Academic"
  | "General Secretary Cultural"
  | "General Secretary Sports"
  | "General Secretary Technical";

export type ElectionStatus =
  | "Nomination Phase"
  | "Campaigning"
  | "Voting Live"
  | "Counting Votes"
  | "Results Certified";

export type CandidateApprovalStatus =
  | "Approved & Vetted"
  | "Under Scrutiny"
  | "Disqualified";

export interface StudentElection {
  id: string;
  college_id: string;
  election_title: string;
  academic_session: string;
  election_commissioner: string;
  nomination_deadline: string;
  voting_starts_at: string;
  voting_ends_at: string;
  status: ElectionStatus;
  total_eligible_voters: number;
  total_votes_cast: number;
  created_at?: string;
}

export interface ElectionCandidate {
  id: string;
  college_id: string;
  election_id?: string;
  candidate_name: string;
  scholar_id: string;
  department: string;
  year_of_study: number;
  post_contested: ElectionPost;
  manifesto_slogan: string;
  key_initiatives: string[];
  campaign_tagline: string;
  approval_status: CandidateApprovalStatus;
  vote_count: number;
  created_at?: string;
}

export interface BallotVote {
  id: string;
  college_id: string;
  election_id?: string;
  ballot_receipt_code: string;
  post_contested: ElectionPost;
  candidate_id?: string;
  cryptographic_token_hash: string;
  cast_timestamp: string;
}

export interface ElectionResultDocket {
  id: string;
  college_id: string;
  election_id?: string;
  certificate_code: string;
  post_contested: ElectionPost;
  winner_candidate_name: string;
  winning_margin_votes: number;
  total_votes_polled: number;
  voter_turnout_pct: number;
  certified_by: string;
  certified_at: string;
}

export interface ElectionsOverviewStats {
  totalEligibleVoters: number;
  totalVotesPolled: number;
  voterTurnoutPercentage: number;
  approvedCandidatesCount: number;
  election: StudentElection;
  candidates: ElectionCandidate[];
  results: ElectionResultDocket[];
}

// ================================================================
// Phase 40 — Smart Campus Cloud Printing, Document Xerox & Thesis Binding Hub
// ================================================================

export type PrintStationStatus =
  | "Online & Ready"
  | "Paper Tray Low"
  | "Out of Toner"
  | "Under Maintenance";

export type PrintColorMode = "Monochrome B&W" | "High-Res Color";

export type PrintDuplexMode = "Single-Sided" | "Double-Sided Duplex";

export type PrintJobStatus =
  | "Queued in Cloud"
  | "Processing"
  | "Ready for Kiosk Pickup"
  | "Printed & Collected"
  | "Purged";

export type ThesisCoverType =
  | "Hardcover Royal Navy (Gold Foil)"
  | "Hardcover Emerald Green (Silver Foil)"
  | "Softcover Spiral Binding"
  | "Deluxe Leatherette Archival";

export type ThesisBindingStatus =
  | "Submitted for Binding"
  | "Cover Embossing"
  | "Quality Inspected"
  | "Ready for Library Deposit";

export type DepartmentSignoffStatus =
  | "Pending Guide Signoff"
  | "Approved by Guide"
  | "Approved by HOD";

export interface PrintStation {
  id: string;
  college_id: string;
  kiosk_name: string;
  campus_building: string;
  floor_location: string;
  status: PrintStationStatus;
  paper_level_pct: number;
  toner_level_pct: number;
  supported_sizes: string[];
  is_color_capable: boolean;
  is_duplex_capable: boolean;
  queue_jobs_count: number;
  created_at?: string;
}

export interface StudentPrintWallet {
  id: string;
  college_id: string;
  scholar_id: string;
  scholar_name: string;
  semester_free_quota_pages: number;
  free_pages_remaining: number;
  wallet_balance_inr: number;
  total_pages_printed: number;
  last_used_at: string;
  created_at?: string;
}

export interface PrintJob {
  id: string;
  college_id: string;
  job_code: string;
  scholar_id: string;
  scholar_name: string;
  document_name: string;
  page_count: number;
  color_mode: PrintColorMode;
  duplex_mode: PrintDuplexMode;
  total_cost_inr: number;
  pickup_kiosk_name: string;
  status: PrintJobStatus;
  release_pin: string;
  release_token_hash: string;
  submitted_at: string;
}

export interface ThesisBindingOrder {
  id: string;
  college_id: string;
  order_code: string;
  scholar_id: string;
  scholar_name: string;
  department: string;
  thesis_title: string;
  degree_program: string;
  cover_type: ThesisCoverType;
  copies_requested: number;
  embossing_text: string;
  binding_status: ThesisBindingStatus;
  department_signoff_status: DepartmentSignoffStatus;
  target_delivery_date: string;
  total_fee_inr: number;
  created_at: string;
}

export interface PrintingOverviewStats {
  activeKiosksCount: number;
  totalJobsPrintedToday: number;
  totalPagesPrintedToday: number;
  activeThesisBindingsCount: number;
  stations: PrintStation[];
  wallet: StudentPrintWallet;
  recentJobs: PrintJob[];
  thesisOrders: ThesisBindingOrder[];
}

// ================================================================
// Phase 41 — Smart Campus Mental Health, Psychological Counseling & Peer Support Sanctuary
// ================================================================

export type CounselingSessionType =
  | "One-on-One Tele-Therapy"
  | "In-Person Clinic Visit"
  | "Stress & Academic Anxiety"
  | "Urgent Crisis Counseling";

export type CounselingStatus =
  | "Confirmed"
  | "In Session"
  | "Completed"
  | "Rescheduled";

export type CounselingMode =
  | "Confidential Video Call"
  | "Infirmary Wellness Suite"
  | "Anonymous Voice Line";

export type CircleTheme =
  | "Exam Stress & Burnout"
  | "Imposter Syndrome & Tech Pressure"
  | "Hostel Homesickness & Transition"
  | "Mindfulness & Sleep Hygiene";

export type CircleStatus =
  | "Open for Joining"
  | "Session in Progress"
  | "Full Capacity";

export type MoodTag =
  | "Great"
  | "Calm"
  | "Overwhelmed"
  | "Anxious"
  | "Exhausted";

export interface CounselingSession {
  id: string;
  college_id: string;
  session_code: string;
  scholar_id: string;
  scholar_name: string;
  counselor_name: string;
  counselor_specialization: string;
  session_type: CounselingSessionType;
  scheduled_date: string;
  scheduled_time_slot: string;
  mode: CounselingMode;
  status: CounselingStatus;
  confidential_notes_encrypted: boolean;
  access_pass_token: string;
  created_at?: string;
}

export interface PeerSupportCircle {
  id: string;
  college_id: string;
  circle_name: string;
  theme: CircleTheme;
  facilitator_name: string;
  schedule_info: string;
  meeting_venue: string;
  max_participants: number;
  enrolled_count: number;
  is_anonymous: boolean;
  status: CircleStatus;
  created_at?: string;
}

export interface MoodCheckin {
  id: string;
  college_id: string;
  scholar_id: string;
  mood_score: number; // 1 to 5
  mood_tag: MoodTag;
  sleep_hours: number;
  stress_factors: string[];
  coping_exercise: string;
  created_at: string;
}

export interface CrisisHelpline {
  id: string;
  college_id: string;
  service_name: string;
  phone_number: string;
  availability: string;
  coverage_scope: string;
  is_toll_free: boolean;
  created_at?: string;
}

export interface CounselingOverviewStats {
  totalConfirmedSessions: number;
  activePeerCirclesCount: number;
  todayMoodAverage: number;
  emergencyHelplinesCount: number;
  sessions: CounselingSession[];
  circles: PeerSupportCircle[];
  moodCheckins: MoodCheckin[];
  helplines: CrisisHelpline[];
}

// ==========================================
// Phase 42: Smart Campus Admissions, Program Application & Seat Allocation Gateway
// ==========================================

export type ProgramDegreeLevel =
  | "Undergraduate (B.Tech)"
  | "Postgraduate (M.Tech)"
  | "Master of Business Administration (MBA)"
  | "Master of Science (M.Sc)"
  | "Doctor of Philosophy (Ph.D.)";

export type AdmissionApplicationStatus =
  | "submitted"
  | "document_verified"
  | "shortlisted"
  | "seat_allotted"
  | "provisional_admitted"
  | "rejected";

export type QuotaCategory =
  | "All India Open (General)"
  | "OBC-NCL"
  | "SC"
  | "ST"
  | "EWS"
  | "Defense & PwD"
  | "Supernumerary International";

export type CounselingRound =
  | "Round 1 (Merit Allocation)"
  | "Round 2 (Upgradation Round)"
  | "Round 3 (Special Round)"
  | "Spot & Mop-Up Round";

export type CampusTourMode = "In-Person Welcome Center" | "Virtual 360 Video Tour";

export interface AcademicProgram {
  id: string;
  college_id: string;
  program_code: string;
  program_name: string;
  department: string;
  degree_level: ProgramDegreeLevel;
  duration_years: number;
  total_seats: number;
  available_seats: number;
  annual_tuition_inr: number;
  eligibility_cutoff: string;
  accreditation: string;
  application_deadline: string;
  is_admissions_open: boolean;
  brochure_url?: string;
  created_at?: string;
}

export interface AdmissionApplication {
  id: string;
  college_id: string;
  application_number: string;
  candidate_name: string;
  email: string;
  phone: string;
  program_code: string;
  program_name: string;
  quota_category: QuotaCategory;
  entrance_exam: string;
  entrance_score_rank: string;
  qualifying_percentage: number;
  statement_of_purpose: string;
  status: AdmissionApplicationStatus;
  allotment_token?: string | null;
  provisional_letter_id?: string | null;
  application_fee_paid: boolean;
  applied_at: string;
  created_at?: string;
}

export interface SeatAllotmentDocket {
  id: string;
  college_id: string;
  allotment_number: string;
  candidate_name: string;
  application_number: string;
  program_code: string;
  program_name: string;
  counseling_round: CounselingRound;
  allotted_category: QuotaCategory;
  merit_rank: number;
  acceptance_deadline: string;
  seat_lock_deposit_inr: number;
  is_seat_accepted: boolean;
  provisional_letter_url: string;
  created_at?: string;
}

export interface CampusTourBooking {
  id: string;
  college_id: string;
  booking_code: string;
  candidate_name: string;
  email: string;
  phone: string;
  preferred_date: string;
  time_slot: string;
  tour_mode: CampusTourMode;
  assigned_counselor: string;
  guests_count: number;
  status: "confirmed" | "completed" | "rescheduled";
  created_at?: string;
}

export interface AdmissionsOverviewStats {
  totalProgramsCount: number;
  totalIntakeSeats: number;
  totalApplicationsReceived: number;
  totalSeatsAllotted: number;
  programs: AcademicProgram[];
  applications: AdmissionApplication[];
  allotments: SeatAllotmentDocket[];
  tourBookings: CampusTourBooking[];
}

// --- Phase 43: Smart Campus Parent & Guardian Connect ---

export type GuardianRelationship =
  | "Father"
  | "Mother"
  | "Legal Guardian"
  | "Host Family";

export type GuardianOutpassStatus = "pending" | "approved" | "rejected";

export type PTMConsultationMode =
  | "Virtual Google Meet"
  | "In-Person Proctor Cabin";

export type PTMSlotStatus = "scheduled" | "completed" | "cancelled";

export type FeeClearanceStatus = "cleared" | "due" | "partially_paid";

export interface CourseAttendanceRecord {
  courseCode: string;
  courseTitle: string;
  facultyName: string;
  totalConducted: number;
  totalAttended: number;
  attendancePercentage: number;
  isBelowMandate: boolean; // <75% statutory mandate
}

export interface GuardianProfile {
  id: string;
  college_id: string;
  guardian_name: string;
  email: string;
  phone: string;
  relationship: GuardianRelationship;
  emergency_contact: string;
  residential_address?: string;
  is_identity_verified: boolean;
  created_at?: string;
}

export interface WardTelemetry {
  id: string;
  college_id: string;
  guardian_id: string;
  student_id: string;
  student_name: string;
  roll_number: string;
  department: string;
  academic_year: number;
  semester: number;
  cumulative_cgpa: number;
  overall_attendance_pct: number;
  theory_attendance_pct: number;
  practical_attendance_pct: number;
  fee_dues_inr: number;
  fee_status: FeeClearanceStatus;
  assigned_proctor_name: string;
  assigned_proctor_email: string;
  hostel_room: string;
  courseBreakdown: CourseAttendanceRecord[];
  created_at?: string;
}

export interface GuardianOutpassApproval {
  id: string;
  college_id: string;
  ward_id: string;
  student_name: string;
  roll_number: string;
  destination_city: string;
  leave_start_date: string;
  return_expected_date: string;
  reason: string;
  outpass_token: string;
  guardian_status: GuardianOutpassStatus;
  warden_status: "awaiting_guardian" | "approved_by_warden" | "rejected_by_warden";
  guardian_action_at?: string | null;
  guardian_remarks?: string | null;
  created_at?: string;
}

export interface PTMConsultationSlot {
  id: string;
  college_id: string;
  ward_id: string;
  faculty_proctor_name: string;
  faculty_proctor_designation: string;
  consultation_mode: PTMConsultationMode;
  scheduled_date: string;
  time_slot: string;
  agenda: string;
  booking_token: string;
  status: PTMSlotStatus;
  meeting_link?: string;
  proctor_notes?: string;
  created_at?: string;
}

export interface ParentPortalOverviewStats {
  guardian: GuardianProfile;
  ward: WardTelemetry;
  pendingOutpassCount: number;
  totalOutpasses: number;
  outpasses: GuardianOutpassApproval[];
  ptmSlots: PTMConsultationSlot[];
  overallAttendancePct: number;
  isAttendanceCritical: boolean;
}

// ================================================================
// Phase 44 — Smart Campus Teaching Assistantships, Graduate Fellowships & Work-Study Ledger
// ================================================================

export type FellowshipType =
  | "teaching_assistant"
  | "research_assistant"
  | "lab_demonstrator"
  | "work_study"
  | "maker_proctor";

export type FellowshipApplicationStatus =
  | "submitted"
  | "shortlisted"
  | "interview_scheduled"
  | "appointed"
  | "rejected";

export type TimesheetApprovalStatus =
  | "draft"
  | "submitted"
  | "faculty_approved"
  | "rejected";

export type DutyCategory =
  | "tutorial_conduct"
  | "laboratory_supervision"
  | "grading_assessments"
  | "office_hours"
  | "research_experiments";

export type DisbursementStatus =
  | "pending"
  | "escrow_locked"
  | "disbursed"
  | "on_hold";

export interface FellowshipPosition {
  id: string;
  college_id: string;
  title: string;
  position_type: FellowshipType;
  department: string;
  course_code?: string;
  course_name?: string;
  faculty_supervisor_name: string;
  faculty_supervisor_email: string;
  monthly_stipend_inr: number;
  required_hours_per_week: number;
  open_slots: number;
  filled_slots: number;
  min_cgpa_requirement: number;
  prerequisite_course_grade?: string;
  description: string;
  responsibilities: string[];
  academic_term: string;
  application_deadline: string;
  is_active: boolean;
  created_at?: string;
}

export interface FellowshipApplication {
  id: string;
  college_id: string;
  position_id: string;
  student_id: string;
  student_name: string;
  roll_number: string;
  department: string;
  student_cgpa: number;
  course_grade: string;
  statement_of_purpose: string;
  portfolio_url?: string;
  weekly_availability_hours: number;
  application_token: string;
  status: FellowshipApplicationStatus;
  appointment_token?: string;
  appointed_at?: string;
  faculty_feedback?: string;
  position?: FellowshipPosition;
  created_at?: string;
}

export interface FellowshipTimesheet {
  id: string;
  college_id: string;
  application_id: string;
  student_name: string;
  roll_number: string;
  week_start_date: string;
  week_end_date: string;
  hours_logged: number;
  duty_type: DutyCategory;
  duty_summary: string;
  supervisor_feedback?: string;
  approval_status: TimesheetApprovalStatus;
  approved_by_supervisor?: string;
  approved_at?: string;
  created_at?: string;
}

export interface FellowshipDisbursement {
  id: string;
  college_id: string;
  student_id: string;
  student_name: string;
  roll_number: string;
  fellowship_title: string;
  disbursement_month: string;
  gross_stipend_inr: number;
  attendance_deductions_inr: number;
  net_stipend_inr: number;
  dbt_bank_account_mask: string;
  utr_transaction_number: string;
  voucher_token: string;
  status: DisbursementStatus;
  disbursed_at: string;
  created_at?: string;
}

export interface FellowshipOverviewStats {
  totalPositions: number;
  activeAppointments: number;
  totalMonthlyStipendOutlay: number;
  pendingTimesheetApprovals: number;
  positions: FellowshipPosition[];
  applications: FellowshipApplication[];
  timesheets: FellowshipTimesheet[];
  disbursements: FellowshipDisbursement[];
}

// ================================================================
// Phase 45 — Smart Campus Industry MoUs, Corporate CSR & Sponsored Research Partnerships Hub
// ================================================================

export type MoUTier = "strategic" | "core" | "affiliate" | "startup_incubator";

export type GrantType =
  | "sponsored_research"
  | "corporate_csr"
  | "faculty_chair"
  | "student_hackathon";

export type GrantStatus =
  | "proposed"
  | "under_review"
  | "awarded"
  | "active"
  | "completed";

export type LabAccessTier =
  | "open_campus"
  | "students_and_faculty"
  | "research_fellows_only"
  | "restricted_clearance";

export type LicenseType = "exclusive" | "non_exclusive" | "evaluation_only";

export type LicenseStatus =
  | "inquiry"
  | "term_sheet"
  | "executed"
  | "royalty_bearing"
  | "terminated";

export interface IndustryMoU {
  id: string;
  college_id?: string;
  partner_name: string;
  partner_logo?: string;
  partner_tier: MoUTier;
  industry_sector: string;
  mou_token: string;
  valid_from: string;
  valid_to: string;
  scope: string;
  key_objectives: string[];
  executive_sponsor: string;
  nodal_faculty_coordinator: string;
  financial_commitment_inr: number;
  status: "active" | "pending_renewal" | "expired" | "under_draft";
  signed_document_url?: string;
  is_active: boolean;
  created_at?: string;
}

export interface SponsoredGrantMilestone {
  title: string;
  target_date: string;
  delivered: boolean;
  completion_pct: number;
}

export interface SponsoredGrant {
  id: string;
  college_id?: string;
  project_title: string;
  mou_id?: string;
  sponsor_name: string;
  grant_type: GrantType;
  principal_investigator: string;
  co_investigators: string[];
  department: string;
  grant_amount_inr: number;
  disbursed_amount_inr: number;
  grant_token: string;
  milestones: SponsoredGrantMilestone[];
  deliverables: string[];
  status: GrantStatus;
  start_date: string;
  end_date: string;
  created_at?: string;
}

export interface IndustryLab {
  id: string;
  college_id?: string;
  lab_name: string;
  mou_id?: string;
  industry_partner: string;
  facility_location: string;
  sponsored_equipment: string[];
  compute_quota_teraflops: number;
  access_tier: LabAccessTier;
  active_scholars: number;
  lab_director: string;
  status: "operational" | "under_commissioning" | "maintenance" | "decommissioned";
  created_at?: string;
}

export interface TechnologyLicense {
  id: string;
  college_id?: string;
  patent_title: string;
  patent_number?: string;
  inventors: string[];
  licensee_org: string;
  licensing_token: string;
  trl_level: number;
  license_type: LicenseType;
  royalty_terms: string;
  upfront_fee_inr: number;
  filing_date: string;
  status: LicenseStatus;
  created_at?: string;
}

export interface PartnershipsOverviewStats {
  totalActiveMoUs: number;
  totalCommittedCapitalInr: number;
  activeSponsoredGrants: number;
  totalGrantFundingInr: number;
  coBrandedIndustryLabs: number;
  patentsLicensedCount: number;
  mous: IndustryMoU[];
  grants: SponsoredGrant[];
  labs: IndustryLab[];
  licenses: TechnologyLicense[];
}



