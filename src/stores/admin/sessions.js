import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../../config/supabase.js'

export const useSessionsStore = defineStore('admin-sessions', () => {
  // État
  const sessions = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Actions de chargement
  const loadSessions = async () => {
    try {
      // ✅ Charger les sessions avec jointure pour récupérer le nom du professeur
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          profiles!teacher_id (
            name
          )
        `)
        .order('date_time', { ascending: false })
      
      if (error) throw error
      
      sessions.value = (data || []).map(session => ({
        ...session,
        id: session.id,
        name: session.name,
        dateTime: session.date_time,
        categoryId: session.category_id,
        teacherId: session.teacher_id,
        // ✅ Récupérer le nom du professeur depuis la jointure
        teacher: session.profiles?.name || 'Non assigné',
        level: session.level,
        duration: session.duration || 60,
        maxStudents: session.max_students || session.maxStudents || 10,
        enrolled: session.enrolled || [],
        type: session.type,
        courseTypeId: session.course_type_id || session.courseTypeId,
        content: {
          description: session.description || '',
          objectives: session.learning_objectives || [],
          prerequisites: session.prerequisites || [],
          outline: session.content?.outline || []
        },
        status: session.status || 'scheduled',
        meetingLink: session.meeting_link,
        priceTokens: session.price_tokens
      }))
      
      console.log('✅ Sessions chargées:', sessions.value.length)
    } catch (err) {
      console.error('❌ Erreur chargement sessions:', err)
      throw err
    }
  }

  // Actions CRUD
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

  const updateSession = async (sessionId, sessionData) => {
    try {
      loading.value = true
      
      const { error } = await supabase
        .from('sessions')
        .update(sessionData)
        .eq('id', sessionId)
      
      if (error) throw error
      
      const sessionIndex = sessions.value.findIndex(s => s.id === sessionId)
      if (sessionIndex !== -1) {
        sessions.value[sessionIndex] = { ...sessions.value[sessionIndex], ...sessionData }
      }
      
      console.log('✅ Session mise à jour avec succès')
      return true
    } catch (err) {
      console.error('❌ Erreur mise à jour session:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateSessionContent = async (sessionId, content) => {
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ content })
        .eq('id', sessionId)
      
      if (error) throw error
      
      const sessionIndex = sessions.value.findIndex(s => s.id === sessionId)
      if (sessionIndex !== -1) {
        sessions.value[sessionIndex].content = content
      }
      
      console.log('✅ Contenu de session mis à jour')
      return true
    } catch (err) {
      console.error('❌ Erreur mise à jour contenu:', err)
      throw err
    }
  }

  const updateSessionMeetingLink = async (sessionId, meetingLink) => {
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ meeting_link: meetingLink })
        .eq('id', sessionId)
      
      if (error) throw error
      
      const sessionIndex = sessions.value.findIndex(s => s.id === sessionId)
      if (sessionIndex !== -1) {
        sessions.value[sessionIndex].meeting_link = meetingLink
      }
      
      console.log('✅ Lien de réunion mis à jour')
      return true
    } catch (err) {
      console.error('❌ Erreur mise à jour lien:', err)
      throw err
    }
  }

  const createSessionWithContent = async (sessionData) => {
    try {
      loading.value = true
      
      const { data, error } = await supabase
        .from('sessions')
        .insert([sessionData])
        .select()
      
      if (error) throw error
      
      await loadSessions()
      console.log('✅ Session créée avec contenu')
      return data[0]
    } catch (err) {
      console.error('❌ Erreur création session avec contenu:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteSession = async (sessionId) => {
    try {
      loading.value = true
      
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', sessionId)
      
      if (error) throw error
      
      sessions.value = sessions.value.filter(s => s.id !== sessionId)
      
      console.log('✅ Session supprimée avec succès')
      return true
    } catch (err) {
      console.error('❌ Erreur suppression session:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const duplicateSession = (sessionId) => {
    const session = sessions.value.find(s => s.id === sessionId)
    if (!session) return null
    
    const duplicate = {
      ...session,
      id: Date.now(),
      name: `${session.name} (Copie)`,
      date_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      enrolled: [],
      status: 'draft'
    }
    
    sessions.value.push(duplicate)
    return duplicate
  }

  // Fonctions utilitaires
  const getSessionsByCategory = (categoryId) => {
    return sessions.value.filter(session => session.category_id === categoryId)
  }

  return {
    // État
    sessions,
    loading,
    error,
    
    // Actions
    loadSessions,
    createSession,
    updateSession,
    updateSessionContent,
    updateSessionMeetingLink,
    createSessionWithContent,
    deleteSession,
    duplicateSession,
    getSessionsByCategory
  }
})