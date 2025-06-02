<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content max-w-4xl">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold gradient-text">Test de niveau gratuit</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Progress bar -->
      <div class="mb-8">
        <div class="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {{ currentQuestion + 1 }} sur {{ questions.length }}</span>
          <span>{{ Math.round(((currentQuestion + 1) / questions.length) * 100) }}%</span>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: ((currentQuestion + 1) / questions.length) * 100 + '%' }"
          ></div>
        </div>
      </div>

      <!-- Test Content -->
      <div v-if="!testCompleted">
        <div class="mb-8">
          <h3 class="text-xl font-semibold mb-6">{{ questions[currentQuestion].question }}</h3>
          <div class="space-y-3">
            <button
              v-for="(option, index) in questions[currentQuestion].options"
              :key="index"
              @click="selectAnswer(option, index)"
              class="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors focus:outline-none focus:border-primary-500"
              :class="{ 
                'border-primary-500 bg-primary-50': selectedAnswer === index,
                'cursor-not-allowed opacity-50': answerSelected 
              }"
              :disabled="answerSelected"
            >
              <span class="font-medium">{{ String.fromCharCode(65 + index) }})</span>
              {{ option }}
            </button>
          </div>
        </div>

        <div class="flex justify-between">
          <button 
            @click="previousQuestion"
            v-if="currentQuestion > 0"
            class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Précédent
          </button>
          <div></div>
          <button 
            @click="nextQuestion"
            v-if="answerSelected"
            class="btn-primary px-6 py-2"
          >
            {{ currentQuestion < questions.length - 1 ? 'Suivant' : 'Terminer' }}
          </button>
        </div>
      </div>

      <!-- Results -->
      <div v-else class="text-center">
        <div class="mb-8">
          <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckIcon class="w-12 h-12 text-green-600" />
          </div>
          <h3 class="text-2xl font-bold mb-4">Test terminé !</h3>
          <p class="text-lg text-gray-600 mb-6">Votre niveau estimé est :</p>
          <div class="inline-block bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-3xl font-bold px-8 py-4 rounded-xl mb-6">
            {{ result.level }}
          </div>
          <div class="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 class="font-semibold mb-2">Ce que cela signifie :</h4>
            <p class="text-gray-600">{{ result.description }}</p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            @click="handleRegistration"
            class="btn-primary px-8 py-3 text-lg"
          >
            S'inscrire maintenant
          </button>
          <button 
            @click="$emit('close')"
            class="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { XMarkIcon, CheckIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['close', 'completed'])

// État du test
const currentQuestion = ref(0)
const selectedAnswer = ref(null)
const answerSelected = ref(false)
const answers = ref([])
const testCompleted = ref(false)

// Questions du test
const questions = ref([
  {
    question: "Choisissez la forme correcte : 'I ___ to the store yesterday.'",
    options: ["go", "went", "going", "goes"],
    correct: 1,
    level: 'A1'
  },
  {
    question: "Quel est le participe passé de 'write' ?",
    options: ["wrote", "written", "writing", "writes"],
    correct: 1,
    level: 'A2'
  },
  {
    question: "Complétez : 'If I ___ you, I would accept the offer.'",
    options: ["am", "was", "were", "be"],
    correct: 2,
    level: 'B1'
  },
  {
    question: "Quel verbe à particule signifie 'annuler' ?",
    options: ["call on", "call off", "call out", "call up"],
    correct: 1,
    level: 'B2'
  },
  {
    question: "Choisissez la forme correcte : 'By next year, I ___ here for 10 years.'",
    options: ["will work", "will be working", "will have worked", "work"],
    correct: 2,
    level: 'C1'
  }
])

// Résultat calculé
const result = computed(() => {
  if (!testCompleted.value) return null
  
  const correctAnswers = answers.value.filter(answer => answer.correct).length
  const percentage = (correctAnswers / questions.value.length) * 100
  
  let level, description
  
  if (percentage >= 80) {
    level = 'B2'
    description = 'Excellent ! Vous maîtrisez bien l\'anglais et pouvez communiquer avec aisance dans la plupart des situations.'
  } else if (percentage >= 60) {
    level = 'B1'
    description = 'Bon niveau ! Vous pouvez vous débrouiller dans les situations courantes mais avez besoin de perfectionner certains aspects.'
  } else if (percentage >= 40) {
    level = 'A2'
    description = 'Niveau élémentaire. Vous connaissez les bases mais devez encore travailler les structures grammaticales.'
  } else {
    level = 'A1'
    description = 'Niveau débutant. C\'est parfait pour commencer ! Nos cours vous aideront à construire des bases solides.'
  }
  
  return { level, description, percentage }
})

// Méthodes
const selectAnswer = (option, index) => {
  if (answerSelected.value) return
  
  selectedAnswer.value = index
  answerSelected.value = true
  
  answers.value[currentQuestion.value] = {
    questionIndex: currentQuestion.value,
    selectedIndex: index,
    selectedOption: option,
    correct: index === questions.value[currentQuestion.value].correct
  }
}

const nextQuestion = () => {
  if (currentQuestion.value < questions.value.length - 1) {
    currentQuestion.value++
    selectedAnswer.value = null
    answerSelected.value = false
  } else {
    completeTest()
  }
}

const previousQuestion = () => {
  if (currentQuestion.value > 0) {
    currentQuestion.value--
    const previousAnswer = answers.value[currentQuestion.value]
    if (previousAnswer) {
      selectedAnswer.value = previousAnswer.selectedIndex
      answerSelected.value = true
    } else {
      selectedAnswer.value = null
      answerSelected.value = false
    }
  }
}

const completeTest = () => {
  testCompleted.value = true
}

const handleRegistration = () => {
  emit('completed', result.value)
}
</script>

<style scoped>
.modal-overlay {
  backdrop-filter: blur(4px);
}
</style> 