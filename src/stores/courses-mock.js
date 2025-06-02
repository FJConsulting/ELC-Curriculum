import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'
import { useAdminStore } from './admin'

export const useCoursesStore = defineStore('courses', () => {
  const authStore = useAuthStore()
  const adminStore = useAdminStore()
  
  const userProgress = ref({})
  const enrolledSessions = ref([])
  const completedLessons = ref(new Set())

  // Computed pour accéder aux données de l'admin
  const availableSessions = computed(() => {
    // Retourner toutes les sessions programmées et non annulées
    return adminStore.sessions.filter(s => 
      s.status === 'scheduled' && 
      new Date(s.dateTime) > new Date()
    ).sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
  })

  const sessionsByType = computed(() => {
    const grouped = {
      course: [],
      grammar: [],
      conversation: []
    }
    
    availableSessions.value.forEach(session => {
      if (grouped[session.type]) {
        grouped[session.type].push(session)
      }
    })
    
    return grouped
  })

  const userEnrolledSessions = computed(() => {
    if (!authStore.user) return []
    return adminStore.sessions.filter(s => 
      s.enrolled?.includes(authStore.user.id)
    ).sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
  })

  const upcomingSessions = computed(() => {
    return userEnrolledSessions.value.filter(s => 
      new Date(s.dateTime) > new Date() && s.status === 'scheduled'
    )
  })

  const pastSessions = computed(() => {
    return userEnrolledSessions.value.filter(s => 
      new Date(s.dateTime) <= new Date() || s.status === 'completed'
    )
  })

  // Méthodes
  const bookSession = async (sessionId) => {
    const session = adminStore.sessions.find(s => s.id === sessionId)
    
    if (!session || !authStore.user) {
      throw new Error('Session non trouvée ou utilisateur non connecté')
    }
    
    if (authStore.user.tokens < 1) {
      throw new Error('Tokens insuffisants')
    }
    
    if (session.enrolled.length >= session.maxStudents) {
      throw new Error('Session complète')
    }
    
    if (session.enrolled.includes(authStore.user.id)) {
      throw new Error('Déjà inscrit à cette session')
    }
    
    // Ajouter l'utilisateur aux inscrits
    session.enrolled.push(authStore.user.id)
    
    // Déduire un token
    authStore.user.tokens -= 1
    
    // Créer une transaction
    adminStore.transactions.push({
      id: Date.now(),
      userId: authStore.user.id,
      type: 'token_used',
      amount: 0,
      quantity: 1,
      date: new Date().toISOString(),
      description: `Inscription à la session "${session.name}"`,
      sessionId: sessionId
    })
    
    return session
  }

  const cancelBooking = async (sessionId) => {
    const session = adminStore.sessions.find(s => s.id === sessionId)
    
    if (!session || !authStore.user) {
      throw new Error('Session non trouvée ou utilisateur non connecté')
    }
    
    const enrolledIndex = session.enrolled.indexOf(authStore.user.id)
    if (enrolledIndex === -1) {
      throw new Error('Non inscrit à cette session')
    }
    
    // Vérifier qu'on peut annuler (24h avant)
    const hoursUntilSession = (new Date(session.dateTime) - new Date()) / (1000 * 60 * 60)
    if (hoursUntilSession < 24) {
      throw new Error('Annulation impossible moins de 24h avant la session')
    }
    
    // Retirer l'utilisateur des inscrits
    session.enrolled.splice(enrolledIndex, 1)
    
    // Rembourser le token
    authStore.user.tokens += 1
    
    // Créer une transaction de remboursement
    adminStore.transactions.push({
      id: Date.now(),
      userId: authStore.user.id,
      type: 'token_refund',
      amount: 0,
      quantity: 1,
      date: new Date().toISOString(),
      description: `Annulation de l'inscription à "${session.name}"`,
      sessionId: sessionId
    })
    
    return true
  }

  const getSessionById = (id) => {
    return adminStore.sessions.find(s => s.id === parseInt(id))
  }

  const getSessionsByLevel = (level) => {
    return availableSessions.value.filter(s => s.level === level)
  }

  const getSessionsByCategory = (categoryId) => {
    return availableSessions.value.filter(s => s.categoryId === categoryId)
  }

  const searchSessions = (query) => {
    const searchTerm = query.toLowerCase()
    return availableSessions.value.filter(s => 
      s.name.toLowerCase().includes(searchTerm) ||
      s.content?.description?.toLowerCase().includes(searchTerm) ||
      s.teacher?.toLowerCase().includes(searchTerm)
    )
  }

  const getUserProgress = (level) => {
    if (!authStore.user) return 0
    
    // Calculer le progrès basé sur les sessions complétées
    const levelSessions = pastSessions.value.filter(s => 
      s.level === level && s.status === 'completed'
    )
    
    // Supposons 20 sessions par niveau
    const progress = Math.min((levelSessions.length / 20) * 100, 100)
    return Math.round(progress)
  }

  const getTotalProgress = () => {
    if (!authStore.user) return 0
    
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1']
    const totalProgress = levels.reduce((sum, level) => sum + getUserProgress(level), 0)
    return Math.round(totalProgress / levels.length)
  }

  const markLessonComplete = async (lessonId) => {
    completedLessons.value.add(lessonId)
    // Ici on pourrait sauvegarder dans une API
  }

  const isLessonComplete = (lessonId) => {
    return completedLessons.value.has(lessonId)
  }

  const getNextSession = () => {
    return upcomingSessions.value[0] || null
  }

  const getRecommendedSessions = () => {
    if (!authStore.user) return []
    
    // Recommander des sessions du niveau actuel de l'utilisateur
    const userLevel = authStore.user.level
    return getSessionsByLevel(userLevel).slice(0, 3)
  }

  // Charger les données initiales
  const loadCoursesData = async () => {
    // S'assurer que les données admin sont chargées
    if (adminStore.sessions.length === 0) {
      await adminStore.loadAdminData()
    }
  }

  return {
    // État
    userProgress,
    enrolledSessions,
    completedLessons,
    
    // Computed
    availableSessions,
    sessionsByType,
    userEnrolledSessions,
    upcomingSessions,
    pastSessions,
    
    // Méthodes
    bookSession,
    cancelBooking,
    getSessionById,
    getSessionsByLevel,
    getSessionsByCategory,
    searchSessions,
    getUserProgress,
    getTotalProgress,
    markLessonComplete,
    isLessonComplete,
    getNextSession,
    getRecommendedSessions,
    loadCoursesData
  }
}) 