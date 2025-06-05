<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Étudiants actifs</p>
            <p class="text-3xl font-bold mt-1">{{ adminStore.stats.activeStudents }}</p>
            <p class="text-sm text-green-600 mt-2">+12% ce mois</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-xl">
            <span class="text-2xl">👥</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Revenus mensuels</p>
            <p class="text-3xl font-bold mt-1">{{ formatCurrency(adminStore.stats.monthlyRevenue) }}</p>
            <p class="text-sm text-green-600 mt-2">+8% vs mois dernier</p>
          </div>
          <div class="p-3 bg-green-100 rounded-xl">
            <span class="text-2xl">💰</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Cours complétés</p>
            <p class="text-3xl font-bold mt-1">{{ adminStore.stats.totalCourses }}</p>
            <p class="text-sm text-gray-600 mt-2">{{ adminStore.stats.completionRate }}% taux</p>
          </div>
          <div class="p-3 bg-yellow-100 rounded-xl">
            <span class="text-2xl">📚</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Note moyenne</p>
            <p class="text-3xl font-bold mt-1">{{ adminStore.stats.averageRating }}/5</p>
            <p class="text-sm text-gray-600 mt-2">Sur {{ adminStore.stats.totalCourses }} avis</p>
          </div>
          <div class="p-3 bg-purple-100 rounded-xl">
            <span class="text-2xl">⭐</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Revenue Chart -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold mb-4">Évolution des revenus</h3>
        <div class="h-64 relative">
          <!-- Graphique en barres simple -->
          <div class="absolute inset-0 flex items-end justify-between px-2">
            <div
              v-for="(month, index) in revenueData"
              :key="index"
              class="flex-1 mx-1 flex flex-col items-center"
            >
              <div class="w-full relative mb-2" style="height: 200px">
                <div
                  class="absolute bottom-0 w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t transition-all duration-500 hover:from-primary-700 hover:to-primary-500"
                  :style="{ height: (month.value / maxRevenue * 100) + '%' }"
                  :title="`${month.name}: ${formatCurrency(month.value)}`"
                ></div>
              </div>
              <span class="text-xs text-gray-600">{{ month.shortName }}</span>
            </div>
          </div>
          <!-- Lignes de grille horizontales -->
          <div class="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div v-for="i in 5" :key="i" class="flex items-center">
              <span class="text-xs text-gray-400 w-12 text-right pr-2">{{ formatCurrency(maxRevenue * (6 - i) / 5) }}</span>
              <div class="flex-1 border-t border-gray-200"></div>
            </div>
          </div>
        </div>
        <div class="mt-4 text-center text-sm text-gray-600">
          Revenus des 6 derniers mois
        </div>
      </div>

      <!-- Students Progress -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold mb-4">Progression des étudiants</h3>
        <div class="space-y-3">
          <div v-for="level in ['A1', 'A2', 'B1', 'B2', 'C1']" :key="level">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-medium">Niveau {{ level }}</span>
              <span class="text-sm text-gray-600">{{ getStudentsByLevel(level) }} étudiants</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="bg-primary-500 h-2 rounded-full"
                :style="{ width: getProgressPercentage(level) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity and Notifications -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Upcoming Sessions -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Prochaines sessions</h3>
          <button 
            @click="$emit('changeTab', 'sessions')"
            class="text-sm text-primary-600 hover:text-primary-800 cursor-pointer"
          >
            Voir tout
          </button>
        </div>
        <div class="space-y-3">
          <div 
            v-for="session in adminStore.upcomingSessions.slice(0, 5)" 
            :key="session.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            @click="showSessionDetail(session)"
          >
            <div class="flex items-center">
              <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-sm">{{ getCategoryById(session.categoryId)?.icon }}</span>
              </div>
              <div>
                <h4 class="text-sm font-medium">{{ session.title }}</h4>
                <p class="text-sm text-gray-600">
                  {{ formatDate(session.date_time) }} • {{ session.teacher }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-sm font-medium">{{ (session.enrolled?.length || 0) }}/{{ session.maxStudents || 0 }}</span>
              <p class="text-xs text-gray-500">inscrits</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Activité récente</h3>
          <span class="text-xs text-gray-500">Dernières 24h</span>
        </div>
        <div class="space-y-3">
          <div class="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-xs">💰</span>
            </div>
            <div class="flex-1">
              <p class="text-sm">Nouvel abonnement 6 mois</p>
              <p class="text-xs text-gray-500">Marie Dupont • Il y a 2h</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-xs">📚</span>
            </div>
            <div class="flex-1">
              <p class="text-sm">Session terminée avec succès</p>
              <p class="text-xs text-gray-500">Grammaire B1 • Il y a 3h</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
            <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-xs">👤</span>
            </div>
            <div class="flex-1">
              <p class="text-sm">Nouvel utilisateur inscrit</p>
              <p class="text-xs text-gray-500">Jean Martin • Il y a 5h</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
            <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-xs">⭐</span>
            </div>
            <div class="flex-1">
              <p class="text-sm">Nouvelle évaluation 5/5</p>
              <p class="text-xs text-gray-500">Conversation Club • Il y a 6h</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions and Alerts -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Quick Actions -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold mb-4">Actions rapides</h3>
        <div class="space-y-2">
          <button 
            @click="createNewSession"
            class="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between"
          >
            <span class="text-sm font-medium">Créer une session</span>
            <span>➕</span>
          </button>
          <button 
            @click="createNewTeacher"
            class="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between"
          >
            <span class="text-sm font-medium">Ajouter un professeur</span>
            <span>👨‍🏫</span>
          </button>
          <button class="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between">
            <span class="text-sm font-medium">Envoyer une notification</span>
            <span>📧</span>
          </button>
          <button class="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between">
            <span class="text-sm font-medium">Générer un rapport</span>
            <span>📊</span>
          </button>
        </div>
      </div>

      <!-- System Alerts -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold mb-4">Alertes système</h3>
        <div class="space-y-3">
          <div class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p class="text-sm font-medium text-yellow-800">3 sessions sans professeur</p>
            <p class="text-xs text-yellow-600 mt-1">Action requise</p>
          </div>
          <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-sm font-medium text-blue-800">5 abonnements expirent bientôt</p>
            <p class="text-xs text-blue-600 mt-1">Dans les 7 prochains jours</p>
          </div>
          <div class="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm font-medium text-green-800">Système à jour</p>
            <p class="text-xs text-green-600 mt-1">Toutes les fonctionnalités opérationnelles</p>
          </div>
        </div>
      </div>

      <!-- Top Students -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold mb-4">Top étudiants du mois</h3>
        <div class="space-y-3">
          <div 
            v-for="(student, index) in (adminStore.getTopStudents ? adminStore.getTopStudents(5) : [])" 
            :key="student.id"
            class="flex items-center justify-between"
          >
            <div class="flex items-center">
              <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-sm font-bold">{{ index + 1 }}</span>
              </div>
              <div>
                <p class="text-sm font-medium">{{ student.name }}</p>
                <p class="text-xs text-gray-600">{{ student.level }} • {{ student.totalSessions }} sessions</p>
              </div>
            </div>
            <span class="text-sm font-medium text-primary-600">{{ formatCurrency(student.totalSpent) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Session Detail Modal -->
    <div v-if="detailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold">Détails de la session</h3>
          <button 
            @click="detailModal = false"
            class="text-gray-500 hover:text-gray-700"
          >
            ✖️
          </button>
        </div>
        
        <div v-if="detailSession" class="space-y-6">
          <!-- Session Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-medium mb-3">{{ detailSession.title || detailSession.name }}</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600">Catégorie:</span>
                <span class="ml-2 font-medium">{{ getCategoryById(detailSession.categoryId)?.name }}</span>
              </div>
              <div>
                <span class="text-gray-600">Niveau:</span>
                <span class="ml-2 font-medium">{{ detailSession.level }}</span>
              </div>
              <div>
                <span class="text-gray-600">Professeur:</span>
                <span class="ml-2 font-medium">{{ detailSession.teacher }}</span>
              </div>
              <div>
                <span class="text-gray-600">Date:</span>
                <span class="ml-2 font-medium">{{ formatDate(detailSession.date_time) }}</span>
              </div>
              <div>
                <span class="text-gray-600">Durée:</span>
                <span class="ml-2 font-medium">{{ detailSession.duration || 60 }} minutes</span>
              </div>
              <div>
                <span class="text-gray-600">Type:</span>
                <span class="ml-2 font-medium">{{ getTypeLabel(detailSession.type) }}</span>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div v-if="detailSession.content">
            <h4 class="font-medium mb-3">Contenu de la session</h4>
            <div class="space-y-3">
              <div v-if="detailSession.content.description">
                <p class="text-sm font-medium text-gray-700">Description:</p>
                <p class="text-sm text-gray-600">{{ detailSession.content.description }}</p>
              </div>
              
              <div v-if="detailSession.content.objectives?.length">
                <p class="text-sm font-medium text-gray-700">Objectifs:</p>
                <ul class="list-disc list-inside text-sm text-gray-600">
                  <li v-for="(obj, idx) in detailSession.content.objectives" :key="idx">{{ obj }}</li>
                </ul>
              </div>
              
              <div v-if="detailSession.content.outline?.length">
                <p class="text-sm font-medium text-gray-700">Plan:</p>
                <ol class="list-decimal list-inside text-sm text-gray-600">
                  <li v-for="(item, idx) in detailSession.content.outline" :key="idx">{{ item }}</li>
                </ol>
              </div>
            </div>
          </div>

          <!-- Students -->
          <div>
            <h4 class="font-medium mb-3">Étudiants inscrits ({{ (detailSession.enrolled?.length || 0) }}/{{ detailSession.maxStudents || 0 }})</h4>
            <div v-if="detailSession.enrolled?.length" class="grid grid-cols-2 gap-2">
              <div 
                v-for="studentId in detailSession.enrolled" 
                :key="studentId"
                class="bg-gray-50 rounded p-2 text-sm"
              >
                Étudiant #{{ studentId }}
              </div>
            </div>
            <p v-else class="text-sm text-gray-500">Aucun étudiant inscrit pour le moment</p>
          </div>

          <!-- Meeting Link -->
          <div v-if="detailSession.meetingLink">
            <h4 class="font-medium mb-3">Lien de réunion</h4>
            <a 
              :href="detailSession.meetingLink" 
              target="_blank"
              class="text-primary-600 hover:text-primary-800 text-sm underline"
            >
              {{ detailSession.meetingLink }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAdminStore } from '@/stores/admin-supabase'

// Modifier defineEmits pour inclure le nouvel événement
const emit = defineEmits(['changeTab', 'createSession', 'createTeacher'])

const adminStore = useAdminStore()

// Modal state
const detailModal = ref(false)
const detailSession = ref(null)

// Données mockées pour le graphique des revenus
const revenueData = [
  { name: 'Juillet', shortName: 'Juil', value: 12500 },
  { name: 'Août', shortName: 'Août', value: 14200 },
  { name: 'Septembre', shortName: 'Sept', value: 13800 },
  { name: 'Octobre', shortName: 'Oct', value: 15600 },
  { name: 'Novembre', shortName: 'Nov', value: 16200 },
  { name: 'Décembre', shortName: 'Déc', value: 17800 }
]

const maxRevenue = computed(() => Math.max(...revenueData.map(m => m.value)))

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatDate = (dateString) => {
  if (!dateString) return 'Date non définie'
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Date invalide'
  
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getCategoryById = (id) => {
  return adminStore.categories.find(c => c.id === id)
}

const getStudentsByLevel = (level) => {
  return adminStore.users.filter(u => u.level === level).length
}

const getProgressPercentage = (level) => {
  const total = adminStore.users.length
  const levelCount = getStudentsByLevel(level)
  return total > 0 ? Math.round((levelCount / total) * 100) : 0
}

// Session detail modal
const showSessionDetail = (session) => {
  detailSession.value = session
  detailModal.value = true
}

const getTypeLabel = (type) => {
  const labels = {
    'course': 'Cours',
    'grammar': 'Grammaire',
    'conversation': 'Conversation',
    'workshop': 'Atelier'
  }
  return labels[type] || type
}

const createNewSession = () => {
  emit('changeTab', 'sessions')
  // Délai plus long pour laisser le temps à l'onglet de se charger complètement
  setTimeout(() => {
    emit('createSession')
  }, 500) // Augmenté de 300ms à 500ms
}

const createNewTeacher = () => {
  emit('changeTab', 'teachers')
  // Délai plus long pour laisser le temps à l'onglet de se charger complètement
  setTimeout(() => {
    emit('createTeacher')
  }, 500) // Augmenté de 300ms à 500ms
}
</script>