<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Administration</h1>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <span class="text-2xl">👥</span>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Étudiants actifs</p>
              <p class="text-2xl font-bold">127</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <span class="text-2xl">📚</span>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Cours ce mois</p>
              <p class="text-2xl font-bold">45</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <span class="text-2xl">🪙</span>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Tokens utilisés</p>
              <p class="text-2xl font-bold">284</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <span class="text-2xl">💰</span>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Revenus</p>
              <p class="text-2xl font-bold">8,450€</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">Gestion des cours</h3>
          <div class="space-y-3">
            <button class="w-full btn-primary py-2 text-left">
              📅 Planifier une session
            </button>
            <button class="w-full btn-secondary py-2 text-left">
              👨‍🏫 Gérer les professeurs
            </button>
            <button class="w-full bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg text-left transition-colors">
              📊 Voir les statistiques
            </button>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">Utilisateurs</h3>
          <div class="space-y-3">
            <button class="w-full btn-primary py-2 text-left">
              👥 Liste des étudiants
            </button>
            <button class="w-full btn-secondary py-2 text-left">
              🎯 Niveaux & Progression
            </button>
            <button class="w-full bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg text-left transition-colors">
              💌 Envoyer un message
            </button>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">Finances</h3>
          <div class="space-y-3">
            <button class="w-full btn-primary py-2 text-left">
              💳 Transactions
            </button>
            <button class="w-full btn-secondary py-2 text-left">
              📈 Rapports mensuels
            </button>
            <button class="w-full bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg text-left transition-colors">
              ⚙️ Paramètres de prix
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Page d'administration basique
</script> 