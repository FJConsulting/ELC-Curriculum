import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export const useAdminStore = defineStore('admin', () => {
  // État
  const teachers = ref([])
  const students = ref([])
  const sessions = ref([])
  const categories = ref([])
  const bookings = ref([])
  const evaluations = ref([])
  const resources = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Statistiques calculées
  const stats = computed(() => ({
    totalStudents: students.value.length,
    totalTeachers: teachers.value.length,
    totalSessions: sessions.value.length,
    totalRevenue: bookings.value.filter(b => b.status === 'attended').length * 35, // 35€ par session
    monthlyRevenue: [
      { month: 'Juillet', revenue: 2800 },
      { month: 'Août', revenue: 3200 },
      { month: 'Septembre', revenue: 4100 },
      { month: 'Octobre', revenue: 3800 },
      { month: 'Novembre', revenue: 4500 },
      { month: 'Décembre', revenue: 5200 }
    ]
  }))

  // Actions
  const loadAllData = async () => {
    loading.value = true
    error.value = null
    
    try {
      if (isSupabaseConfigured()) {
        await Promise.all([
          loadTeachers(),
          loadStudents(),
          loadSessions(),
          loadCategories(),
          loadBookings(),
          loadEvaluations(),
          loadResources()
        ])
      } else {
        // Fallback données mockées
        loadMockData()
      }
    } catch (err) {
      error.value = err.message
      console.error('Erreur chargement données admin:', err)
    } finally {
      loading.value = false
    }
  }

  const loadTeachers = async () => {
    if (isSupabaseConfigured()) {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'teacher')
      
      if (fetchError) throw fetchError
      
      // Transformer les données pour correspondre au format attendu
      teachers.value = data.map(teacher => ({
        id: teacher.id,
        name: teacher.name,
        email: teacher.email || `${teacher.name.toLowerCase()}@elc.com`,
        specialties: ['Grammar', 'Business English'], // Données par défaut
        languages: ['English', 'French'],
        experience: '5 years',
        availability: ['Monday', 'Wednesday', 'Friday'],
        rating: 4.8,
        totalSessions: 0,
        totalStudents: 0
      }))
    } else {
      // Données mockées existantes
      loadMockTeachers()
    }
  }

  const loadStudents = async () => {
    if (isSupabaseConfigured()) {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
      
      if (fetchError) throw fetchError
      
      students.value = data.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email || `${student.name.toLowerCase()}@example.com`,
        level: student.level,
        tokens: student.tokens,
        joinedAt: student.created_at,
        lastActivity: student.updated_at,
        completedSessions: 0,
        subscription: { active: false }
      }))
    } else {
      loadMockStudents()
    }
  }

  const loadSessions = async () => {
    if (isSupabaseConfigured()) {
      const { data, error: fetchError } = await supabase
        .from('sessions')
        .select(`
          *,
          course_categories(name, icon, color),
          profiles(name, email)
        `)
        .order('date_time', { ascending: false })
      
      if (fetchError) throw fetchError
      
      sessions.value = data.map(session => ({
        id: session.id,
        name: session.name,
        description: session.description,
        category: session.course_categories?.name || 'Non catégorisé',
        categoryIcon: session.course_categories?.icon || '📚',
        categoryColor: session.course_categories?.color || 'blue',
        teacher: session.profiles?.name || 'Non assigné',
        teacherId: session.teacher_id,
        type: session.type,
        level: session.level,
        dateTime: session.date_time,
        duration: session.duration,
        maxStudents: session.max_students,
        priceTokens: session.price_tokens,
        meetingLink: session.meeting_link,
        status: session.status,
        enrolledStudents: 0 // À calculer avec les bookings
      }))
    } else {
      loadMockSessions()
    }
  }

  const loadCategories = async () => {
    if (isSupabaseConfigured()) {
      const { data, error: fetchError } = await supabase
        .from('course_categories')
        .select('*')
        .order('name')
      
      if (fetchError) throw fetchError
      
      categories.value = data
    } else {
      loadMockCategories()
    }
  }

  const loadBookings = async () => {
    if (isSupabaseConfigured()) {
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select(`
          *,
          sessions(name, date_time),
          profiles(name, email)
        `)
        .order('booked_at', { ascending: false })
      
      if (fetchError) throw fetchError
      
      bookings.value = data
    } else {
      loadMockBookings()
    }
  }

  const loadEvaluations = async () => {
    if (isSupabaseConfigured()) {
      const { data, error: fetchError } = await supabase
        .from('evaluations')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (fetchError) throw fetchError
      
      evaluations.value = data
    } else {
      loadMockEvaluations()
    }
  }

  const loadResources = async () => {
    if (isSupabaseConfigured()) {
      const { data, error: fetchError } = await supabase
        .from('resources')
        .select(`
          *,
          sessions(name)
        `)
        .order('created_at', { ascending: false })
      
      if (fetchError) throw fetchError
      
      resources.value = data
    } else {
      loadMockResources()
    }
  }

  // Fonctions de données mockées (fallback)
  const loadMockTeachers = () => {
    teachers.value = [
      {
        id: 'teacher-1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@elc.com',
        specialties: ['Grammar', 'Business English'],
        languages: ['English', 'French'],
        experience: '10 years',
        availability: ['Monday', 'Wednesday', 'Friday'],
        rating: 4.8,
        totalSessions: 34,
        totalStudents: 82
      },
      {
        id: 'teacher-2',
        name: 'Mike Wilson',
        email: 'mike.wilson@elc.com',
        specialties: ['Conversation', 'Culture'],
        languages: ['English', 'Spanish'],
        experience: '7 years',
        availability: ['Tuesday', 'Thursday', 'Saturday'],
        rating: 4.6,
        totalSessions: 21,
        totalStudents: 54
      },
      {
        id: 'teacher-3',
        name: 'Emma Davis',
        email: 'emma.davis@elc.com',
        specialties: ['Grammar', 'Exam Preparation'],
        languages: ['English', 'German'],
        experience: '5 years',
        availability: ['Monday', 'Tuesday', 'Thursday'],
        rating: 4.9,
        totalSessions: 21,
        totalStudents: 54
      },
      {
        id: 'teacher-4',
        name: 'David Brown',
        email: 'david.brown@elc.com',
        specialties: ['Business English', 'Writing'],
        languages: ['English', 'French', 'Italian'],
        experience: '12 years',
        availability: ['Wednesday', 'Friday', 'Saturday'],
        rating: 4.7,
        totalSessions: 24,
        totalStudents: 50
      }
    ]
  }

  const loadMockStudents = () => {
    students.value = [
      {
        id: 'student-1',
        name: 'Alice Martin',
        email: 'alice@example.com',
        level: 'B1',
        tokens: 5,
        joinedAt: '2024-01-15',
        lastActivity: '2024-02-10',
        completedSessions: 12,
        subscription: { active: true, plan: '6-month' }
      },
      {
        id: 'student-2',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        level: 'A2',
        tokens: 8,
        joinedAt: '2024-02-01',
        lastActivity: '2024-02-09',
        completedSessions: 6,
        subscription: { active: false }
      }
    ]
  }

  const loadMockSessions = () => {
    sessions.value = [
      {
        id: 1,
        name: 'Business Meeting Basics',
        description: 'Apprenez le vocabulaire essentiel pour les réunions professionnelles',
        category: 'Business English',
        categoryIcon: '💼',
        categoryColor: 'blue',
        teacher: 'Sarah Johnson',
        teacherId: 'teacher-1',
        type: 'course',
        level: 'B1',
        dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 60,
        maxStudents: 5,
        priceTokens: 1,
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        status: 'scheduled',
        enrolledStudents: 3
      }
    ]
  }

  const loadMockCategories = () => {
    categories.value = [
      { id: 1, name: 'Business English', description: 'Anglais professionnel', icon: '💼', color: 'blue' },
      { id: 2, name: 'Travel English', description: 'Anglais pour voyager', icon: '✈️', color: 'green' },
      { id: 3, name: 'Daily Conversation', description: 'Conversation quotidienne', icon: '💬', color: 'purple' },
      { id: 4, name: 'Grammar Focus', description: 'Focus grammaire', icon: '📚', color: 'orange' }
    ]
  }

  const loadMockBookings = () => {
    bookings.value = []
  }

  const loadMockEvaluations = () => {
    evaluations.value = []
  }

  const loadMockResources = () => {
    resources.value = []
  }

  const loadMockData = () => {
    loadMockTeachers()
    loadMockStudents()
    loadMockSessions()
    loadMockCategories()
    loadMockBookings()
    loadMockEvaluations()
    loadMockResources()
  }

  // Gestion des professeurs
  const addTeacher = async (teacherData) => {
    try {
      if (isSupabaseConfigured()) {
        // Créer un utilisateur Supabase
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: teacherData.email,
          password: 'defaultPassword123',
          email_confirm: true
        })
        
        if (authError) throw authError
        
        // Mettre à jour le profil
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            name: teacherData.name, 
            role: 'teacher' 
          })
          .eq('id', authData.user.id)
        
        if (profileError) throw profileError
        
        await loadTeachers()
      } else {
        // Mode mock
        const newTeacher = {
          id: `teacher-${Date.now()}`,
          ...teacherData,
          totalSessions: 0,
          totalStudents: 0,
          rating: 5.0
        }
        teachers.value.push(newTeacher)
      }
      
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // Gestion des sessions
  const createSession = async (sessionData) => {
    try {
      if (isSupabaseConfigured()) {
        const { error: insertError } = await supabase
          .from('sessions')
          .insert([sessionData])
        
        if (insertError) throw insertError
        
        await loadSessions()
      } else {
        // Mode mock
        const newSession = {
          id: Date.now(),
          ...sessionData,
          enrolledStudents: 0,
          status: 'scheduled'
        }
        sessions.value.push(newSession)
      }
      
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  // Initialiser les données au chargement
  loadAllData()

  return {
    // État
    teachers,
    students,
    sessions,
    categories,
    bookings,
    evaluations,
    resources,
    loading,
    error,
    stats,
    
    // Actions
    loadAllData,
    loadTeachers,
    loadStudents,
    loadSessions,
    addTeacher,
    createSession
  }
}) 