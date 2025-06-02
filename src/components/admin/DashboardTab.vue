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
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p class="text-gray-500">Graphique des revenus (Chart.js à intégrer)</p>
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
          <a href="#" class="text-sm text-primary-600 hover:text-primary-800">Voir tout</a>
        </div>
        <div class="space-y-3">
          <div 
            v-for="session in adminStore.upcomingSessions.slice(0, 5)" 
            :key="session.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div class="flex items-center">
              <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-sm">{{ getCategoryById(session.categoryId)?.icon }}</span>
              </div>
              <div>
                <p class="font-medium">{{ session.name }}</p>
                <p class="text-sm text-gray-600">
                  {{ formatDate(session.dateTime) }} • {{ session.teacher }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-sm font-medium">{{ session.enrolled.length }}/{{ session.maxStudents }}</span>
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
          <button class="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between">
            <span class="text-sm font-medium">Créer une session</span>
            <span>➕</span>
          </button>
          <button class="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between">
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
            v-for="(student, index) in adminStore.getTopStudents(5)" 
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
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
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
</script> 