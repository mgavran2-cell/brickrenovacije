export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          created_at: string
          description: string | null
          icon_name: string
          id: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon_name?: string
          id?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon_name?: string
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      contractor_applications: {
        Row: {
          about: string | null
          admin_notes: string | null
          created_at: string
          email: string
          experience: string
          id: string
          legal_form: string
          location: string
          name: string
          phone: string
          profession: string
          status: string
        }
        Insert: {
          about?: string | null
          admin_notes?: string | null
          created_at?: string
          email: string
          experience: string
          id?: string
          legal_form: string
          location: string
          name: string
          phone: string
          profession: string
          status?: string
        }
        Update: {
          about?: string | null
          admin_notes?: string | null
          created_at?: string
          email?: string
          experience?: string
          id?: string
          legal_form?: string
          location?: string
          name?: string
          phone?: string
          profession?: string
          status?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      partner_applications: {
        Row: {
          city: string
          company_name: string
          contact_person: string
          created_at: string
          email: string
          experience_years: number | null
          id: string
          message: string | null
          oib: string | null
          phone: string
          services: string[]
        }
        Insert: {
          city: string
          company_name: string
          contact_person: string
          created_at?: string
          email: string
          experience_years?: number | null
          id?: string
          message?: string | null
          oib?: string | null
          phone: string
          services?: string[]
        }
        Update: {
          city?: string
          company_name?: string
          contact_person?: string
          created_at?: string
          email?: string
          experience_years?: number | null
          id?: string
          message?: string | null
          oib?: string | null
          phone?: string
          services?: string[]
        }
        Relationships: []
      }
      ponude: {
        Row: {
          amount: number
          code: string
          created_at: string
          date: string
          id: string
          project_id: string | null
          status: string
          title: string
          user_id: string
        }
        Insert: {
          amount?: number
          code: string
          created_at?: string
          date?: string
          id?: string
          project_id?: string | null
          status?: string
          title: string
          user_id: string
        }
        Update: {
          amount?: number
          code?: string
          created_at?: string
          date?: string
          id?: string
          project_id?: string | null
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ponude_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      poruke: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          receiver_id: string | null
          sender_id: string
          sender_name: string
          text: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          receiver_id?: string | null
          sender_id: string
          sender_name?: string
          text: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          receiver_id?: string | null
          sender_id?: string
          sender_name?: string
          text?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      project_activity_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json | null
          project_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_activity_log_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_internal_notes: {
        Row: {
          internal_notes: string | null
          project_id: string
        }
        Insert: {
          internal_notes?: string | null
          project_id: string
        }
        Update: {
          internal_notes?: string | null
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_internal_notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_phases: {
        Row: {
          completed_at: string | null
          created_at: string | null
          end_date: string | null
          id: string
          name: string
          notes: string | null
          phase_order: number
          project_id: string
          start_date: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          name: string
          notes?: string | null
          phase_order: number
          project_id: string
          start_date?: string | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          phase_order?: number
          project_id?: string
          start_date?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_phases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_photos: {
        Row: {
          created_at: string | null
          description: string | null
          file_name: string
          file_size_bytes: number | null
          id: string
          mime_type: string | null
          phase_id: string | null
          photo_type: string
          project_id: string
          storage_path: string
          taken_at: string | null
          title: string | null
          uploaded_by: string | null
          week_number: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_name: string
          file_size_bytes?: number | null
          id?: string
          mime_type?: string | null
          phase_id?: string | null
          photo_type?: string
          project_id: string
          storage_path: string
          taken_at?: string | null
          title?: string | null
          uploaded_by?: string | null
          week_number?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_name?: string
          file_size_bytes?: number | null
          id?: string
          mime_type?: string | null
          phase_id?: string | null
          photo_type?: string
          project_id?: string
          storage_path?: string
          taken_at?: string | null
          title?: string | null
          uploaded_by?: string | null
          week_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_photos_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "project_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_photos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_share_links: {
        Row: {
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          id: string
          project_id: string
          token: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          project_id: string
          token?: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          id?: string
          project_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_share_links_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tasks: {
        Row: {
          assigned_to_text: string | null
          assigned_to_user_id: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          name: string
          phase_id: string | null
          priority: string | null
          progress_percent: number | null
          project_id: string
          requires_client_presence: boolean | null
          start_date: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          assigned_to_text?: string | null
          assigned_to_user_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          name: string
          phase_id?: string | null
          priority?: string | null
          progress_percent?: number | null
          project_id: string
          requires_client_presence?: boolean | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          assigned_to_text?: string | null
          assigned_to_user_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          name?: string
          phase_id?: string | null
          priority?: string | null
          progress_percent?: number | null
          project_id?: string
          requires_client_presence?: boolean | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "project_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          address: string | null
          area_sqm: number | null
          city: string | null
          client_email: string | null
          client_id: string | null
          client_name: string
          client_phone: string | null
          created_at: string
          currency: string | null
          current_phase: number | null
          end_date: string | null
          hero_image_url: string | null
          id: string
          is_draft: boolean
          location: string | null
          neighborhood: string | null
          paid_amount: number | null
          progress: number
          progress_percent: number | null
          project_manager_id: string | null
          property_type: string | null
          source_request_id: string | null
          start_date: string | null
          status: string
          title: string
          total_phases: number | null
          total_price: number | null
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          area_sqm?: number | null
          city?: string | null
          client_email?: string | null
          client_id?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string
          currency?: string | null
          current_phase?: number | null
          end_date?: string | null
          hero_image_url?: string | null
          id?: string
          is_draft?: boolean
          location?: string | null
          neighborhood?: string | null
          paid_amount?: number | null
          progress?: number
          progress_percent?: number | null
          project_manager_id?: string | null
          property_type?: string | null
          source_request_id?: string | null
          start_date?: string | null
          status?: string
          title: string
          total_phases?: number | null
          total_price?: number | null
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          address?: string | null
          area_sqm?: number | null
          city?: string | null
          client_email?: string | null
          client_id?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string
          currency?: string | null
          current_phase?: number | null
          end_date?: string | null
          hero_image_url?: string | null
          id?: string
          is_draft?: boolean
          location?: string | null
          neighborhood?: string | null
          paid_amount?: number | null
          progress?: number
          progress_percent?: number | null
          project_manager_id?: string | null
          property_type?: string | null
          source_request_id?: string | null
          start_date?: string | null
          status?: string
          title?: string
          total_phases?: number | null
          total_price?: number | null
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_source_request_id_fkey"
            columns: ["source_request_id"]
            isOneToOne: false
            referencedRelation: "renovation_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      racuni: {
        Row: {
          amount: number
          code: string
          created_at: string
          date: string
          id: string
          project_id: string | null
          status: string
          title: string
          user_id: string
        }
        Insert: {
          amount?: number
          code: string
          created_at?: string
          date?: string
          id?: string
          project_id?: string | null
          status?: string
          title: string
          user_id: string
        }
        Update: {
          amount?: number
          code?: string
          created_at?: string
          date?: string
          id?: string
          project_id?: string | null
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "racuni_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      renovation_requests: {
        Row: {
          admin_notes: string | null
          city: string | null
          client_id: string | null
          condition: string
          created_at: string
          email: string
          estimated_range: string | null
          id: string
          location: string
          material: string
          message: string | null
          name: string
          phone: string
          property_address: string | null
          property_type: string
          scope: string
          sqm: number | null
          status: string
        }
        Insert: {
          admin_notes?: string | null
          city?: string | null
          client_id?: string | null
          condition: string
          created_at?: string
          email: string
          estimated_range?: string | null
          id?: string
          location: string
          material: string
          message?: string | null
          name: string
          phone: string
          property_address?: string | null
          property_type: string
          scope: string
          sqm?: number | null
          status?: string
        }
        Update: {
          admin_notes?: string | null
          city?: string | null
          client_id?: string | null
          condition?: string
          created_at?: string
          email?: string
          estimated_range?: string | null
          id?: string
          location?: string
          material?: string
          message?: string | null
          name?: string
          phone?: string
          property_address?: string | null
          property_type?: string
          scope?: string
          sqm?: number | null
          status?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_project_from_request: {
        Args: {
          details: Json
          phases: Json
          request_id: string
          save_draft?: boolean
        }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      project_managers: {
        Args: never
        Returns: {
          full_name: string
          id: string
        }[]
      }
      recalc_project_progress: {
        Args: { _project_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
