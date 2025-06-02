<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">Test de niveau d'anglais</h2>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 text-2xl"
        >
          ✕
        </button>
      </div>

      <!-- Test en cours -->
      <div v-if="!testCompleted" class="p-6">
        <!-- Progress -->
        <div class="mb-6">
          <div class="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {{ currentQuestion + 1 }} sur {{ questions.length }}</span>
            <span>{{ Math.round((currentQuestion + 1) / questions.length * 100) }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: ((currentQuestion + 1) / questions.length * 100) + '%' }"
            ></div>
          </div>
        </div>

        <!-- Question -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-4">{{ questions[currentQuestion].question }}</h3>
          <div class="space-y-3">
            <button
              v-for="(option, index) in questions[currentQuestion].options"
              :key="index"
              @click="selectAnswer(index)"
              class="w-full text-left p-4 border-2 rounded-lg transition-all hover:border-primary-300 hover:bg-primary-50"
              :class="selectedAnswer === index ? 'border-primary-500 bg-primary-50' : 'border-gray-200'"
            >
              {{ option }}
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between">
          <button 
            @click="previousQuestion"
            :disabled="currentQuestion === 0"
            class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          <button 
            @click="nextQuestion"
            :disabled="selectedAnswer === null"
            class="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ currentQuestion === questions.length - 1 ? 'Terminer' : 'Suivant' }}
          </button>
        </div>
      </div>

      <!-- Résultats -->
      <div v-else class="p-6 text-center">
        <div class="mb-6">
          <div class="text-6xl mb-4">🎉</div>
          <h3 class="text-2xl font-bold mb-2">Test terminé !</h3>
          <p class="text-gray-600 mb-4">Votre niveau estimé est :</p>
          <div class="text-4xl font-bold text-primary-600 mb-6">{{ estimatedLevel }}</div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 class="font-semibold mb-2">Résultats détaillés</h4>
          <div class="text-sm text-gray-600">
            <p>Score : {{ correctAnswers }}/{{ questions.length }} ({{ Math.round(correctAnswers / questions.length * 100) }}%)</p>
            <p class="mt-1">{{ getLevelDescription(estimatedLevel) }}</p>
          </div>
        </div>

        <div class="flex justify-center space-x-4">
          <button 
            @click="restartTest"
            class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Refaire le test
          </button>
          <button 
            @click="saveResultsAndClose"
            class="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-lg"
          >
            Enregistrer et continuer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'result'])

// État du test
const currentQuestion = ref(0)
const selectedAnswer = ref(null)
const userAnswers = ref([])
const testCompleted = ref(false)

// Questions du test
const questions = ref([
  {
    question: "What _____ your name?",
    options: ["is", "are", "am", "be"],
    correct: 0,
    level: "A1"
  },
  {
    question: "I _____ from France.",
    options: ["come", "comes", "coming", "came"],
    correct: 0,
    level: "A1"
  },
  {
    question: "She _____ to work every day.",
    options: ["go", "goes", "going", "gone"],
    correct: 1,
    level: "A1"
  },
  {
    question: "If I _____ rich, I would travel the world.",
    options: ["was", "were", "am", "is"],
    correct: 1,
    level: "B1"
  },
  {
    question: "The book _____ by millions of people.",
    options: ["reads", "is read", "reading", "has read"],
    correct: 1,
    level: "B2"
  }
])

// Computed
const correctAnswers = computed(() => {
  return userAnswers.value.filter((answer, index) => 
    answer === questions.value[index].correct
  ).length
})

const estimatedLevel = computed(() => {
  const score = correctAnswers.value / questions.value.length
  if (score >= 0.8) return 'B2'
  if (score >= 0.6) return 'B1'
  if (score >= 0.4) return 'A2'
  return 'A1'
})

// Méthodes
const selectAnswer = (answerIndex) => {
  selectedAnswer.value = answerIndex
}

const nextQuestion = () => {
  if (selectedAnswer.value !== null) {
    userAnswers.value[currentQuestion.value] = selectedAnswer.value
    selectedAnswer.value = null
    
    if (currentQuestion.value === questions.value.length - 1) {
      testCompleted.value = true
    } else {
      currentQuestion.value++
    }
  }
}

const previousQuestion = () => {
  if (currentQuestion.value > 0) {
    currentQuestion.value--
    selectedAnswer.value = userAnswers.value[currentQuestion.value] ?? null
  }
}

const restartTest = () => {
  currentQuestion.value = 0
  selectedAnswer.value = null
  userAnswers.value = []
  testCompleted.value = false
}

const saveResultsAndClose = () => {
  emit('result', {
    level: estimatedLevel.value,
    score: correctAnswers.value,
    total: questions.value.length
  })
  emit('close')
}

const getLevelDescription = (level) => {
  const descriptions = {
    'A1': 'Débutant - Vous maîtrisez les bases de l\'anglais',
    'A2': 'Élémentaire - Vous pouvez communiquer dans des situations simples',
    'B1': 'Intermédiaire - Vous pouvez vous exprimer sur des sujets familiers',
    'B2': 'Intermédiaire supérieur - Vous maîtrisez bien l\'anglais'
  }
  return descriptions[level] || ''
}
</script> 