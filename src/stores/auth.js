import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  // État
  const user = ref(null)
  const profile = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => profile.value?.role === 'admin')
  const userLevel = computed(() => profile.value?.level || 'A1')
  const userTokens = computed(() => profile.value?.tokens || 0)
  const isSubscribed = computed(() => profile.value?.subscription?.active || false)

  // Actions
  const login = async (credentials) => {
    loading.value = true
    error.value = null
    
    try {
      // Si Supabase est configuré, utiliser Supabase Auth
      if (isSupabaseConfigured()) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password
        })
        
        if (authError) throw authError
        
        // Récupérer le profil
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
        
        if (profileError) throw profileError
        
        user.value = data.user
        profile.value = profileData
        
        return { success: true }
      } else {
        // Fallback sur les données mockées
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockUser = {
          id: 'mock-user-' + Date.now(),
          email: credentials.email
        }
        
        const mockProfile = {
          id: mockUser.id,
          name: credentials.email.split('@')[0],
          email: credentials.email,
          level: 'A2',
          tokens: 3,
          role: credentials.email === 'admin@elc.com' ? 'admin' : 'student',
          subscription: {
            active: false,
            plan: null,
            expiresAt: null
          }
        }
        
        user.value = mockUser
        profile.value = mockProfile
        
        // Sauvegarder en localStorage
        localStorage.setItem('elc_user', JSON.stringify(mockUser))
        localStorage.setItem('elc_profile', JSON.stringify(mockProfile))
        
        return { success: true }
      }
    } catch (err) {
      error.value = err.message || 'Erreur de connexion'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    error.value = null
    
    try {
      if (isSupabaseConfigured()) {
        // Créer le compte avec Supabase
        const { data, error: authError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              name: userData.name
            }
          }
        })
        
        if (authError) throw authError
        
        // Le profil sera créé automatiquement par le trigger
        user.value = data.user
        
        // Attendre un peu pour que le trigger crée le profil
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Récupérer le profil créé
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
        
        profile.value = profileData
        
        return { success: true }
      } else {
        // Fallback mockée
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const mockUser = {
          id: 'mock-user-' + Date.now(),
          email: userData.email
        }
        
        const mockProfile = {
          id: mockUser.id,
          name: userData.name,
          email: userData.email,
          level: userData.testResult || 'A1',
          tokens: 3,
          role: 'student'
        }
        
        user.value = mockUser
        profile.value = mockProfile
        
        localStorage.setItem('elc_user', JSON.stringify(mockUser))
        localStorage.setItem('elc_profile', JSON.stringify(mockProfile))
        
        return { success: true }
      }
    } catch (err) {
      error.value = err.message || 'Erreur lors de l\'inscription'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut()
    }
    
    user.value = null
    profile.value = null
    localStorage.removeItem('elc_user')
    localStorage.removeItem('elc_profile')
    error.value = null
  }

  const initAuth = async () => {
    if (isSupabaseConfigured()) {
      // Récupérer la session Supabase
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        user.value = session.user
        
        // Récupérer le profil
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        profile.value = profileData
      }
    } else {
      // Fallback localStorage
      const savedUser = localStorage.getItem('elc_user')
      const savedProfile = localStorage.getItem('elc_profile')
      
      if (savedUser && savedProfile) {
        try {
          user.value = JSON.parse(savedUser)
          profile.value = JSON.parse(savedProfile)
        } catch (err) {
          console.error('Erreur lors du chargement des données:', err)
          localStorage.removeItem('elc_user')
          localStorage.removeItem('elc_profile')
        }
      }
    }
  }

  const updateTokens = async (amount) => {
    if (!profile.value) return false
    
    const newTokens = profile.value.tokens + amount
    
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('profiles')
        .update({ tokens: newTokens })
        .eq('id', user.value.id)
      
      if (error) {
        console.error('Erreur mise à jour tokens:', error)
        return false
      }
    }
    
    profile.value.tokens = newTokens
    localStorage.setItem('elc_profile', JSON.stringify(profile.value))
    return true
  }

  const useToken = async () => {
    if (profile.value && profile.value.tokens > 0) {
      return await updateTokens(-1)
    }
    return false
  }

  const updateLevel = async (newLevel) => {
    if (!profile.value) return false
    
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('profiles')
        .update({ level: newLevel })
        .eq('id', user.value.id)
      
      if (error) {
        console.error('Erreur mise à jour niveau:', error)
        return false
      }
    }
    
    profile.value.level = newLevel
    localStorage.setItem('elc_profile', JSON.stringify(profile.value))
    return true
  }

  const addBooking = async (sessionId) => {
    if (!user.value || !profile.value) return false
    
    if (isSupabaseConfigured()) {
      // Utiliser la fonction Supabase pour réserver
      const { data, error } = await supabase
        .rpc('book_session', { p_session_id: sessionId })
      
      if (error || !data.success) {
        error.value = data?.error || 'Erreur lors de la réservation'
        return false
      }
      
      // Rafraîchir le profil pour mettre à jour les tokens
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()
      
      profile.value = updatedProfile
    } else {
      // Fallback mockée
      if (profile.value.tokens > 0) {
        profile.value.tokens -= 1
        localStorage.setItem('elc_profile', JSON.stringify(profile.value))
      } else {
        error.value = 'Tokens insuffisants'
        return false
      }
    }
    
    return true
  }

  const cancelBooking = async (bookingId) => {
    if (!user.value) return false
    
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .eq('student_id', user.value.id)
      
      if (error) {
        console.error('Erreur annulation:', error)
        return false
      }
      
      // Rembourser le token
      await updateTokens(1)
    }
    
    return true
  }

  const saveEvaluationResult = async (evaluationResult) => {
    if (!user.value) return false
    
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('user_evaluations')
        .insert({
          user_id: user.value.id,
          evaluation_id: evaluationResult.evaluationId,
          score: evaluationResult.score,
          passed: evaluationResult.passed
        })
      
      if (error) {
        console.error('Erreur sauvegarde évaluation:', error)
        return false
      }
    }
    
    return true
  }

  // Écouter les changements d'authentification Supabase
  if (isSupabaseConfigured()) {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        user.value = session?.user || null
      } else if (event === 'SIGNED_OUT') {
        user.value = null
        profile.value = null
      }
    })
  }

  // Initialiser l'authentification au chargement
  initAuth()

  return {
    // État
    user,
    profile,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    isAdmin,
    userLevel,
    userTokens,
    isSubscribed,
    
    // Actions
    login,
    register,
    logout,
    updateTokens,
    useToken,
    updateLevel,
    addBooking,
    cancelBooking,
    initAuth,
    saveEvaluationResult
  }
}) 