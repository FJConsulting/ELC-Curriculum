import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { profilesService as usersService } from '../../services/api/base.js'
import { adminService } from '../../services/api/admin.js'
import { supabase } from '../../config/supabase.js'

export const useUsersStore = defineStore('admin-users', () => {
  // State
  const teachers = ref([])
  const students = ref([])
  const loading = ref(false)
  const error = ref(null)
  const lastFetch = ref(null)
  const cacheTimeout = 5 * 60 * 1000 // 5 minutes

  // Computed
  const users = computed(() => [...students.value, ...teachers.value])
  
  const activeTeachers = computed(() => 
    teachers.value.filter(t => t.status === 'active')
  )
  
  const activeStudents = computed(() => 
    students.value.filter(s => s.status === 'active')
  )

  // Helper pour vérifier le cache
  const isCacheValid = () => {
    return lastFetch.value && (Date.now() - lastFetch.value) < cacheTimeout
  }

  // Actions
  const loadTeachers = async (forceRefresh = false) => {
    if (!forceRefresh && isCacheValid() && teachers.value.length > 0) {
      console.log('📦 Utilisation du cache pour les professeurs')
      return
    }
    
    try {
      loading.value = true
      error.value = null
      
      const result = await usersService.search(
        { role: 'teacher' },
        { orderBy: { column: 'created_at', ascending: false } }
      )
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      teachers.value = result.data || []
      lastFetch.value = Date.now()
      console.log('✅ Professeurs chargés:', teachers.value.length)
    } catch (err) {
      console.error('❌ Erreur chargement professeurs:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const loadStudents = async (forceRefresh = false) => {
    if (!forceRefresh && isCacheValid() && students.value.length > 0) {
      console.log('📦 Utilisation du cache pour les étudiants')
      return
    }
    
    try {
      loading.value = true
      error.value = null
      
      const result = await usersService.search(
        { role: 'student' },
        { orderBy: { column: 'created_at', ascending: false } }
      )
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      students.value = result.data || []
      lastFetch.value = Date.now()
      console.log('✅ Étudiants chargés:', students.value.length)
    } catch (err) {
      console.error('❌ Erreur chargement étudiants:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const addTeacher = async (teacherData) => {
    try {
      loading.value = true
      error.value = null
      
      // ÉTAPE 1: Créer l'utilisateur dans auth.users via Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: teacherData.email,
        password: teacherData.password || 'temporary-password-123', // Mot de passe temporaire
        email_confirm: true, // Confirmer automatiquement l'email
        user_metadata: {
          first_name: teacherData.first_name,
          last_name: teacherData.last_name,
          role: 'teacher'
        }
      })
      
      if (authError) {
        throw new Error(`Erreur création auth: ${authError.message}`)
      }
      
      // ÉTAPE 2: Créer/Mettre à jour le profil avec l'ID de l'utilisateur auth
      const profileData = {
        id: authUser.user.id, // Utiliser l'ID de auth.users
        email: teacherData.email,
        first_name: teacherData.first_name,
        last_name: teacherData.last_name,
        role: 'teacher',
        status: 'active',
        level: teacherData.level,
        is_active: true
      }
      
      const result = await usersService.create(profileData)
      
      if (result.error) {
        // Si erreur, supprimer l'utilisateur auth créé
        await supabase.auth.admin.deleteUser(authUser.user.id)
        throw new Error(result.error)
      }
      
      // Mettre à jour le cache local
      teachers.value.unshift(result.data)
      console.log('✅ Professeur ajouté:', result.data.id)
      
      return result.data
    } catch (err) {
      console.error('❌ Erreur ajout professeur:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTeacher = async (teacherId, teacherData) => {
    try {
      loading.value = true
      error.value = null
      
      const result = await usersService.update(teacherId, teacherData)
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      // Mettre à jour le cache local
      const index = teachers.value.findIndex(t => t.id === teacherId)
      if (index !== -1) {
        teachers.value[index] = result.data
      }
      
      console.log('✅ Professeur mis à jour:', teacherId)
      return result.data
    } catch (err) {
      console.error('❌ Erreur mise à jour professeur:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTeacher = async (teacherId, options = {}) => {
    try {
      loading.value = true
      error.value = null
      
      // Récupérer d'abord les sessions pour vérification
      const teacherSessionsResult = await getTeacherSessions(teacherId)
      
      // Vérification de sécurité
      if (teacherSessionsResult && teacherSessionsResult.summary && teacherSessionsResult.summary.future_sessions > 0 && !options.reassignToTeacherId && !options.forceDelete) {
        const error = new Error(`Le professeur a ${teacherSessionsResult.summary.future_sessions} session(s) future(s)`)
        error.code = 'HAS_FUTURE_SESSIONS'
        error.data = teacherSessionsResult
        throw error
      }
      
      // Procéder à la suppression
      const result = await adminService.deleteTeacherSafely(
        teacherId, 
        options.reassignToTeacherId
      )
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      // Mettre à jour la liste locale
      teachers.value = teachers.value.filter(user => user.id !== teacherId)
      
      console.log('✅ Professeur supprimé:', teacherId)
      return result
    } catch (err) {
      console.error('❌ Erreur suppression professeur:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getTeacherSessions = async (teacherId) => {
    try {
      loading.value = true
      error.value = null
      
      const result = await adminService.getTeacherSessions(teacherId)
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      // Retourner la structure complète avec sessions et summary
      return result.data
    } catch (err) {
      console.error('❌ Erreur récupération sessions professeur:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getAvailableTeachers = async () => {
    try {
      loading.value = true
      error.value = null
      
      const result = await adminService.getAvailableTeachers()
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      return result.data || []
    } catch (err) {
      console.error('❌ Erreur récupération professeurs disponibles:', err)
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }

  const addStudent = async (studentData) => {
    try {
      loading.value = true
      error.value = null
      
      const result = await usersService.create({
        ...studentData,
        role: 'student',
        status: 'active'
      })
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      // Mettre à jour le cache local
      students.value.unshift(result.data)
      console.log('✅ Étudiant ajouté:', result.data.id)
      
      return result.data
    } catch (err) {
      console.error('❌ Erreur ajout étudiant:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateStudent = async (studentId, studentData) => {
    try {
      loading.value = true
      error.value = null
      
      const result = await usersService.update(studentId, studentData)
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      // Mettre à jour le cache local
      const index = students.value.findIndex(s => s.id === studentId)
      if (index !== -1) {
        students.value[index] = result.data
      }
      
      console.log('✅ Étudiant mis à jour:', studentId)
      return result.data
    } catch (err) {
      console.error('❌ Erreur mise à jour étudiant:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteStudent = async (studentId) => {
    try {
      loading.value = true
      error.value = null
      
      const result = await usersService.delete(studentId)
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      // Mettre à jour le cache local
      students.value = students.value.filter(s => s.id !== studentId)
      console.log('✅ Étudiant supprimé:', studentId)
    } catch (err) {
      console.error('❌ Erreur suppression étudiant:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchUsers = async (query) => {
    try {
      const result = await adminService.searchUsers({
        search: query,
        limit: 50
      })
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      return result.data || []
    } catch (err) {
      console.error('❌ Erreur recherche utilisateurs:', err)
      error.value = err.message
      return []
    }
  }

  const reassignSession = async (sessionId, newTeacherId) => {
    try {
      loading.value = true
      error.value = null
      
      const result = await adminService.reassignSession(sessionId, newTeacherId)
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      return result.data
    } catch (err) {
      console.error('❌ Erreur réassignation session:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fonction pour vider le cache
  const clearCache = () => {
    lastFetch.value = null
    teachers.value = []
    students.value = []
    console.log('🗑️ Cache utilisateurs vidé')
  }

  return {
    // State
    teachers,
    students,
    loading,
    error,
    
    // Computed
    users,
    activeTeachers,
    activeStudents,
    
    // Actions
    loadTeachers,
    loadStudents,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacherSessions,
    getAvailableTeachers,
    addStudent,
    updateStudent,
    deleteStudent,
    searchUsers,
    reassignSession,
    clearCache
  }
})