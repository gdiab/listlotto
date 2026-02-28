import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          preferences: Record<string, unknown>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatar_url?: string | null
          preferences?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          preferences?: Record<string, unknown>
          updated_at?: string
        }
      }
      lists: {
        Row: {
          id: string
          user_id: string
          title: string
          items: { id: string; text: string; createdAt: number }[]
          is_archived: boolean
          archived_at: string | null
          sort_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          items?: { id: string; text: string; createdAt: number }[]
          is_archived?: boolean
          archived_at?: string | null
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          items?: { id: string; text: string; createdAt: number }[]
          is_archived?: boolean
          archived_at?: string | null
          sort_order?: number | null
          updated_at?: string
        }
      }
    }
  }
}