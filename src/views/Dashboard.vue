<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header avec gradient moderne -->
      <div class="mb-8 bg-white rounded-2xl shadow-sm p-8 bg-gradient-to-r from-primary-50 to-secondary-50">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Bonjour {{ authStore.user?.name }} ! 👋
        </h1>
        <p class="text-gray-600">
          Continuez votre apprentissage et atteignez vos objectifs
        </p>
      </div>

      <!-- Stats Cards avec design moderne -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Niveau actuel</p>
              <p class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                {{ authStore.userLevel }}
              </p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center">
              <span class="text-xl">🎯</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Tokens disponibles</p>
              <p class="text-2xl font-bold text-gray-900">{{ authStore.userTokens }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center">
              <span class="text-xl">🪙</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Cours réservés</p>
              <p class="text-2xl font-bold text-gray-900">{{ authStore.user?.bookedCourses?.length || 0 }}</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl flex items-center justify-center">
              <span class="text-xl">📚</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Progression globale</p>
              <p class="text-2xl font-bold text-gray-900">{{ userProgress }}%</p>
            </div>
            <div class="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
              <span class="text-xl">📈</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Section principale avec grid moderne -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <!-- Prochaines séances -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 class="text-lg font-semibold mb-4 flex items-center">
            <span class="mr-2">📅</span>
            Prochaines séances
          </h3>
          <div v-if="upcomingSessions.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
            <div class="text-5xl mb-3">🗓️</div>
            <p class="text-gray-500 mb-4">Aucune séance programmée</p>
            <router-link to="/cours" class="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
              Réserver un cours
              <span class="ml-1">→</span>
            </router-link>
          </div>
          <div v-else class="space-y-3">
            <div 
              v-for="session in upcomingSessions" 
              :key="session.id" 
              class="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-medium text-gray-900">{{ session.courseName }}</h4>
                  <p class="text-sm text-gray-600 mt-1">{{ session.teacher }}</p>
                  <p class="text-sm text-primary-600 mt-1 font-medium">{{ formatDate(session.dateTime) }}</p>
                </div>
                <button 
                  @click="cancelSession(session.id)"
                  class="text-red-600 hover:text-red-700 text-sm font-medium hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Progression détaillée -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 class="text-lg font-semibold mb-4 flex items-center">
            <span class="mr-2">📊</span>
            Progression par niveau
          </h3>
          <div class="space-y-4">
            <div v-for="(level, key) in progressData" :key="key">
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium text-gray-700">Niveau {{ key }}</span>
                <span class="text-sm font-semibold text-gray-900">{{ level.completed }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500 ease-out"
                  :style="{ width: level.completed + '%' }"
                ></div>
              </div>
              <div class="flex justify-between items-center mt-1">
                <span class="text-xs text-gray-500">
                  {{ level.completedLessons }}/{{ level.totalLessons }} leçons
                </span>
                <button 
                  v-if="level.completed >= 80"
                  @click="$router.push('/evaluations')"
                  class="text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  Passer l'évaluation →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions rapides avec nouveau design -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <router-link 
          to="/cours" 
          class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 text-center group border border-gray-100"
        >
          <div class="w-16 h-16 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <span class="text-2xl">👥</span>
          </div>
          <h3 class="text-lg font-semibold mb-2 text-gray-900">Cours collectifs</h3>
          <p class="text-gray-600 text-sm">Rejoignez un cours adapté</p>
        </router-link>

        <router-link 
          to="/ateliers-grammaire" 
          class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 text-center group border border-gray-100"
        >
          <div class="w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <span class="text-2xl">✏️</span>
          </div>
          <h3 class="text-lg font-semibold mb-2 text-gray-900">Ateliers grammaire</h3>
          <p class="text-gray-600 text-sm">Renforcez vos bases</p>
        </router-link>

        <router-link 
          to="/club-conversation" 
          class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 text-center group border border-gray-100"
        >
          <div class="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <span class="text-2xl">💬</span>
          </div>
          <h3 class="text-lg font-semibold mb-2 text-gray-900">Club conversation</h3>
          <p class="text-gray-600 text-sm">Pratiquez l'oral</p>
        </router-link>

        <router-link 
          to="/evaluations" 
          class="bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 text-center group"
        >
          <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <span class="text-2xl">🎓</span>
          </div>
          <h3 class="text-lg font-semibold mb-2">Évaluations</h3>
          <p class="text-white text-opacity-90 text-sm">Validez vos niveaux</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCoursesStore } from '@/stores/courses'

const authStore = useAuthStore()
const coursesStore = useCoursesStore()

// Computed properties
const userProgress = computed(() => {
  if (!authStore.user?.progress) return 0
  const levels = Object.values(authStore.user.progress)
  const totalProgress = levels.reduce((sum, level) => sum + level.completed, 0)
  return Math.round(totalProgress / levels.length)
})

const progressData = computed(() => {
  if (!authStore.user?.progress) return {}
  
  const result = {}
  Object.entries(authStore.user.progress).forEach(([level, data]) => {
    result[level] = {
      completed: data.completed,
      totalLessons: data.lessons,
      completedLessons: Math.round((data.completed / 100) * data.lessons)
    }
  })
  return result
})

const upcomingSessions = computed(() => {
  return authStore.user?.bookedCourses || []
})

// Methods
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const cancelSession = (sessionId) => {
  if (confirm('Êtes-vous sûr de vouloir annuler cette séance ? Votre token sera remboursé.')) {
    coursesStore.cancelBooking(sessionId)
  }
}
</script> 