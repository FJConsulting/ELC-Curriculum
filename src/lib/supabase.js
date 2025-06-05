import { createClient } from '@supabase/supabase-js'

// Récupérer les variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Vérifier que les variables sont définies
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables Supabase non configurées. Créez un fichier .env avec VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY')
  throw new Error('Variables Supabase non configurées')
}

// Créer le client Supabase
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)

// Cette fonction peut être supprimée si elle n'est plus utilisée ailleurs
export const isSupabaseConfigured = () => {
  return true // Toujours retourner true
}