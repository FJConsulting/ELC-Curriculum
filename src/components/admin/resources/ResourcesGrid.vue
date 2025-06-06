<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <div 
      v-for="resource in resources" 
      :key="resource.id"
      class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div class="text-center mb-3">
        <span class="text-4xl">{{ getResourceIcon(resource.type) }}</span>
      </div>
      
      <h4 class="font-medium text-gray-900 mb-2 truncate" :title="resource.name">
        {{ resource.name }}
      </h4>
      
      <p class="text-sm text-gray-600 mb-3 line-clamp-2">
        {{ resource.description || 'Aucune description' }}
      </p>
      
      <div class="text-xs text-gray-500 mb-3 space-y-1">
        <div class="flex justify-between">
          <span>Type:</span>
          <span class="font-medium">{{ resource.type }}</span>
        </div>
        <div class="flex justify-between">
          <span>Taille:</span>
          <span class="font-medium">{{ formatFileSize(resource.size) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Téléchargements:</span>
          <span class="font-medium">{{ resource.downloads }}</span>
        </div>
        <div v-if="resource.sessionId" class="flex justify-between">
          <span>Session:</span>
          <span class="font-medium text-primary-600">{{ getSessionName(resource.sessionId) }}</span>
        </div>
      </div>
      
      <div class="flex justify-between items-center pt-3 border-t border-gray-100">
        <div class="flex space-x-2">
          <button 
            @click="$emit('preview', resource)"
            class="text-blue-600 hover:text-blue-800"
            title="Aperçu"
          >
            👁️
          </button>
          <button 
            @click="$emit('edit', resource)"
            class="text-green-600 hover:text-green-800"
            title="Modifier"
          >
            ✏️
          </button>
          <button 
            @click="$emit('download', resource)"
            class="text-primary-600 hover:text-primary-800"
            title="Télécharger"
          >
            ⬇️
          </button>
          <button 
            @click="$emit('delete', resource)"
            class="text-red-600 hover:text-red-800"
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  resources: {
    type: Array,
    required: true
  },
  sessions: {
    type: Array,
    required: true
  }
})

defineEmits(['preview', 'edit', 'download', 'delete'])

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
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

const getSessionName = (sessionId) => {
  const session = props.sessions.find(s => s.id === sessionId)
  return session ? session.name : 'Session inconnue'
}
</script>