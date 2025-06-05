import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

// Logs de débogage
console.log('🔧 Configuration Supabase:')
console.log('URL:', supabaseUrl)
console.log('Anon Key:', supabaseAnonKey ? 'Définie' : 'Manquante')
console.log('Service Key:', supabaseServiceKey ? 'Définie' : 'Manquante')

// Vérification des variables d'environnement
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is required')
}
if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is required')
}

// Client normal pour les opérations utilisateur
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client admin pour les opérations d'administration
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

console.log('🔧 Client admin créé:', supabaseAdmin ? 'Oui' : 'Non')

// Helper pour gérer les erreurs
export const handleSupabaseError = (error) => {
  console.error('Supabase error:', error)
  return {
    error: error.message || 'Une erreur est survenue',
    data: null
  }
}