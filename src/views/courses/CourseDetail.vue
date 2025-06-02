<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div v-if="session" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
        <router-link to="/dashboard" class="inline-flex items-center text-primary-600 hover:text-primary-800 mb-4">
          <ChevronLeftIcon class="w-5 h-5 mr-1" />
          Retour au tableau de bord
        </router-link>
        
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ session.name }}</h1>
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <span class="flex items-center">
                <CalendarIcon class="w-4 h-4 mr-1" />
                {{ formatDate(session.dateTime) }}
              </span>
              <span class="flex items-center">
                <ClockIcon class="w-4 h-4 mr-1" />
                {{ session.duration }} minutes
              </span>
              <span class="flex items-center">
                <AcademicCapIcon class="w-4 h-4 mr-1" />
                Niveau {{ session.level }}
              </span>
            </div>
          </div>
          
          <div class="text-right">
            <div v-if="isEnrolled" class="space-y-2">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                ✓ Inscrit
              </span>
              <div v-if="isUpcoming && session.meetingLink">
                <button 
                  @click="joinMeeting"
                  class="block w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <VideoCameraIcon class="w-5 h-5 inline mr-1" />
                  Rejoindre la session
                </button>
              </div>
            </div>
            <button 
              v-else-if="canEnroll"
              @click="enrollInSession"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              S'inscrire (1 token)
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Description -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-semibold mb-4">À propos de cette session</h2>
            <p class="text-gray-700">{{ session.content?.description || 'Aucune description disponible.' }}</p>
          </div>

          <!-- Objectifs -->
          <div v-if="session.content?.objectives?.length" class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-semibold mb-4">Objectifs d'apprentissage</h2>
            <ul class="space-y-2">
              <li v-for="(objective, idx) in session.content.objectives" :key="idx" class="flex items-start">
                <CheckCircleIcon class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span class="text-gray-700">{{ objective }}</span>
              </li>
            </ul>
          </div>

          <!-- Prérequis -->
          <div v-if="session.content?.prerequisites?.length" class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-semibold mb-4">Prérequis</h2>
            <ul class="list-disc list-inside space-y-1">
              <li v-for="(prereq, idx) in session.content.prerequisites" :key="idx" class="text-gray-700">
                {{ prereq }}
              </li>
            </ul>
          </div>

          <!-- Plan de la session -->
          <div v-if="session.content?.outline?.length" class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-semibold mb-4">Plan de la session</h2>
            <ol class="space-y-3">
              <li v-for="(item, idx) in session.content.outline" :key="idx" class="flex">
                <span class="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-medium text-sm mr-3">
                  {{ idx + 1 }}
                </span>
                <span class="text-gray-700 pt-1">{{ item }}</span>
              </li>
            </ol>
          </div>

          <!-- Ressources -->
          <div v-if="isEnrolled && sessionResources.length > 0" class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-semibold mb-4">Ressources pédagogiques</h2>
            <div class="space-y-3">
              <div 
                v-for="resource in sessionResources" 
                :key="resource.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div class="flex items-center">
                  <span class="text-2xl mr-3">{{ getResourceIcon(resource.type) }}</span>
                  <div>
                    <p class="font-medium">{{ resource.name }}</p>
                    <p class="text-sm text-gray-600">{{ formatFileSize(resource.size) }}</p>
                  </div>
                </div>
                <button 
                  @click="downloadResource(resource)"
                  class="px-3 py-1 text-primary-600 hover:text-primary-800"
                >
                  <ArrowDownTrayIcon class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Professeur -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="font-semibold mb-3">Votre professeur</h3>
            <div class="flex items-center">
              <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-lg font-medium">{{ session.teacher?.charAt(0) || 'P' }}</span>
              </div>
              <div>
                <p class="font-medium">{{ session.teacher || 'Professeur' }}</p>
                <div v-if="teacherInfo" class="text-sm text-gray-600">
                  <p>{{ teacherInfo.experience }}</p>
                  <div class="flex items-center mt-1">
                    <StarIcon class="w-4 h-4 text-yellow-500" />
                    <span class="ml-1">{{ teacherInfo.rating }}/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Participants -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="font-semibold mb-3">Participants</h3>
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-600">Places occupées</span>
              <span class="font-medium">{{ session.enrolled?.length || 0 }}/{{ session.maxStudents }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-primary-500 h-2 rounded-full transition-all"
                :style="{ width: ((session.enrolled?.length || 0) / session.maxStudents * 100) + '%' }"
              ></div>
            </div>
          </div>

          <!-- Actions rapides -->
          <div v-if="isEnrolled" class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="font-semibold mb-3">Actions</h3>
            <div class="space-y-2">
              <button 
                v-if="canCancel"
                @click="cancelEnrollment"
                class="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                Annuler l'inscription
              </button>
              <button 
                @click="addToCalendar"
                class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <CalendarDaysIcon class="w-5 h-5 inline mr-1" />
                Ajouter au calendrier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div class="h-12 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div class="space-y-4">
          <div class="h-32 bg-gray-200 rounded"></div>
          <div class="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCoursesStore } from '@/stores/courses'
import { useAdminStore } from '@/stores/admin'
import { 
  ChevronLeft as ChevronLeftIcon, 
  Calendar as CalendarIcon, 
  Clock as ClockIcon,
  GraduationCap as AcademicCapIcon,
  CheckCircle2 as CheckCircleIcon,
  Video as VideoCameraIcon,
  Download as ArrowDownTrayIcon,
  Star as StarIcon,
  CalendarDays as CalendarDaysIcon
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const coursesStore = useCoursesStore()
const adminStore = useAdminStore()

const session = ref(null)
const teacherInfo = ref(null)

const isEnrolled = computed(() => {
  return session.value?.enrolled?.includes(authStore.user?.id) || false
})

const isUpcoming = computed(() => {
  if (!session.value) return false
  return new Date(session.value.dateTime) > new Date()
})

const canEnroll = computed(() => {
  return isUpcoming.value && 
    !isEnrolled.value && 
    authStore.user?.tokens > 0 &&
    (session.value?.enrolled?.length || 0) < session.value?.maxStudents
})

const canCancel = computed(() => {
  if (!session.value || !isUpcoming.value) return false
  const hoursUntilSession = (new Date(session.value.dateTime) - new Date()) / (1000 * 60 * 60)
  return hoursUntilSession > 24 // Peut annuler jusqu'à 24h avant
})

const sessionResources = computed(() => {
  if (!session.value) return []
  return adminStore.resources.filter(r => r.sessionId === session.value.id)
})

onMounted(async () => {
  await adminStore.loadAdminData()
  const sessionId = parseInt(route.params.id)
  session.value = adminStore.sessions.find(s => s.id === sessionId)
  
  if (session.value && session.value.teacherId) {
    teacherInfo.value = adminStore.teachers.find(t => t.id === session.value.teacherId)
  }
})

// Méthodes
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const getResourceIcon = (type) => {
  const icons = {
    'pdf': '📄',
    'video': '🎥',
    'audio': '🎵',
    'image': '🖼️',
    'document': '📃',
    'presentation': '📊'
  }
  return icons[type] || '📎'
}

const enrollInSession = async () => {
  if (confirm('Voulez-vous utiliser 1 token pour vous inscrire à cette session ?')) {
    await coursesStore.bookSession(session.value.id)
    // Rafraîchir la session
    session.value = adminStore.sessions.find(s => s.id === session.value.id)
  }
}

const cancelEnrollment = async () => {
  if (confirm('Êtes-vous sûr de vouloir annuler votre inscription ? Votre token sera remboursé.')) {
    await coursesStore.cancelBooking(session.value.id)
    // Rafraîchir la session
    session.value = adminStore.sessions.find(s => s.id === session.value.id)
  }
}

const joinMeeting = () => {
  if (session.value.meetingLink) {
    window.open(session.value.meetingLink, '_blank')
  } else {
    alert('Le lien de la session sera disponible 15 minutes avant le début.')
  }
}

const downloadResource = (resource) => {
  // Simuler le téléchargement
  console.log('Téléchargement de:', resource.name)
  alert(`Téléchargement de "${resource.name}" en cours...`)
}

const addToCalendar = () => {
  const startDate = new Date(session.value.dateTime)
  const endDate = new Date(startDate.getTime() + session.value.duration * 60000)
  
  const event = {
    title: session.value.name,
    start: startDate.toISOString(),
    end: endDate.toISOString(),
    description: session.value.content?.description || '',
    location: 'En ligne - ELC Academy'
  }
  
  // Créer un fichier .ics pour le calendrier
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').replace('.000', '')}
DTEND:${endDate.toISOString().replace(/[-:]/g, '').replace('.000', '')}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`
  
  const blob = new Blob([icsContent], { type: 'text/calendar' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${session.value.name}.ics`
  a.click()
  window.URL.revokeObjectURL(url)
}
</script> 