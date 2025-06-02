<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="course" class="bg-white rounded-lg shadow p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ course.name }}</h1>
        <div class="flex items-center space-x-4 mb-6">
          <span class="level-badge">{{ course.level }}</span>
          <span class="text-gray-600">{{ course.duration }}</span>
          <span class="text-gray-600">{{ course.price }} token</span>
        </div>
        <p class="text-gray-600 mb-8">{{ course.fullDescription || course.description }}</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">Objectifs d'apprentissage</h3>
            <ul class="space-y-2">
              <li v-for="objective in course.learningObjectives || []" :key="objective" class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                {{ objective }}
              </li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-4">Prochaines sessions</h3>
            <div class="space-y-3">
              <div v-for="session in course.sessions || []" :key="session.id" class="border rounded-lg p-4">
                <p class="font-medium">{{ formatDate(session.dateTime) }}</p>
                <p class="text-sm text-gray-600">{{ session.teacher }}</p>
                <p class="text-sm text-gray-500">{{ session.topic }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-12">
        <p class="text-gray-500">Cours non trouvé</p>
        <router-link to="/cours" class="text-primary-600 hover:text-primary-700">
          Retour aux cours
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCoursesStore } from '@/stores/courses'

const route = useRoute()
const coursesStore = useCoursesStore()

const course = computed(() => {
  const id = parseInt(route.params.id)
  return coursesStore.getCourseById(id)
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script> 