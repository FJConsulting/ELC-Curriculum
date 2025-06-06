<template>
  <nav class="bg-white shadow-lg sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-3 group">
          <div class="w-12 h-12 flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <img 
              src="/logo-elc.png" 
              alt="ELC Academy Logo" 
              class="w-12 h-12 object-contain"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
            />
            <!-- Fallback si l'image n'existe pas -->
            <div class="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center elc-circle-logo relative" style="display: none;">
              <div class="flex items-center justify-center text-lg font-extrabold tracking-tight">
                <span class="elc-logo-e">E</span><span class="elc-logo-l">L</span><span class="elc-logo-c">C</span>
              </div>
            </div>
          </div>
          <h1 class="text-xl font-bold text-primary-500">
            ELC Academy
          </h1>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <template v-if="!authStore.isAuthenticated">
            <router-link to="/" class="nav-link">
              <HomeIcon class="w-4 h-4 mr-1" />
              Accueil
            </router-link>
            <router-link to="/test-niveau" class="nav-link">
              <GraduationCapIcon class="w-4 h-4 mr-1" />
              Test de niveau
            </router-link>
            <router-link to="/login" class="nav-link">
              <UserIcon class="w-4 h-4 mr-1" />
              Connexion
            </router-link>
            <router-link to="/register" class="btn-primary">
              S'inscrire
            </router-link>
          </template>

          <template v-else>
            <router-link to="/dashboard" class="nav-link">
              <HomeIcon class="w-4 h-4 mr-1" />
              Tableau de bord
            </router-link>
            
            <!-- Courses Dropdown -->
            <div class="relative" ref="coursesDropdown">
              <button
                @click="showCoursesMenu = !showCoursesMenu"
                class="nav-link flex items-center"
              >
                <BookOpenIcon class="w-4 h-4 mr-1" />
                Cours
                <ChevronDownIcon class="w-4 h-4 ml-1" :class="{ 'rotate-180': showCoursesMenu }" />
              </button>
              
              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div v-if="showCoursesMenu" class="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 backdrop-blur-lg bg-opacity-95">
                  <template v-if="adminStore.courseTypes && adminStore.courseTypes.length > 0">
                    <router-link
                      v-for="courseType in sortedCourseTypes"
                      :key="courseType.id"
                      :to="courseType.route || '/courses'"
                      class="flex items-start px-4 py-3 hover:bg-gray-50 transition-colors group"
                      @click="showCoursesMenu = false"
                    >
                      <span class="text-lg mr-3">{{ courseType.icon || '📚' }}</span>
                      <div class="flex-1">
                        <div class="text-sm font-medium text-gray-900 group-hover:text-primary-600">{{ courseType.name }}</div>
                        <div class="text-xs text-gray-500 mt-1">{{ courseType.description }}</div>
                      </div>
                    </router-link>
                  </template>
                  <template v-else>
                    <!-- Fallback content if no course types are loaded -->
                    <router-link to="/courses/collectifs" class="flex items-start px-4 py-3 hover:bg-gray-50 transition-colors group" @click="showCoursesMenu = false">
                      <span class="text-lg mr-3">👥</span>
                      <div class="flex-1">
                        <div class="text-sm font-medium text-gray-900 group-hover:text-primary-600">Cours collectifs</div>
                        <div class="text-xs text-gray-500 mt-1">Apprenez en groupe dans une ambiance conviviale</div>
                      </div>
                    </router-link>
                    <router-link to="/courses/ateliers" class="flex items-start px-4 py-3 hover:bg-gray-50 transition-colors group" @click="showCoursesMenu = false">
                      <span class="text-lg mr-3">📝</span>
                      <div class="flex-1">
                        <div class="text-sm font-medium text-gray-900 group-hover:text-primary-600">Ateliers grammaire</div>
                        <div class="text-xs text-gray-500 mt-1">Perfectionnez vos bases grammaticales</div>
                      </div>
                    </router-link>
                    <router-link to="/courses/conversation" class="flex items-start px-4 py-3 hover:bg-gray-50 transition-colors group" @click="showCoursesMenu = false">
                      <span class="text-lg mr-3">💬</span>
                      <div class="flex-1">
                        <div class="text-sm font-medium text-gray-900 group-hover:text-primary-600">Club conversation</div>
                        <div class="text-xs text-gray-500 mt-1">Pratiquez l'oral en toute confiance</div>
                      </div>
                    </router-link>
                  </template>
                </div>
              </transition>
            </div>

            <router-link to="/evaluations" class="nav-link">
              <ClipboardListIcon class="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              Évaluations
            </router-link>

            <router-link to="/subscription" class="nav-link">
              <CreditCardIcon class="w-4 h-4 mr-1" />
              Abonnement
            </router-link>

            <!-- Notifications -->
            <button 
              @click="showNotifications = !showNotifications"
              class="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <BellIcon class="w-5 h-5" />
              <span v-if="unreadNotifications > 0" class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                {{ unreadNotifications }}
              </span>
            </button>

            <!-- User Menu -->
            <div class="relative" ref="userDropdown">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                  {{ authStore.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
                </div>
                <span class="hidden lg:block font-medium">{{ authStore.user?.name }}</span>
                <ChevronDownIcon class="w-4 h-4" :class="{ 'rotate-180': showUserMenu }" />
              </button>

              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div v-if="showUserMenu" class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                  <div class="px-4 py-3 border-b border-gray-100">
                    <p class="text-sm font-medium text-gray-900">{{ authStore.user?.name }}</p>
                    <p class="text-xs text-gray-500">{{ authStore.user?.email }}</p>
                    <div class="mt-2">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        Niveau {{ authStore.user?.level || 'A1' }}
                      </span>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                        {{ authStore.user?.tokens || 0 }} tokens
                      </span>
                    </div>
                  </div>
                  
                  <router-link
                    to="/profile"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    @click="showUserMenu = false"
                  >
                    <UserIcon class="w-4 h-4 mr-3" />
                    Mon profil
                  </router-link>
                  
                  <router-link
                    v-if="authStore.isAdmin"
                    to="/admin"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    @click="showUserMenu = false"
                  >
                    <SettingsIcon class="w-4 h-4 mr-3" />
                    Administration
                  </router-link>
                  
                  <hr class="my-2">
                  
                  <button
                    @click="handleLogout"
                    class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOutIcon class="w-4 h-4 mr-3" />
                    Déconnexion
                  </button>
                </div>
              </transition>
            </div>
          </template>
        </div>

        <!-- Mobile menu button -->
        <button
          @click="showMobileMenu = !showMobileMenu"
          class="md:hidden p-2 text-gray-600 hover:text-gray-900"
        >
          <MenuIcon v-if="!showMobileMenu" class="w-6 h-6" />
          <XMarkIcon v-else class="w-6 h-6" />
        </button>
      </div>

      <!-- Mobile Navigation -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="showMobileMenu" class="md:hidden bg-white border-t border-gray-200">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <template v-if="!authStore.isAuthenticated">
              <router-link to="/" class="mobile-nav-link" @click="showMobileMenu = false">Accueil</router-link>
              <router-link to="/test-niveau" class="mobile-nav-link" @click="showMobileMenu = false">Test de niveau</router-link>
              <router-link to="/login" class="mobile-nav-link" @click="showMobileMenu = false">Connexion</router-link>
              <router-link to="/register" class="mobile-nav-link bg-primary-600 text-white hover:bg-primary-700" @click="showMobileMenu = false">
                S'inscrire
              </router-link>
            </template>
            
            <template v-else>
              <router-link to="/dashboard" class="mobile-nav-link" @click="showMobileMenu = false">Tableau de bord</router-link>
              
              <!-- Cours dynamiques pour mobile -->
              <template v-if="adminStore.courseTypes && adminStore.courseTypes.length > 0">
                <router-link
                  v-for="courseType in sortedCourseTypes"
                  :key="courseType.id"
                  :to="courseType.route || '/courses'"
                  class="mobile-nav-link"
                  @click="showMobileMenu = false"
                >
                  {{ courseType.icon || '📚' }} {{ courseType.name }}
                </router-link>
              </template>
              <template v-else>
                <!-- Fallback pour mobile -->
                <router-link to="/courses/collectifs" class="mobile-nav-link" @click="showMobileMenu = false">👥 Cours collectifs</router-link>
                <router-link to="/courses/ateliers" class="mobile-nav-link" @click="showMobileMenu = false">📝 Ateliers grammaire</router-link>
                <router-link to="/courses/conversation" class="mobile-nav-link" @click="showMobileMenu = false">💬 Club conversation</router-link>
              </template>
              
              <router-link to="/evaluations" class="mobile-nav-link" @click="showMobileMenu = false">Évaluations</router-link>
              <router-link to="/subscription" class="mobile-nav-link" @click="showMobileMenu = false">Abonnement</router-link>
              <router-link to="/profile" class="mobile-nav-link" @click="showMobileMenu = false">Mon profil</router-link>
              <router-link v-if="authStore.isAdmin" to="/admin" class="mobile-nav-link" @click="showMobileMenu = false">Administration</router-link>
              <button @click="handleLogout" class="mobile-nav-link text-red-600 w-full text-left">Déconnexion</button>
            </template>
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAdminStore } from '@/stores/admin/index'
import {
  Home as HomeIcon,
  User as UserIcon,
  GraduationCap as GraduationCapIcon,
  Settings as SettingsIcon,
  LogOut as LogOutIcon,
  Bell as BellIcon,
  Menu as MenuIcon,
  X as XMarkIcon,
  BookOpen as BookOpenIcon,
  ChevronDown as ChevronDownIcon,
  ClipboardList as ClipboardListIcon, // Remplacer ClipboardDocumentCheckIcon
  CreditCard as CreditCardIcon
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const adminStore = useAdminStore()

// États réactifs
const showUserMenu = ref(false)
const showCoursesMenu = ref(false)
const showNotifications = ref(false)
const showMobileMenu = ref(false)
const unreadNotifications = ref(3)

// Trier les types de cours par ordre
const sortedCourseTypes = computed(() => {
  return [...adminStore.courseTypes].sort((a, b) => (a.order || 999) - (b.order || 999))
})

// Refs pour la gestion des clics externes
const userDropdown = ref(null)
const coursesDropdown = ref(null)

// Gestion de la déconnexion
const handleLogout = async () => {
  showUserMenu.value = false
  showMobileMenu.value = false
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
  // Charger les types de cours au montage
  if (adminStore.loadCourseTypes) {
    adminStore.loadCourseTypes()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.nav-link {
  @apply flex items-center text-gray-700 hover:text-primary-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors;
}

.nav-link.router-link-active {
  @apply text-primary-600 bg-primary-50;
}

.btn-primary {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors;
}

.mobile-nav-link {
  @apply block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50;
}

.mobile-nav-link.router-link-active {
  @apply bg-primary-50 text-primary-600;
}
</style>