import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'

// Configuration pour basculer entre mock et Supabase
const USE_SUPABASE = isSupabaseConfigured() && import.meta.env.VITE_USE_SUPABASE === 'true'

// Données mock de fallback
const mockUsers = [
  {
    id: 'admin-1',
    email: 'admin@elc-academy.com',
    password: 'admin123',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'ELC',
    level: 'advanced',
    subscription: 'premium',
    progress: { completed: 15, total: 30 }
  },
  {
    id: 'student-1',
    email: 'student@test.com',
    password: 'student123',
    role: 'student',
    firstName: 'Étudiant',
    lastName: 'Test',
    level: 'intermediate',
    subscription: 'basic',
    progress: { completed: 8, total: 30 }
  }
]

export const useAuthStore = defineStore('auth', () => {
  // État
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Mode de fonctionnement
  const usingSupabase = ref(USE_SUPABASE)
  
  // Computed
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const currentUser = computed(() => user.value)

  // Actions Supabase
  const supabaseActions = {
    async login(email, password) {
      loading.value = true
      error.value = null
      
      try {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (authError) throw authError
        
        // Récupérer le profil utilisateur
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
        
        if (profileError) {
          console.warn('Profil non trouvé, création...', profileError)
          // Le profil sera créé automatiquement par le trigger
        }
        
        user.value = {
          id: data.user.id,
          email: data.user.email,
          ...profile
        }
        
        console.log('✅ Connexion Supabase réussie:', user.value)
        return { success: true, user: user.value }
        
      } catch (err) {
        error.value = err.message
        console.error('❌ Erreur connexion Supabase:', err)
        return { success: false, error: err.message }
      } finally {
        loading.value = false
      }
    },

    async register(userData) {
      loading.value = true
      error.value = null
      
      try {
        const { data, error: authError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              first_name: userData.firstName,
              last_name: userData.lastName
            }
          }
        })
        
        if (authError) throw authError
        
        console.log('✅ Inscription Supabase réussie')
        return { success: true, needsConfirmation: !data.session }
        
      } catch (err) {
        error.value = err.message
        console.error('❌ Erreur inscription Supabase:', err)
        return { success: false, error: err.message }
      } finally {
        loading.value = false
      }
    },

    async logout() {
      try {
        await supabase.auth.signOut()
        user.value = null
        console.log('✅ Déconnexion Supabase réussie')
      } catch (err) {
        console.error('❌ Erreur déconnexion Supabase:', err)
      }
    },

    async checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          user.value = {
            id: session.user.id,
            email: session.user.email,
            ...profile
          }
        }
      } catch (err) {
        console.error('❌ Erreur vérification session:', err)
      }
    }
  }

  // Actions Mock
  const mockActions = {
    async login(email, password) {
      loading.value = true
      error.value = null
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const foundUser = mockUsers.find(u => u.email === email && u.password === password)
          
          if (foundUser) {
            const { password: _, ...userWithoutPassword } = foundUser
            user.value = userWithoutPassword
            console.log('✅ Connexion Mock réussie:', user.value)
            resolve({ success: true, user: user.value })
          } else {
            error.value = 'Email ou mot de passe incorrect'
            resolve({ success: false, error: error.value })
          }
          
          loading.value = false
        }, 1000)
      })
    },

    async register(userData) {
      loading.value = true
      error.value = null
      
      return new Promise((resolve) => {
        setTimeout(() => {
          const existingUser = mockUsers.find(u => u.email === userData.email)
          
          if (existingUser) {
            error.value = 'Un compte existe déjà avec cet email'
            resolve({ success: false, error: error.value })
          } else {
            const newUser = {
              id: `user-${Date.now()}`,
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              role: 'student',
              level: 'beginner',
              subscription: 'free',
              progress: { completed: 0, total: 30 }
            }
            
            mockUsers.push({ ...newUser, password: userData.password })
            user.value = newUser
            console.log('✅ Inscription Mock réussie:', user.value)
            resolve({ success: true, user: user.value })
          }
          
          loading.value = false
        }, 1000)
      })
    },

    async logout() {
      user.value = null
      console.log('✅ Déconnexion Mock réussie')
    },

    async checkSession() {
      // Mock session check - pas d'action nécessaire
    }
  }

  // Actions dynamiques selon le mode
  const login = (email, password) => {
    if (usingSupabase.value) {
      return supabaseActions.login(email, password)
    } else {
      return mockActions.login(email, password)
    }
  }

  const register = (userData) => {
    if (usingSupabase.value) {
      return supabaseActions.register(userData)
    } else {
      return mockActions.register(userData)
    }
  }

  const logout = () => {
    if (usingSupabase.value) {
      return supabaseActions.logout()
    } else {
      return mockActions.logout()
    }
  }

  const checkSession = () => {
    if (usingSupabase.value) {
      return supabaseActions.checkSession()
    } else {
      return mockActions.checkSession()
    }
  }

  // Fonction pour basculer le mode (utile pour les tests)
  const toggleMode = () => {
    usingSupabase.value = !usingSupabase.value
    console.log(`🔄 Mode basculé vers: ${usingSupabase.value ? 'Supabase' : 'Mock'}`)
  }

  // Initialisation
  if (usingSupabase.value) {
    checkSession()
    console.log('🚀 Store Auth initialisé en mode Supabase')
  } else {
    console.log('🚀 Store Auth initialisé en mode Mock')
  }

  return {
    // État
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    usingSupabase: readonly(usingSupabase),
    
    // Computed
    isAuthenticated,
    isAdmin,
    currentUser,
    
    // Actions
    login,
    register,
    logout,
    checkSession,
    toggleMode
  }
}) 