<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Gérez votre abonnement</h1>
        <p class="text-lg text-gray-600">
          Choisissez la formule qui correspond à vos besoins d'apprentissage
        </p>
      </div>

      <!-- Current Status -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">État actuel</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="text-center">
            <p class="text-sm text-gray-600 mb-1">Tokens disponibles</p>
            <p class="text-3xl font-bold text-primary-600">{{ authStore.user?.tokens || 0 }}</p>
          </div>
          <div class="text-center">
            <p class="text-sm text-gray-600 mb-1">Abonnement actuel</p>
            <p class="text-3xl font-bold text-gray-900">{{ currentPlan || 'Aucun' }}</p>
          </div>
          <div class="text-center">
            <p class="text-sm text-gray-600 mb-1">Expire le</p>
            <p class="text-3xl font-bold text-gray-900">{{ expirationDate || '-' }}</p>
          </div>
        </div>
      </div>

      <!-- Subscription Plans -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-center mb-8">Formules d'abonnement</h2>
        <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <!-- 4 months plan -->
          <div class="bg-white rounded-xl shadow-sm p-8 hover:shadow-lg transition-shadow">
            <h3 class="text-2xl font-bold mb-4">Abonnement 4 mois</h3>
            <div class="text-4xl font-bold text-primary-600 mb-4">450€</div>
            <p class="text-gray-600 mb-6">Idéal pour un apprentissage régulier</p>
            <ul class="space-y-3 mb-8">
              <li class="flex items-start">
                <CheckCircleIcon class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>16 sessions incluses (1 par semaine)</span>
              </li>
              <li class="flex items-start">
                <CheckCircleIcon class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>28€ par session</span>
              </li>
              <li class="flex items-start">
                <CheckCircleIcon class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Accès à tous les types de cours</span>
              </li>
              <li class="flex items-start">
                <CheckCircleIcon class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Ressources téléchargeables</span>
              </li>
            </ul>
            <button
              @click="selectPlan('4months')"
              class="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Choisir cette formule
            </button>
          </div>

          <!-- 6 months plan -->
          <div class="bg-white rounded-xl shadow-sm p-8 hover:shadow-lg transition-shadow border-2 border-primary-500 relative">
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span class="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Plus populaire
              </span>
            </div>
            <h3 class="text-2xl font-bold mb-4">Abonnement 6 mois</h3>
            <div class="text-4xl font-bold text-primary-600 mb-4">600€</div>
            <p class="text-gray-600 mb-6">Le meilleur rapport qualité/prix</p>
            <ul class="space-y-3 mb-8">
              <li class="flex items-start">
                <CheckCircleIcon class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>24 sessions incluses (1 par semaine)</span>
              </li>
              <li class="flex items-start">
                <CheckCircleIcon class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>25€ par session</span>
              </li>
              <li class="flex items-start">
                <CheckCircleIcon class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Économisez 72€ (3€/session)</span>
              </li>
              <li class="flex items-start">
                <CheckCircleIcon class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Support prioritaire</span>
              </li>
            </ul>
            <button
              @click="selectPlan('6months')"
              class="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Choisir cette formule
            </button>
          </div>
        </div>
      </div>

      <!-- Token Packages -->
      <div>
        <h2 class="text-2xl font-bold text-center mb-8">Acheter des tokens supplémentaires</h2>
        <p class="text-center text-gray-600 mb-8">
          Besoin de sessions supplémentaires ? Achetez des tokens à l'unité
        </p>
        <div class="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div
            v-for="pack in tokenPackages"
            :key="pack.tokens"
            class="bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow cursor-pointer"
            @click="selectTokenPackage(pack)"
          >
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600 mb-2">{{ pack.tokens }} tokens</div>
              <div class="text-2xl font-semibold mb-4">{{ pack.price }}€</div>
              <div class="text-sm text-gray-600">
                {{ (pack.price / pack.tokens).toFixed(2) }}€ par token
              </div>
              <div v-if="pack.savings" class="mt-2 text-sm text-green-600 font-medium">
                Économisez {{ pack.savings }}€
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Modal -->
      <PaymentModal
        :show="showPaymentModal"
        :amount="selectedAmount"
        :description="paymentDescription"
        @confirm="processPayment"
        @close="showPaymentModal = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { CheckCircle2 as CheckCircleIcon } from 'lucide-vue-next'
import PaymentModal from '@/components/PaymentModal.vue'

const router = useRouter()
const authStore = useAuthStore()

// États
const showPaymentModal = ref(false)
const selectedAmount = ref(0)
const paymentDescription = ref('')
const currentPlan = ref(null)
const expirationDate = ref(null)

// Token packages
const tokenPackages = [
  { tokens: 1, price: 35, savings: 0 },
  { tokens: 5, price: 165, savings: 10 },
  { tokens: 10, price: 320, savings: 30 }
]

// Méthodes
const selectPlan = (plan) => {
  if (plan === '4months') {
    selectedAmount.value = 450
    paymentDescription.value = 'Abonnement 4 mois - 16 sessions'
  } else {
    selectedAmount.value = 600
    paymentDescription.value = 'Abonnement 6 mois - 24 sessions'
  }
  showPaymentModal.value = true
}

const selectTokenPackage = (pack) => {
  selectedAmount.value = pack.price
  paymentDescription.value = `${pack.tokens} tokens`
  showPaymentModal.value = true
}

const processPayment = async () => {
  // Ici, intégrer avec un vrai système de paiement
  console.log('Processing payment:', selectedAmount.value, paymentDescription.value)
  showPaymentModal.value = false
  
  // Rediriger vers le dashboard après le paiement
  router.push('/dashboard')
}
</script> 