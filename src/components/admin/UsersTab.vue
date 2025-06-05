<template>
  <div class="space-y-6">
    <!-- Search and Filters -->
    <div class="bg-white rounded-xl shadow-sm p-4">
      <div class="flex flex-col sm:flex-row gap-4">
        <input
          v-model="userSearch"
          type="text"
          placeholder="Rechercher un utilisateur..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
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
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAdminStore } from '@/stores/admin-supabase'

const adminStore = useAdminStore()

const userSearch = ref('')
const userFilter = ref('all')
const selectedUser = ref(null)

const filteredUsers = computed(() => {
  let users = adminStore.users
  
  if (userSearch.value) {
    users = adminStore.searchUsers(userSearch.value)
  }
  
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

const showUserModal = (user) => {
  // TODO: Implement user modal
  console.log('Edit user:', user)
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
</script> 