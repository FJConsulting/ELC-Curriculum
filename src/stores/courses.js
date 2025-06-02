import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

export const useCoursesStore = defineStore('courses', () => {
  // État
  const courses = ref([])
  const grammarWorkshops = ref([])
  const conversationClubs = ref([])
  const lessons = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const availableCourses = computed(() => {
    const authStore = useAuthStore()
    if (!authStore.user) return []
    
    const userLevel = authStore.userLevel
    const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1']
    const userLevelIndex = levelOrder.indexOf(userLevel)
    
    return courses.value.filter(course => {
      const courseLevels = course.levels || [course.level]
      return courseLevels.some(level => {
        const courseLevelIndex = levelOrder.indexOf(level)
        return courseLevelIndex >= Math.max(0, userLevelIndex - 1) && 
               courseLevelIndex <= userLevelIndex + 1
      })
    })
  })

  const upcomingSessions = computed(() => {
    const now = new Date()
    const allSessions = [
      ...courses.value.flatMap(course => 
        course.sessions?.map(session => ({ ...session, type: 'course', courseId: course.id, courseName: course.name })) || []
      ),
      ...grammarWorkshops.value.flatMap(workshop => 
        workshop.sessions?.map(session => ({ ...session, type: 'grammar', courseId: workshop.id, courseName: workshop.name })) || []
      ),
      ...conversationClubs.value.flatMap(club => 
        club.sessions?.map(session => ({ ...session, type: 'conversation', courseId: club.id, courseName: club.name })) || []
      )
    ]
    
    return allSessions
      .filter(session => new Date(session.dateTime) > now)
      .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
      .slice(0, 10)
  })

  // Actions
  const initializeCourses = () => {
    // Cours collectifs (≤ 5 personnes)
    courses.value = [
      {
        id: 1,
        name: "English Foundations",
        description: "Construisez des bases solides en anglais",
        fullDescription: "Ce cours vous aidera à maîtriser les fondamentaux de l'anglais avec une approche progressive et interactive.",
        level: "A1",
        levels: ["A1"],
        duration: "60 min",
        maxStudents: 5,
        price: 1, // en tokens
        category: "grammar",
        difficulty: "beginner",
        totalLessons: 20,
        image: "/images/courses/foundations.jpg",
        features: [
          "20 leçons structurées",
          "Support pédagogique inclus",
          "Exercices interactifs",
          "Suivi de progression"
        ],
        learningObjectives: [
          "Maîtriser l'alphabet et la prononciation",
          "Utiliser les temps présents",
          "Construire des phrases simples",
          "Vocabulaire de base (500 mots)"
        ],
        sessions: [
          {
            id: 101,
            dateTime: "2024-01-15T10:00:00",
            teacher: "Sarah Johnson",
            enrolled: 3,
            lessonNumber: 1,
            topic: "Introduction et alphabet"
          },
          {
            id: 102,
            dateTime: "2024-01-17T14:00:00",
            teacher: "Sarah Johnson",
            enrolled: 2,
            lessonNumber: 2,
            topic: "Présent simple"
          },
          {
            id: 103,
            dateTime: "2024-01-19T18:00:00",
            teacher: "Mike Wilson",
            enrolled: 4,
            lessonNumber: 3,
            topic: "Vocabulaire familial"
          }
        ]
      },
      {
        id: 2,
        name: "Intermediate Communication",
        description: "Développez vos compétences de communication",
        fullDescription: "Perfectionnez votre expression orale et écrite avec des situations réelles et pratiques.",
        level: "B1",
        levels: ["A2", "B1"],
        duration: "75 min",
        maxStudents: 5,
        price: 1,
        category: "communication",
        difficulty: "intermediate",
        totalLessons: 20,
        image: "/images/courses/communication.jpg",
        features: [
          "Situations réelles",
          "Jeux de rôle",
          "Débats structurés",
          "Feedback personnalisé"
        ],
        learningObjectives: [
          "S'exprimer avec fluidité",
          "Argumenter et débattre",
          "Comprendre les accents",
          "Écrire des textes complexes"
        ],
        sessions: [
          {
            id: 201,
            dateTime: "2024-01-16T16:00:00",
            teacher: "Emma Davis",
            enrolled: 2,
            lessonNumber: 1,
            topic: "Expressing opinions"
          },
          {
            id: 202,
            dateTime: "2024-01-18T10:30:00",
            teacher: "David Brown",
            enrolled: 3,
            lessonNumber: 2,
            topic: "Travel and culture"
          }
        ]
      },
      {
        id: 3,
        name: "Business English Mastery",
        description: "Anglais professionnel pour votre carrière",
        fullDescription: "Maîtrisez l'anglais des affaires avec des situations professionnelles authentiques.",
        level: "B2",
        levels: ["B2", "C1"],
        duration: "90 min",
        maxStudents: 5,
        price: 1,
        category: "business",
        difficulty: "advanced",
        totalLessons: 20,
        image: "/images/courses/business.jpg",
        features: [
          "Cas d'entreprise réels",
          "Présentations professionnelles",
          "Négociation",
          "Réseautage en anglais"
        ],
        learningObjectives: [
          "Présenter efficacement",
          "Négocier avec succès",
          "Rédiger des rapports",
          "Participer à des réunions"
        ],
        sessions: [
          {
            id: 301,
            dateTime: "2024-01-15T19:00:00",
            teacher: "Michael Green",
            enrolled: 1,
            lessonNumber: 1,
            topic: "Professional presentations"
          },
          {
            id: 302,
            dateTime: "2024-01-17T08:30:00",
            teacher: "Lisa Anderson",
            enrolled: 0,
            lessonNumber: 2,
            topic: "Meeting skills"
          }
        ]
      }
    ]

    // Ateliers de grammaire structurés par niveau
    grammarWorkshops.value = [
      {
        id: 101,
        name: "Grammar Fundamentals A1",
        description: "Les bases essentielles de la grammaire anglaise",
        level: "A1",
        duration: "45 min",
        maxStudents: 5,
        price: 1,
        topics: [
          "Articles (a, an, the)",
          "Présent simple",
          "Pronoms personnels",
          "Pluriels réguliers et irréguliers",
          "Prépositions de lieu",
          "Questions avec WH-"
        ],
        sessions: [
          {
            id: 1001,
            dateTime: "2024-01-16T15:00:00",
            teacher: "Rachel Smith",
            enrolled: 4,
            topic: "Articles et déterminants"
          },
          {
            id: 1002,
            dateTime: "2024-01-18T15:00:00",
            teacher: "Rachel Smith",
            enrolled: 3,
            topic: "Présent simple - formes affirmative et négative"
          }
        ]
      },
      {
        id: 102,
        name: "Grammar Booster A2",
        description: "Renforcez vos structures grammaticales",
        level: "A2",
        duration: "45 min",
        maxStudents: 5,
        price: 1,
        topics: [
          "Passé simple",
          "Présent continu",
          "Comparatifs et superlatifs",
          "Modal verbs (can, could, should)",
          "Future avec will/going to",
          "Present perfect introduction"
        ],
        sessions: [
          {
            id: 1003,
            dateTime: "2024-01-17T16:30:00",
            teacher: "Tom Johnson",
            enrolled: 2,
            topic: "Passé simple - verbes réguliers"
          }
        ]
      },
      {
        id: 103,
        name: "Advanced Grammar B1-B2",
        description: "Maîtrisez les structures complexes",
        level: "B1-B2",
        duration: "60 min",
        maxStudents: 5,
        price: 1,
        topics: [
          "Conditional sentences",
          "Passive voice",
          "Reported speech",
          "Perfect tenses",
          "Phrasal verbs",
          "Relative clauses"
        ],
        sessions: [
          {
            id: 1004,
            dateTime: "2024-01-19T17:00:00",
            teacher: "Jennifer White",
            enrolled: 1,
            topic: "First conditional"
          }
        ]
      }
    ]

    // Club de conversation (actualité)
    conversationClubs.value = [
      {
        id: 201,
        name: "Current Affairs Discussion",
        description: "Débattez de l'actualité en anglais",
        level: "B1-C1",
        duration: "75 min",
        maxStudents: 5,
        price: 1,
        format: "discussion",
        topics: [
          "Technology and society",
          "Environmental challenges",
          "Global politics",
          "Culture and entertainment",
          "Economic trends",
          "Social media impact"
        ],
        sessions: [
          {
            id: 2001,
            dateTime: "2024-01-16T19:30:00",
            teacher: "Alex Thompson",
            enrolled: 4,
            topic: "AI and the future of work",
            preparationMaterials: [
              "Article: 'The Rise of Artificial Intelligence'",
              "Video: 'Jobs of the Future'"
            ]
          },
          {
            id: 2002,
            dateTime: "2024-01-18T19:30:00",
            teacher: "Sophie Martin",
            enrolled: 3,
            topic: "Climate change solutions",
            preparationMaterials: [
              "Article: 'Green Energy Revolution'",
              "Podcast: 'Sustainable Living'"
            ]
          }
        ]
      },
      {
        id: 202,
        name: "Cultural Exchange",
        description: "Partagez et découvrez les cultures",
        level: "A2-B2",
        duration: "60 min",
        maxStudents: 5,
        price: 1,
        format: "cultural",
        topics: [
          "Festivals and traditions",
          "Food from around the world",
          "Travel experiences",
          "Music and arts",
          "Education systems",
          "Work-life balance"
        ],
        sessions: [
          {
            id: 2003,
            dateTime: "2024-01-17T20:00:00",
            teacher: "Maria Rodriguez",
            enrolled: 2,
            topic: "Winter traditions worldwide"
          }
        ]
      }
    ]

    // Leçons structurées (cycle de 20 leçons par niveau)
    lessons.value = generateLessonsCycle()
  }

  const generateLessonsCycle = () => {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1']
    const allLessons = []

    levels.forEach(level => {
      for (let i = 1; i <= 20; i++) {
        allLessons.push({
          id: `${level}-${i}`,
          level,
          number: i,
          title: `${level} - Lesson ${i}`,
          description: `Leçon ${i} du niveau ${level}`,
          duration: "45 min",
          videoUrl: `/videos/${level}/lesson-${i}.mp4`,
          materials: [
            {
              type: "pdf",
              name: `Fiche grammaire ${level}-${i}`,
              url: `/materials/${level}/grammar-${i}.pdf`
            },
            {
              type: "audio",
              name: `Exercices audio ${level}-${i}`,
              url: `/materials/${level}/audio-${i}.mp3`
            },
            {
              type: "worksheet",
              name: `Exercices pratiques ${level}-${i}`,
              url: `/materials/${level}/worksheet-${i}.pdf`
            }
          ],
          completed: false,
          available: i === 1 || level === 'A1'
        })
      }
    })

    return allLessons
  }

  const bookSession = async (sessionId, sessionType = 'course') => {
    const authStore = useAuthStore()
    
    if (!authStore.userTokens || authStore.userTokens < 1) {
      throw new Error('Tokens insuffisants')
    }

    let session = null
    let courseName = ''

    // Trouver la session
    if (sessionType === 'course') {
      const course = courses.value.find(c => 
        c.sessions?.some(s => s.id === sessionId)
      )
      if (course) {
        session = course.sessions.find(s => s.id === sessionId)
        courseName = course.name
      }
    } else if (sessionType === 'grammar') {
      const workshop = grammarWorkshops.value.find(w => 
        w.sessions?.some(s => s.id === sessionId)
      )
      if (workshop) {
        session = workshop.sessions.find(s => s.id === sessionId)
        courseName = workshop.name
      }
    } else if (sessionType === 'conversation') {
      const club = conversationClubs.value.find(c => 
        c.sessions?.some(s => s.id === sessionId)
      )
      if (club) {
        session = club.sessions.find(s => s.id === sessionId)
        courseName = club.name
      }
    }

    if (!session) {
      throw new Error('Session non trouvée')
    }

    if (session.enrolled >= 5) {
      throw new Error('Session complète')
    }

    // Vérifier les conflits de planning
    const sessionDate = new Date(session.dateTime)
    const userBookings = authStore.user.bookedCourses
    
    const hasConflict = userBookings.some(booking => {
      const bookingDate = new Date(booking.dateTime)
      const timeDiff = Math.abs(sessionDate - bookingDate)
      return timeDiff < 2 * 60 * 60 * 1000 // 2 heures
    })

    if (hasConflict) {
      throw new Error('Conflit d\'horaire avec une autre réservation')
    }

    // Effectuer la réservation
    const booking = {
      sessionId,
      sessionType,
      courseName,
      dateTime: session.dateTime,
      teacher: session.teacher,
      topic: session.topic
    }

    if (authStore.addBooking(booking)) {
      session.enrolled += 1
      return { success: true, booking }
    } else {
      throw new Error('Erreur lors de la réservation')
    }
  }

  const cancelBooking = (bookingId) => {
    const authStore = useAuthStore()
    const booking = authStore.user?.bookedCourses.find(b => b.id === bookingId)
    
    if (!booking) return false

    // Libérer la place
    let session = null
    if (booking.sessionType === 'course') {
      const course = courses.value.find(c => 
        c.sessions?.some(s => s.id === booking.sessionId)
      )
      session = course?.sessions.find(s => s.id === booking.sessionId)
    } else if (booking.sessionType === 'grammar') {
      const workshop = grammarWorkshops.value.find(w => 
        w.sessions?.some(s => s.id === booking.sessionId)
      )
      session = workshop?.sessions.find(s => s.id === booking.sessionId)
    } else if (booking.sessionType === 'conversation') {
      const club = conversationClubs.value.find(c => 
        c.sessions?.some(s => s.id === booking.sessionId)
      )
      session = club?.sessions.find(s => s.id === booking.sessionId)
    }

    if (session && session.enrolled > 0) {
      session.enrolled -= 1
    }

    return authStore.cancelBooking(bookingId)
  }

  const completeLesson = (lessonId) => {
    const authStore = useAuthStore()
    const lesson = lessons.value.find(l => l.id === lessonId)
    
    if (!lesson || lesson.completed) return false

    lesson.completed = true
    
    // Débloquer la leçon suivante
    const currentNumber = lesson.number
    const nextLesson = lessons.value.find(l => 
      l.level === lesson.level && l.number === currentNumber + 1
    )
    
    if (nextLesson) {
      nextLesson.available = true
    }

    // Mettre à jour le progrès
    const levelLessons = lessons.value.filter(l => l.level === lesson.level)
    const completedCount = levelLessons.filter(l => l.completed).length
    const progress = Math.round((completedCount / levelLessons.length) * 100)
    
    authStore.updateProgress(lesson.level, progress)

    // Débloquer le niveau suivant si 50% completé
    if (progress >= 50) {
      const levels = ['A1', 'A2', 'B1', 'B2', 'C1']
      const currentIndex = levels.indexOf(lesson.level)
      if (currentIndex < levels.length - 1) {
        const nextLevel = levels[currentIndex + 1]
        const nextLevelLessons = lessons.value.filter(l => l.level === nextLevel)
        if (nextLevelLessons.length > 0) {
          nextLevelLessons[0].available = true
        }
      }
    }

    return true
  }

  const getCourseById = (id) => {
    return courses.value.find(c => c.id === parseInt(id))
  }

  const getWorkshopById = (id) => {
    return grammarWorkshops.value.find(w => w.id === parseInt(id))
  }

  const getClubById = (id) => {
    return conversationClubs.value.find(c => c.id === parseInt(id))
  }

  const getLessonById = (id) => {
    return lessons.value.find(l => l.id === id)
  }

  const searchContent = (query) => {
    const searchTerm = query.toLowerCase()
    const results = {
      courses: courses.value.filter(c => 
        c.name.toLowerCase().includes(searchTerm) ||
        c.description.toLowerCase().includes(searchTerm)
      ),
      workshops: grammarWorkshops.value.filter(w =>
        w.name.toLowerCase().includes(searchTerm) ||
        w.description.toLowerCase().includes(searchTerm)
      ),
      clubs: conversationClubs.value.filter(c =>
        c.name.toLowerCase().includes(searchTerm) ||
        c.description.toLowerCase().includes(searchTerm)
      ),
      lessons: lessons.value.filter(l =>
        l.title.toLowerCase().includes(searchTerm) ||
        l.description.toLowerCase().includes(searchTerm)
      )
    }
    return results
  }

  // Ajouter après la fonction initializeCourses
  const levelEvaluations = ref({
    A1: {
      id: 'eval-A1',
      level: 'A1',
      name: 'Évaluation finale A1',
      description: 'Testez vos connaissances pour valider le niveau A1',
      duration: '45 min',
      questions: 20,
      requiredScore: 70, // 70% pour réussir
      available: true
    },
    A2: {
      id: 'eval-A2',
      level: 'A2',
      name: 'Évaluation finale A2',
      description: 'Testez vos connaissances pour valider le niveau A2',
      duration: '45 min',
      questions: 20,
      requiredScore: 70,
      available: false
    },
    B1: {
      id: 'eval-B1',
      level: 'B1',
      name: 'Évaluation finale B1',
      description: 'Testez vos connaissances pour valider le niveau B1',
      duration: '60 min',
      questions: 25,
      requiredScore: 75,
      available: false
    },
    B2: {
      id: 'eval-B2',
      level: 'B2',
      name: 'Évaluation finale B2',
      description: 'Testez vos connaissances pour valider le niveau B2',
      duration: '60 min',
      questions: 25,
      requiredScore: 75,
      available: false
    }
  })

  const canTakeEvaluation = (level) => {
    const authStore = useAuthStore()
    const userProgress = authStore.user?.progress?.[level]
    return userProgress && userProgress.completed >= 80 // 80% du niveau complété
  }

  const completeEvaluation = (level, score) => {
    const authStore = useAuthStore()
    const evaluation = levelEvaluations.value[level]
    
    if (!evaluation || score < evaluation.requiredScore) {
      return false
    }

    // Débloquer le niveau suivant
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1']
    const currentIndex = levels.indexOf(level)
    if (currentIndex < levels.length - 1) {
      const nextLevel = levels[currentIndex + 1]
      authStore.unlockLevel(nextLevel)
      
      // Rendre l'évaluation suivante disponible
      if (levelEvaluations.value[nextLevel]) {
        levelEvaluations.value[nextLevel].available = true
      }
    }

    // Mettre à jour le niveau de l'utilisateur
    authStore.updateLevel(nextLevel || level)
    
    return true
  }

  // Initialiser les données
  initializeCourses()

  return {
    // État
    courses,
    grammarWorkshops,
    conversationClubs,
    lessons,
    loading,
    error,
    levelEvaluations,

    // Getters
    availableCourses,
    upcomingSessions,

    // Actions
    bookSession,
    cancelBooking,
    completeLesson,
    getCourseById,
    getWorkshopById,
    getClubById,
    getLessonById,
    searchContent,
    initializeCourses,
    
    // Nouvelles actions
    canTakeEvaluation,
    completeEvaluation
  }
}) 