<template>
  <div class="space-y-6">
    <!-- Upload Section -->
    <ResourceUploadZone 
      @show-upload-modal="showUploadModal = true"
      @file-dropped="handleFileDrop"
    />

    <!-- Filters -->
    <ResourceFilters 
      :filters="resourceFilter"
      :sessions="adminStore.sessions"
      @update:type="resourceFilter.type = $event"
      @update:session="resourceFilter.session = $event"
      @update:search="resourceFilter.search = $event"
      @export-data="adminStore.exportData('resources')"
    />

    <!-- Statistics -->
    <ResourceStatistics 
      :total-resources="adminStore.resources.length"
      :total-size="formatTotalSize()"
      :total-downloads="totalDownloads"
      :recent-count="recentResourcesCount"
    />

    <!-- View Toggle -->
    <div class="bg-white rounded-xl shadow-sm p-4">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold">Ressources ({{ filteredResources.length }})</h3>
        <div class="flex space-x-2">
          <button 
            @click="viewMode = 'grid'"
            :class="[
              'px-3 py-2 rounded-lg',
              viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
            ]"
          >
            🔲 Grille
          </button>
          <button 
            @click="viewMode = 'list'"
            :class="[
              'px-3 py-2 rounded-lg',
              viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
            ]"
          >
            📋 Liste
          </button>
        </div>
      </div>
    </div>

    <!-- Resources Display -->
    <ResourcesGrid 
      v-if="viewMode === 'grid'"
      :resources="filteredResources"
      :sessions="adminStore.sessions"
      @preview="previewResource"
      @edit="editResource"
      @download="downloadResource"
      @delete="deleteResource"
    />

    <ResourcesList 
      v-else
      :resources="filteredResources"
      :sessions="adminStore.sessions"
      @preview="previewResource"
      @edit="editResource"
      @download="downloadResource"
      @delete="deleteResource"
    />

    <!-- Modals -->
    <ResourceUploadModal 
      :show="showUploadModal"
      :sessions="adminStore.sessions"
      :initial-data="uploadFormData"
      @close="closeUploadModal"
      @upload="uploadResource"
    />

    <ResourceEditModal 
      :show="editModal"
      :resource="editingResource"
      :sessions="adminStore.sessions"
      @close="editModal = false"
      @save="saveResource"
    />

    <ResourcePreviewModal 
      :show="previewModal"
      :resource="previewResourceData"
      @close="previewModal = false"
      @download="downloadResource"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAdminStore } from '@/stores/admin'
import ResourceUploadZone from './resources/ResourceUploadZone.vue'
import ResourceFilters from './resources/ResourceFilters.vue'
import ResourceStatistics from './resources/ResourceStatistics.vue'
import ResourcesGrid from './resources/ResourcesGrid.vue'
import ResourcesList from './resources/ResourcesList.vue'
import ResourceUploadModal from './resources/ResourceUploadModal.vue'
import ResourceEditModal from './resources/ResourceEditModal.vue'
import ResourcePreviewModal from './resources/ResourcePreviewModal.vue'

const adminStore = useAdminStore()

// État local
const viewMode = ref('grid')
const showUploadModal = ref(false)
const editModal = ref(false)
const previewModal = ref(false)
const editingResource = ref(null)
const previewResourceData = ref(null)
const uploadFormData = ref({})

const resourceFilter = ref({
  type: '',
  session: '',
  search: ''
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
const formatTotalSize = () => {
  const totalBytes = adminStore.resources.reduce((sum, r) => sum + (r.size || 0), 0)
  if (totalBytes < 1024 * 1024) return (totalBytes / 1024).toFixed(1) + ' KB'
  if (totalBytes < 1024 * 1024 * 1024) return (totalBytes / (1024 * 1024)).toFixed(1) + ' MB'
  return (totalBytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
}

const handleFileDrop = (file) => {
  uploadFormData.value = {
    name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
    file: file
  }
  showUploadModal.value = true
}

const closeUploadModal = () => {
  showUploadModal.value = false
  uploadFormData.value = {}
}

const uploadResource = (formData) => {
  const resourceData = {
    name: formData.name,
    type: detectFileType(formData.file ? formData.file.name : ''),
    sessionId: formData.sessionId || null,
    size: formData.file ? formData.file.size : 0,
    description: formData.description,
    tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
    uploadedBy: 'Admin'
  }
  
  adminStore.uploadResource(resourceData)
  closeUploadModal()
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
  editModal.value = true
}

const saveResource = (formData) => {
  if (editingResource.value) {
    const index = adminStore.resources.findIndex(r => r.id === editingResource.value.id)
    if (index !== -1) {
      adminStore.resources[index] = {
        ...adminStore.resources[index],
        ...formData
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