import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      user_references: {
        Row: {
          id: string
          user_id: string
          type: string
          authors: string
          title: string
          publisher: string | null
          volume: string | null
          number: string | null
          pages: string | null
          year: string | null
          book_publisher: string | null
          url: string | null
          access_date: string | null
          formatted_text: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          authors: string
          title: string
          publisher?: string | null
          volume?: string | null
          number?: string | null
          pages?: string | null
          year?: string | null
          book_publisher?: string | null
          url?: string | null
          access_date?: string | null
          formatted_text: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          authors?: string
          title?: string
          publisher?: string | null
          volume?: string | null
          number?: string | null
          pages?: string | null
          year?: string | null
          book_publisher?: string | null
          url?: string | null
          access_date?: string | null
          formatted_text?: string
          created_at?: string
        }
      }
    }
  }
}
