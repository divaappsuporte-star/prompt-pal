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
      diet_meal_plans: {
        Row: {
          body_explanation: Json
          breakfast: Json
          created_at: string | null
          cumulative_loss: number | null
          daily_deficit: number
          day_number: number
          diet_type: Database["public"]["Enums"]["diet_type"]
          dinner: Json
          id: string
          lunch: Json
          macros: Json
          meal_feedbacks: Json
          phase: string
          snacks: Json | null
          target_kg_loss: number
          total_calories: number
        }
        Insert: {
          body_explanation: Json
          breakfast: Json
          created_at?: string | null
          cumulative_loss?: number | null
          daily_deficit: number
          day_number: number
          diet_type: Database["public"]["Enums"]["diet_type"]
          dinner: Json
          id?: string
          lunch: Json
          macros: Json
          meal_feedbacks: Json
          phase: string
          snacks?: Json | null
          target_kg_loss: number
          total_calories: number
        }
        Update: {
          body_explanation?: Json
          breakfast?: Json
          created_at?: string | null
          cumulative_loss?: number | null
          daily_deficit?: number
          day_number?: number
          diet_type?: Database["public"]["Enums"]["diet_type"]
          dinner?: Json
          id?: string
          lunch?: Json
          macros?: Json
          meal_feedbacks?: Json
          phase?: string
          snacks?: Json | null
          target_kg_loss?: number
          total_calories?: number
        }
        Relationships: []
      }
      health_protocols: {
        Row: {
          condition_type: Database["public"]["Enums"]["health_condition"]
          created_at: string | null
          diet_type: Database["public"]["Enums"]["diet_type"]
          id: string
          is_compatible: boolean
          medical_notes: string | null
          modifications: Json | null
          restrictions: Json | null
          substitutions: Json | null
          warnings: Json | null
        }
        Insert: {
          condition_type: Database["public"]["Enums"]["health_condition"]
          created_at?: string | null
          diet_type: Database["public"]["Enums"]["diet_type"]
          id?: string
          is_compatible?: boolean
          medical_notes?: string | null
          modifications?: Json | null
          restrictions?: Json | null
          substitutions?: Json | null
          warnings?: Json | null
        }
        Update: {
          condition_type?: Database["public"]["Enums"]["health_condition"]
          created_at?: string | null
          diet_type?: Database["public"]["Enums"]["diet_type"]
          id?: string
          is_compatible?: boolean
          medical_notes?: string | null
          modifications?: Json | null
          restrictions?: Json | null
          substitutions?: Json | null
          warnings?: Json | null
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          diet_type: Database["public"]["Enums"]["diet_type"]
          id: string
          metadata: Json | null
          provider: string
          provider_transaction_id: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          diet_type: Database["public"]["Enums"]["diet_type"]
          id?: string
          metadata?: Json | null
          provider: string
          provider_transaction_id?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          diet_type?: Database["public"]["Enums"]["diet_type"]
          id?: string
          metadata?: Json | null
          provider?: string
          provider_transaction_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: string | null
          avatar_url: string | null
          birth_date: string | null
          created_at: string
          diet_preference: string | null
          full_name: string | null
          gender: string | null
          goal_weight_kg: number | null
          height_cm: number | null
          id: string
          is_suspended: boolean | null
          show_name: boolean | null
          sleep_goal_hours: number | null
          suspended_at: string | null
          suspended_by: string | null
          updated_at: string
          wants_exercise: boolean | null
          water_goal_ml: number | null
          weight_kg: number | null
        }
        Insert: {
          activity_level?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          diet_preference?: string | null
          full_name?: string | null
          gender?: string | null
          goal_weight_kg?: number | null
          height_cm?: number | null
          id: string
          is_suspended?: boolean | null
          show_name?: boolean | null
          sleep_goal_hours?: number | null
          suspended_at?: string | null
          suspended_by?: string | null
          updated_at?: string
          wants_exercise?: boolean | null
          water_goal_ml?: number | null
          weight_kg?: number | null
        }
        Update: {
          activity_level?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string
          diet_preference?: string | null
          full_name?: string | null
          gender?: string | null
          goal_weight_kg?: number | null
          height_cm?: number | null
          id?: string
          is_suspended?: boolean | null
          show_name?: boolean | null
          sleep_goal_hours?: number | null
          suspended_at?: string | null
          suspended_by?: string | null
          updated_at?: string
          wants_exercise?: boolean | null
          water_goal_ml?: number | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      user_active_plans: {
        Row: {
          completed_meals: Json | null
          created_at: string | null
          current_day: number | null
          daily_feedbacks: Json | null
          diet_type: Database["public"]["Enums"]["diet_type"]
          id: string
          integrated_modules: Json | null
          start_weight: number
          started_at: string | null
          status: string | null
          target_weight: number
          target_weight_loss: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_meals?: Json | null
          created_at?: string | null
          current_day?: number | null
          daily_feedbacks?: Json | null
          diet_type: Database["public"]["Enums"]["diet_type"]
          id?: string
          integrated_modules?: Json | null
          start_weight: number
          started_at?: string | null
          status?: string | null
          target_weight: number
          target_weight_loss: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_meals?: Json | null
          created_at?: string | null
          current_day?: number | null
          daily_feedbacks?: Json | null
          diet_type?: Database["public"]["Enums"]["diet_type"]
          id?: string
          integrated_modules?: Json | null
          start_weight?: number
          started_at?: string | null
          status?: string | null
          target_weight?: number
          target_weight_loss?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_diet_access: {
        Row: {
          diet_type: Database["public"]["Enums"]["diet_type"]
          expires_at: string | null
          granted_at: string | null
          granted_by: string
          id: string
          payment_id: string | null
          user_id: string
        }
        Insert: {
          diet_type: Database["public"]["Enums"]["diet_type"]
          expires_at?: string | null
          granted_at?: string | null
          granted_by: string
          id?: string
          payment_id?: string | null
          user_id: string
        }
        Update: {
          diet_type?: Database["public"]["Enums"]["diet_type"]
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string
          id?: string
          payment_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_health_conditions: {
        Row: {
          active: boolean | null
          condition_type: Database["public"]["Enums"]["health_condition"]
          created_at: string | null
          diagnosed_by: string | null
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          condition_type: Database["public"]["Enums"]["health_condition"]
          created_at?: string | null
          diagnosed_by?: string | null
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          condition_type?: Database["public"]["Enums"]["health_condition"]
          created_at?: string | null
          diagnosed_by?: string | null
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          id: string
          progress_data: Json
          synced_at: string
          user_id: string
        }
        Insert: {
          id?: string
          progress_data?: Json
          synced_at?: string
          user_id: string
        }
        Update: {
          id?: string
          progress_data?: Json
          synced_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "user"
      diet_type:
        | "carnivore"
        | "keto"
        | "lowcarb"
        | "metabolic"
        | "detox"
        | "fasting"
      health_condition:
        | "diabetes"
        | "gastrite"
        | "hipertensao"
        | "intolerancia_lactose"
        | "celiaquia"
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
    Enums: {
      app_role: ["super_admin", "admin", "user"],
      diet_type: [
        "carnivore",
        "keto",
        "lowcarb",
        "metabolic",
        "detox",
        "fasting",
      ],
      health_condition: [
        "diabetes",
        "gastrite",
        "hipertensao",
        "intolerancia_lactose",
        "celiaquia",
      ],
    },
  },
} as const
