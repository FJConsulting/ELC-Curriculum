<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="mx-auto h-12 w-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold">ELC</span>
        </div>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          Créez votre compte
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Ou
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            connectez-vous à votre compte existant
          </router-link>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Nom complet
            </label>
            <input
              id="name"
              name="name"
              type="text"
              v-model="form.name"
              required
              class="input-field mt-1"
              placeholder="Votre nom complet"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Adresse email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              v-model="form.email"
              required
              class="input-field mt-1"
              placeholder="votre@email.com"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              v-model="form.password"
              required
              class="input-field mt-1"
              placeholder="Choisissez un mot de passe"
              minlength="6"
            />
            <p class="mt-1 text-xs text-gray-500">Minimum 6 caractères</p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              v-model="form.confirmPassword"
              required
              class="input-field mt-1"
              placeholder="Confirmez votre mot de passe"
            />
          </div>
        </div>

        <!-- Test result display -->
        <div v-if="testResult" class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <span class="text-2xl">🎯</span>
            </div>
            <div class="ml-3">
              <h4 class="text-sm font-medium text-green-800">
                Test de niveau complété !
              </h4>
              <p class="text-sm text-green-700">
                Votre niveau estimé : <span class="font-bold">{{ testResult }}</span>
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            v-model="form.acceptTerms"
            required
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label for="terms" class="ml-2 block text-sm text-gray-900">
            J'accepte les 
            <a href="#" class="text-primary-600 hover:text-primary-500">conditions d'utilisation</a>
            et la 
            <a href="#" class="text-primary-600 hover:text-primary-500">politique de confidentialité</a>
          </label>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-800 text-sm">{{ error }}</p>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading || !isValidForm"
            class="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="spinner mr-2"></span>
            {{ loading ? 'Inscription...' : 'S\'inscrire et recevoir 3 tokens gratuits' }}
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            Déjà un compte ?
            <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
              Connectez-vous
            </router-link>
          </p>
        </div>
      </form>

      <!-- Benefits -->
      <div class="mt-8 p-4 bg-primary-50 rounded-lg">
        <h4 class="text-sm font-semibold text-primary-800 mb-2">🎁 Avantages de l'inscription :</h4>
        <ul class="text-xs text-primary-700 space-y-1">
          <li>✓ 3 tokens gratuits pour commencer</li>
          <li>✓ Accès à tous les cours adaptés à votre niveau</li>
          <li>✓ Suivi de progression personnalisé</li>
          <li>✓ Support pédagogique inclus</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')
const testResult = ref(route.query.testResult || '')

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const isValidForm = computed(() => {
  return form.name && 
         form.email && 
         form.password && 
         form.confirmPassword &&
         form.password === form.confirmPassword &&
         form.password.length >= 6 &&
         form.acceptTerms
})

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const result = await authStore.register({
      name: form.name,
      email: form.email,
      password: form.password,
      testResult: testResult.value
    })

    if (result.success) {
      router.push('/dashboard')
    } else {
      error.value = result.error || 'Erreur lors de l\'inscription'
    }
  } catch (err) {
    error.value = 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Si l'utilisateur vient du test de niveau, afficher le résultat
  if (testResult.value) {
    console.log('Niveau estimé :', testResult.value)
  }
})
</script> 