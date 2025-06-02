<template>
  <div class="space-y-6">
    <!-- Categories Management -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Catégories de cours</h3>
        <button 
          @click="showCategoryModal()"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          ➕ Nouvelle catégorie
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="category in adminStore.categories" 
          :key="category.id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center">
              <span class="text-2xl mr-3">{{ category.icon }}</span>
              <div>
                <h4 class="font-medium">{{ category.name }}</h4>
                <p class="text-sm text-gray-600">{{ category.description }}</p>
              </div>
            </div>
            <div class="flex space-x-2">
              <button 
                @click="showCategoryModal(category)"
                class="text-primary-600 hover:text-primary-800"
              >
                ✏️
              </button>
              <button 
                @click="deleteCategory(category)"
                class="text-red-600 hover:text-red-800"
              >
                🗑️
              </button>
            </div>
          </div>
          <div class="mt-3 text-sm text-gray-500">
            {{ adminStore.getSessionsByCategory(category.id).length }} sessions
          </div>
        </div>
      </div>
    </div>

    <!-- Templates Management -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Templates de sessions</h3>
        <button 
          @click="showTemplateModal()"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          ➕ Nouveau template
        </button>
      </div>
      <div class="space-y-3">
        <div 
          v-for="template in adminStore.templates" 
          :key="template.id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-medium">{{ template.name }}</h4>
              <p class="text-sm text-gray-600 mt-1">
                Niveau {{ template.level }} • {{ template.duration }} min • Max {{ template.maxStudents }} étudiants
              </p>
              <div class="mt-2">
                <p class="text-sm font-medium text-gray-700">Objectifs :</p>
                <ul class="text-sm text-gray-600 list-disc list-inside mt-1">
                  <li v-for="(obj, idx) in template.content.objectives.slice(0, 2)" :key="idx">
                    {{ obj }}
                  </li>
                  <li v-if="template.content.objectives.length > 2" class="text-gray-400">
                    +{{ template.content.objectives.length - 2 }} autres...
                  </li>
                </ul>
              </div>
            </div>
            <div class="flex space-x-2">
              <button 
                @click="showTemplateModal(template)"
                class="text-primary-600 hover:text-primary-800"
              >
                ✏️
              </button>
              <button 
                @click="deleteTemplate(template)"
                class="text-red-600 hover:text-red-800"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Modal -->
    <div v-if="categoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-lg w-full p-6">
        <h3 class="text-xl font-semibold mb-4">
          {{ editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input 
              v-model="categoryForm.name"
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Ex: Grammaire fondamentale"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              v-model="categoryForm.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Description de la catégorie..."
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Icône</label>
            <div class="grid grid-cols-6 gap-2">
              <button 
                v-for="icon in ['📝', '💬', '💼', '🌍', '🎓', '🎯', '📖', '🎤', '🎨', '🔬', '🎭', '🏆']"
                :key="icon"
                @click="categoryForm.icon = icon"
                :class="[
                  categoryForm.icon === icon ? 'ring-2 ring-primary-500' : '',
                  'p-3 text-2xl rounded-lg hover:bg-gray-100'
                ]"
              >
                {{ icon }}
              </button>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
            <div class="grid grid-cols-6 gap-2">
              <button 
                v-for="color in ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#F97316']"
                :key="color"
                @click="categoryForm.color = color"
                :class="[
                  categoryForm.color === color ? 'ring-2 ring-gray-400' : '',
                  'w-full h-10 rounded-lg'
                ]"
                :style="{ backgroundColor: color }"
              ></button>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button 
            @click="categoryModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            @click="saveCategory"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {{ editingCategory ? 'Mettre à jour' : 'Créer' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Template Modal -->
    <div v-if="templateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h3 class="text-xl font-semibold mb-4">
          {{ editingTemplate ? 'Modifier le template' : 'Nouveau template' }}
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom du template</label>
            <input 
              v-model="templateForm.name"
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Ex: Template Grammaire Débutant"
            >
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select 
                v-model="templateForm.category"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="grammar">Grammaire</option>
                <option value="conversation">Conversation</option>
                <option value="business">Business</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
              <select 
                v-model="templateForm.level"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
              </select>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Durée (minutes)</label>
              <input 
                v-model.number="templateForm.duration"
                type="number" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="60"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre max d'étudiants</label>
              <input 
                v-model.number="templateForm.maxStudents"
                type="number" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="5"
              >
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              v-model="templateForm.content.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Description du template..."
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Objectifs d'apprentissage</label>
            <div class="space-y-2">
              <div 
                v-for="(obj, index) in templateForm.content.objectives" 
                :key="index"
                class="flex items-center space-x-2"
              >
                <input 
                  v-model="templateForm.content.objectives[index]"
                  type="text" 
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Objectif"
                >
                <button 
                  @click="removeObjective(index)"
                  class="text-red-600 hover:text-red-800"
                >
                  ❌
                </button>
              </div>
              <button 
                @click="addObjective"
                class="text-primary-600 hover:text-primary-800 text-sm"
              >
                ➕ Ajouter un objectif
              </button>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Plan de la session</label>
            <div class="space-y-2">
              <div 
                v-for="(item, index) in templateForm.content.outline" 
                :key="index"
                class="flex items-center space-x-2"
              >
                <input 
                  v-model="templateForm.content.outline[index]"
                  type="text" 
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Étape"
                >
                <button 
                  @click="removeOutlineItem(index)"
                  class="text-red-600 hover:text-red-800"
                >
                  ❌
                </button>
              </div>
              <button 
                @click="addOutlineItem"
                class="text-primary-600 hover:text-primary-800 text-sm"
              >
                ➕ Ajouter une étape
              </button>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button 
            @click="templateModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            @click="saveTemplate"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {{ editingTemplate ? 'Mettre à jour' : 'Créer' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()

