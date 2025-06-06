<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl max-w-lg w-full max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-xl font-semibold">
          {{ editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}
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
            placeholder="Ex: Grammaire fondamentale"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            v-model="form.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Description de la catégorie..."
          ></textarea>
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
          
          <!-- Ajouter un nouvel icône -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Ou saisir un nouvel icône</label>
            <div class="flex gap-2">
              <input 
                v-model="newIconInput"
                type="text" 
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Coller un emoji ici (ex: 🚀)"
                maxlength="2"
              >
              <button 
                @click="addNewIcon"
                :disabled="!newIconInput.trim()"
                class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
          <div class="grid grid-cols-6 gap-2">
            <button 
              v-for="color in ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#F97316']"
              :key="color"
              @click="form.color = color"
              :class="[
                form.color === color ? 'ring-2 ring-gray-400' : '',
                'w-full h-10 rounded-lg'
              ]"
              :style="{ backgroundColor: color }"
            ></button>
          </div>
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
          {{ editingCategory ? 'Mettre à jour' : 'Créer' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  editingCategory: Object
})

const emit = defineEmits(['close', 'save'])

const availableIcons = ref(['📚', '✏️', '💬', '📝', '💼', '🌍', '🎓', '🎯', '📖', '🎤', '🎨', '🔬', '🎭', '🏆', '📊', '🎵', '🖼️', '📄', '🎥', '📱', '💻', '🔧', '⚡', '🌟'])
const newIconInput = ref('')

const form = ref({
  name: '',
  description: '',
  icon: '📝',
  color: '#3B82F6'
})

watch(() => props.editingCategory, (category) => {
  if (category) {
    form.value = { ...category }
  } else {
    form.value = {
      name: '',
      description: '',
      icon: '📝',
      color: '#3B82F6'
    }
  }
}, { immediate: true })

const addNewIcon = () => {
  const newIcon = newIconInput.value.trim()
  if (newIcon && !availableIcons.value.includes(newIcon)) {
    availableIcons.value.push(newIcon)
    form.value.icon = newIcon
    newIconInput.value = ''
  }
}

const save = () => {
  emit('save', form.value)
}
</script>