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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      about: {
        Row: {
          description: string
          heading: string
          id: string
          label: string
          stats: Json
          updated_at: string | null
        }
        Insert: {
          description?: string
          heading?: string
          id?: string
          label?: string
          stats?: Json
          updated_at?: string | null
        }
        Update: {
          description?: string
          heading?: string
          id?: string
          label?: string
          stats?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      footer: {
        Row: {
          background_image_url: string
          background_mode: string
          brand_name: string
          email: string
          id: string
          newsletter_description: string
          newsletter_heading: string
          text_theme: string
          updated_at: string | null
        }
        Insert: {
          background_image_url?: string
          background_mode?: string
          brand_name?: string
          email?: string
          id?: string
          newsletter_description?: string
          newsletter_heading?: string
          text_theme?: string
          updated_at?: string | null
        }
        Update: {
          background_image_url?: string
          background_mode?: string
          brand_name?: string
          email?: string
          id?: string
          newsletter_description?: string
          newsletter_heading?: string
          text_theme?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      hero: {
        Row: {
          background_image_url: string
          description: string
          heading: string
          id: string
          media_src: string
          media_type: string
          media_url: string
          mobile_background_image_url: string
          name_label: string
          overlay_opacity: number
          poster_src: string
          primary_button: Json | null
          scroll_to_expand: string
          secondary_button: Json | null
          updated_at: string | null
        }
        Insert: {
          background_image_url?: string
          description?: string
          heading?: string
          id?: string
          media_src?: string
          media_type?: string
          media_url?: string
          mobile_background_image_url?: string
          name_label?: string
          overlay_opacity?: number
          poster_src?: string
          primary_button?: Json | null
          scroll_to_expand?: string
          secondary_button?: Json | null
          updated_at?: string | null
        }
        Update: {
          background_image_url?: string
          description?: string
          heading?: string
          id?: string
          media_src?: string
          media_type?: string
          media_url?: string
          mobile_background_image_url?: string
          name_label?: string
          overlay_opacity?: number
          poster_src?: string
          primary_button?: Json | null
          scroll_to_expand?: string
          secondary_button?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      process_meta: {
        Row: {
          id: string
          label: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          label?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          label?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      process_steps: {
        Row: {
          created_at: string | null
          description: string
          id: string
          number: string
          sort_order: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string
          id?: string
          number: string
          sort_order?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          number?: string
          sort_order?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reachus: {
        Row: {
          background_image_url: string
          email: string
          heading: string
          id: string
          inquiry_text: string
          inquiry_title: string
          label: string
          office_line_1: string
          office_line_2: string
          office_line_3: string
          office_title: string
          portrait_image_url: string
          socials: Json
          updated_at: string | null
        }
        Insert: {
          background_image_url?: string
          email?: string
          heading?: string
          id?: string
          inquiry_text?: string
          inquiry_title?: string
          label?: string
          office_line_1?: string
          office_line_2?: string
          office_line_3?: string
          office_title?: string
          portrait_image_url?: string
          socials?: Json
          updated_at?: string | null
        }
        Update: {
          background_image_url?: string
          email?: string
          heading?: string
          id?: string
          inquiry_text?: string
          inquiry_title?: string
          label?: string
          office_line_1?: string
          office_line_2?: string
          office_line_3?: string
          office_title?: string
          portrait_image_url?: string
          socials?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      section_order: {
        Row: {
          created_at: string | null
          id: string
          section_key: string
          sort_order: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          section_key: string
          sort_order?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          section_key?: string
          sort_order?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string | null
          description: string
          id: string
          images: string[]
          sort_order: number
          tags: string[]
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string
          id?: string
          images?: string[]
          sort_order?: number
          tags?: string[]
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          images?: string[]
          sort_order?: number
          tags?: string[]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      services_meta: {
        Row: {
          cta_text: string
          cta_url: string
          heading: string
          id: string
          intro_text: string
          label: string
          profile_image_url: string
          updated_at: string | null
        }
        Insert: {
          cta_text?: string
          cta_url?: string
          heading?: string
          id?: string
          intro_text?: string
          label?: string
          profile_image_url?: string
          updated_at?: string | null
        }
        Update: {
          cta_text?: string
          cta_url?: string
          heading?: string
          id?: string
          intro_text?: string
          label?: string
          profile_image_url?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          default_theme: string
          id: string
          updated_at: string | null
        }
        Insert: {
          default_theme?: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          default_theme?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      supasection: {
        Row: {
          description: string
          heading: string
          id: string
          image_url: string
          label: string
          updated_at: string | null
        }
        Insert: {
          description?: string
          heading?: string
          id?: string
          image_url?: string
          label?: string
          updated_at?: string | null
        }
        Update: {
          description?: string
          heading?: string
          id?: string
          image_url?: string
          label?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      why_choose_us: {
        Row: {
          heading: string
          id: string
          label: string
          revenue_label: string
          revenue_stat: string
          scale_description: string
          scale_stat: string
          studio_image_url: string
          studio_name: string
          studio_since: string
          testimonial_text: string
          updated_at: string | null
        }
        Insert: {
          heading?: string
          id?: string
          label?: string
          revenue_label?: string
          revenue_stat?: string
          scale_description?: string
          scale_stat?: string
          studio_image_url?: string
          studio_name?: string
          studio_since?: string
          testimonial_text?: string
          updated_at?: string | null
        }
        Update: {
          heading?: string
          id?: string
          label?: string
          revenue_label?: string
          revenue_stat?: string
          scale_description?: string
          scale_stat?: string
          studio_image_url?: string
          studio_name?: string
          studio_since?: string
          testimonial_text?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      works: {
        Row: {
          client: string
          created_at: string | null
          gallery_images: string[]
          hover_image_url: string
          id: string
          image_url: string
          project_url: string
          scope: Json
          sort_order: number
          summary: string
          title: string
          updated_at: string | null
        }
        Insert: {
          client: string
          created_at?: string | null
          gallery_images?: string[]
          hover_image_url?: string
          id?: string
          image_url: string
          project_url?: string
          scope?: Json
          sort_order?: number
          summary?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          client?: string
          created_at?: string | null
          gallery_images?: string[]
          hover_image_url?: string
          id?: string
          image_url?: string
          project_url?: string
          scope?: Json
          sort_order?: number
          summary?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      works_meta: {
        Row: {
          archive_heading: string
          featured_count: number
          homepage_heading: string
          homepage_label: string
          id: string
          updated_at: string | null
        }
        Insert: {
          archive_heading?: string
          featured_count?: number
          homepage_heading?: string
          homepage_label?: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          archive_heading?: string
          featured_count?: number
          homepage_heading?: string
          homepage_label?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
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
