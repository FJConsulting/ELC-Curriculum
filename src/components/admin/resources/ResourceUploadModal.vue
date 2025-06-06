<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl max-w-lg w-full p-6">
      <h3 class="text-xl font-semibold mb-4">Télécharger une ressource</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fichier</label>
          <input 
            type="file"
            @change="handleFileSelect"
            accept=".pdf,.mp4,.mp3,.ppt,.pptx,.doc,.docx,.jpg,.jpeg,.png"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nom de la ressource</label>
          <input 
            v-model="form.name"
            type="text" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Ex: Guide de grammaire niveau B1"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            v-model="form.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Description de la ressource..."
          ></textarea>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Associer à une session (optionnel)</label>
          <select 
            v-model="form.sessionId"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">-- Aucune session --</option>
            <option v-for="session in sessions" :key="session.id" :value="session.id">
              {{ session.name }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tags (séparés par des virgules)</label>
          <input 
            v-model="form.tags"
            type="text" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Ex: grammaire, B1, exercises"
          >
        </div>
      </div>
      
      <div class="mt-6 flex justify-end space-x-3">
        <button 
          @click="$emit('close')"
          class="px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50"
        >
          Annuler
        </button>
        <button 
          @click="handleUpload"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Télécharger
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  sessions: {
    type: Array,
    required: true
  },
  initialData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'upload'])

const form = ref({
  name: '',
  description: '',
  sessionId: '',
  tags: '',
  file: null
})

watch(() => props.initialData, (newData) => {
  if (newData) {
    form.value = { ...form.value, ...newData }
  }
}, { immediate: true })

const handleFileSelect = (e) => {
  const files = e.target.files
  if (files.length > 0) {
    form.value.file = files[0]
    if (!form.value.name) {
      form.value.name = files[0].name.replace(/\.[^/.]+$/, '') // Remove extension
    }
  }
}

const handleUpload = () => {
  emit('upload', { ...form.value })
  // Reset form
  form.value = {
    name: '',
    description: '',
    sessionId: '',
    tags: '',
    file: null
  }
}
</script>