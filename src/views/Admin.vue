<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <h1 class="text-2xl font-bold text-gray-900">Administration ELC Academy</h1>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">
              Dernière mise à jour : {{ lastUpdate }}
            </span>
            <button 
              @click="refreshData"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
              :disabled="adminStore.loading"
            >
              <span v-if="!adminStore.loading">🔄 Actualiser</span>
              <span v-else>⏳ Chargement...</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
            ]"
          >
            <span class="mr-2">{{ tab.icon }}</span>
            {{ tab.name }}
            <span v-if="tab.badge" class="ml-2 px-2 py-1 text-xs rounded-full bg-red-100 text-red-600">
              {{ tab.badge }}
            </span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Dashboard Tab -->
      <div v-if="activeTab === 'dashboard'" class="space-y-6">
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

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Upcoming Sessions -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold mb-4">Prochaines sessions</h3>
            <div class="space-y-3">
              <div 
                v-for="session in adminStore.upcomingSessions.slice(0, 5)" 
                :key="session.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p class="font-medium">{{ session.name }}</p>
                  <p class="text-sm text-gray-600">
                    {{ formatDate(session.dateTime) }} - {{ session.teacher }}
                  </p>
                </div>
                <div class="text-right">
                  <span class="text-sm font-medium">{{ session.enrolled.length }}/{{ session.maxStudents }}</span>
                  <p class="text-xs text-gray-500">inscrits</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Top Students -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold mb-4">Top étudiants</h3>
            <div class="space-y-3">
              <div 
                v-for="student in adminStore.getTopStudents(5)" 
                :key="student.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span class="text-sm font-medium">{{ student.name.charAt(0) }}</span>
                  </div>
                  <div>
                    <p class="font-medium">{{ student.name }}</p>
                    <p class="text-sm text-gray-600">{{ student.level }} - {{ student.totalSessions }} sessions</p>
                  </div>
                </div>
                <span class="text-sm font-medium">{{ formatCurrency(student.totalSpent) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Tab -->
      <div v-if="activeTab === 'users'" class="space-y-6">
        <!-- Search and Filters -->
        <div class="bg-white rounded-xl shadow-sm p-4">
          <div class="flex flex-col sm:flex-row gap-4">
            <input
              v-model="userSearch"
              type="text"
              placeholder="Rechercher un utilisateur..."
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
            <select 
              v-model="userFilter"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Tous les utilisateurs</option>
              <option value="active">Actifs</option>
              <option value="suspended">Suspendus</option>
              <option value="subscribed">Abonnés</option>
            </select>
            <button 
              @click="adminStore.exportData('users')"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              📥 Exporter CSV
            </button>
          </div>
        </div>

        <!-- Users Table -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Niveau
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tokens
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Abonnement
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th class="relative px-6 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span class="text-sm font-medium">{{ user.name.charAt(0) }}</span>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                      <div class="text-sm text-gray-500">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                    {{ user.level }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ user.tokens }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="user.subscription" class="text-sm text-gray-900">
                    {{ user.subscription.type === '4-months' ? '4 mois' : '6 mois' }}
                  </span>
                  <span v-else class="text-sm text-gray-500">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    :class="[
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                    ]"
                  >
                    {{ user.status === 'active' ? 'Actif' : 'Suspendu' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    @click="showUserModal(user)"
                    class="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    Modifier
                  </button>
                  <button 
                    @click="toggleUserStatus(user)"
                    :class="user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                  >
                    {{ user.status === 'active' ? 'Suspendre' : 'Activer' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Sessions Tab -->
      <div v-if="activeTab === 'sessions'" class="space-y-6">
        <!-- Create Session Button -->
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Gestion des sessions</h2>
          <button 
            @click="showSessionModal()"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            ➕ Nouvelle session
          </button>
        </div>

        <!-- Sessions Calendar View -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="session in adminStore.sessions.slice(0, 12)" 
              :key="session.id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-medium">{{ session.name }}</h4>
                <span 
                  :class="[
                    session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    session.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800',
                    'px-2 py-1 text-xs rounded-full font-medium'
                  ]"
                >
                  {{ getStatusLabel(session.status) }}
                </span>
              </div>
              <p class="text-sm text-gray-600 mb-1">{{ formatDate(session.dateTime) }}</p>
              <p class="text-sm text-gray-600 mb-2">Prof: {{ session.teacher }}</p>
              <div class="flex justify-between items-center">
                <span class="text-sm">
                  <span class="font-medium">{{ session.enrolled.length }}</span>/{{ session.maxStudents }} inscrits
                </span>
                <div class="space-x-2">
                  <button 
                    @click="showSessionModal(session)"
                    class="text-primary-600 hover:text-primary-800 text-sm"
                  >
                    Modifier
                  </button>
                  <button 
                    v-if="session.status === 'scheduled'"
                    @click="cancelSession(session)"
                    class="text-red-600 hover:text-red-800 text-sm"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Finance Tab -->
      <div v-if="activeTab === 'finance'" class="space-y-6">
        <!-- Revenue Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-sm font-medium text-gray-600">Revenus cette semaine</h3>
            <p class="text-2xl font-bold mt-2">{{ formatCurrency(adminStore.getRevenueByPeriod('week')) }}</p>
          </div>
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-sm font-medium text-gray-600">Revenus ce mois</h3>
            <p class="text-2xl font-bold mt-2">{{ formatCurrency(adminStore.getRevenueByPeriod('month')) }}</p>
          </div>
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-sm font-medium text-gray-600">Revenus cette année</h3>
            <p class="text-2xl font-bold mt-2">{{ formatCurrency(adminStore.getRevenueByPeriod('year')) }}</p>
          </div>
        </div>

        <!-- Transactions Table -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold">Dernières transactions</h3>
          </div>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="transaction in adminStore.transactions.slice(0, 20)" :key="transaction.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(transaction.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  User #{{ transaction.userId }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    :class="[
                      transaction.type === 'token' ? 'bg-blue-100 text-blue-800' :
                      transaction.type === 'subscription' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800',
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                    ]"
                  >
                    {{ getTransactionTypeLabel(transaction.type) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ transaction.description }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {{ transaction.amount > 0 ? formatCurrency(transaction.amount) : '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings'" class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-4">Paramètres de l'académie</h3>
          
          <div class="space-y-6">
            <!-- Pricing Settings -->
            <div>
              <h4 class="text-md font-medium mb-3">Tarification</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Prix par token</label>
                  <input 
                    type="number" 
                    value="35"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tokens gratuits à l'inscription</label>
                  <input 
                    type="number" 
                    value="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                </div>
              </div>
            </div>

            <!-- Course Settings -->
            <div>
              <h4 class="text-md font-medium mb-3">Paramètres des cours</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nombre max d'étudiants par cours</label>
                  <input 
                    type="number" 
                    value="5"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Durée par défaut (minutes)</label>
                  <input 
                    type="number" 
                    value="60"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                </div>
              </div>
            </div>

            <!-- Save Button -->
            <div class="pt-4">
              <button class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                💾 Enregistrer les paramètres
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User Modal -->
    <div v-if="selectedUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-lg w-full p-6">
        <h3 class="text-xl font-semibold mb-4">Modifier l'utilisateur</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input 
              v-model="selectedUser.name"
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              v-model="selectedUser.email"
              type="email" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
            <select 
              v-model="selectedUser.level"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tokens</label>
            <div class="flex space-x-2">
              <input 
                v-model.number="selectedUser.tokens"
                type="number" 
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
              <button 
                @click="addTokens(5)"
                class="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
              >
                +5
              </button>
              <button 
                @click="addTokens(10)"
                class="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
              >
                +10
              </button>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button 
            @click="selectedUser = null"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            @click="saveUser"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>

    <!-- Session Modal -->
    <div v-if="sessionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-lg w-full p-6">
        <h3 class="text-xl font-semibold mb-4">
          {{ editingSession ? 'Modifier la session' : 'Nouvelle session' }}
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom de la session</label>
            <input 
              v-model="sessionForm.name"
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select 
              v-model="sessionForm.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="course">Cours collectif</option>
              <option value="grammar">Atelier grammaire</option>
              <option value="conversation">Club conversation</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Professeur</label>
            <select 
              v-model="sessionForm.teacher"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="Sarah Johnson">Sarah Johnson</option>
              <option value="Mike Wilson">Mike Wilson</option>
              <option value="Emma Davis">Emma Davis</option>
              <option value="David Brown">David Brown</option>
            </select>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                v-model="sessionForm.date"
                type="date" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Heure</label>
              <input 
                v-model="sessionForm.time"
                type="time" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
            <select 
              v-model="sessionForm.level"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
            </select>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button 
            @click="closeSessionModal"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            @click="saveSession"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {{ editingSession ? 'Mettre à jour' : 'Créer' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()

// État local
const activeTab = ref('dashboard')
const userSearch = ref('')
const userFilter = ref('all')
const selectedUser = ref(null)
const sessionModal = ref(false)
const editingSession = ref(null)
const sessionForm = ref({
  name: '',
  type: 'course',
  teacher: 'Sarah Johnson',
  date: '',
  time: '',
  level: 'B1'
})

// Tabs configuration
const tabs = [
  { id: 'dashboard', name: 'Tableau de bord', icon: '📊' },
  { id: 'users', name: 'Utilisateurs', icon: '👥', badge: adminStore.activeUsers.length },
  { id: 'sessions', name: 'Sessions', icon: '📅' },
  { id: 'finance', name: 'Finances', icon: '💰' },
  { id: 'settings', name: 'Paramètres', icon: '⚙️' }
]

// Computed
const lastUpdate = computed(() => {
  return new Date().toLocaleString('fr-FR')
})

const filteredUsers = computed(() => {
  let users = adminStore.users
  
  // Apply search
  if (userSearch.value) {
    users = adminStore.searchUsers(userSearch.value)
  }
  
  // Apply filter
  switch (userFilter.value) {
    case 'active':
      users = users.filter(u => u.status === 'active')
      break
    case 'suspended':
      users = users.filter(u => u.status === 'suspended')
      break
    case 'subscribed':
      users = users.filter(u => u.subscription !== null)
      break
  }
  
  return users
})

// Methods
const refreshData = async () => {
  await adminStore.loadAdminData()
}

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

const getStatusLabel = (status) => {
  const labels = {
    'scheduled': 'Planifiée',
    'completed': 'Terminée',
    'cancelled': 'Annulée'
  }
  return labels[status] || status
}

const getTransactionTypeLabel = (type) => {
  const labels = {
    'token': 'Achat tokens',
    'subscription': 'Abonnement',
    'token_used': 'Utilisation'
  }
  return labels[type] || type
}

const showUserModal = (user) => {
  selectedUser.value = { ...user }
}

const toggleUserStatus = (user) => {
  if (user.status === 'active') {
    if (confirm(`Êtes-vous sûr de vouloir suspendre ${user.name} ?`)) {
      adminStore.suspendUser(user.id)
    }
  } else {
    adminStore.activateUser(user.id)
  }
}

const addTokens = (amount) => {
  selectedUser.value.tokens += amount
}

const saveUser = () => {
  adminStore.updateUser(selectedUser.value.id, selectedUser.value)
  selectedUser.value = null
}

const showSessionModal = (session = null) => {
  if (session) {
    editingSession.value = session
    const date = new Date(session.dateTime)
    sessionForm.value = {
      name: session.name,
      type: session.type,
      teacher: session.teacher,
      date: date.toISOString().split('T')[0],
      time: date.toTimeString().slice(0, 5),
      level: session.level
    }
  } else {
    editingSession.value = null
    sessionForm.value = {
      name: '',
      type: 'course',
      teacher: 'Sarah Johnson',
      date: '',
      time: '',
      level: 'B1'
    }
  }
  sessionModal.value = true
}

const closeSessionModal = () => {
  sessionModal.value = false
  editingSession.value = null
}

const saveSession = () => {
  const dateTime = new Date(`${sessionForm.value.date}T${sessionForm.value.time}`)
  
  if (editingSession.value) {
    adminStore.updateSession(editingSession.value.id, {
      ...sessionForm.value,
      dateTime: dateTime.toISOString()
    })
  } else {
    adminStore.createSession({
      ...sessionForm.value,
      dateTime: dateTime.toISOString()
    })
  }
  
  closeSessionModal()
}

const cancelSession = (session) => {
  const reason = prompt('Raison de l\'annulation ?')
  if (reason) {
    adminStore.cancelSession(session.id, reason)
  }
}

// Lifecycle
onMounted(() => {
  refreshData()
})
</script>

<style scoped>
/* Custom scrollbar for tables */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style> 