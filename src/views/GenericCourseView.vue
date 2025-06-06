<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <!-- Gestion du loading -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Chargement des cours...</p>
      </div>
    </div>
    
    <!-- Gestion des erreurs -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <div class="text-red-600">
            <h3 class="text-sm font-medium">Erreur de chargement</h3>
            <p class="text-sm mt-1">{{ error }}</p>
            <button @click="$router.go(0)" class="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
              Réessayer
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Contenu normal -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Debug info (à supprimer en production) -->
      <div v-if="$route.query.debug || adminStore.courseTypes.length === 0" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 class="text-sm font-medium text-yellow-900">Debug Info</h3>
        <div class="text-xs text-yellow-700 mt-1">
          <p>Route slug: {{ courseTypeSlug }}</p>
          <p>Course type: {{ courseType?.name || 'Non défini' }}</p>
          <p>Sessions found: {{ filteredSessions.length }}</p>
          <p>Total sessions: {{ adminStore.sessions.length }}</p>
          <p>Course types loaded: {{ adminStore.courseTypes.length }}</p>
          <p>Loading: {{ loading }}</p>
          <p>Error: {{ error }}</p>
          <p>Available course types: {{ adminStore.courseTypes.map(ct => ct.name).join(', ') }}</p>
        </div>
      </div>
      
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">{{ courseType.name }}</h1>
        <p class="text-gray-600 mt-2">{{ courseType.description }}</p>
      </div>

      <!-- Info Banner -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <InformationCircleIcon class="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 class="text-sm font-medium text-blue-900">Comment ça marche ?</h3>
            <p class="text-sm text-blue-700 mt-1">
              {{ courseType.howItWorks || `Nos sessions de ${courseType.name} vous aident à progresser en anglais. 
              Exercices pratiques, feedback personnalisé et techniques adaptées pour 
              améliorer vos compétences.` }}
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
        <component :is="courseType.emptyIcon || MicIcon" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucune session disponible</h3>
        <p class="text-gray-600">
          {{ selectedLevel ? `Aucune session pour le niveau ${selectedLevel}` : `Revenez plus tard pour découvrir de nouvelles sessions de ${courseType.name}` }}
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
              <span class="text-2xl">{{ courseType.icon || '📚' }}</span>
              <span class="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                {{ session.level }}
              </span>
            </div>
            
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ session.name }}</h3>
            
            <p class="text-gray-600 text-sm mb-4">
              {{ session.content?.description || `Session de ${courseType.name}` }}
            </p>

            <!-- Objectifs -->
            <div v-if="session.content?.objectives?.length" class="mb-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Objectifs :</h4>
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
      <div v-if="courseType.tips && courseType.tips.length > 0" class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          v-for="(tip, index) in courseType.tips" 
          :key="index" 
          class="bg-white rounded-lg p-6 text-center"
        >
          <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span class="text-xl">{{ tip.icon }}</span>
          </div>
          <h3 class="font-semibold mb-2">{{ tip.title }}</h3>
          <p class="text-sm text-gray-600">
            {{ tip.description }}
          </p>
        </div>
      </div>
      
      <!-- Default Tips Section si aucun tip personnalisé n'est défini -->
      <div v-else class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
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
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCoursesStore } from '@/stores/courses'
import { useAdminStore } from '@/stores/admin/index'
import { 
  Info as InformationCircleIcon,
  Mic as MicIcon,
  Calendar as CalendarIcon,
  User as UserIcon,
  Clock as ClockIcon,
  Users as UserGroupIcon,
  BookOpen as BookOpenIcon
} from 'lucide-vue-next'
import NotificationToast from '@/components/ui/NotificationToast.vue'

const route = useRoute()
const authStore = useAuthStore()
const coursesStore = useCoursesStore()
const adminStore = useAdminStore()

const selectedLevel = ref('')
const notification = ref(null)
const levels = ['A1', 'A2', 'B1', 'B2', 'C1']

// Récupérer le type de cours à partir de la route
const courseTypeSlug = computed(() => {
  // Essayer d'abord les paramètres de route
  if (route.params.courseType) {
    return route.params.courseType
  }
  
  // Sinon, utiliser le nom de la route
  const routeName = route.name
  console.log('🔍 Nom de la route:', routeName)
  
  // Si le nom de la route est un slug valide, l'utiliser
  if (typeof routeName === 'string') {
    return routeName
  }
  
  // Fallback: extraire le slug du chemin de la route
  const path = route.path
  const pathSegments = path.split('/').filter(Boolean)
  return pathSegments[0] || 'course'
})

