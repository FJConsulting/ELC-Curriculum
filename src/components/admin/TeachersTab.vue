<template>
  <div class="space-y-6">
    <!-- Add Teacher Button -->
    <div class="flex justify-end">
      <button 
        @click="showTeacherModal()"
        class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
      >
        <span class="text-white text-lg font-bold">+</span> Ajouter un professeur
      </button>
    </div>

    <!-- Teachers Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="teacher in adminStore.teachers" 
        :key="teacher.id"
        class="bg-white rounded-xl shadow-sm p-6"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
              <span class="text-2xl font-medium">{{ teacher.name.charAt(0) }}</span>
            </div>
            <div>
              <h3 class="text-lg font-semibold">{{ teacher.name }}</h3>
              <p class="text-sm text-gray-600">{{ teacher.email }}</p>
              <div class="flex items-center mt-1">
                <span class="text-yellow-500">⭐</span>
                <span class="text-sm font-medium ml-1">{{ teacher.rating }}/5</span>
              </div>
            </div>
          </div>
          <button 
            @click="showTeacherModal(teacher)"
            class="text-primary-600 hover:text-primary-800"
          >
            ✏️
          </button>
        </div>
        
        <div class="space-y-2 text-sm">
          <div>
            <span class="font-medium">Spécialités :</span>
            <span class="ml-2">{{ teacher.specialities.join(', ') }}</span>
          </div>
          <div>
            <span class="font-medium">Langues :</span>
            <span class="ml-2">{{ teacher.languages.join(', ') }}</span>
          </div>
          <div>
            <span class="font-medium">Expérience :</span>
            <span class="ml-2">{{ teacher.experience }}</span>
          </div>
          <div>
            <span class="font-medium">Disponibilité :</span>
            <span class="ml-2">{{ teacher.availability.join(', ') }}</span>
          </div>
        </div>
        
        <div class="mt-4 pt-4 border-t border-gray-200">
          <div class="grid grid-cols-2 gap-4 text-center">
            <div>
              <p class="text-2xl font-bold">{{ getTeacherStats(teacher.id).totalSessions }}</p>
              <p class="text-xs text-gray-600">Sessions totales</p>
            </div>
            <div>
              <p class="text-2xl font-bold">{{ getTeacherStats(teacher.id).totalStudents }}</p>
              <p class="text-xs text-gray-600">Étudiants</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Teacher Modal -->
    <div v-if="teacherModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-2xl w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold">
            {{ editingTeacher ? 'Modifier le professeur' : 'Nouveau professeur' }}
          </h3>
          <!-- Bouton de suppression (seulement en mode édition) -->
          <button 
            v-if="editingTeacher"
            @click="showDeleteConfirmation = true"
            class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Supprimer le professeur"
          >
            <TrashIcon class="w-5 h-5" />
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input 
              v-model="teacherForm.name"
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Ex: Sarah Johnson"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              v-model="teacherForm.email"
              type="email" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="professor@elc.com"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Expérience</label>
            <input 
              v-model="teacherForm.experience"
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Ex: 10 ans"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Note initiale</label>
            <input 
              v-model.number="teacherForm.rating"
              type="number" 
              min="0"
              max="5"
              step="0.1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="4.5"
            >
          </div>
        </div>
        
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea 
            v-model="teacherForm.bio"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Description du professeur..."
          ></textarea>
        </div>
        
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Spécialités</label>
          <div class="flex flex-wrap gap-2">
            <label v-for="spec in ['Grammar', 'Conversation', 'Business English', 'Culture', 'Exam Preparation', 'Writing']" :key="spec" class="flex items-center">
              <input 
                type="checkbox" 
                :value="spec"
                v-model="teacherForm.specialities"
                class="mr-2"
              >
              <span class="text-sm">{{ spec }}</span>
            </label>
          </div>
        </div>
        
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Langues parlées</label>
          <div class="flex flex-wrap gap-2">
            <label v-for="lang in ['English', 'French', 'Spanish', 'German', 'Italian']" :key="lang" class="flex items-center">
              <input 
                type="checkbox" 
                :value="lang"
                v-model="teacherForm.languages"
                class="mr-2"
              >
              <span class="text-sm">{{ lang }}</span>
            </label>
          </div>
        </div>
        
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Disponibilité</label>
          <div class="flex flex-wrap gap-2">
            <label v-for="day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']" :key="day" class="flex items-center">
              <input 
                type="checkbox" 
                :value="day"
                v-model="teacherForm.availability"
                class="mr-2"
              >
              <span class="text-sm">{{ day }}</span>
            </label>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button 
            @click="teacherModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            @click="saveTeacher"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {{ editingTeacher ? 'Mettre à jour' : 'Créer' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modale de confirmation de suppression -->
    <div v-if="showDeleteConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-md w-full p-6">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <TrashIcon class="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Supprimer le professeur</h3>
            <p class="text-sm text-gray-600">Cette action est irréversible</p>
          </div>
        </div>
        
        <p class="text-gray-700 mb-6">
          Êtes-vous sûr de vouloir supprimer <strong>{{ editingTeacher?.name }}</strong> ?
          Toutes les données associées seront définitivement supprimées.
        </p>
        
        <div class="flex justify-end space-x-3">
          <button 
            @click="showDeleteConfirmation = false"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            @click="deleteTeacher"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useAdminStore } from '@/stores/admin-supabase'
import { Trash as TrashIcon } from 'lucide-vue-next'

// Props
const props = defineProps({
  openCreateTeacherModal: {
    type: Boolean,
    default: false
  }
})

const adminStore = useAdminStore()

// Watcher pour ouvrir la modale automatiquement avec système de renforcement
watch(() => props.openCreateTeacherModal, async (newValue) => {
  if (newValue) {
    await nextTick()
    // Premier essai
    showTeacherModal()
    
    // Système de renforcement - vérifier si la modale s'est bien ouverte
    setTimeout(() => {
      if (!teacherModal.value) {
        console.log('Renforcement: tentative d\'ouverture de la modale professeur')
        showTeacherModal()
      }
    }, 200)
  }
})

// État local
const teacherModal = ref(false)
const editingTeacher = ref(null)
const showDeleteConfirmation = ref(false)  // ← Ajouter cette ligne

const teacherForm = ref({
  name: '',
  email: '',
  experience: '',
  rating: 4.5,
  bio: '',
  specialities: [],
  languages: [],
  availability: []
})

// Methods
const getTeacherStats = (teacherId) => {
  return adminStore.getTeacherStats(teacherId)
}

const showTeacherModal = (teacher = null) => {
  if (teacher) {
    editingTeacher.value = teacher
    teacherForm.value = { ...teacher }
  } else {
    editingTeacher.value = null
    teacherForm.value = {
      name: '',
      email: '',
      experience: '',
      rating: 4.5,
      bio: '',
      specialities: [],
      languages: [],
      availability: []
    }
  }
  teacherModal.value = true
}

const saveTeacher = async () => {
  if (editingTeacher.value) {
    await adminStore.updateTeacher(editingTeacher.value.id, teacherForm.value)
  } else {
    await adminStore.addTeacher(teacherForm.value)
  }
  
  teacherModal.value = false
  await adminStore.loadTeachers()
}

// Fonction de suppression
const deleteTeacher = async () => {
  if (!editingTeacher.value) return
  
  await adminStore.deleteTeacher(editingTeacher.value.id)
  
  // Fermer toutes les modales
  showDeleteConfirmation.value = false
  teacherModal.value = false
  editingTeacher.value = null
}
</script>