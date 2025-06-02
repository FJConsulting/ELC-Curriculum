// Script d'aide pour configurer et tester le mode hybride

// Fonction pour créer le fichier .env si nécessaire
export const createEnvFile = () => {
  const envContent = `# Configuration Supabase
VITE_SUPABASE_URL=https://lbizxplbawlipjfrmnma.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiaXp4cGxiYXdsaXBqZnJtbm1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3MjI4NDUsImV4cCI6MjA1MjI5ODg0NX0.9yQzJpc3Moi1Jzd…IyMXQ.xoYZ-Dt8pFHNMccYVNaqka9wsV-K5omvTjxcrIQtGiO

# Mode de fonctionnement (true = Supabase, false = Mock)
VITE_USE_SUPABASE=false

# Mode développement
NODE_ENV=development`

  console.log('📝 Contenu à copier dans votre fichier .env:')
  console.log('='.repeat(50))
  console.log(envContent)
  console.log('='.repeat(50))
  
  return envContent
}

// Fonction pour tester le mode hybride
export const testHybridMode = async () => {
  console.log('🧪 Test du mode hybride...')
  
  // Importer dynamiquement le store pour éviter les erreurs de circularité
  const { useAuthStore } = await import('../stores/auth-hybrid.js')
  const authStore = useAuthStore()
  
  console.log('📊 État actuel:')
  console.log(`- Mode: ${authStore.usingSupabase ? 'Supabase' : 'Mock'}`)
  console.log(`- Utilisateur: ${authStore.isAuthenticated ? authStore.currentUser.email : 'Non connecté'}`)
  
  // Test de basculement
  console.log('🔄 Test de basculement...')
  authStore.toggleMode()
  
  console.log(`- Nouveau mode: ${authStore.usingSupabase ? 'Supabase' : 'Mock'}`)
  
  return {
    mode: authStore.usingSupabase ? 'Supabase' : 'Mock',
    authenticated: authStore.isAuthenticated,
    user: authStore.currentUser
  }
}

// Instructions pour l'utilisateur
export const showInstructions = () => {
  console.log(`
🎯 INSTRUCTIONS POUR LE MODE HYBRIDE

1. 📁 Créer le fichier .env dans la racine du projet
   ${createEnvFile()}

2. 🔧 Modifier src/router/index.js pour utiliser le store hybride:
   - Remplacer: import { useAuthStore } from '@/stores/auth'
   - Par: import { useAuthStore } from '@/stores/auth-hybrid'

3. 🧪 Tester les deux modes:
   - VITE_USE_SUPABASE=false pour Mock (par défaut)
   - VITE_USE_SUPABASE=true pour Supabase

4. 🔄 Basculer en temps réel:
   - Dans la console: testHybridMode()
   - Ou dans votre code: authStore.toggleMode()

⚠️ IMPORTANT: Redémarrer le serveur après modification du .env
`)
}

// Auto-exécution en mode développement
if (import.meta.env.DEV) {
  showInstructions()
} 