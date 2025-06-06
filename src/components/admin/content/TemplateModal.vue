<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-xl font-semibold">
          {{ editingTemplate ? 'Modifier le template' : 'Nouveau template' }}
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
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- Informations de base -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom du template</label>
            <input 
              v-model="form.name"
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Ex: Introduction aux temps du passé"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select 
              v-model="form.category"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="grammar">Grammaire</option>
              <option value="vocabulary">Vocabulaire</option>
              <option value="conversation">Conversation</option>
              <option value="pronunciation">Prononciation</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
            <select 
              v-model="form.level"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Durée (minutes)</label>
            <input 
              v-model.number="form.duration"
              type="number" 
              min="30"
              max="180"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre max d'étudiants</label>
            <input 
              v-model.number="form.maxStudents"
              type="number" 
              min="1"
              max="20"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
          </div>
        </div>
        
        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            v-model="form.content.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Description détaillée du template..."
          ></textarea>
        </div>
        
        <!-- Objectifs -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium text-gray-700">Objectifs pédagogiques</label>
            <button 
              @click="addObjective"
              type="button"
              class="text-sm text-primary-600 hover:text-primary-800"
            >
              + Ajouter un objectif
            </button>
          </div>
          <div class="space-y-2">
            <div 
              v-for="(objective, index) in form.content.objectives"
              :key="index"
              class="flex gap-2"
            >
              <input 
                v-model="form.content.objectives[index]"
                type="text" 
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                :placeholder="`Objectif ${index + 1}`"
              >
              <button 
                @click="removeObjective(index)"
                type="button"
                class="px-3 py-2 text-red-600 hover:text-red-800"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
        
        <!-- Plan de cours -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium text-gray-700">Plan de cours</label>
            <button 
              @click="addOutlineItem"
              type="button"
              class="text-sm text-primary-600 hover:text-primary-800"
            >
              + Ajouter une étape
            </button>
          </div>
          <div class="space-y-2">
            <div 
              v-for="(item, index) in form.content.outline"
              :key="index"
              class="flex gap-2"
            >
              <input 
                v-model="form.content.outline[index]"
                type="text" 
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                :placeholder="`Étape ${index + 1}`"
              >
              <button 
                @click="removeOutlineItem(index)"
                type="button"
                class="px-3 py-2 text-red-600 hover:text-red-800"
              >
                🗑️
              </button>
            </div>
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
          {{ editingTemplate ? 'Mettre à jour' : 'Créer' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  editingTemplate: Object
})

const emit = defineEmits(['close', 'save'])

const form = ref({
  name: '',
  category: 'grammar',
  level: 'A1',
  duration: 60,
  maxStudents: 5,
  content: {
    description: '',
    objectives: [''],
    prerequisites: [''],
    outline: ['']
  }
})

watch(() => props.editingTemplate, (template) => {
  if (template) {
    form.value = { ...template }
  } else {
    form.value = {
      name: '',
      category: 'grammar',
      level: 'A1',
      duration: 60,
      maxStudents: 5,
      content: {
        description: '',
        objectives: [''],
        prerequisites: [''],
        outline: ['']
      }
    }
  }
}, { immediate: true })

const addObjective = () => {
  form.value.content.objectives.push('')
}

const removeObjective = (index) => {
  form.value.content.objectives.splice(index, 1)
}

const addOutlineItem = () => {
  form.value.content.outline.push('')
}

const removeOutlineItem = (index) => {
  form.value.content.outline.splice(index, 1)
}

const save = () => {
  emit('save', form.value)
}
</script>