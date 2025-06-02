import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  // État
  const users = ref([])
  const sessions = ref([])
  const transactions = ref([])
  const categories = ref([])
  const resources = ref([])
  const teachers = ref([])
  const templates = ref([])
  const notifications = ref([])
  const stats = ref({
    activeStudents: 0,
    monthlyRevenue: 0,
    totalTokensUsed: 0,
    totalCourses: 0,
    completionRate: 0,
    averageRating: 0
  })
  const loading = ref(false)
  const filters = ref({
    dateRange: 'month',
    userType: 'all',
    courseType: 'all'
  })

  // Getters
  const activeUsers = computed(() => 
    users.value.filter(u => u.lastActivity && new Date(u.lastActivity) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
  )

  const monthlyStats = computed(() => {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const monthlyTransactions = transactions.value.filter(t => 
      new Date(t.date) >= monthStart
    )
    
    return {
      revenue: monthlyTransactions.reduce((sum, t) => sum + t.amount, 0),
      tokensSold: monthlyTransactions.filter(t => t.type === 'token').reduce((sum, t) => sum + t.quantity, 0),
      subscriptions: monthlyTransactions.filter(t => t.type === 'subscription').length,
      newUsers: users.value.filter(u => new Date(u.createdAt) >= monthStart).length
    }
  })

  const upcomingSessions = computed(() => 
    sessions.value.filter(s => new Date(s.dateTime) > new Date()).sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
  )

  const resourcesBySession = computed(() => {
    const grouped = {}
    resources.value.forEach(resource => {
      if (!grouped[resource.sessionId]) {
        grouped[resource.sessionId] = []
      }
      grouped[resource.sessionId].push(resource)
    })
    return grouped
  })

  // Actions
  const loadAdminData = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      users.value = generateMockUsers()
      sessions.value = generateMockSessions()
      transactions.value = generateMockTransactions()
      categories.value = generateMockCategories()
      resources.value = generateMockResources()
      teachers.value = generateMockTeachers()
      templates.value = generateMockTemplates()
      
      updateStats()
    } finally {
      loading.value = false
    }
  }

  const updateStats = () => {
    stats.value = {
      activeStudents: activeUsers.value.length,
      monthlyRevenue: monthlyStats.value.revenue,
      totalTokensUsed: transactions.value.filter(t => t.type === 'token_used').length,
      totalCourses: sessions.value.filter(s => s.status === 'completed').length,
      completionRate: calculateCompletionRate(),
      averageRating: calculateAverageRating()
    }
  }

  const calculateCompletionRate = () => {
    const totalEnrolled = sessions.value.filter(s => s.status !== 'cancelled').length
    const completed = sessions.value.filter(s => s.status === 'completed').length
    return totalEnrolled > 0 ? Math.round((completed / totalEnrolled) * 100) : 0
  }

  const calculateAverageRating = () => {
    const ratings = sessions.value.filter(s => s.rating).map(s => s.rating)
    return ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1) : 0
  }

  // Gestion des catégories
  const createCategory = (categoryData) => {
    const newCategory = {
      id: Date.now(),
      ...categoryData,
      createdAt: new Date().toISOString()
    }
    categories.value.push(newCategory)
    return newCategory
  }

  const updateCategory = (categoryId, updates) => {
    const index = categories.value.findIndex(c => c.id === categoryId)
    if (index !== -1) {
      categories.value[index] = { ...categories.value[index], ...updates }
      return true
    }
    return false
  }

  const deleteCategory = (categoryId) => {
    const index = categories.value.findIndex(c => c.id === categoryId)
    if (index !== -1) {
      categories.value.splice(index, 1)
      return true
    }
    return false
  }

  // Gestion des ressources pédagogiques
  const uploadResource = (resourceData) => {
    const newResource = {
      id: Date.now(),
      ...resourceData,
      uploadedAt: new Date().toISOString(),
      size: resourceData.size || Math.floor(Math.random() * 10000) + 1000,
      downloads: 0
    }
    resources.value.push(newResource)
    return newResource
  }

  const deleteResource = (resourceId) => {
    const index = resources.value.findIndex(r => r.id === resourceId)
    if (index !== -1) {
      resources.value.splice(index, 1)
      return true
    }
    return false
  }

  const getResourcesByType = (type) => {
    return resources.value.filter(r => r.type === type)
  }

  // Gestion avancée des sessions
  const createSessionWithContent = (sessionData) => {
    const newSession = {
      id: Date.now(),
      ...sessionData,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      enrolled: [],
      content: {
        objectives: sessionData.objectives || [],
        description: sessionData.description || '',
        prerequisites: sessionData.prerequisites || [],
        outline: sessionData.outline || []
      },
      resources: [],
      meetingLink: sessionData.meetingLink || ''
    }
    sessions.value.push(newSession)
    return newSession
  }

  const updateSessionContent = (sessionId, content) => {
    const session = sessions.value.find(s => s.id === sessionId)
    if (session) {
      session.content = { ...session.content, ...content }
      return true
    }
    return false
  }

  const updateSessionMeetingLink = (sessionId, meetingLink) => {
    const session = sessions.value.find(s => s.id === sessionId)
    if (session) {
      session.meetingLink = meetingLink
      return true
    }
    return false
  }

  const addResourceToSession = (sessionId, resourceId) => {
    const session = sessions.value.find(s => s.id === sessionId)
    const resource = resources.value.find(r => r.id === resourceId)
    
    if (session && resource) {
      if (!session.resources) session.resources = []
      session.resources.push(resourceId)
      resource.sessionId = sessionId
      return true
    }
    return false
  }

  const removeResourceFromSession = (sessionId, resourceId) => {
    const session = sessions.value.find(s => s.id === sessionId)
    if (session && session.resources) {
      const index = session.resources.indexOf(resourceId)
      if (index !== -1) {
        session.resources.splice(index, 1)
        const resource = resources.value.find(r => r.id === resourceId)
        if (resource) resource.sessionId = null
        return true
      }
    }
    return false
  }

  const duplicateSession = (sessionId) => {
    const original = sessions.value.find(s => s.id === sessionId)
    if (original) {
      const duplicate = {
        ...original,
        id: Date.now(),
        name: `${original.name} (Copie)`,
        status: 'draft',
        enrolled: [],
        createdAt: new Date().toISOString()
      }
      sessions.value.push(duplicate)
      return duplicate
    }
    return null
  }

  // Gestion des professeurs
  const createTeacher = (teacherData) => {
    const newTeacher = {
      id: Date.now(),
      ...teacherData,
      createdAt: new Date().toISOString(),
      sessions: []
    }
    teachers.value.push(newTeacher)
    return newTeacher
  }

  const updateTeacher = (teacherId, updates) => {
    const index = teachers.value.findIndex(t => t.id === teacherId)
    if (index !== -1) {
      teachers.value[index] = { ...teachers.value[index], ...updates }
      return true
    }
    return false
  }

  const getTeacherStats = (teacherId) => {
    const teacherSessions = sessions.value.filter(s => s.teacherId === teacherId)
    return {
      totalSessions: teacherSessions.length,
      completedSessions: teacherSessions.filter(s => s.status === 'completed').length,
      averageRating: calculateTeacherRating(teacherId),
      totalStudents: teacherSessions.reduce((sum, s) => sum + s.enrolled.length, 0)
    }
  }

  const calculateTeacherRating = (teacherId) => {
    const teacherSessions = sessions.value.filter(s => s.teacherId === teacherId && s.rating)
    if (teacherSessions.length === 0) return 0
    const totalRating = teacherSessions.reduce((sum, s) => sum + s.rating, 0)
    return (totalRating / teacherSessions.length).toFixed(1)
  }

  // Gestion des templates
  const createTemplate = (templateData) => {
    const newTemplate = {
      id: Date.now(),
      ...templateData,
      createdAt: new Date().toISOString()
    }
    templates.value.push(newTemplate)
    return newTemplate
  }

  const applyTemplate = (sessionId, templateId) => {
    const session = sessions.value.find(s => s.id === sessionId)
    const template = templates.value.find(t => t.id === templateId)
    
    if (session && template) {
      session.content = { ...template.content }
      session.duration = template.duration
      session.maxStudents = template.maxStudents
      return true
    }
    return false
  }

  // Système de notifications
  const sendNotification = (notificationData) => {
    const newNotification = {
      id: Date.now(),
      ...notificationData,
      sentAt: new Date().toISOString(),
      read: false
    }
    notifications.value.push(newNotification)
    
    // Simuler l'envoi aux utilisateurs concernés
    if (notificationData.recipients === 'all') {
      users.value.forEach(user => {
        console.log(`Notification envoyée à ${user.email}: ${notificationData.message}`)
      })
    } else if (notificationData.sessionId) {
      const session = sessions.value.find(s => s.id === notificationData.sessionId)
      if (session) {
        session.enrolled.forEach(userId => {
          const user = users.value.find(u => u.id === userId)
          if (user) {
            console.log(`Notification envoyée à ${user.email}: ${notificationData.message}`)
          }
        })
      }
    }
    
    return newNotification
  }

  // Gestion des utilisateurs
  const updateUser = (userId, updates) => {
    const userIndex = users.value.findIndex(u => u.id === userId)
    if (userIndex !== -1) {
      users.value[userIndex] = { ...users.value[userIndex], ...updates }
      return true
    }
    return false
  }

  const suspendUser = (userId) => {
    return updateUser(userId, { status: 'suspended', suspendedAt: new Date().toISOString() })
  }

  const activateUser = (userId) => {
    return updateUser(userId, { status: 'active', suspendedAt: null })
  }

  const addTokensToUser = (userId, tokens) => {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      user.tokens += tokens
      transactions.value.push({
        id: Date.now(),
        userId,
        type: 'token_add',
        amount: 0,
        quantity: tokens,
        date: new Date().toISOString(),
        description: `Ajout manuel de ${tokens} tokens`
      })
      return true
    }
    return false
  }

  // Gestion des sessions
  const createSession = (sessionData) => {
    const newSession = {
      id: Date.now(),
      ...sessionData,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      enrolled: []
    }
    sessions.value.push(newSession)
    return newSession
  }

  const updateSession = (sessionId, updates) => {
    const sessionIndex = sessions.value.findIndex(s => s.id === sessionId)
    if (sessionIndex !== -1) {
      sessions.value[sessionIndex] = { ...sessions.value[sessionIndex], ...updates }
      return true
    }
    return false
  }

  const deleteSession = (sessionId) => {
    const index = sessions.value.findIndex(s => s.id === sessionId)
    if (index !== -1) {
      // Rembourser les tokens si la session était planifiée
      const session = sessions.value[index]
      if (session.status === 'scheduled' && session.enrolled.length > 0) {
        session.enrolled.forEach(userId => {
          addTokensToUser(userId, 1)
        })
      }
      
      // Supprimer les ressources associées
      resources.value.forEach(resource => {
        if (resource.sessionId === sessionId) {
          resource.sessionId = null
        }
      })
      
      sessions.value.splice(index, 1)
      return true
    }
    return false
  }

  const cancelSession = (sessionId, reason) => {
    const session = sessions.value.find(s => s.id === sessionId)
    if (session) {
      session.status = 'cancelled'
      session.cancelReason = reason
      session.cancelledAt = new Date().toISOString()
      
      // Rembourser les tokens aux étudiants
      session.enrolled.forEach(userId => {
        addTokensToUser(userId, 1)
      })
      
      // Envoyer une notification
      sendNotification({
        type: 'session_cancelled',
        sessionId,
        title: 'Session annulée',
        message: `La session "${session.name}" a été annulée. Raison: ${reason}`,
        recipients: 'session'
      })
      
      return true
    }
    return false
  }

  // Gestion financière
  const getRevenueByPeriod = (period = 'month') => {
    const now = new Date()
    let startDate
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(0)
    }
    
    return transactions.value
      .filter(t => new Date(t.date) >= startDate && t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const getTopStudents = (limit = 10) => {
    return users.value
      .map(user => ({
        ...user,
        totalSessions: sessions.value.filter(s => s.enrolled.includes(user.id)).length,
        totalSpent: transactions.value
          .filter(t => t.userId === user.id && t.amount > 0)
          .reduce((sum, t) => sum + t.amount, 0)
      }))
      .sort((a, b) => b.totalSessions - a.totalSessions)
      .slice(0, limit)
  }

  // Recherche et filtres
  const searchUsers = (query) => {
    const searchTerm = query.toLowerCase()
    return users.value.filter(user => 
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.level.toLowerCase().includes(searchTerm)
    )
  }

  const getSessionsByTeacher = (teacherId) => {
    return sessions.value.filter(s => s.teacherId === teacherId)
  }

  const getSessionsByCategory = (categoryId) => {
    return sessions.value.filter(s => s.categoryId === categoryId)
  }

  const getSessionsByDate = (date) => {
    const targetDate = new Date(date).toDateString()
    return sessions.value.filter(s => 
      new Date(s.dateTime).toDateString() === targetDate
    )
  }

  // Génération de données mockées
  const generateMockUsers = () => {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1']
    const names = ['Marie Dupont', 'Jean Martin', 'Sophie Bernard', 'Pierre Durand', 'Emma Leroy', 'Lucas Moreau', 'Léa Simon', 'Hugo Laurent', 'Chloé Michel', 'Louis Garcia']
    
    return Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: names[i % names.length] + ' ' + (Math.floor(i / names.length) + 1),
      email: `user${i + 1}@example.com`,
      level: levels[Math.floor(Math.random() * levels.length)],
      tokens: Math.floor(Math.random() * 10),
      status: Math.random() > 0.9 ? 'suspended' : 'active',
      subscription: Math.random() > 0.7 ? {
        type: Math.random() > 0.5 ? '4-months' : '6-months',
        startDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString()
      } : null,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      progress: {
        A1: { completed: Math.floor(Math.random() * 100), lessons: 20 },
        A2: { completed: Math.floor(Math.random() * 100), lessons: 20 },
        B1: { completed: Math.floor(Math.random() * 100), lessons: 20 },
        B2: { completed: Math.floor(Math.random() * 100), lessons: 20 }
      }
    }))
  }

  const generateMockSessions = () => {
    const types = ['course', 'grammar', 'conversation']
    const statuses = ['scheduled', 'completed', 'cancelled']
    
    return Array.from({ length: 100 }, (_, i) => {
      const date = new Date(Date.now() + (Math.random() - 0.5) * 60 * 24 * 60 * 60 * 1000)
      const status = date < new Date() ? statuses[Math.floor(Math.random() * 2) + 1] : 'scheduled'
      
      return {
        id: i + 1,
        categoryId: Math.floor(Math.random() * 5) + 1,
        type: types[Math.floor(Math.random() * types.length)],
        name: `Session ${i + 1}`,
        teacherId: Math.floor(Math.random() * 4) + 1,
        teacher: ['Sarah Johnson', 'Mike Wilson', 'Emma Davis', 'David Brown'][Math.floor(Math.random() * 4)],
        dateTime: date.toISOString(),
        duration: 60,
        maxStudents: 5,
        enrolled: Array.from({ length: Math.floor(Math.random() * 6) }, () => Math.floor(Math.random() * 50) + 1),
        status,
        rating: status === 'completed' ? Math.floor(Math.random() * 2) + 3.5 : null,
        level: ['A1', 'A2', 'B1', 'B2'][Math.floor(Math.random() * 4)],
        content: {
          objectives: ['Objectif 1', 'Objectif 2', 'Objectif 3'],
          description: 'Description détaillée de la session',
          prerequisites: ['Prérequis 1', 'Prérequis 2'],
          outline: ['Introduction', 'Partie principale', 'Exercices', 'Conclusion']
        },
        resources: [],
        meetingLink: status === 'scheduled' && Math.random() > 0.5 
          ? `https://meet.elc-academy.com/session-${i + 1}` 
          : ''
      }
    })
  }

  const generateMockCategories = () => {
    return [
      {
        id: 1,
        name: 'Grammaire fondamentale',
        description: 'Bases grammaticales essentielles',
        color: '#3B82F6',
        icon: '📝'
      },
      {
        id: 2,
        name: 'Communication orale',
        description: 'Pratique de l\'expression orale',
        color: '#10B981',
        icon: '💬'
      },
      {
        id: 3,
        name: 'Business English',
        description: 'Anglais professionnel',
        color: '#8B5CF6',
        icon: '💼'
      },
      {
        id: 4,
        name: 'Culture et actualité',
        description: 'Découverte culturelle',
        color: '#F59E0B',
        icon: '🌍'
      },
      {
        id: 5,
        name: 'Préparation examens',
        description: 'TOEIC, TOEFL, Cambridge',
        color: '#EF4444',
        icon: '🎓'
      }
    ]
  }

  const generateMockResources = () => {
    const types = ['pdf', 'video', 'audio', 'image', 'document', 'presentation']
    const names = [
      'Grammar Guide Chapter 1.pdf',
      'Pronunciation Exercise.mp3',
      'Business Vocabulary.pptx',
      'Conversation Practice Video.mp4',
      'Reading Comprehension Text.docx',
      'Listening Exercise Audio.wav'
    ]
    
    return Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: names[i % names.length],
      type: types[Math.floor(Math.random() * types.length)],
      sessionId: Math.random() > 0.3 ? Math.floor(Math.random() * 100) + 1 : null,
      size: Math.floor(Math.random() * 50000) + 1000,
      uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      uploadedBy: 'Admin',
      downloads: Math.floor(Math.random() * 100),
      url: `/resources/${i + 1}`
    }))
  }

  const generateMockTeachers = () => {
    return [
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@elc.com',
        specialities: ['Grammar', 'Business English'],
        languages: ['English', 'French'],
        experience: '10 years',
        bio: 'Experienced ESL teacher specializing in business English',
        availability: ['Monday', 'Wednesday', 'Friday'],
        rating: 4.8
      },
      {
        id: 2,
        name: 'Mike Wilson',
        email: 'mike.wilson@elc.com',
        specialities: ['Conversation', 'Culture'],
        languages: ['English', 'Spanish'],
        experience: '7 years',
        bio: 'Native speaker focused on conversational skills',
        availability: ['Tuesday', 'Thursday', 'Saturday'],
        rating: 4.6
      },
      {
        id: 3,
        name: 'Emma Davis',
        email: 'emma.davis@elc.com',
        specialities: ['Grammar', 'Exam Preparation'],
        languages: ['English', 'German'],
        experience: '5 years',
        bio: 'Specialist in exam preparation (TOEIC, TOEFL)',
        availability: ['Monday', 'Tuesday', 'Thursday'],
        rating: 4.9
      },
      {
        id: 4,
        name: 'David Brown',
        email: 'david.brown@elc.com',
        specialities: ['Business English', 'Writing'],
        languages: ['English', 'French', 'Italian'],
        experience: '12 years',
        bio: 'Business communication expert',
        availability: ['Wednesday', 'Friday', 'Saturday'],
        rating: 4.7
      }
    ]
  }

  const generateMockTemplates = () => {
    return [
      {
        id: 1,
        name: 'Template Grammaire Débutant',
        category: 'grammar',
        level: 'A1',
        duration: 60,
        maxStudents: 5,
        content: {
          objectives: [
            'Comprendre la structure de base',
            'Utiliser correctement les temps',
            'Construire des phrases simples'
          ],
          description: 'Session de grammaire pour débutants',
          prerequisites: ['Aucun'],
          outline: [
            'Révision des acquis (10 min)',
            'Introduction du nouveau concept (15 min)',
            'Exemples et démonstration (15 min)',
            'Exercices pratiques (15 min)',
            'Questions et résumé (5 min)'
          ]
        }
      },
      {
        id: 2,
        name: 'Template Conversation Business',
        category: 'conversation',
        level: 'B2',
        duration: 75,
        maxStudents: 5,
        content: {
          objectives: [
            'Maîtriser le vocabulaire professionnel',
            'Pratiquer les situations courantes',
            'Améliorer la fluidité'
          ],
          description: 'Pratique de conversation en contexte professionnel',
          prerequisites: ['Niveau B1 minimum', 'Vocabulaire business de base'],
          outline: [
            'Warm-up et introductions (10 min)',
            'Présentation du thème (10 min)',
            'Jeux de rôle (30 min)',
            'Discussion ouverte (20 min)',
            'Feedback et corrections (5 min)'
          ]
        }
      }
    ]
  }

  const generateMockTransactions = () => {
    const types = ['token', 'subscription', 'token_used']
    
    return Array.from({ length: 200 }, (_, i) => {
      const type = types[Math.floor(Math.random() * types.length)]
      const date = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
      
      let amount = 0
      let quantity = 1
      let description = ''
      
      switch (type) {
        case 'token':
          quantity = [1, 5, 10, 20][Math.floor(Math.random() * 4)]
          amount = quantity * 35
          description = `Achat de ${quantity} tokens`
          break
        case 'subscription':
          const months = Math.random() > 0.5 ? 4 : 6
          amount = months === 4 ? 120 * 4 : 100 * 6
          description = `Abonnement ${months} mois`
          break
        case 'token_used':
          description = 'Utilisation pour réservation de cours'
          break
      }
      
      return {
        id: i + 1,
        userId: Math.floor(Math.random() * 50) + 1,
        type,
        amount,
        quantity,
        date: date.toISOString(),
        description,
        status: 'completed',
        paymentMethod: amount > 0 ? 'stripe' : null
      }
    })
  }

  // Exportation de données
  const exportData = (type) => {
    let data = []
    let filename = ''
    
    switch (type) {
      case 'users':
        data = users.value
        filename = 'users_export.csv'
        break
      case 'sessions':
        data = sessions.value
        filename = 'sessions_export.csv'
        break
      case 'transactions':
        data = transactions.value
        filename = 'transactions_export.csv'
        break
      case 'resources':
        data = resources.value
        filename = 'resources_export.csv'
        break
    }
    
    const csv = convertToCSV(data)
    downloadCSV(csv, filename)
  }

  const convertToCSV = (data) => {
    if (!data.length) return ''
    
    const headers = Object.keys(data[0])
    const rows = data.map(item => 
      headers.map(header => {
        const value = item[header]
        return typeof value === 'object' ? JSON.stringify(value) : value
      }).join(',')
    )
    
    return [headers.join(','), ...rows].join('\n')
  }

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return {
    // État
    users,
    sessions,
    transactions,
    categories,
    resources,
    teachers,
    templates,
    notifications,
    stats,
    loading,
    filters,
    
    // Getters
    activeUsers,
    monthlyStats,
    upcomingSessions,
    resourcesBySession,
    
    // Actions
    loadAdminData,
    updateStats,
    
    // Gestion des utilisateurs
    updateUser,
    suspendUser,
    activateUser,
    addTokensToUser,
    searchUsers,
    
    // Gestion des sessions
    createSession,
    createSessionWithContent,
    updateSession,
    updateSessionContent,
    updateSessionMeetingLink,
    deleteSession,
    cancelSession,
    duplicateSession,
    getSessionsByTeacher,
    getSessionsByCategory,
    getSessionsByDate,
    
    // Gestion des catégories
    createCategory,
    updateCategory,
    deleteCategory,
    
    // Gestion des ressources
    uploadResource,
    deleteResource,
    getResourcesByType,
    addResourceToSession,
    removeResourceFromSession,
    
    // Gestion des professeurs
    createTeacher,
    updateTeacher,
    getTeacherStats,
    
    // Gestion des templates
    createTemplate,
    applyTemplate,
    
    // Notifications
    sendNotification,
    
    // Gestion financière
    getRevenueByPeriod,
    getTopStudents,
    
    // Export
    exportData
  }
}) 