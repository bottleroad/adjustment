import { createClient } from '@supabase/supabase-js'

// Try both NEXT_PUBLIC and regular env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://nmemvaqtoilpcsuyqmev.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZW12YXF0b2lscGNzdXlxbWV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MzIwNjEsImV4cCI6MjA2MDEwODA2MX0.953_vVrhAAkhmax_cOD7SYHrqqAlHxH2NJaKhvbDoRE'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required environment variables for Supabase')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Tables = {
  tasks: {
    id: number
    title: string
    cardType: 'shinhan' | 'hyundai' | 'samsung' | 'bc' | 'kb' | 'lotte' | 'other'
    amount: number
    time: string
    store: string
    date: string
    created_at: string
  }
} 