<template>
  <div class="space-y-6">
    <!-- Course Types Management -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Types de cours</h3>
        <button 
          @click="showCourseTypeModal()"
          class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 min-w-[180px] justify-center"
        >
          <span class="text-white text-lg font-bold">+</span> Nouveau type
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="courseType in adminStore.courseTypes" 
          :key="courseType.id"
          class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div class="flex items-center">
              <span class="text-2xl mr-3">{{ courseType.icon }}</span>
              <div>
                <h4 class="font-medium">{{ courseType.name }}</h4>
                <p class="text-sm text-gray-600">{{ courseType.description }}</p>
                <p class="text-xs text-gray-500 mt-1">Route: {{ courseType.route }}</p>
              </div>
            </div>
            <div class="flex space-x-2">
              <button 
                @click="showCourseTypeModal(courseType)"
                class="text-primary-600 hover:text-primary-800"
              >
                ✏️
              </button>
              <button 
                @click="deleteCourseType(courseType)"
                class="text-red-600 hover:text-red-800"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Categories Management -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Catégories de cours</h3>
        <button 
          @click="showCategoryModal()"
          class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 min-w-[180px] justify-center"
        >
          <span class="text-white text-lg font-bold">+</span> Nouvelle catégorie
        </button>
      </div>
      
      <!-- Section de filtres supprimée -->
      
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
          class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 min-w-[180px] justify-center"
        >
          <span class="text-white text-lg font-bold">+</span> Nouveau template
        </button>
      </div>
      
      <!-- Ajout des filtres pour les templates -->
      <div class="bg-gray-50 rounded-lg p-4 mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <select 
            v-model="templateFilter.category"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Toutes les catégories</option>
            <option v-for="cat in adminStore.categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
          <select 
            v-model="templateFilter.level"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Tous les niveaux</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
            <option value="C2">C2</option>
          </select>
          <input 
            v-model="templateFilter.search"
            type="text"
            placeholder="Rechercher un template..."
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 flex-1"
          >
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <div class="bg-white rounded-xl max-w-lg w-full max-h-[90vh] flex flex-col">
        <!-- Header fixe -->
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-xl font-semibold">
            {{ editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}
          </h3>
        </div>
        
        <!-- Contenu scrollable -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4">
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
                v-for="icon in availableIcons"
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
            
            <!-- Section pour ajouter un nouvel icône -->
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
        
        <!-- Boutons avec padding approprié -->
        <div class="p-6 border-t border-gray-200 flex justify-end space-x-3">
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

    <!-- Course Type Modal -->
    <div v-if="courseTypeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-lg w-full max-h-[90vh] flex flex-col">
        <!-- Header fixe -->
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-xl font-semibold">
            {{ editingCourseType ? 'Modifier le type de cours' : 'Nouveau type de cours' }}
          </h3>
        </div>
        
        <!-- Contenu scrollable -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input 
              v-model="courseTypeForm.name"
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Ex: Cours collectifs"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              v-model="courseTypeForm.description"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Ex: Groupes de 5 personnes max"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Slug (identifiant unique)</label>
            <input
              v-model="courseTypeForm.slug"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Ex: courses"
            >
            <p class="text-xs text-gray-500 mt-1">
              L'identifiant unique sera utilisé pour générer la route automatiquement
            </p>
          </div>
          
          <div class="mt-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Route générée</label>
            <div class="px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-600">
              /{{ courseTypeForm.slug || 'slug-du-cours' }}
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Icône</label>
            <div class="grid grid-cols-6 gap-2">
              <button 
                v-for="icon in availableIcons"
                :key="icon"
                @click="courseTypeForm.icon = icon"
                :class="[
                  courseTypeForm.icon === icon ? 'ring-2 ring-primary-500' : '',
                  'p-3 text-2xl rounded-lg hover:bg-gray-100'
                ]"
              >
                {{ icon }}
              </button>
            </div>
            
            <!-- Section pour ajouter un nouvel icône -->
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
          
          <!-- Fonctionnalités spéciales -->
          <div class="mt-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Fonctionnalités spéciales</h4>
            
            <div class="space-y-3 bg-gray-50 p-3 rounded-lg">
              <!-- Tips personnalisés -->
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="enableTips"
                  v-model="courseTypeForm.features.enableTips"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                >
                <label for="enableTips" class="ml-2 block text-sm text-gray-700">
                  Activer les conseils personnalisés
                </label>
              </div>
              
              <!-- Contenu spécifique -->
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="enableSpecialContent"
                  v-model="courseTypeForm.features.enableSpecialContent"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                >
                <label for="enableSpecialContent" class="ml-2 block text-sm text-gray-700">
                  Activer le contenu spécifique à ce type
                </label>
              </div>
              
              <!-- Texte personnalisé -->
              <div v-if="courseTypeForm.features.enableSpecialContent">
                <label class="block text-sm font-medium text-gray-700 mb-1">Texte "Comment ça marche ?"</label>
                <textarea
                  v-model="courseTypeForm.features.howItWorks"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Expliquez comment fonctionne ce type de cours..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Boutons avec padding approprié -->
        <div class="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            @click="courseTypeModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            @click="saveCourseType"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {{ editingCourseType ? 'Mettre à jour' : 'Créer' }}
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
import { ref, computed } from 'vue'
import { useAdminStore } from '@/stores/admin-supabase'

