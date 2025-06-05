import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/config/supabase'
import { useAuthStore } from './auth-supabase'

export const useSessionsStore = defineStore('sessions', () => {
  const authStore = useAuthStore()
  
  const sessions = ref([])
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Charger les catégories
  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('course_categories')
        .select('*')
        .order('name')

      if (error) throw error
      categories.value = data
      return data
    } catch (err) {
      console.error('Error loading categories:', err)
      return []
    }
  }

  // Charger toutes les sessions
  const loadSessions = async (filters = {}) => {
    loading.value = true
    error.value = null

    try {
      let query = supabase
        .from('sessions')
        .select(`
          *,
          teacher:teacher_id(name),
          category:category_id(name, icon, color),
          bookings(student_id)
        `)
        .gte('date_time', new Date().toISOString())
        .order('date_time')

      // Appliquer les filtres
      if (filters.type) query = query.eq('type', filters.type)
      if (filters.level) query = query.eq('level', filters.level)
      if (filters.categoryId) query = query.eq('category_id', filters.categoryId)

      const { data, error } = await query

      if (error) throw error

      // Enrichir les données
      sessions.value = data.map(session => ({
        ...session,
        availableSpots: session.max_students - session.bookings.length,
        isBooked: session.bookings.some(b => b.student_id === authStore.user?.id)
      }))

      return sessions.value
    } catch (err) {
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }

  // Créer une session (admin/teacher)
  const createSession = async (sessionData) => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert([{
          ...sessionData,
          teacher_id: authStore.user.id
        }])
        .select()
        .single()

      if (error) throw error

      await loadSessions()
      return { success: true, data }
    } catch (err) {
      console.error('Error creating session:', err)
      return { success: false, error: err.message }
    }
  }

  // Mettre à jour une session
  const updateSession = async (sessionId, updates) => {
    try {
      const { error } = await supabase
        .from('sessions')
        .update(updates)
        .eq('id', sessionId)

      if (error) throw error

      await loadSessions()
      return { success: true }
    } catch (err) {
      console.error('Error updating session:', err)
      return { success: false, error: err.message }
    }
  }

  // Réserver une session (utilise la fonction SQL)
  const bookSession = async (sessionId) => {
    try {
      const { data, error } = await supabase
        .rpc('book_session', { p_session_id: sessionId })

      if (error) throw error

      if (!data.success) {
        throw new Error(data.error)
      }

      await loadSessions()
      return { success: true }
    } catch (err) {
      console.error('Error booking session:', err)
      return { success: false, error: err.message }
    }
  }

  // Annuler une réservation
  const cancelBooking = async (sessionId) => {
    try {
      // Supprimer la réservation
      const { error: deleteError } = await supabase
        .from('bookings')
        .delete()
        .eq('session_id', sessionId)
        .eq('student_id', authStore.user.id)

      if (deleteError) throw deleteError

      // Rembourser le token
      await authStore.updateTokens(1)

      await loadSessions()
      return { success: true }
    } catch (err) {
      console.error('Error cancelling booking:', err)
      return { success: false, error: err.message }
    }
  }

  // Charger les réservations de l'utilisateur
  const loadMyBookings = async () => {
    if (!authStore.user) return []

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          session:session_id(
            *,
            teacher:teacher_id(name),
            category:category_id(name, icon, color)
          )
        `)
        .eq('student_id', authStore.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (err) {
      console.error('Error loading bookings:', err)
      return []
    }
  }

  // Ajouter des ressources à une session
  const addResource = async (sessionId, resource) => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .insert([{
          session_id: sessionId,
          ...resource,
          uploaded_by: authStore.user.id
        }])
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (err) {
      console.error('Error adding resource:', err)
      return { success: false, error: err.message }
    }
  }

  // Charger les ressources d'une session
  const loadSessionResources = async (sessionId) => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at')

      if (error) throw error
      return data
    } catch (err) {
      console.error('Error loading resources:', err)
      return []
    }
  }

  // Statistiques pour l'admin
  const getSessionStats = async () => {
    try {
      // Sessions à venir
      const { data: upcoming } = await supabase
        .from('sessions')
        .select('id')
        .gte('date_time', new Date().toISOString())
        .eq('status', 'scheduled')

      // Sessions complétées ce mois
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { data: completed } = await supabase
        .from('sessions')
        .select('id')
        .gte('date_time', startOfMonth.toISOString())
        .eq('status', 'completed')

      // Taux de remplissage moyen
      const { data: bookingStats } = await supabase
        .from('sessions')
        .select('max_students, bookings(id)')
        .eq('status', 'completed')

      const avgFillRate = bookingStats.reduce((acc, session) => {
        return acc + (session.bookings.length / session.max_students)
      }, 0) / bookingStats.length * 100

      return {
        upcoming: upcoming?.length || 0,
        completed: completed?.length || 0,
        avgFillRate: Math.round(avgFillRate) || 0
      }
    } catch (err) {
      console.error('Error getting stats:', err)
      return { upcoming: 0, completed: 0, avgFillRate: 0 }
    }
  }

  return {
    // État
    sessions,
    categories,
    loading,
    error,

    // Actions
    loadCategories,
    loadSessions,
    createSession,
    updateSession,
    bookSession,
    cancelBooking,
    loadMyBookings,
    addResource,
    loadSessionResources,
    getSessionStats
  }
}) 