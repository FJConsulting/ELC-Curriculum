<template>
  <div class="space-y-6">
    <!-- Upload Section -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-semibold mb-4">Ajouter des ressources</h3>
      <div 
        @drop="handleDrop"
        @dragover.prevent
        @dragenter.prevent
        class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors"
      >
        <div class="text-gray-400">
          <span class="text-5xl">📁</span>
          <p class="mt-2">Glissez-déposez vos fichiers ici ou</p>
          <button 
            @click="showUploadModal = true"
            class="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Parcourir
          </button>
          <p class="text-sm text-gray-500 mt-2">
            Formats acceptés : PDF, MP4, MP3, PPT, DOC, JPG, PNG (Max 50MB)
          </p>
        </div>
      </div>
    </div>

    <!-- Resources Filters -->
    <div class="bg-white rounded-xl shadow-sm p-4">
      <div class="flex flex-col md:flex-row gap-4">
        <select 
          v-model="resourceFilter.type"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Tous les types</option>
          <option value="pdf">Documents PDF</option>
          <option value="video">Vidéos</option>
          <option value="audio">Audio</option>
          <option value="presentation">Présentations</option>
          <option value="document">Documents</option>
          <option value="image">Images</option>
        </select>
        
        <select 
          v-model="resourceFilter.session"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Toutes les sessions</option>
          <option value="unassigned">Non assignées</option>
          <option v-for="session in adminStore.sessions" :key="session.id" :value="session.id">
            {{ session.name }}
          </option>
        </select>
        
        <input 
          v-model="resourceFilter.search"
          type="text"
          placeholder="Rechercher une ressource..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
        
        <button 
          @click="adminStore.exportData('resources')"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          📥 Exporter
        </button>
      </div>
    </div>

    <!-- Resources Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total des ressources</p>
            <p class="text-2xl font-bold">{{ adminStore.resources.length }}</p>
          </div>
          <span class="text-3xl">📚</span>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Espace utilisé</p>
            <p class="text-2xl font-bold">{{ formatTotalSize() }}</p>
          </div>
          <span class="text-3xl">💾</span>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Téléchargements</p>
            <p class="text-2xl font-bold">{{ totalDownloads }}</p>
          </div>
          <span class="text-3xl">⬇️</span>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Ressources récentes</p>
            <p class="text-2xl font-bold">{{ recentResourcesCount }}</p>
          </div>
          <span class="text-3xl">🆕</span>
        </div>
      </div>
    </div>

    <!-- Resources Grid -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-semibold mb-4">Bibliothèque de ressources</h3>
      
      <!-- View Toggle -->
      <div class="flex justify-end mb-4">
        <div class="flex bg-gray-100 rounded-lg p-1">
          <button 
            @click="viewMode = 'grid'"
            :class="[
              viewMode === 'grid' ? 'bg-white shadow' : 'text-gray-600',
              'px-3 py-1 rounded transition-all'
            ]"
          >
            <span>⚏</span> Grille
          </button>
          <button 
            @click="viewMode = 'list'"
            :class="[
              viewMode === 'list' ? 'bg-white shadow' : 'text-gray-600',
              'px-3 py-1 rounded transition-all'
            ]"
          >
            <span>☰</span> Liste
          </button>
        </div>
      </div>
      
      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="resource in filteredResources" 
          :key="resource.id"
          class="border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        >
          <!-- Preview Area -->
          <div class="h-32 bg-gray-100 rounded-t-lg flex items-center justify-center">
            <span class="text-5xl">{{ getResourceIcon(resource.type) }}</span>
          </div>
          
          <!-- Info Area -->
          <div class="p-4">
            <h4 class="font-medium text-sm truncate">{{ resource.name }}</h4>
            <p class="text-xs text-gray-500 mt-1">
              {{ formatFileSize(resource.size) }} • {{ resource.downloads }} téléchargements
            </p>
            <p class="text-xs text-gray-500">
              Ajouté le {{ formatDate(resource.uploadedAt) }}
            </p>
            
            <div v-if="resource.sessionId" class="mt-2">
              <span class="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                {{ getSessionName(resource.sessionId) }}
              </span>
            </div>
            
            <div class="flex justify-between items-center mt-3">
              <div class="flex space-x-2">
                <button 
                  @click="previewResource(resource)"
                  class="text-gray-600 hover:text-gray-800"
                  title="Aperçu"
                >
                  👁️
                </button>
                <button 
                  @click="editResource(resource)"
                  class="text-primary-600 hover:text-primary-800"
                  title="Modifier"
                >
                  ✏️
                </button>
                <button 
                  @click="downloadResource(resource)"
                  class="text-blue-600 hover:text-blue-800"
                  title="Télécharger"
                >
                  ⬇️
                </button>
              </div>
              <button 
                @click="deleteResource(resource)"
                class="text-red-600 hover:text-red-800"
                title="Supprimer"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- List View -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ressource
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Taille
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Session
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Téléchargements
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date d'ajout
              </th>
              <th class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="resource in filteredResources" :key="resource.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="text-2xl mr-3">{{ getResourceIcon(resource.type) }}</span>
                  <span class="text-sm font-medium text-gray-900">{{ resource.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                  {{ resource.type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatFileSize(resource.size) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ resource.sessionId ? getSessionName(resource.sessionId) : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ resource.downloads }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(resource.uploadedAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button 
                    @click="previewResource(resource)"
                    class="text-gray-600 hover:text-gray-900"
                  >
                    👁️
                  </button>
                  <button 
                    @click="editResource(resource)"
                    class="text-primary-600 hover:text-primary-900"
                  >
                    ✏️
                  </button>
                  <button 
                    @click="downloadResource(resource)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    ⬇️
                  </button>
                  <button 
                    @click="deleteResource(resource)"
                    class="text-red-600 hover:text-red-900"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-2xl w-full p-6">
        <h3 class="text-xl font-semibold mb-4">Ajouter une ressource</h3>
        
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
              v-model="uploadForm.name"
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Ex: Guide de grammaire niveau B1"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              v-model="uploadForm.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Description de la ressource..."
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Associer à une session (optionnel)</label>
            <select 
              v-model="uploadForm.sessionId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">-- Aucune session --</option>
              <option v-for="session in adminStore.sessions" :key="session.id" :value="session.id">
                {{ session.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tags (séparés par des virgules)</label>
            <input 
              v-model="uploadForm.tags"
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Ex: grammaire, B1, exercises"
            >
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button 
            @click="showUploadModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            @click="uploadResource"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Télécharger
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="editModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-lg w-full p-6">
        <h3 class="text-xl font-semibold mb-4">Modifier la ressource</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input 
              v-model="editForm.name"
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              v-model="editForm.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Session associée</label>
            <select 
              v-model="editForm.sessionId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">-- Aucune session --</option>
              <option v-for="session in adminStore.sessions" :key="session.id" :value="session.id">
                {{ session.name }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button 
            @click="editModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            @click="saveResource"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="previewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold">Aperçu de la ressource</h3>
          <button 
            @click="previewModal = false"
            class="text-gray-500 hover:text-gray-700"
          >
            ✖️
          </button>
        </div>
        
        <div v-if="previewResource" class="space-y-4">
          <div class="bg-gray-100 rounded-lg p-8 text-center">
            <span class="text-8xl">{{ getResourceIcon(previewResource.type) }}</span>
            <h4 class="text-xl font-medium mt-4">{{ previewResource.name }}</h4>
            <p class="text-gray-600 mt-2">{{ previewResource.description || 'Aucune description' }}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-600">Type:</span>
              <span class="ml-2 font-medium">{{ previewResource.type }}</span>
            </div>
            <div>
              <span class="text-gray-600">Taille:</span>
              <span class="ml-2 font-medium">{{ formatFileSize(previewResource.size) }}</span>
            </div>
            <div>
              <span class="text-gray-600">Téléchargements:</span>
              <span class="ml-2 font-medium">{{ previewResource.downloads }}</span>
            </div>
            <div>
              <span class="text-gray-600">Ajouté le:</span>
              <span class="ml-2 font-medium">{{ formatDate(previewResource.uploadedAt) }}</span>
            </div>
          </div>
          
          <div class="flex justify-center mt-6">
            <button 
              @click="downloadResource(previewResource)"
              class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              ⬇️ Télécharger la ressource
            </button>
          </div>
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
const viewMode = ref('grid')
const showUploadModal = ref(false)
const editModal = ref(false)
const previewModal = ref(false)
const editingResource = ref(null)
const previewResourceData = ref(null)

const resourceFilter = ref({
  type: '',
  session: '',
  search: ''
})

const uploadForm = ref({
  name: '',
  description: '',
  sessionId: '',
  tags: '',
  file: null
})

const editForm = ref({
  name: '',
  description: '',
  sessionId: ''
})

// Computed
const filteredResources = computed(() => {
  let resources = adminStore.resources
  
  if (resourceFilter.value.type) {
    resources = resources.filter(r => r.type === resourceFilter.value.type)
  }
  
  if (resourceFilter.value.session === 'unassigned') {
    resources = resources.filter(r => !r.sessionId)
  } else if (resourceFilter.value.session) {
    resources = resources.filter(r => r.sessionId === parseInt(resourceFilter.value.session))
  }
  
  if (resourceFilter.value.search) {
    const search = resourceFilter.value.search.toLowerCase()
    resources = resources.filter(r => 
      r.name.toLowerCase().includes(search) ||
      (r.description && r.description.toLowerCase().includes(search))
    )
  }
  
  return resources.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
})

const totalDownloads = computed(() => {
  return adminStore.resources.reduce((sum, r) => sum + r.downloads, 0)
})

const recentResourcesCount = computed(() => {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  return adminStore.resources.filter(r => new Date(r.uploadedAt) > weekAgo).length
})

// Methods
const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const formatTotalSize = () => {
  const totalBytes = adminStore.resources.reduce((sum, r) => sum + (r.size || 0), 0)
  if (totalBytes < 1024 * 1024) return (totalBytes / 1024).toFixed(1) + ' KB'
  if (totalBytes < 1024 * 1024 * 1024) return (totalBytes / (1024 * 1024)).toFixed(1) + ' MB'
  return (totalBytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

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

const getSessionName = (sessionId) => {
  const session = adminStore.sessions.find(s => s.id === sessionId)
  return session ? session.name : 'Session inconnue'
}

// File handling
const handleDrop = (e) => {
  e.preventDefault()
  const files = e.dataTransfer.files
  if (files.length > 0) {
    handleFile(files[0])
  }
}

const handleFileSelect = (e) => {
  const files = e.target.files
  if (files.length > 0) {
    handleFile(files[0])
  }
}

const handleFile = (file) => {
  uploadForm.value.file = file
  uploadForm.value.name = file.name.replace(/\.[^/.]+$/, '') // Remove extension
  
  // Detect file type
  const extension = file.name.split('.').pop().toLowerCase()
  let type = 'document'
  
  if (['pdf'].includes(extension)) type = 'pdf'
  else if (['mp4', 'avi', 'mov'].includes(extension)) type = 'video'
  else if (['mp3', 'wav', 'ogg'].includes(extension)) type = 'audio'
  else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) type = 'image'
  else if (['ppt', 'pptx'].includes(extension)) type = 'presentation'
  
  showUploadModal.value = true
}

const uploadResource = () => {
  const resourceData = {
    name: uploadForm.value.name,
    type: uploadForm.value.file ? detectFileType(uploadForm.value.file.name) : 'document',
    sessionId: uploadForm.value.sessionId || null,
    size: uploadForm.value.file ? uploadForm.value.file.size : 0,
    description: uploadForm.value.description,
    tags: uploadForm.value.tags.split(',').map(t => t.trim()).filter(t => t),
    uploadedBy: 'Admin'
  }
  
  adminStore.uploadResource(resourceData)
  
  // Reset form
  uploadForm.value = {
    name: '',
    description: '',
    sessionId: '',
    tags: '',
    file: null
  }
  
  showUploadModal.value = false
}

const detectFileType = (filename) => {
  const extension = filename.split('.').pop().toLowerCase()
  
  if (['pdf'].includes(extension)) return 'pdf'
  if (['mp4', 'avi', 'mov'].includes(extension)) return 'video'
  if (['mp3', 'wav', 'ogg'].includes(extension)) return 'audio'
  if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'image'
  if (['ppt', 'pptx'].includes(extension)) return 'presentation'
  
  return 'document'
}

const editResource = (resource) => {
  editingResource.value = resource
  editForm.value = {
    name: resource.name,
    description: resource.description || '',
    sessionId: resource.sessionId || ''
  }
  editModal.value = true
}

const saveResource = () => {
  if (editingResource.value) {
    // Update resource in store
    const index = adminStore.resources.findIndex(r => r.id === editingResource.value.id)
    if (index !== -1) {
      adminStore.resources[index] = {
        ...adminStore.resources[index],
        ...editForm.value
      }
    }
  }
  editModal.value = false
}

const deleteResource = (resource) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer "${resource.name}" ?`)) {
    adminStore.deleteResource(resource.id)
  }
}

const downloadResource = (resource) => {
  // Increment download counter
  resource.downloads++
  
  // In a real app, this would trigger a download
  console.log('Downloading resource:', resource)
  alert(`Téléchargement de "${resource.name}" simulé!`)
}

const previewResource = (resource) => {
  previewResourceData.value = resource
  previewModal.value = true
}
</script>

<style scoped>
/* Drag and drop styles */
.border-dashed:hover {
  background-color: rgba(59, 130, 246, 0.05);
}
</style> 