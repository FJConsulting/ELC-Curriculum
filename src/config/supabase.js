import { createClient } from '@supabase/supabase-js'

// Ces valeurs doivent être remplacées par vos vraies clés Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper pour gérer les erreurs
export const handleSupabaseError = (error) => {
  console.error('Supabase error:', error)
  return {
    error: error.message || 'Une erreur est survenue',
    data: null
  }
} 