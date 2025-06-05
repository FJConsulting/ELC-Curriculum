import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import fs from 'fs'

// Configurer le chemin pour trouver le fichier .env
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '../..')

// Charger les variables d'environnement
dotenv.config({ path: resolve(rootDir, '.env') })

// Récupérer les variables d'environnement
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

// Vérifier que les variables sont définies
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variables Supabase non configurées. Vérifiez votre fichier .env')
  process.exit(1)
}

// Créer le client Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test de connexion
async function testConnection() {
  console.log('🧪 Test de connexion Supabase...')
  console.log('🔧 URL Supabase:', supabaseUrl)
  
  try {
    // Test de connexion basique
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
    
    // Test des tables principales
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
    
    return true
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    return false
  }
}

// Exécuter le test
testConnection()
  .then(success => {
    if (success) {
      console.log('✅ Tests terminés avec succès')
    } else {
      console.log('❌ Tests terminés avec des erreurs')
    }
  })
  .catch(err => {
    console.error('❌ Erreur fatale:', err)
  })