// État local
const categoryModal = ref(false)
const templateModal = ref(false)
const editingCategory = ref(null)
const editingTemplate = ref(null)

// Forms
const categoryForm = ref({
  name: '',
  description: '',
  icon: '📝',
  color: '#3B82F6'
})

const templateForm = ref({
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

// Category management
const showCategoryModal = (category = null) => {
  if (category) {
    editingCategory.value = category
    categoryForm.value = { ...category }
  } else {
    editingCategory.value = null
    categoryForm.value = {
      name: '',
      description: '',
      icon: '📝',
      color: '#3B82F6'
    }
  }
  categoryModal.value = true
}

const saveCategory = () => {
  if (editingCategory.value) {
    adminStore.updateCategory(editingCategory.value.id, categoryForm.value)
  } else {
    adminStore.createCategory(categoryForm.value)
  }
  categoryModal.value = false
}

const deleteCategory = (category) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?`)) {
    adminStore.deleteCategory(category.id)
  }
}

// Template management
const showTemplateModal = (template = null) => {
  if (template) {
    editingTemplate.value = template
    templateForm.value = { ...template }
  } else {
    editingTemplate.value = null
    templateForm.value = {
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
  templateModal.value = true
}

const saveTemplate = () => {
  if (editingTemplate.value) {
    // Update existing template
    const index = adminStore.templates.findIndex(t => t.id === editingTemplate.value.id)
    if (index !== -1) {
      adminStore.templates[index] = { ...adminStore.templates[index], ...templateForm.value }
    }
  } else {
    adminStore.createTemplate(templateForm.value)
  }
  templateModal.value = false
}

const deleteTemplate = (template) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le template "${template.name}" ?`)) {
    const index = adminStore.templates.findIndex(t => t.id === template.id)
    if (index !== -1) {
      adminStore.templates.splice(index, 1)
    }
  }
}

// Form helpers
const addObjective = () => {
  templateForm.value.content.objectives.push('')
}

const removeObjective = (index) => {
  templateForm.value.content.objectives.splice(index, 1)
}

const addOutlineItem = () => {
  templateForm.value.content.outline.push('')
}

const removeOutlineItem = (index) => {
  templateForm.value.content.outline.splice(index, 1)
}
</script> 