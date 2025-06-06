<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold">Détails de la session</h3>
        <button 
          @click="$emit('close')"
          class="text-primary-600 hover:text-primary-700 p-1 rounded-lg hover:bg-primary-50 transition-colors"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>
      
      <div v-if="session" class="space-y-6">
        <!-- Session Info -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="font-medium mb-3">{{ session.name }}</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-600">Catégorie:</span>
              <!-- ✅ Correction : utiliser categoryId ou category_id -->
              <span class="ml-2 font-medium">{{ getCategoryById(session.categoryId || session.category_id)?.name || 'Non définie' }}</span>
            </div>
            <div>
              <span class="text-gray-600">Niveau:</span>
              <span class="ml-2 font-medium">{{ session.level }}</span>
            </div>
            <div>
              <span class="text-gray-600">Professeur:</span>
              <span class="ml-2 font-medium">{{ session.teacher }}</span>
            </div>
            <div>
              <span class="text-gray-600">Date:</span>
              <!-- Ligne 33 -->
              <span class="ml-2 font-medium">{{ formatDate(session.dateTime) }}</span>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div>
          <h4 class="font-medium mb-3">Contenu de la session</h4>
          <div class="space-y-3">
            <div>
              <p class="text-sm font-medium text-gray-700">Description:</p>
              <!-- ✅ Correction : utiliser session.content.description ou session.description -->
              <p class="text-sm text-gray-600">{{ session.content?.description || session.description || 'Aucune description' }}</p>
            </div>
            
            <div v-if="session.content?.objectives?.length">
              <p class="text-sm font-medium text-gray-700">Objectifs d'apprentissage:</p>
              <ul class="list-disc list-inside text-sm text-gray-600">
                <li v-for="(obj, idx) in session.content.objectives" :key="idx">{{ obj }}</li>
              </ul>
            </div>
            
            <div v-if="session.content?.prerequisites?.length">
              <p class="text-sm font-medium text-gray-700">Prérequis:</p>
              <ul class="list-disc list-inside text-sm text-gray-600">
                <li v-for="(prereq, idx) in session.content.prerequisites" :key="idx">{{ prereq }}</li>
              </ul>
            </div>
            
            <div v-if="session.content?.outline?.length">
              <p class="text-sm font-medium text-gray-700">Plan de la session:</p>
              <ol class="list-decimal list-inside text-sm text-gray-600">
                <li v-for="(item, idx) in session.content.outline" :key="idx">{{ item }}</li>
              </ol>
            </div>
          </div>
        </div>

        <!-- Students -->
        <div>
          <h4 class="font-medium mb-3">Étudiants inscrits ({{ session.enrolled.length }}/{{ session.maxStudents }})</h4>
          <div class="grid grid-cols-2 gap-2">
            <div 
              v-for="studentId in session.enrolled" 
              :key="studentId"
              class="bg-gray-50 rounded p-2 text-sm"
            >
              Étudiant #{{ studentId }}
            </div>
          </div>
        </div>

        <!-- Resources -->
        <div>
          <h4 class="font-medium mb-3">Ressources ({{ getSessionResources(session.id).length }})</h4>
          <div class="space-y-2">
            <div 
              v-for="resource in getSessionResources(session.id)" 
              :key="resource.id"
              class="flex items-center bg-gray-50 rounded p-2"
            >
              <span class="mr-2">{{ getResourceIcon(resource.type) }}</span>
              <span class="text-sm">{{ resource.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  session: {
    type: Object,
    default: null
  },
  categories: {
    type: Array,
    default: () => []
  },
  resources: {
    type: Array,
    default: () => []
  }
})

defineEmits(['close'])

// Méthodes utilitaires
const formatDate = (dateString) => {
  if (!dateString) return 'Date non définie'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Date invalide'
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getCategoryById = (id) => {
  return props.categories.find(c => c.id === id)
}

const getResourceIcon = (type) => {
  const icons = {
    'pdf': '📄',
    'video': '🎥',
    'audio': '🎵',
    'image': '🖼️',
    'document': '📃',
    'presentation': '📊'
  }
  return icons[type] || '📎'
}

const getSessionResources = (sessionId) => {
  return props.resources.filter(r => r.sessionId === sessionId)
}
import { XMarkIcon } from '@heroicons/vue/24/outline'
</script>