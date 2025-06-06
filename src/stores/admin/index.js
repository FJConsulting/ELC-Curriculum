import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUsersStore } from './users.js'
import { useSessionsStore } from './sessions.js'
import { useCategoriesStore } from './categories.js'
import { useEvaluationsStore } from './evaluations.js'
import { useResourcesStore } from './resources.js'
import { useTransactionsStore } from './transactions.js'
import { useCourseTypesStore } from './course-types.js'
// import { adminService } from '../../services/api/admin.js'  // Commenté temporairement
import { supabase } from '../../config/supabase.js'

export const useAdminStore = defineStore('admin', () => {
  // État global
  const loading = ref(false)
  const error = ref(null)
  const lastGlobalFetch = ref(null)
  const globalStats = ref(null)

  // Obtenir tous les sous-stores
  const usersStore = useUsersStore()
  const sessionsStore = useSessionsStore()
  const categoriesStore = useCategoriesStore()
  // const bookingsStore = useBookingsStore()  // SUPPRIMER
  const evaluationsStore = useEvaluationsStore()
  const resourcesStore = useResourcesStore()
  // const templatesStore = useTemplatesStore()  // SUPPRIMER
  const transactionsStore = useTransactionsStore()
  const courseTypesStore = useCourseTypesStore()

  // Propriétés calculées optimisées
  const stats = computed(() => {
    if (globalStats.value) {
      return globalStats.value
    }
    
    // Fallback sur les données locales - SUPPRIMER les références aux bookings
    const totalRevenue = sessionsStore.sessions.length * 35  // Estimation basée sur les sessions
    
    return {
      activeStudents: usersStore.activeStudents.length,
      totalStudents: usersStore.students.length,
      totalTeachers: usersStore.teachers.length,
      totalSessions: sessionsStore.sessions.length,
      totalCourses: sessionsStore.sessions.length,
      totalRevenue,
      monthlyRevenue: totalRevenue,
      completionRate: 85, // Valeur fixe temporaire
      averageRating: 4.8
    }
  })

  const upcomingSessions = computed(() => {
    return sessionsStore.sessions.filter(s => {
      const sessionDate = new Date(s.date_time)
      return sessionDate > new Date() && s.status === 'scheduled'
    }).sort((a, b) => new Date(a.date_time) - new Date(b.date_time)) // ✅ Correction
  })

  // Actions optimisées
  const loadGlobalStats = async () => {
    try {
      // Temporairement désactivé jusqu'à ce que adminService soit corrigé
      // const result = await adminService.getStats()
      
      // Calcul des stats basé sur les données locales
      globalStats.value = {
        activeStudents: usersStore.activeStudents?.length || 0,
        totalStudents: usersStore.students?.length || 0,
        totalTeachers: usersStore.teachers?.length || 0,
        totalSessions: sessionsStore.sessions?.length || 0,
        totalCourses: sessionsStore.sessions?.length || 0,
        totalRevenue: (sessionsStore.sessions?.length || 0) * 35,
        monthlyRevenue: (sessionsStore.sessions?.length || 0) * 35,
        completionRate: 85,
        averageRating: 4.8
      }
      
      console.log('✅ Statistiques globales chargées')
    } catch (err) {
      console.error('❌ Erreur chargement statistiques:', err)
    }
  }

  const loadAllData = async (forceRefresh = false) => {
    try {
      loading.value = true
      error.value = null
      
      await loadGlobalStats()
      
      const promises = [
        usersStore.loadTeachers(forceRefresh).catch(err => console.error('Erreur teachers:', err)),
        usersStore.loadStudents(forceRefresh).catch(err => console.error('Erreur students:', err)),
        sessionsStore.loadSessions(forceRefresh).catch(err => console.error('Erreur sessions:', err)),
        categoriesStore.loadCategories(forceRefresh).catch(err => console.error('Erreur categories:', err)),
        evaluationsStore.loadEvaluations(forceRefresh).catch(err => console.error('Erreur evaluations:', err)),
        resourcesStore.loadResources(forceRefresh).catch(err => console.error('Erreur resources:', err)),
        transactionsStore.loadTransactions(forceRefresh).catch(err => console.error('Erreur transactions:', err)),
        courseTypesStore.loadCourseTypes(forceRefresh).catch(err => console.error('Erreur course types:', err))
      ]
      
      await Promise.allSettled(promises)
      lastGlobalFetch.value = Date.now()
      
      console.log('✅ Chargement global terminé')
    } catch (err) {
      console.error('❌ Erreur lors du chargement global:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const getTeacherStats = (teacherId) => {
    const teacherSessions = sessionsStore.sessions.filter(s => s.teacher_id === teacherId)
    // Supprimer les références aux bookings et utiliser les sessions directement
    
    return {
      totalSessions: teacherSessions.length,
      attendedSessions: teacherSessions.filter(s => s.status === 'completed').length,
      revenue: teacherSessions.filter(s => s.status === 'completed').length * 35,
      rating: 4.8
    }
  }

  const clearAllCaches = () => {
    usersStore.clearCache()
    sessionsStore.clearCache?.()
    categoriesStore.clearCache?.()
    // bookingsStore.clearCache?.()  // SUPPRIMER
    evaluationsStore.clearCache?.()
    resourcesStore.clearCache?.()
    // templatesStore.clearCache?.()  // SUPPRIMER
    transactionsStore.clearCache?.()
    courseTypesStore.clearCache?.()
    
    globalStats.value = null
    lastGlobalFetch.value = null
    
    console.log('🗑️ Tous les caches vidés')
  }

  // Fonctions utilitaires
  const exportData = async (type, format = 'json') => {
    try {
      let data = []
      let filename = `${type}_export_${new Date().toISOString().split('T')[0]}`
      
      // Récupérer les données selon le type
      switch (type) {
        case 'users':
          data = [...usersStore.teachers, ...usersStore.students]
          break
        case 'sessions':
          data = sessionsStore.sessions
          break
        case 'categories':
          data = categoriesStore.categories
          break
        case 'evaluations':
          data = evaluationsStore.evaluations
          break
        case 'resources':
          data = resourcesStore.resources
          break
        case 'transactions':
          data = transactionsStore.transactions
          break
        case 'course_types':
          data = courseTypesStore.courseTypes
          break
        default:
          throw new Error(`Type d'export non supporté: ${type}`)
      }
      
      // Préparer le contenu selon le format
      let content, mimeType, extension
      
      if (format === 'csv') {
        // Convertir en CSV
        if (data.length === 0) {
          content = 'Aucune donnée à exporter'
        } else {
          const headers = Object.keys(data[0]).join(',')
          const rows = data.map(item => 
            Object.values(item).map(value => 
              typeof value === 'string' && value.includes(',') 
                ? `"${value.replace(/"/g, '""')}"` 
                : value
            ).join(',')
          )
          content = [headers, ...rows].join('\n')
        }
        mimeType = 'text/csv'
        extension = 'csv'
      } else {
        // Format JSON par défaut
        content = JSON.stringify(data, null, 2)
        mimeType = 'application/json'
        extension = 'json'
      }
      
      // Créer et télécharger le fichier
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename}.${extension}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      console.log(`✅ Export ${type} terminé (${data.length} éléments)`)
      return { success: true, count: data.length }
    } catch (err) {
      console.error(`❌ Erreur export ${type}:`, err)
      throw err
    }
  }

  // Fonction utilitaire pour formater les devises
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0)
  }

  const searchUsers = async (query) => {
    try {
      // Rechercher dans les utilisateurs locaux d'abord
      const localResults = [
        ...(usersStore.teachers || []).filter(user => 
          user.name?.toLowerCase().includes(query.toLowerCase()) ||
          user.email?.toLowerCase().includes(query.toLowerCase())
        ),
        ...(usersStore.students || []).filter(user => 
          user.name?.toLowerCase().includes(query.toLowerCase()) ||
          user.email?.toLowerCase().includes(query.toLowerCase())
        )
      ]
      
      if (localResults.length > 0) {
        return localResults
      }
      
      // Si pas de résultats locaux, rechercher dans la base de données
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(10)
      
      if (error) throw error
      return data || []
    } catch (err) {
      console.error('❌ Erreur recherche utilisateurs:', err)
      return []
    }
  }

  return {
    // État global
    loading,
    error,
    
    // Propriétés calculées
    stats,
    upcomingSessions,
    
    // Actions
    loadAllData,
    loadGlobalStats,
    searchUsers,
    exportData,
    formatCurrency,
    getTeacherStats,
    clearAllCaches,
    
    // Actions de chargement des données
    // Actions de chargement des données
    loadSessions: sessionsStore.loadSessions,
    loadCategories: categoriesStore.loadCategories,
    loadCourseTypes: courseTypesStore.loadCourseTypes,
    loadResources: resourcesStore.loadResources,
    loadTeachers: usersStore.loadTeachers,
    loadStudents: usersStore.loadStudents,
    
    // Actions des utilisateurs (teachers/students)
    addTeacher: usersStore.addTeacher,
    updateTeacher: usersStore.updateTeacher,
    deleteTeacher: usersStore.deleteTeacher,
    getTeacherSessions: usersStore.getTeacherSessions,
    reassignSession: usersStore.reassignSession,
    addStudent: usersStore.addStudent,
    updateStudent: usersStore.updateStudent,
    deleteStudent: usersStore.deleteStudent,
    
    // Actions des sessions
    createSession: sessionsStore.createSession,
    updateSession: sessionsStore.updateSession,
    deleteSession: sessionsStore.deleteSession,
    loadSessions: sessionsStore.loadSessions,
    
    // Actions des catégories exposées directement
    createCategory: categoriesStore.createCategory,
    updateCategory: categoriesStore.updateCategory,
    deleteCategory: categoriesStore.deleteCategory,
    
    // Exposition des sous-stores pour compatibilité (SUPPRIMER bookingsStore et templatesStore)
    usersStore,
    sessionsStore,
    categoriesStore,
    // bookingsStore,  // SUPPRIMER
    evaluationsStore,
    resourcesStore,
    // templatesStore,  // SUPPRIMER
    transactionsStore,
    courseTypesStore,
    
    // Exposition directe pour compatibilité (SUPPRIMER bookings et templates)
    users: computed(() => usersStore.users),
    teachers: computed(() => usersStore.teachers),
    students: computed(() => usersStore.students),
    sessions: computed(() => sessionsStore.sessions),
    categories: computed(() => categoriesStore.categories),
    // bookings: computed(() => bookingsStore.bookings),  // SUPPRIMER
    evaluations: computed(() => evaluationsStore.evaluations),
    resources: computed(() => resourcesStore.resources),
    // templates: computed(() => templatesStore.templates),  // SUPPRIMER
    transactions: computed(() => transactionsStore.transactions),
    courseTypes: computed(() => courseTypesStore.courseTypes)
  }
})