<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="lesson" class="bg-white rounded-lg shadow p-8">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ lesson.title }}</h1>
            <p class="text-gray-600">{{ lesson.description }}</p>
            <div class="flex items-center space-x-4 mt-4">
              <span class="level-badge">{{ lesson.level }}</span>
              <span class="text-gray-600">{{ lesson.duration }}</span>
            </div>
          </div>
          <button class="btn-primary px-4 py-2">
            Marquer comme terminé
          </button>
        </div>

        <!-- Video placeholder -->
        <div class="bg-gray-900 rounded-lg aspect-video mb-8 flex items-center justify-center">
          <div class="text-center text-white">
            <div class="text-6xl mb-4">▶️</div>
            <p class="text-xl">Vidéo de la leçon</p>
            <p class="text-gray-400">{{ lesson.videoUrl || 'Vidéo bientôt disponible' }}</p>
          </div>
        </div>

        <!-- Materials -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="material in lesson.materials || []" :key="material.name" class="border rounded-lg p-4 hover:border-primary-500 transition-colors cursor-pointer">
            <div class="flex items-center mb-2">
              <span class="text-2xl mr-3">
                {{ material.type === 'pdf' ? '📄' : material.type === 'audio' ? '🎵' : '📝' }}
              </span>
              <h3 class="font-semibold">{{ material.name }}</h3>
            </div>
            <p class="text-sm text-gray-600 mb-3">
              {{ material.type === 'pdf' ? 'Document PDF' : material.type === 'audio' ? 'Fichier audio' : 'Feuille d\'exercices' }}
            </p>
            <button class="w-full btn-primary py-2 text-sm">
              Télécharger
            </button>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-12">
        <p class="text-gray-500">Leçon non trouvée</p>
        <router-link to="/dashboard" class="text-primary-600 hover:text-primary-700">
          Retour au tableau de bord
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

const lesson = computed(() => {
  const lessonId = `${route.params.courseId}-${route.params.lessonId}`
  return coursesStore.getLessonById(lessonId)
})
</script> 