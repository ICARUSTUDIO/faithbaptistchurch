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
      bookmarks: {
        Row: {
          book_id: string
          book_name: string
          chapter: number
          created_at: string
          highlight_color: string | null
          id: string
          user_id: string
          verse: number
          verse_text: string
        }
        Insert: {
          book_id: string
          book_name: string
          chapter: number
          created_at?: string
          highlight_color?: string | null
          id?: string
          user_id: string
          verse: number
          verse_text: string
        }
        Update: {
          book_id?: string
          book_name?: string
          chapter?: number
          created_at?: string
          highlight_color?: string | null
          id?: string
          user_id?: string
          verse?: number
          verse_text?: string
        }
        Relationships: []
      }
      daily_manna: {
        Row: {
          author_id: string
          created_at: string
          date: string
          id: string
          prayer: string | null
          reflection: string
          title: string
          verse_reference: string
          verse_text: string
        }
        Insert: {
          author_id: string
          created_at?: string
          date: string
          id?: string
          prayer?: string | null
          reflection: string
          title: string
          verse_reference: string
          verse_text: string
        }
        Update: {
          author_id?: string
          created_at?: string
          date?: string
          id?: string
          prayer?: string | null
          reflection?: string
          title?: string
          verse_reference?: string
          verse_text?: string
        }
        Relationships: []
      }
      daily_verses: {
        Row: {
          created_at: string
          date: string
          id: string
          verse_reference: string
          verse_text: string
          wisdom_message: string | null
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          verse_reference: string
          verse_text: string
          wisdom_message?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          verse_reference?: string
          verse_text?: string
          wisdom_message?: string | null
        }
        Relationships: []
      }
      notes: {
        Row: {
          book_id: string
          chapter: number
          content: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
          verse: number
        }
        Insert: {
          book_id: string
          chapter: number
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          verse: number
        }
        Update: {
          book_id?: string
          chapter?: number
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          verse?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      reading_plan_days: {
        Row: {
          created_at: string
          day_number: number
          id: string
          plan_id: string
          readings: string[]
          title: string
        }
        Insert: {
          created_at?: string
          day_number: number
          id?: string
          plan_id: string
          readings: string[]
          title: string
        }
        Update: {
          created_at?: string
          day_number?: number
          id?: string
          plan_id?: string
          readings?: string[]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_plan_days_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "reading_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_plans: {
        Row: {
          created_at: string
          description: string | null
          duration_days: number
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_days: number
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_days?: number
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          author_id: string
          author_name: string
          content: string
          created_at: string
          id: string
          is_published: boolean
          likes_count: number
          media_url: string | null
          title: string | null
          type: string
          updated_at: string
          verse_reference: string | null
        }
        Insert: {
          author_id: string
          author_name: string
          content: string
          created_at?: string
          id?: string
          is_published?: boolean
          likes_count?: number
          media_url?: string | null
          title?: string | null
          type: string
          updated_at?: string
          verse_reference?: string | null
        }
        Update: {
          author_id?: string
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          is_published?: boolean
          likes_count?: number
          media_url?: string | null
          title?: string | null
          type?: string
          updated_at?: string
          verse_reference?: string | null
        }
        Relationships: []
      }
      story_likes: {
        Row: {
          created_at: string
          id: string
          story_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          story_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          story_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_likes_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reading_progress: {
        Row: {
          completed_days: number[]
          current_day: number
          id: string
          is_completed: boolean
          last_read_at: string | null
          plan_id: string
          started_at: string
          user_id: string
        }
        Insert: {
          completed_days?: number[]
          current_day?: number
          id?: string
          is_completed?: boolean
          last_read_at?: string | null
          plan_id: string
          started_at?: string
          user_id: string
        }
        Update: {
          completed_days?: number[]
          current_day?: number
          id?: string
          is_completed?: boolean
          last_read_at?: string | null
          plan_id?: string
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_reading_progress_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "reading_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
