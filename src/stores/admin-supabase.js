import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, supabaseAdmin } from '../config/supabase.js'

// Ajouter un log pour vérifier l'import
console.log('📦 Import supabaseAdmin:', supabaseAdmin ? 'Succès' : 'Échec')

export const useAdminStore = defineStore('admin', () => {
  // État
  const teachers = ref([])
  const students = ref([])
  const sessions = ref([])
  const categories = ref([])
  const bookings = ref([])
  const evaluations = ref([])
  const resources = ref([])
  const templates = ref([])
  const transactions = ref([]) // Ajouter cette ligne
  const loading = ref(false)
  const error = ref(null)

  // Propriété computed pour users (combinaison de students et teachers)
  const users = computed(() => [...students.value, ...teachers.value])

  // Statistiques calculées (version corrigée)
  const stats = computed(() => {
    const attendedBookings = bookings.value.filter(b => b.status === 'attended')
    const totalRevenue = attendedBookings.length * 35
    
    return {
      activeStudents: students.value.filter(s => s.status === 'active').length,
      totalStudents: students.value.length,
      totalTeachers: teachers.value.length,
      totalSessions: sessions.value.length,
      totalCourses: sessions.value.length, // Alias pour totalSessions
      totalRevenue,
      monthlyRevenue: totalRevenue, // Simplification pour l'instant
      completionRate: sessions.value.length > 0 ? Math.round((attendedBookings.length / sessions.value.length) * 100) : 0,
      averageRating: 4.8 // Valeur temporaire, à calculer depuis les évaluations
    }
  })

  const upcomingSessions = computed(() => {
    return sessions.value.filter(s => {
      const sessionDate = new Date(s.date_time)
      return sessionDate > new Date() && s.status === 'scheduled'
    }).sort((a, b) => new Date(a.date_time) - new Date(b.date_time))
  })

  // Fonctions de chargement des données
  const loadTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'teacher')
      
      if (error) throw error
      teachers.value = data || []
      console.log('✅ Professeurs chargés:', data?.length || 0)
    } catch (err) {
      console.error('❌ Erreur chargement professeurs:', err)
      throw err
    }
  }

  const loadStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
      
      if (error) throw error
      students.value = data || []
      console.log('✅ Étudiants chargés:', data?.length || 0)
    } catch (err) {
      console.error('❌ Erreur chargement étudiants:', err)
      throw err
    }
  }

  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('date_time', { ascending: true })
      
      if (error) throw error
      
      // Ajouter la propriété enrolled à chaque session
      sessions.value = (data || []).map(session => ({
        ...session,
        enrolled: session.enrolled || [],
        maxStudents: session.maxStudents || 10
      }))
      
      console.log('✅ Sessions chargées:', sessions.value.length)
    } catch (err) {
      console.error('❌ Erreur chargement sessions:', err)
      throw err
    }
  }

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('course_categories')
        .select('*')
        .order('name')
      
      if (error) throw error
      categories.value = data || []
      console.log('✅ Catégories chargées:', data?.length || 0)
    } catch (err) {
      console.error('❌ Erreur chargement catégories:', err)
      throw err
    }
  }

  const loadBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('booked_at', { ascending: false }) // Utiliser booked_at au lieu de created_at
      
      if (error) throw error
      bookings.value = data || []
      console.log('✅ Réservations chargées:', data?.length || 0)
    } catch (err) {
      console.error('❌ Erreur chargement réservations:', err)
      throw err
    }
  }

  const loadEvaluations = async () => {
    try {
      const { data, error } = await supabase
        .from('evaluations')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      evaluations.value = data || []
      console.log('✅ Évaluations chargées:', data?.length || 0)
    } catch (err) {
      console.error('❌ Erreur chargement évaluations:', err)
      throw err
    }
  }

  const loadResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      resources.value = data || []
      console.log('✅ Ressources chargées:', data?.length || 0)
    } catch (err) {
      console.error('❌ Erreur chargement ressources:', err)
      throw err
    }
  }

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('session_templates')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      templates.value = data || []
      console.log('✅ Templates chargés:', data?.length || 0)
    } catch (err) {
      console.error('❌ Erreur chargement templates:', err)
      // Ne pas faire échouer le chargement si la table n'existe pas encore
      templates.value = []
    }
  }

  // Ajouter cette fonction
  // Fonction pour charger les transactions
  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.warn('Table transactions non trouvée, utilisation de données de test:', error.message)
        // Données de test en attendant la création de la table
        transactions.value = [
          {
            id: 1,
            amount: 50.00,
            type: 'payment',
            description: 'Paiement cours particulier',
            created_at: new Date().toISOString(),
            user_id: 'test-user-1'
          },
          {
            id: 2,
            amount: 30.00,
            type: 'payment',
            description: 'Paiement atelier grammaire',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            user_id: 'test-user-2'
          }
        ]
        return
      }
      
      transactions.value = data || []
    } catch (err) {
      console.error('Erreur lors du chargement des transactions:', err)
      error.value = err.message
      // Données de test en cas d'erreur
      transactions.value = []
    }
  }

  // Fonction loadAllData
  const loadAllData = async () => {
    try {
      loading.value = true
      error.value = null
      
      await Promise.all([
        loadTeachers(),
        loadStudents(),
        loadSessions(),
        loadCategories(),
        loadBookings(),
        loadEvaluations(),
        loadResources(),
        loadTemplates(),
        loadTransactions() // Ajouter cette ligne
      ])
      
      console.log('✅ Toutes les données chargées avec succès')
    } catch (err) {
      console.error('❌ Erreur lors du chargement des données:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // Fonctions CRUD pour les professeurs
  const addTeacher = async (teacherData) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{ ...teacherData, role: 'teacher' }])
        .select()
      
      if (error) throw error
      
      await loadTeachers()
      return data[0]
    } catch (err) {
      console.error('❌ Erreur ajout professeur:', err)
      throw err
    }
  }

  const updateTeacher = async (teacherId, teacherData) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(teacherData)
        .eq('id', teacherId)
        .select()
      
      if (error) throw error
      
      await loadTeachers()
      return data[0]
    } catch (err) {
      console.error('❌ Erreur mise à jour professeur:', err)
      throw err
    }
  }

  const deleteTeacher = async (teacherId) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', teacherId)
      
      if (error) throw error
      
      await loadTeachers()
    } catch (err) {
      console.error('❌ Erreur suppression professeur:', err)
      throw err
    }
  }

  // Fonction pour créer une session
  const createSession = async (sessionData) => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert([sessionData])
        .select()
      
      if (error) throw error
      
      await loadSessions()
      return data[0]
    } catch (err) {
      console.error('❌ Erreur création session:', err)
      throw err
    }
  }

  const deleteCategory = async (categoryId) => {
    try {
      const { error } = await supabase
        .from('course_categories')
        .delete()
        .eq('id', categoryId)
      
      if (error) throw error
      
      await loadCategories()
    } catch (err) {
      console.error('❌ Erreur suppression catégorie:', err)
      throw err
    }
  }

  const createTemplate = async (templateData) => {
    try {
      const { data, error } = await supabase
        .from('session_templates')
        .insert([templateData])
        .select()
      
      if (error) throw error
      
      await loadTemplates()
      return data[0]
    } catch (err) {
      console.error('❌ Erreur création template:', err)
      throw err
    }
  }

  const getSessionsByCategory = (categoryId) => {
    return sessions.value.filter(session => session.category_id === categoryId)
  }

  // Fonctions utilitaires
  // Ajouter cette fonction avant le return
  const getTopStudents = (limit = 5) => {
    if (!students.value || students.value.length === 0) {
      return []
    }
    
    // Simuler des données pour les top étudiants
    return students.value
      .map(student => ({
        ...student,
        totalSessions: Math.floor(Math.random() * 20) + 1,
        totalSpent: Math.floor(Math.random() * 1000) + 100,
        level: student.level || 'Débutant'
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit)
  }

  const getCategoryById = (id) => {
    return categories.value.find(cat => cat.id === id)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const getTeacherStats = (teacherId) => {
    const teacherSessions = sessions.value.filter(s => s.teacher_id === teacherId)
    const teacherBookings = bookings.value.filter(b => 
      teacherSessions.some(s => s.id === b.session_id)
    )
    
    return {
      totalSessions: teacherSessions.length,
      totalStudents: new Set(teacherBookings.map(b => b.userId)).size,
      revenue: teacherBookings.filter(b => b.status === 'attended').length * 35
    }
  }

  // Fonctions utilitaires supplémentaires
  const searchUsers = (query) => {
    const allUsers = [...students.value, ...teachers.value]
    return allUsers.filter(user => 
      user.name?.toLowerCase().includes(query.toLowerCase()) ||
      user.email?.toLowerCase().includes(query.toLowerCase())
    )
  }

  const exportData = (type) => {
    console.log(`Exporting ${type} data...`)
    // Implémentation de l'export à ajouter plus tard
    return Promise.resolve()
  }

  // Ajouter cette fonction
  // Fonction pour calculer les revenus par période
  const getRevenueByPeriod = (period = 'month') => {
    if (!transactions.value || transactions.value.length === 0) {
      return {
        current: 0,
        previous: 0,
        change: 0,
        changePercent: 0
      }
    }

    const now = new Date()
    let currentStart, currentEnd, previousStart, previousEnd

    if (period === 'month') {
      currentStart = new Date(now.getFullYear(), now.getMonth(), 1)
      currentEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      previousEnd = new Date(now.getFullYear(), now.getMonth(), 0)
    } else if (period === 'week') {
      const dayOfWeek = now.getDay()
      currentStart = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000)
      currentEnd = new Date(currentStart.getTime() + 6 * 24 * 60 * 60 * 1000)
      previousStart = new Date(currentStart.getTime() - 7 * 24 * 60 * 60 * 1000)
      previousEnd = new Date(currentStart.getTime() - 1)
    }

    const currentRevenue = transactions.value
      .filter(t => {
        const date = new Date(t.created_at)
        return date >= currentStart && date <= currentEnd && t.type === 'payment'
      })
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)

    const previousRevenue = transactions.value
      .filter(t => {
        const date = new Date(t.created_at)
        return date >= previousStart && date <= previousEnd && t.type === 'payment'
      })
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)

    const change = currentRevenue - previousRevenue
    const changePercent = previousRevenue > 0 ? (change / previousRevenue) * 100 : 0

    return {
      current: currentRevenue,
      previous: previousRevenue,
      change,
      changePercent: Math.round(changePercent * 100) / 100
    }
  }

  // Initialisation
  loadAllData()

  return {
    // État
    teachers,
    students,
    users,
    sessions,
    categories,
    bookings,
    evaluations,
    resources,
    templates,
    transactions, // Ajouter cette ligne
    loading,
    error,
    
    // Computed
    stats,
    upcomingSessions,
    
    // Actions
    loadAllData,
    loadTeachers,
    loadStudents,
    loadSessions,
    loadCategories,
    loadBookings,
    loadEvaluations,
    loadResources,
    loadTemplates,
    loadTransactions, // Ajouter cette ligne
    addTeacher,
    updateTeacher,
    deleteTeacher,
    createSession,
    deleteCategory,
    createTemplate,
    getSessionsByCategory,
    searchUsers,
    exportData,
    getRevenueByPeriod, // Ajouter cette ligne
    
    // Fonctions utilitaires
    getTopStudents,
    getCategoryById,
    formatCurrency,
    getTeacherStats
  }
})