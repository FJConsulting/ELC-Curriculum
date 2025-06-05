<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Club de conversation</h1>
        <p class="text-gray-600 mt-2">Pratiquez votre anglais en discutant de l'actualité et de la culture</p>
      </div>

      <!-- Info Banner -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <InformationCircleIcon class="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 class="text-sm font-medium text-blue-900">Comment ça marche ?</h3>
            <p class="text-sm text-blue-700 mt-1">
              Chaque session aborde un thème d'actualité différent. Des ressources sont fournies à l'avance 
              pour vous préparer. Les discussions sont modérées par un professeur natif.
            </p>
          </div>
        </div>
      </div>

      <!-- Sessions Grid -->
      <div v-if="conversationSessions.length === 0" class="text-center py-12">
        <ChatBubbleLeftRightIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucune session disponible</h3>
        <p class="text-gray-600">Revenez plus tard pour découvrir de nouvelles sessions de conversation</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="session in conversationSessions" 
          :key="session.id"
          class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-3">
              <span class="text-2xl">💬</span>
              <span class="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                {{ session.level }}
              </span>
            </div>
            
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ session.name }}</h3>
            
            <p class="text-gray-600 text-sm mb-4">
              {{ session.content?.description || 'Session de conversation thématique' }}
            </p>

            <!-- Thème principal -->
            <div v-if="session.content?.objectives?.length" class="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 class="text-sm font-medium text-gray-700 mb-1">Thèmes abordés :</h4>
              <p class="text-sm text-gray-600">{{ session.content.objectives[0] }}</p>
            </div>
            
            <div class="space-y-2 mb-4 border-t pt-4">
              <div class="flex items-center text-sm text-gray-600">
                <CalendarIcon class="w-4 h-4 mr-2" />
                {{ formatDate(session.dateTime) }}
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <UserIcon class="w-4 h-4 mr-2" />
                Modéré par {{ session.teacher }}
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

            <!-- Resources preview -->
            <div v-if="isEnrolled(session) && getSessionResources(session.id).length > 0" class="mb-4 p-3 bg-green-50 rounded-lg">
              <p class="text-xs text-green-700 font-medium">
                📎 {{ getSessionResources(session.id).length }} ressources disponibles
              </p>
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
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="text-xl">📖</span>
          </div>
          <h3 class="font-semibold mb-2">Préparez-vous</h3>
          <p class="text-sm text-gray-600">
            Consultez les ressources avant la session pour enrichir la discussion
          </p>
        </div>
        
        <div class="bg-white rounded-lg p-6 text-center">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="text-xl">🗣️</span>
          </div>
          <h3 class="font-semibold mb-2">Participez activement</h3>
          <p class="text-sm text-gray-600">
            N'ayez pas peur de faire des erreurs, l'important est de pratiquer
          </p>
        </div>
        
        <div class="bg-white rounded-lg p-6 text-center">
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="text-xl">🌍</span>
          </div>
          <h3 class="font-semibold mb-2">Échangez les cultures</h3>
          <p class="text-sm text-gray-600">
            Partagez vos perspectives et découvrez celles des autres participants
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
import { useAdminStore } from '@/stores/admin'
import { 
  Info as InformationCircleIcon,
  MessageSquare as ChatBubbleLeftRightIcon,
  Calendar as CalendarIcon,
  User as UserIcon,
  Clock as ClockIcon,
  Users as UserGroupIcon
} from 'lucide-vue-next'
import NotificationToast from '@/components/ui/NotificationToast.vue'

const authStore = useAuthStore()
const coursesStore = useCoursesStore()
const adminStore = useAdminStore()

const notification = ref(null)

// Computed
const conversationSessions = computed(() => {
  return coursesStore.sessionsByType.conversation || []
})

// Lifecycle
onMounted(async () => {
  await coursesStore.loadCoursesData()
})

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
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

const getSessionResources = (sessionId) => {
  return adminStore.resources.filter(r => r.sessionId === sessionId)
}

const bookSession = async (session) => {
  try {
    await coursesStore.bookSession(session.id)
    notification.value = {
      type: 'success',
      message: `Vous êtes inscrit à la session "${session.name}"`
    }
  } catch (error) {
    notification.value = {
      type: 'error',
      message: error.message
    }
  }
}
</script> 