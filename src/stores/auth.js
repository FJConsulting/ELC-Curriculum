import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // État
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userLevel = computed(() => user.value?.level || 'A1')
  const userTokens = computed(() => user.value?.tokens || 0)
  const isSubscribed = computed(() => user.value?.subscription?.active || false)

  // Actions
  const login = async (credentials) => {
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'une API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Données utilisateur simulées
      const userData = {
        id: 1,
        name: credentials.email.split('@')[0],
        email: credentials.email,
        level: 'A2',
        tokens: 3,
        role: credentials.email === 'admin@elc.com' ? 'admin' : 'student',
        subscription: {
          active: false,
          plan: null,
          expiresAt: null
        },
        progress: {
          A1: { unlocked: true, completed: 85, lessons: 20 },
          A2: { unlocked: true, completed: 45, lessons: 20 },
          B1: { unlocked: false, completed: 0, lessons: 20 },
          B2: { unlocked: false, completed: 0, lessons: 20 },
          C1: { unlocked: false, completed: 0, lessons: 20 }
        },
        bookedCourses: [],
        completedSessions: [],
        evaluations: [],
        completedLessons: [],
        preferences: {
          notifications: true,
          language: 'fr',
          timezone: 'Europe/Paris'
        },
        joinedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      }
      
      user.value = userData
      
      // Sauvegarder en localStorage
      localStorage.setItem('elc_user', JSON.stringify(userData))
      
      return { success: true }
    } catch (err) {
      error.value = 'Erreur de connexion. Vérifiez vos identifiants.'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    error.value = null
    
    try {
      // Simulation d'une API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        level: userData.testResult || null,
        tokens: 3, // 3 tokens gratuits à l'inscription
        role: 'student',
        subscription: {
          active: false,
          plan: null,
          expiresAt: null
        },
        progress: {
          A1: { unlocked: false, completed: 0, lessons: 20 },
          A2: { unlocked: false, completed: 0, lessons: 20 },
          B1: { unlocked: false, completed: 0, lessons: 20 },
          B2: { unlocked: false, completed: 0, lessons: 20 },
          C1: { unlocked: false, completed: 0, lessons: 20 }
        },
        bookedCourses: [],
        completedSessions: [],
        evaluations: [],
        completedLessons: [],
        preferences: {
          notifications: true,
          language: 'fr',
          timezone: 'Europe/Paris'
        },
        joinedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      }
      
      user.value = newUser
      localStorage.setItem('elc_user', JSON.stringify(newUser))
      
      return { success: true }
    } catch (err) {
      error.value = 'Erreur lors de l\'inscription. Veuillez réessayer.'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('elc_user')
    error.value = null
  }

  const initAuth = () => {
    const savedUser = localStorage.getItem('elc_user')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (err) {
        console.error('Erreur lors du chargement des données utilisateur:', err)
        localStorage.removeItem('elc_user')
      }
    }
  }

  const updateTokens = (amount) => {
    if (user.value) {
      user.value.tokens += amount
      localStorage.setItem('elc_user', JSON.stringify(user.value))
    }
  }

  const useToken = () => {
    if (user.value && user.value.tokens > 0) {
      user.value.tokens -= 1
      localStorage.setItem('elc_user', JSON.stringify(user.value))
      return true
    }
    return false
  }

  const updateLevel = (newLevel) => {
    if (user.value) {
      user.value.level = newLevel
      if (user.value.progress[newLevel]) {
        user.value.progress[newLevel].unlocked = true
      }
      localStorage.setItem('elc_user', JSON.stringify(user.value))
    }
  }

  const unlockLevel = (level) => {
    if (user.value && user.value.progress[level] && useToken()) {
      user.value.progress[level].unlocked = true
      localStorage.setItem('elc_user', JSON.stringify(user.value))
      return true
    }
    return false
  }

  const updateProgress = (level, progress) => {
    if (user.value && user.value.progress[level]) {
      user.value.progress[level].completed = Math.max(
        user.value.progress[level].completed,
        progress
      )
      localStorage.setItem('elc_user', JSON.stringify(user.value))
    }
  }

  const addBooking = (booking) => {
    if (user.value && useToken()) {
      user.value.bookedCourses.push({
        ...booking,
        id: Date.now(),
        bookedAt: new Date().toISOString()
      })
      localStorage.setItem('elc_user', JSON.stringify(user.value))
      return true
    }
    return false
  }

  const cancelBooking = (bookingId) => {
    if (user.value) {
      const index = user.value.bookedCourses.findIndex(b => b.id === bookingId)
      if (index !== -1) {
        user.value.bookedCourses.splice(index, 1)
        user.value.tokens += 1 // Remboursement du token
        localStorage.setItem('elc_user', JSON.stringify(user.value))
        return true
      }
    }
    return false
  }

  const activateSubscription = (plan) => {
    if (user.value) {
      const expiresAt = new Date()
      expiresAt.setMonth(expiresAt.getMonth() + (plan === '4-month' ? 4 : 6))
      
      user.value.subscription = {
        active: true,
        plan: plan,
        expiresAt: expiresAt.toISOString(),
        tokensPerMonth: 4
      }
      
      // Bonus de 3 tokens à l'activation
      user.value.tokens += 3
      
      localStorage.setItem('elc_user', JSON.stringify(user.value))
      return true
    }
    return false
  }

  const updateProfile = (profileData) => {
    if (user.value) {
      Object.assign(user.value, profileData)
      user.value.lastActivity = new Date().toISOString()
      localStorage.setItem('elc_user', JSON.stringify(user.value))
      return true
    }
    return false
  }

  const markSessionCompleted = (sessionId) => {
    if (user.value && !user.value.completedSessions.includes(sessionId)) {
      user.value.completedSessions.push(sessionId)
      localStorage.setItem('elc_user', JSON.stringify(user.value))
      return true
    }
    return false
  }

  const saveEvaluationResult = (evaluationResult) => {
    if (user.value) {
      user.value.evaluations.push(evaluationResult)
      localStorage.setItem('elc_user', JSON.stringify(user.value))
      return true
    }
    return false
  }

  // Initialiser l'authentification au chargement
  initAuth()

  return {
    // État
    user,
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
    unlockLevel,
    updateProgress,
    addBooking,
    cancelBooking,
    activateSubscription,
    updateProfile,
    initAuth,
    markSessionCompleted,
    saveEvaluationResult
  }
}) 