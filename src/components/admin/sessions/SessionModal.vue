<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
      <h3 class="text-xl font-semibold mb-4">
        {{ editingSession ? 'Modifier la session' : 'Nouvelle session' }}
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Basic Info -->
        <div class="space-y-4">
          <h4 class="font-medium text-gray-700">Informations de base</h4>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom de la session</label>
            <input 
              v-model="form.name"
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Ex: Session de grammaire avancée"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select 
              v-model="form.categoryId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.icon }} {{ cat.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select 
              v-model="form.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="course">Cours collectif</option>
              <option value="grammar">Atelier grammaire</option>
              <option value="conversation">Club conversation</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Professeur</label>
            <select 
              v-model="form.teacherId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                {{ teacher.name }}
              </option>
            </select>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                v-model="form.date"
                type="date" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Heure</label>
              <input 
                v-model="form.time"
                type="time" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
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
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Durée (min)</label>
              <input 
                v-model.number="form.duration"
                type="number" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="60"
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre max d'étudiants</label>
            <input 
              v-model.number="form.maxStudents"
              type="number" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="5"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Lien de visioconférence</label>
            <input 
              v-model="form.meetingLink"
              type="url" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="https://meet.elc-academy.com/..."
            >
            <p class="text-xs text-gray-500 mt-1">
              Sera visible par les étudiants 15 minutes avant la session
            </p>
          </div>

          <!-- Apply Template -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Appliquer un template</label>
            <select 
              @change="applyTemplate($event.target.value)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">-- Choisir un template --</option>
              <option v-for="template in templates" :key="template.id" :value="template.id">
                {{ template.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Content Details -->
        <div class="space-y-4">
          <h4 class="font-medium text-gray-700">Contenu de la session</h4>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              v-model="form.content.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Description détaillée de la session..."
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Objectifs d'apprentissage</label>
            <div class="space-y-2">
              <div 
                v-for="(obj, index) in form.content.objectives" 
                :key="index"
                class="flex items-center space-x-2"
              >
                <input 
                  v-model="form.content.objectives[index]"
                  type="text" 
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Objectif d'apprentissage"
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Prérequis</label>
            <div class="space-y-2">
              <div 
                v-for="(prereq, index) in form.content.prerequisites" 
                :key="index"
                class="flex items-center space-x-2"
              >
                <input 
                  v-model="form.content.prerequisites[index]"
                  type="text" 
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Prérequis nécessaire"
                >
                <button 
                  @click="removePrerequisite(index)"
                  class="text-red-600 hover:text-red-800"
                >
                  ❌
                </button>
              </div>
              <button 
                @click="addPrerequisite"
                class="text-primary-600 hover:text-primary-800 text-sm"
              >
                ➕ Ajouter un prérequis
              </button>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Plan de la session</label>
            <div class="space-y-2">
              <div 
                v-for="(item, index) in form.content.outline" 
                :key="index"
                class="flex items-center space-x-2"
              >
                <input 
                  v-model="form.content.outline[index]"
                  type="text" 
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Étape du plan"
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
      </div>

      <!-- Resources Section -->
      <div v-if="editingSession" class="mt-6 pt-6 border-t border-gray-200">
        <h4 class="font-medium text-gray-700 mb-4">Ressources associées</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="border border-gray-200 rounded-lg p-4">
            <h5 class="font-medium mb-2">Ressources disponibles</h5>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <div 
                v-for="resource in availableResources" 
                :key="resource.id"
                class="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
              >
                <div class="flex items-center">
                  <span class="mr-2">{{ getResourceIcon(resource.type) }}</span>
                  <span class="text-sm">{{ resource.name }}</span>
                </div>
                <button 
                  @click="$emit('add-resource', resource.id)"
                  class="text-primary-600 hover:text-primary-800"
                >
                  ➕
                </button>
              </div>
            </div>
          </div>
          
          <div class="border border-gray-200 rounded-lg p-4">
            <h5 class="font-medium mb-2">Ressources de la session</h5>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <div 
                v-for="resource in sessionResources" 
                :key="resource.id"
                class="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
              >
                <div class="flex items-center">
                  <span class="mr-2">{{ getResourceIcon(resource.type) }}</span>
                  <span class="text-sm">{{ resource.name }}</span>
                </div>
                <button 
                  @click="$emit('remove-resource', resource.id)"
                  class="text-red-600 hover:text-red-800"
                >
                  ❌
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-6 flex justify-between">
        <div>
          <button 
            v-if="editingSession && editingSession.status === 'scheduled'"
            @click="$emit('send-notification')"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            📧 Notifier les étudiants
          </button>
        </div>
        <div class="flex space-x-3">
          <button 
            @click="$emit('close')"
            class="px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50"
          >
            Annuler
          </button>
          <button 
            @click="$emit('save', form)"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {{ editingSession ? 'Mettre à jour' : 'Créer' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  editingSession: {
    type: Object,
    default: null
  },
  categories: {
    type: Array,
    default: () => []
  },
  teachers: {
    type: Array,
    default: () => []
  },
  templates: {
    type: Array,
    default: () => []
  },
  availableResources: {
    type: Array,
    default: () => []
  },
  sessionResources: {
    type: Array,
    default: () => []
  }
})

defineEmits([
  'close',
  'save',
  'add-resource',
  'remove-resource',
  'send-notification'
])

const form = ref({
  name: '',
  categoryId: 1,
  type: 'course',
  teacherId: 1,
  date: '',
  time: '',
  level: 'B1',
  duration: 60,
  maxStudents: 5,
  meetingLink: '',
  content: {
    description: '',
    objectives: [''],
    prerequisites: [''],
    outline: ['']
  }
})

// Watcher pour remplir le formulaire lors de l'édition
watch(() => props.editingSession, (session) => {
  if (session) {
    // Vérifier que dateTime existe et est valide
    let date = '', time = '';
    if (session.dateTime || session.date_time) {
      const dateObj = new Date(session.dateTime || session.date_time);
      if (!isNaN(dateObj.getTime())) {
        date = dateObj.toISOString().split('T')[0];
        time = dateObj.toTimeString().slice(0, 5);
      }
    }
    
    form.value = {
      name: session.name || session.title || '',
      categoryId: session.categoryId || session.category_id,
      type: session.type || 'course',
      teacherId: session.teacherId || session.teacher_id,
      date: date,
      time: time,
      level: session.level || 'B1',
      duration: session.duration || 60,
      maxStudents: session.maxStudents || session.max_students || 5,
      meetingLink: session.meetingLink || session.meeting_link || '',
      content: {
        description: session.content?.description || session.description || '',
        objectives: session.content?.objectives?.length ? [...session.content.objectives] : [''],
        prerequisites: session.content?.prerequisites?.length ? [...session.content.prerequisites] : [''],
        outline: session.content?.outline?.length ? [...session.content.outline] : ['']
      }
    }
  } else {
    // Reset form for new session
    form.value = {
      name: '',
      categoryId: 1,
      type: 'course',
      teacherId: 1,
      date: '',
      time: '',
      level: 'B1',
      duration: 60,
      maxStudents: 5,
      meetingLink: '',
      content: {
        description: '',
        objectives: [''],
        prerequisites: [''],
        outline: ['']
      }
    }
  }
}, { immediate: true })

// Méthodes utilitaires
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

// Gestion du contenu
const addObjective = () => {
  form.value.content.objectives.push('')
}

const removeObjective = (index) => {
  if (form.value.content.objectives.length > 1) {
    form.value.content.objectives.splice(index, 1)
  }
}

const addPrerequisite = () => {
  form.value.content.prerequisites.push('')
}

const removePrerequisite = (index) => {
  if (form.value.content.prerequisites.length > 1) {
    form.value.content.prerequisites.splice(index, 1)
  }
}

const addOutlineItem = () => {
  form.value.content.outline.push('')
}

const removeOutlineItem = (index) => {
  if (form.value.content.outline.length > 1) {
    form.value.content.outline.splice(index, 1)
  }
}

const applyTemplate = (templateId) => {
  if (!templateId) return
  
  const template = props.templates.find(t => t.id === parseInt(templateId))
  if (template) {
    form.value.duration = template.duration
    form.value.maxStudents = template.maxStudents
    form.value.content = { ...template.content }
  }
}
</script>