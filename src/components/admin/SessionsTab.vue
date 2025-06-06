<template>
  <div class="sessions-tab">
    <!-- Filtres et bouton d'ajout -->
    <SessionFilters
      :filters="sessionFilter"
      :course-types="adminStore.courseTypes || []"
      :categories="adminStore.categories || []"
      @update:course-type="sessionFilter.courseType = $event"
      @update:category="sessionFilter.category = $event"
      @update:status="sessionFilter.status = $event"
      @update:search="sessionFilter.search = $event"
      @create-session="showSessionModal()"
    />

    <!-- Liste des sessions -->
    <SessionsList
      :sessions="filteredSessions"
      :categories="adminStore.categories || []"
      :resources="adminStore.resources || []"
      @edit-session="showSessionModal"
      @delete-session="deleteSession"
      @duplicate-session="duplicateSession"
      @view-session="showSessionDetails"
      @send-notification="sendSessionNotification"
    />

    <!-- Modal de création/édition -->
    <SessionModal
      v-model:show="sessionModal"
      v-model:session="sessionForm"
      :editing-session="editingSession"
      :categories="adminStore.categories || []"
      :teachers="adminStore.teachers || []"
      :available-resources="availableResources"
      @save="saveSession"
      @close="closeSessionModal"
    />

    <!-- Modal de détails -->
    <SessionDetailModal
      v-model:show="detailModal"
      :session="detailSession"
      :categories="adminStore.categories"
      :resources="adminStore.resources"
      @close="detailModal = false"
    />

    <!-- Modal de confirmation de suppression -->
    <div v-if="deleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Confirmer la suppression</h3>
        <p class="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer cette session ? Cette action est irréversible.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="cancelDelete"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            @click="confirmDelete"
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
import { ref, computed, onMounted, watch } from 'vue'
import { useAdminStore } from '@/stores/admin'
import SessionFilters from './sessions/SessionFilters.vue'
import SessionsList from './sessions/SessionsList.vue'
import SessionModal from './sessions/SessionModal.vue'
import SessionDetailModal from './sessions/SessionDetailModal.vue'

// Props
const props = defineProps({
  openCreateModal: {
    type: Boolean,
    default: false
  }
})

// Store
const adminStore = useAdminStore()

// État local
const sessionModal = ref(false)
const detailModal = ref(false)
const deleteModal = ref(false)
const editingSession = ref(null)
const detailSession = ref(null)
const sessionToDelete = ref(null)

// Filtres
const sessionFilter = ref({
  courseType: '',
  category: '',
  status: '',
  search: ''
})

// Formulaire de session
const sessionForm = ref({
  name: '',
  category_id: '',
  course_type_id: '',
  teacher_id: '',
  date: '',
  time: '',
  level: 'Débutant',
  duration: 60,
  max_students: 8,
  meeting_link: '',
  template_id: '',
  content: {
    description: '',
    learning_objectives: [''],
    prerequisites: [''],
    session_outline: [{ title: '', duration: '', content: '' }]
  },
  resources: []
})

// Computed
const filteredSessions = computed(() => {
  let sessions = adminStore.sessions || []
  
  // Filtrage par type de cours
  if (sessionFilter.value.courseType) {
    const courseTypeMap = {
      'conversation': 'Conversation Club',
      'grammar': 'Grammar Workshop',
      'pronunciation': 'Pronunciation',
      'evaluation': 'Level Evaluation'
    }
    const courseTypeName = courseTypeMap[sessionFilter.value.courseType]
    sessions = sessions.filter(session => {
      const courseType = adminStore.courseTypes.find(ct => ct.id === session.course_type_id)
      return courseType && courseType.name === courseTypeName
    })
  }
  
  // Filtrage par catégorie
  if (sessionFilter.value.category) {
    // Ligne 148 - Correction du filtre
    sessions = sessions.filter(session => session.categoryId === sessionFilter.value.category)
    
    // SUPPRIMEZ CES LIGNES :
    // const sessionFilter = ref({
    //   category: '',
    //   categoryId: '',
    //   teacher: '',
    //   teacherId: '',
    //   level: '',
    //   type: '',
    //   status: '',
    //   maxStudents: 8,
    //   meetingLink: '',
    // })
    // 
    // const sessionForm = ref({
    //   name: '',
    //   categoryId: '',
    //   type: '',
    //   teacherId: '',
    //   date: '',
    //   time: '',
    //   level: '',
    //   maxStudents: 8,
    //   meetingLink: '',
    //   content: {
    //     description: '',
    //     objectives: [''],
    //     prerequisites: [''],
    //     outline: ['']
    //   }
    // })
  }
  
  // Filtrage par statut
  if (sessionFilter.value.status) {
    sessions = sessions.filter(session => session.status === sessionFilter.value.status)
  }
  
  // Filtrage par recherche
  if (sessionFilter.value.search) {
    const searchTerm = sessionFilter.value.search.toLowerCase()
    sessions = sessions.filter(session => 
      session.name.toLowerCase().includes(searchTerm) ||
      session.teacher_name?.toLowerCase().includes(searchTerm)
    )
  }
  
  return sessions
})

