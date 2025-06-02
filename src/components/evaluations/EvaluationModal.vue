<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-primary-600 text-white p-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">{{ currentEvaluation.name }}</h2>
            <p class="text-primary-100 mt-1">
              Question {{ currentQuestion + 1 }} sur {{ totalQuestions }}
            </p>
          </div>
          <div class="text-right">
            <div class="text-sm text-primary-100">Temps écoulé</div>
            <div class="text-2xl font-mono">{{ formattedTime }}</div>
          </div>
        </div>
        
        <!-- Progress bar -->
        <div class="mt-4 bg-primary-700 rounded-full h-2">
          <div 
            class="bg-white h-2 rounded-full transition-all duration-300"
            :style="{ width: ((currentQuestion + 1) / totalQuestions * 100) + '%' }"
          ></div>
        </div>
      </div>

      <!-- Question -->
      <div class="p-8">
        <div v-if="!showResults" class="space-y-6">
          <div class="text-xl font-medium text-gray-900">
            {{ currentQuestionData.text }}
          </div>
          
          <!-- Options for multiple choice -->
          <div v-if="currentQuestionData.type === 'multiple-choice'" class="space-y-3">
            <label 
              v-for="(option, index) in currentQuestionData.options" 
              :key="index"
              class="block"
            >
              <div 
                class="p-4 border-2 rounded-lg cursor-pointer transition-all"
                :class="[
                  selectedAnswer === option 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <input 
                  type="radio" 
                  :value="option"
                  v-model="selectedAnswer"
                  class="sr-only"
                >
                <div class="flex items-center">
                  <div 
                    class="w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center"
                    :class="[
                      selectedAnswer === option 
                        ? 'border-primary-500 bg-primary-500' 
                        : 'border-gray-300'
                    ]"
                  >
                    <div 
                      v-if="selectedAnswer === option" 
                      class="w-2 h-2 bg-white rounded-full"
                    ></div>
                  </div>
                  <span class="text-gray-900">{{ option }}</span>
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- Results -->
        <div v-else class="text-center py-8">
          <div class="mb-6">
            <div 
              class="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-5xl font-bold"
              :class="[
                isPassed 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              ]"
            >
              {{ evaluationResult.score }}%
            </div>
          </div>
          
          <h3 class="text-2xl font-bold mb-2">
            {{ isPassed ? 'Félicitations !' : 'Dommage...' }}
          </h3>
          
          <p class="text-gray-600 mb-6">
            <template v-if="isPassed">
              Vous avez réussi l'évaluation avec un score de {{ evaluationResult.score }}%.
              <template v-if="currentEvaluation.targetLevel">
                <br>Vous avez débloqué le niveau {{ currentEvaluation.targetLevel }} !
              </template>
            </template>
            <template v-else>
              Vous avez obtenu {{ evaluationResult.score }}%, mais il vous fallait au moins 
              {{ currentEvaluation.passingScore }}% pour réussir.
            </template>
          </p>
          
          <div class="flex justify-center space-x-4">
            <button 
              @click="closeEvaluation"
              class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Fermer
            </button>
            <button 
              v-if="evaluationResult.certificateId"
              @click="downloadCertificate"
              class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <DownloadIcon class="w-5 h-5 inline mr-2" />
              Télécharger le certificat
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="!showResults" class="bg-gray-50 px-8 py-4 flex justify-between items-center">
        <button 
          @click="previousQuestion"
          :disabled="currentQuestion === 0"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon class="w-5 h-5 inline mr-1" />
          Précédent
        </button>
        
        <div class="text-sm text-gray-600">
          {{ answeredQuestions }} / {{ totalQuestions }} questions répondues
        </div>
        
        <button 
          v-if="currentQuestion < totalQuestions - 1"
          @click="nextQuestion"
          :disabled="!selectedAnswer"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Suivant
          <ChevronRightIcon class="w-5 h-5 inline ml-1" />
        </button>
        
        <button 
          v-else
          @click="submitEvaluation"
          :disabled="answeredQuestions < totalQuestions"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Terminer l'évaluation
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useEvaluationsStore } from '@/stores/evaluations'
import { 
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Download as DownloadIcon
} from 'lucide-vue-next'

const evaluationsStore = useEvaluationsStore()

// État local
const selectedAnswer = ref('')
const elapsedTime = ref(0)
const timer = ref(null)
const showResults = ref(false)
const evaluationResult = ref(null)

// Computed
const currentEvaluation = computed(() => evaluationsStore.currentEvaluation)
const currentQuestion = computed(() => currentEvaluation.value?.currentQuestion || 0)
const totalQuestions = computed(() => currentEvaluation.value?.questions.length || 0)
const currentQuestionData = computed(() => 
  currentEvaluation.value?.questions[currentQuestion.value]
)
const answers = computed(() => evaluationsStore.answers)
const answeredQuestions = computed(() => Object.keys(answers.value).length)
const isPassed = computed(() => evaluationResult.value?.passed || false)

const formattedTime = computed(() => {
  const minutes = Math.floor(elapsedTime.value / 60)
  const seconds = elapsedTime.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// Watchers
watch(currentQuestion, () => {
  const questionId = currentQuestionData.value?.id
  selectedAnswer.value = answers.value[questionId] || ''
})

// Methods
const nextQuestion = () => {
  if (selectedAnswer.value) {
    evaluationsStore.submitAnswer(currentQuestionData.value.id, selectedAnswer.value)
    evaluationsStore.nextQuestion()
  }
}

const previousQuestion = () => {
  evaluationsStore.previousQuestion()
}

const submitEvaluation = async () => {
  if (selectedAnswer.value) {
    evaluationsStore.submitAnswer(currentQuestionData.value.id, selectedAnswer.value)
  }
  
  const result = await evaluationsStore.submitEvaluation()
  evaluationResult.value = result
  showResults.value = true
  
  // Arrêter le timer
  if (timer.value) {
    clearInterval(timer.value)
  }
}

const closeEvaluation = () => {
  showResults.value = false
  evaluationResult.value = null
  elapsedTime.value = 0
}

const downloadCertificate = () => {
  if (!evaluationResult.value?.certificateId) return
  
  const certificate = evaluationsStore.getCertificate(evaluationResult.value.certificateId)
  if (!certificate) return
  
  // Générer un certificat amélioré
  const content = `
=====================================
       CERTIFICAT DE RÉUSSITE
       ELC ACADEMY
=====================================

Nous certifions que

    ${certificate.userName.toUpperCase()}

a réussi avec succès l'évaluation :

    ${certificate.evaluationName}

Score obtenu : ${certificate.score}%
Date : ${new Date(certificate.completedAt).toLocaleDateString('fr-FR')}
Niveau atteint : ${certificate.level}

Certificat ID : ${certificate.id}

=====================================
         ELC Academy
    L'excellence en anglais
=====================================
  `
  
  const blob = new Blob([content], { type: 'text/plain' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `certificat-${certificate.id}.txt`
  a.click()
  window.URL.revokeObjectURL(url)
}

// Lifecycle
onMounted(() => {
  // Démarrer le timer
  timer.value = setInterval(() => {
    elapsedTime.value++
  }, 1000)
  
  // Charger la première question
  const questionId = currentQuestionData.value?.id
  selectedAnswer.value = answers.value[questionId] || ''
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script> 