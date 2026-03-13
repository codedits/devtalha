export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          brand_name: string
          email: string
          id: string
          newsletter_description: string
          newsletter_heading: string
          updated_at: string | null
        }
        Insert: {
          brand_name?: string
          email?: string
          id?: string
          newsletter_description?: string
          newsletter_heading?: string
          updated_at?: string | null
        }
        Update: {
          brand_name?: string
          email?: string
          id?: string
          newsletter_description?: string
          newsletter_heading?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      hero: {
        Row: {
          background_image_url: string
          heading: string
          id: string
          name_label: string
          updated_at: string | null
        }
        Insert: {
          background_image_url?: string
          heading?: string
          id?: string
          name_label?: string
          updated_at?: string | null
        }
        Update: {
          background_image_url?: string
          heading?: string
          id?: string
          name_label?: string
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
      reachus: {
        Row: {
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
          socials: Json
          updated_at: string | null
        }
        Insert: {
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
          socials?: Json
          updated_at?: string | null
        }
        Update: {
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
          id: string
          intro_text: string
          label: string
          profile_image_url: string
          updated_at: string | null
        }
        Insert: {
          cta_text?: string
          cta_url?: string
          id?: string
          intro_text?: string
          label?: string
          profile_image_url?: string
          updated_at?: string | null
        }
        Update: {
          cta_text?: string
          cta_url?: string
          id?: string
          intro_text?: string
          label?: string
          profile_image_url?: string
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
