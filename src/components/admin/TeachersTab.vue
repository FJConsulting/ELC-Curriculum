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
            @click="checkTeacherSessions"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
    <!-- Ajouter cette modal après la modal de confirmation de suppression -->
    <!-- Modal de gestion des sessions -->
    <div v-if="showSessionsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-red-600">
            ⚠️ Impossible de supprimer le professeur
          </h3>
          <p class="text-gray-600 mt-2">
            Ce professeur a {{ teacherSessions.length }} session(s) associée(s). Vous devez d'abord gérer ces sessions.
          </p>
        </div>
        
        <div class="flex-1 overflow-y-auto p-6">
          <div class="space-y-4">
            <div v-for="session in teacherSessions" :key="session.id" class="border border-gray-200 rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-medium">{{ session.name }}</h4>
                  <p class="text-sm text-gray-600">
                    {{ session.date }} de {{ session.start_time }} à {{ session.end_time }}
                  </p>
                  <span class="inline-block px-2 py-1 text-xs rounded-full mt-2" 
                        :class="{
                          'bg-green-100 text-green-800': session.status === 'scheduled',
                          'bg-blue-100 text-blue-800': session.status === 'completed',
                          'bg-red-100 text-red-800': session.status === 'cancelled'
                        }">
                    {{ session.status }}
                  </span>
                </div>
                <div class="ml-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Réassigner à :
                  </label>
                  <select 
                    v-model="reassignmentData[session.id]"
                    class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Choisir un professeur</option>
                    <option v-for="teacher in availableTeachers" :key="teacher.id" :value="teacher.id">
                      {{ teacher.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-6 border-t border-gray-200 flex justify-between">
          <button 
            @click="showSessionsModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          
          <div class="space-x-3">
            <button 
              @click="deleteAllSessions"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Supprimer toutes les sessions
            </button>
            <button 
              @click="reassignAllSessions"
              :disabled="!Object.values(reassignmentData).some(Boolean)"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Réassigner et supprimer le professeur
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useAdminStore } from '@/stores/admin'
// Décommenter cette ligne pour afficher l'icône de suppression
import { Trash as TrashIcon } from 'lucide-vue-next'

// Props
const props = defineProps({
  openCreateTeacherModal: {
    type: Boolean,
    default: false
  }
})

const adminStore = useAdminStore()

// Variables réactives principales - À déclarer AVANT le watcher
const teacherModal = ref(false)
const editingTeacher = ref(null)
const showDeleteConfirmation = ref(false)
const showSessionsModal = ref(false)
const teacherSessions = ref([])
const availableTeachers = ref([])
const reassignmentData = ref({})

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

// Ajouter ces nouvelles fonctions après saveTeacher
const checkTeacherSessions = async () => {
  if (!editingTeacher.value) return
  
  try {
    const result = await adminStore.getTeacherSessions(editingTeacher.value.id)
    
    // La structure correcte est result.data qui contient { sessions, summary }
    if (result && result.data) {
      const { sessions, summary } = result.data
      
      // Vérifier s'il y a des sessions (particulièrement des sessions futures)
      if (sessions && sessions.length > 0) {
        console.log('Sessions trouvées:', sessions.length, 'dont', summary.future_sessions, 'futures')
        
        // Afficher la modale même s'il n'y a que des sessions passées
        // pour que l'utilisateur puisse voir toutes les sessions
        teacherSessions.value = sessions
        availableTeachers.value = adminStore.teachers.filter(t => t.id !== editingTeacher.value.id)
        showSessionsModal.value = true
        showDeleteConfirmation.value = false
      } else {
        // Aucune session, procéder à la suppression directe
        console.log('Aucune session trouvée, suppression directe')
        await deleteTeacher()
      }
    } else {
      // Aucune session trouvée, procéder à la suppression directe
      console.log('Résultat vide, suppression directe')
      await deleteTeacher()
    }
  } catch (err) {
    console.error('Erreur vérification sessions:', err)
    alert('Erreur lors de la vérification des sessions: ' + err.message)
  }
}

const reassignAllSessions = async () => {
  try {
    const promises = teacherSessions.value.map(session => {
      const newTeacherId = reassignmentData.value[session.id]
      if (newTeacherId) {
        return adminStore.reassignSession(session.id, newTeacherId)
      }
    }).filter(Boolean)
    
    await Promise.all(promises)
    
    // Maintenant supprimer le professeur
    await deleteTeacher()
    
    showSessionsModal.value = false
  } catch (err) {
    console.error('Erreur réassignation:', err)
    alert('Erreur lors de la réassignation: ' + err.message)
  }
}

const deleteAllSessions = async () => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer toutes les sessions de ce professeur ? Cette action est irréversible.')) {
    return
  }
  
  try {
    const promises = teacherSessions.value.map(session => 
      adminStore.deleteSession(session.id)
    )
    
    await Promise.all(promises)
    
    // Maintenant supprimer le professeur
    await deleteTeacher()
    
    showSessionsModal.value = false
  } catch (err) {
    console.error('Erreur suppression sessions:', err)
    alert('Erreur lors de la suppression des sessions: ' + err.message)
  }
}

// Modifier la fonction deleteTeacher existante
const deleteTeacher = async () => {
  if (!editingTeacher.value) return
  
  try {
    await adminStore.deleteTeacher(editingTeacher.value.id)
    
    // Fermer toutes les modales
    showDeleteConfirmation.value = false
    showSessionsModal.value = false
    teacherModal.value = false
    editingTeacher.value = null
    
    alert('Professeur supprimé avec succès')
  } catch (err) {
    console.error('Erreur suppression:', err)
    alert('Erreur lors de la suppression: ' + err.message)
  }
}

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
</script>