const adminStore = useAdminStore()

// État local
const categoryModal = ref(false)
const templateModal = ref(false)
const editingCategory = ref(null)
const editingTemplate = ref(null)
const newIconInput = ref('')
const availableIcons = ref(['📚', '✏️', '💬', '📝', '💼', '🌍', '🎓', '🎯', '📖', '🎤', '🎨', '🔬', '🎭', '🏆', '📊', '🎵', '🖼️', '📄', '🎥', '📱', '💻', '🔧', '⚡', '🌟'])

// Filtres
const categoryFilter = ref({
  type: '',
  level: '',
  search: ''
})

const templateFilter = ref({
  category: '',
  level: '',
  search: ''
})

// Computed pour les catégories filtrées
const filteredCategories = computed(() => {
  let categories = adminStore.categories || []
  
  if (categoryFilter.value.type) {
    categories = categories.filter(cat => cat.type === categoryFilter.value.type)
  }
  
  if (categoryFilter.value.level) {
    categories = categories.filter(cat => cat.level === categoryFilter.value.level)
  }
  
  if (categoryFilter.value.search) {
    const search = categoryFilter.value.search.toLowerCase()
    categories = categories.filter(cat => 
      cat.name.toLowerCase().includes(search) ||
      cat.description.toLowerCase().includes(search)
    )
  }
  
  return categories
})

// Computed pour les templates filtrés
const filteredTemplates = computed(() => {
  let templates = adminStore.templates || []
  
  if (templateFilter.value.category) {
    templates = templates.filter(template => template.categoryId === templateFilter.value.category)
  }
  
  if (templateFilter.value.level) {
    templates = templates.filter(template => template.level === templateFilter.value.level)
  }
  
  if (templateFilter.value.search) {
    const search = templateFilter.value.search.toLowerCase()
    templates = templates.filter(template => 
      template.name.toLowerCase().includes(search) ||
      template.content.description.toLowerCase().includes(search)
    )
  }
  
  return templates
})

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

// Gestion des icônes personnalisés
const addNewIcon = () => {
  const newIcon = newIconInput.value.trim()
  if (newIcon && !availableIcons.value.includes(newIcon)) {
    availableIcons.value.push(newIcon)
    categoryForm.value.icon = newIcon
    newIconInput.value = ''
  }
}
// Dans la section script, ajouter :
const courseTypeModal = ref(false)
const editingCourseType = ref(null)
const courseTypeForm = ref({
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

// Méthodes pour les types de cours
const showCourseTypeModal = (courseType = null) => {
  editingCourseType.value = courseType
  if (courseType) {
    courseTypeForm.value = { ...courseType }
  } else {
    courseTypeForm.value = {
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
  courseTypeModal.value = true
}

const saveCourseType = async () => {
  try {
    // Générer la route à partir du slug
    const formData = { ...courseTypeForm.value }
    
    // S'assurer que le slug est valide
    if (formData.slug) {
      formData.slug = formData.slug
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
      
      // Générer la route à partir du slug
      formData.route = `/${formData.slug}`
    } else if (formData.name) {
      // Générer le slug à partir du nom si non fourni
      formData.slug = formData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
      
      formData.route = `/${formData.slug}`
    }
    
    // Vérifier l'unicité du slug
    const existingCourseType = adminStore.courseTypes.find(
      ct => ct.slug === formData.slug && (!editingCourseType.value || ct.id !== editingCourseType.value.id)
    )
    
    if (existingCourseType) {
      // Ajouter un suffixe numérique pour rendre le slug unique
      let counter = 1
      let baseSlug = formData.slug
      while (adminStore.courseTypes.some(
        ct => ct.slug === `${baseSlug}-${counter}` &&
             (!editingCourseType.value || ct.id !== editingCourseType.value.id)
      )) {
        counter++
      }
      formData.slug = `${baseSlug}-${counter}`
      formData.route = `/${formData.slug}`
    }
    
    if (editingCourseType.value) {
      await adminStore.updateCourseType(editingCourseType.value.id, formData)
    } else {
      await adminStore.createCourseType(formData)
    }
    
    courseTypeModal.value = false
    editingCourseType.value = null
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du type de cours:', error)
  }
}

const deleteCourseType = async (courseType) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le type "${courseType.name}" ?`)) {
    try {
      await adminStore.deleteCourseType(courseType.id)
    } catch (error) {
      console.error('Erreur lors de la suppression du type de cours:', error)
    }
  }
}
</script>