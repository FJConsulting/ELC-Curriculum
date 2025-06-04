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
    const grouped = {}
    
    // Récupérer les types de cours depuis le store admin
    const adminStore = useAdminStore()
    
    // Initialiser les groupes pour chaque type de cours
    if (adminStore.courseTypes && adminStore.courseTypes.length > 0) {
      adminStore.courseTypes.forEach(courseType => {
        const typeKey = courseType.slug || courseType.route?.substring(1) || `type-${courseType.id}`
        grouped[typeKey] = []
      })
    } else {
      // Fallback pour la rétrocompatibilité - toujours initialiser ces groupes
      grouped.course = []
      grouped['grammar-workshops'] = []
      grouped['conversation-club'] = []
      grouped.pronunciation = []
    }
    
    // Ajouter des logs pour le débogage
    console.log('🔍 Types de cours disponibles:', Object.keys(grouped))
    console.log('🔍 Sessions disponibles:', availableSessions.value.length)
    
    // Grouper les sessions par type
    availableSessions.value.forEach(session => {
      let typeKey = null
      
      // Priorité 1: Utiliser courseTypeId si disponible
      if (session.courseTypeId || session.course_type_id) {
        const courseTypeId = session.courseTypeId || session.course_type_id
        const courseType = adminStore.courseTypes.find(ct => ct.id === courseTypeId)
        if (courseType) {
          typeKey = courseType.slug || courseType.route?.substring(1) || `type-${courseType.id}`
        }
      }
      
      // Priorité 2: Utiliser le champ type si courseTypeId n'est pas disponible ou invalide
      if (!typeKey && session.type) {
        typeKey = session.type
      }
      
      // Priorité 3: Essayer de déduire le type à partir du nom ou de la description
      if (!typeKey && (session.name || session.content?.description)) {
        const text = (session.name + ' ' + (session.content?.description || '')).toLowerCase()
        if (text.includes('grammaire')) typeKey = 'grammar-workshops'
        else if (text.includes('conversation')) typeKey = 'conversation-club'
        else if (text.includes('prononciation')) typeKey = 'pronunciation'
        else typeKey = 'course' // Par défaut
      }
      
      // Si on a trouvé un type valide, ajouter la session au groupe correspondant
      if (typeKey && grouped[typeKey]) {
        grouped[typeKey].push(session)
      } else {
        // Fallback: ajouter à "course" si aucun type valide n'est trouvé
        if (grouped.course) {
          grouped.course.push(session)
        } else {
          // Si même le groupe course n'existe pas, créer un groupe "other"
          if (!grouped.other) grouped.other = []
          grouped.other.push(session)
        }
      }
    })
    
    // Log pour débogage
    Object.keys(grouped).forEach(key => {
      console.log(`🔍 Sessions de type ${key}:`, grouped[key].length)
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
    try {
      console.log('🔄 Début du chargement des données des cours...')
      
      // Charger les types de cours en premier
      if (adminStore.courseTypes.length === 0) {
        console.log('🔄 Chargement des types de cours...')
        if (adminStore.loadCourseTypes) {
          await adminStore.loadCourseTypes()
        } else {
          console.warn('⚠️ loadCourseTypes non disponible, utilisation des types par défaut')
        }
        console.log('✅ Types de cours chargés:', adminStore.courseTypes.length)
      }
      
      // Ensuite charger toutes les données admin si nécessaire
      if (adminStore.sessions.length === 0) {
        console.log('🔄 Chargement des données admin...')
        await adminStore.loadAllData()
        console.log('✅ Sessions chargées:', adminStore.sessions.length)
      }
      
      console.log('✅ Données des cours chargées avec succès')
      return true
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données des cours:', error)
      // Don't throw the error, just log it to prevent blocking the UI
      return false
    }
  }

  // Méthode pour filtrer les sessions par type de cours
  const getSessionsByType = (type) => {
    // Normaliser le type (enlever le slash initial si présent)
    let normalizedType = type
    
    if (typeof normalizedType === 'string') {
      normalizedType = normalizedType.startsWith('/') ? normalizedType.substring(1) : normalizedType
      
      // Essayer différentes variantes du type
      const possibleTypes = [
        normalizedType,
        normalizedType.replace(/-/g, '_'),
        normalizedType.replace(/_/g, '-')
      ]
      
      // Chercher le type dans les clés disponibles
      for (const possibleType of possibleTypes) {
        if (sessionsByType.value[possibleType]) {
          return sessionsByType.value[possibleType]
        }
      }
    }
    
    // Si le type n'est pas trouvé, essayer de le déduire à partir des types disponibles
    const availableTypes = Object.keys(sessionsByType.value)
    console.log('🔍 Type demandé:', type, 'Types disponibles:', availableTypes)
    
    // Correspondances connues
    const typeMap = {
      'conversation-club': ['conversation', 'club', 'conversation-club'],
      'grammar-workshops': ['grammar', 'workshops', 'grammar-workshops'],
      'pronunciation': ['pronunciation', 'prononciation'],
      'course': ['course', 'courses', 'cours']
    }
    
    // Chercher une correspondance
    for (const [key, aliases] of Object.entries(typeMap)) {
      if (aliases.some(alias => normalizedType.includes(alias)) && sessionsByType.value[key]) {
        console.log(`🔍 Correspondance trouvée: ${normalizedType} -> ${key}`)
        return sessionsByType.value[key]
      }
    }
    
    // Fallback: retourner un tableau vide
    console.warn(`⚠️ Aucune session trouvée pour le type: ${type}`)
    return []
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
    getSessionsByType,
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


// Charger les données initiales
const loadCoursesData = async () => {
  try {
    console.log('🔄 Début du chargement des données des cours...')
    
    // Charger les types de cours en premier
    if (adminStore.courseTypes.length === 0) {
      console.log('🔄 Chargement des types de cours...')
      if (adminStore.loadCourseTypes) {
        await adminStore.loadCourseTypes()
      }
      console.log('✅ Types de cours chargés:', adminStore.courseTypes.length)
    }
    
    // Ensuite charger toutes les données admin si nécessaire
    if (adminStore.sessions.length === 0) {
      console.log('🔄 Chargement des données admin...')
      await adminStore.loadAllData()
      console.log('✅ Sessions chargées:', adminStore.sessions.length)
    }
    
    console.log('✅ Données des cours chargées avec succès')
    return true
  } catch (error) {
    console.error('❌ Erreur lors du chargement des données des cours:', error)
    // Don't throw the error, just log it to prevent blocking the UI
    return false
  }
}