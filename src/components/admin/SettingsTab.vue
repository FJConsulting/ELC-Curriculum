<template>
  <div class="space-y-6">
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

        <!-- Notification Settings -->
        <div>
          <h4 class="text-md font-medium mb-3">Notifications</h4>
          <div class="space-y-3">
            <label class="flex items-center">
              <input type="checkbox" checked class="mr-2">
              <span class="text-sm">Envoyer un rappel 24h avant les sessions</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" checked class="mr-2">
              <span class="text-sm">Notifier les nouveaux utilisateurs inscrits</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" checked class="mr-2">
              <span class="text-sm">Alertes pour les abonnements expirant</span>
            </label>
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
</template>

<script setup>
import { useAdminStore } from '@/stores/admin-supabase'

const adminStore = useAdminStore()
</script> 