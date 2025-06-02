<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Test de niveau gratuit
        </h1>
        <p class="text-xl text-gray-600">
          Évaluez votre niveau d'anglais en 5 minutes
        </p>
      </div>

      <div class="bg-white rounded-xl shadow-lg p-8">
        <LevelTestModal 
          @close="handleClose"
          @completed="handleCompleted"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import LevelTestModal from '@/components/LevelTestModal.vue'

const router = useRouter()

const handleClose = () => {
  router.push('/')
}

const handleCompleted = (result) => {
  router.push({
    name: 'Register',
    query: { testResult: result.level }
  })
}
</script> 