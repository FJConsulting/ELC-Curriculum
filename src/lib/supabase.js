import { createClient } from '@supabase/supabase-js'

// Récupérer les variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Vérifier que les variables sont définies
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variables Supabase non configurées. Créez un fichier .env avec VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY')
}

// Créer le client Supabase
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Helper pour vérifier si Supabase est configuré
export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey && 
         !supabaseUrl.includes('placeholder') && 
         !supabaseAnonKey.includes('placeholder')
} 