<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold">Aperçu de la ressource</h3>
        <button 
          @click="$emit('close')"
          class="text-primary-600 hover:text-primary-700 p-1 rounded-lg hover:bg-primary-50 transition-colors"
        >
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>
      
      <div v-if="resource" class="space-y-4">
        <div class="bg-gray-100 rounded-lg p-8 text-center">
          <span class="text-8xl">{{ getResourceIcon(resource.type) }}</span>
          <h4 class="text-xl font-medium mt-4">{{ resource.name }}</h4>
          <p class="text-gray-600 mt-2">{{ resource.description || 'Aucune description' }}</p>
        </div>
        
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-600">Type:</span>
            <span class="ml-2 font-medium">{{ resource.type }}</span>
          </div>
          <div>
            <span class="text-gray-600">Taille:</span>
            <span class="ml-2 font-medium">{{ formatFileSize(resource.size) }}</span>
          </div>
          <div>
            <span class="text-gray-600">Téléchargements:</span>
            <span class="ml-2 font-medium">{{ resource.downloads }}</span>
          </div>
          <div>
            <span class="text-gray-600">Ajouté le:</span>
            <span class="ml-2 font-medium">{{ formatDate(resource.uploadedAt) }}</span>
          </div>
        </div>
        
        <div class="flex justify-center mt-6">
          <button 
            @click="$emit('download', resource)"
            class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            ⬇️ Télécharger la ressource
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  resource: {
    type: Object,
    default: null
  }
})

defineEmits(['close', 'download'])

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
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
import { XMarkIcon } from '@heroicons/vue/24/outline'
</script>