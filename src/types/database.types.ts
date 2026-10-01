// ================================================================
// CampusLens AI — Supabase Database Types
// Complete schema types for Colleges, Departments, Profiles,
// Locations, Faculty, Timetable, Notices, Events, Facilities,
// Help Requests, Notifications, Bookmarks, and AI Assistant
// ================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "student" | "faculty" | "hod" | "admin";
export type LocationCategory =
  | "academic"
  | "library"
  | "laboratory"
  | "sports"
  | "cafeteria"
  | "auditorium"
  | "administrative"
  | "hostel"
  | "facility"
  | "parking";
export type NoticePriority = "normal" | "important" | "urgent";
export type NoticeCategory =
  | "academic"
  | "exam"
  | "event"
  | "administrative"
  | "placement"
  | "sports"
  | "general";
export type EventCategory =
  | "academic"
  | "cultural"
  | "sports"
  | "tech"
  | "workshop"
  | "seminar"
  | "hackathon"
  | "other";
export type RequestPriority = "low" | "medium" | "high" | "urgent";
export type RequestStatus =
  | "submitted"
  | "under_review"
  | "in_progress"
  | "resolved"
  | "closed";
export type NotificationType =
  | "notice"
  | "event"
  | "timetable"
  | "query"
  | "announcement"
  | "system";
export type BookmarkType = "location" | "notice" | "event" | "faculty";
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

export type HostelGender = "boys" | "girls" | "coed";
export type HostelRoomType = "single" | "double" | "triple" | "quad";
export type AllocationStatus = "active" | "vacated" | "suspended";
export type MealType = "breakfast" | "lunch" | "snacks" | "dinner";
export type MessDayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export type OutPassStatus = "pending" | "approved" | "rejected" | "departed" | "returned" | "overdue";
export type GrievanceCategory = "plumbing" | "electrical" | "carpentry" | "cleanliness" | "wifi" | "other";
export type GrievancePriority = "low" | "medium" | "high" | "urgent";
export type GrievanceStatus = "reported" | "assigned" | "in_progress" | "resolved";

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
export type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "no_show";
export type MedicalLeaveStatus = "pending" | "approved" | "rejected";
export type EmergencySOSType = "cardiac" | "trauma" | "asthma" | "fainting" | "general";
export type EmergencySOSStatus = "dispatched" | "en_route" | "attended" | "resolved";

export type ClubCategory = "technical" | "cultural" | "sports" | "literary" | "social";
export type ClubRole = "member" | "core_team" | "lead" | "treasurer";
export type ActivityType = "hackathon" | "workshop" | "cultural_performance" | "sports_meet" | "paper_presentation";

export interface Database {
  public: {
    Tables: {
      colleges: {
        Row: {
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
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          description?: string | null;
          logo_url?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          website?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          description?: string | null;
          logo_url?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          website?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      departments: {
        Row: {
          id: string;
          college_id: string;
          name: string;
          code: string;
          description: string | null;
          building: string | null;
          room_number: string | null;
          contact_email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          name: string;
          code: string;
          description?: string | null;
          building?: string | null;
          room_number?: string | null;
          contact_email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          name?: string;
          code?: string;
          description?: string | null;
          building?: string | null;
          room_number?: string | null;
          contact_email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "departments_college_id_fkey";
            columns: ["college_id"];
            isOneToOne: false;
            referencedRelation: "colleges";
            referencedColumns: ["id"];
          }
        ];
      };

      profiles: {
        Row: {
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
          updated_at: string;
        };
        Insert: {
          id: string;
          college_id: string;
          full_name: string;
          email: string;
          student_id?: string | null;
          department_id?: string | null;
          year?: number | null;
          division?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          full_name?: string;
          email?: string;
          student_id?: string | null;
          department_id?: string | null;
          year?: number | null;
          division?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_college_id_fkey";
            columns: ["college_id"];
            isOneToOne: false;
            referencedRelation: "colleges";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_department_id_fkey";
            columns: ["department_id"];
            isOneToOne: false;
            referencedRelation: "departments";
            referencedColumns: ["id"];
          }
        ];
      };

      locations: {
        Row: {
          id: string;
          college_id: string;
          name: string;
          code: string | null;
          category: LocationCategory;
          building: string;
          floor: string | null;
          room_number: string | null;
          latitude: number;
          longitude: number;
          description: string | null;
          image_url: string | null;
          amenities: string[] | null;
          is_accessible: boolean;
          opening_time: string | null;
          closing_time: string | null;
          contact_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          name: string;
          code?: string | null;
          category?: LocationCategory;
          building: string;
          floor?: string | null;
          room_number?: string | null;
          latitude: number;
          longitude: number;
          description?: string | null;
          image_url?: string | null;
          amenities?: string[] | null;
          is_accessible?: boolean;
          opening_time?: string | null;
          closing_time?: string | null;
          contact_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          name?: string;
          code?: string | null;
          category?: LocationCategory;
          building?: string;
          floor?: string | null;
          room_number?: string | null;
          latitude?: number;
          longitude?: number;
          description?: string | null;
          image_url?: string | null;
          amenities?: string[] | null;
          is_accessible?: boolean;
          opening_time?: string | null;
          closing_time?: string | null;
          contact_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "locations_college_id_fkey";
            columns: ["college_id"];
            isOneToOne: false;
            referencedRelation: "colleges";
            referencedColumns: ["id"];
          }
        ];
      };

      faculty: {
        Row: {
          id: string;
          college_id: string;
          department_id: string;
          profile_id: string | null;
          name: string;
          designation: string;
          email: string;
          phone: string | null;
          office_room: string | null;
          bio: string | null;
          avatar_url: string | null;
          qualifications: string | null;
          specializations: string[] | null;
          office_hours: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          department_id: string;
          profile_id?: string | null;
          name: string;
          designation: string;
          email: string;
          phone?: string | null;
          office_room?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          qualifications?: string | null;
          specializations?: string[] | null;
          office_hours?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          department_id?: string;
          profile_id?: string | null;
          name?: string;
          designation?: string;
          email?: string;
          phone?: string | null;
          office_room?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          qualifications?: string | null;
          specializations?: string[] | null;
          office_hours?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "faculty_college_id_fkey";
            columns: ["college_id"];
            isOneToOne: false;
            referencedRelation: "colleges";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "faculty_department_id_fkey";
            columns: ["department_id"];
            isOneToOne: false;
            referencedRelation: "departments";
            referencedColumns: ["id"];
          }
        ];
      };

