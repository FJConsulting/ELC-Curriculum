<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Tokens & Abonnements</h1>
      
      <!-- Current Status -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-lg font-semibold mb-4">Mon statut actuel</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span class="text-2xl">🪙</span>
            </div>
            <p class="text-2xl font-bold text-gray-900">{{ authStore.userTokens }}</p>
            <p class="text-sm text-gray-600">Tokens disponibles</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span class="text-2xl">📅</span>
            </div>
            <p class="text-lg font-bold text-gray-900">
              {{ authStore.isSubscribed ? 'Actif' : 'Aucun' }}
            </p>
            <p class="text-sm text-gray-600">Abonnement</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span class="text-2xl">📈</span>
            </div>
            <p class="text-lg font-bold text-gray-900">{{ authStore.userLevel }}</p>
            <p class="text-sm text-gray-600">Niveau actuel</p>
          </div>
        </div>
      </div>

      <!-- Purchase Options -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Token Pack -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-xl font-semibold mb-4">Pack Découverte</h3>
          <div class="text-center mb-6">
            <div class="text-3xl font-bold text-primary-600">35€</div>
            <div class="text-gray-500">1 token</div>
          </div>
          <ul class="space-y-2 mb-6">
            <li class="flex items-center text-sm">
              <span class="text-green-500 mr-2">✓</span>
              1 cours au choix
            </li>
            <li class="flex items-center text-sm">
              <span class="text-green-500 mr-2">✓</span>
              Accès aux supports
            </li>
            <li class="flex items-center text-sm">
              <span class="text-green-500 mr-2">✓</span>
              Annulation gratuite
            </li>
          </ul>
          <button class="w-full btn-primary py-3">
            Acheter
          </button>
        </div>

        <!-- 4-month subscription -->
        <div class="bg-white rounded-lg shadow p-6 border-2 border-primary-500 relative">
          <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span class="bg-primary-500 text-white px-3 py-1 rounded-full text-sm">
              Populaire
            </span>
          </div>
          <h3 class="text-xl font-semibold mb-4">Abonnement 4 mois</h3>
          <div class="text-center mb-6">
            <div class="text-3xl font-bold text-primary-600">120€</div>
            <div class="text-gray-500">par mois (4 tokens)</div>
          </div>
          <ul class="space-y-2 mb-6">
            <li class="flex items-center text-sm">
              <span class="text-green-500 mr-2">✓</span>
              4 cours par mois
            </li>
            <li class="flex items-center text-sm">
              <span class="text-green-500 mr-2">✓</span>
              3 tokens bonus
            </li>
            <li class="flex items-center text-sm">
              <span class="text-green-500 mr-2">✓</span>
              Accès prioritaire
            </li>
            <li class="flex items-center text-sm">
              <span class="text-green-500 mr-2">✓</span>
              Économie de 20%
            </li>
          </ul>
          <button 
            @click="activateSubscription('4-month')"
            class="w-full btn-primary py-3"
          >
            S'abonner
          </button>
        </div>

        <!-- 6-month subscription -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-xl font-semibold mb-4">Abonnement 6 mois</h3>
          <div class="text-center mb-6">
            <div class="text-3xl font-bold text-primary-600">100€</div>
            <div class="text-gray-500">par mois (4 tokens)</div>
          </div>
          <ul class="space-y-2 mb-6">
            <li class="flex items-center text-sm">
              <span class="text-green-500 mr-2">✓</span>
              4 cours par mois
            </li>
            <li class="flex items-center text-sm">
              <span class="text-green-500 mr-2">✓</span>
              3 tokens bonus
            </li>
            <li class="flex items-center text-sm">
              <span class="text-green-500 mr-2">✓</span>
              Économie de 30%
            </li>
          </ul>
          <button 
            @click="activateSubscription('6-month')"
            class="w-full btn-primary py-3"
          >
            S'abonner
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const activateSubscription = (plan) => {
  if (authStore.activateSubscription(plan)) {
    alert(`Abonnement ${plan} activé avec succès ! Vous avez reçu 3 tokens bonus.`)
  }
}
</script> 