const availableResources = computed(() => {
  return adminStore.resources || []
})

// Watchers
watch(() => props.openCreateModal, (newVal) => {
  if (newVal) {
    showSessionModal()
  }
})

// Méthodes
const showSessionModal = (session = null) => {
  editingSession.value = session
  
  if (session) {
    // Mode édition
    let date = '', time = ''
    if (session.dateTime || session.date_time) {
      const dateObj = new Date(session.dateTime || session.date_time)
      if (!isNaN(dateObj.getTime())) {
        date = dateObj.toISOString().split('T')[0]
        time = dateObj.toTimeString().slice(0, 5)
      }
    }
    
    sessionForm.value = {
      name: session.name || '',
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
        description: session.description || '',
        // ✅ Charger depuis les nouvelles colonnes
        objectives: session.learning_objectives?.length ? [...session.learning_objectives] : [''],
        prerequisites: session.prerequisites?.length ? [...session.prerequisites] : [''],
        outline: session.content?.outline?.length ? [...session.content.outline] : ['']
      }
    }
  } else {
    // Mode création
    sessionForm.value = {
      name: '',
      category_id: '',
      course_type_id: '',
      teacher_id: '',
      date: '',
      time: '',
      level: 'Débutant',
      duration: 60,
      max_students: 8,
      meeting_link: '',
      template_id: '',
      content: {
        description: '',
        learning_objectives: [''],
        prerequisites: [''],
        session_outline: [{ title: '', duration: '', content: '' }]
      },
      resources: []
    }
  }
  
  sessionModal.value = true
}

const closeSessionModal = () => {
  sessionModal.value = false
  editingSession.value = null
}

const saveSession = async (formData) => {
  try {
    // Vérifier que les champs date et time sont définis
    if (!formData.date || !formData.time) {
      console.error('Date et heure sont requises');
      return;
    }

    // Filtrer les objectifs et prérequis vides
    const objectives = formData.content?.objectives?.filter(obj => obj.trim() !== '') || []
    const prerequisites = formData.content?.prerequisites?.filter(prereq => prereq.trim() !== '') || []

    const sessionData = {
      name: formData.name,
      description: formData.content?.description || '',
      teacher_id: formData.teacherId,
      category_id: formData.categoryId,
      date_time: `${formData.date}T${formData.time}:00`,
      duration: formData.duration,
      max_students: formData.maxStudents,
      level: formData.level,
      type: formData.type,
      status: 'scheduled',
      meeting_link: formData.meetingLink || null,
      learning_objectives: objectives, // ✅ Nouvelle colonne
      prerequisites: prerequisites     // ✅ Nouvelle colonne
    }
    
    if (editingSession.value) {
      await adminStore.updateSession(editingSession.value.id, sessionData)
    } else {
      await adminStore.createSession(sessionData)
    }
    
    closeSessionModal()
    await adminStore.loadSessions()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  }
}

const deleteSession = (session) => {
  sessionToDelete.value = session
  deleteModal.value = true
}

const confirmDelete = async () => {
  if (sessionToDelete.value) {
    try {
      await adminStore.deleteSession(sessionToDelete.value.id)
      deleteModal.value = false
      sessionToDelete.value = null
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

const cancelDelete = () => {
  deleteModal.value = false
  sessionToDelete.value = null
}

const duplicateSession = async (session) => {
  try {
    const duplicatedSession = {
      ...session,
      name: `${session.name} (Copie)`,
      date: '',
      time: ''
    }
    delete duplicatedSession.id
    await adminStore.createSession(duplicatedSession)
  } catch (error) {
    console.error('Erreur lors de la duplication:', error)
  }
}

const showSessionDetails = (session) => {
  detailSession.value = session
  detailModal.value = true
}

const sendSessionNotification = async (session) => {
  try {
    // Logique d'envoi de notification
    console.log('Envoi de notification pour la session:', session.name)
  } catch (error) {
    console.error('Erreur lors de l\'envoi de notification:', error)
  }
}

// Lifecycle
onMounted(() => {
  adminStore.loadSessions()
  adminStore.loadCategories()
  adminStore.loadCourseTypes()
  adminStore.loadResources()
  adminStore.loadTeachers()  // ✅ Ajout de cette ligne
})
</script>

<style scoped>
.sessions-tab {
  @apply space-y-6;
}
</style>