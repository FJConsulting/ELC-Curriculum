<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6">Connexion</h2>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
        </div>
        
        <button
          type="submit"
          class="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
        >
          Se connecter
        </button>
      </form>
      
      <p class="text-center mt-4 text-sm text-gray-600">
        Pas encore de compte ?
        <router-link to="/register" class="text-primary-600 hover:text-primary-700">
          S'inscrire
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    await authStore.login({
      email: email.value,
      password: password.value
    })
    router.push('/dashboard')
  } catch (error) {
    alert('Erreur de connexion')
  }
}
</script> 