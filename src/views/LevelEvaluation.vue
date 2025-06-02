<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Évaluations de niveau
        </h1>
        <p class="text-lg text-gray-600">
          Validez vos connaissances pour passer au niveau supérieur
        </p>
      </div>

      <!-- Evaluations disponibles -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="(evaluation, level) in levelEvaluations" 
          :key="evaluation.id"
          class="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-200 hover:scale-105"
          :class="{
            'opacity-50 cursor-not-allowed': !canStartEvaluation(level),
            'cursor-pointer': canStartEvaluation(level)
          }"
          @click="canStartEvaluation(level) && startEvaluation(level)"
        >
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl font-semibold text-gray-900">{{ evaluation.name }}</h3>
              <span class="px-3 py-1 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-800 rounded-full text-sm font-medium">
                {{ level }}
              </span>
            </div>
            
            <p class="text-gray-600 mb-4">{{ evaluation.description }}</p>
            
            <div class="space-y-2 mb-6">
              <div class="flex items-center text-sm text-gray-500">
                <span class="mr-2">⏱️</span>
                Durée : {{ evaluation.duration }}
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <span class="mr-2">📝</span>
                {{ evaluation.questions }} questions
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <span class="mr-2">🎯</span>
                Score requis : {{ evaluation.requiredScore }}%
              </div>
            </div>

            <!-- Progress indicator -->
            <div class="mb-4">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600">Progression du niveau</span>
                <span class="font-medium">{{ getUserProgress(level) }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500"
                  :style="{ width: getUserProgress(level) + '%' }"
                ></div>
              </div>
            </div>

            <!-- Action button -->
            <button 
              v-if="canStartEvaluation(level)"
              class="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
            >
              Commencer l'évaluation
            </button>
            <div v-else class="text-center">
              <p class="text-sm text-gray-500">
                {{ getUserProgress(level) < 80 ? 'Complétez 80% du niveau pour débloquer' : 'Niveau non disponible' }}
              </p>
            </div>
          </div>

          <!-- Status indicator -->
          <div 
            v-if="hasCompletedEvaluation(level)" 
            class="bg-green-50 px-6 py-3 border-t border-green-100"
          >
            <div class="flex items-center text-green-800">
              <span class="mr-2 text-xl">✅</span>
              <span class="text-sm font-medium">Évaluation réussie</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Info section -->
      <div class="mt-12 bg-blue-50 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-blue-900 mb-2">ℹ️ Comment ça fonctionne ?</h3>
        <ul class="space-y-2 text-sm text-blue-800">
          <li class="flex items-start">
            <span class="mr-2">•</span>
            Complétez au moins 80% d'un niveau pour débloquer son évaluation
          </li>
          <li class="flex items-start">
            <span class="mr-2">•</span>
            Obtenez le score requis pour valider le niveau et débloquer le suivant
          </li>
          <li class="flex items-start">
            <span class="mr-2">•</span>
            Vous pouvez repasser l'évaluation autant de fois que nécessaire
          </li>
          <li class="flex items-start">
            <span class="mr-2">•</span>
            Le passage au niveau supérieur reste optionnel même après validation
          </li>
        </ul>
      </div>
    </div>

    <!-- Evaluation Modal -->
    <div v-if="showEvaluationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-2xl w-full p-8">
        <h2 class="text-2xl font-bold mb-4">{{ currentEvaluation?.name }}</h2>
        <p class="text-gray-600 mb-6">
          Cette évaluation comporte {{ currentEvaluation?.questions }} questions et dure environ {{ currentEvaluation?.duration }}.
        </p>
        <div class="flex justify-end space-x-4">
          <button 
            @click="showEvaluationModal = false"
            class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            @click="redirectToTest"
            class="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-lg"
          >
            Commencer le test
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const coursesStore = useCoursesStore()
const authStore = useAuthStore()

const showEvaluationModal = ref(false)
const currentEvaluation = ref(null)

const levelEvaluations = computed(() => coursesStore.levelEvaluations)

const getUserProgress = (level) => {
  return authStore.user?.progress?.[level]?.completed || 0
}

const canStartEvaluation = (level) => {
  return coursesStore.canTakeEvaluation(level) && levelEvaluations.value[level]?.available
}

const hasCompletedEvaluation = (level) => {
  // TODO: Implémenter la vérification des évaluations complétées
  return false
}

const startEvaluation = (level) => {
  currentEvaluation.value = levelEvaluations.value[level]
  showEvaluationModal.value = true
}

const redirectToTest = () => {
  // Rediriger vers la page de test avec le niveau spécifique
  router.push({
    path: '/test-niveau',
    query: { evaluation: currentEvaluation.value.level }
  })
}
</script> 