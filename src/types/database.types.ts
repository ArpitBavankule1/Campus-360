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
