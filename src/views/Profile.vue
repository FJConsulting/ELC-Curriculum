<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center space-x-6">
          <div class="w-24 h-24 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {{ authStore.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ authStore.user?.name }}</h1>
            <p class="text-gray-600">{{ authStore.user?.email }}</p>
            <div class="flex items-center space-x-4 mt-2">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                <AcademicCapIcon class="w-4 h-4 mr-1" />
                Niveau {{ authStore.user?.level || 'A1' }}
              </span>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <CurrencyDollarIcon class="w-4 h-4 mr-1" />
                {{ authStore.user?.tokens || 0 }} tokens
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Informations personnelles -->
          <div v-if="activeTab === 'info'" class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  <input
                    v-model="profileForm.name"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    v-model="profileForm.email"
                    type="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    v-model="profileForm.phone"
                    type="tel"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                  <input
                    v-model="profileForm.birthDate"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Préférences d'apprentissage</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Objectif principal</label>
                  <select
                    v-model="profileForm.goal"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Sélectionner un objectif</option>
                    <option value="travel">Voyages</option>
                    <option value="work">Professionnel</option>
                    <option value="study">Études</option>
                    <option value="culture">Culture générale</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Disponibilités préférées</label>
                  <div class="space-y-2">
                    <label class="flex items-center">
                      <input type="checkbox" v-model="profileForm.availability.morning" class="mr-2">
                      <span>Matin (8h-12h)</span>
                    </label>
                    <label class="flex items-center">
                      <input type="checkbox" v-model="profileForm.availability.afternoon" class="mr-2">
                      <span>Après-midi (12h-18h)</span>
                    </label>
                    <label class="flex items-center">
                      <input type="checkbox" v-model="profileForm.availability.evening" class="mr-2">
                      <span>Soir (18h-21h)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end">
              <button
                @click="saveProfile"
                class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Enregistrer les modifications
              </button>
            </div>
          </div>

          <!-- Historique -->
          <div v-if="activeTab === 'history'" class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Historique des sessions</h3>
            
            <div v-if="sessionHistory.length === 0" class="text-center py-12 text-gray-500">
              Aucune session suivie pour le moment
            </div>
            
            <div v-else class="space-y-4">
              <div
                v-for="session in sessionHistory"
                :key="session.id"
                class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-medium text-gray-900">{{ session.name }}</h4>
                    <p class="text-sm text-gray-600 mt-1">
                      {{ new Date(session.date).toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) }}
                    </p>
                    <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span class="flex items-center">
                        <UserIcon class="w-4 h-4 mr-1" />
                        {{ session.teacher }}
                      </span>
                      <span class="flex items-center">
                        <ClockIcon class="w-4 h-4 mr-1" />
                        {{ session.duration }} min
                      </span>
                    </div>
                  </div>
                  <span :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    session.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  ]">
                    {{ session.status === 'completed' ? 'Terminé' : 'À venir' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Sécurité -->
          <div v-if="activeTab === 'security'" class="space-y-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Changer le mot de passe</h3>
              <div class="space-y-4 max-w-md">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                  <input
                    v-model="passwordForm.current"
                    type="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                  <input
                    v-model="passwordForm.new"
                    type="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
                  <input
                    v-model="passwordForm.confirm"
                    type="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <button
                  @click="changePassword"
                  class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Mettre à jour le mot de passe
                </button>
              </div>
            </div>

            <div class="mt-8 pt-8 border-t border-gray-200">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Authentification à deux facteurs</h3>
              <p class="text-sm text-gray-600 mb-4">
                Ajoutez une couche de sécurité supplémentaire à votre compte
              </p>
              <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Configurer 2FA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { 
  GraduationCap as AcademicCapIcon,
  DollarSign as CurrencyDollarIcon,
  User as UserIcon,
  Clock as ClockIcon
} from 'lucide-vue-next'

const authStore = useAuthStore()

// États
const activeTab = ref('info')
const tabs = [
  { id: 'info', name: 'Informations personnelles' },
  { id: 'history', name: 'Historique' },
  { id: 'security', name: 'Sécurité' }
]

const profileForm = ref({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  phone: '',
  birthDate: '',
  goal: '',
  availability: {
    morning: false,
    afternoon: false,
    evening: false
  }
})

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

const sessionHistory = ref([
  {
    id: 1,
    name: 'Business English - Meeting Vocabulary',
    date: '2024-01-15T10:00:00',
    teacher: 'Sarah Johnson',
    duration: 60,
    status: 'completed'
  },
  {
    id: 2,
    name: 'Grammar Workshop - Present Perfect',
    date: '2024-01-22T14:00:00',
    teacher: 'John Smith',
    duration: 90,
    status: 'completed'
  }
])

// Méthodes
const saveProfile = () => {
  // Logique pour sauvegarder le profil
  console.log('Profil sauvegardé:', profileForm.value)
}

const changePassword = () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    alert('Les mots de passe ne correspondent pas')
    return
  }
  // Logique pour changer le mot de passe
  console.log('Mot de passe changé')
}

onMounted(() => {
  // Charger les données du profil
})
</script> 