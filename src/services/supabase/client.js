import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

// Vérification des variables d'environnement
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is required')
}
if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is required')
}

// Client normal pour les opérations utilisateur
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Client admin pour les opérations d'administration
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Helper pour gérer les erreurs Supabase
export const handleSupabaseError = (error) => {
  console.error('Supabase error:', error)
  
  // Gestion spécifique des erreurs courantes
  const errorMessages = {
    'Invalid login credentials': 'Identifiants de connexion invalides',
    'Email not confirmed': 'Email non confirmé',
    'User not found': 'Utilisateur non trouvé',
    'Permission denied': 'Permission refusée'
  }
  
  const message = errorMessages[error.message] || error.message || 'Une erreur est survenue'
  
  return {
    error: message,
    data: null,
    status: error.status || 500
  }
}

// Helper pour les requêtes avec gestion d'erreur automatique
export const executeQuery = async (queryFn) => {
  try {
    const result = await queryFn()
    
    if (result.error) {
      return handleSupabaseError(result.error)
    }
    
    return {
      data: result.data,
      error: null,
      status: 200
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

// Helper pour les opérations en lot
export const executeBatch = async (operations) => {
  const results = []
  const errors = []
  
  for (const operation of operations) {
    try {
      const result = await operation()
      if (result.error) {
        errors.push(result.error)
      } else {
        results.push(result.data)
      }
    } catch (error) {
      errors.push(error)
    }
  }
  
  return {
    data: results,
    errors: errors.length > 0 ? errors : null,
    success: errors.length === 0
  }
}