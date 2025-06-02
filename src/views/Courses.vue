<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Cours collectifs</h1>
        <p class="text-gray-600 mt-2">Sessions en petits groupes (5 personnes maximum)</p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <select 
            v-model="filters.level"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tous les niveaux</option>
            <option value="A1">A1 - Débutant</option>
            <option value="A2">A2 - Élémentaire</option>
            <option value="B1">B1 - Intermédiaire</option>
            <option value="B2">B2 - Intermédiaire avancé</option>
            <option value="C1">C1 - Avancé</option>
          </select>
          
          <select 
            v-model="filters.category"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Toutes les catégories</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.icon }} {{ cat.name }}
            </option>
          </select>
          
          <input 
            v-model="filters.search"
            type="text"
            placeholder="Rechercher..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
        </div>
      </div>

      <!-- Sessions Grid -->
      <div v-if="filteredSessions.length === 0" class="text-center py-12">
        <BookOpenIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucune session disponible</h3>
        <p class="text-gray-600">Revenez plus tard pour découvrir de nouvelles sessions</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="session in filteredSessions" 
          :key="session.id"
          class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <!-- Category Banner -->
          <div 
            class="h-2 rounded-t-xl"
            :style="{ backgroundColor: getCategoryColor(session.categoryId) }"
          ></div>
          
          <div class="p-6">
            <div class="flex items-start justify-between mb-3">
              <span class="text-2xl">{{ getCategoryIcon(session.categoryId) }}</span>
              <span class="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                {{ session.level }}
              </span>
            </div>
            
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ session.name }}</h3>
            
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">
              {{ session.content?.description || 'Session de cours collectif' }}
            </p>
            
            <div class="space-y-2 mb-4">
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
            
            <!-- Progress bar -->
            <div class="mb-4">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-primary-500 h-2 rounded-full transition-all"
                  :style="{ width: ((session.enrolled?.length || 0) / session.maxStudents * 100) + '%' }"
                ></div>
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
  BookOpen as BookOpenIcon,
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
const filters = ref({
  level: '',
  category: '',
  search: ''
})

// Computed
const categories = computed(() => adminStore.categories)

const filteredSessions = computed(() => {
  let sessions = coursesStore.sessionsByType.course || []
  
  if (filters.value.level) {
    sessions = sessions.filter(s => s.level === filters.value.level)
  }
  
  if (filters.value.category) {
    sessions = sessions.filter(s => s.categoryId === parseInt(filters.value.category))
  }
  
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    sessions = sessions.filter(s => 
      s.name.toLowerCase().includes(search) ||
      s.content?.description?.toLowerCase().includes(search) ||
      s.teacher?.toLowerCase().includes(search)
    )
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
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getCategoryById = (categoryId) => {
  return adminStore.categories.find(c => c.id === categoryId)
}

const getCategoryIcon = (categoryId) => {
  return getCategoryById(categoryId)?.icon || '📚'
}

const getCategoryColor = (categoryId) => {
  return getCategoryById(categoryId)?.color || '#3B82F6'
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

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style> 