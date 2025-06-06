<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl max-w-lg w-full max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-xl font-semibold">
          {{ editingCourseType ? 'Modifier le type de cours' : 'Nouveau type de cours' }}
        </h3>
        <button 
          @click="$emit('close')"
          class="p-1 rounded-full text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Contenu -->
      <div class="flex-1 overflow-y-auto p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input 
            v-model="form.name"
            type="text" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Ex: Cours collectifs"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            v-model="form.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Description du type de cours..."
          ></textarea>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
          <input 
            v-model="form.slug"
            type="text" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Ex: cours-collectifs"
          >
          <p class="text-xs text-gray-500 mt-1">Sera utilisé pour générer l'URL : /{{ form.slug }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Icône</label>
          <div class="grid grid-cols-6 gap-2">
            <button 
              v-for="icon in availableIcons"
              :key="icon"
              @click="form.icon = icon"
              :class="[
                form.icon === icon ? 'ring-2 ring-primary-500' : '',
                'p-3 text-2xl rounded-lg hover:bg-gray-100'
              ]"
            >
              {{ icon }}
            </button>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fonctionnalités</label>
          <div class="space-y-2">
            <label class="flex items-center">
              <input 
                v-model="form.features.enableTips"
                type="checkbox" 
                class="mr-2"
              >
              Activer les conseils
            </label>
            <label class="flex items-center">
              <input 
                v-model="form.features.enableSpecialContent"
                type="checkbox" 
                class="mr-2"
              >
              Contenu spécialisé
            </label>
          </div>
        </div>
        
        <div v-if="form.features.enableSpecialContent">
          <label class="block text-sm font-medium text-gray-700 mb-1">Comment ça marche</label>
          <textarea 
            v-model="form.features.howItWorks"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Expliquez le fonctionnement..."
          ></textarea>
        </div>
      </div>
      
      <!-- Boutons -->
      <div class="p-6 border-t border-gray-200 flex justify-end space-x-3">
        <button 
          @click="$emit('close')"
          class="px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50"
        >
          Annuler
        </button>
        <button 
          @click="save"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          {{ editingCourseType ? 'Mettre à jour' : 'Créer' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  editingCourseType: Object
})

const emit = defineEmits(['close', 'save'])

const availableIcons = ['📚', '✏️', '💬', '🔊', '🎓', '🎯', '📖', '🎤', '🎨', '🔬']

const form = ref({
  name: '',
  description: '',
  slug: '',
  icon: '📚',
  features: {
    enableTips: false,
    enableSpecialContent: false,
    howItWorks: ''
  }
})

watch(() => props.editingCourseType, (courseType) => {
  if (courseType) {
    form.value = { ...courseType }
  } else {
    form.value = {
      name: '',
      description: '',
      slug: '',
      icon: '📚',
      features: {
        enableTips: false,
        enableSpecialContent: false,
        howItWorks: ''
      }
    }
  }
}, { immediate: true })

const save = () => {
  emit('save', form.value)
}
</script>