// ================================================================
// CampusLens AI — Supabase Database Types
// Auto-aligned with Supabase PostgreSQL Schema
// ================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "student" | "faculty" | "hod" | "admin";

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
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
