<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Test de niveau d'anglais</h1>
        <p class="text-lg text-gray-600">
          Évaluez votre niveau d'anglais en 20 questions pour accéder aux cours adaptés
        </p>
      </div>

      <!-- Test non commencé -->
      <div v-if="!testStarted && !testCompleted" class="bg-white rounded-xl shadow-sm p-8">
        <div class="text-center">
          <div class="mx-auto w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-6">
            <AcademicCapIcon class="w-12 h-12 text-primary-600" />
          </div>
          <h2 class="text-2xl font-semibold mb-4">Prêt à évaluer votre niveau ?</h2>
          <p class="text-gray-600 mb-6">
            Ce test prend environ 15-20 minutes et nous permettra de vous proposer des cours adaptés à votre niveau.
          </p>
          <div class="space-y-4 text-left max-w-md mx-auto mb-8">
            <div class="flex items-start">
              <CheckCircleIcon class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <span class="text-gray-700">20 questions variées (grammaire, vocabulaire, compréhension)</span>
            </div>
            <div class="flex items-start">
              <CheckCircleIcon class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <span class="text-gray-700">Résultat immédiat avec niveau CECRL (A1 à C1)</span>
            </div>
            <div class="flex items-start">
              <CheckCircleIcon class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              <span class="text-gray-700">Recommandations personnalisées</span>
            </div>
          </div>
          <button
            @click="startTest"
            class="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Commencer le test
            <ArrowRightIcon class="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Test en cours -->
      <div v-else-if="testStarted && !testCompleted" class="bg-white rounded-xl shadow-sm p-8">
        <!-- Progress bar -->
        <div class="mb-8">
          <div class="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {{ currentQuestionIndex + 1 }} sur {{ questions.length }}</span>
            <span>{{ Math.round(progress) }}% complété</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-primary-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>

        <!-- Question -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold mb-4">{{ currentQuestion.question }}</h2>
          <div class="space-y-3">
            <label
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              class="flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all"
              :class="[
                selectedAnswer === index
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <input
                type="radio"
                :value="index"
                v-model="selectedAnswer"
                class="sr-only"
              />
              <div class="flex items-center justify-center w-6 h-6 rounded-full border-2 mr-3"
                :class="[
                  selectedAnswer === index
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300'
                ]"
              >
                <div v-if="selectedAnswer === index" class="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span class="text-gray-700">{{ option }}</span>
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-between">
          <button
            v-if="currentQuestionIndex > 0"
            @click="previousQuestion"
            class="inline-flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeftIcon class="w-4 h-4 mr-2" />
            Précédent
          </button>
          <div v-else></div>
          
          <button
            @click="nextQuestion"
            :disabled="selectedAnswer === null"
            class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ currentQuestionIndex === questions.length - 1 ? 'Terminer' : 'Suivant' }}
            <ArrowRightIcon class="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      <!-- Résultats -->
      <div v-else-if="testCompleted" class="bg-white rounded-xl shadow-sm p-8">
        <div class="text-center">
          <div class="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircleIcon class="w-12 h-12 text-green-600" />
          </div>
          <h2 class="text-2xl font-semibold mb-4">Test terminé !</h2>
          <p class="text-gray-600 mb-6">
            Voici votre résultat et nos recommandations
          </p>

          <!-- Niveau -->
          <div class="bg-primary-50 rounded-lg p-6 mb-6">
            <p class="text-sm text-gray-600 mb-2">Votre niveau d'anglais est</p>
            <p class="text-4xl font-bold text-primary-600 mb-2">{{ calculatedLevel }}</p>
            <p class="text-sm text-gray-600">{{ levelDescriptions[calculatedLevel] }}</p>
          </div>

          <!-- Score détaillé -->
          <div class="grid grid-cols-3 gap-4 mb-8">
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-600">Score total</p>
              <p class="text-2xl font-semibold">{{ score }}/{{ questions.length }}</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-600">Pourcentage</p>
              <p class="text-2xl font-semibold">{{ Math.round((score / questions.length) * 100) }}%</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-600">Temps</p>
              <p class="text-2xl font-semibold">{{ Math.floor(elapsedTime / 60) }}:{{ String(elapsedTime % 60).padStart(2, '0') }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/register"
              class="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700"
            >
              S'inscrire et commencer
            </router-link>
            <button
              @click="resetTest"
              class="inline-flex items-center justify-center px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Refaire le test
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  GraduationCap as AcademicCapIcon,
  CheckCircle2 as CheckCircleIcon,
  ArrowRight as ArrowRightIcon,
  ArrowLeft as ArrowLeftIcon
} from 'lucide-vue-next'

