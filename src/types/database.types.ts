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
