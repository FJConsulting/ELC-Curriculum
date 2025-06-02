<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header de bienvenue -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
          Bonjour {{ authStore.user?.name }} ! 👋
        </h1>
        <p class="text-gray-600 mt-2">Continuez votre apprentissage de l'anglais</p>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Niveau actuel</p>
              <p class="text-2xl font-bold text-primary-600">{{ authStore.user?.level || 'A1' }}</p>
            </div>
            <div class="p-3 bg-primary-100 rounded-full">
              <AcademicCapIcon class="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Tokens disponibles</p>
              <p class="text-2xl font-bold">{{ authStore.user?.tokens || 0 }}</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-full">
              <CurrencyDollarIcon class="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Sessions complétées</p>
              <p class="text-2xl font-bold">{{ completedSessionsCount }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <CheckCircleIcon class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Progrès global</p>
              <p class="text-2xl font-bold">{{ coursesStore.getTotalProgress() }}%</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-full">
              <ChartBarIcon class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Prochaine session -->
      <div v-if="nextSession" class="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-sm p-6 text-white mb-8">
        <h2 class="text-xl font-semibold mb-4">Votre prochaine session</h2>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium">{{ nextSession.name }}</h3>
            <p class="opacity-90">{{ formatDate(nextSession.dateTime) }}</p>
            <p class="text-sm opacity-75 mt-1">Avec {{ nextSession.teacher }}</p>
          </div>
          <div class="space-y-2">
            <router-link 
              :to="`/courses/${nextSession.id}`"
              class="block px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors text-center"
            >
              Voir les détails
            </router-link>
            <button 
              v-if="canJoinSession(nextSession)"
              @click="joinSession(nextSession)"
              class="block w-full px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors"
            >
              Rejoindre la session
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Mes sessions inscrites -->
        <div class="lg:col-span-2">
          <h2 class="text-xl font-semibold mb-4">Mes sessions</h2>
          
          <!-- Tabs -->
          <div class="bg-white rounded-xl shadow-sm">
            <div class="border-b border-gray-200">
              <nav class="flex -mb-px">
                <button
                  @click="activeTab = 'upcoming'"
                  :class="[
                    activeTab === 'upcoming' 
                      ? 'border-primary-500 text-primary-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'py-4 px-6 border-b-2 font-medium text-sm transition-colors'
                  ]"
                >
                  À venir ({{ coursesStore.upcomingSessions.length }})
                </button>
                <button
                  @click="activeTab = 'past'"
                  :class="[
                    activeTab === 'past' 
                      ? 'border-primary-500 text-primary-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'py-4 px-6 border-b-2 font-medium text-sm transition-colors'
                  ]"
                >
                  Passées ({{ coursesStore.pastSessions.length }})
                </button>
              </nav>
            </div>

            <div class="p-6">
              <!-- Sessions à venir -->
              <div v-if="activeTab === 'upcoming'" class="space-y-4">
                <div v-if="coursesStore.upcomingSessions.length === 0" class="text-center py-8">
                  <BookOpenIcon class="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p class="text-gray-500">Aucune session à venir</p>
                  <router-link to="/courses" class="text-primary-600 hover:text-primary-700 mt-2 inline-block">
                    Explorer les cours disponibles →
                  </router-link>
                </div>
                
                <div 
                  v-else
                  v-for="session in coursesStore.upcomingSessions" 
                  :key="session.id"
                  class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h3 class="font-semibold text-gray-900">{{ session.name }}</h3>
                      <div class="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span class="flex items-center">
                          <CalendarIcon class="w-4 h-4 mr-1" />
                          {{ formatDate(session.dateTime) }}
                        </span>
                        <span class="flex items-center">
                          <UserIcon class="w-4 h-4 mr-1" />
                          {{ session.teacher }}
                        </span>
                        <span class="flex items-center">
                          <AcademicCapIcon class="w-4 h-4 mr-1" />
                          Niveau {{ session.level }}
                        </span>
                      </div>
                    </div>
                    <div class="flex space-x-2">
                      <router-link 
                        :to="`/courses/${session.id}`"
                        class="px-3 py-1 text-primary-600 hover:text-primary-800"
                      >
                        Détails
                      </router-link>
                      <button 
                        v-if="canJoinSession(session)"
                        @click="joinSession(session)"
                        class="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700"
                      >
                        Rejoindre
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sessions passées -->
              <div v-if="activeTab === 'past'" class="space-y-4">
                <div v-if="coursesStore.pastSessions.length === 0" class="text-center py-8">
                  <ClockIcon class="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p class="text-gray-500">Aucune session passée</p>
                </div>
                
                <div 
                  v-else
                  v-for="session in coursesStore.pastSessions" 
                  :key="session.id"
                  class="border border-gray-200 rounded-lg p-4 opacity-75"
                >
                  <div class="flex items-start justify-between">
                    <div>
                      <h3 class="font-semibold text-gray-900">{{ session.name }}</h3>
                      <div class="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span>{{ formatDate(session.dateTime) }}</span>
                        <span>{{ session.teacher }}</span>
                        <span v-if="session.status === 'completed'" class="text-green-600">
                          ✓ Complétée
                        </span>
                      </div>
                    </div>
                    <router-link 
                      :to="`/courses/${session.id}`"
                      class="text-primary-600 hover:text-primary-800"
                    >
                      Revoir
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Sessions recommandées -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="font-semibold mb-4">Sessions recommandées</h3>
            <div class="space-y-3">
              <div 
                v-for="session in recommendedSessions" 
                :key="session.id"
                class="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                @click="$router.push(`/courses/${session.id}`)"
              >
                <h4 class="font-medium text-sm">{{ session.name }}</h4>
                <p class="text-xs text-gray-600 mt-1">
                  {{ formatSimpleDate(session.dateTime) }} • {{ session.enrolled?.length || 0 }}/{{ session.maxStudents }} inscrits
                </p>
              </div>
            </div>
            <router-link 
              to="/courses" 
              class="text-primary-600 hover:text-primary-700 text-sm mt-4 inline-block"
            >
              Voir tous les cours →
            </router-link>
          </div>

          <!-- Progression par niveau -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="font-semibold mb-4">Progression par niveau</h3>
            <div class="space-y-3">
              <div v-for="level in levels" :key="level">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-sm font-medium">{{ level }}</span>
                  <span class="text-sm text-gray-600">{{ coursesStore.getUserProgress(level) }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    :style="{ width: coursesStore.getUserProgress(level) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions rapides -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="font-semibold mb-4">Actions rapides</h3>
            <div class="space-y-2">
              <button 
                @click="showLevelTest = true"
                class="w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-left"
              >
                📝 Passer un test de niveau
              </button>
              <router-link 
                to="/grammar-workshops"
                class="block w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-left"
              >
                📚 Ateliers de grammaire
              </router-link>
              <router-link 
                to="/conversation-club"
                class="block w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-left"
              >
                💬 Club de conversation
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Level Test Modal -->
    <LevelTestModal v-if="showLevelTest" @close="showLevelTest = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCoursesStore } from '@/stores/courses'
import { 
  GraduationCap as AcademicCapIcon,
  DollarSign as CurrencyDollarIcon,
  CheckCircle2 as CheckCircleIcon,
  BarChart3 as ChartBarIcon,
  Calendar as CalendarIcon,
  User as UserIcon,
  BookOpen as BookOpenIcon,
  Clock as ClockIcon
} from 'lucide-vue-next'
import LevelTestModal from '@/components/LevelTestModal.vue'

const authStore = useAuthStore()
const coursesStore = useCoursesStore()

const activeTab = ref('upcoming')
const showLevelTest = ref(false)
const levels = ['A1', 'A2', 'B1', 'B2', 'C1']

// Computed
const nextSession = computed(() => coursesStore.getNextSession())
const recommendedSessions = computed(() => coursesStore.getRecommendedSessions())
const completedSessionsCount = computed(() => {
  return coursesStore.pastSessions.filter(s => s.status === 'completed').length
})

// Lifecycle
onMounted(async () => {
  await coursesStore.loadCoursesData()
})

// Méthodes
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatSimpleDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const canJoinSession = (session) => {
  if (!session) return false
  const now = new Date()
  const sessionTime = new Date(session.dateTime)
  const timeDiff = sessionTime - now
  // Peut rejoindre 15 minutes avant
  return timeDiff <= 15 * 60 * 1000 && timeDiff > -session.duration * 60 * 1000
}

const joinSession = (session) => {
  if (session.meetingLink) {
    window.open(session.meetingLink, '_blank')
  } else {
    alert('Le lien de la session sera disponible 15 minutes avant le début.')
  }
}
</script>

<style scoped>
/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}
</style> 