// États
const testStarted = ref(false)
const testCompleted = ref(false)
const currentQuestionIndex = ref(0)
const selectedAnswer = ref(null)
const answers = ref([])
const startTime = ref(null)
const elapsedTime = ref(0)

// Questions du test
const questions = [
  {
    id: 1,
    question: "I _____ to the cinema yesterday.",
    options: ["go", "went", "gone", "going"],
    correct: 1,
    level: "A1"
  },
  {
    id: 2,
    question: "She _____ speak three languages fluently.",
    options: ["can", "cans", "could to", "able"],
    correct: 0,
    level: "A2"
  },
  {
    id: 3,
    question: "If I _____ rich, I would travel the world.",
    options: ["am", "was", "were", "will be"],
    correct: 2,
    level: "B1"
  },
  {
    id: 4,
    question: "The book _____ by millions of people worldwide.",
    options: ["has read", "has been read", "have read", "was reading"],
    correct: 1,
    level: "B2"
  },
  {
    id: 5,
    question: "I wish I _____ more time to finish the project.",
    options: ["have", "had", "would have", "will have"],
    correct: 1,
    level: "B2"
  },
  // Ajoutez plus de questions ici...
]

// Descriptions des niveaux
const levelDescriptions = {
  'A1': 'Débutant - Vous pouvez comprendre et utiliser des expressions familières et quotidiennes',
  'A2': 'Élémentaire - Vous pouvez communiquer lors de tâches simples et habituelles',
  'B1': 'Intermédiaire - Vous pouvez vous débrouiller dans la plupart des situations de voyage',
  'B2': 'Intermédiaire avancé - Vous pouvez interagir avec aisance avec des locuteurs natifs',
  'C1': 'Avancé - Vous pouvez vous exprimer spontanément et couramment'
}

// Computed
const currentQuestion = computed(() => questions[currentQuestionIndex.value])
const progress = computed(() => ((currentQuestionIndex.value + 1) / questions.length) * 100)
const score = computed(() => answers.value.filter((answer, index) => answer === questions[index].correct).length)

const calculatedLevel = computed(() => {
  const percentage = (score.value / questions.length) * 100
  if (percentage < 20) return 'A1'
  if (percentage < 40) return 'A2'
  if (percentage < 60) return 'B1'
  if (percentage < 80) return 'B2'
  return 'C1'
})

// Méthodes
const startTest = () => {
  testStarted.value = true
  startTime.value = Date.now()
}

const nextQuestion = () => {
  if (selectedAnswer.value !== null) {
    answers.value[currentQuestionIndex.value] = selectedAnswer.value
    
    if (currentQuestionIndex.value < questions.length - 1) {
      currentQuestionIndex.value++
      selectedAnswer.value = answers.value[currentQuestionIndex.value] ?? null
    } else {
      completeTest()
    }
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    selectedAnswer.value = answers.value[currentQuestionIndex.value] ?? null
  }
}

const completeTest = () => {
  elapsedTime.value = Math.floor((Date.now() - startTime.value) / 1000)
  testCompleted.value = true
}

const resetTest = () => {
  testStarted.value = false
  testCompleted.value = false
  currentQuestionIndex.value = 0
  selectedAnswer.value = null
  answers.value = []
  startTime.value = null
  elapsedTime.value = 0
}
</script> 