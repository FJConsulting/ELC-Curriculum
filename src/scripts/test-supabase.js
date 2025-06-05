import { supabase, isSupabaseConfigured } from '../lib/supabase.js'

// Script de test de connexion Supabase
export const testSupabaseConnection = async () => {
  console.log('🧪 Test de connexion Supabase...')
  
  // 1. Vérifier si Supabase est configuré
  console.log('🔧 Supabase configuré:', isSupabaseConfigured())
  
  if (!isSupabaseConfigured()) {
    console.warn('⚠️ Supabase non configuré - vérifiez votre fichier .env')
    return false
  }
  
  try {
    // 2. Test de connexion basique
    console.log('🔌 Test de connexion...')
    const { data: healthCheck, error: healthError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (healthError) {
      console.error('❌ Erreur de connexion:', healthError.message)
      return false
    }
    
    console.log('✅ Connexion réussie!')
    
    // 3. Test des tables principales
    const tables = ['profiles', 'course_categories', 'sessions', 'evaluations']
    
    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
        
        if (error) {
          console.error(`❌ Table ${table}:`, error.message)
        } else {
          console.log(`✅ Table ${table}: ${count} enregistrements`)
        }
      } catch (err) {
        console.error(`❌ Erreur table ${table}:`, err.message)
      }
    }
    
    // 4. Test d'authentification
    console.log('🔐 Test session utilisateur...')
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      console.log('✅ Utilisateur connecté:', session.user.email)
    } else {
      console.log('ℹ️ Aucun utilisateur connecté')
    }
    
    return true
    
  } catch (error) {
    console.error('❌ Erreur globale:', error)
    return false
  }
}

// Test automatique au chargement (uniquement en développement)
if (import.meta.env.DEV) {
  testSupabaseConnection()
} 