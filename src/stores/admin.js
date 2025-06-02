import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  // État
  const users = ref([])
  const sessions = ref([])
  const transactions = ref([])
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

  // Actions
  const loadAdminData = async () => {
    loading.value = true
    try {
      // Simuler le chargement des données
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Charger les utilisateurs
      users.value = generateMockUsers()
      
      // Charger les sessions
      sessions.value = generateMockSessions()
      
      // Charger les transactions
      transactions.value = generateMockTransactions()
      
      // Calculer les statistiques
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
    const teachers = ['Sarah Johnson', 'Mike Wilson', 'Emma Davis', 'David Brown']
    const statuses = ['scheduled', 'completed', 'cancelled']
    
    return Array.from({ length: 100 }, (_, i) => {
      const date = new Date(Date.now() + (Math.random() - 0.5) * 60 * 24 * 60 * 60 * 1000)
      const status = date < new Date() ? statuses[Math.floor(Math.random() * 2) + 1] : 'scheduled'
      
      return {
        id: i + 1,
        type: types[Math.floor(Math.random() * types.length)],
        name: `Session ${i + 1}`,
        teacher: teachers[Math.floor(Math.random() * teachers.length)],
        teacherId: Math.floor(Math.random() * teachers.length) + 1,
        dateTime: date.toISOString(),
        duration: 60,
        maxStudents: 5,
        enrolled: Array.from({ length: Math.floor(Math.random() * 6) }, () => Math.floor(Math.random() * 50) + 1),
        status,
        rating: status === 'completed' ? Math.floor(Math.random() * 2) + 3.5 : null,
        level: ['A1', 'A2', 'B1', 'B2'][Math.floor(Math.random() * 4)]
      }
    })
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
    }
    
    // Convertir en CSV
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
    stats,
    loading,
    filters,
    
    // Getters
    activeUsers,
    monthlyStats,
    upcomingSessions,
    
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
    updateSession,
    cancelSession,
    getSessionsByTeacher,
    getSessionsByDate,
    
    // Gestion financière
    getRevenueByPeriod,
    getTopStudents,
    
    // Export
    exportData
  }
}) 