import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'
import { useAdminStore } from './admin'

export const useEvaluationsStore = defineStore('evaluations', () => {
  const authStore = useAuthStore()
  const adminStore = useAdminStore()
  
  // État
  const evaluations = ref([])
  const userEvaluations = ref([])
  const currentEvaluation = ref(null)
  const evaluationInProgress = ref(false)
  const answers = ref({})
  
  // Getters
  const availableEvaluations = computed(() => {
    if (!authStore.user) return []
    
    const userLevel = authStore.user.level
    const completedEvals = userEvaluations.value.filter(e => e.passed).map(e => e.evaluationId)
    
    return evaluations.value.filter(assessment => {
      // Si déjà réussie, ne pas montrer
      if (completedEvals.includes(assessment.id)) return false
      
      // Évaluation initiale toujours disponible si pas de niveau
      if (assessment.type === 'initial' && !userLevel) return true
      
      // Évaluation de niveau disponible si conditions remplies
      if (assessment.type === 'level') {
        return checkLevelRequirements(assessment.targetLevel)
      }
      
      return false
    })
  })
  
  const userProgress = computed(() => {
    if (!authStore.user) return {}
    
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1']
    const progress = {}
    
    levels.forEach(level => {
      const grammarSessions = adminStore.sessions.filter(s => 
        s.type === 'grammar' && s.level === level
      )
      const completedGrammar = grammarSessions.filter(s => 
        authStore.user.completedSessions?.includes(s.id)
      ).length
      
      progress[level] = {
        totalGrammar: grammarSessions.length,
        completedGrammar,
        percentage: grammarSessions.length > 0 
          ? Math.round((completedGrammar / grammarSessions.length) * 100)
          : 0,
        canUnlockNext: (completedGrammar / grammarSessions.length) >= 0.8
      }
    })
    
    return progress
  })
  
  // Actions
  const loadEvaluations = async () => {
    // Données mockées pour les évaluations
    evaluations.value = [
      {
        id: 1,
        type: 'initial',
        name: 'Évaluation de niveau initiale',
        description: 'Déterminez votre niveau d\'anglais actuel',
        duration: 30, // minutes
        questions: generateInitialQuestions(),
        passingScore: 0, // Pas de score minimum pour l'évaluation initiale
        targetLevel: null
      },
      {
        id: 2,
        type: 'level',
        name: 'Certification A2',
        description: 'Évaluation pour accéder au niveau A2',
        duration: 45,
        questions: generateLevelQuestions('A1', 'A2'),
        passingScore: 80,
        targetLevel: 'A2',
        requiredLevel: 'A1'
      },
      {
        id: 3,
        type: 'level',
        name: 'Certification B1',
        description: 'Évaluation pour accéder au niveau B1',
        duration: 45,
        questions: generateLevelQuestions('A2', 'B1'),
        passingScore: 80,
        targetLevel: 'B1',
        requiredLevel: 'A2'
      },
      {
        id: 4,
        type: 'level',
        name: 'Certification B2',
        description: 'Évaluation pour accéder au niveau B2',
        duration: 60,
        questions: generateLevelQuestions('B1', 'B2'),
        passingScore: 80,
        targetLevel: 'B2',
        requiredLevel: 'B1'
      },
      {
        id: 5,
        type: 'level',
        name: 'Certification C1',
        description: 'Évaluation pour accéder au niveau C1',
        duration: 60,
        questions: generateLevelQuestions('B2', 'C1'),
        passingScore: 80,
        targetLevel: 'C1',
        requiredLevel: 'B2'
      },
      {
        id: 6,
        type: 'final',
        name: 'Certification finale ELC Academy',
        description: 'Évaluation finale pour obtenir le certificat ELC Academy',
        duration: 90,
        questions: generateFinalQuestions(),
        passingScore: 85,
        targetLevel: 'Master',
        requiredLevel: 'C1'
      }
    ]
    
    // Charger l'historique des évaluations de l'utilisateur
    if (authStore.user) {
      userEvaluations.value = authStore.user.evaluations || []
    }
  }
  
  const checkLevelRequirements = (targetLevel) => {
    if (!authStore.user) return false
    
    const currentLevel = authStore.user.level
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1']
    const currentIndex = levels.indexOf(currentLevel)
    const targetIndex = levels.indexOf(targetLevel)
    
    // Vérifier que c'est le niveau suivant
    if (targetIndex !== currentIndex + 1) return false
    
    // Vérifier la progression dans les sessions de grammaire
    const progress = userProgress.value[currentLevel]
    return progress && progress.canUnlockNext
  }
  
  const startEvaluation = (evaluationId) => {
    const evaluation = evaluations.value.find(e => e.id === evaluationId)
    if (!evaluation) return false
    
    currentEvaluation.value = {
      ...evaluation,
      startTime: new Date().toISOString(),
      currentQuestion: 0
    }
    answers.value = {}
    evaluationInProgress.value = true
    
    return true
  }
  
  const submitAnswer = (questionId, answer) => {
    answers.value[questionId] = answer
  }
  
  const nextQuestion = () => {
    if (currentEvaluation.value) {
      currentEvaluation.value.currentQuestion++
    }
  }
  
  const previousQuestion = () => {
    if (currentEvaluation.value && currentEvaluation.value.currentQuestion > 0) {
      currentEvaluation.value.currentQuestion--
    }
  }
  
  const submitEvaluation = async () => {
    if (!currentEvaluation.value || !authStore.user) return null
    
    // Calculer le score
    const totalQuestions = currentEvaluation.value.questions.length
    let correctAnswers = 0
    
    currentEvaluation.value.questions.forEach(question => {
      if (answers.value[question.id] === question.correctAnswer) {
        correctAnswers++
      }
    })
    
    const score = Math.round((correctAnswers / totalQuestions) * 100)
    const passed = score >= currentEvaluation.value.passingScore
    
    // Créer le résultat
    const result = {
      id: Date.now(),
      evaluationId: currentEvaluation.value.id,
      userId: authStore.user.id,
      score,
      passed,
      completedAt: new Date().toISOString(),
      duration: Math.round((new Date() - new Date(currentEvaluation.value.startTime)) / 60000),
      certificateId: passed ? `CERT-${Date.now()}` : null
    }
    
    // Sauvegarder le résultat
    userEvaluations.value.push(result)
    
    // Mettre à jour le niveau de l'utilisateur si réussi
    if (passed) {
      if (currentEvaluation.value.type === 'initial') {
        // Déterminer le niveau basé sur le score
        const level = determineInitialLevel(score)
        authStore.updateLevel(level)
      } else if (currentEvaluation.value.targetLevel && currentEvaluation.value.targetLevel !== 'Master') {
        authStore.updateLevel(currentEvaluation.value.targetLevel)
      }
    }
    
    // Réinitialiser
    evaluationInProgress.value = false
    currentEvaluation.value = null
    answers.value = {}
    
    return result
  }
  
  const determineInitialLevel = (score) => {
    if (score >= 90) return 'B2'
    if (score >= 75) return 'B1'
    if (score >= 60) return 'A2'
    if (score >= 40) return 'A1'
    return 'A1'
  }
  
  const getCertificate = (certificateId) => {
    const evaluation = userEvaluations.value.find(e => e.certificateId === certificateId)
    if (!evaluation) return null
    
    const evalDetails = evaluations.value.find(e => e.id === evaluation.evaluationId)
    
    return {
      id: certificateId,
      userName: authStore.user.name,
      evaluationName: evalDetails.name,
      score: evaluation.score,
      completedAt: evaluation.completedAt,
      level: evalDetails.targetLevel || authStore.user.level
    }
  }
  
  // Générateurs de questions
  function generateInitialQuestions() {
    return [
      {
        id: 1,
        type: 'multiple-choice',
        text: 'What ____ your name?',
        options: ['are', 'is', 'am', 'be'],
        correctAnswer: 'is',
        level: 'A1'
      },
      {
        id: 2,
        type: 'multiple-choice',
        text: 'I ____ from France.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'am',
        level: 'A1'
      },
      {
        id: 3,
        type: 'multiple-choice',
        text: 'She ____ to work every day.',
        options: ['go', 'goes', 'going', 'gone'],
        correctAnswer: 'goes',
        level: 'A2'
      },
      {
        id: 4,
        type: 'multiple-choice',
        text: 'I ____ English for three years.',
        options: ['study', 'studied', 'have studied', 'am studying'],
        correctAnswer: 'have studied',
        level: 'B1'
      },
      {
        id: 5,
        type: 'multiple-choice',
        text: 'If I ____ rich, I would travel the world.',
        options: ['am', 'was', 'were', 'will be'],
        correctAnswer: 'were',
        level: 'B2'
      }
      // Ajouter plus de questions...
    ]
  }
  
  function generateLevelQuestions(fromLevel, toLevel) {
    // Générer des questions appropriées pour le niveau
    const questions = []
    for (let i = 1; i <= 20; i++) {
      questions.push({
        id: i,
        type: 'multiple-choice',
        text: `Question ${i} pour passer de ${fromLevel} à ${toLevel}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
        level: toLevel
      })
    }
    return questions
  }
  
  function generateFinalQuestions() {
    // Questions pour l'évaluation finale
    return generateLevelQuestions('C1', 'Master')
  }
  
  return {
    // État
    evaluations,
    userEvaluations,
    currentEvaluation,
    evaluationInProgress,
    answers,
    
    // Getters
    availableEvaluations,
    userProgress,
    
    // Actions
    loadEvaluations,
    startEvaluation,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    submitEvaluation,
    getCertificate
  }
}) 