// Récupérer les informations du type de cours
const courseType = computed(() => {
  console.log('🔍 Recherche du type de cours pour le slug:', courseTypeSlug.value)
  
  // Utiliser la fonction getCourseTypeBySlug si disponible
  let foundType = null
  
  if (adminStore.getCourseTypeBySlug) {
    foundType = adminStore.getCourseTypeBySlug(courseTypeSlug.value)
  }
  
  // Si non trouvé, essayer différentes variantes du slug
  if (!foundType) {
    const slugVariants = [
      courseTypeSlug.value,
      courseTypeSlug.value.replace(/-/g, '_'),
      courseTypeSlug.value.replace(/_/g, '-'),
      `/${courseTypeSlug.value}`
    ]
    
    for (const variant of slugVariants) {
      foundType = adminStore.courseTypes.find(
        type => type.route === variant ||
                type.slug === variant ||
                type.route === `/${variant}` ||
                type.name.toLowerCase().includes(variant.toLowerCase())
      )
      
      if (foundType) break
    }
  }
  
  // Correspondances connues si toujours pas trouvé
  if (!foundType) {
    const typeMap = {
      'conversation-club': {
        name: 'Club conversation',
        description: 'Actualité & culture',
        icon: '💬',
        slug: 'conversation-club'
      },
      'grammar-workshops': {
        name: 'Ateliers grammaire',
        description: 'Par niveau (A1→B2+)',
        icon: '✏️',
        slug: 'grammar-workshops'
      },
      'pronunciation': {
        name: 'Prononciation',
        description: 'Perfectionnez votre accent',
        icon: '🔊',
        slug: 'pronunciation'
      },
      'course': {
        name: 'Cours collectifs',
        description: 'Groupes de 5 personnes max',
        icon: '📚',
        slug: 'course'
      }
    }
    
    // Chercher une correspondance dans le typeMap
    for (const [key, value] of Object.entries(typeMap)) {
      if (courseTypeSlug.value.includes(key) || key.includes(courseTypeSlug.value)) {
        foundType = value
        break
      }
    }
  }
  
  // Valeur par défaut si le type n'est pas trouvé
  if (!foundType) {
    console.warn(`⚠️ Type de cours non trouvé pour le slug: ${courseTypeSlug.value}`)
    foundType = {
      name: 'Cours',
      description: 'Sessions de cours disponibles',
      icon: '📚',
      emptyIcon: BookOpenIcon,
      features: {},
      slug: courseTypeSlug.value
    }
  } else {
    console.log('✅ Type de cours trouvé:', foundType.name)
  }
  
  return foundType
})

// Computed pour filtrer les sessions par type de cours et niveau
// Computed property avec fallback amélioré
const filteredSessions = computed(() => {
  try {
    // Vérifier que les données sont disponibles
    if (!adminStore.sessions || adminStore.sessions.length === 0) {
      console.log('⚠️ Aucune session disponible')
      return []
    }
    
    if (!courseType.value || !courseType.value.name) {
      console.log('⚠️ Type de cours non défini')
      return []
    }
    
    // Obtenir les sessions pour ce type de cours
    let sessions = coursesStore.getSessionsByType(courseTypeSlug.value) || []
    
    // Si aucune session trouvée avec le slug, essayer avec le nom
    if (sessions.length === 0 && courseType.value.name) {
      sessions = adminStore.sessions.filter(session => {
        return session.type === courseType.value.name ||
               session.courseType === courseType.value.name ||
               session.course_type === courseType.value.name
      })
    }
    
    // Filtrer par niveau si sélectionné
    if (selectedLevel.value) {
      sessions = sessions.filter(session => session.level === selectedLevel.value)
    }
    
    console.log(`📊 Sessions filtrées pour ${courseType.value.name}:`, sessions.length)
    return sessions
  } catch (error) {
    console.error('❌ Erreur dans filteredSessions:', error)
    return []
  }
})

// Dans la section script setup, ajouter une gestion d'erreur
const error = ref(null)
const loading = ref(true)

// Lifecycle avec gestion d'erreur améliorée
onMounted(async () => {
  console.log('🔄 Chargement des données pour GenericCourseView...')
  
  try {
    loading.value = true
    error.value = null
    
    // Charger les données avec retry logic
    let retryCount = 0
    const maxRetries = 3
    
    while (retryCount < maxRetries) {
      try {
        await coursesStore.loadCoursesData()
        
        // Vérifier si les données ont été correctement chargées
        if (adminStore.courseTypes.length > 0) {
          console.log('✅ Données chargées avec succès')
          console.log('📊 Types de cours disponibles:', adminStore.courseTypes.length)
          console.log('📊 Sessions disponibles:', adminStore.sessions.length)
          break
        } else {
          throw new Error('Aucun type de cours chargé')
        }
      } catch (err) {
        retryCount++
        console.warn(`⚠️ Tentative ${retryCount}/${maxRetries} échouée:`, err.message)
        
        if (retryCount >= maxRetries) {
          throw err
        }
        
        // Attendre avant de réessayer
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))
      }
    }
    
  } catch (err) {
    console.error('❌ Erreur lors du chargement des données:', err)
    error.value = err.message || 'Erreur lors du chargement des données'
  } finally {
    loading.value = false
  }
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