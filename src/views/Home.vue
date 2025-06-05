<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Apprenez l'anglais <span class="text-primary-500">efficacement</span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Cours collectifs en petits groupes, ateliers de grammaire ciblés et clubs de conversation pour une maîtrise complète de l'anglais.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/test-niveau"
              class="btn-primary"
            >
              Test de niveau gratuit
            </router-link>
            <router-link
              to="/register"
              class="inline-flex items-center px-6 py-3 border border-primary-500 text-base font-medium rounded-lg text-primary-500 bg-white hover:bg-gray-50 transition-colors"
            >
              Commencer maintenant
            </router-link>
          </div>
        </div>
      </div>

      <!-- Background decoration -->
      <div class="absolute inset-0 overflow-hidden -z-10">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-30"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-100 rounded-full opacity-30"></div>
        <div class="absolute top-20 left-1/4 w-32 h-32 bg-accent-yellow-100 rounded-full opacity-40"></div>
        <div class="absolute bottom-20 right-1/4 w-40 h-40 bg-accent-blue-100 rounded-full opacity-40"></div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">Nos formules d'apprentissage</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Cours collectifs -->
          <div class="bg-primary-50 rounded-xl p-8 hover:shadow-lg transition-shadow border border-primary-200">
            <div class="text-4xl mb-4">📚</div>
            <h3 class="text-xl font-semibold mb-3 text-primary-800">Cours collectifs</h3>
            <p class="text-gray-700 mb-4">Sessions en petits groupes de 5 personnes maximum pour un apprentissage personnalisé.</p>
            <router-link to="/courses" class="text-primary-600 font-medium hover:text-primary-700">
              Découvrir →
            </router-link>
          </div>

          <!-- Ateliers grammaire -->
          <div class="bg-secondary-50 rounded-xl p-8 hover:shadow-lg transition-shadow border border-secondary-200">
            <div class="text-4xl mb-4">✏️</div>
            <h3 class="text-xl font-semibold mb-3 text-secondary-800">Ateliers de grammaire</h3>
            <p class="text-gray-700 mb-4">Ateliers ciblés par niveau pour renforcer vos bases grammaticales.</p>
            <router-link to="/grammar-workshops" class="text-secondary-600 font-medium hover:text-secondary-700">
              Découvrir →
            </router-link>
          </div>

          <!-- Club conversation -->
          <div class="bg-accent-yellow-50 rounded-xl p-8 hover:shadow-lg transition-shadow border border-accent-yellow-200">
            <div class="text-4xl mb-4">💬</div>
            <h3 class="text-xl font-semibold mb-3 text-accent-yellow-800">Club de conversation</h3>
            <p class="text-gray-700 mb-4">Pratiquez votre anglais en discutant de l'actualité et de la culture.</p>
            <router-link to="/conversation-club" class="text-accent-yellow-600 font-medium hover:text-accent-yellow-700">
              Découvrir →
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">Tarifs simples et transparents</h2>
        <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <!-- 4 mois -->
          <div class="bg-white rounded-xl shadow-sm p-8 hover:shadow-lg transition-shadow">
            <h3 class="text-2xl font-bold mb-4">Abonnement 4 mois</h3>
            <div class="text-4xl font-bold text-primary-600 mb-4">450€</div>
            <ul class="space-y-3 mb-6">
              <li class="flex items-start">
                <span class="text-green-500 mr-2">✓</span>
                <span>16 sessions incluses</span>
              </li>
              <li class="flex items-start">
                <span class="text-green-500 mr-2">✓</span>
                <span>28€ par session</span>
              </li>
              <li class="flex items-start">
                <span class="text-green-500 mr-2">✓</span>
                <span>Accès à tous les types de cours</span>
              </li>
            </ul>
            <router-link
              to="/register"
              class="block text-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Choisir cette formule
            </router-link>
          </div>

          <!-- 6 mois -->
          <div class="bg-white rounded-xl shadow-sm p-8 hover:shadow-lg transition-shadow border-2 border-primary-500">
            <div class="bg-primary-500 text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
              Plus populaire
            </div>
            <h3 class="text-2xl font-bold mb-4">Abonnement 6 mois</h3>
            <div class="text-4xl font-bold text-primary-600 mb-4">600€</div>
            <ul class="space-y-3 mb-6">
              <li class="flex items-start">
                <span class="text-green-500 mr-2">✓</span>
                <span>24 sessions incluses</span>
              </li>
              <li class="flex items-start">
                <span class="text-green-500 mr-2">✓</span>
                <span>25€ par session</span>
              </li>
              <li class="flex items-start">
                <span class="text-green-500 mr-2">✓</span>
                <span>Économisez 72€</span>
              </li>
            </ul>
            <router-link
              to="/register"
              class="block text-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Choisir cette formule
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-primary-500">
      <div class="max-w-4xl mx-auto text-center px-4">
        <h2 class="text-3xl font-bold text-white mb-4">
          Commencez avec 3 tokens gratuits !
        </h2>
        <p class="text-xl text-white/90 mb-8">
          Inscrivez-vous maintenant et recevez 3 tokens pour essayer nos cours gratuitement.
        </p>
        <router-link
          to="/register"
          class="inline-flex items-center px-8 py-4 bg-white text-primary-500 font-medium rounded-lg hover:bg-gray-100 transition-colors transform hover:scale-105"
        >
          S'inscrire gratuitement
        </router-link>
      </div>
    </section>

    <!-- Level Test Modal -->
    <LevelTestModal
      :show="showTestModal"
      @close="showTestModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LevelTestModal from '@/components/LevelTestModal.vue'

const showTestModal = ref(false)
</script>

<style scoped>
/* Animation for the hero section */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style> 