      timetable: {
        Row: {
          id: string;
          college_id: string;
          department_id: string;
          year: number;
          division: string;
          day_of_week: string;
          start_time: string;
          end_time: string;
          subject_name: string;
          subject_code: string;
          faculty_id: string | null;
          faculty_name: string | null;
          room_number: string;
          location_id: string | null;
          type: "lecture" | "lab" | "tutorial";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          department_id: string;
          year: number;
          division: string;
          day_of_week: string;
          start_time: string;
          end_time: string;
          subject_name: string;
          subject_code: string;
          faculty_id?: string | null;
          faculty_name?: string | null;
          room_number: string;
          location_id?: string | null;
          type?: "lecture" | "lab" | "tutorial";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          department_id?: string;
          year?: number;
          division?: string;
          day_of_week?: string;
          start_time?: string;
          end_time?: string;
          subject_name?: string;
          subject_code?: string;
          faculty_id?: string | null;
          faculty_name?: string | null;
          room_number?: string;
          location_id?: string | null;
          type?: "lecture" | "lab" | "tutorial";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "timetable_college_id_fkey";
            columns: ["college_id"];
            isOneToOne: false;
            referencedRelation: "colleges";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "timetable_department_id_fkey";
            columns: ["department_id"];
            isOneToOne: false;
            referencedRelation: "departments";
            referencedColumns: ["id"];
          }
        ];
      };

      notices: {
        Row: {
          id: string;
          college_id: string;
          department_id: string | null;
          title: string;
          content: string;
          priority: NoticePriority;
          category: NoticeCategory;
          author_id: string | null;
          author_name: string;
          published_at: string;
          expires_at: string | null;
          attachments: Json | null;
          is_pinned: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          department_id?: string | null;
          title: string;
          content: string;
          priority?: NoticePriority;
          category?: NoticeCategory;
          author_id?: string | null;
          author_name?: string;
          published_at?: string;
          expires_at?: string | null;
          attachments?: Json | null;
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          department_id?: string | null;
          title?: string;
          content?: string;
          priority?: NoticePriority;
          category?: NoticeCategory;
          author_id?: string | null;
          author_name?: string;
          published_at?: string;
          expires_at?: string | null;
          attachments?: Json | null;
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notices_college_id_fkey";
            columns: ["college_id"];
            isOneToOne: false;
            referencedRelation: "colleges";
            referencedColumns: ["id"];
          }
        ];
      };

      events: {
        Row: {
          id: string;
          college_id: string;
          department_id: string | null;
          title: string;
          description: string;
          category: EventCategory;
          start_date: string;
          end_date: string | null;
          location_id: string | null;
          venue_name: string;
          organizer: string;
          registration_link: string | null;
          image_url: string | null;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          department_id?: string | null;
          title: string;
          description: string;
          category?: EventCategory;
          start_date: string;
          end_date?: string | null;
          location_id?: string | null;
          venue_name: string;
          organizer: string;
          registration_link?: string | null;
          image_url?: string | null;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          department_id?: string | null;
          title?: string;
          description?: string;
          category?: EventCategory;
          start_date?: string;
          end_date?: string | null;
          location_id?: string | null;
          venue_name?: string;
          organizer?: string;
          registration_link?: string | null;
          image_url?: string | null;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "events_college_id_fkey";
            columns: ["college_id"];
            isOneToOne: false;
            referencedRelation: "colleges";
            referencedColumns: ["id"];
          }
        ];
      };

      facilities: {
        Row: {
          id: string;
          college_id: string;
          location_id: string | null;
          name: string;
          category: string;
          description: string | null;
          timings: string | null;
          in_charge: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          location_id?: string | null;
          name: string;
          category: string;
          description?: string | null;
          timings?: string | null;
          in_charge?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          location_id?: string | null;
          name?: string;
          category?: string;
          description?: string | null;
          timings?: string | null;
          in_charge?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "facilities_college_id_fkey";
            columns: ["college_id"];
            isOneToOne: false;
            referencedRelation: "colleges";
            referencedColumns: ["id"];
          }
        ];
      };

      help_requests: {
        Row: {
          id: string;
          college_id: string;
          student_id: string;
          department_id: string | null;
          category: string;
          subject: string;
          description: string;
          priority: RequestPriority;
          status: RequestStatus;
          assigned_to: string | null;
          resolution_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          student_id: string;
          department_id?: string | null;
          category: string;
          subject: string;
          description: string;
          priority?: RequestPriority;
          status?: RequestStatus;
          assigned_to?: string | null;
          resolution_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          student_id?: string;
          department_id?: string | null;
          category?: string;
          subject?: string;
          description?: string;
          priority?: RequestPriority;
          status?: RequestStatus;
          assigned_to?: string | null;
          resolution_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "help_requests_college_id_fkey";
            columns: ["college_id"];
            isOneToOne: false;
            referencedRelation: "colleges";
            referencedColumns: ["id"];
          }
        ];
      };

      help_request_replies: {
        Row: {
          id: string;
          request_id: string;
          sender_id: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          sender_id: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          sender_id?: string;
          message?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      notifications: {
        Row: {
          id: string;
          user_id: string;
          college_id: string;
          title: string;
          message: string;
          type: NotificationType;
          link: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          college_id: string;
          title: string;
          message: string;
          type?: NotificationType;
          link?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          college_id?: string;
          title?: string;
          message?: string;
          type?: NotificationType;
          link?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };

      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          entity_type: BookmarkType;
          entity_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          entity_type: BookmarkType;
          entity_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          entity_type?: BookmarkType;
          entity_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      ai_conversations: {
        Row: {
          id: string;
          user_id: string;
          college_id: string;
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          college_id: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          college_id?: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      ai_messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender: "user" | "assistant";
          content: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender: "user" | "assistant";
          content: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender?: "user" | "assistant";
          content?: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };

      facility_bookings: {
        Row: {
          id: string;
          college_id: string;
          facility_id: string;
          user_id: string;
          booking_date: string;
          start_time: string;
          end_time: string;
          purpose: string;
          attendees_count: number;
          status: "pending" | "approved" | "rejected" | "cancelled" | "completed";
          booking_pass_code: string;
          approved_by: string | null;
          rejection_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          facility_id: string;
          user_id: string;
          booking_date: string;
          start_time: string;
          end_time: string;
          purpose: string;
          attendees_count?: number;
          status?: "pending" | "approved" | "rejected" | "cancelled" | "completed";
          booking_pass_code: string;
          approved_by?: string | null;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          facility_id?: string;
          user_id?: string;
          booking_date?: string;
          start_time?: string;
          end_time?: string;
          purpose?: string;
          attendees_count?: number;
          status?: "pending" | "approved" | "rejected" | "cancelled" | "completed";
          booking_pass_code?: string;
          approved_by?: string | null;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      exam_schedules: {
        Row: {
          id: string;
          college_id: string;
          department_id: string | null;
          semester: string;
          subject_code: string;
          subject_name: string;
          exam_date: string;
          start_time: string;
          end_time: string;
          room_number: string;
          building_name: string;
          total_marks: number;
          exam_type: "mid_term" | "end_sem" | "practical" | "viva";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          department_id?: string | null;
          semester: string;
          subject_code: string;
          subject_name: string;
          exam_date: string;
          start_time: string;
          end_time: string;
          room_number: string;
          building_name?: string;
          total_marks?: number;
          exam_type?: "mid_term" | "end_sem" | "practical" | "viva";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          department_id?: string | null;
          semester?: string;
          subject_code?: string;
          subject_name?: string;
          exam_date?: string;
          start_time?: string;
          end_time?: string;
          room_number?: string;
          building_name?: string;
          total_marks?: number;
          exam_type?: "mid_term" | "end_sem" | "practical" | "viva";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      exam_hall_tickets: {
        Row: {
          id: string;
          college_id: string;
          student_id: string;
          semester: string;
          hall_ticket_number: string;
          is_eligible: boolean;
          attendance_percentage: number;
          fee_clearance: boolean;
          qr_verification_code: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          student_id: string;
          semester: string;
          hall_ticket_number: string;
          is_eligible?: boolean;
          attendance_percentage?: number;
          fee_clearance?: boolean;
          qr_verification_code: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          student_id?: string;
          semester?: string;
          hall_ticket_number?: string;
          is_eligible?: boolean;
          attendance_percentage?: number;
          fee_clearance?: boolean;
          qr_verification_code?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      exam_seating_allocations: {
        Row: {
          id: string;
          exam_schedule_id: string;
          student_id: string;
          roll_number: string;
          room_number: string;
          floor: string;
          bench_number: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          exam_schedule_id: string;
          student_id: string;
          roll_number: string;
          room_number: string;
          floor: string;
          bench_number: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          exam_schedule_id?: string;
          student_id?: string;
          roll_number?: string;
          room_number?: string;
          floor?: string;
          bench_number?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      student_grade_records: {
        Row: {
          id: string;
          student_id: string;
          college_id: string;
          semester: string;
          subject_code: string;
          subject_name: string;
          credits: number;
          internal_marks: number;
          endsem_marks: number;
          total_marks: number;
          grade: "O" | "A+" | "A" | "B+" | "B" | "C" | "F";
          grade_point: number;
          status: "passed" | "failed" | "under_revaluation";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          college_id: string;
          semester: string;
          subject_code: string;
          subject_name: string;
          credits?: number;
          internal_marks: number;
          endsem_marks: number;
          total_marks: number;
          grade: "O" | "A+" | "A" | "B+" | "B" | "C" | "F";
          grade_point: number;
          status?: "passed" | "failed" | "under_revaluation";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          college_id?: string;
          semester?: string;
          subject_code?: string;
          subject_name?: string;
          credits?: number;
          internal_marks?: number;
          endsem_marks?: number;
          total_marks?: number;
          grade?: "O" | "A+" | "A" | "B+" | "B" | "C" | "F";
          grade_point?: number;
          status?: "passed" | "failed" | "under_revaluation";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      placement_drives: {
        Row: {
          id: string;
          college_id: string;
          company_name: string;
          company_logo_url: string | null;
          role_title: string;
          drive_type: "full_time" | "internship" | "intern_to_fte";
          ctc_lpa: number;
          stipend_monthly: number | null;
          location: string;
          eligibility_min_cgpa: number;
          allowed_departments: string[];
          max_active_backlogs: number;
          application_deadline: string;
          drive_date: string;
          status: "upcoming" | "ongoing" | "completed" | "cancelled";
          job_description: string;
          skills_required: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          company_name: string;
          company_logo_url?: string | null;
          role_title: string;
          drive_type: "full_time" | "internship" | "intern_to_fte";
          ctc_lpa?: number;
          stipend_monthly?: number | null;
          location?: string;
          eligibility_min_cgpa?: number;
          allowed_departments?: string[];
          max_active_backlogs?: number;
          application_deadline: string;
          drive_date: string;
          status?: "upcoming" | "ongoing" | "completed" | "cancelled";
          job_description: string;
          skills_required?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          company_name?: string;
          company_logo_url?: string | null;
          role_title?: string;
          drive_type?: "full_time" | "internship" | "intern_to_fte";
          ctc_lpa?: number;
          stipend_monthly?: number | null;
          location?: string;
          eligibility_min_cgpa?: number;
          allowed_departments?: string[];
          max_active_backlogs?: number;
          application_deadline?: string;
          drive_date?: string;
          status?: "upcoming" | "ongoing" | "completed" | "cancelled";
          job_description?: string;
          skills_required?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      placement_applications: {
        Row: {
          id: string;
          drive_id: string;
          student_id: string;
          college_id: string;
          resume_url: string | null;
          current_cgpa: number;
          status: "applied" | "shortlisted" | "assessment_scheduled" | "interview_scheduled" | "offered" | "rejected" | "withdrawn";
          applied_at: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          drive_id: string;
          student_id: string;
          college_id: string;
          resume_url?: string | null;
          current_cgpa: number;
          status?: "applied" | "shortlisted" | "assessment_scheduled" | "interview_scheduled" | "offered" | "rejected" | "withdrawn";
          applied_at?: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          drive_id?: string;
          student_id?: string;
          college_id?: string;
          resume_url?: string | null;
          current_cgpa?: number;
          status?: "applied" | "shortlisted" | "assessment_scheduled" | "interview_scheduled" | "offered" | "rejected" | "withdrawn";
          applied_at?: string;
          notes?: string | null;
        };
        Relationships: [];
      };
      placement_interview_rounds: {
        Row: {
          id: string;
          application_id: string;
          drive_id: string;
          round_number: number;
          round_name: string;
          scheduled_at: string;
          duration_minutes: number;
          mode: "online" | "on_campus";
          venue_or_link: string;
          status: "scheduled" | "cleared" | "failed" | "rescheduled";
          feedback: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          drive_id: string;
          round_number?: number;
          round_name: string;
          scheduled_at: string;
          duration_minutes?: number;
          mode?: "online" | "on_campus";
          venue_or_link: string;
          status?: "scheduled" | "cleared" | "failed" | "rescheduled";
          feedback?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          drive_id?: string;
          round_number?: number;
          round_name?: string;
          scheduled_at?: string;
          duration_minutes?: number;
          mode?: "online" | "on_campus";
          venue_or_link?: string;
          status?: "scheduled" | "cleared" | "failed" | "rescheduled";
          feedback?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      placement_offers: {
        Row: {
          id: string;
          application_id: string;
          student_id: string;
          college_id: string;
          company_name: string;
          role_title: string;
          offered_ctc_lpa: number;
          bonus_joining: number | null;
          offer_letter_url: string | null;
          acceptance_status: "pending" | "accepted" | "declined";
          offer_date: string;
          valid_until: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          student_id: string;
          college_id: string;
          company_name: string;
          role_title: string;
          offered_ctc_lpa: number;
          bonus_joining?: number | null;
          offer_letter_url?: string | null;
          acceptance_status?: "pending" | "accepted" | "declined";
          offer_date?: string;
          valid_until: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          student_id?: string;
          college_id?: string;
          company_name?: string;
          role_title?: string;
          offered_ctc_lpa?: number;
          bonus_joining?: number | null;
          offer_letter_url?: string | null;
          acceptance_status?: "pending" | "accepted" | "declined";
          offer_date?: string;
          valid_until?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      student_fee_dues: {
        Row: {
          id: string;
          college_id: string;
          student_id: string;
          semester: string;
          academic_year: string;
          category: "tuition" | "hostel" | "library" | "examination" | "lab_equipment";
          amount_due: number;
          amount_paid: number;
          penalty_amount: number;
          due_date: string;
          status: "pending" | "partially_paid" | "paid" | "overdue";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          student_id: string;
          semester: string;
          academic_year?: string;
          category: "tuition" | "hostel" | "library" | "examination" | "lab_equipment";
          amount_due?: number;
          amount_paid?: number;
          penalty_amount?: number;
          due_date: string;
          status?: "pending" | "partially_paid" | "paid" | "overdue";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          student_id?: string;
          semester?: string;
          academic_year?: string;
          category?: "tuition" | "hostel" | "library" | "examination" | "lab_equipment";
          amount_due?: number;
          amount_paid?: number;
          penalty_amount?: number;
          due_date?: string;
          status?: "pending" | "partially_paid" | "paid" | "overdue";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      fee_payment_transactions: {
        Row: {
          id: string;
          fee_due_id: string;
          student_id: string;
          college_id: string;
          transaction_ref: string;
          payment_method: "upi" | "credit_card" | "debit_card" | "net_banking";
          amount_paid: number;
          payment_date: string;
          receipt_number: string;
          status: "success" | "pending" | "failed";
          gateway_response_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          fee_due_id: string;
          student_id: string;
          college_id: string;
          transaction_ref: string;
          payment_method: "upi" | "credit_card" | "debit_card" | "net_banking";
          amount_paid: number;
          payment_date?: string;
          receipt_number: string;
          status?: "success" | "pending" | "failed";
          gateway_response_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          fee_due_id?: string;
          student_id?: string;
          college_id?: string;
          transaction_ref?: string;
          payment_method?: "upi" | "credit_card" | "debit_card" | "net_banking";
          amount_paid?: number;
          payment_date?: string;
          receipt_number?: string;
          status?: "success" | "pending" | "failed";
          gateway_response_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      scholarship_programs: {
        Row: {
          id: string;
          college_id: string;
          title: string;
          provider: string;
          grant_amount: number;
          min_cgpa: number;
          max_family_income: number;
          deadline: string;
          status: "open" | "closed";
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          title: string;
          provider: string;
          grant_amount: number;
          min_cgpa?: number;
          max_family_income?: number;
          deadline: string;
          status?: "open" | "closed";
          description: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          title?: string;
          provider?: string;
          grant_amount?: number;
          min_cgpa?: number;
          max_family_income?: number;
          deadline?: string;
          status?: "open" | "closed";
          description?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      scholarship_applications: {
        Row: {
          id: string;
          scholarship_id: string;
          student_id: string;
          college_id: string;
          applied_at: string;
          status: "submitted" | "under_review" | "approved" | "disbursed" | "rejected";
          disbursed_amount: number;
          notes: string | null;
        };
        Insert: {
          id?: string;
          scholarship_id: string;
          student_id: string;
          college_id: string;
          applied_at?: string;
          status?: "submitted" | "under_review" | "approved" | "disbursed" | "rejected";
          disbursed_amount?: number;
          notes?: string | null;
        };
        Update: {
          id?: string;
          scholarship_id?: string;
          student_id?: string;
          college_id?: string;
          applied_at?: string;
          status?: "submitted" | "under_review" | "approved" | "disbursed" | "rejected";
          disbursed_amount?: number;
          notes?: string | null;
        };
        Relationships: [];
      };
      library_books: {
        Row: {
          id: string;
          college_id: string;
          title: string;
          author: string;
          isbn: string;
          category: BookCategory;
          publisher: string;
          edition: string | null;
          call_number: string;
          shelf_location: string;
          total_copies: number;
          available_copies: number;
          cover_image_url: string | null;
          description: string | null;
          is_digital_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          title: string;
          author: string;
          isbn: string;
          category: BookCategory;
          publisher: string;
          edition?: string | null;
          call_number: string;
          shelf_location: string;
          total_copies?: number;
          available_copies?: number;
          cover_image_url?: string | null;
          description?: string | null;
          is_digital_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          title?: string;
          author?: string;
          isbn?: string;
          category?: BookCategory;
          publisher?: string;
          edition?: string | null;
          call_number?: string;
          shelf_location?: string;
          total_copies?: number;
          available_copies?: number;
          cover_image_url?: string | null;
          description?: string | null;
          is_digital_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      library_borrow_records: {
        Row: {
          id: string;
          college_id: string;
          book_id: string;
          student_id: string;
          borrow_pass_code: string;
          borrowed_at: string;
          due_date: string;
          returned_at: string | null;
          renewal_count: number;
          max_renewals: number;
          fine_amount: number;
          fine_paid: boolean;
          status: BorrowStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          book_id: string;
          student_id: string;
          borrow_pass_code: string;
          borrowed_at?: string;
          due_date: string;
          returned_at?: string | null;
          renewal_count?: number;
          max_renewals?: number;
          fine_amount?: number;
          fine_paid?: boolean;
          status?: BorrowStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          book_id?: string;
          student_id?: string;
          borrow_pass_code?: string;
          borrowed_at?: string;
          due_date?: string;
          returned_at?: string | null;
          renewal_count?: number;
          max_renewals?: number;
          fine_amount?: number;
          fine_paid?: boolean;
          status?: BorrowStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      library_reservations: {
        Row: {
          id: string;
          college_id: string;
          book_id: string;
          student_id: string;
          reservation_code: string;
          status: ReservationStatus;
          reserved_at: string;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          book_id: string;
          student_id: string;
          reservation_code: string;
          status?: ReservationStatus;
          reserved_at?: string;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          book_id?: string;
          student_id?: string;
          reservation_code?: string;
          status?: ReservationStatus;
          reserved_at?: string;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      library_e_resources: {
        Row: {
          id: string;
          college_id: string;
          title: string;
          type: EResourceType;
          publisher: string;
          access_url: string;
          department_id: string | null;
          downloads_count: number;
          is_open_access: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          title: string;
          type: EResourceType;
          publisher: string;
          access_url: string;
          department_id?: string | null;
          downloads_count?: number;
          is_open_access?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          title?: string;
          type?: EResourceType;
          publisher?: string;
          access_url?: string;
          department_id?: string | null;
          downloads_count?: number;
          is_open_access?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      hostel_blocks: {
        Row: {
          id: string;
          college_id: string;
          name: string;
          gender: HostelGender;
          total_floors: number;
          total_rooms: number;
          warden_name: string;
          warden_phone: string;
          warden_email: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          name: string;
          gender: HostelGender;
          total_floors?: number;
          total_rooms?: number;
          warden_name: string;
          warden_phone: string;
          warden_email: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          name?: string;
          gender?: HostelGender;
          total_floors?: number;
          total_rooms?: number;
          warden_name?: string;
          warden_phone?: string;
          warden_email?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      hostel_rooms: {
        Row: {
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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          block_id: string;
          room_number: string;
          floor: number;
          capacity?: number;
          occupied_count?: number;
          room_type?: HostelRoomType;
          monthly_rent?: number;
          ac_enabled?: boolean;
          amenities?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          block_id?: string;
          room_number?: string;
          floor?: number;
          capacity?: number;
          occupied_count?: number;
          room_type?: HostelRoomType;
          monthly_rent?: number;
          ac_enabled?: boolean;
          amenities?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      hostel_allocations: {
        Row: {
          id: string;
          college_id: string;
          room_id: string;
          student_id: string;
          bed_number: string;
          academic_year: string;
          status: AllocationStatus;
          allocated_at: string;
          vacated_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          room_id: string;
          student_id: string;
          bed_number: string;
          academic_year: string;
          status?: AllocationStatus;
          allocated_at?: string;
          vacated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          room_id?: string;
          student_id?: string;
          bed_number?: string;
          academic_year?: string;
          status?: AllocationStatus;
          allocated_at?: string;
          vacated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      hostel_mess_menus: {
        Row: {
          id: string;
          college_id: string;
          day_of_week: MessDayOfWeek;
          meal_type: MealType;
          timings: string;
          items: string[];
          special_item: string | null;
          calories_approx: number;
          dietary_tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          day_of_week: MessDayOfWeek;
          meal_type: MealType;
          timings: string;
          items: string[];
          special_item?: string | null;
          calories_approx?: number;
          dietary_tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          day_of_week?: MessDayOfWeek;
          meal_type?: MealType;
          timings?: string;
          items?: string[];
          special_item?: string | null;
          calories_approx?: number;
          dietary_tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      hostel_out_passes: {
        Row: {
          id: string;
          college_id: string;
          student_id: string;
          pass_code: string;
          destination: string;
          reason: string;
          departure_time: string;
          expected_return: string;
          actual_return: string | null;
          parent_contact: string;
          parent_consent_verified: boolean;
          status: OutPassStatus;
          warden_remarks: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          student_id: string;
          pass_code: string;
          destination: string;
          reason: string;
          departure_time: string;
          expected_return: string;
          actual_return?: string | null;
          parent_contact: string;
          parent_consent_verified?: boolean;
          status?: OutPassStatus;
          warden_remarks?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          student_id?: string;
          pass_code?: string;
          destination?: string;
          reason?: string;
          departure_time?: string;
          expected_return?: string;
          actual_return?: string | null;
          parent_contact?: string;
          parent_consent_verified?: boolean;
          status?: OutPassStatus;
          warden_remarks?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      hostel_grievances: {
        Row: {
          id: string;
          college_id: string;
          student_id: string;
          room_id: string | null;
          category: GrievanceCategory;
          priority: GrievancePriority;
          title: string;
          description: string;
          status: GrievanceStatus;
          assigned_to: string | null;
          resolved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          student_id: string;
          room_id?: string | null;
          category: GrievanceCategory;
          priority?: GrievancePriority;
          title: string;
          description: string;
          status?: GrievanceStatus;
          assigned_to?: string | null;
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          student_id?: string;
          room_id?: string | null;
          category?: GrievanceCategory;
          priority?: GrievancePriority;
          title?: string;
          description?: string;
          status?: GrievanceStatus;
          assigned_to?: string | null;
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      student_health_profiles: {
        Row: {
          id: string;
          college_id: string;
          student_id: string;
          blood_group: BloodGroup;
          allergies: string[];
          chronic_conditions: string[];
          emergency_contact_name: string;
          emergency_contact_phone: string;
          emergency_contact_relation: string;
          insurance_policy_no: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          student_id: string;
          blood_group: BloodGroup;
          allergies?: string[];
          chronic_conditions?: string[];
          emergency_contact_name: string;
          emergency_contact_phone: string;
          emergency_contact_relation: string;
          insurance_policy_no?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          student_id?: string;
          blood_group?: BloodGroup;
          allergies?: string[];
          chronic_conditions?: string[];
          emergency_contact_name?: string;
          emergency_contact_phone?: string;
          emergency_contact_relation?: string;
          insurance_policy_no?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      health_appointments: {
        Row: {
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
          prescription_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          student_id: string;
          doctor_name: string;
          specialization: string;
          appointment_date: string;
          time_slot: string;
          token_number: number;
          symptoms: string;
          status?: AppointmentStatus;
          prescription_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          student_id?: string;
          doctor_name?: string;
          specialization?: string;
          appointment_date?: string;
          time_slot?: string;
          token_number?: number;
          symptoms?: string;
          status?: AppointmentStatus;
          prescription_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      medical_leave_requests: {
        Row: {
          id: string;
          college_id: string;
          student_id: string;
          leave_code: string;
          start_date: string;
          end_date: string;
          total_days: number;
          reason: string;
          doctor_certificate_url: string | null;
          attendance_waiver_granted: boolean;
          verified_by: string | null;
          status: MedicalLeaveStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          student_id: string;
          leave_code: string;
          start_date: string;
          end_date: string;
          total_days: number;
          reason: string;
          doctor_certificate_url?: string | null;
          attendance_waiver_granted?: boolean;
          verified_by?: string | null;
          status?: MedicalLeaveStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          student_id?: string;
          leave_code?: string;
          start_date?: string;
          end_date?: string;
          total_days?: number;
          reason?: string;
          doctor_certificate_url?: string | null;
          attendance_waiver_granted?: boolean;
          verified_by?: string | null;
          status?: MedicalLeaveStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      dispensary_medicines: {
        Row: {
          id: string;
          college_id: string;
          name: string;
          generic_name: string;
          dosage: string;
          available_quantity: number;
          unit: string;
          requires_prescription: boolean;
          is_in_stock: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          name: string;
          generic_name: string;
          dosage: string;
          available_quantity?: number;
          unit?: string;
          requires_prescription?: boolean;
          is_in_stock?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          name?: string;
          generic_name?: string;
          dosage?: string;
          available_quantity?: number;
          unit?: string;
          requires_prescription?: boolean;
          is_in_stock?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      emergency_sos_dispatches: {
        Row: {
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
          responder_notes: string | null;
          triggered_at: string;
          resolved_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          student_id: string;
          sos_ticket_code: string;
          latitude: number;
          longitude: number;
          building_reference: string;
          emergency_type?: EmergencySOSType;
          ambulance_dispatched?: boolean;
          status?: EmergencySOSStatus;
          responder_notes?: string | null;
          triggered_at?: string;
          resolved_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          student_id?: string;
          sos_ticket_code?: string;
          latitude?: number;
          longitude?: number;
          building_reference?: string;
          emergency_type?: EmergencySOSType;
          ambulance_dispatched?: boolean;
          status?: EmergencySOSStatus;
          responder_notes?: string | null;
          triggered_at?: string;
          resolved_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      student_clubs: {
        Row: {
          id: string;
          college_id: string;
          name: string;
          slug: string;
          category: ClubCategory;
          description: string;
          logo_url: string | null;
          lead_student_name: string;
          faculty_mentor_name: string;
          member_count: number;
          meeting_venue: string;
          recruitment_open: boolean;
          social_links: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          name: string;
          slug: string;
          category: ClubCategory;
          description: string;
          logo_url?: string | null;
          lead_student_name: string;
          faculty_mentor_name: string;
          member_count?: number;
          meeting_venue: string;
          recruitment_open?: boolean;
          social_links?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          name?: string;
          slug?: string;
          category?: ClubCategory;
          description?: string;
          logo_url?: string | null;
          lead_student_name?: string;
          faculty_mentor_name?: string;
          member_count?: number;
          meeting_venue?: string;
          recruitment_open?: boolean;
          social_links?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      club_memberships: {
        Row: {
          id: string;
          college_id: string;
          club_id: string;
          student_id: string;
          role: ClubRole;
          joined_at: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          club_id: string;
          student_id: string;
          role?: ClubRole;
          joined_at?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          club_id?: string;
          student_id?: string;
          role?: ClubRole;
          joined_at?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      club_event_tickets: {
        Row: {
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
          checked_in_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          event_id: string;
          student_id: string;
          ticket_code: string;
          event_title: string;
          venue: string;
          seat_tier?: string;
          price?: number;
          is_verified?: boolean;
          checked_in_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          event_id?: string;
          student_id?: string;
          ticket_code?: string;
          event_title?: string;
          venue?: string;
          seat_tier?: string;
          price?: number;
          is_verified?: boolean;
          checked_in_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      student_merit_activities: {
        Row: {
          id: string;
          college_id: string;
          student_id: string;
          club_id: string | null;
          activity_title: string;
          activity_type: ActivityType;
          merit_points: number;
          certificate_url: string | null;
          verified_by: string;
          awarded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          student_id: string;
          club_id?: string | null;
          activity_title: string;
          activity_type: ActivityType;
          merit_points?: number;
          certificate_url?: string | null;
          verified_by: string;
          awarded_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          student_id?: string;
          club_id?: string | null;
          activity_title?: string;
          activity_type?: ActivityType;
          merit_points?: number;
          certificate_url?: string | null;
          verified_by?: string;
          awarded_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      alumni_profiles: {
        Row: {
          id: string;
          college_id: string;
          user_id: string | null;
          full_name: string;
          email: string;
          avatar_url: string | null;
          graduating_year: number;
          department: string;
          degree: string;
          current_role: string;
          company: string;
          industry: string;
          location: string;
          bio: string | null;
          linkedin_url: string | null;
          mentorship_available: boolean;
          willing_to_refer: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          user_id?: string | null;
          full_name: string;
          email: string;
          avatar_url?: string | null;
          graduating_year: number;
          department: string;
          degree?: string;
          current_role: string;
          company: string;
          industry: string;
          location: string;
          bio?: string | null;
          linkedin_url?: string | null;
          mentorship_available?: boolean;
          willing_to_refer?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          user_id?: string | null;
          full_name?: string;
          email?: string;
          avatar_url?: string | null;
          graduating_year?: number;
          department?: string;
          degree?: string;
          current_role?: string;
          company?: string;
          industry?: string;
          location?: string;
          bio?: string | null;
          linkedin_url?: string | null;
          mentorship_available?: boolean;
          willing_to_refer?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      alumni_mentorship_sessions: {
        Row: {
          id: string;
          college_id: string;
          alumni_id: string;
          student_id: string;
          student_name: string;
          student_email: string;
          topic: string;
          session_type: string;
          scheduled_at: string;
          duration_minutes: number;
          meeting_url: string | null;
          notes: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          alumni_id: string;
          student_id: string;
          student_name: string;
          student_email: string;
          topic: string;
          session_type?: string;
          scheduled_at: string;
          duration_minutes?: number;
          meeting_url?: string | null;
          notes?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          alumni_id?: string;
          student_id?: string;
          student_name?: string;
          student_email?: string;
          topic?: string;
          session_type?: string;
          scheduled_at?: string;
          duration_minutes?: number;
          meeting_url?: string | null;
          notes?: string | null;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      alumni_job_referrals: {
        Row: {
          id: string;
          college_id: string;
          alumni_id: string;
          alumni_name: string;
          company: string;
          role_title: string;
          job_type: string;
          experience_level: string;
          location: string;
          salary_range: string | null;
          application_deadline: string;
          referral_code: string;
          apply_url: string | null;
          description: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          alumni_id: string;
          alumni_name: string;
          company: string;
          role_title: string;
          job_type: string;
          experience_level?: string;
          location: string;
          salary_range?: string | null;
          application_deadline: string;
          referral_code: string;
          apply_url?: string | null;
          description: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          alumni_id?: string;
          alumni_name?: string;
          company?: string;
          role_title?: string;
          job_type?: string;
          experience_level?: string;
          location?: string;
          salary_range?: string | null;
          application_deadline?: string;
          referral_code?: string;
          apply_url?: string | null;
          description?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };

      alumni_donations: {
        Row: {
          id: string;
          college_id: string;
          donor_name: string;
          donor_email: string;
          graduating_year: number | null;
          campaign: string;
          amount: number;
          currency: string;
          pledge_status: string;
          transaction_ref: string;
          receipt_code: string;
          is_anonymous: boolean;
          message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          donor_name: string;
          donor_email: string;
          graduating_year?: number | null;
          campaign: string;
          amount: number;
          currency?: string;
          pledge_status?: string;
          transaction_ref: string;
          receipt_code: string;
          is_anonymous?: boolean;
          message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          donor_name?: string;
          donor_email?: string;
          graduating_year?: number | null;
          campaign?: string;
          amount?: number;
          currency?: string;
          pledge_status?: string;
          transaction_ref?: string;
          receipt_code?: string;
          is_anonymous?: boolean;
          message?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      alumni_digital_passes: {
        Row: {
          id: string;
          college_id: string;
          alumni_id: string;
          pass_code: string;
          issue_date: string;
          valid_until: string;
          privileges: Json;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          alumni_id: string;
          pass_code: string;
          issue_date?: string;
          valid_until?: string;
          privileges?: Json;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          alumni_id?: string;
          pass_code?: string;
          issue_date?: string;
          valid_until?: string;
          privileges?: Json;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };

      transport_routes: {
        Row: {
          id: string;
          college_id: string;
          route_name: string;
          route_code: string;
          shuttle_type: string;
          start_point: string;
          end_point: string;
          stops: Json;
          operating_hours: string;
          frequency_mins: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          route_name: string;
          route_code: string;
          shuttle_type: string;
          start_point: string;
          end_point: string;
          stops?: Json;
          operating_hours?: string;
          frequency_mins?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          route_name?: string;
          route_code?: string;
          shuttle_type?: string;
          start_point?: string;
          end_point?: string;
          stops?: Json;
          operating_hours?: string;
          frequency_mins?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      transport_schedules: {
        Row: {
          id: string;
          route_id: string;
          bus_number: string;
          driver_name: string;
          driver_phone: string;
          departure_time: string;
          current_stop: string;
          live_eta_mins: number;
          live_status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          route_id: string;
          bus_number: string;
          driver_name: string;
          driver_phone: string;
          departure_time: string;
          current_stop: string;
          live_eta_mins?: number;
          live_status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          route_id?: string;
          bus_number?: string;
          driver_name?: string;
          driver_phone?: string;
          departure_time?: string;
          current_stop?: string;
          live_eta_mins?: number;
          live_status?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      transport_passes: {
        Row: {
          id: string;
          college_id: string;
          scholar_id: string;
          scholar_name: string;
          pass_type: string;
          pass_code: string;
          route_id: string | null;
          valid_from: string;
          valid_to: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          scholar_id: string;
          scholar_name: string;
          pass_type: string;
          pass_code: string;
          route_id?: string | null;
          valid_from?: string;
          valid_to?: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          scholar_id?: string;
          scholar_name?: string;
          pass_type?: string;
          pass_code?: string;
          route_id?: string | null;
          valid_from?: string;
          valid_to?: string;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      parking_zones: {
        Row: {
          id: string;
          college_id: string;
          zone_name: string;
          zone_code: string;
          category: string;
          total_bays: number;
          occupied_bays: number;
          hourly_rate: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          zone_name: string;
          zone_code: string;
          category: string;
          total_bays: number;
          occupied_bays?: number;
          hourly_rate?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          zone_name?: string;
          zone_code?: string;
          category?: string;
          total_bays?: number;
          occupied_bays?: number;
          hourly_rate?: number;
          created_at?: string;
        };
        Relationships: [];
      };

      parking_reservations: {
        Row: {
          id: string;
          college_id: string;
          user_id: string;
          user_name: string;
          zone_id: string;
          bay_number: string;
          vehicle_plate: string;
          vehicle_type: string;
          reserved_from: string;
          reserved_until: string;
          pass_code: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          user_id: string;
          user_name: string;
          zone_id: string;
          bay_number: string;
          vehicle_plate: string;
          vehicle_type: string;
          reserved_from: string;
          reserved_until: string;
          pass_code: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          user_id?: string;
          user_name?: string;
          zone_id?: string;
          bay_number?: string;
          vehicle_plate?: string;
          vehicle_type?: string;
          reserved_from?: string;
          reserved_until?: string;
          pass_code?: string;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      carpool_listings: {
        Row: {
          id: string;
          college_id: string;
          driver_id: string;
          driver_name: string;
          driver_role: string;
          departure_location: string;
          destination_campus: string;
          departure_time: string;
          seats_available: number;
          price_per_seat: number;
          vehicle_model: string;
          contact_phone: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          driver_id: string;
          driver_name: string;
          driver_role?: string;
          departure_location: string;
          destination_campus?: string;
          departure_time: string;
          seats_available: number;
          price_per_seat?: number;
          vehicle_model: string;
          contact_phone: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          driver_id?: string;
          driver_name?: string;
          driver_role?: string;
          departure_location?: string;
          destination_campus?: string;
          departure_time?: string;
          seats_available?: number;
          price_per_seat?: number;
          vehicle_model?: string;
          contact_phone?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };

      research_publications: {
        Row: {
          id: string;
          college_id: string;
          title: string;
          authors: Json;
          department: string;
          journal_or_conference: string;
          publication_date: string;
          doi: string;
          citation_count: number;
          indexing: string;
          open_access: boolean;
          abstract: string;
          pdf_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          title: string;
          authors?: Json;
          department: string;
          journal_or_conference: string;
          publication_date: string;
          doi: string;
          citation_count?: number;
          indexing: string;
          open_access?: boolean;
          abstract: string;
          pdf_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          title?: string;
          authors?: Json;
          department?: string;
          journal_or_conference?: string;
          publication_date?: string;
          doi?: string;
          citation_count?: number;
          indexing?: string;
          open_access?: boolean;
          abstract?: string;
          pdf_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      research_grants: {
        Row: {
          id: string;
          college_id: string;
          project_title: string;
          principal_investigator: string;
          co_pis: Json;
          funding_agency: string;
          total_grant_amount: number;
          disbursed_amount: number;
          start_date: string;
          end_date: string;
          milestone_status: string;
          deliverables_summary: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          project_title: string;
          principal_investigator: string;
          co_pis?: Json;
          funding_agency: string;
          total_grant_amount: number;
          disbursed_amount?: number;
          start_date: string;
          end_date: string;
          milestone_status?: string;
          deliverables_summary?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          project_title?: string;
          principal_investigator?: string;
          co_pis?: Json;
          funding_agency?: string;
          total_grant_amount?: number;
          disbursed_amount?: number;
          start_date?: string;
          end_date?: string;
          milestone_status?: string;
          deliverables_summary?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      patent_applications: {
        Row: {
          id: string;
          college_id: string;
          title: string;
          inventors: Json;
          application_number: string;
          filing_date: string;
          status: string;
          ipr_type: string;
          abstract: string;
          commercial_partner: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          title: string;
          inventors?: Json;
          application_number: string;
          filing_date?: string;
          status?: string;
          ipr_type: string;
          abstract: string;
          commercial_partner?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          title?: string;
          inventors?: Json;
          application_number?: string;
          filing_date?: string;
          status?: string;
          ipr_type?: string;
          abstract?: string;
          commercial_partner?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      innovation_startups: {
        Row: {
          id: string;
          college_id: string;
          startup_name: string;
          founder_name: string;
          founder_role: string;
          sector: string;
          funding_stage: string;
          incubation_space: string;
          seed_grant_awarded: number;
          pitch_deck_url: string | null;
          website_url: string | null;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          startup_name: string;
          founder_name: string;
          founder_role?: string;
          sector: string;
          funding_stage?: string;
          incubation_space?: string;
          seed_grant_awarded?: number;
          pitch_deck_url?: string | null;
          website_url?: string | null;
          description: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          startup_name?: string;
          founder_name?: string;
          founder_role?: string;
          sector?: string;
          funding_stage?: string;
          incubation_space?: string;
          seed_grant_awarded?: number;
          pitch_deck_url?: string | null;
          website_url?: string | null;
          description?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      partner_universities: {
        Row: {
          id: string;
          college_id: string;
          university_name: string;
          country: string;
          city: string;
          qs_world_ranking: number;
          programs_offered: unknown;
          min_gpa_required: number;
          exchange_slots: number;
          tuition_waiver: boolean;
          application_deadline: string;
          semester_term: string;
          campus_website: string | null;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          university_name: string;
          country: string;
          city: string;
          qs_world_ranking?: number;
          programs_offered?: unknown;
          min_gpa_required?: number;
          exchange_slots?: number;
          tuition_waiver?: boolean;
          application_deadline: string;
          semester_term: string;
          campus_website?: string | null;
          description: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          university_name?: string;
          country?: string;
          city?: string;
          qs_world_ranking?: number;
          programs_offered?: unknown;
          min_gpa_required?: number;
          exchange_slots?: number;
          tuition_waiver?: boolean;
          application_deadline?: string;
          semester_term?: string;
          campus_website?: string | null;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      international_scholarships: {
        Row: {
          id: string;
          college_id: string;
          fellowship_title: string;
          sponsoring_body: string;
          coverage_type: string;
          award_amount_usd: number;
          target_countries: unknown;
          eligibility_criteria: string;
          application_deadline: string;
          open_slots: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          fellowship_title: string;
          sponsoring_body: string;
          coverage_type: string;
          award_amount_usd: number;
          target_countries?: unknown;
          eligibility_criteria: string;
          application_deadline: string;
          open_slots?: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          fellowship_title?: string;
          sponsoring_body?: string;
          coverage_type?: string;
          award_amount_usd?: number;
          target_countries?: unknown;
          eligibility_criteria?: string;
          application_deadline?: string;
          open_slots?: number;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      credit_transfer_requests: {
        Row: {
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
          syllabus_document_url: string | null;
          status: string;
          evaluator_remarks: string | null;
          submitted_at: string;
          evaluated_at: string | null;
        };
        Insert: {
          id?: string;
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
          status?: string;
          evaluator_remarks?: string | null;
          submitted_at?: string;
          evaluated_at?: string | null;
        };
        Update: {
          id?: string;
          college_id?: string;
          student_id?: string;
          student_name?: string;
          host_university?: string;
          foreign_course_code?: string;
          foreign_course_title?: string;
          credits_earned?: number;
          equivalent_domestic_course?: string;
          equivalent_credits?: number;
          grade_earned?: string;
          syllabus_document_url?: string | null;
          status?: string;
          evaluator_remarks?: string | null;
          submitted_at?: string;
          evaluated_at?: string | null;
        };
        Relationships: [];
      };

      travel_clearance_passes: {
        Row: {
          id: string;
          college_id: string;
          student_id: string;
          student_name: string;
          pass_code: string;
          destination_country: string;
          host_institution: string;
          passport_number_masked: string;
          visa_type: string;
          valid_from: string;
          valid_until: string;
          dean_approval_status: string;
          digital_qr_token: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          student_id: string;
          student_name: string;
          pass_code: string;
          destination_country: string;
          host_institution: string;
          passport_number_masked: string;
          visa_type: string;
          valid_from: string;
          valid_until: string;
          dean_approval_status?: string;
          digital_qr_token: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          student_id?: string;
          student_name?: string;
          pass_code?: string;
          destination_country?: string;
          host_institution?: string;
          passport_number_masked?: string;
          visa_type?: string;
          valid_from?: string;
          valid_until?: string;
          dean_approval_status?: string;
          digital_qr_token?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      sustainability_solar_telemetry: {
        Row: {
          id: string;
          college_id: string;
          array_zone: string;
          peak_capacity_kwp: number;
          current_generation_kw: number;
          daily_total_kwh: number;
          battery_storage_percent: number;
          grid_export_kw: number;
          carbon_offset_kg: number;
          timestamp: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          array_zone: string;
          peak_capacity_kwp: number;
          current_generation_kw: number;
          daily_total_kwh?: number;
          battery_storage_percent?: number;
          grid_export_kw?: number;
          carbon_offset_kg?: number;
          timestamp?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          array_zone?: string;
          peak_capacity_kwp?: number;
          current_generation_kw?: number;
          daily_total_kwh?: number;
          battery_storage_percent?: number;
          grid_export_kw?: number;
          carbon_offset_kg?: number;
          timestamp?: string;
        };
        Relationships: [];
      };

      sustainability_water_metrics: {
        Row: {
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
        };
        Insert: {
          id?: string;
          college_id: string;
          reservoir_name: string;
          capacity_kiloliters: number;
          current_reserve_kiloliters: number;
          greywater_recycled_liters_today?: number;
          water_quality_index?: number;
          tds_ppm?: number;
          ph_level?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          reservoir_name?: string;
          capacity_kiloliters?: number;
          current_reserve_kiloliters?: number;
          greywater_recycled_liters_today?: number;
          water_quality_index?: number;
          tds_ppm?: number;
          ph_level?: number;
          updated_at?: string;
        };
        Relationships: [];
      };

      sustainability_waste_audits: {
        Row: {
          id: string;
          college_id: string;
          audit_week: string;
          organic_compost_kg: number;
          dry_recyclables_kg: number;
          electronic_waste_kg: number;
          landfill_waste_kg: number;
          landfill_diversion_rate_percent: number;
          auditor_officer: string;
          remarks: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          audit_week: string;
          organic_compost_kg?: number;
          dry_recyclables_kg?: number;
          electronic_waste_kg?: number;
          landfill_waste_kg?: number;
          landfill_diversion_rate_percent: number;
          auditor_officer: string;
          remarks?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          audit_week?: string;
          organic_compost_kg?: number;
          dry_recyclables_kg?: number;
          electronic_waste_kg?: number;
          landfill_waste_kg?: number;
          landfill_diversion_rate_percent?: number;
          auditor_officer?: string;
          remarks?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      sustainability_eco_credits: {
        Row: {
          id: string;
          college_id: string;
          student_id: string;
          student_name: string;
          commute_mode: string;
          distance_km: number;
          co2_saved_kg: number;
          eco_points_earned: number;
          certificate_code: string;
          logged_at: string;
        };
        Insert: {
          id?: string;
          college_id: string;
          student_id: string;
          student_name: string;
          commute_mode: string;
          distance_km: number;
          co2_saved_kg: number;
          eco_points_earned: number;
          certificate_code: string;
          logged_at?: string;
        };
        Update: {
          id?: string;
          college_id?: string;
          student_id?: string;
          student_name?: string;
          commute_mode?: string;
          distance_km?: number;
          co2_saved_kg?: number;
          eco_points_earned?: number;
          certificate_code?: string;
          logged_at?: string;
        };
        Relationships: [];
      };
    };


    Views: {
      [_ in never]: never;
    };
    Functions: {
      current_user_role: {
        Args: Record<PropertyKey, never>;
        Returns: UserRole;
      };
      current_user_college_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      is_college_admin: {
        Args: { target_college_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      location_category: LocationCategory;
      notice_priority: NoticePriority;
      notice_category: NoticeCategory;
      event_category: EventCategory;
      request_priority: RequestPriority;
      request_status: RequestStatus;
      notification_type: NotificationType;
      bookmark_type: BookmarkType;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
