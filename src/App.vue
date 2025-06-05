<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Barre de navigation -->
    <Navbar />
    
    <!-- Contenu principal -->
    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <Footer v-if="!hideFooter" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'

const route = useRoute()
const authStore = useAuthStore()

// Masquer le footer sur certaines pages
const hideFooter = computed(() => {
  const hideOn = ['/admin', '/test-niveau']
  return hideOn.some(path => route.path.startsWith(path))
})

onMounted(() => {
  // Initialiser l'authentification
  authStore.initAuth()
})
</script>

<style scoped>
/* Transitions entre les pages */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 