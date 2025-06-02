<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Ateliers de grammaire</h1>
        <p class="text-gray-600 mt-2">
          Renforcez vos bases grammaticales avec nos ateliers structurés par niveau
        </p>
      </div>

      <!-- Workshops Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="workshop in grammarWorkshops" 
          :key="workshop.id"
          class="card p-6"
        >
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-semibold text-gray-900">{{ workshop.name }}</h3>
            <span class="level-badge">{{ workshop.level }}</span>
          </div>
          
          <p class="text-gray-600 mb-4">{{ workshop.description }}</p>
          
          <div class="space-y-2 mb-4">
            <div class="flex items-center text-sm text-gray-500">
              <span class="mr-2">⏱️</span>
              {{ workshop.duration }}
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <span class="mr-2">👥</span>
              {{ workshop.maxStudents }} personnes max
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <span class="mr-2">🪙</span>
              {{ workshop.price }} token
            </div>
          </div>

          <!-- Topics covered -->
          <div class="mb-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-2">Sujets abordés :</h4>
            <ul class="text-xs text-gray-600 space-y-1">
              <li v-for="topic in workshop.topics" :key="topic" class="flex items-center">
                <span class="mr-2 text-green-500">✓</span>
                {{ topic }}
              </li>
            </ul>
          </div>

          <!-- Sessions -->
          <div v-if="workshop.sessions?.length > 0" class="mb-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-3">Prochaines sessions :</h4>
            <div class="space-y-2">
              <div 
                v-for="session in workshop.sessions" 
                :key="session.id"
                class="border border-gray-200 rounded-lg p-3"
              >
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <p class="font-medium text-sm">{{ session.topic }}</p>
                    <p class="text-xs text-gray-600">{{ formatDate(session.dateTime) }}</p>
                    <p class="text-xs text-gray-500">{{ session.teacher }}</p>
                  </div>
                  <span class="text-xs text-primary-600">
                    {{ 5 - session.enrolled }}/5 places
                  </span>
                </div>

                <button 
                  @click="bookSession(session.id)"
                  :disabled="session.enrolled >= 5"
                  class="w-full btn-primary py-2 text-sm disabled:opacity-50"
                >
                  {{ session.enrolled >= 5 ? 'Complet' : 'Réserver' }}
                </button>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-4 text-gray-500 text-sm">
            Nouvelles sessions bientôt disponibles
          </div>
        </div>
      </div>

      <!-- Grammar progression guide -->
      <div class="mt-12 bg-white rounded-lg p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Progression recommandée</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">📚</span>
            </div>
            <h3 class="text-lg font-semibold mb-2">Niveau A1-A2</h3>
            <p class="text-sm text-gray-600">
              Bases essentielles : articles, temps simples, pronoms, pluriels
            </p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">🔧</span>
            </div>
            <h3 class="text-lg font-semibold mb-2">Niveau B1-B2</h3>
            <p class="text-sm text-gray-600">
              Structures avancées : conditionnels, voix passive, discours rapporté
            </p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">🎯</span>
            </div>
            <h3 class="text-lg font-semibold mb-2">Révision continue</h3>
            <p class="text-sm text-gray-600">
              Exercices pratiques et application dans des contextes réels
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCoursesStore } from '@/stores/courses'

const coursesStore = useCoursesStore()

const grammarWorkshops = computed(() => coursesStore.grammarWorkshops)

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const bookSession = async (sessionId) => {
  try {
    await coursesStore.bookSession(sessionId, 'grammar')
    alert('Atelier réservé avec succès !')
  } catch (error) {
    alert(error.message)
  }
}
</script> 