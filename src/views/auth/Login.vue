<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="mx-auto h-12 w-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold">ELC</span>
        </div>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          Connectez-vous à votre compte
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Ou
          <router-link to="/register" class="font-medium text-primary-600 hover:text-primary-500">
            créez un nouveau compte
          </router-link>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
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
              placeholder="Votre mot de passe"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              v-model="form.remember"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Se souvenir de moi
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
              Mot de passe oublié ?
            </a>
          </div>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-800 text-sm">{{ error }}</p>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="spinner mr-2"></span>
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            Pas encore de compte ?
            <router-link to="/register" class="font-medium text-primary-600 hover:text-primary-500">
              Inscrivez-vous gratuitement
            </router-link>
          </p>
        </div>
      </form>

      <!-- Demo accounts -->
      <div class="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 class="text-sm font-semibold text-blue-800 mb-2">Comptes de démonstration :</h4>
        <div class="text-xs text-blue-700 space-y-1">
          <p><strong>Étudiant :</strong> student@test.com / password</p>
          <p><strong>Admin :</strong> admin@elc.com / password</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const result = await authStore.login({
      email: form.email,
      password: form.password
    })

    if (result.success) {
      router.push('/dashboard')
    } else {
      error.value = result.error || 'Erreur de connexion'
    }
  } catch (err) {
    error.value = 'Une erreur est survenue. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}
</script> 