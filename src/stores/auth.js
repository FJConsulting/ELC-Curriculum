import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// Remplacer :
// import { supabase } from '../lib/supabase'
// Par :
import { supabase } from '../config/supabase'

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
    } catch (err) {
      error.value = err.message
      console.error('❌ Erreur connexion:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    error.value = null
    
    try {
      // Validation des données
      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
        throw new Error('Tous les champs sont requis')
      }
      
      const { data, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password
      })
      
      if (authError) {
        // Gestion spécifique des erreurs d'authentification
        if (authError.message.includes('already registered')) {
          throw new Error('Cette adresse email est déjà utilisée')
        }
        throw authError
      }
      
      // Le profil sera créé automatiquement par le trigger
      // Ou manuellement si vous préférez garder le contrôle
      
      return { success: true, message: 'Inscription réussie ! Vérifiez votre email.' }
    } catch (err) {
      error.value = err.message
      console.error('❌ Erreur inscription:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      user.value = null
      profile.value = null
    } catch (err) {
      console.error('❌ Erreur déconnexion:', err)
    }
  }

  const updateProfile = async (updates) => {
    if (!user.value) return { success: false, error: 'Non connecté' }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.value.id)
      
      if (error) throw error
      
      profile.value = { ...profile.value, ...updates }
      return { success: true }
    } catch (err) {
      console.error('❌ Erreur mise à jour profil:', err)
      return { success: false, error: err.message }
    }
  }

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      return { success: true }
    } catch (err) {
      console.error('❌ Erreur reset password:', err)
      return { success: false, error: err.message }
    }
  }

  const updateTokens = async (newTokenCount) => {
    return await updateProfile({ tokens: newTokenCount })
  }

  const useToken = async () => {
    if (userTokens.value > 0) {
      return await updateTokens(userTokens.value - 1)
    }
    return { success: false, error: 'Pas assez de tokens' }
  }

  const updateLevel = async (newLevel) => {
    return await updateProfile({ level: newLevel })
  }

  const addBooking = async (sessionId) => {
    // Logique de réservation
    return { success: true }
  }

  const cancelBooking = async (bookingId) => {
    // Logique d'annulation
    return { success: true }
  }

  const initAuth = async () => {
    await checkSession()
  }

  const saveEvaluationResult = async (result) => {
    if (!user.value) return { success: false, error: 'Non connecté' }
    
    try {
      const { error } = await supabase
        .from('evaluations')
        .insert({
          user_id: user.value.id,
          ...result
        })
      
      if (error) throw error
      return { success: true }
    } catch (err) {
      console.error('❌ Erreur sauvegarde évaluation:', err)
      return { success: false, error: err.message }
    }
  }

  // Initialisation - vérifier si l'utilisateur est déjà connecté
  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        user.value = session.user
        profile.value = profileData
      }
    } catch (err) {
      console.error('❌ Erreur vérification session:', err)
    }
  }

  // Vérifier la session au démarrage
  checkSession()

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
    updateProfile,
    resetPassword,
    checkSession,
    updateTokens,
    useToken,
    updateLevel,
    addBooking,
    cancelBooking,
    initAuth,
    saveEvaluationResult
  }
})