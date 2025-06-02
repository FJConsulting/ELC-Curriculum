<template>
  <div class="min-h-screen bg-gray-50 pt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">Administration ELC Academy</h1>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">Dernière mise à jour : {{ lastUpdate }}</span>
            <button
              @click="refreshData"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <RefreshCwIcon class="h-4 w-4 mr-2" />
              Actualiser
            </button>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex overflow-x-auto px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm flex items-center flex-shrink-0'
              ]"
            >
              <component :is="tab.icon" class="h-5 w-5 mr-1.5" />
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <keep-alive>
            <component :is="currentTabComponent" />
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  LayoutDashboard as LayoutDashboardIcon,
  BookOpen as BookOpenIcon,
  Calendar as CalendarIcon,
  FolderOpen as FolderOpenIcon,
  Users as UsersIcon,
  UserCheck as UserCheckIcon,
  DollarSign as CurrencyDollarIcon,
  Settings as CogIcon,
  RefreshCw as RefreshCwIcon,
  ClipboardCheck as ClipboardCheckIcon
} from 'lucide-vue-next'

// Import des composants des onglets
import DashboardTab from '@/components/admin/DashboardTab.vue'
import ContentTab from '@/components/admin/ContentTab.vue'
import SessionsTab from '@/components/admin/SessionsTab.vue'
import ResourcesTab from '@/components/admin/ResourcesTab.vue'
import TeachersTab from '@/components/admin/TeachersTab.vue'
import UsersTab from '@/components/admin/UsersTab.vue'
import FinanceTab from '@/components/admin/FinanceTab.vue'
import SettingsTab from '@/components/admin/SettingsTab.vue'
import EvaluationsTab from '@/components/admin/EvaluationsTab.vue'

const activeTab = ref('dashboard')
const lastUpdate = ref(new Date().toLocaleString('fr-FR'))

const tabs = [
  { id: 'dashboard', name: 'Tableau de bord', icon: LayoutDashboardIcon, component: DashboardTab },
  { id: 'content', name: 'Contenus', icon: BookOpenIcon, component: ContentTab },
  { id: 'sessions', name: 'Sessions', icon: CalendarIcon, component: SessionsTab },
  { id: 'evaluations', name: 'Évaluations', icon: ClipboardCheckIcon, component: EvaluationsTab },
  { id: 'resources', name: 'Ressources', icon: FolderOpenIcon, component: ResourcesTab },
  { id: 'teachers', name: 'Professeurs', icon: UserCheckIcon, component: TeachersTab },
  { id: 'users', name: 'Étudiants', icon: UsersIcon, component: UsersTab },
  { id: 'finance', name: 'Finances', icon: CurrencyDollarIcon, component: FinanceTab },
  { id: 'settings', name: 'Paramètres', icon: CogIcon, component: SettingsTab }
]

const currentTabComponent = computed(() => {
  const tab = tabs.find(t => t.id === activeTab.value)
  return tab ? tab.component : DashboardTab
})

const refreshData = () => {
  lastUpdate.value = new Date().toLocaleString('fr-FR')
  // Ici vous pourriez déclencher un rechargement des données
}
</script> 