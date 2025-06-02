<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Cours collectifs</h1>
        <p class="text-gray-600 mt-2">
          Découvrez nos cours en petits groupes (max 5 personnes) adaptés à votre niveau
        </p>
      </div>

      <!-- Filters -->
      <div class="mb-8 flex flex-wrap gap-4">
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-gray-700">Niveau :</label>
          <select v-model="selectedLevel" class="input-field py-2 px-3 text-sm">
            <option value="">Tous les niveaux</option>
            <option value="A1">A1 - Débutant</option>
            <option value="A2">A2 - Élémentaire</option>
            <option value="B1">B1 - Intermédiaire</option>
            <option value="B2">B2 - Intermédiaire supérieur</option>
            <option value="C1">C1 - Avancé</option>
          </select>
        </div>
        
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-gray-700">Catégorie :</label>
          <select v-model="selectedCategory" class="input-field py-2 px-3 text-sm">
            <option value="">Toutes les catégories</option>
            <option value="grammar">Grammaire</option>
            <option value="communication">Communication</option>
            <option value="business">Business</option>
          </select>
        </div>
      </div>

      <!-- Course Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="course in filteredCourses" 
          :key="course.id"
          class="card p-6 cursor-pointer"
          @click="showCourseDetails(course)"
        >
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-semibold text-gray-900">{{ course.name }}</h3>
            <span class="level-badge">{{ course.level }}</span>
          </div>
          
          <p class="text-gray-600 mb-4">{{ course.description }}</p>
          
          <div class="space-y-2 mb-4">
            <div class="flex items-center text-sm text-gray-500">
              <span class="mr-2">⏱️</span>
              {{ course.duration }}
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <span class="mr-2">👥</span>
              {{ course.maxStudents }} personnes max
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <span class="mr-2">🪙</span>
              {{ course.price }} token
            </div>
          </div>

          <!-- Next sessions preview -->
          <div v-if="course.sessions && course.sessions.length > 0" class="mb-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Prochaines séances :</h4>
            <div class="space-y-1">
              <div 
                v-for="session in course.sessions.slice(0, 2)" 
                :key="session.id"
                class="text-xs text-gray-600"
              >
                {{ formatSessionDate(session.dateTime) }} - {{ session.teacher }}
                <span class="text-primary-600">({{ 5 - session.enrolled }} places)</span>
              </div>
            </div>
          </div>

          <button class="w-full btn-primary py-2">
            Voir les détails
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="filteredCourses.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">📚</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun cours trouvé</h3>
        <p class="text-gray-600">Essayez de modifier vos filtres ou revenez plus tard.</p>
      </div>
    </div>

    <!-- Course Detail Modal -->
    <div v-if="selectedCourse" class="modal-overlay" @click.self="selectedCourse = null">
      <div class="modal-content max-w-4xl">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ selectedCourse.name }}</h2>
            <div class="flex items-center space-x-4 mt-2">
              <span class="level-badge">{{ selectedCourse.level }}</span>
              <span class="text-sm text-gray-600">{{ selectedCourse.duration }}</span>
              <span class="text-sm text-gray-600">{{ selectedCourse.price }} token</span>
            </div>
          </div>
          <button @click="selectedCourse = null" class="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Description</h3>
          <p class="text-gray-600">{{ selectedCourse.fullDescription }}</p>
        </div>

        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Ce que vous apprendrez</h3>
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <li 
              v-for="objective in selectedCourse.learningObjectives" 
              :key="objective"
              class="flex items-center text-sm text-gray-600"
            >
              <span class="text-green-500 mr-2">✓</span>
              {{ objective }}
            </li>
          </ul>
        </div>

        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-4">Séances disponibles</h3>
          <div class="space-y-3">
            <div 
              v-for="session in selectedCourse.sessions" 
              :key="session.id"
              class="border border-gray-200 rounded-lg p-4 hover:border-primary-500 transition-colors"
            >
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium">{{ formatSessionDate(session.dateTime) }}</p>
                  <p class="text-sm text-gray-600">{{ session.teacher }}</p>
                  <p class="text-sm text-gray-500">{{ session.topic }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm text-gray-500 mb-2">
                    {{ 5 - session.enrolled }}/5 places disponibles
                  </p>
                  <button 
                    @click="bookSession(session.id)"
                    :disabled="session.enrolled >= 5"
                    class="btn-primary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ session.enrolled >= 5 ? 'Complet' : 'Réserver' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCoursesStore } from '@/stores/courses'
import { useAuthStore } from '@/stores/auth'

const coursesStore = useCoursesStore()
const authStore = useAuthStore()

const selectedLevel = ref('')
const selectedCategory = ref('')
const selectedCourse = ref(null)

const filteredCourses = computed(() => {
  let courses = coursesStore.availableCourses

  if (selectedLevel.value) {
    courses = courses.filter(course => 
      course.levels.includes(selectedLevel.value) || course.level === selectedLevel.value
    )
  }

  if (selectedCategory.value) {
    courses = courses.filter(course => course.category === selectedCategory.value)
  }

  return courses
})

const showCourseDetails = (course) => {
  selectedCourse.value = course
}

const formatSessionDate = (dateString) => {
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
    await coursesStore.bookSession(sessionId, 'course')
    selectedCourse.value = null
    // Show success notification
    alert('Séance réservée avec succès !')
  } catch (error) {
    alert(error.message)
  }
}

onMounted(() => {
  console.log('Page cours chargée')
})
</script> 