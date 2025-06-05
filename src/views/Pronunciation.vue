<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Prononciation</h1>
        <p class="text-gray-600 mt-2">Perfectionnez votre accent et améliorez votre expression orale</p>
      </div>

      <!-- Info Banner -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <InformationCircleIcon class="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 class="text-sm font-medium text-blue-900">Comment ça marche ?</h3>
            <p class="text-sm text-blue-700 mt-1">
              Nos ateliers de prononciation vous aident à maîtriser les sons spécifiques de l'anglais. 
              Exercices pratiques, feedback personnalisé et techniques de correction phonétique pour 
              améliorer votre accent.
            </p>
          </div>
        </div>
      </div>

      <!-- Level Filter -->
      <div class="mb-6 flex flex-wrap gap-2">
        <button
          v-for="level in levels"
          :key="level"
          @click="selectedLevel = selectedLevel === level ? '' : level"
          :class="[
            selectedLevel === level 
              ? 'bg-primary-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50',
            'px-4 py-2 rounded-lg font-medium transition-colors'
          ]"
        >
          Niveau {{ level }}
        </button>
      </div>

      <!-- Sessions Grid -->
      <div v-if="filteredSessions.length === 0" class="text-center py-12">
        <MicIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun atelier disponible</h3>
        <p class="text-gray-600">
          {{ selectedLevel ? `Aucun atelier pour le niveau ${selectedLevel}` : 'Revenez plus tard pour découvrir de nouveaux ateliers de prononciation' }}
        </p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="session in filteredSessions" 
          :key="session.id"
          class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-3">
              <span class="text-2xl">🔊</span>
              <span class="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                {{ session.level }}
              </span>
            </div>
            
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ session.name }}</h3>
            
            <p class="text-gray-600 text-sm mb-4">
              {{ session.content?.description || 'Atelier de prononciation ciblé' }}
            </p>

            <!-- Objectifs -->
            <div v-if="session.content?.objectives?.length" class="mb-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Sons travaillés :</h4>
              <ul class="space-y-1">
                <li 
                  v-for="(obj, idx) in session.content.objectives.slice(0, 3)" 
                  :key="idx"
                  class="text-xs text-gray-600 flex items-start"
                >
                  <span class="text-orange-500 mr-1">•</span>
                  {{ obj }}
                </li>
              </ul>
            </div>
            
            <div class="space-y-2 mb-4 border-t pt-4">
              <div class="flex items-center text-sm text-gray-600">
                <CalendarIcon class="w-4 h-4 mr-2" />
                {{ formatDate(session.dateTime) }}
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <UserIcon class="w-4 h-4 mr-2" />
                {{ session.teacher }}
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <ClockIcon class="w-4 h-4 mr-2" />
                {{ session.duration }} minutes
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <UserGroupIcon class="w-4 h-4 mr-2" />
                {{ session.enrolled?.length || 0 }}/{{ session.maxStudents }} participants
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-900">1 token</span>
              <div class="space-x-2">
                <router-link 
                  :to="`/courses/${session.id}`"
                  class="px-3 py-1 text-primary-600 hover:text-primary-800 text-sm"
                >
                  Détails
                </router-link>
                <button 
                  v-if="canBook(session)"
                  @click="bookSession(session)"
                  class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                >
                  Réserver
                </button>
                <span 
                  v-else-if="isEnrolled(session)"
                  class="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm"
                >
                  ✓ Inscrit
                </span>
                <span 
                  v-else
                  class="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm"
                >
                  Complet
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg p-6 text-center">
          <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="text-xl">👂</span>
          </div>
          <h3 class="font-semibold mb-2">Écoutez attentivement</h3>
          <p class="text-sm text-gray-600">
            Entraînez votre oreille à reconnaître les nuances de prononciation
          </p>
        </div>
        
        <div class="bg-white rounded-lg p-6 text-center">
          <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="text-xl">🗣️</span>
          </div>
          <h3 class="font-semibold mb-2">Pratiquez régulièrement</h3>
          <p class="text-sm text-gray-600">
            La répétition est la clé pour intégrer les nouveaux sons et rythmes
          </p>
        </div>
        
        <div class="bg-white rounded-lg p-6 text-center">
          <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="text-xl">📱</span>
          </div>
          <h3 class="font-semibold mb-2">Enregistrez-vous</h3>
          <p class="text-sm text-gray-600">
            Comparez votre prononciation avec les modèles pour progresser plus vite
          </p>
        </div>
      </div>
    </div>

    <!-- Notification Toast -->
    <NotificationToast 
      v-if="notification"
      :message="notification.message"
      :type="notification.type"
      @close="notification = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCoursesStore } from '@/stores/courses'
import { 
  Info as InformationCircleIcon,
  Mic as MicIcon,
  Calendar as CalendarIcon,
  User as UserIcon,
  Clock as ClockIcon,
  Users as UserGroupIcon
} from 'lucide-vue-next'
import NotificationToast from '@/components/ui/NotificationToast.vue'

const authStore = useAuthStore()
const coursesStore = useCoursesStore()

const selectedLevel = ref('')
const notification = ref(null)
const levels = ['A1', 'A2', 'B1', 'B2', 'C1']

// Computed
const filteredSessions = computed(() => {
  let sessions = coursesStore.sessionsByType.pronunciation || []
  
  if (selectedLevel.value) {
    sessions = sessions.filter(s => s.level === selectedLevel.value)
  }
  
  return sessions
})

// Lifecycle
onMounted(async () => {
  await coursesStore.loadCoursesData()
})

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const canBook = (session) => {
  return authStore.user?.tokens > 0 && 
    (session.enrolled?.length || 0) < session.maxStudents &&
    !isEnrolled(session)
}

const isEnrolled = (session) => {
  return session.enrolled?.includes(authStore.user?.id)
}

const bookSession = async (session) => {
  try {
    await coursesStore.bookSession(session.id)
    notification.value = {
      type: 'success',
      message: `Vous êtes inscrit à l'atelier "${session.name}"`
    }
  } catch (error) {
    notification.value = {
      type: 'error',
      message: error.message
    }
  }
}
</script>