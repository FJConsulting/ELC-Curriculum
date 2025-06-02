<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Mon profil</h1>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Informations personnelles</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <p class="text-gray-900">{{ authStore.user?.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p class="text-gray-900">{{ authStore.user?.email }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Niveau actuel</label>
            <span class="level-badge">{{ authStore.userLevel }}</span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Membre depuis</label>
            <p class="text-gray-900">{{ formatDate(authStore.user?.joinedAt) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('fr-FR')
}
</script> 