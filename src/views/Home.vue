<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute top-10 left-10 w-20 h-20 bg-primary-500 rounded-full animate-bounce-light"></div>
        <div class="absolute bottom-20 right-20 w-16 h-16 bg-secondary-500 rounded-full animate-bounce-light" style="animation-delay: 1s"></div>
        <div class="absolute top-1/2 left-1/4 w-12 h-12 bg-primary-300 rounded-full animate-bounce-light" style="animation-delay: 2s"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Maîtrisez l'anglais avec
            <span class="gradient-text block">ELC Academy</span>
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Cours collectifs, ateliers de grammaire et club de conversation adaptés à votre niveau. 
            Apprenez avec des groupes de 5 personnes maximum.
          </p>
          
          <!-- CTA Principal -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              @click="startLevelTest" 
              class="btn-primary px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-200"
            >
              🎯 Testez votre niveau gratuitement
            </button>
            <router-link 
              to="/register" 
              class="btn-secondary px-8 py-4 text-lg font-semibold"
            >
              S'inscrire maintenant
            </router-link>
          </div>

          <!-- Social proof -->
          <div class="flex items-center justify-center space-x-8 text-gray-500">
            <div class="text-center">
              <div class="text-2xl font-bold text-primary-600">500+</div>
              <div class="text-sm">Étudiants actifs</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-primary-600">95%</div>
              <div class="text-sm">Satisfaction</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-primary-600">4.8/5</div>
              <div class="text-sm">Note moyenne</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pourquoi choisir ELC Academy ?
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Une méthode d'apprentissage innovante avec un suivi personnalisé
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="card p-8 text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl">👥</span>
            </div>
            <h3 class="text-xl font-semibold mb-4">Cours collectifs limités</h3>
            <p class="text-gray-600">
              Maximum 5 personnes par cours pour un apprentissage optimal et une attention personnalisée
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="card p-8 text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl">📚</span>
            </div>
            <h3 class="text-xl font-semibold mb-4">Ateliers de grammaire</h3>
            <p class="text-gray-600">
              Ateliers structurés par niveau (A1 → B2+) pour maîtriser toutes les règles grammaticales
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="card p-8 text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl">💬</span>
            </div>
            <h3 class="text-xl font-semibold mb-4">Club de conversation</h3>
            <p class="text-gray-600">
              Débattez de l'actualité en anglais et améliorez votre expression orale en situation réelle
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="card p-8 text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl">🎯</span>
            </div>
            <h3 class="text-xl font-semibold mb-4">Progression structurée</h3>
            <p class="text-gray-600">
              Cycle de 20 leçons par niveau avec tests de progression et déblocage automatique
            </p>
          </div>

          <!-- Feature 5 -->
          <div class="card p-8 text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl">⏰</span>
            </div>
            <h3 class="text-xl font-semibold mb-4">Flexibilité totale</h3>
            <p class="text-gray-600">
              Réservez vos cours selon votre planning, annulation gratuite, rattrapage possible
            </p>
          </div>

          <!-- Feature 6 -->
          <div class="card p-8 text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl">🏆</span>
            </div>
            <h3 class="text-xl font-semibold mb-4">Professeurs qualifiés</h3>
            <p class="text-gray-600">
              Enseignants natifs et certifiés, spécialisés dans l'enseignement en ligne
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p class="text-xl text-gray-600">
            Commencez votre apprentissage en 3 étapes simples
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Step 1 -->
          <div class="text-center">
            <div class="relative mb-8">
              <div class="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                1
              </div>
              <div class="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gray-300 -z-10"></div>
            </div>
            <h3 class="text-xl font-semibold mb-4">Testez votre niveau</h3>
            <p class="text-gray-600">
              Passez notre test gratuit de 5 minutes pour évaluer votre niveau actuel en anglais
            </p>
          </div>

          <!-- Step 2 -->
          <div class="text-center">
            <div class="relative mb-8">
              <div class="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                2
              </div>
              <div class="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gray-300 -z-10"></div>
            </div>
            <h3 class="text-xl font-semibold mb-4">Choisissez votre formule</h3>
            <p class="text-gray-600">
              Abonnement ou packs de tokens selon vos besoins. 3 tokens gratuits à l'inscription !
            </p>
          </div>

          <!-- Step 3 -->
          <div class="text-center">
            <div class="relative mb-8">
              <div class="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                3
              </div>
            </div>
            <h3 class="text-xl font-semibold mb-4">Réservez vos cours</h3>
            <p class="text-gray-600">
              Accédez à votre tableau de bord et réservez vos premiers cours adaptés à votre niveau
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tarifs transparents
          </h2>
          <p class="text-xl text-gray-600">
            Choisissez la formule qui vous convient
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Pack à l'unité -->
          <div class="card p-8">
            <div class="text-center mb-6">
              <h3 class="text-2xl font-bold mb-2">Pack Découverte</h3>
              <div class="text-4xl font-bold text-primary-600 mb-2">35€</div>
              <div class="text-gray-500">par cours (1 token)</div>
            </div>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                1 séance au choix
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                Accès aux supports
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                Annulation gratuite
              </li>
            </ul>
            <button class="w-full btn-primary py-3" @click="$router.push('/register')">
              Commencer
            </button>
          </div>

          <!-- Abonnement 4 mois -->
          <div class="card p-8 border-2 border-primary-500 relative">
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span class="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Le plus populaire
              </span>
            </div>
            <div class="text-center mb-6">
              <h3 class="text-2xl font-bold mb-2">Abonnement 4 mois</h3>
              <div class="text-4xl font-bold text-primary-600 mb-2">120€</div>
              <div class="text-gray-500">par mois (4 tokens)</div>
            </div>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                4 cours par mois
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                3 tokens bonus à l'inscription
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                Accès prioritaire aux créneaux
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                Support pédagogique inclus
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                <span class="text-primary-600 font-medium">Économie de 20%</span>
              </li>
            </ul>
            <button class="w-full btn-primary py-3" @click="$router.push('/register')">
              S'abonner
            </button>
          </div>

          <!-- Abonnement 6 mois -->
          <div class="card p-8">
            <div class="text-center mb-6">
              <h3 class="text-2xl font-bold mb-2">Abonnement 6 mois</h3>
              <div class="text-4xl font-bold text-primary-600 mb-2">100€</div>
              <div class="text-gray-500">par mois (4 tokens)</div>
            </div>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                4 cours par mois
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                3 tokens bonus à l'inscription
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                Test de niveau gratuit
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                Accès prioritaire
              </li>
              <li class="flex items-center">
                <span class="text-green-500 mr-2">✓</span>
                <span class="text-primary-600 font-medium">Économie de 30%</span>
              </li>
            </ul>
            <button class="w-full btn-primary py-3" @click="$router.push('/register')">
              S'abonner
            </button>
          </div>
        </div>

        <div class="text-center mt-12">
          <p class="text-gray-600 mb-4">
            Tous nos tarifs incluent l'accès aux supports pédagogiques et aux ressources en ligne
          </p>
          <button 
            @click="startLevelTest" 
            class="text-primary-600 hover:text-primary-700 font-medium"
          >
            Commencer par le test gratuit →
          </button>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ce que disent nos étudiants
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="card p-6">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                M
              </div>
              <div class="ml-4">
                <div class="font-semibold">Marie L.</div>
                <div class="text-sm text-gray-500">Niveau B2</div>
              </div>
            </div>
            <p class="text-gray-600 italic">
              "Les cours en petits groupes sont parfaits ! J'ai progressé plus en 3 mois qu'en 2 ans d'apprentissage traditionnel."
            </p>
            <div class="flex mt-4 text-yellow-400">
              ⭐⭐⭐⭐⭐
            </div>
          </div>

          <div class="card p-6">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                J
              </div>
              <div class="ml-4">
                <div class="font-semibold">Julien M.</div>
                <div class="text-sm text-gray-500">Niveau B1</div>
              </div>
            </div>
            <p class="text-gray-600 italic">
              "Le club de conversation m'a donné confiance en moi. Je peux maintenant participer aux réunions en anglais au travail !"
            </p>
            <div class="flex mt-4 text-yellow-400">
              ⭐⭐⭐⭐⭐
            </div>
          </div>

          <div class="card p-6">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                S
              </div>
              <div class="ml-4">
                <div class="font-semibold">Sophie R.</div>
                <div class="text-sm text-gray-500">Niveau A2</div>
              </div>
            </div>
            <p class="text-gray-600 italic">
              "Les ateliers de grammaire sont très bien structurés. Enfin j'ai compris les temps anglais !"
            </p>
            <div class="flex mt-4 text-yellow-400">
              ⭐⭐⭐⭐⭐
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
          Prêt à transformer votre anglais ?
        </h2>
        <p class="text-xl text-primary-100 mb-8">
          Rejoignez plus de 500 étudiants qui progressent chaque jour avec ELC Academy
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            @click="startLevelTest" 
            class="bg-white text-primary-600 hover:bg-gray-50 font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            Tester mon niveau gratuitement
          </button>
          <router-link 
            to="/register" 
            class="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            S'inscrire maintenant
          </router-link>
        </div>
      </div>
    </section>

    <!-- Level Test Modal -->
    <LevelTestModal 
      v-if="showLevelTest" 
      @close="showLevelTest = false"
      @completed="handleTestCompleted"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LevelTestModal from '@/components/LevelTestModal.vue'

const router = useRouter()
const showLevelTest = ref(false)

const startLevelTest = () => {
  showLevelTest.value = true
}

const handleTestCompleted = (result) => {
  showLevelTest.value = false
  // Rediriger vers l'inscription avec le résultat
  router.push({
    name: 'Register',
    query: { testResult: result.level }
  })
}
</script>

<style scoped>
/* Animations personnalisées pour la landing page */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style> 