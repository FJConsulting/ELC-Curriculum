<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Club de conversation</h1>
        <p class="text-gray-600 mt-2">
          Débattez de l'actualité en anglais et améliorez votre expression orale
        </p>
      </div>

      <!-- Club Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div 
          v-for="club in conversationClubs" 
          :key="club.id"
          class="card p-6"
        >
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-semibold text-gray-900">{{ club.name }}</h3>
            <span class="level-badge">{{ club.level }}</span>
          </div>
          
          <p class="text-gray-600 mb-4">{{ club.description }}</p>
          
          <div class="space-y-2 mb-4">
            <div class="flex items-center text-sm text-gray-500">
              <span class="mr-2">⏱️</span>
              {{ club.duration }}
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <span class="mr-2">👥</span>
              {{ club.maxStudents }} personnes max
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <span class="mr-2">🪙</span>
              {{ club.price }} token
            </div>
          </div>

          <!-- Sessions -->
          <div class="mb-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-3">Prochaines sessions :</h4>
            <div class="space-y-3">
              <div 
                v-for="session in club.sessions" 
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
                    {{ 5 - session.enrolled }} places
                  </span>
                </div>
                
                <!-- Preparation materials -->
                <div v-if="session.preparationMaterials" class="mb-2">
                  <p class="text-xs font-medium text-gray-700 mb-1">Préparation :</p>
                  <ul class="text-xs text-gray-600 space-y-1">
                    <li v-for="material in session.preparationMaterials" :key="material">
                      📖 {{ material }}
                    </li>
                  </ul>
                </div>

                <button 
                  @click="bookSession(session.id)"
                  :disabled="session.enrolled >= 5"
                  class="w-full btn-primary py-2 text-sm disabled:opacity-50"
                >
                  {{ session.enrolled >= 5 ? 'Complet' : 'Rejoindre' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Topics overview -->
      <div class="mt-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Sujets abordés</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div 
            v-for="topic in allTopics" 
            :key="topic"
            class="bg-white rounded-lg p-4 text-center border border-gray-200 hover:border-primary-500 transition-colors"
          >
            <div class="text-2xl mb-2">💬</div>
            <p class="text-sm font-medium text-gray-700">{{ topic }}</p>
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

const conversationClubs = computed(() => coursesStore.conversationClubs)

const allTopics = computed(() => {
  const topics = new Set()
  conversationClubs.value.forEach(club => {
    club.topics?.forEach(topic => topics.add(topic))
  })
  return Array.from(topics)
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const bookSession = async (sessionId) => {
  try {
    await coursesStore.bookSession(sessionId, 'conversation')
    alert('Session réservée avec succès !')
  } catch (error) {
    alert(error.message)
  }
}
</script> 