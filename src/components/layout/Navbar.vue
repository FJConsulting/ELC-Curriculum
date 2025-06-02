<template>
  <nav class="bg-white shadow-sm sticky top-0 z-40 backdrop-blur-lg bg-opacity-95 border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-3 group">
            <div class="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <span class="text-white font-bold text-lg">ELC</span>
            </div>
            <h1 class="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              ELC Academy
            </h1>
          </router-link>
        </div>

        <!-- Navigation principale (desktop) -->
        <div class="hidden md:flex items-center space-x-6">
          <template v-if="!authStore.isAuthenticated">
            <router-link to="/" class="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Accueil
            </router-link>
            <router-link to="/test-niveau" class="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Test gratuit
            </router-link>
            <a href="#features" class="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Nos cours
            </a>
            <a href="#pricing" class="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Tarifs
            </a>
          </template>
          
          <template v-else>
            <router-link to="/dashboard" class="text-gray-600 hover:text-primary-600 transition-colors font-medium">
              Tableau de bord
            </router-link>
            <div class="relative" ref="coursesDropdown">
              <button 
                @click="showCoursesMenu = !showCoursesMenu"
                class="flex items-center text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                Formations
                <span class="w-4 h-4 ml-1">⌄</span>
              </button>
              <transition name="fade">
                <div v-if="showCoursesMenu" class="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 backdrop-blur-lg bg-opacity-95">
                  <router-link 
                    to="/cours" 
                    class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    @click="showCoursesMenu = false"
                  >
                    <span class="text-lg mr-3">📚</span>
                    <div>
                      <div class="font-medium">Cours collectifs</div>
                      <div class="text-xs text-gray-500">Groupes de 5 personnes max</div>
                    </div>
                  </router-link>
                  <router-link 
                    to="/ateliers-grammaire" 
                    class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    @click="showCoursesMenu = false"
                  >
                    <span class="text-lg mr-3">✏️</span>
                    <div>
                      <div class="font-medium">Ateliers grammaire</div>
                      <div class="text-xs text-gray-500">Par niveau (A1 → B2+)</div>
                    </div>
                  </router-link>
                  <router-link 
                    to="/club-conversation" 
                    class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    @click="showCoursesMenu = false"
                  >
                    <span class="text-lg mr-3">💬</span>
                    <div>
                      <div class="font-medium">Club conversation</div>
                      <div class="text-xs text-gray-500">Débats sur l'actualité</div>
                    </div>
                  </router-link>
                  <div class="border-t border-gray-100 my-2"></div>
                  <router-link 
                    to="/evaluations" 
                    class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    @click="showCoursesMenu = false"
                  >
                    <span class="text-lg mr-3">🎓</span>
                    <div>
                      <div class="font-medium">Évaluations</div>
                      <div class="text-xs text-gray-500">Validez vos niveaux</div>
                    </div>
                  </router-link>
                </div>
              </transition>
            </div>
            <router-link 
              v-if="authStore.isAdmin" 
              to="/admin" 
              class="text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              Admin
            </router-link>
          </template>
        </div>

        <!-- Actions utilisateur -->
        <div class="flex items-center space-x-4">
          <!-- Tokens (si connecté) -->
          <div v-if="authStore.isAuthenticated" class="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg px-3 py-2 border border-yellow-200">
            <div class="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <span class="text-white text-xs font-bold">T</span>
            </div>
            <span class="text-sm font-semibold text-gray-800">{{ authStore.userTokens }}</span>
          </div>

          <!-- Notifications (si connecté) -->
          <button 
            v-if="authStore.isAuthenticated"
            @click="showNotifications = !showNotifications"
            class="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
          >
            <span class="text-lg">🔔</span>
            <span v-if="unreadNotifications > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {{ unreadNotifications }}
            </span>
          </button>

          <!-- Menu utilisateur (si connecté) -->
          <div v-if="authStore.isAuthenticated" class="relative" ref="userDropdown">
            <button 
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 text-sm rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 p-2 hover:from-gray-100 hover:to-gray-200 transition-all border border-gray-200"
            >
              <div class="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span class="text-white font-medium text-sm">
                  {{ authStore.user?.name?.charAt(0).toUpperCase() }}
                </span>
              </div>
              <span class="hidden md:block text-gray-700 font-medium">{{ authStore.user?.name }}</span>
              <span class="w-4 h-4 text-gray-500">⌄</span>
            </button>
            
            <transition name="fade">
              <div v-if="showUserMenu" class="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 backdrop-blur-lg bg-opacity-95">
                <div class="px-4 py-3 border-b border-gray-100">
                  <p class="text-sm font-semibold text-gray-900">{{ authStore.user?.name }}</p>
                  <p class="text-sm text-gray-500">{{ authStore.user?.email }}</p>
                  <div class="flex items-center mt-2 space-x-2">
                    <span class="px-3 py-1 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-800 rounded-full text-xs font-medium">
                      {{ authStore.userLevel }}
                    </span>
                    <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      {{ authStore.userTokens }} tokens
                    </span>
                  </div>
                </div>
                
                <router-link 
                  to="/dashboard" 
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  @click="showUserMenu = false"
                >
                  <span class="text-lg mr-3">🏠</span>
                  Tableau de bord
                </router-link>
                
                <router-link 
                  to="/profil" 
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  @click="showUserMenu = false"
                >
                  <span class="text-lg mr-3">👤</span>
                  Mon profil
                </router-link>
                
                <router-link 
                  to="/abonnement" 
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  @click="showUserMenu = false"
                >
                  <span class="text-lg mr-3">💳</span>
                  Abonnement & Tokens
                </router-link>
                
                <div class="border-t border-gray-100 mt-2 pt-2">
                  <button 
                    @click="handleLogout"
                    class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <span class="text-lg mr-3">🚪</span>
                    Se déconnecter
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <!-- Boutons auth (si non connecté) -->
          <template v-else>
            <router-link 
              to="/login" 
              class="text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Se connecter
            </router-link>
            <router-link 
              to="/register" 
              class="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-5 py-2 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              S'inscrire
            </router-link>
          </template>

          <!-- Menu mobile -->
          <button 
            @click="showMobileMenu = !showMobileMenu"
            class="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
          >
            <span class="text-lg">{{ showMobileMenu ? '✕' : '☰' }}</span>
          </button>
        </div>
      </div>

      <!-- Menu mobile -->
      <transition name="slide">
        <div v-if="showMobileMenu" class="md:hidden border-t border-gray-100 py-4 bg-white">
          <div class="space-y-2 px-2">
            <template v-if="!authStore.isAuthenticated">
              <router-link 
                to="/" 
                class="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                @click="showMobileMenu = false"
              >
                Accueil
              </router-link>
              <router-link 
                to="/test-niveau" 
                class="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                @click="showMobileMenu = false"
              >
                Test gratuit
              </router-link>
            </template>
            
            <template v-else>
              <router-link 
                to="/dashboard" 
                class="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                @click="showMobileMenu = false"
              >
                Tableau de bord
              </router-link>
              <router-link 
                to="/cours" 
                class="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                @click="showMobileMenu = false"
              >
                Cours collectifs
              </router-link>
              <router-link 
                to="/ateliers-grammaire" 
                class="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                @click="showMobileMenu = false"
              >
                Ateliers grammaire
              </router-link>
              <router-link 
                to="/club-conversation" 
                class="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                @click="showMobileMenu = false"
              >
                Club conversation
              </router-link>
              <router-link 
                to="/evaluations" 
                class="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                @click="showMobileMenu = false"
              >
                Évaluations
              </router-link>
              <router-link 
                to="/profil" 
                class="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                @click="showMobileMenu = false"
              >
                Mon profil
              </router-link>
              <router-link 
                to="/abonnement" 
                class="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                @click="showMobileMenu = false"
              >
                Tokens & Abonnement
              </router-link>
              
              <!-- Tokens mobile -->
              <div class="flex items-center px-3 py-2">
                <div class="flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg px-3 py-2 border border-yellow-200">
                  <div class="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-xs font-bold">T</span>
                  </div>
                  <span class="text-sm font-semibold text-gray-800">{{ authStore.userTokens }} tokens</span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </transition>
    </div>

    <!-- Notifications Panel -->
    <transition name="slide">
      <div v-if="showNotifications" class="absolute top-full right-0 mt-2 mr-4 w-96 bg-white rounded-xl shadow-xl border border-gray-100 max-h-96 overflow-y-auto z-50 backdrop-blur-lg bg-opacity-95">
        <div class="p-4 border-b border-gray-100">
          <h3 class="text-lg font-semibold text-gray-900">Notifications</h3>
        </div>
        <div class="p-4">
          <p class="text-gray-500 text-center">Aucune nouvelle notification</p>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// États réactifs
const showUserMenu = ref(false)
const showCoursesMenu = ref(false)
const showNotifications = ref(false)
const showMobileMenu = ref(false)
const unreadNotifications = ref(0)

// Refs pour la gestion des clics externes
const userDropdown = ref(null)
const coursesDropdown = ref(null)

// Gestion de la déconnexion
const handleLogout = async () => {
  showUserMenu.value = false
  authStore.logout()
  router.push('/')
}

// Fermer les menus en cliquant à l'extérieur
const handleClickOutside = (event) => {
  if (userDropdown.value && !userDropdown.value.contains(event.target)) {
    showUserMenu.value = false
  }
  if (coursesDropdown.value && !coursesDropdown.value.contains(event.target)) {
    showCoursesMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 